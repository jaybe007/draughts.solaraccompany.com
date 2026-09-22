import fs from 'fs';
import { reflectIntlToNigSq } from './train_from_screenshot.js';
import { DraughtsBoard50, sqToRC, P1_MAN, P2_MAN, P1_KING, P2_KING, EMPTY, PLAYER_1 } from '../js/engine50.js';

const raw = fs.readFileSync('scripts/fetched_lidraughts_puzzles.json', 'utf8');
const puzzles = JSON.parse(raw);

const entries = [];

for (const p of puzzles) {
  const { id, rating, parsedFEN, initialMoves } = p;
  const bIntl = new DraughtsBoard50({ ruleMode: 'international' });
  bIntl.board.fill(EMPTY);
  parsedFEN.whitePieces.forEach(sq => bIntl.board[sq] = parsedFEN.whiteKings.includes(sq) ? P1_KING : P1_MAN);
  parsedFEN.darkPieces.forEach(sq => bIntl.board[sq] = parsedFEN.darkKings.includes(sq) ? P2_KING : P2_MAN);
  bIntl.currentTurn = parsedFEN.turn;

  const gameMoves = [];
  const sim = bIntl.clone();

  for (let i = 0; i < initialMoves.length; i++) {
    const legals = sim.generateLegalMoves();
    const hop = initialMoves[i];
    let match = legals.find(m => m.from === hop.from && m.to === hop.to);
    if (!match) {
      match = legals.find(m => m.from === hop.from);
    }
    if (match) {
      gameMoves.push([match.from, match.to]);
      sim.makeMove(match);
      while (i + 1 < initialMoves.length) {
        const nextHop = initialMoves[i + 1];
        if (match.jumpedSquares && match.jumpedSquares.length > 1) {
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

  // Check divergence
  const whiteNig = parsedFEN.whitePieces.map(reflectIntlToNigSq);
  const darkNig = parsedFEN.darkPieces.map(reflectIntlToNigSq);
  const whiteKingsNig = parsedFEN.whiteKings.map(reflectIntlToNigSq);
  const darkKingsNig = parsedFEN.darkKings.map(reflectIntlToNigSq);
  const movesNig = gameMoves.map(([f, t]) => [reflectIntlToNigSq(f), reflectIntlToNigSq(t)]);

  const simIntl = bIntl.clone();
  const simNig = new DraughtsBoard50({ ruleMode: 'nigeria' });
  simNig.board.fill(EMPTY);
  whiteNig.forEach(sq => simNig.board[sq] = whiteKingsNig.includes(sq) ? P1_KING : P1_MAN);
  darkNig.forEach(sq => simNig.board[sq] = darkKingsNig.includes(sq) ? P2_KING : P2_MAN);
  simNig.currentTurn = parsedFEN.turn;

  let isUniversal = true;
  for (let mIdx = 0; mIdx < gameMoves.length; mIdx++) {
    const isOpponent = (simIntl.currentTurn !== PLAYER_1);
    const intlLegals = simIntl.generateLegalMoves();
    const nigLegals = simNig.generateLegalMoves();

    if (isOpponent && nigLegals.length > intlLegals.length) {
      isUniversal = false;
      break;
    }

    const [fI, tI] = gameMoves[mIdx];
    const mI = intlLegals.find(m => m.from === fI && m.to === tI);
    if (mI) simIntl.makeMove(mI);

    const [fN, tN] = movesNig[mIdx];
    const mN = nigLegals.find(m => m.from === fN && m.to === tN);
    if (mN) simNig.makeMove(mN);
  }

  entries.push({
    id,
    rating,
    isUniversal,
    white: parsedFEN.whitePieces,
    dark: parsedFEN.darkPieces,
    wk: parsedFEN.whiteKings,
    dk: parsedFEN.darkKings,
    turn: parsedFEN.turn,
    moves: gameMoves,
    whiteNig,
    darkNig,
    wkNig: whiteKingsNig,
    dkNig: darkKingsNig,
    movesNig
  });
}

console.log(`Generated ${entries.length} structured tactical entries.`);

// Let's create the code block to insert into js/opening.js
let code = `
  /**
   * Registers all 20 tactical master positions extracted from the user's screenshot suite (DRAUGHTS IMAGE).
   * Automatically isolates FMJD-exclusive combinations from universal multi-ruleset combinations.
   */
  initScreenshotMasterTactics() {
`;

for (const e of entries) {
  code += `    // Screenshot Puzzle ${e.id} (Rating ${e.rating}) - ${e.isUniversal ? 'Universal (FMJD/Nigeria/Ghana)' : 'FMJD Exclusive'}\n`;
  code += `    this.registerCustomPosition('international', ${JSON.stringify(e.white)}, ${JSON.stringify(e.dark)}, ${e.turn}, ${JSON.stringify(e.moves)}, ${JSON.stringify(e.wk)}, ${JSON.stringify(e.dk)});\n`;
  if (e.isUniversal) {
    code += `    this.registerCustomPosition('nigeria', ${JSON.stringify(e.whiteNig)}, ${JSON.stringify(e.darkNig)}, ${e.turn}, ${JSON.stringify(e.movesNig)}, ${JSON.stringify(e.wkNig)}, ${JSON.stringify(e.dkNig)});\n`;
    code += `    this.registerCustomPosition('ghana', ${JSON.stringify(e.whiteNig)}, ${JSON.stringify(e.darkNig)}, ${e.turn}, ${JSON.stringify(e.movesNig)}, ${JSON.stringify(e.wkNig)}, ${JSON.stringify(e.dkNig)});\n`;
  }
}

code += `  }\n`;

fs.writeFileSync('scripts/screenshot_tactics_code.js', code, 'utf8');
console.log('Saved generated tactics code to scripts/screenshot_tactics_code.js');
