async function run() {
  const cssUrls = [
    'https://lidraughts.org/assets/_RXmMq1/css/site.light.min.css',
    'https://lidraughts.org/assets/_RXmMq1/css/puzzle.light.min.css',
    'https://lidraughts.org/assets/_RXmMq1/piece-css/wide_crown.css'
  ];

  for (const url of cssUrls) {
    const res = await fetch(url);
    const css = await res.text();
    console.log(`\n=== ${url} (length: ${css.length}) ===`);
    
    // Look for background-image, url(), .cg-wrap, cg-board, etc.
    const urlMatches = [...css.matchAll(/url\(([^)]+)\)/g)].map(m => m[1]);
    console.log("URLs in CSS:", [...new Set(urlMatches)]);

    // Check for selectors like .wood, .board, piece
    const themeMatches = [...css.matchAll(/[^{}]*(?:board|piece|theme|wood|brown)[^{}]*\{[^}]*\}/gi)].map(m => m[0]);
    console.log("Theme matches count:", themeMatches.length);
    for (const tm of themeMatches.slice(0, 10)) {
      console.log("  Rule:", tm.slice(0, 150));
    }
  }
}
run();
