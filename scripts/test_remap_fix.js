import { TRAP_DATABASE } from '../js/traps.js';
import { NigerianDraughtsEngine } from '../js/engine.js';
import { sqToRC } from '../js/engine50.js';

console.log('--- TESTING FIX FOR INTERNATIONAL PUZZLES ---');

// Take the first broken international puzzle
const puz = TRAP_DATABASE.find(p => p.ruleset === 'international');
console.log('Original puzzle:', puz.id);
console.log('Original initialBoard:', puz.initialBoard);

// Remap using sqToRC(sq, true)
const fixedInitialBoard = puz.initialBoard.map(pc => {
  const rc = sqToRC(pc.square, true);
  return {
    ...pc,
    r: rc.r,
    c: rc.c
  };
});
console.log('Fixed initialBoard:', fixedInitialBoard);

const engine = new NigerianDraughtsEngine({ boardSize: 10, ruleMode: 'international' });
let allValid = true;
for (const pc of fixedInitialBoard) {
  const ok = engine.isValidSquare(pc.r, pc.c);
  console.log(`Square ${pc.square} at (${pc.r}, ${pc.c}): ${ok ? '✅ VALID DARK SQUARE' : '❌ INVALID'}`);
  if (!ok) allValid = false;
}

if (allValid) {
  console.log('\n🎉 EUREKA! Remapping international puzzles with sqToRC(sq, true) makes 100% of pieces valid on the true International FMJD board!');
}
