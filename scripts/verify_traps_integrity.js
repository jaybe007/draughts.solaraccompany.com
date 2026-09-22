import { TRAP_DATABASE } from '../js/traps.js';

console.log('Total puzzles in TRAP_DATABASE:', TRAP_DATABASE.length);
const boykoPuzzles = TRAP_DATABASE.filter(p => p.id.includes('BOYKO'));
console.log('Boyko master puzzles in TRAP_DATABASE:', boykoPuzzles.length);
boykoPuzzles.forEach(p => {
  console.log(`- [${p.ruleset.toUpperCase()}] ${p.id}: ${p.title} (Tier ${p.difficulty.tier} - ${p.difficulty.tier_name}, ${p.solution.steps.length} plies)`);
});
