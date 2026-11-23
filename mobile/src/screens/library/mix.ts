// CSS `color-mix(in srgb, A p%, B)` (used by the X-Ray v4 rules, PrepAssist.html L9681-L9699, L9433).
// Arithmetic only: each sRGB channel and alpha is A * p + B * (1 - p) (premultiplied when an alpha < 1,
// as the CSS Color 5 spec does). Colours are '#RRGGBB', '#RGB', 'rgb()', 'rgba()' or 'transparent'.

type RGBA = [number, number, number, number];

export function parseColor(c: string): RGBA {
  const s = c.trim();
  if (s === 'transparent') return [0, 0, 0, 0];
  if (s[0] === '#') {
    const h = s.length === 4 ? s.slice(1).split('').map(x => x + x).join('') : s.slice(1);
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), h.length >= 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1];
  }
  const m = s.match(/rgba?\(([^)]+)\)/);
  if (!m) throw new Error('parseColor: ' + c);
  const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
  return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1];
}

const fmt = ([r, g, b, a]: RGBA): string =>
  a >= 1 ? `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})` : `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${+a.toFixed(4)})`;

/** color-mix(in srgb, a pct%, b) */
export function mix(a: string, pct: number, b: string): string {
  const A = parseColor(a);
  const B = parseColor(b);
  const p = pct / 100;
  const al = A[3] * p + B[3] * (1 - p);
  if (al === 0) return 'rgba(0, 0, 0, 0)';
  const ch = (i: number): number => (A[i] * A[3] * p + B[i] * B[3] * (1 - p)) / al;
  return fmt([ch(0), ch(1), ch(2), al]);
}

/** The colour with a new alpha (`rgba(var, .6)` style shadows). */
export function alpha(c: string, a: number): string {
  const [r, g, b] = parseColor(c);
  return fmt([r, g, b, a]);
}
