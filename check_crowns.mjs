import { TRAP_DATABASE } from './js/traps.js';

console.log("Total puzzles:", TRAP_DATABASE.length);
let count = 0;
TRAP_DATABASE.forEach((p, idx) => {
  p.initialBoard.forEach(item => {
    if (item.player === 1 && item.r === 0 && !item.isKing) {
      console.log(`Puzzle ${idx} (${p.id}): P1 seed on row 0 (c=${item.c})`);
      count++;
    }
    if (item.player === 2 && item.r === 9 && !item.isKing) {
      console.log(`Puzzle ${idx} (${p.id}): P2 seed on row 9 (c=${item.c})`);
      count++;
    }
  });
});
console.log("Total seed on crown row:", count);
