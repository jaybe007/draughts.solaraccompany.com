import { DraughtsBoard50, P1_MAN, P2_MAN, P1_KING, P2_KING, EMPTY, PLAYER_1 } from '../js/engine50.js';

const moves = [
  [4, 18], [29, 33], [18, 1], [11, 17], [1, 6], [17, 21],
  [6, 39], [21, 27], [39, 28]
];

for (const has16 of [true, false]) {
  const b = new DraughtsBoard50({ ruleMode: 'international' });
  b.board.fill(EMPTY);
  b.board[4] = P1_KING;
  b.board[11] = P2_MAN;
  b.board[29] = P2_MAN;
  if (has16) b.board[16] = P2_MAN;
  b.currentTurn = PLAYER_1;

  let valid = true;
  for (let i = 0; i < moves.length; i++) {
    const [f, t] = moves[i];
    const leg = b.generateLegalMoves();
    const found = leg.find(m => m.from === f && m.to === t);
    if (!found) {
      console.log(`With has16=${has16}, ply ${i+1} (${f}-${t}) FAILED`);
      valid = false;
      break;
    }
    b.makeMove(found);
  }
  if (valid) console.log(`With has16=${has16}, ALL 9 PLIES ARE LEGAL!`);
}
