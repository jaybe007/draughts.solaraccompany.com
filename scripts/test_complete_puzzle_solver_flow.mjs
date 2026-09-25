import { TRAP_DATABASE } from '../js/traps.js';
import { NigerianDraughtsEngine, PLAYER_1, PLAYER_2 } from '../js/engine.js';

console.log('Testing complete interactive puzzle flow on all 131 puzzles...\n');

let whitePuzzlesPassed = 0;
let blackPuzzlesPassed = 0;
let failedPuzzles = [];

TRAP_DATABASE.forEach((puzzle, pIdx) => {
  const steps = puzzle.steps || puzzle.solution?.steps || [];
  if (!steps.length) {
    failedPuzzles.push({ pIdx, id: puzzle.id, reason: 'No steps' });
    return;
  }

  const lastStep = steps[steps.length - 1];
  const solver = (puzzle.solver !== undefined)
    ? puzzle.solver
    : (lastStep && lastStep.mover === PLAYER_2 ? PLAYER_2 : PLAYER_1);

  const playerColor = solver;
  const opponentColor = playerColor === PLAYER_1 ? PLAYER_2 : PLAYER_1;

  // Board setup
  const ruleMode = puzzle.ruleset || 'nigeria';
  const engine = new NigerianDraughtsEngine({ boardSize: 10, ruleMode });
  for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) engine.board[r][c] = null;
  puzzle.initialBoard.forEach(item => {
    engine.board[item.r][item.c] = {
      player: item.player,
      isKing: Boolean(item.isKing || (item.player === 1 && item.r === 0) || (item.player === 2 && item.r === 9)),
      id: `p_${item.player}_${item.r}_${item.c}`
    };
  });
  engine.currentTurn = steps[0].mover;

  // Initial move handling
  const hasOpponentPreMove = steps.length > 0 && steps[0].mover === opponentColor;
  const initMove = puzzle.initialMove || (hasOpponentPreMove ? steps[0] : null);

  let currentStepIdx = 0;

  if (initMove) {
    // Play opponent initial move
    const legals = engine.getAllLegalMoves(opponentColor);
    const m = legals.find(x => x.from.r === initMove.from.r && x.from.c === initMove.from.c && x.to.r === initMove.to.r && x.to.c === initMove.to.c);
    if (!m) {
      failedPuzzles.push({ pIdx, id: puzzle.id, reason: `Initial opponent move ${initMove.from.r},${initMove.from.c}->${initMove.to.r},${initMove.to.c} not legal` });
      return;
    }
    engine.makeMove(m);
    if (hasOpponentPreMove && !puzzle.initialMove) {
      currentStepIdx = 1;
    }
  }

  // Now play through all steps as the player
  let puzzleOk = true;
  while (currentStepIdx < steps.length) {
    const s = steps[currentStepIdx];
    const expectedMover = s.mover;

    const legals = engine.getAllLegalMoves(expectedMover);
    const m = legals.find(x => x.from.r === s.from.r && x.from.c === s.from.c && x.to.r === s.to.r && x.to.c === s.to.c);
    if (!m) {
      failedPuzzles.push({
        pIdx,
        id: puzzle.id,
        reason: `Step ${currentStepIdx} (Mover P${expectedMover}, ${s.from.r},${s.from.c}->${s.to.r},${s.to.c}) not legal in engine`,
        availableMoves: legals.map(l => `${l.from.r},${l.from.c}->${l.to.r},${l.to.c}`)
      });
      puzzleOk = false;
      break;
    }

    engine.makeMove(m);
    currentStepIdx++;
  }

  if (puzzleOk) {
    if (playerColor === PLAYER_1) whitePuzzlesPassed++;
    else blackPuzzlesPassed++;
  }
});

console.log(`White-solver puzzles passed: ${whitePuzzlesPassed} / 43`);
console.log(`Black-solver puzzles passed: ${blackPuzzlesPassed} / 88`);
console.log(`Total puzzles passed: ${whitePuzzlesPassed + blackPuzzlesPassed} / ${TRAP_DATABASE.length}`);

if (failedPuzzles.length > 0) {
  console.log('\nFailed puzzles:', failedPuzzles.length);
  failedPuzzles.slice(0, 10).forEach(f => console.log(f));
} else {
  console.log('\n🎉 ALL 131 PUZZLES FULLY ENGINE-VALIDATED AND PLAYABLE AS SOLVER!');
}
