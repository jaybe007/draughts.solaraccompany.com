import { NigerianDraughtsEngine, PLAYER_1, PLAYER_2 } from '../js/engine.js';
import { NigerianDraughtsAI } from '../js/ai.js';
import { DraughtsBoard50 } from '../js/engine50.js';
import { RulesEngine } from '../js/rules_engine.js';

console.log('================================================================');
console.log('🧪 COMPREHENSIVE AI MULTI-JUMP & CROSS-LEVEL VALIDATION SUITE');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passCount++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failCount++;
  }
}

// -----------------------------------------------------------------------------
// TEST 1: 3-Seed Multi-Jump to Corner without Backline (The Exact User Issue)
// -----------------------------------------------------------------------------
console.log('--- TEST 1: 3-Seed Capture Chain to Corner/Edge (No False Crowning) ---');
{
  const engine = new NigerianDraughtsEngine({ boardSize: 10, ruleMode: 'nigeria' });
  for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) engine.board[r][c] = null;

  // Setup exact 3-jump sequence:
  // P2 (Dark) ordinary man at (3, 3).
  // Jump 1: enemy at (4, 4), lands at (5, 5). (Neither row 0 nor row 9)
  // Jump 2: enemy at (6, 6), lands at (7, 7). (Neither row 0 nor row 9)
  // Jump 3: enemy at (6, 8), lands at (5, 9) (corner/edge of board! Neither row 0 nor row 9).
  engine.board[3][3] = { id: 1, player: PLAYER_2, isKing: false };
  engine.board[4][4] = { id: 2, player: PLAYER_1, isKing: false };
  engine.board[6][6] = { id: 3, player: PLAYER_1, isKing: false };
  engine.board[6][8] = { id: 4, player: PLAYER_1, isKing: false };
  engine.currentTurn = PLAYER_2;

  // Step 1: (3,3) -> (5,5)
  const step1 = engine.getAllLegalMoves(PLAYER_2).find(m => m.from.r === 3 && m.from.c === 3 && m.to.r === 5 && m.to.c === 5);
  assert(step1 !== undefined, 'Found step 1 capture (3,3) -> (5,5)');
  const res1 = engine.makeMove(step1);
  assert(!res1.turnEnded, 'Step 1: Turn does not end (continuation exists)');
  assert(engine.board[5][5].isKing === false, 'Step 1: Piece is NOT king');

  // Step 2: (5,5) -> (7,7) jumping (6,6)
  const step2 = engine.getAllLegalMoves(PLAYER_2).find(m => m.to.r === 7 && m.to.c === 7);
  assert(step2 !== undefined, 'Found step 2 capture (5,5) -> (7,7)');
  const res2 = engine.makeMove(step2);
  assert(!res2.turnEnded, 'Step 2: Turn does not end (continuation exists)');
  assert(engine.board[7][7].isKing === false, 'Step 2: Piece is STILL NOT king (CRITICAL BUG FIX VERIFIED)');

  // Step 3: (7,7) -> (5,9) jumping (6,8) - lands on side corner/edge (5,9)
  const step3 = engine.getAllLegalMoves(PLAYER_2).find(m => m.to.r === 5 && m.to.c === 9);
  assert(step3 !== undefined, 'Found step 3 capture (7,7) -> (5,9) to edge/corner');
  const res3 = engine.makeMove(step3);
  assert(res3.turnEnded, 'Step 3: Capture sequence completes, turn ends');
  assert(engine.board[5][9].isKing === false, 'Step 3: Piece at (5,9) remains a regular SEED (isKing = false)');
  assert(engine.capturedPieces[PLAYER_2].length === 3, 'All 3 seeds successfully captured and removed');
}

// -----------------------------------------------------------------------------
// TEST 2: True Nigerian Overcrown Capture (Genuine Mid-Chain Backline Hit)
// -----------------------------------------------------------------------------
console.log('\n--- TEST 2: Genuine Nigerian Overcrown Capture (Hits Row 0, Continues as Oba) ---');
{
  const engine = new NigerianDraughtsEngine({ boardSize: 10, ruleMode: 'nigeria' });
  for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) engine.board[r][c] = null;

  // P1 man at (2,0). Enemy 1 at (1,1) (jump to 0,2 - crown row).
  // Enemy 2 at (2,4) - distance 2 along DR diagonal from (0,2).
  engine.board[2][0] = { id: 1, player: PLAYER_1, isKing: false };
  engine.board[1][1] = { id: 2, player: PLAYER_2, isKing: false };
  engine.board[2][4] = { id: 3, player: PLAYER_2, isKing: false };
  engine.currentTurn = PLAYER_1;

  const step1 = engine.getAllLegalMoves(PLAYER_1).find(m => m.to.r === 0 && m.to.c === 2);
  assert(step1 !== undefined, 'Found overcrown step 1 jumping to crown square (0,2)');
  const res1 = engine.makeMove(step1);
  assert(!res1.turnEnded, 'Overcrown step 1 continues capturing');
  assert(engine.board[0][2].isKing === true, 'Piece at (0,2) is crowned as Oba/King');

  const continuations = engine.getAllLegalMoves(PLAYER_1);
  assert(continuations.length > 0, `Oba has flying continuations (got ${continuations.length})`);
  const step2 = continuations.find(m => m.to.r === 4 && m.to.c === 6) || continuations[0];
  const res2 = engine.makeMove(step2);
  assert(res2.turnEnded, 'Overcrown step 2 completes sequence');
  assert(engine.board[step2.to.r][step2.to.c].isKing === true, 'Piece remains an Oba/King at final destination');
}

// -----------------------------------------------------------------------------
// TEST 3: All 6 AI Levels Resolving Captures Correctly
// -----------------------------------------------------------------------------
console.log('\n--- TEST 3: AI Move Generation and Execution Across All 6 Levels ---');
const levels = [
  { name: 'beginner', num: 1, title: 'Beginner (Level 1)' },
  { name: 'intermediate', num: 2, title: 'Intermediate (Level 2)' },
  { name: 'advanced', num: 3, title: 'Advanced (Level 3)' },
  { name: 'expert', num: 4, title: 'Expert (Level 4)' },
  { name: 'master', num: 5, title: 'Master (Level 5)' },
  { name: 'grandmaster', num: 6, title: 'Grandmaster (Level 6)' }
];

for (const lvl of levels) {
  const engine = new NigerianDraughtsEngine({ boardSize: 10, ruleMode: 'nigeria' });
  for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) engine.board[r][c] = null;

  // Dark piece at (3, 3) can capture White at (4, 4) to (5, 5), then White at (6, 6) to (7, 7)
  engine.board[3][3] = { id: 10, player: PLAYER_2, isKing: false };
  engine.board[4][4] = { id: 11, player: PLAYER_1, isKing: false };
  engine.board[6][6] = { id: 12, player: PLAYER_1, isKing: false };
  engine.currentTurn = PLAYER_2;

  const ai = new NigerianDraughtsAI({ difficulty: lvl.name });
  const bestMoveRes = ai.getBestMoveSync(engine, PLAYER_2);

  assert(bestMoveRes !== null && bestMoveRes.move !== null, `${lvl.title}: AI successfully calculated move`);
  assert(bestMoveRes.move.isCapture === true, `${lvl.title}: AI selected compulsory capture`);

  // Execute step 1
  const r1 = engine.makeMove(bestMoveRes.move);
  assert(engine.board[bestMoveRes.move.to.r][bestMoveRes.move.to.c].isKing === false, `${lvl.title}: Step 1 piece NOT king`);

  if (!r1.turnEnded) {
    const nextMoveRes = ai.getBestMoveSync(engine, PLAYER_2);
    assert(nextMoveRes !== null && nextMoveRes.move !== null, `${lvl.title}: AI calculated step 2 continuation`);
    const r2 = engine.makeMove(nextMoveRes.move);
    assert(r2.turnEnded, `${lvl.title}: Step 2 completed turn`);
    assert(engine.board[nextMoveRes.move.to.r][nextMoveRes.move.to.c].isKing === false, `${lvl.title}: Step 2 piece NOT king at (7,7)`);
  }
}

// -----------------------------------------------------------------------------
// TEST 4: Ghanaian Damii Rule (Stops and crowns immediately on row 0/9)
// -----------------------------------------------------------------------------
console.log('\n--- TEST 4: Ghanaian Damii Rule Integrity ---');
{
  const engine = new NigerianDraughtsEngine({ boardSize: 10, ruleMode: 'ghana' });
  for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) engine.board[r][c] = null;

  engine.board[2][0] = { id: 1, player: PLAYER_1, isKing: false };
  engine.board[1][1] = { id: 2, player: PLAYER_2, isKing: false };
  engine.board[2][4] = { id: 3, player: PLAYER_2, isKing: false }; // Even with continuation available
  engine.currentTurn = PLAYER_1;

  const move = engine.getAllLegalMoves(PLAYER_1).find(m => m.to.r === 0 && m.to.c === 2);
  assert(move !== undefined, 'Ghana Damii: Found jump to backline');
  const res = engine.makeMove(move);
  assert(res.turnEnded === true, 'Ghana Damii: Turn terminates immediately upon reaching backline');
  assert(engine.board[0][2].isKing === true, 'Ghana Damii: Crowned Oba immediately on backline');
}

// -----------------------------------------------------------------------------
// TEST 5: International FMJD Rule 3.5 (Passes through backline without crowning)
// -----------------------------------------------------------------------------
console.log('\n--- TEST 5: International FMJD Rule 3.5 Integrity ---');
{
  const engine = new NigerianDraughtsEngine({ boardSize: 10, ruleMode: 'international' });
  for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) engine.board[r][c] = null;

  // FMJD playable squares are (r + c) % 2 !== 0:
  // e.g. (2, 3), (1, 2) is (1+2=3 odd), (0, 1) is (0+1=1 odd).
  engine.board[2][3] = { id: 1, player: PLAYER_1, isKing: false };
  engine.board[1][2] = { id: 2, player: PLAYER_2, isKing: false }; // jumped to (0, 1)
  engine.board[1][0] = { id: 3, player: PLAYER_2, isKing: false }; // from (0, 1) jump over (1, 0) to (2, -1)? no, let's jump over (1, 2) to (0, 1), then over (1, 0) is not dark.
  // Dark squares in FMJD:
  // (2, 3) -> jump enemy at (1, 4) to (0, 5) [backline! 0+5=5 odd]
  // Then from (0, 5) -> jump enemy at (1, 6) to (2, 7) [2+7=9 odd]
  engine.board[2][3] = { id: 1, player: PLAYER_1, isKing: false };
  engine.board[1][4] = { id: 2, player: PLAYER_2, isKing: false };
  engine.board[1][6] = { id: 3, player: PLAYER_2, isKing: false };
  engine.currentTurn = PLAYER_1;

  const step1 = engine.getAllLegalMoves(PLAYER_1).find(m => m.to.r === 0 && m.to.c === 5);
  assert(step1 !== undefined, 'FMJD: Step 1 lands on backline (0, 5)');
  const res1 = engine.makeMove(step1);
  assert(!res1.turnEnded, 'FMJD: Turn does not end (continuation exists)');
  assert(engine.board[0][5].isKing === false, 'FMJD Rule 3.5: Piece is NOT crowned mid-chain on backline');

  const step2 = engine.getAllLegalMoves(PLAYER_1).find(m => m.to.r === 2 && m.to.c === 7);
  assert(step2 !== undefined, 'FMJD: Step 2 captures as MAN to (2, 7)');
  const res2 = engine.makeMove(step2);
  assert(res2.turnEnded, 'FMJD: Turn ends after final jump');
  assert(engine.board[2][7].isKing === false, 'FMJD Rule 3.5: Final piece remains a MAN (did not stop on backline)');
}

console.log('\n================================================================');
console.log(`TOTAL ASSERTS: ${passCount + failCount} | PASSED: ${passCount} | FAILED: ${failCount}`);
console.log('================================================================');
if (failCount > 0) process.exit(1);
