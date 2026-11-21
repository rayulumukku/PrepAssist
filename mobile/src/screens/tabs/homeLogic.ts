// Source: PrepAssist.html L5140-L5140 (t), L6023-L6026 (dateLine), L6043-L6056 (renderHome data), L6143-L6143 (initials), L6399-L6415 (skyPhase, skyArc)
// Pure logic of the Home tab, ported from the HTML functions. No UI here.
import { DAYPLAN, WEEK } from '../../data';
import { I18N } from '../../i18n/strings';
import type { I18nKey, Lang } from '../../i18n/strings';

/** t(k) L5140: (I18N[S.lang] && I18N[S.lang][k]) || I18N.en[k] || k */
export function tr(lang: string, k: I18nKey): string {
  const table = I18N[lang as Lang] as Readonly<Record<I18nKey, string>> | undefined;
  return (table && table[k]) || I18N.en[k] || k;
}

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** dateLine() L6023: toLocaleDateString('en-IN', {weekday:'long'}) + ' · ' + d.getDate() + ' ' + month long */
export function dateLine(d: Date): string {
  return WEEKDAYS[d.getDay()] + ' · ' + d.getDate() + ' ' + MONTHS_LONG[d.getMonth()];
}

/** toLocaleDateString('en-IN', {day:'numeric', month:'short'}) L6098 → "24 Oct" */
export function dayMonShort(d: Date): string {
  return d.getDate() + ' ' + MONTHS_SHORT[d.getMonth()];
}

/** greeting key L6044 */
export function greetKey(h: number): I18nKey {
  return h < 12 ? 'greet_morning' : h < 17 ? 'greet_afternoon' : 'greet_evening';
}

/** initials() L6143 */
export function initials(name: string): string {
  return name
    .split(' ')
    .map(s => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export type SkyPhase = 'night' | 'morning' | 'day' | 'evening';
/** skyPhase(hr) L6400 */
export function skyPhase(hr: number): SkyPhase {
  return hr < 5 || hr >= 20 ? 'night' : hr < 11 ? 'morning' : hr < 17 ? 'day' : 'evening';
}

/** P(t) of skyArc: the quadratic curve M14 62 Q175 -6 336 62 */
export function arcPoint(t: number): [number, number] {
  const u = 1 - t;
  return [u * u * 14 + 2 * u * t * 175 + t * t * 336, u * u * 62 + 2 * u * t * -6 + t * t * 62];
}
/** T(h) of skyArc */
export const arcT = (h: number): number => Math.min(1, Math.max(0, (h - 6) / 16));
/** fmt(h) of skyArc: 7 -> "7a", 14.5 -> "2:30p" */
export function arcTime(h: number): string {
  const H = Math.floor(h);
  const m = Math.round((h - H) * 60);
  return (H % 12 || 12) + (m ? ':' + String(m).padStart(2, '0') : '') + (H < 12 ? 'a' : 'p');
}

/** Length of the arc path (the HTML uses pathLength="100"; react-native-svg dashes in user units). */
export const ARC_LEN = (() => {
  let len = 0;
  let [px, py] = arcPoint(0);
  for (let i = 1; i <= 2000; i++) {
    const [x, y] = arcPoint(i / 2000);
    len += Math.hypot(x - px, y - py);
    px = x;
    py = y;
  }
  return len;
})();

export interface ArcModel {
  now: number;
  sun: [number, number];
  night: boolean;
  nDone: number;
  points: { x: number; y: number; done: boolean; label: string; time: string }[];
}

/** skyArc(hr) L6401-L6415, as data */
export function skyArc(hr: number): ArcModel {
  const now = arcT(hr);
  return {
    now,
    sun: arcPoint(now),
    night: skyPhase(hr) === 'night',
    nDone: DAYPLAN.filter(p => p.h <= hr).length,
    points: DAYPLAN.map(p => {
      const [x, y] = arcPoint(arcT(p.h));
      return { x, y, done: p.h <= hr, label: p.l, time: arcTime(p.h) };
    }),
  };
}

/** Week totals L6046-L6047 */
export function weekTotals(): { hh: number; mm: number; max: number } {
  const total = WEEK.reduce((a, b) => a + b.h, 0);
  const max = Math.max(...WEEK.map(w => w.h));
  const hh = Math.floor(total);
  const mm = Math.round((total - hh) * 60);
  return { hh, mm, max };
}

/** color-mix(in srgb, a p%, b) for #RRGGBB inputs; returns rgb(). */
export function mix(a: string, p: number, b: string): string {
  const pa = parseHex(a);
  const pb = parseHex(b);
  const c = pa.map((v, i) => Math.round(v * p + pb[i] * (1 - p)));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}
function parseHex(h: string): [number, number, number] {
  const s = h.replace('#', '');
  return [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)];
}
/** #RRGGBB + alpha → rgba() */
export function alpha(h: string, a: number): string {
  const [r, g, b] = parseHex(h);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
