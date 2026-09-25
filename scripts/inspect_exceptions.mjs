import { spawn } from 'child_process';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function testUrl(targetUrl) {
  console.log(`\n=== Inspecting: ${targetUrl} ===`);
  const port = 9337;
  const userDataDir = `C:\\Users\\ayoad\\.gemini\\antigravity-ide\\brain\\797a5afa-a238-4cc1-b9c2-5d45b754c2eb\\scratch\\edge_err_${Date.now()}`;
  
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

  ws.onopen = () => {
    ws.send(JSON.stringify({ id: id++, method: 'Runtime.enable' }));
    ws.send(JSON.stringify({ id: id++, method: 'Log.enable' }));
    ws.send(JSON.stringify({ id: id++, method: 'Page.navigate', params: { url: targetUrl } }));
  };

  ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data.toString());
    if (data.method === 'Runtime.exceptionThrown') {
      console.log('EXCEPTION:', JSON.stringify(data.params.exceptionDetails, null, 2));
    }
    if (data.method === 'Runtime.consoleAPICalled') {
      console.log('CONSOLE:', data.params.type, data.params.args);
    }
    if (data.method === 'Log.entryAdded') {
      console.log('LOG:', data.params.entry);
    }
  };

  await new Promise(r => setTimeout(r, 3000));
  ws.close();
  browserProc.kill();
}

async function main() {
  await testUrl('http://127.0.0.1:8000/game.php?ruleset=international');
  await testUrl('http://127.0.0.1:8000/puzzles.php');
}

main().catch(console.error);
