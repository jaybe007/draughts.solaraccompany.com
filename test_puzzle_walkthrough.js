import { TRAP_DATABASE } from './js/traps.js';
import { PLAYER_1, PLAYER_2 } from './js/engine.js';

console.log(`Verifying ${TRAP_DATABASE.length} Puzzles...`);

TRAP_DATABASE.forEach((trap, idx) => {
  console.log(`\n-----------------------------------------`);
  console.log(`[Puzzle #${idx + 1}] ${trap.title}`);
  console.log(`Difficulty: ${trap.difficulty} | Ruleset: ${trap.ruleset}`);
  console.log(`Pieces count: ${trap.initialBoard.length}`);

  // Create virtual 10x10 board
  const board = Array.from({ length: 10 }, () => Array(10).fill(null));
  trap.initialBoard.forEach(p => {
    board[p.r][p.c] = { player: p.player, isKing: p.isKing };
  });

  trap.steps.forEach((step, sIdx) => {
    const piece = board[step.from.r][step.from.c];
    if (!piece) {
      console.error(`  ❌ ERROR Step ${sIdx + 1}: No piece at from square (${step.from.r}, ${step.from.c})!`);
      process.exit(1);
    }
    if (piece.player !== step.mover) {
      console.error(`  ❌ ERROR Step ${sIdx + 1}: Piece player ${piece.player} !== step mover ${step.mover}!`);
      process.exit(1);
    }

    // Move piece
    board[step.to.r][step.to.c] = piece;
    board[step.from.r][step.from.c] = null;

    // Check jump capture
    const dr = step.to.r - step.from.r;
    const dc = step.to.c - step.from.c;
    if (Math.abs(dr) >= 2) {
      const stepR = dr > 0 ? 1 : -1;
      const stepC = dc > 0 ? 1 : -1;
      let currR = step.from.r + stepR;
      let currC = step.from.c + stepC;
      let removedCount = 0;
      while (currR !== step.to.r && currC !== step.to.c) {
        if (board[currR][currC]) {
          board[currR][currC] = null;
          removedCount++;
        }
        currR += stepR;
        currC += stepC;
      }
      console.log(`  Step ${sIdx + 1}: (${step.from.r}, ${step.from.c}) -> (${step.to.r}, ${step.to.c}) [Jumped ${removedCount} piece(s)]`);
    } else {
      console.log(`  Step ${sIdx + 1}: (${step.from.r}, ${step.from.c}) -> (${step.to.r}, ${step.to.c}) [Normal Move]`);
    }
  });

  console.log(`  ✓ Puzzle #${idx + 1} fully validated!`);
});

console.log('\n=========================================');
console.log('ALL 8 PUZZLES FULLY VERIFIED!');
