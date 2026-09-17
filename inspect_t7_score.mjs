import { ProfessionalPuzzleGenerator } from './js/puzzle_generator.js';
import { satisfiesTierGate, calculateComprehensivePuzzleDifficulty } from './js/puzzle_difficulty.js';

const g = new ProfessionalPuzzleGenerator();
const skeletons = g.getSkeletons(4, { minWFrom: 16, maxWFrom: 50, mustCrown: false });
console.log("Skeletons:", skeletons.length);

const cand = skeletons[0];
const whiteSqs = [cand.wFrom, cand.swSq];
const blackSqs = [cand.bFrom, ...cand.victims];
const steps = [
  { mover: 1, fromSq: cand.wFrom, toSq: cand.wTo, from: { r: 0, c: 0 }, to: { r: 0, c: 0 } },
  { mover: 2, fromSq: cand.bFrom, toSq: cand.bTo, from: { r: 0, c: 0 }, to: { r: 0, c: 0 } }
];

const diff = calculateComprehensivePuzzleDifficulty({
  tier: 7,
  steps,
  candidates: [{ moveSig: `${cand.wFrom}-${cand.wTo}`, isBest: true }],
  winningMoveSig: `${cand.wFrom}-${cand.wTo}`,
  bestScore: 7.5,
  secondBestScore: 2.1,
  isQuiet: false,
  sacrificeLevel: 4,
  candidateCount: 2,
  pieceCount: 6,
  themes: ['combination']
});

console.log("Calculated humanDifficulty for Tier 7:", diff.humanDifficulty);
console.log("Satisfies Tier 7 gate (65..82):", satisfiesTierGate(7, diff.humanDifficulty));
