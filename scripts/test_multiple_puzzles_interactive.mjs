import cp from 'child_process';
import { TRAP_DATABASE } from '../js/traps.js';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\ayoad\\.gemini\\antigravity-ide\\brain\\bbe56566-9975-47e9-bb50-4683acd8b47c\\scratch\\puzzle_test_profile3';

const chromeProc = cp.spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9226',
  `--user-data-dir=${userDataDir}`,
  'http://127.0.0.1:8000/puzzles.php'
]);

async function run() {
  await new Promise(r => setTimeout(r, 2000));
  const res = await fetch('http://127.0.0.1:9226/json');
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

  await send('Runtime.enable');

  // Test 5 diverse puzzles across collections
  const sampleIndices = [
    0,   // IMG-1
    4,   // IMG-5
    10,  // IMG-11
    25,  // Nigerian Highway
    120  // Pre-move Blunder Ambush
  ];

  for (const pIdx of sampleIndices) {
    const p = TRAP_DATABASE[pIdx];
    console.log(`\n========================================`);
    console.log(`TESTING PUZZLE #${pIdx + 1} (${p.id}): ${p.title}`);

    // Load puzzle into trainer
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const trainer = window.puzzleTrainer;
          trainer.loadPuzzle(${pIdx});
        })()
      `
    });

    // If puzzle has initialMove, wait for initial move animation to complete
    if (p.initialMove) {
      await new Promise(r => setTimeout(r, 800));
    } else {
      await new Promise(r => setTimeout(r, 200));
    }

    // Play through player steps
    let maxRounds = 40;
    let isSolved = false;

    while (maxRounds-- > 0) {
      await new Promise(r => setTimeout(r, 350));

      const status = await send('Runtime.evaluate', {
        expression: `
          (() => {
            const trainer = window.puzzleTrainer;
            const puzzle = trainer.puzzles[trainer.currentPuzzleIdx];
            if (trainer.solvedSet.has(puzzle.id) || trainer.currentStepIdx >= puzzle.steps.length) {
              return { isSolved: true, currentStepIdx: trainer.currentStepIdx };
            }
            if (trainer.isOpponentMoving) {
              return { isWaitingOpponent: true, currentStepIdx: trainer.currentStepIdx };
            }
            const nextStep = puzzle.steps[trainer.currentStepIdx];
            if (nextStep && nextStep.mover === 1) {
              trainer.handleSquareClick(nextStep.from.r, nextStep.from.c);
              trainer.handleSquareClick(nextStep.to.r, nextStep.to.c);
              return { playedStep: trainer.currentStepIdx, from: nextStep.from, to: nextStep.to };
            }
            return { waiting: true, currentStepIdx: trainer.currentStepIdx, nextStep };
          })()
        `,
        returnByValue: true
      });

      if (status.result?.value?.isSolved) {
        isSolved = true;
        console.log(`✓ Puzzle #${pIdx + 1} successfully solved in browser!`);
        break;
      }
    }

    if (!isSolved) {
      const dbg = await send('Runtime.evaluate', {
        expression: `
          (() => {
            const trainer = window.puzzleTrainer;
            const puzzle = trainer.puzzles[trainer.currentPuzzleIdx];
            return {
              stepIdx: trainer.currentStepIdx,
              totalSteps: puzzle.steps.length,
              nextExpected: puzzle.steps[trainer.currentStepIdx],
              feedback: document.getElementById('feedback-title')?.textContent,
              isOpponentMoving: trainer.isOpponentMoving
            };
          })()
        `,
        returnByValue: true
      });
      console.error(`FAILED to solve Puzzle #${pIdx + 1}:`, dbg.result?.value);
      throw new Error(`Puzzle #${pIdx + 1} failed`);
    }
  }

  console.log('\n🎉 ALL 5 DIVERSE PUZZLE SAMPLES SOLVED FLAWLESSLY IN BROWSER!');
  ws.close();
  chromeProc.kill();
}

run().catch(err => {
  console.error('Test run error:', err);
  chromeProc.kill();
  process.exit(1);
});
