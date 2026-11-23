#!/usr/bin/env node
// Guard against hand edits: re-extracts PrepAssist.html into a temp directory
// and fails (exit 1, with a diff) if any generated file in the repo differs,
// is missing, or is a leftover that the extractor no longer produces.
//
//   cd tools/reference && node extract/verify.mjs
//
// mobile/actions.map.json: the owner / native / test fields of each verb are
// filled in by people and are not compared.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { REPO_ROOT } from './lib/paths.mjs';
import { generate } from './lib/generate.mjs';
import { writeFiles, staleFiles } from './extract.mjs';

const ACTIONS = 'mobile/actions.map.json';
const HUMAN_FIELDS = ['owner', 'native', 'test'];

function normalise(rel, text) {
  if (rel !== ACTIONS) return text;
  const data = JSON.parse(text);
  for (const v of data.verbs || []) for (const f of HUMAN_FIELDS) v[f] = null;
  return JSON.stringify(data, null, 2) + '\n';
}

/** A short line diff: the first differing region with a little context. */
function firstDifference(expected, actual) {
  const a = expected.split('\n'), b = actual.split('\n');
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  const clip = s => (s === undefined ? '<end of file>' : s.length > 200 ? s.slice(0, 200) + ` … (${s.length} chars)` : s);
  const out = [`  first difference at line ${i + 1} (generated has ${a.length} lines, repo has ${b.length})`];
  for (let k = Math.max(0, i - 1); k < i; k++) out.push(`    ${k + 1}   ${clip(a[k])}`);
  out.push(`    ${i + 1} - ${clip(a[i])}   <- extracted from the HTML`);
  out.push(`    ${i + 1} + ${clip(b[i])}   <- in the repo`);
  let differing = 0;
  for (let k = 0; k < Math.max(a.length, b.length); k++) if (a[k] !== b[k]) differing++;
  out.push(`  ${differing} line(s) differ in total`);
  return out.join('\n');
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'prepassist-verify-'));
let failed = 0;
try {
  const { files } = await generate();
  writeFiles(files, tmp);
  for (const rel of [...files.keys()].sort()) {
    const fresh = normalise(rel, fs.readFileSync(path.join(tmp, rel), 'utf8'));
    const committed = path.join(REPO_ROOT, rel);
    if (!fs.existsSync(committed)) {
      failed++;
      console.error(`MISSING  ${rel}\n  the extractor produces this file but it is not in the repo`);
      continue;
    }
    const current = normalise(rel, fs.readFileSync(committed, 'utf8'));
    if (fresh !== current) {
      failed++;
      console.error(`DIFFERS  ${rel}\n${firstDifference(fresh, current)}`);
    }
  }
  for (const rel of staleFiles(files, REPO_ROOT)) {
    failed++;
    console.error(`STALE    ${rel}\n  marked as generated but the extractor does not produce it`);
  }
  if (failed) {
    console.error(`\nverify: FAILED. ${failed} generated file(s) do not match PrepAssist.html.`);
    console.error('Generated files are never edited by hand. Run `node extract/extract.mjs` in tools/reference to restore them.');
  } else {
    console.log(`verify: OK. ${files.size} generated files match a fresh extraction of PrepAssist.html.`);
  }
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
process.exit(failed ? 1 : 0);
