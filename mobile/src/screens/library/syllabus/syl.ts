// Syllabus Matrix helpers: sylAll / sylStatus (PrepAssist.html L7685-L7686), ring (L7322), the grouping of
// VIEWS.syllabus (L7890-L7894) and the numbers of syTopicHTML (L8115-L8120), ported 1:1 over the store.
import { SYL } from '../../../data';
import type { SylItem } from '../../../data';
import type { AppState } from '../../../store';

export interface SylTopic {
  n: string;
  c: number;
  a: number;
}

/** sylAll (L7685) */
export const sylAll = (done: Record<string, number>): (SylTopic & { g: SylItem })[] =>
  SYL.flatMap(g => g.t.map(([n, c]) => ({ n, c, a: done[n] || 0, g })));

/** sylStatus (L7686) */
export const sylStatus = (x: { a: number; c: number }): 'na' | 'cov' | 'pen' => (!x.a ? 'na' : x.a / x.c >= 0.6 ? 'cov' : 'pen');

/** `n.toLocaleString('en-IN')` for whole numbers (Indian digit grouping: 1,00,000). */
export function fmtIN(n: number): string {
  const s = String(Math.round(Math.abs(n)));
  const sign = n < 0 ? '-' : '';
  if (s.length <= 3) return sign + s;
  const last = s.slice(-3);
  const rest = s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return sign + rest + ',' + last;
}

/** ring (L7322): the dash of the progress circle. */
export function ringDash(r: number, frac: number): string {
  const C = 2 * Math.PI * r;
  return `${(C * Math.max(0.02, Math.min(1, frac))).toFixed(1)} ${C.toFixed(1)}`;
}

/** `p.toUpperCase().replace('GS', 'GS ')` */
export const paperLabel = (p: string): string => p.toUpperCase().replace('GS', 'GS ');

/** The groups VIEWS.syllabus lists (L7893-L7894). */
export function sylGroups(s: Pick<AppState, 'syl' | 'sylDone'>): { g: SylItem; gi: number; t: SylTopic[] }[] {
  const Y = s.syl;
  const q = Y.q.toLowerCase();
  return SYL.map((g, gi) => ({
    g,
    gi,
    t: g.t
      .map(([n, c]) => ({ n, c, a: s.sylDone[n] || 0 }))
      .filter(x => (Y.st === 'All' || sylStatus(x) === Y.st) && (!q || x.n.toLowerCase().includes(q) || g.g.toLowerCase().includes(q))),
  })).filter(x => x.t.length && (Y.p === 'All' || x.g.p === Y.p));
}
