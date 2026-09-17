import { sqToRC, rcToSq } from './js/engine50.js';
import { NigerianDraughtsEngine, PLAYER_1, PLAYER_2 } from './js/engine.js';
import {
  calculateComprehensivePuzzleDifficulty,
  satisfiesTierGate,
  mapToDifficultyTier,
  calculateQualityScore,
  DIFFICULTY_TIERS
} from './js/puzzle_difficulty.js';

console.log('Testing prototype of full generator suite...');

// We will test generation of:
// - Quiet Positional (Tier 8 Grandmaster, target 75-90)
// - Move-Order Trap (Tier 9 Super GM, target 82-94)
// - Defensive Technique (Tier 7 Master, target 65-82)
// - Zugzwang Otilo (Tier 10 Elite, target 88-97)
// - Deceptive Capture (Tier 11 World-Class, target 92-99)

function st(mover, fromSq, toSq, note = '', isAi = false, isJump = false) {
  const from = sqToRC(fromSq);
  const to = sqToRC(toSq);
  return { mover, fromSq, toSq, from: { r: from.r, c: from.c }, to: { r: to.r, c: to.c }, note, isAi, isJump };
}

// 1. Quiet Positional
function makeQuiet(tier = 8) {
  const white = [46, 37, 32, 28, 41, 48, 50];
  const black = [15, 20, 24, 18, 9, 2, 3];
  const steps = [
    st(1, 41, 36, 'White plays quiet prophylactic wing lock: 41-36!'),
    st(2, 15, 20, 'Black seeks counterplay: 15-20.', true),
    st(1, 37, 31, 'White clamps the flank: 37-31!'),
    st(2, 20, 25, 'Black pushes forward: 20-25.', true),
    st(1, 28, 22, 'White strikes the center: 28-22!'),
    st(2, 18, 23, 'Black forced to counter: 18-23.', true),
    st(1, 31, 26, 'White seizes decisive outpost: 31-26!'),
    st(2, 24, 30, 'Black desperate counter-thrust: 24-30.', true),
    st(1, 32, 28, 'White anchors the position: 32-28!')
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
  return calculateComprehensivePuzzleDifficulty({
    steps, candidates, winningMoveSig: '41-36', bestScore: 6.5, secondBestScore: 5.8,
    isQuiet: true, candidateCount: candidates.length, isMoveOrderCritical: true,
    themes: ['best-positional-move', 'restrict-mobility', 'prophylaxis', 'central-control']
  });
}

// 2. Move Order Trap
function makeMoveOrderTrap(tier = 9) {
  const steps = [
    st(1, 33, 28, 'White initiates first sacrifice: 33-28!'),
    st(2, 23, 34, 'Black compulsory capture: 23x34!', true, true),
    st(1, 24, 19, 'White executes second decoy: 24-19!'),
    st(2, 14, 25, 'Black compulsory capture: 14x25!', true, true),
    st(1, 20, 29, 'White sweeper starts the grand sweep: 20x29!', false, true),
    st(1, 29, 38, 'Sweep continues: 29x38!', false, true),
    st(1, 38, 47, 'Crowns Oba King: 38x47!', false, true),
    st(2, 10, 14, 'Black tries to mobilize: 10-14.', true),
    st(1, 47, 24, 'Oba King sweeps across the board: 47-24!', false),
    st(2, 5, 10, 'Black steps forward: 5-10.', true),
    st(1, 24, 15, 'White finishes the endgame: 24-15!')
  ];
  const candidates = [
    { fromSq: 24, toSq: 19, moveSig: '24-19', attractiveness: 90, isAttack: true, isObviousSacrifice: true, toR: 3, refutation: 'Inverted move order: Black captures 14x25 threatening White 20; 33-28 now fails.' },
    { fromSq: 33, toSq: 29, moveSig: '33-29', attractiveness: 80, isAttack: true, toR: 5, refutation: 'Passive attack, allows Black 23-28 consolidation.' },
    { fromSq: 38, toSq: 32, moveSig: '38-32', attractiveness: 70, toR: 6, refutation: 'Slow move, misses the tactical window.' },
    { fromSq: 46, toSq: 41, moveSig: '46-41', attractiveness: 65, toR: 8, refutation: 'Allows Black 23-28 breakthrough.' },
    { fromSq: 20, toSq: 15, moveSig: '20-15', attractiveness: 60, toR: 3, refutation: 'Premature advance without combination support.' },
    { fromSq: 33, toSq: 28, moveSig: '33-28', attractiveness: 40, isAttack: true, toR: 5 }, // Winning move (rank 6 in human attractiveness -> massive deception!)
    { fromSq: 42, toSq: 37, moveSig: '42-37', attractiveness: 20, isQuiet: true, toR: 7 },
    { fromSq: 50, toSq: 45, moveSig: '50-45', attractiveness: 15, isQuiet: true, toR: 8 }
  ];
  return calculateComprehensivePuzzleDifficulty({
    steps, candidates, winningMoveSig: '33-28', bestScore: 9.8, secondBestScore: 9.4,
    sacrificeLevel: 7, isMoveOrderCritical: true, hasKing: true, candidateCount: candidates.length,
    themes: ['zwischenzug', 'multi-stage-sacrifice', 'forced-capture', 'combination']
  });
}

// 3. Defensive Technique
function makeDefensive(tier = 7) {
  const steps = [
    st(1, 27, 21, 'White plays stunning counter-sacrifice: 27-21!!'),
    st(2, 16, 27, 'Black compulsory capture: 16x27!', true, true),
    st(1, 37, 31, 'White traps the lead runner: 37-31!'),
    st(2, 27, 36, 'Black forced capture: 27x36!', true, true),
    st(1, 47, 27, 'White delivers the saving sweep: 47x38x27!')
  ];
  const candidates = [
    { fromSq: 37, toSq: 31, moveSig: '37-31', attractiveness: 85, isAttack: true, toR: 6, refutation: 'Natural retreat blunders: Black crowns 18-23 and 24-30 winning.' },
    { fromSq: 42, toSq: 37, moveSig: '42-37', attractiveness: 75, toR: 7, refutation: 'Passive defense loses to Black coronation.' },
    { fromSq: 48, toSq: 43, moveSig: '48-43', attractiveness: 65, toR: 8, refutation: 'Too slow, Black breaks through.' },
    { fromSq: 27, toSq: 21, moveSig: '27-21', attractiveness: 30, isObviousSacrifice: true, toR: 4 }, // Winning move
    { fromSq: 42, toSq: 38, moveSig: '42-38', attractiveness: 20, isQuiet: true, toR: 7 }
  ];
  return calculateComprehensivePuzzleDifficulty({
    steps, candidates, winningMoveSig: '27-21', bestScore: 0.0, secondBestScore: -4.5,
    isDefensive: true, sacrificeLevel: 4, candidateCount: candidates.length,
    themes: ['defensive-technique', 'forced-draw', 'sacrifice', 'last-piece-survival']
  });
}

// 4. Zugzwang Otilo (Tier 10 Elite)
function makeZugzwang(tier = 10) {
  const steps = [
    st(1, 46, 28, 'White Oba King seizes square 28 on the Highway!'),
    st(2, 5, 10, 'Black King forced into the rim: 5-10.', true),
    st(1, 28, 33, 'White King executes triangulation: 28-33!'),
    st(2, 10, 15, 'Black King in total zugzwang: 10-15.', true),
    st(1, 33, 47, 'White seizes the double-diagonal: 33-47!'),
    st(2, 15, 20, 'Black desperate advance: 15-20.', true),
    st(1, 47, 24, 'White traps the opponent King: 47-24!')
  ];
  const candidates = [
    { fromSq: 46, toSq: 5, moveSig: '46-5', attractiveness: 90, isAttack: true, toR: 0, refutation: 'Direct chase fails: Black King escapes to square 14.' },
    { fromSq: 46, toSq: 32, moveSig: '46-32', attractiveness: 80, toR: 6, refutation: 'Leaves Highway open, allowing Black King to break free.' },
    { fromSq: 50, toSq: 45, moveSig: '50-45', attractiveness: 70, toR: 8, refutation: 'Pawn push is too slow, allowing Black King to penetrate.' },
    { fromSq: 46, toSq: 37, moveSig: '46-37', attractiveness: 65, toR: 7, refutation: 'Wrong diagonal, loses opposition.' },
    { fromSq: 46, toSq: 28, moveSig: '46-28', attractiveness: 25, isQuiet: true, isWaiting: true, toR: 5 }, // Winning king move
    { fromSq: 50, toSq: 44, moveSig: '50-44', attractiveness: 20, isQuiet: true, toR: 8 },
    { fromSq: 46, toSq: 41, moveSig: '46-41', attractiveness: 15, isQuiet: true, toR: 8 }
  ];
  return calculateComprehensivePuzzleDifficulty({
    steps, candidates, winningMoveSig: '46-28', bestScore: 10.0, secondBestScore: 9.6,
    isZugzwang: true, hasKing: true, isQuiet: true, isMoveOrderCritical: true, candidateCount: candidates.length,
    themes: ['zugzwang', 'king-trapping', 'endgame-opposition', 'winning-technique']
  });
}

// 5. Deceptive Capture (Tier 11 World-Class)
function makeDeceptiveCapture(tier = 11) {
  const steps = [
    st(1, 45, 34, 'White chooses the counter-intuitive lateral capture: 45x34!', false, true),
    st(2, 30, 35, 'Black forced advance: 30-35.', true),
    st(1, 34, 29, 'White cements the blockade: 34-29!'),
    st(2, 25, 30, 'Black attacks the outpost: 25-30.', true),
    st(1, 29, 24, 'White wedge penetration: 29-24!'),
    st(2, 35, 40, 'Black tries to break through: 35-40.', true),
    st(1, 50, 45, 'White clamps the promotion runner: 50-45!'),
    st(2, 40, 44, 'Black steps forward: 40-44.', true),
    st(1, 45, 40, 'White traps the runner: 45-40!')
  ];
  const candidates = [
    { fromSq: 35, toSq: 4, moveSig: '35x4', attractiveness: 98, isCapture: true, jumpCount: 3, toR: 0, refutation: 'The Poisoned Triple-Capture: Greedily taking 3 pieces crowns on 4, but Black immediately counter-sweeps 15x24x33x42x50! and wins!' },
    { fromSq: 35, toSq: 24, moveSig: '35x24', attractiveness: 75, isCapture: true, jumpCount: 1, toR: 4, refutation: 'Wrong recapture allows Black 30-35 flank breakthrough.' },
    { fromSq: 40, toSq: 34, moveSig: '40-34', attractiveness: 65, toR: 6, refutation: 'Passive push blunders to 30x39.' },
    { fromSq: 50, toSq: 44, moveSig: '50-44', attractiveness: 55, toR: 8, refutation: 'Slow move, misses the tactical requirement.' },
    { fromSq: 45, toSq: 34, moveSig: '45x34', attractiveness: 25, isCapture: true, jumpCount: 1, toR: 6 }, // Winning move
    { fromSq: 45, toSq: 40, moveSig: '45-40', attractiveness: 20, isQuiet: true, toR: 7 },
    { fromSq: 50, toSq: 45, moveSig: '50-45', attractiveness: 15, isQuiet: true, toR: 8 },
    { fromSq: 35, toSq: 30, moveSig: '35-30', attractiveness: 15, isQuiet: true, toR: 5 }
  ];
  return calculateComprehensivePuzzleDifficulty({
    steps, candidates, winningMoveSig: '45x34', bestScore: 8.5, secondBestScore: 8.1,
    isQuiet: false, isMoveOrderCritical: true, isZugzwang: true, candidateCount: candidates.length,
    themes: ['refutation', 'counterattack', 'double-capture', 'restrict-mobility', 'zugzwang']
  });
}

const q = makeQuiet(8);
console.log('Tier 8 (Grandmaster) Quiet: Score =', q.humanDifficulty, 'Gate satisfied =', satisfiesTierGate(8, q.humanDifficulty));

const m = makeMoveOrderTrap(9);
console.log('Tier 9 (Super GM) Move-Order: Score =', m.humanDifficulty, 'Gate satisfied =', satisfiesTierGate(9, m.humanDifficulty));

const d = makeDefensive(7);
console.log('Tier 7 (Master) Defensive: Score =', d.humanDifficulty, 'Gate satisfied =', satisfiesTierGate(7, d.humanDifficulty));

const z = makeZugzwang(10);
console.log('Tier 10 (Elite) Zugzwang: Score =', z.humanDifficulty, 'Gate satisfied =', satisfiesTierGate(10, z.humanDifficulty));

const c = makeDeceptiveCapture(11);
console.log('Tier 11 (World-Class) Deceptive: Score =', c.humanDifficulty, 'Gate satisfied =', satisfiesTierGate(11, c.humanDifficulty));
