import { spawn } from 'child_process';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9355;
const userDataDir = 'C:\\Users\\ayoad\\.gemini\\antigravity-ide\\brain\\c3632920-1501-4133-ba5e-bb69c3cbf08b\\scratch\\edge_debug_apache';

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
      console.log('CONSOLE:', data.params.message.level, data.params.message.text);
    }
    if (data.method === 'Runtime.exceptionThrown') {
      console.error('EXCEPTION:', data.params.exceptionDetails.exception?.description || data.params.exceptionDetails.text);
    }
  });

  await sendCmd('Console.enable');
  await sendCmd('Runtime.enable');
  await sendCmd('Page.enable');
  await sendCmd('Page.navigate', { url: 'http://127.0.0.1/nigerian-draughts/game.php' });
  await new Promise(r => setTimeout(r, 3500));

  const evalRes = await sendCmd('Runtime.evaluate', {
    expression: `(() => {
      const b = document.getElementById('draughts-board');
      return {
        squares: b ? b.querySelectorAll('.square').length : 0,
        pieces: b ? b.querySelectorAll('.piece').length : 0,
        boardHTML: b ? b.innerHTML.slice(0, 300) : null,
        bgImg: b ? window.getComputedStyle(b).backgroundImage : null,
        frameBg: document.getElementById('board-wood-frame') ? window.getComputedStyle(document.getElementById('board-wood-frame')).background : null
      };
    })()`,
    returnByValue: true
  });
  console.log('EVAL RES:', JSON.stringify(evalRes?.result?.value, null, 2));

  ws.close();
  browserProc.kill();
  process.exit(0);
};
