// Pure logic of the Prelims Question Bank (pqbHTML L8069-L8092, A.pqHist L8140, A.pqPick/pqNav/pqReset
// L8136-L8139): which question is shown, the accuracy line, option classes, and the attempts list.
import type { PqbItem } from '../../../data/practice';

export interface PqbSel {
  i: number;
  sel: Record<number, number>;
  lang: string;
}

/** PQB[P.i % PQB.length] */
export const pqbQuestion = (P: PqbSel, bank: readonly PqbItem[]): PqbItem => bank[P.i % bank.length];

/** `right` and `att` of pqbHTML (L8073). */
export function pqbScore(P: PqbSel, bank: readonly PqbItem[]): { right: number; att: number } {
  const E = Object.entries(P.sel);
  return { right: E.filter(([i, v]) => bank[+i % bank.length].a === v).length, att: E.length };
}

/** `.pq-tt small` (L8074). */
export function pqbSubtitle(P: PqbSel, bank: readonly PqbItem[]): string {
  const { right, att } = pqbScore(P, bank);
  return 'Adaptive · ' + (att ? Math.round((right / att) * 100) + '% accuracy' : 'start anywhere');
}

/** Width of `.pq-prog i` in % (L8077). */
export const pqbProgress = (i: number): number => Math.max(1.2, ((i + 1) / 8790) * 100 * 40);

/** Class of one `.pq-o` (L8086). */
export function pqbOptClass(P: PqbSel, q: PqbItem, k: number): '' | 'ok' | 'bad' | 'dim' {
  const sel = P.sel[P.i];
  if (sel == null) return '';
  if (k === q.a) return 'ok';
  if (k === sel) return 'bad';
  return 'dim';
}

/** `(P.i + 1).toLocaleString('en-IN')` (L8091): Indian digit grouping. */
export function enIN(n: number): string {
  const s = String(Math.trunc(n));
  if (s.length <= 3) return s;
  const last = s.slice(-3);
  const rest = s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return rest + ',' + last;
}

export interface PqbAttempt {
  i: number;
  ok: boolean;
  title: string;
  sub: string;
  pts: string;
}

/** The rows of the "Your attempts" sheet (A.pqHist L8140), in Object.entries order (ascending index). */
export function pqbAttempts(sel: Record<number, number>, bank: readonly PqbItem[]): PqbAttempt[] {
  return Object.entries(sel).map(([i, v]) => {
    const q = bank[+i % bank.length];
    const ok = q.a === v;
    return { i: +i, ok, title: `Q${+i + 1} · ${q.topic}`, sub: `${q.q.slice(0, 64)}…`, pts: ok ? '+2' : '−0.66' };
  });
}

/** A.pqPick (L8136): the new sel map and done count. */
export function pqbPick(P: PqbSel, k: number): { sel: Record<number, number>; done: number } {
  const sel = { ...P.sel, [P.i]: k };
  return { sel, done: Object.keys(sel).length };
}

/** A.pqNav (L8137) */
export const pqbNav = (i: number, d: number): number => Math.max(0, i + d);
