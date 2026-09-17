import { TRAP_DATABASE, TrapAcademyController } from './js/traps.js';
import { NigerianDraughtsEngine, PLAYER_1, PLAYER_2 } from './js/engine.js';
import { sound } from './js/audio.js';

console.log('====================================================');
console.log('STREET TRAP ACADEMY & TACTICAL MASTER TEST SUITE');
console.log('====================================================\n');

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  }
  console.log(`  ✓ PASS: ${message}`);
}

// 1. Trap Database Schema & Integrity
console.log('1. Trap Database Schema Integrity:');
assert(Array.isArray(TRAP_DATABASE) && TRAP_DATABASE.length >= 6, `Database contains ${TRAP_DATABASE.length} master traps (expected >= 6)`);

TRAP_DATABASE.forEach((trap, idx) => {
  assert(Boolean(trap.id && trap.title && trap.category), `[Trap #${idx + 1}] ID, title, and category present: "${trap.title}"`);
  assert(Array.isArray(trap.initialBoard) && trap.initialBoard.length > 0, `[Trap #${idx + 1}] Initial board pieces defined (${trap.initialBoard.length} pieces)`);
  assert(Array.isArray(trap.steps) && trap.steps.length > 0, `[Trap #${idx + 1}] Tactical solution steps defined (${trap.steps.length} steps)`);

  // Verify coordinates
  trap.initialBoard.forEach((p, pIdx) => {
    assert(p.r >= 0 && p.r < 10 && p.c >= 0 && p.c < 10, `[Trap #${idx + 1}] Piece #${pIdx} in bounds (${p.r}, ${p.c})`);
    assert((p.r + p.c) % 2 === 0, `[Trap #${idx + 1}] Piece #${pIdx} on dark playable square`);
  });
});

// 2. Playthrough Validation for Every Trap in Database
console.log('\n2. Interactive Playthrough Verification of Traps:');

TRAP_DATABASE.forEach((trap, idx) => {
  console.log(`\nTesting Trap #${idx + 1}: ${trap.title} (${trap.category})`);
  const engine = new NigerianDraughtsEngine({ boardSize: 10, ruleMode: trap.ruleset });

  // Clear board
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      engine.board[r][c] = null;
    }
  }

  // Load initial pieces
  trap.initialBoard.forEach(p => {
    engine.board[p.r][p.c] = {
      player: p.player,
      isKing: Boolean(p.isKing)
    };
  });
  engine.currentTurn = trap.startingTurn || PLAYER_1;

  // Execute steps sequentially
  trap.steps.forEach((step, stepIdx) => {
    const legalMoves = engine.getAllLegalMoves(step.mover);
    assert(legalMoves.length > 0, `Step #${stepIdx + 1} mover ${step.mover} has legal moves (count: ${legalMoves.length})`);

    const matchingMove = legalMoves.find(
      m => m.from.r === step.from.r && m.from.c === step.from.c &&
           m.to.r === step.to.r && m.to.c === step.to.c
    );

    assert(Boolean(matchingMove), `Step #${stepIdx + 1} (${step.from.r},${step.from.c}) -> (${step.to.r},${step.to.c}) is a legal engine move`);
    const res = engine.makeMove(matchingMove);
    assert(res.success === true, `Step #${stepIdx + 1} executed successfully: turnEnded=${res.turnEnded}`);
  });

  assert(true, `Trap #${idx + 1} ("${trap.title}") completed full sequence with 100% engine compliance!`);
});

// 3. Audio Procedural Trap Sound Verification
console.log('\n3. Procedural Audio Synthesis Verification:');
assert(typeof sound.playTrap === 'function', 'sound.playTrap function exists on SoundController');
assert(typeof sound.playCapture === 'function', 'sound.playCapture function exists');
assert(typeof sound.playKing === 'function', 'sound.playKing function exists');
// Test calling without crash in Node environment (ctx is mocked/null in node)
sound.playTrap();
assert(true, 'sound.playTrap() executed cleanly without throwing');

console.log('\n====================================================');
console.log('ALL TACTICAL TRAP ACADEMY TESTS PASSED (100%)! 🎉');
console.log('====================================================\n');
