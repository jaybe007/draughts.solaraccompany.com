/**
 * Test game-over feedback detection and state transitions
 */
import { NigerianDraughtsEngine, PLAYER_1, PLAYER_2 } from './js/engine.js';
import { DraughtsBoard50 } from './js/engine50.js';

console.log('=== TESTING GAME OVER ENGINE DETECTION ===\n');

// 1. Test Seed Cleared Game Over
{
  const engine = new NigerianDraughtsEngine({ boardSize: 10, ruleMode: 'nigeria' });
  // Clear all pieces
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      engine.board[r][c] = null;
    }
  }
  // Place only 1 P2 piece (Computer won by chopping all P1 pieces)
  engine.board[5][5] = { player: PLAYER_2, isKing: false };
  engine.currentTurn = PLAYER_1;
  engine.checkEndGame();

  if (engine.gameOver && engine.winner === PLAYER_2) {
    console.log('✓ PASS: Grandmaster win detected when all P1 pieces are chopped:', engine.winReason);
  } else {
    console.error('✗ FAIL: P1 wiped out did not trigger gameOver');
    process.exit(1);
  }
}

// 2. Test Player Locked (0 Legal Moves)
{
  const engine = new NigerianDraughtsEngine({ boardSize: 10, ruleMode: 'nigeria' });
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      engine.board[r][c] = null;
    }
  }
  // P1 man at corner (0, 0), trapped by P2 pieces with no diagonal jump available
  // Nigerian board: dark squares have (r + c) % 2 === 1
  // Square (0, 1) has P1 piece
  engine.board[0][1] = { player: PLAYER_1, isKing: false };
  engine.board[9][8] = { player: PLAYER_2, isKing: false };
  // Blocked forward by board boundary (cannot move row -1)
  // Nigerian ordinary seed moves forward (upwards row -1 for P1) and cannot move backward unless capturing
  // So at row 0, it has 0 moves!
  engine.currentTurn = PLAYER_1;
  const moves = engine.getAllLegalMoves(PLAYER_1);
  engine.checkEndGame();

  if (moves.length === 0 && engine.gameOver && engine.winner === PLAYER_2) {
    console.log('✓ PASS: Grandmaster win detected when P1 has 0 legal moves (Locked):', engine.winReason);
  } else {
    console.error('✗ FAIL: Locked P1 was not declared gameOver. moves:', moves.length, 'gameOver:', engine.gameOver);
    process.exit(1);
  }
}

// 3. Test 50-move King Draw
{
  const engine = new NigerianDraughtsEngine({ boardSize: 10, ruleMode: 'nigeria' });
  engine.halfMoveClock = 50;
  engine.checkEndGame();
  if (engine.gameOver && engine.winner === 'draw') {
    console.log('✓ PASS: Stalemate/Draw detected at 50 half-moves without capture:', engine.winReason);
  } else {
    console.error('✗ FAIL: 50-move rule did not trigger draw');
    process.exit(1);
  }
}

// 4. Test Draw Odds Modification
{
  const engine = new NigerianDraughtsEngine({ boardSize: 10, ruleMode: 'nigeria', modifications: 'draw_odds_p2' });
  engine.halfMoveClock = 50;
  engine.checkEndGame();
  if (engine.gameOver && engine.winner === PLAYER_2) {
    console.log('✓ PASS: Player 2 wins on Draw Odds when game drawn:', engine.winReason);
  } else {
    console.error('✗ FAIL: Draw odds did not award win to P2');
    process.exit(1);
  }
}

console.log('\n=== ALL GAME OVER ENGINE TESTS PASSED! === 🎉');
