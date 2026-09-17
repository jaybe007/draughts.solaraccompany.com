import { NigerianDraughtsEngine, PLAYER_1, PLAYER_2 } from './js/engine.js';

function runTests() {
  console.log('--- RUNNING NIGERIAN DRAUGHTS ENGINE TESTS (NIGERIAN ORIENTATION) ---');

  // Test 1: Initial Board Setup 10x10
  const engine = new NigerianDraughtsEngine({ boardSize: 10 });
  const stats = engine.getStats();
  console.assert(stats.p1.total === 20, `Expected 20 P1 pieces, got ${stats.p1.total}`);
  console.assert(stats.p2.total === 20, `Expected 20 P2 pieces, got ${stats.p2.total}`);
  console.log('✓ Test 1 Passed: 10x10 setup has 20 pieces each');

  // Test 2: Nigerian Orientation - Bottom-left is LIGHT, Central Line is on right
  console.assert(engine.isDarkSquare(9, 0) === false, 'Bottom-left (9, 0) must be LIGHT square');
  console.assert(engine.isDarkSquare(9, 9) === true, 'Bottom-right (9, 9) must be DARK (Central Line start)');
  console.assert(engine.isDarkSquare(0, 0) === true, 'Top-left (0, 0) must be DARK (Central Line end)');
  console.log('✓ Test 2 Passed: Authentic Nigerian board orientation verified (Bottom-left is light, Central line on right)');

  // Test 3: Backward capture for ordinary piece (SEED / MAN)
  const testEngine = new NigerianDraughtsEngine({ boardSize: 10 });
  for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) testEngine.board[r][c] = null;
  // Place P1 man at (5, 5), and enemy P2 man behind it at (6, 6) (along Central Line)
  testEngine.board[5][5] = { player: PLAYER_1, isKing: false, id: 'test_p1' };
  testEngine.board[6][6] = { player: PLAYER_2, isKing: false, id: 'test_p2' };
  testEngine.currentTurn = PLAYER_1;

  const captures = testEngine.getAllLegalMoves(PLAYER_1);
  console.assert(captures.length === 1, `Expected 1 backward capture, got ${captures.length}`);
  console.assert(captures[0].to.r === 7 && captures[0].to.c === 7, 'Should land at (7, 7)');
  console.assert(captures[0].isCapture === true, 'Must be a capture');
  console.log('✓ Test 3 Passed: Ordinary man captures BACKWARD along Central Line!');

  // Test 4: Compulsory capture - non-capturing move not permitted if capture exists
  testEngine.board[8][0] = { player: PLAYER_1, isKing: false, id: 'test_p1_other' }; // 8+0=8 (dark)
  const allMoves = testEngine.getAllLegalMoves(PLAYER_1);
  console.assert(allMoves.every(m => m.isCapture), 'All legal moves must be captures when capture exists');
  console.log('✓ Test 4 Passed: Compulsory capture enforced!');

  // Test 5: Flying King distance slide and distance jump
  const kingEngine = new NigerianDraughtsEngine({ boardSize: 10 });
  for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) kingEngine.board[r][c] = null;
  // Place P1 King at (2, 2) on Highway
  kingEngine.board[2][2] = { player: PLAYER_1, isKing: true, id: 'king_p1' };
  const kingSlides = kingEngine.getAllLegalMoves(PLAYER_1);
  console.assert(kingSlides.length >= 8, `Flying King should have multi-step slides, got ${kingSlides.length}`);
  console.log(`✓ Test 5 Passed: Flying King sliding moves verified (${kingSlides.length} squares)`);

  // Test 6: Flying King distance capture & multiple landing options
  // Enemy at (5, 5) on Highway
  kingEngine.board[5][5] = { player: PLAYER_2, isKing: false, id: 'enemy_p2' };
  // Squares beyond along Central Line: (6, 6), (7, 7), (8, 8), (9, 9)
  const kingJumps = kingEngine.getAllLegalMoves(PLAYER_1);
  console.assert(kingJumps.every(m => m.isCapture), 'King must capture');
  console.assert(kingJumps.length === 4, `King should have 4 landing options behind enemy on Highway, got ${kingJumps.length}`);
  console.log(`✓ Test 6 Passed: Flying King distance capture has ${kingJumps.length} landing choices along Highway!`);

  console.log('ALL NIGERIAN DRAUGHTS TESTS (BOARD ORIENTATION & RULES) PASSED! 🎉');
}

runTests();
