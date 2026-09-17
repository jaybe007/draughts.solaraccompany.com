import { TRAP_DATABASE } from './js/traps.js';
import { NigerianDraughtsEngine } from './js/engine.js';

const validIndices = [];
const invalidIndices = [];

for (let i = 0; i < TRAP_DATABASE.length; i++) {
  const p = TRAP_DATABASE[i];
  const steps = p.steps || p.solution?.steps || [];
  if (steps.length === 0) {
    invalidIndices.push({ i, id: p.id, reason: 'no steps' });
    continue;
  }

  // Duplicate check
  const seenSqs = new Set();
  let hasDup = false;
  p.initialBoard.forEach(item => {
    const key = `${item.r},${item.c}`;
    if (seenSqs.has(key)) hasDup = true;
    seenSqs.add(key);
  });
  if (hasDup) {
    invalidIndices.push({ i, id: p.id, reason: 'duplicate squares' });
    continue;
  }

  // Non-diagonal check
  let hasNonDiag = false;
  steps.forEach(s => {
    const dr = Math.abs(s.from.r - s.to.r);
    const dc = Math.abs(s.from.c - s.to.c);
    if (dr === 0 || dr !== dc) hasNonDiag = true;
  });
  if (hasNonDiag) {
    invalidIndices.push({ i, id: p.id, reason: 'non-diagonal steps' });
    continue;
  }

  // Engine validation
  const engine = new NigerianDraughtsEngine({ boardSize: 10, ruleMode: p.ruleset || 'nigeria' });
  for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) engine.board[r][c] = null;
  p.initialBoard.forEach(item => {
    engine.board[item.r][item.c] = {
      player: item.player,
      isKing: Boolean(item.isKing || (item.player === 1 && item.r === 0) || (item.player === 2 && item.r === 9)),
      id: `p_${item.player}_${item.r}_${item.c}`
    };
  });
  engine.currentTurn = steps[0].mover;

  let stepOk = true;
  let failReason = '';
  for (let sIdx = 0; sIdx < steps.length; sIdx++) {
    const s = steps[sIdx];
    const legalMoves = engine.getAllLegalMoves(s.mover);
    const match = legalMoves.find(m => m.from.r === s.from.r && m.from.c === s.from.c && m.to.r === s.to.r && m.to.c === s.to.c);
    if (!match) {
      stepOk = false;
      failReason = `step ${sIdx} not legal: (${s.from.r},${s.from.c})->(${s.to.r},${s.to.c})`;
      break;
    }
    engine.makeMove(match);
  }

  if (stepOk) {
    validIndices.push(i);
  } else {
    invalidIndices.push({ i, id: p.id, reason: failReason });
  }
}

console.log(`Valid puzzles count: ${validIndices.length} / ${TRAP_DATABASE.length}`);
console.log(`Invalid puzzles count: ${invalidIndices.length}`);
console.log(`First 20 valid puzzle indices:`, validIndices.slice(0, 20));
console.log(`Sample invalid reasons:`, invalidIndices.slice(0, 10));
