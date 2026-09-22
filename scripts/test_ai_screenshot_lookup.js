import { DraughtsOpeningBook } from '../js/opening.js';
import { DraughtsBoard50, P1_MAN, P2_MAN, EMPTY, PLAYER_1, PLAYER_2 } from '../js/engine50.js';
import { computeZobristHash } from '../js/zobrist.js';

const book = new DraughtsOpeningBook();
const wPieces = [31, 33, 34, 36, 38, 39, 42, 44, 48];
const dPieces = [12, 13, 14, 18, 19, 22, 23, 27, 35];

const bIntl = new DraughtsBoard50({ ruleMode: 'international' });
bIntl.board.fill(EMPTY);
wPieces.forEach(sq => bIntl.board[sq] = P1_MAN);
dPieces.forEach(sq => bIntl.board[sq] = P2_MAN);
bIntl.currentTurn = PLAYER_2; // Black to move

const hashIntl = computeZobristHash(bIntl.board, PLAYER_2, 'international');
const moveIntl = book.lookup(hashIntl, bIntl.generateLegalMoves(), 'international');
console.log('Black move for Puzzle 226 from Book:', moveIntl ? `${moveIntl.from}-${moveIntl.to}` : 'None');

if (moveIntl) {
  bIntl.makeMove(moveIntl);
  const hashWhite = computeZobristHash(bIntl.board, PLAYER_1, 'international');
  const moveWhite = book.lookup(hashWhite, bIntl.generateLegalMoves(), 'international');
  console.log('White reply for Puzzle 226 from Book:', moveWhite ? `${moveWhite.from}-${moveWhite.to}` : 'None');
}
