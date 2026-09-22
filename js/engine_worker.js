/**
 * Dedicated Background Search Web Worker (engine_worker.js)
 * 
 * Runs intensive game-tree search off the browser UI thread,
 * ensuring 60fps animations and fluid telemetry.
 */

import { DraughtsBoard50, sqToRC } from './engine50.js';
import { DraughtsSearchEngine } from './search.js';

let searchEngine = null;
let currentSearchId = 0;
let currentIsIntl = false;

self.addEventListener('message', (e) => {
  const data = e.data;
  if (!data) return;

  if (data.type === 'init') {
    searchEngine = new DraughtsSearchEngine({
      onTelemetry: (telemetry) => {
        const formattedPV = (telemetry.pv || []).map(m => {
          if (!m) return null;
          return {
            fromSq: m.from,
            toSq: m.to,
            from: typeof m.from === 'number' ? sqToRC(m.from, currentIsIntl) : (m.from || null),
            to: typeof m.to === 'number' ? sqToRC(m.to, currentIsIntl) : (m.to || null),
            isCapture: Boolean(m.isCapture)
          };
        }).filter(Boolean);

        self.postMessage({
          type: 'telemetry',
          searchId: currentSearchId,
          ...telemetry,
          pv: formattedPV
        });
      }
    });
    self.postMessage({ type: 'ready' });
    return;
  }

  if (data.type === 'stop') {
    if (searchEngine) searchEngine.stopSearch = true;
    return;
  }

  if (data.type === 'search') {
    currentSearchId = data.searchId || 0;
    const normRule = (data.ruleMode || 'nigeria').toString().toLowerCase().trim();
    currentIsIntl = normRule === 'international' || normRule === 'tournament' || normRule === 'fmjd';

    if (!searchEngine) {
      searchEngine = new DraughtsSearchEngine({
        onTelemetry: (telemetry) => {
          const formattedPV = (telemetry.pv || []).map(m => {
            if (!m) return null;
            return {
              fromSq: m.from,
              toSq: m.to,
              from: typeof m.from === 'number' ? sqToRC(m.from, currentIsIntl) : (m.from || null),
              to: typeof m.to === 'number' ? sqToRC(m.to, currentIsIntl) : (m.to || null),
              isCapture: Boolean(m.isCapture)
            };
          }).filter(Boolean);

          self.postMessage({
            type: 'telemetry',
            searchId: currentSearchId,
            ...telemetry,
            pv: formattedPV
          });
        }
      });
    }

    const board = new DraughtsBoard50({
      ruleMode: data.ruleMode || 'nigeria',
      p1Short: data.p1Short || 0,
      modifications: data.modifications || 'none'
    });

    const boardData = data.boardArray || data.board;
    if (boardData) {
      board.board.set(boardData);
    }
    board.currentTurn = data.currentTurn;

    const result = searchEngine.search(
      board,
      data.timeLimit || 2500,
      data.maxDepth || 22,
      data.useOpening !== false
    );

    if (result && result.bestMove) {
      const bestMove = {
        ...result.bestMove,
        fromSq: result.bestMove.from,
        toSq: result.bestMove.to,
        from: sqToRC(result.bestMove.from, currentIsIntl),
        to: sqToRC(result.bestMove.to, currentIsIntl)
      };

      const formattedPV = (result.pv || []).map(m => {
        if (!m) return null;
        return {
          fromSq: m.from,
          toSq: m.to,
          from: typeof m.from === 'number' ? sqToRC(m.from, currentIsIntl) : (m.from || null),
          to: typeof m.to === 'number' ? sqToRC(m.to, currentIsIntl) : (m.to || null),
          isCapture: Boolean(m.isCapture)
        };
      }).filter(Boolean);

      self.postMessage({
        type: 'bestmove',
        searchId: currentSearchId,
        bestMove,
        score: result.score,
        depth: result.depth,
        nodes: result.nodes,
        ruleset: (data.ruleMode || 'nigeria').toUpperCase(),
        pv: formattedPV
      });
    } else {
      self.postMessage({
        type: 'bestmove',
        searchId: currentSearchId,
        bestMove: null,
        score: 0,
        depth: 0,
        nodes: 0,
        ruleset: (data.ruleMode || 'nigeria').toUpperCase(),
        pv: []
      });
    }
  }
});
