// Source: PrepAssist.html L7684 (mAct), L7687 (vaultMB), L8248 (lxStat), L9726 (subN), L9856 (seenN), L10438-L10444 (allNotes, foldKey, notesOf, upsOf, ntTotal), L10573-L10576 (ntPeek data)
// Pure logic the Learn tab reads. PRIVATE COPIES of library-area helpers (vaultMB, ntTotal, allNotes, foldKey,
// notesOf, upsOf, subN, seenN) and of the Menu's mAct: they read the store fields the library area owns
// (DOCS, NT, FOLDERS, optional, xr, x4, XSC) and are to be merged with the library's copies later.
import { MT, NOTESYS, OPT_C, X4SUB } from '../../../data';
import type { DocsItem, NtValueItem, XscItem } from '../../../data';

/** vaultMB() L7687 */
export function vaultMB(docs: readonly DocsItem[]): number {
  return docs.reduce((s, d) => {
    const m = d.m.match(/([\d.]+) MB/);
    return s + (parseFloat(m ? m[1] : '1.5') || 1.5);
  }, 0);
}

type NT = Readonly<Record<string, readonly NtValueItem[]>>;

/** allNotes() L10438 */
export const allNotes = (nt: NT): NtValueItem[] => Object.values(nt).flat();
/** ntTotal() L10444 */
export const ntTotal = (nt: NT): number => allNotes(nt).reduce((a, n) => a + n.ups.length, 0);
/** foldKey(k) L10441 */
export function foldKey(folders: readonly (readonly string[])[], k: string): readonly string[] {
  return folders.find(f => f[2] === k) || (k.startsWith('opt:') ? [k.slice(4), OPT_C, k] : ['Notes', '#6C5DD3', k]);
}
/** notesOf(k) L10442 (the HTML also creates the empty folder; reading it is enough here) */
export const notesOf = (nt: NT, k: string): readonly NtValueItem[] => nt[k] || [];
/** upsOf(k) L10443 */
export const upsOf = (nt: NT, k: string): number => notesOf(nt, k).reduce((a, n) => a + n.ups.length, 0);

/** subN(k) L9726 */
export const subN = (k: string): string => (X4SUB.find(s => s[0] === k) || [k, k])[1];
/** seenN(sc) L9856 */
export const seenN = (sc: XscItem, seen: Readonly<Record<string, number>>): number => sc.ins.filter((_, i) => seen[sc.id + ':' + i]).length;

/** mAct(id) L7684 */
export const mAct = (id: string): string => MT[id].act || 'push:' + id;

export interface LxStatInput {
  nt: NT;
  xrDone: Readonly<Record<string, number>>;
  docs: readonly DocsItem[];
}
/** lxStat(k) L8248 */
export function lxStat(k: string, s: LxStatInput): string {
  switch (k) {
    case 'notes':
      return `${NOTESYS.length} compendiums`;
    case 'tracker':
      return `${ntTotal(s.nt)} updates waiting`;
    case 'xray':
      return `${Object.values(s.xrDone).reduce((a, b) => a + b, 0)} PYQ lines`;
    case 'cloud':
      return `${vaultMB(s.docs).toFixed(0)} MB stored`;
    default:
      return '';
  }
}

export interface PeekRow {
  id: string;
  folder: readonly string[];
  t: string;
  line: string;
}
export interface Peek {
  total: number;
  withUps: number;
  notes: number;
  sources: [string, number][];
  rows: PeekRow[];
}
/** The data of ntPeek() L10573-L10589 */
export function ntPeek(nt: NT, folders: readonly (readonly string[])[]): Peek {
  const L = allNotes(nt);
  // Array.prototype.sort is stable: ties keep their order, as in the HTML
  const W = L.filter(n => n.ups.length).sort((a, b) => b.ups.length - a.ups.length);
  const src: Record<string, number> = {};
  W.forEach(n => n.ups.forEach(u => (src[u.src.s] = (src[u.src.s] || 0) + 1)));
  return {
    total: ntTotal(nt),
    withUps: W.length,
    notes: L.length,
    sources: Object.entries(src).sort((a, b) => b[1] - a[1]),
    rows: W.slice(0, 3).map(n => {
      const ss = [...new Set(n.ups.map(u => u.src.s))];
      return {
        id: n.id,
        folder: foldKey(folders, n.s),
        t: n.t,
        line: `${n.ups.length} new · ${ss.slice(0, 2).join(', ')}${ss.length > 2 ? ' +' + (ss.length - 2) : ''}`,
      };
    }),
  };
}

/** color-mix(in srgb, a p%, b) for #RRGGBB inputs; b may be 'transparent'. */
export function mix(a: string, p: number, b: string): string {
  const pa = hex(a);
  if (b === 'transparent') return `rgba(${pa[0]}, ${pa[1]}, ${pa[2]}, ${p})`;
  const pb = hex(b);
  const c = pa.map((v, i) => Math.round(v * p + pb[i] * (1 - p)));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}
function hex(h: string): [number, number, number] {
  const s = h.replace('#', '');
  return [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)];
}
