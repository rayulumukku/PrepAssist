#!/usr/bin/env node
// Compare device screenshots (parity/<platform>/<id>/shot.png) with the reference pack
// (reference/<platform>/<id>/shot.png). Writes parity/<platform>/<id>/diff[-<region>].png and
// diff.json, and prints one score per region.
//
//   node scripts/parity-diff.mjs --platform android --ids tab-home,overlay-toast
//   node scripts/parity-diff.mjs --platform ios --all
//   node scripts/parity-diff.mjs --platform android --ids tab-home --region nav
//   node scripts/parity-diff.mjs --platform android --ids view-lesson --region 0,0,412,60        (x,y,w,h in CSS px, from the top-left)
//   node scripts/parity-diff.mjs --platform android --ids sheet-language --region b:0,286,412,72  (b: = y measured UP from the bottom edge)
//   … --region 'b:0,286.27,412,72>b:96'   the region starts 286.27 px above the bottom in the reference but 96 px above it on the device
//
// HOW THE TWO IMAGES ARE PUT ON ONE GRID
//   Nothing is resampled. Both images are in device pixels at the same scale (android 2.625, ios 3),
//   so a CSS px in the reference is the same number of device px on the device.
//   ios: reference 1206 x 2622 = device 1206 x 2622. Identical grids.
//   android: the reference viewport is 412 x 915 CSS px (1082 x 2402 px after rounding up), the Pixel 7
//   is 1080 x 2400 px = 411.43 x 914.29 dp. The device is therefore 0.57 dp narrower and 0.71 dp
//   shorter than the reference viewport, and the app lays itself out in that slightly smaller box.
//   A region is compared ANCHORED to the edges its content is attached to:
//     top-left     for the full frame and for anything positioned from the top (headers, page content)
//     bottom-left  for anything positioned from the bottom (tab bar, Ask button, toast, sheets):
//                  the reference's 2 extra rows are skipped at the top instead of the bottom
//   so a bottom bar is compared with the same bar, not with a copy shifted by 2 px. Elements that span
//   the full width are 1.5 px narrower on the android device; that sub-pixel difference is real, small,
//   and shows up as thin lines at right edges and at column boundaries (the 6 tab columns).
//
// SAFE AREAS
//   Shots are taken with prepassist://insets/zero: --sat/--sab are 0 as in the reference capture (where
//   env(safe-area-inset-*) was 0) and the OS status bar is hidden, so the app is laid out and drawn
//   exactly like the browser viewport, top row included. The only thing the OS still draws over the
//   app is the gesture pill / home indicator at the bottom; that rectangle (DEVICES[platform].masks)
//   is excluded from every comparison and painted grey in the diff image. Rendering with the real
//   insets (prepassist://insets/device) has no reference to compare with and is checked by eye.
//
// SCORE
//   pixelmatch with threshold 0.1 (anti-aliased pixels are detected and not counted).
//   score = differing pixels / compared pixels, in percent. 0 = identical.
//   Text is rasterised by different engines (Skia/CoreText vs Chromium on macOS), so glyph edges always
//   differ a little; treat the score as a pointer and LOOK at the diff image.
import fs from 'node:fs';
import path from 'node:path';
import { DEVICES, PARITY, REFERENCE, loadImaging, loadShotMaps, parseArgs } from './lib-parity.mjs';

/** Named regions in CSS px. `from: 'bottom'` = y is the distance of the region's top edge from the bottom edge. */
export const REGIONS = {
  full: { from: 'top', x: 0, y: 0, w: null, h: null },
  // .nav: 64 px bar at the bottom (PrepAssist.html L2257)
  nav: { from: 'bottom', x: 0, y: 64, w: null, h: 64 },
  // #ask: right 16 px, bottom 78 px, 46 px high. Full is 163.5 px wide, mini 46 px. A 6 px margin is
  // included; the shadow below is left out because it lies over the tab content.
  askFull: { from: 'bottom', x: 226, y: 130, w: 180, h: 58 },
  askMini: { from: 'bottom', x: 344, y: 130, w: 62, h: 58 },
  // .toast: bottom 140 px, at most half the width, centred
  toast: { from: 'bottom', x: 95, y: 228, w: 222, h: 96 },
  // .ph page header: top 60 px
  header: { from: 'top', x: 0, y: 0, w: null, h: 60 },
};

function parseRegion(spec) {
  if (REGIONS[spec]) return { name: spec, ...REGIONS[spec] };
  // x,y,w,h | b:x,y,w,h, optionally followed by >y or >b:y = where the same region starts ON THE DEVICE
  // when it is not at the same place as in the reference (a placeholder sheet is shorter than the real one).
  const m = /^(b:)?(-?[\d.]+),(-?[\d.]+),([\d.]+),([\d.]+)(?:>(b:)?(-?[\d.]+))?$/.exec(spec);
  if (!m) throw new Error(`unknown region "${spec}" (names: ${Object.keys(REGIONS).join(', ')}; or x,y,w,h; or b:x,y,w,h; either with >y or >b:y for the device)`);
  const r = { name: spec.replace(/[:,>]/g, '_'), from: m[1] ? 'bottom' : 'top', x: +m[2], y: +m[3], w: +m[4], h: +m[5] };
  if (m[7] !== undefined) r.dev = { from: m[6] ? 'bottom' : 'top', y: +m[7] };
  return r;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.platform && DEVICES[args._[0]]) {
    args.platform = args._.shift();
    if (args._.length && !args.ids) args.ids = args._.join(',');
  }
  const platform = args.platform;
  if (!DEVICES[platform]) {
    console.error('usage: parity-diff.mjs --platform android|ios (--ids a,b | --all) [--region <name|x,y,w,h|b:x,y,w,h>]');
    process.exit(2);
  }
  const dev = DEVICES[platform];
  const { PNG, pixelmatch } = await loadImaging();
  const shots = loadShotMaps();
  const dir = path.join(PARITY, platform);
  let ids;
  if (args.all) ids = fs.existsSync(dir) ? fs.readdirSync(dir).filter(d => fs.existsSync(path.join(dir, d, 'shot.png'))) : [];
  else ids = String(args.ids || '').split(',').map(s => s.trim()).filter(Boolean);
  if (!ids.length) {
    console.error('no ids');
    process.exit(2);
  }
  const read = f => PNG.sync.read(fs.readFileSync(f));
  let bad = 0;
  for (const id of ids) {
    const refFile = path.join(REFERENCE, platform, id, 'shot.png');
    const devFile = path.join(dir, id, 'shot.png');
    if (!fs.existsSync(refFile) || !fs.existsSync(devFile)) {
      console.error(`  MISSING ${id}: ${!fs.existsSync(refFile) ? refFile : devFile}`);
      bad++;
      continue;
    }
    const ref = read(refFile);
    const shot = read(devFile);
    const specs = args.region ? String(args.region).split(';') : ['full', ...(shots[id]?.regions ?? [])];
    const results = [];
    for (const spec of specs) {
      const r = parseRegion(spec);
      const px = v => Math.round(v * dev.scale);
      const w = Math.min(r.w === null ? Infinity : px(r.w), ref.width - px(r.x), shot.width - px(r.x));
      const hWanted = r.h === null ? Infinity : px(r.h);
      // top of the region in each image
      const refTop = r.from === 'bottom' ? ref.height - px(r.y) : px(r.y);
      const d = r.dev ?? r;
      const shotTop = d.from === 'bottom' ? shot.height - px(d.y) : px(d.y);
      const h = Math.min(hWanted, ref.height - refTop, shot.height - shotTop);
      const x0 = px(r.x);
      const a = new PNG({ width: w, height: h });
      const b = new PNG({ width: w, height: h });
      let masked = 0;
      for (let y = 0; y < h; y++) {
        const sy = shotTop + y;
        for (let x = 0; x < w; x++) {
          const o = (y * w + x) * 4;
          const sx = x0 + x;
          if (dev.masks.some(m => sx >= m.x && sx < m.x + m.w && sy >= m.y && sy < m.y + m.h)) {
            a.data[o] = a.data[o + 1] = a.data[o + 2] = b.data[o] = b.data[o + 1] = b.data[o + 2] = 128;
            a.data[o + 3] = b.data[o + 3] = 255;
            masked++;
            continue;
          }
          const ro = ((refTop + y) * ref.width + x0 + x) * 4;
          const so = (sy * shot.width + x0 + x) * 4;
          for (let k = 0; k < 4; k++) {
            a.data[o + k] = ref.data[ro + k];
            b.data[o + k] = shot.data[so + k];
          }
        }
      }
      const out = new PNG({ width: w, height: h });
      const n = pixelmatch(a.data, b.data, out.data, w, h, { threshold: 0.1, includeAA: false });
      const compared = w * h - masked;
      const score = compared ? (100 * n) / compared : 0;
      const name = r.name === 'full' ? 'diff.png' : `diff-${r.name}.png`;
      fs.writeFileSync(path.join(dir, id, name), PNG.sync.write(out));
      // side by side: reference | device | diff, for looking at
      const sbs = new PNG({ width: w * 3 + 8, height: h });
      sbs.data.fill(255);
      [a, b, out].forEach((img, i) => PNG.bitblt(img, sbs, 0, 0, w, h, i * (w + 4), 0));
      fs.writeFileSync(path.join(dir, id, name.replace('diff', 'sbs')), PNG.sync.write(sbs));
      results.push({ region: r.name, anchor: r.from, widthPx: w, heightPx: h, maskedPx: masked, differingPx: n, scorePct: +score.toFixed(3) });
      console.log(`  ${platform}/${id}  ${r.name.padEnd(8)} ${score.toFixed(2).padStart(6)} %  (${n} of ${compared} px)  -> parity/${platform}/${id}/${name.replace('diff', 'sbs')}`);
    }
    fs.writeFileSync(path.join(dir, id, 'diff.json'), JSON.stringify({ id, platform, reference: { w: ref.width, h: ref.height }, device: { w: shot.width, h: shot.height }, results }, null, 1));
  }
  process.exit(bad ? 1 : 0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
