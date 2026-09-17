import { sqToRC, rcToSq } from './js/engine50.js';
import { NigerianDraughtsEngine, PLAYER_1, PLAYER_2 } from './js/engine.js';
import { calculateComprehensivePuzzleDifficulty, satisfiesTierGate, mapToDifficultyTier } from './js/puzzle_difficulty.js';

console.log('Testing Specialized Generators...');

// 1. Test Quiet Move / Tempo Puzzle Verification
const quietPuzzleSetup = {
  wPieces: [46, 35, 30],
  bPieces: [25, 20],
  wKings: [46],
  bKings: [],
  bestMove: { from: 46, to: 37 }, // Quiet king step along highway
  // Alternative tempting move: 30-24 (aggressive push)
  candidates: [
    { fromSq: 46, toSq: 37, isQuiet: true, isCapture: false, moveSig: '46-37', player: 1, toR: 6 },
    { fromSq: 30, toSq: 24, isQuiet: false, isCapture: false, isAttack: true, moveSig: '30-24', player: 1, toR: 4 }
  ]
};

const diff = calculateComprehensivePuzzleDifficulty({
  steps: [{ mover: 1, from: sqToRC(46), to: sqToRC(37), fromSq: 46, toSq: 37, isJump: false }],
  candidates: quietPuzzleSetup.candidates,
  winningMoveSig: '46-37',
  bestScore: 6.2,
  secondBestScore: 1.1,
  isQuiet: true,
  hasKing: true
});

console.log('Quiet Move Puzzle Difficulty:', diff.humanDifficulty);
console.log('Tempting Move Identified:', diff.temptingMove);
console.log('Deception Score:', diff.deceptionScore);
console.log('Tier:', mapToDifficultyTier(diff.humanDifficulty).tierName);
