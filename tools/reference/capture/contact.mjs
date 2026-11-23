#!/usr/bin/env node
// Review aid: tiles captured PNGs into contact sheets so many screens can be
// eyeballed at once. Not part of the reference pack itself.
//
//   node capture/contact.mjs <viewport-dir> <out-dir> [--scroll] [--only prefix,prefix] [--cols 8] [--tile 206]
//
// Prints the id of every tile in reading order (left to right, top to bottom).
import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';

const [, , srcDir, outDir, ...rest] = process.argv;
if (!srcDir || !outDir) { console.error('usage: contact.mjs <viewport-dir> <out-dir> [--scroll] [--only a,b] [--cols N] [--tile W] [--rows N]'); process.exit(2); }
const opt = { scroll: rest.includes('--scroll'), cols: 8, tile: 206, rows: 2, only: null };
for (let i = 0; i < rest.length; i++) {
  if (rest[i] === '--cols') opt.cols = +rest[++i];
  if (rest[i] === '--tile') opt.tile = +rest[++i];
  if (rest[i] === '--rows') opt.rows = +rest[++i];
  if (rest[i] === '--only') opt.only = rest[++i].split(',');
}

const ids = fs.readdirSync(srcDir).filter(d => fs.existsSync(path.join(srcDir, d, 'shot.png'))).sort()
  .filter(id => !opt.only || opt.only.some(p => id.startsWith(p)));
const tiles = [];
for (const id of ids) {
  tiles.push({ label: id, file: path.join(srcDir, id, 'shot.png') });
  if (opt.scroll) for (const f of fs.readdirSync(path.join(srcDir, id)).filter(f => /^scroll-\d+\.png$/.test(f)).sort()) tiles.push({ label: `${id}/${f}`, file: path.join(srcDir, id, f) });
}

function shrink(png, w) {
  // box-filter downscale to width w
  const k = png.width / w, h = Math.round(png.height / k);
  const out = new PNG({ width: w, height: h });
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const x0 = Math.floor(x * k), x1 = Math.max(x0 + 1, Math.floor((x + 1) * k)), y0 = Math.floor(y * k), y1 = Math.max(y0 + 1, Math.floor((y + 1) * k));
    let r = 0, g = 0, b = 0, n = 0;
    for (let yy = y0; yy < y1 && yy < png.height; yy++) for (let xx = x0; xx < x1 && xx < png.width; xx++) { const i = (yy * png.width + xx) * 4; r += png.data[i]; g += png.data[i + 1]; b += png.data[i + 2]; n++; }
    const o = (y * w + x) * 4; out.data[o] = r / n; out.data[o + 1] = g / n; out.data[o + 2] = b / n; out.data[o + 3] = 255;
  }
  return out;
}

fs.mkdirSync(outDir, { recursive: true });
const per = opt.cols * opt.rows, gap = 6;
for (let s = 0; s * per < tiles.length; s++) {
  const batch = tiles.slice(s * per, (s + 1) * per);
  const small = batch.map(t => shrink(PNG.sync.read(fs.readFileSync(t.file)), opt.tile));
  const th = Math.max(...small.map(p => p.height));
  const rows = Math.ceil(batch.length / opt.cols);
  const sheet = new PNG({ width: opt.cols * (opt.tile + gap) + gap, height: rows * (th + gap) + gap });
  sheet.data.fill(0x30); for (let i = 3; i < sheet.data.length; i += 4) sheet.data[i] = 255;
  small.forEach((p, i) => PNG.bitblt(p, sheet, 0, 0, p.width, p.height, gap + (i % opt.cols) * (opt.tile + gap), gap + Math.floor(i / opt.cols) * (th + gap)));
  const name = `sheet-${String(s + 1).padStart(2, '0')}.png`;
  fs.writeFileSync(path.join(outDir, name), PNG.sync.write(sheet));
  console.log(`${name}:`);
  for (let r = 0; r < rows; r++) console.log('  row ' + (r + 1) + ': ' + batch.slice(r * opt.cols, (r + 1) * opt.cols).map(t => t.label).join(' | '));
}
