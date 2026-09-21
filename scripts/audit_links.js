const fs = require('fs');

const files = ['dashboard.php', 'admin.php', 'index.php', 'game.php', 'puzzles.php'];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  const content = fs.readFileSync(file, 'utf8');
  const regex = /<(a|button)\b([^>]*)>(.*?)<\/\1>/gis;
  let match;
  console.log('========================================');
  console.log('FILE: ' + file);
  console.log('========================================');
  let count = 0;
  while ((match = regex.exec(content)) !== null) {
    count++;
    const tag = match[1];
    const attrs = match[2];
    const inner = match[3].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const lInner = inner.toLowerCase();
    if (lInner.includes('message') || 
        lInner.includes('fund') || 
        lInner.includes('wallet') || 
        lInner.includes('tournament') ||
        lInner.includes('deposit') ||
        lInner.includes('withdraw') ||
        lInner.includes('naira') ||
        lInner.includes('host') ||
        lInner.includes('game') ||
        lInner.includes('action')) {
      console.log(`[${tag.toUpperCase()}] "${inner.substring(0, 50)}" => ${attrs.trim().substring(0, 90)}`);
    }
  }
  console.log(`Total buttons/links: ${count}\n`);
}
