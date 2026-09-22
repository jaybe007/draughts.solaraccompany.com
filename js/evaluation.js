/**
 * Phase-Tapered Positional Evaluation for 50-Square Draughts (evaluation.js)
 * 
 * Features:
 * - Linear phase tapering (Opening/Middlegame -> Endgame)
 * - Material balance & flying king premium
 * - Centre outposts (squares 22, 23, 24, 27, 28, 29)
 * - Nigerian Highway & Double-Carre diagonal control
 * - Base anchors & golden pieces (White 48/50, Dark 1/3)
 * - Chain formations & triangle mutual defense
 * - Edge penalty & isolated piece vulnerability
 * - Endgame king dominance, trapping & opposition
 */

import {
  EMPTY, P1_MAN, P1_KING, P2_MAN, P2_KING,
  PLAYER_1, PLAYER_2, FLYING_RAYS, NEIGHBORS, sqToRC,
  FLYING_RAYS_INTL, NEIGHBORS_INTL,
  SQ_TO_R, SQ_TO_C, SQ_TO_C_INTL, SQ_TO_C_NIGERIA
} from './engine50.js';

// Precomputed fast lookup masks for 50 squares
export const IS_HIGHWAY = new Uint8Array(51);
[1, 7, 12, 18, 23, 29, 34, 40, 45, 50].forEach(sq => IS_HIGHWAY[sq] = 1);

// FMJD International Draughts Grande Ligne (Main Long Diagonal: squares 5 to 46)
export const IS_GRANDE_LIGNE = new Uint8Array(51);
[5, 10, 14, 19, 23, 28, 32, 37, 41, 46].forEach(sq => IS_GRANDE_LIGNE[sq] = 1);

export const IS_CENTER = new Uint8Array(51);
[22, 23, 24, 27, 28, 29].forEach(sq => IS_CENTER[sq] = 1);

export const IS_EDGE_NIGERIA = new Uint8Array(51);
[1, 11, 21, 31, 41, 10, 20, 30, 40, 50].forEach(sq => IS_EDGE_NIGERIA[sq] = 1);

export const IS_EDGE_INTL = new Uint8Array(51);
[6, 16, 26, 36, 46, 5, 15, 25, 35, 45].forEach(sq => IS_EDGE_INTL[sq] = 1);

export const IS_EDGE = IS_EDGE_NIGERIA;

// Backward compatibility Sets if needed externally
const HIGHWAY_SQUARES = new Set([1, 7, 12, 18, 23, 29, 34, 40, 45, 50]);
const CENTER_SQUARES = new Set([22, 23, 24, 27, 28, 29]);
const EDGE_SQUARES = new Set([1, 11, 21, 31, 41, 10, 20, 30, 40, 50]);

// Golden pieces / Base anchors
const WHITE_BASE_ANCHORS = [46, 47, 48, 49, 50];
const DARK_BASE_ANCHORS = [1, 2, 3, 4, 5];

// Advancement weights by rank (0..9)
const RANK_ADVANCEMENT_P1 = [0, 80, 55, 40, 30, 22, 14, 8, 4, 0];
const RANK_ADVANCEMENT_P2 = [0, 4, 8, 14, 22, 30, 40, 55, 80, 0];

export class DraughtsEvaluation50 {
  constructor() {}

  evaluate(board, currentTurn, legalMovesCount = null, ruleMode = 'nigeria') {
    const normRule = (ruleMode || 'nigeria').toString().toLowerCase().trim();
    const isNigeria = normRule === 'nigeria' || normRule === 'nigerian';
    const isGhana = normRule === 'ghana' || normRule === 'damii';
    const isIntl = normRule === 'international' || normRule === 'tournament' || normRule === 'fmjd';

    const highwayMask = isIntl ? IS_GRANDE_LIGNE : IS_HIGHWAY;
    const edgeMask = isIntl ? IS_EDGE_INTL : IS_EDGE_NIGERIA;
    const neighbors = isIntl ? NEIGHBORS_INTL : NEIGHBORS;
    const flyingRays = isIntl ? FLYING_RAYS_INTL : FLYING_RAYS;
    const sqToC = isIntl ? SQ_TO_C_INTL : SQ_TO_C_NIGERIA;

    let mgP1 = 0, egP1 = 0;
    let mgP2 = 0, egP2 = 0;

    let p1Men = 0, p1Kings = 0;
    let p2Men = 0, p2Kings = 0;

    let p1LeftWing = 0, p1RightWing = 0;
    let p2LeftWing = 0, p2RightWing = 0;

    for (let sq = 1; sq <= 50; sq++) {
      const piece = board[sq];
      if (piece === EMPTY) continue;

      const r = SQ_TO_R[sq];
      const c = sqToC[sq];

      if (piece === P1_MAN) {
        p1Men++;
        mgP1 += 100;
        egP1 += 115;

        // Rank advancement towards crowning
        const adv = RANK_ADVANCEMENT_P1[r];
        mgP1 += adv;
        egP1 += adv * 1.5;
        if (isGhana && r <= 2) {
          // In Ghana, reaching the promotion line ends the turn and crowns immediately!
          mgP1 += 22;
          egP1 += 30;
        }

        // Center control
        if (IS_CENTER[sq]) {
          mgP1 += isIntl ? 28 : 22; // Center wedges are critical in FMJD majority capture traps
          egP1 += isIntl ? 18 : 12;
        }

        // Outpost squares (27, 28)
        if (sq === 27 || sq === 28) {
          mgP1 += isIntl ? 30 : 22;
          egP1 += isIntl ? 32 : 24;
        }

        // Main diagonal bonus (Nigerian Highway or FMJD Grande Ligne)
        if (highwayMask[sq]) {
          mgP1 += (isNigeria || isIntl) ? 24 : 14;
          egP1 += (isNigeria || isIntl) ? 22 : 12;
        }

        // Edge penalty
        if (edgeMask[sq]) {
          mgP1 -= 16;
          egP1 -= 20;
        }

        // Base anchor protection
        if (isIntl) {
          if (sq === 46 || sq === 48) { // 46 anchors Grande Ligne, 48 is central golden piece
            mgP1 += 30;
            egP1 += 16;
          }
        } else {
          if (sq === 48 || sq === 50) { // 50 anchors Nigerian Highway, 48 is golden piece
            mgP1 += isNigeria ? 32 : 24;
            egP1 += isNigeria ? 16 : 10;
          }
        }

        // Mutual defense: backed by friendly pieces behind
        if (r < 9) {
          const b1 = neighbors[sq][2]; // DL
          const b2 = neighbors[sq][3]; // DR
          const hasB1 = b1 !== 0 && (board[b1] === P1_MAN || board[b1] === P1_KING);
          const hasB2 = b2 !== 0 && (board[b2] === P1_MAN || board[b2] === P1_KING);
          if (hasB1 && hasB2) {
            mgP1 += 22; // Solid triangle phalanx apex
            egP1 += 16;
          } else if (hasB1 || hasB2) {
            mgP1 += 12; // Single-backed diagonal chain
            egP1 += 8;
          } else if (r <= 5) {
            // Over-advanced unsupported piece
            mgP1 -= 14;
            egP1 -= 20;
          }
        }

        // Wing counting
        if (c < 5) p1LeftWing++; else p1RightWing++;

      } else if (piece === P2_MAN) {
        p2Men++;
        mgP2 += 100;
        egP2 += 115;

        const adv = RANK_ADVANCEMENT_P2[r];
        mgP2 += adv;
        egP2 += adv * 1.5;
        if (isGhana && r >= 7) {
          mgP2 += 22;
          egP2 += 30;
        }

        if (IS_CENTER[sq]) {
          mgP2 += isIntl ? 28 : 22;
          egP2 += isIntl ? 18 : 12;
        }

        if (sq === 23 || sq === 24) {
          mgP2 += isIntl ? 30 : 22;
          egP2 += isIntl ? 32 : 24;
        }

        if (highwayMask[sq]) {
          mgP2 += (isNigeria || isIntl) ? 24 : 14;
          egP2 += (isNigeria || isIntl) ? 22 : 12;
        }

        if (edgeMask[sq]) {
          mgP2 -= 16;
          egP2 -= 20;
        }

        if (isIntl) {
          if (sq === 5 || sq === 3) { // 5 anchors Grande Ligne, 3 is central golden piece
            mgP2 += 30;
            egP2 += 16;
          }
        } else {
          if (sq === 1 || sq === 3) {
            mgP2 += isNigeria ? 32 : 24;
            egP2 += isNigeria ? 16 : 10;
          }
        }

        if (r > 0) {
          const b1 = neighbors[sq][0]; // UL
          const b2 = neighbors[sq][1]; // UR
          const hasB1 = b1 !== 0 && (board[b1] === P2_MAN || board[b1] === P2_KING);
          const hasB2 = b2 !== 0 && (board[b2] === P2_MAN || board[b2] === P2_KING);
          if (hasB1 && hasB2) {
            mgP2 += 22; // Solid triangle phalanx apex
            egP2 += 16;
          } else if (hasB1 || hasB2) {
            mgP2 += 12;
            egP2 += 8;
          } else if (r >= 4) {
            mgP2 -= 14;
            egP2 -= 20;
          }
        }

        if (c < 5) p2LeftWing++; else p2RightWing++;

      } else if (piece === P1_KING) {
        p1Kings++;
        mgP1 += 460;
        egP1 += 580;

        // Long diagonal control
        if (highwayMask[sq]) {
          mgP1 += 45;
          egP1 += 65;
        }

        // King mobility: count unobstructed ray squares
        let freeRays = 0;
        for (let d = 0; d < 4; d++) {
          const ray = flyingRays[sq][d];
          for (let i = 0; i < ray.length; i++) {
            if (board[ray[i]] !== EMPTY) break;
            freeRays++;
          }
        }
        mgP1 += freeRays * 5;
        egP1 += freeRays * 7;

        // King centralization in endgame
        const distFromCenter = Math.abs(r - 4.5) + Math.abs(c - 4.5);
        egP1 -= distFromCenter * 4;

      } else if (piece === P2_KING) {
        p2Kings++;
        mgP2 += 460;
        egP2 += 580;

        if (highwayMask[sq]) {
          mgP2 += 45;
          egP2 += 65;
        }

        let freeRays = 0;
        for (let d = 0; d < 4; d++) {
          const ray = flyingRays[sq][d];
          for (let i = 0; i < ray.length; i++) {
            if (board[ray[i]] !== EMPTY) break;
            freeRays++;
          }
        }
        mgP2 += freeRays * 5;
        egP2 += freeRays * 7;

        const distFromCenter = Math.abs(r - 4.5) + Math.abs(c - 4.5);
        egP2 -= distFromCenter * 4;
      }
    }

    // Wing imbalance penalty
    const p1Imbalance = Math.abs(p1LeftWing - p1RightWing);
    const p2Imbalance = Math.abs(p2LeftWing - p2RightWing);
    if (p1Imbalance >= 4) mgP1 -= (p1Imbalance - 3) * 12;
    if (p2Imbalance >= 4) mgP2 -= (p2Imbalance - 3) * 12;

    // Endgame King vs Man hunting
    if (p1Kings > 0 && p2Kings === 0 && p2Men > 0) {
      egP1 += 60; // White king can mop up Dark men
    }
    if (p2Kings > 0 && p1Kings === 0 && p1Men > 0) {
      egP2 += 60;
    }

    // Phase determination: 128 = Opening, 0 = Pure King Endgame
    const totalPieces = p1Men + p2Men + p1Kings + p2Kings;
    const phase = Math.min(128, Math.max(0, Math.floor((p1Men + p2Men) * 3.2)));

    const scoreP1 = Math.floor((mgP1 * phase + egP1 * (128 - phase)) / 128);
    const scoreP2 = Math.floor((mgP2 * phase + egP2 * (128 - phase)) / 128);

    const netScore = scoreP1 - scoreP2;

    // Return score from perspective of currentTurn
    return currentTurn === PLAYER_1 ? netScore : -netScore;
  }
}
