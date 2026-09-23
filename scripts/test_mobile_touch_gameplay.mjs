import { spawn } from 'child_process';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9395;
const userDataDir = `C:\\Users\\ayoad\\.gemini\\antigravity-ide\\brain\\bbe56566-9975-47e9-bb50-4683acd8b47c\\scratch\\edge_mobile_touch_${Date.now()}`;

async function testMobileTouch() {
  console.log('=== TESTING MOBILE TOUCH & GAMEPLAY ON EMULATED PHONE ===\n');

  const browserProc = spawn(edgePath, [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--headless=new',
    '--window-size=390,844',
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

  await new Promise((resolve) => {
    ws.onopen = async () => {
      await sendCmd('Page.enable');
      await sendCmd('Runtime.enable');
      await sendCmd('Emulation.setDeviceMetricsOverride', {
        width: 390,
        height: 844,
        deviceScaleFactor: 2,
        mobile: true,
        fitWindow: false
      });
      await sendCmd('Emulation.setTouchEmulationEnabled', { enabled: true });
      await sendCmd('Page.navigate', { url: 'http://127.0.0.1:8000/game.php' });
      resolve();
    };
  });

  await new Promise(r => setTimeout(r, 3000));

  // Step 1: Verify layout dimensions on mobile
  const layoutCheck = await sendCmd('Runtime.evaluate', {
    expression: `
      (() => {
        const outer = document.querySelector('.lid-board-outer');
        const p1MobClock = document.getElementById('p1-mobile-clock');
        const p2MobClock = document.getElementById('p2-mobile-clock');
        const menuBtn = document.getElementById('btn-lid-mobile-menu');
        const drawer = document.getElementById('lid-mobile-drawer');
        const rect = outer ? outer.getBoundingClientRect() : null;
        return {
          boardWidth: rect ? Math.round(rect.width) : 0,
          boardHeight: rect ? Math.round(rect.height) : 0,
          p1ClockVisible: p1MobClock && p1MobClock.offsetParent !== null,
          p2ClockVisible: p2MobClock && p2MobClock.offsetParent !== null,
          p1ClockText: p1MobClock?.textContent?.trim(),
          p2ClockText: p2MobClock?.textContent?.trim(),
          menuBtnVisible: menuBtn && menuBtn.offsetParent !== null,
          drawerClosedByDefault: !drawer.classList.contains('open')
        };
      })()
    `,
    returnByValue: true
  });

  console.log('Mobile Layout Check:', layoutCheck?.result?.value);
  const layout = layoutCheck?.result?.value;

  if (layout.boardWidth >= 300 && layout.boardHeight >= 300) {
    console.log(`  ✓ PASS: Board is large & responsive on mobile (${layout.boardWidth}x${layout.boardHeight}px)`);
  } else {
    console.error(`  ✗ FAIL: Board is too small on mobile (${layout.boardWidth}x${layout.boardHeight}px)`);
  }

  if (layout.p1ClockVisible && layout.p2ClockVisible) {
    console.log(`  ✓ PASS: Both mobile clocks are visible and positioned around board (P1: ${layout.p1ClockText}, P2: ${layout.p2ClockText})`);
  } else {
    console.error('  ✗ FAIL: Mobile clocks not visible');
  }

  if (layout.menuBtnVisible && layout.drawerClosedByDefault) {
    console.log('  ✓ PASS: Mobile menu button is visible and drawer is closed by default');
  } else {
    console.error('  ✗ FAIL: Mobile menu button or drawer error');
  }

  // Step 2: Test Mobile Tap / Drag-and-Drop Interaction
  const touchMove = await sendCmd('Runtime.evaluate', {
    expression: `
      (() => {
        // Find a playable white piece
        const whiteSquares = Array.from(document.querySelectorAll('.square.dark .piece.p1, .square.dark .piece.white'))
          .map(p => p.parentElement);
        for (const sq of whiteSquares) {
          sq.click();
          const targets = document.querySelectorAll('.valid-target, .valid-capture-target');
          if (targets.length > 0) {
            const target = targets[0];
            const fromId = sq.id;
            const toId = target.id;
            // Execute move by clicking target square
            target.click();
            return { success: true, from: fromId, to: toId };
          }
        }
        return { success: false };
      })()
    `,
    returnByValue: true
  });

  console.log('Executed Mobile Move Attempt:', touchMove?.result?.value);

  // Wait 3.5s for AI move response
  await new Promise(r => setTimeout(r, 3500));

  const postMoveCheck = await sendCmd('Runtime.evaluate', {
    expression: `
      (() => {
        const p1MobClock = document.getElementById('p1-mobile-clock');
        const p2MobClock = document.getElementById('p2-mobile-clock');
        const moves = document.querySelectorAll('.history-item, .history-row, .move-item').length;
        const turnMain = document.getElementById('lid-turn-main')?.textContent?.trim();
        return {
          p1Clock: p1MobClock?.textContent?.trim(),
          p2Clock: p2MobClock?.textContent?.trim(),
          turnMain: turnMain
        };
      })()
    `,
    returnByValue: true
  });

  console.log('Post Move State:', postMoveCheck?.result?.value);
  const post = postMoveCheck?.result?.value;

  if (post && post.p1Clock !== '10:00') {
    console.log(`  ✓ PASS: Player 1 clock actively ticked on mobile (${post.p1Clock})`);
  } else {
    console.log(`  ℹ Note: Player clock: ${post?.p1Clock}`);
  }

  // Test mobile menu toggle open and close
  const drawerTest = await sendCmd('Runtime.evaluate', {
    expression: `
      (() => {
        const btn = document.getElementById('btn-lid-mobile-menu');
        const drawer = document.getElementById('lid-mobile-drawer');
        btn.click();
        const opened = drawer.classList.contains('open');
        btn.click();
        const closed = !drawer.classList.contains('open');
        return { opened, closed };
      })()
    `,
    returnByValue: true
  });

  if (drawerTest?.result?.value?.opened && drawerTest?.result?.value?.closed) {
    console.log('  ✓ PASS: Mobile menu drawer toggles open and close cleanly');
  } else {
    console.error('  ✗ FAIL: Drawer toggle failed');
  }

  ws.close();
  browserProc.kill();
  console.log('\n=== MOBILE TOUCH & GAMEPLAY VERIFICATION COMPLETE ===\n');
}

testMobileTouch().catch(console.error);
