const res = await fetch('https://lidraughts.org/training/226');
const html = await res.text();
const linesIdx = html.indexOf('"lines":');
if (linesIdx !== -1) {
  console.log('Lines snippet:', html.slice(linesIdx, linesIdx + 500));
}
