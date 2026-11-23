// Pure helpers of <script id="xray4js"> (PrepAssist.html L9719-L10073), ported 1:1.
// They read the scans from the store (S.XSC is changed at run time: x4Up unshifts a new scan).
import { SUBJ, X4SUB } from '../../../data';
import type { XscItem } from '../../../data';
import { getS } from '../../../store';

/** subN (L9726) */
export const subN = (k: string): string => (X4SUB.find(s => s[0] === k) || [k, k])[1];
/** subC (L9727) */
export const subC = (k: string): string => SUBJ[k].hex;

/** scanBy (L9855) */
export function scanBy(id: string, list: readonly XscItem[] = getS().XSC): XscItem {
  return list.find(x => x.id === id) || list[0];
}

/** seenN (L9856) */
export const seenN = (sc: XscItem, seen: Record<string, number>): number => sc.ins.filter((_, i) => seen[sc.id + ':' + i]).length;

/** plain (L9857) */
export const plain = (s: string): string => s.replace(/\{\{(.+?)\}\}/g, '$1');

/** insText (L9858) */
export function insText(sc: XscItem, i: number): string {
  for (const p of sc.paras) {
    const m = p.match(new RegExp('\\[\\[' + i + '\\|([\\s\\S]*?)\\]\\]'));
    if (m) return plain(m[1]);
  }
  return '';
}

/** termCount (L9859) */
export const termCount = (sc: XscItem, k: string): number => sc.paras.join(' ').split('{{' + k + '}}').length - 1;

/** ringSVG dash (L9860): stroke-dasharray `${(132 * max(.02, f)).toFixed(1)} 132` */
export const ringDash = (f: number): string => (132 * Math.max(0.02, f)).toFixed(1) + ' 132';

/** Initials of the byline (L9927): `by[0].split(' ').map(w => w[0]).join('')` */
export const initials = (name: string): string =>
  name
    .split(' ')
    .map(w => w[0])
    .join('');

/** x4Sum texts (L9903-L9908). */
export function sumInfo(sc: XscItem, seen: Record<string, number>): { s: number; n: number; title: string; sub: string; act: string; btn: string } {
  const n = sc.ins.length;
  const s = seenN(sc, seen);
  const nx = sc.ins.findIndex((_, i) => !seen[sc.id + ':' + i]);
  const all = s === n;
  return {
    s,
    n,
    title: all ? 'Every insight explored' : `${n - s} insight${n - s > 1 ? 's' : ''} left to explore`,
    sub: all ? 'Lock it in with the MCQs' : 'Each has context, static links, an MCQ and sources',
    act: all ? 'x4Quiz' : 'x4Ins:' + nx,
    btn: all ? 'Practise' : 'Continue',
  };
}

/** The five lens text sizes: `.x4-tx p` 17.5px / 1.75 (L9656), `.f1` 19.5px, `.f2` 21px (L9502). */
export const TX_SIZES: readonly number[] = [17.5, 19.5, 21];
