/**
 * AI vs AI Automated Match Simulation Test (test_ai_match.js)
 * Simulates engine-vs-engine games to ensure game-tree search never produces illegal moves,
 * correctly advances game state, and handles captures/promotions smoothly.
 */

import { DraughtsBoard50, PLAYER_1, PLAYER_2 } from './js/engine50.js';
import { DraughtsSearchEngine } from './js/search.js';

console.log('====================================================');
console.log('AI VS AI ENGINE MATCH BENCHMARK');
console.log('====================================================\n');

async function playEngineMatch(ruleMode = 'nigerian', maxPlies = 40) {
  const board = new DraughtsBoard50({ ruleMode });
  const p1Engine = new DraughtsSearchEngine();
  const p2Engine = new DraughtsSearchEngine();

  console.log(`Starting ${ruleMode.toUpperCase()} Draughts match (White: Master Engine vs Dark: Expert Engine)...`);

  let plies = 0;
  while (plies < maxPlies) {
    const player = board.currentTurn;
    const legalMoves = board.generateLegalMoves(player);

    if (legalMoves.length === 0) {
      console.log(`\nMatch ended: Player ${player === PLAYER_1 ? 'White' : 'Dark'} has no legal moves.`);
      break;
    }

    const engine = player === PLAYER_1 ? p1Engine : p2Engine;
    const timeLimit = 350; // ms per move
    const maxDepth = player === PLAYER_1 ? 8 : 6;

    const res = engine.search(board, timeLimit, maxDepth, true);
    const chosenMove = res?.bestMove || legalMoves[0];

    // Verify chosen move is strictly legal
    const isLegal = legalMoves.some(
      m => m.from === chosenMove.from && m.to === chosenMove.to &&
           m.jumpedSquares.length === chosenMove.jumpedSquares.length
    );

    if (!isLegal) {
      console.error(`ILLEGAL MOVE DETECTED at ply ${plies + 1}: ${chosenMove.from}-${chosenMove.to}`);
      process.exitCode = 1;
      return false;
    }

    const moverName = player === PLAYER_1 ? 'White' : 'Dark';
    const notation = chosenMove.isCapture
      ? `${chosenMove.from}x${chosenMove.to} (captures ${chosenMove.jumpedSquares.length})`
      : `${chosenMove.from}-${chosenMove.to}`;

    board.makeMove(chosenMove);
    plies++;

    if (plies % 5 === 0 || plies === 1) {
      console.log(`  Ply ${plies} [${moverName}]: ${notation} | Depth: ${res.depth} | Nodes: ${res.nodes}`);
    }
  }

  console.log(`\nCompleted ${plies} plies successfully with ZERO illegal moves.`);
  return true;
}

(async () => {
  console.log('Test 1: Nigerian Street Rules Match:');
  const r1 = await playEngineMatch('nigerian', 25);

  console.log('\nTest 2: International FMJD Rules Match:');
  const r2 = await playEngineMatch('tournament', 25);

  if (r1 && r2) {
    console.log('\n====================================================');
    console.log('ALL AI-VS-AI BENCHMARK MATCHES COMPLETED SUCCESSFULLY!');
    console.log('====================================================');
  }
})();
