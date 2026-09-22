import { DraughtsBoard50, sqToRC, rcToSq, P1_MAN, P2_MAN, P1_KING, P2_KING, EMPTY, PLAYER_1, PLAYER_2 } from '../js/engine50.js';
import { reflectIntlToNigSq } from './train_from_screenshot.js';
import { DraughtsEvaluation50 } from '../js/evaluation.js';

console.log('=== EXPLORING SEED ADDITIONS & SUBTRACTIONS FOR NIGERIA / GHANA ===\n');

const intlWhite = [15, 20, 26, 30, 37, 39, 41, 42, 43];
const intlDark = [4, 9, 10, 11, 12, 13, 16, 36];
const nigWhite = intlWhite.map(reflectIntlToNigSq);
const nigDark = intlDark.map(reflectIntlToNigSq);

const evaluator = new DraughtsEvaluation50();

// Check if Black plays 40x29, what is the best White reply?
const b = new DraughtsBoard50({ ruleMode: 'nigeria' });
b.board.fill(EMPTY);
nigWhite.forEach(s => b.board[s] = P1_MAN);
nigDark.forEach(s => b.board[s] = P2_MAN);
b.currentTurn = PLAYER_1;

// Ply 1: White 39-35
const m1 = b.generateLegalMoves().find(m => m.from === 39 && m.to === 35);
b.makeMove(m1);

// Black plays 40x29
const m2Alt = b.generateLegalMoves().find(m => m.from === 40 && m.to === 29);
b.makeMove(m2Alt);

console.log('After Black plays 40x29 (taking only 1 piece):');
console.log('White turn. Legal moves:', b.generateLegalMoves().map(m => `${m.from}-${m.to}`));

// Let's evaluate White's position after 40x29
const score = evaluator.evaluate(b.board, PLAYER_1, null, 'nigeria');
console.log('Evaluation for White after 40x29:', score);

// Now, can we find ANY single seed addition or subtraction that makes Black 40x29 ILLEGAL or White win anyway?
console.log('\n--- Testing all single seed additions to Nigerian setup ---');
// Let's test if we can place an obstacle or change a piece so Black has only ONE capture
// Why does Black have 40x29?
// Because 40 jumps over 35 to 29.
// If 35 is NOT jumpable, or if 29 is blocked...
// Wait, can square 29 be blocked at ply 2, but cleared before ply 3?
// If a Black piece is on 29: Black cannot jump 40 over 35 to 29!
// BUT if a Black piece is on 29, can White capture it?
