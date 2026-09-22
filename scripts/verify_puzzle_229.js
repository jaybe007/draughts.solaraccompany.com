import { DraughtsBoard50, P1_MAN, P2_MAN, EMPTY, PLAYER_1 } from '../js/engine50.js';

// Test Puzzle 229 with root move 26-21
const b229 = new DraughtsBoard50({ ruleMode: 'international' });
b229.board.fill(EMPTY);
[16, 26, 27, 34, 40, 42, 43, 44, 49].forEach(s => b229.board[s] = P1_MAN);
[1, 4, 7, 11, 14, 18, 19, 23, 24].forEach(s => b229.board[s] = P2_MAN);
b229.currentTurn = PLAYER_1;

console.log('Puzzle 229: White plays 26-21');
const m1 = b229.generateLegalMoves().find(m => m.from === 26 && m.to === 21);
console.log('Move 26-21:', m1 ? 'LEGAL' : 'ILLEGAL');
b229.makeMove(m1);

const rep1 = b229.generateLegalMoves().find(m => m.from === 11 && m.to === 17);
console.log('Black reply 11-17:', rep1 ? 'LEGAL' : 'ILLEGAL');
b229.makeMove(rep1);

const m2 = b229.generateLegalMoves().find(m => m.from === 21 && m.to === 12);
console.log('White move 21x12:', m2 ? 'LEGAL' : 'ILLEGAL');
b229.makeMove(m2);

const rep2 = b229.generateLegalMoves().find(m => m.from === 23 && m.to === 28);
console.log('Black reply 23-28:', rep2 ? 'LEGAL' : 'ILLEGAL');
b229.makeMove(rep2);

const m3 = b229.generateLegalMoves().find(m => m.from === 12 && m.to === 32);
console.log('White move 12x32:', m3 ? 'LEGAL' : 'ILLEGAL');
b229.makeMove(m3);

const rep3 = b229.generateLegalMoves().find(m => m.from === 24 && m.to === 29);
console.log('Black reply 24-29:', rep3 ? 'LEGAL' : 'ILLEGAL');
b229.makeMove(rep3);

const m4 = b229.generateLegalMoves().find(m => m.from === 34 && m.to === 23);
console.log('White move 34x23:', m4 ? 'LEGAL' : 'ILLEGAL');
b229.makeMove(m4);

const rep4 = b229.generateLegalMoves().find(m => m.from === 19 && m.to === 50);
console.log('Black reply 19x50 (coronation!):', rep4 ? 'LEGAL' : 'ILLEGAL');
