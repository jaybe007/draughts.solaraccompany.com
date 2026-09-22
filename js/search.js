/**
 * Grandmaster Draughts Game-Tree Search Engine (search.js)
 * 
 * Features:
 * - Iterative Deepening
 * - Principal Variation Search (PVS / NegaScout)
 * - Quiescence Search for complete capture chain resolution
 * - Aspiration Windows
 * - Late Move Reductions (LMR)
 * - Killer Move Heuristics (2 killers per ply)
 * - History Heuristic Table
 * - Transposition Table integration with Zobrist 64-bit hashing
 * - Time-controlled search with dynamic node budget checks
 * - Telemetry streaming (depth, seldepth, nodes, nps, score, pv, ttHits)
 */

import {
  EMPTY, PLAYER_1, PLAYER_2, P1_MAN, P1_KING, P2_MAN, P2_KING
} from './engine50.js';
import { computeZobristHash, updateZobristHash } from './zobrist.js';
import {
  TranspositionTable, BOUND_EXACT, BOUND_LOWER, BOUND_UPPER
} from './transposition.js';
import {
  DraughtsEvaluation50,
  IS_HIGHWAY,
  IS_GRANDE_LIGNE,
  IS_CENTER,
  IS_EDGE,
  IS_EDGE_NIGERIA,
  IS_EDGE_INTL
} from './evaluation.js';
import { DraughtsOpeningBook } from './opening.js';
import { EndgameTablebaseInterface } from './tablebase.js';

const MATE_SCORE = 30000;
const INFINITY = 32000;

export class DraughtsSearchEngine {
  constructor(options = {}) {
    this.tt = new TranspositionTable(options.ttSizePower || 19);
    this.evaluator = new DraughtsEvaluation50();
    this.openingBook = new DraughtsOpeningBook();
    this.tablebase = new EndgameTablebaseInterface();

    this.killerMoves = Array.from({ length: 64 }, () => [null, null]);
    this.historyTable = Array.from({ length: 5 }, () => new Int32Array(51));

    this.nodes = 0;
    this.seldepth = 0;
    this.stopSearch = false;
    this.startTime = 0;
    this.timeLimit = 3000; // ms
    this.onTelemetry = options.onTelemetry || (() => {});
  }

  resetHeuristics() {
    for (let i = 0; i < 64; i++) {
      this.killerMoves[i][0] = null;
      this.killerMoves[i][1] = null;
    }
    for (let p = 0; p < 5; p++) {
      this.historyTable[p].fill(0);
    }
  }

  /**
   * Main entry point: searches for the best move within the allotted time and maxDepth.
   */
  search(board, timeLimitMs = 3000, maxDepth = 20, useOpening = true) {
    this.nodes = 0;
    this.seldepth = 0;
    this.stopSearch = false;
    this.startTime = performance.now();
    this.timeLimit = timeLimitMs;
    this.currentRuleMode = board.ruleMode || 'nigeria';
    const norm = this.currentRuleMode.toString().toLowerCase().trim();
    this.isCurrentIntl = norm === 'international' || norm === 'tournament' || norm === 'fmjd';
    this.tt.newAge();
    this.resetHeuristics();

    const currentTurn = board.currentTurn;
    const legalMoves = board.generateLegalMoves(currentTurn);

    if (legalMoves.length === 0) return null;
    if (legalMoves.length === 1) {
      return { bestMove: legalMoves[0], score: 0, depth: 1, nodes: 1, pv: [legalMoves[0]] };
    }

    // 1. Check Opening Book
    if (useOpening) {
      const rootHash = computeZobristHash(board.board, currentTurn, board.ruleMode);
      const bookMove = this.openingBook.lookup(rootHash, legalMoves, board.ruleMode);
      if (bookMove) {
        return {
          bestMove: bookMove,
          score: 0,
          depth: 1,
          nodes: 1,
          inBook: true,
          pv: [bookMove]
        };
      }
    }

    // 2. Check Tablebase
    const tb = this.tablebase.probe(board, board.ruleMode);
    if (tb.resolved && tb.bestMove) {
      return {
        bestMove: tb.bestMove,
        score: tb.score || 30000,
        depth: 30,
        nodes: 1,
        pv: [tb.bestMove]
      };
    }

    let globalBestMove = legalMoves[0];
    let globalBestScore = -INFINITY;
    let globalPV = [legalMoves[0]];

    // 3. Iterative Deepening
    for (let depth = 1; depth <= maxDepth; depth++) {
      this.seldepth = depth;

      let alpha = -INFINITY;
      let beta = INFINITY;

      // Aspiration Windows for depth >= 5
      if (depth >= 5 && Math.abs(globalBestScore) < 20000) {
        alpha = globalBestScore - 35;
        beta = globalBestScore + 35;
      }

      let iterationScore = this.searchRoot(board, depth, alpha, beta, legalMoves);

      // Re-search if aspiration window failed
      if (!this.stopSearch && (iterationScore <= alpha || iterationScore >= beta)) {
        alpha = -INFINITY;
        beta = INFINITY;
        iterationScore = this.searchRoot(board, depth, alpha, beta, legalMoves);
      }

      if (this.stopSearch) {
        break; // Time expired mid-search, use best move from previous depth
      }

      // Extract PV from Transposition Table
      const pvLine = this.extractPV(board, depth);
      if (pvLine.length > 0) {
        globalBestMove = pvLine[0];
        globalPV = pvLine;
      }
      globalBestScore = iterationScore;

      const elapsed = Math.max(1, performance.now() - this.startTime);
      const nps = Math.floor((this.nodes / elapsed) * 1000);

      // Send telemetry update
      this.onTelemetry({
        ruleset: (board.ruleMode || 'nigeria').toUpperCase(),
        depth,
        seldepth: this.seldepth,
        nodes: this.nodes,
        nps,
        score: globalBestScore,
        pv: globalPV,
        time: Math.round(elapsed),
        ttHits: this.tt.hits
      });

      // Stop if forced mate reached or search time nearly exhausted
      if (Math.abs(globalBestScore) >= MATE_SCORE - 100) break;
      if (elapsed >= this.timeLimit * 0.82) break;
    }

    return {
      bestMove: globalBestMove,
      score: globalBestScore,
      depth: this.seldepth,
      nodes: this.nodes,
      pv: globalPV
    };
  }

  /**
   * Root node search.
   */
  searchRoot(board, depth, alpha, beta, legalMoves) {
    const rootHash = computeZobristHash(board.board, board.currentTurn, board.ruleMode);
    const ttEntry = this.tt.probe(rootHash, 0);
    const ttMove = ttEntry.hit ? { from: ttEntry.bestMoveFrom, to: ttEntry.bestMoveTo } : null;

    const orderedMoves = this.orderMoves(legalMoves, ttMove, 0);

    let bestScore = -INFINITY;
    let bestMove = orderedMoves[0];

    for (let i = 0; i < orderedMoves.length; i++) {
      const move = orderedMoves[i];
      const nextHash = updateZobristHash(rootHash, move);
      board.makeMove(move);

      let score;
      if (i === 0) {
        // Principal variation: full window
        score = -this.pvs(board, depth - 1, -beta, -alpha, 1, nextHash);
      } else {
        // Scout search with zero window
        score = -this.pvs(board, depth - 1, -alpha - 1, -alpha, 1, nextHash);
        if (score > alpha && score < beta && !this.stopSearch) {
          // Re-search with full window
          score = -this.pvs(board, depth - 1, -beta, -alpha, 1, nextHash);
        }
      }

      board.unmakeMove(move);

      if (this.stopSearch) return bestScore;

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
      if (score > alpha) {
        alpha = score;
      }
      if (alpha >= beta) {
        break;
      }
    }

    // Store root best move in Transposition Table
    this.tt.store(rootHash, depth, bestScore, BOUND_EXACT, bestMove, 0);
    return bestScore;
  }

  /**
   * Principal Variation Search (NegaScout) with Quiescence & LMR.
   */
  pvs(board, depth, alpha, beta, ply, hash = null) {
    this.nodes++;

    // Periodic time check every 1024 nodes
    if ((this.nodes & 1023) === 0) {
      if (performance.now() - this.startTime >= this.timeLimit) {
        this.stopSearch = true;
        return 0;
      }
    }

    if (this.stopSearch) return 0;

    // Track selective depth
    if (ply > this.seldepth) {
      this.seldepth = ply;
    }

    // Terminal test
    const gameResult = board.isGameOver();
    if (gameResult.over) {
      if (gameResult.winner === 'draw') return 0;
      return -MATE_SCORE + ply;
    }

    // Leaf node: Drop into Quiescence Search to resolve capture chains
    if (depth <= 0) {
      return this.quiescence(board, alpha, beta, ply);
    }

    if (hash === null) {
      hash = computeZobristHash(board.board, board.currentTurn, board.ruleMode);
    }
    const ttEntry = this.tt.probe(hash, ply);

    if (ttEntry.hit && ttEntry.depth >= depth) {
      if (ttEntry.flag === BOUND_EXACT) {
        return ttEntry.score;
      } else if (ttEntry.flag === BOUND_LOWER && ttEntry.score >= beta) {
        return ttEntry.score;
      } else if (ttEntry.flag === BOUND_UPPER && ttEntry.score <= alpha) {
        return ttEntry.score;
      }
    }

    const legalMoves = board.generateLegalMoves(board.currentTurn);
    if (legalMoves.length === 0) {
      return -MATE_SCORE + ply; // Locked
    }

    const ttMove = ttEntry.hit ? { from: ttEntry.bestMoveFrom, to: ttEntry.bestMoveTo } : null;
    const orderedMoves = this.orderMoves(legalMoves, ttMove, ply);

    const originalAlpha = alpha;
    let bestScore = -INFINITY;
    let bestMove = null;

    for (let i = 0; i < orderedMoves.length; i++) {
      const move = orderedMoves[i];
      const nextHash = updateZobristHash(hash, move);
      board.makeMove(move);

      let score;
      // Late Move Reductions (LMR)
      let reduction = 0;
      if (depth >= 3 && i >= 3 && !move.isCapture && !move.promoted) {
        reduction = 1;
        if (i >= 6) reduction = 2;
      }

      if (i === 0) {
        score = -this.pvs(board, depth - 1, -beta, -alpha, ply + 1, nextHash);
      } else {
        // Scout search with zero window and potential reduction
        score = -this.pvs(board, Math.max(0, depth - 1 - reduction), -alpha - 1, -alpha, ply + 1, nextHash);

        if (score > alpha && reduction > 0 && !this.stopSearch) {
          // Re-search without reduction
          score = -this.pvs(board, depth - 1, -alpha - 1, -alpha, ply + 1, nextHash);
        }

        if (score > alpha && score < beta && !this.stopSearch) {
          // Full window re-search
          score = -this.pvs(board, depth - 1, -beta, -alpha, ply + 1, nextHash);
        }
      }

      board.unmakeMove(move);

      if (this.stopSearch) return 0;

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
      if (score > alpha) {
        alpha = score;
      }
      if (alpha >= beta) {
        // Beta Cutoff
        if (!move.isCapture) {
          // Record killer move
          this.killerMoves[ply][1] = this.killerMoves[ply][0];
          this.killerMoves[ply][0] = move;
          // Increment history score
          const piece = board.board[move.from];
          if (piece) this.historyTable[piece][move.to] += depth * depth;
        }
        break;
      }
    }

    // Store in Transposition Table
    let flag = BOUND_EXACT;
    if (bestScore <= originalAlpha) flag = BOUND_UPPER;
    else if (bestScore >= beta) flag = BOUND_LOWER;

    this.tt.store(hash, depth, bestScore, flag, bestMove, ply);

    return bestScore;
  }

  /**
   * Quiescence Search:
   * Extends search along capture chains until a calm (quiet) position is reached.
   */
  quiescence(board, alpha, beta, ply) {
    this.nodes++;

    if ((this.nodes & 1023) === 0) {
      if (performance.now() - this.startTime >= this.timeLimit) {
        this.stopSearch = true;
        return 0;
      }
    }

    if (this.stopSearch) return 0;

    if (ply > this.seldepth) {
      this.seldepth = ply;
    }

    // Terminal test
    const gameResult = board.isGameOver();
    if (gameResult.over) {
      if (gameResult.winner === 'draw') return 0;
      return -MATE_SCORE + ply;
    }

    const captureMoves = board.generateAllCaptures(board.currentTurn);

    // In draughts, captures are strictly compulsory!
    // Stand-pat is ONLY valid when NO captures exist (a quiet position).
    if (captureMoves.length === 0) {
      const standPat = this.evaluator.evaluate(board.board, board.currentTurn, null, board.ruleMode);
      if (standPat >= beta) {
        return beta;
      }
      if (standPat > alpha) {
        alpha = standPat;
      }
      return alpha;
    }

    // Filter by active ruleset via RulesEngine
    const effectiveCaptures = board.rulesEngine
      ? board.rulesEngine.filterLegalCaptures(captureMoves)
      : captureMoves;

    const orderedCaptures = this.orderMoves(effectiveCaptures, null, ply);

    for (let i = 0; i < orderedCaptures.length; i++) {
      const cap = orderedCaptures[i];
      board.makeMove(cap);
      const score = -this.quiescence(board, -beta, -alpha, ply + 1);
      board.unmakeMove(cap);

      if (this.stopSearch) return 0;

      if (score >= beta) {
        return beta;
      }
      if (score > alpha) {
        alpha = score;
      }
    }

    return alpha;
  }

  /**
   * Move ordering heuristics. Zero-allocation in-place sort.
   */
  scoreMove(m, ttMove, ply) {
    let score = 0;

    // 1. Transposition table move (highest priority)
    if (ttMove && m.from === ttMove.from && m.to === ttMove.to) {
      score += 2000000;
    }

    // 2. Captures prioritized by number of pieces captured and king capture value
    if (m.isCapture) {
      score += 1000000 + (m.jumpedSquares ? m.jumpedSquares.length * 20000 : 20000);
      if (m.jumpedPieces) {
        for (let i = 0; i < m.jumpedPieces.length; i++) {
          const p = m.jumpedPieces[i];
          if (p === P1_KING || p === P2_KING) {
            score += 60000;
            break;
          }
        }
      }
    }

    // 3. Promotions
    if (m.promoted) {
      score += 600000;
    }

    // 4. Killer moves
    if (ply < 64) {
      const k1 = this.killerMoves[ply][0];
      const k2 = this.killerMoves[ply][1];
      if (k1 && m.from === k1.from && m.to === k1.to) score += 250000;
      else if (k2 && m.from === k2.from && m.to === k2.to) score += 150000;
    }

    // 5. History heuristic
    if (!m.isCapture && m.prevPiece) {
      score += Math.min(80000, this.historyTable[m.prevPiece][m.to] || 0);
    }

    // 6. Quiet move positional heuristics
    if (!m.isCapture) {
      const highwayMask = this.isCurrentIntl ? IS_GRANDE_LIGNE : IS_HIGHWAY;
      const edgeMask = this.isCurrentIntl ? IS_EDGE_INTL : IS_EDGE_NIGERIA;
      if (IS_CENTER[m.to]) score += 18000;
      if (highwayMask[m.to]) score += 14000;
      if (edgeMask[m.to]) score -= 10000;
      if (m.prevPiece === P1_KING || m.prevPiece === P2_KING) score += 12000;
    }

    return score;
  }

  orderMoves(moves, ttMove, ply) {
    if (!moves || moves.length <= 1) return moves;
    for (let i = 0; i < moves.length; i++) {
      moves[i]._score = this.scoreMove(moves[i], ttMove, ply);
    }
    moves.sort((a, b) => b._score - a._score);
    return moves;
  }

  /**
   * Extracts the Principal Variation (PV line) by following TT entries.
   */
  extractPV(board, maxDepth = 10) {
    const pv = [];
    const visited = new Set();
    const sim = board.clone();

    for (let d = 0; d < maxDepth; d++) {
      const hash = computeZobristHash(sim.board, sim.currentTurn, sim.ruleMode);
      if (visited.has(hash)) break; // Cycle detection
      visited.add(hash);

      const ttEntry = this.tt.probe(hash, 0);
      if (!ttEntry.hit || !ttEntry.bestMoveFrom) break;

      const legalMoves = sim.generateLegalMoves(sim.currentTurn);
      const bestMove = legalMoves.find(
        m => m.from === ttEntry.bestMoveFrom && m.to === ttEntry.bestMoveTo
      );
      if (!bestMove) break;

      pv.push(bestMove);
      sim.makeMove(bestMove);

      if (sim.isGameOver().over) break;
    }

    return pv;
  }
}
