// Automated simulation test of puzzles.php in Node
import { TRAP_DATABASE } from './js/traps.js';

console.log('--- Testing Puzzle Solver Execution Flow ---');

let userRating = 1500;
let streak = 0;
const solvedSet = new Set();

function simulatePuzzlePlay(puzzleIdx) {
  const puzzle = TRAP_DATABASE[puzzleIdx];
  console.log(`\nTesting Puzzle #${puzzleIdx + 1}: ${puzzle.title}`);

  const board = Array.from({ length: 10 }, () => Array(10).fill(null));
  puzzle.initialBoard.forEach(p => {
    board[p.r][p.c] = { player: p.player, isKing: p.isKing };
  });

  let stepIdx = 0;
  while (stepIdx < puzzle.steps.length) {
    const step = puzzle.steps[stepIdx];
    console.log(`  Step ${stepIdx + 1}: Mover ${step.mover} from (${step.from.r}, ${step.from.c}) to (${step.to.r}, ${step.to.c})`);

    const pc = board[step.from.r][step.from.c];
    if (!pc) throw new Error(`Missing piece at (${step.from.r}, ${step.from.c})`);

    board[step.to.r][step.to.c] = pc;
    board[step.from.r][step.from.c] = null;

    // Jumps
    const dr = step.to.r - step.from.r;
    const dc = step.to.c - step.from.c;
    if (Math.abs(dr) >= 2) {
      const stepR = dr > 0 ? 1 : -1;
      const stepC = dc > 0 ? 1 : -1;
      let currR = step.from.r + stepR;
      let currC = step.from.c + stepC;
      while (currR !== step.to.r && currC !== step.to.c) {
        board[currR][currC] = null;
        currR += stepR;
        currC += stepC;
      }
    }

    stepIdx++;
  }

  solvedSet.add(puzzle.id);
  userRating += 25;
  streak += 1;
  console.log(`  ✓ Puzzle #${puzzleIdx + 1} solved! New Rating: ${userRating}, Streak: ${streak}`);
}

for (let i = 0; i < TRAP_DATABASE.length; i++) {
  simulatePuzzlePlay(i);
}

console.log(`\nTotal solved: ${solvedSet.size} / ${TRAP_DATABASE.length}`);
console.log('Final Rating:', userRating);
console.log('All 8 puzzles simulated successfully!');
