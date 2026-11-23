#!/usr/bin/env node
// Post-run checks on the reference pack. Run from tools/reference:
//   node capture/verify.mjs [--out <dir>]
// Checks, per viewport: every screen in index.json has its files on disk, PNGs
// decode at the expected pixel size and are not blank, dom.json parses and has
// nodes, html.txt is not empty, no two screens share an identical shot.png
// unless they were captured at the same moment, the font guard data is
// present, and the on-disk folders match index.json exactly.
// Writes <out>/verify-report.json and exits 1 if anything is wrong.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { PNG } from 'pngjs';
import { OUT_ROOT, VIEWPORTS, WEB_FONTS } from './config.mjs';
import { SCENARIOS } from './screens.mjs';

const argv = process.argv.slice(2);
const out = argv.includes('--out') ? path.resolve(argv[argv.indexOf('--out') + 1]) : OUT_ROOT;
const index = JSON.parse(fs.readFileSync(path.join(out, 'index.json'), 'utf8'));
const problems = [], warnings = [];
const sha1 = b => crypto.createHash('sha1').update(b).digest('hex');

// captures taken back to back in one scenario (no step between them) show the same pixels by design
const sameMoment = new Set();
for (const sc of SCENARIOS) for (let i = 1; i < sc.steps.length; i++) if (sc.steps[i].capture && sc.steps[i - 1].capture) { const a = sc.steps[i - 1].capture.id, b = sc.steps[i].capture.id; sameMoment.add(`${a}|${b}`); sameMoment.add(`${b}|${a}`); }

function pngStats(file, vp, dsfOverride) {
  const png = PNG.sync.read(fs.readFileSync(file));
  const counts = new Map(); let n = 0;
  for (let y = 0; y < png.height; y += 4) for (let x = 0; x < png.width; x += 4) { const i = (y * png.width + x) * 4; const k = (png.data[i] << 16) | (png.data[i + 1] << 8) | png.data[i + 2]; counts.set(k, (counts.get(k) || 0) + 1); n++; }
  const top = Math.max(...counts.values());
  return { width: png.width, height: png.height, distinctColours: counts.size, dominantShare: top / n };
}

const report = { generatedAt: new Date().toISOString(), out, viewports: {} };
for (const vpName of Object.keys(VIEWPORTS)) {
  const vp = VIEWPORTS[vpName];
  const vdir = path.join(out, vpName);
  if (!fs.existsSync(vdir)) { warnings.push(`${vpName}: no folder`); continue; }
  const expected = index.screens.filter(s => s.viewports[vpName] && s.viewports[vpName].captured);
  const onDisk = fs.readdirSync(vdir).filter(d => fs.statSync(path.join(vdir, d)).isDirectory());
  const missingDirs = index.screens.filter(s => !s.viewports[vpName] || !s.viewports[vpName].captured).map(s => s.id);
  const extraDirs = onDisk.filter(d => !index.screens.some(s => s.id === d));
  if (missingDirs.length) problems.push(`${vpName}: ${missingDirs.length} screens in index.json were not captured: ${missingDirs.join(', ')}`);
  if (extraDirs.length) problems.push(`${vpName}: folders not in index.json: ${extraDirs.join(', ')}`);

  let files = 0, bytes = 0, pngs = 0;
  const shots = new Map(); const fontsSeen = new Set(); let dsf = null;
  for (const s of expected) {
    const dir = path.join(vdir, s.id);
    const meta = JSON.parse(fs.readFileSync(path.join(dir, 'meta.json'), 'utf8'));
    for (const f of [...meta.files, 'meta.json']) {
      const fp = path.join(dir, f);
      if (!fs.existsSync(fp)) { problems.push(`${vpName}/${s.id}: missing ${f}`); continue; }
      const st = fs.statSync(fp); files++; bytes += st.size;
      if (st.size === 0) problems.push(`${vpName}/${s.id}: ${f} is empty`);
      if (f.endsWith('.png')) {
        pngs++;
        const ps = pngStats(fp);
        if (dsf === null) dsf = ps.width / vp.width;
        const ew = Math.round(vp.width * dsf), eh = Math.round(vp.height * dsf);
        if (Math.abs(ps.width - ew) > 1 || Math.abs(ps.height - eh) > 1) problems.push(`${vpName}/${s.id}/${f}: ${ps.width}x${ps.height}, expected ${ew}x${eh}`);
        if (ps.dominantShare > 0.995 || ps.distinctColours < 8) problems.push(`${vpName}/${s.id}/${f}: looks blank (${ps.distinctColours} colours, ${(ps.dominantShare * 100).toFixed(1)}% one colour)`);
        if (f === 'shot.png') { const h = sha1(fs.readFileSync(fp)); if (!shots.has(h)) shots.set(h, []); shots.get(h).push(s.id); }
      }
    }
    try {
      const dom = JSON.parse(fs.readFileSync(path.join(dir, 'dom.json'), 'utf8'));
      if (!dom.root || !dom.root.tag) problems.push(`${vpName}/${s.id}: dom.json has no root`);
      if (!dom.root.rect || dom.root.rect[2] <= 0 || dom.root.rect[3] <= 0) problems.push(`${vpName}/${s.id}: dom.json root has an empty rect`);
    } catch (e) { problems.push(`${vpName}/${s.id}: dom.json unreadable (${e.message})`); }
    if (fs.existsSync(path.join(dir, 'html.txt')) && fs.readFileSync(path.join(dir, 'html.txt'), 'utf8').trim().length < 20) problems.push(`${vpName}/${s.id}: html.txt is nearly empty`);
    if (!meta.fonts || !meta.fonts.loaded || !meta.fonts.loaded.length) problems.push(`${vpName}/${s.id}: no loaded web fonts recorded`);
    else meta.fonts.loaded.forEach(f => fontsSeen.add(WEB_FONTS.find(w => f.startsWith(w + ' '))));
    if (!meta.fonts.loaded.some(f => f.startsWith('Inter '))) problems.push(`${vpName}/${s.id}: Inter was not loaded`);
    if (meta.rest.settleTimeout) warnings.push(`${vpName}/${s.id}: finite animations still running at capture: ${meta.rest.stillRunning.join(', ')}`);
    if (meta.pageErrors && meta.pageErrors.length) warnings.push(`${vpName}/${s.id}: page errors: ${meta.pageErrors.join(' | ')}`);
    if (meta.failedRequests && meta.failedRequests.length) problems.push(`${vpName}/${s.id}: failed network requests: ${meta.failedRequests.join(' | ')}`);
    if (meta.state.images.some(i => /^https?:/.test(i.src) && !i.naturalWidth)) problems.push(`${vpName}/${s.id}: a remote image did not load`);
  }
  const missingFamilies = WEB_FONTS.filter(f => !fontsSeen.has(f));
  if (expected.length > 50 && missingFamilies.length) problems.push(`${vpName}: font families never seen loaded in any capture: ${missingFamilies.join(', ')}`);
  const dupGroups = [...shots.values()].filter(g => g.length > 1);
  const notSameMoment = dupGroups.filter(g => !g.every((id, i) => i === 0 || sameMoment.has(`${g[i - 1]}|${id}`)));
  // Same first viewport is acceptable only when the states really differ elsewhere: below the fold (other PNGs) or in the DOM.
  const fingerprint = id => { const dir = path.join(vdir, id); return fs.readdirSync(dir).filter(f => f !== 'meta.json' && f !== 'shot.png').sort().map(f => f + ':' + sha1(fs.readFileSync(path.join(dir, f)))).join('|'); };
  const unexpectedDups = [], belowFold = [];
  for (const g of notSameMoment) { const fps = new Set(g.map(fingerprint)); if (fps.size === g.length) belowFold.push(g); else unexpectedDups.push(g); }
  for (const g of unexpectedDups) problems.push(`${vpName}: identical captures (shot.png and everything else) for different screens: ${g.join(' = ')}`);
  for (const g of belowFold) warnings.push(`${vpName}: same shot.png but different DOM / scroll shots (state differs below the fold or outside the first viewport): ${g.join(' = ')}`);
  report.viewports[vpName] = {
    screensCaptured: expected.length, screensInIndex: index.screens.length, files, pngs, bytes, megabytes: +(bytes / 1048576).toFixed(1),
    deviceScaleFactorOnDisk: dsf, identicalShotsBySameMoment: dupGroups.filter(g => !notSameMoment.includes(g)), identicalShotButDifferentDom: belowFold, identicalShotsUnexpected: unexpectedDups,
  };
}
report.problems = problems; report.warnings = warnings;
fs.writeFileSync(path.join(out, 'verify-report.json'), JSON.stringify(report, null, 1));
for (const [k, v] of Object.entries(report.viewports)) console.log(`${k}: ${v.screensCaptured}/${v.screensInIndex} screens, ${v.files} files (${v.pngs} PNG), ${v.megabytes} MB, dsf ${v.deviceScaleFactorOnDisk}`);
console.log(`${warnings.length} warning(s)`); warnings.forEach(w => console.log('  warn: ' + w));
console.log(`${problems.length} problem(s)`); problems.forEach(p => console.log('  PROBLEM: ' + p));
process.exit(problems.length ? 1 : 0);
