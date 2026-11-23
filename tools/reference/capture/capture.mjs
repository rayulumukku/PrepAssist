#!/usr/bin/env node
// Reference capture for PrepAssist.html.
//
//   node capture/capture.mjs                       full run, both viewports
//   node capture/capture.mjs --viewport android    one viewport
//   node capture/capture.mjs --only quiz           one screen: a capture id (view-quiz), a bare name
//                                                  (quiz, home), a VIEWS/SHEETS key (all its states) or a
//                                                  scenario id; comma list ok; trailing * = prefix match
//   node capture/capture.mjs --list                print every screen id and exit
//   node capture/capture.mjs --jobs 4              parallel pages (default 3)
//   node capture/capture.mjs --out <dir>           write somewhere other than reference/
//   node capture/capture.mjs --no-runtime          skip runtime.json
//   node capture/capture.mjs --missing             only states that have no meta.json yet (resume an interrupted run)
//   node capture/capture.mjs --index-only          just rebuild index.json from what is on disk
//   node capture/capture.mjs --runtime-only        rebuild index.json and runtime.json, capture nothing
//   node capture/capture.mjs --dsf 1 --out <dir>   draft-quality run for tool development only
//                                                  (refused when writing to reference/)
//
// index.json is rebuilt from the meta.json files on disk after every run, so
// partial runs keep it consistent.
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { VIEWPORTS, OUT_ROOT, FIXED_TIME_ISO } from './config.mjs';
import { SCENARIOS, allCaptures } from './screens.mjs';
import { runScenario, preflight, CaptureError } from './engine.mjs';
import { buildIndex } from './index-build.mjs';
import { dumpRuntime } from './runtime.mjs';

function parseArgs(argv) {
  const a = { viewports: Object.keys(VIEWPORTS), only: null, jobs: 3, out: OUT_ROOT, list: false, runtime: true, indexOnly: false };
  for (let i = 2; i < argv.length; i++) {
    const k = argv[i], v = () => { const x = argv[++i]; if (x === undefined) throw new Error(`${k} needs a value`); return x; };
    if (k === '--viewport') { const x = v(); if (!VIEWPORTS[x]) throw new Error(`unknown viewport ${x}`); a.viewports = [x]; }
    else if (k === '--only') a.only = v().split(',').map(s => s.trim()).filter(Boolean);
    else if (k === '--jobs') a.jobs = Math.max(1, +v());
    else if (k === '--out') a.out = path.resolve(v());
    else if (k === '--list') a.list = true;
    else if (k === '--no-runtime') a.runtime = false;
    else if (k === '--index-only') a.indexOnly = true;
    else if (k === '--missing') a.missing = true;
    else if (k === '--runtime-only') { a.indexOnly = true; a.runtimeOnly = true; }
    else if (k === '--dsf') a.dsf = +v();
    else throw new Error(`unknown argument ${k}`);
  }
  return a;
}

function select(only) {
  if (!only) return { scenarios: SCENARIOS, ids: null };
  const ids = new Set();
  const match = (pat, s) => pat.endsWith('*') ? s.startsWith(pat.slice(0, -1)) : s === pat;
  // a pattern selects: a capture id, a scenario id, a bare name (quiz = view-quiz, home = tab-home), or a VIEWS/SHEETS key (all its states)
  const hit = (p, c, sc) => match(p, c.id) || match(p, sc.id) || ['view-', 'sheet-', 'tab-', 'stage-', 'overlay-'].some(k => c.id === k + p) || c.view === p || c.sheet === p;
  const matched = new Set();
  for (const sc of SCENARIOS) for (const st of sc.steps) if (st.capture) {
    for (const p of only) if (hit(p, st.capture, sc)) { ids.add(st.capture.id); matched.add(p); }
  }
  const unknown = only.filter(p => !matched.has(p));
  if (unknown.length) throw new Error(`--only: nothing matches ${unknown.join(', ')} (see --list)`);
  const scenarios = SCENARIOS.filter(sc => sc.steps.some(st => st.capture && ids.has(st.capture.id)));
  return { scenarios, ids };
}

async function pool(items, n, fn) {
  let i = 0; const out = [];
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => { while (i < items.length) { const k = i++; out[k] = await fn(items[k], k); } }));
  return out;
}

const args = parseArgs(process.argv);
if (args.list) {
  for (const c of allCaptures()) console.log(`${c.id.padEnd(34)} ${c.kind.padEnd(8)} ${c.title}   [scenario ${c.scenario}]`);
  console.log(`\n${allCaptures().length} screens/states in ${SCENARIOS.length} scenarios`);
  process.exit(0);
}

// duplicate ids are a definition bug
{ const seen = new Set(); for (const c of allCaptures()) { if (seen.has(c.id)) throw new Error(`duplicate capture id ${c.id}`); seen.add(c.id); } }

if (args.dsf && path.resolve(args.out) === path.resolve(OUT_ROOT)) throw new Error('--dsf is a development aid and may not write into reference/ (use --out)');
const { scenarios, ids } = select(args.only);
const browser = await chromium.launch();
const failures = [];
const started = Date.now();
try {
  if (!args.indexOnly) {
    console.log(`Fixed clock: ${FIXED_TIME_ISO}. Output: ${args.out}`);
    for (const vpName of args.viewports) {
      const vp = args.dsf ? { ...VIEWPORTS[vpName], deviceScaleFactor: args.dsf } : VIEWPORTS[vpName];
      // Network fonts must really be there before anything is captured.
      await preflight(browser, vp);
      console.log(`[${vpName}] font preflight ok (${vp.width}x${vp.height} @${vp.deviceScaleFactor}); ${scenarios.length} scenarios`);
      fs.mkdirSync(path.join(args.out, vpName), { recursive: true });
      let todo = scenarios, onlyIds = ids;
      if (args.missing) {
        const has = id => fs.existsSync(path.join(args.out, vpName, id, 'meta.json'));
        const miss = new Set(allCaptures().filter(c => (!ids || ids.has(c.id)) && !has(c.id)).map(c => c.id));
        todo = scenarios.filter(sc => sc.steps.some(st => st.capture && miss.has(st.capture.id)));
        onlyIds = miss;
        console.log(`[${vpName}] --missing: ${miss.size} state(s) in ${todo.length} scenario(s) to capture`);
      }
      await pool(todo, args.jobs, async sc => {
        try {
          await runScenario(browser, sc, vpName, vp, { outRoot: args.out, only: onlyIds, log: m => console.log(m) });
        } catch (e) {
          const msg = e instanceof CaptureError ? e.message : (e.stack || String(e));
          failures.push({ viewport: vpName, scenario: sc.id, error: msg });
          console.error(`  [${vpName}] FAILED scenario ${sc.id}: ${msg}`);
          if (/^FONTS|^FRAMED/.test(msg)) console.error('  (font/frame guard tripped: nothing was written for that state)');
        }
      });
    }
  }
  const idx = await buildIndex(browser, args.out, { failures });
  console.log(`index.json: ${idx.screens.length} screens; captured android=${idx.counts.android ?? 0} ios=${idx.counts.ios ?? 0}`);
  if (args.runtimeOnly || (args.runtime && !args.only && !args.indexOnly && !args.missing)) { await dumpRuntime(browser, args.out); console.log('runtime.json written'); }
} finally {
  await browser.close();
}
console.log(`done in ${Math.round((Date.now() - started) / 1000)} s; ${failures.length} failed scenario(s)`);
if (failures.length) { for (const f of failures) console.error(`FAILED [${f.viewport}] ${f.scenario}: ${f.error.split('\n')[0]}`); process.exit(1); }
