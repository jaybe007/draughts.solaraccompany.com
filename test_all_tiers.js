import { ProfessionalPuzzleGenerator } from './js/puzzle_generator.js';

async function main() {
  const gen = new ProfessionalPuzzleGenerator();
  const rulesets = ['nigeria', 'ghana', 'international'];
  let allPass = true;

  for (const r of rulesets) {
    console.log(`\n=== Testing ruleset: ${r.toUpperCase()} ===`);
    for (let t = 1; t <= 12; t++) {
      const start = Date.now();
      const p = gen.generatePuzzle({ tier: t, ruleset: r, maxAttempts: 150 });
      const elapsed = Date.now() - start;
      if (p) {
        console.log(`Tier ${t} (${p.difficulty.tier_name}): ${p.id} score=${p.difficulty.human_score} (${elapsed}ms)`);
      } else {
        console.error(`FAILED Tier ${t} for ${r}!`);
        allPass = false;
      }
    }
  }

  if (allPass) {
    console.log('\n>>> ALL 36 RULES/TIER COMBINATIONS PASSED PERFECTLY! <<<');
  } else {
    process.exit(1);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
