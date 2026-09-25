import { spawn } from 'child_process';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function testUrl(targetUrl) {
  console.log(`\n=== Testing ${targetUrl} ===`);
  const port = 9334;
  const userDataDir = `C:\\Users\\ayoad\\.gemini\\antigravity-ide\\brain\\797a5afa-a238-4cc1-b9c2-5d45b754c2eb\\scratch\\edge_debug_${Date.now()}`;
  
  const browserProc = spawn(edgePath, [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--headless=new',
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

  if (!versionData) {
    console.error('Could not connect to Edge DevTools');
    browserProc.kill();
    return;
  }

  const targetsRes = await fetch(`http://127.0.0.1:${port}/json/list`);
  const targets = await targetsRes.json();
  const pageTarget = targets.find(t => t.type === 'page') || targets[0];

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  let id = 1;

  const failedRequests = [];
  const allRequests = [];

  await new Promise((resolve) => {
    ws.onopen = () => {
      ws.send(JSON.stringify({ id: id++, method: 'Network.enable' }));
      ws.send(JSON.stringify({ id: id++, method: 'Runtime.enable' }));
      ws.send(JSON.stringify({ id: id++, method: 'Page.navigate', params: { url: targetUrl } }));
    };

    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data.toString());
      if (data.method === 'Network.requestWillBeSent') {
        allRequests.push(data.params.request.url);
      }
      if (data.method === 'Network.responseReceived') {
        if (data.params.response.status >= 400) {
          failedRequests.push(`${data.params.response.status} - ${data.params.response.url}`);
        }
      }
    };

    setTimeout(resolve, 4000);
  });

  ws.close();
  browserProc.kill();

  console.log('All requests count:', allRequests.length);
  console.log('Failed requests:', failedRequests);
}

testUrl('http://127.0.0.1:8000/game.php').catch(console.error);
