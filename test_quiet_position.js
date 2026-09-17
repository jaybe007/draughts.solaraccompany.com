import { sqToRC, rcToSq } from './js/engine50.js';
import { NigerianDraughtsEngine, PLAYER_1, PLAYER_2 } from './js/engine.js';

// Let's test a quiet position:
// White: 48, 43, 38, 33 (men)
// Black: 23, 24, 18, 19 (men)
// Does White have captures?
function testQuietPosition() {
  const engine = new NigerianDraughtsEngine({ boardSize: 10, ruleMode: 'nigeria' });
  for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) engine.board[r][c] = null;

  const wSqs = [48, 43, 38, 33];
  const bSqs = [23, 24, 18, 19];

  wSqs.forEach(sq => { const { r, c } = sqToRC(sq); engine.board[r][c] = { player: PLAYER_1, isKing: false }; });
  bSqs.forEach(sq => { const { r, c } = sqToRC(sq); engine.board[r][c] = { player: PLAYER_2, isKing: false }; });

  engine.currentTurn = PLAYER_1;
  const legals = engine.getAllLegalMoves(PLAYER_1);
  console.log('Legal White moves count:', legals.length);
  console.log(legals.map(l => `${rcToSq(l.from.r, l.from.c)}-${rcToSq(l.to.r, l.to.c)} (isCapture: ${l.isCapture})`));
}

testQuietPosition();
