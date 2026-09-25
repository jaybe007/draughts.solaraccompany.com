import { TRAP_DATABASE } from '../js/traps.js';

console.log('Inspecting first 3 steps of black-winning puzzles...\n');

let count = 0;
TRAP_DATABASE.forEach((p, idx) => {
  const steps = p.steps || [];
  // Calculate winner
  const wStart = p.initialBoard.filter(x => x.player === 1).length;
  const bStart = p.initialBoard.filter(x => x.player === 2).length;
  const board = Array.from({ length: 10 }, () => Array(10).fill(null));
  p.initialBoard.forEach(item => {
    board[item.r][item.c] = { player: item.player, isKing: item.isKing };
  });
  steps.forEach(s => {
    const piece = board[s.from.r][s.from.c];
    if (!piece) return;
    board[s.to.r][s.to.c] = piece;
    board[s.from.r][s.from.c] = null;
    if (piece.player === 1 && s.to.r === 0) piece.isKing = true;
    if (piece.player === 2 && s.to.r === 9) piece.isKing = true;
    if (Math.abs(s.to.r - s.from.r) >= 2) {
      const dr = s.to.r > s.from.r ? 1 : -1;
      const dc = s.to.c > s.from.c ? 1 : -1;
      let r = s.from.r + dr;
      let c = s.from.c + dc;
      while (r !== s.to.r && c !== s.to.c) {
        board[r][c] = null;
        r += dr;
        c += dc;
      }
    }
  });
  let wEnd = 0, bEnd = 0, wKings = 0, bKings = 0;
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      if (board[r][c]?.player === 1) {
        wEnd++;
        if (board[r][c].isKing) wKings++;
      }
      if (board[r][c]?.player === 2) {
        bEnd++;
        if (board[r][c].isKing) bKings++;
      }
    }
  }
  const isWhiteWin = ((wEnd - bEnd) - (wStart - bStart) > 0) || (wEnd > bEnd && wKings >= bKings);

  if (!isWhiteWin && count < 15) {
    count++;
    console.log(`[#${idx + 1}] ${p.id} (${p.ruleset}): "${p.title}"`);
    console.log(`  initialMove:`, p.initialMove ? `${p.initialMove.fromSq}-${p.initialMove.toSq}` : 'null');
    console.log(`  Step 0: P${steps[0]?.mover} ${steps[0]?.fromSq}-${steps[0]?.toSq} [jump=${steps[0]?.isJump}] note="${steps[0]?.note}"`);
    console.log(`  Step 1: P${steps[1]?.mover} ${steps[1]?.fromSq}-${steps[1]?.toSq} [jump=${steps[1]?.isJump}] note="${steps[1]?.note}"`);
    console.log(`  Step 2: P${steps[2]?.mover} ${steps[2]?.fromSq}-${steps[2]?.toSq} [jump=${steps[2]?.isJump}] note="${steps[2]?.note}"`);
    console.log(`  Total steps: ${steps.length}`);
    console.log('');
  }
});
