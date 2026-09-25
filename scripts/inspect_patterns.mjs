import { TRAP_DATABASE } from '../js/traps.js';

console.log('Inspecting step patterns across all 131 puzzles...\n');

let patternCount = {
  whiteStartsWhiteWins: 0,
  whiteStartsBlackWins: 0,
  blackStartsWhiteWins: 0,
  blackStartsBlackWins: 0
};

TRAP_DATABASE.forEach((p, idx) => {
  const steps = p.steps || p.solution?.steps || [];
  if (!steps.length) return;

  const firstMover = steps[0].mover;
  const lastMover = steps[steps.length - 1].mover;

  // Simulate end piece counts
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
  const winner = isWhiteWin ? 1 : 2;

  if (firstMover === 1 && winner === 1) patternCount.whiteStartsWhiteWins++;
  if (firstMover === 1 && winner === 2) patternCount.whiteStartsBlackWins++;
  if (firstMover === 2 && winner === 1) patternCount.blackStartsWhiteWins++;
  if (firstMover === 2 && winner === 2) patternCount.blackStartsBlackWins++;

  if (idx < 10 || (firstMover === 1 && winner === 2 && idx < 25)) {
    console.log(`P#${idx + 1} (${p.id}): firstMover=P${firstMover}, lastMover=P${lastMover}, winner=P${winner}, hasInitialMove=${Boolean(p.initialMove)}`);
  }
});

console.log('\nPattern counts:', patternCount);
