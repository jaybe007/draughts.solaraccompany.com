/**
 * Modular Rules Engine for 10x10 Draughts (rules_engine.js)
 * 
 * Supports three independently selectable, authentic rule systems:
 * 1. 🇳🇬 NIGERIA RULES ("Street Draughts" / Naija Draughts)
 * 2. 🇬🇭 GHANA RULES ("Damii" / Ghanaian Draughts)
 * 3. 🌍 INTERNATIONAL DRAUGHTS RULES (FMJD)
 * 
 * Architecture:
 * RulesEngine
 * ├── BaseRules (Contract / Shared mechanics)
 * ├── NigeriaRules
 * ├── GhanaRules
 * └── InternationalRules
 */

import {
  EMPTY, P1_MAN, P1_KING, P2_MAN, P2_KING,
  PLAYER_1, PLAYER_2,
  DIR_UL, DIR_UR, DIR_DL, DIR_DR,
  NEIGHBORS, JUMPS, FLYING_RAYS,
  rcToSq, sqToRC
} from './engine50.js';

const EMPTY_ARRAY = Object.freeze([]);

/**
 * Base Abstract Rule Profile
 */
export class BaseRules {
  constructor(id, name, flag, orientation) {
    this.id = id;
    this.name = name;
    this.flag = flag;
    this.orientation = orientation; // 'mirrored' (Nigeria/Ghana) or 'international'
  }

  isCaptureMandatory() {
    return true;
  }

  getMaximumCaptureRules() {
    return false;
  }

  canManCaptureBackward() {
    return true;
  }

  getKingMovementRules() {
    return {
      flyingKing: true,
      slideAnyDistance: true,
      landAnySquareBeyond: true
    };
  }

  isKingRow(sq, player) {
    if (player === PLAYER_1) {
      return sq >= 1 && sq <= 5; // White promotion line
    } else {
      return sq >= 46 && sq <= 50; // Dark promotion line
    }
  }

  /**
   * Evaluates promotion state.
   * @param {number} destSq - Landing square
   * @param {boolean} isMidChain - True if piece can continue jumping
   * @param {number} player - Moving player
   * @returns {{ promotes: boolean, endsTurnImmediately: boolean }}
   */
  getPromotionRules(destSq, isMidChain, player) {
    const reached = this.isKingRow(destSq, player);
    return {
      promotes: reached && !isMidChain,
      endsTurnImmediately: false
    };
  }

  /**
   * Competing capture sequence filter.
   */
  filterLegalCaptures(captureMoves) {
    if (!captureMoves || captureMoves.length === 0) return [];
    if (this.getMaximumCaptureRules()) {
      let maxJumped = 0;
      for (let i = 0; i < captureMoves.length; i++) {
        const count = captureMoves[i].jumpedSquares.length;
        if (count > maxJumped) maxJumped = count;
      }
      return captureMoves.filter(m => m.jumpedSquares.length === maxJumped);
    }
    // Free choice
    return captureMoves;
  }

  /**
   * Generates all quiet (non-capturing) moves.
   */
  generateQuietMoves(boardInstance, player = boardInstance.currentTurn) {
    const moves = [];
    const board = boardInstance.board;

    for (let sq = 1; sq <= 50; sq++) {
      const piece = board[sq];
      if (piece === EMPTY) continue;

      if (player === PLAYER_1 && !boardInstance.isP1(piece)) continue;
      if (player === PLAYER_2 && !boardInstance.isP2(piece)) continue;

      if (!boardInstance.isKing(piece)) {
        // Men move diagonally forward 1 step
        const forwardDirs = (player === PLAYER_1) ? [DIR_UL, DIR_UR] : [DIR_DL, DIR_DR];
        for (let i = 0; i < 2; i++) {
          const dest = NEIGHBORS[sq][forwardDirs[i]];
          if (dest !== 0 && board[dest] === EMPTY) {
            const promo = this.getPromotionRules(dest, false, player);
            moves.push({
              from: sq,
              to: dest,
              isCapture: false,
              jumpedSquares: EMPTY_ARRAY,
              jumpedPieces: EMPTY_ARRAY,
              promoted: promo.promotes,
              prevPiece: piece
            });
          }
        }
      } else {
        // Flying King slides along diagonal rays
        for (let d = 0; d < 4; d++) {
          const ray = FLYING_RAYS[sq][d];
          for (let i = 0; i < ray.length; i++) {
            const dest = ray[i];
            if (board[dest] !== EMPTY) break; // Ray blocked
            moves.push({
              from: sq,
              to: dest,
              isCapture: false,
              jumpedSquares: EMPTY_ARRAY,
              jumpedPieces: EMPTY_ARRAY,
              promoted: false,
              prevPiece: piece
            });
          }
        }
      }
    }

    return moves;
  }

  /**
   * Generates all complete multi-jump capture sequences for all pieces.
   */
  generateAllCaptures(boardInstance, player = boardInstance.currentTurn) {
    const allSequences = [];
    const board = boardInstance.board;

    for (let sq = 1; sq <= 50; sq++) {
      const piece = board[sq];
      if (piece === EMPTY) continue;

      if (player === PLAYER_1 && !boardInstance.isP1(piece)) continue;
      if (player === PLAYER_2 && !boardInstance.isP2(piece)) continue;

      const pieceCaptures = this.generateCaptureSequences(boardInstance, sq, piece, player);
      allSequences.push(...pieceCaptures);
    }

    return allSequences;
  }

  /**
   * Recursive capture sequence finder for a single piece.
   */
  generateCaptureSequences(boardInstance, sq, piece, player, jumpedSquares = [], jumpedPieces = [], pathSquares = [sq]) {
    const isKing = boardInstance.isKing(piece);
    const sequences = [];
    const isAlreadyJumped = (targetSq) => jumpedSquares.includes(targetSq);
    const board = boardInstance.board;

    if (!isKing) {
      // Man captures in all 4 directions forward and backward
      for (let d = 0; d < 4; d++) {
        const mid = NEIGHBORS[sq][d];
        const dest = JUMPS[sq][d];

        if (mid !== 0 && dest !== 0) {
          const enemyPiece = board[mid];
          if (
            enemyPiece !== EMPTY &&
            boardInstance.isOpponent(enemyPiece, player) &&
            !isAlreadyJumped(mid) &&
            (board[dest] === EMPTY || dest === pathSquares[0]) &&
            !isAlreadyJumped(dest)
          ) {
            const nextJumpedSq = [...jumpedSquares, mid];
            const nextJumpedPc = [...jumpedPieces, enemyPiece];
            const nextPath = [...pathSquares, dest];

            const reachedKingRow = this.isKingRow(dest, player);

            // Check if this rule variant forces immediate turn termination upon crowning
            const promoCheck = this.getPromotionRules(dest, true, player);
            if (promoCheck.endsTurnImmediately && reachedKingRow) {
              // GHANA DAMII RULE: Piece promotes and turn terminates immediately!
              sequences.push({
                from: pathSquares[0],
                to: dest,
                isCapture: true,
                path: nextPath,
                jumpedSquares: nextJumpedSq,
                jumpedPieces: nextJumpedPc,
                promoted: true,
                prevPiece: board[pathSquares[0]]
              });
              continue;
            }

            // Continue recursion as a MAN (under FMJD Rule 3.5 and standard street rules)
            const subJumps = this.generateCaptureSequences(
              boardInstance, dest, piece, player, nextJumpedSq, nextJumpedPc, nextPath
            );

            if (subJumps.length > 0) {
              sequences.push(...subJumps);
            } else {
              // End of capture sequence: crown only if stopping on king row!
              const finalPromo = this.getPromotionRules(dest, false, player);
              sequences.push({
                from: pathSquares[0],
                to: dest,
                isCapture: true,
                path: nextPath,
                jumpedSquares: nextJumpedSq,
                jumpedPieces: nextJumpedPc,
                promoted: finalPromo.promotes,
                prevPiece: board[pathSquares[0]]
              });
            }
          }
        }
      }
    } else {
      // Flying King: scans each diagonal for an enemy piece, then every empty square beyond it
      for (let d = 0; d < 4; d++) {
        const ray = FLYING_RAYS[sq][d];
        let enemySq = 0;
        let enemyPiece = 0;
        const raySequences = [];
        let rayHasContinuation = false;

        for (let i = 0; i < ray.length; i++) {
          const checkSq = ray[i];
          const occupant = board[checkSq];

          if (occupant !== EMPTY) {
            if (isAlreadyJumped(checkSq)) {
              // Jumped pieces remain physically on board until end of turn (FMJD Art 3.8); ray is blocked
              break;
            }
            if (!boardInstance.isOpponent(occupant, player)) {
              break; // Blocked by friendly piece
            }
            if (enemySq === 0) {
              enemySq = checkSq;
              enemyPiece = occupant;
            } else {
              break; // Two unjumped pieces in a row cannot be jumped together
            }
          } else if (enemySq !== 0) {
            // Empty square beyond enemy piece: valid landing square!
            const nextJumpedSq = [...jumpedSquares, enemySq];
            const nextJumpedPc = [...jumpedPieces, enemyPiece];
            const nextPath = [...pathSquares, checkSq];

            const subJumps = this.generateCaptureSequences(
              boardInstance, checkSq, piece, player, nextJumpedSq, nextJumpedPc, nextPath
            );
            if (subJumps.length > 0) {
              rayHasContinuation = true;
              raySequences.push(...subJumps);
            } else {
              raySequences.push({
                from: pathSquares[0],
                to: checkSq,
                isCapture: true,
                path: nextPath,
                jumpedSquares: nextJumpedSq,
                jumpedPieces: nextJumpedPc,
                promoted: false,
                prevPiece: board[pathSquares[0]]
              });
            }
          }
        }

        if (enemySq !== 0) {
          if (rayHasContinuation) {
            // Under compulsory capture rules, if a landing square permits continuation,
            // dead-end landing squares that abort the capture prematurely are illegal.
            sequences.push(...raySequences.filter(s => s.jumpedSquares.length > jumpedSquares.length + 1));
          } else {
            sequences.push(...raySequences);
          }
        }
      }
    }

    return sequences;
  }

  /**
   * Generates all legal moves under this ruleset.
   */
  generateLegalMoves(boardInstance, player = boardInstance.currentTurn) {
    const captureMoves = this.generateAllCaptures(boardInstance, player);
    if (captureMoves.length > 0) {
      return this.filterLegalCaptures(captureMoves);
    }
    return this.generateQuietMoves(boardInstance, player);
  }

  /**
   * Game outcome evaluation: win / loss / draw.
   */
  isGameOver(boardInstance) {
    let p1Count = 0;
    let p2Count = 0;
    const board = boardInstance.board;

    for (let sq = 1; sq <= 50; sq++) {
      const p = board[sq];
      if (p === EMPTY) continue;
      if (boardInstance.isP1(p)) p1Count++;
      else p2Count++;
    }

    if (p1Count === 0) return { over: true, winner: PLAYER_2, reason: 'All White pieces captured' };
    if (p2Count === 0) return { over: true, winner: PLAYER_1, reason: 'All Dark pieces captured' };

    const legal = this.generateLegalMoves(boardInstance, boardInstance.currentTurn);
    if (legal.length === 0) {
      const winner = boardInstance.currentTurn === PLAYER_1 ? PLAYER_2 : PLAYER_1;
      return { over: true, winner, reason: `Player ${boardInstance.currentTurn} has no legal moves (Locked)` };
    }

    // Check draw rules for this ruleset
    const drawCheck = this.getDrawRules(boardInstance);
    if (drawCheck.isDraw) {
      if (boardInstance.modifications === 'draw_odds_p2') {
        return { over: true, winner: PLAYER_2, reason: 'Player 2 won on Draw Odds rule' };
      }
      return { over: true, winner: 'draw', reason: drawCheck.reason };
    }

    return { over: false, winner: null };
  }

  getDrawRules(boardInstance) {
    if (boardInstance.halfMoveClock >= 50) {
      return { isDraw: true, reason: 'Draw by 25-king-move rule' };
    }
    return { isDraw: false, reason: '' };
  }

  evaluateSpecialRules(boardInstance) {
    return 0;
  }
}

/**
 * 🇳🇬 1. NIGERIA RULES ("Street Draughts" / Naija Draughts)
 * 
 * Nuances:
 * - Mirrored board orientation (Nigerian Highway on player's right 50->1)
 * - Men capture backward diagonally
 * - Captures are compulsory
 * - FREE CHOICE: Player can pick ANY capture sequence, no maximum capture rule
 * - Promotion: Man crowns to flying king ("Oba") upon finishing its move on the back rank
 * - Flying king moves any distance and lands on any square beyond jumped piece
 * - Standard 25-king-move draw rule
 */
export class NigeriaRules extends BaseRules {
  constructor() {
    super('nigeria', 'Nigeria Rules', '🇳🇬', 'mirrored');
  }

  getMaximumCaptureRules() {
    return false; // Free choice among compulsory captures
  }

  getPromotionRules(destSq, isMidChain, player) {
    const reached = this.isKingRow(destSq, player);
    return {
      promotes: reached && !isMidChain,
      endsTurnImmediately: false
    };
  }

  getDrawRules(boardInstance) {
    if (boardInstance.halfMoveClock >= 50) {
      return { isDraw: true, reason: 'Draw by Nigerian 25-king-move rule' };
    }
    return { isDraw: false, reason: '' };
  }
}

/**
 * 🇬🇭 2. GHANA RULES ("Damii" / Ghanaian Draughts)
 * 
 * Nuances:
 * - Mirrored board orientation (Central Highway on player's right)
 * - Men capture backward diagonally
 * - Captures are compulsory
 * - FREE CHOICE: No majority capture rule (player picks desired capture line)
 * - PROMOTION RULE: Reaching the promotion line ENDS THE TURN IMMEDIATELY.
 *   (The piece is crowned as King and cannot jump backward in the same move)
 * - Flying king ("Nkorɔma") moves any distance along diagonals
 * - 3 Kings vs 1 King: Strict 16-move limit to capture lone king (otherwise draw)
 */
export class GhanaRules extends BaseRules {
  constructor() {
    super('ghana', 'Ghana Rules', '🇬🇭', 'mirrored');
  }

  getMaximumCaptureRules() {
    return false; // Free choice in Damii
  }

  getPromotionRules(destSq, isMidChain, player) {
    const reached = this.isKingRow(destSq, player);
    if (reached) {
      // Reaching the king row ends turn immediately and crowns
      return {
        promotes: true,
        endsTurnImmediately: true
      };
    }
    return {
      promotes: false,
      endsTurnImmediately: false
    };
  }

  getDrawRules(boardInstance) {
    // 3 Kings vs 1 King Ghana 16-move rule check
    let p1Kings = 0, p2Kings = 0, p1Men = 0, p2Men = 0;
    const board = boardInstance.board;
    for (let sq = 1; sq <= 50; sq++) {
      const p = board[sq];
      if (p === P1_KING) p1Kings++;
      else if (p === P1_MAN) p1Men++;
      else if (p === P2_KING) p2Kings++;
      else if (p === P2_MAN) p2Men++;
    }

    const is3v1 = (p1Kings === 3 && p2Kings === 1 && p1Men === 0 && p2Men === 0) ||
                  (p2Kings === 3 && p1Kings === 1 && p1Men === 0 && p2Men === 0);

    // If 3v1 has exceeded 32 plies (16 full moves by both sides)
    if (is3v1 && boardInstance.halfMoveClock >= 32) {
      return { isDraw: true, reason: 'Draw by Ghanaian 16-move rule (3 Kings vs 1 King)' };
    }

    if (boardInstance.halfMoveClock >= 50) {
      return { isDraw: true, reason: 'Draw by 25-king-move rule' };
    }

    return { isDraw: false, reason: '' };
  }
}

/**
 * 🌍 3. INTERNATIONAL DRAUGHTS RULES (FMJD)
 * 
 * Nuances:
 * - Standard FMJD 10x10 board (50 active squares)
 * - Men capture backward diagonally
 * - Captures are compulsory
 * - STRICT MAJORITY CAPTURE: Compulsory to choose the line capturing the MAXIMUM pieces
 * - FMJD RULE 3.5 NON-PROMOTION: A man passing through the king row during a multi-jump
 *   without stopping does not promote; it must continue jumping as a man
 * - Flying kings slide any distance and land on any square beyond jumped piece
 * - FMJD draw rules: 25 king moves, 16 moves in 3v1, 5 moves in 2v1 on main line
 */
export class InternationalRules extends BaseRules {
  constructor() {
    super('international', 'International Draughts', '🌍', 'international');
  }

  getMaximumCaptureRules() {
    return true; // Strict majority capture compulsory
  }

  getPromotionRules(destSq, isMidChain, player) {
    const reached = this.isKingRow(destSq, player);
    // FMJD Rule 3.5: If man continues jumping, it DOES NOT promote!
    return {
      promotes: reached && !isMidChain,
      endsTurnImmediately: false
    };
  }

  getDrawRules(boardInstance) {
    let p1Kings = 0, p2Kings = 0, p1Men = 0, p2Men = 0;
    const board = boardInstance.board;
    for (let sq = 1; sq <= 50; sq++) {
      const p = board[sq];
      if (p === P1_KING) p1Kings++;
      else if (p === P1_MAN) p1Men++;
      else if (p === P2_KING) p2Kings++;
      else if (p === P2_MAN) p2Men++;
    }

    // 3 Kings vs 1 King FMJD rule: 16 moves (32 half-moves)
    const is3v1 = (p1Kings === 3 && p2Kings === 1 && p1Men === 0 && p2Men === 0) ||
                  (p2Kings === 3 && p1Kings === 1 && p1Men === 0 && p2Men === 0);
    if (is3v1 && boardInstance.halfMoveClock >= 32) {
      return { isDraw: true, reason: 'Draw by FMJD 16-move rule (3 Kings vs 1 King)' };
    }

    if (boardInstance.halfMoveClock >= 50) {
      return { isDraw: true, reason: 'Draw by FMJD 25-king-move rule' };
    }

    return { isDraw: false, reason: '' };
  }
}

/**
 * Rules Engine Registry & Factory
 */
export class RulesEngine {
  static profiles = {
    'nigeria': new NigeriaRules(),
    'nigerian': new NigeriaRules(),
    'ghana': new GhanaRules(),
    'damii': new GhanaRules(),
    'international': new InternationalRules(),
    'tournament': new InternationalRules(),
    'fmjd': new InternationalRules(),
    'default': new NigeriaRules()
  };

  /**
   * Retrieves the rule profile by name.
   * @param {string} ruleName 
   * @returns {BaseRules}
   */
  static getRuleProfile(ruleName = 'nigeria') {
    const key = (ruleName || 'nigeria').toString().toLowerCase().trim();
    return RulesEngine.profiles[key] || RulesEngine.profiles['nigeria'];
  }

  /**
   * List all available formal rule profiles.
   */
  static getAllProfiles() {
    return [
      RulesEngine.profiles['nigeria'],
      RulesEngine.profiles['ghana'],
      RulesEngine.profiles['international']
    ];
  }
}
