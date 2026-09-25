import fs from 'fs';

const css = fs.readFileSync('images/piece_wide_crown.css', 'utf8');
const matches = [...css.matchAll(/data:image\/svg\+xml;base64,([A-Za-z0-9+/=]+)/g)];

const names = ['man_white.svg', 'king_white.svg', 'man_black.svg', 'king_black.svg'];
matches.forEach((m, idx) => {
  const svg = Buffer.from(m[1], 'base64').toString('utf8');
  fs.writeFileSync(`images/${names[idx]}`, svg);
  console.log(`Saved images/${names[idx]}:`);
  console.log(svg);
});
