import fs from 'fs';
import { DraughtsBoard50, P1_MAN, P2_MAN, P1_KING, P2_KING, EMPTY, PLAYER_1 } from '../js/engine50.js';

const raw = fs.readFileSync('scripts/fetched_lidraughts_puzzles.json', 'utf8');
const puzzles = JSON.parse(raw);

const missingIds = [229, 248, 251, 252, 254];

for (const id of missingIds) {
  const p = puzzles.find(x => x.id === id);
  console.log(`\n=== PUZZLE ${id} ===`);
  console.log('FEN:', p.fen);
  console.log('turn:', p.parsedFEN.turn === 1 ? 'White' : 'Black');
  console.log('initialMoves:', p.initialMoves);

  const b = new DraughtsBoard50({ ruleMode: 'international' });
  b.board.fill(EMPTY);
  p.parsedFEN.whitePieces.forEach(s => b.board[s] = P1_MAN);
  p.parsedFEN.darkPieces.forEach(s => b.board[s] = P2_MAN);
  b.currentTurn = p.parsedFEN.turn;

  const legals = b.generateLegalMoves();
  console.log('Legal moves at root for turn', b.currentTurn, ':', legals.map(m => `${m.from}-${m.to}`));
}
