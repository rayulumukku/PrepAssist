// Route list of the prototype: 5 stages, 6 tabs, the 42 VIEWS keys, every kind of bottom sheet and the
// two full-screen overlays. Keys are the prototype's own (reference/runtime.json registries); the 18
// sheet kinds that the HTML opens with inline markup instead of a SHEETS entry get the names below.
// FROZEN after Phase 1: screen implementers replace placeholder files, never this list.
import type { ComponentType } from 'react';

/** go(name), PrepAssist.html L5616-L5627 */
export const STAGES = ['book', 'intro', 'auth', 'verify', 'app'] as const;
export type Stage = (typeof STAGES)[number];

/** #nav buttons, PrepAssist.html L5083-L5090 */
export const TABS = ['home', 'learn', 'practice', 'current', 'menu', 'profile'] as const;
export type TabId = (typeof TABS)[number];

/** VIEWS keys in registry order (reference/runtime.json registries.VIEWS). */
export const VIEW_IDS = [
  'lesson', 'course', 'courses', 'note', 'xray', 'mindmap', 'querydb', 'calendar', 'cloud', 'tracker',
  'engine', 'tests', 'history', 'answerbank', 'answer', 'pastevals', 'qbank', 'plan', 'article', 'quiz',
  'mains', 'mainsResult', 'account', 'wallet', 'payments', 'upgrade', 'settings', 'status', 'legal', 'pqb',
  'testquiz', 'syllabus', 'saved', 'upload', 'folder', 'mindmaps', 'notesys', 'note2', 'noteshub',
  'xrayhome', 'onestep', 'ntNote',
] as const;
export type ViewId = (typeof VIEW_IDS)[number];

/**
 * The argument each view function takes in the HTML (`VIEWS[id](arg)`). Always a string or nothing:
 * the dispatcher only ever passes strings. `string | undefined` = the HTML calls it both ways.
 */
export interface ViewArgs {
  lesson: undefined;
  /** COURSES id (L6521) */
  course: string;
  courses: undefined;
  /** NOTES id, or 'new' (L6533). `push:note:new` never reaches the view: see actions/base.ts push. */
  note: string;
  /** XSC id; without it the reader reopens S.x4.scan (L10021) */
  xray: string | undefined;
  /** topic text or a S.maps id (L8011) */
  mindmap: string | undefined;
  querydb: undefined;
  calendar: undefined;
  cloud: undefined;
  tracker: undefined;
  engine: undefined;
  tests: undefined;
  history: undefined;
  answerbank: undefined;
  /** ANSWERBANK id (L6619) */
  answer: string;
  pastevals: undefined;
  /** SUBJ key; unknown keys fall back to polity (L6631) */
  qbank: string;
  plan: undefined;
  /** ARTICLES id (L7470) */
  article: string;
  quiz: undefined;
  mains: undefined;
  mainsResult: undefined;
  account: undefined;
  wallet: undefined;
  payments: undefined;
  /** 'topup' scrolls to the packs (L7510, L7608) */
  upgrade: string | undefined;
  settings: undefined;
  status: undefined;
  /** LEGAL key: 'terms' | 'privacy' (L7565) */
  legal: string;
  pqb: undefined;
  testquiz: undefined;
  syllabus: undefined;
  saved: undefined;
  upload: undefined;
  /** folder name (L10495) */
  folder: string;
  mindmaps: undefined;
  notesys: undefined;
  /** NOTESYS id (L8006) */
  note2: string;
  noteshub: undefined;
  xrayhome: undefined;
  onestep: undefined;
  /** NT note id (L10508) */
  ntNote: string;
}

/** Arguments of push(): none, optional or required, per view. */
export type PushArgs<K extends ViewId> = ViewArgs[K] extends undefined
  ? []
  : undefined extends ViewArgs[K]
  ? [arg?: string]
  : [arg: string];

/** SHEETS keys (reference/runtime.json registries.SHEETS), in registry order. */
export const REGISTRY_SHEET_KEYS = [
  'credits', 'revisions', 'forgot', 'changeEmail', 'account', 'prefs', 'language', 'subscription',
  'payments', 'settings', 'privacy', 'coverage', 'allTools', 'upload', 'ledger', 'lowCredits', 'delAsk',
] as const;
export type RegistrySheetKey = (typeof REGISTRY_SHEET_KEYS)[number];

/**
 * Sheets the HTML opens with inline markup (openSheet(...) call sites outside SHEETS). The name is
 * ours; the comment is the HTML call site.
 */
export const ADHOC_SHEET_KEYS = [
  'mentor', // openMentor L6846-L6861
  'search', // cmdk L6937-L6951
  'currentFilter', // A.caFilter L7595-L7596
  'editionCalendar', // A.caCal L7599, caCalHTML L7257-L7277
  'purchase', // A.buy L7610, buyHTML L7441-L7459
  'pqbAttempts', // A.pqHist L8140
  'syllabusTopic', // A.syTopic L8170, syTopicHTML L8115-L8131
  'syllabusFilter', // A.syFilter L8173
  'savedAddLink', // A.svAdd L8175
  'cloudDelete', // A.vlDel L8189
  'trackerSplitPdf', // A.nsSplit L8192
  'trackerNewFolder', // A.ntAdd L8194
  'trackerOptional', // A.ntOpt L10625, optSheet L10567-L10570
  'xrayInsight', // x4OpenSheet L9998-L10004, x4Sheet L9981-L9991
  'xrayTerm', // A.x4Term L10051, x4TermSheet L10007-L10017
  'noteNew', // nnOpen L10562, nnSheet L10539-L10561
  'noteUpdates', // A.ntUps L10594, upsSheet L10529-L10534
  'trackerInbox', // A.ntInbox L10611-L10612
] as const;
export type AdhocSheetKey = (typeof ADHOC_SHEET_KEYS)[number];

export const SHEET_KEYS = [...REGISTRY_SHEET_KEYS, ...ADHOC_SHEET_KEYS] as const;
export type SheetKey = RegistrySheetKey | AdhocSheetKey;

/**
 * Sheets the HTML opens with `tall` = true (openSheet(html, true): class .sheet.tall in the reference
 * pack). The CALLER decides in the HTML, so openSheet() here takes `tall` too; this table is what the
 * callers pass and is used by the test deep link prepassist://sheet/<key>.
 */
export const SHEET_TALL: Readonly<Partial<Record<SheetKey, true>>> = {
  allTools: true, // L7010, L7014
  search: true, // L6938
  mentor: true, // L6856
  syllabusTopic: true, // L8170
  trackerOptional: true, // L10625
  xrayInsight: true, // L10002
  noteNew: true, // L10562
  noteUpdates: true, // L10594
  trackerInbox: true, // L10612
};

/** Full-screen layers the HTML appends to #app: #reelV (L6368-L6396) and .pm-ov (L10753-L10764). */
export const OVERLAY_KEYS = ['reel', 'planMagic'] as const;
export type OverlayKey = (typeof OVERLAY_KEYS)[number];

/** A.jump targets (L6971-L6983). The 15 of the proto panel plus 'intro', which A.jump also accepts. */
export const JUMP_TARGETS = [
  'book', 'intro', 'auth', 'verify', 'home', 'learn', 'practice', 'quiz', 'current', 'mains', 'mentor',
  'menu', 'profile', 'article', 'plans', 'status',
] as const;
export type JumpTarget = (typeof JUMP_TARGETS)[number];

export const AREAS = ['arrival', 'tabs', 'practice', 'study', 'library', 'account'] as const;
export type Area = (typeof AREAS)[number];

// ---------- what a screen file exports ----------

export interface ViewProps {
  /** The argument the page was pushed with; A.arNext / A.legalSwap replace it in place (setTopArg). */
  arg: string | undefined;
  /** Unique per push: two pushes of the same view are two entries. */
  entryKey: number;
}

/**
 * What `VIEWS[id](arg)` returns in the HTML (L6470-L6487), minus the markup. focus / noAsk and the
 * page background are fixed per view and live in VIEW_META below, not here.
 *   useTitle  v.title. A hook, so it may read the store. Used for non-focus views only.
 *   Action    v.action, the button at the right of the header. Without it the empty 38 px .act spacer is drawn.
 *   Screen    v.html + v.mount. For a non-focus view it is rendered inside the shell's scroll wrapper,
 *             under the .ph header; for a focus view it is the whole page.
 */
export interface ViewDef {
  useTitle?: (arg: string | undefined) => string;
  Action?: ComponentType<ViewProps>;
  Screen: ComponentType<ViewProps>;
}

export interface SheetProps {
  /** The string the opener passed (for example the purchase sheet's 'plan:pro'). */
  arg: string | undefined;
}
export type SheetComponent = ComponentType<SheetProps>;

export type StageComponent = ComponentType<Record<string, never>>;
export type TabComponent = ComponentType<Record<string, never>>;
export type OverlayComponent = ComponentType<Record<string, never>>;

// ---------- static facts of each view (taken from the final VIEWS definitions and the reference pack) ----------

export interface ViewMeta {
  /** v.focus (L6471): no .ph header, no scroll wrapper; the Ask button is hidden. */
  focus: boolean;
  /** v.noAsk (L6482): standard page, Ask button hidden. */
  noAsk: boolean;
  /** .page background (computed in reference/android/view-<id>/dom.json). */
  bg: string;
  /** .ph background for non-focus views; null for focus views (they have no .ph). */
  phBg: string | null;
}

const PAPER = '#FFFFFF'; // .page{background:var(--paper)} L2470, .page.focus{background:#FFFFFF} L2625
const PH = 'rgba(255,255,255,0.92)'; // .ph L2474
const ME = '#F5F7FA'; // .page:has(.me-page) L3351
const ME_PH = 'rgba(245,247,250,0.92)'; // .page:has(.me-page) .ph L3352

const std: ViewMeta = { focus: false, noAsk: false, bg: PAPER, phBg: PH };
const me: ViewMeta = { focus: false, noAsk: false, bg: ME, phBg: ME_PH };
const meNoAsk: ViewMeta = { focus: false, noAsk: true, bg: ME, phBg: ME_PH };
const focusOn = (bg: string): ViewMeta => ({ focus: true, noAsk: false, bg, phBg: null });

export const VIEW_META: Readonly<Record<ViewId, ViewMeta>> = {
  lesson: std,
  course: std,
  courses: std,
  note: std,
  xray: focusOn('#F4F1EA'), // .page.focus:has(.x4r) L9475
  mindmap: std,
  querydb: meNoAsk, // noAsk L7974
  calendar: std,
  cloud: me,
  tracker: me,
  engine: std,
  tests: std,
  history: std,
  answerbank: me,
  answer: std,
  pastevals: std,
  qbank: std,
  plan: std,
  article: focusOn(PAPER),
  quiz: focusOn(PAPER),
  mains: me,
  mainsResult: std,
  account: me,
  wallet: me,
  payments: me,
  upgrade: focusOn(ME), // .page.focus:has(.ug-scroll) L3462
  settings: me,
  status: me,
  legal: me,
  pqb: focusOn(PAPER),
  testquiz: me,
  syllabus: me,
  saved: meNoAsk, // noAsk L7908
  upload: me,
  folder: me,
  mindmaps: me,
  notesys: me,
  note2: focusOn(PAPER),
  noteshub: meNoAsk, // noAsk L8329
  xrayhome: me,
  onestep: focusOn('#0E0A22'), // .page.focus:has(.s4) L9198
  ntNote: me,
};

export const isStage = (x: string): x is Stage => (STAGES as readonly string[]).includes(x);
export const isTab = (x: string): x is TabId => (TABS as readonly string[]).includes(x);
export const isViewId = (x: string): x is ViewId => (VIEW_IDS as readonly string[]).includes(x);
export const isSheetKey = (x: string): x is SheetKey => (SHEET_KEYS as readonly string[]).includes(x);
