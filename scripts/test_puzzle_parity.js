import { TRAP_DATABASE } from '../js/traps.js';
import { NigerianDraughtsEngine } from '../js/engine.js';

console.log('--- TESTING ALL PUZZLES IN TRAP_DATABASE AGAINST ENGINE ---');

let brokenCount = 0;
let validCount = 0;

for (let i = 0; i < TRAP_DATABASE.length; i++) {
  const p = TRAP_DATABASE[i];
  const engine = new NigerianDraughtsEngine({ boardSize: 10, ruleMode: p.ruleset || 'nigeria' });
  let piecesLoaded = 0;
  for (const piece of p.initialBoard) {
    if (engine.isValidSquare(piece.r, piece.c)) {
      piecesLoaded++;
    }
  }

  if (piecesLoaded !== p.initialBoard.length) {
    brokenCount++;
    if (brokenCount <= 5) {
      console.log(`❌ BROKEN: Puzzle #${i+1} [${p.id}] (${p.ruleset}): ${piecesLoaded}/${p.initialBoard.length} pieces valid!`);
      const invalid = p.initialBoard.filter(pc => !engine.isValidSquare(pc.r, pc.c));
      console.log('   Invalid pieces at:', invalid.map(pc => `r:${pc.r},c:${pc.c} (sum=${pc.r+pc.c})`));
    }
  } else {
    validCount++;
  }
}

console.log(`\nResult: ${validCount} valid, ${brokenCount} BROKEN out of ${TRAP_DATABASE.length} total puzzles!`);
