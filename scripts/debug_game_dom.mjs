import { spawn } from 'child_process';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function inspect() {
  const port = 9336;
  const userDataDir = `C:\\Users\\ayoad\\.gemini\\antigravity-ide\\brain\\986c3d57-38e8-4d61-9afb-d6a8faf30da7\\scratch\\edge_debug_${Date.now()}`;

  const browserProc = spawn(edgePath, [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--headless=new',
    '--window-size=1280,950',
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

  await new Promise((resolve) => {
    ws.onopen = async () => {
      const targetUrl = process.argv[2] || 'http://127.0.0.1:8000/game.php';
      await sendCmd('Page.enable');
      await sendCmd('Runtime.enable');
      await sendCmd('Page.navigate', { url: targetUrl });
      setTimeout(resolve, 3500);
    };
  });

  const evalRes = await sendCmd('Runtime.evaluate', {
    expression: `(async () => {
      const board = document.getElementById('draughts-board');
      const frame = document.querySelector('.board-wood-frame');
      const svg = document.getElementById('board-tactical-svg');
      const sqLight = document.querySelector('.square.light');
      const sqDark = document.querySelector('.square.dark');
      
      // Test if image actually loads in DOM
      const testImg = new Image();
      testImg.src = 'images/board/wood-1024_100.jpg';
      await new Promise(r => {
        testImg.onload = () => r({ ok: true, w: testImg.naturalWidth, h: testImg.naturalHeight });
        testImg.onerror = (e) => r({ error: true });
        setTimeout(() => r({ timeout: true }), 2000);
      });

      return {
        boardW: board?.offsetWidth,
        boardH: board?.offsetHeight,
        boardBg: board ? window.getComputedStyle(board).background : null,
        boardBgImg: board ? window.getComputedStyle(board).backgroundImage : null,
        frameBg: frame ? window.getComputedStyle(frame).background : null,
        sqLightBg: sqLight ? window.getComputedStyle(sqLight).background : null,
        sqLightBgColor: sqLight ? window.getComputedStyle(sqLight).backgroundColor : null,
        sqDarkBg: sqDark ? window.getComputedStyle(sqDark).background : null,
        sqDarkBgColor: sqDark ? window.getComputedStyle(sqDark).backgroundColor : null,
        testImgNaturalW: testImg.naturalWidth,
        testImgNaturalH: testImg.naturalHeight,
        testImgComplete: testImg.complete
      };
    })()`,
    awaitPromise: true,
    returnByValue: true
  });

  console.log(JSON.stringify(evalRes.result.value, null, 2));

  browserProc.kill();
  process.exit(0);
}

inspect();
