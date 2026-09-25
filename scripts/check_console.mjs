import { spawn } from 'child_process';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function checkConsole() {
  const port = 9336;
  const userDataDir = `C:\\Users\\ayoad\\.gemini\\antigravity-ide\\brain\\986c3d57-38e8-4d61-9afb-d6a8faf30da7\\scratch\\edge_debug_${Date.now()}`;
  
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
  const pageTarget = targets.find(t => t.type === 'page') || targets[0];

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  let id = 1;

  ws.onopen = () => {
    ws.send(JSON.stringify({ id: id++, method: 'Console.enable' }));
    ws.send(JSON.stringify({ id: id++, method: 'Runtime.enable' }));
    ws.send(JSON.stringify({ id: id++, method: 'Page.enable' }));
    ws.send(JSON.stringify({ id: id++, method: 'Page.navigate', params: { url: 'http://127.0.0.1:8000/game.php' } }));
  };

  ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data.toString());
    if (data.method === 'Console.messageAdded') {
      console.log('CONSOLE:', data.params.message.level, data.params.message.text);
    }
    if (data.method === 'Runtime.exceptionThrown') {
      console.error('EXCEPTION:', data.params.exceptionDetails.exception?.description || data.params.exceptionDetails.text);
    }
  };

  await new Promise(r => setTimeout(r, 4000));
  ws.close();
  browserProc.kill();
}

checkConsole().catch(console.error);
