import { spawn } from 'child_process';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function elementAtPoint() {
  const port = 9346;
  const userDataDir = `C:\\Users\\ayoad\\.gemini\\antigravity-ide\\brain\\986c3d57-38e8-4d61-9afb-d6a8faf30da7\\scratch\\edge_point_${Date.now()}`;

  const p = spawn(edgePath, [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--headless=new',
    '--window-size=1280,950',
    '--disable-extensions',
    'about:blank'
  ]);

  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (res.ok) break;
    } catch {}
  }

  const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const pageTarget = list.find(t => t.type === 'page') || list[0];
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  let id = 1;

  function sendCmd(method, params = {}) {
    return new Promise((resolve) => {
      const msgId = id++;
      const handler = (msg) => {
        const data = JSON.parse(msg.data.toString());
        if (data.id === msgId) {
          ws.removeEventListener('message', handler);
          resolve(data.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  ws.onopen = async () => {
    await sendCmd('Page.enable');
    await sendCmd('Runtime.enable');
    await sendCmd('Page.navigate', { url: 'http://127.0.0.1:8000/game.php' });
    await new Promise(r => setTimeout(r, 4000));

    const res = await sendCmd('Runtime.evaluate', {
      expression: `(async () => {
        const board = document.getElementById('draughts-board');
        const rect = board.getBoundingClientRect();
        const midX = rect.left + rect.width / 2;
        const midY = rect.top + rect.height / 2;
        const el = document.elementFromPoint(midX, midY);

        // Also check sq-0-0 and sq-5-5
        const sq55 = document.getElementById('sq-5-5');
        const sq55Rect = sq55?.getBoundingClientRect();
        const elAtSq55 = sq55Rect ? document.elementFromPoint(sq55Rect.left + 5, sq55Rect.top + 5) : null;

        // Check if image is loaded by testing Image object in page
        const imgResult = await new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve({ loaded: true, w: img.naturalWidth, h: img.naturalHeight });
          img.onerror = (e) => resolve({ loaded: false, error: 'img onerror fired' });
          img.src = window.getComputedStyle(board).backgroundImage.replace(/url\(['"]?([^'"]+)['"]?\)/, '$1');
        });

        return {
          boardRect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height },
          midPoint: { midX, midY },
          elAtMid: {
            tagName: el?.tagName,
            id: el?.id,
            className: el?.className
          },
          imgResult
        };
      })()`,
      awaitPromise: true,
      returnByValue: true
    });

    console.log(JSON.stringify(res.result.value, null, 2));
    p.kill();
    process.exit(0);
  };
}

elementAtPoint();
