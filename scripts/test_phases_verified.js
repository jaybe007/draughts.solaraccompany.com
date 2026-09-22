import { DraughtsBoard50, sqToRC, P1_MAN, P2_MAN, P1_KING, P2_KING, EMPTY, PLAYER_1 } from '../js/engine50.js';
import { reflectIntlToNigSq } from './train_from_screenshot.js';

console.log('--- TESTING EXACT PHASES IN INTL AND NIGERIA ---');

// Phase 2: International
const p2IntlW = [15, 39];
const p2IntlD = [10, 11, 16, 35];
const p2IntlMoves = [
  [15, 4], [35, 40], [39, 34], [40, 29], [4, 18], [29, 33],
  [18, 1], [11, 17], [1, 6], [17, 21], [6, 39], [21, 27], [39, 28]
];

const b2I = new DraughtsBoard50({ ruleMode: 'international' });
b2I.board.fill(EMPTY);
p2IntlW.forEach(s => b2I.board[s] = P1_MAN);
p2IntlD.forEach(s => b2I.board[s] = P2_MAN);
b2I.currentTurn = PLAYER_1;

for (let i = 0; i < p2IntlMoves.length; i++) {
  const [f, t] = p2IntlMoves[i];
  const leg = b2I.generateLegalMoves();
  const m = leg.find(mv => mv.from === f && mv.to === t);
  if (!m) throw new Error(`Phase 2 Intl failed at ply ${i+1}: ${f}-${t}`);
  b2I.makeMove(m);
}
console.log('✓ Phase 2 International: 100% valid across all 13 plies!');

// Phase 2: Nigerian
const p2NigW = p2IntlW.map(reflectIntlToNigSq);
const p2NigD = p2IntlD.map(reflectIntlToNigSq);
const p2NigMoves = p2IntlMoves.map(([f, t]) => [reflectIntlToNigSq(f), reflectIntlToNigSq(t)]);

const b2N = new DraughtsBoard50({ ruleMode: 'nigeria' });
b2N.board.fill(EMPTY);
p2NigW.forEach(s => b2N.board[s] = P1_MAN);
p2NigD.forEach(s => b2N.board[s] = P2_MAN);
b2N.currentTurn = PLAYER_1;

for (let i = 0; i < p2NigMoves.length; i++) {
  const [f, t] = p2NigMoves[i];
  const leg = b2N.generateLegalMoves();
  const m = leg.find(mv => mv.from === f && mv.to === t);
  if (!m) throw new Error(`Phase 2 Nigeria failed at ply ${i+1}: ${f}-${t}`);
  b2N.makeMove(m);
}
console.log('✓ Phase 2 Nigeria: 100% valid across all 13 plies!');

// Phase 3: International
const p3IntlW = [4];
const p3IntlD = [11, 16, 29];
const p3IntlMoves = [
  [4, 18], [29, 33], [18, 1], [11, 17], [1, 6], [17, 21],
  [6, 39], [21, 27], [39, 28]
];

const b3I = new DraughtsBoard50({ ruleMode: 'international' });
b3I.board.fill(EMPTY);
b3I.board[4] = P1_KING;
p3IntlD.forEach(s => b3I.board[s] = P2_MAN);
b3I.currentTurn = PLAYER_1;

for (let i = 0; i < p3IntlMoves.length; i++) {
  const [f, t] = p3IntlMoves[i];
  const leg = b3I.generateLegalMoves();
  const m = leg.find(mv => mv.from === f && mv.to === t);
  if (!m) throw new Error(`Phase 3 Intl failed at ply ${i+1}: ${f}-${t}`);
  b3I.makeMove(m);
}
console.log('✓ Phase 3 International: 100% valid across all 9 plies!');

// Phase 3: Nigeria
const p3NigW = [2];
const p3NigD = p3IntlD.map(reflectIntlToNigSq);
const p3NigMoves = p3IntlMoves.map(([f, t]) => [reflectIntlToNigSq(f), reflectIntlToNigSq(t)]);

const b3N = new DraughtsBoard50({ ruleMode: 'nigeria' });
b3N.board.fill(EMPTY);
b3N.board[2] = P1_KING;
p3NigD.forEach(s => b3N.board[s] = P2_MAN);
b3N.currentTurn = PLAYER_1;

for (let i = 0; i < p3NigMoves.length; i++) {
  const [f, t] = p3NigMoves[i];
  const leg = b3N.generateLegalMoves();
  const m = leg.find(mv => mv.from === f && mv.to === t);
  if (!m) throw new Error(`Phase 3 Nigeria failed at ply ${i+1}: ${f}-${t}`);
  b3N.makeMove(m);
}
console.log('✓ Phase 3 Nigeria: 100% valid across all 9 plies!');
