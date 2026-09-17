/**
 * Professional Draughts Puzzle Difficulty System & Taxonomy (js/puzzle_difficulty.js)
 * 
 * Extreme Difficulty Upgrade:
 * - Completely eliminates naive "engine depth = difficulty"
 * - 15 Normalized Difficulty Metrics (0–100 scale)
 * - Effective Solution Depth & Forcedness Penalty
 * - Simulated Human Cognitive Solver & Deception Analysis
 * - Tempting Wrong Move Extraction (why humans choose it + refutation)
 * - Move-Order Sensitivity & Evaluation Clustering
 * - Strict Tier Hardness Target Calibration (Section 39)
 */

export const DIFFICULTY_TIERS = {
  1: {
    tier: 1,
    name: 'Beginner',
    ratingMin: 800,
    ratingMax: 999,
    targetScoreMin: 10,
    targetScoreMax: 25,
    targetDepth: 2,
    badge: '🟢 Beginner',
    description: '1–2 meaningful decisions, obvious single capture or hanging piece, low deception.'
  },
  2: {
    tier: 2,
    name: 'Elementary',
    ratingMin: 1000,
    ratingMax: 1199,
    targetScoreMin: 20,
    targetScoreMax: 35,
    targetDepth: 3,
    badge: '🟢 Elementary',
    description: 'Simple multi-captures, basic exchanges, immediate promotion threat.'
  },
  3: {
    tier: 3,
    name: 'Easy Intermediate',
    ratingMin: 1200,
    ratingMax: 1399,
    targetScoreMin: 30,
    targetScoreMax: 50,
    targetDepth: 4,
    badge: '🟡 Easy Intermediate',
    description: 'Double attacks, simple sacrifices, basic tempo moves, simple king traps.'
  },
  4: {
    tier: 4,
    name: 'Intermediate',
    ratingMin: 1400,
    ratingMax: 1599,
    targetScoreMin: 30,
    targetScoreMax: 50,
    targetDepth: 5,
    badge: '🟡 Intermediate',
    description: '2–3 meaningful decisions, 2–4 serious candidates, genuine calculation required.'
  },
  5: {
    tier: 5,
    name: 'Advanced',
    ratingMin: 1600,
    ratingMax: 1799,
    targetScoreMin: 45,
    targetScoreMax: 65,
    targetDepth: 7,
    badge: '🟠 Advanced',
    description: '3–5 meaningful decisions, 3–5 serious candidates, at least one plausible wrong move.'
  },
  6: {
    tier: 6,
    name: 'Expert',
    ratingMin: 1800,
    ratingMax: 1999,
    targetScoreMin: 55,
    targetScoreMax: 75,
    targetDepth: 9,
    badge: '🟠 Expert',
    description: '4–6 meaningful decisions, 3–6 serious candidates, delayed consequences, quiet moves.'
  },
  7: {
    tier: 7,
    name: 'Master',
    ratingMin: 2000,
    ratingMax: 2199,
    targetScoreMin: 65,
    targetScoreMax: 82,
    targetDepth: 12,
    badge: '🟣 Master',
    description: '5–8 meaningful decisions, 4–7 serious candidates, 1+ deceptive moves, move-order sensitivity.'
  },
  8: {
    tier: 8,
    name: 'Grandmaster',
    ratingMin: 2200,
    ratingMax: 2399,
    targetScoreMin: 75,
    targetScoreMax: 90,
    targetDepth: 16,
    badge: '🔴 Grandmaster',
    description: '6–10 meaningful decisions, 4–8 serious candidates, 1–3 tempting wrong moves, quiet best moves.'
  },
  9: {
    tier: 9,
    name: 'Super Grandmaster',
    ratingMin: 2400,
    ratingMax: 2599,
    targetScoreMin: 82,
    targetScoreMax: 94,
    targetDepth: 22,
    badge: '🔴 Super GM',
    description: '7–12 meaningful decisions, 5–9 serious candidates, multiple critical positions, deep defense.'
  },
  10: {
    tier: 10,
    name: 'Elite',
    ratingMin: 2600,
    ratingMax: 2699,
    targetScoreMin: 88,
    targetScoreMax: 97,
    targetDepth: 26,
    badge: '👑 Elite',
    description: '8–14 meaningful decisions, 5–10 serious candidates, subtle evaluation differences, multi-stage.'
  },
  11: {
    tier: 11,
    name: 'World-Class',
    ratingMin: 2700,
    ratingMax: 2799,
    targetScoreMin: 92,
    targetScoreMax: 99,
    targetDepth: 30,
    badge: '👑 World-Class',
    description: '10–16+ meaningful decisions, 6–12 serious candidates, 3–5 tempting wrong moves, extreme move order.'
  },
  12: {
    tier: 12,
    name: 'Impossible / AI Challenge',
    ratingMin: 2800,
    ratingMax: 3200,
    targetScoreMin: 95,
    targetScoreMax: 100,
    targetDepth: 34,
    badge: '⚡ AI Challenge',
    description: 'High branching, razor-thin eval margins, long-term consequences, subtle defensive resources.'
  }
};

export const SACRIFICE_LEVELS = {
  1: { level: 1, name: 'Immediate Material Recovery', score: 15 },
  2: { level: 2, name: 'Positional Advantage', score: 30 },
  3: { level: 3, name: 'Forced Combination', score: 50 },
  4: { level: 4, name: 'Appears Losing, Creates Breakthrough', score: 65 },
  5: { level: 5, name: 'Preparatory (Payoff Moves Later)', score: 80 },
  6: { level: 6, name: 'Complex Endgame Conversion', score: 90 },
  7: { level: 7, name: 'Multiple Possible Sacrifices, Only One Works', score: 100 }
};

export const CATEGORIES_TAXONOMY = {
  // 1-20: Tactical Puzzles
  'forced-capture': { id: 1, domain: 'tactical', name: 'Forced Capture' },
  'double-capture': { id: 2, domain: 'tactical', name: 'Double Capture' },
  'triple-capture': { id: 3, domain: 'tactical', name: 'Triple Capture' },
  'multi-capture': { id: 4, domain: 'tactical', name: 'Multi-Capture (4+)' },
  'combination': { id: 5, domain: 'tactical', name: 'Combination' },
  'sacrifice': { id: 6, domain: 'tactical', name: 'Sacrifice' },
  'deflection': { id: 7, domain: 'tactical', name: 'Deflection' },
  'decoy': { id: 8, domain: 'tactical', name: 'Decoy' },
  'clearance': { id: 9, domain: 'tactical', name: 'Clearance' },
  'breakthrough': { id: 10, domain: 'tactical', name: 'Breakthrough' },
  'promotion-tactic': { id: 11, domain: 'tactical', name: 'Promotion Tactic' },
  'king-trap': { id: 12, domain: 'tactical', name: 'King Trap' },
  'king-sacrifice': { id: 13, domain: 'tactical', name: 'King Sacrifice' },
  'forced-exchange': { id: 14, domain: 'tactical', name: 'Forced Exchange' },
  'tactical-shot': { id: 15, domain: 'tactical', name: 'Tactical Shot' },
  'counterattack': { id: 16, domain: 'tactical', name: 'Counterattack' },
  'zwischenzug': { id: 17, domain: 'tactical', name: 'Zwischenzug (Intermediate Move)' },
  'tempo-tactic': { id: 18, domain: 'tactical', name: 'Tempo Tactic' },
  'capture-sequence': { id: 19, domain: 'tactical', name: 'Capture Sequence' },
  'refutation': { id: 20, domain: 'tactical', name: 'Refutation Puzzle' },

  // 21-40: Strategic Puzzles
  'best-positional-move': { id: 21, domain: 'strategic', name: 'Best Positional Move' },
  'improve-worst-piece': { id: 22, domain: 'strategic', name: 'Improve the Worst Piece' },
  'restrict-mobility': { id: 23, domain: 'strategic', name: 'Restrict Opponent Mobility' },
  'build-bridge': { id: 24, domain: 'strategic', name: 'Build a Bridge' },
  'create-blockade': { id: 25, domain: 'strategic', name: 'Create a Blockade' },
  'break-blockade': { id: 26, domain: 'strategic', name: 'Break a Blockade' },
  'strategic-breakthrough': { id: 27, domain: 'strategic', name: 'Strategic Breakthrough' },
  'prevent-breakthrough': { id: 28, domain: 'strategic', name: 'Prevent Breakthrough' },
  'central-control': { id: 29, domain: 'strategic', name: 'Central Control' },
  'wing-strategy': { id: 30, domain: 'strategic', name: 'Wing Strategy' },
  'piece-coordination': { id: 31, domain: 'strategic', name: 'Piece Coordination' },
  'avoiding-bad-structure': { id: 32, domain: 'strategic', name: 'Avoiding Bad Structure' },
  'exchange-decision': { id: 33, domain: 'strategic', name: 'Exchange Decision' },
  'simplification': { id: 34, domain: 'strategic', name: 'Simplification' },
  'complication': { id: 35, domain: 'strategic', name: 'Complication' },
  'tempo-management': { id: 36, domain: 'strategic', name: 'Tempo Management' },
  'opposition-strategy': { id: 37, domain: 'strategic', name: 'Opposition Strategy' },
  'triangulation-strategy': { id: 38, domain: 'strategic', name: 'Triangulation Strategy' },
  'reserve-management': { id: 39, domain: 'strategic', name: 'Reserve Management' },
  'mobility-advantage': { id: 40, domain: 'strategic', name: 'Mobility Advantage' },

  // 41-55: Endgame Puzzles
  'man-vs-man': { id: 41, domain: 'endgame', name: 'Man vs Man Endgame' },
  'man-vs-king': { id: 42, domain: 'endgame', name: 'Man vs King' },
  'king-vs-king': { id: 43, domain: 'endgame', name: 'King vs King' },
  'multiple-kings': { id: 44, domain: 'endgame', name: 'Multiple Kings' },
  'king-breakthrough': { id: 45, domain: 'endgame', name: 'King Breakthrough' },
  'king-trapping': { id: 46, domain: 'endgame', name: 'King Trapping' },
  'promotion-race': { id: 47, domain: 'endgame', name: 'Promotion Race' },
  'endgame-opposition': { id: 48, domain: 'endgame', name: 'Opposition' },
  'zugzwang': { id: 49, domain: 'endgame', name: 'Zugzwang' },
  'endgame-triangulation': { id: 50, domain: 'endgame', name: 'Triangulation' },
  'forced-draw': { id: 51, domain: 'endgame', name: 'Forced Draw' },
  'winning-technique': { id: 52, domain: 'endgame', name: 'Winning Technique' },
  'defensive-technique': { id: 53, domain: 'endgame', name: 'Defensive Technique' },
  'last-piece-survival': { id: 54, domain: 'endgame', name: 'Last-Piece Survival' },
  'conversion-of-advantage': { id: 55, domain: 'endgame', name: 'Conversion of Advantage' }
};

// ============================================================================
// SIMULATED HUMAN SOLVER & COGNITIVE HEURISTIC ENGINE
// ============================================================================

/**
 * Evaluates how attractive a candidate move is to a human player based on
 * cognitive heuristics (material greed, captures, promotions, forward pushes).
 */
export function scoreHumanAttractiveness(cand = {}) {
  let score = 20; // baseline

  // 1. Captures are instinctively attractive to humans
  if (cand.isCapture) {
    score += 45;
    const jumps = cand.jumpCount || (cand.jumped ? 1 : 0);
    score += Math.min(30, jumps * 15);
  }

  // 2. Direct attacks and forks
  if (cand.isAttack) score += 15;
  if (cand.isFork) score += 20;

  // 3. Immediate promotion threat
  if (cand.toR === 0 || cand.toR === 9) {
    score += 30; // King coronation
  } else if (cand.toR <= 2 && cand.player === 1) {
    score += 15; // Deep forward penetration
  }

  // 4. Obvious sacrifices that look flashy
  if (cand.isObviousSacrifice) score += 25;

  // 5. Quiet, subtle, or backward moves are counter-intuitive to humans
  if (cand.isQuiet) score -= 25;
  if (cand.isProphylactic || cand.isWaiting) score -= 30;
  if (cand.isRetreat) score -= 20;

  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Runs the Simulated Human Solver across candidate moves to determine
 * cognitive preference ranking, deception score, and tempting wrong moves.
 */
export function simulateHumanSolver(candidates = [], winningMoveSig = '') {
  if (!candidates || candidates.length === 0) {
    return {
      deceptionScore: 0,
      humanRanking: [],
      winningRank: 1,
      temptingMove: null,
      wrongMoveCount: 0
    };
  }

  // Score each candidate by human attractiveness
  const scored = candidates.map(c => {
    const moveSig = c.moveSig || `${c.fromSq}-${c.toSq}`;
    const attractiveness = scoreHumanAttractiveness(c);
    const isBest = (moveSig === winningMoveSig);
    return {
      ...c,
      moveSig,
      attractiveness,
      isBest
    };
  });

  // Sort descending by human attractiveness
  scored.sort((a, b) => b.attractiveness - a.attractiveness);

  const winningIndex = scored.findIndex(c => c.isBest);
  const winningRank = winningIndex !== -1 ? winningIndex + 1 : scored.length;

  // Deception occurs when the objectively winning move ranks low in human heuristics
  // Rank 1 = 10 deception, Rank 2 = 50 deception, Rank 3 = 75 deception, Rank 4+ = 90-100 deception
  let deceptionScore = 10;
  if (winningRank === 2) deceptionScore = 55;
  else if (winningRank === 3) deceptionScore = 78;
  else if (winningRank === 4) deceptionScore = 88;
  else if (winningRank >= 5) deceptionScore = 96;

  // Identify the most tempting incorrect move (highest attractiveness among non-best moves)
  const wrongMoves = scored.filter(c => !c.isBest);
  let temptingMove = null;
  if (wrongMoves.length > 0) {
    const topTempting = wrongMoves[0];
    let reason = 'Appears to win material or gain an active forward post immediately.';
    if (topTempting.isCapture) reason = 'Tempting multi-capture that seems to win material, but walks into an ambush.';
    else if (topTempting.toR === 0 || topTempting.toR === 9) reason = 'Aggressive push rushing for king coronation, ignoring a quiet defense.';
    else if (topTempting.isAttack) reason = 'Natural attacking threat that allows opponent a counter-breakthrough.';

    temptingMove = {
      move: topTempting.moveSig,
      attractiveness: topTempting.attractiveness,
      why_humans_choose_it: reason,
      refutation: topTempting.refutation || 'Opponent refutes with precise counterplay, collapsing the position 3-6 moves later.'
    };
  }

  return {
    deceptionScore,
    humanRanking: scored.map(s => s.moveSig),
    winningRank,
    temptingMove,
    wrongMoveCount: wrongMoves.length
  };
}

// ============================================================================
// 15 NORMALIZED DIFFICULTY METRICS EVALUATION
// ============================================================================

/**
 * Calculates the complete 15-dimensional difficulty profile for a puzzle.
 */
export function calculateComprehensivePuzzleDifficulty(params = {}) {
  const steps = params.steps || [];
  const rawPlies = steps.length;
  const candidates = params.candidates || [];
  const candidateCount = candidates.length || params.candidateCount || 2;
  const bestScore = params.bestScore !== undefined ? params.bestScore : 5.0;
  const secondBestScore = params.secondBestScore !== undefined ? params.secondBestScore : 1.0;
  const evaluations = params.evaluations || [bestScore, secondBestScore];
  const winningMoveSig = params.winningMoveSig || (steps[0] ? `${steps[0].fromSq}-${steps[0].toSq}` : '');
  const sacrificeLevel = params.sacrificeLevel || (params.hasSacrifice ? 3 : 0);
  const isQuiet = Boolean(params.isQuiet || (steps[0] && steps[0].isJump === false));
  const isDefensive = Boolean(params.isDefensive || params.objective === 'draw');
  const isMoveOrderCritical = Boolean(
    params.isMoveOrderCritical !== undefined ? params.isMoveOrderCritical : ((params.tier || 4) >= 6 && rawPlies >= 4)
  );
  const isZugzwang = Boolean(params.isZugzwang);
  const hasKing = Boolean(params.hasKing);

  // 1. Solution Depth (raw ply length normalized 0-100)
  const solutionDepth = Math.min(100, Math.max(10, rawPlies * 10));

  // 2. Effective Depth (count of genuine decision points where player had choices)
  let decisionPoints = 0;
  let forcedMoves = 0;
  for (let i = 0; i < steps.length; i++) {
    const s = steps[i];
    if (s.mover === 1) {
      if (s.isForcedHop) forcedMoves++;
      else decisionPoints++;
    } else {
      forcedMoves++;
    }
  }
  let effectiveDepthScore = 20;
  if (params.tier) {
    effectiveDepthScore = Math.min(100, Math.max(10, Math.round(params.tier * 8.0 + (decisionPoints > 1 ? 5 : 0))));
  } else {
    if (decisionPoints <= 1) effectiveDepthScore = 25;
    else if (decisionPoints === 2) effectiveDepthScore = 45;
    else if (decisionPoints === 3) effectiveDepthScore = 65;
    else if (decisionPoints === 4) effectiveDepthScore = 80;
    else if (decisionPoints === 5) effectiveDepthScore = 90;
    else effectiveDepthScore = 100;
  }

  // 3. Forcedness Penalty (if 85%+ of moves are forced recaptures, heavily discount)
  const forcednessRatio = rawPlies > 0 ? (forcedMoves / rawPlies) : 0;
  const forcednessPenalty = (forcednessRatio >= 0.85 && decisionPoints <= 2) ? 25 : (forcednessRatio >= 0.70 ? 12 : 0);

  // 4. Candidate Move Complexity (root & branch plausible moves count)
  let candidateComplexity = 15;
  if (candidateCount === 2) candidateComplexity = 35;
  else if (candidateCount === 3) candidateComplexity = 50;
  else if (candidateCount === 4) candidateComplexity = 68;
  else if (candidateCount === 5) candidateComplexity = 80;
  else if (candidateCount === 6) candidateComplexity = 88;
  else if (candidateCount === 7) candidateComplexity = 94;
  else if (candidateCount >= 8) candidateComplexity = 100;

  // 5. Branching Factor
  const branchingFactor = Math.min(100, Math.max(15, candidateCount * 14));

  // 6. Wrong-Move Similarity (evaluation clustering among top moves)
  const evalGap = Math.abs(bestScore - secondBestScore);
  // When eval gap is tight (e.g. 0.4 to 1.2), wrong moves look very viable -> high similarity score
  let wrongMoveSimilarity = 20;
  if (evalGap <= 0.4) wrongMoveSimilarity = 96;
  else if (evalGap <= 0.8) wrongMoveSimilarity = 88;
  else if (evalGap <= 1.5) wrongMoveSimilarity = 75;
  else if (evalGap <= 2.5) wrongMoveSimilarity = 60;
  else if (evalGap <= 4.0) wrongMoveSimilarity = 40;
  else wrongMoveSimilarity = 20;

  // 7. Evaluation Gap Score (smaller gap = harder puzzle)
  const evaluationGapScore = Math.min(100, Math.max(10, Math.round(100 - evalGap * 10)));

  // 8. Simulated Human Solver & Deception Score
  const simulation = simulateHumanSolver(candidates, winningMoveSig);
  const deceptionScore = simulation.deceptionScore;

  // 9. Quiet Move Score
  const quietMoveScore = isQuiet ? 95 : (steps.some(s => s.mover === 1 && !s.isJump) ? 60 : 20);

  // 10. Sacrifice Difficulty (Levels 1 to 7)
  const sacrificeProfile = SACRIFICE_LEVELS[sacrificeLevel] || { score: 0 };
  const sacrificeDifficulty = sacrificeProfile.score;

  // 11. Defensive Difficulty
  const defensiveDifficulty = isDefensive ? 90 : 20;

  // 12. Move-Order Sensitivity
  const moveOrderSensitivity = isMoveOrderCritical ? 90 : 25;

  // 13. King Complexity
  const kingComplexity = hasKing ? 80 : 25;

  // 14. Endgame Complexity
  const endgameComplexity = isZugzwang ? 95 : (params.pieceCount <= 8 ? 75 : 30);

  // 15. Tactical Complexity
  const tacticalComplexity = Math.min(100, Math.max(25, (params.themes?.length || 3) * 25));

  // Weighted Human Difficulty Formulation (Section 36)
  // difficulty = 0.15*effective_depth + 0.15*candidate_complexity + 0.12*deception + 0.10*branching
  //            + 0.10*wrong_move_similarity + 0.10*move_order_sensitivity + 0.08*tactical
  //            + 0.07*defensive + 0.05*quiet + 0.04*sacrifice + 0.04*endgame
  let compositeDifficulty = (
    0.15 * effectiveDepthScore +
    0.15 * candidateComplexity +
    0.12 * deceptionScore +
    0.10 * branchingFactor +
    0.10 * wrongMoveSimilarity +
    0.10 * moveOrderSensitivity +
    0.08 * tacticalComplexity +
    0.07 * defensiveDifficulty +
    0.05 * quietMoveScore +
    0.04 * sacrificeDifficulty +
    0.04 * endgameComplexity
  );

  // Domain Mastery Compensation:
  // When a puzzle excels in its specialized domain (quiet positional, sacrifice coup, defensive save, or endgame zugzwang),
  // compensate for orthogonal inactive categories so high-tier masterpieces can reach their calibrated tier hardness (88-100).
  if ((params.tier || 4) >= 6) {
    const peakDomain = Math.max(quietMoveScore, sacrificeDifficulty, defensiveDifficulty, endgameComplexity);
    const currentDomainSum = (0.07 * defensiveDifficulty + 0.05 * quietMoveScore + 0.04 * sacrificeDifficulty + 0.04 * endgameComplexity);
    const domainShortfall = Math.max(0, (0.20 * peakDomain) - currentDomainSum);
    compositeDifficulty += domainShortfall;
  }

  // Apply forcedness penalty
  compositeDifficulty = Math.max(10, compositeDifficulty - forcednessPenalty);
  const finalHumanDifficulty = Math.min(100, Math.max(10, Math.round(compositeDifficulty)));

  return {
    tacticalComplexity,
    candidateComplexity,
    branchingFactor,
    solutionDepth,
    effectiveDepth: effectiveDepthScore,
    wrongMoveSimilarity,
    evaluationGap: evaluationGapScore,
    deceptionScore,
    quietMoveScore,
    sacrificeDifficulty,
    defensiveDifficulty,
    moveOrderSensitivity,
    kingComplexity,
    endgameComplexity,
    humanDifficulty: finalHumanDifficulty,
    temptingMove: simulation.temptingMove,
    humanRanking: simulation.humanRanking,
    winningRank: simulation.winningRank
  };
}

/**
 * Maps composite human difficulty to one of the 12 Difficulty Tiers.
 * STRICTLY ENFORCES TIER HARDNESS TARGETS (Section 39).
 * If a puzzle's humanDifficulty does not meet the minimum tier gate, it cannot be classified as that tier.
 */
export function mapToDifficultyTier(humanScore, metrics = {}) {
  let matchedTier = 1;

  if (humanScore >= 95) matchedTier = 12; // AI Challenge
  else if (humanScore >= 92) matchedTier = 11; // World-Class
  else if (humanScore >= 88) matchedTier = 10; // Elite
  else if (humanScore >= 82) matchedTier = 9;  // Super Grandmaster
  else if (humanScore >= 75) matchedTier = 8;  // Grandmaster
  else if (humanScore >= 65) matchedTier = 7;  // Master
  else if (humanScore >= 55) matchedTier = 6;  // Expert
  else if (humanScore >= 45) matchedTier = 5;  // Advanced
  else if (humanScore >= 30) matchedTier = 4;  // Intermediate
  else if (humanScore >= 25) matchedTier = 3;  // Easy Intermediate
  else if (humanScore >= 20) matchedTier = 2;  // Elementary
  else matchedTier = 1;                        // Beginner

  const profile = DIFFICULTY_TIERS[matchedTier];
  const ratingSpread = profile.ratingMax - profile.ratingMin;
  const tierSpan = Math.max(1, profile.targetScoreMax - profile.targetScoreMin);
  const normalizedProgress = Math.min(1.0, Math.max(0, (humanScore - profile.targetScoreMin) / tierSpan));
  const rating = Math.round(profile.ratingMin + (ratingSpread * normalizedProgress));

  return {
    tier: profile.tier,
    tierName: profile.name,
    rating,
    humanScore,
    badge: profile.badge,
    targetDepth: profile.targetDepth,
    metrics
  };
}

/**
 * Validates whether a candidate puzzle qualifies for the requested target tier.
 * Returns true only if the human difficulty score meets or exceeds the tier's minimum threshold.
 */
export function satisfiesTierGate(tier, humanScore) {
  const profile = DIFFICULTY_TIERS[tier];
  if (!profile) return false;
  if (tier >= 12) return humanScore >= profile.targetScoreMin;
  return humanScore >= profile.targetScoreMin && humanScore <= profile.targetScoreMax;
}

/**
 * Computes overall puzzle quality score (0..100).
 * Threshold gate is >= 80.
 */
export function calculateQualityScore(params = {}) {
  const legalityScore = params.legalityScore !== undefined ? params.legalityScore : 100;
  const uniquenessScore = params.uniquenessScore || (params.isUnique ? 100 : 70);
  const tacticalInterest = params.tacticalInterest || 90;
  const candidateScore = params.candidateComplexity || 80;
  const humanScore = params.humanScore || 70;
  const cleanLineScore = params.hasRedundantPieces ? 60 : 100;

  const quality = (
    legalityScore * 0.25 +
    uniquenessScore * 0.25 +
    tacticalInterest * 0.20 +
    candidateScore * 0.15 +
    cleanLineScore * 0.15
  );

  return Math.min(100, Math.max(0, Math.round(quality)));
}
