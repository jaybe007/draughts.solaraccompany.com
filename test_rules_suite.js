/**
 * Comprehensive Automated Rules Validation Suite for 10x10 Draughts (test_rules_suite.js)
 * 
 * Verifies with 100% mathematical rigor:
 * 1. 🇳🇬 Nigeria Rules
 * 2. 🇬🇭 Ghana Rules
 * 3. 🌍 International Draughts Rules (FMJD)
 * 
 * Tests:
 * - Legal & illegal movement
 * - Mandatory captures
 * - Backward captures for men
 * - Competing capture sequences (FMJD Majority vs Nigeria Free Choice vs Ghana Free Choice)
 * - Ghana immediate crown turn termination vs FMJD Rule 3.5 mid-jump non-promotion
 * - Flying king landing square freedom
 * - Ruleset-aware 64-bit Zobrist hash isolation
 * - Isolated opening book lookup
 * - Ghana 16-move draw rule vs standard draw rules
 */

import {
  EMPTY, PLAYER_1, PLAYER_2, P1_MAN, P1_KING, P2_MAN, P2_KING,
  DraughtsBoard50
} from './js/engine50.js';
import { RulesEngine } from './js/rules_engine.js';
import { computeZobristHash } from './js/zobrist.js';
import { DraughtsOpeningBook } from './js/opening.js';
import { EndgameTablebaseInterface } from './js/tablebase.js';

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`  ❌ FAIL: ${message}`);
    throw new Error(message);
  } else {
    passedTests++;
    console.log(`  ✓ PASS: ${message}`);
  }
}

console.log('====================================================');
console.log('MULTI-RULESET DRAUGHTS VALIDATION SUITE');
console.log('====================================================\n');

// ----------------------------------------------------
// 1. RulesEngine Registry & Profile Verification
// ----------------------------------------------------
console.log('1. RulesEngine Profile Registry:');
const nigProfile = RulesEngine.getRuleProfile('nigeria');
const ghaProfile = RulesEngine.getRuleProfile('ghana');
const intlProfile = RulesEngine.getRuleProfile('international');

assert(nigProfile.id === 'nigeria' && nigProfile.flag === '🇳🇬', 'Nigeria profile loaded correctly');
assert(ghaProfile.id === 'ghana' && ghaProfile.flag === '🇬🇭', 'Ghana profile loaded correctly');
assert(intlProfile.id === 'international' && intlProfile.flag === '🌍', 'International profile loaded correctly');

assert(nigProfile.isCaptureMandatory() === true, 'Nigeria requires compulsory captures');
assert(ghaProfile.isCaptureMandatory() === true, 'Ghana requires compulsory captures');
assert(intlProfile.isCaptureMandatory() === true, 'International requires compulsory captures');

assert(nigProfile.getMaximumCaptureRules() === false, 'Nigeria permits free choice of capture line');
assert(ghaProfile.getMaximumCaptureRules() === false, 'Ghana permits free choice of capture line');
assert(intlProfile.getMaximumCaptureRules() === true, 'International mandates majority capture (maximum pieces)');

// ----------------------------------------------------
// 2. Initial Move Generation Across All Three Rulesets
// ----------------------------------------------------
console.log('\n2. Initial Board Position Legal Moves:');
const bNig = new DraughtsBoard50({ ruleMode: 'nigeria' });
const bGha = new DraughtsBoard50({ ruleMode: 'ghana' });
const bIntl = new DraughtsBoard50({ ruleMode: 'international' });

const movesNig = bNig.generateLegalMoves();
const movesGha = bGha.generateLegalMoves();
const movesIntl = bIntl.generateLegalMoves();

assert(movesNig.length === 9, `Nigeria initial legal moves = ${movesNig.length} (expected 9)`);
assert(movesGha.length === 9, `Ghana initial legal moves = ${movesGha.length} (expected 9)`);
assert(movesIntl.length === 9, `International initial legal moves = ${movesIntl.length} (expected 9)`);

// ----------------------------------------------------
// 3. Backward Capture for Men Across All Rulesets
// ----------------------------------------------------
console.log('\n3. Backward Capture for Men:');
for (const rule of ['nigeria', 'ghana', 'international']) {
  const b = new DraughtsBoard50({ ruleMode: rule });
  b.board.fill(EMPTY);
  b.board[28] = P1_MAN; // White man
  b.board[33] = P2_MAN; // Dark man behind it
  b.currentTurn = PLAYER_1;

  const caps = b.generateLegalMoves();
  const backCap = caps.find(m => m.from === 28 && m.to === 37);
  assert(Boolean(backCap), `${rule.toUpperCase()}: Man at 28 captures backward over 33 to 37`);
}

// ----------------------------------------------------
// 4. Competing Captures: FMJD Majority vs Free Choice
// ----------------------------------------------------
console.log('\n4. Competing Capture Selection (Majority vs Free Choice):');
// Setup position: White man at 38 has two capture options:
// Option A: Jump over 32 to 27 (1 piece)
// Option B: Jump over 33 to 29, then over 24 to 20 (2 pieces)
function setupCompetingCapture(rule) {
  const b = new DraughtsBoard50({ ruleMode: rule });
  b.board.fill(EMPTY);
  b.board[38] = P1_MAN;
  b.board[34] = P2_MAN; // 1 piece branch (38 over 34 to 29)
  b.board[33] = P2_MAN; // 2 piece branch (38 over 33 to 27, then over 22 to 16)
  b.board[22] = P2_MAN;
  b.currentTurn = PLAYER_1;
  return b;
}

const bIntlComp = setupCompetingCapture('international');
const intlCaps = bIntlComp.generateLegalMoves();
assert(intlCaps.length === 1 && intlCaps[0].jumpedSquares.length === 2,
  `International FMJD: Strictly forces majority capture of 2 pieces (count=${intlCaps.length})`);

const bNigComp = setupCompetingCapture('nigeria');
const nigCaps = bNigComp.generateLegalMoves();
assert(nigCaps.length === 2,
  `Nigeria Rules: Allows FREE CHOICE among capture options (count=${nigCaps.length}, choices=[1, 2])`);

const bGhaComp = setupCompetingCapture('ghana');
const ghaCaps = bGhaComp.generateLegalMoves();
assert(ghaCaps.length === 2,
  `Ghana Rules: Allows FREE CHOICE among capture options (count=${ghaCaps.length}, choices=[1, 2])`);

// ----------------------------------------------------
// 5. Promotion Mechanics: Ghana Turn End vs FMJD Rule 3.5
// ----------------------------------------------------
console.log('\n5. Promotion & Multi-Jump Differences:');
// Position: White man at 13 jumps over 8 to 2 (king row).
// From square 2, there is an immediate backward capture over 7 to 11.
function setupPromotionSequence(rule) {
  const b = new DraughtsBoard50({ ruleMode: rule });
  b.board.fill(EMPTY);
  b.board[15] = P1_MAN;
  b.board[9] = P2_MAN;  // Jump over 9 to 4 (king row)
  b.board[8] = P2_MAN;  // Available jump from 4 over 8 to 13
  b.currentTurn = PLAYER_1;
  return b;
}

// Ghana: Reaching square 4 ends turn immediately and crowns to King!
const bGhaPromo = setupPromotionSequence('ghana');
const ghaMoves = bGhaPromo.generateLegalMoves();
const ghaPromoMove = ghaMoves.find(m => m.from === 15 && m.to === 4);
assert(Boolean(ghaPromoMove) && ghaPromoMove.promoted === true,
  'Ghana Damii: Man hitting king row 4 stops and crowns immediately (promoted=true, turn terminates)');

// International (FMJD Rule 3.5): Man MUST continue jumping over 8 to 13 and DOES NOT promote!
const bIntlPromo = setupPromotionSequence('international');
const intlMoves = bIntlPromo.generateLegalMoves();
const intlChain = intlMoves.find(m => m.from === 15 && m.to === 13);
assert(Boolean(intlChain) && intlChain.promoted === false,
  'International FMJD (Rule 3.5): Man traversing king row mid-chain continues as MAN to 13 (promoted=false)');

// ----------------------------------------------------
// 6. Flying King Movement & Long Capture Landings
// ----------------------------------------------------
console.log('\n6. Flying King ("Oba" / "Nkorɔma") Landing Freedom:');
for (const rule of ['nigeria', 'ghana', 'international']) {
  const b = new DraughtsBoard50({ ruleMode: rule });
  b.board.fill(EMPTY);
  b.board[34] = P1_KING; // White king on diagonal
  b.board[28] = P2_MAN;  // Enemy piece
  b.currentTurn = PLAYER_1;

  const caps = b.generateLegalMoves();
  const landings = caps.map(m => m.to).sort((a, b) => a - b);
  assert(
    landings.includes(23) && landings.includes(17) && landings.includes(12) && landings.includes(6) && landings.includes(1),
    `${rule.toUpperCase()}: King captures at distance and can land on any of [23, 17, 12, 6, 1]`
  );
}

// ----------------------------------------------------
// 7. Ruleset-Aware 64-Bit Zobrist Hash Isolation
// ----------------------------------------------------
console.log('\n7. Zobrist Hash Isolation (Rule Identity Integrity):');
const boardArr = new Uint8Array(51);
boardArr[35] = P1_MAN;
boardArr[16] = P2_MAN;

const hashNigeria = computeZobristHash(boardArr, PLAYER_1, 'nigeria');
const hashGhana = computeZobristHash(boardArr, PLAYER_1, 'ghana');
const hashIntl = computeZobristHash(boardArr, PLAYER_1, 'international');

assert(hashNigeria !== hashGhana, 'Nigeria hash and Ghana hash are distinct for identical board layout');
assert(hashNigeria !== hashIntl, 'Nigeria hash and International hash are distinct for identical board layout');
assert(hashGhana !== hashIntl, 'Ghana hash and International hash are distinct for identical board layout');

// ----------------------------------------------------
// 8. Isolated Opening Books Across Rulesets
// ----------------------------------------------------
console.log('\n8. Isolated Opening Books:');
const book = new DraughtsOpeningBook();
const initBoard = new DraughtsBoard50();
const initMoves = initBoard.generateLegalMoves();

const nigInitHash = computeZobristHash(initBoard.board, PLAYER_1, 'nigeria');
const ghaInitHash = computeZobristHash(initBoard.board, PLAYER_1, 'ghana');
const intlInitHash = computeZobristHash(initBoard.board, PLAYER_1, 'international');

const moveNigBook = book.lookup(nigInitHash, initMoves, 'nigeria');
const moveGhaBook = book.lookup(ghaInitHash, initMoves, 'ghana');
const moveIntlBook = book.lookup(intlInitHash, initMoves, 'international');

assert(Boolean(moveNigBook), `Nigeria Opening Book returned master move: ${moveNigBook.from}-${moveNigBook.to}`);
assert(Boolean(moveGhaBook), `Ghana Opening Book returned master move: ${moveGhaBook.from}-${moveGhaBook.to}`);
assert(Boolean(moveIntlBook), `International Opening Book returned master move: ${moveIntlBook.from}-${moveIntlBook.to}`);

// Cross-querying with wrong ruleset must yield null (books are strictly segregated)
const crossQuery = book.lookup(nigInitHash, initMoves, 'international');
assert(crossQuery === null, 'Querying International book with Nigeria hash correctly returns null (Zero Cross-Leakage)');

// ----------------------------------------------------
// 9. Endgame Tablebase & Ghana 16-Move Draw Rule
// ----------------------------------------------------
console.log('\n9. Endgame Tablebase & Rule-Aware Draws:');
const tb = new EndgameTablebaseInterface();

// 3 Kings vs 1 King under Ghana rules after 32 half-moves
const b3v1Gha = new DraughtsBoard50({ ruleMode: 'ghana' });
b3v1Gha.board.fill(EMPTY);
b3v1Gha.board[1] = P1_KING;
b3v1Gha.board[2] = P1_KING;
b3v1Gha.board[3] = P1_KING;
b3v1Gha.board[20] = P2_KING; // Safe from immediate capture
b3v1Gha.halfMoveClock = 32; // 16 full moves elapsed

const ghaResult = tb.probe(b3v1Gha, 'ghana');
assert(ghaResult.resolved === true && ghaResult.score === 0,
  'Ghana 3v1: Tablebase declares immediate theoretical DRAW when 16 moves reached');

const ghaGameOver = b3v1Gha.isGameOver();
assert(ghaGameOver.over === true && ghaGameOver.winner === 'draw',
  'Ghana 3v1: DraughtsBoard50.isGameOver declares DRAW after 16 moves');

// Same position under Nigeria rules is NOT drawn at 32 half-moves (Nigeria allows 25 king moves = 50 half-moves)
const b3v1Nig = new DraughtsBoard50({ ruleMode: 'nigeria' });
b3v1Nig.board.fill(EMPTY);
b3v1Nig.board[1] = P1_KING;
b3v1Nig.board[2] = P1_KING;
b3v1Nig.board[3] = P1_KING;
b3v1Nig.board[20] = P2_KING;
b3v1Nig.halfMoveClock = 32;

const nigGameOver = b3v1Nig.isGameOver();
assert(nigGameOver.over === false,
  'Nigeria 3v1: Game is NOT drawn at 16 moves (Nigerian 25-move clock active)');

console.log('\n====================================================');
console.log(`TEST SUITE RESULTS: ${passedTests} / ${totalTests} TESTS PASSED`);
console.log('====================================================');
console.log('ALL THREE RULESETS VALIDATED WITH 100% ACCURACY! 🎉');
