import { TRAP_DATABASE } from '../js/traps.js';
import { NigerianDraughtsEngine, PLAYER_1, PLAYER_2 } from '../js/engine.js';

console.log('Simulating all 131 puzzles with NigerianDraughtsEngine to determine true winner...\n');

const results = [];

TRAP_DATABASE.forEach((p, idx) => {
  const mode = p.ruleset || 'nigeria';
  const engine = new NigerianDraughtsEngine({ boardSize: 10, ruleMode: mode });
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      engine.board[r][c] = null;
    }
  }

  p.initialBoard.forEach(item => {
    engine.board[item.r][item.c] = {
      player: item.player,
      isKing: Boolean(item.isKing || (item.player === 1 && item.r === 0) || (item.player === 2 && item.r === 9)),
      id: `p_${item.player}_${item.r}_${item.c}`
    };
  });

  const wStart = p.initialBoard.filter(x => x.player === 1).length;
  const bStart = p.initialBoard.filter(x => x.player === 2).length;

  const steps = p.steps || p.solution?.steps || [];
  let moveFailed = false;

  for (let sIdx = 0; sIdx < steps.length; sIdx++) {
    const s = steps[sIdx];
    const legals = engine.getAllLegalMoves(s.mover);
    const m = legals.find(x => x.from.r === s.from.r && x.from.c === s.from.c && x.to.r === s.to.r && x.to.c === s.to.c);
    if (!m) {
      moveFailed = true;
      break;
    }
    engine.makeMove(m);
  }

  let wEnd = 0, bEnd = 0, wKings = 0, bKings = 0;
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      const pc = engine.board[r][c];
      if (pc?.player === 1) {
        wEnd++;
        if (pc.isKing) wKings++;
      }
      if (pc?.player === 2) {
        bEnd++;
        if (pc.isKing) bKings++;
      }
    }
  }

  const lastStep = steps[steps.length - 1];
  const lastMover = lastStep?.mover;
  const firstMover = steps[0]?.mover;

  results.push({
    idx: idx + 1,
    id: p.id,
    title: p.title,
    ruleset: p.ruleset,
    badge: p.badge,
    category: p.category,
    wStart,
    bStart,
    wEnd,
    bEnd,
    wKings,
    bKings,
    firstMover,
    lastMover,
    moveFailed,
    stepCount: steps.length
  });
});

console.log('Analysis of all 131 puzzles:');
const whiteLast = results.filter(r => r.lastMover === 1);
const blackLast = results.filter(r => r.lastMover === 2);

console.log(`Total puzzles: ${results.length}`);
console.log(`Puzzles where White makes the final move (White wins): ${whiteLast.length}`);
console.log(`Puzzles where Black makes the final move (Black wins): ${blackLast.length}`);

console.log('\n--- Details of Puzzles where Black makes the final move ---');
blackLast.forEach(r => {
  console.log(`[#${r.idx}] ${r.id} (${r.ruleset}): "${r.title}" | End: W=${r.wEnd} (${r.wKings}K) vs B=${r.bEnd} (${r.bKings}K) | lastMover=P${r.lastMover}`);
});
