/**
 * 64-bit Zobrist Hashing for Draughts (zobrist.js)
 */

import { EMPTY, P1_MAN, P1_KING, P2_MAN, P2_KING, PLAYER_1 } from './engine50.js';

// Deterministic PRNG (Mulberry32) for reproducible, non-colliding Zobrist keys
function mulberry32(a) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0);
  };
}

const rng = mulberry32(0x9E3779B9);

function random64() {
  const h = BigInt(rng());
  const l = BigInt(rng());
  return (h << 32n) | l;
}

// 51 squares x 5 piece states (0..4)
export const ZOBRIST_PIECES = Array.from({ length: 51 }, () => new Array(5));
for (let sq = 1; sq <= 50; sq++) {
  for (let p = 0; p <= 4; p++) {
    ZOBRIST_PIECES[sq][p] = p === EMPTY ? 0n : random64();
  }
}

export const ZOBRIST_SIDE = random64();

// Rule-aware 64-bit entropy keys (guarantees identical board under different rulesets produces distinct hashes)
export const ZOBRIST_RULESETS = {
  'nigeria': random64(),
  'ghana': random64(),
  'international': random64()
};
ZOBRIST_RULESETS['nigerian'] = ZOBRIST_RULESETS['nigeria'];
ZOBRIST_RULESETS['default'] = ZOBRIST_RULESETS['nigeria'];
ZOBRIST_RULESETS['damii'] = ZOBRIST_RULESETS['ghana'];
ZOBRIST_RULESETS['tournament'] = ZOBRIST_RULESETS['international'];
ZOBRIST_RULESETS['fmjd'] = ZOBRIST_RULESETS['international'];

/**
 * Computes the full 64-bit Zobrist hash of a 50-square board under the specified ruleset.
 */
export function computeZobristHash(board, currentTurn, ruleMode = 'nigeria') {
  const normRule = (ruleMode || 'nigeria').toString().toLowerCase().trim();
  const ruleKey = ZOBRIST_RULESETS[normRule] || ZOBRIST_RULESETS['nigeria'];
  let hash = ((currentTurn === PLAYER_1) ? 0n : ZOBRIST_SIDE) ^ ruleKey;
  for (let sq = 1; sq <= 50; sq++) {
    const piece = board[sq];
    if (piece !== EMPTY) {
      hash ^= ZOBRIST_PIECES[sq][piece];
    }
  }
  return hash;
}

/**
 * Updates hash incrementally for a move.
 */
export function updateZobristHash(hash, move) {
  let h = hash ^ ZOBRIST_SIDE;

  // Moving piece removed from `from`
  h ^= ZOBRIST_PIECES[move.from][move.prevPiece];

  // Moving piece placed at `to`
  const placedPiece = move.promoted
    ? (move.prevPiece === P1_MAN ? P1_KING : P2_KING)
    : move.prevPiece;
  h ^= ZOBRIST_PIECES[move.to][placedPiece];

  // Jumped pieces removed
  if (move.isCapture) {
    for (let i = 0; i < move.jumpedSquares.length; i++) {
      h ^= ZOBRIST_PIECES[move.jumpedSquares[i]][move.jumpedPieces[i]];
    }
  }

  return h;
}
