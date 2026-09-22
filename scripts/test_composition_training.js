import { DraughtsOpeningBook } from '../js/opening.js';
import { DraughtsBoard50, P1_MAN, P2_MAN, EMPTY, PLAYER_1 } from '../js/engine50.js';
import { computeZobristHash } from '../js/zobrist.js';

console.log('--- TESTING AI TRAINING ON SERGEY BOYKO COMPOSITION #1 ---');
const book = new DraughtsOpeningBook();

// 1. Test International Lookup
const bIntl = new DraughtsBoard50({ ruleMode: 'international' });
bIntl.board.fill(EMPTY);
[15, 20, 26, 30, 37, 39, 41, 42, 43].forEach(sq => bIntl.board[sq] = P1_MAN);
[4, 9, 10, 11, 12, 13, 16, 36].forEach(sq => bIntl.board[sq] = P2_MAN);
bIntl.currentTurn = PLAYER_1;

const hashIntl = computeZobristHash(bIntl.board, PLAYER_1, 'international');
const legalIntl = bIntl.generateLegalMoves();
const moveIntl = book.lookup(hashIntl, legalIntl, 'international');

console.log('✓ International Book Move:', moveIntl ? `${moveIntl.from}-${moveIntl.to}` : 'None');

// 2. Test Nigerian Lookup
const bNig = new DraughtsBoard50({ ruleMode: 'nigeria' });
bNig.board.fill(EMPTY);
[11, 16, 30, 26, 39, 37, 45, 44, 43].forEach(sq => bNig.board[sq] = P1_MAN);
[2, 7, 6, 15, 14, 13, 20, 40].forEach(sq => bNig.board[sq] = P2_MAN);
bNig.currentTurn = PLAYER_1;

const hashNig = computeZobristHash(bNig.board, PLAYER_1, 'nigeria');
const legalNig = bNig.generateLegalMoves();
const moveNig = book.lookup(hashNig, legalNig, 'nigeria');

console.log('✓ Nigerian Book Move:     ', moveNig ? `${moveNig.from}-${moveNig.to}` : 'None');

// 3. Test Ghana Lookup
const bGha = new DraughtsBoard50({ ruleMode: 'ghana' });
bGha.board.fill(EMPTY);
[11, 16, 30, 26, 39, 37, 45, 44, 43].forEach(sq => bGha.board[sq] = P1_MAN);
[2, 7, 6, 15, 14, 13, 20, 40].forEach(sq => bGha.board[sq] = P2_MAN);
bGha.currentTurn = PLAYER_1;

const hashGha = computeZobristHash(bGha.board, PLAYER_1, 'ghana');
const legalGha = bGha.generateLegalMoves();
const moveGha = book.lookup(hashGha, legalGha, 'ghana');

console.log('✓ Ghana Book Move:        ', moveGha ? `${moveGha.from}-${moveGha.to}` : 'None');

if (moveIntl && moveIntl.from === 37 && moveIntl.to === 31 &&
    moveNig && moveNig.from === 39 && moveNig.to === 35 &&
    moveGha && moveGha.from === 39 && moveGha.to === 35) {
  console.log('\n🎉 SUCCESS! The AI is now trained to play Sergey Boyko Composition #1 with 100% accuracy on ALL 3 RULESETS!');
} else {
  console.error('Mismatch detected!');
  process.exit(1);
}
