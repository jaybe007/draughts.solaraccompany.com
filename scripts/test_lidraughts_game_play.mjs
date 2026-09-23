import { spawn } from 'child_process';
import fs from 'fs';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9355;
const userDataDir = `C:\\Users\\ayoad\\.gemini\\antigravity-ide\\brain\\bbe56566-9975-47e9-bb50-4683acd8b47c\\scratch\\edge_game_test_${Date.now()}`;

async function runTest() {
  console.log('Launching headless browser to test Lidraughts gameplay...');
  const browserProc = spawn(edgePath, [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--headless=new',
    '--window-size=1366,768',
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
      await sendCmd('Page.navigate', { url: 'http://127.0.0.1:8000/game.php' });
      resolve();
    };
  });

  // Wait for board to load and render
  await new Promise(r => setTimeout(r, 3000));

  // Find a white piece with valid moves
  const evalResult = await sendCmd('Runtime.evaluate', {
    expression: `
      (() => {
        const whiteSquares = Array.from(document.querySelectorAll('.square.dark .piece.p1, .square.dark .piece.white'))
          .map(p => p.parentElement);
        for (const sq of whiteSquares) {
          sq.click();
          const targets = document.querySelectorAll('.valid-target, .valid-capture-target');
          if (targets.length > 0) {
            return {
              fromId: sq.id,
              targetId: targets[0].id,
              targetsCount: targets.length
            };
          }
        }
        return null;
      })()
    `,
    returnByValue: true
  });

  console.log('Selected piece and found target:', evalResult?.result?.value);
  const moveInfo = evalResult?.result?.value;

  if (moveInfo) {
    // Click the target to execute move
    await sendCmd('Runtime.evaluate', {
      expression: `document.getElementById('${moveInfo.targetId}').click()`
    });

    console.log('Executed Player 1 move! Waiting for AI response...');
    // Wait 3.5 seconds for AI response and clock tick
    await new Promise(r => setTimeout(r, 3500));

    const stateCheck = await sendCmd('Runtime.evaluate', {
      expression: `
        (() => {
          return {
            p1Clock: document.getElementById('p1-clock')?.textContent,
            p2Clock: document.getElementById('p2-clock')?.textContent,
            turnMain: document.getElementById('lid-turn-main')?.textContent,
            turnSub: document.getElementById('lid-turn-sub')?.textContent,
            historyMoves: document.querySelectorAll('.history-item, .history-row, .move-item').length,
            historyText: document.getElementById('move-history-list')?.textContent?.trim()
          };
        })()
      `,
      returnByValue: true
    });

    console.log('State check after Player 1 move & AI response:', stateCheck?.result?.value);
  }

  // Take screenshot of live match in progress
  const snapRes = await sendCmd('Page.captureScreenshot', { format: 'png' });
  const outPath = 'C:\\Users\\ayoad\\.gemini\\antigravity-ide\\brain\\bbe56566-9975-47e9-bb50-4683acd8b47c\\game_in_play.png';
  if (snapRes?.data) {
    fs.writeFileSync(outPath, Buffer.from(snapRes.data, 'base64'));
    console.log(`Saved live match screenshot to ${outPath}`);
  }

  ws.close();
  browserProc.kill();
  console.log('Test completed successfully!');
}

runTest().catch(console.error);
