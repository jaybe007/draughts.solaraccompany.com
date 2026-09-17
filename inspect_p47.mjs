import { TRAP_DATABASE } from './js/traps.js';

const p = TRAP_DATABASE.find(x => x.id === 'NG-T5-DOUBLE-DIAGONAL-SQUEEZE-3462');
console.log("Puzzle 47:", JSON.stringify(p, null, 2));
