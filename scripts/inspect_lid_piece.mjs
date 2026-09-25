import fs from 'fs';

async function checkLidraughtsPieceCSS() {
  const res = await fetch('https://lidraughts.org/assets/_RXmMq1/css/site.light.min.css');
  const css = await res.text();
  const rules = [...css.matchAll(/[^{};]*piece[^{};]*\{[^}]*\}/gi)].map(m => m[0]);
  console.log("Found piece rules in Lidraughts site CSS:", rules.length);
  for (const r of rules.slice(0, 20)) {
    console.log(r);
  }
}

checkLidraughtsPieceCSS().catch(console.error);
