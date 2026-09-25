import { spawn } from 'child_process';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function checkSqRects() {
  const port = 9343;
  const userDataDir = `C:\\Users\\ayoad\\.gemini\\antigravity-ide\\brain\\986c3d57-38e8-4d61-9afb-d6a8faf30da7\\scratch\\edge_sq_${Date.now()}`;
  const browserProc = spawn(edgePath, [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--headless=new',
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

  await new Promise((resolve) => {
    ws.onopen = () => {
      ws.send(JSON.stringify({ id: id++, method: 'Page.enable' }));
      ws.send(JSON.stringify({ id: id++, method: 'Runtime.enable' }));
      ws.send(JSON.stringify({ id: id++, method: 'Page.navigate', params: { url: 'http://127.0.0.1:8000/game.php' } }));
    };
    setTimeout(resolve, 3000);
  });

  const res = await new Promise((resolve) => {
    const evalId = id++;
    const handler = (msg) => {
      const data = JSON.parse(msg.data.toString());
      if (data.id === evalId) {
        ws.removeEventListener('message', handler);
        resolve(data.result?.result?.value);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({
      id: evalId,
      method: 'Runtime.evaluate',
      params: {
        expression: `(() => {
          const s0 = document.getElementById('sq-0-0');
          const s9 = document.getElementById('sq-9-0');
          const pWhite = document.querySelector('.piece.p1');
          return JSON.stringify({
            s0Rect: s0 ? s0.getBoundingClientRect() : null,
            s9Rect: s9 ? s9.getBoundingClientRect() : null,
            pWhiteRect: pWhite ? pWhite.getBoundingClientRect() : null,
            pWhiteClass: pWhite ? pWhite.className : null,
            pWhiteStyle: pWhite ? {
              display: window.getComputedStyle(pWhite).display,
              visibility: window.getComputedStyle(pWhite).visibility,
              bgImg: window.getComputedStyle(pWhite).backgroundImage,
              w: window.getComputedStyle(pWhite).width,
              h: window.getComputedStyle(pWhite).height
            } : null
          }, null, 2);
        })()`
      }
    }));
  });

  console.log("Squares & Pieces:", res);
  ws.close();
  browserProc.kill();
}

checkSqRects().catch(console.error);
