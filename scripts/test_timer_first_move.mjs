import { spawn } from 'child_process';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function testTimerFirstMove() {
  const port = 9341;
  const userDataDir = `C:\\xampp\\htdocs\\nigerian-draughts\\scratch\\edge_timer_${Date.now()}`;

  const browserProc = spawn(edgePath, [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--headless=new',
    '--window-size=1280,900',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank'
  ]);

  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (res.ok) break;
    } catch {}
  }

  const targetsRes = await fetch(`http://127.0.0.1:${port}/json/list`);
  const targets = await targetsRes.json();
  const pageTarget = targets.find(t => t.type === 'page') || targets[0];

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  let id = 1;

  await new Promise(res => {
    ws.onopen = () => {
      ws.send(JSON.stringify({ id: id++, method: 'Runtime.enable' }));
      ws.send(JSON.stringify({ id: id++, method: 'Page.enable' }));
      ws.send(JSON.stringify({ id: id++, method: 'Page.navigate', params: { url: 'http://localhost/nigerian-draughts/game.php' } }));
      res();
    };
  });

  const errors = [];
  ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data.toString());
    if (data.method === 'Runtime.exceptionThrown') {
      errors.push(data.params.exceptionDetails);
    }
  };

  await new Promise(r => setTimeout(r, 3500));
  if (errors.length > 0) console.log('Exceptions on page:', JSON.stringify(errors, null, 2));

  async function evalExpr(expr) {
    const evalId = id++;
    return new Promise(res => {
      const handler = (msg) => {
        const data = JSON.parse(msg.data.toString());
        if (data.id === evalId) {
          ws.removeEventListener('message', handler);
          res(data.result?.result?.value);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({
        id: evalId,
        method: 'Runtime.evaluate',
        params: { expression: expr, returnByValue: true, awaitPromise: true }
      }));
    });
  }

  console.log('Testing Timer on Page Load & First Move...');
  const result = await evalExpr(`(async () => {
    for (let i = 0; i < 40; i++) {
      if (window.app && window.app.timer) break;
      await new Promise(r => setTimeout(r, 100));
    }
    const app = window.app;
    if (!app) return { error: 'No app' };

    const initialP1ClockDom = document.getElementById('p1-clock')?.textContent;
    const initialP2ClockDom = document.getElementById('p2-clock')?.textContent;
    const initialTimeLeftP1 = app.timer.timeLeft[1];
    const initialTimeLeftP2 = app.timer.timeLeft[2];
    const timeControl = app.timeControl;

    // Now play first seed move
    const legalMoves = app.engine.getAllLegalMoves(1);
    const firstMove = legalMoves[0];
    app.executePlayerMove(firstMove);

    // Wait 1.2s for clock tick
    await new Promise(r => setTimeout(r, 1200));

    const p1ClockAfterMove = document.getElementById('p1-clock')?.textContent;
    const p2ClockAfterMove = document.getElementById('p2-clock')?.textContent;
    const timeLeftP1AfterMove = app.timer.timeLeft[1];
    const isRunning = app.timer.isRunning;

    return {
      timeControl,
      initialP1ClockDom,
      initialP2ClockDom,
      initialTimeLeftP1,
      initialTimeLeftP2,
      isRunning,
      p1ClockAfterMove,
      p2ClockAfterMove,
      timeLeftP1AfterMove
    };
  })()`);

  console.log('Timer Diagnostic Result:');
  console.log(JSON.stringify(result, null, 2));

  // Test Case 2: When user chooses 5-minute preset in game setup
  const result5min = await evalExpr(`(async () => {
    const app = window.app;
    // Switch to 5-minute time control
    app.timeControl = '5';
    app.timer.setPreset('5', 0, 0);
    app.updatePlayerLabels();

    const p1Clock5 = document.getElementById('p1-clock')?.textContent;
    const timeLeft5 = app.timer.timeLeft[1];
    
    // Play move
    const legalMoves = app.engine.getAllLegalMoves(app.engine.currentTurn);
    if (legalMoves.length > 0) app.executePlayerMove(legalMoves[0]);
    await new Promise(r => setTimeout(r, 600));

    const p1ClockAfterMove5 = document.getElementById('p1-clock')?.textContent;
    return { p1Clock5, timeLeft5, p1ClockAfterMove5 };
  })()`);

  console.log('5-min Preset Test Result:');
  console.log(JSON.stringify(result5min, null, 2));

  try { browserProc.kill(); } catch {}

  const passed = (
    result.initialP1ClockDom === '10:00' &&
    result.initialTimeLeftP1 === 600 &&
    result.timeLeftP1AfterMove >= 598 &&
    result.timeLeftP1AfterMove <= 600 &&
    result5min.p1Clock5 === '05:00' &&
    result5min.timeLeft5 === 300
  );

  if (passed) {
    console.log('\n✓ SUCCESS: Both 10-minute default and custom presets stay synchronized before and after move!');
    process.exit(0);
  } else {
    console.error('\n✗ FAILED: Timer preset mismatch!');
    process.exit(1);
  }
}

testTimerFirstMove().catch(e => {
  console.error(e);
  process.exit(1);
});
