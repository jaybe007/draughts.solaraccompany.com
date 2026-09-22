import { sqToRC } from '../js/engine50.js';

const squares = [35, 40, 45, 50, 44, 43, 47, 39, 29];
for (const sq of squares) {
  const { r, c } = sqToRC(sq, false); // Nigerian isRightToLeft = false
  console.log(`Square ${sq}: row ${r}, col ${c}`);
}
