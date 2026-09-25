import fs from 'fs';
import path from 'path';

async function downloadAssets() {
  const images = [
    'wood2_100.jpg',
    'wood3_100.jpg',
    'wood-1024_100.jpg',
    'maple_100.jpg'
  ];

  const base = 'https://lidraughts.org/assets/_RXmMq1/images/board/';
  const outDir = 'images/board';
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  for (const img of images) {
    const url = base + img;
    console.log(`Downloading ${url}...`);
    try {
      const res = await fetch(url);
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        fs.writeFileSync(path.join(outDir, img), Buffer.from(buffer));
        console.log(`Saved ${img} (${buffer.byteLength} bytes)`);
      } else {
        console.log(`Failed to fetch ${img}: status ${res.status}`);
      }
    } catch (e) {
      console.error(`Error downloading ${img}:`, e.message);
    }
  }

  // Also download piece CSS and decode the SVGs
  const pRes = await fetch('https://lidraughts.org/assets/_RXmMq1/piece-css/wide_crown.css');
  const pCss = await pRes.text();
  fs.writeFileSync('images/piece_wide_crown.css', pCss);
  console.log("Saved wide_crown.css");

  // Also check what other piece sets Lidraughts has!
  const pieceThemes = ['wide_crown', 'standard', 'classic', 'simple', 'puck'];
  for (const pt of pieceThemes) {
    try {
      const r = await fetch(`https://lidraughts.org/assets/_RXmMq1/piece-css/${pt}.css`);
      if (r.ok) {
        const text = await r.text();
        fs.writeFileSync(`images/piece_${pt}.css`, text);
        console.log(`Found piece theme: ${pt} (${text.length} bytes)`);
      }
    } catch {}
  }
}

downloadAssets();
