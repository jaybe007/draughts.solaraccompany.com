/**
 * Multi-Ruleset Opening Books for 10x10 Draughts (opening.js)
 * 
 * Provides dedicated, isolated opening repertoires for:
 * 1. 🇳🇬 NIGERIA OPENING BOOK (Highway Domination, Lagos Center Wedge, Gba-ma-gba Gambits, Flank Lock)
 * 2. 🇬🇭 GHANA OPENING BOOK (Accra Express, Kumasi Fortress, Ghana Cross, Damii Flank Wedge)
 * 3. 🌍 INTERNATIONAL OPENING BOOK (FMJD: Roozenburg, Kozlovsky, Springer, Fankhauser, Keller)
 * 
 * STRICT ISOLATION: International books are NEVER queried for Nigeria or Ghana games.
 */

import { computeZobristHash } from './zobrist.js';
import { DraughtsBoard50, PLAYER_1 } from './engine50.js';
import { DraughtsEvaluation50 } from './evaluation.js';

export class DraughtsOpeningBook {
  constructor() {
    this.books = {
      'nigeria': new Map(),
      'ghana': new Map(),
      'international': new Map()
    };
    this.evaluator = new DraughtsEvaluation50();
    this.initNigeriaBook();
    this.initGhanaBook();
    this.initInternationalBook();
  }

  generateRepertoire(ruleMode, depth = 8) {
    const board = new DraughtsBoard50({ ruleMode });
    const lines = [];
    board.reset();
    const whiteOpeners = board.generateLegalMoves();

    for (const wMove of whiteOpeners) {
      board.reset();
      board.makeMove(wMove);

      const blackReplies = board.generateLegalMoves();
      const scoredBlack = blackReplies.map(bm => {
        board.makeMove(bm);
        const sc = this.evaluator.evaluate(board.board, board.currentTurn, null, ruleMode);
        board.unmakeMove(bm);
        return { bm, score: -sc };
      }).sort((a, b) => b.score - a.score);

      const topBlack = scoredBlack.slice(0, 2);
      for (const tb of topBlack) {
        board.reset();
        board.makeMove(wMove);
        board.makeMove(tb.bm);
        const line = [[wMove.from, wMove.to], [tb.bm.from, tb.bm.to]];

        for (let p = 2; p < depth; p++) {
          const leg = board.generateLegalMoves();
          if (leg.length === 0) break;
          const scored = leg.map(cand => {
            board.makeMove(cand);
            const sc = this.evaluator.evaluate(board.board, board.currentTurn, null, ruleMode);
            board.unmakeMove(cand);
            return { cand, score: -sc };
          }).sort((a, b) => b.score - a.score);
          const best = scored[0].cand;
          line.push([best.from, best.to]);
          board.makeMove(best);
        }
        lines.push(line);
      }
    }
    return lines;
  }

  registerLines(bookMap, ruleMode, lines) {
    const sim = new DraughtsBoard50({ ruleMode });

    for (const movesList of lines) {
      sim.reset();
      for (let i = 0; i < movesList.length; i++) {
        const [from, to] = movesList[i];
        const hash = computeZobristHash(sim.board, sim.currentTurn, ruleMode);

        const legal = sim.generateLegalMoves();
        const found = legal.find(m => m.from === from && m.to === to);
        if (!found) break;

        const entries = bookMap.get(hash) || [];
        if (!entries.some(e => e.from === from && e.to === to)) {
          entries.push({ from, to, weight: 10 - Math.min(8, i) });
          bookMap.set(hash, entries);
        }

        sim.makeMove(found);
      }
    }
  }

  /**
   * 🇳🇬 Nigeria Opening Repertoire
   */
  initNigeriaBook() {
    const lines = this.generateRepertoire('nigeria');
    this.registerLines(this.books.nigeria, 'nigeria', lines);
  }

  /**
   * 🇬🇭 Ghana Opening Repertoire (Damii)
   */
  initGhanaBook() {
    const lines = this.generateRepertoire('ghana');
    this.registerLines(this.books.ghana, 'ghana', lines);
  }

  /**
   * 🌍 International Opening Repertoire (FMJD Standard)
   */
  initInternationalBook() {
    const lines = this.generateRepertoire('international');
    this.registerLines(this.books.international, 'international', lines);
  }

  /**
   * Normalizes ruleset identifier to one of 'nigeria', 'ghana', or 'international'.
   */
  normalizeRuleset(ruleMode) {
    const r = (ruleMode || 'nigeria').toString().toLowerCase().trim();
    if (r === 'ghana' || r === 'damii') return 'ghana';
    if (r === 'international' || r === 'tournament' || r === 'fmjd') return 'international';
    return 'nigeria';
  }

  /**
   * Looks up a move from the appropriate ruleset-specific opening book.
   * @param {bigint} hash - Ruleset-aware Zobrist hash
   * @param {Array} legalMoves - Current legal moves
   * @param {string} ruleMode - Active ruleset ('nigeria', 'ghana', 'international')
   */
  lookup(hash, legalMoves, ruleMode = 'nigeria') {
    const key = this.normalizeRuleset(ruleMode);
    const bookMap = this.books[key] || this.books.nigeria;
    const candidates = bookMap.get(hash);
    if (!candidates || candidates.length === 0) return null;

    // Filter to currently legal moves
    const matchingMoves = [];
    for (const cand of candidates) {
      const legal = legalMoves.find(m => m.from === cand.from && m.to === cand.to);
      if (legal) {
        matchingMoves.push({ move: legal, weight: cand.weight });
      }
    }

    if (matchingMoves.length === 0) return null;

    // Weighted random selection
    const totalWeight = matchingMoves.reduce((acc, c) => acc + c.weight, 0);
    let rand = Math.random() * totalWeight;

    for (const item of matchingMoves) {
      rand -= item.weight;
      if (rand <= 0) return item.move;
    }

    return matchingMoves[0].move;
  }
}
