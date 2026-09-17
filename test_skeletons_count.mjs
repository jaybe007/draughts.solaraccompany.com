import { ProfessionalPuzzleGenerator } from './js/puzzle_generator.js';

const gen = new ProfessionalPuzzleGenerator();
console.log("Single-stage skeletons count (2 hops):", gen.getSkeletons(2, { minWFrom: 16, maxWFrom: 50, mustCrown: false }).length);
console.log("Single-stage skeletons count (3 hops):", gen.getSkeletons(3, { minWFrom: 16, maxWFrom: 50, mustCrown: false }).length);
console.log("Single-stage skeletons count (4 hops):", gen.getSkeletons(4, { minWFrom: 16, maxWFrom: 50, mustCrown: false }).length);
console.log("Two-stage skeletons count:", gen.getTwoStageSkeletons().length);
