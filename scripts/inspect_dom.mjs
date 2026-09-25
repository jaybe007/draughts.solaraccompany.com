import { spawn } from 'child_process';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function inspectDOM() {
  const port = 9337;
  const userDataDir = `C:\\Users\\ayoad\\.gemini\\antigravity-ide\\brain\\986c3d57-38e8-4d61-9afb-d6a8faf30da7\\scratch\\edge_inspect_${Date.now()}`;
  
  const browserProc = spawn(edgePath, [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--headless=new',
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

  await new Promise((resolve) => {
    ws.onopen = () => {
      ws.send(JSON.stringify({ id: id++, method: 'Page.enable' }));
      ws.send(JSON.stringify({ id: id++, method: 'Runtime.enable' }));
      ws.send(JSON.stringify({ id: id++, method: 'Page.navigate', params: { url: 'http://127.0.0.1:8000/game.php' } }));
    };
    setTimeout(resolve, 3000);
  });

  const evalRes = await new Promise((resolve) => {
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
          const board = document.getElementById('draughts-board');
          const frame = document.getElementById('board-wood-frame');
          const squares = board ? board.querySelectorAll('.square').length : 0;
          const pieces = board ? board.querySelectorAll('.piece').length : 0;
          const style = board ? window.getComputedStyle(board) : null;
          return JSON.stringify({
            squares,
            pieces,
            bgImg: style ? style.backgroundImage : null,
            frameBg: frame ? window.getComputedStyle(frame).background : null,
            boardDisplay: style ? style.display : null,
            boardW: style ? style.width : null,
            boardH: style ? style.height : null,
            classes: board ? board.className : null
          }, null, 2);
        })()`
      }
    }));
  });

  console.log("DOM Inspection:", evalRes);
  ws.close();
  browserProc.kill();
}

inspectDOM().catch(console.error);
