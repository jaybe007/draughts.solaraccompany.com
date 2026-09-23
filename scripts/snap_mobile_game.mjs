import { spawn } from 'child_process';
import fs from 'fs';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function captureMobile(url, outPath) {
  const port = 9345;
  const userDataDir = `C:\\Users\\ayoad\\.gemini\\antigravity-ide\\brain\\bbe56566-9975-47e9-bb50-4683acd8b47c\\scratch\\edge_snap_${Date.now()}`;
  
  const browserProc = spawn(edgePath, [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--headless=new',
    '--window-size=390,844',
    '--no-first-run',
    '--no-default-browser-check',
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

  await new Promise((resolve) => {
    ws.onopen = () => {
      ws.send(JSON.stringify({ id: id++, method: 'Page.enable' }));
      ws.send(JSON.stringify({ id: id++, method: 'Page.navigate', params: { url } }));
    };
    setTimeout(resolve, 3500);
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
  const currentArtifactDir = 'C:\\Users\\ayoad\\.gemini\\antigravity-ide\\brain\\bbe56566-9975-47e9-bb50-4683acd8b47c';
  await captureMobile('http://127.0.0.1:8000/game.php', `${currentArtifactDir}\\game_mobile_snap.png`);
}

main().catch(console.error);
