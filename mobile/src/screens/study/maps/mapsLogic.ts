// Source: PrepAssist.html L7257-L7277 (caCalHTML), L8176 (A.svSave), L4039 (.tl-hero color-mix), L6666-L6677 (mindmapSVG), L8011-L8022 (VIEWS.mindmap)
// Pure logic of the maps group (mindmap, mindmaps, saved, edition calendar). No React.
import { INLINE_VIEWS_mindmap_L8013 } from '../../../data';
import { isoD } from '../../../env/clock';
import { caPool, fmtShort } from '../common/current';

// ---------- colour ----------

const hex = (c: string): [number, number, number] => {
  const h = c.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
};

/** `color-mix(in srgb, a p%, b)` as rgb(), channels rounded like the computed value would be painted. */
export function colorMix(a: string, p: number, b: string): string {
  const x = hex(a);
  const y = hex(b);
  const ch = (i: number): number => Math.round(x[i] * p + y[i] * (1 - p));
  return `rgb(${ch(0)}, ${ch(1)}, ${ch(2)})`;
}

// ---------- mindmaps ----------

/** One branch of a mm-card thumbnail (L7993): spoke end point for branch k of n. */
export function mmCardSpoke(k: number, n: number): { x: number; y: number } {
  const a = (k / n) * Math.PI * 2;
  return { x: 60 + 42 * Math.cos(a), y: 35 + 24 * Math.sin(a) };
}

/** The six dots of .mm-busy (L8210). */
export function mmBusyDot(k: number): { x: number; y: number } {
  const a = (k / 6) * Math.PI * 2;
  return { x: 60 + 40 * Math.cos(a), y: 35 + 24 * Math.sin(a) };
}

/** VIEWS.mindmap(t) (L8012): which map a topic gets. */
export const isFrMap = (t: string | undefined): boolean => !t || t === 'fr' || /fundamental rights/i.test(t);

/** The topic map's centre label (L8017). */
export const mmCentre = (t: string): string => (t.length > 18 ? t.slice(0, 17) + '…' : t);

export const MM_TOPIC_BRANCHES = INLINE_VIEWS_mindmap_L8013;
export const MM_TOPIC_COLOURS = ['#3B5BCC', '#0E9A8A', '#E8890C', '#6C5DD3', '#3E9A55', '#1667B0'];
export const MM_TOPIC_POS: readonly (readonly [number, number])[] = [[66, 70], [294, 70], [60, 200], [300, 200], [70, 330], [290, 330]];

// ---------- saved ----------

export interface SavedLink {
  u: string;
  dom: string;
  t: string;
  d: string;
}

/** A.svSave (L8176) without its effects: the new link, or null when the URL is rejected. */
export function makeSavedLink(url: string, title: string, day: Date): SavedLink | null {
  const u = url.trim();
  if (!/^https?:\/\/\S+\.\S+/.test(u)) return null;
  const dom = u.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
  return { u, dom, t: title.trim() || 'Saved from ' + dom, d: fmtShort(day) };
}

// ---------- edition calendar ----------

export interface CalCell {
  d: number;
  /** isoD of the day */
  k: string;
  fut: boolean;
  on: boolean;
  td: boolean;
  /** number of <em> density dots (0 for a future day) */
  dots: number;
}

export interface CalModel {
  /** empty leading cells (Monday-first week) */
  lead: number;
  cells: CalCell[];
  /** the "next month" button is enabled */
  nextOk: boolean;
  /** month index and year shown */
  m: number;
  y: number;
}

/** caCalHTML (L7258-L7266) */
export function calModel(view: Date, sel: Date, today: Date): CalModel {
  const y = view.getFullYear();
  const m = view.getMonth();
  const lead = (new Date(y, m, 1).getDay() + 6) % 7;
  const days = new Date(y, m + 1, 0).getDate();
  const nextOk = new Date(y, m + 1, 1) <= today;
  const cells: CalCell[] = [];
  for (let d = 1; d <= days; d++) {
    const dt = new Date(y, m, d);
    const k = isoD(dt);
    const fut = dt > today;
    const dens = fut ? 0 : 3 + ((d * 7 + m) % 4);
    cells.push({ d, k, fut, on: k === isoD(sel), td: k === isoD(today), dots: fut ? 0 : Math.min(3, dens - 2) });
  }
  return { lead, cells, nextOk, m, y };
}

/** `${caPool(isoD(sel)).length} stories` (L7275) */
export const storyCount = (sel: Date): number => caPool(isoD(sel)).length;
