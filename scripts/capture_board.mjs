import { spawn } from 'child_process';
import fs from 'fs';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function captureBoard() {
  const port = 9341;
  const userDataDir = `C:\\Users\\ayoad\\.gemini\\antigravity-ide\\brain\\986c3d57-38e8-4d61-9afb-d6a8faf30da7\\scratch\\edge_board_${Date.now()}`;
  
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
      ws.send(JSON.stringify({ id: id++, method: 'DOM.enable' }));
      ws.send(JSON.stringify({ id: id++, method: 'Page.navigate', params: { url: 'http://127.0.0.1:8000/game.php' } }));
    };
    setTimeout(resolve, 3500);
  });

  // Get clip rect for draughts-board
  const rect = await new Promise((resolve) => {
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
          const b = document.getElementById('draughts-board');
          const r = b.getBoundingClientRect();
          return { x: r.x, y: r.y, width: r.width, height: r.height, scale: 1 };
        })()`
      }
    }));
  });

  console.log("Board clip rect:", rect);

  const screenshotBase64 = await new Promise((resolve) => {
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
      params: {
        format: 'png',
        clip: rect
      }
    }));
  });

  ws.close();
  browserProc.kill();

  if (screenshotBase64) {
    fs.writeFileSync('C:\\Users\\ayoad\\.gemini\\antigravity-ide\\brain\\986c3d57-38e8-4d61-9afb-d6a8faf30da7\\board_clip.png', Buffer.from(screenshotBase64, 'base64'));
    console.log("Saved board_clip.png");
  }
}

captureBoard().catch(console.error);
