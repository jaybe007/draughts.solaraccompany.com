async function fetchLidraughtsPuzzle(id) {
  const url = `https://lidraughts.org/training/${id}`;
  const res = await fetch(url);
  const html = await res.text();
  
  // Extract the JSON data blob
  // Look for "data-puzzle=" or embedded JSON in the script tag
  const fenMatch = html.match(/"fen":"([^"]+)"/);
  const colorMatch = html.match(/"color":"([^"]+)"/);
  const ratingMatch = html.match(/"rating":(\d+)/);
  const linesMatch = html.match(/"lines":({.+?}),"initialPly"/);
  
  if (!fenMatch) {
    console.error(`Failed to find fen for puzzle ${id}`);
    return null;
  }
  
  return {
    id,
    fen: fenMatch[1],
    color: colorMatch ? colorMatch[1] : 'white',
    rating: ratingMatch ? parseInt(ratingMatch[1], 10) : 2000,
    linesRaw: linesMatch ? linesMatch[1] : null
  };
}

const p = await fetchLidraughtsPuzzle(226);
console.log('Puzzle 226 data:', p);
