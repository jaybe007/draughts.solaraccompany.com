import { ProfessionalPuzzleGenerator } from './js/puzzle_generator.js';
import { NigerianDraughtsEngine } from './js/engine.js';

const generator = new ProfessionalPuzzleGenerator();

function testPuzzleValid(p) {
  const steps = p.steps || p.solution?.steps || [];
  if (!steps || steps.length === 0) return { ok: false, reason: 'no steps' };

  // Duplicate check
  const seenSqs = new Set();
  for (const item of p.initialBoard) {
    const key = `${item.r},${item.c}`;
    if (seenSqs.has(key)) return { ok: false, reason: 'duplicate square ' + key };
    seenSqs.add(key);
  }

  // Non-diagonal check
  for (const s of steps) {
    const dr = Math.abs(s.from.r - s.to.r);
    const dc = Math.abs(s.from.c - s.to.c);
    if (dr === 0 || dr !== dc) return { ok: false, reason: `non-diag: (${s.from.r},${s.from.c})->(${s.to.r},${s.to.c})` };
  }

  // Engine legality check
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

  for (let sIdx = 0; sIdx < steps.length; sIdx++) {
    const s = steps[sIdx];
    const legalMoves = engine.getAllLegalMoves(s.mover);
    const match = legalMoves.find(m => m.from.r === s.from.r && m.from.c === s.from.c && m.to.r === s.to.r && m.to.c === s.to.c);
    if (!match) {
      return { ok: false, reason: `step ${sIdx} illegal for mover ${s.mover}: (${s.from.r},${s.from.c})->(${s.to.r},${s.to.c})` };
    }
    engine.makeMove(match);
  }

  return { ok: true };
}

// Test generating for each tier
console.log("Auditing generation across tiers 1..12:");
for (let t = 1; t <= 12; t++) {
  let passed = 0;
  let tried = 0;
  for (let i = 0; i < 20; i++) {
    tried++;
    const p = generator.generatePuzzle({ tier: t, ruleset: 'nigeria', theme: 'sacrifice' });
    if (p) {
      const res = testPuzzleValid(p);
      if (res.ok) passed++;
      else if (i === 0) console.log(`  Tier ${t} failure: ${p.id} - ${res.reason}`);
    }
  }
  console.log(`Tier ${t}: ${passed} / ${tried} passed engine validation`);
}
