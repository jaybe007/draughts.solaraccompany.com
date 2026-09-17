/**
 * Grandmaster Nigerian & International Draughts AI Opponent (ai.js)
 * 
 * Powered by:
 * - Ultra-Fast 50-Square Engine with in-place make/unmake
 * - Iterative Deepening & Time-Controlled Search
 * - Principal Variation Search (PVS / NegaScout)
 * - Quiescence Search for forced capture chain resolution
 * - 64-bit Zobrist Transposition Table with Exact, Lower, Upper bounds
 * - Dual Killer Moves & History Heuristics
 * - Phase-Tapered Positional Evaluation (Center outposts, wing balance, base anchors, highway dominance)
 * - Opening Book Repertoire & Endgame Analytical Solvers
 * - Background Web Worker execution with real-time Telemetry HUD streaming
 */

import {
  EMPTY, P1_MAN, P1_KING, P2_MAN, P2_KING,
  PLAYER_1, PLAYER_2, rcToSq, sqToRC, DraughtsBoard50
} from './engine50.js';
import { DraughtsSearchEngine } from './search.js';

export class NigerianDraughtsAI {
  constructor(options = {}) {
    this.difficulty = options.difficulty || 'grandmaster';
    this.searchEngine = new DraughtsSearchEngine();
    this.worker = null;
    this.workerReady = false;
    this.currentSearchId = 0;
    this.initWorker();
  }

  stopSearch() {
    this.currentSearchId++;
    if (this.worker && this.workerReady) {
      try {
        this.worker.postMessage({ type: 'stop' });
      } catch (err) {}
    }
    if (this.searchEngine) {
      this.searchEngine.stopSearch = true;
    }
  }

  initWorker() {
    try {
      if (typeof window !== 'undefined' && window.Worker) {
        this.worker = new Worker('js/engine_worker.js', { type: 'module' });
        this.worker.postMessage({ type: 'init' });
        this.worker.addEventListener('message', (e) => {
          if (e.data?.type === 'ready') {
            this.workerReady = true;
          }
        });
      }
    } catch (err) {
      console.warn('Worker initialization fallback to main-thread search:', err);
      this.worker = null;
      this.workerReady = false;
    }
  }

  setDifficulty(level) {
    this.difficulty = level;
  }

  setRuleset(rule) {
    this.ruleMode = rule;
  }

  /**
   * Translates 10x10 board to 50-square Uint8Array representation.
   */
  convertBoardTo50(engine) {
    const b50 = new Uint8Array(51);
    const jumpedSet = new Set();
    if (engine.activeMultiJump && engine.activeMultiJump.jumpedPieces) {
      for (const j of engine.activeMultiJump.jumpedPieces) {
        jumpedSet.add(`${j.r},${j.c}`);
      }
    }

    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        if ((r + c) % 2 === 0) {
          const sq = rcToSq(r, c);
          if (jumpedSet.has(`${r},${c}`)) {
            b50[sq] = EMPTY;
            continue;
          }
          const p = engine.board[r][c];
          if (p) {
            if (p.player === PLAYER_1) {
              b50[sq] = p.isKing ? P1_KING : P1_MAN;
            } else {
              b50[sq] = p.isKing ? P2_KING : P2_MAN;
            }
          }
        }
      }
    }
    return b50;
  }

  /**
   * Matches 50-square best move back to the 10x10 engine legal move object.
   */
  matchMoveInEngine(engine, bestMove50) {
    if (!bestMove50) return null;
    const legalMoves = engine.getAllLegalMoves();
    if (legalMoves.length === 0) return null;
    if (legalMoves.length === 1) return legalMoves[0];

    const fromSq = typeof bestMove50.from === 'number'
      ? bestMove50.from
      : (bestMove50.fromSq || (bestMove50.from && typeof bestMove50.from.r === 'number' ? rcToSq(bestMove50.from.r, bestMove50.from.c) : null));
    const toSq = typeof bestMove50.to === 'number'
      ? bestMove50.to
      : (bestMove50.toSq || (bestMove50.to && typeof bestMove50.to.r === 'number' ? rcToSq(bestMove50.to.r, bestMove50.to.c) : null));

    const fromRC = fromSq ? sqToRC(fromSq) : (bestMove50.from && typeof bestMove50.from.r === 'number' ? bestMove50.from : null);
    const toRC = toSq ? sqToRC(toSq) : (bestMove50.to && typeof bestMove50.to.r === 'number' ? bestMove50.to : null);

    // 1. Direct match (for single-step moves or single captures)
    if (fromRC && toRC) {
      const directMatch = legalMoves.find(
        m => m.from.r === fromRC.r && m.from.c === fromRC.c &&
             m.to.r === toRC.r && m.to.c === toRC.c
      );
      if (directMatch) return directMatch;
    }

    // 2. Multi-jump first step match (if bestMove50 has path: [start, step1, step2, ...])
    if (bestMove50.path && bestMove50.path.length > 1 && fromRC) {
      const firstDestSq = bestMove50.path[1];
      const firstDestRC = typeof firstDestSq === 'number' ? sqToRC(firstDestSq) : firstDestSq;
      if (firstDestRC) {
        const stepMatch = legalMoves.find(
          m => m.from.r === fromRC.r && m.from.c === fromRC.c &&
               m.to.r === firstDestRC.r && m.to.c === firstDestRC.c
        );
        if (stepMatch) return stepMatch;
      }
    }

    // 3. Mid-multijump continuation match
    if (engine.activeMultiJump) {
      if (bestMove50.path) {
        for (let i = 1; i < bestMove50.path.length; i++) {
          const stepSq = bestMove50.path[i];
          const stepRC = typeof stepSq === 'number' ? sqToRC(stepSq) : stepSq;
          if (stepRC) {
            const matchAlongPath = legalMoves.find(
              m => m.to.r === stepRC.r && m.to.c === stepRC.c
            );
            if (matchAlongPath) return matchAlongPath;
          }
        }
      }

      if (toRC) {
        const multiMatch = legalMoves.find(
          m => m.to.r === toRC.r && m.to.c === toRC.c
        );
        if (multiMatch) return multiMatch;
      }
    }

    // 4. Same source piece match
    if (fromRC) {
      const fromMatch = legalMoves.find(
        m => m.from.r === fromRC.r && m.from.c === fromRC.c
      );
      if (fromMatch) return fromMatch;
    }

    return legalMoves[0];
  }

  /**
   * Calculates time budget (ms) and max search depth based on difficulty & game clock.
   */
  getDifficultyConstraints(clockTimeLeft = 300, timeIncrement = 0) {
    switch (this.difficulty) {
      case 'easy':
      case 'beginner':
        return { maxDepth: 4, timeLimit: 400, useOpening: false };

      case 'medium':
      case 'intermediate':
        return { maxDepth: 8, timeLimit: 1200, useOpening: true };

      case 'advanced':
        return { maxDepth: 12, timeLimit: 2200, useOpening: true };

      case 'expert':
        return { maxDepth: 16, timeLimit: 3600, useOpening: true };

      case 'hard':
      case 'master':
        return { maxDepth: 20, timeLimit: 5000, useOpening: true };

      case 'grandmaster':
      default: {
        // Dynamic time allocation based on game clock
        let budget = 4000;
        if (clockTimeLeft && clockTimeLeft > 0) {
          budget = Math.max(1200, Math.min(8500, Math.floor((clockTimeLeft / 20) * 1000) + timeIncrement * 900));
        }
        return { maxDepth: 26, timeLimit: budget, useOpening: true };
      }
    }
  }

  /**
   * Asynchronous search: executes in Web Worker without freezing UI, streaming telemetry.
   */
  async getBestMoveAsync(engine, aiPlayer = PLAYER_2, clockTimeLeft = 300, timeIncrement = 0, onTelemetry = null) {
    const legalMoves = engine.getAllLegalMoves(aiPlayer);
    if (legalMoves.length === 0) return null;
    if (legalMoves.length === 1) return { move: legalMoves[0], score: 0, depth: 1, nodes: 1, pv: [] };

    const constraints = this.getDifficultyConstraints(clockTimeLeft, timeIncrement);
    const boardArray = this.convertBoardTo50(engine);
    const searchId = ++this.currentSearchId;

    // If worker is operational, search in worker
    if (this.worker && this.workerReady) {
      return new Promise((resolve) => {
        let timerFallback = null;

        const cleanup = () => {
          if (timerFallback) clearTimeout(timerFallback);
          this.worker.removeEventListener('message', messageHandler);
        };

        const messageHandler = (e) => {
          const data = e.data;
          if (!data) return;

          // Discard messages from previous or superseded searches
          if (data.searchId && data.searchId !== searchId) return;
          if (this.currentSearchId !== searchId) {
            cleanup();
            return;
          }

          if (data.type === 'telemetry' && onTelemetry) {
            onTelemetry(data);
          } else if (data.type === 'bestmove') {
            cleanup();
            const matchedMove = this.matchMoveInEngine(engine, data.bestMove);
            resolve({
              move: matchedMove,
              score: data.score,
              depth: data.depth,
              nodes: data.nodes,
              pv: data.pv
            });
          }
        };

        // Safety fallback timer: if worker hangs or doesn't respond
        timerFallback = setTimeout(() => {
          cleanup();
          if (this.currentSearchId === searchId) {
            console.warn('AI worker timeout. Running synchronous search fallback.');
            resolve(this.getBestMoveSync(engine, aiPlayer, constraints, onTelemetry));
          }
        }, constraints.timeLimit + 2500);

        this.worker.addEventListener('message', messageHandler);
        this.worker.postMessage({
          type: 'search',
          searchId,
          board: boardArray,
          boardArray,
          currentTurn: aiPlayer,
          ruleMode: engine.ruleMode || 'nigeria',
          p1Short: engine.p1Short || 0,
          modifications: engine.modifications || 'none',
          timeLimit: constraints.timeLimit,
          maxDepth: constraints.maxDepth,
          useOpening: constraints.useOpening
        });
      });
    }

    // Fallback: Synchronous search on searchEngine
    return this.getBestMoveSync(engine, aiPlayer, constraints, onTelemetry);
  }

  /**
   * Synchronous search fallback.
   */
  getBestMoveSync(engine, aiPlayer = PLAYER_2, constraints = null, onTelemetry = null) {
    const legalMoves = engine.getAllLegalMoves(aiPlayer);
    if (legalMoves.length === 0) return null;
    if (legalMoves.length === 1) return { move: legalMoves[0], score: 0, depth: 1, nodes: 1, pv: [] };

    if (!constraints) {
      constraints = this.getDifficultyConstraints(300, 0);
    }

    const board50 = new DraughtsBoard50({
      ruleMode: engine.ruleMode || 'nigeria',
      p1Short: engine.p1Short || 0,
      modifications: engine.modifications || 'none'
    });
    board50.board.set(this.convertBoardTo50(engine));
    board50.currentTurn = aiPlayer;

    if (onTelemetry) {
      this.searchEngine.onTelemetry = onTelemetry;
    }

    const result = this.searchEngine.search(
      board50,
      constraints.timeLimit,
      constraints.maxDepth,
      constraints.useOpening
    );

    if (result && result.bestMove) {
      const bestMove50 = {
        ...result.bestMove,
        fromSq: result.bestMove.from,
        toSq: result.bestMove.to,
        from: sqToRC(result.bestMove.from),
        to: sqToRC(result.bestMove.to)
      };
      const matched = this.matchMoveInEngine(engine, bestMove50);
      return {
        move: matched,
        score: result.score,
        depth: result.depth,
        nodes: result.nodes,
        pv: result.pv
      };
    }

    return { move: legalMoves[0], score: 0, depth: 1, nodes: 1 };
  }

  /**
   * Legacy interface compatibility for instant synchronous callers.
   */
  getBestMove(engine, aiPlayer = PLAYER_2) {
    const res = this.getBestMoveSync(engine, aiPlayer);
    return (res && res.move !== undefined) ? res.move : (res || null);
  }
}
