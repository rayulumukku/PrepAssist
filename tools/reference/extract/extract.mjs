#!/usr/bin/env node
// Extracts every piece of content from PrepAssist.html into generated files.
//
//   cd tools/reference
//   node extract/extract.mjs            write into the repo
//   node extract/extract.mjs --out-root <dir>   write the same tree under <dir>
//
// Nothing is retyped: values are read from the page running in headless
// Chromium (see lib/runtime.mjs), or, for literals inside functions, by
// evaluating the exact source slice (see lib/inline.mjs).
//
// Writes:
//   mobile/src/data/*.ts                       typed data modules, initial state, markers, barrel
//   mobile/src/i18n/strings.ts                 the I18N table
//   mobile/src/icons/iconPaths.generated.ts    every <symbol>
//   mobile/actions.map.json                    every data-act verb (owner / native / test are kept)
//   mobile/__tests__/data/                     snapshot.json + the Jest guard
//   tools/reference/extract/out/*.json         markup inventory, bindings, inline literals, report
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { REPO_ROOT } from './lib/paths.mjs';
import { generate } from './lib/generate.mjs';

export function writeFiles(files, root) {
  for (const [rel, content] of files) {
    const abs = path.join(root, rel);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, content);
  }
}

/** Generated files of an earlier run that this run no longer produces. */
export function staleFiles(files, root) {
  const dirs = ['mobile/src/data', 'mobile/src/i18n', 'mobile/src/icons', 'mobile/__tests__/data', 'tools/reference/extract/out'];
  const stale = [];
  for (const dir of dirs) {
    const abs = path.join(root, dir);
    if (!fs.existsSync(abs)) continue;
    for (const name of fs.readdirSync(abs)) {
      const rel = `${dir}/${name}`;
      if (files.has(rel) || !fs.statSync(path.join(abs, name)).isFile()) continue;
      const generated = dir.endsWith('/out') || name === 'snapshot.json' || fs.readFileSync(path.join(abs, name), 'utf8').startsWith('// GENERATED from PrepAssist.html');
      if (generated) stale.push(rel);
    }
  }
  return stale;
}

function printReport(report) {
  const b = report.bindings;
  console.log(`\nBindings found: ${b.total}  (` + Object.entries(b.byClass).map(([k, v]) => `${k} ${v}`).join(', ') + ')');
  console.log(`const declarations holding a value (not a function): ${b.constNonFunction}; exported: ${b.constExported}`);
  for (const c of b.constNotExported) console.log(`  not exported: ${c.key} ${c.source} [${c.class}] ${c.reason}`);
  const byModule = {};
  for (const m of report.modules) (byModule[m.module] ||= []).push(`${m.export}${m.count === null ? '' : `(${m.count})`}`);
  console.log('\nModules:');
  for (const [mod, list] of Object.entries(byModule)) console.log(`  ${mod}: ${list.join(', ')}`);
  console.log(`  mobile/src/data/initialState.ts: ${report.initialState.count} fields of S`);
  console.log(`  mobile/src/i18n/strings.ts: ${report.i18n.langs.join(' + ')}, ${report.i18n.keys} keys`);
  console.log(`\nIcons: ${report.icons.count} (${Object.entries(report.icons.byOrigin).map(([k, v]) => `${k} ${v}`).join(', ')}); view-template symbols: ${report.icons.illustrationSymbols.join(', ') || 'none'}; issues: ${report.icons.issues.length}`);
  console.log(`Actions: ${report.actions.verbs} verbs; without handler: ${report.actions.verbsWithoutHandler.length}; handlers never referenced: ${report.actions.unreferencedHandlers.length}; dynamic sites: ${report.actions.dynamicSites}`);
  console.log(`Markup: ${report.markup.strings} strings, ${report.markup.stringsWithMarkup} with markup, ${report.markup.distinctTags} tags, ${report.markup.distinctClasses} classes, ${report.markup.distinctEntities} entities`);
  console.log(`Environment-derived values: ${report.envDerived.count}; functions inside data: ${report.functionsInData.length}; inline literals: ${report.inlineLiterals.exported}/${report.inlineLiterals.found} exported`);
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const i = process.argv.indexOf('--out-root');
  const root = i > 0 ? path.resolve(process.argv[i + 1]) : REPO_ROOT;
  const { files, report } = await generate({ log: m => console.log(m) });
  writeFiles(files, root);
  const stale = staleFiles(files, root);
  for (const rel of stale) fs.rmSync(path.join(root, rel));
  printReport(report);
  console.log(`\nWrote ${files.size} files under ${root}` + (stale.length ? `; removed ${stale.length} stale generated file(s): ${stale.join(', ')}` : ''));
}
