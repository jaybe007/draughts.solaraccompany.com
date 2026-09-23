import { spawn } from 'child_process';
import fs from 'fs';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artifactDir = 'C:\\Users\\ayoad\\.gemini\\antigravity-ide\\brain\\bbe56566-9975-47e9-bb50-4683acd8b47c';

async function inspectDashboard() {
  const port = 9348;
  const userDataDir = `${artifactDir}\\scratch\\dash_inspect_${Date.now()}`;
  
  const browserProc = spawn(edgePath, [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--headless=new',
    '--window-size=1440,900',
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
      ws.send(JSON.stringify({ id: id++, method: 'Network.enable' }));
      ws.send(JSON.stringify({ id: id++, method: 'Runtime.enable' }));
      ws.send(JSON.stringify({ id: id++, method: 'Page.enable' }));
      r();
    };
  });

  async function evalExpr(expr) {
    const evalId = id++;
    return new Promise(res => {
      const handler = (msg) => {
        const data = JSON.parse(msg.data.toString());
        if (data.id === evalId) {
          ws.removeEventListener('message', handler);
          res(data.result?.result?.value);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({
        id: evalId,
        method: 'Runtime.evaluate',
        params: { expression: expr, returnByValue: true }
      }));
    });
  }

  async function captureScreenshot(outPath) {
    const snapId = id++;
    return new Promise(res => {
      const handler = (msg) => {
        const data = JSON.parse(msg.data.toString());
        if (data.id === snapId) {
          ws.removeEventListener('message', handler);
          if (data.result?.data) {
            fs.writeFileSync(outPath, Buffer.from(data.result.data, 'base64'));
          }
          res();
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({
        id: snapId,
        method: 'Page.captureScreenshot',
        params: { format: 'png' }
      }));
    });
  }

  async function setViewport(width, height) {
    const vId = id++;
    return new Promise(res => {
      const handler = (msg) => {
        const data = JSON.parse(msg.data.toString());
        if (data.id === vId) {
          ws.removeEventListener('message', handler);
          res();
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({
        id: vId,
        method: 'Emulation.setDeviceMetricsOverride',
        params: { width, height, deviceScaleFactor: 1, mobile: false }
      }));
    });
  }

  // 1. Navigate to index.php to set session domain
  ws.send(JSON.stringify({ id: id++, method: 'Page.navigate', params: { url: 'http://127.0.0.1:8000/index.php' } }));
  await new Promise(r => setTimeout(r, 1200));

  // 2. Perform login via fetch in page context
  const loginRes = await evalExpr(`(async () => {
    try {
      const res = await fetch('api/auth.php?action=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: 'GrandmasterAyo', password: 'Password123!' })
      });
      return await res.json();
    } catch(e) {
      return { error: e.message };
    }
  })()`);
  console.log('Login result:', loginRes);

  // 3. Navigate to dashboard.php
  ws.send(JSON.stringify({ id: id++, method: 'Page.navigate', params: { url: 'http://127.0.0.1:8000/dashboard.php' } }));
  await new Promise(r => setTimeout(r, 2000));

  // 4. Test viewports
  const widths = [1920, 1440, 1280, 1024, 768, 480];
  for (const w of widths) {
    await setViewport(w, 900);
    await new Promise(r => setTimeout(r, 800));

    // If mobile/tablet <= 1024, open mobile nav to inspect drawer
    if (w <= 1024) {
      await evalExpr(`(() => {
        const nav = document.getElementById('dash-main-nav');
        if (nav && !nav.classList.contains('mobile-open')) {
          toggleMobileNav();
        }
      })()`);
      await new Promise(r => setTimeout(r, 400));
    }

    const metrics = await evalExpr(`(() => {
      const header = document.querySelector('.home-header');
      const container = document.querySelector('.nav-container');
      const brand = document.querySelector('.brand-wrap');
      const nav = document.querySelector('.dash-main-nav');
      const userArea = document.querySelector('.dash-header-user');
      const mobileToggle = document.querySelector('.dash-mobile-nav-toggle');

      // Check all nav items
      const items = Array.from(document.querySelectorAll('.dash-nav-links > li')).map(li => {
        const btn = li.querySelector('button, a');
        return {
          text: btn ? btn.textContent.trim().replace(/\\s+/g, ' ') : li.textContent.trim(),
          rect: li.getBoundingClientRect().toJSON(),
          visible: li.offsetWidth > 0 && li.offsetHeight > 0
        };
      });

      // Check user area buttons
      const userBtns = Array.from(document.querySelectorAll('.dash-header-user > a, .dash-header-user > button')).map(b => ({
        text: b.textContent.trim().replace(/\\s+/g, ' '),
        rect: b.getBoundingClientRect().toJSON(),
        visible: b.offsetWidth > 0 && b.offsetHeight > 0
      }));

      // Check dashboard tab buttons
      const tabBtns = Array.from(document.querySelectorAll('.dash-tabs-nav .dash-tab-btn')).map(b => ({
        text: b.textContent.trim().replace(/\\s+/g, ' '),
        rect: b.getBoundingClientRect().toJSON(),
        visible: b.offsetWidth > 0 && b.offsetHeight > 0
      }));

      return {
        windowWidth: window.innerWidth,
        containerRect: container ? container.getBoundingClientRect().toJSON() : null,
        headerOverflow: container ? container.scrollWidth > container.clientWidth : false,
        mobileToggleVisible: mobileToggle ? window.getComputedStyle(mobileToggle).display !== 'none' : false,
        items,
        userBtns,
        tabBtns
      };
    })()`);

    console.log(`\n=== Viewport: ${w}px ===`);
    console.log('Header overflow:', metrics.headerOverflow);
    console.log('Mobile toggle visible:', metrics.mobileToggleVisible);
    console.log('Container rect:', metrics.containerRect);
    console.log('User Area Buttons:', metrics.userBtns.map(b => `${b.text} (visible: ${b.visible}, right: ${Math.round(b.rect.right)})`).join(', '));
    console.log('Nav Items Count:', metrics.items.length);
    metrics.items.forEach(it => {
      const offScreen = it.rect.right > w || it.rect.left < 0;
      console.log(`  Nav: "${it.text.substring(0, 25)}" - left: ${Math.round(it.rect.left)}, right: ${Math.round(it.rect.right)}, visible: ${it.visible}, offScreen: ${offScreen}`);
    });
    console.log('Tab Buttons Count:', metrics.tabBtns.length);
    metrics.tabBtns.forEach(t => {
      console.log(`  Tab: "${t.text.substring(0, 25)}" - left: ${Math.round(t.rect.left)}, right: ${Math.round(t.rect.right)}, visible: ${t.visible}`);
    });

    const outPath = `${artifactDir}\\dash_${w}px.png`;
    await captureScreenshot(outPath);
    console.log(`Saved screenshot to dash_${w}px.png`);
  }

  // 5. Test Dropdown Positioning at 1440px
  await setViewport(1440, 900);
  await new Promise(r => setTimeout(r, 600));

  // Open ACTION Dropdown
  await evalExpr(`document.getElementById('btn-dropdown-actions').click()`);
  await new Promise(r => setTimeout(r, 300));
  const actionMenuMetrics = await evalExpr(`(() => {
    const m = document.getElementById('menu-actions');
    const r = m.getBoundingClientRect().toJSON();
    return {
      rect: r,
      offScreenRight: r.right > window.innerWidth,
      offScreenLeft: r.left < 0,
      itemCount: m.querySelectorAll('li').length
    };
  })()`);
  console.log('\n=== ACTION Dropdown Test at 1440px ===', actionMenuMetrics);
  await captureScreenshot(`${artifactDir}\\action_dropdown_1440px.png`);

  // Open GAME Dropdown
  await evalExpr(`document.getElementById('btn-dropdown-game').click()`);
  await new Promise(r => setTimeout(r, 300));
  const gameMenuMetrics = await evalExpr(`(() => {
    const m = document.getElementById('menu-game');
    const r = m.getBoundingClientRect().toJSON();
    return {
      rect: r,
      offScreenRight: r.right > window.innerWidth,
      offScreenLeft: r.left < 0,
      itemCount: m.querySelectorAll('li').length
    };
  })()`);
  console.log('=== GAME Dropdown Test at 1440px ===', gameMenuMetrics);
  await captureScreenshot(`${artifactDir}\\game_dropdown_1440px.png`);

  ws.close();
  browserProc.kill();
  console.log('\nAudit complete!');
}

inspectDashboard().catch(console.error);
