import { spawn } from 'child_process';
import fs from 'fs';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const urlsToTest = [
  'http://127.0.0.1:8000/game.php',
  'http://127.0.0.1:8000/game.php?ruleset=international',
  'http://127.0.0.1:8000/game.php?ruleset=ghana',
  'http://127.0.0.1:8000/game.php?view=analysis',
  'http://127.0.0.1:8000/game.php?mode=traps',
  'http://127.0.0.1:8000/puzzles.php',
  'http://127.0.0.1:8000/index.php',
  'http://127.0.0.1:8000/index.html'
];

async function testAll() {
  const port = 9336;
  const userDataDir = `C:\\Users\\ayoad\\.gemini\\antigravity-ide\\brain\\c3632920-1501-4133-ba5e-bb69c3cbf08b\\scratch\\edge_all_${Date.now()}`;
  
  const browserProc = spawn(edgePath, [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--headless=new',
    '--window-size=1280,900',
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

  await new Promise(r => {
    ws.onopen = () => {
      ws.send(JSON.stringify({ id: id++, method: 'Runtime.enable' }));
      ws.send(JSON.stringify({ id: id++, method: 'Page.enable' }));
      r();
    };
  });

  for (const url of urlsToTest) {
    console.log(`\nTesting: ${url}`);
    const uncaughtErrors = [];
    const onMsg = (msg) => {
      const data = JSON.parse(msg.data.toString());
      if (data.method === 'Runtime.exceptionThrown') {
        uncaughtErrors.push(data.params.exceptionDetails);
      }
    };
    ws.addEventListener('message', onMsg);

    ws.send(JSON.stringify({ id: id++, method: 'Page.navigate', params: { url } }));
    await new Promise(r => setTimeout(r, 2000));

    // Check board state
    const evalId = id++;
    const state = await new Promise(resolve => {
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
            return {
              url: window.location.href,
              boardFound: !!board,
              squares: board ? board.querySelectorAll('.square').length : 0,
              pieces: board ? board.querySelectorAll('.piece').length : 0,
              title: document.title
            };
          })()`,
          returnByValue: true
        }
      }));
    });

    ws.removeEventListener('message', onMsg);
    console.log('Result:', JSON.stringify(state));
    if (uncaughtErrors.length > 0) {
      console.log('Uncaught errors:', uncaughtErrors.map(e => e.text + ': ' + e.exception?.description));
    }
  }

  ws.close();
  browserProc.kill();
}

testAll().catch(console.error);
