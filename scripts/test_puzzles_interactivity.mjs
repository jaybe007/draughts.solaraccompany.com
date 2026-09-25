import { spawn } from 'child_process';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function testPuzzlesInteractivity() {
  const port = 9340;
  const userDataDir = `C:\\Users\\ayoad\\.gemini\\antigravity-ide\\brain\\797a5afa-a238-4cc1-b9c2-5d45b754c2eb\\scratch\\edge_puz_inter2_${Date.now()}`;
  
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

  const errors = [];
  ws.onopen = () => {
    ws.send(JSON.stringify({ id: id++, method: 'Runtime.enable' }));
    ws.send(JSON.stringify({ id: id++, method: 'Page.enable' }));
    ws.send(JSON.stringify({ id: id++, method: 'Page.navigate', params: { url: 'http://127.0.0.1:8000/puzzles.php' } }));
  };

  ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data.toString());
    if (data.method === 'Runtime.exceptionThrown') {
      errors.push(data.params.exceptionDetails);
    }
  };

  await new Promise(r => setTimeout(r, 2500));

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
        params: { expression: expr, returnByValue: true }
      }));
    });
  }

  console.log('--- Test 1: Click btn-puzzle-next ---');
  const nextClicked = await evalExpr(`(() => {
    const btn = document.getElementById('btn-puzzle-next');
    if (btn) { btn.click(); return true; }
    return false;
  })()`);
  console.log('Next clicked:', nextClicked);
  await new Promise(r => setTimeout(r, 800));

  const afterNext = await evalExpr(`(() => {
    const b = document.getElementById('draughts-board');
    return {
      squares: b ? b.querySelectorAll('.square').length : 0,
      pieces: b ? b.querySelectorAll('.piece').length : 0,
      title: document.getElementById('puzzle-title')?.textContent
    };
  })()`);
  console.log('After Next:', afterNext);

  console.log('--- Test 2: Click btn-puzzle-hint ---');
  const hintClicked = await evalExpr(`(() => {
    const btn = document.getElementById('btn-puzzle-hint');
    if (btn) { btn.click(); return true; }
    return false;
  })()`);
  console.log('Hint clicked:', hintClicked);
  await new Promise(r => setTimeout(r, 800));

  const afterHint = await evalExpr(`(() => {
    return {
      pulseCount: document.querySelectorAll('.pulse-hint, .hint-pulse, .hint-target').length,
      coachQuote: document.getElementById('coach-quote')?.textContent
    };
  })()`);
  console.log('After Hint:', afterHint);

  console.log('--- Test 3: Click Ruleset Filter Pill (Nigeria) ---');
  const ngaClicked = await evalExpr(`(() => {
    const pill = document.querySelector('button.filter-pill[data-ruleset="nigeria"]');
    if (pill) { pill.click(); return true; }
    return false;
  })()`);
  console.log('Nga pill clicked:', ngaClicked);
  await new Promise(r => setTimeout(r, 800));

  const afterNga = await evalExpr(`(() => {
    const b = document.getElementById('draughts-board');
    return {
      squares: b ? b.querySelectorAll('.square').length : 0,
      pieces: b ? b.querySelectorAll('.piece').length : 0,
      title: document.getElementById('puzzle-title')?.textContent,
      variant: document.getElementById('puzzle-variant-badge')?.textContent
    };
  })()`);
  console.log('After Nga Pill:', afterNga);

  console.log('Errors caught:', errors.length);
  if (errors.length > 0) console.log(errors);

  ws.close();
  browserProc.kill();
}

testPuzzlesInteractivity().catch(console.error);
