import { spawn } from 'child_process';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 9360;
const userDataDir = 'C:\\Users\\ayoad\\.gemini\\antigravity-ide\\brain\\c3632920-1501-4133-ba5e-bb69c3cbf08b\\scratch\\chrome_debug';

const browserProc = spawn(chromePath, [
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
const ws = new WebSocket(targets[0].webSocketDebuggerUrl);
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
  ws.addEventListener('message', (msg) => {
    const data = JSON.parse(msg.data.toString());
    if (data.method === 'Console.messageAdded') {
      console.log('CHROME CONSOLE:', data.params.message.level, data.params.message.text);
    }
    if (data.method === 'Runtime.exceptionThrown') {
      console.error('CHROME EXCEPTION:', data.params.exceptionDetails.exception?.description || data.params.exceptionDetails.text);
    }
    if (data.method === 'Network.loadingFailed') {
      console.warn('CHROME NET FAILED:', data.params);
    }
  });

  await sendCmd('Console.enable');
  await sendCmd('Runtime.enable');
  await sendCmd('Network.enable');
  await sendCmd('Page.enable');

  await new Promise(resolve => {
    const handler = (msg) => {
      const data = JSON.parse(msg.data.toString());
      if (data.method === 'Page.loadEventFired') {
        ws.removeEventListener('message', handler);
        resolve();
      }
    };
    ws.addEventListener('message', handler);
    sendCmd('Page.navigate', { url: 'http://127.0.0.1/nigerian-draughts/game.php' });
    setTimeout(resolve, 8000);
  });

  await new Promise(r => setTimeout(r, 2000));

  const evalRes = await sendCmd('Runtime.evaluate', {
    expression: `(() => {
      const b = document.getElementById('draughts-board');
      const frame = document.getElementById('board-wood-frame');
      return {
        squares: b ? b.querySelectorAll('.square').length : 0,
        pieces: b ? b.querySelectorAll('.piece').length : 0,
        p2Name: document.getElementById('p2-name')?.textContent,
        boardBgImg: b ? window.getComputedStyle(b).backgroundImage : null,
        frameBg: frame ? window.getComputedStyle(frame).background : null
      };
    })()`,
    returnByValue: true
  });
  console.log('CHROME EVAL RESULT:', JSON.stringify(evalRes?.result?.value, null, 2));

  const snapRes = await sendCmd('Page.captureScreenshot', { format: 'png' });
  if (snapRes?.data) {
    const fs = await import('fs');
    fs.writeFileSync('C:\\Users\\ayoad\\.gemini\\antigravity-ide\\brain\\c3632920-1501-4133-ba5e-bb69c3cbf08b\\real_chrome_snap.png', Buffer.from(snapRes.data, 'base64'));
    console.log('Saved Chrome screenshot to real_chrome_snap.png');
  }

  ws.close();
  browserProc.kill();
  process.exit(0);
};
