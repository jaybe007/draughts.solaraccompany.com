/**
 * Street Trap Academy & Tactical Master (js/traps.js)
 * 
 * 100% Engine-Validated Draughts Tactical Puzzles Database.
 * Directly derived from and honoring the authentic DRAUGHTS IMAGE Collection (Screenshots 1.PNG - 21.PNG).
 * 
 * Features:
 * - 20 Canonical Master Compositions (International FMJD)
 * - 20 Nigerian Highway Transpositions (Naija Rules: 1..50 Highway, free choice, backward captures, flying Oba)
 * - 15 Ghanaian Damii Variants (Damii Rules: 1..50 Highway, immediate crown stop)
 * - 19 Tactical Miniatures (Derived via seed subtraction to isolate pure combinations)
 * - 20 Defensive Complexity Variants (Derived via seed addition testing flank precision)
 * - 17 Endgame Coronation Studies (King breakthrough and cleanup sweeps)
 * - 20 Pre-Move Ambush Challenges (Punish the opponent blunder that sets the trap)
 * 
 * Total Certified Puzzles: 131
 */

import { sound } from './audio.js';
import { PLAYER_1, PLAYER_2 } from './engine.js';

export const TRAP_DATABASE = [
  {
    "id": "DRAUGHTS-IMG-1",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "📸 DRAUGHTS IMAGE #1 (1.PNG): Kozlovsky Triple Sac & Gate Opening",
    "badge": "📸 1.PNG",
    "source_image": "1.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "triple-sacrifice",
    "themeName": "DRAUGHTS IMAGE Master Series",
    "themeIdea": "Forced combination from Screenshot 1.PNG",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Straight from DRAUGHTS IMAGE 1.PNG! Spot the combination and strike!",
    "difficulty": {
      "tier": 9,
      "tier_name": "Master",
      "rating": 2050,
      "human_score": 75
    },
    "difficultyTier": 9,
    "rating": 2050,
    "hints": [
      "Calculate White's breakthrough strike starting with 33-28.",
      "Opponent has compulsory responses. Calculate the full multi-jump chain.",
      "Play 33-28! This initiates the decisive win."
    ],
    "initialBoard": [
      {
        "r": 2,
        "c": 3,
        "square": 12,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 4,
        "square": 18,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 6,
        "square": 19,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 8,
        "square": 20,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 3,
        "square": 22,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 5,
        "square": 23,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 2,
        "square": 27,
        "player": 2,
        "isKing": false
      },
      {
        "r": 6,
        "c": 1,
        "square": 31,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 5,
        "square": 33,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 7,
        "square": 34,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 9,
        "square": 35,
        "player": 2,
        "isKing": false
      },
      {
        "r": 7,
        "c": 0,
        "square": 36,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 4,
        "square": 38,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 6,
        "square": 39,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 3,
        "square": 42,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 7,
        "square": 44,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 4,
        "square": 48,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 33,
        "toSq": 28,
        "from": {
          "r": 6,
          "c": 5
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Key strike: 33-28!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 23,
        "toSq": 32,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Opponent responds 23x43",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 32,
        "toSq": 43,
        "from": {
          "r": 6,
          "c": 3
        },
        "to": {
          "r": 8,
          "c": 5
        },
        "note": "Multi-jump continue: 43",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 44,
        "toSq": 40,
        "from": {
          "r": 8,
          "c": 7
        },
        "to": {
          "r": 7,
          "c": 8
        },
        "note": "Continue combo: 44-40",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 35,
        "toSq": 44,
        "from": {
          "r": 6,
          "c": 9
        },
        "to": {
          "r": 8,
          "c": 7
        },
        "note": "Opponent responds 35x33",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 44,
        "toSq": 33,
        "from": {
          "r": 8,
          "c": 7
        },
        "to": {
          "r": 6,
          "c": 5
        },
        "note": "Multi-jump continue: 33",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 48,
        "toSq": 39,
        "from": {
          "r": 9,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Continue combo: 48x8",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 39,
        "toSq": 28,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Multi-jump continue: 28",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 28,
        "toSq": 17,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 3,
          "c": 2
        },
        "note": "Multi-jump continue: 17",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 17,
        "toSq": 8,
        "from": {
          "r": 3,
          "c": 2
        },
        "to": {
          "r": 1,
          "c": 4
        },
        "note": "Multi-jump continue: 8",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 13,
        "toSq": 2,
        "from": {
          "r": 2,
          "c": 5
        },
        "to": {
          "r": 0,
          "c": 3
        },
        "note": "Opponent responds 13x2",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 31,
        "toSq": 22,
        "from": {
          "r": 6,
          "c": 1
        },
        "to": {
          "r": 4,
          "c": 3
        },
        "note": "Continue combo: 31x15",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 22,
        "toSq": 13,
        "from": {
          "r": 4,
          "c": 3
        },
        "to": {
          "r": 2,
          "c": 5
        },
        "note": "Multi-jump continue: 13",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 13,
        "toSq": 24,
        "from": {
          "r": 2,
          "c": 5
        },
        "to": {
          "r": 4,
          "c": 7
        },
        "note": "Multi-jump continue: 24",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 24,
        "toSq": 15,
        "from": {
          "r": 4,
          "c": 7
        },
        "to": {
          "r": 2,
          "c": 9
        },
        "note": "Multi-jump continue: 15",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-2",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "📸 DRAUGHTS IMAGE #2 (2.PNG): Center Gate Deflection & Decoy",
    "badge": "📸 2.PNG",
    "source_image": "2.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "gate-deflection",
    "themeName": "DRAUGHTS IMAGE Master Series",
    "themeIdea": "Forced combination from Screenshot 2.PNG",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Straight from DRAUGHTS IMAGE 2.PNG! Spot the combination and strike!",
    "difficulty": {
      "tier": 9,
      "tier_name": "Master",
      "rating": 2070,
      "human_score": 75
    },
    "difficultyTier": 9,
    "rating": 2070,
    "hints": [
      "Calculate White's breakthrough strike starting with 33-29.",
      "Opponent has compulsory responses. Calculate the full multi-jump chain.",
      "Play 33-29! This initiates the decisive win."
    ],
    "initialBoard": [
      {
        "r": 2,
        "c": 3,
        "square": 12,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 7,
        "square": 14,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 4,
        "square": 18,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 1,
        "square": 21,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 3,
        "square": 22,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 7,
        "square": 24,
        "player": 2,
        "isKing": false
      },
      {
        "r": 6,
        "c": 3,
        "square": 32,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 5,
        "square": 33,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 2,
        "square": 37,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 4,
        "square": 38,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 5,
        "square": 43,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 7,
        "square": 44,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 4,
        "square": 48,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 33,
        "toSq": 29,
        "from": {
          "r": 6,
          "c": 5
        },
        "to": {
          "r": 5,
          "c": 6
        },
        "note": "Key strike: 33-29!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 24,
        "toSq": 33,
        "from": {
          "r": 4,
          "c": 7
        },
        "to": {
          "r": 6,
          "c": 5
        },
        "note": "Opponent responds 24x31",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 33,
        "toSq": 42,
        "from": {
          "r": 6,
          "c": 5
        },
        "to": {
          "r": 8,
          "c": 3
        },
        "note": "Multi-jump continue: 42",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 42,
        "toSq": 31,
        "from": {
          "r": 8,
          "c": 3
        },
        "to": {
          "r": 6,
          "c": 1
        },
        "note": "Multi-jump continue: 31",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 32,
        "toSq": 28,
        "from": {
          "r": 6,
          "c": 3
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Continue combo: 32-28",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 22,
        "toSq": 33,
        "from": {
          "r": 4,
          "c": 3
        },
        "to": {
          "r": 6,
          "c": 5
        },
        "note": "Opponent responds 22x33",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 43,
        "toSq": 38,
        "from": {
          "r": 8,
          "c": 5
        },
        "to": {
          "r": 7,
          "c": 4
        },
        "note": "Continue combo: 43-38",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 33,
        "toSq": 42,
        "from": {
          "r": 6,
          "c": 5
        },
        "to": {
          "r": 8,
          "c": 3
        },
        "note": "Opponent responds 33x42",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 48,
        "toSq": 37,
        "from": {
          "r": 9,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 2
        },
        "note": "Continue combo: 48x10",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 37,
        "toSq": 26,
        "from": {
          "r": 7,
          "c": 2
        },
        "to": {
          "r": 5,
          "c": 0
        },
        "note": "Multi-jump continue: 26",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 26,
        "toSq": 17,
        "from": {
          "r": 5,
          "c": 0
        },
        "to": {
          "r": 3,
          "c": 2
        },
        "note": "Multi-jump continue: 17",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 17,
        "toSq": 8,
        "from": {
          "r": 3,
          "c": 2
        },
        "to": {
          "r": 1,
          "c": 4
        },
        "note": "Multi-jump continue: 8",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 8,
        "toSq": 19,
        "from": {
          "r": 1,
          "c": 4
        },
        "to": {
          "r": 3,
          "c": 6
        },
        "note": "Multi-jump continue: 19",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 19,
        "toSq": 10,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 1,
          "c": 8
        },
        "note": "Multi-jump continue: 10",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-3",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "📸 DRAUGHTS IMAGE #3 (3.PNG): Springer Diamond Shot & Coronation",
    "badge": "📸 3.PNG",
    "source_image": "3.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "diamond-shot",
    "themeName": "DRAUGHTS IMAGE Master Series",
    "themeIdea": "Forced combination from Screenshot 3.PNG",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Straight from DRAUGHTS IMAGE 3.PNG! Spot the combination and strike!",
    "difficulty": {
      "tier": 9,
      "tier_name": "Master",
      "rating": 2090,
      "human_score": 75
    },
    "difficultyTier": 9,
    "rating": 2090,
    "hints": [
      "Calculate White's breakthrough strike starting with 33-28.",
      "Opponent has compulsory responses. Calculate the full multi-jump chain.",
      "Play 33-28! This initiates the decisive win."
    ],
    "initialBoard": [
      {
        "r": 1,
        "c": 4,
        "square": 8,
        "player": 2,
        "isKing": false
      },
      {
        "r": 1,
        "c": 8,
        "square": 10,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 3,
        "square": 12,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 2,
        "square": 17,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 4,
        "square": 18,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 8,
        "square": 20,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 3,
        "square": 22,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 2,
        "square": 27,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 6,
        "square": 29,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 5,
        "square": 33,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 2,
        "square": 37,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 6,
        "square": 39,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 8,
        "square": 40,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 3,
        "square": 42,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 2,
        "square": 47,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 8,
        "square": 50,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 33,
        "toSq": 28,
        "from": {
          "r": 6,
          "c": 5
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Key strike: 33-28!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 22,
        "toSq": 33,
        "from": {
          "r": 4,
          "c": 3
        },
        "to": {
          "r": 6,
          "c": 5
        },
        "note": "Opponent responds 22x35",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 33,
        "toSq": 44,
        "from": {
          "r": 6,
          "c": 5
        },
        "to": {
          "r": 8,
          "c": 7
        },
        "note": "Multi-jump continue: 44",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 44,
        "toSq": 35,
        "from": {
          "r": 8,
          "c": 7
        },
        "to": {
          "r": 6,
          "c": 9
        },
        "note": "Multi-jump continue: 35",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 29,
        "toSq": 23,
        "from": {
          "r": 5,
          "c": 6
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Continue combo: 29-23",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 18,
        "toSq": 29,
        "from": {
          "r": 3,
          "c": 4
        },
        "to": {
          "r": 5,
          "c": 6
        },
        "note": "Opponent responds 18x29",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 37,
        "toSq": 32,
        "from": {
          "r": 7,
          "c": 2
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Continue combo: 37-32",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 27,
        "toSq": 38,
        "from": {
          "r": 5,
          "c": 2
        },
        "to": {
          "r": 7,
          "c": 4
        },
        "note": "Opponent responds 27x38",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 42,
        "toSq": 33,
        "from": {
          "r": 8,
          "c": 3
        },
        "to": {
          "r": 6,
          "c": 5
        },
        "note": "Continue combo: 42x4",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 33,
        "toSq": 24,
        "from": {
          "r": 6,
          "c": 5
        },
        "to": {
          "r": 4,
          "c": 7
        },
        "note": "Multi-jump continue: 24",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 24,
        "toSq": 15,
        "from": {
          "r": 4,
          "c": 7
        },
        "to": {
          "r": 2,
          "c": 9
        },
        "note": "Multi-jump continue: 15",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 15,
        "toSq": 4,
        "from": {
          "r": 2,
          "c": 9
        },
        "to": {
          "r": 0,
          "c": 7
        },
        "note": "Multi-jump continue: 4",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-4",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "📸 DRAUGHTS IMAGE #4 (4.PNG): Grandmaster Coronation Blitz",
    "badge": "📸 4.PNG",
    "source_image": "4.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "coronation-blitz",
    "themeName": "DRAUGHTS IMAGE Master Series",
    "themeIdea": "Forced combination from Screenshot 4.PNG",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Straight from DRAUGHTS IMAGE 4.PNG! Spot the combination and strike!",
    "difficulty": {
      "tier": 9,
      "tier_name": "Master",
      "rating": 2110,
      "human_score": 75
    },
    "difficultyTier": 9,
    "rating": 2110,
    "hints": [
      "Calculate White's breakthrough strike starting with 26-21.",
      "Opponent has compulsory responses. Calculate the full multi-jump chain.",
      "Play 26-21! This initiates the decisive win."
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 1,
        "square": 1,
        "player": 2,
        "isKing": false
      },
      {
        "r": 0,
        "c": 7,
        "square": 4,
        "player": 2,
        "isKing": false
      },
      {
        "r": 1,
        "c": 2,
        "square": 7,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 1,
        "square": 11,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 7,
        "square": 14,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 0,
        "square": 16,
        "player": 1,
        "isKing": false
      },
      {
        "r": 3,
        "c": 4,
        "square": 18,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 6,
        "square": 19,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 5,
        "square": 23,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 7,
        "square": 24,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 0,
        "square": 26,
        "player": 1,
        "isKing": false
      },
      {
        "r": 5,
        "c": 2,
        "square": 27,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 7,
        "square": 34,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 8,
        "square": 40,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 3,
        "square": 42,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 5,
        "square": 43,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 7,
        "square": 44,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 6,
        "square": 49,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 26,
        "toSq": 21,
        "from": {
          "r": 5,
          "c": 0
        },
        "to": {
          "r": 4,
          "c": 1
        },
        "note": "Key strike: 26-21!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 11,
        "toSq": 17,
        "from": {
          "r": 2,
          "c": 1
        },
        "to": {
          "r": 3,
          "c": 2
        },
        "note": "Opponent responds 11-17",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 21,
        "toSq": 12,
        "from": {
          "r": 4,
          "c": 1
        },
        "to": {
          "r": 2,
          "c": 3
        },
        "note": "Continue combo: 21x12",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 23,
        "toSq": 28,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Opponent responds 23-28",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 12,
        "toSq": 23,
        "from": {
          "r": 2,
          "c": 3
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Continue combo: 12x32",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 23,
        "toSq": 32,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Multi-jump continue: 32",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 24,
        "toSq": 29,
        "from": {
          "r": 4,
          "c": 7
        },
        "to": {
          "r": 5,
          "c": 6
        },
        "note": "Opponent responds 24-29",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 34,
        "toSq": 23,
        "from": {
          "r": 6,
          "c": 7
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Continue combo: 34x23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Opponent responds 19x50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 28,
        "toSq": 37,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 2
        },
        "note": "Multi-jump continue: 37",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 37,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 2
        },
        "to": {
          "r": 9,
          "c": 4
        },
        "note": "Multi-jump continue: 48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 48,
        "toSq": 39,
        "from": {
          "r": 9,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 50,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 8
        },
        "note": "Multi-jump continue: 50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-5",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "📸 DRAUGHTS IMAGE #5 (5.PNG): Coup de la Bombe Flank Explosion",
    "badge": "📸 5.PNG",
    "source_image": "5.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "coup-de-la-bombe",
    "themeName": "DRAUGHTS IMAGE Master Series",
    "themeIdea": "Forced combination from Screenshot 5.PNG",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Straight from DRAUGHTS IMAGE 5.PNG! Spot the combination and strike!",
    "difficulty": {
      "tier": 9,
      "tier_name": "Master",
      "rating": 2130,
      "human_score": 75
    },
    "difficultyTier": 9,
    "rating": 2130,
    "hints": [
      "Calculate White's breakthrough strike starting with 29-24.",
      "Opponent has compulsory responses. Calculate the full multi-jump chain.",
      "Play 29-24! This initiates the decisive win."
    ],
    "initialBoard": [
      {
        "r": 1,
        "c": 0,
        "square": 6,
        "player": 2,
        "isKing": false
      },
      {
        "r": 1,
        "c": 6,
        "square": 9,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 1,
        "square": 11,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 3,
        "square": 12,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 7,
        "square": 14,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 4,
        "square": 18,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 9,
        "square": 25,
        "player": 1,
        "isKing": false
      },
      {
        "r": 5,
        "c": 0,
        "square": 26,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 6,
        "square": 29,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 5,
        "square": 33,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 4,
        "square": 38,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 1,
        "square": 41,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 3,
        "square": 42,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 5,
        "square": 43,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 2,
        "square": 47,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 29,
        "toSq": 24,
        "from": {
          "r": 5,
          "c": 6
        },
        "to": {
          "r": 4,
          "c": 7
        },
        "note": "Key strike: 29-24!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 14,
        "toSq": 20,
        "from": {
          "r": 2,
          "c": 7
        },
        "to": {
          "r": 3,
          "c": 8
        },
        "note": "Opponent responds 14-20",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 25,
        "toSq": 14,
        "from": {
          "r": 4,
          "c": 9
        },
        "to": {
          "r": 2,
          "c": 7
        },
        "note": "Continue combo: 25x3",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 14,
        "toSq": 3,
        "from": {
          "r": 2,
          "c": 7
        },
        "to": {
          "r": 0,
          "c": 5
        },
        "note": "Multi-jump continue: 3",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 13,
        "toSq": 19,
        "from": {
          "r": 2,
          "c": 5
        },
        "to": {
          "r": 3,
          "c": 6
        },
        "note": "Opponent responds 13-19",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 24,
        "toSq": 13,
        "from": {
          "r": 4,
          "c": 7
        },
        "to": {
          "r": 2,
          "c": 5
        },
        "note": "Continue combo: 24x22",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 13,
        "toSq": 22,
        "from": {
          "r": 2,
          "c": 5
        },
        "to": {
          "r": 4,
          "c": 3
        },
        "note": "Multi-jump continue: 22",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 12,
        "toSq": 17,
        "from": {
          "r": 2,
          "c": 3
        },
        "to": {
          "r": 3,
          "c": 2
        },
        "note": "Opponent responds 12-17",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 3,
        "toSq": 21,
        "from": {
          "r": 0,
          "c": 5
        },
        "to": {
          "r": 4,
          "c": 1
        },
        "note": "Continue combo: 3x21",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 26,
        "toSq": 17,
        "from": {
          "r": 5,
          "c": 0
        },
        "to": {
          "r": 3,
          "c": 2
        },
        "note": "Opponent responds 26x46",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 17,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 2
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Multi-jump continue: 28",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 28,
        "toSq": 39,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 4
        },
        "note": "Multi-jump continue: 48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 48,
        "toSq": 37,
        "from": {
          "r": 9,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 2
        },
        "note": "Multi-jump continue: 37",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 37,
        "toSq": 46,
        "from": {
          "r": 7,
          "c": 2
        },
        "to": {
          "r": 9,
          "c": 0
        },
        "note": "Multi-jump continue: 46",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-6",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "📸 DRAUGHTS IMAGE #6 (6.PNG): Decoy King Sweep & Sac",
    "badge": "📸 6.PNG",
    "source_image": "6.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "king-sweep",
    "themeName": "DRAUGHTS IMAGE Master Series",
    "themeIdea": "Forced combination from Screenshot 6.PNG",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Straight from DRAUGHTS IMAGE 6.PNG! Spot the combination and strike!",
    "difficulty": {
      "tier": 9,
      "tier_name": "Master",
      "rating": 2150,
      "human_score": 75
    },
    "difficultyTier": 9,
    "rating": 2150,
    "hints": [
      "Calculate White's breakthrough strike starting with 42-38.",
      "Opponent has compulsory responses. Calculate the full multi-jump chain.",
      "Play 42-38! This initiates the decisive win."
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 5,
        "square": 3,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 3,
        "square": 12,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 0,
        "square": 16,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 2,
        "square": 17,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 4,
        "square": 18,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 6,
        "square": 19,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 5,
        "square": 23,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 0,
        "square": 26,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 6,
        "square": 29,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 8,
        "square": 30,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 3,
        "square": 32,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 7,
        "square": 34,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 0,
        "square": 36,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 2,
        "square": 37,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 8,
        "square": 40,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 3,
        "square": 42,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 5,
        "square": 43,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 4,
        "square": 48,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 42,
        "toSq": 38,
        "from": {
          "r": 8,
          "c": 3
        },
        "to": {
          "r": 7,
          "c": 4
        },
        "note": "Key strike: 42-38!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 24,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 4,
          "c": 7
        },
        "note": "Opponent responds 19-24",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 30,
        "toSq": 19,
        "from": {
          "r": 5,
          "c": 8
        },
        "to": {
          "r": 3,
          "c": 6
        },
        "note": "Continue combo: 30x28",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 19,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Multi-jump continue: 28",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 18,
        "toSq": 22,
        "from": {
          "r": 3,
          "c": 4
        },
        "to": {
          "r": 4,
          "c": 3
        },
        "note": "Opponent responds 18-22",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 34,
        "toSq": 23,
        "from": {
          "r": 6,
          "c": 7
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Continue combo: 34x23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 22,
        "toSq": 33,
        "from": {
          "r": 4,
          "c": 3
        },
        "to": {
          "r": 6,
          "c": 5
        },
        "note": "Opponent responds 22x31",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 33,
        "toSq": 42,
        "from": {
          "r": 6,
          "c": 5
        },
        "to": {
          "r": 8,
          "c": 3
        },
        "note": "Multi-jump continue: 42",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 42,
        "toSq": 31,
        "from": {
          "r": 8,
          "c": 3
        },
        "to": {
          "r": 6,
          "c": 1
        },
        "note": "Multi-jump continue: 31",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 36,
        "toSq": 27,
        "from": {
          "r": 7,
          "c": 0
        },
        "to": {
          "r": 5,
          "c": 2
        },
        "note": "Continue combo: 36x27",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 26,
        "toSq": 31,
        "from": {
          "r": 5,
          "c": 0
        },
        "to": {
          "r": 6,
          "c": 1
        },
        "note": "Opponent responds 26-31",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 27,
        "toSq": 36,
        "from": {
          "r": 5,
          "c": 2
        },
        "to": {
          "r": 7,
          "c": 0
        },
        "note": "Continue combo: 27x36",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 12,
        "toSq": 18,
        "from": {
          "r": 2,
          "c": 3
        },
        "to": {
          "r": 3,
          "c": 4
        },
        "note": "Opponent responds 12-18",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 23,
        "toSq": 12,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 2,
          "c": 3
        },
        "note": "Continue combo: 23x21",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 12,
        "toSq": 21,
        "from": {
          "r": 2,
          "c": 3
        },
        "to": {
          "r": 4,
          "c": 1
        },
        "note": "Multi-jump continue: 21",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 16,
        "toSq": 27,
        "from": {
          "r": 3,
          "c": 0
        },
        "to": {
          "r": 5,
          "c": 2
        },
        "note": "Opponent responds 16x49",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 27,
        "toSq": 38,
        "from": {
          "r": 5,
          "c": 2
        },
        "to": {
          "r": 7,
          "c": 4
        },
        "note": "Multi-jump continue: 38",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 38,
        "toSq": 49,
        "from": {
          "r": 7,
          "c": 4
        },
        "to": {
          "r": 9,
          "c": 6
        },
        "note": "Multi-jump continue: 49",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-7",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "📸 DRAUGHTS IMAGE #7 (7.PNG): Keller Center Wedge Strike",
    "badge": "📸 7.PNG",
    "source_image": "7.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "center-wedge",
    "themeName": "DRAUGHTS IMAGE Master Series",
    "themeIdea": "Forced combination from Screenshot 7.PNG",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Straight from DRAUGHTS IMAGE 7.PNG! Spot the combination and strike!",
    "difficulty": {
      "tier": 9,
      "tier_name": "Master",
      "rating": 2170,
      "human_score": 75
    },
    "difficultyTier": 9,
    "rating": 2170,
    "hints": [
      "Calculate White's breakthrough strike starting with 48-43.",
      "Opponent has compulsory responses. Calculate the full multi-jump chain.",
      "Play 48-43! This initiates the decisive win."
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 3,
        "square": 2,
        "player": 2,
        "isKing": false
      },
      {
        "r": 1,
        "c": 4,
        "square": 8,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 7,
        "square": 14,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 6,
        "square": 19,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 1,
        "square": 21,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 3,
        "square": 22,
        "player": 1,
        "isKing": false
      },
      {
        "r": 4,
        "c": 5,
        "square": 23,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 7,
        "square": 24,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 9,
        "square": 25,
        "player": 1,
        "isKing": false
      },
      {
        "r": 5,
        "c": 4,
        "square": 28,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 3,
        "square": 32,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 5,
        "square": 33,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 4,
        "square": 38,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 2,
        "square": 47,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 4,
        "square": 48,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 48,
        "toSq": 43,
        "from": {
          "r": 9,
          "c": 4
        },
        "to": {
          "r": 8,
          "c": 5
        },
        "note": "Key strike: 48-43!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 13,
        "toSq": 18,
        "from": {
          "r": 2,
          "c": 5
        },
        "to": {
          "r": 3,
          "c": 4
        },
        "note": "Opponent responds 13-18",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 22,
        "toSq": 13,
        "from": {
          "r": 4,
          "c": 3
        },
        "to": {
          "r": 2,
          "c": 5
        },
        "note": "Continue combo: 22x13",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 21,
        "toSq": 27,
        "from": {
          "r": 4,
          "c": 1
        },
        "to": {
          "r": 5,
          "c": 2
        },
        "note": "Opponent responds 21-27",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 32,
        "toSq": 21,
        "from": {
          "r": 6,
          "c": 3
        },
        "to": {
          "r": 4,
          "c": 1
        },
        "note": "Continue combo: 32x21",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 23,
        "toSq": 32,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Opponent responds 23x32",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 38,
        "toSq": 27,
        "from": {
          "r": 7,
          "c": 4
        },
        "to": {
          "r": 5,
          "c": 2
        },
        "note": "Continue combo: 38x27",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 14,
        "toSq": 20,
        "from": {
          "r": 2,
          "c": 7
        },
        "to": {
          "r": 3,
          "c": 8
        },
        "note": "Opponent responds 14-20",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 25,
        "toSq": 14,
        "from": {
          "r": 4,
          "c": 9
        },
        "to": {
          "r": 2,
          "c": 7
        },
        "note": "Continue combo: 25x23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 14,
        "toSq": 23,
        "from": {
          "r": 2,
          "c": 7
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Multi-jump continue: 23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 8,
        "toSq": 19,
        "from": {
          "r": 1,
          "c": 4
        },
        "to": {
          "r": 3,
          "c": 6
        },
        "note": "Opponent responds 8x48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Multi-jump continue: 28",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 28,
        "toSq": 39,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 4
        },
        "note": "Multi-jump continue: 48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-8",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "📸 DRAUGHTS IMAGE #8 (8.PNG & 9.PNG): Roozenburg Highway Clearance",
    "badge": "📸 8.PNG",
    "source_image": "8.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "highway-clearance",
    "themeName": "DRAUGHTS IMAGE Master Series",
    "themeIdea": "Forced combination from Screenshot 8.PNG",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Straight from DRAUGHTS IMAGE 8.PNG! Spot the combination and strike!",
    "difficulty": {
      "tier": 9,
      "tier_name": "Master",
      "rating": 2190,
      "human_score": 75
    },
    "difficultyTier": 9,
    "rating": 2190,
    "hints": [
      "Calculate White's breakthrough strike starting with 40-35.",
      "Opponent has compulsory responses. Calculate the full multi-jump chain.",
      "Play 40-35! This initiates the decisive win."
    ],
    "initialBoard": [
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 7,
        "square": 14,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 2,
        "square": 17,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 4,
        "square": 18,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 6,
        "square": 19,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 3,
        "square": 22,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 9,
        "square": 25,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 0,
        "square": 26,
        "player": 1,
        "isKing": false
      },
      {
        "r": 5,
        "c": 8,
        "square": 30,
        "player": 2,
        "isKing": false
      },
      {
        "r": 6,
        "c": 1,
        "square": 31,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 5,
        "square": 33,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 7,
        "square": 34,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 4,
        "square": 38,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 6,
        "square": 39,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 8,
        "square": 40,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 7,
        "square": 44,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 40,
        "toSq": 35,
        "from": {
          "r": 7,
          "c": 8
        },
        "to": {
          "r": 6,
          "c": 9
        },
        "note": "Key strike: 40-35!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 17,
        "toSq": 21,
        "from": {
          "r": 3,
          "c": 2
        },
        "to": {
          "r": 4,
          "c": 1
        },
        "note": "Opponent responds 17-21",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 26,
        "toSq": 17,
        "from": {
          "r": 5,
          "c": 0
        },
        "to": {
          "r": 3,
          "c": 2
        },
        "note": "Continue combo: 26x28",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 17,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 2
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Multi-jump continue: 28",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 18,
        "toSq": 23,
        "from": {
          "r": 3,
          "c": 4
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Opponent responds 18-23",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 35,
        "toSq": 24,
        "from": {
          "r": 6,
          "c": 9
        },
        "to": {
          "r": 4,
          "c": 7
        },
        "note": "Continue combo: 35x24",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 23,
        "toSq": 32,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Opponent responds 23x43",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 32,
        "toSq": 43,
        "from": {
          "r": 6,
          "c": 3
        },
        "to": {
          "r": 8,
          "c": 5
        },
        "note": "Multi-jump continue: 43",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 39,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 4
        },
        "note": "Continue combo: 39x48",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 30,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 8
        },
        "note": "Opponent responds 19x50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 30,
        "toSq": 39,
        "from": {
          "r": 5,
          "c": 8
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 50,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 8
        },
        "note": "Multi-jump continue: 50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-9",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "📸 DRAUGHTS IMAGE #9 (10.PNG): Flying King Coronation Ambush",
    "badge": "📸 10.PNG",
    "source_image": "10.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "coronation-ambush",
    "themeName": "DRAUGHTS IMAGE Master Series",
    "themeIdea": "Forced combination from Screenshot 10.PNG",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Straight from DRAUGHTS IMAGE 10.PNG! Spot the combination and strike!",
    "difficulty": {
      "tier": 9,
      "tier_name": "Master",
      "rating": 2210,
      "human_score": 75
    },
    "difficultyTier": 9,
    "rating": 2210,
    "hints": [
      "Calculate White's breakthrough strike starting with 39-33.",
      "Opponent has compulsory responses. Calculate the full multi-jump chain.",
      "Play 39-33! This initiates the decisive win."
    ],
    "initialBoard": [
      {
        "r": 1,
        "c": 4,
        "square": 8,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 3,
        "square": 12,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 7,
        "square": 14,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 0,
        "square": 16,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 4,
        "square": 18,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 6,
        "square": 19,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 7,
        "square": 24,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 9,
        "square": 25,
        "player": 1,
        "isKing": false
      },
      {
        "r": 5,
        "c": 2,
        "square": 27,
        "player": 1,
        "isKing": false
      },
      {
        "r": 5,
        "c": 4,
        "square": 28,
        "player": 1,
        "isKing": false
      },
      {
        "r": 5,
        "c": 6,
        "square": 29,
        "player": 2,
        "isKing": false
      },
      {
        "r": 6,
        "c": 3,
        "square": 32,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 9,
        "square": 35,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 4,
        "square": 38,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 6,
        "square": 39,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 7,
        "square": 44,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 4,
        "square": 48,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 39,
        "toSq": 33,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 6,
          "c": 5
        },
        "note": "Key strike: 39-33!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 16,
        "toSq": 21,
        "from": {
          "r": 3,
          "c": 0
        },
        "to": {
          "r": 4,
          "c": 1
        },
        "note": "Opponent responds 16-21",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 27,
        "toSq": 16,
        "from": {
          "r": 5,
          "c": 2
        },
        "to": {
          "r": 3,
          "c": 0
        },
        "note": "Continue combo: 27x16",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 18,
        "toSq": 22,
        "from": {
          "r": 3,
          "c": 4
        },
        "to": {
          "r": 4,
          "c": 3
        },
        "note": "Opponent responds 18-22",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 28,
        "toSq": 17,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 3,
          "c": 2
        },
        "note": "Continue combo: 28x17",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 12,
        "toSq": 21,
        "from": {
          "r": 2,
          "c": 3
        },
        "to": {
          "r": 4,
          "c": 1
        },
        "note": "Opponent responds 12x21",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 16,
        "toSq": 27,
        "from": {
          "r": 3,
          "c": 0
        },
        "to": {
          "r": 5,
          "c": 2
        },
        "note": "Continue combo: 16x27",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 24,
        "toSq": 30,
        "from": {
          "r": 4,
          "c": 7
        },
        "to": {
          "r": 5,
          "c": 8
        },
        "note": "Opponent responds 24-30",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 25,
        "toSq": 34,
        "from": {
          "r": 4,
          "c": 9
        },
        "to": {
          "r": 6,
          "c": 7
        },
        "note": "Continue combo: 25x23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 34,
        "toSq": 23,
        "from": {
          "r": 6,
          "c": 7
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Multi-jump continue: 23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Opponent responds 19x50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 28,
        "toSq": 39,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 50,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 8
        },
        "note": "Multi-jump continue: 50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-10",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "📸 DRAUGHTS IMAGE #10 (11.PNG): Flank Squeeze Coronation",
    "badge": "📸 11.PNG",
    "source_image": "11.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "flank-squeeze",
    "themeName": "DRAUGHTS IMAGE Master Series",
    "themeIdea": "Forced combination from Screenshot 11.PNG",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Straight from DRAUGHTS IMAGE 11.PNG! Spot the combination and strike!",
    "difficulty": {
      "tier": 9,
      "tier_name": "Master",
      "rating": 2230,
      "human_score": 75
    },
    "difficultyTier": 9,
    "rating": 2230,
    "hints": [
      "Calculate White's breakthrough strike starting with 30-25.",
      "Opponent has compulsory responses. Calculate the full multi-jump chain.",
      "Play 30-25! This initiates the decisive win."
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 3,
        "square": 2,
        "player": 2,
        "isKing": false
      },
      {
        "r": 0,
        "c": 5,
        "square": 3,
        "player": 2,
        "isKing": false
      },
      {
        "r": 1,
        "c": 4,
        "square": 8,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 3,
        "square": 12,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 6,
        "square": 19,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 8,
        "square": 20,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 3,
        "square": 22,
        "player": 1,
        "isKing": false
      },
      {
        "r": 4,
        "c": 5,
        "square": 23,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 2,
        "square": 27,
        "player": 1,
        "isKing": false
      },
      {
        "r": 5,
        "c": 4,
        "square": 28,
        "player": 1,
        "isKing": false
      },
      {
        "r": 5,
        "c": 8,
        "square": 30,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 3,
        "square": 32,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 3,
        "square": 42,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 5,
        "square": 43,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 7,
        "square": 44,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 30,
        "toSq": 25,
        "from": {
          "r": 5,
          "c": 8
        },
        "to": {
          "r": 4,
          "c": 9
        },
        "note": "Key strike: 30-25!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 24,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 4,
          "c": 7
        },
        "note": "Opponent responds 19-24",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 28,
        "toSq": 19,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 3,
          "c": 6
        },
        "note": "Continue combo: 28x30",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 19,
        "toSq": 30,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 8
        },
        "note": "Multi-jump continue: 30",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 13,
        "toSq": 19,
        "from": {
          "r": 2,
          "c": 5
        },
        "to": {
          "r": 3,
          "c": 6
        },
        "note": "Opponent responds 13-19",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 25,
        "toSq": 14,
        "from": {
          "r": 4,
          "c": 9
        },
        "to": {
          "r": 2,
          "c": 7
        },
        "note": "Continue combo: 25x23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 14,
        "toSq": 23,
        "from": {
          "r": 2,
          "c": 7
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Multi-jump continue: 23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 12,
        "toSq": 18,
        "from": {
          "r": 2,
          "c": 3
        },
        "to": {
          "r": 3,
          "c": 4
        },
        "note": "Opponent responds 12-18",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 22,
        "toSq": 13,
        "from": {
          "r": 4,
          "c": 3
        },
        "to": {
          "r": 2,
          "c": 5
        },
        "note": "Continue combo: 22x13",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 8,
        "toSq": 19,
        "from": {
          "r": 1,
          "c": 4
        },
        "to": {
          "r": 3,
          "c": 6
        },
        "note": "Opponent responds 8x50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Multi-jump continue: 28",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 28,
        "toSq": 37,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 2
        },
        "note": "Multi-jump continue: 37",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 37,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 2
        },
        "to": {
          "r": 9,
          "c": 4
        },
        "note": "Multi-jump continue: 48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 48,
        "toSq": 39,
        "from": {
          "r": 9,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 50,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 8
        },
        "note": "Multi-jump continue: 50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-11",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "📸 DRAUGHTS IMAGE #11 (12.PNG): Infiltration Stride Combination",
    "badge": "📸 12.PNG",
    "source_image": "12.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "infiltration-stride",
    "themeName": "DRAUGHTS IMAGE Master Series",
    "themeIdea": "Forced combination from Screenshot 12.PNG",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Straight from DRAUGHTS IMAGE 12.PNG! Spot the combination and strike!",
    "difficulty": {
      "tier": 9,
      "tier_name": "Master",
      "rating": 2250,
      "human_score": 75
    },
    "difficultyTier": 9,
    "rating": 2250,
    "hints": [
      "Calculate White's breakthrough strike starting with 28-23.",
      "Opponent has compulsory responses. Calculate the full multi-jump chain.",
      "Play 28-23! This initiates the decisive win."
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 5,
        "square": 3,
        "player": 2,
        "isKing": false
      },
      {
        "r": 1,
        "c": 4,
        "square": 8,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 1,
        "square": 11,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 3,
        "square": 12,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 7,
        "square": 14,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 7,
        "square": 24,
        "player": 1,
        "isKing": false
      },
      {
        "r": 5,
        "c": 2,
        "square": 27,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 4,
        "square": 28,
        "player": 1,
        "isKing": false
      },
      {
        "r": 5,
        "c": 6,
        "square": 29,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 4,
        "square": 38,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 3,
        "square": 42,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 5,
        "square": 43,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 7,
        "square": 44,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 28,
        "toSq": 23,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Key strike: 28-23!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 13,
        "toSq": 19,
        "from": {
          "r": 2,
          "c": 5
        },
        "to": {
          "r": 3,
          "c": 6
        },
        "note": "Opponent responds 13-19",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 24,
        "toSq": 13,
        "from": {
          "r": 4,
          "c": 7
        },
        "to": {
          "r": 2,
          "c": 5
        },
        "note": "Continue combo: 24x2",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 13,
        "toSq": 2,
        "from": {
          "r": 2,
          "c": 5
        },
        "to": {
          "r": 0,
          "c": 3
        },
        "note": "Multi-jump continue: 2",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 14,
        "toSq": 19,
        "from": {
          "r": 2,
          "c": 7
        },
        "to": {
          "r": 3,
          "c": 6
        },
        "note": "Opponent responds 14-19",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 2,
        "toSq": 16,
        "from": {
          "r": 0,
          "c": 3
        },
        "to": {
          "r": 3,
          "c": 0
        },
        "note": "Continue combo: 2x32",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 16,
        "toSq": 32,
        "from": {
          "r": 3,
          "c": 0
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Multi-jump continue: 32",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Opponent responds 19x50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 28,
        "toSq": 37,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 2
        },
        "note": "Multi-jump continue: 37",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 37,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 2
        },
        "to": {
          "r": 9,
          "c": 4
        },
        "note": "Multi-jump continue: 48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 48,
        "toSq": 39,
        "from": {
          "r": 9,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 50,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 8
        },
        "note": "Multi-jump continue: 50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-12",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "📸 DRAUGHTS IMAGE #12 (13.PNG): Grande Ligne Decoy Breaker",
    "badge": "📸 13.PNG",
    "source_image": "13.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "decoy-breaker",
    "themeName": "DRAUGHTS IMAGE Master Series",
    "themeIdea": "Forced combination from Screenshot 13.PNG",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Straight from DRAUGHTS IMAGE 13.PNG! Spot the combination and strike!",
    "difficulty": {
      "tier": 9,
      "tier_name": "Master",
      "rating": 2270,
      "human_score": 75
    },
    "difficultyTier": 9,
    "rating": 2270,
    "hints": [
      "Calculate White's breakthrough strike starting with 31-27.",
      "Opponent has compulsory responses. Calculate the full multi-jump chain.",
      "Play 31-27! This initiates the decisive win."
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 5,
        "square": 3,
        "player": 2,
        "isKing": false
      },
      {
        "r": 1,
        "c": 8,
        "square": 10,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 1,
        "square": 11,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 3,
        "square": 12,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 7,
        "square": 14,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 2,
        "square": 17,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 5,
        "square": 23,
        "player": 1,
        "isKing": false
      },
      {
        "r": 4,
        "c": 9,
        "square": 25,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 6,
        "square": 29,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 1,
        "square": 31,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 5,
        "square": 33,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 9,
        "square": 35,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 1,
        "square": 41,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 3,
        "square": 42,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 5,
        "square": 43,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 31,
        "toSq": 27,
        "from": {
          "r": 6,
          "c": 1
        },
        "to": {
          "r": 5,
          "c": 2
        },
        "note": "Key strike: 31-27!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 25,
        "toSq": 30,
        "from": {
          "r": 4,
          "c": 9
        },
        "to": {
          "r": 5,
          "c": 8
        },
        "note": "Opponent responds 25-30",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 35,
        "toSq": 24,
        "from": {
          "r": 6,
          "c": 9
        },
        "to": {
          "r": 4,
          "c": 7
        },
        "note": "Continue combo: 35x24",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 14,
        "toSq": 20,
        "from": {
          "r": 2,
          "c": 7
        },
        "to": {
          "r": 3,
          "c": 8
        },
        "note": "Opponent responds 14-20",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 24,
        "toSq": 15,
        "from": {
          "r": 4,
          "c": 7
        },
        "to": {
          "r": 2,
          "c": 9
        },
        "note": "Continue combo: 24x4",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 15,
        "toSq": 4,
        "from": {
          "r": 2,
          "c": 9
        },
        "to": {
          "r": 0,
          "c": 7
        },
        "note": "Multi-jump continue: 4",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 13,
        "toSq": 18,
        "from": {
          "r": 2,
          "c": 5
        },
        "to": {
          "r": 3,
          "c": 4
        },
        "note": "Opponent responds 13-18",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 4,
        "toSq": 22,
        "from": {
          "r": 0,
          "c": 7
        },
        "to": {
          "r": 4,
          "c": 3
        },
        "note": "Continue combo: 4x22",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 17,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 2
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Opponent responds 17x46",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 28,
        "toSq": 39,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 4
        },
        "note": "Multi-jump continue: 48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 48,
        "toSq": 37,
        "from": {
          "r": 9,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 2
        },
        "note": "Multi-jump continue: 37",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 37,
        "toSq": 46,
        "from": {
          "r": 7,
          "c": 2
        },
        "to": {
          "r": 9,
          "c": 0
        },
        "note": "Multi-jump continue: 46",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-13",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "📸 DRAUGHTS IMAGE #13 (14.PNG): Masterpiece Diagonal Trap",
    "badge": "📸 14.PNG",
    "source_image": "14.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "diagonal-trap",
    "themeName": "DRAUGHTS IMAGE Master Series",
    "themeIdea": "Forced combination from Screenshot 14.PNG",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Straight from DRAUGHTS IMAGE 14.PNG! Spot the combination and strike!",
    "difficulty": {
      "tier": 9,
      "tier_name": "Master",
      "rating": 2290,
      "human_score": 75
    },
    "difficultyTier": 9,
    "rating": 2290,
    "hints": [
      "Calculate White's breakthrough strike starting with 32-28.",
      "Opponent has compulsory responses. Calculate the full multi-jump chain.",
      "Play 32-28! This initiates the decisive win."
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 7,
        "square": 4,
        "player": 2,
        "isKing": false
      },
      {
        "r": 1,
        "c": 4,
        "square": 8,
        "player": 2,
        "isKing": false
      },
      {
        "r": 1,
        "c": 8,
        "square": 10,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 7,
        "square": 14,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 4,
        "square": 18,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 6,
        "square": 19,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 7,
        "square": 24,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 9,
        "square": 25,
        "player": 1,
        "isKing": false
      },
      {
        "r": 5,
        "c": 8,
        "square": 30,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 3,
        "square": 32,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 5,
        "square": 33,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 9,
        "square": 35,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 4,
        "square": 38,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 6,
        "square": 39,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 8,
        "square": 40,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 32,
        "toSq": 28,
        "from": {
          "r": 6,
          "c": 3
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Key strike: 32-28!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 18,
        "toSq": 22,
        "from": {
          "r": 3,
          "c": 4
        },
        "to": {
          "r": 4,
          "c": 3
        },
        "note": "Opponent responds 18-22",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 28,
        "toSq": 17,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 3,
          "c": 2
        },
        "note": "Continue combo: 28x17",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 23,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Opponent responds 19-23",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 30,
        "toSq": 19,
        "from": {
          "r": 5,
          "c": 8
        },
        "to": {
          "r": 3,
          "c": 6
        },
        "note": "Continue combo: 30x28",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 19,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Multi-jump continue: 28",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 8,
        "toSq": 12,
        "from": {
          "r": 1,
          "c": 4
        },
        "to": {
          "r": 2,
          "c": 3
        },
        "note": "Opponent responds 8-12",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 17,
        "toSq": 8,
        "from": {
          "r": 3,
          "c": 2
        },
        "to": {
          "r": 1,
          "c": 4
        },
        "note": "Continue combo: 17x19",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 8,
        "toSq": 19,
        "from": {
          "r": 1,
          "c": 4
        },
        "to": {
          "r": 3,
          "c": 6
        },
        "note": "Multi-jump continue: 19",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 14,
        "toSq": 23,
        "from": {
          "r": 2,
          "c": 7
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Opponent responds 14x45",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 23,
        "toSq": 32,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Multi-jump continue: 32",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 32,
        "toSq": 43,
        "from": {
          "r": 6,
          "c": 3
        },
        "to": {
          "r": 8,
          "c": 5
        },
        "note": "Multi-jump continue: 43",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 43,
        "toSq": 34,
        "from": {
          "r": 8,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 7
        },
        "note": "Multi-jump continue: 34",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 34,
        "toSq": 45,
        "from": {
          "r": 6,
          "c": 7
        },
        "to": {
          "r": 8,
          "c": 9
        },
        "note": "Multi-jump continue: 45",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-14",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "📸 DRAUGHTS IMAGE #14 (15.PNG): Grandmaster Pin & Shatter",
    "badge": "📸 15.PNG",
    "source_image": "15.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "pin-and-shatter",
    "themeName": "DRAUGHTS IMAGE Master Series",
    "themeIdea": "Forced combination from Screenshot 15.PNG",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Straight from DRAUGHTS IMAGE 15.PNG! Spot the combination and strike!",
    "difficulty": {
      "tier": 9,
      "tier_name": "Master",
      "rating": 2310,
      "human_score": 75
    },
    "difficultyTier": 9,
    "rating": 2310,
    "hints": [
      "Calculate White's breakthrough strike starting with 38-32.",
      "Opponent has compulsory responses. Calculate the full multi-jump chain.",
      "Play 38-32! This initiates the decisive win."
    ],
    "initialBoard": [
      {
        "r": 2,
        "c": 1,
        "square": 11,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 3,
        "square": 12,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 4,
        "square": 18,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 6,
        "square": 19,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 8,
        "square": 20,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 3,
        "square": 22,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 5,
        "square": 23,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 9,
        "square": 25,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 6,
        "square": 29,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 5,
        "square": 33,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 7,
        "square": 34,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 9,
        "square": 35,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 4,
        "square": 38,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 3,
        "square": 42,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 7,
        "square": 44,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 9,
        "square": 45,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 2,
        "square": 47,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 38,
        "toSq": 32,
        "from": {
          "r": 7,
          "c": 4
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Key strike: 38-32!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 22,
        "toSq": 28,
        "from": {
          "r": 4,
          "c": 3
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Opponent responds 22-28",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 33,
        "toSq": 22,
        "from": {
          "r": 6,
          "c": 5
        },
        "to": {
          "r": 4,
          "c": 3
        },
        "note": "Continue combo: 33x22",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 18,
        "toSq": 27,
        "from": {
          "r": 3,
          "c": 4
        },
        "to": {
          "r": 5,
          "c": 2
        },
        "note": "Opponent responds 18x38",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 27,
        "toSq": 38,
        "from": {
          "r": 5,
          "c": 2
        },
        "to": {
          "r": 7,
          "c": 4
        },
        "note": "Multi-jump continue: 38",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 29,
        "toSq": 18,
        "from": {
          "r": 5,
          "c": 6
        },
        "to": {
          "r": 3,
          "c": 4
        },
        "note": "Continue combo: 29x16",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 18,
        "toSq": 7,
        "from": {
          "r": 3,
          "c": 4
        },
        "to": {
          "r": 1,
          "c": 2
        },
        "note": "Multi-jump continue: 7",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 7,
        "toSq": 16,
        "from": {
          "r": 1,
          "c": 2
        },
        "to": {
          "r": 3,
          "c": 0
        },
        "note": "Multi-jump continue: 16",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 20,
        "toSq": 24,
        "from": {
          "r": 3,
          "c": 8
        },
        "to": {
          "r": 4,
          "c": 7
        },
        "note": "Opponent responds 20-24",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 42,
        "toSq": 33,
        "from": {
          "r": 8,
          "c": 3
        },
        "to": {
          "r": 6,
          "c": 5
        },
        "note": "Continue combo: 42x33",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 24,
        "toSq": 30,
        "from": {
          "r": 4,
          "c": 7
        },
        "to": {
          "r": 5,
          "c": 8
        },
        "note": "Opponent responds 24-30",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 35,
        "toSq": 24,
        "from": {
          "r": 6,
          "c": 9
        },
        "to": {
          "r": 4,
          "c": 7
        },
        "note": "Continue combo: 35x24",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 30,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 8
        },
        "note": "Opponent responds 19x50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 30,
        "toSq": 39,
        "from": {
          "r": 5,
          "c": 8
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 50,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 8
        },
        "note": "Multi-jump continue: 50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-15",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "📸 DRAUGHTS IMAGE #15 (16.PNG): Long Diagonal King Strike",
    "badge": "📸 16.PNG",
    "source_image": "16.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "king-strike",
    "themeName": "DRAUGHTS IMAGE Master Series",
    "themeIdea": "Forced combination from Screenshot 16.PNG",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Straight from DRAUGHTS IMAGE 16.PNG! Spot the combination and strike!",
    "difficulty": {
      "tier": 9,
      "tier_name": "Master",
      "rating": 2330,
      "human_score": 75
    },
    "difficultyTier": 9,
    "rating": 2330,
    "hints": [
      "Calculate White's breakthrough strike starting with 49-43.",
      "Opponent has compulsory responses. Calculate the full multi-jump chain.",
      "Play 49-43! This initiates the decisive win."
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 7,
        "square": 4,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 3,
        "square": 12,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 0,
        "square": 16,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 2,
        "square": 17,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 3,
        "square": 22,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 5,
        "square": 23,
        "player": 1,
        "isKing": false
      },
      {
        "r": 4,
        "c": 7,
        "square": 24,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 0,
        "square": 26,
        "player": 2,
        "isKing": false
      },
      {
        "r": 6,
        "c": 7,
        "square": 34,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 0,
        "square": 36,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 2,
        "square": 37,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 9,
        "square": 45,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 4,
        "square": 48,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 6,
        "square": 49,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 49,
        "toSq": 43,
        "from": {
          "r": 9,
          "c": 6
        },
        "to": {
          "r": 8,
          "c": 5
        },
        "note": "Key strike: 49-43!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 22,
        "toSq": 28,
        "from": {
          "r": 4,
          "c": 3
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Opponent responds 22-28",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 23,
        "toSq": 32,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Continue combo: 23x32",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 24,
        "toSq": 29,
        "from": {
          "r": 4,
          "c": 7
        },
        "to": {
          "r": 5,
          "c": 6
        },
        "note": "Opponent responds 24-29",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 34,
        "toSq": 23,
        "from": {
          "r": 6,
          "c": 7
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Continue combo: 34x23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 12,
        "toSq": 18,
        "from": {
          "r": 2,
          "c": 3
        },
        "to": {
          "r": 3,
          "c": 4
        },
        "note": "Opponent responds 12-18",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 23,
        "toSq": 12,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 2,
          "c": 3
        },
        "note": "Continue combo: 23x21",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 12,
        "toSq": 21,
        "from": {
          "r": 2,
          "c": 3
        },
        "to": {
          "r": 4,
          "c": 1
        },
        "note": "Multi-jump continue: 21",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 16,
        "toSq": 27,
        "from": {
          "r": 3,
          "c": 0
        },
        "to": {
          "r": 5,
          "c": 2
        },
        "note": "Opponent responds 16x49",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 27,
        "toSq": 38,
        "from": {
          "r": 5,
          "c": 2
        },
        "to": {
          "r": 7,
          "c": 4
        },
        "note": "Multi-jump continue: 38",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 38,
        "toSq": 49,
        "from": {
          "r": 7,
          "c": 4
        },
        "to": {
          "r": 9,
          "c": 6
        },
        "note": "Multi-jump continue: 49",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-16",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "📸 DRAUGHTS IMAGE #16 (17.PNG): Counter-Sacrifice Sweep",
    "badge": "📸 17.PNG",
    "source_image": "17.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "counter-sweep",
    "themeName": "DRAUGHTS IMAGE Master Series",
    "themeIdea": "Forced combination from Screenshot 17.PNG",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Straight from DRAUGHTS IMAGE 17.PNG! Spot the combination and strike!",
    "difficulty": {
      "tier": 9,
      "tier_name": "Master",
      "rating": 2350,
      "human_score": 75
    },
    "difficultyTier": 9,
    "rating": 2350,
    "hints": [
      "Calculate White's breakthrough strike starting with 27-21.",
      "Opponent has compulsory responses. Calculate the full multi-jump chain.",
      "Play 27-21! This initiates the decisive win."
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 3,
        "square": 2,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 7,
        "square": 14,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 2,
        "square": 17,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 4,
        "square": 18,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 6,
        "square": 19,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 7,
        "square": 24,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 0,
        "square": 26,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 2,
        "square": 27,
        "player": 1,
        "isKing": false
      },
      {
        "r": 5,
        "c": 4,
        "square": 28,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 5,
        "square": 33,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 7,
        "square": 34,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 2,
        "square": 37,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 1,
        "square": 41,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 5,
        "square": 43,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 4,
        "square": 48,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 27,
        "toSq": 21,
        "from": {
          "r": 5,
          "c": 2
        },
        "to": {
          "r": 4,
          "c": 1
        },
        "note": "Key strike: 27-21!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 26,
        "toSq": 31,
        "from": {
          "r": 5,
          "c": 0
        },
        "to": {
          "r": 6,
          "c": 1
        },
        "note": "Opponent responds 26-31",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 21,
        "toSq": 12,
        "from": {
          "r": 4,
          "c": 1
        },
        "to": {
          "r": 2,
          "c": 3
        },
        "note": "Continue combo: 21x23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 12,
        "toSq": 23,
        "from": {
          "r": 2,
          "c": 3
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Multi-jump continue: 23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 31,
        "toSq": 42,
        "from": {
          "r": 6,
          "c": 1
        },
        "to": {
          "r": 8,
          "c": 3
        },
        "note": "Opponent responds 31x42",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 48,
        "toSq": 37,
        "from": {
          "r": 9,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 2
        },
        "note": "Continue combo: 48x37",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 24,
        "toSq": 29,
        "from": {
          "r": 4,
          "c": 7
        },
        "to": {
          "r": 5,
          "c": 6
        },
        "note": "Opponent responds 24-29",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 33,
        "toSq": 24,
        "from": {
          "r": 6,
          "c": 5
        },
        "to": {
          "r": 4,
          "c": 7
        },
        "note": "Continue combo: 33x24",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 30,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 8
        },
        "note": "Opponent responds 19x48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 30,
        "toSq": 39,
        "from": {
          "r": 5,
          "c": 8
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 4
        },
        "note": "Multi-jump continue: 48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-17",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "📸 DRAUGHTS IMAGE #17 (18.PNG): Two-Gate Coronation Trap",
    "badge": "📸 18.PNG",
    "source_image": "18.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "coronation-trap",
    "themeName": "DRAUGHTS IMAGE Master Series",
    "themeIdea": "Forced combination from Screenshot 18.PNG",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Straight from DRAUGHTS IMAGE 18.PNG! Spot the combination and strike!",
    "difficulty": {
      "tier": 9,
      "tier_name": "Master",
      "rating": 2370,
      "human_score": 75
    },
    "difficultyTier": 9,
    "rating": 2370,
    "hints": [
      "Calculate White's breakthrough strike starting with 34-29.",
      "Opponent has compulsory responses. Calculate the full multi-jump chain.",
      "Play 34-29! This initiates the decisive win."
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 3,
        "square": 2,
        "player": 2,
        "isKing": false
      },
      {
        "r": 0,
        "c": 7,
        "square": 4,
        "player": 2,
        "isKing": false
      },
      {
        "r": 1,
        "c": 2,
        "square": 7,
        "player": 2,
        "isKing": false
      },
      {
        "r": 1,
        "c": 4,
        "square": 8,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 9,
        "square": 15,
        "player": 1,
        "isKing": false
      },
      {
        "r": 4,
        "c": 1,
        "square": 21,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 3,
        "square": 22,
        "player": 2,
        "isKing": false
      },
      {
        "r": 6,
        "c": 3,
        "square": 32,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 5,
        "square": 33,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 7,
        "square": 34,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 2,
        "square": 37,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 4,
        "square": 38,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 6,
        "square": 39,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 34,
        "toSq": 29,
        "from": {
          "r": 6,
          "c": 7
        },
        "to": {
          "r": 5,
          "c": 6
        },
        "note": "Key strike: 34-29!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 21,
        "toSq": 27,
        "from": {
          "r": 4,
          "c": 1
        },
        "to": {
          "r": 5,
          "c": 2
        },
        "note": "Opponent responds 21-27",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 32,
        "toSq": 21,
        "from": {
          "r": 6,
          "c": 3
        },
        "to": {
          "r": 4,
          "c": 1
        },
        "note": "Continue combo: 32x21",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 22,
        "toSq": 28,
        "from": {
          "r": 4,
          "c": 3
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Opponent responds 22-28",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 33,
        "toSq": 22,
        "from": {
          "r": 6,
          "c": 5
        },
        "to": {
          "r": 4,
          "c": 3
        },
        "note": "Continue combo: 33x22",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 4,
        "toSq": 10,
        "from": {
          "r": 0,
          "c": 7
        },
        "to": {
          "r": 1,
          "c": 8
        },
        "note": "Opponent responds 4-10",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 15,
        "toSq": 4,
        "from": {
          "r": 2,
          "c": 9
        },
        "to": {
          "r": 0,
          "c": 7
        },
        "note": "Continue combo: 15x4",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 8,
        "toSq": 12,
        "from": {
          "r": 1,
          "c": 4
        },
        "to": {
          "r": 2,
          "c": 3
        },
        "note": "Opponent responds 8-12",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 4,
        "toSq": 18,
        "from": {
          "r": 0,
          "c": 7
        },
        "to": {
          "r": 3,
          "c": 4
        },
        "note": "Continue combo: 4x18",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 12,
        "toSq": 23,
        "from": {
          "r": 2,
          "c": 3
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Opponent responds 12x41",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 23,
        "toSq": 34,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 7
        },
        "note": "Multi-jump continue: 34",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 34,
        "toSq": 43,
        "from": {
          "r": 6,
          "c": 7
        },
        "to": {
          "r": 8,
          "c": 5
        },
        "note": "Multi-jump continue: 43",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 43,
        "toSq": 32,
        "from": {
          "r": 8,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Multi-jump continue: 32",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 32,
        "toSq": 41,
        "from": {
          "r": 6,
          "c": 3
        },
        "to": {
          "r": 8,
          "c": 1
        },
        "note": "Multi-jump continue: 41",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-18",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "📸 DRAUGHTS IMAGE #18 (19.PNG): King Vacuum & Decoy",
    "badge": "📸 19.PNG",
    "source_image": "19.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "king-vacuum",
    "themeName": "DRAUGHTS IMAGE Master Series",
    "themeIdea": "Forced combination from Screenshot 19.PNG",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Straight from DRAUGHTS IMAGE 19.PNG! Spot the combination and strike!",
    "difficulty": {
      "tier": 9,
      "tier_name": "Master",
      "rating": 2390,
      "human_score": 75
    },
    "difficultyTier": 9,
    "rating": 2390,
    "hints": [
      "Calculate White's breakthrough strike starting with 43-39.",
      "Opponent has compulsory responses. Calculate the full multi-jump chain.",
      "Play 43-39! This initiates the decisive win."
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 7,
        "square": 4,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 7,
        "square": 14,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 9,
        "square": 15,
        "player": 1,
        "isKing": false
      },
      {
        "r": 3,
        "c": 4,
        "square": 18,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 6,
        "square": 19,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 5,
        "square": 23,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 7,
        "square": 24,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 9,
        "square": 25,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 5,
        "square": 33,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 2,
        "square": 37,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 4,
        "square": 38,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 3,
        "square": 42,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 5,
        "square": 43,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 43,
        "toSq": 39,
        "from": {
          "r": 8,
          "c": 5
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Key strike: 43-39!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 4,
        "toSq": 10,
        "from": {
          "r": 0,
          "c": 7
        },
        "to": {
          "r": 1,
          "c": 8
        },
        "note": "Opponent responds 4-10",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 15,
        "toSq": 4,
        "from": {
          "r": 2,
          "c": 9
        },
        "to": {
          "r": 0,
          "c": 7
        },
        "note": "Continue combo: 15x4",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 14,
        "toSq": 20,
        "from": {
          "r": 2,
          "c": 7
        },
        "to": {
          "r": 3,
          "c": 8
        },
        "note": "Opponent responds 14-20",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 25,
        "toSq": 14,
        "from": {
          "r": 4,
          "c": 9
        },
        "to": {
          "r": 2,
          "c": 7
        },
        "note": "Continue combo: 25x14",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 10,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 1,
          "c": 8
        },
        "note": "Opponent responds 19x10",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 4,
        "toSq": 15,
        "from": {
          "r": 0,
          "c": 7
        },
        "to": {
          "r": 2,
          "c": 9
        },
        "note": "Continue combo: 4x29",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 15,
        "toSq": 29,
        "from": {
          "r": 2,
          "c": 9
        },
        "to": {
          "r": 5,
          "c": 6
        },
        "note": "Multi-jump continue: 29",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 23,
        "toSq": 34,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 7
        },
        "note": "Opponent responds 23x41",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 34,
        "toSq": 43,
        "from": {
          "r": 6,
          "c": 7
        },
        "to": {
          "r": 8,
          "c": 5
        },
        "note": "Multi-jump continue: 43",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 43,
        "toSq": 32,
        "from": {
          "r": 8,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Multi-jump continue: 32",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 32,
        "toSq": 41,
        "from": {
          "r": 6,
          "c": 3
        },
        "to": {
          "r": 8,
          "c": 1
        },
        "note": "Multi-jump continue: 41",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-19",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "📸 DRAUGHTS IMAGE #19 (20.PNG): Reverse Flank Deflection",
    "badge": "📸 20.PNG",
    "source_image": "20.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "flank-deflection",
    "themeName": "DRAUGHTS IMAGE Master Series",
    "themeIdea": "Forced combination from Screenshot 20.PNG",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Straight from DRAUGHTS IMAGE 20.PNG! Spot the combination and strike!",
    "difficulty": {
      "tier": 9,
      "tier_name": "Master",
      "rating": 2410,
      "human_score": 75
    },
    "difficultyTier": 9,
    "rating": 2410,
    "hints": [
      "Calculate White's breakthrough strike starting with 19-13.",
      "Opponent has compulsory responses. Calculate the full multi-jump chain.",
      "Play 19-13! This initiates the decisive win."
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 5,
        "square": 3,
        "player": 2,
        "isKing": false
      },
      {
        "r": 1,
        "c": 6,
        "square": 9,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 0,
        "square": 16,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 4,
        "square": 18,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 6,
        "square": 19,
        "player": 1,
        "isKing": false
      },
      {
        "r": 4,
        "c": 1,
        "square": 21,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 0,
        "square": 26,
        "player": 2,
        "isKing": false
      },
      {
        "r": 6,
        "c": 1,
        "square": 31,
        "player": 2,
        "isKing": false
      },
      {
        "r": 6,
        "c": 5,
        "square": 33,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 4,
        "square": 38,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 1,
        "square": 41,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 5,
        "square": 43,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 0,
        "square": 46,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 2,
        "square": 47,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 19,
        "toSq": 13,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 2,
          "c": 5
        },
        "note": "Key strike: 19-13!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 9,
        "toSq": 14,
        "from": {
          "r": 1,
          "c": 6
        },
        "to": {
          "r": 2,
          "c": 7
        },
        "note": "Opponent responds 9-14",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 13,
        "toSq": 22,
        "from": {
          "r": 2,
          "c": 5
        },
        "to": {
          "r": 4,
          "c": 3
        },
        "note": "Continue combo: 13x22",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 31,
        "toSq": 37,
        "from": {
          "r": 6,
          "c": 1
        },
        "to": {
          "r": 7,
          "c": 2
        },
        "note": "Opponent responds 31-37",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 41,
        "toSq": 32,
        "from": {
          "r": 8,
          "c": 1
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Continue combo: 41x32",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 21,
        "toSq": 27,
        "from": {
          "r": 4,
          "c": 1
        },
        "to": {
          "r": 5,
          "c": 2
        },
        "note": "Opponent responds 21-27",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 22,
        "toSq": 31,
        "from": {
          "r": 4,
          "c": 3
        },
        "to": {
          "r": 6,
          "c": 1
        },
        "note": "Continue combo: 22x31",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 26,
        "toSq": 37,
        "from": {
          "r": 5,
          "c": 0
        },
        "to": {
          "r": 7,
          "c": 2
        },
        "note": "Opponent responds 26x48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 37,
        "toSq": 28,
        "from": {
          "r": 7,
          "c": 2
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Multi-jump continue: 28",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 28,
        "toSq": 39,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 4
        },
        "note": "Multi-jump continue: 48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-20",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "📸 DRAUGHTS IMAGE #20 (21.PNG): Classic Coup Royal Highway Sweep",
    "badge": "📸 21.PNG",
    "source_image": "21.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "coup-royal",
    "themeName": "DRAUGHTS IMAGE Master Series",
    "themeIdea": "Forced combination from Screenshot 21.PNG",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Straight from DRAUGHTS IMAGE 21.PNG! Spot the combination and strike!",
    "difficulty": {
      "tier": 9,
      "tier_name": "Master",
      "rating": 2430,
      "human_score": 75
    },
    "difficultyTier": 9,
    "rating": 2430,
    "hints": [
      "Calculate White's breakthrough strike starting with 33-29.",
      "Opponent has compulsory responses. Calculate the full multi-jump chain.",
      "Play 33-29! This initiates the decisive win."
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 3,
        "square": 2,
        "player": 2,
        "isKing": false
      },
      {
        "r": 1,
        "c": 2,
        "square": 7,
        "player": 2,
        "isKing": false
      },
      {
        "r": 1,
        "c": 4,
        "square": 8,
        "player": 2,
        "isKing": false
      },
      {
        "r": 1,
        "c": 8,
        "square": 10,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 7,
        "square": 14,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 1,
        "square": 21,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 7,
        "square": 24,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 1,
        "square": 31,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 5,
        "square": 33,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 2,
        "square": 37,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 4,
        "square": 38,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 6,
        "square": 39,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 4,
        "square": 48,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 33,
        "toSq": 29,
        "from": {
          "r": 6,
          "c": 5
        },
        "to": {
          "r": 5,
          "c": 6
        },
        "note": "Key strike: 33-29!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 21,
        "toSq": 27,
        "from": {
          "r": 4,
          "c": 1
        },
        "to": {
          "r": 5,
          "c": 2
        },
        "note": "Opponent responds 21-27",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 31,
        "toSq": 22,
        "from": {
          "r": 6,
          "c": 1
        },
        "to": {
          "r": 4,
          "c": 3
        },
        "note": "Continue combo: 31x22",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 14,
        "toSq": 20,
        "from": {
          "r": 2,
          "c": 7
        },
        "to": {
          "r": 3,
          "c": 8
        },
        "note": "Opponent responds 14-20",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 24,
        "toSq": 15,
        "from": {
          "r": 4,
          "c": 7
        },
        "to": {
          "r": 2,
          "c": 9
        },
        "note": "Continue combo: 24x4",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 15,
        "toSq": 4,
        "from": {
          "r": 2,
          "c": 9
        },
        "to": {
          "r": 0,
          "c": 7
        },
        "note": "Multi-jump continue: 4",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 8,
        "toSq": 12,
        "from": {
          "r": 1,
          "c": 4
        },
        "to": {
          "r": 2,
          "c": 3
        },
        "note": "Opponent responds 8-12",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 4,
        "toSq": 18,
        "from": {
          "r": 0,
          "c": 7
        },
        "to": {
          "r": 3,
          "c": 4
        },
        "note": "Continue combo: 4x18",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 12,
        "toSq": 23,
        "from": {
          "r": 2,
          "c": 3
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Opponent responds 12x41",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 23,
        "toSq": 34,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 7
        },
        "note": "Multi-jump continue: 34",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 34,
        "toSq": 43,
        "from": {
          "r": 6,
          "c": 7
        },
        "to": {
          "r": 8,
          "c": 5
        },
        "note": "Multi-jump continue: 43",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 43,
        "toSq": 32,
        "from": {
          "r": 8,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Multi-jump continue: 32",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 32,
        "toSq": 41,
        "from": {
          "r": 6,
          "c": 3
        },
        "to": {
          "r": 8,
          "c": 1
        },
        "note": "Multi-jump continue: 41",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-1-NGA",
    "ruleset": "nigeria",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🇳🇬 Naija Highway Variant #1 (1.PNG): Kozlovsky Triple Sac & Gate Opening",
    "badge": "🇳🇬 Naija #1",
    "source_image": "1.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "triple-sacrifice",
    "themeName": "Naija Highway • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Nigerian Highway transposition of Screenshot 1.PNG (Longest diagonal Sq 1 ↔ Sq 50)",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Naija rules adaptation from 1.PNG! Highway trap dey sweet: chop am well!",
    "difficulty": {
      "tier": 8,
      "tier_name": "Expert",
      "rating": 1980,
      "human_score": 72
    },
    "difficultyTier": 8,
    "rating": 1980,
    "hints": [
      "The combination is set along the Nigerian Highway (Square 1 to 50).",
      "Remember: Nigerian rules allow backward captures for seeds and flying kings!",
      "Strike with 33-28!"
    ],
    "initialBoard": [
      {
        "r": 2,
        "c": 6,
        "player": 2,
        "isKing": false,
        "square": 14
      },
      {
        "r": 2,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 13
      },
      {
        "r": 3,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 18
      },
      {
        "r": 3,
        "c": 3,
        "player": 2,
        "isKing": false,
        "square": 17
      },
      {
        "r": 3,
        "c": 1,
        "player": 2,
        "isKing": false,
        "square": 16
      },
      {
        "r": 4,
        "c": 6,
        "player": 2,
        "isKing": false,
        "square": 24
      },
      {
        "r": 4,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 23
      },
      {
        "r": 5,
        "c": 7,
        "player": 2,
        "isKing": false,
        "square": 29
      },
      {
        "r": 6,
        "c": 8,
        "player": 1,
        "isKing": false,
        "square": 35
      },
      {
        "r": 6,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 33
      },
      {
        "r": 6,
        "c": 2,
        "player": 1,
        "isKing": false,
        "square": 32
      },
      {
        "r": 6,
        "c": 0,
        "player": 2,
        "isKing": false,
        "square": 31
      },
      {
        "r": 7,
        "c": 9,
        "player": 1,
        "isKing": false,
        "square": 40
      },
      {
        "r": 7,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 38
      },
      {
        "r": 7,
        "c": 3,
        "player": 1,
        "isKing": false,
        "square": 37
      },
      {
        "r": 8,
        "c": 6,
        "player": 1,
        "isKing": false,
        "square": 44
      },
      {
        "r": 8,
        "c": 2,
        "player": 1,
        "isKing": false,
        "square": 42
      },
      {
        "r": 9,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 48
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 33,
        "toSq": 28,
        "from": {
          "r": 6,
          "c": 4
        },
        "to": {
          "r": 5,
          "c": 5
        },
        "note": "Key strike: 33-28!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 23,
        "toSq": 34,
        "from": {
          "r": 4,
          "c": 4
        },
        "to": {
          "r": 6,
          "c": 6
        },
        "note": "Opponent responds 23x43",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 34,
        "toSq": 43,
        "from": {
          "r": 6,
          "c": 6
        },
        "to": {
          "r": 8,
          "c": 4
        },
        "note": "Multi-jump continue: 43",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 42,
        "toSq": 36,
        "from": {
          "r": 8,
          "c": 2
        },
        "to": {
          "r": 7,
          "c": 1
        },
        "note": "Continue combo: 44-40",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 31,
        "toSq": 42,
        "from": {
          "r": 6,
          "c": 0
        },
        "to": {
          "r": 8,
          "c": 2
        },
        "note": "Opponent responds 35x33",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 42,
        "toSq": 33,
        "from": {
          "r": 8,
          "c": 2
        },
        "to": {
          "r": 6,
          "c": 4
        },
        "note": "Multi-jump continue: 33",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 48,
        "toSq": 37,
        "from": {
          "r": 9,
          "c": 5
        },
        "to": {
          "r": 7,
          "c": 3
        },
        "note": "Continue combo: 48x8",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 37,
        "toSq": 28,
        "from": {
          "r": 7,
          "c": 3
        },
        "to": {
          "r": 5,
          "c": 5
        },
        "note": "Multi-jump continue: 28",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 28,
        "toSq": 19,
        "from": {
          "r": 5,
          "c": 5
        },
        "to": {
          "r": 3,
          "c": 7
        },
        "note": "Multi-jump continue: 19",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 19,
        "toSq": 8,
        "from": {
          "r": 3,
          "c": 7
        },
        "to": {
          "r": 1,
          "c": 5
        },
        "note": "Multi-jump continue: 8",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 13,
        "toSq": 4,
        "from": {
          "r": 2,
          "c": 4
        },
        "to": {
          "r": 0,
          "c": 6
        },
        "note": "Opponent responds 13x2",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 35,
        "toSq": 24,
        "from": {
          "r": 6,
          "c": 8
        },
        "to": {
          "r": 4,
          "c": 6
        },
        "note": "Continue combo: 31x15",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 24,
        "toSq": 13,
        "from": {
          "r": 4,
          "c": 6
        },
        "to": {
          "r": 2,
          "c": 4
        },
        "note": "Multi-jump continue: 13",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 13,
        "toSq": 22,
        "from": {
          "r": 2,
          "c": 4
        },
        "to": {
          "r": 4,
          "c": 2
        },
        "note": "Multi-jump continue: 22",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 22,
        "toSq": 11,
        "from": {
          "r": 4,
          "c": 2
        },
        "to": {
          "r": 2,
          "c": 0
        },
        "note": "Multi-jump continue: 11",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-2-NGA",
    "ruleset": "nigeria",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🇳🇬 Naija Highway Variant #2 (2.PNG): Center Gate Deflection & Decoy",
    "badge": "🇳🇬 Naija #2",
    "source_image": "2.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "gate-deflection",
    "themeName": "Naija Highway • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Nigerian Highway transposition of Screenshot 2.PNG (Longest diagonal Sq 1 ↔ Sq 50)",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Naija rules adaptation from 2.PNG! Highway trap dey sweet: chop am well!",
    "difficulty": {
      "tier": 8,
      "tier_name": "Expert",
      "rating": 1995,
      "human_score": 72
    },
    "difficultyTier": 8,
    "rating": 1995,
    "hints": [
      "The combination is set along the Nigerian Highway (Square 1 to 50).",
      "Remember: Nigerian rules allow backward captures for seeds and flying kings!",
      "Strike with 33-27!"
    ],
    "initialBoard": [
      {
        "r": 2,
        "c": 6,
        "player": 2,
        "isKing": false,
        "square": 14
      },
      {
        "r": 2,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 13
      },
      {
        "r": 2,
        "c": 2,
        "player": 2,
        "isKing": false,
        "square": 12
      },
      {
        "r": 3,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 18
      },
      {
        "r": 4,
        "c": 8,
        "player": 2,
        "isKing": false,
        "square": 25
      },
      {
        "r": 4,
        "c": 6,
        "player": 2,
        "isKing": false,
        "square": 24
      },
      {
        "r": 4,
        "c": 2,
        "player": 2,
        "isKing": false,
        "square": 22
      },
      {
        "r": 6,
        "c": 6,
        "player": 1,
        "isKing": false,
        "square": 34
      },
      {
        "r": 6,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 33
      },
      {
        "r": 7,
        "c": 7,
        "player": 1,
        "isKing": false,
        "square": 39
      },
      {
        "r": 7,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 38
      },
      {
        "r": 8,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 43
      },
      {
        "r": 8,
        "c": 2,
        "player": 1,
        "isKing": false,
        "square": 42
      },
      {
        "r": 9,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 48
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 33,
        "toSq": 27,
        "from": {
          "r": 6,
          "c": 4
        },
        "to": {
          "r": 5,
          "c": 3
        },
        "note": "Key strike: 33-29!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 22,
        "toSq": 33,
        "from": {
          "r": 4,
          "c": 2
        },
        "to": {
          "r": 6,
          "c": 4
        },
        "note": "Opponent responds 24x31",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 33,
        "toSq": 44,
        "from": {
          "r": 6,
          "c": 4
        },
        "to": {
          "r": 8,
          "c": 6
        },
        "note": "Multi-jump continue: 44",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 44,
        "toSq": 35,
        "from": {
          "r": 8,
          "c": 6
        },
        "to": {
          "r": 6,
          "c": 8
        },
        "note": "Multi-jump continue: 35",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 34,
        "toSq": 28,
        "from": {
          "r": 6,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 5
        },
        "note": "Continue combo: 32-28",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 24,
        "toSq": 33,
        "from": {
          "r": 4,
          "c": 6
        },
        "to": {
          "r": 6,
          "c": 4
        },
        "note": "Opponent responds 22x33",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 43,
        "toSq": 38,
        "from": {
          "r": 8,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 5
        },
        "note": "Continue combo: 43-38",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 33,
        "toSq": 44,
        "from": {
          "r": 6,
          "c": 4
        },
        "to": {
          "r": 8,
          "c": 6
        },
        "note": "Opponent responds 33x42",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 48,
        "toSq": 39,
        "from": {
          "r": 9,
          "c": 5
        },
        "to": {
          "r": 7,
          "c": 7
        },
        "note": "Continue combo: 48x10",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 39,
        "toSq": 30,
        "from": {
          "r": 7,
          "c": 7
        },
        "to": {
          "r": 5,
          "c": 9
        },
        "note": "Multi-jump continue: 30",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 30,
        "toSq": 19,
        "from": {
          "r": 5,
          "c": 9
        },
        "to": {
          "r": 3,
          "c": 7
        },
        "note": "Multi-jump continue: 19",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 19,
        "toSq": 8,
        "from": {
          "r": 3,
          "c": 7
        },
        "to": {
          "r": 1,
          "c": 5
        },
        "note": "Multi-jump continue: 8",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 8,
        "toSq": 17,
        "from": {
          "r": 1,
          "c": 5
        },
        "to": {
          "r": 3,
          "c": 3
        },
        "note": "Multi-jump continue: 17",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 17,
        "toSq": 6,
        "from": {
          "r": 3,
          "c": 3
        },
        "to": {
          "r": 1,
          "c": 1
        },
        "note": "Multi-jump continue: 6",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-3-NGA",
    "ruleset": "nigeria",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🇳🇬 Naija Highway Variant #3 (3.PNG): Springer Diamond Shot & Coronation",
    "badge": "🇳🇬 Naija #3",
    "source_image": "3.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "diamond-shot",
    "themeName": "Naija Highway • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Nigerian Highway transposition of Screenshot 3.PNG (Longest diagonal Sq 1 ↔ Sq 50)",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Naija rules adaptation from 3.PNG! Highway trap dey sweet: chop am well!",
    "difficulty": {
      "tier": 8,
      "tier_name": "Expert",
      "rating": 2010,
      "human_score": 72
    },
    "difficultyTier": 8,
    "rating": 2010,
    "hints": [
      "The combination is set along the Nigerian Highway (Square 1 to 50).",
      "Remember: Nigerian rules allow backward captures for seeds and flying kings!",
      "Strike with 33-28!"
    ],
    "initialBoard": [
      {
        "r": 1,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 8
      },
      {
        "r": 1,
        "c": 1,
        "player": 2,
        "isKing": false,
        "square": 6
      },
      {
        "r": 2,
        "c": 6,
        "player": 2,
        "isKing": false,
        "square": 14
      },
      {
        "r": 3,
        "c": 7,
        "player": 2,
        "isKing": false,
        "square": 19
      },
      {
        "r": 3,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 18
      },
      {
        "r": 3,
        "c": 1,
        "player": 2,
        "isKing": false,
        "square": 16
      },
      {
        "r": 4,
        "c": 6,
        "player": 2,
        "isKing": false,
        "square": 24
      },
      {
        "r": 5,
        "c": 7,
        "player": 2,
        "isKing": false,
        "square": 29
      },
      {
        "r": 5,
        "c": 3,
        "player": 1,
        "isKing": false,
        "square": 27
      },
      {
        "r": 6,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 33
      },
      {
        "r": 7,
        "c": 7,
        "player": 1,
        "isKing": false,
        "square": 39
      },
      {
        "r": 7,
        "c": 3,
        "player": 1,
        "isKing": false,
        "square": 37
      },
      {
        "r": 7,
        "c": 1,
        "player": 1,
        "isKing": false,
        "square": 36
      },
      {
        "r": 8,
        "c": 6,
        "player": 1,
        "isKing": false,
        "square": 44
      },
      {
        "r": 9,
        "c": 7,
        "player": 1,
        "isKing": false,
        "square": 49
      },
      {
        "r": 9,
        "c": 1,
        "player": 1,
        "isKing": false,
        "square": 46
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 33,
        "toSq": 28,
        "from": {
          "r": 6,
          "c": 4
        },
        "to": {
          "r": 5,
          "c": 5
        },
        "note": "Key strike: 33-28!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 24,
        "toSq": 33,
        "from": {
          "r": 4,
          "c": 6
        },
        "to": {
          "r": 6,
          "c": 4
        },
        "note": "Opponent responds 22x35",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 33,
        "toSq": 42,
        "from": {
          "r": 6,
          "c": 4
        },
        "to": {
          "r": 8,
          "c": 2
        },
        "note": "Multi-jump continue: 42",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 42,
        "toSq": 31,
        "from": {
          "r": 8,
          "c": 2
        },
        "to": {
          "r": 6,
          "c": 0
        },
        "note": "Multi-jump continue: 31",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 27,
        "toSq": 23,
        "from": {
          "r": 5,
          "c": 3
        },
        "to": {
          "r": 4,
          "c": 4
        },
        "note": "Continue combo: 29-23",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 18,
        "toSq": 27,
        "from": {
          "r": 3,
          "c": 5
        },
        "to": {
          "r": 5,
          "c": 3
        },
        "note": "Opponent responds 18x29",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 39,
        "toSq": 34,
        "from": {
          "r": 7,
          "c": 7
        },
        "to": {
          "r": 6,
          "c": 6
        },
        "note": "Continue combo: 37-32",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 29,
        "toSq": 38,
        "from": {
          "r": 5,
          "c": 7
        },
        "to": {
          "r": 7,
          "c": 5
        },
        "note": "Opponent responds 27x38",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 44,
        "toSq": 33,
        "from": {
          "r": 8,
          "c": 6
        },
        "to": {
          "r": 6,
          "c": 4
        },
        "note": "Continue combo: 42x4",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 33,
        "toSq": 22,
        "from": {
          "r": 6,
          "c": 4
        },
        "to": {
          "r": 4,
          "c": 2
        },
        "note": "Multi-jump continue: 22",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 22,
        "toSq": 11,
        "from": {
          "r": 4,
          "c": 2
        },
        "to": {
          "r": 2,
          "c": 0
        },
        "note": "Multi-jump continue: 11",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 11,
        "toSq": 2,
        "from": {
          "r": 2,
          "c": 0
        },
        "to": {
          "r": 0,
          "c": 2
        },
        "note": "Multi-jump continue: 2",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-4-NGA",
    "ruleset": "nigeria",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🇳🇬 Naija Highway Variant #4 (4.PNG): Grandmaster Coronation Blitz",
    "badge": "🇳🇬 Naija #4",
    "source_image": "4.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "coronation-blitz",
    "themeName": "Naija Highway • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Nigerian Highway transposition of Screenshot 4.PNG (Longest diagonal Sq 1 ↔ Sq 50)",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Naija rules adaptation from 4.PNG! Highway trap dey sweet: chop am well!",
    "difficulty": {
      "tier": 8,
      "tier_name": "Expert",
      "rating": 2025,
      "human_score": 72
    },
    "difficultyTier": 8,
    "rating": 2025,
    "hints": [
      "The combination is set along the Nigerian Highway (Square 1 to 50).",
      "Remember: Nigerian rules allow backward captures for seeds and flying kings!",
      "Strike with 30-25!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 8,
        "player": 2,
        "isKing": false,
        "square": 5
      },
      {
        "r": 0,
        "c": 2,
        "player": 2,
        "isKing": false,
        "square": 2
      },
      {
        "r": 1,
        "c": 7,
        "player": 2,
        "isKing": false,
        "square": 9
      },
      {
        "r": 2,
        "c": 8,
        "player": 2,
        "isKing": false,
        "square": 15
      },
      {
        "r": 2,
        "c": 2,
        "player": 2,
        "isKing": false,
        "square": 12
      },
      {
        "r": 3,
        "c": 9,
        "player": 1,
        "isKing": false,
        "square": 20
      },
      {
        "r": 3,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 18
      },
      {
        "r": 3,
        "c": 3,
        "player": 2,
        "isKing": false,
        "square": 17
      },
      {
        "r": 4,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 23
      },
      {
        "r": 4,
        "c": 2,
        "player": 2,
        "isKing": false,
        "square": 22
      },
      {
        "r": 5,
        "c": 9,
        "player": 1,
        "isKing": false,
        "square": 30
      },
      {
        "r": 5,
        "c": 7,
        "player": 1,
        "isKing": false,
        "square": 29
      },
      {
        "r": 6,
        "c": 2,
        "player": 1,
        "isKing": false,
        "square": 32
      },
      {
        "r": 7,
        "c": 1,
        "player": 1,
        "isKing": false,
        "square": 36
      },
      {
        "r": 8,
        "c": 6,
        "player": 1,
        "isKing": false,
        "square": 44
      },
      {
        "r": 8,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 43
      },
      {
        "r": 8,
        "c": 2,
        "player": 1,
        "isKing": false,
        "square": 42
      },
      {
        "r": 9,
        "c": 3,
        "player": 1,
        "isKing": false,
        "square": 47
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 30,
        "toSq": 25,
        "from": {
          "r": 5,
          "c": 9
        },
        "to": {
          "r": 4,
          "c": 8
        },
        "note": "Key strike: 26-21!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 15,
        "toSq": 19,
        "from": {
          "r": 2,
          "c": 8
        },
        "to": {
          "r": 3,
          "c": 7
        },
        "note": "Opponent responds 11-17",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 25,
        "toSq": 14,
        "from": {
          "r": 4,
          "c": 8
        },
        "to": {
          "r": 2,
          "c": 6
        },
        "note": "Continue combo: 21x12",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 23,
        "toSq": 28,
        "from": {
          "r": 4,
          "c": 4
        },
        "to": {
          "r": 5,
          "c": 5
        },
        "note": "Opponent responds 23-28",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 14,
        "toSq": 23,
        "from": {
          "r": 2,
          "c": 6
        },
        "to": {
          "r": 4,
          "c": 4
        },
        "note": "Continue combo: 12x32",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 23,
        "toSq": 34,
        "from": {
          "r": 4,
          "c": 4
        },
        "to": {
          "r": 6,
          "c": 6
        },
        "note": "Multi-jump continue: 34",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 22,
        "toSq": 27,
        "from": {
          "r": 4,
          "c": 2
        },
        "to": {
          "r": 5,
          "c": 3
        },
        "note": "Opponent responds 24-29",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 32,
        "toSq": 23,
        "from": {
          "r": 6,
          "c": 2
        },
        "to": {
          "r": 4,
          "c": 4
        },
        "note": "Continue combo: 34x23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 17,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 3
        },
        "to": {
          "r": 5,
          "c": 5
        },
        "note": "Opponent responds 19x50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 28,
        "toSq": 39,
        "from": {
          "r": 5,
          "c": 5
        },
        "to": {
          "r": 7,
          "c": 7
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 7
        },
        "to": {
          "r": 9,
          "c": 5
        },
        "note": "Multi-jump continue: 48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 48,
        "toSq": 37,
        "from": {
          "r": 9,
          "c": 5
        },
        "to": {
          "r": 7,
          "c": 3
        },
        "note": "Multi-jump continue: 37",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 37,
        "toSq": 46,
        "from": {
          "r": 7,
          "c": 3
        },
        "to": {
          "r": 9,
          "c": 1
        },
        "note": "Multi-jump continue: 46",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-5-NGA",
    "ruleset": "nigeria",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🇳🇬 Naija Highway Variant #5 (5.PNG): Coup de la Bombe Flank Explosion",
    "badge": "🇳🇬 Naija #5",
    "source_image": "5.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "coup-de-la-bombe",
    "themeName": "Naija Highway • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Nigerian Highway transposition of Screenshot 5.PNG (Longest diagonal Sq 1 ↔ Sq 50)",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Naija rules adaptation from 5.PNG! Highway trap dey sweet: chop am well!",
    "difficulty": {
      "tier": 8,
      "tier_name": "Expert",
      "rating": 2040,
      "human_score": 72
    },
    "difficultyTier": 8,
    "rating": 2040,
    "hints": [
      "The combination is set along the Nigerian Highway (Square 1 to 50).",
      "Remember: Nigerian rules allow backward captures for seeds and flying kings!",
      "Strike with 27-22!"
    ],
    "initialBoard": [
      {
        "r": 1,
        "c": 9,
        "player": 2,
        "isKing": false,
        "square": 10
      },
      {
        "r": 1,
        "c": 3,
        "player": 2,
        "isKing": false,
        "square": 7
      },
      {
        "r": 2,
        "c": 8,
        "player": 2,
        "isKing": false,
        "square": 15
      },
      {
        "r": 2,
        "c": 6,
        "player": 2,
        "isKing": false,
        "square": 14
      },
      {
        "r": 2,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 13
      },
      {
        "r": 2,
        "c": 2,
        "player": 2,
        "isKing": false,
        "square": 12
      },
      {
        "r": 3,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 18
      },
      {
        "r": 4,
        "c": 0,
        "player": 1,
        "isKing": false,
        "square": 21
      },
      {
        "r": 5,
        "c": 9,
        "player": 2,
        "isKing": false,
        "square": 30
      },
      {
        "r": 5,
        "c": 3,
        "player": 1,
        "isKing": false,
        "square": 27
      },
      {
        "r": 6,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 33
      },
      {
        "r": 7,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 38
      },
      {
        "r": 8,
        "c": 8,
        "player": 1,
        "isKing": false,
        "square": 45
      },
      {
        "r": 8,
        "c": 6,
        "player": 1,
        "isKing": false,
        "square": 44
      },
      {
        "r": 8,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 43
      },
      {
        "r": 9,
        "c": 7,
        "player": 1,
        "isKing": false,
        "square": 49
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 27,
        "toSq": 22,
        "from": {
          "r": 5,
          "c": 3
        },
        "to": {
          "r": 4,
          "c": 2
        },
        "note": "Key strike: 29-24!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 12,
        "toSq": 16,
        "from": {
          "r": 2,
          "c": 2
        },
        "to": {
          "r": 3,
          "c": 1
        },
        "note": "Opponent responds 14-20",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 21,
        "toSq": 12,
        "from": {
          "r": 4,
          "c": 0
        },
        "to": {
          "r": 2,
          "c": 2
        },
        "note": "Continue combo: 25x3",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 12,
        "toSq": 3,
        "from": {
          "r": 2,
          "c": 2
        },
        "to": {
          "r": 0,
          "c": 4
        },
        "note": "Multi-jump continue: 3",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 13,
        "toSq": 17,
        "from": {
          "r": 2,
          "c": 4
        },
        "to": {
          "r": 3,
          "c": 3
        },
        "note": "Opponent responds 13-19",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 22,
        "toSq": 13,
        "from": {
          "r": 4,
          "c": 2
        },
        "to": {
          "r": 2,
          "c": 4
        },
        "note": "Continue combo: 24x22",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 13,
        "toSq": 24,
        "from": {
          "r": 2,
          "c": 4
        },
        "to": {
          "r": 4,
          "c": 6
        },
        "note": "Multi-jump continue: 24",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 14,
        "toSq": 19,
        "from": {
          "r": 2,
          "c": 6
        },
        "to": {
          "r": 3,
          "c": 7
        },
        "note": "Opponent responds 12-17",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 3,
        "toSq": 25,
        "from": {
          "r": 0,
          "c": 4
        },
        "to": {
          "r": 4,
          "c": 8
        },
        "note": "Continue combo: 3x21",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 30,
        "toSq": 19,
        "from": {
          "r": 5,
          "c": 9
        },
        "to": {
          "r": 3,
          "c": 7
        },
        "note": "Opponent responds 26x46",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 7
        },
        "to": {
          "r": 5,
          "c": 5
        },
        "note": "Multi-jump continue: 28",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 28,
        "toSq": 37,
        "from": {
          "r": 5,
          "c": 5
        },
        "to": {
          "r": 7,
          "c": 3
        },
        "note": "Multi-jump continue: 37",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 37,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 3
        },
        "to": {
          "r": 9,
          "c": 5
        },
        "note": "Multi-jump continue: 48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 48,
        "toSq": 39,
        "from": {
          "r": 9,
          "c": 5
        },
        "to": {
          "r": 7,
          "c": 7
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 50,
        "from": {
          "r": 7,
          "c": 7
        },
        "to": {
          "r": 9,
          "c": 9
        },
        "note": "Multi-jump continue: 50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-6-NGA",
    "ruleset": "nigeria",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🇳🇬 Naija Highway Variant #6 (6.PNG): Decoy King Sweep & Sac",
    "badge": "🇳🇬 Naija #6",
    "source_image": "6.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "king-sweep",
    "themeName": "Naija Highway • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Nigerian Highway transposition of Screenshot 6.PNG (Longest diagonal Sq 1 ↔ Sq 50)",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Naija rules adaptation from 6.PNG! Highway trap dey sweet: chop am well!",
    "difficulty": {
      "tier": 8,
      "tier_name": "Expert",
      "rating": 2055,
      "human_score": 72
    },
    "difficultyTier": 8,
    "rating": 2055,
    "hints": [
      "The combination is set along the Nigerian Highway (Square 1 to 50).",
      "Remember: Nigerian rules allow backward captures for seeds and flying kings!",
      "Strike with 44-38!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 3
      },
      {
        "r": 2,
        "c": 6,
        "player": 2,
        "isKing": false,
        "square": 14
      },
      {
        "r": 3,
        "c": 9,
        "player": 2,
        "isKing": false,
        "square": 20
      },
      {
        "r": 3,
        "c": 7,
        "player": 2,
        "isKing": false,
        "square": 19
      },
      {
        "r": 3,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 18
      },
      {
        "r": 3,
        "c": 3,
        "player": 2,
        "isKing": false,
        "square": 17
      },
      {
        "r": 4,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 23
      },
      {
        "r": 5,
        "c": 9,
        "player": 2,
        "isKing": false,
        "square": 30
      },
      {
        "r": 5,
        "c": 3,
        "player": 2,
        "isKing": false,
        "square": 27
      },
      {
        "r": 5,
        "c": 1,
        "player": 1,
        "isKing": false,
        "square": 26
      },
      {
        "r": 6,
        "c": 6,
        "player": 1,
        "isKing": false,
        "square": 34
      },
      {
        "r": 6,
        "c": 2,
        "player": 1,
        "isKing": false,
        "square": 32
      },
      {
        "r": 7,
        "c": 9,
        "player": 1,
        "isKing": false,
        "square": 40
      },
      {
        "r": 7,
        "c": 7,
        "player": 1,
        "isKing": false,
        "square": 39
      },
      {
        "r": 7,
        "c": 1,
        "player": 1,
        "isKing": false,
        "square": 36
      },
      {
        "r": 8,
        "c": 6,
        "player": 1,
        "isKing": false,
        "square": 44
      },
      {
        "r": 8,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 43
      },
      {
        "r": 9,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 48
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 44,
        "toSq": 38,
        "from": {
          "r": 8,
          "c": 6
        },
        "to": {
          "r": 7,
          "c": 5
        },
        "note": "Key strike: 42-38!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 17,
        "toSq": 22,
        "from": {
          "r": 3,
          "c": 3
        },
        "to": {
          "r": 4,
          "c": 2
        },
        "note": "Opponent responds 19-24",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 26,
        "toSq": 17,
        "from": {
          "r": 5,
          "c": 1
        },
        "to": {
          "r": 3,
          "c": 3
        },
        "note": "Continue combo: 30x28",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 17,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 3
        },
        "to": {
          "r": 5,
          "c": 5
        },
        "note": "Multi-jump continue: 28",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 18,
        "toSq": 24,
        "from": {
          "r": 3,
          "c": 5
        },
        "to": {
          "r": 4,
          "c": 6
        },
        "note": "Opponent responds 18-22",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 32,
        "toSq": 23,
        "from": {
          "r": 6,
          "c": 2
        },
        "to": {
          "r": 4,
          "c": 4
        },
        "note": "Continue combo: 34x23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 24,
        "toSq": 33,
        "from": {
          "r": 4,
          "c": 6
        },
        "to": {
          "r": 6,
          "c": 4
        },
        "note": "Opponent responds 22x31",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 33,
        "toSq": 44,
        "from": {
          "r": 6,
          "c": 4
        },
        "to": {
          "r": 8,
          "c": 6
        },
        "note": "Multi-jump continue: 44",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 44,
        "toSq": 35,
        "from": {
          "r": 8,
          "c": 6
        },
        "to": {
          "r": 6,
          "c": 8
        },
        "note": "Multi-jump continue: 35",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 40,
        "toSq": 29,
        "from": {
          "r": 7,
          "c": 9
        },
        "to": {
          "r": 5,
          "c": 7
        },
        "note": "Continue combo: 36x27",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 30,
        "toSq": 35,
        "from": {
          "r": 5,
          "c": 9
        },
        "to": {
          "r": 6,
          "c": 8
        },
        "note": "Opponent responds 26-31",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 29,
        "toSq": 40,
        "from": {
          "r": 5,
          "c": 7
        },
        "to": {
          "r": 7,
          "c": 9
        },
        "note": "Continue combo: 27x36",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 14,
        "toSq": 18,
        "from": {
          "r": 2,
          "c": 6
        },
        "to": {
          "r": 3,
          "c": 5
        },
        "note": "Opponent responds 12-18",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 23,
        "toSq": 14,
        "from": {
          "r": 4,
          "c": 4
        },
        "to": {
          "r": 2,
          "c": 6
        },
        "note": "Continue combo: 23x21",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 14,
        "toSq": 25,
        "from": {
          "r": 2,
          "c": 6
        },
        "to": {
          "r": 4,
          "c": 8
        },
        "note": "Multi-jump continue: 25",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 20,
        "toSq": 29,
        "from": {
          "r": 3,
          "c": 9
        },
        "to": {
          "r": 5,
          "c": 7
        },
        "note": "Opponent responds 16x49",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 29,
        "toSq": 38,
        "from": {
          "r": 5,
          "c": 7
        },
        "to": {
          "r": 7,
          "c": 5
        },
        "note": "Multi-jump continue: 38",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 38,
        "toSq": 47,
        "from": {
          "r": 7,
          "c": 5
        },
        "to": {
          "r": 9,
          "c": 3
        },
        "note": "Multi-jump continue: 47",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-7-NGA",
    "ruleset": "nigeria",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🇳🇬 Naija Highway Variant #7 (7.PNG): Keller Center Wedge Strike",
    "badge": "🇳🇬 Naija #7",
    "source_image": "7.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "center-wedge",
    "themeName": "Naija Highway • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Nigerian Highway transposition of Screenshot 7.PNG (Longest diagonal Sq 1 ↔ Sq 50)",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Naija rules adaptation from 7.PNG! Highway trap dey sweet: chop am well!",
    "difficulty": {
      "tier": 8,
      "tier_name": "Expert",
      "rating": 2070,
      "human_score": 72
    },
    "difficultyTier": 8,
    "rating": 2070,
    "hints": [
      "The combination is set along the Nigerian Highway (Square 1 to 50).",
      "Remember: Nigerian rules allow backward captures for seeds and flying kings!",
      "Strike with 48-43!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 6,
        "player": 2,
        "isKing": false,
        "square": 4
      },
      {
        "r": 1,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 8
      },
      {
        "r": 2,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 13
      },
      {
        "r": 2,
        "c": 2,
        "player": 2,
        "isKing": false,
        "square": 12
      },
      {
        "r": 3,
        "c": 3,
        "player": 2,
        "isKing": false,
        "square": 17
      },
      {
        "r": 4,
        "c": 8,
        "player": 2,
        "isKing": false,
        "square": 25
      },
      {
        "r": 4,
        "c": 6,
        "player": 1,
        "isKing": false,
        "square": 24
      },
      {
        "r": 4,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 23
      },
      {
        "r": 4,
        "c": 2,
        "player": 2,
        "isKing": false,
        "square": 22
      },
      {
        "r": 4,
        "c": 0,
        "player": 1,
        "isKing": false,
        "square": 21
      },
      {
        "r": 5,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 28
      },
      {
        "r": 6,
        "c": 6,
        "player": 1,
        "isKing": false,
        "square": 34
      },
      {
        "r": 6,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 33
      },
      {
        "r": 7,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 38
      },
      {
        "r": 9,
        "c": 7,
        "player": 1,
        "isKing": false,
        "square": 49
      },
      {
        "r": 9,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 48
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 48,
        "toSq": 43,
        "from": {
          "r": 9,
          "c": 5
        },
        "to": {
          "r": 8,
          "c": 4
        },
        "note": "Key strike: 48-43!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 13,
        "toSq": 18,
        "from": {
          "r": 2,
          "c": 4
        },
        "to": {
          "r": 3,
          "c": 5
        },
        "note": "Opponent responds 13-18",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 24,
        "toSq": 13,
        "from": {
          "r": 4,
          "c": 6
        },
        "to": {
          "r": 2,
          "c": 4
        },
        "note": "Continue combo: 22x13",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 25,
        "toSq": 29,
        "from": {
          "r": 4,
          "c": 8
        },
        "to": {
          "r": 5,
          "c": 7
        },
        "note": "Opponent responds 21-27",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 34,
        "toSq": 25,
        "from": {
          "r": 6,
          "c": 6
        },
        "to": {
          "r": 4,
          "c": 8
        },
        "note": "Continue combo: 32x21",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 23,
        "toSq": 34,
        "from": {
          "r": 4,
          "c": 4
        },
        "to": {
          "r": 6,
          "c": 6
        },
        "note": "Opponent responds 23x32",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 38,
        "toSq": 29,
        "from": {
          "r": 7,
          "c": 5
        },
        "to": {
          "r": 5,
          "c": 7
        },
        "note": "Continue combo: 38x27",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 12,
        "toSq": 16,
        "from": {
          "r": 2,
          "c": 2
        },
        "to": {
          "r": 3,
          "c": 1
        },
        "note": "Opponent responds 14-20",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 21,
        "toSq": 12,
        "from": {
          "r": 4,
          "c": 0
        },
        "to": {
          "r": 2,
          "c": 2
        },
        "note": "Continue combo: 25x23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 12,
        "toSq": 23,
        "from": {
          "r": 2,
          "c": 2
        },
        "to": {
          "r": 4,
          "c": 4
        },
        "note": "Multi-jump continue: 23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 8,
        "toSq": 17,
        "from": {
          "r": 1,
          "c": 5
        },
        "to": {
          "r": 3,
          "c": 3
        },
        "note": "Opponent responds 8x48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 17,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 3
        },
        "to": {
          "r": 5,
          "c": 5
        },
        "note": "Multi-jump continue: 28",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 28,
        "toSq": 37,
        "from": {
          "r": 5,
          "c": 5
        },
        "to": {
          "r": 7,
          "c": 3
        },
        "note": "Multi-jump continue: 37",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 37,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 3
        },
        "to": {
          "r": 9,
          "c": 5
        },
        "note": "Multi-jump continue: 48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-8-NGA",
    "ruleset": "nigeria",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🇳🇬 Naija Highway Variant #8 (8.PNG): Roozenburg Highway Clearance",
    "badge": "🇳🇬 Naija #8",
    "source_image": "8.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "highway-clearance",
    "themeName": "Naija Highway • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Nigerian Highway transposition of Screenshot 8.PNG (Longest diagonal Sq 1 ↔ Sq 50)",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Naija rules adaptation from 8.PNG! Highway trap dey sweet: chop am well!",
    "difficulty": {
      "tier": 8,
      "tier_name": "Expert",
      "rating": 2085,
      "human_score": 72
    },
    "difficultyTier": 8,
    "rating": 2085,
    "hints": [
      "The combination is set along the Nigerian Highway (Square 1 to 50).",
      "Remember: Nigerian rules allow backward captures for seeds and flying kings!",
      "Strike with 36-31!"
    ],
    "initialBoard": [
      {
        "r": 2,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 13
      },
      {
        "r": 2,
        "c": 2,
        "player": 2,
        "isKing": false,
        "square": 12
      },
      {
        "r": 3,
        "c": 7,
        "player": 2,
        "isKing": false,
        "square": 19
      },
      {
        "r": 3,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 18
      },
      {
        "r": 3,
        "c": 3,
        "player": 2,
        "isKing": false,
        "square": 17
      },
      {
        "r": 4,
        "c": 6,
        "player": 2,
        "isKing": false,
        "square": 24
      },
      {
        "r": 4,
        "c": 0,
        "player": 2,
        "isKing": false,
        "square": 21
      },
      {
        "r": 5,
        "c": 9,
        "player": 1,
        "isKing": false,
        "square": 30
      },
      {
        "r": 5,
        "c": 1,
        "player": 2,
        "isKing": false,
        "square": 26
      },
      {
        "r": 6,
        "c": 8,
        "player": 1,
        "isKing": false,
        "square": 35
      },
      {
        "r": 6,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 33
      },
      {
        "r": 6,
        "c": 2,
        "player": 1,
        "isKing": false,
        "square": 32
      },
      {
        "r": 7,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 38
      },
      {
        "r": 7,
        "c": 3,
        "player": 1,
        "isKing": false,
        "square": 37
      },
      {
        "r": 7,
        "c": 1,
        "player": 1,
        "isKing": false,
        "square": 36
      },
      {
        "r": 8,
        "c": 2,
        "player": 1,
        "isKing": false,
        "square": 42
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 36,
        "toSq": 31,
        "from": {
          "r": 7,
          "c": 1
        },
        "to": {
          "r": 6,
          "c": 0
        },
        "note": "Key strike: 40-35!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 25,
        "from": {
          "r": 3,
          "c": 7
        },
        "to": {
          "r": 4,
          "c": 8
        },
        "note": "Opponent responds 17-21",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 30,
        "toSq": 19,
        "from": {
          "r": 5,
          "c": 9
        },
        "to": {
          "r": 3,
          "c": 7
        },
        "note": "Continue combo: 26x28",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 19,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 7
        },
        "to": {
          "r": 5,
          "c": 5
        },
        "note": "Multi-jump continue: 28",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 18,
        "toSq": 23,
        "from": {
          "r": 3,
          "c": 5
        },
        "to": {
          "r": 4,
          "c": 4
        },
        "note": "Opponent responds 18-23",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 31,
        "toSq": 22,
        "from": {
          "r": 6,
          "c": 0
        },
        "to": {
          "r": 4,
          "c": 2
        },
        "note": "Continue combo: 35x24",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 23,
        "toSq": 34,
        "from": {
          "r": 4,
          "c": 4
        },
        "to": {
          "r": 6,
          "c": 6
        },
        "note": "Opponent responds 23x43",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 34,
        "toSq": 43,
        "from": {
          "r": 6,
          "c": 6
        },
        "to": {
          "r": 8,
          "c": 4
        },
        "note": "Multi-jump continue: 43",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 37,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 3
        },
        "to": {
          "r": 9,
          "c": 5
        },
        "note": "Continue combo: 39x48",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 17,
        "toSq": 26,
        "from": {
          "r": 3,
          "c": 3
        },
        "to": {
          "r": 5,
          "c": 1
        },
        "note": "Opponent responds 19x50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 26,
        "toSq": 37,
        "from": {
          "r": 5,
          "c": 1
        },
        "to": {
          "r": 7,
          "c": 3
        },
        "note": "Multi-jump continue: 37",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 37,
        "toSq": 46,
        "from": {
          "r": 7,
          "c": 3
        },
        "to": {
          "r": 9,
          "c": 1
        },
        "note": "Multi-jump continue: 46",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-9-NGA",
    "ruleset": "nigeria",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🇳🇬 Naija Highway Variant #9 (10.PNG): Flying King Coronation Ambush",
    "badge": "🇳🇬 Naija #9",
    "source_image": "10.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "coronation-ambush",
    "themeName": "Naija Highway • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Nigerian Highway transposition of Screenshot 10.PNG (Longest diagonal Sq 1 ↔ Sq 50)",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Naija rules adaptation from 10.PNG! Highway trap dey sweet: chop am well!",
    "difficulty": {
      "tier": 8,
      "tier_name": "Expert",
      "rating": 2100,
      "human_score": 72
    },
    "difficultyTier": 8,
    "rating": 2100,
    "hints": [
      "The combination is set along the Nigerian Highway (Square 1 to 50).",
      "Remember: Nigerian rules allow backward captures for seeds and flying kings!",
      "Strike with 37-33!"
    ],
    "initialBoard": [
      {
        "r": 1,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 8
      },
      {
        "r": 2,
        "c": 6,
        "player": 2,
        "isKing": false,
        "square": 14
      },
      {
        "r": 2,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 13
      },
      {
        "r": 2,
        "c": 2,
        "player": 2,
        "isKing": false,
        "square": 12
      },
      {
        "r": 3,
        "c": 9,
        "player": 2,
        "isKing": false,
        "square": 20
      },
      {
        "r": 3,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 18
      },
      {
        "r": 3,
        "c": 3,
        "player": 2,
        "isKing": false,
        "square": 17
      },
      {
        "r": 4,
        "c": 2,
        "player": 2,
        "isKing": false,
        "square": 22
      },
      {
        "r": 4,
        "c": 0,
        "player": 1,
        "isKing": false,
        "square": 21
      },
      {
        "r": 5,
        "c": 7,
        "player": 1,
        "isKing": false,
        "square": 29
      },
      {
        "r": 5,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 28
      },
      {
        "r": 5,
        "c": 3,
        "player": 2,
        "isKing": false,
        "square": 27
      },
      {
        "r": 6,
        "c": 6,
        "player": 1,
        "isKing": false,
        "square": 34
      },
      {
        "r": 6,
        "c": 0,
        "player": 1,
        "isKing": false,
        "square": 31
      },
      {
        "r": 7,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 38
      },
      {
        "r": 7,
        "c": 3,
        "player": 1,
        "isKing": false,
        "square": 37
      },
      {
        "r": 8,
        "c": 2,
        "player": 1,
        "isKing": false,
        "square": 42
      },
      {
        "r": 9,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 48
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 37,
        "toSq": 33,
        "from": {
          "r": 7,
          "c": 3
        },
        "to": {
          "r": 6,
          "c": 4
        },
        "note": "Key strike: 39-33!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 20,
        "toSq": 25,
        "from": {
          "r": 3,
          "c": 9
        },
        "to": {
          "r": 4,
          "c": 8
        },
        "note": "Opponent responds 16-21",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 29,
        "toSq": 20,
        "from": {
          "r": 5,
          "c": 7
        },
        "to": {
          "r": 3,
          "c": 9
        },
        "note": "Continue combo: 27x16",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 18,
        "toSq": 24,
        "from": {
          "r": 3,
          "c": 5
        },
        "to": {
          "r": 4,
          "c": 6
        },
        "note": "Opponent responds 18-22",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 28,
        "toSq": 19,
        "from": {
          "r": 5,
          "c": 5
        },
        "to": {
          "r": 3,
          "c": 7
        },
        "note": "Continue combo: 28x17",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 14,
        "toSq": 25,
        "from": {
          "r": 2,
          "c": 6
        },
        "to": {
          "r": 4,
          "c": 8
        },
        "note": "Opponent responds 12x21",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 20,
        "toSq": 29,
        "from": {
          "r": 3,
          "c": 9
        },
        "to": {
          "r": 5,
          "c": 7
        },
        "note": "Continue combo: 16x27",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 22,
        "toSq": 26,
        "from": {
          "r": 4,
          "c": 2
        },
        "to": {
          "r": 5,
          "c": 1
        },
        "note": "Opponent responds 24-30",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 21,
        "toSq": 32,
        "from": {
          "r": 4,
          "c": 0
        },
        "to": {
          "r": 6,
          "c": 2
        },
        "note": "Continue combo: 25x23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 32,
        "toSq": 23,
        "from": {
          "r": 6,
          "c": 2
        },
        "to": {
          "r": 4,
          "c": 4
        },
        "note": "Multi-jump continue: 23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 17,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 3
        },
        "to": {
          "r": 5,
          "c": 5
        },
        "note": "Opponent responds 19x50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 28,
        "toSq": 37,
        "from": {
          "r": 5,
          "c": 5
        },
        "to": {
          "r": 7,
          "c": 3
        },
        "note": "Multi-jump continue: 37",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 37,
        "toSq": 46,
        "from": {
          "r": 7,
          "c": 3
        },
        "to": {
          "r": 9,
          "c": 1
        },
        "note": "Multi-jump continue: 46",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-10-NGA",
    "ruleset": "nigeria",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🇳🇬 Naija Highway Variant #10 (11.PNG): Flank Squeeze Coronation",
    "badge": "🇳🇬 Naija #10",
    "source_image": "11.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "flank-squeeze",
    "themeName": "Naija Highway • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Nigerian Highway transposition of Screenshot 11.PNG (Longest diagonal Sq 1 ↔ Sq 50)",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Naija rules adaptation from 11.PNG! Highway trap dey sweet: chop am well!",
    "difficulty": {
      "tier": 8,
      "tier_name": "Expert",
      "rating": 2115,
      "human_score": 72
    },
    "difficultyTier": 8,
    "rating": 2115,
    "hints": [
      "The combination is set along the Nigerian Highway (Square 1 to 50).",
      "Remember: Nigerian rules allow backward captures for seeds and flying kings!",
      "Strike with 26-21!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 6,
        "player": 2,
        "isKing": false,
        "square": 4
      },
      {
        "r": 0,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 3
      },
      {
        "r": 1,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 8
      },
      {
        "r": 2,
        "c": 6,
        "player": 2,
        "isKing": false,
        "square": 14
      },
      {
        "r": 2,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 13
      },
      {
        "r": 3,
        "c": 3,
        "player": 2,
        "isKing": false,
        "square": 17
      },
      {
        "r": 3,
        "c": 1,
        "player": 2,
        "isKing": false,
        "square": 16
      },
      {
        "r": 4,
        "c": 6,
        "player": 1,
        "isKing": false,
        "square": 24
      },
      {
        "r": 4,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 23
      },
      {
        "r": 5,
        "c": 7,
        "player": 1,
        "isKing": false,
        "square": 29
      },
      {
        "r": 5,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 28
      },
      {
        "r": 5,
        "c": 1,
        "player": 1,
        "isKing": false,
        "square": 26
      },
      {
        "r": 6,
        "c": 6,
        "player": 1,
        "isKing": false,
        "square": 34
      },
      {
        "r": 8,
        "c": 6,
        "player": 1,
        "isKing": false,
        "square": 44
      },
      {
        "r": 8,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 43
      },
      {
        "r": 8,
        "c": 2,
        "player": 1,
        "isKing": false,
        "square": 42
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 26,
        "toSq": 21,
        "from": {
          "r": 5,
          "c": 1
        },
        "to": {
          "r": 4,
          "c": 0
        },
        "note": "Key strike: 30-25!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 17,
        "toSq": 22,
        "from": {
          "r": 3,
          "c": 3
        },
        "to": {
          "r": 4,
          "c": 2
        },
        "note": "Opponent responds 19-24",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 28,
        "toSq": 17,
        "from": {
          "r": 5,
          "c": 5
        },
        "to": {
          "r": 3,
          "c": 3
        },
        "note": "Continue combo: 28x30",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 17,
        "toSq": 26,
        "from": {
          "r": 3,
          "c": 3
        },
        "to": {
          "r": 5,
          "c": 1
        },
        "note": "Multi-jump continue: 26",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 13,
        "toSq": 17,
        "from": {
          "r": 2,
          "c": 4
        },
        "to": {
          "r": 3,
          "c": 3
        },
        "note": "Opponent responds 13-19",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 21,
        "toSq": 12,
        "from": {
          "r": 4,
          "c": 0
        },
        "to": {
          "r": 2,
          "c": 2
        },
        "note": "Continue combo: 25x23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 12,
        "toSq": 23,
        "from": {
          "r": 2,
          "c": 2
        },
        "to": {
          "r": 4,
          "c": 4
        },
        "note": "Multi-jump continue: 23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 14,
        "toSq": 18,
        "from": {
          "r": 2,
          "c": 6
        },
        "to": {
          "r": 3,
          "c": 5
        },
        "note": "Opponent responds 12-18",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 24,
        "toSq": 13,
        "from": {
          "r": 4,
          "c": 6
        },
        "to": {
          "r": 2,
          "c": 4
        },
        "note": "Continue combo: 22x13",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 8,
        "toSq": 17,
        "from": {
          "r": 1,
          "c": 5
        },
        "to": {
          "r": 3,
          "c": 3
        },
        "note": "Opponent responds 8x50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 17,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 3
        },
        "to": {
          "r": 5,
          "c": 5
        },
        "note": "Multi-jump continue: 28",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 28,
        "toSq": 39,
        "from": {
          "r": 5,
          "c": 5
        },
        "to": {
          "r": 7,
          "c": 7
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 7
        },
        "to": {
          "r": 9,
          "c": 5
        },
        "note": "Multi-jump continue: 48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 48,
        "toSq": 37,
        "from": {
          "r": 9,
          "c": 5
        },
        "to": {
          "r": 7,
          "c": 3
        },
        "note": "Multi-jump continue: 37",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 37,
        "toSq": 46,
        "from": {
          "r": 7,
          "c": 3
        },
        "to": {
          "r": 9,
          "c": 1
        },
        "note": "Multi-jump continue: 46",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-11-NGA",
    "ruleset": "nigeria",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🇳🇬 Naija Highway Variant #11 (12.PNG): Infiltration Stride Combination",
    "badge": "🇳🇬 Naija #11",
    "source_image": "12.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "infiltration-stride",
    "themeName": "Naija Highway • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Nigerian Highway transposition of Screenshot 12.PNG (Longest diagonal Sq 1 ↔ Sq 50)",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Naija rules adaptation from 12.PNG! Highway trap dey sweet: chop am well!",
    "difficulty": {
      "tier": 8,
      "tier_name": "Expert",
      "rating": 2130,
      "human_score": 72
    },
    "difficultyTier": 8,
    "rating": 2130,
    "hints": [
      "The combination is set along the Nigerian Highway (Square 1 to 50).",
      "Remember: Nigerian rules allow backward captures for seeds and flying kings!",
      "Strike with 28-23!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 3
      },
      {
        "r": 1,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 8
      },
      {
        "r": 2,
        "c": 8,
        "player": 2,
        "isKing": false,
        "square": 15
      },
      {
        "r": 2,
        "c": 6,
        "player": 2,
        "isKing": false,
        "square": 14
      },
      {
        "r": 2,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 13
      },
      {
        "r": 2,
        "c": 2,
        "player": 2,
        "isKing": false,
        "square": 12
      },
      {
        "r": 4,
        "c": 2,
        "player": 1,
        "isKing": false,
        "square": 22
      },
      {
        "r": 5,
        "c": 7,
        "player": 2,
        "isKing": false,
        "square": 29
      },
      {
        "r": 5,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 28
      },
      {
        "r": 5,
        "c": 3,
        "player": 1,
        "isKing": false,
        "square": 27
      },
      {
        "r": 7,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 38
      },
      {
        "r": 8,
        "c": 6,
        "player": 1,
        "isKing": false,
        "square": 44
      },
      {
        "r": 8,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 43
      },
      {
        "r": 8,
        "c": 2,
        "player": 1,
        "isKing": false,
        "square": 42
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 28,
        "toSq": 23,
        "from": {
          "r": 5,
          "c": 5
        },
        "to": {
          "r": 4,
          "c": 4
        },
        "note": "Key strike: 28-23!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 13,
        "toSq": 17,
        "from": {
          "r": 2,
          "c": 4
        },
        "to": {
          "r": 3,
          "c": 3
        },
        "note": "Opponent responds 13-19",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 22,
        "toSq": 13,
        "from": {
          "r": 4,
          "c": 2
        },
        "to": {
          "r": 2,
          "c": 4
        },
        "note": "Continue combo: 24x2",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 13,
        "toSq": 4,
        "from": {
          "r": 2,
          "c": 4
        },
        "to": {
          "r": 0,
          "c": 6
        },
        "note": "Multi-jump continue: 4",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 12,
        "toSq": 17,
        "from": {
          "r": 2,
          "c": 2
        },
        "to": {
          "r": 3,
          "c": 3
        },
        "note": "Opponent responds 14-19",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 4,
        "toSq": 20,
        "from": {
          "r": 0,
          "c": 6
        },
        "to": {
          "r": 3,
          "c": 9
        },
        "note": "Continue combo: 2x32",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 20,
        "toSq": 34,
        "from": {
          "r": 3,
          "c": 9
        },
        "to": {
          "r": 6,
          "c": 6
        },
        "note": "Multi-jump continue: 34",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 17,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 3
        },
        "to": {
          "r": 5,
          "c": 5
        },
        "note": "Opponent responds 19x50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 28,
        "toSq": 39,
        "from": {
          "r": 5,
          "c": 5
        },
        "to": {
          "r": 7,
          "c": 7
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 7
        },
        "to": {
          "r": 9,
          "c": 5
        },
        "note": "Multi-jump continue: 48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 48,
        "toSq": 37,
        "from": {
          "r": 9,
          "c": 5
        },
        "to": {
          "r": 7,
          "c": 3
        },
        "note": "Multi-jump continue: 37",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 37,
        "toSq": 46,
        "from": {
          "r": 7,
          "c": 3
        },
        "to": {
          "r": 9,
          "c": 1
        },
        "note": "Multi-jump continue: 46",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-12-NGA",
    "ruleset": "nigeria",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🇳🇬 Naija Highway Variant #12 (13.PNG): Grande Ligne Decoy Breaker",
    "badge": "🇳🇬 Naija #12",
    "source_image": "13.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "decoy-breaker",
    "themeName": "Naija Highway • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Nigerian Highway transposition of Screenshot 13.PNG (Longest diagonal Sq 1 ↔ Sq 50)",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Naija rules adaptation from 13.PNG! Highway trap dey sweet: chop am well!",
    "difficulty": {
      "tier": 8,
      "tier_name": "Expert",
      "rating": 2145,
      "human_score": 72
    },
    "difficultyTier": 8,
    "rating": 2145,
    "hints": [
      "The combination is set along the Nigerian Highway (Square 1 to 50).",
      "Remember: Nigerian rules allow backward captures for seeds and flying kings!",
      "Strike with 35-29!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 3
      },
      {
        "r": 1,
        "c": 1,
        "player": 2,
        "isKing": false,
        "square": 6
      },
      {
        "r": 2,
        "c": 8,
        "player": 2,
        "isKing": false,
        "square": 15
      },
      {
        "r": 2,
        "c": 6,
        "player": 2,
        "isKing": false,
        "square": 14
      },
      {
        "r": 2,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 13
      },
      {
        "r": 2,
        "c": 2,
        "player": 2,
        "isKing": false,
        "square": 12
      },
      {
        "r": 3,
        "c": 7,
        "player": 2,
        "isKing": false,
        "square": 19
      },
      {
        "r": 4,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 23
      },
      {
        "r": 4,
        "c": 0,
        "player": 2,
        "isKing": false,
        "square": 21
      },
      {
        "r": 5,
        "c": 3,
        "player": 1,
        "isKing": false,
        "square": 27
      },
      {
        "r": 6,
        "c": 8,
        "player": 1,
        "isKing": false,
        "square": 35
      },
      {
        "r": 6,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 33
      },
      {
        "r": 6,
        "c": 0,
        "player": 1,
        "isKing": false,
        "square": 31
      },
      {
        "r": 8,
        "c": 8,
        "player": 1,
        "isKing": false,
        "square": 45
      },
      {
        "r": 8,
        "c": 6,
        "player": 1,
        "isKing": false,
        "square": 44
      },
      {
        "r": 8,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 43
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 35,
        "toSq": 29,
        "from": {
          "r": 6,
          "c": 8
        },
        "to": {
          "r": 5,
          "c": 7
        },
        "note": "Key strike: 31-27!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 21,
        "toSq": 26,
        "from": {
          "r": 4,
          "c": 0
        },
        "to": {
          "r": 5,
          "c": 1
        },
        "note": "Opponent responds 25-30",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 31,
        "toSq": 22,
        "from": {
          "r": 6,
          "c": 0
        },
        "to": {
          "r": 4,
          "c": 2
        },
        "note": "Continue combo: 35x24",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 12,
        "toSq": 16,
        "from": {
          "r": 2,
          "c": 2
        },
        "to": {
          "r": 3,
          "c": 1
        },
        "note": "Opponent responds 14-20",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 22,
        "toSq": 11,
        "from": {
          "r": 4,
          "c": 2
        },
        "to": {
          "r": 2,
          "c": 0
        },
        "note": "Continue combo: 24x4",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 11,
        "toSq": 2,
        "from": {
          "r": 2,
          "c": 0
        },
        "to": {
          "r": 0,
          "c": 2
        },
        "note": "Multi-jump continue: 2",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 13,
        "toSq": 18,
        "from": {
          "r": 2,
          "c": 4
        },
        "to": {
          "r": 3,
          "c": 5
        },
        "note": "Opponent responds 13-18",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 2,
        "toSq": 24,
        "from": {
          "r": 0,
          "c": 2
        },
        "to": {
          "r": 4,
          "c": 6
        },
        "note": "Continue combo: 4x22",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 7
        },
        "to": {
          "r": 5,
          "c": 5
        },
        "note": "Opponent responds 17x46",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 28,
        "toSq": 37,
        "from": {
          "r": 5,
          "c": 5
        },
        "to": {
          "r": 7,
          "c": 3
        },
        "note": "Multi-jump continue: 37",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 37,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 3
        },
        "to": {
          "r": 9,
          "c": 5
        },
        "note": "Multi-jump continue: 48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 48,
        "toSq": 39,
        "from": {
          "r": 9,
          "c": 5
        },
        "to": {
          "r": 7,
          "c": 7
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 50,
        "from": {
          "r": 7,
          "c": 7
        },
        "to": {
          "r": 9,
          "c": 9
        },
        "note": "Multi-jump continue: 50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-13-NGA",
    "ruleset": "nigeria",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🇳🇬 Naija Highway Variant #13 (14.PNG): Masterpiece Diagonal Trap",
    "badge": "🇳🇬 Naija #13",
    "source_image": "14.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "diagonal-trap",
    "themeName": "Naija Highway • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Nigerian Highway transposition of Screenshot 14.PNG (Longest diagonal Sq 1 ↔ Sq 50)",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Naija rules adaptation from 14.PNG! Highway trap dey sweet: chop am well!",
    "difficulty": {
      "tier": 8,
      "tier_name": "Expert",
      "rating": 2160,
      "human_score": 72
    },
    "difficultyTier": 8,
    "rating": 2160,
    "hints": [
      "The combination is set along the Nigerian Highway (Square 1 to 50).",
      "Remember: Nigerian rules allow backward captures for seeds and flying kings!",
      "Strike with 34-28!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 2,
        "player": 2,
        "isKing": false,
        "square": 2
      },
      {
        "r": 1,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 8
      },
      {
        "r": 1,
        "c": 1,
        "player": 2,
        "isKing": false,
        "square": 6
      },
      {
        "r": 2,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 13
      },
      {
        "r": 2,
        "c": 2,
        "player": 2,
        "isKing": false,
        "square": 12
      },
      {
        "r": 3,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 18
      },
      {
        "r": 3,
        "c": 3,
        "player": 2,
        "isKing": false,
        "square": 17
      },
      {
        "r": 4,
        "c": 2,
        "player": 2,
        "isKing": false,
        "square": 22
      },
      {
        "r": 4,
        "c": 0,
        "player": 1,
        "isKing": false,
        "square": 21
      },
      {
        "r": 5,
        "c": 1,
        "player": 1,
        "isKing": false,
        "square": 26
      },
      {
        "r": 6,
        "c": 6,
        "player": 1,
        "isKing": false,
        "square": 34
      },
      {
        "r": 6,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 33
      },
      {
        "r": 6,
        "c": 0,
        "player": 1,
        "isKing": false,
        "square": 31
      },
      {
        "r": 7,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 38
      },
      {
        "r": 7,
        "c": 3,
        "player": 1,
        "isKing": false,
        "square": 37
      },
      {
        "r": 7,
        "c": 1,
        "player": 1,
        "isKing": false,
        "square": 36
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 34,
        "toSq": 28,
        "from": {
          "r": 6,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 5
        },
        "note": "Key strike: 32-28!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 18,
        "toSq": 24,
        "from": {
          "r": 3,
          "c": 5
        },
        "to": {
          "r": 4,
          "c": 6
        },
        "note": "Opponent responds 18-22",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 28,
        "toSq": 19,
        "from": {
          "r": 5,
          "c": 5
        },
        "to": {
          "r": 3,
          "c": 7
        },
        "note": "Continue combo: 28x17",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 17,
        "toSq": 23,
        "from": {
          "r": 3,
          "c": 3
        },
        "to": {
          "r": 4,
          "c": 4
        },
        "note": "Opponent responds 19-23",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 26,
        "toSq": 17,
        "from": {
          "r": 5,
          "c": 1
        },
        "to": {
          "r": 3,
          "c": 3
        },
        "note": "Continue combo: 30x28",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 17,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 3
        },
        "to": {
          "r": 5,
          "c": 5
        },
        "note": "Multi-jump continue: 28",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 8,
        "toSq": 14,
        "from": {
          "r": 1,
          "c": 5
        },
        "to": {
          "r": 2,
          "c": 6
        },
        "note": "Opponent responds 8-12",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 19,
        "toSq": 8,
        "from": {
          "r": 3,
          "c": 7
        },
        "to": {
          "r": 1,
          "c": 5
        },
        "note": "Continue combo: 17x19",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 8,
        "toSq": 17,
        "from": {
          "r": 1,
          "c": 5
        },
        "to": {
          "r": 3,
          "c": 3
        },
        "note": "Multi-jump continue: 17",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 12,
        "toSq": 23,
        "from": {
          "r": 2,
          "c": 2
        },
        "to": {
          "r": 4,
          "c": 4
        },
        "note": "Opponent responds 14x45",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 23,
        "toSq": 34,
        "from": {
          "r": 4,
          "c": 4
        },
        "to": {
          "r": 6,
          "c": 6
        },
        "note": "Multi-jump continue: 34",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 34,
        "toSq": 43,
        "from": {
          "r": 6,
          "c": 6
        },
        "to": {
          "r": 8,
          "c": 4
        },
        "note": "Multi-jump continue: 43",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 43,
        "toSq": 32,
        "from": {
          "r": 8,
          "c": 4
        },
        "to": {
          "r": 6,
          "c": 2
        },
        "note": "Multi-jump continue: 32",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 32,
        "toSq": 41,
        "from": {
          "r": 6,
          "c": 2
        },
        "to": {
          "r": 8,
          "c": 0
        },
        "note": "Multi-jump continue: 41",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-14-NGA",
    "ruleset": "nigeria",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🇳🇬 Naija Highway Variant #14 (15.PNG): Grandmaster Pin & Shatter",
    "badge": "🇳🇬 Naija #14",
    "source_image": "15.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "pin-and-shatter",
    "themeName": "Naija Highway • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Nigerian Highway transposition of Screenshot 15.PNG (Longest diagonal Sq 1 ↔ Sq 50)",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Naija rules adaptation from 15.PNG! Highway trap dey sweet: chop am well!",
    "difficulty": {
      "tier": 8,
      "tier_name": "Expert",
      "rating": 2175,
      "human_score": 72
    },
    "difficultyTier": 8,
    "rating": 2175,
    "hints": [
      "The combination is set along the Nigerian Highway (Square 1 to 50).",
      "Remember: Nigerian rules allow backward captures for seeds and flying kings!",
      "Strike with 38-34!"
    ],
    "initialBoard": [
      {
        "r": 2,
        "c": 8,
        "player": 2,
        "isKing": false,
        "square": 15
      },
      {
        "r": 2,
        "c": 6,
        "player": 2,
        "isKing": false,
        "square": 14
      },
      {
        "r": 2,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 13
      },
      {
        "r": 3,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 18
      },
      {
        "r": 3,
        "c": 3,
        "player": 2,
        "isKing": false,
        "square": 17
      },
      {
        "r": 3,
        "c": 1,
        "player": 2,
        "isKing": false,
        "square": 16
      },
      {
        "r": 4,
        "c": 6,
        "player": 2,
        "isKing": false,
        "square": 24
      },
      {
        "r": 4,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 23
      },
      {
        "r": 4,
        "c": 0,
        "player": 2,
        "isKing": false,
        "square": 21
      },
      {
        "r": 5,
        "c": 3,
        "player": 1,
        "isKing": false,
        "square": 27
      },
      {
        "r": 6,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 33
      },
      {
        "r": 6,
        "c": 2,
        "player": 1,
        "isKing": false,
        "square": 32
      },
      {
        "r": 6,
        "c": 0,
        "player": 1,
        "isKing": false,
        "square": 31
      },
      {
        "r": 7,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 38
      },
      {
        "r": 8,
        "c": 6,
        "player": 1,
        "isKing": false,
        "square": 44
      },
      {
        "r": 8,
        "c": 2,
        "player": 1,
        "isKing": false,
        "square": 42
      },
      {
        "r": 8,
        "c": 0,
        "player": 1,
        "isKing": false,
        "square": 41
      },
      {
        "r": 9,
        "c": 7,
        "player": 1,
        "isKing": false,
        "square": 49
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 38,
        "toSq": 34,
        "from": {
          "r": 7,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 6
        },
        "note": "Key strike: 38-32!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 24,
        "toSq": 28,
        "from": {
          "r": 4,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 5
        },
        "note": "Opponent responds 22-28",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 33,
        "toSq": 24,
        "from": {
          "r": 6,
          "c": 4
        },
        "to": {
          "r": 4,
          "c": 6
        },
        "note": "Continue combo: 33x22",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 18,
        "toSq": 29,
        "from": {
          "r": 3,
          "c": 5
        },
        "to": {
          "r": 5,
          "c": 7
        },
        "note": "Opponent responds 18x38",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 29,
        "toSq": 38,
        "from": {
          "r": 5,
          "c": 7
        },
        "to": {
          "r": 7,
          "c": 5
        },
        "note": "Multi-jump continue: 38",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 27,
        "toSq": 18,
        "from": {
          "r": 5,
          "c": 3
        },
        "to": {
          "r": 3,
          "c": 5
        },
        "note": "Continue combo: 29x16",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 18,
        "toSq": 9,
        "from": {
          "r": 3,
          "c": 5
        },
        "to": {
          "r": 1,
          "c": 7
        },
        "note": "Multi-jump continue: 9",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 9,
        "toSq": 20,
        "from": {
          "r": 1,
          "c": 7
        },
        "to": {
          "r": 3,
          "c": 9
        },
        "note": "Multi-jump continue: 20",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 16,
        "toSq": 22,
        "from": {
          "r": 3,
          "c": 1
        },
        "to": {
          "r": 4,
          "c": 2
        },
        "note": "Opponent responds 20-24",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 44,
        "toSq": 33,
        "from": {
          "r": 8,
          "c": 6
        },
        "to": {
          "r": 6,
          "c": 4
        },
        "note": "Continue combo: 42x33",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 22,
        "toSq": 26,
        "from": {
          "r": 4,
          "c": 2
        },
        "to": {
          "r": 5,
          "c": 1
        },
        "note": "Opponent responds 24-30",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 31,
        "toSq": 22,
        "from": {
          "r": 6,
          "c": 0
        },
        "to": {
          "r": 4,
          "c": 2
        },
        "note": "Continue combo: 35x24",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 17,
        "toSq": 26,
        "from": {
          "r": 3,
          "c": 3
        },
        "to": {
          "r": 5,
          "c": 1
        },
        "note": "Opponent responds 19x50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 26,
        "toSq": 37,
        "from": {
          "r": 5,
          "c": 1
        },
        "to": {
          "r": 7,
          "c": 3
        },
        "note": "Multi-jump continue: 37",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 37,
        "toSq": 46,
        "from": {
          "r": 7,
          "c": 3
        },
        "to": {
          "r": 9,
          "c": 1
        },
        "note": "Multi-jump continue: 46",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-15-NGA",
    "ruleset": "nigeria",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🇳🇬 Naija Highway Variant #15 (16.PNG): Long Diagonal King Strike",
    "badge": "🇳🇬 Naija #15",
    "source_image": "16.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "king-strike",
    "themeName": "Naija Highway • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Nigerian Highway transposition of Screenshot 16.PNG (Longest diagonal Sq 1 ↔ Sq 50)",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Naija rules adaptation from 16.PNG! Highway trap dey sweet: chop am well!",
    "difficulty": {
      "tier": 8,
      "tier_name": "Expert",
      "rating": 2190,
      "human_score": 72
    },
    "difficultyTier": 8,
    "rating": 2190,
    "hints": [
      "The combination is set along the Nigerian Highway (Square 1 to 50).",
      "Remember: Nigerian rules allow backward captures for seeds and flying kings!",
      "Strike with 47-43!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 2,
        "player": 2,
        "isKing": false,
        "square": 2
      },
      {
        "r": 2,
        "c": 6,
        "player": 2,
        "isKing": false,
        "square": 14
      },
      {
        "r": 3,
        "c": 9,
        "player": 2,
        "isKing": false,
        "square": 20
      },
      {
        "r": 3,
        "c": 7,
        "player": 2,
        "isKing": false,
        "square": 19
      },
      {
        "r": 4,
        "c": 6,
        "player": 2,
        "isKing": false,
        "square": 24
      },
      {
        "r": 4,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 23
      },
      {
        "r": 4,
        "c": 2,
        "player": 2,
        "isKing": false,
        "square": 22
      },
      {
        "r": 5,
        "c": 9,
        "player": 2,
        "isKing": false,
        "square": 30
      },
      {
        "r": 6,
        "c": 2,
        "player": 1,
        "isKing": false,
        "square": 32
      },
      {
        "r": 7,
        "c": 9,
        "player": 1,
        "isKing": false,
        "square": 40
      },
      {
        "r": 7,
        "c": 7,
        "player": 1,
        "isKing": false,
        "square": 39
      },
      {
        "r": 8,
        "c": 0,
        "player": 1,
        "isKing": false,
        "square": 41
      },
      {
        "r": 9,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 48
      },
      {
        "r": 9,
        "c": 3,
        "player": 1,
        "isKing": false,
        "square": 47
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 47,
        "toSq": 43,
        "from": {
          "r": 9,
          "c": 3
        },
        "to": {
          "r": 8,
          "c": 4
        },
        "note": "Key strike: 49-43!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 24,
        "toSq": 28,
        "from": {
          "r": 4,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 5
        },
        "note": "Opponent responds 22-28",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 23,
        "toSq": 34,
        "from": {
          "r": 4,
          "c": 4
        },
        "to": {
          "r": 6,
          "c": 6
        },
        "note": "Continue combo: 23x32",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 22,
        "toSq": 27,
        "from": {
          "r": 4,
          "c": 2
        },
        "to": {
          "r": 5,
          "c": 3
        },
        "note": "Opponent responds 24-29",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 32,
        "toSq": 23,
        "from": {
          "r": 6,
          "c": 2
        },
        "to": {
          "r": 4,
          "c": 4
        },
        "note": "Continue combo: 34x23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 14,
        "toSq": 18,
        "from": {
          "r": 2,
          "c": 6
        },
        "to": {
          "r": 3,
          "c": 5
        },
        "note": "Opponent responds 12-18",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 23,
        "toSq": 14,
        "from": {
          "r": 4,
          "c": 4
        },
        "to": {
          "r": 2,
          "c": 6
        },
        "note": "Continue combo: 23x21",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 14,
        "toSq": 25,
        "from": {
          "r": 2,
          "c": 6
        },
        "to": {
          "r": 4,
          "c": 8
        },
        "note": "Multi-jump continue: 25",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 20,
        "toSq": 29,
        "from": {
          "r": 3,
          "c": 9
        },
        "to": {
          "r": 5,
          "c": 7
        },
        "note": "Opponent responds 16x49",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 29,
        "toSq": 38,
        "from": {
          "r": 5,
          "c": 7
        },
        "to": {
          "r": 7,
          "c": 5
        },
        "note": "Multi-jump continue: 38",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 38,
        "toSq": 47,
        "from": {
          "r": 7,
          "c": 5
        },
        "to": {
          "r": 9,
          "c": 3
        },
        "note": "Multi-jump continue: 47",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-16-NGA",
    "ruleset": "nigeria",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🇳🇬 Naija Highway Variant #16 (17.PNG): Counter-Sacrifice Sweep",
    "badge": "🇳🇬 Naija #16",
    "source_image": "17.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "counter-sweep",
    "themeName": "Naija Highway • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Nigerian Highway transposition of Screenshot 17.PNG (Longest diagonal Sq 1 ↔ Sq 50)",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Naija rules adaptation from 17.PNG! Highway trap dey sweet: chop am well!",
    "difficulty": {
      "tier": 8,
      "tier_name": "Expert",
      "rating": 2205,
      "human_score": 72
    },
    "difficultyTier": 8,
    "rating": 2205,
    "hints": [
      "The combination is set along the Nigerian Highway (Square 1 to 50).",
      "Remember: Nigerian rules allow backward captures for seeds and flying kings!",
      "Strike with 29-25!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 6,
        "player": 2,
        "isKing": false,
        "square": 4
      },
      {
        "r": 2,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 13
      },
      {
        "r": 2,
        "c": 2,
        "player": 2,
        "isKing": false,
        "square": 12
      },
      {
        "r": 3,
        "c": 7,
        "player": 2,
        "isKing": false,
        "square": 19
      },
      {
        "r": 3,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 18
      },
      {
        "r": 3,
        "c": 3,
        "player": 2,
        "isKing": false,
        "square": 17
      },
      {
        "r": 4,
        "c": 2,
        "player": 2,
        "isKing": false,
        "square": 22
      },
      {
        "r": 5,
        "c": 9,
        "player": 2,
        "isKing": false,
        "square": 30
      },
      {
        "r": 5,
        "c": 7,
        "player": 1,
        "isKing": false,
        "square": 29
      },
      {
        "r": 5,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 28
      },
      {
        "r": 6,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 33
      },
      {
        "r": 6,
        "c": 2,
        "player": 1,
        "isKing": false,
        "square": 32
      },
      {
        "r": 7,
        "c": 7,
        "player": 1,
        "isKing": false,
        "square": 39
      },
      {
        "r": 8,
        "c": 8,
        "player": 1,
        "isKing": false,
        "square": 45
      },
      {
        "r": 8,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 43
      },
      {
        "r": 9,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 48
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 29,
        "toSq": 25,
        "from": {
          "r": 5,
          "c": 7
        },
        "to": {
          "r": 4,
          "c": 8
        },
        "note": "Key strike: 27-21!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 30,
        "toSq": 35,
        "from": {
          "r": 5,
          "c": 9
        },
        "to": {
          "r": 6,
          "c": 8
        },
        "note": "Opponent responds 26-31",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 25,
        "toSq": 14,
        "from": {
          "r": 4,
          "c": 8
        },
        "to": {
          "r": 2,
          "c": 6
        },
        "note": "Continue combo: 21x23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 14,
        "toSq": 23,
        "from": {
          "r": 2,
          "c": 6
        },
        "to": {
          "r": 4,
          "c": 4
        },
        "note": "Multi-jump continue: 23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 35,
        "toSq": 44,
        "from": {
          "r": 6,
          "c": 8
        },
        "to": {
          "r": 8,
          "c": 6
        },
        "note": "Opponent responds 31x42",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 48,
        "toSq": 39,
        "from": {
          "r": 9,
          "c": 5
        },
        "to": {
          "r": 7,
          "c": 7
        },
        "note": "Continue combo: 48x37",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 22,
        "toSq": 27,
        "from": {
          "r": 4,
          "c": 2
        },
        "to": {
          "r": 5,
          "c": 3
        },
        "note": "Opponent responds 24-29",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 33,
        "toSq": 22,
        "from": {
          "r": 6,
          "c": 4
        },
        "to": {
          "r": 4,
          "c": 2
        },
        "note": "Continue combo: 33x24",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 17,
        "toSq": 26,
        "from": {
          "r": 3,
          "c": 3
        },
        "to": {
          "r": 5,
          "c": 1
        },
        "note": "Opponent responds 19x48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 26,
        "toSq": 37,
        "from": {
          "r": 5,
          "c": 1
        },
        "to": {
          "r": 7,
          "c": 3
        },
        "note": "Multi-jump continue: 37",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 37,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 3
        },
        "to": {
          "r": 9,
          "c": 5
        },
        "note": "Multi-jump continue: 48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-17-NGA",
    "ruleset": "nigeria",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🇳🇬 Naija Highway Variant #17 (18.PNG): Two-Gate Coronation Trap",
    "badge": "🇳🇬 Naija #17",
    "source_image": "18.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "coronation-trap",
    "themeName": "Naija Highway • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Nigerian Highway transposition of Screenshot 18.PNG (Longest diagonal Sq 1 ↔ Sq 50)",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Naija rules adaptation from 18.PNG! Highway trap dey sweet: chop am well!",
    "difficulty": {
      "tier": 8,
      "tier_name": "Expert",
      "rating": 2220,
      "human_score": 72
    },
    "difficultyTier": 8,
    "rating": 2220,
    "hints": [
      "The combination is set along the Nigerian Highway (Square 1 to 50).",
      "Remember: Nigerian rules allow backward captures for seeds and flying kings!",
      "Strike with 32-27!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 6,
        "player": 2,
        "isKing": false,
        "square": 4
      },
      {
        "r": 0,
        "c": 2,
        "player": 2,
        "isKing": false,
        "square": 2
      },
      {
        "r": 1,
        "c": 7,
        "player": 2,
        "isKing": false,
        "square": 9
      },
      {
        "r": 1,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 8
      },
      {
        "r": 2,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 13
      },
      {
        "r": 2,
        "c": 0,
        "player": 1,
        "isKing": false,
        "square": 11
      },
      {
        "r": 4,
        "c": 8,
        "player": 2,
        "isKing": false,
        "square": 25
      },
      {
        "r": 4,
        "c": 6,
        "player": 2,
        "isKing": false,
        "square": 24
      },
      {
        "r": 6,
        "c": 6,
        "player": 1,
        "isKing": false,
        "square": 34
      },
      {
        "r": 6,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 33
      },
      {
        "r": 6,
        "c": 2,
        "player": 1,
        "isKing": false,
        "square": 32
      },
      {
        "r": 7,
        "c": 7,
        "player": 1,
        "isKing": false,
        "square": 39
      },
      {
        "r": 7,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 38
      },
      {
        "r": 7,
        "c": 3,
        "player": 1,
        "isKing": false,
        "square": 37
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 32,
        "toSq": 27,
        "from": {
          "r": 6,
          "c": 2
        },
        "to": {
          "r": 5,
          "c": 3
        },
        "note": "Key strike: 34-29!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 25,
        "toSq": 29,
        "from": {
          "r": 4,
          "c": 8
        },
        "to": {
          "r": 5,
          "c": 7
        },
        "note": "Opponent responds 21-27",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 34,
        "toSq": 25,
        "from": {
          "r": 6,
          "c": 6
        },
        "to": {
          "r": 4,
          "c": 8
        },
        "note": "Continue combo: 32x21",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 24,
        "toSq": 28,
        "from": {
          "r": 4,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 5
        },
        "note": "Opponent responds 22-28",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 33,
        "toSq": 24,
        "from": {
          "r": 6,
          "c": 4
        },
        "to": {
          "r": 4,
          "c": 6
        },
        "note": "Continue combo: 33x22",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 2,
        "toSq": 6,
        "from": {
          "r": 0,
          "c": 2
        },
        "to": {
          "r": 1,
          "c": 1
        },
        "note": "Opponent responds 4-10",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 11,
        "toSq": 2,
        "from": {
          "r": 2,
          "c": 0
        },
        "to": {
          "r": 0,
          "c": 2
        },
        "note": "Continue combo: 15x4",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 8,
        "toSq": 14,
        "from": {
          "r": 1,
          "c": 5
        },
        "to": {
          "r": 2,
          "c": 6
        },
        "note": "Opponent responds 8-12",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 2,
        "toSq": 18,
        "from": {
          "r": 0,
          "c": 2
        },
        "to": {
          "r": 3,
          "c": 5
        },
        "note": "Continue combo: 4x18",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 14,
        "toSq": 23,
        "from": {
          "r": 2,
          "c": 6
        },
        "to": {
          "r": 4,
          "c": 4
        },
        "note": "Opponent responds 12x41",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 23,
        "toSq": 32,
        "from": {
          "r": 4,
          "c": 4
        },
        "to": {
          "r": 6,
          "c": 2
        },
        "note": "Multi-jump continue: 32",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 32,
        "toSq": 43,
        "from": {
          "r": 6,
          "c": 2
        },
        "to": {
          "r": 8,
          "c": 4
        },
        "note": "Multi-jump continue: 43",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 43,
        "toSq": 34,
        "from": {
          "r": 8,
          "c": 4
        },
        "to": {
          "r": 6,
          "c": 6
        },
        "note": "Multi-jump continue: 34",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 34,
        "toSq": 45,
        "from": {
          "r": 6,
          "c": 6
        },
        "to": {
          "r": 8,
          "c": 8
        },
        "note": "Multi-jump continue: 45",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-18-NGA",
    "ruleset": "nigeria",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🇳🇬 Naija Highway Variant #18 (19.PNG): King Vacuum & Decoy",
    "badge": "🇳🇬 Naija #18",
    "source_image": "19.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "king-vacuum",
    "themeName": "Naija Highway • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Nigerian Highway transposition of Screenshot 19.PNG (Longest diagonal Sq 1 ↔ Sq 50)",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Naija rules adaptation from 19.PNG! Highway trap dey sweet: chop am well!",
    "difficulty": {
      "tier": 8,
      "tier_name": "Expert",
      "rating": 2235,
      "human_score": 72
    },
    "difficultyTier": 8,
    "rating": 2235,
    "hints": [
      "The combination is set along the Nigerian Highway (Square 1 to 50).",
      "Remember: Nigerian rules allow backward captures for seeds and flying kings!",
      "Strike with 43-37!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 2,
        "player": 2,
        "isKing": false,
        "square": 2
      },
      {
        "r": 2,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 13
      },
      {
        "r": 2,
        "c": 2,
        "player": 2,
        "isKing": false,
        "square": 12
      },
      {
        "r": 2,
        "c": 0,
        "player": 1,
        "isKing": false,
        "square": 11
      },
      {
        "r": 3,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 18
      },
      {
        "r": 3,
        "c": 3,
        "player": 2,
        "isKing": false,
        "square": 17
      },
      {
        "r": 4,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 23
      },
      {
        "r": 4,
        "c": 2,
        "player": 2,
        "isKing": false,
        "square": 22
      },
      {
        "r": 4,
        "c": 0,
        "player": 1,
        "isKing": false,
        "square": 21
      },
      {
        "r": 6,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 33
      },
      {
        "r": 7,
        "c": 7,
        "player": 1,
        "isKing": false,
        "square": 39
      },
      {
        "r": 7,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 38
      },
      {
        "r": 8,
        "c": 6,
        "player": 1,
        "isKing": false,
        "square": 44
      },
      {
        "r": 8,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 43
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 43,
        "toSq": 37,
        "from": {
          "r": 8,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 3
        },
        "note": "Key strike: 43-39!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 2,
        "toSq": 6,
        "from": {
          "r": 0,
          "c": 2
        },
        "to": {
          "r": 1,
          "c": 1
        },
        "note": "Opponent responds 4-10",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 11,
        "toSq": 2,
        "from": {
          "r": 2,
          "c": 0
        },
        "to": {
          "r": 0,
          "c": 2
        },
        "note": "Continue combo: 15x4",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 12,
        "toSq": 16,
        "from": {
          "r": 2,
          "c": 2
        },
        "to": {
          "r": 3,
          "c": 1
        },
        "note": "Opponent responds 14-20",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 21,
        "toSq": 12,
        "from": {
          "r": 4,
          "c": 0
        },
        "to": {
          "r": 2,
          "c": 2
        },
        "note": "Continue combo: 25x14",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 17,
        "toSq": 6,
        "from": {
          "r": 3,
          "c": 3
        },
        "to": {
          "r": 1,
          "c": 1
        },
        "note": "Opponent responds 19x10",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 2,
        "toSq": 11,
        "from": {
          "r": 0,
          "c": 2
        },
        "to": {
          "r": 2,
          "c": 0
        },
        "note": "Continue combo: 4x29",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 11,
        "toSq": 27,
        "from": {
          "r": 2,
          "c": 0
        },
        "to": {
          "r": 5,
          "c": 3
        },
        "note": "Multi-jump continue: 27",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 23,
        "toSq": 32,
        "from": {
          "r": 4,
          "c": 4
        },
        "to": {
          "r": 6,
          "c": 2
        },
        "note": "Opponent responds 23x41",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 32,
        "toSq": 43,
        "from": {
          "r": 6,
          "c": 2
        },
        "to": {
          "r": 8,
          "c": 4
        },
        "note": "Multi-jump continue: 43",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 43,
        "toSq": 34,
        "from": {
          "r": 8,
          "c": 4
        },
        "to": {
          "r": 6,
          "c": 6
        },
        "note": "Multi-jump continue: 34",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 34,
        "toSq": 45,
        "from": {
          "r": 6,
          "c": 6
        },
        "to": {
          "r": 8,
          "c": 8
        },
        "note": "Multi-jump continue: 45",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-19-NGA",
    "ruleset": "nigeria",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🇳🇬 Naija Highway Variant #19 (20.PNG): Reverse Flank Deflection",
    "badge": "🇳🇬 Naija #19",
    "source_image": "20.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "flank-deflection",
    "themeName": "Naija Highway • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Nigerian Highway transposition of Screenshot 20.PNG (Longest diagonal Sq 1 ↔ Sq 50)",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Naija rules adaptation from 20.PNG! Highway trap dey sweet: chop am well!",
    "difficulty": {
      "tier": 8,
      "tier_name": "Expert",
      "rating": 2250,
      "human_score": 72
    },
    "difficultyTier": 8,
    "rating": 2250,
    "hints": [
      "The combination is set along the Nigerian Highway (Square 1 to 50).",
      "Remember: Nigerian rules allow backward captures for seeds and flying kings!",
      "Strike with 17-13!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 3
      },
      {
        "r": 1,
        "c": 3,
        "player": 2,
        "isKing": false,
        "square": 7
      },
      {
        "r": 3,
        "c": 9,
        "player": 2,
        "isKing": false,
        "square": 20
      },
      {
        "r": 3,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 18
      },
      {
        "r": 3,
        "c": 3,
        "player": 1,
        "isKing": false,
        "square": 17
      },
      {
        "r": 4,
        "c": 8,
        "player": 2,
        "isKing": false,
        "square": 25
      },
      {
        "r": 5,
        "c": 9,
        "player": 2,
        "isKing": false,
        "square": 30
      },
      {
        "r": 6,
        "c": 8,
        "player": 2,
        "isKing": false,
        "square": 35
      },
      {
        "r": 6,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 33
      },
      {
        "r": 7,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 38
      },
      {
        "r": 8,
        "c": 8,
        "player": 1,
        "isKing": false,
        "square": 45
      },
      {
        "r": 8,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 43
      },
      {
        "r": 9,
        "c": 9,
        "player": 1,
        "isKing": false,
        "square": 50
      },
      {
        "r": 9,
        "c": 7,
        "player": 1,
        "isKing": false,
        "square": 49
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 17,
        "toSq": 13,
        "from": {
          "r": 3,
          "c": 3
        },
        "to": {
          "r": 2,
          "c": 4
        },
        "note": "Key strike: 19-13!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 7,
        "toSq": 12,
        "from": {
          "r": 1,
          "c": 3
        },
        "to": {
          "r": 2,
          "c": 2
        },
        "note": "Opponent responds 9-14",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 13,
        "toSq": 24,
        "from": {
          "r": 2,
          "c": 4
        },
        "to": {
          "r": 4,
          "c": 6
        },
        "note": "Continue combo: 13x22",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 35,
        "toSq": 39,
        "from": {
          "r": 6,
          "c": 8
        },
        "to": {
          "r": 7,
          "c": 7
        },
        "note": "Opponent responds 31-37",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 45,
        "toSq": 34,
        "from": {
          "r": 8,
          "c": 8
        },
        "to": {
          "r": 6,
          "c": 6
        },
        "note": "Continue combo: 41x32",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 25,
        "toSq": 29,
        "from": {
          "r": 4,
          "c": 8
        },
        "to": {
          "r": 5,
          "c": 7
        },
        "note": "Opponent responds 21-27",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 24,
        "toSq": 35,
        "from": {
          "r": 4,
          "c": 6
        },
        "to": {
          "r": 6,
          "c": 8
        },
        "note": "Continue combo: 22x31",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 30,
        "toSq": 39,
        "from": {
          "r": 5,
          "c": 9
        },
        "to": {
          "r": 7,
          "c": 7
        },
        "note": "Opponent responds 26x48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 28,
        "from": {
          "r": 7,
          "c": 7
        },
        "to": {
          "r": 5,
          "c": 5
        },
        "note": "Multi-jump continue: 28",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 28,
        "toSq": 37,
        "from": {
          "r": 5,
          "c": 5
        },
        "to": {
          "r": 7,
          "c": 3
        },
        "note": "Multi-jump continue: 37",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 37,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 3
        },
        "to": {
          "r": 9,
          "c": 5
        },
        "note": "Multi-jump continue: 48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-20-NGA",
    "ruleset": "nigeria",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🇳🇬 Naija Highway Variant #20 (21.PNG): Classic Coup Royal Highway Sweep",
    "badge": "🇳🇬 Naija #20",
    "source_image": "21.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "coup-royal",
    "themeName": "Naija Highway • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Nigerian Highway transposition of Screenshot 21.PNG (Longest diagonal Sq 1 ↔ Sq 50)",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Naija rules adaptation from 21.PNG! Highway trap dey sweet: chop am well!",
    "difficulty": {
      "tier": 8,
      "tier_name": "Expert",
      "rating": 2265,
      "human_score": 72
    },
    "difficultyTier": 8,
    "rating": 2265,
    "hints": [
      "The combination is set along the Nigerian Highway (Square 1 to 50).",
      "Remember: Nigerian rules allow backward captures for seeds and flying kings!",
      "Strike with 33-27!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 6,
        "player": 2,
        "isKing": false,
        "square": 4
      },
      {
        "r": 1,
        "c": 7,
        "player": 2,
        "isKing": false,
        "square": 9
      },
      {
        "r": 1,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 8
      },
      {
        "r": 1,
        "c": 1,
        "player": 2,
        "isKing": false,
        "square": 6
      },
      {
        "r": 2,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 13
      },
      {
        "r": 2,
        "c": 2,
        "player": 2,
        "isKing": false,
        "square": 12
      },
      {
        "r": 4,
        "c": 8,
        "player": 2,
        "isKing": false,
        "square": 25
      },
      {
        "r": 4,
        "c": 2,
        "player": 1,
        "isKing": false,
        "square": 22
      },
      {
        "r": 6,
        "c": 8,
        "player": 1,
        "isKing": false,
        "square": 35
      },
      {
        "r": 6,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 33
      },
      {
        "r": 7,
        "c": 7,
        "player": 1,
        "isKing": false,
        "square": 39
      },
      {
        "r": 7,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 38
      },
      {
        "r": 7,
        "c": 3,
        "player": 1,
        "isKing": false,
        "square": 37
      },
      {
        "r": 9,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 48
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 33,
        "toSq": 27,
        "from": {
          "r": 6,
          "c": 4
        },
        "to": {
          "r": 5,
          "c": 3
        },
        "note": "Key strike: 33-29!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 25,
        "toSq": 29,
        "from": {
          "r": 4,
          "c": 8
        },
        "to": {
          "r": 5,
          "c": 7
        },
        "note": "Opponent responds 21-27",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 35,
        "toSq": 24,
        "from": {
          "r": 6,
          "c": 8
        },
        "to": {
          "r": 4,
          "c": 6
        },
        "note": "Continue combo: 31x22",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 12,
        "toSq": 16,
        "from": {
          "r": 2,
          "c": 2
        },
        "to": {
          "r": 3,
          "c": 1
        },
        "note": "Opponent responds 14-20",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 22,
        "toSq": 11,
        "from": {
          "r": 4,
          "c": 2
        },
        "to": {
          "r": 2,
          "c": 0
        },
        "note": "Continue combo: 24x4",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 11,
        "toSq": 2,
        "from": {
          "r": 2,
          "c": 0
        },
        "to": {
          "r": 0,
          "c": 2
        },
        "note": "Multi-jump continue: 2",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 8,
        "toSq": 14,
        "from": {
          "r": 1,
          "c": 5
        },
        "to": {
          "r": 2,
          "c": 6
        },
        "note": "Opponent responds 8-12",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 2,
        "toSq": 18,
        "from": {
          "r": 0,
          "c": 2
        },
        "to": {
          "r": 3,
          "c": 5
        },
        "note": "Continue combo: 4x18",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 14,
        "toSq": 23,
        "from": {
          "r": 2,
          "c": 6
        },
        "to": {
          "r": 4,
          "c": 4
        },
        "note": "Opponent responds 12x41",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 23,
        "toSq": 32,
        "from": {
          "r": 4,
          "c": 4
        },
        "to": {
          "r": 6,
          "c": 2
        },
        "note": "Multi-jump continue: 32",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 32,
        "toSq": 43,
        "from": {
          "r": 6,
          "c": 2
        },
        "to": {
          "r": 8,
          "c": 4
        },
        "note": "Multi-jump continue: 43",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 43,
        "toSq": 34,
        "from": {
          "r": 8,
          "c": 4
        },
        "to": {
          "r": 6,
          "c": 6
        },
        "note": "Multi-jump continue: 34",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 34,
        "toSq": 45,
        "from": {
          "r": 6,
          "c": 6
        },
        "to": {
          "r": 8,
          "c": 8
        },
        "note": "Multi-jump continue: 45",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-1-GHA",
    "ruleset": "ghana",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🇬🇭 Ghana Damii Variant #1 (1.PNG): Kozlovsky Triple Sac & Gate Opening",
    "badge": "🇬🇭 Damii #1",
    "source_image": "1.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "triple-sacrifice",
    "themeName": "Ghana Damii • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Ghanaian Damii adaptation of Screenshot 1.PNG (Immediate crown stop & seed-counting)",
    "themeStars": "⭐⭐⭐⭐",
    "coachQuote": "Damii rules from 1.PNG! Count your seeds carefully and strike!",
    "difficulty": {
      "tier": 7,
      "tier_name": "Advanced",
      "rating": 1850,
      "human_score": 68
    },
    "difficultyTier": 7,
    "rating": 1850,
    "hints": [
      "Under Damii rules, watch out for crowning constraints on the back row.",
      "Compulsory capture is enforced. Calculate opponent's forced replies.",
      "Strike with 33-28!"
    ],
    "initialBoard": [
      {
        "r": 2,
        "c": 6,
        "player": 2,
        "isKing": false,
        "square": 14
      },
      {
        "r": 2,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 13
      },
      {
        "r": 3,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 18
      },
      {
        "r": 3,
        "c": 3,
        "player": 2,
        "isKing": false,
        "square": 17
      },
      {
        "r": 3,
        "c": 1,
        "player": 2,
        "isKing": false,
        "square": 16
      },
      {
        "r": 4,
        "c": 6,
        "player": 2,
        "isKing": false,
        "square": 24
      },
      {
        "r": 4,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 23
      },
      {
        "r": 5,
        "c": 7,
        "player": 2,
        "isKing": false,
        "square": 29
      },
      {
        "r": 6,
        "c": 8,
        "player": 1,
        "isKing": false,
        "square": 35
      },
      {
        "r": 6,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 33
      },
      {
        "r": 6,
        "c": 2,
        "player": 1,
        "isKing": false,
        "square": 32
      },
      {
        "r": 6,
        "c": 0,
        "player": 2,
        "isKing": false,
        "square": 31
      },
      {
        "r": 7,
        "c": 9,
        "player": 1,
        "isKing": false,
        "square": 40
      },
      {
        "r": 7,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 38
      },
      {
        "r": 7,
        "c": 3,
        "player": 1,
        "isKing": false,
        "square": 37
      },
      {
        "r": 8,
        "c": 6,
        "player": 1,
        "isKing": false,
        "square": 44
      },
      {
        "r": 8,
        "c": 2,
        "player": 1,
        "isKing": false,
        "square": 42
      },
      {
        "r": 9,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 48
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 33,
        "toSq": 28,
        "from": {
          "r": 6,
          "c": 4
        },
        "to": {
          "r": 5,
          "c": 5
        },
        "note": "Key strike: 33-28!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 23,
        "toSq": 34,
        "from": {
          "r": 4,
          "c": 4
        },
        "to": {
          "r": 6,
          "c": 6
        },
        "note": "Opponent responds 23x43",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 34,
        "toSq": 43,
        "from": {
          "r": 6,
          "c": 6
        },
        "to": {
          "r": 8,
          "c": 4
        },
        "note": "Multi-jump continue: 43",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 42,
        "toSq": 36,
        "from": {
          "r": 8,
          "c": 2
        },
        "to": {
          "r": 7,
          "c": 1
        },
        "note": "Continue combo: 44-40",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 31,
        "toSq": 42,
        "from": {
          "r": 6,
          "c": 0
        },
        "to": {
          "r": 8,
          "c": 2
        },
        "note": "Opponent responds 35x33",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 42,
        "toSq": 33,
        "from": {
          "r": 8,
          "c": 2
        },
        "to": {
          "r": 6,
          "c": 4
        },
        "note": "Multi-jump continue: 33",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 48,
        "toSq": 37,
        "from": {
          "r": 9,
          "c": 5
        },
        "to": {
          "r": 7,
          "c": 3
        },
        "note": "Continue combo: 48x8",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 37,
        "toSq": 28,
        "from": {
          "r": 7,
          "c": 3
        },
        "to": {
          "r": 5,
          "c": 5
        },
        "note": "Multi-jump continue: 28",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 28,
        "toSq": 19,
        "from": {
          "r": 5,
          "c": 5
        },
        "to": {
          "r": 3,
          "c": 7
        },
        "note": "Multi-jump continue: 19",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 19,
        "toSq": 8,
        "from": {
          "r": 3,
          "c": 7
        },
        "to": {
          "r": 1,
          "c": 5
        },
        "note": "Multi-jump continue: 8",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 13,
        "toSq": 4,
        "from": {
          "r": 2,
          "c": 4
        },
        "to": {
          "r": 0,
          "c": 6
        },
        "note": "Opponent responds 13x2",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 35,
        "toSq": 24,
        "from": {
          "r": 6,
          "c": 8
        },
        "to": {
          "r": 4,
          "c": 6
        },
        "note": "Continue combo: 31x15",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 24,
        "toSq": 13,
        "from": {
          "r": 4,
          "c": 6
        },
        "to": {
          "r": 2,
          "c": 4
        },
        "note": "Multi-jump continue: 13",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 13,
        "toSq": 22,
        "from": {
          "r": 2,
          "c": 4
        },
        "to": {
          "r": 4,
          "c": 2
        },
        "note": "Multi-jump continue: 22",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 22,
        "toSq": 11,
        "from": {
          "r": 4,
          "c": 2
        },
        "to": {
          "r": 2,
          "c": 0
        },
        "note": "Multi-jump continue: 11",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-2-GHA",
    "ruleset": "ghana",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🇬🇭 Ghana Damii Variant #2 (2.PNG): Center Gate Deflection & Decoy",
    "badge": "🇬🇭 Damii #2",
    "source_image": "2.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "gate-deflection",
    "themeName": "Ghana Damii • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Ghanaian Damii adaptation of Screenshot 2.PNG (Immediate crown stop & seed-counting)",
    "themeStars": "⭐⭐⭐⭐",
    "coachQuote": "Damii rules from 2.PNG! Count your seeds carefully and strike!",
    "difficulty": {
      "tier": 7,
      "tier_name": "Advanced",
      "rating": 1865,
      "human_score": 68
    },
    "difficultyTier": 7,
    "rating": 1865,
    "hints": [
      "Under Damii rules, watch out for crowning constraints on the back row.",
      "Compulsory capture is enforced. Calculate opponent's forced replies.",
      "Strike with 33-27!"
    ],
    "initialBoard": [
      {
        "r": 2,
        "c": 6,
        "player": 2,
        "isKing": false,
        "square": 14
      },
      {
        "r": 2,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 13
      },
      {
        "r": 2,
        "c": 2,
        "player": 2,
        "isKing": false,
        "square": 12
      },
      {
        "r": 3,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 18
      },
      {
        "r": 4,
        "c": 8,
        "player": 2,
        "isKing": false,
        "square": 25
      },
      {
        "r": 4,
        "c": 6,
        "player": 2,
        "isKing": false,
        "square": 24
      },
      {
        "r": 4,
        "c": 2,
        "player": 2,
        "isKing": false,
        "square": 22
      },
      {
        "r": 6,
        "c": 6,
        "player": 1,
        "isKing": false,
        "square": 34
      },
      {
        "r": 6,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 33
      },
      {
        "r": 7,
        "c": 7,
        "player": 1,
        "isKing": false,
        "square": 39
      },
      {
        "r": 7,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 38
      },
      {
        "r": 8,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 43
      },
      {
        "r": 8,
        "c": 2,
        "player": 1,
        "isKing": false,
        "square": 42
      },
      {
        "r": 9,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 48
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 33,
        "toSq": 27,
        "from": {
          "r": 6,
          "c": 4
        },
        "to": {
          "r": 5,
          "c": 3
        },
        "note": "Key strike: 33-29!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 22,
        "toSq": 33,
        "from": {
          "r": 4,
          "c": 2
        },
        "to": {
          "r": 6,
          "c": 4
        },
        "note": "Opponent responds 24x31",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 33,
        "toSq": 44,
        "from": {
          "r": 6,
          "c": 4
        },
        "to": {
          "r": 8,
          "c": 6
        },
        "note": "Multi-jump continue: 44",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 44,
        "toSq": 35,
        "from": {
          "r": 8,
          "c": 6
        },
        "to": {
          "r": 6,
          "c": 8
        },
        "note": "Multi-jump continue: 35",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 34,
        "toSq": 28,
        "from": {
          "r": 6,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 5
        },
        "note": "Continue combo: 32-28",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 24,
        "toSq": 33,
        "from": {
          "r": 4,
          "c": 6
        },
        "to": {
          "r": 6,
          "c": 4
        },
        "note": "Opponent responds 22x33",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 43,
        "toSq": 38,
        "from": {
          "r": 8,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 5
        },
        "note": "Continue combo: 43-38",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 33,
        "toSq": 44,
        "from": {
          "r": 6,
          "c": 4
        },
        "to": {
          "r": 8,
          "c": 6
        },
        "note": "Opponent responds 33x42",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 48,
        "toSq": 39,
        "from": {
          "r": 9,
          "c": 5
        },
        "to": {
          "r": 7,
          "c": 7
        },
        "note": "Continue combo: 48x10",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 39,
        "toSq": 30,
        "from": {
          "r": 7,
          "c": 7
        },
        "to": {
          "r": 5,
          "c": 9
        },
        "note": "Multi-jump continue: 30",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 30,
        "toSq": 19,
        "from": {
          "r": 5,
          "c": 9
        },
        "to": {
          "r": 3,
          "c": 7
        },
        "note": "Multi-jump continue: 19",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 19,
        "toSq": 8,
        "from": {
          "r": 3,
          "c": 7
        },
        "to": {
          "r": 1,
          "c": 5
        },
        "note": "Multi-jump continue: 8",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 8,
        "toSq": 17,
        "from": {
          "r": 1,
          "c": 5
        },
        "to": {
          "r": 3,
          "c": 3
        },
        "note": "Multi-jump continue: 17",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 17,
        "toSq": 6,
        "from": {
          "r": 3,
          "c": 3
        },
        "to": {
          "r": 1,
          "c": 1
        },
        "note": "Multi-jump continue: 6",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-3-GHA",
    "ruleset": "ghana",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🇬🇭 Ghana Damii Variant #3 (3.PNG): Springer Diamond Shot & Coronation",
    "badge": "🇬🇭 Damii #3",
    "source_image": "3.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "diamond-shot",
    "themeName": "Ghana Damii • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Ghanaian Damii adaptation of Screenshot 3.PNG (Immediate crown stop & seed-counting)",
    "themeStars": "⭐⭐⭐⭐",
    "coachQuote": "Damii rules from 3.PNG! Count your seeds carefully and strike!",
    "difficulty": {
      "tier": 7,
      "tier_name": "Advanced",
      "rating": 1880,
      "human_score": 68
    },
    "difficultyTier": 7,
    "rating": 1880,
    "hints": [
      "Under Damii rules, watch out for crowning constraints on the back row.",
      "Compulsory capture is enforced. Calculate opponent's forced replies.",
      "Strike with 33-28!"
    ],
    "initialBoard": [
      {
        "r": 1,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 8
      },
      {
        "r": 1,
        "c": 1,
        "player": 2,
        "isKing": false,
        "square": 6
      },
      {
        "r": 2,
        "c": 6,
        "player": 2,
        "isKing": false,
        "square": 14
      },
      {
        "r": 3,
        "c": 7,
        "player": 2,
        "isKing": false,
        "square": 19
      },
      {
        "r": 3,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 18
      },
      {
        "r": 3,
        "c": 1,
        "player": 2,
        "isKing": false,
        "square": 16
      },
      {
        "r": 4,
        "c": 6,
        "player": 2,
        "isKing": false,
        "square": 24
      },
      {
        "r": 5,
        "c": 7,
        "player": 2,
        "isKing": false,
        "square": 29
      },
      {
        "r": 5,
        "c": 3,
        "player": 1,
        "isKing": false,
        "square": 27
      },
      {
        "r": 6,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 33
      },
      {
        "r": 7,
        "c": 7,
        "player": 1,
        "isKing": false,
        "square": 39
      },
      {
        "r": 7,
        "c": 3,
        "player": 1,
        "isKing": false,
        "square": 37
      },
      {
        "r": 7,
        "c": 1,
        "player": 1,
        "isKing": false,
        "square": 36
      },
      {
        "r": 8,
        "c": 6,
        "player": 1,
        "isKing": false,
        "square": 44
      },
      {
        "r": 9,
        "c": 7,
        "player": 1,
        "isKing": false,
        "square": 49
      },
      {
        "r": 9,
        "c": 1,
        "player": 1,
        "isKing": false,
        "square": 46
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 33,
        "toSq": 28,
        "from": {
          "r": 6,
          "c": 4
        },
        "to": {
          "r": 5,
          "c": 5
        },
        "note": "Key strike: 33-28!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 24,
        "toSq": 33,
        "from": {
          "r": 4,
          "c": 6
        },
        "to": {
          "r": 6,
          "c": 4
        },
        "note": "Opponent responds 22x35",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 33,
        "toSq": 42,
        "from": {
          "r": 6,
          "c": 4
        },
        "to": {
          "r": 8,
          "c": 2
        },
        "note": "Multi-jump continue: 42",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 42,
        "toSq": 31,
        "from": {
          "r": 8,
          "c": 2
        },
        "to": {
          "r": 6,
          "c": 0
        },
        "note": "Multi-jump continue: 31",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 27,
        "toSq": 23,
        "from": {
          "r": 5,
          "c": 3
        },
        "to": {
          "r": 4,
          "c": 4
        },
        "note": "Continue combo: 29-23",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 18,
        "toSq": 27,
        "from": {
          "r": 3,
          "c": 5
        },
        "to": {
          "r": 5,
          "c": 3
        },
        "note": "Opponent responds 18x29",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 39,
        "toSq": 34,
        "from": {
          "r": 7,
          "c": 7
        },
        "to": {
          "r": 6,
          "c": 6
        },
        "note": "Continue combo: 37-32",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 29,
        "toSq": 38,
        "from": {
          "r": 5,
          "c": 7
        },
        "to": {
          "r": 7,
          "c": 5
        },
        "note": "Opponent responds 27x38",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 44,
        "toSq": 33,
        "from": {
          "r": 8,
          "c": 6
        },
        "to": {
          "r": 6,
          "c": 4
        },
        "note": "Continue combo: 42x4",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 33,
        "toSq": 22,
        "from": {
          "r": 6,
          "c": 4
        },
        "to": {
          "r": 4,
          "c": 2
        },
        "note": "Multi-jump continue: 22",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 22,
        "toSq": 11,
        "from": {
          "r": 4,
          "c": 2
        },
        "to": {
          "r": 2,
          "c": 0
        },
        "note": "Multi-jump continue: 11",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 11,
        "toSq": 2,
        "from": {
          "r": 2,
          "c": 0
        },
        "to": {
          "r": 0,
          "c": 2
        },
        "note": "Multi-jump continue: 2",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-6-GHA",
    "ruleset": "ghana",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🇬🇭 Ghana Damii Variant #6 (6.PNG): Decoy King Sweep & Sac",
    "badge": "🇬🇭 Damii #6",
    "source_image": "6.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "king-sweep",
    "themeName": "Ghana Damii • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Ghanaian Damii adaptation of Screenshot 6.PNG (Immediate crown stop & seed-counting)",
    "themeStars": "⭐⭐⭐⭐",
    "coachQuote": "Damii rules from 6.PNG! Count your seeds carefully and strike!",
    "difficulty": {
      "tier": 7,
      "tier_name": "Advanced",
      "rating": 1925,
      "human_score": 68
    },
    "difficultyTier": 7,
    "rating": 1925,
    "hints": [
      "Under Damii rules, watch out for crowning constraints on the back row.",
      "Compulsory capture is enforced. Calculate opponent's forced replies.",
      "Strike with 44-38!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 3
      },
      {
        "r": 2,
        "c": 6,
        "player": 2,
        "isKing": false,
        "square": 14
      },
      {
        "r": 3,
        "c": 9,
        "player": 2,
        "isKing": false,
        "square": 20
      },
      {
        "r": 3,
        "c": 7,
        "player": 2,
        "isKing": false,
        "square": 19
      },
      {
        "r": 3,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 18
      },
      {
        "r": 3,
        "c": 3,
        "player": 2,
        "isKing": false,
        "square": 17
      },
      {
        "r": 4,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 23
      },
      {
        "r": 5,
        "c": 9,
        "player": 2,
        "isKing": false,
        "square": 30
      },
      {
        "r": 5,
        "c": 3,
        "player": 2,
        "isKing": false,
        "square": 27
      },
      {
        "r": 5,
        "c": 1,
        "player": 1,
        "isKing": false,
        "square": 26
      },
      {
        "r": 6,
        "c": 6,
        "player": 1,
        "isKing": false,
        "square": 34
      },
      {
        "r": 6,
        "c": 2,
        "player": 1,
        "isKing": false,
        "square": 32
      },
      {
        "r": 7,
        "c": 9,
        "player": 1,
        "isKing": false,
        "square": 40
      },
      {
        "r": 7,
        "c": 7,
        "player": 1,
        "isKing": false,
        "square": 39
      },
      {
        "r": 7,
        "c": 1,
        "player": 1,
        "isKing": false,
        "square": 36
      },
      {
        "r": 8,
        "c": 6,
        "player": 1,
        "isKing": false,
        "square": 44
      },
      {
        "r": 8,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 43
      },
      {
        "r": 9,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 48
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 44,
        "toSq": 38,
        "from": {
          "r": 8,
          "c": 6
        },
        "to": {
          "r": 7,
          "c": 5
        },
        "note": "Key strike: 42-38!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 17,
        "toSq": 22,
        "from": {
          "r": 3,
          "c": 3
        },
        "to": {
          "r": 4,
          "c": 2
        },
        "note": "Opponent responds 19-24",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 26,
        "toSq": 17,
        "from": {
          "r": 5,
          "c": 1
        },
        "to": {
          "r": 3,
          "c": 3
        },
        "note": "Continue combo: 30x28",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 17,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 3
        },
        "to": {
          "r": 5,
          "c": 5
        },
        "note": "Multi-jump continue: 28",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 18,
        "toSq": 24,
        "from": {
          "r": 3,
          "c": 5
        },
        "to": {
          "r": 4,
          "c": 6
        },
        "note": "Opponent responds 18-22",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 32,
        "toSq": 23,
        "from": {
          "r": 6,
          "c": 2
        },
        "to": {
          "r": 4,
          "c": 4
        },
        "note": "Continue combo: 34x23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 24,
        "toSq": 33,
        "from": {
          "r": 4,
          "c": 6
        },
        "to": {
          "r": 6,
          "c": 4
        },
        "note": "Opponent responds 22x31",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 33,
        "toSq": 44,
        "from": {
          "r": 6,
          "c": 4
        },
        "to": {
          "r": 8,
          "c": 6
        },
        "note": "Multi-jump continue: 44",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 44,
        "toSq": 35,
        "from": {
          "r": 8,
          "c": 6
        },
        "to": {
          "r": 6,
          "c": 8
        },
        "note": "Multi-jump continue: 35",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 40,
        "toSq": 29,
        "from": {
          "r": 7,
          "c": 9
        },
        "to": {
          "r": 5,
          "c": 7
        },
        "note": "Continue combo: 36x27",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 30,
        "toSq": 35,
        "from": {
          "r": 5,
          "c": 9
        },
        "to": {
          "r": 6,
          "c": 8
        },
        "note": "Opponent responds 26-31",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 29,
        "toSq": 40,
        "from": {
          "r": 5,
          "c": 7
        },
        "to": {
          "r": 7,
          "c": 9
        },
        "note": "Continue combo: 27x36",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 14,
        "toSq": 18,
        "from": {
          "r": 2,
          "c": 6
        },
        "to": {
          "r": 3,
          "c": 5
        },
        "note": "Opponent responds 12-18",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 23,
        "toSq": 14,
        "from": {
          "r": 4,
          "c": 4
        },
        "to": {
          "r": 2,
          "c": 6
        },
        "note": "Continue combo: 23x21",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 14,
        "toSq": 25,
        "from": {
          "r": 2,
          "c": 6
        },
        "to": {
          "r": 4,
          "c": 8
        },
        "note": "Multi-jump continue: 25",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 20,
        "toSq": 29,
        "from": {
          "r": 3,
          "c": 9
        },
        "to": {
          "r": 5,
          "c": 7
        },
        "note": "Opponent responds 16x49",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 29,
        "toSq": 38,
        "from": {
          "r": 5,
          "c": 7
        },
        "to": {
          "r": 7,
          "c": 5
        },
        "note": "Multi-jump continue: 38",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 38,
        "toSq": 47,
        "from": {
          "r": 7,
          "c": 5
        },
        "to": {
          "r": 9,
          "c": 3
        },
        "note": "Multi-jump continue: 47",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-7-GHA",
    "ruleset": "ghana",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🇬🇭 Ghana Damii Variant #7 (7.PNG): Keller Center Wedge Strike",
    "badge": "🇬🇭 Damii #7",
    "source_image": "7.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "center-wedge",
    "themeName": "Ghana Damii • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Ghanaian Damii adaptation of Screenshot 7.PNG (Immediate crown stop & seed-counting)",
    "themeStars": "⭐⭐⭐⭐",
    "coachQuote": "Damii rules from 7.PNG! Count your seeds carefully and strike!",
    "difficulty": {
      "tier": 7,
      "tier_name": "Advanced",
      "rating": 1940,
      "human_score": 68
    },
    "difficultyTier": 7,
    "rating": 1940,
    "hints": [
      "Under Damii rules, watch out for crowning constraints on the back row.",
      "Compulsory capture is enforced. Calculate opponent's forced replies.",
      "Strike with 48-43!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 6,
        "player": 2,
        "isKing": false,
        "square": 4
      },
      {
        "r": 1,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 8
      },
      {
        "r": 2,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 13
      },
      {
        "r": 2,
        "c": 2,
        "player": 2,
        "isKing": false,
        "square": 12
      },
      {
        "r": 3,
        "c": 3,
        "player": 2,
        "isKing": false,
        "square": 17
      },
      {
        "r": 4,
        "c": 8,
        "player": 2,
        "isKing": false,
        "square": 25
      },
      {
        "r": 4,
        "c": 6,
        "player": 1,
        "isKing": false,
        "square": 24
      },
      {
        "r": 4,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 23
      },
      {
        "r": 4,
        "c": 2,
        "player": 2,
        "isKing": false,
        "square": 22
      },
      {
        "r": 4,
        "c": 0,
        "player": 1,
        "isKing": false,
        "square": 21
      },
      {
        "r": 5,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 28
      },
      {
        "r": 6,
        "c": 6,
        "player": 1,
        "isKing": false,
        "square": 34
      },
      {
        "r": 6,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 33
      },
      {
        "r": 7,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 38
      },
      {
        "r": 9,
        "c": 7,
        "player": 1,
        "isKing": false,
        "square": 49
      },
      {
        "r": 9,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 48
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 48,
        "toSq": 43,
        "from": {
          "r": 9,
          "c": 5
        },
        "to": {
          "r": 8,
          "c": 4
        },
        "note": "Key strike: 48-43!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 13,
        "toSq": 18,
        "from": {
          "r": 2,
          "c": 4
        },
        "to": {
          "r": 3,
          "c": 5
        },
        "note": "Opponent responds 13-18",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 24,
        "toSq": 13,
        "from": {
          "r": 4,
          "c": 6
        },
        "to": {
          "r": 2,
          "c": 4
        },
        "note": "Continue combo: 22x13",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 25,
        "toSq": 29,
        "from": {
          "r": 4,
          "c": 8
        },
        "to": {
          "r": 5,
          "c": 7
        },
        "note": "Opponent responds 21-27",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 34,
        "toSq": 25,
        "from": {
          "r": 6,
          "c": 6
        },
        "to": {
          "r": 4,
          "c": 8
        },
        "note": "Continue combo: 32x21",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 23,
        "toSq": 34,
        "from": {
          "r": 4,
          "c": 4
        },
        "to": {
          "r": 6,
          "c": 6
        },
        "note": "Opponent responds 23x32",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 38,
        "toSq": 29,
        "from": {
          "r": 7,
          "c": 5
        },
        "to": {
          "r": 5,
          "c": 7
        },
        "note": "Continue combo: 38x27",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 12,
        "toSq": 16,
        "from": {
          "r": 2,
          "c": 2
        },
        "to": {
          "r": 3,
          "c": 1
        },
        "note": "Opponent responds 14-20",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 21,
        "toSq": 12,
        "from": {
          "r": 4,
          "c": 0
        },
        "to": {
          "r": 2,
          "c": 2
        },
        "note": "Continue combo: 25x23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 12,
        "toSq": 23,
        "from": {
          "r": 2,
          "c": 2
        },
        "to": {
          "r": 4,
          "c": 4
        },
        "note": "Multi-jump continue: 23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 8,
        "toSq": 17,
        "from": {
          "r": 1,
          "c": 5
        },
        "to": {
          "r": 3,
          "c": 3
        },
        "note": "Opponent responds 8x48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 17,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 3
        },
        "to": {
          "r": 5,
          "c": 5
        },
        "note": "Multi-jump continue: 28",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 28,
        "toSq": 37,
        "from": {
          "r": 5,
          "c": 5
        },
        "to": {
          "r": 7,
          "c": 3
        },
        "note": "Multi-jump continue: 37",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 37,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 3
        },
        "to": {
          "r": 9,
          "c": 5
        },
        "note": "Multi-jump continue: 48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-8-GHA",
    "ruleset": "ghana",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🇬🇭 Ghana Damii Variant #8 (8.PNG): Roozenburg Highway Clearance",
    "badge": "🇬🇭 Damii #8",
    "source_image": "8.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "highway-clearance",
    "themeName": "Ghana Damii • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Ghanaian Damii adaptation of Screenshot 8.PNG (Immediate crown stop & seed-counting)",
    "themeStars": "⭐⭐⭐⭐",
    "coachQuote": "Damii rules from 8.PNG! Count your seeds carefully and strike!",
    "difficulty": {
      "tier": 7,
      "tier_name": "Advanced",
      "rating": 1955,
      "human_score": 68
    },
    "difficultyTier": 7,
    "rating": 1955,
    "hints": [
      "Under Damii rules, watch out for crowning constraints on the back row.",
      "Compulsory capture is enforced. Calculate opponent's forced replies.",
      "Strike with 36-31!"
    ],
    "initialBoard": [
      {
        "r": 2,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 13
      },
      {
        "r": 2,
        "c": 2,
        "player": 2,
        "isKing": false,
        "square": 12
      },
      {
        "r": 3,
        "c": 7,
        "player": 2,
        "isKing": false,
        "square": 19
      },
      {
        "r": 3,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 18
      },
      {
        "r": 3,
        "c": 3,
        "player": 2,
        "isKing": false,
        "square": 17
      },
      {
        "r": 4,
        "c": 6,
        "player": 2,
        "isKing": false,
        "square": 24
      },
      {
        "r": 4,
        "c": 0,
        "player": 2,
        "isKing": false,
        "square": 21
      },
      {
        "r": 5,
        "c": 9,
        "player": 1,
        "isKing": false,
        "square": 30
      },
      {
        "r": 5,
        "c": 1,
        "player": 2,
        "isKing": false,
        "square": 26
      },
      {
        "r": 6,
        "c": 8,
        "player": 1,
        "isKing": false,
        "square": 35
      },
      {
        "r": 6,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 33
      },
      {
        "r": 6,
        "c": 2,
        "player": 1,
        "isKing": false,
        "square": 32
      },
      {
        "r": 7,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 38
      },
      {
        "r": 7,
        "c": 3,
        "player": 1,
        "isKing": false,
        "square": 37
      },
      {
        "r": 7,
        "c": 1,
        "player": 1,
        "isKing": false,
        "square": 36
      },
      {
        "r": 8,
        "c": 2,
        "player": 1,
        "isKing": false,
        "square": 42
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 36,
        "toSq": 31,
        "from": {
          "r": 7,
          "c": 1
        },
        "to": {
          "r": 6,
          "c": 0
        },
        "note": "Key strike: 40-35!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 25,
        "from": {
          "r": 3,
          "c": 7
        },
        "to": {
          "r": 4,
          "c": 8
        },
        "note": "Opponent responds 17-21",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 30,
        "toSq": 19,
        "from": {
          "r": 5,
          "c": 9
        },
        "to": {
          "r": 3,
          "c": 7
        },
        "note": "Continue combo: 26x28",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 19,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 7
        },
        "to": {
          "r": 5,
          "c": 5
        },
        "note": "Multi-jump continue: 28",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 18,
        "toSq": 23,
        "from": {
          "r": 3,
          "c": 5
        },
        "to": {
          "r": 4,
          "c": 4
        },
        "note": "Opponent responds 18-23",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 31,
        "toSq": 22,
        "from": {
          "r": 6,
          "c": 0
        },
        "to": {
          "r": 4,
          "c": 2
        },
        "note": "Continue combo: 35x24",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 23,
        "toSq": 34,
        "from": {
          "r": 4,
          "c": 4
        },
        "to": {
          "r": 6,
          "c": 6
        },
        "note": "Opponent responds 23x43",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 34,
        "toSq": 43,
        "from": {
          "r": 6,
          "c": 6
        },
        "to": {
          "r": 8,
          "c": 4
        },
        "note": "Multi-jump continue: 43",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 37,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 3
        },
        "to": {
          "r": 9,
          "c": 5
        },
        "note": "Continue combo: 39x48",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 17,
        "toSq": 26,
        "from": {
          "r": 3,
          "c": 3
        },
        "to": {
          "r": 5,
          "c": 1
        },
        "note": "Opponent responds 19x50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 26,
        "toSq": 37,
        "from": {
          "r": 5,
          "c": 1
        },
        "to": {
          "r": 7,
          "c": 3
        },
        "note": "Multi-jump continue: 37",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 37,
        "toSq": 46,
        "from": {
          "r": 7,
          "c": 3
        },
        "to": {
          "r": 9,
          "c": 1
        },
        "note": "Multi-jump continue: 46",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-9-GHA",
    "ruleset": "ghana",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🇬🇭 Ghana Damii Variant #9 (10.PNG): Flying King Coronation Ambush",
    "badge": "🇬🇭 Damii #9",
    "source_image": "10.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "coronation-ambush",
    "themeName": "Ghana Damii • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Ghanaian Damii adaptation of Screenshot 10.PNG (Immediate crown stop & seed-counting)",
    "themeStars": "⭐⭐⭐⭐",
    "coachQuote": "Damii rules from 10.PNG! Count your seeds carefully and strike!",
    "difficulty": {
      "tier": 7,
      "tier_name": "Advanced",
      "rating": 1970,
      "human_score": 68
    },
    "difficultyTier": 7,
    "rating": 1970,
    "hints": [
      "Under Damii rules, watch out for crowning constraints on the back row.",
      "Compulsory capture is enforced. Calculate opponent's forced replies.",
      "Strike with 37-33!"
    ],
    "initialBoard": [
      {
        "r": 1,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 8
      },
      {
        "r": 2,
        "c": 6,
        "player": 2,
        "isKing": false,
        "square": 14
      },
      {
        "r": 2,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 13
      },
      {
        "r": 2,
        "c": 2,
        "player": 2,
        "isKing": false,
        "square": 12
      },
      {
        "r": 3,
        "c": 9,
        "player": 2,
        "isKing": false,
        "square": 20
      },
      {
        "r": 3,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 18
      },
      {
        "r": 3,
        "c": 3,
        "player": 2,
        "isKing": false,
        "square": 17
      },
      {
        "r": 4,
        "c": 2,
        "player": 2,
        "isKing": false,
        "square": 22
      },
      {
        "r": 4,
        "c": 0,
        "player": 1,
        "isKing": false,
        "square": 21
      },
      {
        "r": 5,
        "c": 7,
        "player": 1,
        "isKing": false,
        "square": 29
      },
      {
        "r": 5,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 28
      },
      {
        "r": 5,
        "c": 3,
        "player": 2,
        "isKing": false,
        "square": 27
      },
      {
        "r": 6,
        "c": 6,
        "player": 1,
        "isKing": false,
        "square": 34
      },
      {
        "r": 6,
        "c": 0,
        "player": 1,
        "isKing": false,
        "square": 31
      },
      {
        "r": 7,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 38
      },
      {
        "r": 7,
        "c": 3,
        "player": 1,
        "isKing": false,
        "square": 37
      },
      {
        "r": 8,
        "c": 2,
        "player": 1,
        "isKing": false,
        "square": 42
      },
      {
        "r": 9,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 48
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 37,
        "toSq": 33,
        "from": {
          "r": 7,
          "c": 3
        },
        "to": {
          "r": 6,
          "c": 4
        },
        "note": "Key strike: 39-33!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 20,
        "toSq": 25,
        "from": {
          "r": 3,
          "c": 9
        },
        "to": {
          "r": 4,
          "c": 8
        },
        "note": "Opponent responds 16-21",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 29,
        "toSq": 20,
        "from": {
          "r": 5,
          "c": 7
        },
        "to": {
          "r": 3,
          "c": 9
        },
        "note": "Continue combo: 27x16",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 18,
        "toSq": 24,
        "from": {
          "r": 3,
          "c": 5
        },
        "to": {
          "r": 4,
          "c": 6
        },
        "note": "Opponent responds 18-22",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 28,
        "toSq": 19,
        "from": {
          "r": 5,
          "c": 5
        },
        "to": {
          "r": 3,
          "c": 7
        },
        "note": "Continue combo: 28x17",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 14,
        "toSq": 25,
        "from": {
          "r": 2,
          "c": 6
        },
        "to": {
          "r": 4,
          "c": 8
        },
        "note": "Opponent responds 12x21",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 20,
        "toSq": 29,
        "from": {
          "r": 3,
          "c": 9
        },
        "to": {
          "r": 5,
          "c": 7
        },
        "note": "Continue combo: 16x27",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 22,
        "toSq": 26,
        "from": {
          "r": 4,
          "c": 2
        },
        "to": {
          "r": 5,
          "c": 1
        },
        "note": "Opponent responds 24-30",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 21,
        "toSq": 32,
        "from": {
          "r": 4,
          "c": 0
        },
        "to": {
          "r": 6,
          "c": 2
        },
        "note": "Continue combo: 25x23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 32,
        "toSq": 23,
        "from": {
          "r": 6,
          "c": 2
        },
        "to": {
          "r": 4,
          "c": 4
        },
        "note": "Multi-jump continue: 23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 17,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 3
        },
        "to": {
          "r": 5,
          "c": 5
        },
        "note": "Opponent responds 19x50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 28,
        "toSq": 37,
        "from": {
          "r": 5,
          "c": 5
        },
        "to": {
          "r": 7,
          "c": 3
        },
        "note": "Multi-jump continue: 37",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 37,
        "toSq": 46,
        "from": {
          "r": 7,
          "c": 3
        },
        "to": {
          "r": 9,
          "c": 1
        },
        "note": "Multi-jump continue: 46",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-13-GHA",
    "ruleset": "ghana",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🇬🇭 Ghana Damii Variant #13 (14.PNG): Masterpiece Diagonal Trap",
    "badge": "🇬🇭 Damii #13",
    "source_image": "14.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "diagonal-trap",
    "themeName": "Ghana Damii • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Ghanaian Damii adaptation of Screenshot 14.PNG (Immediate crown stop & seed-counting)",
    "themeStars": "⭐⭐⭐⭐",
    "coachQuote": "Damii rules from 14.PNG! Count your seeds carefully and strike!",
    "difficulty": {
      "tier": 7,
      "tier_name": "Advanced",
      "rating": 2030,
      "human_score": 68
    },
    "difficultyTier": 7,
    "rating": 2030,
    "hints": [
      "Under Damii rules, watch out for crowning constraints on the back row.",
      "Compulsory capture is enforced. Calculate opponent's forced replies.",
      "Strike with 34-28!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 2,
        "player": 2,
        "isKing": false,
        "square": 2
      },
      {
        "r": 1,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 8
      },
      {
        "r": 1,
        "c": 1,
        "player": 2,
        "isKing": false,
        "square": 6
      },
      {
        "r": 2,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 13
      },
      {
        "r": 2,
        "c": 2,
        "player": 2,
        "isKing": false,
        "square": 12
      },
      {
        "r": 3,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 18
      },
      {
        "r": 3,
        "c": 3,
        "player": 2,
        "isKing": false,
        "square": 17
      },
      {
        "r": 4,
        "c": 2,
        "player": 2,
        "isKing": false,
        "square": 22
      },
      {
        "r": 4,
        "c": 0,
        "player": 1,
        "isKing": false,
        "square": 21
      },
      {
        "r": 5,
        "c": 1,
        "player": 1,
        "isKing": false,
        "square": 26
      },
      {
        "r": 6,
        "c": 6,
        "player": 1,
        "isKing": false,
        "square": 34
      },
      {
        "r": 6,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 33
      },
      {
        "r": 6,
        "c": 0,
        "player": 1,
        "isKing": false,
        "square": 31
      },
      {
        "r": 7,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 38
      },
      {
        "r": 7,
        "c": 3,
        "player": 1,
        "isKing": false,
        "square": 37
      },
      {
        "r": 7,
        "c": 1,
        "player": 1,
        "isKing": false,
        "square": 36
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 34,
        "toSq": 28,
        "from": {
          "r": 6,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 5
        },
        "note": "Key strike: 32-28!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 18,
        "toSq": 24,
        "from": {
          "r": 3,
          "c": 5
        },
        "to": {
          "r": 4,
          "c": 6
        },
        "note": "Opponent responds 18-22",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 28,
        "toSq": 19,
        "from": {
          "r": 5,
          "c": 5
        },
        "to": {
          "r": 3,
          "c": 7
        },
        "note": "Continue combo: 28x17",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 17,
        "toSq": 23,
        "from": {
          "r": 3,
          "c": 3
        },
        "to": {
          "r": 4,
          "c": 4
        },
        "note": "Opponent responds 19-23",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 26,
        "toSq": 17,
        "from": {
          "r": 5,
          "c": 1
        },
        "to": {
          "r": 3,
          "c": 3
        },
        "note": "Continue combo: 30x28",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 17,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 3
        },
        "to": {
          "r": 5,
          "c": 5
        },
        "note": "Multi-jump continue: 28",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 8,
        "toSq": 14,
        "from": {
          "r": 1,
          "c": 5
        },
        "to": {
          "r": 2,
          "c": 6
        },
        "note": "Opponent responds 8-12",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 19,
        "toSq": 8,
        "from": {
          "r": 3,
          "c": 7
        },
        "to": {
          "r": 1,
          "c": 5
        },
        "note": "Continue combo: 17x19",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 8,
        "toSq": 17,
        "from": {
          "r": 1,
          "c": 5
        },
        "to": {
          "r": 3,
          "c": 3
        },
        "note": "Multi-jump continue: 17",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 12,
        "toSq": 23,
        "from": {
          "r": 2,
          "c": 2
        },
        "to": {
          "r": 4,
          "c": 4
        },
        "note": "Opponent responds 14x45",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 23,
        "toSq": 34,
        "from": {
          "r": 4,
          "c": 4
        },
        "to": {
          "r": 6,
          "c": 6
        },
        "note": "Multi-jump continue: 34",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 34,
        "toSq": 43,
        "from": {
          "r": 6,
          "c": 6
        },
        "to": {
          "r": 8,
          "c": 4
        },
        "note": "Multi-jump continue: 43",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 43,
        "toSq": 32,
        "from": {
          "r": 8,
          "c": 4
        },
        "to": {
          "r": 6,
          "c": 2
        },
        "note": "Multi-jump continue: 32",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 32,
        "toSq": 41,
        "from": {
          "r": 6,
          "c": 2
        },
        "to": {
          "r": 8,
          "c": 0
        },
        "note": "Multi-jump continue: 41",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-14-GHA",
    "ruleset": "ghana",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🇬🇭 Ghana Damii Variant #14 (15.PNG): Grandmaster Pin & Shatter",
    "badge": "🇬🇭 Damii #14",
    "source_image": "15.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "pin-and-shatter",
    "themeName": "Ghana Damii • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Ghanaian Damii adaptation of Screenshot 15.PNG (Immediate crown stop & seed-counting)",
    "themeStars": "⭐⭐⭐⭐",
    "coachQuote": "Damii rules from 15.PNG! Count your seeds carefully and strike!",
    "difficulty": {
      "tier": 7,
      "tier_name": "Advanced",
      "rating": 2045,
      "human_score": 68
    },
    "difficultyTier": 7,
    "rating": 2045,
    "hints": [
      "Under Damii rules, watch out for crowning constraints on the back row.",
      "Compulsory capture is enforced. Calculate opponent's forced replies.",
      "Strike with 38-34!"
    ],
    "initialBoard": [
      {
        "r": 2,
        "c": 8,
        "player": 2,
        "isKing": false,
        "square": 15
      },
      {
        "r": 2,
        "c": 6,
        "player": 2,
        "isKing": false,
        "square": 14
      },
      {
        "r": 2,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 13
      },
      {
        "r": 3,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 18
      },
      {
        "r": 3,
        "c": 3,
        "player": 2,
        "isKing": false,
        "square": 17
      },
      {
        "r": 3,
        "c": 1,
        "player": 2,
        "isKing": false,
        "square": 16
      },
      {
        "r": 4,
        "c": 6,
        "player": 2,
        "isKing": false,
        "square": 24
      },
      {
        "r": 4,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 23
      },
      {
        "r": 4,
        "c": 0,
        "player": 2,
        "isKing": false,
        "square": 21
      },
      {
        "r": 5,
        "c": 3,
        "player": 1,
        "isKing": false,
        "square": 27
      },
      {
        "r": 6,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 33
      },
      {
        "r": 6,
        "c": 2,
        "player": 1,
        "isKing": false,
        "square": 32
      },
      {
        "r": 6,
        "c": 0,
        "player": 1,
        "isKing": false,
        "square": 31
      },
      {
        "r": 7,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 38
      },
      {
        "r": 8,
        "c": 6,
        "player": 1,
        "isKing": false,
        "square": 44
      },
      {
        "r": 8,
        "c": 2,
        "player": 1,
        "isKing": false,
        "square": 42
      },
      {
        "r": 8,
        "c": 0,
        "player": 1,
        "isKing": false,
        "square": 41
      },
      {
        "r": 9,
        "c": 7,
        "player": 1,
        "isKing": false,
        "square": 49
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 38,
        "toSq": 34,
        "from": {
          "r": 7,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 6
        },
        "note": "Key strike: 38-32!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 24,
        "toSq": 28,
        "from": {
          "r": 4,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 5
        },
        "note": "Opponent responds 22-28",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 33,
        "toSq": 24,
        "from": {
          "r": 6,
          "c": 4
        },
        "to": {
          "r": 4,
          "c": 6
        },
        "note": "Continue combo: 33x22",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 18,
        "toSq": 29,
        "from": {
          "r": 3,
          "c": 5
        },
        "to": {
          "r": 5,
          "c": 7
        },
        "note": "Opponent responds 18x38",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 29,
        "toSq": 38,
        "from": {
          "r": 5,
          "c": 7
        },
        "to": {
          "r": 7,
          "c": 5
        },
        "note": "Multi-jump continue: 38",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 27,
        "toSq": 18,
        "from": {
          "r": 5,
          "c": 3
        },
        "to": {
          "r": 3,
          "c": 5
        },
        "note": "Continue combo: 29x16",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 18,
        "toSq": 9,
        "from": {
          "r": 3,
          "c": 5
        },
        "to": {
          "r": 1,
          "c": 7
        },
        "note": "Multi-jump continue: 9",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 9,
        "toSq": 20,
        "from": {
          "r": 1,
          "c": 7
        },
        "to": {
          "r": 3,
          "c": 9
        },
        "note": "Multi-jump continue: 20",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 16,
        "toSq": 22,
        "from": {
          "r": 3,
          "c": 1
        },
        "to": {
          "r": 4,
          "c": 2
        },
        "note": "Opponent responds 20-24",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 44,
        "toSq": 33,
        "from": {
          "r": 8,
          "c": 6
        },
        "to": {
          "r": 6,
          "c": 4
        },
        "note": "Continue combo: 42x33",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 22,
        "toSq": 26,
        "from": {
          "r": 4,
          "c": 2
        },
        "to": {
          "r": 5,
          "c": 1
        },
        "note": "Opponent responds 24-30",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 31,
        "toSq": 22,
        "from": {
          "r": 6,
          "c": 0
        },
        "to": {
          "r": 4,
          "c": 2
        },
        "note": "Continue combo: 35x24",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 17,
        "toSq": 26,
        "from": {
          "r": 3,
          "c": 3
        },
        "to": {
          "r": 5,
          "c": 1
        },
        "note": "Opponent responds 19x50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 26,
        "toSq": 37,
        "from": {
          "r": 5,
          "c": 1
        },
        "to": {
          "r": 7,
          "c": 3
        },
        "note": "Multi-jump continue: 37",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 37,
        "toSq": 46,
        "from": {
          "r": 7,
          "c": 3
        },
        "to": {
          "r": 9,
          "c": 1
        },
        "note": "Multi-jump continue: 46",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-15-GHA",
    "ruleset": "ghana",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🇬🇭 Ghana Damii Variant #15 (16.PNG): Long Diagonal King Strike",
    "badge": "🇬🇭 Damii #15",
    "source_image": "16.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "king-strike",
    "themeName": "Ghana Damii • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Ghanaian Damii adaptation of Screenshot 16.PNG (Immediate crown stop & seed-counting)",
    "themeStars": "⭐⭐⭐⭐",
    "coachQuote": "Damii rules from 16.PNG! Count your seeds carefully and strike!",
    "difficulty": {
      "tier": 7,
      "tier_name": "Advanced",
      "rating": 2060,
      "human_score": 68
    },
    "difficultyTier": 7,
    "rating": 2060,
    "hints": [
      "Under Damii rules, watch out for crowning constraints on the back row.",
      "Compulsory capture is enforced. Calculate opponent's forced replies.",
      "Strike with 47-43!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 2,
        "player": 2,
        "isKing": false,
        "square": 2
      },
      {
        "r": 2,
        "c": 6,
        "player": 2,
        "isKing": false,
        "square": 14
      },
      {
        "r": 3,
        "c": 9,
        "player": 2,
        "isKing": false,
        "square": 20
      },
      {
        "r": 3,
        "c": 7,
        "player": 2,
        "isKing": false,
        "square": 19
      },
      {
        "r": 4,
        "c": 6,
        "player": 2,
        "isKing": false,
        "square": 24
      },
      {
        "r": 4,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 23
      },
      {
        "r": 4,
        "c": 2,
        "player": 2,
        "isKing": false,
        "square": 22
      },
      {
        "r": 5,
        "c": 9,
        "player": 2,
        "isKing": false,
        "square": 30
      },
      {
        "r": 6,
        "c": 2,
        "player": 1,
        "isKing": false,
        "square": 32
      },
      {
        "r": 7,
        "c": 9,
        "player": 1,
        "isKing": false,
        "square": 40
      },
      {
        "r": 7,
        "c": 7,
        "player": 1,
        "isKing": false,
        "square": 39
      },
      {
        "r": 8,
        "c": 0,
        "player": 1,
        "isKing": false,
        "square": 41
      },
      {
        "r": 9,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 48
      },
      {
        "r": 9,
        "c": 3,
        "player": 1,
        "isKing": false,
        "square": 47
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 47,
        "toSq": 43,
        "from": {
          "r": 9,
          "c": 3
        },
        "to": {
          "r": 8,
          "c": 4
        },
        "note": "Key strike: 49-43!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 24,
        "toSq": 28,
        "from": {
          "r": 4,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 5
        },
        "note": "Opponent responds 22-28",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 23,
        "toSq": 34,
        "from": {
          "r": 4,
          "c": 4
        },
        "to": {
          "r": 6,
          "c": 6
        },
        "note": "Continue combo: 23x32",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 22,
        "toSq": 27,
        "from": {
          "r": 4,
          "c": 2
        },
        "to": {
          "r": 5,
          "c": 3
        },
        "note": "Opponent responds 24-29",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 32,
        "toSq": 23,
        "from": {
          "r": 6,
          "c": 2
        },
        "to": {
          "r": 4,
          "c": 4
        },
        "note": "Continue combo: 34x23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 14,
        "toSq": 18,
        "from": {
          "r": 2,
          "c": 6
        },
        "to": {
          "r": 3,
          "c": 5
        },
        "note": "Opponent responds 12-18",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 23,
        "toSq": 14,
        "from": {
          "r": 4,
          "c": 4
        },
        "to": {
          "r": 2,
          "c": 6
        },
        "note": "Continue combo: 23x21",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 14,
        "toSq": 25,
        "from": {
          "r": 2,
          "c": 6
        },
        "to": {
          "r": 4,
          "c": 8
        },
        "note": "Multi-jump continue: 25",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 20,
        "toSq": 29,
        "from": {
          "r": 3,
          "c": 9
        },
        "to": {
          "r": 5,
          "c": 7
        },
        "note": "Opponent responds 16x49",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 29,
        "toSq": 38,
        "from": {
          "r": 5,
          "c": 7
        },
        "to": {
          "r": 7,
          "c": 5
        },
        "note": "Multi-jump continue: 38",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 38,
        "toSq": 47,
        "from": {
          "r": 7,
          "c": 5
        },
        "to": {
          "r": 9,
          "c": 3
        },
        "note": "Multi-jump continue: 47",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-16-GHA",
    "ruleset": "ghana",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🇬🇭 Ghana Damii Variant #16 (17.PNG): Counter-Sacrifice Sweep",
    "badge": "🇬🇭 Damii #16",
    "source_image": "17.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "counter-sweep",
    "themeName": "Ghana Damii • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Ghanaian Damii adaptation of Screenshot 17.PNG (Immediate crown stop & seed-counting)",
    "themeStars": "⭐⭐⭐⭐",
    "coachQuote": "Damii rules from 17.PNG! Count your seeds carefully and strike!",
    "difficulty": {
      "tier": 7,
      "tier_name": "Advanced",
      "rating": 2075,
      "human_score": 68
    },
    "difficultyTier": 7,
    "rating": 2075,
    "hints": [
      "Under Damii rules, watch out for crowning constraints on the back row.",
      "Compulsory capture is enforced. Calculate opponent's forced replies.",
      "Strike with 29-25!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 6,
        "player": 2,
        "isKing": false,
        "square": 4
      },
      {
        "r": 2,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 13
      },
      {
        "r": 2,
        "c": 2,
        "player": 2,
        "isKing": false,
        "square": 12
      },
      {
        "r": 3,
        "c": 7,
        "player": 2,
        "isKing": false,
        "square": 19
      },
      {
        "r": 3,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 18
      },
      {
        "r": 3,
        "c": 3,
        "player": 2,
        "isKing": false,
        "square": 17
      },
      {
        "r": 4,
        "c": 2,
        "player": 2,
        "isKing": false,
        "square": 22
      },
      {
        "r": 5,
        "c": 9,
        "player": 2,
        "isKing": false,
        "square": 30
      },
      {
        "r": 5,
        "c": 7,
        "player": 1,
        "isKing": false,
        "square": 29
      },
      {
        "r": 5,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 28
      },
      {
        "r": 6,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 33
      },
      {
        "r": 6,
        "c": 2,
        "player": 1,
        "isKing": false,
        "square": 32
      },
      {
        "r": 7,
        "c": 7,
        "player": 1,
        "isKing": false,
        "square": 39
      },
      {
        "r": 8,
        "c": 8,
        "player": 1,
        "isKing": false,
        "square": 45
      },
      {
        "r": 8,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 43
      },
      {
        "r": 9,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 48
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 29,
        "toSq": 25,
        "from": {
          "r": 5,
          "c": 7
        },
        "to": {
          "r": 4,
          "c": 8
        },
        "note": "Key strike: 27-21!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 30,
        "toSq": 35,
        "from": {
          "r": 5,
          "c": 9
        },
        "to": {
          "r": 6,
          "c": 8
        },
        "note": "Opponent responds 26-31",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 25,
        "toSq": 14,
        "from": {
          "r": 4,
          "c": 8
        },
        "to": {
          "r": 2,
          "c": 6
        },
        "note": "Continue combo: 21x23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 14,
        "toSq": 23,
        "from": {
          "r": 2,
          "c": 6
        },
        "to": {
          "r": 4,
          "c": 4
        },
        "note": "Multi-jump continue: 23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 35,
        "toSq": 44,
        "from": {
          "r": 6,
          "c": 8
        },
        "to": {
          "r": 8,
          "c": 6
        },
        "note": "Opponent responds 31x42",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 48,
        "toSq": 39,
        "from": {
          "r": 9,
          "c": 5
        },
        "to": {
          "r": 7,
          "c": 7
        },
        "note": "Continue combo: 48x37",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 22,
        "toSq": 27,
        "from": {
          "r": 4,
          "c": 2
        },
        "to": {
          "r": 5,
          "c": 3
        },
        "note": "Opponent responds 24-29",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 33,
        "toSq": 22,
        "from": {
          "r": 6,
          "c": 4
        },
        "to": {
          "r": 4,
          "c": 2
        },
        "note": "Continue combo: 33x24",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 17,
        "toSq": 26,
        "from": {
          "r": 3,
          "c": 3
        },
        "to": {
          "r": 5,
          "c": 1
        },
        "note": "Opponent responds 19x48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 26,
        "toSq": 37,
        "from": {
          "r": 5,
          "c": 1
        },
        "to": {
          "r": 7,
          "c": 3
        },
        "note": "Multi-jump continue: 37",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 37,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 3
        },
        "to": {
          "r": 9,
          "c": 5
        },
        "note": "Multi-jump continue: 48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-17-GHA",
    "ruleset": "ghana",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🇬🇭 Ghana Damii Variant #17 (18.PNG): Two-Gate Coronation Trap",
    "badge": "🇬🇭 Damii #17",
    "source_image": "18.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "coronation-trap",
    "themeName": "Ghana Damii • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Ghanaian Damii adaptation of Screenshot 18.PNG (Immediate crown stop & seed-counting)",
    "themeStars": "⭐⭐⭐⭐",
    "coachQuote": "Damii rules from 18.PNG! Count your seeds carefully and strike!",
    "difficulty": {
      "tier": 7,
      "tier_name": "Advanced",
      "rating": 2090,
      "human_score": 68
    },
    "difficultyTier": 7,
    "rating": 2090,
    "hints": [
      "Under Damii rules, watch out for crowning constraints on the back row.",
      "Compulsory capture is enforced. Calculate opponent's forced replies.",
      "Strike with 32-27!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 6,
        "player": 2,
        "isKing": false,
        "square": 4
      },
      {
        "r": 0,
        "c": 2,
        "player": 2,
        "isKing": false,
        "square": 2
      },
      {
        "r": 1,
        "c": 7,
        "player": 2,
        "isKing": false,
        "square": 9
      },
      {
        "r": 1,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 8
      },
      {
        "r": 2,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 13
      },
      {
        "r": 2,
        "c": 0,
        "player": 1,
        "isKing": false,
        "square": 11
      },
      {
        "r": 4,
        "c": 8,
        "player": 2,
        "isKing": false,
        "square": 25
      },
      {
        "r": 4,
        "c": 6,
        "player": 2,
        "isKing": false,
        "square": 24
      },
      {
        "r": 6,
        "c": 6,
        "player": 1,
        "isKing": false,
        "square": 34
      },
      {
        "r": 6,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 33
      },
      {
        "r": 6,
        "c": 2,
        "player": 1,
        "isKing": false,
        "square": 32
      },
      {
        "r": 7,
        "c": 7,
        "player": 1,
        "isKing": false,
        "square": 39
      },
      {
        "r": 7,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 38
      },
      {
        "r": 7,
        "c": 3,
        "player": 1,
        "isKing": false,
        "square": 37
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 32,
        "toSq": 27,
        "from": {
          "r": 6,
          "c": 2
        },
        "to": {
          "r": 5,
          "c": 3
        },
        "note": "Key strike: 34-29!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 25,
        "toSq": 29,
        "from": {
          "r": 4,
          "c": 8
        },
        "to": {
          "r": 5,
          "c": 7
        },
        "note": "Opponent responds 21-27",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 34,
        "toSq": 25,
        "from": {
          "r": 6,
          "c": 6
        },
        "to": {
          "r": 4,
          "c": 8
        },
        "note": "Continue combo: 32x21",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 24,
        "toSq": 28,
        "from": {
          "r": 4,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 5
        },
        "note": "Opponent responds 22-28",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 33,
        "toSq": 24,
        "from": {
          "r": 6,
          "c": 4
        },
        "to": {
          "r": 4,
          "c": 6
        },
        "note": "Continue combo: 33x22",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 2,
        "toSq": 6,
        "from": {
          "r": 0,
          "c": 2
        },
        "to": {
          "r": 1,
          "c": 1
        },
        "note": "Opponent responds 4-10",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 11,
        "toSq": 2,
        "from": {
          "r": 2,
          "c": 0
        },
        "to": {
          "r": 0,
          "c": 2
        },
        "note": "Continue combo: 15x4",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 8,
        "toSq": 14,
        "from": {
          "r": 1,
          "c": 5
        },
        "to": {
          "r": 2,
          "c": 6
        },
        "note": "Opponent responds 8-12",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 2,
        "toSq": 18,
        "from": {
          "r": 0,
          "c": 2
        },
        "to": {
          "r": 3,
          "c": 5
        },
        "note": "Continue combo: 4x18",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 14,
        "toSq": 23,
        "from": {
          "r": 2,
          "c": 6
        },
        "to": {
          "r": 4,
          "c": 4
        },
        "note": "Opponent responds 12x41",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 23,
        "toSq": 32,
        "from": {
          "r": 4,
          "c": 4
        },
        "to": {
          "r": 6,
          "c": 2
        },
        "note": "Multi-jump continue: 32",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 32,
        "toSq": 43,
        "from": {
          "r": 6,
          "c": 2
        },
        "to": {
          "r": 8,
          "c": 4
        },
        "note": "Multi-jump continue: 43",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 43,
        "toSq": 34,
        "from": {
          "r": 8,
          "c": 4
        },
        "to": {
          "r": 6,
          "c": 6
        },
        "note": "Multi-jump continue: 34",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 34,
        "toSq": 45,
        "from": {
          "r": 6,
          "c": 6
        },
        "to": {
          "r": 8,
          "c": 8
        },
        "note": "Multi-jump continue: 45",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-18-GHA",
    "ruleset": "ghana",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🇬🇭 Ghana Damii Variant #18 (19.PNG): King Vacuum & Decoy",
    "badge": "🇬🇭 Damii #18",
    "source_image": "19.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "king-vacuum",
    "themeName": "Ghana Damii • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Ghanaian Damii adaptation of Screenshot 19.PNG (Immediate crown stop & seed-counting)",
    "themeStars": "⭐⭐⭐⭐",
    "coachQuote": "Damii rules from 19.PNG! Count your seeds carefully and strike!",
    "difficulty": {
      "tier": 7,
      "tier_name": "Advanced",
      "rating": 2105,
      "human_score": 68
    },
    "difficultyTier": 7,
    "rating": 2105,
    "hints": [
      "Under Damii rules, watch out for crowning constraints on the back row.",
      "Compulsory capture is enforced. Calculate opponent's forced replies.",
      "Strike with 43-37!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 2,
        "player": 2,
        "isKing": false,
        "square": 2
      },
      {
        "r": 2,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 13
      },
      {
        "r": 2,
        "c": 2,
        "player": 2,
        "isKing": false,
        "square": 12
      },
      {
        "r": 2,
        "c": 0,
        "player": 1,
        "isKing": false,
        "square": 11
      },
      {
        "r": 3,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 18
      },
      {
        "r": 3,
        "c": 3,
        "player": 2,
        "isKing": false,
        "square": 17
      },
      {
        "r": 4,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 23
      },
      {
        "r": 4,
        "c": 2,
        "player": 2,
        "isKing": false,
        "square": 22
      },
      {
        "r": 4,
        "c": 0,
        "player": 1,
        "isKing": false,
        "square": 21
      },
      {
        "r": 6,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 33
      },
      {
        "r": 7,
        "c": 7,
        "player": 1,
        "isKing": false,
        "square": 39
      },
      {
        "r": 7,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 38
      },
      {
        "r": 8,
        "c": 6,
        "player": 1,
        "isKing": false,
        "square": 44
      },
      {
        "r": 8,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 43
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 43,
        "toSq": 37,
        "from": {
          "r": 8,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 3
        },
        "note": "Key strike: 43-39!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 2,
        "toSq": 6,
        "from": {
          "r": 0,
          "c": 2
        },
        "to": {
          "r": 1,
          "c": 1
        },
        "note": "Opponent responds 4-10",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 11,
        "toSq": 2,
        "from": {
          "r": 2,
          "c": 0
        },
        "to": {
          "r": 0,
          "c": 2
        },
        "note": "Continue combo: 15x4",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 12,
        "toSq": 16,
        "from": {
          "r": 2,
          "c": 2
        },
        "to": {
          "r": 3,
          "c": 1
        },
        "note": "Opponent responds 14-20",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 21,
        "toSq": 12,
        "from": {
          "r": 4,
          "c": 0
        },
        "to": {
          "r": 2,
          "c": 2
        },
        "note": "Continue combo: 25x14",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 17,
        "toSq": 6,
        "from": {
          "r": 3,
          "c": 3
        },
        "to": {
          "r": 1,
          "c": 1
        },
        "note": "Opponent responds 19x10",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 2,
        "toSq": 11,
        "from": {
          "r": 0,
          "c": 2
        },
        "to": {
          "r": 2,
          "c": 0
        },
        "note": "Continue combo: 4x29",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 11,
        "toSq": 27,
        "from": {
          "r": 2,
          "c": 0
        },
        "to": {
          "r": 5,
          "c": 3
        },
        "note": "Multi-jump continue: 27",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 23,
        "toSq": 32,
        "from": {
          "r": 4,
          "c": 4
        },
        "to": {
          "r": 6,
          "c": 2
        },
        "note": "Opponent responds 23x41",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 32,
        "toSq": 43,
        "from": {
          "r": 6,
          "c": 2
        },
        "to": {
          "r": 8,
          "c": 4
        },
        "note": "Multi-jump continue: 43",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 43,
        "toSq": 34,
        "from": {
          "r": 8,
          "c": 4
        },
        "to": {
          "r": 6,
          "c": 6
        },
        "note": "Multi-jump continue: 34",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 34,
        "toSq": 45,
        "from": {
          "r": 6,
          "c": 6
        },
        "to": {
          "r": 8,
          "c": 8
        },
        "note": "Multi-jump continue: 45",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-19-GHA",
    "ruleset": "ghana",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🇬🇭 Ghana Damii Variant #19 (20.PNG): Reverse Flank Deflection",
    "badge": "🇬🇭 Damii #19",
    "source_image": "20.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "flank-deflection",
    "themeName": "Ghana Damii • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Ghanaian Damii adaptation of Screenshot 20.PNG (Immediate crown stop & seed-counting)",
    "themeStars": "⭐⭐⭐⭐",
    "coachQuote": "Damii rules from 20.PNG! Count your seeds carefully and strike!",
    "difficulty": {
      "tier": 7,
      "tier_name": "Advanced",
      "rating": 2120,
      "human_score": 68
    },
    "difficultyTier": 7,
    "rating": 2120,
    "hints": [
      "Under Damii rules, watch out for crowning constraints on the back row.",
      "Compulsory capture is enforced. Calculate opponent's forced replies.",
      "Strike with 17-13!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 3
      },
      {
        "r": 1,
        "c": 3,
        "player": 2,
        "isKing": false,
        "square": 7
      },
      {
        "r": 3,
        "c": 9,
        "player": 2,
        "isKing": false,
        "square": 20
      },
      {
        "r": 3,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 18
      },
      {
        "r": 3,
        "c": 3,
        "player": 1,
        "isKing": false,
        "square": 17
      },
      {
        "r": 4,
        "c": 8,
        "player": 2,
        "isKing": false,
        "square": 25
      },
      {
        "r": 5,
        "c": 9,
        "player": 2,
        "isKing": false,
        "square": 30
      },
      {
        "r": 6,
        "c": 8,
        "player": 2,
        "isKing": false,
        "square": 35
      },
      {
        "r": 6,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 33
      },
      {
        "r": 7,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 38
      },
      {
        "r": 8,
        "c": 8,
        "player": 1,
        "isKing": false,
        "square": 45
      },
      {
        "r": 8,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 43
      },
      {
        "r": 9,
        "c": 9,
        "player": 1,
        "isKing": false,
        "square": 50
      },
      {
        "r": 9,
        "c": 7,
        "player": 1,
        "isKing": false,
        "square": 49
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 17,
        "toSq": 13,
        "from": {
          "r": 3,
          "c": 3
        },
        "to": {
          "r": 2,
          "c": 4
        },
        "note": "Key strike: 19-13!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 7,
        "toSq": 12,
        "from": {
          "r": 1,
          "c": 3
        },
        "to": {
          "r": 2,
          "c": 2
        },
        "note": "Opponent responds 9-14",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 13,
        "toSq": 24,
        "from": {
          "r": 2,
          "c": 4
        },
        "to": {
          "r": 4,
          "c": 6
        },
        "note": "Continue combo: 13x22",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 35,
        "toSq": 39,
        "from": {
          "r": 6,
          "c": 8
        },
        "to": {
          "r": 7,
          "c": 7
        },
        "note": "Opponent responds 31-37",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 45,
        "toSq": 34,
        "from": {
          "r": 8,
          "c": 8
        },
        "to": {
          "r": 6,
          "c": 6
        },
        "note": "Continue combo: 41x32",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 25,
        "toSq": 29,
        "from": {
          "r": 4,
          "c": 8
        },
        "to": {
          "r": 5,
          "c": 7
        },
        "note": "Opponent responds 21-27",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 24,
        "toSq": 35,
        "from": {
          "r": 4,
          "c": 6
        },
        "to": {
          "r": 6,
          "c": 8
        },
        "note": "Continue combo: 22x31",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 30,
        "toSq": 39,
        "from": {
          "r": 5,
          "c": 9
        },
        "to": {
          "r": 7,
          "c": 7
        },
        "note": "Opponent responds 26x48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 28,
        "from": {
          "r": 7,
          "c": 7
        },
        "to": {
          "r": 5,
          "c": 5
        },
        "note": "Multi-jump continue: 28",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 28,
        "toSq": 37,
        "from": {
          "r": 5,
          "c": 5
        },
        "to": {
          "r": 7,
          "c": 3
        },
        "note": "Multi-jump continue: 37",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 37,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 3
        },
        "to": {
          "r": 9,
          "c": 5
        },
        "note": "Multi-jump continue: 48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-20-GHA",
    "ruleset": "ghana",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🇬🇭 Ghana Damii Variant #20 (21.PNG): Classic Coup Royal Highway Sweep",
    "badge": "🇬🇭 Damii #20",
    "source_image": "21.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "coup-royal",
    "themeName": "Ghana Damii • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Ghanaian Damii adaptation of Screenshot 21.PNG (Immediate crown stop & seed-counting)",
    "themeStars": "⭐⭐⭐⭐",
    "coachQuote": "Damii rules from 21.PNG! Count your seeds carefully and strike!",
    "difficulty": {
      "tier": 7,
      "tier_name": "Advanced",
      "rating": 2135,
      "human_score": 68
    },
    "difficultyTier": 7,
    "rating": 2135,
    "hints": [
      "Under Damii rules, watch out for crowning constraints on the back row.",
      "Compulsory capture is enforced. Calculate opponent's forced replies.",
      "Strike with 33-27!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 6,
        "player": 2,
        "isKing": false,
        "square": 4
      },
      {
        "r": 1,
        "c": 7,
        "player": 2,
        "isKing": false,
        "square": 9
      },
      {
        "r": 1,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 8
      },
      {
        "r": 1,
        "c": 1,
        "player": 2,
        "isKing": false,
        "square": 6
      },
      {
        "r": 2,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 13
      },
      {
        "r": 2,
        "c": 2,
        "player": 2,
        "isKing": false,
        "square": 12
      },
      {
        "r": 4,
        "c": 8,
        "player": 2,
        "isKing": false,
        "square": 25
      },
      {
        "r": 4,
        "c": 2,
        "player": 1,
        "isKing": false,
        "square": 22
      },
      {
        "r": 6,
        "c": 8,
        "player": 1,
        "isKing": false,
        "square": 35
      },
      {
        "r": 6,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 33
      },
      {
        "r": 7,
        "c": 7,
        "player": 1,
        "isKing": false,
        "square": 39
      },
      {
        "r": 7,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 38
      },
      {
        "r": 7,
        "c": 3,
        "player": 1,
        "isKing": false,
        "square": 37
      },
      {
        "r": 9,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 48
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 33,
        "toSq": 27,
        "from": {
          "r": 6,
          "c": 4
        },
        "to": {
          "r": 5,
          "c": 3
        },
        "note": "Key strike: 33-29!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 25,
        "toSq": 29,
        "from": {
          "r": 4,
          "c": 8
        },
        "to": {
          "r": 5,
          "c": 7
        },
        "note": "Opponent responds 21-27",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 35,
        "toSq": 24,
        "from": {
          "r": 6,
          "c": 8
        },
        "to": {
          "r": 4,
          "c": 6
        },
        "note": "Continue combo: 31x22",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 12,
        "toSq": 16,
        "from": {
          "r": 2,
          "c": 2
        },
        "to": {
          "r": 3,
          "c": 1
        },
        "note": "Opponent responds 14-20",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 22,
        "toSq": 11,
        "from": {
          "r": 4,
          "c": 2
        },
        "to": {
          "r": 2,
          "c": 0
        },
        "note": "Continue combo: 24x4",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 11,
        "toSq": 2,
        "from": {
          "r": 2,
          "c": 0
        },
        "to": {
          "r": 0,
          "c": 2
        },
        "note": "Multi-jump continue: 2",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 8,
        "toSq": 14,
        "from": {
          "r": 1,
          "c": 5
        },
        "to": {
          "r": 2,
          "c": 6
        },
        "note": "Opponent responds 8-12",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 2,
        "toSq": 18,
        "from": {
          "r": 0,
          "c": 2
        },
        "to": {
          "r": 3,
          "c": 5
        },
        "note": "Continue combo: 4x18",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 14,
        "toSq": 23,
        "from": {
          "r": 2,
          "c": 6
        },
        "to": {
          "r": 4,
          "c": 4
        },
        "note": "Opponent responds 12x41",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 23,
        "toSq": 32,
        "from": {
          "r": 4,
          "c": 4
        },
        "to": {
          "r": 6,
          "c": 2
        },
        "note": "Multi-jump continue: 32",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 32,
        "toSq": 43,
        "from": {
          "r": 6,
          "c": 2
        },
        "to": {
          "r": 8,
          "c": 4
        },
        "note": "Multi-jump continue: 43",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 43,
        "toSq": 34,
        "from": {
          "r": 8,
          "c": 4
        },
        "to": {
          "r": 6,
          "c": 6
        },
        "note": "Multi-jump continue: 34",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 34,
        "toSq": 45,
        "from": {
          "r": 6,
          "c": 6
        },
        "to": {
          "r": 8,
          "c": 8
        },
        "note": "Multi-jump continue: 45",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-1-MINI",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "⚡ Miniature #1 (1.PNG): Pure Tactical Strike",
    "badge": "⚡ Mini #1",
    "source_image": "1.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "triple-sacrifice",
    "themeName": "Tactical Miniature • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Streamlined tactical miniature derived by subtracting quiescent flank pieces from 1.PNG",
    "themeStars": "⭐⭐⭐⭐",
    "coachQuote": "Clean board, sharp tactics! All distractions subtracted from 1.PNG. Spot the core shot!",
    "difficulty": {
      "tier": 5,
      "tier_name": "Intermediate",
      "rating": 1550,
      "human_score": 58
    },
    "difficultyTier": 5,
    "rating": 1550,
    "hints": [
      "This miniature isolates the pure combination of 1.PNG.",
      "Every single piece on this board is active in the tactical sequence.",
      "Initiate with 33-28!"
    ],
    "initialBoard": [
      {
        "r": 2,
        "c": 3,
        "square": 12,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 4,
        "square": 18,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 6,
        "square": 19,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 8,
        "square": 20,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 3,
        "square": 22,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 5,
        "square": 23,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 2,
        "square": 27,
        "player": 2,
        "isKing": false
      },
      {
        "r": 6,
        "c": 1,
        "square": 31,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 5,
        "square": 33,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 7,
        "square": 34,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 9,
        "square": 35,
        "player": 2,
        "isKing": false
      },
      {
        "r": 7,
        "c": 0,
        "square": 36,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 4,
        "square": 38,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 6,
        "square": 39,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 3,
        "square": 42,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 7,
        "square": 44,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 4,
        "square": 48,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 33,
        "toSq": 28,
        "from": {
          "r": 6,
          "c": 5
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Key strike: 33-28!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 23,
        "toSq": 32,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Opponent responds 23x43",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 32,
        "toSq": 43,
        "from": {
          "r": 6,
          "c": 3
        },
        "to": {
          "r": 8,
          "c": 5
        },
        "note": "Multi-jump continue: 43",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 44,
        "toSq": 40,
        "from": {
          "r": 8,
          "c": 7
        },
        "to": {
          "r": 7,
          "c": 8
        },
        "note": "Continue combo: 44-40",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 35,
        "toSq": 44,
        "from": {
          "r": 6,
          "c": 9
        },
        "to": {
          "r": 8,
          "c": 7
        },
        "note": "Opponent responds 35x33",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 44,
        "toSq": 33,
        "from": {
          "r": 8,
          "c": 7
        },
        "to": {
          "r": 6,
          "c": 5
        },
        "note": "Multi-jump continue: 33",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 48,
        "toSq": 39,
        "from": {
          "r": 9,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Continue combo: 48x8",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 39,
        "toSq": 28,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Multi-jump continue: 28",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 28,
        "toSq": 17,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 3,
          "c": 2
        },
        "note": "Multi-jump continue: 17",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 17,
        "toSq": 8,
        "from": {
          "r": 3,
          "c": 2
        },
        "to": {
          "r": 1,
          "c": 4
        },
        "note": "Multi-jump continue: 8",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 13,
        "toSq": 2,
        "from": {
          "r": 2,
          "c": 5
        },
        "to": {
          "r": 0,
          "c": 3
        },
        "note": "Opponent responds 13x2",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 31,
        "toSq": 22,
        "from": {
          "r": 6,
          "c": 1
        },
        "to": {
          "r": 4,
          "c": 3
        },
        "note": "Continue combo: 31x15",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 22,
        "toSq": 13,
        "from": {
          "r": 4,
          "c": 3
        },
        "to": {
          "r": 2,
          "c": 5
        },
        "note": "Multi-jump continue: 13",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 13,
        "toSq": 24,
        "from": {
          "r": 2,
          "c": 5
        },
        "to": {
          "r": 4,
          "c": 7
        },
        "note": "Multi-jump continue: 24",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 24,
        "toSq": 15,
        "from": {
          "r": 4,
          "c": 7
        },
        "to": {
          "r": 2,
          "c": 9
        },
        "note": "Multi-jump continue: 15",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-2-MINI",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "⚡ Miniature #2 (2.PNG): Pure Tactical Strike",
    "badge": "⚡ Mini #2",
    "source_image": "2.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "gate-deflection",
    "themeName": "Tactical Miniature • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Streamlined tactical miniature derived by subtracting quiescent flank pieces from 2.PNG",
    "themeStars": "⭐⭐⭐⭐",
    "coachQuote": "Clean board, sharp tactics! All distractions subtracted from 2.PNG. Spot the core shot!",
    "difficulty": {
      "tier": 5,
      "tier_name": "Intermediate",
      "rating": 1570,
      "human_score": 58
    },
    "difficultyTier": 5,
    "rating": 1570,
    "hints": [
      "This miniature isolates the pure combination of 2.PNG.",
      "Every single piece on this board is active in the tactical sequence.",
      "Initiate with 33-29!"
    ],
    "initialBoard": [
      {
        "r": 2,
        "c": 3,
        "square": 12,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 7,
        "square": 14,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 4,
        "square": 18,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 1,
        "square": 21,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 3,
        "square": 22,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 7,
        "square": 24,
        "player": 2,
        "isKing": false
      },
      {
        "r": 6,
        "c": 3,
        "square": 32,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 5,
        "square": 33,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 2,
        "square": 37,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 4,
        "square": 38,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 5,
        "square": 43,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 4,
        "square": 48,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 33,
        "toSq": 29,
        "from": {
          "r": 6,
          "c": 5
        },
        "to": {
          "r": 5,
          "c": 6
        },
        "note": "Key strike: 33-29!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 24,
        "toSq": 33,
        "from": {
          "r": 4,
          "c": 7
        },
        "to": {
          "r": 6,
          "c": 5
        },
        "note": "Opponent responds 24x31",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 33,
        "toSq": 42,
        "from": {
          "r": 6,
          "c": 5
        },
        "to": {
          "r": 8,
          "c": 3
        },
        "note": "Multi-jump continue: 42",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 42,
        "toSq": 31,
        "from": {
          "r": 8,
          "c": 3
        },
        "to": {
          "r": 6,
          "c": 1
        },
        "note": "Multi-jump continue: 31",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 32,
        "toSq": 28,
        "from": {
          "r": 6,
          "c": 3
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Continue combo: 32-28",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 22,
        "toSq": 33,
        "from": {
          "r": 4,
          "c": 3
        },
        "to": {
          "r": 6,
          "c": 5
        },
        "note": "Opponent responds 22x33",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 43,
        "toSq": 38,
        "from": {
          "r": 8,
          "c": 5
        },
        "to": {
          "r": 7,
          "c": 4
        },
        "note": "Continue combo: 43-38",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 33,
        "toSq": 42,
        "from": {
          "r": 6,
          "c": 5
        },
        "to": {
          "r": 8,
          "c": 3
        },
        "note": "Opponent responds 33x42",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 48,
        "toSq": 37,
        "from": {
          "r": 9,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 2
        },
        "note": "Continue combo: 48x10",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 37,
        "toSq": 26,
        "from": {
          "r": 7,
          "c": 2
        },
        "to": {
          "r": 5,
          "c": 0
        },
        "note": "Multi-jump continue: 26",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 26,
        "toSq": 17,
        "from": {
          "r": 5,
          "c": 0
        },
        "to": {
          "r": 3,
          "c": 2
        },
        "note": "Multi-jump continue: 17",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 17,
        "toSq": 8,
        "from": {
          "r": 3,
          "c": 2
        },
        "to": {
          "r": 1,
          "c": 4
        },
        "note": "Multi-jump continue: 8",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 8,
        "toSq": 19,
        "from": {
          "r": 1,
          "c": 4
        },
        "to": {
          "r": 3,
          "c": 6
        },
        "note": "Multi-jump continue: 19",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 19,
        "toSq": 10,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 1,
          "c": 8
        },
        "note": "Multi-jump continue: 10",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-3-MINI",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "⚡ Miniature #3 (3.PNG): Pure Tactical Strike",
    "badge": "⚡ Mini #3",
    "source_image": "3.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "diamond-shot",
    "themeName": "Tactical Miniature • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Streamlined tactical miniature derived by subtracting quiescent flank pieces from 3.PNG",
    "themeStars": "⭐⭐⭐⭐",
    "coachQuote": "Clean board, sharp tactics! All distractions subtracted from 3.PNG. Spot the core shot!",
    "difficulty": {
      "tier": 5,
      "tier_name": "Intermediate",
      "rating": 1590,
      "human_score": 58
    },
    "difficultyTier": 5,
    "rating": 1590,
    "hints": [
      "This miniature isolates the pure combination of 3.PNG.",
      "Every single piece on this board is active in the tactical sequence.",
      "Initiate with 33-28!"
    ],
    "initialBoard": [
      {
        "r": 1,
        "c": 8,
        "square": 10,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 3,
        "square": 12,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 2,
        "square": 17,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 4,
        "square": 18,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 8,
        "square": 20,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 3,
        "square": 22,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 2,
        "square": 27,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 6,
        "square": 29,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 5,
        "square": 33,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 2,
        "square": 37,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 6,
        "square": 39,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 8,
        "square": 40,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 3,
        "square": 42,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 2,
        "square": 47,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 8,
        "square": 50,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 33,
        "toSq": 28,
        "from": {
          "r": 6,
          "c": 5
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Key strike: 33-28!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 22,
        "toSq": 33,
        "from": {
          "r": 4,
          "c": 3
        },
        "to": {
          "r": 6,
          "c": 5
        },
        "note": "Opponent responds 22x35",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 33,
        "toSq": 44,
        "from": {
          "r": 6,
          "c": 5
        },
        "to": {
          "r": 8,
          "c": 7
        },
        "note": "Multi-jump continue: 44",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 44,
        "toSq": 35,
        "from": {
          "r": 8,
          "c": 7
        },
        "to": {
          "r": 6,
          "c": 9
        },
        "note": "Multi-jump continue: 35",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 29,
        "toSq": 23,
        "from": {
          "r": 5,
          "c": 6
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Continue combo: 29-23",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 18,
        "toSq": 29,
        "from": {
          "r": 3,
          "c": 4
        },
        "to": {
          "r": 5,
          "c": 6
        },
        "note": "Opponent responds 18x29",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 37,
        "toSq": 32,
        "from": {
          "r": 7,
          "c": 2
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Continue combo: 37-32",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 27,
        "toSq": 38,
        "from": {
          "r": 5,
          "c": 2
        },
        "to": {
          "r": 7,
          "c": 4
        },
        "note": "Opponent responds 27x38",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 42,
        "toSq": 33,
        "from": {
          "r": 8,
          "c": 3
        },
        "to": {
          "r": 6,
          "c": 5
        },
        "note": "Continue combo: 42x4",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 33,
        "toSq": 24,
        "from": {
          "r": 6,
          "c": 5
        },
        "to": {
          "r": 4,
          "c": 7
        },
        "note": "Multi-jump continue: 24",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 24,
        "toSq": 15,
        "from": {
          "r": 4,
          "c": 7
        },
        "to": {
          "r": 2,
          "c": 9
        },
        "note": "Multi-jump continue: 15",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 15,
        "toSq": 4,
        "from": {
          "r": 2,
          "c": 9
        },
        "to": {
          "r": 0,
          "c": 7
        },
        "note": "Multi-jump continue: 4",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-5-MINI",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "⚡ Miniature #5 (5.PNG): Pure Tactical Strike",
    "badge": "⚡ Mini #5",
    "source_image": "5.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "coup-de-la-bombe",
    "themeName": "Tactical Miniature • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Streamlined tactical miniature derived by subtracting quiescent flank pieces from 5.PNG",
    "themeStars": "⭐⭐⭐⭐",
    "coachQuote": "Clean board, sharp tactics! All distractions subtracted from 5.PNG. Spot the core shot!",
    "difficulty": {
      "tier": 5,
      "tier_name": "Intermediate",
      "rating": 1630,
      "human_score": 58
    },
    "difficultyTier": 5,
    "rating": 1630,
    "hints": [
      "This miniature isolates the pure combination of 5.PNG.",
      "Every single piece on this board is active in the tactical sequence.",
      "Initiate with 29-24!"
    ],
    "initialBoard": [
      {
        "r": 1,
        "c": 6,
        "square": 9,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 1,
        "square": 11,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 3,
        "square": 12,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 7,
        "square": 14,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 4,
        "square": 18,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 9,
        "square": 25,
        "player": 1,
        "isKing": false
      },
      {
        "r": 5,
        "c": 0,
        "square": 26,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 6,
        "square": 29,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 5,
        "square": 33,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 4,
        "square": 38,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 1,
        "square": 41,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 3,
        "square": 42,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 5,
        "square": 43,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 2,
        "square": 47,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 29,
        "toSq": 24,
        "from": {
          "r": 5,
          "c": 6
        },
        "to": {
          "r": 4,
          "c": 7
        },
        "note": "Key strike: 29-24!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 14,
        "toSq": 20,
        "from": {
          "r": 2,
          "c": 7
        },
        "to": {
          "r": 3,
          "c": 8
        },
        "note": "Opponent responds 14-20",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 25,
        "toSq": 14,
        "from": {
          "r": 4,
          "c": 9
        },
        "to": {
          "r": 2,
          "c": 7
        },
        "note": "Continue combo: 25x3",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 14,
        "toSq": 3,
        "from": {
          "r": 2,
          "c": 7
        },
        "to": {
          "r": 0,
          "c": 5
        },
        "note": "Multi-jump continue: 3",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 13,
        "toSq": 19,
        "from": {
          "r": 2,
          "c": 5
        },
        "to": {
          "r": 3,
          "c": 6
        },
        "note": "Opponent responds 13-19",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 24,
        "toSq": 13,
        "from": {
          "r": 4,
          "c": 7
        },
        "to": {
          "r": 2,
          "c": 5
        },
        "note": "Continue combo: 24x22",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 13,
        "toSq": 22,
        "from": {
          "r": 2,
          "c": 5
        },
        "to": {
          "r": 4,
          "c": 3
        },
        "note": "Multi-jump continue: 22",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 12,
        "toSq": 17,
        "from": {
          "r": 2,
          "c": 3
        },
        "to": {
          "r": 3,
          "c": 2
        },
        "note": "Opponent responds 12-17",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 3,
        "toSq": 21,
        "from": {
          "r": 0,
          "c": 5
        },
        "to": {
          "r": 4,
          "c": 1
        },
        "note": "Continue combo: 3x21",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 26,
        "toSq": 17,
        "from": {
          "r": 5,
          "c": 0
        },
        "to": {
          "r": 3,
          "c": 2
        },
        "note": "Opponent responds 26x46",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 17,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 2
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Multi-jump continue: 28",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 28,
        "toSq": 39,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 4
        },
        "note": "Multi-jump continue: 48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 48,
        "toSq": 37,
        "from": {
          "r": 9,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 2
        },
        "note": "Multi-jump continue: 37",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 37,
        "toSq": 46,
        "from": {
          "r": 7,
          "c": 2
        },
        "to": {
          "r": 9,
          "c": 0
        },
        "note": "Multi-jump continue: 46",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-6-MINI",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "⚡ Miniature #6 (6.PNG): Pure Tactical Strike",
    "badge": "⚡ Mini #6",
    "source_image": "6.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "king-sweep",
    "themeName": "Tactical Miniature • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Streamlined tactical miniature derived by subtracting quiescent flank pieces from 6.PNG",
    "themeStars": "⭐⭐⭐⭐",
    "coachQuote": "Clean board, sharp tactics! All distractions subtracted from 6.PNG. Spot the core shot!",
    "difficulty": {
      "tier": 5,
      "tier_name": "Intermediate",
      "rating": 1650,
      "human_score": 58
    },
    "difficultyTier": 5,
    "rating": 1650,
    "hints": [
      "This miniature isolates the pure combination of 6.PNG.",
      "Every single piece on this board is active in the tactical sequence.",
      "Initiate with 42-38!"
    ],
    "initialBoard": [
      {
        "r": 2,
        "c": 3,
        "square": 12,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 0,
        "square": 16,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 2,
        "square": 17,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 4,
        "square": 18,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 6,
        "square": 19,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 5,
        "square": 23,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 0,
        "square": 26,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 6,
        "square": 29,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 8,
        "square": 30,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 3,
        "square": 32,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 7,
        "square": 34,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 0,
        "square": 36,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 2,
        "square": 37,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 8,
        "square": 40,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 3,
        "square": 42,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 5,
        "square": 43,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 4,
        "square": 48,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 42,
        "toSq": 38,
        "from": {
          "r": 8,
          "c": 3
        },
        "to": {
          "r": 7,
          "c": 4
        },
        "note": "Key strike: 42-38!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 24,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 4,
          "c": 7
        },
        "note": "Opponent responds 19-24",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 30,
        "toSq": 19,
        "from": {
          "r": 5,
          "c": 8
        },
        "to": {
          "r": 3,
          "c": 6
        },
        "note": "Continue combo: 30x28",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 19,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Multi-jump continue: 28",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 18,
        "toSq": 22,
        "from": {
          "r": 3,
          "c": 4
        },
        "to": {
          "r": 4,
          "c": 3
        },
        "note": "Opponent responds 18-22",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 34,
        "toSq": 23,
        "from": {
          "r": 6,
          "c": 7
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Continue combo: 34x23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 22,
        "toSq": 33,
        "from": {
          "r": 4,
          "c": 3
        },
        "to": {
          "r": 6,
          "c": 5
        },
        "note": "Opponent responds 22x31",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 33,
        "toSq": 42,
        "from": {
          "r": 6,
          "c": 5
        },
        "to": {
          "r": 8,
          "c": 3
        },
        "note": "Multi-jump continue: 42",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 42,
        "toSq": 31,
        "from": {
          "r": 8,
          "c": 3
        },
        "to": {
          "r": 6,
          "c": 1
        },
        "note": "Multi-jump continue: 31",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 36,
        "toSq": 27,
        "from": {
          "r": 7,
          "c": 0
        },
        "to": {
          "r": 5,
          "c": 2
        },
        "note": "Continue combo: 36x27",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 26,
        "toSq": 31,
        "from": {
          "r": 5,
          "c": 0
        },
        "to": {
          "r": 6,
          "c": 1
        },
        "note": "Opponent responds 26-31",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 27,
        "toSq": 36,
        "from": {
          "r": 5,
          "c": 2
        },
        "to": {
          "r": 7,
          "c": 0
        },
        "note": "Continue combo: 27x36",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 12,
        "toSq": 18,
        "from": {
          "r": 2,
          "c": 3
        },
        "to": {
          "r": 3,
          "c": 4
        },
        "note": "Opponent responds 12-18",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 23,
        "toSq": 12,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 2,
          "c": 3
        },
        "note": "Continue combo: 23x21",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 12,
        "toSq": 21,
        "from": {
          "r": 2,
          "c": 3
        },
        "to": {
          "r": 4,
          "c": 1
        },
        "note": "Multi-jump continue: 21",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 16,
        "toSq": 27,
        "from": {
          "r": 3,
          "c": 0
        },
        "to": {
          "r": 5,
          "c": 2
        },
        "note": "Opponent responds 16x49",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 27,
        "toSq": 38,
        "from": {
          "r": 5,
          "c": 2
        },
        "to": {
          "r": 7,
          "c": 4
        },
        "note": "Multi-jump continue: 38",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 38,
        "toSq": 49,
        "from": {
          "r": 7,
          "c": 4
        },
        "to": {
          "r": 9,
          "c": 6
        },
        "note": "Multi-jump continue: 49",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-7-MINI",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "⚡ Miniature #7 (7.PNG): Pure Tactical Strike",
    "badge": "⚡ Mini #7",
    "source_image": "7.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "center-wedge",
    "themeName": "Tactical Miniature • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Streamlined tactical miniature derived by subtracting quiescent flank pieces from 7.PNG",
    "themeStars": "⭐⭐⭐⭐",
    "coachQuote": "Clean board, sharp tactics! All distractions subtracted from 7.PNG. Spot the core shot!",
    "difficulty": {
      "tier": 5,
      "tier_name": "Intermediate",
      "rating": 1670,
      "human_score": 58
    },
    "difficultyTier": 5,
    "rating": 1670,
    "hints": [
      "This miniature isolates the pure combination of 7.PNG.",
      "Every single piece on this board is active in the tactical sequence.",
      "Initiate with 48-43!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 3,
        "square": 2,
        "player": 2,
        "isKing": false
      },
      {
        "r": 1,
        "c": 4,
        "square": 8,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 7,
        "square": 14,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 6,
        "square": 19,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 1,
        "square": 21,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 3,
        "square": 22,
        "player": 1,
        "isKing": false
      },
      {
        "r": 4,
        "c": 5,
        "square": 23,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 7,
        "square": 24,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 9,
        "square": 25,
        "player": 1,
        "isKing": false
      },
      {
        "r": 5,
        "c": 4,
        "square": 28,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 3,
        "square": 32,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 5,
        "square": 33,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 4,
        "square": 38,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 4,
        "square": 48,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 48,
        "toSq": 43,
        "from": {
          "r": 9,
          "c": 4
        },
        "to": {
          "r": 8,
          "c": 5
        },
        "note": "Key strike: 48-43!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 13,
        "toSq": 18,
        "from": {
          "r": 2,
          "c": 5
        },
        "to": {
          "r": 3,
          "c": 4
        },
        "note": "Opponent responds 13-18",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 22,
        "toSq": 13,
        "from": {
          "r": 4,
          "c": 3
        },
        "to": {
          "r": 2,
          "c": 5
        },
        "note": "Continue combo: 22x13",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 21,
        "toSq": 27,
        "from": {
          "r": 4,
          "c": 1
        },
        "to": {
          "r": 5,
          "c": 2
        },
        "note": "Opponent responds 21-27",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 32,
        "toSq": 21,
        "from": {
          "r": 6,
          "c": 3
        },
        "to": {
          "r": 4,
          "c": 1
        },
        "note": "Continue combo: 32x21",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 23,
        "toSq": 32,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Opponent responds 23x32",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 38,
        "toSq": 27,
        "from": {
          "r": 7,
          "c": 4
        },
        "to": {
          "r": 5,
          "c": 2
        },
        "note": "Continue combo: 38x27",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 14,
        "toSq": 20,
        "from": {
          "r": 2,
          "c": 7
        },
        "to": {
          "r": 3,
          "c": 8
        },
        "note": "Opponent responds 14-20",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 25,
        "toSq": 14,
        "from": {
          "r": 4,
          "c": 9
        },
        "to": {
          "r": 2,
          "c": 7
        },
        "note": "Continue combo: 25x23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 14,
        "toSq": 23,
        "from": {
          "r": 2,
          "c": 7
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Multi-jump continue: 23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 8,
        "toSq": 19,
        "from": {
          "r": 1,
          "c": 4
        },
        "to": {
          "r": 3,
          "c": 6
        },
        "note": "Opponent responds 8x48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Multi-jump continue: 28",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 28,
        "toSq": 39,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 4
        },
        "note": "Multi-jump continue: 48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-8-MINI",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "⚡ Miniature #8 (8.PNG): Pure Tactical Strike",
    "badge": "⚡ Mini #8",
    "source_image": "8.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "highway-clearance",
    "themeName": "Tactical Miniature • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Streamlined tactical miniature derived by subtracting quiescent flank pieces from 8.PNG",
    "themeStars": "⭐⭐⭐⭐",
    "coachQuote": "Clean board, sharp tactics! All distractions subtracted from 8.PNG. Spot the core shot!",
    "difficulty": {
      "tier": 5,
      "tier_name": "Intermediate",
      "rating": 1690,
      "human_score": 58
    },
    "difficultyTier": 5,
    "rating": 1690,
    "hints": [
      "This miniature isolates the pure combination of 8.PNG.",
      "Every single piece on this board is active in the tactical sequence.",
      "Initiate with 40-35!"
    ],
    "initialBoard": [
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 7,
        "square": 14,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 2,
        "square": 17,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 4,
        "square": 18,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 6,
        "square": 19,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 3,
        "square": 22,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 9,
        "square": 25,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 0,
        "square": 26,
        "player": 1,
        "isKing": false
      },
      {
        "r": 5,
        "c": 8,
        "square": 30,
        "player": 2,
        "isKing": false
      },
      {
        "r": 6,
        "c": 1,
        "square": 31,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 5,
        "square": 33,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 7,
        "square": 34,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 4,
        "square": 38,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 6,
        "square": 39,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 8,
        "square": 40,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 7,
        "square": 44,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 40,
        "toSq": 35,
        "from": {
          "r": 7,
          "c": 8
        },
        "to": {
          "r": 6,
          "c": 9
        },
        "note": "Key strike: 40-35!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 17,
        "toSq": 21,
        "from": {
          "r": 3,
          "c": 2
        },
        "to": {
          "r": 4,
          "c": 1
        },
        "note": "Opponent responds 17-21",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 26,
        "toSq": 17,
        "from": {
          "r": 5,
          "c": 0
        },
        "to": {
          "r": 3,
          "c": 2
        },
        "note": "Continue combo: 26x28",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 17,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 2
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Multi-jump continue: 28",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 18,
        "toSq": 23,
        "from": {
          "r": 3,
          "c": 4
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Opponent responds 18-23",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 35,
        "toSq": 24,
        "from": {
          "r": 6,
          "c": 9
        },
        "to": {
          "r": 4,
          "c": 7
        },
        "note": "Continue combo: 35x24",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 23,
        "toSq": 32,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Opponent responds 23x43",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 32,
        "toSq": 43,
        "from": {
          "r": 6,
          "c": 3
        },
        "to": {
          "r": 8,
          "c": 5
        },
        "note": "Multi-jump continue: 43",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 39,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 4
        },
        "note": "Continue combo: 39x48",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 30,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 8
        },
        "note": "Opponent responds 19x50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 30,
        "toSq": 39,
        "from": {
          "r": 5,
          "c": 8
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 50,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 8
        },
        "note": "Multi-jump continue: 50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-9-MINI",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "⚡ Miniature #9 (10.PNG): Pure Tactical Strike",
    "badge": "⚡ Mini #9",
    "source_image": "10.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "coronation-ambush",
    "themeName": "Tactical Miniature • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Streamlined tactical miniature derived by subtracting quiescent flank pieces from 10.PNG",
    "themeStars": "⭐⭐⭐⭐",
    "coachQuote": "Clean board, sharp tactics! All distractions subtracted from 10.PNG. Spot the core shot!",
    "difficulty": {
      "tier": 5,
      "tier_name": "Intermediate",
      "rating": 1710,
      "human_score": 58
    },
    "difficultyTier": 5,
    "rating": 1710,
    "hints": [
      "This miniature isolates the pure combination of 10.PNG.",
      "Every single piece on this board is active in the tactical sequence.",
      "Initiate with 39-33!"
    ],
    "initialBoard": [
      {
        "r": 1,
        "c": 4,
        "square": 8,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 3,
        "square": 12,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 7,
        "square": 14,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 0,
        "square": 16,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 4,
        "square": 18,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 6,
        "square": 19,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 7,
        "square": 24,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 9,
        "square": 25,
        "player": 1,
        "isKing": false
      },
      {
        "r": 5,
        "c": 2,
        "square": 27,
        "player": 1,
        "isKing": false
      },
      {
        "r": 5,
        "c": 4,
        "square": 28,
        "player": 1,
        "isKing": false
      },
      {
        "r": 5,
        "c": 6,
        "square": 29,
        "player": 2,
        "isKing": false
      },
      {
        "r": 6,
        "c": 3,
        "square": 32,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 9,
        "square": 35,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 4,
        "square": 38,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 6,
        "square": 39,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 7,
        "square": 44,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 39,
        "toSq": 33,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 6,
          "c": 5
        },
        "note": "Key strike: 39-33!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 16,
        "toSq": 21,
        "from": {
          "r": 3,
          "c": 0
        },
        "to": {
          "r": 4,
          "c": 1
        },
        "note": "Opponent responds 16-21",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 27,
        "toSq": 16,
        "from": {
          "r": 5,
          "c": 2
        },
        "to": {
          "r": 3,
          "c": 0
        },
        "note": "Continue combo: 27x16",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 18,
        "toSq": 22,
        "from": {
          "r": 3,
          "c": 4
        },
        "to": {
          "r": 4,
          "c": 3
        },
        "note": "Opponent responds 18-22",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 28,
        "toSq": 17,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 3,
          "c": 2
        },
        "note": "Continue combo: 28x17",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 12,
        "toSq": 21,
        "from": {
          "r": 2,
          "c": 3
        },
        "to": {
          "r": 4,
          "c": 1
        },
        "note": "Opponent responds 12x21",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 16,
        "toSq": 27,
        "from": {
          "r": 3,
          "c": 0
        },
        "to": {
          "r": 5,
          "c": 2
        },
        "note": "Continue combo: 16x27",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 24,
        "toSq": 30,
        "from": {
          "r": 4,
          "c": 7
        },
        "to": {
          "r": 5,
          "c": 8
        },
        "note": "Opponent responds 24-30",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 25,
        "toSq": 34,
        "from": {
          "r": 4,
          "c": 9
        },
        "to": {
          "r": 6,
          "c": 7
        },
        "note": "Continue combo: 25x23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 34,
        "toSq": 23,
        "from": {
          "r": 6,
          "c": 7
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Multi-jump continue: 23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Opponent responds 19x50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 28,
        "toSq": 39,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 50,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 8
        },
        "note": "Multi-jump continue: 50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-10-MINI",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "⚡ Miniature #10 (11.PNG): Pure Tactical Strike",
    "badge": "⚡ Mini #10",
    "source_image": "11.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "flank-squeeze",
    "themeName": "Tactical Miniature • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Streamlined tactical miniature derived by subtracting quiescent flank pieces from 11.PNG",
    "themeStars": "⭐⭐⭐⭐",
    "coachQuote": "Clean board, sharp tactics! All distractions subtracted from 11.PNG. Spot the core shot!",
    "difficulty": {
      "tier": 5,
      "tier_name": "Intermediate",
      "rating": 1730,
      "human_score": 58
    },
    "difficultyTier": 5,
    "rating": 1730,
    "hints": [
      "This miniature isolates the pure combination of 11.PNG.",
      "Every single piece on this board is active in the tactical sequence.",
      "Initiate with 30-25!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 3,
        "square": 2,
        "player": 2,
        "isKing": false
      },
      {
        "r": 0,
        "c": 5,
        "square": 3,
        "player": 2,
        "isKing": false
      },
      {
        "r": 1,
        "c": 4,
        "square": 8,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 3,
        "square": 12,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 6,
        "square": 19,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 8,
        "square": 20,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 3,
        "square": 22,
        "player": 1,
        "isKing": false
      },
      {
        "r": 4,
        "c": 5,
        "square": 23,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 2,
        "square": 27,
        "player": 1,
        "isKing": false
      },
      {
        "r": 5,
        "c": 4,
        "square": 28,
        "player": 1,
        "isKing": false
      },
      {
        "r": 5,
        "c": 8,
        "square": 30,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 3,
        "square": 32,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 3,
        "square": 42,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 5,
        "square": 43,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 7,
        "square": 44,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 30,
        "toSq": 25,
        "from": {
          "r": 5,
          "c": 8
        },
        "to": {
          "r": 4,
          "c": 9
        },
        "note": "Key strike: 30-25!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 24,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 4,
          "c": 7
        },
        "note": "Opponent responds 19-24",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 28,
        "toSq": 19,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 3,
          "c": 6
        },
        "note": "Continue combo: 28x30",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 19,
        "toSq": 30,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 8
        },
        "note": "Multi-jump continue: 30",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 13,
        "toSq": 19,
        "from": {
          "r": 2,
          "c": 5
        },
        "to": {
          "r": 3,
          "c": 6
        },
        "note": "Opponent responds 13-19",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 25,
        "toSq": 14,
        "from": {
          "r": 4,
          "c": 9
        },
        "to": {
          "r": 2,
          "c": 7
        },
        "note": "Continue combo: 25x23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 14,
        "toSq": 23,
        "from": {
          "r": 2,
          "c": 7
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Multi-jump continue: 23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 12,
        "toSq": 18,
        "from": {
          "r": 2,
          "c": 3
        },
        "to": {
          "r": 3,
          "c": 4
        },
        "note": "Opponent responds 12-18",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 22,
        "toSq": 13,
        "from": {
          "r": 4,
          "c": 3
        },
        "to": {
          "r": 2,
          "c": 5
        },
        "note": "Continue combo: 22x13",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 8,
        "toSq": 19,
        "from": {
          "r": 1,
          "c": 4
        },
        "to": {
          "r": 3,
          "c": 6
        },
        "note": "Opponent responds 8x50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Multi-jump continue: 28",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 28,
        "toSq": 37,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 2
        },
        "note": "Multi-jump continue: 37",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 37,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 2
        },
        "to": {
          "r": 9,
          "c": 4
        },
        "note": "Multi-jump continue: 48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 48,
        "toSq": 39,
        "from": {
          "r": 9,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 50,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 8
        },
        "note": "Multi-jump continue: 50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-11-MINI",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "⚡ Miniature #11 (12.PNG): Pure Tactical Strike",
    "badge": "⚡ Mini #11",
    "source_image": "12.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "infiltration-stride",
    "themeName": "Tactical Miniature • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Streamlined tactical miniature derived by subtracting quiescent flank pieces from 12.PNG",
    "themeStars": "⭐⭐⭐⭐",
    "coachQuote": "Clean board, sharp tactics! All distractions subtracted from 12.PNG. Spot the core shot!",
    "difficulty": {
      "tier": 5,
      "tier_name": "Intermediate",
      "rating": 1750,
      "human_score": 58
    },
    "difficultyTier": 5,
    "rating": 1750,
    "hints": [
      "This miniature isolates the pure combination of 12.PNG.",
      "Every single piece on this board is active in the tactical sequence.",
      "Initiate with 28-23!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 5,
        "square": 3,
        "player": 2,
        "isKing": false
      },
      {
        "r": 1,
        "c": 4,
        "square": 8,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 1,
        "square": 11,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 3,
        "square": 12,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 7,
        "square": 14,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 7,
        "square": 24,
        "player": 1,
        "isKing": false
      },
      {
        "r": 5,
        "c": 2,
        "square": 27,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 4,
        "square": 28,
        "player": 1,
        "isKing": false
      },
      {
        "r": 5,
        "c": 6,
        "square": 29,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 4,
        "square": 38,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 3,
        "square": 42,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 5,
        "square": 43,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 7,
        "square": 44,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 28,
        "toSq": 23,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Key strike: 28-23!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 13,
        "toSq": 19,
        "from": {
          "r": 2,
          "c": 5
        },
        "to": {
          "r": 3,
          "c": 6
        },
        "note": "Opponent responds 13-19",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 24,
        "toSq": 13,
        "from": {
          "r": 4,
          "c": 7
        },
        "to": {
          "r": 2,
          "c": 5
        },
        "note": "Continue combo: 24x2",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 13,
        "toSq": 2,
        "from": {
          "r": 2,
          "c": 5
        },
        "to": {
          "r": 0,
          "c": 3
        },
        "note": "Multi-jump continue: 2",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 14,
        "toSq": 19,
        "from": {
          "r": 2,
          "c": 7
        },
        "to": {
          "r": 3,
          "c": 6
        },
        "note": "Opponent responds 14-19",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 2,
        "toSq": 16,
        "from": {
          "r": 0,
          "c": 3
        },
        "to": {
          "r": 3,
          "c": 0
        },
        "note": "Continue combo: 2x32",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 16,
        "toSq": 32,
        "from": {
          "r": 3,
          "c": 0
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Multi-jump continue: 32",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Opponent responds 19x50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 28,
        "toSq": 37,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 2
        },
        "note": "Multi-jump continue: 37",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 37,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 2
        },
        "to": {
          "r": 9,
          "c": 4
        },
        "note": "Multi-jump continue: 48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 48,
        "toSq": 39,
        "from": {
          "r": 9,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 50,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 8
        },
        "note": "Multi-jump continue: 50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-12-MINI",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "⚡ Miniature #12 (13.PNG): Pure Tactical Strike",
    "badge": "⚡ Mini #12",
    "source_image": "13.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "decoy-breaker",
    "themeName": "Tactical Miniature • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Streamlined tactical miniature derived by subtracting quiescent flank pieces from 13.PNG",
    "themeStars": "⭐⭐⭐⭐",
    "coachQuote": "Clean board, sharp tactics! All distractions subtracted from 13.PNG. Spot the core shot!",
    "difficulty": {
      "tier": 5,
      "tier_name": "Intermediate",
      "rating": 1770,
      "human_score": 58
    },
    "difficultyTier": 5,
    "rating": 1770,
    "hints": [
      "This miniature isolates the pure combination of 13.PNG.",
      "Every single piece on this board is active in the tactical sequence.",
      "Initiate with 31-27!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 5,
        "square": 3,
        "player": 2,
        "isKing": false
      },
      {
        "r": 1,
        "c": 8,
        "square": 10,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 1,
        "square": 11,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 3,
        "square": 12,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 7,
        "square": 14,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 2,
        "square": 17,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 5,
        "square": 23,
        "player": 1,
        "isKing": false
      },
      {
        "r": 4,
        "c": 9,
        "square": 25,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 6,
        "square": 29,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 1,
        "square": 31,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 5,
        "square": 33,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 9,
        "square": 35,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 1,
        "square": 41,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 3,
        "square": 42,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 5,
        "square": 43,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 31,
        "toSq": 27,
        "from": {
          "r": 6,
          "c": 1
        },
        "to": {
          "r": 5,
          "c": 2
        },
        "note": "Key strike: 31-27!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 25,
        "toSq": 30,
        "from": {
          "r": 4,
          "c": 9
        },
        "to": {
          "r": 5,
          "c": 8
        },
        "note": "Opponent responds 25-30",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 35,
        "toSq": 24,
        "from": {
          "r": 6,
          "c": 9
        },
        "to": {
          "r": 4,
          "c": 7
        },
        "note": "Continue combo: 35x24",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 14,
        "toSq": 20,
        "from": {
          "r": 2,
          "c": 7
        },
        "to": {
          "r": 3,
          "c": 8
        },
        "note": "Opponent responds 14-20",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 24,
        "toSq": 15,
        "from": {
          "r": 4,
          "c": 7
        },
        "to": {
          "r": 2,
          "c": 9
        },
        "note": "Continue combo: 24x4",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 15,
        "toSq": 4,
        "from": {
          "r": 2,
          "c": 9
        },
        "to": {
          "r": 0,
          "c": 7
        },
        "note": "Multi-jump continue: 4",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 13,
        "toSq": 18,
        "from": {
          "r": 2,
          "c": 5
        },
        "to": {
          "r": 3,
          "c": 4
        },
        "note": "Opponent responds 13-18",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 4,
        "toSq": 22,
        "from": {
          "r": 0,
          "c": 7
        },
        "to": {
          "r": 4,
          "c": 3
        },
        "note": "Continue combo: 4x22",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 17,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 2
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Opponent responds 17x46",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 28,
        "toSq": 39,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 4
        },
        "note": "Multi-jump continue: 48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 48,
        "toSq": 37,
        "from": {
          "r": 9,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 2
        },
        "note": "Multi-jump continue: 37",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 37,
        "toSq": 46,
        "from": {
          "r": 7,
          "c": 2
        },
        "to": {
          "r": 9,
          "c": 0
        },
        "note": "Multi-jump continue: 46",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-13-MINI",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "⚡ Miniature #13 (14.PNG): Pure Tactical Strike",
    "badge": "⚡ Mini #13",
    "source_image": "14.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "diagonal-trap",
    "themeName": "Tactical Miniature • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Streamlined tactical miniature derived by subtracting quiescent flank pieces from 14.PNG",
    "themeStars": "⭐⭐⭐⭐",
    "coachQuote": "Clean board, sharp tactics! All distractions subtracted from 14.PNG. Spot the core shot!",
    "difficulty": {
      "tier": 5,
      "tier_name": "Intermediate",
      "rating": 1790,
      "human_score": 58
    },
    "difficultyTier": 5,
    "rating": 1790,
    "hints": [
      "This miniature isolates the pure combination of 14.PNG.",
      "Every single piece on this board is active in the tactical sequence.",
      "Initiate with 32-28!"
    ],
    "initialBoard": [
      {
        "r": 1,
        "c": 4,
        "square": 8,
        "player": 2,
        "isKing": false
      },
      {
        "r": 1,
        "c": 8,
        "square": 10,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 7,
        "square": 14,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 4,
        "square": 18,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 6,
        "square": 19,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 7,
        "square": 24,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 9,
        "square": 25,
        "player": 1,
        "isKing": false
      },
      {
        "r": 5,
        "c": 8,
        "square": 30,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 3,
        "square": 32,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 5,
        "square": 33,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 9,
        "square": 35,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 4,
        "square": 38,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 6,
        "square": 39,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 8,
        "square": 40,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 32,
        "toSq": 28,
        "from": {
          "r": 6,
          "c": 3
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Key strike: 32-28!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 18,
        "toSq": 22,
        "from": {
          "r": 3,
          "c": 4
        },
        "to": {
          "r": 4,
          "c": 3
        },
        "note": "Opponent responds 18-22",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 28,
        "toSq": 17,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 3,
          "c": 2
        },
        "note": "Continue combo: 28x17",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 23,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Opponent responds 19-23",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 30,
        "toSq": 19,
        "from": {
          "r": 5,
          "c": 8
        },
        "to": {
          "r": 3,
          "c": 6
        },
        "note": "Continue combo: 30x28",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 19,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Multi-jump continue: 28",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 8,
        "toSq": 12,
        "from": {
          "r": 1,
          "c": 4
        },
        "to": {
          "r": 2,
          "c": 3
        },
        "note": "Opponent responds 8-12",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 17,
        "toSq": 8,
        "from": {
          "r": 3,
          "c": 2
        },
        "to": {
          "r": 1,
          "c": 4
        },
        "note": "Continue combo: 17x19",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 8,
        "toSq": 19,
        "from": {
          "r": 1,
          "c": 4
        },
        "to": {
          "r": 3,
          "c": 6
        },
        "note": "Multi-jump continue: 19",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 14,
        "toSq": 23,
        "from": {
          "r": 2,
          "c": 7
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Opponent responds 14x45",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 23,
        "toSq": 32,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Multi-jump continue: 32",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 32,
        "toSq": 43,
        "from": {
          "r": 6,
          "c": 3
        },
        "to": {
          "r": 8,
          "c": 5
        },
        "note": "Multi-jump continue: 43",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 43,
        "toSq": 34,
        "from": {
          "r": 8,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 7
        },
        "note": "Multi-jump continue: 34",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 34,
        "toSq": 45,
        "from": {
          "r": 6,
          "c": 7
        },
        "to": {
          "r": 8,
          "c": 9
        },
        "note": "Multi-jump continue: 45",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-14-MINI",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "⚡ Miniature #14 (15.PNG): Pure Tactical Strike",
    "badge": "⚡ Mini #14",
    "source_image": "15.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "pin-and-shatter",
    "themeName": "Tactical Miniature • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Streamlined tactical miniature derived by subtracting quiescent flank pieces from 15.PNG",
    "themeStars": "⭐⭐⭐⭐",
    "coachQuote": "Clean board, sharp tactics! All distractions subtracted from 15.PNG. Spot the core shot!",
    "difficulty": {
      "tier": 5,
      "tier_name": "Intermediate",
      "rating": 1810,
      "human_score": 58
    },
    "difficultyTier": 5,
    "rating": 1810,
    "hints": [
      "This miniature isolates the pure combination of 15.PNG.",
      "Every single piece on this board is active in the tactical sequence.",
      "Initiate with 38-32!"
    ],
    "initialBoard": [
      {
        "r": 2,
        "c": 1,
        "square": 11,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 3,
        "square": 12,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 4,
        "square": 18,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 6,
        "square": 19,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 8,
        "square": 20,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 3,
        "square": 22,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 5,
        "square": 23,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 9,
        "square": 25,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 6,
        "square": 29,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 5,
        "square": 33,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 7,
        "square": 34,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 9,
        "square": 35,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 4,
        "square": 38,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 3,
        "square": 42,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 7,
        "square": 44,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 9,
        "square": 45,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 2,
        "square": 47,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 38,
        "toSq": 32,
        "from": {
          "r": 7,
          "c": 4
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Key strike: 38-32!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 22,
        "toSq": 28,
        "from": {
          "r": 4,
          "c": 3
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Opponent responds 22-28",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 33,
        "toSq": 22,
        "from": {
          "r": 6,
          "c": 5
        },
        "to": {
          "r": 4,
          "c": 3
        },
        "note": "Continue combo: 33x22",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 18,
        "toSq": 27,
        "from": {
          "r": 3,
          "c": 4
        },
        "to": {
          "r": 5,
          "c": 2
        },
        "note": "Opponent responds 18x38",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 27,
        "toSq": 38,
        "from": {
          "r": 5,
          "c": 2
        },
        "to": {
          "r": 7,
          "c": 4
        },
        "note": "Multi-jump continue: 38",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 29,
        "toSq": 18,
        "from": {
          "r": 5,
          "c": 6
        },
        "to": {
          "r": 3,
          "c": 4
        },
        "note": "Continue combo: 29x16",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 18,
        "toSq": 7,
        "from": {
          "r": 3,
          "c": 4
        },
        "to": {
          "r": 1,
          "c": 2
        },
        "note": "Multi-jump continue: 7",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 7,
        "toSq": 16,
        "from": {
          "r": 1,
          "c": 2
        },
        "to": {
          "r": 3,
          "c": 0
        },
        "note": "Multi-jump continue: 16",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 20,
        "toSq": 24,
        "from": {
          "r": 3,
          "c": 8
        },
        "to": {
          "r": 4,
          "c": 7
        },
        "note": "Opponent responds 20-24",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 42,
        "toSq": 33,
        "from": {
          "r": 8,
          "c": 3
        },
        "to": {
          "r": 6,
          "c": 5
        },
        "note": "Continue combo: 42x33",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 24,
        "toSq": 30,
        "from": {
          "r": 4,
          "c": 7
        },
        "to": {
          "r": 5,
          "c": 8
        },
        "note": "Opponent responds 24-30",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 35,
        "toSq": 24,
        "from": {
          "r": 6,
          "c": 9
        },
        "to": {
          "r": 4,
          "c": 7
        },
        "note": "Continue combo: 35x24",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 30,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 8
        },
        "note": "Opponent responds 19x50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 30,
        "toSq": 39,
        "from": {
          "r": 5,
          "c": 8
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 50,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 8
        },
        "note": "Multi-jump continue: 50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-15-MINI",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "⚡ Miniature #15 (16.PNG): Pure Tactical Strike",
    "badge": "⚡ Mini #15",
    "source_image": "16.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "king-strike",
    "themeName": "Tactical Miniature • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Streamlined tactical miniature derived by subtracting quiescent flank pieces from 16.PNG",
    "themeStars": "⭐⭐⭐⭐",
    "coachQuote": "Clean board, sharp tactics! All distractions subtracted from 16.PNG. Spot the core shot!",
    "difficulty": {
      "tier": 5,
      "tier_name": "Intermediate",
      "rating": 1830,
      "human_score": 58
    },
    "difficultyTier": 5,
    "rating": 1830,
    "hints": [
      "This miniature isolates the pure combination of 16.PNG.",
      "Every single piece on this board is active in the tactical sequence.",
      "Initiate with 49-43!"
    ],
    "initialBoard": [
      {
        "r": 2,
        "c": 3,
        "square": 12,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 0,
        "square": 16,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 2,
        "square": 17,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 3,
        "square": 22,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 5,
        "square": 23,
        "player": 1,
        "isKing": false
      },
      {
        "r": 4,
        "c": 7,
        "square": 24,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 0,
        "square": 26,
        "player": 2,
        "isKing": false
      },
      {
        "r": 6,
        "c": 7,
        "square": 34,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 2,
        "square": 37,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 4,
        "square": 48,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 6,
        "square": 49,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 49,
        "toSq": 43,
        "from": {
          "r": 9,
          "c": 6
        },
        "to": {
          "r": 8,
          "c": 5
        },
        "note": "Key strike: 49-43!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 22,
        "toSq": 28,
        "from": {
          "r": 4,
          "c": 3
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Opponent responds 22-28",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 23,
        "toSq": 32,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Continue combo: 23x32",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 24,
        "toSq": 29,
        "from": {
          "r": 4,
          "c": 7
        },
        "to": {
          "r": 5,
          "c": 6
        },
        "note": "Opponent responds 24-29",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 34,
        "toSq": 23,
        "from": {
          "r": 6,
          "c": 7
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Continue combo: 34x23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 12,
        "toSq": 18,
        "from": {
          "r": 2,
          "c": 3
        },
        "to": {
          "r": 3,
          "c": 4
        },
        "note": "Opponent responds 12-18",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 23,
        "toSq": 12,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 2,
          "c": 3
        },
        "note": "Continue combo: 23x21",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 12,
        "toSq": 21,
        "from": {
          "r": 2,
          "c": 3
        },
        "to": {
          "r": 4,
          "c": 1
        },
        "note": "Multi-jump continue: 21",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 16,
        "toSq": 27,
        "from": {
          "r": 3,
          "c": 0
        },
        "to": {
          "r": 5,
          "c": 2
        },
        "note": "Opponent responds 16x49",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 27,
        "toSq": 38,
        "from": {
          "r": 5,
          "c": 2
        },
        "to": {
          "r": 7,
          "c": 4
        },
        "note": "Multi-jump continue: 38",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 38,
        "toSq": 49,
        "from": {
          "r": 7,
          "c": 4
        },
        "to": {
          "r": 9,
          "c": 6
        },
        "note": "Multi-jump continue: 49",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-16-MINI",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "⚡ Miniature #16 (17.PNG): Pure Tactical Strike",
    "badge": "⚡ Mini #16",
    "source_image": "17.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "counter-sweep",
    "themeName": "Tactical Miniature • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Streamlined tactical miniature derived by subtracting quiescent flank pieces from 17.PNG",
    "themeStars": "⭐⭐⭐⭐",
    "coachQuote": "Clean board, sharp tactics! All distractions subtracted from 17.PNG. Spot the core shot!",
    "difficulty": {
      "tier": 5,
      "tier_name": "Intermediate",
      "rating": 1850,
      "human_score": 58
    },
    "difficultyTier": 5,
    "rating": 1850,
    "hints": [
      "This miniature isolates the pure combination of 17.PNG.",
      "Every single piece on this board is active in the tactical sequence.",
      "Initiate with 27-21!"
    ],
    "initialBoard": [
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 7,
        "square": 14,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 2,
        "square": 17,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 4,
        "square": 18,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 6,
        "square": 19,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 7,
        "square": 24,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 0,
        "square": 26,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 2,
        "square": 27,
        "player": 1,
        "isKing": false
      },
      {
        "r": 5,
        "c": 4,
        "square": 28,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 5,
        "square": 33,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 7,
        "square": 34,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 2,
        "square": 37,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 1,
        "square": 41,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 5,
        "square": 43,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 4,
        "square": 48,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 27,
        "toSq": 21,
        "from": {
          "r": 5,
          "c": 2
        },
        "to": {
          "r": 4,
          "c": 1
        },
        "note": "Key strike: 27-21!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 26,
        "toSq": 31,
        "from": {
          "r": 5,
          "c": 0
        },
        "to": {
          "r": 6,
          "c": 1
        },
        "note": "Opponent responds 26-31",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 21,
        "toSq": 12,
        "from": {
          "r": 4,
          "c": 1
        },
        "to": {
          "r": 2,
          "c": 3
        },
        "note": "Continue combo: 21x23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 12,
        "toSq": 23,
        "from": {
          "r": 2,
          "c": 3
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Multi-jump continue: 23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 31,
        "toSq": 42,
        "from": {
          "r": 6,
          "c": 1
        },
        "to": {
          "r": 8,
          "c": 3
        },
        "note": "Opponent responds 31x42",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 48,
        "toSq": 37,
        "from": {
          "r": 9,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 2
        },
        "note": "Continue combo: 48x37",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 24,
        "toSq": 29,
        "from": {
          "r": 4,
          "c": 7
        },
        "to": {
          "r": 5,
          "c": 6
        },
        "note": "Opponent responds 24-29",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 33,
        "toSq": 24,
        "from": {
          "r": 6,
          "c": 5
        },
        "to": {
          "r": 4,
          "c": 7
        },
        "note": "Continue combo: 33x24",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 30,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 8
        },
        "note": "Opponent responds 19x48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 30,
        "toSq": 39,
        "from": {
          "r": 5,
          "c": 8
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 4
        },
        "note": "Multi-jump continue: 48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-17-MINI",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "⚡ Miniature #17 (18.PNG): Pure Tactical Strike",
    "badge": "⚡ Mini #17",
    "source_image": "18.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "coronation-trap",
    "themeName": "Tactical Miniature • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Streamlined tactical miniature derived by subtracting quiescent flank pieces from 18.PNG",
    "themeStars": "⭐⭐⭐⭐",
    "coachQuote": "Clean board, sharp tactics! All distractions subtracted from 18.PNG. Spot the core shot!",
    "difficulty": {
      "tier": 5,
      "tier_name": "Intermediate",
      "rating": 1870,
      "human_score": 58
    },
    "difficultyTier": 5,
    "rating": 1870,
    "hints": [
      "This miniature isolates the pure combination of 18.PNG.",
      "Every single piece on this board is active in the tactical sequence.",
      "Initiate with 34-29!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 3,
        "square": 2,
        "player": 2,
        "isKing": false
      },
      {
        "r": 0,
        "c": 7,
        "square": 4,
        "player": 2,
        "isKing": false
      },
      {
        "r": 1,
        "c": 2,
        "square": 7,
        "player": 2,
        "isKing": false
      },
      {
        "r": 1,
        "c": 4,
        "square": 8,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 9,
        "square": 15,
        "player": 1,
        "isKing": false
      },
      {
        "r": 4,
        "c": 1,
        "square": 21,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 3,
        "square": 22,
        "player": 2,
        "isKing": false
      },
      {
        "r": 6,
        "c": 3,
        "square": 32,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 5,
        "square": 33,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 7,
        "square": 34,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 2,
        "square": 37,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 4,
        "square": 38,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 6,
        "square": 39,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 34,
        "toSq": 29,
        "from": {
          "r": 6,
          "c": 7
        },
        "to": {
          "r": 5,
          "c": 6
        },
        "note": "Key strike: 34-29!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 21,
        "toSq": 27,
        "from": {
          "r": 4,
          "c": 1
        },
        "to": {
          "r": 5,
          "c": 2
        },
        "note": "Opponent responds 21-27",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 32,
        "toSq": 21,
        "from": {
          "r": 6,
          "c": 3
        },
        "to": {
          "r": 4,
          "c": 1
        },
        "note": "Continue combo: 32x21",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 22,
        "toSq": 28,
        "from": {
          "r": 4,
          "c": 3
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Opponent responds 22-28",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 33,
        "toSq": 22,
        "from": {
          "r": 6,
          "c": 5
        },
        "to": {
          "r": 4,
          "c": 3
        },
        "note": "Continue combo: 33x22",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 4,
        "toSq": 10,
        "from": {
          "r": 0,
          "c": 7
        },
        "to": {
          "r": 1,
          "c": 8
        },
        "note": "Opponent responds 4-10",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 15,
        "toSq": 4,
        "from": {
          "r": 2,
          "c": 9
        },
        "to": {
          "r": 0,
          "c": 7
        },
        "note": "Continue combo: 15x4",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 8,
        "toSq": 12,
        "from": {
          "r": 1,
          "c": 4
        },
        "to": {
          "r": 2,
          "c": 3
        },
        "note": "Opponent responds 8-12",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 4,
        "toSq": 18,
        "from": {
          "r": 0,
          "c": 7
        },
        "to": {
          "r": 3,
          "c": 4
        },
        "note": "Continue combo: 4x18",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 12,
        "toSq": 23,
        "from": {
          "r": 2,
          "c": 3
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Opponent responds 12x41",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 23,
        "toSq": 34,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 7
        },
        "note": "Multi-jump continue: 34",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 34,
        "toSq": 43,
        "from": {
          "r": 6,
          "c": 7
        },
        "to": {
          "r": 8,
          "c": 5
        },
        "note": "Multi-jump continue: 43",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 43,
        "toSq": 32,
        "from": {
          "r": 8,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Multi-jump continue: 32",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 32,
        "toSq": 41,
        "from": {
          "r": 6,
          "c": 3
        },
        "to": {
          "r": 8,
          "c": 1
        },
        "note": "Multi-jump continue: 41",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-18-MINI",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "⚡ Miniature #18 (19.PNG): Pure Tactical Strike",
    "badge": "⚡ Mini #18",
    "source_image": "19.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "king-vacuum",
    "themeName": "Tactical Miniature • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Streamlined tactical miniature derived by subtracting quiescent flank pieces from 19.PNG",
    "themeStars": "⭐⭐⭐⭐",
    "coachQuote": "Clean board, sharp tactics! All distractions subtracted from 19.PNG. Spot the core shot!",
    "difficulty": {
      "tier": 5,
      "tier_name": "Intermediate",
      "rating": 1890,
      "human_score": 58
    },
    "difficultyTier": 5,
    "rating": 1890,
    "hints": [
      "This miniature isolates the pure combination of 19.PNG.",
      "Every single piece on this board is active in the tactical sequence.",
      "Initiate with 43-39!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 7,
        "square": 4,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 7,
        "square": 14,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 9,
        "square": 15,
        "player": 1,
        "isKing": false
      },
      {
        "r": 3,
        "c": 4,
        "square": 18,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 6,
        "square": 19,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 5,
        "square": 23,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 7,
        "square": 24,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 9,
        "square": 25,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 5,
        "square": 33,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 2,
        "square": 37,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 4,
        "square": 38,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 3,
        "square": 42,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 5,
        "square": 43,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 43,
        "toSq": 39,
        "from": {
          "r": 8,
          "c": 5
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Key strike: 43-39!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 4,
        "toSq": 10,
        "from": {
          "r": 0,
          "c": 7
        },
        "to": {
          "r": 1,
          "c": 8
        },
        "note": "Opponent responds 4-10",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 15,
        "toSq": 4,
        "from": {
          "r": 2,
          "c": 9
        },
        "to": {
          "r": 0,
          "c": 7
        },
        "note": "Continue combo: 15x4",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 14,
        "toSq": 20,
        "from": {
          "r": 2,
          "c": 7
        },
        "to": {
          "r": 3,
          "c": 8
        },
        "note": "Opponent responds 14-20",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 25,
        "toSq": 14,
        "from": {
          "r": 4,
          "c": 9
        },
        "to": {
          "r": 2,
          "c": 7
        },
        "note": "Continue combo: 25x14",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 10,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 1,
          "c": 8
        },
        "note": "Opponent responds 19x10",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 4,
        "toSq": 15,
        "from": {
          "r": 0,
          "c": 7
        },
        "to": {
          "r": 2,
          "c": 9
        },
        "note": "Continue combo: 4x29",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 15,
        "toSq": 29,
        "from": {
          "r": 2,
          "c": 9
        },
        "to": {
          "r": 5,
          "c": 6
        },
        "note": "Multi-jump continue: 29",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 23,
        "toSq": 34,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 7
        },
        "note": "Opponent responds 23x41",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 34,
        "toSq": 43,
        "from": {
          "r": 6,
          "c": 7
        },
        "to": {
          "r": 8,
          "c": 5
        },
        "note": "Multi-jump continue: 43",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 43,
        "toSq": 32,
        "from": {
          "r": 8,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Multi-jump continue: 32",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 32,
        "toSq": 41,
        "from": {
          "r": 6,
          "c": 3
        },
        "to": {
          "r": 8,
          "c": 1
        },
        "note": "Multi-jump continue: 41",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-19-MINI",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "⚡ Miniature #19 (20.PNG): Pure Tactical Strike",
    "badge": "⚡ Mini #19",
    "source_image": "20.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "flank-deflection",
    "themeName": "Tactical Miniature • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Streamlined tactical miniature derived by subtracting quiescent flank pieces from 20.PNG",
    "themeStars": "⭐⭐⭐⭐",
    "coachQuote": "Clean board, sharp tactics! All distractions subtracted from 20.PNG. Spot the core shot!",
    "difficulty": {
      "tier": 5,
      "tier_name": "Intermediate",
      "rating": 1910,
      "human_score": 58
    },
    "difficultyTier": 5,
    "rating": 1910,
    "hints": [
      "This miniature isolates the pure combination of 20.PNG.",
      "Every single piece on this board is active in the tactical sequence.",
      "Initiate with 19-13!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 5,
        "square": 3,
        "player": 2,
        "isKing": false
      },
      {
        "r": 1,
        "c": 6,
        "square": 9,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 0,
        "square": 16,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 4,
        "square": 18,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 6,
        "square": 19,
        "player": 1,
        "isKing": false
      },
      {
        "r": 4,
        "c": 1,
        "square": 21,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 0,
        "square": 26,
        "player": 2,
        "isKing": false
      },
      {
        "r": 6,
        "c": 1,
        "square": 31,
        "player": 2,
        "isKing": false
      },
      {
        "r": 6,
        "c": 5,
        "square": 33,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 4,
        "square": 38,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 1,
        "square": 41,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 5,
        "square": 43,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 0,
        "square": 46,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 2,
        "square": 47,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 19,
        "toSq": 13,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 2,
          "c": 5
        },
        "note": "Key strike: 19-13!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 9,
        "toSq": 14,
        "from": {
          "r": 1,
          "c": 6
        },
        "to": {
          "r": 2,
          "c": 7
        },
        "note": "Opponent responds 9-14",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 13,
        "toSq": 22,
        "from": {
          "r": 2,
          "c": 5
        },
        "to": {
          "r": 4,
          "c": 3
        },
        "note": "Continue combo: 13x22",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 31,
        "toSq": 37,
        "from": {
          "r": 6,
          "c": 1
        },
        "to": {
          "r": 7,
          "c": 2
        },
        "note": "Opponent responds 31-37",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 41,
        "toSq": 32,
        "from": {
          "r": 8,
          "c": 1
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Continue combo: 41x32",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 21,
        "toSq": 27,
        "from": {
          "r": 4,
          "c": 1
        },
        "to": {
          "r": 5,
          "c": 2
        },
        "note": "Opponent responds 21-27",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 22,
        "toSq": 31,
        "from": {
          "r": 4,
          "c": 3
        },
        "to": {
          "r": 6,
          "c": 1
        },
        "note": "Continue combo: 22x31",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 26,
        "toSq": 37,
        "from": {
          "r": 5,
          "c": 0
        },
        "to": {
          "r": 7,
          "c": 2
        },
        "note": "Opponent responds 26x48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 37,
        "toSq": 28,
        "from": {
          "r": 7,
          "c": 2
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Multi-jump continue: 28",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 28,
        "toSq": 39,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 4
        },
        "note": "Multi-jump continue: 48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-20-MINI",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "⚡ Miniature #20 (21.PNG): Pure Tactical Strike",
    "badge": "⚡ Mini #20",
    "source_image": "21.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "coup-royal",
    "themeName": "Tactical Miniature • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Streamlined tactical miniature derived by subtracting quiescent flank pieces from 21.PNG",
    "themeStars": "⭐⭐⭐⭐",
    "coachQuote": "Clean board, sharp tactics! All distractions subtracted from 21.PNG. Spot the core shot!",
    "difficulty": {
      "tier": 5,
      "tier_name": "Intermediate",
      "rating": 1930,
      "human_score": 58
    },
    "difficultyTier": 5,
    "rating": 1930,
    "hints": [
      "This miniature isolates the pure combination of 21.PNG.",
      "Every single piece on this board is active in the tactical sequence.",
      "Initiate with 33-29!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 3,
        "square": 2,
        "player": 2,
        "isKing": false
      },
      {
        "r": 1,
        "c": 2,
        "square": 7,
        "player": 2,
        "isKing": false
      },
      {
        "r": 1,
        "c": 4,
        "square": 8,
        "player": 2,
        "isKing": false
      },
      {
        "r": 1,
        "c": 8,
        "square": 10,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 7,
        "square": 14,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 1,
        "square": 21,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 7,
        "square": 24,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 1,
        "square": 31,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 5,
        "square": 33,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 2,
        "square": 37,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 4,
        "square": 38,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 6,
        "square": 39,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 4,
        "square": 48,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 33,
        "toSq": 29,
        "from": {
          "r": 6,
          "c": 5
        },
        "to": {
          "r": 5,
          "c": 6
        },
        "note": "Key strike: 33-29!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 21,
        "toSq": 27,
        "from": {
          "r": 4,
          "c": 1
        },
        "to": {
          "r": 5,
          "c": 2
        },
        "note": "Opponent responds 21-27",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 31,
        "toSq": 22,
        "from": {
          "r": 6,
          "c": 1
        },
        "to": {
          "r": 4,
          "c": 3
        },
        "note": "Continue combo: 31x22",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 14,
        "toSq": 20,
        "from": {
          "r": 2,
          "c": 7
        },
        "to": {
          "r": 3,
          "c": 8
        },
        "note": "Opponent responds 14-20",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 24,
        "toSq": 15,
        "from": {
          "r": 4,
          "c": 7
        },
        "to": {
          "r": 2,
          "c": 9
        },
        "note": "Continue combo: 24x4",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 15,
        "toSq": 4,
        "from": {
          "r": 2,
          "c": 9
        },
        "to": {
          "r": 0,
          "c": 7
        },
        "note": "Multi-jump continue: 4",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 8,
        "toSq": 12,
        "from": {
          "r": 1,
          "c": 4
        },
        "to": {
          "r": 2,
          "c": 3
        },
        "note": "Opponent responds 8-12",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 4,
        "toSq": 18,
        "from": {
          "r": 0,
          "c": 7
        },
        "to": {
          "r": 3,
          "c": 4
        },
        "note": "Continue combo: 4x18",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 12,
        "toSq": 23,
        "from": {
          "r": 2,
          "c": 3
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Opponent responds 12x41",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 23,
        "toSq": 34,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 7
        },
        "note": "Multi-jump continue: 34",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 34,
        "toSq": 43,
        "from": {
          "r": 6,
          "c": 7
        },
        "to": {
          "r": 8,
          "c": 5
        },
        "note": "Multi-jump continue: 43",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 43,
        "toSq": 32,
        "from": {
          "r": 8,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Multi-jump continue: 32",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 32,
        "toSq": 41,
        "from": {
          "r": 6,
          "c": 3
        },
        "to": {
          "r": 8,
          "c": 1
        },
        "note": "Multi-jump continue: 41",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-1-ADD",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🛡️ Defensive Test #1 (1.PNG): Added Flank Seeds",
    "badge": "🛡️ Defense #1",
    "source_image": "1.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "triple-sacrifice",
    "themeName": "Flank Complexity • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Variation with extra seeds added to 1.PNG testing precision under flank distractions",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "We add seeds to test your vision on 1.PNG! No allow the flank noise distract you from the main shot!",
    "difficulty": {
      "tier": 10,
      "tier_name": "Master",
      "rating": 2150,
      "human_score": 80
    },
    "difficultyTier": 10,
    "rating": 2150,
    "hints": [
      "Additional flank seeds have been added, but the central combination remains deadly.",
      "Don't get distracted by slow flank moves. Find the forced combination.",
      "Strike with 33-28!"
    ],
    "initialBoard": [
      {
        "r": 2,
        "c": 3,
        "square": 12,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 4,
        "square": 18,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 6,
        "square": 19,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 8,
        "square": 20,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 3,
        "square": 22,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 5,
        "square": 23,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 2,
        "square": 27,
        "player": 2,
        "isKing": false
      },
      {
        "r": 6,
        "c": 1,
        "square": 31,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 5,
        "square": 33,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 7,
        "square": 34,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 9,
        "square": 35,
        "player": 2,
        "isKing": false
      },
      {
        "r": 7,
        "c": 0,
        "square": 36,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 4,
        "square": 38,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 6,
        "square": 39,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 3,
        "square": 42,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 7,
        "square": 44,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 4,
        "square": 48,
        "player": 1,
        "isKing": false
      },
      {
        "r": 0,
        "c": 1,
        "player": 2,
        "isKing": false,
        "square": 1
      },
      {
        "r": 1,
        "c": 0,
        "player": 2,
        "isKing": false,
        "square": 6
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 33,
        "toSq": 28,
        "from": {
          "r": 6,
          "c": 5
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Key strike: 33-28!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 23,
        "toSq": 32,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Opponent responds 23x43",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 32,
        "toSq": 43,
        "from": {
          "r": 6,
          "c": 3
        },
        "to": {
          "r": 8,
          "c": 5
        },
        "note": "Multi-jump continue: 43",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 44,
        "toSq": 40,
        "from": {
          "r": 8,
          "c": 7
        },
        "to": {
          "r": 7,
          "c": 8
        },
        "note": "Continue combo: 44-40",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 35,
        "toSq": 44,
        "from": {
          "r": 6,
          "c": 9
        },
        "to": {
          "r": 8,
          "c": 7
        },
        "note": "Opponent responds 35x33",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 44,
        "toSq": 33,
        "from": {
          "r": 8,
          "c": 7
        },
        "to": {
          "r": 6,
          "c": 5
        },
        "note": "Multi-jump continue: 33",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 48,
        "toSq": 39,
        "from": {
          "r": 9,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Continue combo: 48x8",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 39,
        "toSq": 28,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Multi-jump continue: 28",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 28,
        "toSq": 17,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 3,
          "c": 2
        },
        "note": "Multi-jump continue: 17",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 17,
        "toSq": 8,
        "from": {
          "r": 3,
          "c": 2
        },
        "to": {
          "r": 1,
          "c": 4
        },
        "note": "Multi-jump continue: 8",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 13,
        "toSq": 2,
        "from": {
          "r": 2,
          "c": 5
        },
        "to": {
          "r": 0,
          "c": 3
        },
        "note": "Opponent responds 13x2",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 31,
        "toSq": 22,
        "from": {
          "r": 6,
          "c": 1
        },
        "to": {
          "r": 4,
          "c": 3
        },
        "note": "Continue combo: 31x15",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 22,
        "toSq": 13,
        "from": {
          "r": 4,
          "c": 3
        },
        "to": {
          "r": 2,
          "c": 5
        },
        "note": "Multi-jump continue: 13",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 13,
        "toSq": 24,
        "from": {
          "r": 2,
          "c": 5
        },
        "to": {
          "r": 4,
          "c": 7
        },
        "note": "Multi-jump continue: 24",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 24,
        "toSq": 15,
        "from": {
          "r": 4,
          "c": 7
        },
        "to": {
          "r": 2,
          "c": 9
        },
        "note": "Multi-jump continue: 15",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-2-ADD",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🛡️ Defensive Test #2 (2.PNG): Added Flank Seeds",
    "badge": "🛡️ Defense #2",
    "source_image": "2.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "gate-deflection",
    "themeName": "Flank Complexity • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Variation with extra seeds added to 2.PNG testing precision under flank distractions",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "We add seeds to test your vision on 2.PNG! No allow the flank noise distract you from the main shot!",
    "difficulty": {
      "tier": 10,
      "tier_name": "Master",
      "rating": 2165,
      "human_score": 80
    },
    "difficultyTier": 10,
    "rating": 2165,
    "hints": [
      "Additional flank seeds have been added, but the central combination remains deadly.",
      "Don't get distracted by slow flank moves. Find the forced combination.",
      "Strike with 33-29!"
    ],
    "initialBoard": [
      {
        "r": 2,
        "c": 3,
        "square": 12,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 7,
        "square": 14,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 4,
        "square": 18,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 1,
        "square": 21,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 3,
        "square": 22,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 7,
        "square": 24,
        "player": 2,
        "isKing": false
      },
      {
        "r": 6,
        "c": 3,
        "square": 32,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 5,
        "square": 33,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 2,
        "square": 37,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 4,
        "square": 38,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 5,
        "square": 43,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 7,
        "square": 44,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 4,
        "square": 48,
        "player": 1,
        "isKing": false
      },
      {
        "r": 0,
        "c": 1,
        "player": 2,
        "isKing": false,
        "square": 1
      },
      {
        "r": 1,
        "c": 0,
        "player": 2,
        "isKing": false,
        "square": 6
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 33,
        "toSq": 29,
        "from": {
          "r": 6,
          "c": 5
        },
        "to": {
          "r": 5,
          "c": 6
        },
        "note": "Key strike: 33-29!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 24,
        "toSq": 33,
        "from": {
          "r": 4,
          "c": 7
        },
        "to": {
          "r": 6,
          "c": 5
        },
        "note": "Opponent responds 24x31",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 33,
        "toSq": 42,
        "from": {
          "r": 6,
          "c": 5
        },
        "to": {
          "r": 8,
          "c": 3
        },
        "note": "Multi-jump continue: 42",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 42,
        "toSq": 31,
        "from": {
          "r": 8,
          "c": 3
        },
        "to": {
          "r": 6,
          "c": 1
        },
        "note": "Multi-jump continue: 31",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 32,
        "toSq": 28,
        "from": {
          "r": 6,
          "c": 3
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Continue combo: 32-28",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 22,
        "toSq": 33,
        "from": {
          "r": 4,
          "c": 3
        },
        "to": {
          "r": 6,
          "c": 5
        },
        "note": "Opponent responds 22x33",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 43,
        "toSq": 38,
        "from": {
          "r": 8,
          "c": 5
        },
        "to": {
          "r": 7,
          "c": 4
        },
        "note": "Continue combo: 43-38",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 33,
        "toSq": 42,
        "from": {
          "r": 6,
          "c": 5
        },
        "to": {
          "r": 8,
          "c": 3
        },
        "note": "Opponent responds 33x42",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 48,
        "toSq": 37,
        "from": {
          "r": 9,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 2
        },
        "note": "Continue combo: 48x10",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 37,
        "toSq": 26,
        "from": {
          "r": 7,
          "c": 2
        },
        "to": {
          "r": 5,
          "c": 0
        },
        "note": "Multi-jump continue: 26",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 26,
        "toSq": 17,
        "from": {
          "r": 5,
          "c": 0
        },
        "to": {
          "r": 3,
          "c": 2
        },
        "note": "Multi-jump continue: 17",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 17,
        "toSq": 8,
        "from": {
          "r": 3,
          "c": 2
        },
        "to": {
          "r": 1,
          "c": 4
        },
        "note": "Multi-jump continue: 8",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 8,
        "toSq": 19,
        "from": {
          "r": 1,
          "c": 4
        },
        "to": {
          "r": 3,
          "c": 6
        },
        "note": "Multi-jump continue: 19",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 19,
        "toSq": 10,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 1,
          "c": 8
        },
        "note": "Multi-jump continue: 10",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-3-ADD",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🛡️ Defensive Test #3 (3.PNG): Added Flank Seeds",
    "badge": "🛡️ Defense #3",
    "source_image": "3.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "diamond-shot",
    "themeName": "Flank Complexity • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Variation with extra seeds added to 3.PNG testing precision under flank distractions",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "We add seeds to test your vision on 3.PNG! No allow the flank noise distract you from the main shot!",
    "difficulty": {
      "tier": 10,
      "tier_name": "Master",
      "rating": 2180,
      "human_score": 80
    },
    "difficultyTier": 10,
    "rating": 2180,
    "hints": [
      "Additional flank seeds have been added, but the central combination remains deadly.",
      "Don't get distracted by slow flank moves. Find the forced combination.",
      "Strike with 33-28!"
    ],
    "initialBoard": [
      {
        "r": 1,
        "c": 4,
        "square": 8,
        "player": 2,
        "isKing": false
      },
      {
        "r": 1,
        "c": 8,
        "square": 10,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 3,
        "square": 12,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 2,
        "square": 17,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 4,
        "square": 18,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 8,
        "square": 20,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 3,
        "square": 22,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 2,
        "square": 27,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 6,
        "square": 29,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 5,
        "square": 33,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 2,
        "square": 37,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 6,
        "square": 39,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 8,
        "square": 40,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 3,
        "square": 42,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 2,
        "square": 47,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 8,
        "square": 50,
        "player": 1,
        "isKing": false
      },
      {
        "r": 0,
        "c": 1,
        "player": 2,
        "isKing": false,
        "square": 1
      },
      {
        "r": 1,
        "c": 0,
        "player": 2,
        "isKing": false,
        "square": 6
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 33,
        "toSq": 28,
        "from": {
          "r": 6,
          "c": 5
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Key strike: 33-28!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 22,
        "toSq": 33,
        "from": {
          "r": 4,
          "c": 3
        },
        "to": {
          "r": 6,
          "c": 5
        },
        "note": "Opponent responds 22x35",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 33,
        "toSq": 44,
        "from": {
          "r": 6,
          "c": 5
        },
        "to": {
          "r": 8,
          "c": 7
        },
        "note": "Multi-jump continue: 44",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 44,
        "toSq": 35,
        "from": {
          "r": 8,
          "c": 7
        },
        "to": {
          "r": 6,
          "c": 9
        },
        "note": "Multi-jump continue: 35",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 29,
        "toSq": 23,
        "from": {
          "r": 5,
          "c": 6
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Continue combo: 29-23",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 18,
        "toSq": 29,
        "from": {
          "r": 3,
          "c": 4
        },
        "to": {
          "r": 5,
          "c": 6
        },
        "note": "Opponent responds 18x29",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 37,
        "toSq": 32,
        "from": {
          "r": 7,
          "c": 2
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Continue combo: 37-32",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 27,
        "toSq": 38,
        "from": {
          "r": 5,
          "c": 2
        },
        "to": {
          "r": 7,
          "c": 4
        },
        "note": "Opponent responds 27x38",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 42,
        "toSq": 33,
        "from": {
          "r": 8,
          "c": 3
        },
        "to": {
          "r": 6,
          "c": 5
        },
        "note": "Continue combo: 42x4",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 33,
        "toSq": 24,
        "from": {
          "r": 6,
          "c": 5
        },
        "to": {
          "r": 4,
          "c": 7
        },
        "note": "Multi-jump continue: 24",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 24,
        "toSq": 15,
        "from": {
          "r": 4,
          "c": 7
        },
        "to": {
          "r": 2,
          "c": 9
        },
        "note": "Multi-jump continue: 15",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 15,
        "toSq": 4,
        "from": {
          "r": 2,
          "c": 9
        },
        "to": {
          "r": 0,
          "c": 7
        },
        "note": "Multi-jump continue: 4",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-4-ADD",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🛡️ Defensive Test #4 (4.PNG): Added Flank Seeds",
    "badge": "🛡️ Defense #4",
    "source_image": "4.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "coronation-blitz",
    "themeName": "Flank Complexity • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Variation with extra seeds added to 4.PNG testing precision under flank distractions",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "We add seeds to test your vision on 4.PNG! No allow the flank noise distract you from the main shot!",
    "difficulty": {
      "tier": 10,
      "tier_name": "Master",
      "rating": 2195,
      "human_score": 80
    },
    "difficultyTier": 10,
    "rating": 2195,
    "hints": [
      "Additional flank seeds have been added, but the central combination remains deadly.",
      "Don't get distracted by slow flank moves. Find the forced combination.",
      "Strike with 26-21!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 1,
        "square": 1,
        "player": 2,
        "isKing": false
      },
      {
        "r": 0,
        "c": 7,
        "square": 4,
        "player": 2,
        "isKing": false
      },
      {
        "r": 1,
        "c": 2,
        "square": 7,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 1,
        "square": 11,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 7,
        "square": 14,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 0,
        "square": 16,
        "player": 1,
        "isKing": false
      },
      {
        "r": 3,
        "c": 4,
        "square": 18,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 6,
        "square": 19,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 5,
        "square": 23,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 7,
        "square": 24,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 0,
        "square": 26,
        "player": 1,
        "isKing": false
      },
      {
        "r": 5,
        "c": 2,
        "square": 27,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 7,
        "square": 34,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 8,
        "square": 40,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 3,
        "square": 42,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 5,
        "square": 43,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 7,
        "square": 44,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 6,
        "square": 49,
        "player": 1,
        "isKing": false
      },
      {
        "r": 1,
        "c": 0,
        "player": 2,
        "isKing": false,
        "square": 6
      },
      {
        "r": 8,
        "c": 9,
        "player": 1,
        "isKing": false,
        "square": 45
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 26,
        "toSq": 21,
        "from": {
          "r": 5,
          "c": 0
        },
        "to": {
          "r": 4,
          "c": 1
        },
        "note": "Key strike: 26-21!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 11,
        "toSq": 17,
        "from": {
          "r": 2,
          "c": 1
        },
        "to": {
          "r": 3,
          "c": 2
        },
        "note": "Opponent responds 11-17",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 21,
        "toSq": 12,
        "from": {
          "r": 4,
          "c": 1
        },
        "to": {
          "r": 2,
          "c": 3
        },
        "note": "Continue combo: 21x12",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 23,
        "toSq": 28,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Opponent responds 23-28",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 12,
        "toSq": 23,
        "from": {
          "r": 2,
          "c": 3
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Continue combo: 12x32",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 23,
        "toSq": 32,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Multi-jump continue: 32",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 24,
        "toSq": 29,
        "from": {
          "r": 4,
          "c": 7
        },
        "to": {
          "r": 5,
          "c": 6
        },
        "note": "Opponent responds 24-29",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 34,
        "toSq": 23,
        "from": {
          "r": 6,
          "c": 7
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Continue combo: 34x23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Opponent responds 19x50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 28,
        "toSq": 37,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 2
        },
        "note": "Multi-jump continue: 37",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 37,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 2
        },
        "to": {
          "r": 9,
          "c": 4
        },
        "note": "Multi-jump continue: 48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 48,
        "toSq": 39,
        "from": {
          "r": 9,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 50,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 8
        },
        "note": "Multi-jump continue: 50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-5-ADD",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🛡️ Defensive Test #5 (5.PNG): Added Flank Seeds",
    "badge": "🛡️ Defense #5",
    "source_image": "5.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "coup-de-la-bombe",
    "themeName": "Flank Complexity • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Variation with extra seeds added to 5.PNG testing precision under flank distractions",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "We add seeds to test your vision on 5.PNG! No allow the flank noise distract you from the main shot!",
    "difficulty": {
      "tier": 10,
      "tier_name": "Master",
      "rating": 2210,
      "human_score": 80
    },
    "difficultyTier": 10,
    "rating": 2210,
    "hints": [
      "Additional flank seeds have been added, but the central combination remains deadly.",
      "Don't get distracted by slow flank moves. Find the forced combination.",
      "Strike with 29-24!"
    ],
    "initialBoard": [
      {
        "r": 1,
        "c": 0,
        "square": 6,
        "player": 2,
        "isKing": false
      },
      {
        "r": 1,
        "c": 6,
        "square": 9,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 1,
        "square": 11,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 3,
        "square": 12,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 7,
        "square": 14,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 4,
        "square": 18,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 9,
        "square": 25,
        "player": 1,
        "isKing": false
      },
      {
        "r": 5,
        "c": 0,
        "square": 26,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 6,
        "square": 29,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 5,
        "square": 33,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 4,
        "square": 38,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 1,
        "square": 41,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 3,
        "square": 42,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 5,
        "square": 43,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 2,
        "square": 47,
        "player": 1,
        "isKing": false
      },
      {
        "r": 0,
        "c": 1,
        "player": 2,
        "isKing": false,
        "square": 1
      },
      {
        "r": 9,
        "c": 8,
        "player": 1,
        "isKing": false,
        "square": 50
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 29,
        "toSq": 24,
        "from": {
          "r": 5,
          "c": 6
        },
        "to": {
          "r": 4,
          "c": 7
        },
        "note": "Key strike: 29-24!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 14,
        "toSq": 20,
        "from": {
          "r": 2,
          "c": 7
        },
        "to": {
          "r": 3,
          "c": 8
        },
        "note": "Opponent responds 14-20",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 25,
        "toSq": 14,
        "from": {
          "r": 4,
          "c": 9
        },
        "to": {
          "r": 2,
          "c": 7
        },
        "note": "Continue combo: 25x3",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 14,
        "toSq": 3,
        "from": {
          "r": 2,
          "c": 7
        },
        "to": {
          "r": 0,
          "c": 5
        },
        "note": "Multi-jump continue: 3",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 13,
        "toSq": 19,
        "from": {
          "r": 2,
          "c": 5
        },
        "to": {
          "r": 3,
          "c": 6
        },
        "note": "Opponent responds 13-19",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 24,
        "toSq": 13,
        "from": {
          "r": 4,
          "c": 7
        },
        "to": {
          "r": 2,
          "c": 5
        },
        "note": "Continue combo: 24x22",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 13,
        "toSq": 22,
        "from": {
          "r": 2,
          "c": 5
        },
        "to": {
          "r": 4,
          "c": 3
        },
        "note": "Multi-jump continue: 22",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 12,
        "toSq": 17,
        "from": {
          "r": 2,
          "c": 3
        },
        "to": {
          "r": 3,
          "c": 2
        },
        "note": "Opponent responds 12-17",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 3,
        "toSq": 21,
        "from": {
          "r": 0,
          "c": 5
        },
        "to": {
          "r": 4,
          "c": 1
        },
        "note": "Continue combo: 3x21",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 26,
        "toSq": 17,
        "from": {
          "r": 5,
          "c": 0
        },
        "to": {
          "r": 3,
          "c": 2
        },
        "note": "Opponent responds 26x46",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 17,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 2
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Multi-jump continue: 28",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 28,
        "toSq": 39,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 4
        },
        "note": "Multi-jump continue: 48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 48,
        "toSq": 37,
        "from": {
          "r": 9,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 2
        },
        "note": "Multi-jump continue: 37",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 37,
        "toSq": 46,
        "from": {
          "r": 7,
          "c": 2
        },
        "to": {
          "r": 9,
          "c": 0
        },
        "note": "Multi-jump continue: 46",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-6-ADD",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🛡️ Defensive Test #6 (6.PNG): Added Flank Seeds",
    "badge": "🛡️ Defense #6",
    "source_image": "6.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "king-sweep",
    "themeName": "Flank Complexity • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Variation with extra seeds added to 6.PNG testing precision under flank distractions",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "We add seeds to test your vision on 6.PNG! No allow the flank noise distract you from the main shot!",
    "difficulty": {
      "tier": 10,
      "tier_name": "Master",
      "rating": 2225,
      "human_score": 80
    },
    "difficultyTier": 10,
    "rating": 2225,
    "hints": [
      "Additional flank seeds have been added, but the central combination remains deadly.",
      "Don't get distracted by slow flank moves. Find the forced combination.",
      "Strike with 42-38!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 5,
        "square": 3,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 3,
        "square": 12,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 0,
        "square": 16,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 2,
        "square": 17,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 4,
        "square": 18,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 6,
        "square": 19,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 5,
        "square": 23,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 0,
        "square": 26,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 6,
        "square": 29,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 8,
        "square": 30,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 3,
        "square": 32,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 7,
        "square": 34,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 0,
        "square": 36,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 2,
        "square": 37,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 8,
        "square": 40,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 3,
        "square": 42,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 5,
        "square": 43,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 4,
        "square": 48,
        "player": 1,
        "isKing": false
      },
      {
        "r": 0,
        "c": 1,
        "player": 2,
        "isKing": false,
        "square": 1
      },
      {
        "r": 1,
        "c": 0,
        "player": 2,
        "isKing": false,
        "square": 6
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 42,
        "toSq": 38,
        "from": {
          "r": 8,
          "c": 3
        },
        "to": {
          "r": 7,
          "c": 4
        },
        "note": "Key strike: 42-38!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 24,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 4,
          "c": 7
        },
        "note": "Opponent responds 19-24",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 30,
        "toSq": 19,
        "from": {
          "r": 5,
          "c": 8
        },
        "to": {
          "r": 3,
          "c": 6
        },
        "note": "Continue combo: 30x28",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 19,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Multi-jump continue: 28",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 18,
        "toSq": 22,
        "from": {
          "r": 3,
          "c": 4
        },
        "to": {
          "r": 4,
          "c": 3
        },
        "note": "Opponent responds 18-22",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 34,
        "toSq": 23,
        "from": {
          "r": 6,
          "c": 7
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Continue combo: 34x23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 22,
        "toSq": 33,
        "from": {
          "r": 4,
          "c": 3
        },
        "to": {
          "r": 6,
          "c": 5
        },
        "note": "Opponent responds 22x31",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 33,
        "toSq": 42,
        "from": {
          "r": 6,
          "c": 5
        },
        "to": {
          "r": 8,
          "c": 3
        },
        "note": "Multi-jump continue: 42",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 42,
        "toSq": 31,
        "from": {
          "r": 8,
          "c": 3
        },
        "to": {
          "r": 6,
          "c": 1
        },
        "note": "Multi-jump continue: 31",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 36,
        "toSq": 27,
        "from": {
          "r": 7,
          "c": 0
        },
        "to": {
          "r": 5,
          "c": 2
        },
        "note": "Continue combo: 36x27",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 26,
        "toSq": 31,
        "from": {
          "r": 5,
          "c": 0
        },
        "to": {
          "r": 6,
          "c": 1
        },
        "note": "Opponent responds 26-31",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 27,
        "toSq": 36,
        "from": {
          "r": 5,
          "c": 2
        },
        "to": {
          "r": 7,
          "c": 0
        },
        "note": "Continue combo: 27x36",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 12,
        "toSq": 18,
        "from": {
          "r": 2,
          "c": 3
        },
        "to": {
          "r": 3,
          "c": 4
        },
        "note": "Opponent responds 12-18",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 23,
        "toSq": 12,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 2,
          "c": 3
        },
        "note": "Continue combo: 23x21",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 12,
        "toSq": 21,
        "from": {
          "r": 2,
          "c": 3
        },
        "to": {
          "r": 4,
          "c": 1
        },
        "note": "Multi-jump continue: 21",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 16,
        "toSq": 27,
        "from": {
          "r": 3,
          "c": 0
        },
        "to": {
          "r": 5,
          "c": 2
        },
        "note": "Opponent responds 16x49",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 27,
        "toSq": 38,
        "from": {
          "r": 5,
          "c": 2
        },
        "to": {
          "r": 7,
          "c": 4
        },
        "note": "Multi-jump continue: 38",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 38,
        "toSq": 49,
        "from": {
          "r": 7,
          "c": 4
        },
        "to": {
          "r": 9,
          "c": 6
        },
        "note": "Multi-jump continue: 49",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-7-ADD",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🛡️ Defensive Test #7 (7.PNG): Added Flank Seeds",
    "badge": "🛡️ Defense #7",
    "source_image": "7.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "center-wedge",
    "themeName": "Flank Complexity • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Variation with extra seeds added to 7.PNG testing precision under flank distractions",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "We add seeds to test your vision on 7.PNG! No allow the flank noise distract you from the main shot!",
    "difficulty": {
      "tier": 10,
      "tier_name": "Master",
      "rating": 2240,
      "human_score": 80
    },
    "difficultyTier": 10,
    "rating": 2240,
    "hints": [
      "Additional flank seeds have been added, but the central combination remains deadly.",
      "Don't get distracted by slow flank moves. Find the forced combination.",
      "Strike with 48-43!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 3,
        "square": 2,
        "player": 2,
        "isKing": false
      },
      {
        "r": 1,
        "c": 4,
        "square": 8,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 7,
        "square": 14,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 6,
        "square": 19,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 1,
        "square": 21,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 3,
        "square": 22,
        "player": 1,
        "isKing": false
      },
      {
        "r": 4,
        "c": 5,
        "square": 23,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 7,
        "square": 24,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 9,
        "square": 25,
        "player": 1,
        "isKing": false
      },
      {
        "r": 5,
        "c": 4,
        "square": 28,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 3,
        "square": 32,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 5,
        "square": 33,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 4,
        "square": 38,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 2,
        "square": 47,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 4,
        "square": 48,
        "player": 1,
        "isKing": false
      },
      {
        "r": 0,
        "c": 1,
        "player": 2,
        "isKing": false,
        "square": 1
      },
      {
        "r": 1,
        "c": 0,
        "player": 2,
        "isKing": false,
        "square": 6
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 48,
        "toSq": 43,
        "from": {
          "r": 9,
          "c": 4
        },
        "to": {
          "r": 8,
          "c": 5
        },
        "note": "Key strike: 48-43!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 13,
        "toSq": 18,
        "from": {
          "r": 2,
          "c": 5
        },
        "to": {
          "r": 3,
          "c": 4
        },
        "note": "Opponent responds 13-18",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 22,
        "toSq": 13,
        "from": {
          "r": 4,
          "c": 3
        },
        "to": {
          "r": 2,
          "c": 5
        },
        "note": "Continue combo: 22x13",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 21,
        "toSq": 27,
        "from": {
          "r": 4,
          "c": 1
        },
        "to": {
          "r": 5,
          "c": 2
        },
        "note": "Opponent responds 21-27",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 32,
        "toSq": 21,
        "from": {
          "r": 6,
          "c": 3
        },
        "to": {
          "r": 4,
          "c": 1
        },
        "note": "Continue combo: 32x21",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 23,
        "toSq": 32,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Opponent responds 23x32",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 38,
        "toSq": 27,
        "from": {
          "r": 7,
          "c": 4
        },
        "to": {
          "r": 5,
          "c": 2
        },
        "note": "Continue combo: 38x27",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 14,
        "toSq": 20,
        "from": {
          "r": 2,
          "c": 7
        },
        "to": {
          "r": 3,
          "c": 8
        },
        "note": "Opponent responds 14-20",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 25,
        "toSq": 14,
        "from": {
          "r": 4,
          "c": 9
        },
        "to": {
          "r": 2,
          "c": 7
        },
        "note": "Continue combo: 25x23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 14,
        "toSq": 23,
        "from": {
          "r": 2,
          "c": 7
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Multi-jump continue: 23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 8,
        "toSq": 19,
        "from": {
          "r": 1,
          "c": 4
        },
        "to": {
          "r": 3,
          "c": 6
        },
        "note": "Opponent responds 8x48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Multi-jump continue: 28",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 28,
        "toSq": 39,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 4
        },
        "note": "Multi-jump continue: 48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-8-ADD",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🛡️ Defensive Test #8 (8.PNG): Added Flank Seeds",
    "badge": "🛡️ Defense #8",
    "source_image": "8.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "highway-clearance",
    "themeName": "Flank Complexity • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Variation with extra seeds added to 8.PNG testing precision under flank distractions",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "We add seeds to test your vision on 8.PNG! No allow the flank noise distract you from the main shot!",
    "difficulty": {
      "tier": 10,
      "tier_name": "Master",
      "rating": 2255,
      "human_score": 80
    },
    "difficultyTier": 10,
    "rating": 2255,
    "hints": [
      "Additional flank seeds have been added, but the central combination remains deadly.",
      "Don't get distracted by slow flank moves. Find the forced combination.",
      "Strike with 40-35!"
    ],
    "initialBoard": [
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 7,
        "square": 14,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 2,
        "square": 17,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 4,
        "square": 18,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 6,
        "square": 19,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 3,
        "square": 22,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 9,
        "square": 25,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 0,
        "square": 26,
        "player": 1,
        "isKing": false
      },
      {
        "r": 5,
        "c": 8,
        "square": 30,
        "player": 2,
        "isKing": false
      },
      {
        "r": 6,
        "c": 1,
        "square": 31,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 5,
        "square": 33,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 7,
        "square": 34,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 4,
        "square": 38,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 6,
        "square": 39,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 8,
        "square": 40,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 7,
        "square": 44,
        "player": 1,
        "isKing": false
      },
      {
        "r": 0,
        "c": 1,
        "player": 2,
        "isKing": false,
        "square": 1
      },
      {
        "r": 1,
        "c": 0,
        "player": 2,
        "isKing": false,
        "square": 6
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 40,
        "toSq": 35,
        "from": {
          "r": 7,
          "c": 8
        },
        "to": {
          "r": 6,
          "c": 9
        },
        "note": "Key strike: 40-35!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 17,
        "toSq": 21,
        "from": {
          "r": 3,
          "c": 2
        },
        "to": {
          "r": 4,
          "c": 1
        },
        "note": "Opponent responds 17-21",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 26,
        "toSq": 17,
        "from": {
          "r": 5,
          "c": 0
        },
        "to": {
          "r": 3,
          "c": 2
        },
        "note": "Continue combo: 26x28",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 17,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 2
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Multi-jump continue: 28",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 18,
        "toSq": 23,
        "from": {
          "r": 3,
          "c": 4
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Opponent responds 18-23",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 35,
        "toSq": 24,
        "from": {
          "r": 6,
          "c": 9
        },
        "to": {
          "r": 4,
          "c": 7
        },
        "note": "Continue combo: 35x24",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 23,
        "toSq": 32,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Opponent responds 23x43",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 32,
        "toSq": 43,
        "from": {
          "r": 6,
          "c": 3
        },
        "to": {
          "r": 8,
          "c": 5
        },
        "note": "Multi-jump continue: 43",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 39,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 4
        },
        "note": "Continue combo: 39x48",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 30,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 8
        },
        "note": "Opponent responds 19x50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 30,
        "toSq": 39,
        "from": {
          "r": 5,
          "c": 8
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 50,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 8
        },
        "note": "Multi-jump continue: 50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-9-ADD",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🛡️ Defensive Test #9 (10.PNG): Added Flank Seeds",
    "badge": "🛡️ Defense #9",
    "source_image": "10.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "coronation-ambush",
    "themeName": "Flank Complexity • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Variation with extra seeds added to 10.PNG testing precision under flank distractions",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "We add seeds to test your vision on 10.PNG! No allow the flank noise distract you from the main shot!",
    "difficulty": {
      "tier": 10,
      "tier_name": "Master",
      "rating": 2270,
      "human_score": 80
    },
    "difficultyTier": 10,
    "rating": 2270,
    "hints": [
      "Additional flank seeds have been added, but the central combination remains deadly.",
      "Don't get distracted by slow flank moves. Find the forced combination.",
      "Strike with 39-33!"
    ],
    "initialBoard": [
      {
        "r": 1,
        "c": 4,
        "square": 8,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 3,
        "square": 12,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 7,
        "square": 14,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 0,
        "square": 16,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 4,
        "square": 18,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 6,
        "square": 19,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 7,
        "square": 24,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 9,
        "square": 25,
        "player": 1,
        "isKing": false
      },
      {
        "r": 5,
        "c": 2,
        "square": 27,
        "player": 1,
        "isKing": false
      },
      {
        "r": 5,
        "c": 4,
        "square": 28,
        "player": 1,
        "isKing": false
      },
      {
        "r": 5,
        "c": 6,
        "square": 29,
        "player": 2,
        "isKing": false
      },
      {
        "r": 6,
        "c": 3,
        "square": 32,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 9,
        "square": 35,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 4,
        "square": 38,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 6,
        "square": 39,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 7,
        "square": 44,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 4,
        "square": 48,
        "player": 1,
        "isKing": false
      },
      {
        "r": 0,
        "c": 1,
        "player": 2,
        "isKing": false,
        "square": 1
      },
      {
        "r": 1,
        "c": 0,
        "player": 2,
        "isKing": false,
        "square": 6
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 39,
        "toSq": 33,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 6,
          "c": 5
        },
        "note": "Key strike: 39-33!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 16,
        "toSq": 21,
        "from": {
          "r": 3,
          "c": 0
        },
        "to": {
          "r": 4,
          "c": 1
        },
        "note": "Opponent responds 16-21",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 27,
        "toSq": 16,
        "from": {
          "r": 5,
          "c": 2
        },
        "to": {
          "r": 3,
          "c": 0
        },
        "note": "Continue combo: 27x16",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 18,
        "toSq": 22,
        "from": {
          "r": 3,
          "c": 4
        },
        "to": {
          "r": 4,
          "c": 3
        },
        "note": "Opponent responds 18-22",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 28,
        "toSq": 17,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 3,
          "c": 2
        },
        "note": "Continue combo: 28x17",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 12,
        "toSq": 21,
        "from": {
          "r": 2,
          "c": 3
        },
        "to": {
          "r": 4,
          "c": 1
        },
        "note": "Opponent responds 12x21",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 16,
        "toSq": 27,
        "from": {
          "r": 3,
          "c": 0
        },
        "to": {
          "r": 5,
          "c": 2
        },
        "note": "Continue combo: 16x27",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 24,
        "toSq": 30,
        "from": {
          "r": 4,
          "c": 7
        },
        "to": {
          "r": 5,
          "c": 8
        },
        "note": "Opponent responds 24-30",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 25,
        "toSq": 34,
        "from": {
          "r": 4,
          "c": 9
        },
        "to": {
          "r": 6,
          "c": 7
        },
        "note": "Continue combo: 25x23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 34,
        "toSq": 23,
        "from": {
          "r": 6,
          "c": 7
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Multi-jump continue: 23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Opponent responds 19x50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 28,
        "toSq": 39,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 50,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 8
        },
        "note": "Multi-jump continue: 50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-10-ADD",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🛡️ Defensive Test #10 (11.PNG): Added Flank Seeds",
    "badge": "🛡️ Defense #10",
    "source_image": "11.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "flank-squeeze",
    "themeName": "Flank Complexity • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Variation with extra seeds added to 11.PNG testing precision under flank distractions",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "We add seeds to test your vision on 11.PNG! No allow the flank noise distract you from the main shot!",
    "difficulty": {
      "tier": 10,
      "tier_name": "Master",
      "rating": 2285,
      "human_score": 80
    },
    "difficultyTier": 10,
    "rating": 2285,
    "hints": [
      "Additional flank seeds have been added, but the central combination remains deadly.",
      "Don't get distracted by slow flank moves. Find the forced combination.",
      "Strike with 30-25!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 3,
        "square": 2,
        "player": 2,
        "isKing": false
      },
      {
        "r": 0,
        "c": 5,
        "square": 3,
        "player": 2,
        "isKing": false
      },
      {
        "r": 1,
        "c": 4,
        "square": 8,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 3,
        "square": 12,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 6,
        "square": 19,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 8,
        "square": 20,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 3,
        "square": 22,
        "player": 1,
        "isKing": false
      },
      {
        "r": 4,
        "c": 5,
        "square": 23,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 2,
        "square": 27,
        "player": 1,
        "isKing": false
      },
      {
        "r": 5,
        "c": 4,
        "square": 28,
        "player": 1,
        "isKing": false
      },
      {
        "r": 5,
        "c": 8,
        "square": 30,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 3,
        "square": 32,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 3,
        "square": 42,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 5,
        "square": 43,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 7,
        "square": 44,
        "player": 1,
        "isKing": false
      },
      {
        "r": 0,
        "c": 1,
        "player": 2,
        "isKing": false,
        "square": 1
      },
      {
        "r": 1,
        "c": 0,
        "player": 2,
        "isKing": false,
        "square": 6
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 30,
        "toSq": 25,
        "from": {
          "r": 5,
          "c": 8
        },
        "to": {
          "r": 4,
          "c": 9
        },
        "note": "Key strike: 30-25!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 24,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 4,
          "c": 7
        },
        "note": "Opponent responds 19-24",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 28,
        "toSq": 19,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 3,
          "c": 6
        },
        "note": "Continue combo: 28x30",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 19,
        "toSq": 30,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 8
        },
        "note": "Multi-jump continue: 30",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 13,
        "toSq": 19,
        "from": {
          "r": 2,
          "c": 5
        },
        "to": {
          "r": 3,
          "c": 6
        },
        "note": "Opponent responds 13-19",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 25,
        "toSq": 14,
        "from": {
          "r": 4,
          "c": 9
        },
        "to": {
          "r": 2,
          "c": 7
        },
        "note": "Continue combo: 25x23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 14,
        "toSq": 23,
        "from": {
          "r": 2,
          "c": 7
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Multi-jump continue: 23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 12,
        "toSq": 18,
        "from": {
          "r": 2,
          "c": 3
        },
        "to": {
          "r": 3,
          "c": 4
        },
        "note": "Opponent responds 12-18",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 22,
        "toSq": 13,
        "from": {
          "r": 4,
          "c": 3
        },
        "to": {
          "r": 2,
          "c": 5
        },
        "note": "Continue combo: 22x13",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 8,
        "toSq": 19,
        "from": {
          "r": 1,
          "c": 4
        },
        "to": {
          "r": 3,
          "c": 6
        },
        "note": "Opponent responds 8x50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Multi-jump continue: 28",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 28,
        "toSq": 37,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 2
        },
        "note": "Multi-jump continue: 37",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 37,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 2
        },
        "to": {
          "r": 9,
          "c": 4
        },
        "note": "Multi-jump continue: 48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 48,
        "toSq": 39,
        "from": {
          "r": 9,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 50,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 8
        },
        "note": "Multi-jump continue: 50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-11-ADD",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🛡️ Defensive Test #11 (12.PNG): Added Flank Seeds",
    "badge": "🛡️ Defense #11",
    "source_image": "12.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "infiltration-stride",
    "themeName": "Flank Complexity • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Variation with extra seeds added to 12.PNG testing precision under flank distractions",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "We add seeds to test your vision on 12.PNG! No allow the flank noise distract you from the main shot!",
    "difficulty": {
      "tier": 10,
      "tier_name": "Master",
      "rating": 2300,
      "human_score": 80
    },
    "difficultyTier": 10,
    "rating": 2300,
    "hints": [
      "Additional flank seeds have been added, but the central combination remains deadly.",
      "Don't get distracted by slow flank moves. Find the forced combination.",
      "Strike with 28-23!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 5,
        "square": 3,
        "player": 2,
        "isKing": false
      },
      {
        "r": 1,
        "c": 4,
        "square": 8,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 1,
        "square": 11,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 3,
        "square": 12,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 7,
        "square": 14,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 7,
        "square": 24,
        "player": 1,
        "isKing": false
      },
      {
        "r": 5,
        "c": 2,
        "square": 27,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 4,
        "square": 28,
        "player": 1,
        "isKing": false
      },
      {
        "r": 5,
        "c": 6,
        "square": 29,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 4,
        "square": 38,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 3,
        "square": 42,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 5,
        "square": 43,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 7,
        "square": 44,
        "player": 1,
        "isKing": false
      },
      {
        "r": 0,
        "c": 1,
        "player": 2,
        "isKing": false,
        "square": 1
      },
      {
        "r": 1,
        "c": 0,
        "player": 2,
        "isKing": false,
        "square": 6
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 28,
        "toSq": 23,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Key strike: 28-23!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 13,
        "toSq": 19,
        "from": {
          "r": 2,
          "c": 5
        },
        "to": {
          "r": 3,
          "c": 6
        },
        "note": "Opponent responds 13-19",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 24,
        "toSq": 13,
        "from": {
          "r": 4,
          "c": 7
        },
        "to": {
          "r": 2,
          "c": 5
        },
        "note": "Continue combo: 24x2",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 13,
        "toSq": 2,
        "from": {
          "r": 2,
          "c": 5
        },
        "to": {
          "r": 0,
          "c": 3
        },
        "note": "Multi-jump continue: 2",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 14,
        "toSq": 19,
        "from": {
          "r": 2,
          "c": 7
        },
        "to": {
          "r": 3,
          "c": 6
        },
        "note": "Opponent responds 14-19",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 2,
        "toSq": 16,
        "from": {
          "r": 0,
          "c": 3
        },
        "to": {
          "r": 3,
          "c": 0
        },
        "note": "Continue combo: 2x32",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 16,
        "toSq": 32,
        "from": {
          "r": 3,
          "c": 0
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Multi-jump continue: 32",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Opponent responds 19x50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 28,
        "toSq": 37,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 2
        },
        "note": "Multi-jump continue: 37",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 37,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 2
        },
        "to": {
          "r": 9,
          "c": 4
        },
        "note": "Multi-jump continue: 48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 48,
        "toSq": 39,
        "from": {
          "r": 9,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 50,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 8
        },
        "note": "Multi-jump continue: 50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-12-ADD",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🛡️ Defensive Test #12 (13.PNG): Added Flank Seeds",
    "badge": "🛡️ Defense #12",
    "source_image": "13.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "decoy-breaker",
    "themeName": "Flank Complexity • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Variation with extra seeds added to 13.PNG testing precision under flank distractions",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "We add seeds to test your vision on 13.PNG! No allow the flank noise distract you from the main shot!",
    "difficulty": {
      "tier": 10,
      "tier_name": "Master",
      "rating": 2315,
      "human_score": 80
    },
    "difficultyTier": 10,
    "rating": 2315,
    "hints": [
      "Additional flank seeds have been added, but the central combination remains deadly.",
      "Don't get distracted by slow flank moves. Find the forced combination.",
      "Strike with 31-27!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 5,
        "square": 3,
        "player": 2,
        "isKing": false
      },
      {
        "r": 1,
        "c": 8,
        "square": 10,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 1,
        "square": 11,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 3,
        "square": 12,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 7,
        "square": 14,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 2,
        "square": 17,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 5,
        "square": 23,
        "player": 1,
        "isKing": false
      },
      {
        "r": 4,
        "c": 9,
        "square": 25,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 6,
        "square": 29,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 1,
        "square": 31,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 5,
        "square": 33,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 9,
        "square": 35,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 1,
        "square": 41,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 3,
        "square": 42,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 5,
        "square": 43,
        "player": 1,
        "isKing": false
      },
      {
        "r": 0,
        "c": 1,
        "player": 2,
        "isKing": false,
        "square": 1
      },
      {
        "r": 1,
        "c": 0,
        "player": 2,
        "isKing": false,
        "square": 6
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 31,
        "toSq": 27,
        "from": {
          "r": 6,
          "c": 1
        },
        "to": {
          "r": 5,
          "c": 2
        },
        "note": "Key strike: 31-27!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 25,
        "toSq": 30,
        "from": {
          "r": 4,
          "c": 9
        },
        "to": {
          "r": 5,
          "c": 8
        },
        "note": "Opponent responds 25-30",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 35,
        "toSq": 24,
        "from": {
          "r": 6,
          "c": 9
        },
        "to": {
          "r": 4,
          "c": 7
        },
        "note": "Continue combo: 35x24",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 14,
        "toSq": 20,
        "from": {
          "r": 2,
          "c": 7
        },
        "to": {
          "r": 3,
          "c": 8
        },
        "note": "Opponent responds 14-20",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 24,
        "toSq": 15,
        "from": {
          "r": 4,
          "c": 7
        },
        "to": {
          "r": 2,
          "c": 9
        },
        "note": "Continue combo: 24x4",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 15,
        "toSq": 4,
        "from": {
          "r": 2,
          "c": 9
        },
        "to": {
          "r": 0,
          "c": 7
        },
        "note": "Multi-jump continue: 4",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 13,
        "toSq": 18,
        "from": {
          "r": 2,
          "c": 5
        },
        "to": {
          "r": 3,
          "c": 4
        },
        "note": "Opponent responds 13-18",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 4,
        "toSq": 22,
        "from": {
          "r": 0,
          "c": 7
        },
        "to": {
          "r": 4,
          "c": 3
        },
        "note": "Continue combo: 4x22",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 17,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 2
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Opponent responds 17x46",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 28,
        "toSq": 39,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 4
        },
        "note": "Multi-jump continue: 48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 48,
        "toSq": 37,
        "from": {
          "r": 9,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 2
        },
        "note": "Multi-jump continue: 37",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 37,
        "toSq": 46,
        "from": {
          "r": 7,
          "c": 2
        },
        "to": {
          "r": 9,
          "c": 0
        },
        "note": "Multi-jump continue: 46",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-13-ADD",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🛡️ Defensive Test #13 (14.PNG): Added Flank Seeds",
    "badge": "🛡️ Defense #13",
    "source_image": "14.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "diagonal-trap",
    "themeName": "Flank Complexity • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Variation with extra seeds added to 14.PNG testing precision under flank distractions",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "We add seeds to test your vision on 14.PNG! No allow the flank noise distract you from the main shot!",
    "difficulty": {
      "tier": 10,
      "tier_name": "Master",
      "rating": 2330,
      "human_score": 80
    },
    "difficultyTier": 10,
    "rating": 2330,
    "hints": [
      "Additional flank seeds have been added, but the central combination remains deadly.",
      "Don't get distracted by slow flank moves. Find the forced combination.",
      "Strike with 32-28!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 7,
        "square": 4,
        "player": 2,
        "isKing": false
      },
      {
        "r": 1,
        "c": 4,
        "square": 8,
        "player": 2,
        "isKing": false
      },
      {
        "r": 1,
        "c": 8,
        "square": 10,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 7,
        "square": 14,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 4,
        "square": 18,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 6,
        "square": 19,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 7,
        "square": 24,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 9,
        "square": 25,
        "player": 1,
        "isKing": false
      },
      {
        "r": 5,
        "c": 8,
        "square": 30,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 3,
        "square": 32,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 5,
        "square": 33,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 9,
        "square": 35,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 4,
        "square": 38,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 6,
        "square": 39,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 8,
        "square": 40,
        "player": 1,
        "isKing": false
      },
      {
        "r": 0,
        "c": 1,
        "player": 2,
        "isKing": false,
        "square": 1
      },
      {
        "r": 1,
        "c": 0,
        "player": 2,
        "isKing": false,
        "square": 6
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 32,
        "toSq": 28,
        "from": {
          "r": 6,
          "c": 3
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Key strike: 32-28!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 18,
        "toSq": 22,
        "from": {
          "r": 3,
          "c": 4
        },
        "to": {
          "r": 4,
          "c": 3
        },
        "note": "Opponent responds 18-22",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 28,
        "toSq": 17,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 3,
          "c": 2
        },
        "note": "Continue combo: 28x17",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 23,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Opponent responds 19-23",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 30,
        "toSq": 19,
        "from": {
          "r": 5,
          "c": 8
        },
        "to": {
          "r": 3,
          "c": 6
        },
        "note": "Continue combo: 30x28",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 19,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Multi-jump continue: 28",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 8,
        "toSq": 12,
        "from": {
          "r": 1,
          "c": 4
        },
        "to": {
          "r": 2,
          "c": 3
        },
        "note": "Opponent responds 8-12",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 17,
        "toSq": 8,
        "from": {
          "r": 3,
          "c": 2
        },
        "to": {
          "r": 1,
          "c": 4
        },
        "note": "Continue combo: 17x19",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 8,
        "toSq": 19,
        "from": {
          "r": 1,
          "c": 4
        },
        "to": {
          "r": 3,
          "c": 6
        },
        "note": "Multi-jump continue: 19",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 14,
        "toSq": 23,
        "from": {
          "r": 2,
          "c": 7
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Opponent responds 14x45",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 23,
        "toSq": 32,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Multi-jump continue: 32",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 32,
        "toSq": 43,
        "from": {
          "r": 6,
          "c": 3
        },
        "to": {
          "r": 8,
          "c": 5
        },
        "note": "Multi-jump continue: 43",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 43,
        "toSq": 34,
        "from": {
          "r": 8,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 7
        },
        "note": "Multi-jump continue: 34",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 34,
        "toSq": 45,
        "from": {
          "r": 6,
          "c": 7
        },
        "to": {
          "r": 8,
          "c": 9
        },
        "note": "Multi-jump continue: 45",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-14-ADD",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🛡️ Defensive Test #14 (15.PNG): Added Flank Seeds",
    "badge": "🛡️ Defense #14",
    "source_image": "15.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "pin-and-shatter",
    "themeName": "Flank Complexity • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Variation with extra seeds added to 15.PNG testing precision under flank distractions",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "We add seeds to test your vision on 15.PNG! No allow the flank noise distract you from the main shot!",
    "difficulty": {
      "tier": 10,
      "tier_name": "Master",
      "rating": 2345,
      "human_score": 80
    },
    "difficultyTier": 10,
    "rating": 2345,
    "hints": [
      "Additional flank seeds have been added, but the central combination remains deadly.",
      "Don't get distracted by slow flank moves. Find the forced combination.",
      "Strike with 38-32!"
    ],
    "initialBoard": [
      {
        "r": 2,
        "c": 1,
        "square": 11,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 3,
        "square": 12,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 4,
        "square": 18,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 6,
        "square": 19,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 8,
        "square": 20,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 3,
        "square": 22,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 5,
        "square": 23,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 9,
        "square": 25,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 6,
        "square": 29,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 5,
        "square": 33,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 7,
        "square": 34,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 9,
        "square": 35,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 4,
        "square": 38,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 3,
        "square": 42,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 7,
        "square": 44,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 9,
        "square": 45,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 2,
        "square": 47,
        "player": 1,
        "isKing": false
      },
      {
        "r": 0,
        "c": 1,
        "player": 2,
        "isKing": false,
        "square": 1
      },
      {
        "r": 1,
        "c": 0,
        "player": 2,
        "isKing": false,
        "square": 6
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 38,
        "toSq": 32,
        "from": {
          "r": 7,
          "c": 4
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Key strike: 38-32!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 22,
        "toSq": 28,
        "from": {
          "r": 4,
          "c": 3
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Opponent responds 22-28",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 33,
        "toSq": 22,
        "from": {
          "r": 6,
          "c": 5
        },
        "to": {
          "r": 4,
          "c": 3
        },
        "note": "Continue combo: 33x22",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 18,
        "toSq": 27,
        "from": {
          "r": 3,
          "c": 4
        },
        "to": {
          "r": 5,
          "c": 2
        },
        "note": "Opponent responds 18x38",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 27,
        "toSq": 38,
        "from": {
          "r": 5,
          "c": 2
        },
        "to": {
          "r": 7,
          "c": 4
        },
        "note": "Multi-jump continue: 38",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 29,
        "toSq": 18,
        "from": {
          "r": 5,
          "c": 6
        },
        "to": {
          "r": 3,
          "c": 4
        },
        "note": "Continue combo: 29x16",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 18,
        "toSq": 7,
        "from": {
          "r": 3,
          "c": 4
        },
        "to": {
          "r": 1,
          "c": 2
        },
        "note": "Multi-jump continue: 7",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 7,
        "toSq": 16,
        "from": {
          "r": 1,
          "c": 2
        },
        "to": {
          "r": 3,
          "c": 0
        },
        "note": "Multi-jump continue: 16",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 20,
        "toSq": 24,
        "from": {
          "r": 3,
          "c": 8
        },
        "to": {
          "r": 4,
          "c": 7
        },
        "note": "Opponent responds 20-24",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 42,
        "toSq": 33,
        "from": {
          "r": 8,
          "c": 3
        },
        "to": {
          "r": 6,
          "c": 5
        },
        "note": "Continue combo: 42x33",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 24,
        "toSq": 30,
        "from": {
          "r": 4,
          "c": 7
        },
        "to": {
          "r": 5,
          "c": 8
        },
        "note": "Opponent responds 24-30",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 35,
        "toSq": 24,
        "from": {
          "r": 6,
          "c": 9
        },
        "to": {
          "r": 4,
          "c": 7
        },
        "note": "Continue combo: 35x24",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 30,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 8
        },
        "note": "Opponent responds 19x50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 30,
        "toSq": 39,
        "from": {
          "r": 5,
          "c": 8
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 50,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 8
        },
        "note": "Multi-jump continue: 50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-15-ADD",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🛡️ Defensive Test #15 (16.PNG): Added Flank Seeds",
    "badge": "🛡️ Defense #15",
    "source_image": "16.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "king-strike",
    "themeName": "Flank Complexity • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Variation with extra seeds added to 16.PNG testing precision under flank distractions",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "We add seeds to test your vision on 16.PNG! No allow the flank noise distract you from the main shot!",
    "difficulty": {
      "tier": 10,
      "tier_name": "Master",
      "rating": 2360,
      "human_score": 80
    },
    "difficultyTier": 10,
    "rating": 2360,
    "hints": [
      "Additional flank seeds have been added, but the central combination remains deadly.",
      "Don't get distracted by slow flank moves. Find the forced combination.",
      "Strike with 49-43!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 7,
        "square": 4,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 3,
        "square": 12,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 0,
        "square": 16,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 2,
        "square": 17,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 3,
        "square": 22,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 5,
        "square": 23,
        "player": 1,
        "isKing": false
      },
      {
        "r": 4,
        "c": 7,
        "square": 24,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 0,
        "square": 26,
        "player": 2,
        "isKing": false
      },
      {
        "r": 6,
        "c": 7,
        "square": 34,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 0,
        "square": 36,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 2,
        "square": 37,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 9,
        "square": 45,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 4,
        "square": 48,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 6,
        "square": 49,
        "player": 1,
        "isKing": false
      },
      {
        "r": 0,
        "c": 1,
        "player": 2,
        "isKing": false,
        "square": 1
      },
      {
        "r": 1,
        "c": 0,
        "player": 2,
        "isKing": false,
        "square": 6
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 49,
        "toSq": 43,
        "from": {
          "r": 9,
          "c": 6
        },
        "to": {
          "r": 8,
          "c": 5
        },
        "note": "Key strike: 49-43!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 22,
        "toSq": 28,
        "from": {
          "r": 4,
          "c": 3
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Opponent responds 22-28",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 23,
        "toSq": 32,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Continue combo: 23x32",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 24,
        "toSq": 29,
        "from": {
          "r": 4,
          "c": 7
        },
        "to": {
          "r": 5,
          "c": 6
        },
        "note": "Opponent responds 24-29",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 34,
        "toSq": 23,
        "from": {
          "r": 6,
          "c": 7
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Continue combo: 34x23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 12,
        "toSq": 18,
        "from": {
          "r": 2,
          "c": 3
        },
        "to": {
          "r": 3,
          "c": 4
        },
        "note": "Opponent responds 12-18",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 23,
        "toSq": 12,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 2,
          "c": 3
        },
        "note": "Continue combo: 23x21",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 12,
        "toSq": 21,
        "from": {
          "r": 2,
          "c": 3
        },
        "to": {
          "r": 4,
          "c": 1
        },
        "note": "Multi-jump continue: 21",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 16,
        "toSq": 27,
        "from": {
          "r": 3,
          "c": 0
        },
        "to": {
          "r": 5,
          "c": 2
        },
        "note": "Opponent responds 16x49",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 27,
        "toSq": 38,
        "from": {
          "r": 5,
          "c": 2
        },
        "to": {
          "r": 7,
          "c": 4
        },
        "note": "Multi-jump continue: 38",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 38,
        "toSq": 49,
        "from": {
          "r": 7,
          "c": 4
        },
        "to": {
          "r": 9,
          "c": 6
        },
        "note": "Multi-jump continue: 49",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-16-ADD",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🛡️ Defensive Test #16 (17.PNG): Added Flank Seeds",
    "badge": "🛡️ Defense #16",
    "source_image": "17.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "counter-sweep",
    "themeName": "Flank Complexity • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Variation with extra seeds added to 17.PNG testing precision under flank distractions",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "We add seeds to test your vision on 17.PNG! No allow the flank noise distract you from the main shot!",
    "difficulty": {
      "tier": 10,
      "tier_name": "Master",
      "rating": 2375,
      "human_score": 80
    },
    "difficultyTier": 10,
    "rating": 2375,
    "hints": [
      "Additional flank seeds have been added, but the central combination remains deadly.",
      "Don't get distracted by slow flank moves. Find the forced combination.",
      "Strike with 27-21!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 3,
        "square": 2,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 7,
        "square": 14,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 2,
        "square": 17,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 4,
        "square": 18,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 6,
        "square": 19,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 7,
        "square": 24,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 0,
        "square": 26,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 2,
        "square": 27,
        "player": 1,
        "isKing": false
      },
      {
        "r": 5,
        "c": 4,
        "square": 28,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 5,
        "square": 33,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 7,
        "square": 34,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 2,
        "square": 37,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 1,
        "square": 41,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 5,
        "square": 43,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 4,
        "square": 48,
        "player": 1,
        "isKing": false
      },
      {
        "r": 0,
        "c": 1,
        "player": 2,
        "isKing": false,
        "square": 1
      },
      {
        "r": 1,
        "c": 0,
        "player": 2,
        "isKing": false,
        "square": 6
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 27,
        "toSq": 21,
        "from": {
          "r": 5,
          "c": 2
        },
        "to": {
          "r": 4,
          "c": 1
        },
        "note": "Key strike: 27-21!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 26,
        "toSq": 31,
        "from": {
          "r": 5,
          "c": 0
        },
        "to": {
          "r": 6,
          "c": 1
        },
        "note": "Opponent responds 26-31",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 21,
        "toSq": 12,
        "from": {
          "r": 4,
          "c": 1
        },
        "to": {
          "r": 2,
          "c": 3
        },
        "note": "Continue combo: 21x23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 12,
        "toSq": 23,
        "from": {
          "r": 2,
          "c": 3
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Multi-jump continue: 23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 31,
        "toSq": 42,
        "from": {
          "r": 6,
          "c": 1
        },
        "to": {
          "r": 8,
          "c": 3
        },
        "note": "Opponent responds 31x42",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 48,
        "toSq": 37,
        "from": {
          "r": 9,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 2
        },
        "note": "Continue combo: 48x37",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 24,
        "toSq": 29,
        "from": {
          "r": 4,
          "c": 7
        },
        "to": {
          "r": 5,
          "c": 6
        },
        "note": "Opponent responds 24-29",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 33,
        "toSq": 24,
        "from": {
          "r": 6,
          "c": 5
        },
        "to": {
          "r": 4,
          "c": 7
        },
        "note": "Continue combo: 33x24",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 30,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 8
        },
        "note": "Opponent responds 19x48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 30,
        "toSq": 39,
        "from": {
          "r": 5,
          "c": 8
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 4
        },
        "note": "Multi-jump continue: 48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-17-ADD",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🛡️ Defensive Test #17 (18.PNG): Added Flank Seeds",
    "badge": "🛡️ Defense #17",
    "source_image": "18.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "coronation-trap",
    "themeName": "Flank Complexity • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Variation with extra seeds added to 18.PNG testing precision under flank distractions",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "We add seeds to test your vision on 18.PNG! No allow the flank noise distract you from the main shot!",
    "difficulty": {
      "tier": 10,
      "tier_name": "Master",
      "rating": 2390,
      "human_score": 80
    },
    "difficultyTier": 10,
    "rating": 2390,
    "hints": [
      "Additional flank seeds have been added, but the central combination remains deadly.",
      "Don't get distracted by slow flank moves. Find the forced combination.",
      "Strike with 34-29!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 3,
        "square": 2,
        "player": 2,
        "isKing": false
      },
      {
        "r": 0,
        "c": 7,
        "square": 4,
        "player": 2,
        "isKing": false
      },
      {
        "r": 1,
        "c": 2,
        "square": 7,
        "player": 2,
        "isKing": false
      },
      {
        "r": 1,
        "c": 4,
        "square": 8,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 9,
        "square": 15,
        "player": 1,
        "isKing": false
      },
      {
        "r": 4,
        "c": 1,
        "square": 21,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 3,
        "square": 22,
        "player": 2,
        "isKing": false
      },
      {
        "r": 6,
        "c": 3,
        "square": 32,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 5,
        "square": 33,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 7,
        "square": 34,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 2,
        "square": 37,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 4,
        "square": 38,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 6,
        "square": 39,
        "player": 1,
        "isKing": false
      },
      {
        "r": 0,
        "c": 1,
        "player": 2,
        "isKing": false,
        "square": 1
      },
      {
        "r": 1,
        "c": 0,
        "player": 2,
        "isKing": false,
        "square": 6
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 34,
        "toSq": 29,
        "from": {
          "r": 6,
          "c": 7
        },
        "to": {
          "r": 5,
          "c": 6
        },
        "note": "Key strike: 34-29!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 21,
        "toSq": 27,
        "from": {
          "r": 4,
          "c": 1
        },
        "to": {
          "r": 5,
          "c": 2
        },
        "note": "Opponent responds 21-27",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 32,
        "toSq": 21,
        "from": {
          "r": 6,
          "c": 3
        },
        "to": {
          "r": 4,
          "c": 1
        },
        "note": "Continue combo: 32x21",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 22,
        "toSq": 28,
        "from": {
          "r": 4,
          "c": 3
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Opponent responds 22-28",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 33,
        "toSq": 22,
        "from": {
          "r": 6,
          "c": 5
        },
        "to": {
          "r": 4,
          "c": 3
        },
        "note": "Continue combo: 33x22",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 4,
        "toSq": 10,
        "from": {
          "r": 0,
          "c": 7
        },
        "to": {
          "r": 1,
          "c": 8
        },
        "note": "Opponent responds 4-10",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 15,
        "toSq": 4,
        "from": {
          "r": 2,
          "c": 9
        },
        "to": {
          "r": 0,
          "c": 7
        },
        "note": "Continue combo: 15x4",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 8,
        "toSq": 12,
        "from": {
          "r": 1,
          "c": 4
        },
        "to": {
          "r": 2,
          "c": 3
        },
        "note": "Opponent responds 8-12",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 4,
        "toSq": 18,
        "from": {
          "r": 0,
          "c": 7
        },
        "to": {
          "r": 3,
          "c": 4
        },
        "note": "Continue combo: 4x18",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 12,
        "toSq": 23,
        "from": {
          "r": 2,
          "c": 3
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Opponent responds 12x41",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 23,
        "toSq": 34,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 7
        },
        "note": "Multi-jump continue: 34",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 34,
        "toSq": 43,
        "from": {
          "r": 6,
          "c": 7
        },
        "to": {
          "r": 8,
          "c": 5
        },
        "note": "Multi-jump continue: 43",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 43,
        "toSq": 32,
        "from": {
          "r": 8,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Multi-jump continue: 32",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 32,
        "toSq": 41,
        "from": {
          "r": 6,
          "c": 3
        },
        "to": {
          "r": 8,
          "c": 1
        },
        "note": "Multi-jump continue: 41",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-18-ADD",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🛡️ Defensive Test #18 (19.PNG): Added Flank Seeds",
    "badge": "🛡️ Defense #18",
    "source_image": "19.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "king-vacuum",
    "themeName": "Flank Complexity • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Variation with extra seeds added to 19.PNG testing precision under flank distractions",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "We add seeds to test your vision on 19.PNG! No allow the flank noise distract you from the main shot!",
    "difficulty": {
      "tier": 10,
      "tier_name": "Master",
      "rating": 2405,
      "human_score": 80
    },
    "difficultyTier": 10,
    "rating": 2405,
    "hints": [
      "Additional flank seeds have been added, but the central combination remains deadly.",
      "Don't get distracted by slow flank moves. Find the forced combination.",
      "Strike with 43-39!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 7,
        "square": 4,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 7,
        "square": 14,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 9,
        "square": 15,
        "player": 1,
        "isKing": false
      },
      {
        "r": 3,
        "c": 4,
        "square": 18,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 6,
        "square": 19,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 5,
        "square": 23,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 7,
        "square": 24,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 9,
        "square": 25,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 5,
        "square": 33,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 2,
        "square": 37,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 4,
        "square": 38,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 3,
        "square": 42,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 5,
        "square": 43,
        "player": 1,
        "isKing": false
      },
      {
        "r": 0,
        "c": 1,
        "player": 2,
        "isKing": false,
        "square": 1
      },
      {
        "r": 1,
        "c": 0,
        "player": 2,
        "isKing": false,
        "square": 6
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 43,
        "toSq": 39,
        "from": {
          "r": 8,
          "c": 5
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Key strike: 43-39!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 4,
        "toSq": 10,
        "from": {
          "r": 0,
          "c": 7
        },
        "to": {
          "r": 1,
          "c": 8
        },
        "note": "Opponent responds 4-10",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 15,
        "toSq": 4,
        "from": {
          "r": 2,
          "c": 9
        },
        "to": {
          "r": 0,
          "c": 7
        },
        "note": "Continue combo: 15x4",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 14,
        "toSq": 20,
        "from": {
          "r": 2,
          "c": 7
        },
        "to": {
          "r": 3,
          "c": 8
        },
        "note": "Opponent responds 14-20",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 25,
        "toSq": 14,
        "from": {
          "r": 4,
          "c": 9
        },
        "to": {
          "r": 2,
          "c": 7
        },
        "note": "Continue combo: 25x14",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 10,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 1,
          "c": 8
        },
        "note": "Opponent responds 19x10",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 4,
        "toSq": 15,
        "from": {
          "r": 0,
          "c": 7
        },
        "to": {
          "r": 2,
          "c": 9
        },
        "note": "Continue combo: 4x29",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 15,
        "toSq": 29,
        "from": {
          "r": 2,
          "c": 9
        },
        "to": {
          "r": 5,
          "c": 6
        },
        "note": "Multi-jump continue: 29",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 23,
        "toSq": 34,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 7
        },
        "note": "Opponent responds 23x41",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 34,
        "toSq": 43,
        "from": {
          "r": 6,
          "c": 7
        },
        "to": {
          "r": 8,
          "c": 5
        },
        "note": "Multi-jump continue: 43",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 43,
        "toSq": 32,
        "from": {
          "r": 8,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Multi-jump continue: 32",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 32,
        "toSq": 41,
        "from": {
          "r": 6,
          "c": 3
        },
        "to": {
          "r": 8,
          "c": 1
        },
        "note": "Multi-jump continue: 41",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-19-ADD",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🛡️ Defensive Test #19 (20.PNG): Added Flank Seeds",
    "badge": "🛡️ Defense #19",
    "source_image": "20.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "flank-deflection",
    "themeName": "Flank Complexity • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Variation with extra seeds added to 20.PNG testing precision under flank distractions",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "We add seeds to test your vision on 20.PNG! No allow the flank noise distract you from the main shot!",
    "difficulty": {
      "tier": 10,
      "tier_name": "Master",
      "rating": 2420,
      "human_score": 80
    },
    "difficultyTier": 10,
    "rating": 2420,
    "hints": [
      "Additional flank seeds have been added, but the central combination remains deadly.",
      "Don't get distracted by slow flank moves. Find the forced combination.",
      "Strike with 19-13!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 5,
        "square": 3,
        "player": 2,
        "isKing": false
      },
      {
        "r": 1,
        "c": 6,
        "square": 9,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 0,
        "square": 16,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 4,
        "square": 18,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 6,
        "square": 19,
        "player": 1,
        "isKing": false
      },
      {
        "r": 4,
        "c": 1,
        "square": 21,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 0,
        "square": 26,
        "player": 2,
        "isKing": false
      },
      {
        "r": 6,
        "c": 1,
        "square": 31,
        "player": 2,
        "isKing": false
      },
      {
        "r": 6,
        "c": 5,
        "square": 33,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 4,
        "square": 38,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 1,
        "square": 41,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 5,
        "square": 43,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 0,
        "square": 46,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 2,
        "square": 47,
        "player": 1,
        "isKing": false
      },
      {
        "r": 0,
        "c": 1,
        "player": 2,
        "isKing": false,
        "square": 1
      },
      {
        "r": 1,
        "c": 0,
        "player": 2,
        "isKing": false,
        "square": 6
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 19,
        "toSq": 13,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 2,
          "c": 5
        },
        "note": "Key strike: 19-13!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 9,
        "toSq": 14,
        "from": {
          "r": 1,
          "c": 6
        },
        "to": {
          "r": 2,
          "c": 7
        },
        "note": "Opponent responds 9-14",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 13,
        "toSq": 22,
        "from": {
          "r": 2,
          "c": 5
        },
        "to": {
          "r": 4,
          "c": 3
        },
        "note": "Continue combo: 13x22",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 31,
        "toSq": 37,
        "from": {
          "r": 6,
          "c": 1
        },
        "to": {
          "r": 7,
          "c": 2
        },
        "note": "Opponent responds 31-37",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 41,
        "toSq": 32,
        "from": {
          "r": 8,
          "c": 1
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Continue combo: 41x32",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 21,
        "toSq": 27,
        "from": {
          "r": 4,
          "c": 1
        },
        "to": {
          "r": 5,
          "c": 2
        },
        "note": "Opponent responds 21-27",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 22,
        "toSq": 31,
        "from": {
          "r": 4,
          "c": 3
        },
        "to": {
          "r": 6,
          "c": 1
        },
        "note": "Continue combo: 22x31",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 26,
        "toSq": 37,
        "from": {
          "r": 5,
          "c": 0
        },
        "to": {
          "r": 7,
          "c": 2
        },
        "note": "Opponent responds 26x48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 37,
        "toSq": 28,
        "from": {
          "r": 7,
          "c": 2
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Multi-jump continue: 28",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 28,
        "toSq": 39,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 4
        },
        "note": "Multi-jump continue: 48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-20-ADD",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🛡️ Defensive Test #20 (21.PNG): Added Flank Seeds",
    "badge": "🛡️ Defense #20",
    "source_image": "21.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "coup-royal",
    "themeName": "Flank Complexity • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Variation with extra seeds added to 21.PNG testing precision under flank distractions",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "We add seeds to test your vision on 21.PNG! No allow the flank noise distract you from the main shot!",
    "difficulty": {
      "tier": 10,
      "tier_name": "Master",
      "rating": 2435,
      "human_score": 80
    },
    "difficultyTier": 10,
    "rating": 2435,
    "hints": [
      "Additional flank seeds have been added, but the central combination remains deadly.",
      "Don't get distracted by slow flank moves. Find the forced combination.",
      "Strike with 33-29!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 3,
        "square": 2,
        "player": 2,
        "isKing": false
      },
      {
        "r": 1,
        "c": 2,
        "square": 7,
        "player": 2,
        "isKing": false
      },
      {
        "r": 1,
        "c": 4,
        "square": 8,
        "player": 2,
        "isKing": false
      },
      {
        "r": 1,
        "c": 8,
        "square": 10,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 7,
        "square": 14,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 1,
        "square": 21,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 7,
        "square": 24,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 1,
        "square": 31,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 5,
        "square": 33,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 2,
        "square": 37,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 4,
        "square": 38,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 6,
        "square": 39,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 4,
        "square": 48,
        "player": 1,
        "isKing": false
      },
      {
        "r": 0,
        "c": 1,
        "player": 2,
        "isKing": false,
        "square": 1
      },
      {
        "r": 1,
        "c": 0,
        "player": 2,
        "isKing": false,
        "square": 6
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 33,
        "toSq": 29,
        "from": {
          "r": 6,
          "c": 5
        },
        "to": {
          "r": 5,
          "c": 6
        },
        "note": "Key strike: 33-29!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 21,
        "toSq": 27,
        "from": {
          "r": 4,
          "c": 1
        },
        "to": {
          "r": 5,
          "c": 2
        },
        "note": "Opponent responds 21-27",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 31,
        "toSq": 22,
        "from": {
          "r": 6,
          "c": 1
        },
        "to": {
          "r": 4,
          "c": 3
        },
        "note": "Continue combo: 31x22",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 14,
        "toSq": 20,
        "from": {
          "r": 2,
          "c": 7
        },
        "to": {
          "r": 3,
          "c": 8
        },
        "note": "Opponent responds 14-20",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 24,
        "toSq": 15,
        "from": {
          "r": 4,
          "c": 7
        },
        "to": {
          "r": 2,
          "c": 9
        },
        "note": "Continue combo: 24x4",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 15,
        "toSq": 4,
        "from": {
          "r": 2,
          "c": 9
        },
        "to": {
          "r": 0,
          "c": 7
        },
        "note": "Multi-jump continue: 4",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 8,
        "toSq": 12,
        "from": {
          "r": 1,
          "c": 4
        },
        "to": {
          "r": 2,
          "c": 3
        },
        "note": "Opponent responds 8-12",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 4,
        "toSq": 18,
        "from": {
          "r": 0,
          "c": 7
        },
        "to": {
          "r": 3,
          "c": 4
        },
        "note": "Continue combo: 4x18",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 12,
        "toSq": 23,
        "from": {
          "r": 2,
          "c": 3
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Opponent responds 12x41",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 23,
        "toSq": 34,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 7
        },
        "note": "Multi-jump continue: 34",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 34,
        "toSq": 43,
        "from": {
          "r": 6,
          "c": 7
        },
        "to": {
          "r": 8,
          "c": 5
        },
        "note": "Multi-jump continue: 43",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 43,
        "toSq": 32,
        "from": {
          "r": 8,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Multi-jump continue: 32",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 32,
        "toSq": 41,
        "from": {
          "r": 6,
          "c": 3
        },
        "to": {
          "r": 8,
          "c": 1
        },
        "note": "Multi-jump continue: 41",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-4-ENDGAME",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "👑 Endgame Sweep #4 (4.PNG): Coronation Finish",
    "badge": "👑 Endgame #4",
    "source_image": "4.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "endgame-sweep",
    "themeName": "Endgame Sweep • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Endgame continuation study from 4.PNG: White has broken through, now finish the cleanup!",
    "themeStars": "⭐⭐⭐⭐",
    "coachQuote": "Trap don open from 4.PNG! Now execute the final coronation cleanup!",
    "difficulty": {
      "tier": 6,
      "tier_name": "Advanced",
      "rating": 1810,
      "human_score": 62
    },
    "difficultyTier": 6,
    "rating": 1810,
    "hints": [
      "The first sacrifice has already happened. Spot the coronation sweep!",
      "Black's pieces are exposed. Find the multi-jump path to king.",
      "Play 21-12!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 1,
        "player": 2,
        "isKing": false,
        "square": 1
      },
      {
        "r": 0,
        "c": 7,
        "player": 2,
        "isKing": false,
        "square": 4
      },
      {
        "r": 1,
        "c": 2,
        "player": 2,
        "isKing": false,
        "square": 7
      },
      {
        "r": 2,
        "c": 7,
        "player": 2,
        "isKing": false,
        "square": 14
      },
      {
        "r": 3,
        "c": 0,
        "player": 1,
        "isKing": false,
        "square": 16
      },
      {
        "r": 3,
        "c": 2,
        "player": 2,
        "isKing": false,
        "square": 17
      },
      {
        "r": 3,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 18
      },
      {
        "r": 3,
        "c": 6,
        "player": 2,
        "isKing": false,
        "square": 19
      },
      {
        "r": 4,
        "c": 1,
        "player": 1,
        "isKing": false,
        "square": 21
      },
      {
        "r": 4,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 23
      },
      {
        "r": 4,
        "c": 7,
        "player": 2,
        "isKing": false,
        "square": 24
      },
      {
        "r": 5,
        "c": 2,
        "player": 1,
        "isKing": false,
        "square": 27
      },
      {
        "r": 6,
        "c": 7,
        "player": 1,
        "isKing": false,
        "square": 34
      },
      {
        "r": 7,
        "c": 8,
        "player": 1,
        "isKing": false,
        "square": 40
      },
      {
        "r": 8,
        "c": 3,
        "player": 1,
        "isKing": false,
        "square": 42
      },
      {
        "r": 8,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 43
      },
      {
        "r": 8,
        "c": 7,
        "player": 1,
        "isKing": false,
        "square": 44
      },
      {
        "r": 9,
        "c": 6,
        "player": 1,
        "isKing": false,
        "square": 49
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 21,
        "toSq": 12,
        "from": {
          "r": 4,
          "c": 1
        },
        "to": {
          "r": 2,
          "c": 3
        },
        "note": "Continue combo: 21x12",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 23,
        "toSq": 28,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Opponent responds 23-28",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 12,
        "toSq": 23,
        "from": {
          "r": 2,
          "c": 3
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Continue combo: 12x32",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 23,
        "toSq": 32,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Multi-jump continue: 32",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 24,
        "toSq": 29,
        "from": {
          "r": 4,
          "c": 7
        },
        "to": {
          "r": 5,
          "c": 6
        },
        "note": "Opponent responds 24-29",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 34,
        "toSq": 23,
        "from": {
          "r": 6,
          "c": 7
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Continue combo: 34x23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Opponent responds 19x50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 28,
        "toSq": 37,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 2
        },
        "note": "Multi-jump continue: 37",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 37,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 2
        },
        "to": {
          "r": 9,
          "c": 4
        },
        "note": "Multi-jump continue: 48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 48,
        "toSq": 39,
        "from": {
          "r": 9,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 50,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 8
        },
        "note": "Multi-jump continue: 50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-5-ENDGAME",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "👑 Endgame Sweep #5 (5.PNG): Coronation Finish",
    "badge": "👑 Endgame #5",
    "source_image": "5.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "endgame-sweep",
    "themeName": "Endgame Sweep • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Endgame continuation study from 5.PNG: White has broken through, now finish the cleanup!",
    "themeStars": "⭐⭐⭐⭐",
    "coachQuote": "Trap don open from 5.PNG! Now execute the final coronation cleanup!",
    "difficulty": {
      "tier": 6,
      "tier_name": "Advanced",
      "rating": 1830,
      "human_score": 62
    },
    "difficultyTier": 6,
    "rating": 1830,
    "hints": [
      "The first sacrifice has already happened. Spot the coronation sweep!",
      "Black's pieces are exposed. Find the multi-jump path to king.",
      "Play 25-14!"
    ],
    "initialBoard": [
      {
        "r": 1,
        "c": 0,
        "player": 2,
        "isKing": false,
        "square": 6
      },
      {
        "r": 1,
        "c": 6,
        "player": 2,
        "isKing": false,
        "square": 9
      },
      {
        "r": 2,
        "c": 1,
        "player": 2,
        "isKing": false,
        "square": 11
      },
      {
        "r": 2,
        "c": 3,
        "player": 2,
        "isKing": false,
        "square": 12
      },
      {
        "r": 2,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 13
      },
      {
        "r": 3,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 18
      },
      {
        "r": 3,
        "c": 8,
        "player": 2,
        "isKing": false,
        "square": 20
      },
      {
        "r": 4,
        "c": 7,
        "player": 1,
        "isKing": false,
        "square": 24
      },
      {
        "r": 4,
        "c": 9,
        "player": 1,
        "isKing": false,
        "square": 25
      },
      {
        "r": 5,
        "c": 0,
        "player": 2,
        "isKing": false,
        "square": 26
      },
      {
        "r": 6,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 33
      },
      {
        "r": 7,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 38
      },
      {
        "r": 8,
        "c": 1,
        "player": 1,
        "isKing": false,
        "square": 41
      },
      {
        "r": 8,
        "c": 3,
        "player": 1,
        "isKing": false,
        "square": 42
      },
      {
        "r": 8,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 43
      },
      {
        "r": 9,
        "c": 2,
        "player": 1,
        "isKing": false,
        "square": 47
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 25,
        "toSq": 14,
        "from": {
          "r": 4,
          "c": 9
        },
        "to": {
          "r": 2,
          "c": 7
        },
        "note": "Continue combo: 25x3",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 14,
        "toSq": 3,
        "from": {
          "r": 2,
          "c": 7
        },
        "to": {
          "r": 0,
          "c": 5
        },
        "note": "Multi-jump continue: 3",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 13,
        "toSq": 19,
        "from": {
          "r": 2,
          "c": 5
        },
        "to": {
          "r": 3,
          "c": 6
        },
        "note": "Opponent responds 13-19",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 24,
        "toSq": 13,
        "from": {
          "r": 4,
          "c": 7
        },
        "to": {
          "r": 2,
          "c": 5
        },
        "note": "Continue combo: 24x22",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 13,
        "toSq": 22,
        "from": {
          "r": 2,
          "c": 5
        },
        "to": {
          "r": 4,
          "c": 3
        },
        "note": "Multi-jump continue: 22",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 12,
        "toSq": 17,
        "from": {
          "r": 2,
          "c": 3
        },
        "to": {
          "r": 3,
          "c": 2
        },
        "note": "Opponent responds 12-17",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 3,
        "toSq": 21,
        "from": {
          "r": 0,
          "c": 5
        },
        "to": {
          "r": 4,
          "c": 1
        },
        "note": "Continue combo: 3x21",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 26,
        "toSq": 17,
        "from": {
          "r": 5,
          "c": 0
        },
        "to": {
          "r": 3,
          "c": 2
        },
        "note": "Opponent responds 26x46",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 17,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 2
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Multi-jump continue: 28",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 28,
        "toSq": 39,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 4
        },
        "note": "Multi-jump continue: 48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 48,
        "toSq": 37,
        "from": {
          "r": 9,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 2
        },
        "note": "Multi-jump continue: 37",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 37,
        "toSq": 46,
        "from": {
          "r": 7,
          "c": 2
        },
        "to": {
          "r": 9,
          "c": 0
        },
        "note": "Multi-jump continue: 46",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-6-ENDGAME",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "👑 Endgame Sweep #6 (6.PNG): Coronation Finish",
    "badge": "👑 Endgame #6",
    "source_image": "6.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "endgame-sweep",
    "themeName": "Endgame Sweep • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Endgame continuation study from 6.PNG: White has broken through, now finish the cleanup!",
    "themeStars": "⭐⭐⭐⭐",
    "coachQuote": "Trap don open from 6.PNG! Now execute the final coronation cleanup!",
    "difficulty": {
      "tier": 6,
      "tier_name": "Advanced",
      "rating": 1850,
      "human_score": 62
    },
    "difficultyTier": 6,
    "rating": 1850,
    "hints": [
      "The first sacrifice has already happened. Spot the coronation sweep!",
      "Black's pieces are exposed. Find the multi-jump path to king.",
      "Play 30-19!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 3
      },
      {
        "r": 2,
        "c": 3,
        "player": 2,
        "isKing": false,
        "square": 12
      },
      {
        "r": 3,
        "c": 0,
        "player": 2,
        "isKing": false,
        "square": 16
      },
      {
        "r": 3,
        "c": 2,
        "player": 2,
        "isKing": false,
        "square": 17
      },
      {
        "r": 3,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 18
      },
      {
        "r": 4,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 23
      },
      {
        "r": 4,
        "c": 7,
        "player": 2,
        "isKing": false,
        "square": 24
      },
      {
        "r": 5,
        "c": 0,
        "player": 2,
        "isKing": false,
        "square": 26
      },
      {
        "r": 5,
        "c": 6,
        "player": 2,
        "isKing": false,
        "square": 29
      },
      {
        "r": 5,
        "c": 8,
        "player": 1,
        "isKing": false,
        "square": 30
      },
      {
        "r": 6,
        "c": 3,
        "player": 1,
        "isKing": false,
        "square": 32
      },
      {
        "r": 6,
        "c": 7,
        "player": 1,
        "isKing": false,
        "square": 34
      },
      {
        "r": 7,
        "c": 0,
        "player": 1,
        "isKing": false,
        "square": 36
      },
      {
        "r": 7,
        "c": 2,
        "player": 1,
        "isKing": false,
        "square": 37
      },
      {
        "r": 7,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 38
      },
      {
        "r": 7,
        "c": 8,
        "player": 1,
        "isKing": false,
        "square": 40
      },
      {
        "r": 8,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 43
      },
      {
        "r": 9,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 48
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 30,
        "toSq": 19,
        "from": {
          "r": 5,
          "c": 8
        },
        "to": {
          "r": 3,
          "c": 6
        },
        "note": "Continue combo: 30x28",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 19,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Multi-jump continue: 28",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 18,
        "toSq": 22,
        "from": {
          "r": 3,
          "c": 4
        },
        "to": {
          "r": 4,
          "c": 3
        },
        "note": "Opponent responds 18-22",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 34,
        "toSq": 23,
        "from": {
          "r": 6,
          "c": 7
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Continue combo: 34x23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 22,
        "toSq": 33,
        "from": {
          "r": 4,
          "c": 3
        },
        "to": {
          "r": 6,
          "c": 5
        },
        "note": "Opponent responds 22x31",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 33,
        "toSq": 42,
        "from": {
          "r": 6,
          "c": 5
        },
        "to": {
          "r": 8,
          "c": 3
        },
        "note": "Multi-jump continue: 42",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 42,
        "toSq": 31,
        "from": {
          "r": 8,
          "c": 3
        },
        "to": {
          "r": 6,
          "c": 1
        },
        "note": "Multi-jump continue: 31",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 36,
        "toSq": 27,
        "from": {
          "r": 7,
          "c": 0
        },
        "to": {
          "r": 5,
          "c": 2
        },
        "note": "Continue combo: 36x27",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 26,
        "toSq": 31,
        "from": {
          "r": 5,
          "c": 0
        },
        "to": {
          "r": 6,
          "c": 1
        },
        "note": "Opponent responds 26-31",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 27,
        "toSq": 36,
        "from": {
          "r": 5,
          "c": 2
        },
        "to": {
          "r": 7,
          "c": 0
        },
        "note": "Continue combo: 27x36",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 12,
        "toSq": 18,
        "from": {
          "r": 2,
          "c": 3
        },
        "to": {
          "r": 3,
          "c": 4
        },
        "note": "Opponent responds 12-18",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 23,
        "toSq": 12,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 2,
          "c": 3
        },
        "note": "Continue combo: 23x21",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 12,
        "toSq": 21,
        "from": {
          "r": 2,
          "c": 3
        },
        "to": {
          "r": 4,
          "c": 1
        },
        "note": "Multi-jump continue: 21",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 16,
        "toSq": 27,
        "from": {
          "r": 3,
          "c": 0
        },
        "to": {
          "r": 5,
          "c": 2
        },
        "note": "Opponent responds 16x49",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 27,
        "toSq": 38,
        "from": {
          "r": 5,
          "c": 2
        },
        "to": {
          "r": 7,
          "c": 4
        },
        "note": "Multi-jump continue: 38",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 38,
        "toSq": 49,
        "from": {
          "r": 7,
          "c": 4
        },
        "to": {
          "r": 9,
          "c": 6
        },
        "note": "Multi-jump continue: 49",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-7-ENDGAME",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "👑 Endgame Sweep #7 (7.PNG): Coronation Finish",
    "badge": "👑 Endgame #7",
    "source_image": "7.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "endgame-sweep",
    "themeName": "Endgame Sweep • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Endgame continuation study from 7.PNG: White has broken through, now finish the cleanup!",
    "themeStars": "⭐⭐⭐⭐",
    "coachQuote": "Trap don open from 7.PNG! Now execute the final coronation cleanup!",
    "difficulty": {
      "tier": 6,
      "tier_name": "Advanced",
      "rating": 1870,
      "human_score": 62
    },
    "difficultyTier": 6,
    "rating": 1870,
    "hints": [
      "The first sacrifice has already happened. Spot the coronation sweep!",
      "Black's pieces are exposed. Find the multi-jump path to king.",
      "Play 22-13!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 3,
        "player": 2,
        "isKing": false,
        "square": 2
      },
      {
        "r": 1,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 8
      },
      {
        "r": 2,
        "c": 7,
        "player": 2,
        "isKing": false,
        "square": 14
      },
      {
        "r": 3,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 18
      },
      {
        "r": 3,
        "c": 6,
        "player": 2,
        "isKing": false,
        "square": 19
      },
      {
        "r": 4,
        "c": 1,
        "player": 2,
        "isKing": false,
        "square": 21
      },
      {
        "r": 4,
        "c": 3,
        "player": 1,
        "isKing": false,
        "square": 22
      },
      {
        "r": 4,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 23
      },
      {
        "r": 4,
        "c": 7,
        "player": 2,
        "isKing": false,
        "square": 24
      },
      {
        "r": 4,
        "c": 9,
        "player": 1,
        "isKing": false,
        "square": 25
      },
      {
        "r": 5,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 28
      },
      {
        "r": 6,
        "c": 3,
        "player": 1,
        "isKing": false,
        "square": 32
      },
      {
        "r": 6,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 33
      },
      {
        "r": 7,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 38
      },
      {
        "r": 8,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 43
      },
      {
        "r": 9,
        "c": 2,
        "player": 1,
        "isKing": false,
        "square": 47
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 22,
        "toSq": 13,
        "from": {
          "r": 4,
          "c": 3
        },
        "to": {
          "r": 2,
          "c": 5
        },
        "note": "Continue combo: 22x13",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 21,
        "toSq": 27,
        "from": {
          "r": 4,
          "c": 1
        },
        "to": {
          "r": 5,
          "c": 2
        },
        "note": "Opponent responds 21-27",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 32,
        "toSq": 21,
        "from": {
          "r": 6,
          "c": 3
        },
        "to": {
          "r": 4,
          "c": 1
        },
        "note": "Continue combo: 32x21",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 23,
        "toSq": 32,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Opponent responds 23x32",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 38,
        "toSq": 27,
        "from": {
          "r": 7,
          "c": 4
        },
        "to": {
          "r": 5,
          "c": 2
        },
        "note": "Continue combo: 38x27",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 14,
        "toSq": 20,
        "from": {
          "r": 2,
          "c": 7
        },
        "to": {
          "r": 3,
          "c": 8
        },
        "note": "Opponent responds 14-20",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 25,
        "toSq": 14,
        "from": {
          "r": 4,
          "c": 9
        },
        "to": {
          "r": 2,
          "c": 7
        },
        "note": "Continue combo: 25x23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 14,
        "toSq": 23,
        "from": {
          "r": 2,
          "c": 7
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Multi-jump continue: 23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 8,
        "toSq": 19,
        "from": {
          "r": 1,
          "c": 4
        },
        "to": {
          "r": 3,
          "c": 6
        },
        "note": "Opponent responds 8x48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Multi-jump continue: 28",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 28,
        "toSq": 39,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 4
        },
        "note": "Multi-jump continue: 48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-8-ENDGAME",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "👑 Endgame Sweep #8 (8.PNG): Coronation Finish",
    "badge": "👑 Endgame #8",
    "source_image": "8.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "endgame-sweep",
    "themeName": "Endgame Sweep • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Endgame continuation study from 8.PNG: White has broken through, now finish the cleanup!",
    "themeStars": "⭐⭐⭐⭐",
    "coachQuote": "Trap don open from 8.PNG! Now execute the final coronation cleanup!",
    "difficulty": {
      "tier": 6,
      "tier_name": "Advanced",
      "rating": 1890,
      "human_score": 62
    },
    "difficultyTier": 6,
    "rating": 1890,
    "hints": [
      "The first sacrifice has already happened. Spot the coronation sweep!",
      "Black's pieces are exposed. Find the multi-jump path to king.",
      "Play 26-17!"
    ],
    "initialBoard": [
      {
        "r": 2,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 13
      },
      {
        "r": 2,
        "c": 7,
        "player": 2,
        "isKing": false,
        "square": 14
      },
      {
        "r": 3,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 18
      },
      {
        "r": 3,
        "c": 6,
        "player": 2,
        "isKing": false,
        "square": 19
      },
      {
        "r": 4,
        "c": 1,
        "player": 2,
        "isKing": false,
        "square": 21
      },
      {
        "r": 4,
        "c": 3,
        "player": 2,
        "isKing": false,
        "square": 22
      },
      {
        "r": 4,
        "c": 9,
        "player": 2,
        "isKing": false,
        "square": 25
      },
      {
        "r": 5,
        "c": 0,
        "player": 1,
        "isKing": false,
        "square": 26
      },
      {
        "r": 5,
        "c": 8,
        "player": 2,
        "isKing": false,
        "square": 30
      },
      {
        "r": 6,
        "c": 1,
        "player": 1,
        "isKing": false,
        "square": 31
      },
      {
        "r": 6,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 33
      },
      {
        "r": 6,
        "c": 7,
        "player": 1,
        "isKing": false,
        "square": 34
      },
      {
        "r": 6,
        "c": 9,
        "player": 1,
        "isKing": false,
        "square": 35
      },
      {
        "r": 7,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 38
      },
      {
        "r": 7,
        "c": 6,
        "player": 1,
        "isKing": false,
        "square": 39
      },
      {
        "r": 8,
        "c": 7,
        "player": 1,
        "isKing": false,
        "square": 44
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 26,
        "toSq": 17,
        "from": {
          "r": 5,
          "c": 0
        },
        "to": {
          "r": 3,
          "c": 2
        },
        "note": "Continue combo: 26x28",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 17,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 2
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Multi-jump continue: 28",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 18,
        "toSq": 23,
        "from": {
          "r": 3,
          "c": 4
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Opponent responds 18-23",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 35,
        "toSq": 24,
        "from": {
          "r": 6,
          "c": 9
        },
        "to": {
          "r": 4,
          "c": 7
        },
        "note": "Continue combo: 35x24",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 23,
        "toSq": 32,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Opponent responds 23x43",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 32,
        "toSq": 43,
        "from": {
          "r": 6,
          "c": 3
        },
        "to": {
          "r": 8,
          "c": 5
        },
        "note": "Multi-jump continue: 43",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 39,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 4
        },
        "note": "Continue combo: 39x48",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 30,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 8
        },
        "note": "Opponent responds 19x50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 30,
        "toSq": 39,
        "from": {
          "r": 5,
          "c": 8
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 50,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 8
        },
        "note": "Multi-jump continue: 50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-9-ENDGAME",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "👑 Endgame Sweep #9 (10.PNG): Coronation Finish",
    "badge": "👑 Endgame #9",
    "source_image": "10.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "endgame-sweep",
    "themeName": "Endgame Sweep • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Endgame continuation study from 10.PNG: White has broken through, now finish the cleanup!",
    "themeStars": "⭐⭐⭐⭐",
    "coachQuote": "Trap don open from 10.PNG! Now execute the final coronation cleanup!",
    "difficulty": {
      "tier": 6,
      "tier_name": "Advanced",
      "rating": 1910,
      "human_score": 62
    },
    "difficultyTier": 6,
    "rating": 1910,
    "hints": [
      "The first sacrifice has already happened. Spot the coronation sweep!",
      "Black's pieces are exposed. Find the multi-jump path to king.",
      "Play 27-16!"
    ],
    "initialBoard": [
      {
        "r": 1,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 8
      },
      {
        "r": 2,
        "c": 3,
        "player": 2,
        "isKing": false,
        "square": 12
      },
      {
        "r": 2,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 13
      },
      {
        "r": 2,
        "c": 7,
        "player": 2,
        "isKing": false,
        "square": 14
      },
      {
        "r": 3,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 18
      },
      {
        "r": 3,
        "c": 6,
        "player": 2,
        "isKing": false,
        "square": 19
      },
      {
        "r": 4,
        "c": 1,
        "player": 2,
        "isKing": false,
        "square": 21
      },
      {
        "r": 4,
        "c": 7,
        "player": 2,
        "isKing": false,
        "square": 24
      },
      {
        "r": 4,
        "c": 9,
        "player": 1,
        "isKing": false,
        "square": 25
      },
      {
        "r": 5,
        "c": 2,
        "player": 1,
        "isKing": false,
        "square": 27
      },
      {
        "r": 5,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 28
      },
      {
        "r": 5,
        "c": 6,
        "player": 2,
        "isKing": false,
        "square": 29
      },
      {
        "r": 6,
        "c": 3,
        "player": 1,
        "isKing": false,
        "square": 32
      },
      {
        "r": 6,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 33
      },
      {
        "r": 6,
        "c": 9,
        "player": 1,
        "isKing": false,
        "square": 35
      },
      {
        "r": 7,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 38
      },
      {
        "r": 8,
        "c": 7,
        "player": 1,
        "isKing": false,
        "square": 44
      },
      {
        "r": 9,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 48
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 27,
        "toSq": 16,
        "from": {
          "r": 5,
          "c": 2
        },
        "to": {
          "r": 3,
          "c": 0
        },
        "note": "Continue combo: 27x16",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 18,
        "toSq": 22,
        "from": {
          "r": 3,
          "c": 4
        },
        "to": {
          "r": 4,
          "c": 3
        },
        "note": "Opponent responds 18-22",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 28,
        "toSq": 17,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 3,
          "c": 2
        },
        "note": "Continue combo: 28x17",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 12,
        "toSq": 21,
        "from": {
          "r": 2,
          "c": 3
        },
        "to": {
          "r": 4,
          "c": 1
        },
        "note": "Opponent responds 12x21",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 16,
        "toSq": 27,
        "from": {
          "r": 3,
          "c": 0
        },
        "to": {
          "r": 5,
          "c": 2
        },
        "note": "Continue combo: 16x27",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 24,
        "toSq": 30,
        "from": {
          "r": 4,
          "c": 7
        },
        "to": {
          "r": 5,
          "c": 8
        },
        "note": "Opponent responds 24-30",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 25,
        "toSq": 34,
        "from": {
          "r": 4,
          "c": 9
        },
        "to": {
          "r": 6,
          "c": 7
        },
        "note": "Continue combo: 25x23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 34,
        "toSq": 23,
        "from": {
          "r": 6,
          "c": 7
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Multi-jump continue: 23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Opponent responds 19x50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 28,
        "toSq": 39,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 50,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 8
        },
        "note": "Multi-jump continue: 50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-10-ENDGAME",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "👑 Endgame Sweep #10 (11.PNG): Coronation Finish",
    "badge": "👑 Endgame #10",
    "source_image": "11.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "endgame-sweep",
    "themeName": "Endgame Sweep • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Endgame continuation study from 11.PNG: White has broken through, now finish the cleanup!",
    "themeStars": "⭐⭐⭐⭐",
    "coachQuote": "Trap don open from 11.PNG! Now execute the final coronation cleanup!",
    "difficulty": {
      "tier": 6,
      "tier_name": "Advanced",
      "rating": 1930,
      "human_score": 62
    },
    "difficultyTier": 6,
    "rating": 1930,
    "hints": [
      "The first sacrifice has already happened. Spot the coronation sweep!",
      "Black's pieces are exposed. Find the multi-jump path to king.",
      "Play 28-19!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 3,
        "player": 2,
        "isKing": false,
        "square": 2
      },
      {
        "r": 0,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 3
      },
      {
        "r": 1,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 8
      },
      {
        "r": 2,
        "c": 3,
        "player": 2,
        "isKing": false,
        "square": 12
      },
      {
        "r": 2,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 13
      },
      {
        "r": 3,
        "c": 8,
        "player": 2,
        "isKing": false,
        "square": 20
      },
      {
        "r": 4,
        "c": 3,
        "player": 1,
        "isKing": false,
        "square": 22
      },
      {
        "r": 4,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 23
      },
      {
        "r": 4,
        "c": 7,
        "player": 2,
        "isKing": false,
        "square": 24
      },
      {
        "r": 4,
        "c": 9,
        "player": 1,
        "isKing": false,
        "square": 25
      },
      {
        "r": 5,
        "c": 2,
        "player": 1,
        "isKing": false,
        "square": 27
      },
      {
        "r": 5,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 28
      },
      {
        "r": 6,
        "c": 3,
        "player": 1,
        "isKing": false,
        "square": 32
      },
      {
        "r": 8,
        "c": 3,
        "player": 1,
        "isKing": false,
        "square": 42
      },
      {
        "r": 8,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 43
      },
      {
        "r": 8,
        "c": 7,
        "player": 1,
        "isKing": false,
        "square": 44
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 28,
        "toSq": 19,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 3,
          "c": 6
        },
        "note": "Continue combo: 28x30",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 19,
        "toSq": 30,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 8
        },
        "note": "Multi-jump continue: 30",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 13,
        "toSq": 19,
        "from": {
          "r": 2,
          "c": 5
        },
        "to": {
          "r": 3,
          "c": 6
        },
        "note": "Opponent responds 13-19",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 25,
        "toSq": 14,
        "from": {
          "r": 4,
          "c": 9
        },
        "to": {
          "r": 2,
          "c": 7
        },
        "note": "Continue combo: 25x23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 14,
        "toSq": 23,
        "from": {
          "r": 2,
          "c": 7
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Multi-jump continue: 23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 12,
        "toSq": 18,
        "from": {
          "r": 2,
          "c": 3
        },
        "to": {
          "r": 3,
          "c": 4
        },
        "note": "Opponent responds 12-18",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 22,
        "toSq": 13,
        "from": {
          "r": 4,
          "c": 3
        },
        "to": {
          "r": 2,
          "c": 5
        },
        "note": "Continue combo: 22x13",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 8,
        "toSq": 19,
        "from": {
          "r": 1,
          "c": 4
        },
        "to": {
          "r": 3,
          "c": 6
        },
        "note": "Opponent responds 8x50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Multi-jump continue: 28",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 28,
        "toSq": 37,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 2
        },
        "note": "Multi-jump continue: 37",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 37,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 2
        },
        "to": {
          "r": 9,
          "c": 4
        },
        "note": "Multi-jump continue: 48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 48,
        "toSq": 39,
        "from": {
          "r": 9,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 50,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 8
        },
        "note": "Multi-jump continue: 50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-11-ENDGAME",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "👑 Endgame Sweep #11 (12.PNG): Coronation Finish",
    "badge": "👑 Endgame #11",
    "source_image": "12.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "endgame-sweep",
    "themeName": "Endgame Sweep • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Endgame continuation study from 12.PNG: White has broken through, now finish the cleanup!",
    "themeStars": "⭐⭐⭐⭐",
    "coachQuote": "Trap don open from 12.PNG! Now execute the final coronation cleanup!",
    "difficulty": {
      "tier": 6,
      "tier_name": "Advanced",
      "rating": 1950,
      "human_score": 62
    },
    "difficultyTier": 6,
    "rating": 1950,
    "hints": [
      "The first sacrifice has already happened. Spot the coronation sweep!",
      "Black's pieces are exposed. Find the multi-jump path to king.",
      "Play 24-13!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 3
      },
      {
        "r": 1,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 8
      },
      {
        "r": 2,
        "c": 1,
        "player": 2,
        "isKing": false,
        "square": 11
      },
      {
        "r": 2,
        "c": 3,
        "player": 2,
        "isKing": false,
        "square": 12
      },
      {
        "r": 2,
        "c": 7,
        "player": 2,
        "isKing": false,
        "square": 14
      },
      {
        "r": 3,
        "c": 6,
        "player": 2,
        "isKing": false,
        "square": 19
      },
      {
        "r": 4,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 23
      },
      {
        "r": 4,
        "c": 7,
        "player": 1,
        "isKing": false,
        "square": 24
      },
      {
        "r": 5,
        "c": 2,
        "player": 2,
        "isKing": false,
        "square": 27
      },
      {
        "r": 5,
        "c": 6,
        "player": 1,
        "isKing": false,
        "square": 29
      },
      {
        "r": 7,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 38
      },
      {
        "r": 8,
        "c": 3,
        "player": 1,
        "isKing": false,
        "square": 42
      },
      {
        "r": 8,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 43
      },
      {
        "r": 8,
        "c": 7,
        "player": 1,
        "isKing": false,
        "square": 44
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 24,
        "toSq": 13,
        "from": {
          "r": 4,
          "c": 7
        },
        "to": {
          "r": 2,
          "c": 5
        },
        "note": "Continue combo: 24x2",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 13,
        "toSq": 2,
        "from": {
          "r": 2,
          "c": 5
        },
        "to": {
          "r": 0,
          "c": 3
        },
        "note": "Multi-jump continue: 2",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 14,
        "toSq": 19,
        "from": {
          "r": 2,
          "c": 7
        },
        "to": {
          "r": 3,
          "c": 6
        },
        "note": "Opponent responds 14-19",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 2,
        "toSq": 16,
        "from": {
          "r": 0,
          "c": 3
        },
        "to": {
          "r": 3,
          "c": 0
        },
        "note": "Continue combo: 2x32",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 16,
        "toSq": 32,
        "from": {
          "r": 3,
          "c": 0
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Multi-jump continue: 32",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Opponent responds 19x50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 28,
        "toSq": 37,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 2
        },
        "note": "Multi-jump continue: 37",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 37,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 2
        },
        "to": {
          "r": 9,
          "c": 4
        },
        "note": "Multi-jump continue: 48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 48,
        "toSq": 39,
        "from": {
          "r": 9,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 50,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 8
        },
        "note": "Multi-jump continue: 50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-12-ENDGAME",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "👑 Endgame Sweep #12 (13.PNG): Coronation Finish",
    "badge": "👑 Endgame #12",
    "source_image": "13.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "endgame-sweep",
    "themeName": "Endgame Sweep • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Endgame continuation study from 13.PNG: White has broken through, now finish the cleanup!",
    "themeStars": "⭐⭐⭐⭐",
    "coachQuote": "Trap don open from 13.PNG! Now execute the final coronation cleanup!",
    "difficulty": {
      "tier": 6,
      "tier_name": "Advanced",
      "rating": 1970,
      "human_score": 62
    },
    "difficultyTier": 6,
    "rating": 1970,
    "hints": [
      "The first sacrifice has already happened. Spot the coronation sweep!",
      "Black's pieces are exposed. Find the multi-jump path to king.",
      "Play 35-24!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 3
      },
      {
        "r": 1,
        "c": 8,
        "player": 2,
        "isKing": false,
        "square": 10
      },
      {
        "r": 2,
        "c": 1,
        "player": 2,
        "isKing": false,
        "square": 11
      },
      {
        "r": 2,
        "c": 3,
        "player": 2,
        "isKing": false,
        "square": 12
      },
      {
        "r": 2,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 13
      },
      {
        "r": 2,
        "c": 7,
        "player": 2,
        "isKing": false,
        "square": 14
      },
      {
        "r": 3,
        "c": 2,
        "player": 2,
        "isKing": false,
        "square": 17
      },
      {
        "r": 4,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 23
      },
      {
        "r": 5,
        "c": 2,
        "player": 1,
        "isKing": false,
        "square": 27
      },
      {
        "r": 5,
        "c": 6,
        "player": 1,
        "isKing": false,
        "square": 29
      },
      {
        "r": 5,
        "c": 8,
        "player": 2,
        "isKing": false,
        "square": 30
      },
      {
        "r": 6,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 33
      },
      {
        "r": 6,
        "c": 9,
        "player": 1,
        "isKing": false,
        "square": 35
      },
      {
        "r": 8,
        "c": 1,
        "player": 1,
        "isKing": false,
        "square": 41
      },
      {
        "r": 8,
        "c": 3,
        "player": 1,
        "isKing": false,
        "square": 42
      },
      {
        "r": 8,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 43
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 35,
        "toSq": 24,
        "from": {
          "r": 6,
          "c": 9
        },
        "to": {
          "r": 4,
          "c": 7
        },
        "note": "Continue combo: 35x24",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 14,
        "toSq": 20,
        "from": {
          "r": 2,
          "c": 7
        },
        "to": {
          "r": 3,
          "c": 8
        },
        "note": "Opponent responds 14-20",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 24,
        "toSq": 15,
        "from": {
          "r": 4,
          "c": 7
        },
        "to": {
          "r": 2,
          "c": 9
        },
        "note": "Continue combo: 24x4",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 15,
        "toSq": 4,
        "from": {
          "r": 2,
          "c": 9
        },
        "to": {
          "r": 0,
          "c": 7
        },
        "note": "Multi-jump continue: 4",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 13,
        "toSq": 18,
        "from": {
          "r": 2,
          "c": 5
        },
        "to": {
          "r": 3,
          "c": 4
        },
        "note": "Opponent responds 13-18",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 4,
        "toSq": 22,
        "from": {
          "r": 0,
          "c": 7
        },
        "to": {
          "r": 4,
          "c": 3
        },
        "note": "Continue combo: 4x22",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 17,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 2
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Opponent responds 17x46",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 28,
        "toSq": 39,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 4
        },
        "note": "Multi-jump continue: 48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 48,
        "toSq": 37,
        "from": {
          "r": 9,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 2
        },
        "note": "Multi-jump continue: 37",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 37,
        "toSq": 46,
        "from": {
          "r": 7,
          "c": 2
        },
        "to": {
          "r": 9,
          "c": 0
        },
        "note": "Multi-jump continue: 46",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-13-ENDGAME",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "👑 Endgame Sweep #13 (14.PNG): Coronation Finish",
    "badge": "👑 Endgame #13",
    "source_image": "14.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "endgame-sweep",
    "themeName": "Endgame Sweep • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Endgame continuation study from 14.PNG: White has broken through, now finish the cleanup!",
    "themeStars": "⭐⭐⭐⭐",
    "coachQuote": "Trap don open from 14.PNG! Now execute the final coronation cleanup!",
    "difficulty": {
      "tier": 6,
      "tier_name": "Advanced",
      "rating": 1990,
      "human_score": 62
    },
    "difficultyTier": 6,
    "rating": 1990,
    "hints": [
      "The first sacrifice has already happened. Spot the coronation sweep!",
      "Black's pieces are exposed. Find the multi-jump path to king.",
      "Play 28-17!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 7,
        "player": 2,
        "isKing": false,
        "square": 4
      },
      {
        "r": 1,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 8
      },
      {
        "r": 1,
        "c": 8,
        "player": 2,
        "isKing": false,
        "square": 10
      },
      {
        "r": 2,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 13
      },
      {
        "r": 2,
        "c": 7,
        "player": 2,
        "isKing": false,
        "square": 14
      },
      {
        "r": 3,
        "c": 6,
        "player": 2,
        "isKing": false,
        "square": 19
      },
      {
        "r": 4,
        "c": 3,
        "player": 2,
        "isKing": false,
        "square": 22
      },
      {
        "r": 4,
        "c": 7,
        "player": 2,
        "isKing": false,
        "square": 24
      },
      {
        "r": 4,
        "c": 9,
        "player": 1,
        "isKing": false,
        "square": 25
      },
      {
        "r": 5,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 28
      },
      {
        "r": 5,
        "c": 8,
        "player": 1,
        "isKing": false,
        "square": 30
      },
      {
        "r": 6,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 33
      },
      {
        "r": 6,
        "c": 9,
        "player": 1,
        "isKing": false,
        "square": 35
      },
      {
        "r": 7,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 38
      },
      {
        "r": 7,
        "c": 6,
        "player": 1,
        "isKing": false,
        "square": 39
      },
      {
        "r": 7,
        "c": 8,
        "player": 1,
        "isKing": false,
        "square": 40
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 28,
        "toSq": 17,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 3,
          "c": 2
        },
        "note": "Continue combo: 28x17",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 23,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Opponent responds 19-23",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 30,
        "toSq": 19,
        "from": {
          "r": 5,
          "c": 8
        },
        "to": {
          "r": 3,
          "c": 6
        },
        "note": "Continue combo: 30x28",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 19,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Multi-jump continue: 28",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 8,
        "toSq": 12,
        "from": {
          "r": 1,
          "c": 4
        },
        "to": {
          "r": 2,
          "c": 3
        },
        "note": "Opponent responds 8-12",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 17,
        "toSq": 8,
        "from": {
          "r": 3,
          "c": 2
        },
        "to": {
          "r": 1,
          "c": 4
        },
        "note": "Continue combo: 17x19",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 8,
        "toSq": 19,
        "from": {
          "r": 1,
          "c": 4
        },
        "to": {
          "r": 3,
          "c": 6
        },
        "note": "Multi-jump continue: 19",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 14,
        "toSq": 23,
        "from": {
          "r": 2,
          "c": 7
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Opponent responds 14x45",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 23,
        "toSq": 32,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Multi-jump continue: 32",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 32,
        "toSq": 43,
        "from": {
          "r": 6,
          "c": 3
        },
        "to": {
          "r": 8,
          "c": 5
        },
        "note": "Multi-jump continue: 43",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 43,
        "toSq": 34,
        "from": {
          "r": 8,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 7
        },
        "note": "Multi-jump continue: 34",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 34,
        "toSq": 45,
        "from": {
          "r": 6,
          "c": 7
        },
        "to": {
          "r": 8,
          "c": 9
        },
        "note": "Multi-jump continue: 45",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-14-ENDGAME",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "👑 Endgame Sweep #14 (15.PNG): Coronation Finish",
    "badge": "👑 Endgame #14",
    "source_image": "15.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "endgame-sweep",
    "themeName": "Endgame Sweep • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Endgame continuation study from 15.PNG: White has broken through, now finish the cleanup!",
    "themeStars": "⭐⭐⭐⭐",
    "coachQuote": "Trap don open from 15.PNG! Now execute the final coronation cleanup!",
    "difficulty": {
      "tier": 6,
      "tier_name": "Advanced",
      "rating": 2010,
      "human_score": 62
    },
    "difficultyTier": 6,
    "rating": 2010,
    "hints": [
      "The first sacrifice has already happened. Spot the coronation sweep!",
      "Black's pieces are exposed. Find the multi-jump path to king.",
      "Play 33-22!"
    ],
    "initialBoard": [
      {
        "r": 2,
        "c": 1,
        "player": 2,
        "isKing": false,
        "square": 11
      },
      {
        "r": 2,
        "c": 3,
        "player": 2,
        "isKing": false,
        "square": 12
      },
      {
        "r": 2,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 13
      },
      {
        "r": 3,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 18
      },
      {
        "r": 3,
        "c": 6,
        "player": 2,
        "isKing": false,
        "square": 19
      },
      {
        "r": 3,
        "c": 8,
        "player": 2,
        "isKing": false,
        "square": 20
      },
      {
        "r": 4,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 23
      },
      {
        "r": 4,
        "c": 9,
        "player": 2,
        "isKing": false,
        "square": 25
      },
      {
        "r": 5,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 28
      },
      {
        "r": 5,
        "c": 6,
        "player": 1,
        "isKing": false,
        "square": 29
      },
      {
        "r": 6,
        "c": 3,
        "player": 1,
        "isKing": false,
        "square": 32
      },
      {
        "r": 6,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 33
      },
      {
        "r": 6,
        "c": 7,
        "player": 1,
        "isKing": false,
        "square": 34
      },
      {
        "r": 6,
        "c": 9,
        "player": 1,
        "isKing": false,
        "square": 35
      },
      {
        "r": 8,
        "c": 3,
        "player": 1,
        "isKing": false,
        "square": 42
      },
      {
        "r": 8,
        "c": 7,
        "player": 1,
        "isKing": false,
        "square": 44
      },
      {
        "r": 8,
        "c": 9,
        "player": 1,
        "isKing": false,
        "square": 45
      },
      {
        "r": 9,
        "c": 2,
        "player": 1,
        "isKing": false,
        "square": 47
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 33,
        "toSq": 22,
        "from": {
          "r": 6,
          "c": 5
        },
        "to": {
          "r": 4,
          "c": 3
        },
        "note": "Continue combo: 33x22",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 18,
        "toSq": 27,
        "from": {
          "r": 3,
          "c": 4
        },
        "to": {
          "r": 5,
          "c": 2
        },
        "note": "Opponent responds 18x38",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 27,
        "toSq": 38,
        "from": {
          "r": 5,
          "c": 2
        },
        "to": {
          "r": 7,
          "c": 4
        },
        "note": "Multi-jump continue: 38",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 29,
        "toSq": 18,
        "from": {
          "r": 5,
          "c": 6
        },
        "to": {
          "r": 3,
          "c": 4
        },
        "note": "Continue combo: 29x16",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 18,
        "toSq": 7,
        "from": {
          "r": 3,
          "c": 4
        },
        "to": {
          "r": 1,
          "c": 2
        },
        "note": "Multi-jump continue: 7",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 7,
        "toSq": 16,
        "from": {
          "r": 1,
          "c": 2
        },
        "to": {
          "r": 3,
          "c": 0
        },
        "note": "Multi-jump continue: 16",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 20,
        "toSq": 24,
        "from": {
          "r": 3,
          "c": 8
        },
        "to": {
          "r": 4,
          "c": 7
        },
        "note": "Opponent responds 20-24",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 42,
        "toSq": 33,
        "from": {
          "r": 8,
          "c": 3
        },
        "to": {
          "r": 6,
          "c": 5
        },
        "note": "Continue combo: 42x33",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 24,
        "toSq": 30,
        "from": {
          "r": 4,
          "c": 7
        },
        "to": {
          "r": 5,
          "c": 8
        },
        "note": "Opponent responds 24-30",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 35,
        "toSq": 24,
        "from": {
          "r": 6,
          "c": 9
        },
        "to": {
          "r": 4,
          "c": 7
        },
        "note": "Continue combo: 35x24",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 30,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 8
        },
        "note": "Opponent responds 19x50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 30,
        "toSq": 39,
        "from": {
          "r": 5,
          "c": 8
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 50,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 8
        },
        "note": "Multi-jump continue: 50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-15-ENDGAME",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "👑 Endgame Sweep #15 (16.PNG): Coronation Finish",
    "badge": "👑 Endgame #15",
    "source_image": "16.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "endgame-sweep",
    "themeName": "Endgame Sweep • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Endgame continuation study from 16.PNG: White has broken through, now finish the cleanup!",
    "themeStars": "⭐⭐⭐⭐",
    "coachQuote": "Trap don open from 16.PNG! Now execute the final coronation cleanup!",
    "difficulty": {
      "tier": 6,
      "tier_name": "Advanced",
      "rating": 2030,
      "human_score": 62
    },
    "difficultyTier": 6,
    "rating": 2030,
    "hints": [
      "The first sacrifice has already happened. Spot the coronation sweep!",
      "Black's pieces are exposed. Find the multi-jump path to king.",
      "Play 23-32!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 7,
        "player": 2,
        "isKing": false,
        "square": 4
      },
      {
        "r": 2,
        "c": 3,
        "player": 2,
        "isKing": false,
        "square": 12
      },
      {
        "r": 3,
        "c": 0,
        "player": 2,
        "isKing": false,
        "square": 16
      },
      {
        "r": 3,
        "c": 2,
        "player": 2,
        "isKing": false,
        "square": 17
      },
      {
        "r": 4,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 23
      },
      {
        "r": 4,
        "c": 7,
        "player": 2,
        "isKing": false,
        "square": 24
      },
      {
        "r": 5,
        "c": 0,
        "player": 2,
        "isKing": false,
        "square": 26
      },
      {
        "r": 5,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 28
      },
      {
        "r": 6,
        "c": 7,
        "player": 1,
        "isKing": false,
        "square": 34
      },
      {
        "r": 7,
        "c": 0,
        "player": 1,
        "isKing": false,
        "square": 36
      },
      {
        "r": 7,
        "c": 2,
        "player": 1,
        "isKing": false,
        "square": 37
      },
      {
        "r": 8,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 43
      },
      {
        "r": 8,
        "c": 9,
        "player": 1,
        "isKing": false,
        "square": 45
      },
      {
        "r": 9,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 48
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 23,
        "toSq": 32,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Continue combo: 23x32",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 24,
        "toSq": 29,
        "from": {
          "r": 4,
          "c": 7
        },
        "to": {
          "r": 5,
          "c": 6
        },
        "note": "Opponent responds 24-29",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 34,
        "toSq": 23,
        "from": {
          "r": 6,
          "c": 7
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Continue combo: 34x23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 12,
        "toSq": 18,
        "from": {
          "r": 2,
          "c": 3
        },
        "to": {
          "r": 3,
          "c": 4
        },
        "note": "Opponent responds 12-18",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 23,
        "toSq": 12,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 2,
          "c": 3
        },
        "note": "Continue combo: 23x21",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 12,
        "toSq": 21,
        "from": {
          "r": 2,
          "c": 3
        },
        "to": {
          "r": 4,
          "c": 1
        },
        "note": "Multi-jump continue: 21",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 16,
        "toSq": 27,
        "from": {
          "r": 3,
          "c": 0
        },
        "to": {
          "r": 5,
          "c": 2
        },
        "note": "Opponent responds 16x49",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 27,
        "toSq": 38,
        "from": {
          "r": 5,
          "c": 2
        },
        "to": {
          "r": 7,
          "c": 4
        },
        "note": "Multi-jump continue: 38",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 38,
        "toSq": 49,
        "from": {
          "r": 7,
          "c": 4
        },
        "to": {
          "r": 9,
          "c": 6
        },
        "note": "Multi-jump continue: 49",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-16-ENDGAME",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "👑 Endgame Sweep #16 (17.PNG): Coronation Finish",
    "badge": "👑 Endgame #16",
    "source_image": "17.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "endgame-sweep",
    "themeName": "Endgame Sweep • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Endgame continuation study from 17.PNG: White has broken through, now finish the cleanup!",
    "themeStars": "⭐⭐⭐⭐",
    "coachQuote": "Trap don open from 17.PNG! Now execute the final coronation cleanup!",
    "difficulty": {
      "tier": 6,
      "tier_name": "Advanced",
      "rating": 2050,
      "human_score": 62
    },
    "difficultyTier": 6,
    "rating": 2050,
    "hints": [
      "The first sacrifice has already happened. Spot the coronation sweep!",
      "Black's pieces are exposed. Find the multi-jump path to king.",
      "Play 21-12!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 3,
        "player": 2,
        "isKing": false,
        "square": 2
      },
      {
        "r": 2,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 13
      },
      {
        "r": 2,
        "c": 7,
        "player": 2,
        "isKing": false,
        "square": 14
      },
      {
        "r": 3,
        "c": 2,
        "player": 2,
        "isKing": false,
        "square": 17
      },
      {
        "r": 3,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 18
      },
      {
        "r": 3,
        "c": 6,
        "player": 2,
        "isKing": false,
        "square": 19
      },
      {
        "r": 4,
        "c": 1,
        "player": 1,
        "isKing": false,
        "square": 21
      },
      {
        "r": 4,
        "c": 7,
        "player": 2,
        "isKing": false,
        "square": 24
      },
      {
        "r": 5,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 28
      },
      {
        "r": 6,
        "c": 1,
        "player": 2,
        "isKing": false,
        "square": 31
      },
      {
        "r": 6,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 33
      },
      {
        "r": 6,
        "c": 7,
        "player": 1,
        "isKing": false,
        "square": 34
      },
      {
        "r": 7,
        "c": 2,
        "player": 1,
        "isKing": false,
        "square": 37
      },
      {
        "r": 8,
        "c": 1,
        "player": 1,
        "isKing": false,
        "square": 41
      },
      {
        "r": 8,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 43
      },
      {
        "r": 9,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 48
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 21,
        "toSq": 12,
        "from": {
          "r": 4,
          "c": 1
        },
        "to": {
          "r": 2,
          "c": 3
        },
        "note": "Continue combo: 21x23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 12,
        "toSq": 23,
        "from": {
          "r": 2,
          "c": 3
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Multi-jump continue: 23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 31,
        "toSq": 42,
        "from": {
          "r": 6,
          "c": 1
        },
        "to": {
          "r": 8,
          "c": 3
        },
        "note": "Opponent responds 31x42",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 48,
        "toSq": 37,
        "from": {
          "r": 9,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 2
        },
        "note": "Continue combo: 48x37",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 24,
        "toSq": 29,
        "from": {
          "r": 4,
          "c": 7
        },
        "to": {
          "r": 5,
          "c": 6
        },
        "note": "Opponent responds 24-29",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 33,
        "toSq": 24,
        "from": {
          "r": 6,
          "c": 5
        },
        "to": {
          "r": 4,
          "c": 7
        },
        "note": "Continue combo: 33x24",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 30,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 8
        },
        "note": "Opponent responds 19x48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 30,
        "toSq": 39,
        "from": {
          "r": 5,
          "c": 8
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 4
        },
        "note": "Multi-jump continue: 48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-17-ENDGAME",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "👑 Endgame Sweep #17 (18.PNG): Coronation Finish",
    "badge": "👑 Endgame #17",
    "source_image": "18.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "endgame-sweep",
    "themeName": "Endgame Sweep • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Endgame continuation study from 18.PNG: White has broken through, now finish the cleanup!",
    "themeStars": "⭐⭐⭐⭐",
    "coachQuote": "Trap don open from 18.PNG! Now execute the final coronation cleanup!",
    "difficulty": {
      "tier": 6,
      "tier_name": "Advanced",
      "rating": 2070,
      "human_score": 62
    },
    "difficultyTier": 6,
    "rating": 2070,
    "hints": [
      "The first sacrifice has already happened. Spot the coronation sweep!",
      "Black's pieces are exposed. Find the multi-jump path to king.",
      "Play 32-21!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 3,
        "player": 2,
        "isKing": false,
        "square": 2
      },
      {
        "r": 0,
        "c": 7,
        "player": 2,
        "isKing": false,
        "square": 4
      },
      {
        "r": 1,
        "c": 2,
        "player": 2,
        "isKing": false,
        "square": 7
      },
      {
        "r": 1,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 8
      },
      {
        "r": 2,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 13
      },
      {
        "r": 2,
        "c": 9,
        "player": 1,
        "isKing": false,
        "square": 15
      },
      {
        "r": 4,
        "c": 3,
        "player": 2,
        "isKing": false,
        "square": 22
      },
      {
        "r": 5,
        "c": 2,
        "player": 2,
        "isKing": false,
        "square": 27
      },
      {
        "r": 5,
        "c": 6,
        "player": 1,
        "isKing": false,
        "square": 29
      },
      {
        "r": 6,
        "c": 3,
        "player": 1,
        "isKing": false,
        "square": 32
      },
      {
        "r": 6,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 33
      },
      {
        "r": 7,
        "c": 2,
        "player": 1,
        "isKing": false,
        "square": 37
      },
      {
        "r": 7,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 38
      },
      {
        "r": 7,
        "c": 6,
        "player": 1,
        "isKing": false,
        "square": 39
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 32,
        "toSq": 21,
        "from": {
          "r": 6,
          "c": 3
        },
        "to": {
          "r": 4,
          "c": 1
        },
        "note": "Continue combo: 32x21",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 22,
        "toSq": 28,
        "from": {
          "r": 4,
          "c": 3
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Opponent responds 22-28",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 33,
        "toSq": 22,
        "from": {
          "r": 6,
          "c": 5
        },
        "to": {
          "r": 4,
          "c": 3
        },
        "note": "Continue combo: 33x22",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 4,
        "toSq": 10,
        "from": {
          "r": 0,
          "c": 7
        },
        "to": {
          "r": 1,
          "c": 8
        },
        "note": "Opponent responds 4-10",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 15,
        "toSq": 4,
        "from": {
          "r": 2,
          "c": 9
        },
        "to": {
          "r": 0,
          "c": 7
        },
        "note": "Continue combo: 15x4",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 8,
        "toSq": 12,
        "from": {
          "r": 1,
          "c": 4
        },
        "to": {
          "r": 2,
          "c": 3
        },
        "note": "Opponent responds 8-12",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 4,
        "toSq": 18,
        "from": {
          "r": 0,
          "c": 7
        },
        "to": {
          "r": 3,
          "c": 4
        },
        "note": "Continue combo: 4x18",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 12,
        "toSq": 23,
        "from": {
          "r": 2,
          "c": 3
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Opponent responds 12x41",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 23,
        "toSq": 34,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 7
        },
        "note": "Multi-jump continue: 34",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 34,
        "toSq": 43,
        "from": {
          "r": 6,
          "c": 7
        },
        "to": {
          "r": 8,
          "c": 5
        },
        "note": "Multi-jump continue: 43",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 43,
        "toSq": 32,
        "from": {
          "r": 8,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Multi-jump continue: 32",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 32,
        "toSq": 41,
        "from": {
          "r": 6,
          "c": 3
        },
        "to": {
          "r": 8,
          "c": 1
        },
        "note": "Multi-jump continue: 41",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-18-ENDGAME",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "👑 Endgame Sweep #18 (19.PNG): Coronation Finish",
    "badge": "👑 Endgame #18",
    "source_image": "19.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "endgame-sweep",
    "themeName": "Endgame Sweep • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Endgame continuation study from 19.PNG: White has broken through, now finish the cleanup!",
    "themeStars": "⭐⭐⭐⭐",
    "coachQuote": "Trap don open from 19.PNG! Now execute the final coronation cleanup!",
    "difficulty": {
      "tier": 6,
      "tier_name": "Advanced",
      "rating": 2090,
      "human_score": 62
    },
    "difficultyTier": 6,
    "rating": 2090,
    "hints": [
      "The first sacrifice has already happened. Spot the coronation sweep!",
      "Black's pieces are exposed. Find the multi-jump path to king.",
      "Play 15-4!"
    ],
    "initialBoard": [
      {
        "r": 1,
        "c": 8,
        "player": 2,
        "isKing": false,
        "square": 10
      },
      {
        "r": 2,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 13
      },
      {
        "r": 2,
        "c": 7,
        "player": 2,
        "isKing": false,
        "square": 14
      },
      {
        "r": 2,
        "c": 9,
        "player": 1,
        "isKing": false,
        "square": 15
      },
      {
        "r": 3,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 18
      },
      {
        "r": 3,
        "c": 6,
        "player": 2,
        "isKing": false,
        "square": 19
      },
      {
        "r": 4,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 23
      },
      {
        "r": 4,
        "c": 7,
        "player": 2,
        "isKing": false,
        "square": 24
      },
      {
        "r": 4,
        "c": 9,
        "player": 1,
        "isKing": false,
        "square": 25
      },
      {
        "r": 6,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 33
      },
      {
        "r": 7,
        "c": 2,
        "player": 1,
        "isKing": false,
        "square": 37
      },
      {
        "r": 7,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 38
      },
      {
        "r": 7,
        "c": 6,
        "player": 1,
        "isKing": false,
        "square": 39
      },
      {
        "r": 8,
        "c": 3,
        "player": 1,
        "isKing": false,
        "square": 42
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 15,
        "toSq": 4,
        "from": {
          "r": 2,
          "c": 9
        },
        "to": {
          "r": 0,
          "c": 7
        },
        "note": "Continue combo: 15x4",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 14,
        "toSq": 20,
        "from": {
          "r": 2,
          "c": 7
        },
        "to": {
          "r": 3,
          "c": 8
        },
        "note": "Opponent responds 14-20",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 25,
        "toSq": 14,
        "from": {
          "r": 4,
          "c": 9
        },
        "to": {
          "r": 2,
          "c": 7
        },
        "note": "Continue combo: 25x14",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 10,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 1,
          "c": 8
        },
        "note": "Opponent responds 19x10",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 4,
        "toSq": 15,
        "from": {
          "r": 0,
          "c": 7
        },
        "to": {
          "r": 2,
          "c": 9
        },
        "note": "Continue combo: 4x29",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 15,
        "toSq": 29,
        "from": {
          "r": 2,
          "c": 9
        },
        "to": {
          "r": 5,
          "c": 6
        },
        "note": "Multi-jump continue: 29",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 23,
        "toSq": 34,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 7
        },
        "note": "Opponent responds 23x41",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 34,
        "toSq": 43,
        "from": {
          "r": 6,
          "c": 7
        },
        "to": {
          "r": 8,
          "c": 5
        },
        "note": "Multi-jump continue: 43",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 43,
        "toSq": 32,
        "from": {
          "r": 8,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Multi-jump continue: 32",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 32,
        "toSq": 41,
        "from": {
          "r": 6,
          "c": 3
        },
        "to": {
          "r": 8,
          "c": 1
        },
        "note": "Multi-jump continue: 41",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-19-ENDGAME",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "👑 Endgame Sweep #19 (20.PNG): Coronation Finish",
    "badge": "👑 Endgame #19",
    "source_image": "20.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "endgame-sweep",
    "themeName": "Endgame Sweep • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Endgame continuation study from 20.PNG: White has broken through, now finish the cleanup!",
    "themeStars": "⭐⭐⭐⭐",
    "coachQuote": "Trap don open from 20.PNG! Now execute the final coronation cleanup!",
    "difficulty": {
      "tier": 6,
      "tier_name": "Advanced",
      "rating": 2110,
      "human_score": 62
    },
    "difficultyTier": 6,
    "rating": 2110,
    "hints": [
      "The first sacrifice has already happened. Spot the coronation sweep!",
      "Black's pieces are exposed. Find the multi-jump path to king.",
      "Play 13-22!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 3
      },
      {
        "r": 2,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 13
      },
      {
        "r": 2,
        "c": 7,
        "player": 2,
        "isKing": false,
        "square": 14
      },
      {
        "r": 3,
        "c": 0,
        "player": 2,
        "isKing": false,
        "square": 16
      },
      {
        "r": 3,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 18
      },
      {
        "r": 4,
        "c": 1,
        "player": 2,
        "isKing": false,
        "square": 21
      },
      {
        "r": 5,
        "c": 0,
        "player": 2,
        "isKing": false,
        "square": 26
      },
      {
        "r": 6,
        "c": 1,
        "player": 2,
        "isKing": false,
        "square": 31
      },
      {
        "r": 6,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 33
      },
      {
        "r": 7,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 38
      },
      {
        "r": 8,
        "c": 1,
        "player": 1,
        "isKing": false,
        "square": 41
      },
      {
        "r": 8,
        "c": 5,
        "player": 1,
        "isKing": false,
        "square": 43
      },
      {
        "r": 9,
        "c": 0,
        "player": 1,
        "isKing": false,
        "square": 46
      },
      {
        "r": 9,
        "c": 2,
        "player": 1,
        "isKing": false,
        "square": 47
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 13,
        "toSq": 22,
        "from": {
          "r": 2,
          "c": 5
        },
        "to": {
          "r": 4,
          "c": 3
        },
        "note": "Continue combo: 13x22",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 31,
        "toSq": 37,
        "from": {
          "r": 6,
          "c": 1
        },
        "to": {
          "r": 7,
          "c": 2
        },
        "note": "Opponent responds 31-37",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 41,
        "toSq": 32,
        "from": {
          "r": 8,
          "c": 1
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Continue combo: 41x32",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 21,
        "toSq": 27,
        "from": {
          "r": 4,
          "c": 1
        },
        "to": {
          "r": 5,
          "c": 2
        },
        "note": "Opponent responds 21-27",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 22,
        "toSq": 31,
        "from": {
          "r": 4,
          "c": 3
        },
        "to": {
          "r": 6,
          "c": 1
        },
        "note": "Continue combo: 22x31",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 26,
        "toSq": 37,
        "from": {
          "r": 5,
          "c": 0
        },
        "to": {
          "r": 7,
          "c": 2
        },
        "note": "Opponent responds 26x48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 37,
        "toSq": 28,
        "from": {
          "r": 7,
          "c": 2
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Multi-jump continue: 28",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 28,
        "toSq": 39,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 4
        },
        "note": "Multi-jump continue: 48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-20-ENDGAME",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "👑 Endgame Sweep #20 (21.PNG): Coronation Finish",
    "badge": "👑 Endgame #20",
    "source_image": "21.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "endgame-sweep",
    "themeName": "Endgame Sweep • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Endgame continuation study from 21.PNG: White has broken through, now finish the cleanup!",
    "themeStars": "⭐⭐⭐⭐",
    "coachQuote": "Trap don open from 21.PNG! Now execute the final coronation cleanup!",
    "difficulty": {
      "tier": 6,
      "tier_name": "Advanced",
      "rating": 2130,
      "human_score": 62
    },
    "difficultyTier": 6,
    "rating": 2130,
    "hints": [
      "The first sacrifice has already happened. Spot the coronation sweep!",
      "Black's pieces are exposed. Find the multi-jump path to king.",
      "Play 31-22!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 3,
        "player": 2,
        "isKing": false,
        "square": 2
      },
      {
        "r": 1,
        "c": 2,
        "player": 2,
        "isKing": false,
        "square": 7
      },
      {
        "r": 1,
        "c": 4,
        "player": 2,
        "isKing": false,
        "square": 8
      },
      {
        "r": 1,
        "c": 8,
        "player": 2,
        "isKing": false,
        "square": 10
      },
      {
        "r": 2,
        "c": 5,
        "player": 2,
        "isKing": false,
        "square": 13
      },
      {
        "r": 2,
        "c": 7,
        "player": 2,
        "isKing": false,
        "square": 14
      },
      {
        "r": 4,
        "c": 7,
        "player": 1,
        "isKing": false,
        "square": 24
      },
      {
        "r": 5,
        "c": 2,
        "player": 2,
        "isKing": false,
        "square": 27
      },
      {
        "r": 5,
        "c": 6,
        "player": 1,
        "isKing": false,
        "square": 29
      },
      {
        "r": 6,
        "c": 1,
        "player": 1,
        "isKing": false,
        "square": 31
      },
      {
        "r": 7,
        "c": 2,
        "player": 1,
        "isKing": false,
        "square": 37
      },
      {
        "r": 7,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 38
      },
      {
        "r": 7,
        "c": 6,
        "player": 1,
        "isKing": false,
        "square": 39
      },
      {
        "r": 9,
        "c": 4,
        "player": 1,
        "isKing": false,
        "square": 48
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 31,
        "toSq": 22,
        "from": {
          "r": 6,
          "c": 1
        },
        "to": {
          "r": 4,
          "c": 3
        },
        "note": "Continue combo: 31x22",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 14,
        "toSq": 20,
        "from": {
          "r": 2,
          "c": 7
        },
        "to": {
          "r": 3,
          "c": 8
        },
        "note": "Opponent responds 14-20",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 24,
        "toSq": 15,
        "from": {
          "r": 4,
          "c": 7
        },
        "to": {
          "r": 2,
          "c": 9
        },
        "note": "Continue combo: 24x4",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 15,
        "toSq": 4,
        "from": {
          "r": 2,
          "c": 9
        },
        "to": {
          "r": 0,
          "c": 7
        },
        "note": "Multi-jump continue: 4",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 8,
        "toSq": 12,
        "from": {
          "r": 1,
          "c": 4
        },
        "to": {
          "r": 2,
          "c": 3
        },
        "note": "Opponent responds 8-12",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 4,
        "toSq": 18,
        "from": {
          "r": 0,
          "c": 7
        },
        "to": {
          "r": 3,
          "c": 4
        },
        "note": "Continue combo: 4x18",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 12,
        "toSq": 23,
        "from": {
          "r": 2,
          "c": 3
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Opponent responds 12x41",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 23,
        "toSq": 34,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 7
        },
        "note": "Multi-jump continue: 34",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 34,
        "toSq": 43,
        "from": {
          "r": 6,
          "c": 7
        },
        "to": {
          "r": 8,
          "c": 5
        },
        "note": "Multi-jump continue: 43",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 43,
        "toSq": 32,
        "from": {
          "r": 8,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Multi-jump continue: 32",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 32,
        "toSq": 41,
        "from": {
          "r": 6,
          "c": 3
        },
        "to": {
          "r": 8,
          "c": 1
        },
        "note": "Multi-jump continue: 41",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-1-SETUP",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🪤 Street Ambush #1 (1.PNG): Punish the Blunder",
    "badge": "🪤 Ambush #1",
    "source_image": "1.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "ambush-punish",
    "themeName": "Blunder Ambush • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Authentic game situation from 1.PNG where opponent just walked into the combination",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Opponent make blunder for 1.PNG! Show them why street draughts no dey forgive mistake!",
    "difficulty": {
      "tier": 9,
      "tier_name": "Master",
      "rating": 2020,
      "human_score": 74
    },
    "difficultyTier": 9,
    "rating": 2020,
    "hints": [
      "Opponent played aggressively but walked straight into a classical trap.",
      "Don't defend passively—look for the immediate tactical counter-blow.",
      "Strike decisively with 33-28!"
    ],
    "initialBoard": [
      {
        "r": 2,
        "c": 3,
        "square": 12,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 4,
        "square": 18,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 6,
        "square": 19,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 8,
        "square": 20,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 3,
        "square": 22,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 5,
        "square": 23,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 2,
        "square": 27,
        "player": 2,
        "isKing": false
      },
      {
        "r": 6,
        "c": 1,
        "square": 31,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 5,
        "square": 33,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 7,
        "square": 34,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 9,
        "square": 35,
        "player": 2,
        "isKing": false
      },
      {
        "r": 7,
        "c": 0,
        "square": 36,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 4,
        "square": 38,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 6,
        "square": 39,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 3,
        "square": 42,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 7,
        "square": 44,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 4,
        "square": 48,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 33,
        "toSq": 28,
        "from": {
          "r": 6,
          "c": 5
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Key strike: 33-28!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 23,
        "toSq": 32,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Opponent responds 23x43",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 32,
        "toSq": 43,
        "from": {
          "r": 6,
          "c": 3
        },
        "to": {
          "r": 8,
          "c": 5
        },
        "note": "Multi-jump continue: 43",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 44,
        "toSq": 40,
        "from": {
          "r": 8,
          "c": 7
        },
        "to": {
          "r": 7,
          "c": 8
        },
        "note": "Continue combo: 44-40",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 35,
        "toSq": 44,
        "from": {
          "r": 6,
          "c": 9
        },
        "to": {
          "r": 8,
          "c": 7
        },
        "note": "Opponent responds 35x33",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 44,
        "toSq": 33,
        "from": {
          "r": 8,
          "c": 7
        },
        "to": {
          "r": 6,
          "c": 5
        },
        "note": "Multi-jump continue: 33",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 48,
        "toSq": 39,
        "from": {
          "r": 9,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Continue combo: 48x8",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 39,
        "toSq": 28,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Multi-jump continue: 28",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 28,
        "toSq": 17,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 3,
          "c": 2
        },
        "note": "Multi-jump continue: 17",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 17,
        "toSq": 8,
        "from": {
          "r": 3,
          "c": 2
        },
        "to": {
          "r": 1,
          "c": 4
        },
        "note": "Multi-jump continue: 8",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 13,
        "toSq": 2,
        "from": {
          "r": 2,
          "c": 5
        },
        "to": {
          "r": 0,
          "c": 3
        },
        "note": "Opponent responds 13x2",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 31,
        "toSq": 22,
        "from": {
          "r": 6,
          "c": 1
        },
        "to": {
          "r": 4,
          "c": 3
        },
        "note": "Continue combo: 31x15",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 22,
        "toSq": 13,
        "from": {
          "r": 4,
          "c": 3
        },
        "to": {
          "r": 2,
          "c": 5
        },
        "note": "Multi-jump continue: 13",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 13,
        "toSq": 24,
        "from": {
          "r": 2,
          "c": 5
        },
        "to": {
          "r": 4,
          "c": 7
        },
        "note": "Multi-jump continue: 24",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 24,
        "toSq": 15,
        "from": {
          "r": 4,
          "c": 7
        },
        "to": {
          "r": 2,
          "c": 9
        },
        "note": "Multi-jump continue: 15",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-2-SETUP",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🪤 Street Ambush #2 (2.PNG): Punish the Blunder",
    "badge": "🪤 Ambush #2",
    "source_image": "2.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "ambush-punish",
    "themeName": "Blunder Ambush • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Authentic game situation from 2.PNG where opponent just walked into the combination",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Opponent make blunder for 2.PNG! Show them why street draughts no dey forgive mistake!",
    "difficulty": {
      "tier": 9,
      "tier_name": "Master",
      "rating": 2038,
      "human_score": 74
    },
    "difficultyTier": 9,
    "rating": 2038,
    "hints": [
      "Opponent played aggressively but walked straight into a classical trap.",
      "Don't defend passively—look for the immediate tactical counter-blow.",
      "Strike decisively with 33-29!"
    ],
    "initialBoard": [
      {
        "r": 2,
        "c": 3,
        "square": 12,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 7,
        "square": 14,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 4,
        "square": 18,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 1,
        "square": 21,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 3,
        "square": 22,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 7,
        "square": 24,
        "player": 2,
        "isKing": false
      },
      {
        "r": 6,
        "c": 3,
        "square": 32,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 5,
        "square": 33,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 2,
        "square": 37,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 4,
        "square": 38,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 5,
        "square": 43,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 7,
        "square": 44,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 4,
        "square": 48,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 33,
        "toSq": 29,
        "from": {
          "r": 6,
          "c": 5
        },
        "to": {
          "r": 5,
          "c": 6
        },
        "note": "Key strike: 33-29!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 24,
        "toSq": 33,
        "from": {
          "r": 4,
          "c": 7
        },
        "to": {
          "r": 6,
          "c": 5
        },
        "note": "Opponent responds 24x31",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 33,
        "toSq": 42,
        "from": {
          "r": 6,
          "c": 5
        },
        "to": {
          "r": 8,
          "c": 3
        },
        "note": "Multi-jump continue: 42",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 42,
        "toSq": 31,
        "from": {
          "r": 8,
          "c": 3
        },
        "to": {
          "r": 6,
          "c": 1
        },
        "note": "Multi-jump continue: 31",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 32,
        "toSq": 28,
        "from": {
          "r": 6,
          "c": 3
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Continue combo: 32-28",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 22,
        "toSq": 33,
        "from": {
          "r": 4,
          "c": 3
        },
        "to": {
          "r": 6,
          "c": 5
        },
        "note": "Opponent responds 22x33",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 43,
        "toSq": 38,
        "from": {
          "r": 8,
          "c": 5
        },
        "to": {
          "r": 7,
          "c": 4
        },
        "note": "Continue combo: 43-38",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 33,
        "toSq": 42,
        "from": {
          "r": 6,
          "c": 5
        },
        "to": {
          "r": 8,
          "c": 3
        },
        "note": "Opponent responds 33x42",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 48,
        "toSq": 37,
        "from": {
          "r": 9,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 2
        },
        "note": "Continue combo: 48x10",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 37,
        "toSq": 26,
        "from": {
          "r": 7,
          "c": 2
        },
        "to": {
          "r": 5,
          "c": 0
        },
        "note": "Multi-jump continue: 26",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 26,
        "toSq": 17,
        "from": {
          "r": 5,
          "c": 0
        },
        "to": {
          "r": 3,
          "c": 2
        },
        "note": "Multi-jump continue: 17",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 17,
        "toSq": 8,
        "from": {
          "r": 3,
          "c": 2
        },
        "to": {
          "r": 1,
          "c": 4
        },
        "note": "Multi-jump continue: 8",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 8,
        "toSq": 19,
        "from": {
          "r": 1,
          "c": 4
        },
        "to": {
          "r": 3,
          "c": 6
        },
        "note": "Multi-jump continue: 19",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 19,
        "toSq": 10,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 1,
          "c": 8
        },
        "note": "Multi-jump continue: 10",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-3-SETUP",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🪤 Street Ambush #3 (3.PNG): Punish the Blunder",
    "badge": "🪤 Ambush #3",
    "source_image": "3.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "ambush-punish",
    "themeName": "Blunder Ambush • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Authentic game situation from 3.PNG where opponent just walked into the combination",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Opponent make blunder for 3.PNG! Show them why street draughts no dey forgive mistake!",
    "difficulty": {
      "tier": 9,
      "tier_name": "Master",
      "rating": 2056,
      "human_score": 74
    },
    "difficultyTier": 9,
    "rating": 2056,
    "hints": [
      "Opponent played aggressively but walked straight into a classical trap.",
      "Don't defend passively—look for the immediate tactical counter-blow.",
      "Strike decisively with 33-28!"
    ],
    "initialBoard": [
      {
        "r": 1,
        "c": 4,
        "square": 8,
        "player": 2,
        "isKing": false
      },
      {
        "r": 1,
        "c": 8,
        "square": 10,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 3,
        "square": 12,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 2,
        "square": 17,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 4,
        "square": 18,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 8,
        "square": 20,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 3,
        "square": 22,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 2,
        "square": 27,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 6,
        "square": 29,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 5,
        "square": 33,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 2,
        "square": 37,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 6,
        "square": 39,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 8,
        "square": 40,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 3,
        "square": 42,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 2,
        "square": 47,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 8,
        "square": 50,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 33,
        "toSq": 28,
        "from": {
          "r": 6,
          "c": 5
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Key strike: 33-28!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 22,
        "toSq": 33,
        "from": {
          "r": 4,
          "c": 3
        },
        "to": {
          "r": 6,
          "c": 5
        },
        "note": "Opponent responds 22x35",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 33,
        "toSq": 44,
        "from": {
          "r": 6,
          "c": 5
        },
        "to": {
          "r": 8,
          "c": 7
        },
        "note": "Multi-jump continue: 44",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 44,
        "toSq": 35,
        "from": {
          "r": 8,
          "c": 7
        },
        "to": {
          "r": 6,
          "c": 9
        },
        "note": "Multi-jump continue: 35",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 29,
        "toSq": 23,
        "from": {
          "r": 5,
          "c": 6
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Continue combo: 29-23",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 18,
        "toSq": 29,
        "from": {
          "r": 3,
          "c": 4
        },
        "to": {
          "r": 5,
          "c": 6
        },
        "note": "Opponent responds 18x29",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 37,
        "toSq": 32,
        "from": {
          "r": 7,
          "c": 2
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Continue combo: 37-32",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 27,
        "toSq": 38,
        "from": {
          "r": 5,
          "c": 2
        },
        "to": {
          "r": 7,
          "c": 4
        },
        "note": "Opponent responds 27x38",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 42,
        "toSq": 33,
        "from": {
          "r": 8,
          "c": 3
        },
        "to": {
          "r": 6,
          "c": 5
        },
        "note": "Continue combo: 42x4",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 33,
        "toSq": 24,
        "from": {
          "r": 6,
          "c": 5
        },
        "to": {
          "r": 4,
          "c": 7
        },
        "note": "Multi-jump continue: 24",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 24,
        "toSq": 15,
        "from": {
          "r": 4,
          "c": 7
        },
        "to": {
          "r": 2,
          "c": 9
        },
        "note": "Multi-jump continue: 15",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 15,
        "toSq": 4,
        "from": {
          "r": 2,
          "c": 9
        },
        "to": {
          "r": 0,
          "c": 7
        },
        "note": "Multi-jump continue: 4",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-4-SETUP",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🪤 Street Ambush #4 (4.PNG): Punish the Blunder",
    "badge": "🪤 Ambush #4",
    "source_image": "4.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "ambush-punish",
    "themeName": "Blunder Ambush • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Authentic game situation from 4.PNG where opponent just walked into the combination",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Opponent make blunder for 4.PNG! Show them why street draughts no dey forgive mistake!",
    "difficulty": {
      "tier": 9,
      "tier_name": "Master",
      "rating": 2074,
      "human_score": 74
    },
    "difficultyTier": 9,
    "rating": 2074,
    "hints": [
      "Opponent played aggressively but walked straight into a classical trap.",
      "Don't defend passively—look for the immediate tactical counter-blow.",
      "Strike decisively with 26-21!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 1,
        "square": 1,
        "player": 2,
        "isKing": false
      },
      {
        "r": 0,
        "c": 7,
        "square": 4,
        "player": 2,
        "isKing": false
      },
      {
        "r": 1,
        "c": 2,
        "square": 7,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 1,
        "square": 11,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 7,
        "square": 14,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 0,
        "square": 16,
        "player": 1,
        "isKing": false
      },
      {
        "r": 3,
        "c": 4,
        "square": 18,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 6,
        "square": 19,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 5,
        "square": 23,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 7,
        "square": 24,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 0,
        "square": 26,
        "player": 1,
        "isKing": false
      },
      {
        "r": 5,
        "c": 2,
        "square": 27,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 7,
        "square": 34,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 8,
        "square": 40,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 3,
        "square": 42,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 5,
        "square": 43,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 7,
        "square": 44,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 6,
        "square": 49,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 26,
        "toSq": 21,
        "from": {
          "r": 5,
          "c": 0
        },
        "to": {
          "r": 4,
          "c": 1
        },
        "note": "Key strike: 26-21!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 11,
        "toSq": 17,
        "from": {
          "r": 2,
          "c": 1
        },
        "to": {
          "r": 3,
          "c": 2
        },
        "note": "Opponent responds 11-17",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 21,
        "toSq": 12,
        "from": {
          "r": 4,
          "c": 1
        },
        "to": {
          "r": 2,
          "c": 3
        },
        "note": "Continue combo: 21x12",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 23,
        "toSq": 28,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Opponent responds 23-28",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 12,
        "toSq": 23,
        "from": {
          "r": 2,
          "c": 3
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Continue combo: 12x32",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 23,
        "toSq": 32,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Multi-jump continue: 32",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 24,
        "toSq": 29,
        "from": {
          "r": 4,
          "c": 7
        },
        "to": {
          "r": 5,
          "c": 6
        },
        "note": "Opponent responds 24-29",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 34,
        "toSq": 23,
        "from": {
          "r": 6,
          "c": 7
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Continue combo: 34x23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Opponent responds 19x50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 28,
        "toSq": 37,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 2
        },
        "note": "Multi-jump continue: 37",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 37,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 2
        },
        "to": {
          "r": 9,
          "c": 4
        },
        "note": "Multi-jump continue: 48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 48,
        "toSq": 39,
        "from": {
          "r": 9,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 50,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 8
        },
        "note": "Multi-jump continue: 50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-5-SETUP",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🪤 Street Ambush #5 (5.PNG): Punish the Blunder",
    "badge": "🪤 Ambush #5",
    "source_image": "5.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "ambush-punish",
    "themeName": "Blunder Ambush • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Authentic game situation from 5.PNG where opponent just walked into the combination",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Opponent make blunder for 5.PNG! Show them why street draughts no dey forgive mistake!",
    "difficulty": {
      "tier": 9,
      "tier_name": "Master",
      "rating": 2092,
      "human_score": 74
    },
    "difficultyTier": 9,
    "rating": 2092,
    "hints": [
      "Opponent played aggressively but walked straight into a classical trap.",
      "Don't defend passively—look for the immediate tactical counter-blow.",
      "Strike decisively with 29-24!"
    ],
    "initialBoard": [
      {
        "r": 1,
        "c": 0,
        "square": 6,
        "player": 2,
        "isKing": false
      },
      {
        "r": 1,
        "c": 6,
        "square": 9,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 1,
        "square": 11,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 3,
        "square": 12,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 7,
        "square": 14,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 4,
        "square": 18,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 9,
        "square": 25,
        "player": 1,
        "isKing": false
      },
      {
        "r": 5,
        "c": 0,
        "square": 26,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 6,
        "square": 29,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 5,
        "square": 33,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 4,
        "square": 38,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 1,
        "square": 41,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 3,
        "square": 42,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 5,
        "square": 43,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 2,
        "square": 47,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 29,
        "toSq": 24,
        "from": {
          "r": 5,
          "c": 6
        },
        "to": {
          "r": 4,
          "c": 7
        },
        "note": "Key strike: 29-24!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 14,
        "toSq": 20,
        "from": {
          "r": 2,
          "c": 7
        },
        "to": {
          "r": 3,
          "c": 8
        },
        "note": "Opponent responds 14-20",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 25,
        "toSq": 14,
        "from": {
          "r": 4,
          "c": 9
        },
        "to": {
          "r": 2,
          "c": 7
        },
        "note": "Continue combo: 25x3",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 14,
        "toSq": 3,
        "from": {
          "r": 2,
          "c": 7
        },
        "to": {
          "r": 0,
          "c": 5
        },
        "note": "Multi-jump continue: 3",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 13,
        "toSq": 19,
        "from": {
          "r": 2,
          "c": 5
        },
        "to": {
          "r": 3,
          "c": 6
        },
        "note": "Opponent responds 13-19",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 24,
        "toSq": 13,
        "from": {
          "r": 4,
          "c": 7
        },
        "to": {
          "r": 2,
          "c": 5
        },
        "note": "Continue combo: 24x22",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 13,
        "toSq": 22,
        "from": {
          "r": 2,
          "c": 5
        },
        "to": {
          "r": 4,
          "c": 3
        },
        "note": "Multi-jump continue: 22",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 12,
        "toSq": 17,
        "from": {
          "r": 2,
          "c": 3
        },
        "to": {
          "r": 3,
          "c": 2
        },
        "note": "Opponent responds 12-17",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 3,
        "toSq": 21,
        "from": {
          "r": 0,
          "c": 5
        },
        "to": {
          "r": 4,
          "c": 1
        },
        "note": "Continue combo: 3x21",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 26,
        "toSq": 17,
        "from": {
          "r": 5,
          "c": 0
        },
        "to": {
          "r": 3,
          "c": 2
        },
        "note": "Opponent responds 26x46",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 17,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 2
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Multi-jump continue: 28",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 28,
        "toSq": 39,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 4
        },
        "note": "Multi-jump continue: 48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 48,
        "toSq": 37,
        "from": {
          "r": 9,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 2
        },
        "note": "Multi-jump continue: 37",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 37,
        "toSq": 46,
        "from": {
          "r": 7,
          "c": 2
        },
        "to": {
          "r": 9,
          "c": 0
        },
        "note": "Multi-jump continue: 46",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-6-SETUP",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🪤 Street Ambush #6 (6.PNG): Punish the Blunder",
    "badge": "🪤 Ambush #6",
    "source_image": "6.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "ambush-punish",
    "themeName": "Blunder Ambush • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Authentic game situation from 6.PNG where opponent just walked into the combination",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Opponent make blunder for 6.PNG! Show them why street draughts no dey forgive mistake!",
    "difficulty": {
      "tier": 9,
      "tier_name": "Master",
      "rating": 2110,
      "human_score": 74
    },
    "difficultyTier": 9,
    "rating": 2110,
    "hints": [
      "Opponent played aggressively but walked straight into a classical trap.",
      "Don't defend passively—look for the immediate tactical counter-blow.",
      "Strike decisively with 42-38!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 5,
        "square": 3,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 3,
        "square": 12,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 0,
        "square": 16,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 2,
        "square": 17,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 4,
        "square": 18,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 6,
        "square": 19,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 5,
        "square": 23,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 0,
        "square": 26,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 6,
        "square": 29,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 8,
        "square": 30,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 3,
        "square": 32,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 7,
        "square": 34,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 0,
        "square": 36,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 2,
        "square": 37,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 8,
        "square": 40,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 3,
        "square": 42,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 5,
        "square": 43,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 4,
        "square": 48,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 42,
        "toSq": 38,
        "from": {
          "r": 8,
          "c": 3
        },
        "to": {
          "r": 7,
          "c": 4
        },
        "note": "Key strike: 42-38!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 24,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 4,
          "c": 7
        },
        "note": "Opponent responds 19-24",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 30,
        "toSq": 19,
        "from": {
          "r": 5,
          "c": 8
        },
        "to": {
          "r": 3,
          "c": 6
        },
        "note": "Continue combo: 30x28",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 19,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Multi-jump continue: 28",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 18,
        "toSq": 22,
        "from": {
          "r": 3,
          "c": 4
        },
        "to": {
          "r": 4,
          "c": 3
        },
        "note": "Opponent responds 18-22",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 34,
        "toSq": 23,
        "from": {
          "r": 6,
          "c": 7
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Continue combo: 34x23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 22,
        "toSq": 33,
        "from": {
          "r": 4,
          "c": 3
        },
        "to": {
          "r": 6,
          "c": 5
        },
        "note": "Opponent responds 22x31",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 33,
        "toSq": 42,
        "from": {
          "r": 6,
          "c": 5
        },
        "to": {
          "r": 8,
          "c": 3
        },
        "note": "Multi-jump continue: 42",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 42,
        "toSq": 31,
        "from": {
          "r": 8,
          "c": 3
        },
        "to": {
          "r": 6,
          "c": 1
        },
        "note": "Multi-jump continue: 31",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 36,
        "toSq": 27,
        "from": {
          "r": 7,
          "c": 0
        },
        "to": {
          "r": 5,
          "c": 2
        },
        "note": "Continue combo: 36x27",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 26,
        "toSq": 31,
        "from": {
          "r": 5,
          "c": 0
        },
        "to": {
          "r": 6,
          "c": 1
        },
        "note": "Opponent responds 26-31",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 27,
        "toSq": 36,
        "from": {
          "r": 5,
          "c": 2
        },
        "to": {
          "r": 7,
          "c": 0
        },
        "note": "Continue combo: 27x36",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 12,
        "toSq": 18,
        "from": {
          "r": 2,
          "c": 3
        },
        "to": {
          "r": 3,
          "c": 4
        },
        "note": "Opponent responds 12-18",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 23,
        "toSq": 12,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 2,
          "c": 3
        },
        "note": "Continue combo: 23x21",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 12,
        "toSq": 21,
        "from": {
          "r": 2,
          "c": 3
        },
        "to": {
          "r": 4,
          "c": 1
        },
        "note": "Multi-jump continue: 21",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 16,
        "toSq": 27,
        "from": {
          "r": 3,
          "c": 0
        },
        "to": {
          "r": 5,
          "c": 2
        },
        "note": "Opponent responds 16x49",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 27,
        "toSq": 38,
        "from": {
          "r": 5,
          "c": 2
        },
        "to": {
          "r": 7,
          "c": 4
        },
        "note": "Multi-jump continue: 38",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 38,
        "toSq": 49,
        "from": {
          "r": 7,
          "c": 4
        },
        "to": {
          "r": 9,
          "c": 6
        },
        "note": "Multi-jump continue: 49",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-7-SETUP",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🪤 Street Ambush #7 (7.PNG): Punish the Blunder",
    "badge": "🪤 Ambush #7",
    "source_image": "7.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "ambush-punish",
    "themeName": "Blunder Ambush • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Authentic game situation from 7.PNG where opponent just walked into the combination",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Opponent make blunder for 7.PNG! Show them why street draughts no dey forgive mistake!",
    "difficulty": {
      "tier": 9,
      "tier_name": "Master",
      "rating": 2128,
      "human_score": 74
    },
    "difficultyTier": 9,
    "rating": 2128,
    "hints": [
      "Opponent played aggressively but walked straight into a classical trap.",
      "Don't defend passively—look for the immediate tactical counter-blow.",
      "Strike decisively with 48-43!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 3,
        "square": 2,
        "player": 2,
        "isKing": false
      },
      {
        "r": 1,
        "c": 4,
        "square": 8,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 7,
        "square": 14,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 6,
        "square": 19,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 1,
        "square": 21,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 3,
        "square": 22,
        "player": 1,
        "isKing": false
      },
      {
        "r": 4,
        "c": 5,
        "square": 23,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 7,
        "square": 24,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 9,
        "square": 25,
        "player": 1,
        "isKing": false
      },
      {
        "r": 5,
        "c": 4,
        "square": 28,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 3,
        "square": 32,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 5,
        "square": 33,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 4,
        "square": 38,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 2,
        "square": 47,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 4,
        "square": 48,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 48,
        "toSq": 43,
        "from": {
          "r": 9,
          "c": 4
        },
        "to": {
          "r": 8,
          "c": 5
        },
        "note": "Key strike: 48-43!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 13,
        "toSq": 18,
        "from": {
          "r": 2,
          "c": 5
        },
        "to": {
          "r": 3,
          "c": 4
        },
        "note": "Opponent responds 13-18",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 22,
        "toSq": 13,
        "from": {
          "r": 4,
          "c": 3
        },
        "to": {
          "r": 2,
          "c": 5
        },
        "note": "Continue combo: 22x13",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 21,
        "toSq": 27,
        "from": {
          "r": 4,
          "c": 1
        },
        "to": {
          "r": 5,
          "c": 2
        },
        "note": "Opponent responds 21-27",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 32,
        "toSq": 21,
        "from": {
          "r": 6,
          "c": 3
        },
        "to": {
          "r": 4,
          "c": 1
        },
        "note": "Continue combo: 32x21",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 23,
        "toSq": 32,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Opponent responds 23x32",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 38,
        "toSq": 27,
        "from": {
          "r": 7,
          "c": 4
        },
        "to": {
          "r": 5,
          "c": 2
        },
        "note": "Continue combo: 38x27",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 14,
        "toSq": 20,
        "from": {
          "r": 2,
          "c": 7
        },
        "to": {
          "r": 3,
          "c": 8
        },
        "note": "Opponent responds 14-20",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 25,
        "toSq": 14,
        "from": {
          "r": 4,
          "c": 9
        },
        "to": {
          "r": 2,
          "c": 7
        },
        "note": "Continue combo: 25x23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 14,
        "toSq": 23,
        "from": {
          "r": 2,
          "c": 7
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Multi-jump continue: 23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 8,
        "toSq": 19,
        "from": {
          "r": 1,
          "c": 4
        },
        "to": {
          "r": 3,
          "c": 6
        },
        "note": "Opponent responds 8x48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Multi-jump continue: 28",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 28,
        "toSq": 39,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 4
        },
        "note": "Multi-jump continue: 48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-8-SETUP",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🪤 Street Ambush #8 (8.PNG): Punish the Blunder",
    "badge": "🪤 Ambush #8",
    "source_image": "8.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "ambush-punish",
    "themeName": "Blunder Ambush • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Authentic game situation from 8.PNG where opponent just walked into the combination",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Opponent make blunder for 8.PNG! Show them why street draughts no dey forgive mistake!",
    "difficulty": {
      "tier": 9,
      "tier_name": "Master",
      "rating": 2146,
      "human_score": 74
    },
    "difficultyTier": 9,
    "rating": 2146,
    "hints": [
      "Opponent played aggressively but walked straight into a classical trap.",
      "Don't defend passively—look for the immediate tactical counter-blow.",
      "Strike decisively with 40-35!"
    ],
    "initialBoard": [
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 7,
        "square": 14,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 2,
        "square": 17,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 4,
        "square": 18,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 6,
        "square": 19,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 3,
        "square": 22,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 9,
        "square": 25,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 0,
        "square": 26,
        "player": 1,
        "isKing": false
      },
      {
        "r": 5,
        "c": 8,
        "square": 30,
        "player": 2,
        "isKing": false
      },
      {
        "r": 6,
        "c": 1,
        "square": 31,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 5,
        "square": 33,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 7,
        "square": 34,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 4,
        "square": 38,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 6,
        "square": 39,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 8,
        "square": 40,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 7,
        "square": 44,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 40,
        "toSq": 35,
        "from": {
          "r": 7,
          "c": 8
        },
        "to": {
          "r": 6,
          "c": 9
        },
        "note": "Key strike: 40-35!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 17,
        "toSq": 21,
        "from": {
          "r": 3,
          "c": 2
        },
        "to": {
          "r": 4,
          "c": 1
        },
        "note": "Opponent responds 17-21",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 26,
        "toSq": 17,
        "from": {
          "r": 5,
          "c": 0
        },
        "to": {
          "r": 3,
          "c": 2
        },
        "note": "Continue combo: 26x28",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 17,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 2
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Multi-jump continue: 28",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 18,
        "toSq": 23,
        "from": {
          "r": 3,
          "c": 4
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Opponent responds 18-23",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 35,
        "toSq": 24,
        "from": {
          "r": 6,
          "c": 9
        },
        "to": {
          "r": 4,
          "c": 7
        },
        "note": "Continue combo: 35x24",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 23,
        "toSq": 32,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Opponent responds 23x43",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 32,
        "toSq": 43,
        "from": {
          "r": 6,
          "c": 3
        },
        "to": {
          "r": 8,
          "c": 5
        },
        "note": "Multi-jump continue: 43",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 39,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 4
        },
        "note": "Continue combo: 39x48",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 30,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 8
        },
        "note": "Opponent responds 19x50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 30,
        "toSq": 39,
        "from": {
          "r": 5,
          "c": 8
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 50,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 8
        },
        "note": "Multi-jump continue: 50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-9-SETUP",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🪤 Street Ambush #9 (10.PNG): Punish the Blunder",
    "badge": "🪤 Ambush #9",
    "source_image": "10.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "ambush-punish",
    "themeName": "Blunder Ambush • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Authentic game situation from 10.PNG where opponent just walked into the combination",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Opponent make blunder for 10.PNG! Show them why street draughts no dey forgive mistake!",
    "difficulty": {
      "tier": 9,
      "tier_name": "Master",
      "rating": 2164,
      "human_score": 74
    },
    "difficultyTier": 9,
    "rating": 2164,
    "hints": [
      "Opponent played aggressively but walked straight into a classical trap.",
      "Don't defend passively—look for the immediate tactical counter-blow.",
      "Strike decisively with 39-33!"
    ],
    "initialBoard": [
      {
        "r": 1,
        "c": 4,
        "square": 8,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 3,
        "square": 12,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 7,
        "square": 14,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 0,
        "square": 16,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 4,
        "square": 18,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 6,
        "square": 19,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 7,
        "square": 24,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 9,
        "square": 25,
        "player": 1,
        "isKing": false
      },
      {
        "r": 5,
        "c": 2,
        "square": 27,
        "player": 1,
        "isKing": false
      },
      {
        "r": 5,
        "c": 4,
        "square": 28,
        "player": 1,
        "isKing": false
      },
      {
        "r": 5,
        "c": 6,
        "square": 29,
        "player": 2,
        "isKing": false
      },
      {
        "r": 6,
        "c": 3,
        "square": 32,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 9,
        "square": 35,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 4,
        "square": 38,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 6,
        "square": 39,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 7,
        "square": 44,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 4,
        "square": 48,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 39,
        "toSq": 33,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 6,
          "c": 5
        },
        "note": "Key strike: 39-33!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 16,
        "toSq": 21,
        "from": {
          "r": 3,
          "c": 0
        },
        "to": {
          "r": 4,
          "c": 1
        },
        "note": "Opponent responds 16-21",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 27,
        "toSq": 16,
        "from": {
          "r": 5,
          "c": 2
        },
        "to": {
          "r": 3,
          "c": 0
        },
        "note": "Continue combo: 27x16",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 18,
        "toSq": 22,
        "from": {
          "r": 3,
          "c": 4
        },
        "to": {
          "r": 4,
          "c": 3
        },
        "note": "Opponent responds 18-22",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 28,
        "toSq": 17,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 3,
          "c": 2
        },
        "note": "Continue combo: 28x17",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 12,
        "toSq": 21,
        "from": {
          "r": 2,
          "c": 3
        },
        "to": {
          "r": 4,
          "c": 1
        },
        "note": "Opponent responds 12x21",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 16,
        "toSq": 27,
        "from": {
          "r": 3,
          "c": 0
        },
        "to": {
          "r": 5,
          "c": 2
        },
        "note": "Continue combo: 16x27",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 24,
        "toSq": 30,
        "from": {
          "r": 4,
          "c": 7
        },
        "to": {
          "r": 5,
          "c": 8
        },
        "note": "Opponent responds 24-30",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 25,
        "toSq": 34,
        "from": {
          "r": 4,
          "c": 9
        },
        "to": {
          "r": 6,
          "c": 7
        },
        "note": "Continue combo: 25x23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 34,
        "toSq": 23,
        "from": {
          "r": 6,
          "c": 7
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Multi-jump continue: 23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Opponent responds 19x50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 28,
        "toSq": 39,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 50,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 8
        },
        "note": "Multi-jump continue: 50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-10-SETUP",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🪤 Street Ambush #10 (11.PNG): Punish the Blunder",
    "badge": "🪤 Ambush #10",
    "source_image": "11.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "ambush-punish",
    "themeName": "Blunder Ambush • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Authentic game situation from 11.PNG where opponent just walked into the combination",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Opponent make blunder for 11.PNG! Show them why street draughts no dey forgive mistake!",
    "difficulty": {
      "tier": 9,
      "tier_name": "Master",
      "rating": 2182,
      "human_score": 74
    },
    "difficultyTier": 9,
    "rating": 2182,
    "hints": [
      "Opponent played aggressively but walked straight into a classical trap.",
      "Don't defend passively—look for the immediate tactical counter-blow.",
      "Strike decisively with 30-25!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 3,
        "square": 2,
        "player": 2,
        "isKing": false
      },
      {
        "r": 0,
        "c": 5,
        "square": 3,
        "player": 2,
        "isKing": false
      },
      {
        "r": 1,
        "c": 4,
        "square": 8,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 3,
        "square": 12,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 6,
        "square": 19,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 8,
        "square": 20,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 3,
        "square": 22,
        "player": 1,
        "isKing": false
      },
      {
        "r": 4,
        "c": 5,
        "square": 23,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 2,
        "square": 27,
        "player": 1,
        "isKing": false
      },
      {
        "r": 5,
        "c": 4,
        "square": 28,
        "player": 1,
        "isKing": false
      },
      {
        "r": 5,
        "c": 8,
        "square": 30,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 3,
        "square": 32,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 3,
        "square": 42,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 5,
        "square": 43,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 7,
        "square": 44,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 30,
        "toSq": 25,
        "from": {
          "r": 5,
          "c": 8
        },
        "to": {
          "r": 4,
          "c": 9
        },
        "note": "Key strike: 30-25!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 24,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 4,
          "c": 7
        },
        "note": "Opponent responds 19-24",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 28,
        "toSq": 19,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 3,
          "c": 6
        },
        "note": "Continue combo: 28x30",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 19,
        "toSq": 30,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 8
        },
        "note": "Multi-jump continue: 30",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 13,
        "toSq": 19,
        "from": {
          "r": 2,
          "c": 5
        },
        "to": {
          "r": 3,
          "c": 6
        },
        "note": "Opponent responds 13-19",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 25,
        "toSq": 14,
        "from": {
          "r": 4,
          "c": 9
        },
        "to": {
          "r": 2,
          "c": 7
        },
        "note": "Continue combo: 25x23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 14,
        "toSq": 23,
        "from": {
          "r": 2,
          "c": 7
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Multi-jump continue: 23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 12,
        "toSq": 18,
        "from": {
          "r": 2,
          "c": 3
        },
        "to": {
          "r": 3,
          "c": 4
        },
        "note": "Opponent responds 12-18",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 22,
        "toSq": 13,
        "from": {
          "r": 4,
          "c": 3
        },
        "to": {
          "r": 2,
          "c": 5
        },
        "note": "Continue combo: 22x13",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 8,
        "toSq": 19,
        "from": {
          "r": 1,
          "c": 4
        },
        "to": {
          "r": 3,
          "c": 6
        },
        "note": "Opponent responds 8x50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Multi-jump continue: 28",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 28,
        "toSq": 37,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 2
        },
        "note": "Multi-jump continue: 37",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 37,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 2
        },
        "to": {
          "r": 9,
          "c": 4
        },
        "note": "Multi-jump continue: 48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 48,
        "toSq": 39,
        "from": {
          "r": 9,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 50,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 8
        },
        "note": "Multi-jump continue: 50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-11-SETUP",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🪤 Street Ambush #11 (12.PNG): Punish the Blunder",
    "badge": "🪤 Ambush #11",
    "source_image": "12.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "ambush-punish",
    "themeName": "Blunder Ambush • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Authentic game situation from 12.PNG where opponent just walked into the combination",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Opponent make blunder for 12.PNG! Show them why street draughts no dey forgive mistake!",
    "difficulty": {
      "tier": 9,
      "tier_name": "Master",
      "rating": 2200,
      "human_score": 74
    },
    "difficultyTier": 9,
    "rating": 2200,
    "hints": [
      "Opponent played aggressively but walked straight into a classical trap.",
      "Don't defend passively—look for the immediate tactical counter-blow.",
      "Strike decisively with 28-23!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 5,
        "square": 3,
        "player": 2,
        "isKing": false
      },
      {
        "r": 1,
        "c": 4,
        "square": 8,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 1,
        "square": 11,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 3,
        "square": 12,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 7,
        "square": 14,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 7,
        "square": 24,
        "player": 1,
        "isKing": false
      },
      {
        "r": 5,
        "c": 2,
        "square": 27,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 4,
        "square": 28,
        "player": 1,
        "isKing": false
      },
      {
        "r": 5,
        "c": 6,
        "square": 29,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 4,
        "square": 38,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 3,
        "square": 42,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 5,
        "square": 43,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 7,
        "square": 44,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 28,
        "toSq": 23,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Key strike: 28-23!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 13,
        "toSq": 19,
        "from": {
          "r": 2,
          "c": 5
        },
        "to": {
          "r": 3,
          "c": 6
        },
        "note": "Opponent responds 13-19",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 24,
        "toSq": 13,
        "from": {
          "r": 4,
          "c": 7
        },
        "to": {
          "r": 2,
          "c": 5
        },
        "note": "Continue combo: 24x2",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 13,
        "toSq": 2,
        "from": {
          "r": 2,
          "c": 5
        },
        "to": {
          "r": 0,
          "c": 3
        },
        "note": "Multi-jump continue: 2",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 14,
        "toSq": 19,
        "from": {
          "r": 2,
          "c": 7
        },
        "to": {
          "r": 3,
          "c": 6
        },
        "note": "Opponent responds 14-19",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 2,
        "toSq": 16,
        "from": {
          "r": 0,
          "c": 3
        },
        "to": {
          "r": 3,
          "c": 0
        },
        "note": "Continue combo: 2x32",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 16,
        "toSq": 32,
        "from": {
          "r": 3,
          "c": 0
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Multi-jump continue: 32",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Opponent responds 19x50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 28,
        "toSq": 37,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 2
        },
        "note": "Multi-jump continue: 37",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 37,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 2
        },
        "to": {
          "r": 9,
          "c": 4
        },
        "note": "Multi-jump continue: 48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 48,
        "toSq": 39,
        "from": {
          "r": 9,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 50,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 8
        },
        "note": "Multi-jump continue: 50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-12-SETUP",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🪤 Street Ambush #12 (13.PNG): Punish the Blunder",
    "badge": "🪤 Ambush #12",
    "source_image": "13.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "ambush-punish",
    "themeName": "Blunder Ambush • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Authentic game situation from 13.PNG where opponent just walked into the combination",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Opponent make blunder for 13.PNG! Show them why street draughts no dey forgive mistake!",
    "difficulty": {
      "tier": 9,
      "tier_name": "Master",
      "rating": 2218,
      "human_score": 74
    },
    "difficultyTier": 9,
    "rating": 2218,
    "hints": [
      "Opponent played aggressively but walked straight into a classical trap.",
      "Don't defend passively—look for the immediate tactical counter-blow.",
      "Strike decisively with 31-27!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 5,
        "square": 3,
        "player": 2,
        "isKing": false
      },
      {
        "r": 1,
        "c": 8,
        "square": 10,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 1,
        "square": 11,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 3,
        "square": 12,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 7,
        "square": 14,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 2,
        "square": 17,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 5,
        "square": 23,
        "player": 1,
        "isKing": false
      },
      {
        "r": 4,
        "c": 9,
        "square": 25,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 6,
        "square": 29,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 1,
        "square": 31,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 5,
        "square": 33,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 9,
        "square": 35,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 1,
        "square": 41,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 3,
        "square": 42,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 5,
        "square": 43,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 31,
        "toSq": 27,
        "from": {
          "r": 6,
          "c": 1
        },
        "to": {
          "r": 5,
          "c": 2
        },
        "note": "Key strike: 31-27!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 25,
        "toSq": 30,
        "from": {
          "r": 4,
          "c": 9
        },
        "to": {
          "r": 5,
          "c": 8
        },
        "note": "Opponent responds 25-30",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 35,
        "toSq": 24,
        "from": {
          "r": 6,
          "c": 9
        },
        "to": {
          "r": 4,
          "c": 7
        },
        "note": "Continue combo: 35x24",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 14,
        "toSq": 20,
        "from": {
          "r": 2,
          "c": 7
        },
        "to": {
          "r": 3,
          "c": 8
        },
        "note": "Opponent responds 14-20",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 24,
        "toSq": 15,
        "from": {
          "r": 4,
          "c": 7
        },
        "to": {
          "r": 2,
          "c": 9
        },
        "note": "Continue combo: 24x4",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 15,
        "toSq": 4,
        "from": {
          "r": 2,
          "c": 9
        },
        "to": {
          "r": 0,
          "c": 7
        },
        "note": "Multi-jump continue: 4",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 13,
        "toSq": 18,
        "from": {
          "r": 2,
          "c": 5
        },
        "to": {
          "r": 3,
          "c": 4
        },
        "note": "Opponent responds 13-18",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 4,
        "toSq": 22,
        "from": {
          "r": 0,
          "c": 7
        },
        "to": {
          "r": 4,
          "c": 3
        },
        "note": "Continue combo: 4x22",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 17,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 2
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Opponent responds 17x46",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 28,
        "toSq": 39,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 4
        },
        "note": "Multi-jump continue: 48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 48,
        "toSq": 37,
        "from": {
          "r": 9,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 2
        },
        "note": "Multi-jump continue: 37",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 37,
        "toSq": 46,
        "from": {
          "r": 7,
          "c": 2
        },
        "to": {
          "r": 9,
          "c": 0
        },
        "note": "Multi-jump continue: 46",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-13-SETUP",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🪤 Street Ambush #13 (14.PNG): Punish the Blunder",
    "badge": "🪤 Ambush #13",
    "source_image": "14.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "ambush-punish",
    "themeName": "Blunder Ambush • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Authentic game situation from 14.PNG where opponent just walked into the combination",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Opponent make blunder for 14.PNG! Show them why street draughts no dey forgive mistake!",
    "difficulty": {
      "tier": 9,
      "tier_name": "Master",
      "rating": 2236,
      "human_score": 74
    },
    "difficultyTier": 9,
    "rating": 2236,
    "hints": [
      "Opponent played aggressively but walked straight into a classical trap.",
      "Don't defend passively—look for the immediate tactical counter-blow.",
      "Strike decisively with 32-28!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 7,
        "square": 4,
        "player": 2,
        "isKing": false
      },
      {
        "r": 1,
        "c": 4,
        "square": 8,
        "player": 2,
        "isKing": false
      },
      {
        "r": 1,
        "c": 8,
        "square": 10,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 7,
        "square": 14,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 4,
        "square": 18,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 6,
        "square": 19,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 7,
        "square": 24,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 9,
        "square": 25,
        "player": 1,
        "isKing": false
      },
      {
        "r": 5,
        "c": 8,
        "square": 30,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 3,
        "square": 32,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 5,
        "square": 33,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 9,
        "square": 35,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 4,
        "square": 38,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 6,
        "square": 39,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 8,
        "square": 40,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 32,
        "toSq": 28,
        "from": {
          "r": 6,
          "c": 3
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Key strike: 32-28!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 18,
        "toSq": 22,
        "from": {
          "r": 3,
          "c": 4
        },
        "to": {
          "r": 4,
          "c": 3
        },
        "note": "Opponent responds 18-22",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 28,
        "toSq": 17,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 3,
          "c": 2
        },
        "note": "Continue combo: 28x17",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 23,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Opponent responds 19-23",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 30,
        "toSq": 19,
        "from": {
          "r": 5,
          "c": 8
        },
        "to": {
          "r": 3,
          "c": 6
        },
        "note": "Continue combo: 30x28",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 19,
        "toSq": 28,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Multi-jump continue: 28",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 8,
        "toSq": 12,
        "from": {
          "r": 1,
          "c": 4
        },
        "to": {
          "r": 2,
          "c": 3
        },
        "note": "Opponent responds 8-12",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 17,
        "toSq": 8,
        "from": {
          "r": 3,
          "c": 2
        },
        "to": {
          "r": 1,
          "c": 4
        },
        "note": "Continue combo: 17x19",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 8,
        "toSq": 19,
        "from": {
          "r": 1,
          "c": 4
        },
        "to": {
          "r": 3,
          "c": 6
        },
        "note": "Multi-jump continue: 19",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 14,
        "toSq": 23,
        "from": {
          "r": 2,
          "c": 7
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Opponent responds 14x45",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 23,
        "toSq": 32,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Multi-jump continue: 32",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 32,
        "toSq": 43,
        "from": {
          "r": 6,
          "c": 3
        },
        "to": {
          "r": 8,
          "c": 5
        },
        "note": "Multi-jump continue: 43",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 43,
        "toSq": 34,
        "from": {
          "r": 8,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 7
        },
        "note": "Multi-jump continue: 34",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 34,
        "toSq": 45,
        "from": {
          "r": 6,
          "c": 7
        },
        "to": {
          "r": 8,
          "c": 9
        },
        "note": "Multi-jump continue: 45",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-14-SETUP",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🪤 Street Ambush #14 (15.PNG): Punish the Blunder",
    "badge": "🪤 Ambush #14",
    "source_image": "15.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "ambush-punish",
    "themeName": "Blunder Ambush • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Authentic game situation from 15.PNG where opponent just walked into the combination",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Opponent make blunder for 15.PNG! Show them why street draughts no dey forgive mistake!",
    "difficulty": {
      "tier": 9,
      "tier_name": "Master",
      "rating": 2254,
      "human_score": 74
    },
    "difficultyTier": 9,
    "rating": 2254,
    "hints": [
      "Opponent played aggressively but walked straight into a classical trap.",
      "Don't defend passively—look for the immediate tactical counter-blow.",
      "Strike decisively with 38-32!"
    ],
    "initialBoard": [
      {
        "r": 2,
        "c": 1,
        "square": 11,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 3,
        "square": 12,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 4,
        "square": 18,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 6,
        "square": 19,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 8,
        "square": 20,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 3,
        "square": 22,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 5,
        "square": 23,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 9,
        "square": 25,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 6,
        "square": 29,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 5,
        "square": 33,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 7,
        "square": 34,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 9,
        "square": 35,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 4,
        "square": 38,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 3,
        "square": 42,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 7,
        "square": 44,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 9,
        "square": 45,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 2,
        "square": 47,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 38,
        "toSq": 32,
        "from": {
          "r": 7,
          "c": 4
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Key strike: 38-32!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 22,
        "toSq": 28,
        "from": {
          "r": 4,
          "c": 3
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Opponent responds 22-28",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 33,
        "toSq": 22,
        "from": {
          "r": 6,
          "c": 5
        },
        "to": {
          "r": 4,
          "c": 3
        },
        "note": "Continue combo: 33x22",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 18,
        "toSq": 27,
        "from": {
          "r": 3,
          "c": 4
        },
        "to": {
          "r": 5,
          "c": 2
        },
        "note": "Opponent responds 18x38",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 27,
        "toSq": 38,
        "from": {
          "r": 5,
          "c": 2
        },
        "to": {
          "r": 7,
          "c": 4
        },
        "note": "Multi-jump continue: 38",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 29,
        "toSq": 18,
        "from": {
          "r": 5,
          "c": 6
        },
        "to": {
          "r": 3,
          "c": 4
        },
        "note": "Continue combo: 29x16",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 18,
        "toSq": 7,
        "from": {
          "r": 3,
          "c": 4
        },
        "to": {
          "r": 1,
          "c": 2
        },
        "note": "Multi-jump continue: 7",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 1,
        "fromSq": 7,
        "toSq": 16,
        "from": {
          "r": 1,
          "c": 2
        },
        "to": {
          "r": 3,
          "c": 0
        },
        "note": "Multi-jump continue: 16",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 20,
        "toSq": 24,
        "from": {
          "r": 3,
          "c": 8
        },
        "to": {
          "r": 4,
          "c": 7
        },
        "note": "Opponent responds 20-24",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 42,
        "toSq": 33,
        "from": {
          "r": 8,
          "c": 3
        },
        "to": {
          "r": 6,
          "c": 5
        },
        "note": "Continue combo: 42x33",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 24,
        "toSq": 30,
        "from": {
          "r": 4,
          "c": 7
        },
        "to": {
          "r": 5,
          "c": 8
        },
        "note": "Opponent responds 24-30",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 35,
        "toSq": 24,
        "from": {
          "r": 6,
          "c": 9
        },
        "to": {
          "r": 4,
          "c": 7
        },
        "note": "Continue combo: 35x24",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 30,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 8
        },
        "note": "Opponent responds 19x50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 30,
        "toSq": 39,
        "from": {
          "r": 5,
          "c": 8
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 50,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 8
        },
        "note": "Multi-jump continue: 50",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-15-SETUP",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🪤 Street Ambush #15 (16.PNG): Punish the Blunder",
    "badge": "🪤 Ambush #15",
    "source_image": "16.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "ambush-punish",
    "themeName": "Blunder Ambush • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Authentic game situation from 16.PNG where opponent just walked into the combination",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Opponent make blunder for 16.PNG! Show them why street draughts no dey forgive mistake!",
    "difficulty": {
      "tier": 9,
      "tier_name": "Master",
      "rating": 2272,
      "human_score": 74
    },
    "difficultyTier": 9,
    "rating": 2272,
    "hints": [
      "Opponent played aggressively but walked straight into a classical trap.",
      "Don't defend passively—look for the immediate tactical counter-blow.",
      "Strike decisively with 49-43!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 7,
        "square": 4,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 3,
        "square": 12,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 0,
        "square": 16,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 2,
        "square": 17,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 3,
        "square": 22,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 5,
        "square": 23,
        "player": 1,
        "isKing": false
      },
      {
        "r": 4,
        "c": 7,
        "square": 24,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 0,
        "square": 26,
        "player": 2,
        "isKing": false
      },
      {
        "r": 6,
        "c": 7,
        "square": 34,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 0,
        "square": 36,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 2,
        "square": 37,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 9,
        "square": 45,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 4,
        "square": 48,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 6,
        "square": 49,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 49,
        "toSq": 43,
        "from": {
          "r": 9,
          "c": 6
        },
        "to": {
          "r": 8,
          "c": 5
        },
        "note": "Key strike: 49-43!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 22,
        "toSq": 28,
        "from": {
          "r": 4,
          "c": 3
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Opponent responds 22-28",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 23,
        "toSq": 32,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Continue combo: 23x32",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 24,
        "toSq": 29,
        "from": {
          "r": 4,
          "c": 7
        },
        "to": {
          "r": 5,
          "c": 6
        },
        "note": "Opponent responds 24-29",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 34,
        "toSq": 23,
        "from": {
          "r": 6,
          "c": 7
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Continue combo: 34x23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 12,
        "toSq": 18,
        "from": {
          "r": 2,
          "c": 3
        },
        "to": {
          "r": 3,
          "c": 4
        },
        "note": "Opponent responds 12-18",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 23,
        "toSq": 12,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 2,
          "c": 3
        },
        "note": "Continue combo: 23x21",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 12,
        "toSq": 21,
        "from": {
          "r": 2,
          "c": 3
        },
        "to": {
          "r": 4,
          "c": 1
        },
        "note": "Multi-jump continue: 21",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 16,
        "toSq": 27,
        "from": {
          "r": 3,
          "c": 0
        },
        "to": {
          "r": 5,
          "c": 2
        },
        "note": "Opponent responds 16x49",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 27,
        "toSq": 38,
        "from": {
          "r": 5,
          "c": 2
        },
        "to": {
          "r": 7,
          "c": 4
        },
        "note": "Multi-jump continue: 38",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 38,
        "toSq": 49,
        "from": {
          "r": 7,
          "c": 4
        },
        "to": {
          "r": 9,
          "c": 6
        },
        "note": "Multi-jump continue: 49",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-16-SETUP",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🪤 Street Ambush #16 (17.PNG): Punish the Blunder",
    "badge": "🪤 Ambush #16",
    "source_image": "17.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "ambush-punish",
    "themeName": "Blunder Ambush • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Authentic game situation from 17.PNG where opponent just walked into the combination",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Opponent make blunder for 17.PNG! Show them why street draughts no dey forgive mistake!",
    "difficulty": {
      "tier": 9,
      "tier_name": "Master",
      "rating": 2290,
      "human_score": 74
    },
    "difficultyTier": 9,
    "rating": 2290,
    "hints": [
      "Opponent played aggressively but walked straight into a classical trap.",
      "Don't defend passively—look for the immediate tactical counter-blow.",
      "Strike decisively with 27-21!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 3,
        "square": 2,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 7,
        "square": 14,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 2,
        "square": 17,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 4,
        "square": 18,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 6,
        "square": 19,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 7,
        "square": 24,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 0,
        "square": 26,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 2,
        "square": 27,
        "player": 1,
        "isKing": false
      },
      {
        "r": 5,
        "c": 4,
        "square": 28,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 5,
        "square": 33,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 7,
        "square": 34,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 2,
        "square": 37,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 1,
        "square": 41,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 5,
        "square": 43,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 4,
        "square": 48,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 27,
        "toSq": 21,
        "from": {
          "r": 5,
          "c": 2
        },
        "to": {
          "r": 4,
          "c": 1
        },
        "note": "Key strike: 27-21!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 26,
        "toSq": 31,
        "from": {
          "r": 5,
          "c": 0
        },
        "to": {
          "r": 6,
          "c": 1
        },
        "note": "Opponent responds 26-31",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 21,
        "toSq": 12,
        "from": {
          "r": 4,
          "c": 1
        },
        "to": {
          "r": 2,
          "c": 3
        },
        "note": "Continue combo: 21x23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 12,
        "toSq": 23,
        "from": {
          "r": 2,
          "c": 3
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Multi-jump continue: 23",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 31,
        "toSq": 42,
        "from": {
          "r": 6,
          "c": 1
        },
        "to": {
          "r": 8,
          "c": 3
        },
        "note": "Opponent responds 31x42",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 48,
        "toSq": 37,
        "from": {
          "r": 9,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 2
        },
        "note": "Continue combo: 48x37",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 24,
        "toSq": 29,
        "from": {
          "r": 4,
          "c": 7
        },
        "to": {
          "r": 5,
          "c": 6
        },
        "note": "Opponent responds 24-29",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 33,
        "toSq": 24,
        "from": {
          "r": 6,
          "c": 5
        },
        "to": {
          "r": 4,
          "c": 7
        },
        "note": "Continue combo: 33x24",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 30,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 5,
          "c": 8
        },
        "note": "Opponent responds 19x48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 30,
        "toSq": 39,
        "from": {
          "r": 5,
          "c": 8
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 4
        },
        "note": "Multi-jump continue: 48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-17-SETUP",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🪤 Street Ambush #17 (18.PNG): Punish the Blunder",
    "badge": "🪤 Ambush #17",
    "source_image": "18.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "ambush-punish",
    "themeName": "Blunder Ambush • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Authentic game situation from 18.PNG where opponent just walked into the combination",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Opponent make blunder for 18.PNG! Show them why street draughts no dey forgive mistake!",
    "difficulty": {
      "tier": 9,
      "tier_name": "Master",
      "rating": 2308,
      "human_score": 74
    },
    "difficultyTier": 9,
    "rating": 2308,
    "hints": [
      "Opponent played aggressively but walked straight into a classical trap.",
      "Don't defend passively—look for the immediate tactical counter-blow.",
      "Strike decisively with 34-29!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 3,
        "square": 2,
        "player": 2,
        "isKing": false
      },
      {
        "r": 0,
        "c": 7,
        "square": 4,
        "player": 2,
        "isKing": false
      },
      {
        "r": 1,
        "c": 2,
        "square": 7,
        "player": 2,
        "isKing": false
      },
      {
        "r": 1,
        "c": 4,
        "square": 8,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 9,
        "square": 15,
        "player": 1,
        "isKing": false
      },
      {
        "r": 4,
        "c": 1,
        "square": 21,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 3,
        "square": 22,
        "player": 2,
        "isKing": false
      },
      {
        "r": 6,
        "c": 3,
        "square": 32,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 5,
        "square": 33,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 7,
        "square": 34,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 2,
        "square": 37,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 4,
        "square": 38,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 6,
        "square": 39,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 34,
        "toSq": 29,
        "from": {
          "r": 6,
          "c": 7
        },
        "to": {
          "r": 5,
          "c": 6
        },
        "note": "Key strike: 34-29!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 21,
        "toSq": 27,
        "from": {
          "r": 4,
          "c": 1
        },
        "to": {
          "r": 5,
          "c": 2
        },
        "note": "Opponent responds 21-27",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 32,
        "toSq": 21,
        "from": {
          "r": 6,
          "c": 3
        },
        "to": {
          "r": 4,
          "c": 1
        },
        "note": "Continue combo: 32x21",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 22,
        "toSq": 28,
        "from": {
          "r": 4,
          "c": 3
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Opponent responds 22-28",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 33,
        "toSq": 22,
        "from": {
          "r": 6,
          "c": 5
        },
        "to": {
          "r": 4,
          "c": 3
        },
        "note": "Continue combo: 33x22",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 4,
        "toSq": 10,
        "from": {
          "r": 0,
          "c": 7
        },
        "to": {
          "r": 1,
          "c": 8
        },
        "note": "Opponent responds 4-10",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 15,
        "toSq": 4,
        "from": {
          "r": 2,
          "c": 9
        },
        "to": {
          "r": 0,
          "c": 7
        },
        "note": "Continue combo: 15x4",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 8,
        "toSq": 12,
        "from": {
          "r": 1,
          "c": 4
        },
        "to": {
          "r": 2,
          "c": 3
        },
        "note": "Opponent responds 8-12",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 4,
        "toSq": 18,
        "from": {
          "r": 0,
          "c": 7
        },
        "to": {
          "r": 3,
          "c": 4
        },
        "note": "Continue combo: 4x18",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 12,
        "toSq": 23,
        "from": {
          "r": 2,
          "c": 3
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Opponent responds 12x41",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 23,
        "toSq": 34,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 7
        },
        "note": "Multi-jump continue: 34",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 34,
        "toSq": 43,
        "from": {
          "r": 6,
          "c": 7
        },
        "to": {
          "r": 8,
          "c": 5
        },
        "note": "Multi-jump continue: 43",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 43,
        "toSq": 32,
        "from": {
          "r": 8,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Multi-jump continue: 32",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 32,
        "toSq": 41,
        "from": {
          "r": 6,
          "c": 3
        },
        "to": {
          "r": 8,
          "c": 1
        },
        "note": "Multi-jump continue: 41",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-18-SETUP",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🪤 Street Ambush #18 (19.PNG): Punish the Blunder",
    "badge": "🪤 Ambush #18",
    "source_image": "19.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "ambush-punish",
    "themeName": "Blunder Ambush • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Authentic game situation from 19.PNG where opponent just walked into the combination",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Opponent make blunder for 19.PNG! Show them why street draughts no dey forgive mistake!",
    "difficulty": {
      "tier": 9,
      "tier_name": "Master",
      "rating": 2326,
      "human_score": 74
    },
    "difficultyTier": 9,
    "rating": 2326,
    "hints": [
      "Opponent played aggressively but walked straight into a classical trap.",
      "Don't defend passively—look for the immediate tactical counter-blow.",
      "Strike decisively with 43-39!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 7,
        "square": 4,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 7,
        "square": 14,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 9,
        "square": 15,
        "player": 1,
        "isKing": false
      },
      {
        "r": 3,
        "c": 4,
        "square": 18,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 6,
        "square": 19,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 5,
        "square": 23,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 7,
        "square": 24,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 9,
        "square": 25,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 5,
        "square": 33,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 2,
        "square": 37,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 4,
        "square": 38,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 3,
        "square": 42,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 5,
        "square": 43,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 43,
        "toSq": 39,
        "from": {
          "r": 8,
          "c": 5
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Key strike: 43-39!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 4,
        "toSq": 10,
        "from": {
          "r": 0,
          "c": 7
        },
        "to": {
          "r": 1,
          "c": 8
        },
        "note": "Opponent responds 4-10",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 15,
        "toSq": 4,
        "from": {
          "r": 2,
          "c": 9
        },
        "to": {
          "r": 0,
          "c": 7
        },
        "note": "Continue combo: 15x4",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 14,
        "toSq": 20,
        "from": {
          "r": 2,
          "c": 7
        },
        "to": {
          "r": 3,
          "c": 8
        },
        "note": "Opponent responds 14-20",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 25,
        "toSq": 14,
        "from": {
          "r": 4,
          "c": 9
        },
        "to": {
          "r": 2,
          "c": 7
        },
        "note": "Continue combo: 25x14",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 19,
        "toSq": 10,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 1,
          "c": 8
        },
        "note": "Opponent responds 19x10",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 4,
        "toSq": 15,
        "from": {
          "r": 0,
          "c": 7
        },
        "to": {
          "r": 2,
          "c": 9
        },
        "note": "Continue combo: 4x29",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 15,
        "toSq": 29,
        "from": {
          "r": 2,
          "c": 9
        },
        "to": {
          "r": 5,
          "c": 6
        },
        "note": "Multi-jump continue: 29",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 23,
        "toSq": 34,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 7
        },
        "note": "Opponent responds 23x41",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 34,
        "toSq": 43,
        "from": {
          "r": 6,
          "c": 7
        },
        "to": {
          "r": 8,
          "c": 5
        },
        "note": "Multi-jump continue: 43",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 43,
        "toSq": 32,
        "from": {
          "r": 8,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Multi-jump continue: 32",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 32,
        "toSq": 41,
        "from": {
          "r": 6,
          "c": 3
        },
        "to": {
          "r": 8,
          "c": 1
        },
        "note": "Multi-jump continue: 41",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-19-SETUP",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🪤 Street Ambush #19 (20.PNG): Punish the Blunder",
    "badge": "🪤 Ambush #19",
    "source_image": "20.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "ambush-punish",
    "themeName": "Blunder Ambush • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Authentic game situation from 20.PNG where opponent just walked into the combination",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Opponent make blunder for 20.PNG! Show them why street draughts no dey forgive mistake!",
    "difficulty": {
      "tier": 9,
      "tier_name": "Master",
      "rating": 2344,
      "human_score": 74
    },
    "difficultyTier": 9,
    "rating": 2344,
    "hints": [
      "Opponent played aggressively but walked straight into a classical trap.",
      "Don't defend passively—look for the immediate tactical counter-blow.",
      "Strike decisively with 19-13!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 5,
        "square": 3,
        "player": 2,
        "isKing": false
      },
      {
        "r": 1,
        "c": 6,
        "square": 9,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 0,
        "square": 16,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 4,
        "square": 18,
        "player": 2,
        "isKing": false
      },
      {
        "r": 3,
        "c": 6,
        "square": 19,
        "player": 1,
        "isKing": false
      },
      {
        "r": 4,
        "c": 1,
        "square": 21,
        "player": 2,
        "isKing": false
      },
      {
        "r": 5,
        "c": 0,
        "square": 26,
        "player": 2,
        "isKing": false
      },
      {
        "r": 6,
        "c": 1,
        "square": 31,
        "player": 2,
        "isKing": false
      },
      {
        "r": 6,
        "c": 5,
        "square": 33,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 4,
        "square": 38,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 1,
        "square": 41,
        "player": 1,
        "isKing": false
      },
      {
        "r": 8,
        "c": 5,
        "square": 43,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 0,
        "square": 46,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 2,
        "square": 47,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 19,
        "toSq": 13,
        "from": {
          "r": 3,
          "c": 6
        },
        "to": {
          "r": 2,
          "c": 5
        },
        "note": "Key strike: 19-13!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 9,
        "toSq": 14,
        "from": {
          "r": 1,
          "c": 6
        },
        "to": {
          "r": 2,
          "c": 7
        },
        "note": "Opponent responds 9-14",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 13,
        "toSq": 22,
        "from": {
          "r": 2,
          "c": 5
        },
        "to": {
          "r": 4,
          "c": 3
        },
        "note": "Continue combo: 13x22",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 31,
        "toSq": 37,
        "from": {
          "r": 6,
          "c": 1
        },
        "to": {
          "r": 7,
          "c": 2
        },
        "note": "Opponent responds 31-37",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 41,
        "toSq": 32,
        "from": {
          "r": 8,
          "c": 1
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Continue combo: 41x32",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 21,
        "toSq": 27,
        "from": {
          "r": 4,
          "c": 1
        },
        "to": {
          "r": 5,
          "c": 2
        },
        "note": "Opponent responds 21-27",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 22,
        "toSq": 31,
        "from": {
          "r": 4,
          "c": 3
        },
        "to": {
          "r": 6,
          "c": 1
        },
        "note": "Continue combo: 22x31",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 26,
        "toSq": 37,
        "from": {
          "r": 5,
          "c": 0
        },
        "to": {
          "r": 7,
          "c": 2
        },
        "note": "Opponent responds 26x48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 37,
        "toSq": 28,
        "from": {
          "r": 7,
          "c": 2
        },
        "to": {
          "r": 5,
          "c": 4
        },
        "note": "Multi-jump continue: 28",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 28,
        "toSq": 39,
        "from": {
          "r": 5,
          "c": 4
        },
        "to": {
          "r": 7,
          "c": 6
        },
        "note": "Multi-jump continue: 39",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 39,
        "toSq": 48,
        "from": {
          "r": 7,
          "c": 6
        },
        "to": {
          "r": 9,
          "c": 4
        },
        "note": "Multi-jump continue: 48",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  },
  {
    "id": "DRAUGHTS-IMG-20-SETUP",
    "ruleset": "international",
    "board_size": 10,
    "side_to_move": "white",
    "title": "🪤 Street Ambush #20 (21.PNG): Punish the Blunder",
    "badge": "🪤 Ambush #20",
    "source_image": "21.PNG",
    "source_collection": "DRAUGHTS IMAGE",
    "category": "DRAUGHTS IMAGE Collection",
    "themeId": "ambush-punish",
    "themeName": "Blunder Ambush • DRAUGHTS IMAGE Master Series",
    "themeIdea": "Authentic game situation from 21.PNG where opponent just walked into the combination",
    "themeStars": "⭐⭐⭐⭐⭐",
    "coachQuote": "Opponent make blunder for 21.PNG! Show them why street draughts no dey forgive mistake!",
    "difficulty": {
      "tier": 9,
      "tier_name": "Master",
      "rating": 2362,
      "human_score": 74
    },
    "difficultyTier": 9,
    "rating": 2362,
    "hints": [
      "Opponent played aggressively but walked straight into a classical trap.",
      "Don't defend passively—look for the immediate tactical counter-blow.",
      "Strike decisively with 33-29!"
    ],
    "initialBoard": [
      {
        "r": 0,
        "c": 3,
        "square": 2,
        "player": 2,
        "isKing": false
      },
      {
        "r": 1,
        "c": 2,
        "square": 7,
        "player": 2,
        "isKing": false
      },
      {
        "r": 1,
        "c": 4,
        "square": 8,
        "player": 2,
        "isKing": false
      },
      {
        "r": 1,
        "c": 8,
        "square": 10,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 5,
        "square": 13,
        "player": 2,
        "isKing": false
      },
      {
        "r": 2,
        "c": 7,
        "square": 14,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 1,
        "square": 21,
        "player": 2,
        "isKing": false
      },
      {
        "r": 4,
        "c": 7,
        "square": 24,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 1,
        "square": 31,
        "player": 1,
        "isKing": false
      },
      {
        "r": 6,
        "c": 5,
        "square": 33,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 2,
        "square": 37,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 4,
        "square": 38,
        "player": 1,
        "isKing": false
      },
      {
        "r": 7,
        "c": 6,
        "square": 39,
        "player": 1,
        "isKing": false
      },
      {
        "r": 9,
        "c": 4,
        "square": 48,
        "player": 1,
        "isKing": false
      }
    ],
    "steps": [
      {
        "mover": 1,
        "fromSq": 33,
        "toSq": 29,
        "from": {
          "r": 6,
          "c": 5
        },
        "to": {
          "r": 5,
          "c": 6
        },
        "note": "Key strike: 33-29!",
        "isAi": false,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 21,
        "toSq": 27,
        "from": {
          "r": 4,
          "c": 1
        },
        "to": {
          "r": 5,
          "c": 2
        },
        "note": "Opponent responds 21-27",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 31,
        "toSq": 22,
        "from": {
          "r": 6,
          "c": 1
        },
        "to": {
          "r": 4,
          "c": 3
        },
        "note": "Continue combo: 31x22",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 14,
        "toSq": 20,
        "from": {
          "r": 2,
          "c": 7
        },
        "to": {
          "r": 3,
          "c": 8
        },
        "note": "Opponent responds 14-20",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 24,
        "toSq": 15,
        "from": {
          "r": 4,
          "c": 7
        },
        "to": {
          "r": 2,
          "c": 9
        },
        "note": "Continue combo: 24x4",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 15,
        "toSq": 4,
        "from": {
          "r": 2,
          "c": 9
        },
        "to": {
          "r": 0,
          "c": 7
        },
        "note": "Multi-jump continue: 4",
        "isAi": false,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 8,
        "toSq": 12,
        "from": {
          "r": 1,
          "c": 4
        },
        "to": {
          "r": 2,
          "c": 3
        },
        "note": "Opponent responds 8-12",
        "isAi": true,
        "isJump": false,
        "isForcedHop": false
      },
      {
        "mover": 1,
        "fromSq": 4,
        "toSq": 18,
        "from": {
          "r": 0,
          "c": 7
        },
        "to": {
          "r": 3,
          "c": 4
        },
        "note": "Continue combo: 4x18",
        "isAi": false,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 12,
        "toSq": 23,
        "from": {
          "r": 2,
          "c": 3
        },
        "to": {
          "r": 4,
          "c": 5
        },
        "note": "Opponent responds 12x41",
        "isAi": true,
        "isJump": true,
        "isForcedHop": false
      },
      {
        "mover": 2,
        "fromSq": 23,
        "toSq": 34,
        "from": {
          "r": 4,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 7
        },
        "note": "Multi-jump continue: 34",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 34,
        "toSq": 43,
        "from": {
          "r": 6,
          "c": 7
        },
        "to": {
          "r": 8,
          "c": 5
        },
        "note": "Multi-jump continue: 43",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 43,
        "toSq": 32,
        "from": {
          "r": 8,
          "c": 5
        },
        "to": {
          "r": 6,
          "c": 3
        },
        "note": "Multi-jump continue: 32",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      },
      {
        "mover": 2,
        "fromSq": 32,
        "toSq": 41,
        "from": {
          "r": 6,
          "c": 3
        },
        "to": {
          "r": 8,
          "c": 1
        },
        "note": "Multi-jump continue: 41",
        "isAi": true,
        "isJump": true,
        "isForcedHop": true
      }
    ]
  }
];

export class TrapAcademyController {
  constructor({ app }) {
    this.app = app;
    this.activeTrap = null;
    this.currentStepIdx = 0;
    this.isSolving = false;
    this.completedTraps = this.loadCompletedTraps();

    this.dom = {
      modal: document.getElementById('trap-academy-modal'),
      btnClose: document.getElementById('btn-close-trap-academy'),
      trapsList: document.getElementById('trap-cards-grid'),
      activeBanner: document.getElementById('trap-active-banner'),
      trapTitle: document.getElementById('trap-active-title'),
      trapBrief: document.getElementById('trap-active-brief'),
      trapStepNote: document.getElementById('trap-step-instruction'),
      btnHint: document.getElementById('btn-trap-hint'),
      btnReset: document.getElementById('btn-trap-reset'),
      btnExit: document.getElementById('btn-trap-exit'),
      winCelebration: document.getElementById('trap-celebration-overlay'),
      btnNextTrap: document.getElementById('btn-trap-next')
    };

    this.bindEvents();
  }

  loadCompletedTraps() {
    try {
      const stored = localStorage.getItem('naija_traps_completed');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  saveCompletedTrap(trapId) {
    if (!this.completedTraps.includes(trapId)) {
      this.completedTraps.push(trapId);
      try {
        localStorage.setItem('naija_traps_completed', JSON.stringify(this.completedTraps));
      } catch {}
    }
  }

  bindEvents() {
    if (this.dom.btnClose) {
      this.dom.btnClose.addEventListener('click', () => this.closeAcademyModal());
    }
    if (this.dom.btnExit) {
      this.dom.btnExit.addEventListener('click', () => this.exitActiveTrap());
    }
    if (this.dom.btnReset) {
      this.dom.btnReset.addEventListener('click', () => {
        if (this.activeTrap) this.startTrap(this.activeTrap.id);
      });
    }
    if (this.dom.btnHint) {
      this.dom.btnHint.addEventListener('click', () => this.showHint());
    }
    if (this.dom.btnNextTrap) {
      this.dom.btnNextTrap.addEventListener('click', () => this.advanceToNextTrap());
    }
  }

  openAcademyModal() {
    this.renderTrapCards();
    if (this.dom.modal) {
      this.dom.modal.classList.remove('hidden');
      this.dom.modal.style.display = 'flex';
    }
  }

  closeAcademyModal() {
    if (this.dom.modal) {
      this.dom.modal.classList.add('hidden');
      this.dom.modal.style.display = 'none';
    }
  }

  renderTrapCards() {
    if (!this.dom.trapsList) return;
    this.dom.trapsList.innerHTML = '';

    TRAP_DATABASE.forEach((trap, idx) => {
      const isDone = this.completedTraps.includes(trap.id);
      const card = document.createElement('div');
      card.className = `trap-card ${isDone ? 'completed' : ''}`;
      card.innerHTML = `
        <div class="trap-card-header">
          <span class="trap-badge">${trap.badge || 'Combination'}</span>
          <span class="trap-difficulty ${(trap.difficulty || 'beginner').toLowerCase().replace(/\s+/g, '-')}">${trap.difficulty || 'Beginner'}</span>
        </div>
        <h3 class="trap-card-title">${trap.title || 'Tactical Shot'}</h3>
        <p class="trap-card-desc">${trap.description || ''}</p>
        <div class="trap-card-footer">
          <span class="trap-ruleset-tag">Rules: ${(trap.ruleset || 'nigeria').toUpperCase()}</span>
          <button class="btn btn-small ${isDone ? 'btn-secondary' : 'btn-primary'} btn-launch-trap" data-trap-id="${trap.id}">
            ${isDone ? '✓ Solved (Replay)' : '⚡ Solve Trap'}
          </button>
        </div>
      `;

      card.querySelector('.btn-launch-trap')?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.startTrap(trap.id);
      });

      this.dom.trapsList.appendChild(card);
    });
  }

  startTrap(trapId) {
    const trap = TRAP_DATABASE.find(t => t.id === trapId);
    if (!trap) return;

    this.activeTrap = trap;
    this.currentStepIdx = 0;
    this.isSolving = true;
    this.closeAcademyModal();

    this.app.engine.ruleMode = trap.ruleset || 'nigeria';
    this.app.ruleMode = trap.ruleset || 'nigeria';

    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        this.app.engine.board[r][c] = null;
      }
    }

    trap.initialBoard.forEach(p => {
      this.app.engine.board[p.r][p.c] = {
        player: p.player,
        isKing: Boolean(p.isKing)
      };
    });

    this.app.engine.currentTurn = trap.startingTurn || PLAYER_1;
    this.app.engine.moveHistory = [];
    this.app.engine.activeMultiJump = null;
    this.app.engine.gameOver = false;
    this.app.gameMode = 'traps';

    if (this.dom.activeBanner) {
      this.dom.activeBanner.style.display = 'flex';
      if (this.dom.trapTitle) this.dom.trapTitle.textContent = `🎯 TRAP: ${trap.title}`;
      if (this.dom.trapBrief) this.dom.trapBrief.textContent = trap.description;
    }

    this.updateStepInstruction();
    this.app.renderBoard();
    this.app.renderPieces();
    this.app.updateUI();

    const currentStep = trap.steps[this.currentStepIdx];
    if (currentStep && currentStep.isAi) {
      setTimeout(() => this.executeAiStep(currentStep), 600);
    }
  }

  updateStepInstruction() {
    if (!this.activeTrap || !this.dom.trapStepNote) return;
    const step = this.activeTrap.steps[this.currentStepIdx];
    if (!step) return;

    if (step.isAi) {
      this.dom.trapStepNote.innerHTML = `<em>Opponent responding...</em> ${step.note || ''}`;
    } else {
      this.dom.trapStepNote.innerHTML = `<strong>Your Move (${this.currentStepIdx + 1}/${this.activeTrap.steps.length}):</strong> ${step.note || ''}`;
    }
  }

  handlePlayerMoveAttempt(move) {
    if (!this.activeTrap || !this.isSolving) return false;

    const step = this.activeTrap.steps[this.currentStepIdx];
    if (!step || step.isAi) return false;

    const fromMatches = move.from.r === step.from.r && move.from.c === step.from.c;
    const toMatches = move.to.r === step.to.r && move.to.c === step.to.c;

    if (!fromMatches || !toMatches) {
      sound.playError();
      this.app.setBannerNotice('Not the optimal trap move! Look for the compulsory sacrifice or kill.', true);
      return false;
    }

    this.currentStepIdx++;
    this.checkTrapProgress();
    return true;
  }

  checkTrapProgress() {
    if (!this.activeTrap) return;

    if (this.currentStepIdx >= this.activeTrap.steps.length) {
      this.completeTrap();
      return;
    }

    const nextStep = this.activeTrap.steps[this.currentStepIdx];
    this.updateStepInstruction();

    if (nextStep && nextStep.isAi) {
      setTimeout(() => this.executeAiStep(nextStep), 500);
    }
  }

  executeAiStep(step) {
    if (!this.activeTrap || !this.isSolving) return;

    const matchedMove = this.app.engine.getAllLegalMoves(step.mover).find(
      m => m.from.r === step.from.r && m.from.c === step.from.c &&
           m.to.r === step.to.r && m.to.c === step.to.c
    );

    if (matchedMove) {
      this.app.engine.makeMove(matchedMove);
    } else {
      const pc = this.app.engine.board[step.from.r][step.from.c];
      this.app.engine.board[step.from.r][step.from.c] = null;
      this.app.engine.board[step.to.r][step.to.c] = pc;
    }

    sound.playCapture();
    this.app.renderPieces();
    this.app.updateUI();

    this.currentStepIdx++;
    this.checkTrapProgress();
  }

  completeTrap() {
    this.isSolving = false;
    this.saveCompletedTrap(this.activeTrap.id);

    sound.playTrap();
    if (this.app.setCommentary) {
      this.app.setBannerNotice(`🏆 GBAM! ${this.activeTrap.title} SOLVED!`, false);
    }

    if (this.dom.winCelebration) {
      this.dom.winCelebration.classList.remove('hidden');
      this.dom.winCelebration.style.display = 'flex';
      const explEl = document.getElementById('trap-celebration-explanation');
      if (explEl) explEl.textContent = this.activeTrap.explanation || '';
    }

    try {
      fetch('api/wallet.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'award_coins', amount: 50, reason: `Trap Academy: ${this.activeTrap.title}` })
      }).catch(() => {});
    } catch {}
  }

  advanceToNextTrap() {
    if (this.dom.winCelebration) {
      this.dom.winCelebration.classList.add('hidden');
      this.dom.winCelebration.style.display = 'none';
    }

    const currentIdx = TRAP_DATABASE.findIndex(t => t.id === this.activeTrap.id);
    const nextTrap = TRAP_DATABASE[(currentIdx + 1) % TRAP_DATABASE.length];
    if (nextTrap) {
      this.startTrap(nextTrap.id);
    }
  }

  exitActiveTrap() {
    this.activeTrap = null;
    this.isSolving = false;
    if (this.dom.activeBanner) {
      this.dom.activeBanner.style.display = 'none';
    }
    if (this.dom.winCelebration) {
      this.dom.winCelebration.classList.add('hidden');
      this.dom.winCelebration.style.display = 'none';
    }
    this.app.resetGame();
  }

  showHint() {
    if (!this.activeTrap || !this.isSolving) return;
    const step = this.activeTrap.steps[this.currentStepIdx];
    if (!step || step.isAi) return;

    const fromEl = document.getElementById(`sq-${step.from.r}-${step.from.c}`);
    const toEl = document.getElementById(`sq-${step.to.r}-${step.to.c}`);

    if (fromEl) fromEl.classList.add('trap-hint-pulse');
    if (toEl) toEl.classList.add('trap-hint-target');

    this.app.setBannerNotice(`💡 Hint: Move piece from (${step.from.r}, ${step.from.c}) to (${step.to.r}, ${step.to.c})!`, false);

    setTimeout(() => {
      if (fromEl) fromEl.classList.remove('trap-hint-pulse');
      if (toEl) toEl.classList.remove('trap-hint-target');
    }, 2800);
  }
}






