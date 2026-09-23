import { NigerianDraughtsEngine, PLAYER_1, PLAYER_2 } from '../js/engine.js';

console.log('--- REPRODUCING MULTI-JUMP CORNER CROWNING BUG ---');

const engine = new NigerianDraughtsEngine({ boardSize: 10, ruleMode: 'nigeria' });
for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) engine.board[r][c] = null;

// Dark squares: (r + c) % 2 === 0
// Let's set up a 3-jump sequence in the middle of the board that does NOT touch row 9 or row 0!
// P2 (Dark) ordinary man at (3, 3).
// Jump 1: enemy at (4, 4), lands at (5, 5). (Neither row 0 nor row 9)
// Jump 2: enemy at (6, 6), lands at (7, 7). (Neither row 0 nor row 9)
// Jump 3: enemy at (6, 8), lands at (5, 9) (corner/edge of board! Neither row 0 nor row 9).
engine.board[3][3] = { id: 1, player: PLAYER_2, isKing: false };
engine.board[4][4] = { id: 2, player: PLAYER_1, isKing: false };
engine.board[6][6] = { id: 3, player: PLAYER_1, isKing: false };
engine.board[6][8] = { id: 4, player: PLAYER_1, isKing: false };
engine.currentTurn = PLAYER_2;

console.log('Initial piece isKing:', engine.board[3][3].isKing);

// Step 1: from (3,3) to (5,5)
const moves1 = engine.getAllLegalMoves(PLAYER_2);
console.log('Step 1 moves available:', moves1.map(m => `(${m.from.r},${m.from.c})->(${m.to.r},${m.to.c})`));
const step1 = moves1.find(m => m.to.r === 5 && m.to.c === 5);
const res1 = engine.makeMove(step1);
console.log('After step 1: turnEnded =', res1.turnEnded, 'isKing =', engine.board[5][5].isKing, 'activeMultiJump =', engine.activeMultiJump);

// Step 2: from (5,5) to (7,7)
const moves2 = engine.getAllLegalMoves(PLAYER_2);
console.log('Step 2 moves available:', moves2.map(m => `(${m.from.r},${m.from.c})->(${m.to.r},${m.to.c})`));
const step2 = moves2.find(m => m.to.r === 7 && m.to.c === 7);
const res2 = engine.makeMove(step2);
console.log('After step 2: turnEnded =', res2.turnEnded, 'isKing =', engine.board[7][7].isKing, 'activeMultiJump =', engine.activeMultiJump);

// Step 3: from (7,7) to (5,9) (edge/corner)
const moves3 = engine.getAllLegalMoves(PLAYER_2);
console.log('Step 3 moves available:', moves3.map(m => `(${m.from.r},${m.from.c})->(${m.to.r},${m.to.c})`));
const step3 = moves3.find(m => m.to.r === 5 && m.to.c === 9);
const res3 = engine.makeMove(step3);
console.log('After step 3: turnEnded =', res3.turnEnded, 'isKing =', engine.board[5][9].isKing);

if (engine.board[5][9].isKing) {
  console.error('\n🚨 BUG CONFIRMED: The piece at (5,9) was wrongly crowned as King even though it NEVER reached row 9!');
} else {
  console.log('\n✅ CORRECT: The piece at (5,9) is NOT a King.');
}
