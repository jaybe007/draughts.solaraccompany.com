import cp from 'child_process';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\ayoad\\.gemini\\antigravity-ide\\brain\\bbe56566-9975-47e9-bb50-4683acd8b47c\\scratch\\puzzle_test_profile';

const chromeProc = cp.spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9224',
  `--user-data-dir=${userDataDir}`,
  'http://127.0.0.1:8000/puzzles.php'
]);

async function run() {
  await new Promise(r => setTimeout(r, 2000));
  const res = await fetch('http://127.0.0.1:9224/json');
  const tabs = await res.json();
  const pageTab = tabs.find(t => t.url.includes('puzzles.php'));
  if (!pageTab) {
    console.error('No page tab found!');
    chromeProc.kill();
    return;
  }

  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);

  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = Math.floor(Math.random() * 100000);
    const handler = (evt) => {
      const msg = JSON.parse(evt.data.toString());
      if (msg.id === id) {
        ws.removeEventListener('message', handler);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });

  await new Promise(r => ws.addEventListener('open', r));
  console.log('Connected to Chrome DevTools Protocol!');

  ws.addEventListener('message', (evt) => {
    const msg = JSON.parse(evt.data.toString());
    if (msg.method === 'Runtime.consoleAPICalled') {
      const args = msg.params.args.map(a => a.value || a.description || JSON.stringify(a)).join(' ');
      console.log(`[Browser Console ${msg.params.type}]: ${args}`);
    } else if (msg.method === 'Runtime.exceptionThrown') {
      console.error('[Browser Exception]:', msg.params.exceptionDetails);
    }
  });

  await send('Runtime.enable');
  await send('Console.enable');

  // Evaluate puzzle state
  const evalState = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const trainer = window.puzzleTrainer || (window.app && window.app.puzzleTrainer);
        const puzzle = trainer ? trainer.puzzles[trainer.currentPuzzleIdx] : null;
        return {
          hasTrainer: Boolean(trainer),
          puzzleId: puzzle ? puzzle.id : null,
          title: puzzle ? puzzle.title : null,
          currentStepIdx: trainer ? trainer.currentStepIdx : null,
          stepsCount: puzzle && puzzle.steps ? puzzle.steps.length : null,
          selectedSquare: trainer ? trainer.selectedSquare : null,
          isOpponentMoving: trainer ? trainer.isOpponentMoving : null,
          feedbackTitle: document.getElementById('feedback-title')?.textContent,
          turnPrompt: document.getElementById('puzzle-turn-prompt')?.textContent
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Initial Puzzle State:', evalState.result?.value);

  // Now simulate user making the first move of the puzzle!
  const step0Result = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const trainer = window.puzzleTrainer;
        if (!trainer) return { error: 'No trainer' };
        const puzzle = trainer.puzzles[trainer.currentPuzzleIdx];
        const step0 = puzzle.steps[0];
        console.log('Step 0:', JSON.stringify(step0));
        
        // Click from square
        trainer.handleSquareClick(step0.from.r, step0.from.c);
        const selected = trainer.selectedSquare;
        const validMoves = trainer.calculatePossibleMovesForPiece(step0.from.r, step0.from.c);
        
        // Click to square
        trainer.handleSquareClick(step0.to.r, step0.to.c);
        
        return {
          step0,
          selected,
          validMoves,
          newStepIdx: trainer.currentStepIdx,
          isOpponentMoving: trainer.isOpponentMoving,
          feedbackTitle: document.getElementById('feedback-title')?.textContent
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Result after Step 0 click:', step0Result.result?.value);

  // Wait 1 second for animations and opponent move to process
  await new Promise(r => setTimeout(r, 1200));

  const stateAfterOpponent = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const trainer = window.puzzleTrainer;
        const puzzle = trainer.puzzles[trainer.currentPuzzleIdx];
        return {
          currentStepIdx: trainer.currentStepIdx,
          nextExpectedStep: puzzle.steps[trainer.currentStepIdx],
          isOpponentMoving: trainer.isOpponentMoving,
          feedbackTitle: document.getElementById('feedback-title')?.textContent,
          turnPrompt: document.getElementById('puzzle-turn-prompt')?.textContent,
          turnTagline: document.getElementById('puzzle-turn-tagline')?.textContent
        };
      })()
    `,
    returnByValue: true
  });
  console.log('State after opponent response:', stateAfterOpponent.result?.value);

  // Automate full puzzle play through all steps!
  let maxRounds = 30;
  while (maxRounds-- > 0) {
    await new Promise(r => setTimeout(r, 600));

    const roundStatus = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const trainer = window.puzzleTrainer;
          const puzzle = trainer.puzzles[trainer.currentPuzzleIdx];
          const isSolved = trainer.solvedSet.has(puzzle.id);
          const currentStepIdx = trainer.currentStepIdx;
          const totalSteps = puzzle.steps.length;

          if (isSolved || currentStepIdx >= totalSteps) {
            return { isDone: true, isSolved: true, currentStepIdx, totalSteps };
          }

          if (trainer.isOpponentMoving) {
            return { isWaitingOpponent: true, currentStepIdx };
          }

          const nextStep = puzzle.steps[currentStepIdx];
          if (nextStep && nextStep.mover === 1) {
            console.log(\`Playing Step \${currentStepIdx}: \${nextStep.note || (nextStep.fromSq + '-' + nextStep.toSq)}\`);
            trainer.handleSquareClick(nextStep.from.r, nextStep.from.c);
            trainer.handleSquareClick(nextStep.to.r, nextStep.to.c);
            return {
              playedStep: currentStepIdx,
              from: nextStep.from,
              to: nextStep.to,
              note: nextStep.note
            };
          }

          return { otherState: true, currentStepIdx, nextStep };
        })()
      `,
      returnByValue: true
    });

    console.log('Round status:', roundStatus.result?.value);
    if (roundStatus.result?.value?.isDone) {
      console.log('🎉 PUZZLE SUCCESSFULLY SOLVED IN BROWSER!');
      break;
    }
  }

  // Get final puzzle state
  const finalState = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const trainer = window.puzzleTrainer;
        const puzzle = trainer.puzzles[trainer.currentPuzzleIdx];
        return {
          isSolved: trainer.solvedSet.has(puzzle.id),
          currentStepIdx: trainer.currentStepIdx,
          totalSteps: puzzle.steps.length,
          feedbackTitle: document.getElementById('feedback-title')?.textContent,
          feedbackDesc: document.getElementById('feedback-desc')?.textContent,
          evalScore: document.getElementById('eval-score')?.textContent
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Final Puzzle State:', finalState.result?.value);

  ws.close();
  chromeProc.kill();
}

run().catch(err => {
  console.error('Test run error:', err);
  chromeProc.kill();
});
