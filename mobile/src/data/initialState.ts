// GENERATED from PrepAssist.html by tools/reference/extract. Do not edit by hand.
// The state object `S` exactly as the page leaves it when its last script has run, with the page
// clock paused (so no timer or animation frame has fired) and no location.hash.
//   Sets are real Sets. createInitialState() returns a fresh, mutable copy on every call.
//   `stage` is 'book' because the page starts with go('book') (L8683).
// Regenerate: `node extract/extract.mjs` in tools/reference. Check: `node extract/verify.mjs`.

export interface StateUser {
  name: string;
  first: string;
  email: string;
}

export interface StateCa {
  src: string;
  topic: string;
  day: number;
  date: string;
  gs: string;
  read: Set<never>;
}

export interface StateMeLedgerItem {
  t: string;
  d: string;
  v: number;
}

export interface StateMe {
  plan: string;
  credits: number;
  vault: boolean;
  pack: number;
  edit: boolean;
  phone: string;
  haptics: boolean;
  sound: boolean;
  push: boolean;
  plan7: boolean;
  nudges: boolean;
  dataSaver: boolean;
  wifi: boolean;
  motion: boolean;
  bigText: boolean;
  payments: never[];
  ledger: StateMeLedgerItem[];
}

export interface StatePqb {
  i: number;
  sel: Record<string, never>;
  lang: string;
  done: number;
}

export interface StateTqLibItem {
  t: string;
  q: number;
  best: number;
  att: number;
  d: string;
  lang: string;
}

export interface StateTq {
  tab: string;
  file: null;
  lang: string;
  busy: boolean;
  lib: StateTqLibItem[];
}

export interface StateMv {
  mode: string;
  q: string;
  limit: number;
  notes: boolean;
  ca: boolean;
  pages: number;
  typed: string;
}

export interface StateAb {
  lang: string;
  p: string;
  open: Record<string, never>;
}

export interface StateSyl {
  q: string;
  st: string;
  p: string;
  open: Record<string, boolean>;
}

export interface StateUp {
  file: null;
  folder: string;
  tags: string[];
  prog: number;
}

export interface StateVlt {
  tab: string;
  q: string;
  sort: string;
  warn: boolean;
}

export interface StateQdb2 {
  subj: string;
  items: never[];
  out: null;
  busy: boolean;
}

export interface StateMapsItem {
  t: string;
  d: string;
  n: number;
  id: string;
}

export interface StateNsys {
  subj: string;
  q: string;
}

export interface StateNsRead {
  ns1: number;
  ns2: number;
}

export interface StateNh {
  tab: string;
  q: string;
  s: string;
}

export interface StateXr {
  done: Record<string, number>;
  busy: number;
}

export interface StateXr2 {
  pg: number;
  lens: string;
  sel: null;
}

export interface StateX4 {
  sub: string;
  scan: string;
  lens: string;
  cur: number;
  tab: number;
  seen: Record<string, number>;
  mcq: Record<string, never>;
  coach: boolean;
  fs: number;
  busy: null;
}

// Source: PrepAssist.html L5126-L5133 (S)
//   Extended after its declaration at L7104, L7105, L7106-L7117, L7649, L7650, L7651, L7652-L7655, L7656, L7657, L7658, L7659, L7660, L7661, L7662, L7663, L7664, L7665, L7666, L7818, L7819, L8234, L8235, L8378, L9854, L10337, L10479.
export interface InitialState {
  stage: string;
  tab: string;
  stack: never[];
  lang: string;
  fcLang: string;
  fc: number;
  hero: number;
  heroTimer: null;
  intro: number;
  authMode: string;
  authTries: number;
  user: StateUser;
  saved: Set<string>;
  ca: StateCa;
  quiz: null;
  toolGroup: string;
  mlog: never[];
  ctxOn: boolean;
  rendered: boolean;
  mainsQ: string;
  pages: number;
  revDone: Set<never>;
  arSize: number;
  me: StateMe;
  menuQ: string;
  savedLinks: never[];
  pqb: StatePqb;
  tq: StateTq;
  mv: StateMv;
  ab: StateAb;
  syl: StateSyl;
  sylDone: Record<string, number>;
  up: StateUp;
  vlt: StateVlt;
  qdb2: StateQdb2;
  maps: StateMapsItem[];
  nsys: StateNsys;
  optional: null;
  folders: never[];
  nsRead: StateNsRead;
  nsSaved: Set<never>;
  nh: StateNh;
  xr: StateXr;
  xr2: StateXr2;
  x4: StateX4;
  ntSort: string;
}

/** Values of the initial state that the HTML computes from the clock; the caller supplies them. */
export interface InitialStateEnv {
  /** clock+timezone. L7104: isoD(TODAY), the local date as YYYY-MM-DD */
  'ca.date': string;
}

/** The values seen in the reference capture (2026-01-15T04:30:00.000Z, Asia/Kolkata). For tests only. */
export const INITIAL_STATE_ENV_SAMPLE: InitialStateEnv = { 'ca.date': '2026-01-15' };

export function createInitialState(env: InitialStateEnv): InitialState {
  return {
    stage: 'book',
    tab: 'home',
    stack: [],
    lang: 'en',
    fcLang: 'en',
    fc: 0,
    hero: 0,
    heroTimer: null,
    intro: 0,
    authMode: 'in',
    authTries: 0,
    user: { name: 'Divya Sharma', first: 'Divya', email: 'divya.sharma@gmail.com' },
    saved: new Set(['a3']),
    ca: { src: 'All', topic: 'All', day: 22, date: env['ca.date'], gs: 'All', read: new Set([]) },
    quiz: null,
    toolGroup: 'learn',
    mlog: [],
    ctxOn: true,
    rendered: false,
    mainsQ: 'mq1',
    pages: 0,
    revDone: new Set([]),
    arSize: 1,
    me: {
      plan: 'free',
      credits: 10,
      vault: false,
      pack: 0,
      edit: false,
      phone: '89249 65117',
      haptics: true,
      sound: true,
      push: true,
      plan7: true,
      nudges: true,
      dataSaver: false,
      wifi: true,
      motion: false,
      bigText: false,
      payments: [],
      ledger: [
        { t: 'X-Ray Reader · Laxmikanth Ch. 7', d: '24 Oct', v: -10 },
        { t: 'AI Mentor · 1 answer', d: '22 Oct', v: -2 },
        { t: 'AI Mindmap · Fundamental Rights', d: '20 Oct', v: -3 },
        { t: 'AI Prelims Engine · 10-question test', d: '16 Oct', v: -5 },
        { t: 'Welcome credits · Free tier', d: '1 Oct', v: 30 },
      ],
    },
    menuQ: '',
    savedLinks: [],
    pqb: { i: 0, sel: {}, lang: 'en', done: 0 },
    tq: {
      tab: 'new',
      file: null,
      lang: 'en',
      busy: false,
      lib: [
        { t: 'Mock Test 12 · GS Paper I', q: 100, best: 62, att: 2, d: '12 Oct', lang: 'English' },
        { t: 'Sectional Test · Modern History', q: 50, best: 34, att: 1, d: '3 Oct', lang: 'English' },
      ],
    },
    mv: { mode: 'hand', q: '', limit: 250, notes: true, ca: true, pages: 0, typed: '' },
    ab: { lang: 'en', p: 'All', open: {} },
    syl: { q: '', st: 'All', p: 'All', open: { '0': true } },
    sylDone: {
      'Preamble as a Key to the Constitution': 18,
      'Sovereign, Socialist, Secular Republic': 9,
      'Regulating Act 1773 to Charter Acts': 22,
      'Government of India Act, 1935': 40,
      'Repo, Reverse Repo and the LAF Corridor': 12,
    },
    up: { file: null, folder: 'Polity', tags: ['#gs2'], prog: -1 },
    vlt: { tab: 'all', q: '', sort: 'new', warn: true },
    qdb2: { subj: 'Polity', items: [], out: null, busy: false },
    maps: [{ t: 'Fundamental Rights', d: '20 Oct', n: 6, id: 'fr' }],
    nsys: { subj: 'All', q: '' },
    optional: null,
    folders: [],
    nsRead: { ns1: 60, ns2: 20 },
    nsSaved: new Set([]),
    nh: { tab: 'mine', q: '', s: 'all' },
    xr: { done: { '0': 12 }, busy: -1 },
    xr2: { pg: 0, lens: 'all', sel: null },
    x4: {
      sub: 'polity',
      scan: 'arb',
      lens: 'all',
      cur: 0,
      tab: 0,
      seen: { 'arb:0': 1 },
      mcq: {},
      coach: true,
      fs: 0,
      busy: null,
    },
    ntSort: 'new',
  };
}

export interface LaterStateField {
  readonly field: string;
  readonly assignedAt: readonly string[];
}

/** Fields of S that do not exist at load: the scripts create them later, at these lines. */
export const STATE_FIELDS_ASSIGNED_LATER: readonly LaterStateField[] = [
  { field: 'reelSeen', assignedAt: ['L6369'] },
  { field: 'mains', assignedAt: ['L6657'] },
  { field: 'mctx', assignedAt: ['L6847'] },
  { field: 'learnF', assignedAt: ['L6964'] },
  { field: 'px', assignedAt: ['L7019'] },
  { field: '_ntc', assignedAt: ['L8195'] },
  { field: 'nn', assignedAt: ['L10615'] },
];
