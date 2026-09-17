import { TRAP_DATABASE } from './js/traps.js';
import { NigerianDraughtsEngine } from './js/engine.js';

const p = TRAP_DATABASE[20]; // 21st puzzle
console.log("Puzzle 21:", p.id, p.title);
console.log("Initial board:", p.initialBoard);
const steps = p.steps || p.solution.steps;
console.log("Steps:", JSON.stringify(steps, null, 2));

const engine = new NigerianDraughtsEngine({ boardSize: 10, ruleMode: p.ruleset || 'nigeria' });
for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) engine.board[r][c] = null;
p.initialBoard.forEach(item => {
  engine.board[item.r][item.c] = {
    player: item.player,
    isKing: Boolean(item.isKing || (item.player === 1 && item.r === 0) || (item.player === 2 && item.r === 9)),
    id: `p_${item.player}_${item.r}_${item.c}`
  };
});

console.log("\nStep 0:");
console.log("Turn:", engine.currentTurn);
console.log("Legal moves:", engine.getAllLegalMoves(1).map(m => `(${m.from.r},${m.from.c})->(${m.to.r},${m.to.c})[cap=${m.isCapture}]`));
const m0 = engine.getAllLegalMoves(1).find(m => m.from.r === steps[0].from.r && m.from.c === steps[0].from.c && m.to.r === steps[0].to.r && m.to.c === steps[0].to.c);

console.log("Found m0:", m0);
const res0 = engine.makeMove(m0);
console.log("After m0: turnEnded=", res0.turnEnded, "currentTurn=", engine.currentTurn);

console.log("\nStep 1:");
console.log("Turn:", engine.currentTurn);
console.log("Legal moves for P2:", engine.getAllLegalMoves(2).map(m => `(${m.from.r},${m.from.c})->(${m.to.r},${m.to.c})[cap=${m.isCapture}]`));
const m1 = engine.getAllLegalMoves(2).find(m => m.from.r === steps[1].from.r && m.from.c === steps[1].from.c && m.to.r === steps[1].to.r && m.to.c === steps[1].to.c);
console.log("Found m1:", m1);
const res1 = engine.makeMove(m1);
console.log("After m1: turnEnded=", res1.turnEnded, "currentTurn=", engine.currentTurn);

console.log("\nStep 2:");
console.log("Turn:", engine.currentTurn);
console.log("Legal moves for P1:", engine.getAllLegalMoves(1).map(m => `(${m.from.r},${m.from.c})->(${m.to.r},${m.to.c})[cap=${m.isCapture}]`));
console.log("Expected step 2:", steps[2]);
