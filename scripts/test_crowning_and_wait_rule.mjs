import { NigerianDraughtsEngine, PLAYER_1, PLAYER_2 } from '../js/engine.js';
import { RulesEngine } from '../js/rules_engine.js';
import { DraughtsBoard50, P1_MAN, P1_KING, P2_MAN, P2_KING, EMPTY } from '../js/engine50.js';

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    process.exitCode = 1;
  }
}

console.log('================================================================');
console.log('👑 CROWNING & TURN-WAIT SPECIFICATION VERIFICATION SUITE');
console.log('================================================================\n');

// ---------------------------------------------------------------------
// TEST 1: Overcrown capture -> NO crown occurs
// ---------------------------------------------------------------------
console.log('--- TEST 1: Overcrown Capture -> NO Crown Occurs ---');
{
  const engine = new NigerianDraughtsEngine({ boardSize: 10, ruleMode: 'nigeria' });
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      engine.board[r][c] = null;
    }
  }

  // Setup overcrown jump:
  // P1 seed at (2,0).
  // P2 seed at (1,1) -> jumped landing on crown square (0,2).
  // P2 seed at (1,3) -> jumped landing on non-crown square (2,4).
  engine.board[2][0] = { id: 1, player: PLAYER_1, isKing: false };
  engine.board[1][1] = { id: 2, player: PLAYER_2, isKing: false };
  engine.board[1][3] = { id: 3, player: PLAYER_2, isKing: false };
  engine.currentTurn = PLAYER_1;

  // Step 1: Jump to crown row (0,2)
  const legal1 = engine.getAllLegalMoves(PLAYER_1);
  assert(legal1.length === 1, 'Only 1 legal opening jump available');
  const res1 = engine.makeMove(legal1[0]);

  assert(res1.turnEnded === false, 'Turn does NOT end at crown row because overcrown capture continues');
  assert(res1.justPromoted === false, 'NO crown on step 1 (seed does not crown mid-chain)');
  assert(engine.board[0][2].isKing === false, 'Piece at (0,2) remains a SEED');

  // Step 2: Overcrown continuation jumping off the crown row to (2,4)
  const legal2 = engine.getAllLegalMoves(PLAYER_1);
  assert(legal2.length === 1, '1 continuation jump available to (2,4)');
  const res2 = engine.makeMove(legal2[0]);

  assert(res2.turnEnded === true, 'Turn ends after overcrown capture completes');
  assert(res2.justPromoted === false, 'NO crown when overcrown occurs (justPromoted is false)');
  assert(engine.board[2][4].isKing === false, 'Piece at (2,4) is strictly a SEED (NOT a crown)');
  assert(engine.currentTurn === PLAYER_2, 'Turn switches to Player 2');
}

// ---------------------------------------------------------------------
// TEST 2: Regular quiet crowning (Not an overcrown) -> Crowns, waits for 2nd player
// ---------------------------------------------------------------------
console.log('\n--- TEST 2: Regular Quiet Crowning -> Crowns, Must Wait for Second Player ---');
{
  const engine = new NigerianDraughtsEngine({ boardSize: 10, ruleMode: 'nigeria' });
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      engine.board[r][c] = null;
    }
  }

  // P1 seed at (1,1) advancing into (0,0) (crown square)
  engine.board[1][1] = { id: 1, player: PLAYER_1, isKing: false };
  // P2 seed elsewhere
  engine.board[7][7] = { id: 2, player: PLAYER_2, isKing: false };
  engine.currentTurn = PLAYER_1;

  const move = engine.getAllLegalMoves(PLAYER_1).find(m => m.to.r === 0 && m.to.c === 0);
  assert(!!move, 'Quiet advance to crown row (0,0) is available');

  const res = engine.makeMove(move);

  assert(res.justPromoted === true, 'When not an overcrown, piece is crowned (justPromoted = true)');
  assert(engine.board[0][0].isKing === true, 'Piece at (0,0) is now an Oba / King');
  assert(res.turnEnded === true, 'Turn ends immediately upon crowning');
  assert(engine.currentTurn === PLAYER_2, 'Turn immediately switches to second player (PLAYER_2)');

  // Verify Player 1 cannot use the crown before Player 2 plays
  const activeTurnMoves = engine.getAllLegalMoves(); // Active moves for currentTurn
  assert(engine.currentTurn === PLAYER_2, 'Active turn is PLAYER_2');
  assert(activeTurnMoves.every(m => engine.board[m.from.r][m.from.c].player === PLAYER_2), 'Active legal moves belong exclusively to Player 2');

  // Attempting to move the newly crowned king before Player 2 plays is strictly rejected
  const prematureKingMove = { from: { r: 0, c: 0 }, to: { r: 1, c: 1 } };
  const prematureAttempt = engine.makeMove(prematureKingMove);
  assert(prematureAttempt.success === false, 'Player 1 CANNOT use the crown before second player plays (makeMove rejected as Illegal move)');

  // Second player plays their move
  const p2Moves = engine.getAllLegalMoves(PLAYER_2);
  assert(p2Moves.length > 0, 'Second player has legal moves to play');
  const resP2 = engine.makeMove(p2Moves[0]);
  assert(resP2.turnEnded === true, 'Second player completed their turn');
  assert(engine.currentTurn === PLAYER_1, 'Turn returns to Player 1');

  // NOW Player 1 can use the crown!
  const p1MovesAfterP2Plays = engine.getAllLegalMoves(PLAYER_1);
  assert(p1MovesAfterP2Plays.length > 0, 'Player 1 can NOW use the crown after second player has played');
  assert(p1MovesAfterP2Plays.some(m => m.from.r === 0 && m.from.c === 0), 'Moves available for the crowned king at (0,0)');
  // Check flying king diagonal range (> 1 step available along highway)
  const kingLongSlide = p1MovesAfterP2Plays.filter(m => m.from.r === 0 && m.from.c === 0 && m.to.r > 1);
  assert(kingLongSlide.length > 0, 'Crowned piece moves with full flying king powers');
}

// ---------------------------------------------------------------------
// TEST 3: Regular capture crowning (Terminates on crown row) -> Crowns, waits for 2nd player
// ---------------------------------------------------------------------
console.log('\n--- TEST 3: Regular Capture Crowning -> Crowns, Must Wait for Second Player ---');
{
  const engine = new NigerianDraughtsEngine({ boardSize: 10, ruleMode: 'nigeria' });
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      engine.board[r][c] = null;
    }
  }

  // P1 seed at (2,2) jumps enemy at (1,3) to land on (0,4) (crown square)
  engine.board[2][2] = { id: 1, player: PLAYER_1, isKing: false };
  engine.board[1][3] = { id: 2, player: PLAYER_2, isKing: false };
  // P2 seed elsewhere
  engine.board[8][8] = { id: 3, player: PLAYER_2, isKing: false };
  engine.currentTurn = PLAYER_1;

  const capMove = engine.getAllLegalMoves(PLAYER_1)[0];
  assert(capMove.to.r === 0 && capMove.to.c === 4, 'Capture lands on crown row square (0,4)');

  const res = engine.makeMove(capMove);

  assert(res.justPromoted === true, 'Piece stopping on crown row crowns (justPromoted = true)');
  assert(engine.board[0][4].isKing === true, 'Piece at (0,4) is crowned as King');
  assert(res.turnEnded === true, 'Turn ends immediately upon crowning');
  assert(engine.currentTurn === PLAYER_2, 'Turn switches to second player (PLAYER_2)');

  // Player 1 cannot use the crown until Player 2 plays
  const activeLegalMoves = engine.getAllLegalMoves();
  assert(engine.currentTurn === PLAYER_2, 'Active turn is PLAYER_2');
  assert(activeLegalMoves.every(m => engine.board[m.from.r][m.from.c].player === PLAYER_2), 'Active moves belong to Player 2');
  const attempt = engine.makeMove({ from: { r: 0, c: 4 }, to: { r: 1, c: 5 } });
  assert(attempt.success === false, 'Player 1 cannot use crown before Player 2 plays (makeMove rejected)');

  // Player 2 plays
  const p2Move = engine.getAllLegalMoves(PLAYER_2)[0];
  engine.makeMove(p2Move);
  assert(engine.currentTurn === PLAYER_1, 'Turn returns to Player 1 after Player 2 plays');

  // Player 1 can now use crown
  const p1Moves = engine.getAllLegalMoves(PLAYER_1);
  assert(p1Moves.some(m => m.from.r === 0 && m.from.c === 4), 'Player 1 can now use the newly crowned king');
}

// ---------------------------------------------------------------------
// TEST 4: 50-Square DraughtsBoard50 Engine Crowning & Turn Switch
// ---------------------------------------------------------------------
console.log('\n--- TEST 4: 50-Square Engine (engine50.js) Crowning & Turn Switch ---');
{
  const board50 = new DraughtsBoard50({ ruleMode: 'nigeria' });
  for (let sq = 1; sq <= 50; sq++) board50.board[sq] = EMPTY;

  // P1 man at sq 6 advances to sq 1 (crown row)
  board50.board[6] = P1_MAN;
  board50.board[45] = P2_MAN;
  board50.currentTurn = PLAYER_1;

  const legalMoves = board50.generateLegalMoves(PLAYER_1);
  const crownMove = legalMoves.find(m => m.to === 1);
  assert(!!crownMove, 'Found move to square 1');
  assert(crownMove.promoted === true, 'Move to square 1 has promoted = true');

  board50.makeMove(crownMove);
  assert(board50.board[1] === P1_KING, 'Square 1 holds P1_KING');
  assert(board50.currentTurn === PLAYER_2, '50-square engine immediately switches currentTurn to PLAYER_2');

  // Player 2 plays
  const p2Legal = board50.generateLegalMoves(PLAYER_2);
  assert(p2Legal.length > 0, 'Player 2 has moves');
  board50.makeMove(p2Legal[0]);

  assert(board50.currentTurn === PLAYER_1, 'Turn returns to Player 1');
  const p1After = board50.generateLegalMoves(PLAYER_1);
  assert(p1After.some(m => m.from === 1), 'Player 1 can now use the crowned king at square 1');
}

console.log('\n================================================================');
console.log(`RESULTS: ${passedTests} / ${totalTests} assertions passed!`);
console.log('================================================================\n');
