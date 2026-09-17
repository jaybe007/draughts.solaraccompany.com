/**
 * High-Performance 50-Square Draughts Engine (engine50.js)
 * 
 * Supports:
 * - Standard 50-square representation (squares 1..50)
 * - Bijective constant-time mapping to 10x10 board (r, c)
 * - In-place makeMove / unmakeMove for high-speed game-tree search (>500,000 nodes/sec)
 * - Full International Draughts (FMJD) rules:
 *   * Majority capture rule (compulsory maximum pieces captured)
 *   * Mid-jump non-promotion rule (man traversing king row mid-chain continues as man)
 *   * Long king diagonal flight & landing on any square beyond captured piece
 * - Nigerian Street Draughts rules:
 *   * Flying king (Oba) & backward seed captures
 *   * Free choice of capture path
 *   * Nigerian Highway (Main Long Diagonal)
 * - Draw rules (threefold repetition, 25-move king rule)
 */

export const EMPTY = 0;
export const P1_MAN = 1;   // White / Light man (moves up towards squares 1..5)
export const P1_KING = 2;  // White / Light king
export const P2_MAN = 3;   // Dark man (moves down towards squares 46..50)
export const P2_KING = 4;  // Dark king

export const PLAYER_1 = 1;
export const PLAYER_2 = 2;

// 4 Diagonal directions: 0 = Up-Left (UL), 1 = Up-Right (UR), 2 = Down-Left (DL), 3 = Down-Right (DR)
export const DIR_UL = 0;
export const DIR_UR = 1;
export const DIR_DL = 2;
export const DIR_DR = 3;
export const DIRECTIONS = [DIR_UL, DIR_UR, DIR_DL, DIR_DR];

// Direction deltas in (r, c):
const DIR_DELTA = [
  [-1, -1], // UL
  [-1,  1], // UR
  [ 1, -1], // DL
  [ 1,  1]  // DR
];

/**
 * Bijective coordinate converters between (r, c) on 10x10 and sq (1..50)
 */
export function rcToSq(r, c) {
  if (r < 0 || r >= 10 || c < 0 || c >= 10) return 0;
  if ((r + c) % 2 !== 0) return 0; // Not a playable dark square
  return r * 5 + Math.floor(c / 2) + 1;
}

export const SQ_TO_R = new Uint8Array(51);
export const SQ_TO_C = new Uint8Array(51);
export const SQ_TO_RC_OBJECTS = Array.from({ length: 51 }, (_, sq) => {
  if (sq < 1 || sq > 50) return null;
  const idx = sq - 1;
  const r = Math.floor(idx / 5);
  const colInRow = idx % 5;
  const c = (r % 2 === 0) ? (colInRow * 2) : (colInRow * 2 + 1);
  SQ_TO_R[sq] = r;
  SQ_TO_C[sq] = c;
  return Object.freeze({ r, c });
});

export function sqToRC(sq) {
  return SQ_TO_RC_OBJECTS[sq] || null;
}

// Precomputed table arrays for instant neighbor, jump, and ray lookup
export const NEIGHBORS = Array.from({ length: 51 }, () => new Int8Array(4));
export const JUMPS = Array.from({ length: 51 }, () => new Int8Array(4));
export const FLYING_RAYS = Array.from({ length: 51 }, () => [[], [], [], []]);

// Initialize lookup tables
(function initLookupTables() {
  for (let sq = 1; sq <= 50; sq++) {
    const { r, c } = sqToRC(sq);

    for (let d = 0; d < 4; d++) {
      const [dr, dc] = DIR_DELTA[d];
      
      // 1-step neighbor
      const nr = r + dr;
      const nc = c + dc;
      NEIGHBORS[sq][d] = rcToSq(nr, nc);

      // 2-step jump
      const jr = r + 2 * dr;
      const jc = c + 2 * dc;
      JUMPS[sq][d] = rcToSq(jr, jc);

      // Flying ray for king
      const ray = [];
      let step = 1;
      while (true) {
        const rr = r + step * dr;
        const cc = c + step * dc;
        const targetSq = rcToSq(rr, cc);
        if (targetSq === 0) break;
        ray.push(targetSq);
        step++;
      }
      FLYING_RAYS[sq][d] = ray;
    }
  }
})();

import { RulesEngine } from './rules_engine.js';

export class DraughtsBoard50 {
  constructor(options = {}) {
    this.board = new Uint8Array(51); // 1-indexed, square 0 unused
    this.currentTurn = PLAYER_1;
    this.ruleMode = options.ruleMode || 'nigeria'; // 'nigeria', 'ghana', 'international'
    this.rulesEngine = RulesEngine.getRuleProfile(this.ruleMode);
    this.p1Short = parseInt(options.p1Short || 0, 10);
    this.modifications = options.modifications || 'none';
    this.undoPly = 0;
    this.prevHalfMoveClock = new Int16Array(256);
    this.moveHistory = [];
    this.positionHistory = [];
    this.reset();
  }

  setRuleMode(mode) {
    this.ruleMode = mode;
    this.rulesEngine = RulesEngine.getRuleProfile(mode);
  }

  reset() {
    this.board.fill(EMPTY);
    this.currentTurn = PLAYER_1;
    this.halfMoveClock = 0;
    this.undoPly = 0;
    this.moveHistory = [];
    this.positionHistory = [];

    if (this.modifications === 'ten_aside') {
      // 10-aside: Dark on squares 1..10, White on squares 41..50
      for (let sq = 1; sq <= 10; sq++) this.board[sq] = P2_MAN;
      for (let sq = 41; sq <= 50; sq++) this.board[sq] = P1_MAN;
    } else {
      // Standard 20-pieces per side
      for (let sq = 1; sq <= 20; sq++) this.board[sq] = P2_MAN;
      for (let sq = 31; sq <= 50; sq++) this.board[sq] = P1_MAN;
    }

    // Apply Player 1 Short handicap (remove from foremost white row: squares 31..35)
    if (this.p1Short > 0) {
      let removed = 0;
      for (let sq = 31; sq <= 35 && removed < this.p1Short; sq++) {
        if (this.board[sq] === P1_MAN) {
          this.board[sq] = EMPTY;
          removed++;
        }
      }
    }

    // Crown start modifications
    if (this.modifications === 'crown_start_left_left') {
      this.board[1] = P2_KING;
      this.board[46] = P1_KING;
    } else if (this.modifications === 'crown_start_middle_middle') {
      this.board[13] = P2_KING;
      this.board[38] = P1_KING;
    }
  }

  clone() {
    const copy = new DraughtsBoard50({
      ruleMode: this.ruleMode,
      p1Short: this.p1Short,
      modifications: this.modifications
    });
    copy.board.set(this.board);
    copy.currentTurn = this.currentTurn;
    copy.halfMoveClock = this.halfMoveClock;
    copy.moveHistory = [...this.moveHistory];
    return copy;
  }

  isP1(piece) {
    return piece === P1_MAN || piece === P1_KING;
  }

  isP2(piece) {
    return piece === P2_MAN || piece === P2_KING;
  }

  isOpponent(piece, player) {
    if (piece === EMPTY) return false;
    return player === PLAYER_1 ? (piece === P2_MAN || piece === P2_KING) : (piece === P1_MAN || piece === P1_KING);
  }

  isKing(piece) {
    return piece === P1_KING || piece === P2_KING;
  }

  isKingRow(sq, player) {
    if (player === PLAYER_1) {
      return sq >= 1 && sq <= 5; // White king row
    } else {
      return sq >= 46 && sq <= 50; // Dark king row
    }
  }

  /**
   * Generates all legal moves for the given player under the active ruleset.
   * Delegates to RulesEngine.
   */
  generateLegalMoves(player = this.currentTurn) {
    return this.rulesEngine.generateLegalMoves(this, player);
  }

  /**
   * Generates quiet (non-capturing) moves.
   */
  generateQuietMoves(player = this.currentTurn) {
    return this.rulesEngine.generateQuietMoves(this, player);
  }

  /**
   * Generates all complete multi-jump capture sequences for all pieces.
   */
  generateAllCaptures(player = this.currentTurn) {
    return this.rulesEngine.generateAllCaptures(this, player);
  }

  /**
   * Recursive capture sequence finder for a single piece.
   */
  getPieceCaptureSequences(sq, piece, player, jumpedSquares = [], jumpedPieces = [], pathSquares = [sq]) {
    return this.rulesEngine.generateCaptureSequences(this, sq, piece, player, jumpedSquares, jumpedPieces, pathSquares);
  }

  /**
   * O(1) in-place move execution.
   */
  makeMove(move) {
    this.prevHalfMoveClock[this.undoPly++] = this.halfMoveClock;

    const moverPiece = this.board[move.from];

    // Lift moving piece
    this.board[move.from] = EMPTY;

    // Place piece at destination (crowned if promoted)
    if (move.promoted) {
      this.board[move.to] = (this.currentTurn === PLAYER_1 ? P1_KING : P2_KING);
    } else {
      this.board[move.to] = moverPiece;
    }

    // Lift jumped pieces
    if (move.isCapture) {
      this.halfMoveClock = 0;
      for (let i = 0; i < move.jumpedSquares.length; i++) {
        this.board[move.jumpedSquares[i]] = EMPTY;
      }
    } else {
      if (this.isKing(moverPiece)) {
        this.halfMoveClock++;
      } else {
        this.halfMoveClock = 0;
      }
    }

    this.currentTurn = this.currentTurn === PLAYER_1 ? PLAYER_2 : PLAYER_1;
  }

  /**
   * O(1) in-place move retraction.
   */
  unmakeMove(move) {
    if (this.undoPly === 0) return;
    this.halfMoveClock = this.prevHalfMoveClock[--this.undoPly];
    this.currentTurn = this.currentTurn === PLAYER_1 ? PLAYER_2 : PLAYER_1;

    // Remove piece from destination
    this.board[move.to] = EMPTY;

    // Restore original piece to source
    this.board[move.from] = move.prevPiece;

    // Restore jumped pieces
    if (move.isCapture) {
      for (let i = 0; i < move.jumpedSquares.length; i++) {
        this.board[move.jumpedSquares[i]] = move.jumpedPieces[i];
      }
    }
  }

  /**
   * Game outcome evaluation: win / loss / draw.
   * Delegates to RulesEngine.
   */
  isGameOver() {
    return this.rulesEngine.isGameOver(this);
  }

  /**
   * Fast Perft move count function to verify engine correctness.
   */
  perft(depth) {
    if (depth === 0) return 1;

    const moves = this.generateLegalMoves(this.currentTurn);
    if (depth === 1) return moves.length;

    let nodes = 0;
    for (let i = 0; i < moves.length; i++) {
      this.makeMove(moves[i]);
      nodes += this.perft(depth - 1);
      this.unmakeMove(moves[i]);
    }
    return nodes;
  }
}
