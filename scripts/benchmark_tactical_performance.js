import { DraughtsBoard50, P1_MAN, P2_MAN, P1_KING, P2_KING, EMPTY, PLAYER_1, PLAYER_2 } from '../js/engine50.js';
import { DraughtsSearchEngine } from '../js/search.js';
import { performance } from 'perf_hooks';

console.log('================================================================');
console.log('📊 PERFORMANCE BENCHMARK: ORIGINAL VS SEED ADDITIONS & SUBTRACTIONS');
console.log('================================================================\n');

const search = new DraughtsSearchEngine();

function benchmarkPosition(label, ruleMode, whitePieces, darkPieces, whiteKings = [], darkKings = [], targetDepth = 6) {
  const b = new DraughtsBoard50({ ruleMode });
  b.board.fill(EMPTY);
  whitePieces.forEach(s => b.board[s] = whiteKings.includes(s) ? P1_KING : P1_MAN);
  darkPieces.forEach(s => b.board[s] = darkKings.includes(s) ? P2_KING : P2_MAN);
  b.currentTurn = PLAYER_1;

  const legals = b.generateLegalMoves();
  const t0 = performance.now();
  search.nodes = 0;
  const result = search.search(b, targetDepth, false);
  const elapsed = Math.max(0.1, performance.now() - t0);
  const nps = Math.round((search.nodes / elapsed) * 1000);

  return {
    label,
    ruleMode,
    pieceCount: whitePieces.length + darkPieces.length,
    rootMoves: legals.length,
    nodes: search.nodes,
    timeMs: elapsed.toFixed(2),
    nps,
    bestMove: result.bestMove ? `${result.bestMove.from}-${result.bestMove.to}` : 'None',
    score: result.score
  };
}

const tests = [
  {
    label: '1. Original Boyko #1 (17 pieces, Full Setup)',
    rule: 'international',
    w: [15, 20, 26, 30, 37, 39, 41, 42, 43],
    d: [4, 9, 10, 11, 12, 13, 16, 36],
    wk: [], dk: [], depth: 6
  },
  {
    label: '2. Seed Subtraction: Without Piece 16 (16 pieces - Leaks Branches)',
    rule: 'international',
    w: [15, 20, 26, 30, 37, 39, 41, 42, 43],
    d: [4, 9, 10, 11, 12, 13, 36],
    wk: [], dk: [], depth: 6
  },
  {
    label: '3. Seed Addition: Base Anchor on 46 (18 pieces)',
    rule: 'international',
    w: [15, 20, 26, 30, 37, 39, 41, 42, 43, 46],
    d: [4, 9, 10, 11, 12, 13, 16, 36],
    wk: [], dk: [], depth: 6
  },
  {
    label: '4. Phased Subtraction: Variant B Decoy Clearance (4 pieces)',
    rule: 'international',
    w: [15, 39],
    d: [35, 11],
    wk: [], dk: [], depth: 8
  },
  {
    label: '5. Phased Subtraction: Variant B in Nigeria (4 pieces)',
    rule: 'nigeria',
    w: [11, 37],
    d: [31, 15],
    wk: [], dk: [], depth: 8
  },
  {
    label: '6. Phased Subtraction: Variant C Lone King Opposition (3 pieces)',
    rule: 'international',
    w: [4],
    d: [29, 11],
    wk: [4], dk: [], depth: 8
  },
  {
    label: '7. Phased Subtraction: Variant C in Nigeria (3 pieces)',
    rule: 'nigeria',
    w: [2],
    d: [27, 15],
    wk: [2], dk: [], depth: 8
  }
];

const results = [];
for (const t of tests) {
  const res = benchmarkPosition(t.label, t.rule, t.w, t.d, t.wk, t.dk, t.depth);
  results.push(res);
}

console.table(results);
