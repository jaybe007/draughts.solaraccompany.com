import { DraughtsBoard50, P1_MAN, P2_MAN, EMPTY, PLAYER_1 } from '../js/engine50.js';
import { DraughtsSearchEngine } from '../js/search.js';

const intlWhite = [15, 20, 26, 30, 37, 39, 41, 42, 43];
const intlDarkWithout16 = [4, 9, 10, 11, 12, 13, 36];
const intlDarkWith16 = [4, 9, 10, 11, 12, 13, 16, 36];

const search = new DraughtsSearchEngine();

console.log('--- Testing Unique Solution with Piece 16 Removed ---');
const bWithout = new DraughtsBoard50({ ruleMode: 'international' });
bWithout.board.fill(EMPTY);
intlWhite.forEach(s => bWithout.board[s] = P1_MAN);
intlDarkWithout16.forEach(s => bWithout.board[s] = P2_MAN);
bWithout.currentTurn = PLAYER_1;

const res = search.search(bWithout, 10, false);
console.log('Engine evaluation without 16:', res.score, 'best move:', `${res.bestMove.from}-${res.bestMove.to}`);

// Let's check legal moves at root
const rootLegals = bWithout.generateLegalMoves();
console.log('Root legal moves without 16:', rootLegals.map(m => `${m.from}-${m.to}`));

// Let's test if any Black move has choices during the line
const intlMoves = [
  [37, 31], [36, 49], [31, 27], [49, 21], [26, 19], [9, 14],
  [20, 9], [4, 35], [15, 4], [35, 40], [39, 34], [40, 29],
  [4, 18], [29, 33], [18, 1], [11, 17], [1, 6], [17, 21],
  [6, 39], [21, 27], [39, 28]
];

const testSim = bWithout.clone();
for (let i = 0; i < intlMoves.length; i++) {
  const [f, t] = intlMoves[i];
  const leg = testSim.generateLegalMoves();
  if (testSim.currentTurn === PLAYER_1) {
    // White turn
  } else {
    // Black turn
    if (leg.length > 1) {
      console.log(`Ply ${i+1}: Black has ${leg.length} choices without piece 16:`, leg.map(m => `${m.from}-${m.to}`));
    }
  }
  const found = leg.find(m => m.from === f && m.to === t);
  testSim.makeMove(found);
}
console.log('Finished simulation without piece 16 without error!');
