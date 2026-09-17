import { ProfessionalPuzzleGenerator } from './js/puzzle_generator.js';
import { NigerianDraughtsEngine } from './js/engine.js';
import { rcToSq, sqToRC } from './js/engine50.js';

// Let's inspect the exact squares for COUP-OJUELEGBA-HIGHWAY
// white: [46, 33, 24, 20, 48, 50]
// black: [23, 14, 43, 2, 3]
console.log("Square coordinates check:");
console.log("sq 46:", sqToRC(46));
console.log("sq 33:", sqToRC(33));
console.log("sq 28:", sqToRC(28));
console.log("sq 24:", sqToRC(24));
console.log("sq 19:", sqToRC(19));
console.log("sq 20:", sqToRC(20));
console.log("sq 29:", sqToRC(29));
console.log("sq 38:", sqToRC(38));
console.log("sq 47:", sqToRC(47));

// Notice: White is Player 1.
// 20 is (3, 9)
// 29 is (5, 7) - jumping over (4, 8) which is sq 25!
// 38 is (7, 5) - jumping over (6, 6) which is sq 34!
// 47 is (9, 3) - jumping over (8, 4) which is sq 43!
// But White landing on 47 is Row 9!
// In draughts, Player 1 starts at Rows 6..9 and moves towards Row 0.
// When Player 1 reaches Row 0 (squares 1..5), Player 1 crowns!
// Landing on Row 9 (square 47) is Player 1's OWN back row! A White man landing on 47 does NOT crown!
// If White is to crown, White must land on Row 0 (squares 1, 2, 3, 4, or 5)!
