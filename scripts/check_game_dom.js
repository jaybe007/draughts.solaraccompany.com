const fs = require('fs');
const { execSync } = require('child_process');

try {
  console.log('Fetching game.php DOM via Edge headless...');
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const html = execSync(`"${edgePath}" --headless --dump-dom "http://127.0.0.1:8000/game.php"`, { maxBuffer: 50 * 1024 * 1024 }).toString('utf8');
  fs.writeFileSync('scripts/game_dump.html', html, 'utf8');

  const idx = html.indexOf('id="draughts-board"');
  if (idx !== -1) {
    const slice = html.substring(idx, idx + 800);
    console.log('Board snippet:\n', slice);
    const hasSquare = html.includes('board-square');
    const hasPiece = html.includes('piece');
    console.log('has board-square:', hasSquare);
    console.log('has piece:', hasPiece);
  } else {
    console.log('No draughts-board found in DOM!');
  }
} catch (e) {
  console.error('Error fetching DOM:', e.message);
}
