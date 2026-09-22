import { DraughtsBoard50, P1_MAN, P2_MAN, EMPTY, PLAYER_1 } from '../js/engine50.js';

const intlWhite = [15, 20, 26, 30, 37, 39, 41, 42, 43];
const intlDark = [4, 9, 10, 11, 12, 13, 16, 36];
const intlMoves = [
  [37, 31], [36, 49], [31, 27], [49, 21], [26, 19], [9, 14],
  [20, 9], [4, 35], [15, 4], [35, 40], [39, 34], [40, 29],
  [4, 18], [29, 33], [18, 1], [11, 17], [1, 6], [17, 21],
  [6, 39], [21, 27], [39, 28]
];

console.log('--- CHECKING WHICH PIECES ARE ACTUALLY USED IN BOYKO #1 ---');

const b = new DraughtsBoard50({ ruleMode: 'international' });
b.board.fill(EMPTY);
intlWhite.forEach(s => b.board[s] = P1_MAN);
intlDark.forEach(s => b.board[s] = P2_MAN);
b.currentTurn = PLAYER_1;

const touchedSquares = new Set();
const capturedPieces = new Set();

for (let i = 0; i < intlMoves.length; i++) {
  const [f, t] = intlMoves[i];
  touchedSquares.add(f);
  touchedSquares.add(t);
  const leg = b.generateLegalMoves();
  const m = leg.find(mv => mv.from === f && mv.to === t);
  if (m && m.jumpedSquares) {
    m.jumpedSquares.forEach(sq => capturedPieces.add(sq));
  }
  b.makeMove(m);
}

console.log('White initial pieces:', intlWhite);
console.log('Dark initial pieces :', intlDark);
console.log('Captured squares during game:', Array.from(capturedPieces).sort((a,b)=>a-b));
console.log('Final board remaining pieces:');
for (let s = 1; s <= 50; s++) {
  if (b.board[s] !== EMPTY) {
    console.log(`  Square ${s}: piece ${b.board[s]}`);
  }
}

// Now test subtracting EACH piece individually to see if the 21-ply line still holds!
console.log('\n--- TESTING SUBTRACTION OF EACH INDIVIDUAL PIECE ---');
for (const p of [...intlDark, ...intlWhite]) {
  const isWhite = intlWhite.includes(p);
  const testW = isWhite ? intlWhite.filter(s => s !== p) : [...intlWhite];
  const testD = !isWhite ? intlDark.filter(s => s !== p) : [...intlDark];

  const testB = new DraughtsBoard50({ ruleMode: 'international' });
  testB.board.fill(EMPTY);
  testW.forEach(s => testB.board[s] = P1_MAN);
  testD.forEach(s => testB.board[s] = P2_MAN);
  testB.currentTurn = PLAYER_1;

  let valid = true;
  for (let i = 0; i < intlMoves.length; i++) {
    const [f, t] = intlMoves[i];
    const leg = testB.generateLegalMoves();
    const m = leg.find(mv => mv.from === f && mv.to === t);
    if (!m) {
      valid = false;
      break;
    }
    testB.makeMove(m);
  }

  console.log(`Subtracting piece on ${p} (${isWhite ? 'White' : 'Dark'}): ${valid ? '✅ VALID! The 21-ply solution still works!' : '❌ Broken'}`);
}
