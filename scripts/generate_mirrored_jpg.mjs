import { spawn } from 'child_process';
import fs from 'fs';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function makeMirroredJpg() {
  const port = 9339;
  const userDataDir = `C:\\Users\\ayoad\\.gemini\\antigravity-ide\\brain\\986c3d57-38e8-4d61-9afb-d6a8faf30da7\\scratch\\edge_mirror_${Date.now()}`;

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

  const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const ws = new WebSocket(list[0].webSocketDebuggerUrl);
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
      await sendCmd('Page.enable');
      await sendCmd('Runtime.enable');
      await sendCmd('Page.navigate', { url: 'http://127.0.0.1:8000/images/board/wood-1024_100.jpg' });
      setTimeout(resolve, 1500);
    };
  });

  const res = await sendCmd('Runtime.evaluate', {
    expression: `new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = img.width;
        c.height = img.height;
        const ctx = c.getContext('2d');
        ctx.translate(c.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(img, 0, 0);
        resolve({
          w: c.width,
          h: c.height,
          dataUrl: c.toDataURL('image/jpeg', 0.94)
        });
      };
      img.onerror = (e) => reject(String(e));
      img.src = 'http://127.0.0.1:8000/images/board/wood-1024_100.jpg';
    })`,
    awaitPromise: true,
    returnByValue: true
  });

  console.log('Result dimensions:', res?.result?.value?.w, res?.result?.value?.h);
  const dataUrl = res?.result?.value?.dataUrl;
  if (dataUrl) {
    const base64Data = dataUrl.replace(/^data:image\/jpeg;base64,/, '');
    fs.writeFileSync('images/board/wood-1024_100_mirrored.jpg', Buffer.from(base64Data, 'base64'));
    console.log('Successfully wrote images/board/wood-1024_100_mirrored.jpg! File size:', fs.statSync('images/board/wood-1024_100_mirrored.jpg').size);
  } else {
    console.error('Failed to get dataUrl:', res);
  }

  browserProc.kill();
  process.exit(0);
}

makeMirroredJpg();
