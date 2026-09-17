/**
 * Nigerian & International Draughts Master Engine Verification Suite
 * Tests:
 * 1. Move Generation & Bijective Coordinate Mapping
 * 2. Perft(1..3) Node Counts
 * 3. Backward Capture for Ordinary Men
 * 4. Maximum Capture Law (FMJD) vs Free Choice (Nigerian)
 * 5. Flying Kings ("Oba") Long Diagonal Glide & Multi-Square Landing
 * 6. Mid-Jump Backline Promotion Handling
 * 7. Zobrist 64-bit Hashing & Transposition Table Caching
 * 8. Search Engine Iterative Deepening, PVS, Quiescence, Time Control & Telemetry
 * 9. Endgame Analytical Tablebase
 * 10. Opening Book Repertoire
 */

import {
  EMPTY, P1_MAN, P1_KING, P2_MAN, P2_KING,
  PLAYER_1, PLAYER_2, rcToSq, sqToRC, DraughtsBoard50
} from './js/engine50.js';
import { DraughtsSearchEngine } from './js/search.js';
import { computeZobristHash, updateZobristHash } from './js/zobrist.js';
import { TranspositionTable, BOUND_EXACT } from './js/transposition.js';
import { DraughtsEvaluation50 } from './js/evaluation.js';
import { DraughtsOpeningBook } from './js/opening.js';
import { EndgameTablebaseInterface } from './js/tablebase.js';

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    process.exitCode = 1;
  }
}

function runPerft(board, depth) {
  if (depth === 0) return 1;
  const moves = board.generateLegalMoves();
  if (depth === 1) return moves.length;

  let totalNodes = 0;
  for (let i = 0; i < moves.length; i++) {
    const move = moves[i];
    const undo = board.makeMove(move);
    totalNodes += runPerft(board, depth - 1);
    board.unmakeMove(move, undo);
  }
  return totalNodes;
}

console.log('====================================================');
console.log('NAIJA DRAUGHTS GRANDMASTER ENGINE VERIFICATION SUITE');
console.log('====================================================\n');

// -----------------------------------------------------------------------------
// TEST 1: Bijective Coordinates Mapping
// -----------------------------------------------------------------------------
console.log('1. Bijective Coordinate Mapping (1..50 <-> 10x10):');
let bijectionOk = true;
for (let sq = 1; sq <= 50; sq++) {
  const { r, c } = sqToRC(sq);
  const backSq = rcToSq(r, c);
  if (backSq !== sq || (r + c) % 2 !== 0) {
    bijectionOk = false;
    break;
  }
}
assert(bijectionOk, 'All 50 dark squares map bijectively and are even parity dark squares');

// -----------------------------------------------------------------------------
// TEST 2: Initial Position Move Generation & Perft
// -----------------------------------------------------------------------------
console.log('\n2. Initial Position Move Generation & Perft:');
const initialBoard = new DraughtsBoard50({ ruleMode: 'tournament' });
const initialMoves = initialBoard.generateLegalMoves();

assert(initialMoves.length === 9, `Initial White legal moves count = ${initialMoves.length} (expected 9)`);
const p1Nodes = runPerft(initialBoard, 1);
assert(p1Nodes === 9, `Perft(1) = ${p1Nodes} (expected 9)`);

console.log('Calculating Perft(2)...');
const p2Nodes = runPerft(initialBoard, 2);
assert(p2Nodes === 81, `Perft(2) = ${p2Nodes} (expected 81)`);

console.log('Calculating Perft(3)...');
const p3Nodes = runPerft(initialBoard, 3);
assert(p3Nodes === 658, `Perft(3) = ${p3Nodes} (expected 658 standard FMJD)`);

// -----------------------------------------------------------------------------
// TEST 3: Backward Capture for Men
// -----------------------------------------------------------------------------
console.log('\n3. Backward Capture for Men:');
const bBack = new DraughtsBoard50({ ruleMode: 'nigerian' });
bBack.board.fill(EMPTY);
// P1 Man at sq 28, P2 Man behind at sq 33, sq 37 empty
bBack.board[28] = P1_MAN;
bBack.board[33] = P2_MAN;
bBack.currentTurn = PLAYER_1;
const backMoves = bBack.generateLegalMoves();
const hasBackCapture = backMoves.some(m => m.from === 28 && m.to === 37 && m.jumpedSquares.includes(33));
assert(hasBackCapture, 'White man at 28 successfully captured backward to 37 over 33');

// -----------------------------------------------------------------------------
// TEST 4: Maximum Capture Law (FMJD vs Nigerian)
// -----------------------------------------------------------------------------
console.log('\n4. Maximum Capture Law:');
// Position: P1 Man at 38 can jump 1 piece (34 to 29) OR jump 2 pieces (33 to 27 then 22 to 16)
const bMaxFMJD = new DraughtsBoard50({ ruleMode: 'tournament' });
bMaxFMJD.board.fill(EMPTY);
bMaxFMJD.board[38] = P1_MAN;
bMaxFMJD.board[34] = P2_MAN; // Single jump victim
bMaxFMJD.board[33] = P2_MAN; // First of double jump
bMaxFMJD.board[22] = P2_MAN; // Second of double jump
bMaxFMJD.currentTurn = PLAYER_1;

const fmjdMoves = bMaxFMJD.generateLegalMoves();
assert(
  fmjdMoves.length === 1 && fmjdMoves[0].jumpedSquares.length === 2,
  `FMJD enforces maximum capture: ${fmjdMoves.length} legal move(s) with ${fmjdMoves[0]?.jumpedSquares?.length} captures`
);

// Under Nigerian Street Rules, both 1-jump and 2-jump should be available
const bMaxNaija = new DraughtsBoard50({ ruleMode: 'nigerian' });
bMaxNaija.board.fill(EMPTY);
bMaxNaija.board[38] = P1_MAN;
bMaxNaija.board[34] = P2_MAN;
bMaxNaija.board[33] = P2_MAN;
bMaxNaija.board[22] = P2_MAN;
bMaxNaija.currentTurn = PLAYER_1;

const naijaMoves = bMaxNaija.generateLegalMoves();
assert(
  naijaMoves.length > 1,
  `Nigerian street rules permit player choice among compulsory captures: ${naijaMoves.length} moves available`
);

// -----------------------------------------------------------------------------
// TEST 5: Flying King ("Oba") Rules
// -----------------------------------------------------------------------------
console.log('\n5. Flying King ("Oba") Long Diagonal & Landing Choice:');
const bKing = new DraughtsBoard50({ ruleMode: 'tournament' });
bKing.board.fill(EMPTY);
// P1 King at 50 (bottom corner), P2 Man at 28
bKing.board[50] = P1_KING;
bKing.board[28] = P2_MAN;
bKing.currentTurn = PLAYER_1;

const kingMoves = bKing.generateLegalMoves();
const landingSquares = kingMoves.filter(m => m.jumpedSquares.includes(28)).map(m => m.to);
assert(
  landingSquares.includes(23) && landingSquares.includes(17) && landingSquares.includes(12) && landingSquares.includes(6) && landingSquares.includes(1),
  `Flying King can land on any square beyond jumped piece: landings = [${landingSquares.join(', ')}]`
);

// -----------------------------------------------------------------------------
// TEST 6: FMJD Mid-Jump Backline Promotion Rule
// -----------------------------------------------------------------------------
console.log('\n6. FMJD Mid-Jump Backline Promotion Rule:');
const bPromo = new DraughtsBoard50({ ruleMode: 'tournament' });
bPromo.board.fill(EMPTY);
// P1 Man at 15. Jump P2 Man at 9 to 4 (backline), then jump P2 Man at 8 to 13.
bPromo.board[15] = P1_MAN;
bPromo.board[9] = P2_MAN;
bPromo.board[8] = P2_MAN;
bPromo.currentTurn = PLAYER_1;

const promoMoves = bPromo.generateLegalMoves();
const multiJumpThroughBackline = promoMoves.find(m => m.path && m.path.includes(4) && m.to === 13);
assert(
  multiJumpThroughBackline !== undefined,
  'Man successfully executes multi-jump passing through rank 1 without stopping'
);

if (multiJumpThroughBackline) {
  const undo = bPromo.makeMove(multiJumpThroughBackline);
  assert(
    bPromo.board[13] === P1_MAN,
    `Piece landing at final square 13 remains a MAN (${bPromo.board[13]} === ${P1_MAN}) because it did not rest on backline`
  );
  bPromo.unmakeMove(multiJumpThroughBackline, undo);
}

// -----------------------------------------------------------------------------
// TEST 7: Zobrist Hashing & Transposition Table
// -----------------------------------------------------------------------------
console.log('\n7. Zobrist 64-bit Hashing & Transposition Table:');
const bHash = new DraughtsBoard50({ ruleMode: 'tournament' });
const h1 = computeZobristHash(bHash.board, bHash.currentTurn);
const moves = bHash.generateLegalMoves();
const h2 = updateZobristHash(h1, moves[0]);
assert(h1 !== h2, 'Hash changes after move');

const tt = new TranspositionTable(14); // 2^14 entries
tt.store(h1, 5, 120, BOUND_EXACT, moves[0]);
const probe = tt.probe(h1);
assert(probe && probe.hit && probe.score === 120 && probe.bestMoveFrom === moves[0].from, 'TT successfully stores and probes entries');

// -----------------------------------------------------------------------------
// TEST 8: Evaluation & DraughtsSearchEngine
// -----------------------------------------------------------------------------
console.log('\n8. Evaluation & DraughtsSearchEngine:');
const evaluator = new DraughtsEvaluation50();
const evalStart = evaluator.evaluate(bHash.board, bHash.currentTurn);
assert(evalStart === 0, `Initial position evaluation is balanced = ${evalStart}`);

const search = new DraughtsSearchEngine();
let telemetryFired = false;
search.onTelemetry = (data) => {
  telemetryFired = true;
};

console.log('Running Deep Game-Tree Search without book (depth 5, 1000ms budget)...');
const searchRes = search.search(bHash, 1000, 5, false);

assert(searchRes && searchRes.bestMove, `Search returned valid bestMove: ${searchRes.bestMove?.from}-${searchRes.bestMove?.to}`);
assert(searchRes.depth >= 2, `Search reached depth ${searchRes.depth}`);
assert(searchRes.nodes > 20, `Search explored ${searchRes.nodes} nodes`);
assert(telemetryFired, 'Live Telemetry callback successfully received streaming stats');

// -----------------------------------------------------------------------------
// TEST 9: Endgame Tablebase / Analytical Solver
// -----------------------------------------------------------------------------
console.log('\n9. Endgame Tablebase & Analytical Solver:');
const tb = new EndgameTablebaseInterface();
const bEndgame = new DraughtsBoard50({ ruleMode: 'nigerian' });
bEndgame.board.fill(EMPTY);
bEndgame.board[46] = P1_KING; // White King
bEndgame.board[5] = P2_KING;  // Black King
bEndgame.currentTurn = PLAYER_1;

const tbEval = tb.probe(bEndgame);
assert(tbEval !== null, `Tablebase recognized endgame configuration: eval = ${tbEval?.score}`);

// -----------------------------------------------------------------------------
// TEST 10: Opening Book Repertoire
// -----------------------------------------------------------------------------
console.log('\n10. Opening Book Repertoire:');
const book = new DraughtsOpeningBook();
const bookMove = book.lookup(h1, moves);
assert(bookMove !== null, `Opening book returned master move for initial position: ${bookMove?.from}-${bookMove?.to}`);

// -----------------------------------------------------------------------------
// SUMMARY
// -----------------------------------------------------------------------------
console.log('\n====================================================');
console.log(`TEST SUITE RESULTS: ${passedTests} / ${totalTests} TESTS PASSED`);
console.log('====================================================');
if (passedTests === totalTests) {
  console.log('ALL TESTS PASSED WITH 100% ACCURACY!');
} else {
  console.error(`FAILED ${totalTests - passedTests} TESTS`);
}
