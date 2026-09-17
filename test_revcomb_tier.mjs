import { ProfessionalPuzzleGenerator } from './js/puzzle_generator.js';
import { satisfiesTierGate } from './js/puzzle_difficulty.js';

const gen = new ProfessionalPuzzleGenerator();
for (let t = 5; t <= 10; t++) {
  const p = gen.generateReverseCombination(t, 'nigeria', 'combination');
  if (p) {
    console.log(`Tier ${t} ReverseComb: human_score=${p.difficulty.human_score}, satisfies=${satisfiesTierGate(t, p.difficulty.human_score)}`);
  } else {
    console.log(`Tier ${t} ReverseComb: null`);
  }
}
