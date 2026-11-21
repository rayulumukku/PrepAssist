// Source: PrepAssist.html L13-L30 (:root), L9284-L9288 (ds-handoff :root), L9400 (xray4 :root),
// L10641-L10642 (planthemes). Values are the COMPUTED custom properties per plan theme, as recorded
// in reference/runtime.json (cssCustomProperties.byPlanTheme.<plan>.root), not a reading of the CSS.
//
// Naming: the CSS variable name, camelCased. --paper-2 -> paper2, --brand-tint-2 -> brandTint2,
// --ds-r-card -> dsRCard. Nothing is renamed, so a `var(--x)` in the HTML maps to `t.x` here.

export type Plan = 'free' | 'pro' | 'ultimate';
export const PLANS_ORDER: readonly Plan[] = ['free', 'pro', 'ultimate'];

/** Colours that are the same in every plan theme. */
const common = {
  paper: '#FFFFFF',
  paper2: '#F4F6F9',
  paper3: '#E6EAF0',
  sheet: '#FFFFFF',
  ink: '#25272D',
  ink2: '#4A4E57',
  muted: '#7A7F8A',
  faint: '#A9AEB8',
  rule: '#E8EBF0',
  rule2: '#D7DCE4',
  sky: '#F5A01F',
  skyTint: '#FFF4E2',
  accent: '#F5A01F',
  accentDeep: '#B86E00',
  accentTint: '#FFF4E2',
  hl: '#FFD27A',
  polity: '#1667B0',
  history: '#E8890C',
  geo: '#0E9A8A',
  eco: '#3B5BCC',
  env: '#3E9A55',
  ir: '#6C5DD3',
  snt: '#0A97B8',
  ethics: '#C8622B',
  ok: '#2F7A4F',
  okTint: '#E4F1E8',
  bad: '#B23B2E',
  badTint: '#F8E5E1',
  // ds-handoff (L9284-L9288)
  dsInk: '#14161C',
  dsInk2: '#3A404B',
  dsMuted: '#7A8494',
  dsFaint: '#8A93A0',
  /** --ds-line is `0 0 0 1px #E6EBF1` (a box-shadow hairline). */
  dsLineColor: '#E6EBF1',
  // xray4 (L9400)
  x4y: '#FFE27A',
  x4ys: '#FFF2C2',
  x4c: '#0B7FA6',
  x4cb: '#E2F5FB',
} as const;

export interface Palette extends Record<keyof typeof common, string> {
  brand: string;
  brandDeep: string;
  brandTint: string;
  brandTint2: string;
  dsBrand: string;
  /** --pl-a / --pl-b exist only under html[data-plan="pro"|"ultimate"] (L10641-L10642). */
  plA: string | null;
  plB: string | null;
  /** #app background: var(--paper), except html[data-plan="ultimate"] #app (L10679). */
  appBg: string;
}

export const palettes: Readonly<Record<Plan, Palette>> = {
  // Classic Blue
  free: {
    ...common,
    brand: '#1B8AD3',
    brandDeep: '#0F5E99',
    brandTint: '#E8F3FC',
    brandTint2: '#CFE5F7',
    dsBrand: '#1B8AD3',
    plA: null,
    plB: null,
    appBg: '#FFFFFF',
  },
  // Indigo Aurora
  pro: {
    ...common,
    brand: '#6A45E8',
    brandDeep: '#4526B8',
    brandTint: '#F1ECFE',
    brandTint2: '#DDD3FD',
    dsBrand: '#6A45E8',
    plA: '#6A45E8',
    plB: '#EC6BB4',
    appBg: '#FFFFFF',
  },
  // Midnight Gold
  ultimate: {
    ...common,
    brand: '#B8861B',
    brandDeep: '#7A560A',
    brandTint: '#FBF4E1',
    brandTint2: '#F2E2B4',
    dsBrand: '#B8861B',
    plA: '#D9A93A',
    plB: '#F7DE8E',
    appBg: '#FBF9F4',
  },
};

/** Lengths (CSS px = dp, 1:1). */
export const metrics = {
  /** --nav-h */
  navH: 64,
  // ds-handoff sizes
  dsRHero: 24,
  dsRCard: 18,
  dsRTile: 14,
  dsRCtl: 12,
  dsRSm: 10,
  dsRPill: 999,
  dsCta: 52,
  dsBtn: 46,
  dsAct: 36,
  dsChip: 34,
  dsIcon: 38,
  dsFeat: 44,
  dsSec: 28,
  dsGap: 12,
  dsPad: 16,
  /** --pg-w / --pg-h (book page) */
  pgW: 330,
  pgH: 486,
  /** body{font-size:15.5px;line-height:1.45} (L33) */
  bodySize: 15.5,
  bodyLine: 22.475,
} as const;

/** --ease: cubic-bezier(.2,.8,.2,1). Use with `cubicBezier(...EASE)` (Reanimated CSS) or `Easing.bezier(...EASE)`. */
export const EASE = [0.2, 0.8, 0.2, 1] as const;
/** The CSS keyword `ease` (transitions that name no timing function): cubic-bezier(.25,.1,.25,1). */
export const EASE_CSS = [0.25, 0.1, 0.25, 1] as const;

/** Shared durations, in ms, each with the rule it comes from. */
export const durations = {
  /** .stage.on{animation:stageIn .5s var(--ease)} (L74) */
  stageIn: 500,
  /** .tabp.on{animation:tabIn .35s var(--ease)} (L2254) */
  tabIn: 350,
  /** .page{transition:transform .42s var(--ease),filter .42s} (L2470); back() removes the element after 420 ms (L6491) */
  page: 420,
  /** .sheet{transition:transform .42s var(--ease)} (L2818) */
  sheet: 420,
  /** .scrim{transition:opacity .3s} (L2816) */
  scrim: 300,
  /** .toast{transition:all .3s var(--ease)} (L108) */
  toast: 300,
  /** toast() hides after 2400 ms (L5122) */
  toastHold: 2400,
  /** .ask{transition:all .35s var(--ease)} (L2263) */
  ask: 350,
  /** .ask .lbl{transition:opacity .2s} (L2266) */
  askLabel: 200,
  /** renderAll(): setTimeout(() => ask.classList.add('mini'), 3500) (L6000) */
  askAutoMini: 3500,
  /** .nav button{transition:color .2s} (L2258) */
  navColor: 200,
  /** .nav button::before{transition:width .3s var(--ease)} (L2261) */
  navBar: 300,
} as const;

/**
 * A colour as the generated data stores it: either a literal (`#1667B0`) or a CSS variable reference
 * (`var(--polity)`, as in SUBJ[k].c). Returns the literal for the given palette; an unknown variable
 * comes back unchanged.
 */
export function cssColor(value: string, palette: Palette): string {
  const m = /^var\(--([a-z0-9-]+)\)$/.exec(value.trim());
  if (!m) return value;
  const key = m[1].replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase());
  const v = (palette as unknown as Record<string, string | null | undefined>)[key];
  return typeof v === 'string' ? v : value;
}
