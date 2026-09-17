import { sqToRC, rcToSq } from './js/engine50.js';
import { NigerianDraughtsEngine, PLAYER_1, PLAYER_2 } from './js/engine.js';
import {
  calculateComprehensivePuzzleDifficulty,
  satisfiesTierGate,
  mapToDifficultyTier,
  calculateQualityScore,
  DIFFICULTY_TIERS
} from './js/puzzle_difficulty.js';

console.log('Testing full specialized generator pipeline...');

function st(mover, fromSq, toSq, note = '', isAi = false, isJump = false) {
  const from = sqToRC(fromSq);
  const to = sqToRC(toSq);
  return {
    mover,
    fromSq,
    toSq,
    from: { r: from.r, c: from.c },
    to: { r: to.r, c: to.c },
    note,
    isAi,
    isJump
  };
}

// Test Grandmaster (Tier 8: min 75) Quiet Positional Generator
function testGrandmasterQuietPositional() {
  const white = [46, 37, 32, 28, 41, 48, 50];
  const black = [15, 20, 24, 18, 9, 2, 3];
  
  const steps = [
    st(PLAYER_1, 41, 36, 'White plays quiet prophylactic wing lock: 41-36!'),
    st(PLAYER_2, 15, 20, 'Black seeks counterplay: 15-20.', true),
    st(PLAYER_1, 37, 31, 'White clamps the flank: 37-31!'),
    st(PLAYER_2, 20, 25, 'Black pushes forward: 20-25.', true),
    st(PLAYER_1, 28, 22, 'White strikes the center: 28-22!'),
    st(PLAYER_2, 18, 23, 'Black forced to counter: 18-23.', true),
    st(PLAYER_1, 31, 26, 'White seizes decisive outpost: 31-26!'),
    st(PLAYER_2, 24, 30, 'Black desperate counter-thrust: 24-30.', true),
    st(PLAYER_1, 32, 28, 'White anchors the position: 32-28!')
  ];

  const candidates = [
    { fromSq: 28, toSq: 22, moveSig: '28-22', attractiveness: 85, isAttack: true, toR: 4, refutation: 'Black counters with 24-30! breaking through the flank.' },
    { fromSq: 32, toSq: 27, moveSig: '32-27', attractiveness: 75, isAttack: true, toR: 5, refutation: 'Black counters with 18-23! undermining White center.' },
    { fromSq: 37, toSq: 31, moveSig: '37-31', attractiveness: 65, toR: 6, refutation: 'Premature flank advance, allows 20-25 with equality.' },
    { fromSq: 48, toSq: 42, moveSig: '48-42', attractiveness: 60, toR: 8, refutation: 'Passive, gives Black tempo to organize counterplay.' },
    { fromSq: 50, toSq: 45, moveSig: '50-45', attractiveness: 55, toR: 8, refutation: 'Inconsequential waiting move, loses initiative.' },
    { fromSq: 41, toSq: 36, moveSig: '41-36', attractiveness: 22, isQuiet: true, isProphylactic: true, toR: 7 }, // The winning move!
    { fromSq: 46, toSq: 41, moveSig: '46-41', attractiveness: 20, isQuiet: true, toR: 8 },
    { fromSq: 32, toSq: 28, moveSig: '32-28', attractiveness: 18, isQuiet: true, toR: 6 }
  ];

  const diff = calculateComprehensivePuzzleDifficulty({
    steps,
    candidates,
    winningMoveSig: '41-36',
    bestScore: 6.5,
    secondBestScore: 5.8, // Tight eval margin (0.7)
    isQuiet: true,
    candidateCount: candidates.length,
    isMoveOrderCritical: true,
    themes: ['best-positional-move', 'restrict-mobility', 'prophylaxis', 'central-control']
  });

  console.log('Grandmaster Quiet Puzzle:');
  console.log('  Human Difficulty:', diff.humanDifficulty);
  console.log('  Deception Score:', diff.deceptionScore);
  console.log('  Candidate Complexity:', diff.candidateComplexity);
  console.log('  Effective Depth:', diff.effectiveDepth);
  console.log('  Tier 8 Gate Satisfied:', satisfiesTierGate(8, diff.humanDifficulty));
  console.log('  Tempting Move:', diff.temptingMove?.move, 'Why:', diff.temptingMove?.why_humans_choose_it);
}

// Test Super GM (Tier 9: min 82) Move-Order Trap
function testSuperGMMoveOrderTrap() {
  const steps = [
    st(PLAYER_1, 33, 28, 'White initiates first sacrifice: 33-28!'),
    st(PLAYER_2, 23, 34, 'Black compulsory capture: 23x34!', true, true),
    st(PLAYER_1, 24, 19, 'White executes second decoy: 24-19!'),
    st(PLAYER_2, 14, 25, 'Black compulsory capture: 14x25!', true, true),
    st(PLAYER_1, 20, 29, 'White sweeper starts the grand sweep: 20x29!', false, true),
    st(PLAYER_1, 29, 38, 'Sweep continues: 29x38!', false, true),
    st(PLAYER_1, 38, 47, 'Crowns Oba King: 38x47!', false, true),
    st(PLAYER_2, 10, 14, 'Black tries to mobilize: 10-14.', true),
    st(PLAYER_1, 47, 24, 'Oba King sweeps across the board: 47-24!', false)
  ];

  const candidates = [
    { fromSq: 24, toSq: 19, moveSig: '24-19', attractiveness: 85, isAttack: true, isObviousSacrifice: true, toR: 3, refutation: 'Inverted move order: Black captures 14x25 threatening White 20; 33-28 now fails.' },
    { fromSq: 33, toSq: 29, moveSig: '33-29', attractiveness: 75, isAttack: true, toR: 5, refutation: 'Passive attack, allows Black 23-28 consolidation.' },
    { fromSq: 38, toSq: 32, moveSig: '38-32', attractiveness: 65, toR: 6, refutation: 'Slow move, misses the tactical window.' },
    { fromSq: 46, toSq: 41, moveSig: '46-41', attractiveness: 55, toR: 8, refutation: 'Allows Black 23-28 breakthrough.' },
    { fromSq: 20, toSq: 15, moveSig: '20-15', attractiveness: 50, toR: 3, refutation: 'Premature advance without combination support.' },
    { fromSq: 33, toSq: 28, moveSig: '33-28', attractiveness: 45, isAttack: true, toR: 5 }, // Winning move
    { fromSq: 42, toSq: 37, moveSig: '42-37', attractiveness: 20, isQuiet: true, toR: 7 }
  ];

  const diff = calculateComprehensivePuzzleDifficulty({
    steps,
    candidates,
    winningMoveSig: '33-28',
    bestScore: 9.5,
    secondBestScore: 8.9,
    sacrificeLevel: 6,
    isMoveOrderCritical: true,
    hasKing: true,
    candidateCount: candidates.length,
    themes: ['zwischenzug', 'multi-stage-sacrifice', 'forced-capture', 'combination']
  });

  console.log('\nSuper GM Move-Order Trap:');
  console.log('  Human Difficulty:', diff.humanDifficulty);
  console.log('  Deception Score:', diff.deceptionScore);
  console.log('  Move-Order Sensitivity:', diff.moveOrderSensitivity);
  console.log('  Tier 9 Gate Satisfied:', satisfiesTierGate(9, diff.humanDifficulty));
}

testGrandmasterQuietPositional();
testSuperGMMoveOrderTrap();
