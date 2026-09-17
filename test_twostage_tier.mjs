import { ProfessionalPuzzleGenerator } from './js/puzzle_generator.js';
import { satisfiesTierGate } from './js/puzzle_difficulty.js';

const gen = new ProfessionalPuzzleGenerator();
for (let t = 7; t <= 12; t++) {
  const p = gen.generateTwoStageCombination(t, 'nigeria', 'multi-stage-sacrifice');
  if (p) {
    console.log(`Tier ${t} TwoStage: human_score=${p.difficulty.human_score}, satisfies=${satisfiesTierGate(t, p.difficulty.human_score)}`);
  } else {
    console.log(`Tier ${t} TwoStage: null`);
  }
}
