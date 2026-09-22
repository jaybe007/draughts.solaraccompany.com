import { DraughtsBoard50, P1_MAN, P2_MAN, P1_KING, P2_KING, EMPTY, PLAYER_1, PLAYER_2 } from '../js/engine50.js';
import { reflectIntlToNigSq } from './train_from_screenshot.js';

const intlWhite = [15, 20, 26, 30, 37, 39, 41, 42, 43];
const intlDark = [4, 9, 10, 11, 12, 13, 16, 36];
const intlMoves = [
  [37, 31], [36, 49], [31, 27], [49, 21], [26, 19], [9, 14],
  [20, 9], [4, 35], [15, 4], [35, 40], [39, 34], [40, 29],
  [4, 18], [29, 33], [18, 1], [11, 17], [1, 6], [17, 21],
  [6, 39], [21, 27], [39, 28]
];

const nigWhite = intlWhite.map(reflectIntlToNigSq);
const nigDark = intlDark.map(reflectIntlToNigSq);
const nigMoves = intlMoves.map(([f, t]) => [reflectIntlToNigSq(f), reflectIntlToNigSq(t)]);

console.log('Testing with square 29 occupied by P1_MAN in Nigeria:');
const b = new DraughtsBoard50({ ruleMode: 'nigeria' });
b.board.fill(EMPTY);
nigWhite.forEach(s => b.board[s] = P1_MAN);
nigDark.forEach(s => b.board[s] = P2_MAN);
b.board[29] = P1_MAN;
b.currentTurn = PLAYER_1;

for (let i = 0; i < nigMoves.length; i++) {
  const [f, t] = nigMoves[i];
  const leg = b.generateLegalMoves();
  const found = leg.find(m => m.from === f && m.to === t);
  console.log(`Ply ${i + 1} (${b.currentTurn === PLAYER_1 ? 'White' : 'Black'} ${f}-${t}): ${found ? 'LEGAL' : 'ILLEGAL'}, options count: ${leg.length}`);
  if (!found) {
    console.log('  Legal moves were:', leg.map(m => `${m.from}-${m.to}`));
    break;
  }
  b.makeMove(found);
}
