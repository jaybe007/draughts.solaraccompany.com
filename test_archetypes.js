import { sqToRC, rcToSq } from './js/engine50.js';
import { NigerianDraughtsEngine, PLAYER_1, PLAYER_2 } from './js/engine.js';
import { calculateComprehensivePuzzleDifficulty, mapToDifficultyTier, satisfiesTierGate } from './js/puzzle_difficulty.js';

console.log('Testing Archetypes across Rulesets...');

// Archetype 1: Quiet Prophylactic / Tempo Blockade (Tier 8 - Grandmaster)
// White: 46 (King), 38, 43, 49
// Black: 25, 20, 15
// White's move: 46-28! (Quiet Highway opposition taking away square 23 and 32)
// Tempting wrong move: 38-32 (aggressive push that allows Black 25-30 counterbreak)

function testQuietHighwayArchetype() {
  const engine = new NigerianDraughtsEngine({ boardSize: 10, ruleMode: 'nigeria' });
  for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) engine.board[r][c] = null;

  engine.board[sqToRC(46).r][sqToRC(46).c] = { player: PLAYER_1, isKing: true };
  engine.board[sqToRC(38).r][sqToRC(38).c] = { player: PLAYER_1, isKing: false };
  engine.board[sqToRC(43).r][sqToRC(43).c] = { player: PLAYER_1, isKing: false };
  engine.board[sqToRC(49).r][sqToRC(49).c] = { player: PLAYER_1, isKing: false };

  engine.board[sqToRC(25).r][sqToRC(25).c] = { player: PLAYER_2, isKing: false };
  engine.board[sqToRC(20).r][sqToRC(20).c] = { player: PLAYER_2, isKing: false };
  engine.board[sqToRC(15).r][sqToRC(15).c] = { player: PLAYER_2, isKing: false };

  engine.currentTurn = PLAYER_1;
  const legals = engine.getAllLegalMoves(PLAYER_1);
  console.log('Quiet archetype White legal moves count:', legals.length);
  const m = legals.find(l => rcToSq(l.from.r, l.from.c) === 46 && rcToSq(l.to.r, l.to.c) === 28);
  console.log('Is 46-28 legal?:', m != null);
}

testQuietHighwayArchetype();
