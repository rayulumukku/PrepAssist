// Shared by device-shot.mjs and parity-diff.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const MOBILE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const ROOT = path.resolve(MOBILE, '..');
export const REFERENCE = path.join(ROOT, 'reference');
export const PARITY = path.join(ROOT, 'parity');

/** pngjs and pixelmatch live in tools/reference/node_modules (the reference-capture tooling). */
export async function loadImaging() {
  const nm = path.join(ROOT, 'tools', 'reference', 'node_modules');
  const { PNG } = await import(pathToFileURL(path.join(nm, 'pngjs', 'lib', 'png.js')).href).then(m => m.default ?? m);
  const pixelmatch = (await import(pathToFileURL(path.join(nm, 'pixelmatch', 'index.js')).href)).default;
  return { PNG, pixelmatch };
}

/**
 * Device facts. `scale` is device px per dp/pt. `masks` are the rectangles (device px, from the
 * top-left of the screenshot) that the OS draws over the app in the test mode the shots are taken in
 * (prepassist://insets/zero hides the status bar, so only the bottom gesture pill is left).
 * They are excluded from every comparison.
 *   android  Pixel 7 emulator, 1080 x 2400 @ 2.625 (411.43 x 914.29 dp); gesture pill at x 398-681, y 2364-2373
 *   ios      iPhone 17 simulator, 1206 x 2622 @ 3 (402 x 874 pt); `simctl io screenshot` shows no home
 *            indicator over the app, so nothing is masked
 */
export const DEVICES = {
  android: { scale: 2.625, masks: [{ x: 380, y: 2354, w: 320, h: 30 }] },
  ios: { scale: 3, masks: [] },
};

// Every shot map in scripts/shots/*.json and in any `shots` folder under src/, merged:
// { id: { links, wait, regions, area, file } }.
export function loadShotMaps() {
  const files = [];
  const walk = (dir, depth) => {
    if (!fs.existsSync(dir)) return;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (e.name !== 'node_modules' && depth < 6) walk(p, depth + 1);
      } else if (e.name.endsWith('.json') && path.basename(path.dirname(p)) === 'shots') files.push(p);
    }
  };
  walk(path.join(MOBILE, 'scripts'), 0);
  walk(path.join(MOBILE, 'src'), 0);
  const shots = {};
  for (const f of files.sort()) {
    const j = JSON.parse(fs.readFileSync(f, 'utf8'));
    for (const [id, def] of Object.entries(j.shots ?? {})) {
      if (shots[id]) throw new Error(`shot "${id}" is defined in both ${shots[id].file} and ${f}`);
      shots[id] = { ...def, area: j.area ?? null, file: path.relative(MOBILE, f) };
    }
  }
  return shots;
}

export function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const k = a.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith('--')) out[k] = true;
      else {
        out[k] = next;
        i++;
      }
    } else out._.push(a);
  }
  return out;
}
