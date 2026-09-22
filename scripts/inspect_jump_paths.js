import { DraughtsBoard50, P1_MAN, P2_MAN, P1_KING, P2_KING, EMPTY, PLAYER_1, PLAYER_2 } from '../js/engine50.js';
import { reflectIntlToNigSq } from './train_from_screenshot.js';

const intlWhite = [15, 20, 26, 30, 37, 39, 41, 42, 43];
const intlDark = [4, 9, 10, 11, 12, 13, 16, 36];

const nigWhite = intlWhite.map(reflectIntlToNigSq);
const nigDark = intlDark.map(reflectIntlToNigSq);

const b = new DraughtsBoard50({ ruleMode: 'nigeria' });
b.board.fill(EMPTY);
nigWhite.forEach(s => b.board[s] = P1_MAN);
nigDark.forEach(s => b.board[s] = P2_MAN);
b.currentTurn = PLAYER_1;

const m1 = b.generateLegalMoves().find(m => m.from === 39 && m.to === 35);
b.makeMove(m1);

const replies = b.generateLegalMoves();
for (const rep of replies) {
  console.log(`Move: ${rep.from}x${rep.to}`);
  console.log(`  jumpedSquares: ${JSON.stringify(rep.jumpedSquares)}`);
  console.log(`  pathSquares:   ${JSON.stringify(rep.pathSquares)}`);
}
