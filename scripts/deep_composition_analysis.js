import { DraughtsBoard50, sqToRC, rcToSq, P1_MAN, P2_MAN, P1_KING, P2_KING, EMPTY, PLAYER_1, PLAYER_2 } from '../js/engine50.js';
import { reflectIntlToNigSq } from './train_from_screenshot.js';

console.log('=== DEEP COMPOSITION ANALYSIS: SERGEY BOYKO #1 ===\n');

// Original International positions
const intlWhite = [15, 20, 26, 30, 37, 39, 41, 42, 43];
const intlDark = [4, 9, 10, 11, 12, 13, 16, 36];
const intlMoves = [
  [37, 31], [36, 49], [31, 27], [49, 21], [26, 19], [9, 14],
  [20, 9], [4, 35], [15, 4], [35, 40], [39, 34], [40, 29],
  [4, 18], [29, 33], [18, 1], [11, 17], [1, 6], [17, 21],
  [6, 39], [21, 27], [39, 28]
];

// Mirrored Nigerian/Ghanaian positions
const nigWhite = intlWhite.map(reflectIntlToNigSq);
const nigDark = intlDark.map(reflectIntlToNigSq);
const nigMoves = intlMoves.map(([f, t]) => [reflectIntlToNigSq(f), reflectIntlToNigSq(t)]);

console.log('International White:', intlWhite);
console.log('International Dark :', intlDark);
console.log('Nigerian White     :', nigWhite);
console.log('Nigerian Dark      :', nigDark);

console.log('\n--- Checking Ply 1 in International ---');
const b1 = new DraughtsBoard50({ ruleMode: 'international' });
b1.board.fill(EMPTY);
intlWhite.forEach(s => b1.board[s] = P1_MAN);
intlDark.forEach(s => b1.board[s] = P2_MAN);
b1.currentTurn = PLAYER_1;

const leg1 = b1.generateLegalMoves();
console.log('White legal moves:', leg1.map(m => `${m.from}-${m.to}`));
const m1 = leg1.find(m => m.from === 37 && m.to === 31);
b1.makeMove(m1);
console.log('White plays 37-31.');

const leg2 = b1.generateLegalMoves();
console.log('Black legal replies in FMJD:', leg2.map(m => `${m.from}x${m.to} (captures: ${m.jumpedSquares ? m.jumpedSquares.length : 0}, landed: ${m.to})`));

console.log('\n--- Checking Ply 1 in Nigeria ---');
const bNig = new DraughtsBoard50({ ruleMode: 'nigeria' });
bNig.board.fill(EMPTY);
nigWhite.forEach(s => bNig.board[s] = P1_MAN);
nigDark.forEach(s => bNig.board[s] = P2_MAN);
bNig.currentTurn = PLAYER_1;

const legN1 = bNig.generateLegalMoves();
console.log('Nigerian White legal moves:', legN1.map(m => `${m.from}-${m.to}`));
const mN1 = legN1.find(m => m.from === 39 && m.to === 35);
bNig.makeMove(mN1);
console.log('Nigerian White plays 39-35.');

const legN2 = bNig.generateLegalMoves();
console.log('Black legal replies in Nigeria (Free Choice):');
legN2.forEach(m => {
  console.log(`  ${m.from}x${m.to} (captures: ${m.jumpedSquares ? m.jumpedSquares.length : 0}, path: ${JSON.stringify(m.pathSquares || [])})`);
});
