import { sqToRC, rcToSq } from './js/engine50.js';
import { NigerianDraughtsEngine, PLAYER_1, PLAYER_2 } from './js/engine.js';
import {
  calculateComprehensivePuzzleDifficulty,
  satisfiesTierGate,
  mapToDifficultyTier,
  calculateQualityScore,
  DIFFICULTY_TIERS
} from './js/puzzle_difficulty.js';

console.log('--- Testing Prototype of Specialized Generators ---');

// Test 1: Quiet Positional Puzzle
console.log('\n1. Testing Quiet Positional archetype...');
const whiteQuiet = [46, 37, 32, 28, 41, 48, 50];
const blackQuiet = [15, 20, 24, 18, 9, 2, 3];
const engineQ = new NigerianDraughtsEngine({ boardSize: 10, ruleMode: 'nigeria' });
for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) engineQ.board[r][c] = null;
whiteQuiet.forEach(sq => { const { r, c } = sqToRC(sq); engineQ.board[r][c] = { player: PLAYER_1, isKing: false }; });
blackQuiet.forEach(sq => { const { r, c } = sqToRC(sq); engineQ.board[r][c] = { player: PLAYER_2, isKing: false }; });
engineQ.currentTurn = PLAYER_1;
const legalsQ = engineQ.getAllLegalMoves(PLAYER_1);
console.log('Legal moves for White (should have 0 captures):', legalsQ.length);
const capturesQ = legalsQ.filter(m => m.isJump);
console.log('Captures count:', capturesQ.length);

// Build candidates for quiet positional
const quietCandidates = legalsQ.map(m => {
  const fromSq = rcToSq(m.from.r, m.from.c);
  const toSq = rcToSq(m.to.r, m.to.c);
  const isBest = (fromSq === 41 && toSq === 36);
  return {
    fromSq,
    toSq,
    moveSig: `${fromSq}-${toSq}`,
    isQuiet: true,
    isCapture: false,
    isAttack: (toSq === 23 || toSq === 32),
    toR: m.to.r,
    player: 1,
    isProphylactic: isBest,
    refutation: isBest ? null : 'Allows Black 24-30! breaking through the wing.'
  };
});

// Also add tempting aggressive candidate
quietCandidates.push({
  fromSq: 28,
  toSq: 22,
  moveSig: '28-22',
  isQuiet: false,
  isCapture: false,
  isAttack: true,
  toR: 4,
  player: 1,
  refutation: 'Black counters with 24-30! pinning White and winning a piece.'
});

const stepsQ = [
  { mover: 1, from: sqToRC(41), to: sqToRC(36), fromSq: 41, toSq: 36, isJump: false },
  { mover: 2, from: sqToRC(15), to: sqToRC(20), fromSq: 15, toSq: 20, isJump: false },
  { mover: 1, from: sqToRC(37), to: sqToRC(31), fromSq: 37, toSq: 31, isJump: false },
  { mover: 2, from: sqToRC(20), to: sqToRC(25), fromSq: 20, toSq: 25, isJump: false },
  { mover: 1, from: sqToRC(28), to: sqToRC(22), fromSq: 28, toSq: 22, isJump: false }
];

const diffQ = calculateComprehensivePuzzleDifficulty({
  steps: stepsQ,
  candidates: quietCandidates,
  winningMoveSig: '41-36',
  bestScore: 6.8,
  secondBestScore: 5.9,
  isQuiet: true,
  candidateCount: quietCandidates.length,
  isMoveOrderCritical: true
});

console.log('Quiet Puzzle Difficulty:', diffQ.humanDifficulty);
console.log('Quiet Move Score:', diffQ.quietMoveScore);
console.log('Deception Score:', diffQ.deceptionScore);
console.log('Tempting Move:', diffQ.temptingMove?.move);
console.log('Tier 8 (Grandmaster) check (min 75):', satisfiesTierGate(8, diffQ.humanDifficulty));

// Test 2: Move Order Trap Puzzle
console.log('\n2. Testing Move-Order Trap archetype...');
const stepsMO = [
  { mover: 1, from: sqToRC(33), to: sqToRC(28), fromSq: 33, toSq: 28, isJump: false },
  { mover: 2, from: sqToRC(23), to: sqToRC(34), fromSq: 23, toSq: 34, isJump: true },
  { mover: 1, from: sqToRC(24), to: sqToRC(19), fromSq: 24, toSq: 19, isJump: false },
  { mover: 2, from: sqToRC(14), to: sqToRC(25), fromSq: 14, toSq: 25, isJump: true },
  { mover: 1, from: sqToRC(20), to: sqToRC(29), fromSq: 20, toSq: 29, isJump: true },
  { mover: 1, from: sqToRC(29), to: sqToRC(38), fromSq: 29, toSq: 38, isJump: true },
  { mover: 1, from: sqToRC(38), to: sqToRC(47), fromSq: 38, toSq: 47, isJump: true }
];

const candsMO = [
  { fromSq: 33, toSq: 28, moveSig: '33-28', isAttack: true, isCapture: false, player: 1, toR: 5 },
  { fromSq: 24, toSq: 19, moveSig: '24-19', isAttack: true, isCapture: false, player: 1, toR: 3, isObviousSacrifice: true },
  { fromSq: 20, toSq: 15, moveSig: '20-15', isQuiet: true, isCapture: false, player: 1, toR: 3 },
  { fromSq: 38, toSq: 32, moveSig: '38-32', isQuiet: true, isCapture: false, player: 1, toR: 6 },
  { fromSq: 46, toSq: 41, moveSig: '46-41', isQuiet: true, isCapture: false, player: 1, toR: 8 }
];

const diffMO = calculateComprehensivePuzzleDifficulty({
  steps: stepsMO,
  candidates: candsMO,
  winningMoveSig: '33-28',
  bestScore: 8.5,
  secondBestScore: 7.9,
  sacrificeLevel: 6,
  isMoveOrderCritical: true,
  hasKing: true
});

console.log('Move-Order Puzzle Difficulty:', diffMO.humanDifficulty);
console.log('Move-Order Sensitivity:', diffMO.moveOrderSensitivity);
console.log('Tempting Move:', diffMO.temptingMove?.move);
console.log('Tier 7 (Master) check (min 65):', satisfiesTierGate(7, diffMO.humanDifficulty));
