import { spawn } from 'child_process';
import fs from 'fs';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9396;
const userDataDir = `C:\\Users\\ayoad\\.gemini\\antigravity-ide\\brain\\f7c2cc30-ab9b-4e8f-aecc-337dbd803492\\scratch\\edge_test_flow_${Date.now()}`;
const artifactDir = 'C:\\Users\\ayoad\\.gemini\\antigravity-ide\\brain\\f7c2cc30-ab9b-4e8f-aecc-337dbd803492';

async function runTest() {
  console.log('=== VERIFYING LIDRAUGHTS EXACT MOBILE LAYOUT & GAMEPLAY ===\n');

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

  async function evaluate(expr) {
    const res = await sendCmd('Runtime.evaluate', { expression: expr, returnByValue: true });
    return res?.result?.value;
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
      await sendCmd('Page.navigate', { url: 'http://localhost/nigerian-draughts/game.php' });
      setTimeout(resolve, 3000);
    };
  });

  // 1. Check layout dimensions
  const layoutCheck = await evaluate(`(() => {
    const board = document.querySelector('.lid-board-outer');
    const bRect = board ? board.getBoundingClientRect() : null;
    const pieces = Array.from(document.querySelectorAll('.piece'));
    const pWidths = new Set(pieces.map(p => Math.round(p.getBoundingClientRect().width)));
    const edgeLabels = Array.from(document.querySelectorAll('.sq-num-label')).map(l => l.textContent.trim());
    const ribbon = document.getElementById('lid-mobile-moves-ribbon');
    const toolbar = document.getElementById('lid-mobile-bottom-toolbar');
    const p1Clock = document.getElementById('p1-mobile-clock');
    const p2Clock = document.getElementById('p2-mobile-clock');

    return {
      boardWidth: bRect ? Math.round(bRect.width) : 0,
      boardHeight: bRect ? Math.round(bRect.height) : 0,
      pieceCount: pieces.length,
      distinctPieceWidths: Array.from(pWidths),
      edgeLabelsCount: edgeLabels.length,
      edgeLabelsSample: edgeLabels.slice(0, 10),
      hasRibbon: !!ribbon,
      hasToolbar: !!toolbar,
      p1ClockText: p1Clock ? p1Clock.textContent.trim() : null,
      p2ClockText: p2Clock ? p2Clock.textContent.trim() : null,
      p1ClockColor: p1Clock ? window.getComputedStyle(p1Clock).color : null
    };
  })()`);

  console.log('1. Mobile Layout Check:');
  console.log('   Board Dimensions (expected ~390x390):', layoutCheck.boardWidth, 'x', layoutCheck.boardHeight);
  console.log('   Piece Count (expected 40):', layoutCheck.pieceCount);
  console.log('   Piece Widths (should be uniform single value):', layoutCheck.distinctPieceWidths);
  console.log('   Edge Square Number Labels Count:', layoutCheck.edgeLabelsCount, 'Sample:', layoutCheck.edgeLabelsSample);
  console.log('   P1 Clock Text:', layoutCheck.p1ClockText, 'Color:', layoutCheck.p1ClockColor);
  console.log('   P2 Clock Text:', layoutCheck.p2ClockText);

  // 2. Play a move: click piece on square (6, 0) or find first legal white piece and move
  const moveRes = await evaluate(`(() => {
    const whitePieces = Array.from(document.querySelectorAll('.square.dark .piece.p1, .square.dark .piece.white'));
    for (const p of whitePieces) {
      const sq = p.closest('.square');
      sq.click();
      const targets = Array.from(document.querySelectorAll('.square.valid-target'));
      if (targets.length > 0) {
        const fromId = sq.id;
        const target = targets[0];
        const toId = target.id;
        target.click();
        return { success: true, fromId, toId };
      }
    }
    return { success: false };
  })()`);

  console.log('\n2. Opening Move Execution:');
  console.log('   Move Result:', moveRes);

  // Wait 1.5 seconds for UI state and last move tint
  await new Promise(r => setTimeout(r, 1500));

  const postMoveCheck = await evaluate(`(() => {
    const lastFrom = document.querySelector('.square.sq-last-from');
    const lastTo = document.querySelector('.square.sq-last-to');
    const ribbonTrack = document.getElementById('ribbon-scroll-track');
    const p1Clock = document.getElementById('p1-mobile-clock');
    const p2Clock = document.getElementById('p2-mobile-clock');

    return {
      hasLastFromHighlight: !!lastFrom,
      lastFromId: lastFrom ? lastFrom.id : null,
      hasLastToHighlight: !!lastTo,
      lastToId: lastTo ? lastTo.id : null,
      ribbonContent: ribbonTrack ? ribbonTrack.innerText.trim() : null,
      p1Clock: p1Clock ? p1Clock.textContent.trim() : null,
      p2Clock: p2Clock ? p2Clock.textContent.trim() : null
    };
  })()`);

  console.log('\n3. Post-Move Highlights & Ribbon:');
  console.log('   From Square Tinted:', postMoveCheck.hasLastFromHighlight, postMoveCheck.lastFromId);
  console.log('   To Square Tinted:', postMoveCheck.hasLastToHighlight, postMoveCheck.lastToId);
  console.log('   Moves Ribbon Content:', postMoveCheck.ribbonContent);
  console.log('   P1 Clock:', postMoveCheck.p1Clock, '| P2 Clock:', postMoveCheck.p2Clock);

  // Wait for AI response move (up to 4 seconds)
  console.log('\n4. Waiting for AI move response and clock countdown...');
  let aiMoved = false;
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 300));
    const count = await evaluate(`window.app && window.app.engine ? window.app.engine.moveHistory.length : 0`);
    if (count >= 2) {
      aiMoved = true;
      break;
    }
  }

  const aiMoveCheck = await evaluate(`(() => {
    const ribbonTrack = document.getElementById('ribbon-scroll-track');
    const moveCount = window.app && window.app.engine ? window.app.engine.moveHistory.length : 0;
    const p1Clock = document.getElementById('p1-mobile-clock');
    const p2Clock = document.getElementById('p2-mobile-clock');
    return {
      moveCount,
      ribbonContent: ribbonTrack ? ribbonTrack.innerText.trim() : null,
      p1Clock: p1Clock ? p1Clock.textContent.trim() : null,
      p2Clock: p2Clock ? p2Clock.textContent.trim() : null
    };
  })()`);

  console.log('   AI Moved:', aiMoved, '| Total Moves Played:', aiMoveCheck.moveCount);
  console.log('   Updated Ribbon Content:', aiMoveCheck.ribbonContent);
  console.log('   P1 Clock:', aiMoveCheck.p1Clock, '| P2 Clock:', aiMoveCheck.p2Clock);

  // Capture in-play screenshot
  const snapRes = await sendCmd('Page.captureScreenshot', { format: 'png' });
  if (snapRes && snapRes.data) {
    const snapPath = `${artifactDir}\\mobile_inplay_snap.png`;
    fs.writeFileSync(snapPath, Buffer.from(snapRes.data, 'base64'));
    console.log('\n5. Saved in-play mobile snapshot to:', snapPath);
  }

  ws.close();
  browserProc.kill();
  console.log('\n=== MOBILE FLOW TEST COMPLETE ===');
}

runTest().catch(console.error);
