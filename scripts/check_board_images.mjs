import fs from 'fs';

console.log("Checking board images...");
const originalExists = fs.existsSync('images/board/wood-1024_100.jpg');
const mirroredExists = fs.existsSync('images/board/wood-1024_100_mirrored.jpg');
console.log("wood-1024_100.jpg exists:", originalExists);
console.log("wood-1024_100_mirrored.jpg exists:", mirroredExists);
if (originalExists) {
  const stat = fs.statSync('images/board/wood-1024_100.jpg');
  console.log("Original file size:", stat.size);
}
