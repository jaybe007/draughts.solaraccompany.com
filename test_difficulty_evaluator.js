import { sqToRC, rcToSq } from './js/engine50.js';
import { NigerianDraughtsEngine, PLAYER_1, PLAYER_2 } from './js/engine.js';

// Test prototype for 15-metric difficulty evaluator and simulated human solver
console.log('Testing 15-Metric Difficulty Prototype...');

function evaluateHumanPlausibility(move, isCapture, jumpedCount, isQuiet, toSq) {
  let score = 20; // baseline
  if (isCapture) {
    score += 40 + (jumpedCount || 1) * 15;
  }
  const { r } = sqToRC(toSq);
  if (r === 0 || r === 9) { // promotion row
    score += 25;
  } else if (r <= 2) {
    score += 15; // deep advance
  }
  if (isQuiet) {
    score -= 15; // quiet moves are counter-intuitive to humans
  }
  return score;
}

console.log('Human plausibility of capture:', evaluateHumanPlausibility({ fromSq: 20, toSq: 29 }, true, 2, false, 29));
console.log('Human plausibility of quiet move:', evaluateHumanPlausibility({ fromSq: 35, toSq: 30 }, false, 0, true, 30));
