// Extraction settings. This file holds placement and documentation only:
// which generated module each HTML constant goes to, which bindings are
// deliberately not exported (and why), and notes for values that depend on
// the clock or timezone. No content lives here; every value comes from the
// page.
//
// The extractor fails if a constant it finds is not placed below, so a new
// constant in the HTML can never be dropped silently.

/** The environment the reference capture runs in. */
export const REFERENCE_ENV = {
  clock: '2026-01-15T04:30:00.000Z', // 10:00 on 15 Jan 2026 in Asia/Kolkata
  timezoneId: 'Asia/Kolkata',
  locale: 'en-IN',
};
/** Two more captures; any value that differs from the reference is environment-derived. */
export const ALT_CLOCK = '2027-08-23T12:15:00.000Z';
export const ALT_TIMEZONE = 'America/Los_Angeles';

/**
 * Scope keys: 'global' is the script top level. An IIFE is named by the id of
 * its <script> (`#xray4js`) when that script holds exactly one IIFE, otherwise
 * by its first line (`iife@L5842`).
 *
 * Module placement. `consts` entries are NAME (global scope) or NAME@scope.
 */
export const MODULES = [
  { file: 'subjects', about: 'Subject palette shared by every area.', consts: ['SUBJ'] },
  { file: 'home', about: 'Home tab: hero banners, briefing, flashcards, coverage, week, announcements, day plan, reels.',
    consts: ['BANNERS', 'BRIEF', 'FLASH', 'COVER', 'WEEK', 'REVISIONS', 'REELS', 'MEGA', 'ANN', 'ANN_IC', 'DAYPLAN', 'SKYLINE'] },
  { file: 'learn', about: 'Learn tab: courses and the Learn spotlight cards.', consts: ['COURSES', 'MORE_COURSES', 'LX'] },
  { file: 'notes', about: 'Notes, documents, mindmap notes and the Notes System compendiums.', consts: ['NOTES', 'DOCS', 'MM_NOTES', 'NOTESYS'] },
  { file: 'practice', about: 'Practice tab: quiz, mains questions, answer bank, past evaluations, tests, question banks, model answer.',
    consts: ['QUIZ', 'MAINSQ', 'ANSWERBANK', 'AB_META', 'PASTEVALS', 'TESTS', 'QB', 'PQB', 'MODEL'] },
  { file: 'current', about: 'Current affairs: articles, source and GS-paper colours, calendar labels and the clock-derived dates.',
    consts: ['ARTICLES', 'SRC', 'GSC', 'TODAY', 'MONS', 'MONL', 'DOWS'] },
  { file: 'plans', about: 'Plans, credit packs and the plan themes.', consts: ['PLAN_N', 'PLAN_CAP', 'PLANS', 'PACKS', 'TH@#planthemesjs'] },
  { file: 'legal', about: 'Privacy policy and terms.', consts: ['LEGAL'] },
  { file: 'menu', about: 'Menu tab: toolkit registry and the syllabus matrix.', consts: ['MT', 'SYL'] },
  { file: 'tools', about: 'Study tools registry.', consts: ['TOOLS'] },
  { file: 'xray', about: 'X-Ray reader. XSC / X4SUB / TABS / NCOL / RIC are the final v4 reader; XR, XRB_META, XRP and XR_LAB belong to the earlier readers (v1, v2) that v4 replaces at runtime.',
    consts: ['XSC@window', 'X4SUB@#xray4js', 'TABS@#xray4js', 'NCOL@#xray4js', 'RIC@#xray4js', 'XR', 'XRB_META', 'XRP', 'XR_LAB'] },
  { file: 'tracker', about: 'Notes Tracker v2: folders, optionals, sources, raw rows and the built note list (NT).',
    consts: ['FOLDERS', 'OPTIONALS', 'NT_OPTS@#notes2js', 'OPT_C@#notes2js', 'SRC@#notes2js', 'UD@#notes2js', 'COOP_UPS@#notes2js', 'RAW@#notes2js', 'NT@#notes2js'] },
  { file: 'book', about: 'Book opening: camera poses and the paper-sound engine state.', consts: ['CAM_CLOSED', 'CAM_SPREAD', 'CAM_FINAL', 'SFX'] },
  { file: 'auth', about: 'Sign-in screen: the countdown target.', consts: ['PRELIMS_AT'] },
  { file: 'onestep', about: '"One more step": India outline, path, cities and the sound engine state.', consts: ['IN_OUTLINE', 'IN_PATH', 'IN_CITIES', 'STS'] },
  { file: 'illustrations', about: 'Illustration sources kept as data: the India silhouette path and the hero-art table.', consts: ['INDIA', 'ART'] },
];

/** Constants that are read but deliberately not written to a data module. */
export const EXCLUDED = {
  S: 'State object. Written to initialState.ts instead of a data module.',
  I18N: 'Written to mobile/src/i18n/strings.ts.',
  startAt: 'Derived from location.hash at load ("" in the capture). Environment input, not content.',
  'n@iife@L8692': 'Local of the status-bar clock IIFE: `new Date()` for the fake 9:41 bar, which the app replaces with the OS status bar.',
  'NT@window': 'Same object as NT in the notes2js IIFE (`const NT = window.NT = {}`); exported once from tracker.ts.',
};

/**
 * Constants whose zero-argument arrow functions are pure templates. Their
 * return value is recorded next to the function marker so the content is not
 * lost. (The function itself is still marked and reported.)
 */
export const CALL_ZERO_ARG_FUNCTIONS = ['ART'];

/**
 * Notes for values that change with the clock or the timezone. Every such
 * value the extractor detects must match one of these patterns, otherwise the
 * extractor stops (so each one is handled on purpose). `source` says how the
 * HTML computes it.
 */
export const ENV_NOTES = [
  { pattern: /^TODAY$/, source: 'L7092: local midnight of the current day (new Date(); setHours(0,0,0,0))' },
  { pattern: /^PRELIMS_AT$/, source: 'L5930: Date.now() + ((126 * 24 + 9) * 60 + 14) * 60000 + 32000, taken once at load' },
  { pattern: /^S\.ca\.date$/, source: 'L7104: isoD(TODAY), the local date as YYYY-MM-DD' },
  { pattern: /^NT@#notes2js\.[a-z]+\[\d+\]\.ts$/, source: "L10430: ts(d) = Date.parse(d + ' 2026') in local time (Date.now() when d is not a date); used only to sort notes" },
];

/** HTML-producing expressions that hold <symbol>s which are not in the document at load. */
export const TEMPLATE_SYMBOLS = [
  { expression: 'stepHTML()', about: 'People silhouettes of the "One more step" view (L8560-L8562), built inside stepHTML()' },
];

/**
 * Groups the document's static markup in the template inventory: each element
 * is filed under its nearest ancestor matching this selector (by id).
 */
export const STATIC_GROUP_SELECTOR = '.stage, #proto-panel, #device';
