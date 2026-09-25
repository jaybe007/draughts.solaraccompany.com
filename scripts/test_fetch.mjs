import { spawn } from 'child_process';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function fetchInPage() {
  const port = 9347;
  const userDataDir = `C:\\Users\\ayoad\\.gemini\\antigravity-ide\\brain\\986c3d57-38e8-4d61-9afb-d6a8faf30da7\\scratch\\edge_fetch_${Date.now()}`;

  const p = spawn(edgePath, [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--headless=new',
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
    await new Promise(r => setTimeout(r, 2500));

    const res = await sendCmd('Runtime.evaluate', {
      expression: `(async () => {
        try {
          const r1 = await fetch('http://127.0.0.1:8000/images/board/wood-1024_100.jpg');
          const r2 = await fetch('http://127.0.0.1:8000/images/board/wood-1024_100_mirrored.jpg');
          return {
            wood1: { status: r1.status, type: r1.headers.get('content-type'), len: (await r1.blob()).size },
            woodMirrored: { status: r2.status, type: r2.headers.get('content-type'), len: (await r2.blob()).size }
          };
        } catch(e) {
          return { error: String(e) };
        }
      })()`,
      awaitPromise: true,
      returnByValue: true
    });

    console.log(JSON.stringify(res.result.value, null, 2));
    p.kill();
    process.exit(0);
  };
}

fetchInPage();
