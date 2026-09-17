import { TRAP_DATABASE } from './js/traps.js';
import { NigerianDraughtsEngine } from './js/engine.js';

let validPuzzles = 0;
let invalidSteps = 0;
let multiHopPuzzles = 0;

for (let i = 0; i < TRAP_DATABASE.length; i++) {
  const p = TRAP_DATABASE[i];
  const steps = p.steps || p.solution.steps;
  const engine = new NigerianDraughtsEngine({ boardSize: 10, ruleMode: p.ruleset || 'nigeria' });
  
  // Clear and setup
  for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) engine.board[r][c] = null;
  p.initialBoard.forEach(item => {
    engine.board[item.r][item.c] = {
      player: item.player,
      isKing: Boolean(item.isKing || (item.player === 1 && item.r === 0) || (item.player === 2 && item.r === 9)),
      id: `p_${item.player}_${item.r}_${item.c}`
    };
  });
  engine.currentTurn = steps[0].mover;

  if (steps.length > 1) multiHopPuzzles++;

  let stepFailed = false;
  for (let sIdx = 0; sIdx < steps.length; sIdx++) {
    const s = steps[sIdx];
    const legalMoves = engine.getAllLegalMoves(s.mover);
    const match = legalMoves.find(m => m.from.r === s.from.r && m.from.c === s.from.c && m.to.r === s.to.r && m.to.c === s.to.c);
    
    if (!match) {
      stepFailed = true;
      invalidSteps++;
      if (invalidSteps <= 10) {
        console.log(`Puzzle #${i+1} (${p.id}) step ${sIdx} NOT legal: mover=${s.mover} from=(${s.from.r},${s.from.c}) to=(${s.to.r},${s.to.c})`);
        console.log("  Available legal moves:", legalMoves.map(m => `(${m.from.r},${m.from.c})->(${m.to.r},${m.to.c})[cap=${m.isCapture}]`));
      }
      break;
    }
    const res = engine.makeMove(match);
    // makeMove automatically switches currentTurn when turnEnded === true

  }

  if (!stepFailed) validPuzzles++;
}

console.log(`\nResults: Total=${TRAP_DATABASE.length}, Valid=${validPuzzles}, Invalid=${invalidSteps}, MultiStep=${multiHopPuzzles}`);
