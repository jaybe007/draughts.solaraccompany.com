/**
 * High-Performance Transposition Table for Draughts (transposition.js)
 * 
 * Uses Flat TypedArrays for zero garbage collection overhead.
 */

export const BOUND_NONE = 0;
export const BOUND_EXACT = 1;
export const BOUND_LOWER = 2; // Beta cutoff / Fail-high
export const BOUND_UPPER = 3; // Alpha cutoff / Fail-low

const MATE_THRESHOLD = 28000;

export class TranspositionTable {
  constructor(sizePowerOfTwo = 19) {
    // Default 2^19 = 524,288 entries (~16 MB)
    this.size = 1 << sizePowerOfTwo;
    this.mask = this.size - 1;

    this.keysHigh = new Uint32Array(this.size);
    this.keysLow = new Uint32Array(this.size);
    this.depths = new Int8Array(this.size);
    this.flags = new Uint8Array(this.size);
    this.scores = new Int16Array(this.size);
    this.bestMovesFrom = new Uint8Array(this.size);
    this.bestMovesTo = new Uint8Array(this.size);
    this.ages = new Uint8Array(this.size);

    this.currentAge = 0;
    this.hits = 0;
    this.probes = 0;
  }

  clear() {
    this.keysHigh.fill(0);
    this.keysLow.fill(0);
    this.depths.fill(0);
    this.flags.fill(BOUND_NONE);
    this.scores.fill(0);
    this.bestMovesFrom.fill(0);
    this.bestMovesTo.fill(0);
    this.ages.fill(0);
    this.hits = 0;
    this.probes = 0;
  }

  newAge() {
    this.currentAge = (this.currentAge + 1) & 0xFF;
  }

  /**
   * Probes the transposition table.
   */
  probe(hash, ply = 0) {
    this.probes++;
    let kh = 0, kl = 0;
    if (typeof hash === 'bigint') {
      kh = Number((hash >> 32n) & 0xFFFFFFFFn) >>> 0;
      kl = Number(hash & 0xFFFFFFFFn) >>> 0;
    } else {
      kh = (hash.high || 0) >>> 0;
      kl = (hash.low || hash) >>> 0;
    }
    const index = kl & this.mask;

    if (this.keysHigh[index] === kh && this.keysLow[index] === kl && this.flags[index] !== BOUND_NONE) {
      this.hits++;
      let score = this.scores[index];
      // Adjust mate score for distance to root
      if (score > MATE_THRESHOLD) {
        score -= ply;
      } else if (score < -MATE_THRESHOLD) {
        score += ply;
      }

      return {
        hit: true,
        depth: this.depths[index],
        score,
        flag: this.flags[index],
        bestMoveFrom: this.bestMovesFrom[index],
        bestMoveTo: this.bestMovesTo[index]
      };
    }

    return { hit: false };
  }

  /**
   * Stores an entry in the transposition table.
   * Uses depth-preferred replacement with age generation check.
   */
  store(hash, depth, score, flag, bestMove = null, ply = 0) {
    let kh = 0, kl = 0;
    if (typeof hash === 'bigint') {
      kh = Number((hash >> 32n) & 0xFFFFFFFFn) >>> 0;
      kl = Number(hash & 0xFFFFFFFFn) >>> 0;
    } else {
      kh = (hash.high || 0) >>> 0;
      kl = (hash.low || hash) >>> 0;
    }
    const index = kl & this.mask;

    // Adjust mate score for root distance
    let storedScore = score;
    if (storedScore > MATE_THRESHOLD) {
      storedScore += ply;
    } else if (storedScore < -MATE_THRESHOLD) {
      storedScore -= ply;
    }

    // Replacement condition: replace if slot is empty, if from previous age, or if new depth is >= stored depth
    const isSameKey = (this.keysHigh[index] === kh && this.keysLow[index] === kl);
    const isOlderAge = (this.ages[index] !== this.currentAge);
    const isDeeper = (depth >= this.depths[index]);

    if (!isSameKey && !isOlderAge && !isDeeper) {
      // Retain deeper entry, but update move if available
      if (bestMove && isSameKey) {
        this.bestMovesFrom[index] = bestMove.from;
        this.bestMovesTo[index] = bestMove.to;
      }
      return;
    }

    this.keysHigh[index] = kh;
    this.keysLow[index] = kl;
    this.depths[index] = depth;
    this.flags[index] = flag;
    this.scores[index] = Math.max(-32767, Math.min(32767, storedScore));
    this.ages[index] = this.currentAge;

    if (bestMove) {
      this.bestMovesFrom[index] = bestMove.from;
      this.bestMovesTo[index] = bestMove.to;
    }
  }

  getHitRate() {
    if (this.probes === 0) return 0;
    return Math.round((this.hits / this.probes) * 100);
  }
}
