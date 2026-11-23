// Pure logic of the Mains evaluation panel and report (VIEWS.mains L7865-L7887, mvCount L8106,
// A.mvRun L8163, A.mainsWith L8156, mainsResultHTML L6804-L6807) and fmtShort (L7100).
import type { AnswerbankItem, MainsqItem } from '../../../data/practice';
import { MONS } from '../../../data/current';

/** `V.typed.trim() ? V.typed.trim().split(/\s+/).length : 0` (L7865, L8106) */
export const wordCount = (v: string): number => (v.trim() ? v.trim().split(/\s+/).length : 0);

/** Width of `.mv-wc i` in % (L7883) */
export const wcPct = (wc: number, limit: number): number => Math.min(100, (wc / limit) * 100);

/** fmtShort (L7100): "24 Oct" */
export const fmtShort = (d: Date): string => d.getDate() + ' ' + MONS[d.getMonth()];

/** Why A.mvRun stops before charging (L8163), in its order; null = it goes on to the credits check. */
export function mvRunBlock(V: { q: string; mode: string; pages: number; typed: string }): { msg: string; icon: 'x' | 'camera' } | null {
  if (!V.q.trim()) return { msg: 'Add the question first', icon: 'x' };
  if (V.mode === 'hand' && !V.pages) return { msg: 'Add at least one page of your answer', icon: 'camera' };
  if (V.mode === 'type' && V.typed.trim().split(/\s+/).length < 20) return { msg: 'Type at least 20 words to evaluate', icon: 'x' };
  return null;
}

/** A.mainsWith (L8156): the question text and word limit it sets. */
export function mainsWithFor(
  id: string | undefined,
  ab: readonly AnswerbankItem[],
  mq: readonly MainsqItem[],
): { q: string; limit: number } {
  const q = ab.find(x => x.id === id) || mq.find(x => x.id === id);
  return { q: q ? q.t : '', limit: q && q.w ? (q.w <= 150 ? 150 : q.w) : 250 };
}

/** The question block of mainsResultHTML (L6805-L6807, L6810). */
export function resultQuestion(
  mv: { q: string; limit: number },
  ab: readonly AnswerbankItem[],
  mq: readonly MainsqItem[],
): { p: string; m: number; t: string; words: number; custom: boolean } {
  const q0 = mq[0];
  const cu = !!(mv && mv.q && mv.q.trim() && mv.q.trim() !== q0.t);
  if (!cu) return { p: q0.p, m: q0.m, t: q0.t, words: 310, custom: false };
  const a = ab.find(x => x.t === mv.q.trim());
  return { p: a ? a.p : 'GS II', m: a ? a.m : 15, t: mv.q.trim(), words: Math.round((mv.limit || 250) * 0.96), custom: true };
}

/** A.mvAdd (L8161): the next page count, or null when the toast "Up to 4 pages per answer" shows. */
export const mvAddPages = (pages: number): number | null => (pages < 4 ? pages + 1 : null);
