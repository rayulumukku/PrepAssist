#!/usr/bin/env node
// Writes mobile/OWNERSHIP.json: every reference id -> workstream (or `shell`), and every route,
// sheet and overlay key -> file -> workstream. Re-run when the reference pack changes.
//   node scripts/gen-ownership.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const MOBILE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ROOT = path.resolve(MOBILE, '..');
const idx = JSON.parse(fs.readFileSync(path.join(ROOT, 'reference', 'index.json'), 'utf8'));
const actions = JSON.parse(fs.readFileSync(path.join(MOBILE, 'actions.map.json'), 'utf8'));
const pascal = s => s[0].toUpperCase() + s.slice(1);

const VIEW_AREA = {
  quiz: 'practice', qbank: 'practice', pqb: 'practice', testquiz: 'practice', engine: 'practice', tests: 'practice', history: 'practice', mains: 'practice', mainsResult: 'practice', answerbank: 'practice', answer: 'practice', pastevals: 'practice',
  lesson: 'study', courses: 'study', course: 'study', note: 'study', mindmap: 'study', mindmaps: 'study', calendar: 'study', plan: 'study', article: 'study', saved: 'study',
  noteshub: 'library', notesys: 'library', note2: 'library', tracker: 'library', folder: 'library', ntNote: 'library', xrayhome: 'library', xray: 'library', syllabus: 'library', upload: 'library', cloud: 'library', querydb: 'library',
  account: 'account', wallet: 'account', payments: 'account', upgrade: 'account', settings: 'account', status: 'account', legal: 'account', onestep: 'account',
};
const SHEET_AREA = {
  credits: 'account', revisions: 'tabs', forgot: 'arrival', changeEmail: 'arrival', account: 'account', prefs: 'account', language: 'account', subscription: 'account', payments: 'account', settings: 'account', privacy: 'account', coverage: 'tabs', allTools: 'tabs', upload: 'library', ledger: 'account', lowCredits: 'account', delAsk: 'account',
  mentor: 'study', search: 'study', editionCalendar: 'study', currentFilter: 'tabs', purchase: 'account', pqbAttempts: 'practice', syllabusTopic: 'library', syllabusFilter: 'library', savedAddLink: 'study', cloudDelete: 'library', trackerSplitPdf: 'library', trackerNewFolder: 'library', trackerOptional: 'library', xrayInsight: 'library', xrayTerm: 'library', noteNew: 'library', noteUpdates: 'library', trackerInbox: 'library',
};
// reference ids of sheets the HTML builds inline (no SHEETS key) -> our sheet key
const ADHOC = [
  [/^sheet-mentor/, 'mentor'], [/^sheet-search/, 'search'], [/^sheet-edition-calendar/, 'editionCalendar'], [/^sheet-current-filter/, 'currentFilter'],
  [/^sheet-purchase/, 'purchase'], [/^sheet-pqb-attempts/, 'pqbAttempts'], [/^sheet-syllabus-topic/, 'syllabusTopic'], [/^sheet-syllabus-filter/, 'syllabusFilter'],
  [/^sheet-saved-add-link/, 'savedAddLink'], [/^sheet-cloud-delete/, 'cloudDelete'], [/^sheet-tracker-split-pdf/, 'trackerSplitPdf'], [/^sheet-tracker-new-folder/, 'trackerNewFolder'],
  [/^sheet-tracker-optional/, 'trackerOptional'], [/^sheet-xray-insight/, 'xrayInsight'], [/^sheet-xray-term/, 'xrayTerm'], [/^sheet-note-new/, 'noteNew'],
  [/^sheet-note-updates/, 'noteUpdates'], [/^sheet-tracker-inbox/, 'trackerInbox'],
];
const sheetKeyOf = e => e.sheet || (ADHOC.find(([re]) => re.test(e.id)) || [])[1] || null;

function refOwner(e) {
  if (e.kind === 'stage') return { area: 'arrival', route: 'stage:' + e.id.split('-')[1] };
  if (e.kind === 'tab') return { area: 'tabs', route: 'tab:' + e.id.split('-')[1] };
  if (e.kind === 'view') return { area: VIEW_AREA[e.view], route: 'view:' + e.view };
  if (e.kind === 'sheet') { const k = sheetKeyOf(e); return { area: SHEET_AREA[k], route: 'sheet:' + k }; }
  if (/^overlay-(ask|toast)/.test(e.id)) return { area: 'shell', route: e.id.startsWith('overlay-toast') ? 'shell:toast' : 'shell:ask' };
  if (/^overlay-reel/.test(e.id)) return { area: 'tabs', route: 'overlay:reel' };
  if (/^overlay-plan-magic/.test(e.id)) return { area: 'account', route: 'overlay:planMagic' };
  // kind "state": tab-home-hero-*, tab-home-flashcard-*, tab-profile-hi-toast, tab-learn-note-saved-toast
  if (e.kind === 'state' && e.id.startsWith('tab-')) return { area: 'tabs', route: 'tab:' + e.id.split('-')[1] };
  return { area: null, route: null };
}

const routes = { stages: {}, tabs: {}, views: {}, sheets: {}, overlays: {} };
const put = (group, key, file, area) => {
  if (!fs.existsSync(path.join(MOBILE, file))) throw new Error(`missing file for ${group}.${key}: ${file}`);
  const placeholder = fs.readFileSync(path.join(MOBILE, file), 'utf8').includes('@placeholder');
  routes[group][key] = { file, area, placeholder };
};
for (const s of ['book', 'intro', 'auth', 'verify']) put('stages', s, `src/screens/arrival/${pascal(s)}Stage.tsx`, 'arrival');
routes.stages.app = { file: 'src/shell/StageHost.tsx', area: 'shell', placeholder: false };
for (const t of ['home', 'learn', 'practice', 'current', 'menu', 'profile']) put('tabs', t, `src/screens/tabs/${pascal(t)}Tab.tsx`, 'tabs');
for (const [v, a] of Object.entries(VIEW_AREA)) put('views', v, `src/screens/${a}/${pascal(v)}Screen.tsx`, a);
for (const [k, a] of Object.entries(SHEET_AREA)) put('sheets', k, `src/sheets/${a}/${pascal(k)}Sheet.tsx`, a);
put('overlays', 'reel', 'src/screens/tabs/ReelViewerOverlay.tsx', 'tabs');
put('overlays', 'planMagic', 'src/screens/account/PlanMagicOverlay.tsx', 'account');

const reference = {};
const unowned = [];
for (const e of idx.screens) {
  const o = refOwner(e);
  if (!o.area) unowned.push(e.id);
  reference[e.id] = { area: o.area, route: o.route, kind: e.kind };
}
if (unowned.length) throw new Error('reference ids without an owner: ' + unowned.join(', '));

const count = obj => Object.values(obj).reduce((m, v) => ((m[v.area] = (m[v.area] || 0) + 1), m), {});
const verbs = {};
for (const v of actions.verbs) verbs[v.verb] = v.owner;

const out = {
  $comment: [
    'GENERATED by scripts/gen-ownership.mjs. Who owns what in Phase 2.',
    'A workstream edits only: the files listed for it under routes, private sub-components in the same folders (src/screens/<area>/, src/sheets/<area>/), src/store/slices/<area>.ts, src/actions/<area>.ts, its tests and its shot map (src/screens/<area>/shots/*.json).',
    'Everything else (src/theme, src/components, src/shell, src/navigation, src/store/index.ts, src/store/slices/base.ts, src/actions/index.ts|base.ts|types.ts, src/data, src/i18n, src/icons, scripts, config) is shell-owned and frozen.',
    'reference: the 286 ids of reference/index.json -> the workstream that must make the app match it. Chrome visible in a capture (tab bar, Ask button, toast, sheet frame, page header) is always shell.',
  ],
  areas: ['arrival', 'tabs', 'practice', 'study', 'library', 'account'],
  ownedPaths: Object.fromEntries(['arrival', 'tabs', 'practice', 'study', 'library', 'account'].map(a => [a, [`src/screens/${a}/**`, `src/sheets/${a}/**`, `src/store/slices/${a}.ts`, `src/actions/${a}.ts`]])),
  counts: { reference: { total: idx.screens.length, byArea: count(reference) }, views: count(routes.views), sheets: count(routes.sheets), verbs: Object.values(verbs).reduce((m, o) => ((m[o] = (m[o] || 0) + 1), m), {}) },
  routes,
  reference,
  verbs,
};
fs.writeFileSync(path.join(MOBILE, 'OWNERSHIP.json'), JSON.stringify(out, null, 2) + '\n');
console.log('OWNERSHIP.json:', JSON.stringify(out.counts));
