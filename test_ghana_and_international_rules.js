/**
 * Automated Test Suite: Ghana Damii Seed Counting & International Board Central Line
 */

import { NigerianDraughtsEngine, PLAYER_1, PLAYER_2 } from './js/engine.js';
import { RulesEngine } from './js/rules_engine.js';
import { DraughtsBoard50, P1_KING, P1_MAN, P2_KING, P2_MAN, rcToSq, sqToRC } from './js/engine50.js';
import { NigerianDraughtsAI } from './js/ai.js';

console.log('===============================================================');
console.log('🧪 VERIFYING GHANA DAMII SEED COUNTING & INTL BOARD ORIENTATION');
console.log('===============================================================\n');

let passed = 0;
let total = 0;

function assert(condition, description) {
  total++;
  if (condition) {
    passed++;
    console.log(`  ✓ PASS: ${description}`);
  } else {
    console.error(`  ✗ FAIL: ${description}`);
  }
}

// =========================================================================
// 1. BOARD ORIENTATION: NIGERIA vs INTERNATIONAL
// =========================================================================
console.log('--- 1. Testing Board Orientation & Central Line ("Otherwise") ---');

const engineNaija = new NigerianDraughtsEngine({ boardSize: 10, ruleMode: 'nigeria' });
const engineIntl = new NigerianDraughtsEngine({ boardSize: 10, ruleMode: 'international' });
const engineGhana = new NigerianDraughtsEngine({ boardSize: 10, ruleMode: 'ghana' });

// Nigerian / Ghanaian Board Orientation:
// Bottom-left corner (row 9, col 0) is LIGHT.
// Bottom-right corner (row 9, col 9) is DARK.
// Central Line (Highway) connects (0, 0) to (9, 9) on the player's right.
assert(engineNaija.isDarkSquare(9, 0) === false, 'Nigerian: Bottom-left (9, 0) is LIGHT');
assert(engineNaija.isDarkSquare(9, 9) === true, 'Nigerian: Bottom-right (9, 9) is DARK');
assert(engineNaija.isCentralLineSquare(0, 0) === true, 'Nigerian: Top-left (0, 0) is on Central Line');
assert(engineNaija.isCentralLineSquare(9, 9) === true, 'Nigerian: Bottom-right (9, 9) is on Central Line');
assert(engineNaija.isCentralLineSquare(9, 0) === false, 'Nigerian: Bottom-left (9, 0) is NOT on Central Line');

assert(engineGhana.isDarkSquare(9, 0) === false, 'Ghanaian: Bottom-left (9, 0) is LIGHT');
assert(engineGhana.isDarkSquare(9, 9) === true, 'Ghanaian: Bottom-right (9, 9) is DARK');
assert(engineGhana.isCentralLineSquare(9, 9) === true, 'Ghanaian: Central Line connects to player right (9, 9)');

// International Draughts Board Orientation ("Central line is otherwise"):
// Bottom-left corner (row 9, col 0) is DARK.
// Bottom-right corner (row 9, col 9) is LIGHT.
// Central Line (Grande Ligne) connects bottom-left (9, 0) to top-right (0, 9).
assert(engineIntl.isDarkSquare(9, 0) === true, 'International: Bottom-left (9, 0) is DARK');
assert(engineIntl.isDarkSquare(9, 9) === false, 'International: Bottom-right (9, 9) is LIGHT');
assert(engineIntl.isCentralLineSquare(9, 0) === true, 'International: Bottom-left (9, 0) is on Central Line');
assert(engineIntl.isCentralLineSquare(0, 9) === true, 'International: Top-right (0, 9) is on Central Line');
assert(engineIntl.isCentralLineSquare(0, 0) === false, 'International: (0, 0) is NOT on Central Line');
assert(engineIntl.isCentralLineSquare(9, 9) === false, 'International: (9, 9) is NOT on Central Line');

// RulesEngine profile verification
const rulesIntlProf = RulesEngine.getRuleProfile('international');
const rulesNaijaProf = RulesEngine.getRuleProfile('nigeria');
assert(rulesIntlProf.isDarkSquare(9, 0) === true, 'RulesEngine: International bottom-left (9, 0) is DARK');
assert(rulesIntlProf.isDarkSquare(9, 9) === false, 'RulesEngine: International bottom-right (9, 9) is LIGHT');
assert(rulesIntlProf.isCentralLineSquare(9, 0) === true, 'RulesEngine: International (9, 0) is on Central Line');
assert(rulesIntlProf.isCentralLineSquare(0, 9) === true, 'RulesEngine: International (0, 9) is on Central Line');
assert(rulesIntlProf.isCentralLineSquare(0, 0) === false, 'RulesEngine: International (0, 0) is NOT on Central Line');
assert(rulesIntlProf.getCentralLineSquares().length === 10, 'RulesEngine: International Central Line has 10 squares');
assert(rulesNaijaProf.isCentralLineSquare(0, 0) === true, 'RulesEngine: Nigerian (0, 0) is on Highway');
assert(rulesNaijaProf.isCentralLineSquare(9, 9) === true, 'RulesEngine: Nigerian (9, 9) is on Highway');

// Coordinate converter verification:
assert(rcToSq(9, 0, true) === 46, 'FMJD coordinate: (9, 0) maps to square 46');
assert(rcToSq(0, 9, true) === 5, 'FMJD coordinate: (0, 9) maps to square 5');
assert(sqToRC(46, true).r === 9 && sqToRC(46, true).c === 0, 'FMJD sqToRC: square 46 maps to (9, 0)');
assert(sqToRC(5, true).r === 0 && sqToRC(5, true).c === 9, 'FMJD sqToRC: square 5 maps to (0, 9)');

// AI conversion verification on International board:
const aiTest = new NigerianDraughtsAI({ difficulty: 'expert' });
const b50Intl = aiTest.convertBoardTo50(engineIntl);
let intlPieceCount = 0;
for (let s = 1; s <= 50; s++) if (b50Intl[s] !== 0) intlPieceCount++;
assert(intlPieceCount === 40, 'AI convertBoardTo50 correctly registers all 40 pieces on International board');

// =========================================================================
// 2. MAJORITY CAPTURE: INTERNATIONAL vs FREE CHOICE: NIGERIAN
// =========================================================================
console.log('\n--- 2. Testing Majority Capture (International) vs Free Choice (Nigeria) ---');

// Setup a position where White P1 can capture 1 piece or 2 pieces
// In Nigerian board (dark squares where r+c is even):
// P1 King at (4, 4).
// Option A (1 jump): P2 at (5, 5), landing at (6, 6).
// Option B (2 jumps): P2 at (3, 3), landing at (2, 2), then jumps P2 at (1, 3) to land at (0, 4).
const pNaija = new NigerianDraughtsEngine({ boardSize: 10, ruleMode: 'nigeria' });
pNaija.loadCustomPosition([
  { r: 4, c: 4, player: PLAYER_1, isKing: true },
  { r: 5, c: 5, player: PLAYER_2, isKing: false },
  { r: 3, c: 3, player: PLAYER_2, isKing: false },
  { r: 1, c: 3, player: PLAYER_2, isKing: false }
], PLAYER_1);

const naijaMoves = pNaija.getAllLegalMoves(PLAYER_1);
assert(naijaMoves.length >= 2, 'Nigeria rules permit free choice among capture options');

// In International rules:
const rulesIntl = RulesEngine.getRuleProfile('international');
assert(rulesIntl.getMaximumCaptureRules() === true, 'International rules strictly require maximum capture');

// =========================================================================
// 3. GHANA DAMII ENDGAME SEED-COUNTING RULES
// =========================================================================
console.log('\n--- 3. Testing Ghanaian Damii Endgame Seed-Counting Adjudications ---');

// Scenario A: 1 Crown + 1 Seed vs 1 Crown + 1 Seed -> DRAW
const ghanaDraw1 = new NigerianDraughtsEngine({ boardSize: 10, ruleMode: 'ghana' });
ghanaDraw1.loadCustomPosition([
  { r: 0, c: 0, player: PLAYER_1, isKing: true },  // P1 Crown
  { r: 6, c: 6, player: PLAYER_1, isKing: false }, // P1 Seed
  { r: 9, c: 9, player: PLAYER_2, isKing: true },  // P2 Crown
  { r: 3, c: 3, player: PLAYER_2, isKing: false }  // P2 Seed
], PLAYER_1);
ghanaDraw1.checkEndGame();
assert(ghanaDraw1.gameOver === true, '1 Crown + 1 Seed vs 1 Crown + 1 Seed triggers game over');
assert(ghanaDraw1.winner === 'draw', '1 Crown + 1 Seed vs 1 Crown + 1 Seed is officially a DRAW');
assert(ghanaDraw1.winReason.includes('1 Crown + 1 Seed each'), 'Win reason states 1 Crown + 1 Seed each');

// Scenario B: 1 Crown + 1 Seed (P1) vs 1 Crown alone (P2) -> P1 WIN
const ghanaWinP1 = new NigerianDraughtsEngine({ boardSize: 10, ruleMode: 'ghana' });
ghanaWinP1.loadCustomPosition([
  { r: 0, c: 0, player: PLAYER_1, isKing: true },  // P1 Crown
  { r: 6, c: 6, player: PLAYER_1, isKing: false }, // P1 Seed
  { r: 9, c: 9, player: PLAYER_2, isKing: true }   // P2 Crown alone
], PLAYER_1);
ghanaWinP1.checkEndGame();
assert(ghanaWinP1.gameOver === true, '1 Crown + 1 Seed vs lone Crown triggers game over');
assert(ghanaWinP1.winner === PLAYER_1, '1 Crown + 1 Seed vs lone Crown is officially a WIN for Player 1');
assert(ghanaWinP1.winReason.includes('Crown + Seed vs lone Crown'), 'Win reason mentions Crown + Seed vs lone Crown');

// Scenario C: 1 Crown alone (P1) vs 1 Crown + 1 Seed (P2) -> P2 WIN
const ghanaWinP2 = new NigerianDraughtsEngine({ boardSize: 10, ruleMode: 'ghana' });
ghanaWinP2.loadCustomPosition([
  { r: 0, c: 0, player: PLAYER_1, isKing: true },  // P1 Crown alone
  { r: 9, c: 9, player: PLAYER_2, isKing: true },  // P2 Crown
  { r: 3, c: 3, player: PLAYER_2, isKing: false }  // P2 Seed
], PLAYER_2);
ghanaWinP2.checkEndGame();
assert(ghanaWinP2.gameOver === true, 'Lone Crown vs 1 Crown + 1 Seed triggers game over');
assert(ghanaWinP2.winner === PLAYER_2, 'Lone Crown vs 1 Crown + 1 Seed is officially a WIN for Player 2');

// Scenario D: 1 Crown vs 1 Crown alone -> DRAW
const ghanaDraw2 = new NigerianDraughtsEngine({ boardSize: 10, ruleMode: 'ghana' });
ghanaDraw2.loadCustomPosition([
  { r: 0, c: 0, player: PLAYER_1, isKing: true },
  { r: 9, c: 9, player: PLAYER_2, isKing: true }
], PLAYER_1);
ghanaDraw2.checkEndGame();
assert(ghanaDraw2.gameOver === true, '1 Crown vs 1 Crown triggers game over');
assert(ghanaDraw2.winner === 'draw', '1 Crown vs 1 Crown is officially a DRAW');

// Scenario E: In rules_engine.js (DraughtsBoard50)
const b50 = new DraughtsBoard50({ ruleMode: 'ghana' });
// Clear board
for (let sq = 1; sq <= 50; sq++) b50.board[sq] = 0;
// Place 1 Crown + 1 Seed for P1, 1 Crown alone for P2
b50.board[1] = P1_KING;
b50.board[23] = P1_MAN;
b50.board[50] = P2_KING;
const result50 = b50.isGameOver();
assert(result50.over === true, '50-square engine recognizes Ghana Damii Crown + Seed win');
assert(result50.winner === PLAYER_1, '50-square engine awards win to Player 1');

// Scenario F: 1 Crown + 1 Seed vs 1 Crown + 1 Seed in rules_engine.js
b50.board[39] = P2_MAN;
const result50Draw = b50.isGameOver();
assert(result50Draw.over === true, '50-square engine recognizes 1 Crown + 1 Seed each');
assert(result50Draw.winner === 'draw', '50-square engine declares DRAW');

// =========================================================================
// SUMMARY
// =========================================================================
console.log('\n===============================================================');
console.log(`TEST RESULTS: ${passed} / ${total} PASSED`);
if (passed === total) {
  console.log('🎉 ALL GHANA DAMII & INTERNATIONAL RULES TESTS PASSED!');
} else {
  console.log('❌ SOME TESTS FAILED');
}
console.log('===============================================================');

if (passed !== total) process.exit(1);
