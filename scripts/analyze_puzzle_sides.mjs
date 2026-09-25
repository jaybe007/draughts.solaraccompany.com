import { TRAP_DATABASE } from '../js/traps.js';

const groups = {};

TRAP_DATABASE.forEach((p, idx) => {
  const wStart = p.initialBoard.filter(x => x.player === 1).length;
  const bStart = p.initialBoard.filter(x => x.player === 2).length;
  const board = Array.from({ length: 10 }, () => Array(10).fill(null));
  p.initialBoard.forEach(item => {
    board[item.r][item.c] = { player: item.player, isKing: item.isKing };
  });

  const steps = p.steps || p.solution?.steps || [];
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

  const netAdvantageWhite = (wEnd - bEnd) - (wStart - bStart);
  const isWhiteWin = netAdvantageWhite > 0 || (wEnd > bEnd && wKings >= bKings);

  const key = p.badge?.includes('Ambush')
    ? 'Ambush'
    : (p.badge?.includes('Endgame')
      ? 'Endgame'
      : (p.id?.includes('MINI')
        ? 'Miniature'
        : (p.badge?.includes('Defensive')
          ? 'Defensive'
          : (p.ruleset === 'nigeria' ? 'Nigeria' : (p.ruleset === 'ghana' ? 'Ghana' : 'Master')))));

  if (!groups[key]) groups[key] = { total: 0, whiteWins: 0, blackWins: 0 };
  groups[key].total++;
  if (isWhiteWin) {
    groups[key].whiteWins++;
  } else {
    groups[key].blackWins++;
  }
});

console.log('SUMMARY BY TYPE:');
console.table(groups);
