// One-off: remove the white photo background from the name-tag scan.
// Flood-fills inward from every edge pixel, turning connected light/low-saturation
// pixels transparent. The red embroidered border fully encloses the inner white
// label, so the label (with the signature) is preserved.
import { Jimp } from 'jimp';

const SRC = 'Fig1.jpg';
const OUT = 'public/sketches/tag.png';

const img = await Jimp.read(SRC);
const { width, height, data } = img.bitmap;

const isBackgroundish = (i) => {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  // bright + low saturation = white paper / soft shadow / anti-alias halo
  return min > 175 && max - min < 60;
};

const idx = (x, y) => (y * width + x) * 4;
const visited = new Uint8Array(width * height);
const stack = [];

// Seed from all four edges.
for (let x = 0; x < width; x += 1) {
  stack.push([x, 0]);
  stack.push([x, height - 1]);
}
for (let y = 0; y < height; y += 1) {
  stack.push([0, y]);
  stack.push([width - 1, y]);
}

while (stack.length) {
  const [x, y] = stack.pop();
  if (x < 0 || y < 0 || x >= width || y >= height) continue;
  const p = y * width + x;
  if (visited[p]) continue;
  visited[p] = 1;
  const i = idx(x, y);
  if (!isBackgroundish(i)) continue;
  data[i + 3] = 0; // transparent
  stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
}

await img.write(OUT);
console.log(`wrote ${OUT} (${width}x${height})`);
