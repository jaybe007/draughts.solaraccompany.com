import { DraughtsBoard50, sqToRC, P1_MAN, P2_MAN, EMPTY, PLAYER_1 } from '../js/engine50.js';

const intlWhite = [15, 20, 26, 30, 37, 39, 41, 42, 43];
const intlDark = [4, 9, 10, 11, 12, 13, 16, 36];

const b = new DraughtsBoard50({ ruleMode: 'international' });
b.board.fill(EMPTY);
intlWhite.forEach(s => b.board[s] = P1_MAN);
intlDark.forEach(s => b.board[s] = P2_MAN);
b.currentTurn = PLAYER_1;

const m1 = b.generateLegalMoves().find(m => m.from === 37 && m.to === 31);
b.makeMove(m1);

const replies = b.generateLegalMoves();
for (const rep of replies) {
  console.log(`International Reply: ${rep.from}x${rep.to}`);
  console.log(`  jumpedSquares: ${JSON.stringify(rep.jumpedSquares)}`);
  for (const sq of rep.jumpedSquares) {
    const { r, c } = sqToRC(sq, true);
    console.log(`    sq ${sq}: row ${r}, col ${c}`);
  }
}
