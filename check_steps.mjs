import { TRAP_DATABASE } from './js/traps.js';

for (let i = 0; i < 5; i++) {
  const p = TRAP_DATABASE[i];
  console.log(`\n--- Puzzle #${i+1} (${p.id}): ${p.title} ---`);
  console.log("Ruleset:", p.ruleset);
  console.log("Steps count:", p.steps ? p.steps.length : (p.solution?.steps?.length || 0));
  const steps = p.steps || p.solution.steps;
  steps.forEach((s, sIdx) => {
    console.log(`  Step ${sIdx}: mover=${s.mover} from=(${s.from.r},${s.from.c}) to=(${s.to.r},${s.to.c}) isJump=${s.isJump} isAi=${s.isAi}`);
  });
}
