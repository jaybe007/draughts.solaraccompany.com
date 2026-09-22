import fs from 'fs';

const PUZZLE_IDS = [
  226, 227, 228, 229, 230, 232, 235, 236, 238, 248,
  250, 251, 252, 254, 255, 256, 258, 260, 264, 265
];

async function checkBranchRoot(id) {
  const url = `https://lidraughts.org/training/${id}`;
  const res = await fetch(url);
  const html = await res.text();

  const branchIdx = html.indexOf('"branch":');
  let branchStr = html.slice(branchIdx + 9);
  let depth = 0, endIdx = -1;
  for (let i = 0; i < branchStr.length; i++) {
    if (branchStr[i] === '{') depth++;
    else if (branchStr[i] === '}') {
      depth--;
      if (depth === 0) { endIdx = i + 1; break; }
    }
  }
  const branch = JSON.parse(branchStr.slice(0, endIdx));
  console.log(`Puzzle ${id}: branch root san = ${branch.san}, uci = ${branch.uci}`);
}

for (const id of [226, 227, 228, 229, 230]) {
  await checkBranchRoot(id);
}
