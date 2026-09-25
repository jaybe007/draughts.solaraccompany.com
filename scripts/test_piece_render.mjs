import { spawn } from 'child_process';
import fs from 'fs';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function testPieceRender() {
  const port = 9346;
  const userDataDir = `C:\\Users\\ayoad\\.gemini\\antigravity-ide\\brain\\986c3d57-38e8-4d61-9afb-d6a8faf30da7\\scratch\\edge_t_${Date.now()}`;
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

  // Evaluate and draw piece to canvas to see what happens
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
        returnByValue: true,
        expression: `(() => {
          const piece = document.querySelector('.piece.p1');
          if (!piece) return 'no piece.p1 found';
          const style = window.getComputedStyle(piece);
          const sq = piece.parentElement;
          const sqStyle = window.getComputedStyle(sq);
          return {
            pieceHTML: piece.outerHTML,
            pieceStyle: {
              width: style.width,
              height: style.height,
              backgroundImage: style.backgroundImage,
              backgroundSize: style.backgroundSize,
              backgroundRepeat: style.backgroundRepeat,
              display: style.display,
              position: style.position,
              zIndex: style.zIndex,
              opacity: style.opacity,
              visibility: style.visibility,
              filter: style.filter,
              transform: style.transform
            },
            sqStyle: {
              width: sqStyle.width,
              height: sqStyle.height,
              display: sqStyle.display,
              overflow: sqStyle.overflow
            }
          };
        })()`
      }
    }));
  });

  console.log("Piece test:", JSON.stringify(res, null, 2));

  // Now take screenshot of the piece rect
  const pieceRect = await new Promise((resolve) => {
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
        returnByValue: true,
        expression: `(() => {
          const piece = document.querySelector('.piece.p1');
          if (!piece) return null;
          const r = piece.getBoundingClientRect();
          return { x: r.x, y: r.y, width: r.width, height: r.height, scale: 1 };
        })()`
      }
    }));
  });

  console.log("Piece rect:", pieceRect);

  if (pieceRect && pieceRect.width > 0) {
    const snap = await new Promise((resolve) => {
      const snapId = id++;
      const handler = (msg) => {
        const data = JSON.parse(msg.data.toString());
        if (data.id === snapId) {
          ws.removeEventListener('message', handler);
          resolve(data.result?.data);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({
        id: snapId,
        method: 'Page.captureScreenshot',
        params: { format: 'png', clip: pieceRect }
      }));
    });

    if (snap) {
      fs.writeFileSync('C:\\Users\\ayoad\\.gemini\\antigravity-ide\\brain\\986c3d57-38e8-4d61-9afb-d6a8faf30da7\\single_piece_snap.png', Buffer.from(snap, 'base64'));
      console.log("Saved single_piece_snap.png");
    }
  }

  ws.close();
  browserProc.kill();
}

testPieceRender().catch(console.error);
