import { spawn } from 'child_process';
import fs from 'fs';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function captureMobile(url, outPath) {
  const port = 9400 + Math.floor(Math.random() * 400);
  const userDataDir = `C:\\Users\\ayoad\\.gemini\\antigravity-ide\\brain\\f7c2cc30-ab9b-4e8f-aecc-337dbd803492\\scratch\\edge_snap_${Date.now()}`;
  
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
  try { browserProc.kill('SIGKILL'); } catch {}

  if (screenshotBase64) {
    fs.writeFileSync(outPath, Buffer.from(screenshotBase64, 'base64'));
    console.log(`Saved screenshot to ${outPath}`);
    process.exit(0);
  } else {
    console.error('Failed to capture screenshot');
    process.exit(1);
  }
}

async function main() {
  const currentArtifactDir = 'C:\\Users\\ayoad\\.gemini\\antigravity-ide\\brain\\f7c2cc30-ab9b-4e8f-aecc-337dbd803492';
  const url = process.argv[2] || 'http://localhost/nigerian-draughts/game.php';
  const out = process.argv[3] || `${currentArtifactDir}\\mobile_snap.png`;
  await captureMobile(url, out);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
