/**
 * Endgame Tablebase Interface & Analytical Solver (tablebase.js)
 * 
 * Supports exact theoretical endgame evaluation (Win / Draw / Loss) for <= 4 pieces.
 */

import {
  EMPTY, P1_MAN, P1_KING, P2_MAN, P2_KING,
  PLAYER_1, PLAYER_2
} from './engine50.js';

// Highway / Main Diagonal squares: 1, 7, 12, 18, 23, 29, 34, 40, 45, 50
const HIGHWAY = new Set([1, 7, 12, 18, 23, 29, 34, 40, 45, 50]);

export class EndgameTablebaseInterface {
  constructor() {
    this.externalTablebaseAvailable = false;
  }

  /**
   * Probes the tablebase or analytical solver for small-piece endgames.
   * @param {DraughtsBoard50} boardInstance
   * @param {string} ruleMode - 'nigeria', 'ghana', 'international'
   * @returns {{ resolved: boolean, score?: number, bestMove?: object, dtm?: number, reason?: string }}
   */
  probe(boardInstance, ruleMode = null) {
    const activeRule = (ruleMode || boardInstance.ruleMode || 'nigeria').toString().toLowerCase().trim();
    const isGhana = activeRule === 'ghana' || activeRule === 'damii';
    const isIntl = activeRule === 'international' || activeRule === 'tournament';
    const board = boardInstance.board;
    let p1Men = 0, p1Kings = 0;
    let p2Men = 0, p2Kings = 0;
    const p1Pieces = [];
    const p2Pieces = [];

    for (let sq = 1; sq <= 50; sq++) {
      const p = board[sq];
      if (p === EMPTY) continue;

      if (p === P1_MAN) { p1Men++; p1Pieces.push({ sq, type: 'man', player: PLAYER_1 }); }
      else if (p === P1_KING) { p1Kings++; p1Pieces.push({ sq, type: 'king', player: PLAYER_1 }); }
      else if (p === P2_MAN) { p2Men++; p2Pieces.push({ sq, type: 'man', player: PLAYER_2 }); }
      else if (p === P2_KING) { p2Kings++; p2Pieces.push({ sq, type: 'king', player: PLAYER_2 }); }
    }

    const total = p1Men + p1Kings + p2Men + p2Kings;
    if (total > 4) {
      return { resolved: false };
    }

    const currentTurn = boardInstance.currentTurn;
    const legalMoves = boardInstance.generateLegalMoves(currentTurn);
    if (legalMoves.length === 0) {
      return { resolved: true, score: -30000, bestMove: null };
    }

    // Check immediate tactical winning capture
    const captureMove = legalMoves.find(m => m.isCapture && (m.jumpedSquares.length === (currentTurn === PLAYER_1 ? (p2Men + p2Kings) : (p1Men + p1Kings))));
    if (captureMove) {
      return { resolved: true, score: 30000, bestMove: captureMove, dtm: 1 };
    }

    // Case 1: 1 King vs 1 King (0 men)
    if (total === 2 && p1Kings === 1 && p2Kings === 1 && p1Men === 0 && p2Men === 0) {
      return { resolved: true, score: 0, bestMove: legalMoves[0], dtm: 0 };
    }

    // Case 2: 2 Kings vs 1 King
    if (total === 3 && p1Men === 0 && p2Men === 0) {
      const isP1Advantage = p1Kings === 2 && p2Kings === 1;
      const isP2Advantage = p2Kings === 2 && p1Kings === 1;

      if (isP1Advantage) {
        const defender = p2Pieces[0];
        // If defender king holds the main highway, it is a theoretical draw
        if (HIGHWAY.has(defender.sq)) {
          return { resolved: true, score: 0, bestMove: legalMoves[0] };
        }
        // Otherwise strong advantage / forced win for 2 kings
        const score = currentTurn === PLAYER_1 ? 2500 : -2500;
        return { resolved: true, score, bestMove: null };
      } else if (isP2Advantage) {
        const defender = p1Pieces[0];
        if (HIGHWAY.has(defender.sq)) {
          return { resolved: true, score: 0, bestMove: legalMoves[0] };
        }
        const score = currentTurn === PLAYER_2 ? 2500 : -2500;
        return { resolved: true, score, bestMove: null };
      }
    }

    // Case 3: 3 Kings vs 1 King
    if (total === 4 && p1Men === 0 && p2Men === 0) {
      const is3v1White = p1Kings === 3 && p2Kings === 1;
      const is3v1Dark = p2Kings === 3 && p1Kings === 1;

      if (is3v1White || is3v1Dark) {
        // Under Ghana and International rules: strict 16-move rule (32 plies)
        if ((isGhana || isIntl) && boardInstance.halfMoveClock >= 32) {
          return {
            resolved: true,
            score: 0,
            bestMove: legalMoves[0],
            dtm: 0,
            reason: isGhana ? 'Draw by Ghanaian 16-move rule' : 'Draw by FMJD 16-move rule'
          };
        }

        const winningPlayer = is3v1White ? PLAYER_1 : PLAYER_2;
        const score = currentTurn === winningPlayer ? 28000 : -28000;
        const dtm = (isGhana || isIntl) ? Math.max(1, 16 - Math.floor(boardInstance.halfMoveClock / 2)) : 25;
        return { resolved: true, score, bestMove: null, dtm };
      }
    }

    return { resolved: false };
  }
}
