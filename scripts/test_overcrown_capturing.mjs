import { NigerianDraughtsEngine, PLAYER_1, PLAYER_2 } from '../js/engine.js';
import { DraughtsBoard50, P1_MAN, P2_MAN, P1_KING, P2_KING, EMPTY } from '../js/engine50.js';
import { RulesEngine } from '../js/rules_engine.js';
import { NigerianDraughtsAI } from '../js/ai.js';

console.log('=== TEST SUITE: NIGERIAN DRAUGHTS OVERCROWN CAPTURE & AI LEVELS ===\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    process.exitCode = 1;
  }
}

// TEST 1: 50-Square Engine - Seed crowns mid-chain on king row and captures as flying king
console.log('Test 1: 50-Square Engine Mid-Chain Crowning to Flying King');
{
  const board = new DraughtsBoard50({ ruleMode: 'nigeria' });
  board.board.fill(EMPTY);
  // P1 man at 13. Enemy at 8. Reaching 4 (king row for P1).
  // Enemy at 15 (distance 2 from 4 along ray [9, 15, 20]). Empty at 20.
  board.board[13] = P1_MAN;
  board.board[8] = P2_MAN;
  board.board[15] = P2_MAN;
  board.currentTurn = PLAYER_1;

  const caps = board.generateLegalMoves(PLAYER_1);
  assert(caps.length === 1, `Expected 1 capture sequence, got ${caps.length}`);
  const cap = caps[0];
  assert(cap.from === 13 && cap.to === 20, `Sequence path start=13, end=20 (got from=${cap.from}, to=${cap.to})`);
  assert(cap.path.length === 3 && cap.path[1] === 4, `Mid-step landed on crown square 4 (path=${cap.path.join('->')})`);
  assert(cap.promoted === true, `Move marked as promoted`);
  assert(cap.jumpedSquares.length === 2 && cap.jumpedSquares[0] === 8 && cap.jumpedSquares[1] === 15, `Jumped both enemies 8 and 15`);
}

// TEST 2: 10x10 UI Engine - Seed crowns on step 1, stays crowned, offers flying king continuations
console.log('\nTest 2: 10x10 Engine Interactive Mid-Chain Crowning');
{
  const engine = new NigerianDraughtsEngine({ boardSize: 10, ruleMode: 'nigeria' });
  for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) engine.board[r][c] = null;
  // P1 man at (2,0). Enemy 1 at (1,1) (jump to 0,2 - crown row).
  // Enemy 2 at (2,4) - distance 2 along diagonal from (0,2).
  engine.board[2][0] = { id: 1, player: PLAYER_1, isKing: false };
  engine.board[1][1] = { id: 2, player: PLAYER_2, isKing: false };
  engine.board[2][4] = { id: 3, player: PLAYER_2, isKing: false };
  engine.currentTurn = PLAYER_1;

  const legals1 = engine.getAllLegalMoves(PLAYER_1);
  assert(legals1.length === 1, `Step 1 legal moves count is 1`);
  assert(legals1[0].promotes === true, `Step 1 promotes=true`);
  assert(legals1[0].totalChainLength === 2, `Step 1 totalChainLength evaluates to 2 (overcrown capture chain)`);

  const res1 = engine.makeMove(legals1[0]);
  assert(res1.turnEnded === false, `Turn does not end after reaching crown line (continuations exist)`);
  assert(res1.justPromoted === true, `justPromoted is true`);
  assert(engine.board[0][2].isKing === true, `Piece at (0,2) is crowned as King!`);
  assert(engine.activeMultiJump !== null, `activeMultiJump is active`);

  const legals2 = engine.getAllLegalMoves(PLAYER_1);
  assert(legals2.length === 5, `Piece has 5 flying king landing options beyond (2,4)`);
  assert(legals2.every(m => m.from.r === 0 && m.from.c === 2), `All continuations originate from crown square (0,2)`);

  // Execute flying king continuation to (4,6)
  const flyingCap = legals2.find(m => m.to.r === 4 && m.to.c === 6);
  assert(Boolean(flyingCap), `Found flying king landing at (4,6)`);
  const res2 = engine.makeMove(flyingCap);
  assert(res2.turnEnded === true, `Turn ends after second capture`);
  assert(engine.board[4][6].isKing === true, `Piece at final destination (4,6) remains a King!`);
  assert(engine.board[1][1] === null && engine.board[2][4] === null, `Both jumped pieces removed from board`);
}

// TEST 3: All AI Difficulty Levels (1 to 6) execute overcrown captures
console.log('\nTest 3: AI Difficulty Levels (1 to 6) Overcrown Execution');
{
  const levels = [
    { name: 'beginner', num: 1 },
    { name: 'intermediate', num: 2 },
    { name: 'advanced', num: 3 },
    { name: 'expert', num: 4 },
    { name: 'master', num: 5 },
    { name: 'grandmaster', num: 6 }
  ];

  for (const lvl of levels) {
    const engine = new NigerianDraughtsEngine({ boardSize: 10, ruleMode: 'nigeria' });
    for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) engine.board[r][c] = null;
    // Dark squares (r+c)%2===0:
    // P2 AI at (7,1). Enemy at (8,2). Landing at (9,3) (P2 crown row).
    // Enemy at (7,5) (distance 2 from 9,3). Landing at (6,6).
    engine.board[7][1] = { id: 1, player: PLAYER_2, isKing: false };
    engine.board[8][2] = { id: 2, player: PLAYER_1, isKing: false };
    engine.board[7][5] = { id: 3, player: PLAYER_1, isKing: false };
    engine.currentTurn = PLAYER_2;

    const ai = new NigerianDraughtsAI({ difficulty: lvl.name });
    
    // Step 1: AI jumps into crown row
    const step1 = ai.getBestMoveSync(engine, PLAYER_2);
    assert(step1 && step1.move.from.r === 7 && step1.move.to.r === 9, `Level ${lvl.num} (${lvl.name}) Step 1 jump lands on crown line`);
    
    const res1 = engine.makeMove(step1.move);
    assert(res1.turnEnded === false, `Level ${lvl.num} Turn continues for overcrown capture`);
    assert(engine.board[9][3].isKing === true, `Level ${lvl.num} Piece crowned Oba / King on row 9`);

    // Step 2: AI executes flying king capture
    const step2 = ai.getBestMoveSync(engine, PLAYER_2);
    assert(step2 && step2.move.from.r === 9 && step2.move.to.r <= 6, `Level ${lvl.num} (${lvl.name}) Step 2 jumps as flying king (landed at r=${step2?.move?.to?.r}, c=${step2?.move?.to?.c})`);
    
    const res2 = engine.makeMove(step2.move);
    assert(res2.turnEnded === true, `Level ${lvl.num} Overcrown sequence cleanly completes`);
  }
}

// TEST 4: Ghanaian Damii Rule Preservation
console.log('\nTest 4: Ghanaian Damii Rule Preservation (Ends Turn Immediately on Backline)');
{
  const board = new DraughtsBoard50({ ruleMode: 'ghana' });
  board.board.fill(EMPTY);
  board.board[13] = P1_MAN;
  board.board[8] = P2_MAN;
  board.board[9] = P2_MAN;
  board.currentTurn = PLAYER_1;

  const caps = board.generateLegalMoves(PLAYER_1);
  assert(caps.length === 1, `Damii generates 1 capture sequence`);
  assert(caps[0].to === 4, `Damii stops at square 4 on backline`);
  assert(caps[0].promoted === true, `Damii crowns piece on backline`);
}

// TEST 5: International FMJD Rule Preservation (Rule 3.5 Man Non-Promotion Mid-Chain)
console.log('\nTest 5: International FMJD Rule Preservation (FMJD Rule 3.5)');
{
  const rules = RulesEngine.getRuleProfile('international');
  const promoCheck = rules.getPromotionRules(4, true, PLAYER_1);
  assert(promoCheck.promotes === false, `FMJD does not promote mid-chain`);
  assert(promoCheck.endsTurnImmediately === false, `FMJD does not end turn immediately`);
}

console.log(`\n========================================`);
console.log(`RESULTS: ${passedTests} / ${totalTests} assertions passed!`);
if (passedTests === totalTests) {
  console.log('ALL TESTS PASSED WITH ZERO REGRESSIONS!');
} else {
  console.error('SOME TESTS FAILED!');
  process.exit(1);
}
