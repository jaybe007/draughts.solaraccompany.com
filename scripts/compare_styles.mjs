import { spawn } from 'child_process';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function compareBoardStyles() {
  for (const page of ['game.php', 'puzzles.php']) {
    const port = 9342;
    const userDataDir = `C:\\Users\\ayoad\\.gemini\\antigravity-ide\\brain\\986c3d57-38e8-4d61-9afb-d6a8faf30da7\\scratch\\edge_comp_${Date.now()}`;
    const browserProc = spawn(edgePath, [
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

    const targetsRes = await fetch(`http://127.0.0.1:${port}/json/list`);
    const targets = await targetsRes.json();
    const pageTarget = targets.find(t => t.type === 'page') || targets[0];

    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
    let id = 1;

    await new Promise((resolve) => {
      ws.onopen = () => {
        ws.send(JSON.stringify({ id: id++, method: 'Page.enable' }));
        ws.send(JSON.stringify({ id: id++, method: 'Runtime.enable' }));
        ws.send(JSON.stringify({ id: id++, method: 'Page.navigate', params: { url: `http://127.0.0.1:8000/${page}` } }));
      };
      setTimeout(resolve, 3000);
    });

    const info = await new Promise((resolve) => {
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
            const b = document.getElementById('draughts-board');
            const f = document.getElementById('board-wood-frame');
            const s0 = document.getElementById('sq-0-0') || document.getElementById('puzzle-sq-0-0');
            const p0 = s0 ? s0.querySelector('.piece') : null;
            return JSON.stringify({
              page: '${page}',
              boardClass: b ? b.className : null,
              boardBgImg: b ? window.getComputedStyle(b).backgroundImage : null,
              boardBgColor: b ? window.getComputedStyle(b).backgroundColor : null,
              frameClass: f ? f.className : null,
              frameBg: f ? window.getComputedStyle(f).background : null,
              s0BgColor: s0 ? window.getComputedStyle(s0).backgroundColor : null,
              s0BgImg: s0 ? window.getComputedStyle(s0).backgroundImage : null,
              p0BgImg: p0 ? window.getComputedStyle(p0).backgroundImage : null,
              p0Display: p0 ? window.getComputedStyle(p0).display : null,
              p0W: p0 ? window.getComputedStyle(p0).width : null,
              s0Children: s0 ? s0.innerHTML : null
            }, null, 2);
          })()`
        }
      }));
    });

    console.log(`\n=== ${page} ===\n`, info);
    ws.close();
    browserProc.kill();
  }
}

compareBoardStyles().catch(console.error);
