// Source: PrepAssist.html L7095-L7100 (addD, fmtLong, fmtShort), L7175-L7184 (aTags, gsOf, caPool)
// Private copies (study area) of the Current-tab helpers the article reader, the saved list and the
// edition calendar use. The tabs workstream owns the originals; the lead merges them later.
import { ARTICLES, MONL, MONS } from '../../../data';
import type { ArticlesItem } from '../../../data';
import { isoD, parseD, today } from '../../../env/clock';

/** addD (L7095) */
export function addD(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * fmtLong (L7099): `d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })`.
 * The reference pack shows the browser's output: "Saturday, 24 October 2026" (view-article-lead .ar-date,
 * sheet-edition-calendar aria-labels). Written out instead of relying on the device's Intl data.
 */
export function fmtLong(d: Date): string {
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()} ${MONL[d.getMonth()]} ${d.getFullYear()}`;
}

/** fmtShort (L7100) */
export function fmtShort(d: Date): string {
  return d.getDate() + ' ' + MONS[d.getMonth()];
}

/** aTags (L7175) */
export function aTags(a: ArticlesItem): string[] {
  return a.tags
    ? [...a.tags]
    : [
        a.gs.replace(/\s/g, '').replace('III', '3').replace('II', '2').replace('IV', '4').replace('I', '1').toLowerCase(),
        a.topic.toLowerCase(),
      ];
}

/** gsOf (L7176) */
export const gsOf = (a: ArticlesItem): string[] => aTags(a).filter(t => /^gs\d$/.test(t));

const byId = (id: string): ArticlesItem => ARTICLES.find(a => a.id === id) as ArticlesItem;

/** caPool (L7179-L7184): the stories of one edition. */
export function caPool(iso: string): ArticlesItem[] {
  if (iso === isoD(today())) return ['c1', 'c2', 'c3', 'c4', 'a2', 'a4', 'a7', 'a6'].map(byId);
  const d = parseD(iso);
  const seed = d.getDate() + d.getMonth() * 31;
  const pool = ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7'];
  const n = 4 + (seed % 3);
  return Array.from({ length: n }, (_, i) => byId(pool[(seed + i * 3) % 7]));
}
