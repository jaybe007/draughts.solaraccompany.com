import { DraughtsBoard50, P1_MAN, P2_MAN, P1_KING, P2_KING, EMPTY, PLAYER_1, PLAYER_2 } from '../js/engine50.js';

function parseDraughtsFEN(fen) {
  const parts = fen.split(':');
  const turn = parts[0].toUpperCase() === 'W' ? PLAYER_1 : PLAYER_2;
  const whitePieces = [];
  const whiteKings = [];
  const darkPieces = [];
  const darkKings = [];

  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    if (part.startsWith('W')) {
      const nums = part.slice(1).split(',');
      for (const n of nums) {
        if (!n) continue;
        const isKing = n.startsWith('K');
        const sq = parseInt(isKing ? n.slice(1) : n, 10);
        whitePieces.push(sq);
        if (isKing) whiteKings.push(sq);
      }
    } else if (part.startsWith('B')) {
      const nums = part.slice(1).split(',');
      for (const n of nums) {
        if (!n) continue;
        const isKing = n.startsWith('K');
        const sq = parseInt(isKing ? n.slice(1) : n, 10);
        darkPieces.push(sq);
        if (isKing) darkKings.push(sq);
      }
    }
  }

  return { turn, whitePieces, whiteKings, darkPieces, darkKings };
}

const fen = "B:W31,33,34,36,38,39,42,44,48:B12,13,14,18,19,22,23,27,35:H0:F1";
const parsed = parseDraughtsFEN(fen);
console.log('Parsed FEN:', parsed);
