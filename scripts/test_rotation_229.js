import { DraughtsBoard50, P1_MAN, P2_MAN, EMPTY, PLAYER_1 } from '../js/engine50.js';

// Original 229 (Black solver)
// White: 16, 26, 27, 34, 40, 42, 43, 44, 49
// Black: 1, 4, 7, 11, 14, 18, 19, 23, 24
// Moves in 4.PNG:
// 1. 26-21 (White blunder) 11-17 (Black win)
// 2. 21x12 23-28
// 3. 12x32 24-29
// 4. 34x23 19x50

// Symmetrical 180-degree rotation (White solver):
const rotateSq = sq => 51 - sq;

const rotWhite = [1, 4, 7, 11, 14, 18, 19, 23, 24].map(rotateSq);
const rotDark = [16, 26, 27, 34, 40, 42, 43, 44, 49].map(rotateSq);

console.log('Rotated White:', rotWhite.sort((a,b)=>a-b));
console.log('Rotated Dark :', rotDark.sort((a,b)=>a-b));

const b = new DraughtsBoard50({ ruleMode: 'international' });
b.board.fill(EMPTY);
rotWhite.forEach(s => b.board[s] = P1_MAN);
rotDark.forEach(s => b.board[s] = P2_MAN);
b.currentTurn = PLAYER_1;

// After Black's rotated blunder: 51 - 26 to 51 - 21 = 25-30
// In original, White played 26-21, then Black replied 11-17
// Rotated moves for White:
// 1. 51-11 to 51-17 = 40-34
// 2. 51-23 to 51-28 = 28-23
// 3. 51-24 to 51-29 = 27-22
// 4. 51-19 to 51-50 = 32x1

const moves = [
  [40, 34],
  [28, 23],
  [27, 22],
  [32, 1]
];

console.log('Testing rotated moves for White solver:');
// First, White plays 40-34
const m1 = b.generateLegalMoves().find(m => m.from === 40 && m.to === 34);
console.log('Move 1 (40-34):', m1 ? 'LEGAL' : 'ILLEGAL');
b.makeMove(m1);

const rep1 = b.generateLegalMoves();
console.log('Opponent reply 1:', rep1.map(m => `${m.from}x${m.to}`));
b.makeMove(rep1[0]);

const m2 = b.generateLegalMoves().find(m => m.from === 28 && m.to === 23);
console.log('Move 2 (28-23):', m2 ? 'LEGAL' : 'ILLEGAL');
b.makeMove(m2);

const rep2 = b.generateLegalMoves();
console.log('Opponent reply 2:', rep2.map(m => `${m.from}x${m.to}`));
b.makeMove(rep2[0]);

const m3 = b.generateLegalMoves().find(m => m.from === 27 && m.to === 22);
console.log('Move 3 (27-22):', m3 ? 'LEGAL' : 'ILLEGAL');
b.makeMove(m3);

const rep3 = b.generateLegalMoves();
console.log('Opponent reply 3:', rep3.map(m => `${m.from}x${m.to}`));
b.makeMove(rep3[0]);

const m4 = b.generateLegalMoves().find(m => m.from === 32 && m.to === 1);
console.log('Move 4 (32x1 coronation to king!):', m4 ? 'LEGAL' : 'ILLEGAL');
