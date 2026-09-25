import { spawn } from 'child_process';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function testUrl(targetUrl) {
  console.log(`\n=== Testing ${targetUrl} ===`);
  const port = 9333;
  const userDataDir = `C:\\Users\\ayoad\\.gemini\\antigravity-ide\\brain\\797a5afa-a238-4cc1-b9c2-5d45b754c2eb\\scratch\\edge_debug_${Date.now()}`;
  
  const browserProc = spawn(edgePath, [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--headless=new',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank'
  ]);

  // Wait for remote debugging to be ready
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

  if (!versionData) {
    console.error('Could not connect to Edge DevTools');
    browserProc.kill();
    return;
  }

  // Get list of targets
  const targetsRes = await fetch(`http://127.0.0.1:${port}/json/list`);
  const targets = await targetsRes.json();
  const pageTarget = targets.find(t => t.type === 'page') || targets[0];

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  let id = 1;

  const errors = [];
  const logs = [];

  await new Promise((resolve, reject) => {
    ws.onopen = () => {
      // Enable console & runtime & network
      ws.send(JSON.stringify({ id: id++, method: 'Runtime.enable' }));
      ws.send(JSON.stringify({ id: id++, method: 'Log.enable' }));
      ws.send(JSON.stringify({ id: id++, method: 'Page.enable' }));
      
      // Navigate to targetUrl
      ws.send(JSON.stringify({ id: id++, method: 'Page.navigate', params: { url: targetUrl } }));
    };

    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data.toString());
      if (data.method === 'Runtime.consoleAPICalled') {
        const text = data.params.args.map(a => a.value || a.description || JSON.stringify(a)).join(' ');
        logs.push(`[${data.params.type}] ${text}`);
        if (data.params.type === 'error') {
          errors.push(`Console error: ${text}`);
        }
      }
      if (data.method === 'Runtime.exceptionThrown') {
        const ex = data.params.exceptionDetails;
        errors.push(`Uncaught Exception: ${ex.text} at ${ex.url}:${ex.lineNumber}:${ex.columnNumber} - ${ex.exception?.description || ''}`);
      }
      if (data.method === 'Log.entryAdded') {
        if (data.params.entry.level === 'error') {
          errors.push(`Log entry error: ${data.params.entry.text}`);
        }
      }
    };

    // Wait 4 seconds for page to load and execute scripts
    setTimeout(() => {
      resolve();
    }, 4000);
  });

  // Evaluate DOM state of draughts-board
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
          const board = document.getElementById('draughts-board');
          if (!board) return { found: false };
          const squares = board.querySelectorAll('.square').length;
          const pieces = board.querySelectorAll('.piece').length;
          const style = window.getComputedStyle(board);
          return {
            found: true,
            display: style.display,
            visibility: style.visibility,
            opacity: style.opacity,
            width: style.width,
            height: style.height,
            squares,
            pieces,
            classes: board.className
          };
        })()`,
        returnByValue: true
      }
    }));
  });

  ws.close();
  browserProc.kill();

  console.log('Board DOM State:', evalRes);
  console.log('Total Logs:', logs.length);
  if (logs.length > 0) {
    console.log('Recent logs:\n', logs.slice(-10).join('\n'));
  }
  console.log('Errors caught:', errors.length);
  if (errors.length > 0) {
    console.log('Errors:\n', errors.join('\n'));
  }
}

async function main() {
  await testUrl('http://127.0.0.1:8000/game.php');
  await testUrl('http://127.0.0.1:8000/puzzles.php');
}

main().catch(console.error);
