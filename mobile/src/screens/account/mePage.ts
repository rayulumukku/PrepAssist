// Source: PrepAssist.html L3351-L3354 (.page:has(.me-page), .me-page, .me-page h6), L9393 (ds-handoff .me-page h6), L7095-L7100 (addD, MONS, fmtShort)
// Private copy of the shared `.me-page` rules for the account area (CONTRACT.md section 4: `.me-*` is
// shared in the HTML but not ported by the foundation). The page background (#F5F7FA) and the .ph
// tint come from VIEW_META; this file holds the content box and the section heading.
//   .me-page   padding 4px 20px 30px                          (reference/android/view-account)
//   h6         Inter 800 10.5px / 15.225px, letter-spacing 1.47px, uppercase, #8A93A0
import { StyleSheet } from 'react-native';
import { font } from '../../theme';

export const ME = StyleSheet.create({
  page: { paddingTop: 4, paddingHorizontal: 20, paddingBottom: 30 },
  h6: {
    ...font('sans', 800),
    fontSize: 10.5,
    lineHeight: 15.225,
    letterSpacing: 1.47,
    textTransform: 'uppercase',
    color: '#8A93A0',
  },
});

/** fmtShort(d) (L5125): '24 Oct'. */
const MON = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
export const fmtShort = (d: Date): string =>
  `${d.getDate()} ${MON[d.getMonth()]}`;
/** addD(d, n) (L5126) */
export const addD = (d: Date, n: number): Date => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

/** color-mix(in srgb, <hex> p%, #fff) */
export function mixWhite(hex: string, p: number): string {
  const n = parseInt(hex.slice(1), 16);
  const ch = (v: number): number => Math.round(v * p + 255 * (1 - p));
  return `rgb(${ch((n >> 16) & 255)}, ${ch((n >> 8) & 255)}, ${ch(n & 255)})`;
}
