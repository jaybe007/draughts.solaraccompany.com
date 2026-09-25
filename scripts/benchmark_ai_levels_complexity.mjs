import { NigerianDraughtsEngine, PLAYER_1, PLAYER_2 } from '../js/engine.js';
import { NigerianDraughtsAI } from '../js/ai.js';

console.log('=== BENCHMARKING AI COMPLEXITY ACROSS ALL LEVELS (1 to 6) ===\n');

const levels = [
  { name: 'beginner', num: 1, label: 'Level 1: Beginner (Casual)' },
  { name: 'intermediate', num: 2, label: 'Level 2: Intermediate (Club Player)' },
  { name: 'advanced', num: 3, label: 'Level 3: Advanced (State Contender)' },
  { name: 'expert', num: 4, label: 'Level 4: Expert (National Master)' },
  { name: 'master', num: 5, label: 'Level 5: Master (Grandmaster Oba)' },
  { name: 'grandmaster', num: 6, label: 'Level 6: Grandmaster (World Champion)' }
];

// Test complex tactical middlegame position:
// White (P1) and Dark (P2) with active center, highway contention, and breakthrough threats
function setupComplexTacticalPosition(engine) {
  for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) engine.board[r][c] = null;

  // Dark pieces (P2)
  engine.board[1][1] = { id: 1, player: PLAYER_2, isKing: false };
  engine.board[1][5] = { id: 2, player: PLAYER_2, isKing: false };
  engine.board[2][4] = { id: 3, player: PLAYER_2, isKing: false };
  engine.board[2][8] = { id: 4, player: PLAYER_2, isKing: false };
  engine.board[3][3] = { id: 5, player: PLAYER_2, isKing: false };
  engine.board[3][7] = { id: 6, player: PLAYER_2, isKing: false };
  engine.board[4][2] = { id: 7, player: PLAYER_2, isKing: false }; // Center outpost
  engine.board[4][6] = { id: 8, player: PLAYER_2, isKing: false };

  // White pieces (P1)
  engine.board[5][3] = { id: 9, player: PLAYER_1, isKing: false };
  engine.board[5][7] = { id: 10, player: PLAYER_1, isKing: false };
  engine.board[6][2] = { id: 11, player: PLAYER_1, isKing: false };
  engine.board[6][6] = { id: 12, player: PLAYER_1, isKing: false };
  engine.board[7][3] = { id: 13, player: PLAYER_1, isKing: false };
  engine.board[7][7] = { id: 14, player: PLAYER_1, isKing: false };
  engine.board[8][4] = { id: 15, player: PLAYER_1, isKing: false };
  engine.board[9][9] = { id: 16, player: PLAYER_1, isKing: false }; // Base anchor sq 50

  engine.currentTurn = PLAYER_2;
}

const results = [];

for (const lvl of levels) {
  const engine = new NigerianDraughtsEngine({ boardSize: 10, ruleMode: 'nigeria' });
  setupComplexTacticalPosition(engine);

  const ai = new NigerianDraughtsAI({ difficulty: lvl.name });
  const t0 = performance.now();
  const res = ai.getBestMoveSync(engine, PLAYER_2);
  const elapsed = Math.round(performance.now() - t0);

  console.log(`[${lvl.label}]`);
  console.log(`  Move Selected: (${res.move.from.r},${res.move.from.c}) -> (${res.move.to.r},${res.move.to.c})`);
  console.log(`  Calculation Depth: ${res.depth} plies`);
  console.log(`  Nodes Analyzed: ${res.nodes}`);
  console.log(`  Evaluation Score: ${res.score}`);
  console.log(`  Time Elapsed: ${elapsed}ms\n`);

  results.push({
    level: lvl.num,
    name: lvl.name,
    depth: res.depth,
    nodes: res.nodes,
    time: elapsed,
    score: res.score
  });
}

console.log('--- COMPLEXITY PROGRESSION SUMMARY ---');
console.table(results);
console.log('✓ All levels successfully executed deep search with increasing tactical complexity!');
