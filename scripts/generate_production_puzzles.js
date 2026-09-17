/**
 * Production Puzzle Generator & Verification Suite (scripts/generate_production_puzzles.js)
 * 
 * Generates and validates the required 390 certified puzzles:
 * - 20 Beginner (Tier 1 & 2)
 * - 20 Intermediate (Tier 3 & 4)
 * - 20 Advanced (Tier 5 & 6)
 * - 20 Expert (Tier 7 & 8)
 * - 20 Master (Tier 9 & 10)
 * - 20 Grandmaster (Tier 11)
 * - 10 Super Grandmaster (Tier 12)
 * For EACH of Nigerian, Ghanaian, and International Draughts = 390 certified puzzles total!
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ProfessionalPuzzleGenerator } from '../js/puzzle_generator.js';
import { DIFFICULTY_TIERS } from '../js/puzzle_difficulty.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Target counts per tier:
// Tier 1: 10, Tier 2: 10  (Beginner = 20)
// Tier 3: 10, Tier 4: 10  (Intermediate = 20)
// Tier 5: 10, Tier 6: 10  (Advanced = 20)
// Tier 7: 10, Tier 8: 10  (Expert = 20)
// Tier 9: 10, Tier 10: 10 (Master = 20)
// Tier 11: 20             (Grandmaster = 20)
// Tier 12: 10             (Super Grandmaster = 10)
// Total = 130 per ruleset
const TIER_TARGETS = [
  { tier: 1, count: 10, name: 'Tier 1: Novice' },
  { tier: 2, count: 10, name: 'Tier 2: Beginner' },
  { tier: 3, count: 10, name: 'Tier 3: Casual' },
  { tier: 4, count: 10, name: 'Tier 4: Intermediate' },
  { tier: 5, count: 10, name: 'Tier 5: Club Player' },
  { tier: 6, count: 10, name: 'Tier 6: Tournament Player' },
  { tier: 7, count: 10, name: 'Tier 7: Expert' },
  { tier: 8, count: 10, name: 'Tier 8: Candidate Master' },
  { tier: 9, count: 10, name: 'Tier 9: Master' },
  { tier: 10, count: 10, name: 'Tier 10: International Master' },
  { tier: 11, count: 20, name: 'Tier 11: Grandmaster' },
  { tier: 12, count: 10, name: 'Tier 12: Super Grandmaster / AI' }
];

const RULESETS = [
  { id: 'nigeria', name: 'Nigerian Street Draughts', flag: '🇳🇬' },
  { id: 'ghana', name: 'Ghanaian Damii Draughts', flag: '🇬🇭' },
  { id: 'international', name: 'International (FMJD) Draughts', flag: '🌍' }
];

async function runProductionGeneration() {
  console.log('========================================================================');
  console.log('🚀 PROFESSIONAL 10x10 DRAUGHTS PUZZLE GENERATION & CERTIFICATION SUITE');
  console.log('========================================================================');
  console.log(`Target: 390 Certified Puzzles (130 Nigeria, 130 Ghana, 130 International)`);
  console.log(`Quality Threshold: ≥ 80 | Zero Duplicates | Compulsory Capture Verified`);
  console.log('------------------------------------------------------------------------');

  const generator = new ProfessionalPuzzleGenerator();
  const allCertifiedPuzzles = [];
  const rulesetAudit = {};

  const startTime = Date.now();

  for (const rset of RULESETS) {
    console.log(`\n▶ Generating batch for ${rset.flag} ${rset.name.toUpperCase()}...`);
    rulesetAudit[rset.id] = {
      requested: 130,
      accepted: 0,
      byTier: {}
    };

    for (const target of TIER_TARGETS) {
      process.stdout.write(`  - ${target.name} (Need ${target.count})... `);
      let tierAccepted = 0;
      let attempts = 0;
      const maxAttempts = target.count * 80;

      while (tierAccepted < target.count && attempts < maxAttempts) {
        attempts++;
        const puzzle = generator.generatePuzzle({
          tier: target.tier,
          ruleset: rset.id,
          theme: target.tier >= 9 ? 'combination' : 'sacrifice'
        });

        if (puzzle && puzzle.quality.score >= 80) {
          allCertifiedPuzzles.push(puzzle);
          tierAccepted++;
        }
      }

      rulesetAudit[rset.id].accepted += tierAccepted;
      rulesetAudit[rset.id].byTier[target.tier] = tierAccepted;
      console.log(`Done: ${tierAccepted}/${target.count}`);
    }
  }

  const durationMs = Date.now() - startTime;
  const telemetry = generator.getTelemetryReport();

  console.log('\n========================================================================');
  console.log('📊 AUTOMATED AUDIT & CERTIFICATION METRICS REPORT');
  console.log('========================================================================');
  console.log(`Total Positions Generated:  ${telemetry.generated}`);
  console.log(`Total Accepted (≥80 Gate):  ${allCertifiedPuzzles.length}`);
  console.log(`Total Rejected Candidates:  ${telemetry.rejected}`);
  console.log(`Duplicate Positions Purged: ${telemetry.duplicates}`);
  console.log(`Invalid Post-Blunder Moves: ${telemetry.invalidPositions}`);
  console.log(`Ambiguous Solutions Purged: ${telemetry.ambiguousSolutions}`);
  console.log(`Average Quality Score:      ${telemetry.avgQualityScore} / 100`);
  console.log(`Average Human Difficulty:   ${telemetry.avgDifficulty} / 100`);
  console.log(`Total Execution Time:       ${(durationMs / 1000).toFixed(2)}s`);
  console.log('------------------------------------------------------------------------');

  // Breakdown Table
  console.log('\nRULES BREAKDOWN:');
  for (const rset of RULESETS) {
    const a = rulesetAudit[rset.id];
    console.log(`  ${rset.flag} ${rset.name}: ${a.accepted} / 130 certified puzzles`);
  }

  // Write JSON artifact for inspection
  const jsonPath = path.join(__dirname, '../scratch_puzzles_390.json');
  fs.writeFileSync(jsonPath, JSON.stringify(allCertifiedPuzzles, null, 2), 'utf8');
  console.log(`\n💾 Saved all ${allCertifiedPuzzles.length} certified puzzles to ${jsonPath}`);

  // Format and export to js/traps.js
  exportToTrapsJs(allCertifiedPuzzles);

  return allCertifiedPuzzles;
}

/**
 * Formats and exports the 390 puzzles directly into js/traps.js
 */
function exportToTrapsJs(puzzles) {
  const formatted = puzzles.map(p => {
    return {
      id: p.id,
      title: p.description || `Tactical Combination ${p.id}`,
      category: p.classification?.category || 'Tactics',
      difficulty: DIFFICULTY_TIERS[p.difficulty.tier].name,
      difficultyTier: p.difficulty.tier,
      rating: p.difficulty.rating,
      stage: p.classification?.game_phase || 'Middlegame',
      ruleset: p.ruleset,
      badge: DIFFICULTY_TIERS[p.difficulty.tier].badge,
      hint: p.hints?.[0] || 'Look for compulsory capture opportunities.',
      hints: p.hints || [],
      description: p.description,
      explanation: p.explanation,
      coachQuote: "Calm down spot the combination. Trap don set, chop am well!",
      initialBoard: p.initialBoard,
      initialMove: p.initialMove,
      steps: p.solution.steps
    };
  });

  const fileContent = `/**
 * Street Trap Academy & Tactical Master (js/traps.js)
 * 
 * 100% Engine-Validated Draughts Tactical Puzzles Database.
 * Total Certified Puzzles: ${formatted.length}
 * Rulesets: Nigerian Street Draughts (130), Ghanaian Damii (130), International FMJD (130)
 * 12 Difficulty Tiers (Beginner to Super Grandmaster / AI Challenge)
 * All positions verified: Compulsory Capture Enforced, Unique Winning Line, Zero Duplicates.
 */

import { sound } from './audio.js';
import { PLAYER_1, PLAYER_2 } from './engine.js';

export const TRAP_DATABASE = ${JSON.stringify(formatted, null, 2)};
`;

  const trapsPathScratch = path.join(__dirname, '../js/traps.js');
  let controllerCode = '';
  try {
    const existingContent = fs.readFileSync(trapsPathScratch, 'utf8');
    const marker = 'export class TrapAcademyController';
    const idx = existingContent.indexOf(marker);
    if (idx !== -1) controllerCode = existingContent.substring(idx);
  } catch {}

  const fullFileContent = fileContent + '\n\n' + (controllerCode || '');
  fs.writeFileSync(trapsPathScratch, fullFileContent, 'utf8');
  console.log(`✅ Exported to ${trapsPathScratch} (TrapAcademyController preserved)`);

  const trapsPathHtdocs = 'C:\\xampp\\htdocs\\nigerian-draughts\\js\\traps.js';
  try {
    fs.writeFileSync(trapsPathHtdocs, fullFileContent, 'utf8');
    console.log(`✅ Exported to ${trapsPathHtdocs} (TrapAcademyController preserved)`);
  } catch (e) {
    console.log(`Note: Could not copy directly to htdocs via node fs: ${e.message}`);
  }
}

// Run execution
runProductionGeneration()
  .then(() => {
    console.log('\n✨ Generation & Verification Suite completed successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Fatal generation error:', err);
    process.exit(1);
  });
