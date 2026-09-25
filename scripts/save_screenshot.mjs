import { spawn } from 'child_process';
import fs from 'fs';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

export async function capture(url, outPath) {
  const port = 9335;
  const userDataDir = `C:\\Users\\ayoad\\.gemini\\antigravity-ide\\brain\\986c3d57-38e8-4d61-9afb-d6a8faf30da7\\scratch\\edge_snap_${Date.now()}`;
  
  const browserProc = spawn(edgePath, [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--headless=new',
    '--window-size=1280,950',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-extensions',
    'about:blank'
  ]);

  let versionData = null;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (res.ok) {
        versionData = await res.json();
        break;
      }
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
      await sendCmd('Page.enable');
      await sendCmd('Runtime.enable');
      await sendCmd('Page.navigate', { url });
      
      // Wait for page and board background image to be loaded and rendered
      await sendCmd('Runtime.evaluate', {
        expression: `new Promise((resolve) => {
          let attempts = 0;
          function check() {
            attempts++;
            const board = document.getElementById('draughts-board');
            if (!board) {
              if (attempts > 50) return resolve();
              return setTimeout(check, 100);
            }
            const bg = window.getComputedStyle(board).backgroundImage;
            const m = bg && bg.match(/url\\(["']?([^"']+)["']?\\)/);
            if (!m) {
              if (attempts > 50) return resolve();
              return setTimeout(check, 100);
            }
            const img = new Image();
            img.onload = () => setTimeout(resolve, 500);
            img.onerror = () => resolve();
            img.src = m[1];
          }
          if (document.readyState === 'complete') {
            check();
          } else {
            window.addEventListener('load', () => setTimeout(check, 200));
          }
          setTimeout(resolve, 6000);
        })`,
        awaitPromise: true,
        returnByValue: true
      });

      resolve();
    };
  });

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
      params: { format: 'png' }
    }));
  });

  ws.close();
  browserProc.kill();

  if (screenshotBase64) {
    fs.writeFileSync(outPath, Buffer.from(screenshotBase64, 'base64'));
    console.log(`Saved screenshot to ${outPath}`);
  } else {
    console.error('Failed to capture screenshot');
  }
}

async function main() {
  const currentArtifactDir = 'C:\\Users\\ayoad\\.gemini\\antigravity-ide\\brain\\986c3d57-38e8-4d61-9afb-d6a8faf30da7';
  const url = process.argv[2] || 'http://127.0.0.1:8000/game.php';
  const outPath = process.argv[3] || `${currentArtifactDir}\\current_game_before.png`;
  await capture(url, outPath);
}

if (process.argv[1] && process.argv[1].endsWith('save_screenshot.mjs')) {
  main().catch(console.error);
}
