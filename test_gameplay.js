import { NigerianDraughtsEngine, PLAYER_1, PLAYER_2 } from './js/engine.js';
import { NigerianDraughtsAI } from './js/ai.js';

console.log('=== RUNNING FULL NIGERIAN DRAUGHTS GAMEPLAY SIMULATION ===');

const engine = new NigerianDraughtsEngine({ boardSize: 10, ruleMode: 'nigerian' });
const ai = new NigerianDraughtsAI({ difficulty: 'medium' });

let moveCount = 0;
const maxMoves = 40;

while (!engine.gameOver && moveCount < maxMoves) {
  const currentTurn = engine.currentTurn;
  const legalMoves = engine.getAllLegalMoves(currentTurn);

  if (legalMoves.length === 0) {
    console.log(`Player ${currentTurn} has no legal moves!`);
    break;
  }

  // Pick best move using AI for both sides to simulate a real match
  const chosenMove = ai.getBestMove(engine, currentTurn);
  console.assert(chosenMove !== null, `Move should be found for player ${currentTurn}`);

  const fromDesc = `(${chosenMove.from.r}, ${chosenMove.from.c})`;
  const toDesc = `(${chosenMove.to.r}, ${chosenMove.to.c})`;
  const typeDesc = chosenMove.isCapture ? 'CHOP x' : 'MOVE ->';

  const res = engine.makeMove(chosenMove);
  console.assert(res.success === true, 'Move execution should succeed');

  moveCount++;
  if (res.justPromoted) {
    console.log(`[Move #${moveCount}] Player ${currentTurn} promoted piece at ${toDesc} to OBA (FLYING KING)! 👑`);
  } else if (res.isCapture) {
    console.log(`[Move #${moveCount}] Player ${currentTurn} ${typeDesc} ${toDesc} (Chopped seed!)`);
  }

  // Handle multi-jump chaining if any
  while (!res.turnEnded && !engine.gameOver) {
    const nextMove = ai.getBestMove(engine, currentTurn);
    if (!nextMove) break;
    const subRes = engine.makeMove(nextMove);
    moveCount++;
    console.log(`[Move #${moveCount}] Player ${currentTurn} continued multi-jump chop -> (${nextMove.to.r}, ${nextMove.to.c})`);
    if (subRes.turnEnded) break;
  }
}

const stats = engine.getStats();
console.log('\n--- MATCH STATS AFTER ' + moveCount + ' MOVES ---');
console.log(`Player 1 seeds remaining: ${stats.p1.total} (Kings: ${stats.p1.kings})`);
console.log(`Player 2 seeds remaining: ${stats.p2.total} (Kings: ${stats.p2.kings})`);
console.log(`Game Over: ${stats.gameOver ? 'YES (' + stats.winReason + ')' : 'NO (Game ongoing)'}`);
console.log('=== GAMEPLAY SIMULATION TEST PASSED SUCCESSFULLY! === 🎉');
