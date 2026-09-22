import fs from 'fs';

const openingPath = 'js/opening.js';
let content = fs.readFileSync(openingPath, 'utf8');

const tacticsMethod = fs.readFileSync('scripts/screenshot_tactics_code.js', 'utf8');

// Use regex to replace regardless of CRLF or LF
const targetRegex = /\s*\/\*\*\s*\*\s*🇳🇬 Nigeria Opening Repertoire/;
const match = content.match(targetRegex);
if (match) {
  content = content.replace(match[0], '\n' + tacticsMethod + '\n' + match[0]);
  fs.writeFileSync(openingPath, content, 'utf8');
  console.log('✓ Successfully inserted initScreenshotMasterTactics into js/opening.js!');
} else {
  console.error('Target not found in js/opening.js');
}
