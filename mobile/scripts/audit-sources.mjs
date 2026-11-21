#!/usr/bin/env node
// Two-rule audit (IMPLEMENTATION_PLAN.md section 2).
// Every UI file must name the PrepAssist.html lines it ports, and no route placeholder may remain.
//   node scripts/audit-sources.mjs            fails on missing/invalid Source headers
//   node scripts/audit-sources.mjs --final    also fails if any @placeholder remains
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const htmlPath = path.resolve(root, '..', 'PrepAssist.html');
const htmlLines = fs.readFileSync(htmlPath, 'utf8').split('\n').length;
const UI_DIRS = ['src/components', 'src/screens', 'src/sheets', 'src/illustrations', 'src/navigation'];
const final = process.argv.includes('--final');
const HEADER = /\/\/ Source: PrepAssist\.html L(\d+)(?:-L?(\d+))?/g;

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.tsx$/.test(e.name) && !/\.test\.tsx$/.test(e.name)) out.push(p);
  }
  return out;
}

const problems = [];
const placeholders = [];
let checked = 0;
for (const d of UI_DIRS) {
  for (const file of walk(path.join(root, d))) {
    checked++;
    const rel = path.relative(root, file);
    const text = fs.readFileSync(file, 'utf8');
    if (text.includes('@placeholder')) placeholders.push(rel);
    const head = text.split('\n').slice(0, 25).join('\n');
    const refs = [...head.matchAll(HEADER)];
    if (!refs.length) {
      problems.push(`${rel}: no "// Source: PrepAssist.html L<from>-L<to>" header in the first 25 lines`);
      continue;
    }
    for (const m of refs) {
      const from = +m[1];
      const to = m[2] ? +m[2] : from;
      if (from < 1 || to > htmlLines || from > to) {
        problems.push(`${rel}: Source range L${from}-L${to} is outside PrepAssist.html (1-${htmlLines})`);
      }
    }
  }
}

console.log(`audit-sources: ${checked} UI files checked, ${placeholders.length} placeholder(s) remaining`);
if (placeholders.length) console.log(placeholders.map(p => `  placeholder: ${p}`).join('\n'));
if (problems.length) console.error(problems.map(p => `  FAIL ${p}`).join('\n'));
const failed = problems.length > 0 || (final && placeholders.length > 0);
process.exit(failed ? 1 : 0);
