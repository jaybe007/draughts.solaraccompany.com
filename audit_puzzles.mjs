import { TRAP_DATABASE } from './js/traps.js';
import { NigerianDraughtsEngine } from './js/engine.js';

let dupPiecesCount = 0;
let nonDiagStepCount = 0;
let engineValidCount = 0;

TRAP_DATABASE.forEach((p, idx) => {
  const steps = p.steps || p.solution?.steps || [];
  
  // Check duplicate squares
  const seenSqs = new Set();
  let hasDup = false;
  p.initialBoard.forEach(item => {
    const key = `${item.r},${item.c}`;
    if (seenSqs.has(key)) hasDup = true;
    seenSqs.add(key);
  });
  if (hasDup) dupPiecesCount++;

  // Check non-diagonal steps
  let hasNonDiag = false;
  steps.forEach(s => {
    const dr = Math.abs(s.from.r - s.to.r);
    const dc = Math.abs(s.from.c - s.to.c);
    if (dr === 0 || dr !== dc) {
      hasNonDiag = true;
    }
  });
  if (hasNonDiag) nonDiagStepCount++;
});

console.log(`Total puzzles: ${TRAP_DATABASE.length}`);
console.log(`Puzzles with duplicate pieces on same square: ${dupPiecesCount}`);
console.log(`Puzzles with non-diagonal steps: ${nonDiagStepCount}`);
