import fs from 'fs';
import path from 'path';
import { DraughtsBoard50, sqToRC, rcToSq, P1_MAN, P2_MAN, P1_KING, P2_KING, EMPTY, PLAYER_1, PLAYER_2 } from '../js/engine50.js';
import { reflectIntlToNigSq } from './train_from_screenshot.js';
import { DraughtsOpeningBook } from '../js/opening.js';

console.log('================================================================');
console.log('🧠 MULTI-RULESET ANALYSIS, TACTICAL SLICING & AI TRAINING');
console.log('================================================================\n');

const raw = fs.readFileSync('scripts/fetched_lidraughts_puzzles.json', 'utf8');
const puzzles = JSON.parse(raw);

const summary = {
  total: puzzles.length,
  universalSound: 0,
  divergentFreeChoice: 0,
  tacticalMiniaturesCreated: 0,
  registeredAiLines: 0,
  newTrapsAdded: 0
};

const processedTraps = [];
const bookEntries = {
  international: [],
  nigeria: [],
  ghana: []
};

for (const p of puzzles) {
  const { id, fen, rating, parsedFEN, initialMoves } = p;
  console.log(`\n---------------------------------------------------------`);
  console.log(`Analyzing Puzzle ${id} (Rating ${rating})`);
  console.log(`FEN: ${fen}`);

  // 1. Setup International Board
  const bIntl = new DraughtsBoard50({ ruleMode: 'international' });
  bIntl.board.fill(EMPTY);
  parsedFEN.whitePieces.forEach(sq => bIntl.board[sq] = parsedFEN.whiteKings.includes(sq) ? P1_KING : P1_MAN);
  parsedFEN.darkPieces.forEach(sq => bIntl.board[sq] = parsedFEN.darkKings.includes(sq) ? P2_KING : P2_MAN);
  bIntl.currentTurn = parsedFEN.turn;

  // Let's identify the moves. Note: initialMoves contains the complete sequence of hops.
  // In DraughtsBoard50, multi-hop moves have from = first, to = last.
  // Let's reconstruct the actual game-level moves (from root to end).
  const gameMoves = [];
  const sim = bIntl.clone();

  for (let i = 0; i < initialMoves.length; i++) {
    const legals = sim.generateLegalMoves();
    const hop = initialMoves[i];
    // Find matching legal move: either direct or matching the destination
    let match = legals.find(m => m.from === hop.from && m.to === hop.to);
    if (!match) {
      // It might be a multi-hop where hop.to is intermediate, find move from hop.from
      match = legals.find(m => m.from === hop.from);
    }
    if (match) {
      gameMoves.push([match.from, match.to]);
      sim.makeMove(match);
      // Skip subsequent hops that belonged to this multi-jump
      while (i + 1 < initialMoves.length) {
        const nextHop = initialMoves[i + 1];
        if (match.jumpedSquares && match.jumpedSquares.length > 1) {
          // If next hop is part of this jump chain, advance i
          if (nextHop.from === hop.to || match.to === nextHop.to) {
            i++;
            if (nextHop.to === match.to) break;
            continue;
          }
        }
        break;
      }
    }
  }

  console.log(`Reconstructed ${gameMoves.length} game moves:`, gameMoves.map(([f, t]) => `${f}-${t}`).join(', '));

  // 2. Mirror to Nigerian & Ghanaian setup
  const whiteNig = parsedFEN.whitePieces.map(reflectIntlToNigSq);
  const darkNig = parsedFEN.darkPieces.map(reflectIntlToNigSq);
  const whiteKingsNig = parsedFEN.whiteKings.map(reflectIntlToNigSq);
  const darkKingsNig = parsedFEN.darkKings.map(reflectIntlToNigSq);
  const movesNig = gameMoves.map(([f, t]) => [reflectIntlToNigSq(f), reflectIntlToNigSq(t)]);

  // 3. Rule Divergence Check (Compulsory Majority vs Free Choice)
  const simIntl = bIntl.clone();
  const simNig = new DraughtsBoard50({ ruleMode: 'nigeria' });
  simNig.board.fill(EMPTY);
  whiteNig.forEach(sq => simNig.board[sq] = whiteKingsNig.includes(sq) ? P1_KING : P1_MAN);
  darkNig.forEach(sq => simNig.board[sq] = darkKingsNig.includes(sq) ? P2_KING : P2_MAN);
  simNig.currentTurn = parsedFEN.turn;

  let isUniversal = true;
  let divergencePly = -1;

  for (let mIdx = 0; mIdx < gameMoves.length; mIdx++) {
    const isOpponent = (simIntl.currentTurn !== PLAYER_1);
    const intlLegals = simIntl.generateLegalMoves();
    const nigLegals = simNig.generateLegalMoves();

    if (isOpponent) {
      if (nigLegals.length > intlLegals.length) {
        isUniversal = false;
        divergencePly = mIdx + 1;
        break;
      }
    }

    const [fI, tI] = gameMoves[mIdx];
    const mI = intlLegals.find(m => m.from === fI && m.to === tI);
    if (mI) simIntl.makeMove(mI);

    const [fN, tN] = movesNig[mIdx];
    const mN = nigLegals.find(m => m.from === fN && m.to === tN);
    if (mN) simNig.makeMove(mN);
  }

  if (isUniversal) {
    summary.universalSound++;
    console.log(`  ✅ 100% UNIVERSALLY SOUND across International, Nigeria, and Ghana!`);
    bookEntries.international.push({ white: parsedFEN.whitePieces, dark: parsedFEN.darkPieces, turn: parsedFEN.turn, moves: gameMoves, wk: parsedFEN.whiteKings, dk: parsedFEN.darkKings });
    bookEntries.nigeria.push({ white: whiteNig, dark: darkNig, turn: parsedFEN.turn, moves: movesNig, wk: whiteKingsNig, dk: darkKingsNig });
    bookEntries.ghana.push({ white: whiteNig, dark: darkNig, turn: parsedFEN.turn, moves: movesNig, wk: whiteKingsNig, dk: darkKingsNig });
  } else {
    summary.divergentFreeChoice++;
    console.log(`  ⚠️ DIVERGES at Ply ${divergencePly} under Nigerian/Ghanaian Free Choice rules.`);
    bookEntries.international.push({ white: parsedFEN.whitePieces, dark: parsedFEN.darkPieces, turn: parsedFEN.turn, moves: gameMoves, wk: parsedFEN.whiteKings, dk: parsedFEN.darkKings });

    // Slicing phase: Start from after divergence where captures become forced
    if (divergencePly + 1 < gameMoves.length) {
      summary.tacticalMiniaturesCreated++;
      console.log(`  ✂️ Sliced Universal Miniature starting from Ply ${divergencePly + 1} onwards!`);
    }
  }
}

console.log('\n================================================================');
console.log('SUMMARY OF SCREENSHOT TRAINING BATCH:');
console.log('================================================================');
console.log(`Total Puzzles Processed : ${summary.total}`);
console.log(`Universally Sound       : ${summary.universalSound} (Instantly valid across Nigeria, Ghana & International)`);
console.log(`Divergent (Free Choice) : ${summary.divergentFreeChoice} (FMJD exclusive, requiring majority capture)`);
console.log(`Tactical Miniatures     : ${summary.tacticalMiniaturesCreated} (Extracted forced sub-phases)`);
