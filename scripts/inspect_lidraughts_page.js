const res = await fetch('https://lidraughts.org/training/226');
const html = await res.text();
const idx = html.indexOf('fen');
console.log(html.slice(Math.max(0, idx - 100), Math.min(html.length, idx + 200)));
