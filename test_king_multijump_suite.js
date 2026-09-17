import { NigerianDraughtsEngine, PLAYER_1, PLAYER_2 } from './js/engine.js';
import { NigerianDraughtsAI } from './js/ai.js';
import { DraughtsBoard50, sqToRC, rcToSq, P1_KING, P1_MAN, P2_KING, P2_MAN, EMPTY } from './js/engine50.js';

console.log('====================================================');
console.log('KING MULTI-JUMP & CAPTURE CONTINUATION TEST SUITE');
console.log('====================================================\n');

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  }
  console.log(`  ✓ PASS: ${message}`);
}

// -----------------------------------------------------------
// Test 1: King Landing Filter: Eliminates dead ends when continuation exists
// -----------------------------------------------------------
console.log('1. King Landing Filter:');
{
  const engine = new NigerianDraughtsEngine({ boardSize: 10, ruleMode: 'nigeria' });
  for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) engine.board[r][c] = null;

  // King at (1, 1). Enemy at (3, 3).
  // Another enemy at (6, 4), which can ONLY be jumped from (5, 5).
  // Squares (4, 4), (6, 6), (7, 7), (8, 8), (9, 9) cannot jump (6, 4).
  engine.board[1][1] = { player: PLAYER_2, isKing: true };
  engine.board[3][3] = { player: PLAYER_1, isKing: false };
  engine.board[6][4] = { player: PLAYER_1, isKing: false };
  engine.currentTurn = PLAYER_2;

  const captures = engine.getPieceCaptures(1, 1, engine.board[1][1], []);
  assert(captures.length === 1, `King only has 1 valid landing square that continues the capture (got ${captures.length})`);
  assert(captures[0].to.r === 5 && captures[0].to.c === 5, `Landing square is (5, 5) which enables subsequent jump`);
  assert(captures[0].totalChainLength === 2, `Total chain length is 2 captures`);
}

// -----------------------------------------------------------
// Test 2: Flying King Free Landing when no continuation exists
// -----------------------------------------------------------
console.log('\n2. Flying King Free Landing (No Continuation Available):');
{
  const engine = new NigerianDraughtsEngine({ boardSize: 10, ruleMode: 'nigeria' });
  for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) engine.board[r][c] = null;

  // King at (1, 1). Single enemy at (3, 3). No further enemies.
  engine.board[1][1] = { player: PLAYER_2, isKing: true };
  engine.board[3][3] = { player: PLAYER_1, isKing: false };
  engine.currentTurn = PLAYER_2;

  const captures = engine.getPieceCaptures(1, 1, engine.board[1][1], []);
  // Squares beyond (3, 3) along diagonal: (4, 4), (5, 5), (6, 6), (7, 7), (8, 8), (9, 9) -> 6 squares
  assert(captures.length === 6, `King has all 6 empty squares available beyond jumped piece (got ${captures.length})`);
  const landingRs = captures.map(c => c.to.r).sort((a, b) => a - b);
  assert(landingRs.join(',') === '4,5,6,7,8,9', `King can land on any square 4..9 when no continuation exists`);
}

// -----------------------------------------------------------
// Test 3: Full Multi-Jump Execution Sequence (Engine State)
// -----------------------------------------------------------
console.log('\n3. Full Multi-Jump Move Execution Sequence:');
{
  const engine = new NigerianDraughtsEngine({ boardSize: 10, ruleMode: 'nigeria' });
  for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) engine.board[r][c] = null;

  // King at (1, 1).
  // Enemy 1 at (3, 3).
  // Enemy 2 at (6, 4).
  engine.board[1][1] = { player: PLAYER_2, isKing: true };
  engine.board[3][3] = { player: PLAYER_1, isKing: false };
  engine.board[6][4] = { player: PLAYER_1, isKing: false };
  engine.currentTurn = PLAYER_2;

  // Step 1: Jump enemy 1, land at (5, 5)
  const legal1 = engine.getAllLegalMoves(PLAYER_2);
  assert(legal1.length === 1, `Step 1 has exactly 1 legal move`);
  const res1 = engine.makeMove(legal1[0]);
  assert(res1.success === true, `Step 1 makeMove succeeded`);
  assert(res1.turnEnded === false, `Step 1 does NOT end turn (multi-jump active)`);
  assert(Boolean(engine.activeMultiJump), `activeMultiJump is set`);
  assert(engine.board[5][5] !== null && engine.board[5][5].isKing, `King is now on (5, 5)`);
  // Enemy 1 at (3, 3) must still be physically on board during multi-jump
  assert(engine.board[3][3] !== null, `Jumped piece at (3, 3) remains on board until turn finishes`);

  // Step 2: Jump enemy 2, land at (7, 3) or beyond
  const legal2 = engine.getAllLegalMoves(PLAYER_2);
  assert(legal2.length > 0, `Step 2 legal moves available`);
  const step2Move = legal2[0];
  const res2 = engine.makeMove(step2Move);
  assert(res2.success === true, `Step 2 makeMove succeeded`);
  assert(res2.turnEnded === true, `Step 2 ends turn (no further captures)`);
  assert(engine.activeMultiJump === null, `activeMultiJump cleared after completion`);
  // Jumped pieces removed
  assert(engine.board[3][3] === null, `Captured piece 1 removed from board after turn ends`);
  assert(engine.board[6][4] === null, `Captured piece 2 removed from board after turn ends`);
  assert(engine.currentTurn === PLAYER_1, `Turn switched to Player 1`);
}

// -----------------------------------------------------------
// Test 4: RulesEngine (engine50) Capture Sequences Integrity
// -----------------------------------------------------------
console.log('\n4. RulesEngine 50-Square King Capture Generation:');
{
  const b = new DraughtsBoard50({ ruleMode: 'nigeria' });
  b.board.fill(EMPTY);

  // Sq 6 is (1, 1). Sq 17 is (3, 3). Sq 32 is (6, 4).
  b.board[6] = P2_KING;  // Dark King
  b.board[17] = P1_MAN;  // White Man
  b.board[32] = P1_MAN;  // White Man
  b.currentTurn = PLAYER_2;

  const caps = b.generateLegalMoves(PLAYER_2);
  // All generated captures must have jumpedSquares.length === 2 (captures both pieces)
  assert(caps.length > 0, `RulesEngine generated captures`);
  for (const cap of caps) {
    assert(cap.jumpedSquares.length === 2, `Capture sequence captures both pieces (length = 2)`);
  }
  assert(!caps.some(c => c.jumpedSquares.length === 1), `No dead-end 1-jump sequences generated when continuation exists`);
}

// -----------------------------------------------------------
// Test 5: Expert AI Engine Search on Trapped King
// -----------------------------------------------------------
console.log('\n5. Expert AI Engine Full Jump Resolution:');
{
  const engine = new NigerianDraughtsEngine({ boardSize: 10, ruleMode: 'nigeria' });
  for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) engine.board[r][c] = null;

  engine.board[1][1] = { player: PLAYER_2, isKing: true };
  engine.board[3][3] = { player: PLAYER_1, isKing: false };
  engine.board[6][4] = { player: PLAYER_1, isKing: false };
  engine.board[0][0] = { player: PLAYER_1, isKing: false };
  engine.board[0][8] = { player: PLAYER_2, isKing: false };
  engine.currentTurn = PLAYER_2;

  const ai = new NigerianDraughtsAI({ difficulty: 'expert' });
  const bestMove = ai.getBestMoveSync(engine, PLAYER_2);
  assert(bestMove !== null && bestMove.move !== null, `AI returns a valid move`);
  assert(bestMove.move.to.r === 5 && bestMove.move.to.c === 5, `AI selects continuation landing square (5, 5)`);

  const res = engine.makeMove(bestMove.move);
  assert(res.turnEnded === false, `Turn does not end after first jump; AI must continue eating`);

  const step2 = ai.getBestMoveSync(engine, PLAYER_2);
  assert(step2 !== null && step2.move !== null, `AI finds step 2 continuation`);
  const res2 = engine.makeMove(step2.move);
  assert(res2.turnEnded === true, `Turn successfully completes after final jump`);
}

console.log('\n====================================================');
console.log('ALL KING MULTI-JUMP & CAPTURE TESTS PASSED! 🎉');
console.log('====================================================\n');
