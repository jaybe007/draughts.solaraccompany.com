import { spawn } from 'child_process';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function testInteractivity() {
  const port = 9338;
  const userDataDir = `C:\\Users\\ayoad\\.gemini\\antigravity-ide\\brain\\c3632920-1501-4133-ba5e-bb69c3cbf08b\\scratch\\edge_inter_${Date.now()}`;
  
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
    ws.send(JSON.stringify({ id: id++, method: 'Page.navigate', params: { url: 'http://127.0.0.1:8000/game.php' } }));
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

  console.log('--- Test 1: Initial Game State ---');
  const initial = await evalExpr(`(() => {
    const b = document.getElementById('draughts-board');
    return {
      squares: b ? b.querySelectorAll('.square').length : 0,
      pieces: b ? b.querySelectorAll('.piece').length : 0
    };
  })()`);
  console.log('Initial Board:', initial);

  console.log('--- Test 2: Switch to International Ruleset ---');
  const switchIntl = await evalExpr(`(() => {
    const radio = document.querySelector('input[value="international"]');
    if (radio) {
      radio.checked = true;
      radio.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }
    return false;
  })()`);
  console.log('Switched to Intl:', switchIntl);
  await new Promise(r => setTimeout(r, 1000));

  const afterIntl = await evalExpr(`(() => {
    const b = document.getElementById('draughts-board');
    return {
      squares: b ? b.querySelectorAll('.square').length : 0,
      pieces: b ? b.querySelectorAll('.piece').length : 0
    };
  })()`);
  console.log('After Switch to Intl:', afterIntl);

  console.log('--- Test 3: Switch to Ghana Ruleset ---');
  const switchGha = await evalExpr(`(() => {
    const radio = document.querySelector('input[value="ghana"]');
    if (radio) {
      radio.checked = true;
      radio.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }
    return false;
  })()`);
  console.log('Switched to Ghana:', switchGha);
  await new Promise(r => setTimeout(r, 1000));

  const afterGha = await evalExpr(`(() => {
    const b = document.getElementById('draughts-board');
    return {
      squares: b ? b.querySelectorAll('.square').length : 0,
      pieces: b ? b.querySelectorAll('.piece').length : 0
    };
  })()`);
  console.log('After Switch to Ghana:', afterGha);

  console.log('--- Test 4: Make a Move ---');
  const moveRes = await evalExpr(`(() => {
    // Find a player piece that has legal moves
    const p1Pieces = document.querySelectorAll('#draughts-board .piece.p1');
    for (const piece of p1Pieces) {
      piece.parentElement.click();
      const validTargets = document.querySelectorAll('#draughts-board .square.valid-target, #draughts-board .square.valid-capture-target');
      if (validTargets.length > 0) {
        validTargets[0].click();
        return { moved: true, target: validTargets[0].id };
      }
    }
    return { moved: false };
  })()`);
  console.log('Move Attempt:', moveRes);
  await new Promise(r => setTimeout(r, 1500));

  const afterMove = await evalExpr(`(() => {
    const b = document.getElementById('draughts-board');
    return {
      squares: b ? b.querySelectorAll('.square').length : 0,
      pieces: b ? b.querySelectorAll('.piece').length : 0,
      moves: document.querySelectorAll('#move-history-list .history-entry').length
    };
  })()`);
  console.log('After Move:', afterMove);

  console.log('Errors caught during interactivity:', errors.length);
  if (errors.length > 0) {
    console.log(errors);
  }

  ws.close();
  browserProc.kill();
}

testInteractivity().catch(console.error);
