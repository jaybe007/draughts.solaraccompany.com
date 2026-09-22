import { DraughtsBoard50, P1_MAN, P2_MAN, P1_KING, P2_KING, EMPTY, PLAYER_1 } from '../js/engine50.js';

const intlWhite = [15, 20, 26, 30, 37, 39, 41, 42, 43];
const intlDark = [4, 9, 10, 11, 12, 13, 16, 36];
const intlMoves = [
  [37, 31], [36, 49], [31, 27], [49, 21], [26, 19], [9, 14],
  [20, 9], [4, 35], [15, 4], [35, 40], [39, 34], [40, 29],
  [4, 18], [29, 33], [18, 1], [11, 17], [1, 6], [17, 21],
  [6, 39], [21, 27], [39, 28]
];

const b = new DraughtsBoard50({ ruleMode: 'international' });
b.board.fill(EMPTY);
intlWhite.forEach(s => b.board[s] = P1_MAN);
intlDark.forEach(s => b.board[s] = P2_MAN);
b.currentTurn = PLAYER_1;

for (let i = 0; i < intlMoves.length; i++) {
  const [f, t] = intlMoves[i];
  if (i === 8 || i === 12) { // Before ply 9 (move 5), and before ply 13 (move 7)
    console.log(`\n=== BOARD STATE BEFORE PLY ${i + 1} (${b.currentTurn === PLAYER_1 ? 'White' : 'Black'} move ${f}-${t}) ===`);
    const w = [];
    const d = [];
    const wk = [];
    const dk = [];
    for (let s = 1; s <= 50; s++) {
      if (b.board[s] === P1_MAN) w.push(s);
      else if (b.board[s] === P1_KING) { w.push(s); wk.push(s); }
      else if (b.board[s] === P2_MAN) d.push(s);
      else if (b.board[s] === P2_KING) { d.push(s); dk.push(s); }
    }
    console.log('White pieces:', w, 'Kings:', wk);
    console.log('Dark pieces :', d, 'Kings:', dk);
  }
  const leg = b.generateLegalMoves();
  const m = leg.find(mv => mv.from === f && mv.to === t);
  b.makeMove(m);
}
