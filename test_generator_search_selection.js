import { sqToRC, rcToSq } from './js/engine50.js';
import { NigerianDraughtsEngine, PLAYER_1, PLAYER_2 } from './js/engine.js';
import { calculateComprehensivePuzzleDifficulty, satisfiesTierGate, mapToDifficultyTier } from './js/puzzle_difficulty.js';

console.log('Testing Search-and-Selection evaluation pipeline...');

// Let's create a simulated puzzle with full candidate analysis
const candidates = [
  { fromSq: 33, toSq: 28, isQuiet: false, isCapture: false, isAttack: true, moveSig: '33-28', player: 1, toR: 5 },
  { fromSq: 24, toSq: 19, isQuiet: false, isCapture: false, isAttack: true, moveSig: '24-19', player: 1, toR: 3 },
  { fromSq: 20, toSq: 15, isQuiet: true, isCapture: false, moveSig: '20-15', player: 1, toR: 3 },
  { fromSq: 38, toSq: 32, isQuiet: true, isCapture: false, moveSig: '38-32', player: 1, toR: 6 },
  { fromSq: 43, toSq: 39, isQuiet: true, isCapture: false, moveSig: '43-39', player: 1, toR: 7 }
];

const steps = [
  { mover: 1, from: sqToRC(33), to: sqToRC(28), fromSq: 33, toSq: 28, isJump: false },
  { mover: 2, from: sqToRC(23), to: sqToRC(34), fromSq: 23, toSq: 34, isJump: true },
  { mover: 1, from: sqToRC(24), to: sqToRC(19), fromSq: 24, toSq: 19, isJump: false },
  { mover: 2, from: sqToRC(14), to: sqToRC(25), fromSq: 14, toSq: 25, isJump: true },
  { mover: 1, from: sqToRC(20), to: sqToRC(29), fromSq: 20, toSq: 29, isJump: true },
  { mover: 1, from: sqToRC(29), to: sqToRC(38), fromSq: 29, toSq: 38, isJump: true },
  { mover: 1, from: sqToRC(38), to: sqToRC(47), fromSq: 38, toSq: 47, isJump: true }
];

const diff = calculateComprehensivePuzzleDifficulty({
  steps,
  candidates,
  winningMoveSig: '33-28',
  bestScore: 8.5,
  secondBestScore: 4.8,
  sacrificeLevel: 5,
  isMoveOrderCritical: true,
  hasKing: true
});

console.log('Difficulty profile:');
console.log('  Human Difficulty:', diff.humanDifficulty);
console.log('  Effective Depth:', diff.effectiveDepth);
console.log('  Candidate Complexity:', diff.candidateComplexity);
console.log('  Branching Factor:', diff.branchingFactor);
console.log('  Deception Score:', diff.deceptionScore);
console.log('  Move-Order Sensitivity:', diff.moveOrderSensitivity);
console.log('  Tempting Move:', diff.temptingMove);

console.log('Tier Gate check for Tier 8 (Grandmaster):', satisfiesTierGate(8, diff.humanDifficulty));
console.log('Tier Gate check for Tier 9 (Super GM):', satisfiesTierGate(9, diff.humanDifficulty));
