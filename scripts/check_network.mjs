import { spawn } from 'child_process';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function checkNetwork() {
  const port = 9345;
  const userDataDir = `C:\\Users\\ayoad\\.gemini\\antigravity-ide\\brain\\986c3d57-38e8-4d61-9afb-d6a8faf30da7\\scratch\\edge_net_${Date.now()}`;

  const p = spawn(edgePath, [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--headless=new',
    'about:blank'
  ]);

  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (res.ok) break;
    } catch {}
  }

  const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const ws = new WebSocket(list[0].webSocketDebuggerUrl);
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

  const requests = [];

  const reqMap = new Map();
  ws.onopen = async () => {
    ws.addEventListener('message', (msg) => {
      const data = JSON.parse(msg.data.toString());
      if (data.method === 'Network.requestWillBeSent') {
        reqMap.set(data.params.requestId, data.params.request.url);
      }
      if (data.method === 'Network.responseReceived') {
        requests.push({
          url: data.params.response.url,
          status: data.params.response.status,
          mime: data.params.response.mimeType
        });
      }
      if (data.method === 'Network.loadingFailed') {
        requests.push({
          url: reqMap.get(data.params.requestId) || 'unknown',
          failed: true,
          error: data.params.errorText
        });
      }
    });

    await sendCmd('Network.enable');
    await sendCmd('Page.enable');
    await sendCmd('Page.navigate', { url: 'http://127.0.0.1:8000/game.php' });
    await new Promise(r => setTimeout(r, 4000));

    console.log('--- Total Requests:', requests.length);
    for (const r of requests) {
      console.log(r);
    }

    p.kill();
    process.exit(0);
  };
}

checkNetwork();
