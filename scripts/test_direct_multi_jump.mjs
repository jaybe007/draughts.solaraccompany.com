import cp from 'child_process';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\ayoad\\.gemini\\antigravity-ide\\brain\\bbe56566-9975-47e9-bb50-4683acd8b47c\\scratch\\puzzle_test_profile2';

const chromeProc = cp.spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9225',
  `--user-data-dir=${userDataDir}`,
  'http://127.0.0.1:8000/puzzles.php'
]);

async function run() {
  await new Promise(r => setTimeout(r, 2000));
  const res = await fetch('http://127.0.0.1:9225/json');
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
  await send('Console.enable');

  // Step 0: Click White 33-28
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const trainer = window.puzzleTrainer;
        trainer.handleSquareClick(6, 5); // 33
        trainer.handleSquareClick(5, 4); // 28
      })()
    `
  });

  // Wait 1.5s for opponent response (23x32 and 32x43)
  await new Promise(r => setTimeout(r, 1500));

  // Step 3: Click White 44-40
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const trainer = window.puzzleTrainer;
        trainer.handleSquareClick(8, 7); // 44
        trainer.handleSquareClick(7, 8); // 40
      })()
    `
  });

  // Wait 1.5s for opponent response (35x44 and 44x33)
  await new Promise(r => setTimeout(r, 1500));

  // Now White has a 4-hop multi-jump from 48 {r: 9, c: 4} ending at 8 {r: 1, c: 4}!
  // Let's test DIRECT CLICK from 48 {r: 9, c: 4} directly to 8 {r: 1, c: 4}!
  console.log('Testing DIRECT MULTI-JUMP CLICK from square 48 directly to 8...');
  const directJumpRes = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const trainer = window.puzzleTrainer;
        console.log('Before direct jump stepIdx:', trainer.currentStepIdx);
        trainer.handleSquareClick(9, 4); // 48
        const validMoves = trainer.validMoves;
        console.log('Valid moves from 48:', JSON.stringify(validMoves));
        trainer.handleSquareClick(1, 4); // 8
        return {
          validMoves,
          isOpponentMoving: trainer.isOpponentMoving
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Direct Jump clicked:', directJumpRes.result?.value);

  // Wait 2.5s for automated multi-hop sequence animation (4 hops * 220ms + opponent response)
  await new Promise(r => setTimeout(r, 2500));

  const stateAfterDirect = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const trainer = window.puzzleTrainer;
        return {
          currentStepIdx: trainer.currentStepIdx,
          isOpponentMoving: trainer.isOpponentMoving,
          feedbackTitle: document.getElementById('feedback-title')?.textContent
        };
      })()
    `,
    returnByValue: true
  });
  console.log('State after Direct Multi-Jump sequence:', stateAfterDirect.result?.value);

  ws.close();
  chromeProc.kill();
}

run().catch(err => {
  console.error('Test error:', err);
  chromeProc.kill();
});
