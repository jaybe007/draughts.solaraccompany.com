import fs from 'fs';

const raw = fs.readFileSync('scripts/fetched_lidraughts_puzzles.json', 'utf8');
const puzzles = JSON.parse(raw);

console.log('--- Inspecting all 20 puzzles from DRAUGHTS IMAGE ---');
for (const p of puzzles) {
  console.log(`Puzzle #${p.id}: initialMoves count = ${p.initialMoves.length}, FEN turn = ${p.parsedFEN.turn === 1 ? 'White' : 'Black'}`);
  console.log('   initialMoves:', p.initialMoves.map(m => `${m.from}-${m.to}`).join(', '));
}
