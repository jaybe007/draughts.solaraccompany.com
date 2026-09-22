import fs from 'fs';
import path from 'path';
import { DraughtsBoard50, sqToRC, rcToSq, P1_MAN, P2_MAN, P1_KING, P2_KING, EMPTY, PLAYER_1, PLAYER_2 } from '../js/engine50.js';
import { reflectIntlToNigSq } from './train_from_screenshot.js';
import { DraughtsOpeningBook } from '../js/opening.js';

console.log('================================================================');
console.log('🚀 BATCH INGESTION & TRAINING FOR ALL 21 SCREENSHOTS');
console.log('================================================================\n');

// 20 unique puzzle IDs from the 21 screenshots in "DRAUGHTS IMAGE/"
const PUZZLE_IDS = [
  226, 227, 228, 229, 230, 232, 235, 236, 238, 248,
  250, 251, 252, 254, 255, 256, 258, 260, 264, 265
];

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

function extractBranchMoves(node) {
  const moves = [];
  let curr = node;
  while (curr) {
    const uci = curr.uci;
    const san = curr.san;
    if (uci && san) {
      const from = parseInt(uci.slice(0, 2), 10);
      const to = parseInt(uci.slice(2, 4), 10);
      moves.push({ from, to, san });
    }
    if (curr.children && curr.children.length > 0) {
      curr = curr.children[0];
    } else {
      break;
    }
  }
  return moves;
}

async function fetchAndAnalyzePuzzle(id) {
  const url = `https://lidraughts.org/training/${id}`;
  const res = await fetch(url);
  const html = await res.text();

  const fenMatch = html.match(/"fen":"([^"]+)"/);
  const ratingMatch = html.match(/"rating":(\d+)/);
  const branchIdx = html.indexOf('"branch":');

  if (!fenMatch || branchIdx === -1) {
    console.error(`❌ Could not parse puzzle ${id}`);
    return null;
  }

  const fen = fenMatch[1];
  const rating = ratingMatch ? parseInt(ratingMatch[1], 10) : 2000;

  // Extract branch JSON safely
  let branchStr = html.slice(branchIdx + 9);
  let depth = 0;
  let endIdx = -1;
  for (let i = 0; i < branchStr.length; i++) {
    if (branchStr[i] === '{') depth++;
    else if (branchStr[i] === '}') {
      depth--;
      if (depth === 0) {
        endIdx = i + 1;
        break;
      }
    }
  }

  let branchObj = null;
  if (endIdx !== -1) {
    try {
      branchObj = JSON.parse(branchStr.slice(0, endIdx));
    } catch (e) {
      console.error(`JSON parse error for branch ${id}:`, e.message);
    }
  }

  if (!branchObj) return null;

  const initialMoves = extractBranchMoves(branchObj);
  const parsedFEN = parseDraughtsFEN(fen);

  return {
    id,
    fen,
    rating,
    parsedFEN,
    initialMoves
  };
}

async function run() {
  const analyzedPuzzles = [];

  for (const id of PUZZLE_IDS) {
    process.stdout.write(`Fetching Puzzle ${id}... `);
    const p = await fetchAndAnalyzePuzzle(id);
    if (p) {
      console.log(`✓ Rating: ${p.rating}, Moves: ${p.initialMoves.length}`);
      analyzedPuzzles.push(p);
    }
  }

  console.log(`\nSuccessfully fetched ${analyzedPuzzles.length} puzzles from screenshots!`);
  fs.writeFileSync('scripts/fetched_lidraughts_puzzles.json', JSON.stringify(analyzedPuzzles, null, 2));
  console.log('Saved to scripts/fetched_lidraughts_puzzles.json');
}

run();
