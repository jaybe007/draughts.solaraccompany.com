import { spawn } from 'child_process';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function inspectPiece() {
  const port = 9338;
  const userDataDir = `C:\\Users\\ayoad\\.gemini\\antigravity-ide\\brain\\986c3d57-38e8-4d61-9afb-d6a8faf30da7\\scratch\\edge_piece_${Date.now()}`;
  
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
          const sq = document.getElementById('sq-0-0');
          const piece = document.querySelector('.piece');
          const sqStyle = sq ? window.getComputedStyle(sq) : null;
          const pStyle = piece ? window.getComputedStyle(piece) : null;
          return JSON.stringify({
            sqClasses: sq ? sq.className : null,
            sqBgColor: sqStyle ? sqStyle.backgroundColor : null,
            sqBgImg: sqStyle ? sqStyle.backgroundImage : null,
            sqW: sqStyle ? sqStyle.width : null,
            sqH: sqStyle ? sqStyle.height : null,
            pieceClasses: piece ? piece.className : null,
            pieceBgImg: pStyle ? pStyle.backgroundImage : null,
            pieceW: pStyle ? pStyle.width : null,
            pieceH: pStyle ? pStyle.height : null,
            pieceDisplay: pStyle ? pStyle.display : null,
            pieceVisibility: pStyle ? pStyle.visibility : null,
            pieceOpacity: pStyle ? pStyle.opacity : null
          }, null, 2);
        })()`
      }
    }));
  });

  console.log("Piece Inspection:", evalRes);
  ws.close();
  browserProc.kill();
}

inspectPiece().catch(console.error);
