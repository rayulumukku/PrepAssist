// Source: PrepAssist.html L11 (Google Fonts link), L26-L28 (--serif, --book, --read, --sans, --hand)
// Font helper: maps a CSS font stack role + weight + style to one of the 18 bundled faces.
//
// The HTML loads exactly these faces (reference/runtime.json fonts.faces):
//   Inter 400, 400 italic, 500, 600, 700          Inter Tight 500, 600, 700, 800
//   EB Garamond 400, 400 italic, 500, 600         Caveat 500, 600
//   Noto Sans Devanagari 400, 500, 600
// Where the CSS asks for a weight that is not loaded, the browser's font matching (CSS Fonts 4, 5.2)
// picks: wanted 400 -> 500 first, then lighter, then heavier; wanted 500 -> 400 first, then lighter, then
// heavier; wanted < 400 -> lighter first, then heavier; wanted > 500 -> heavier first, then lighter.
// The table below is that rule applied to the loaded faces. It covers every (family, weight, style)
// combination that occurs in the computed styles of the 286 reference states.
//
// The file name is the PostScript name, so the same string works on Android and iOS.

import { PixelRatio, Platform } from 'react-native';

export type FontRole =
  /** --sans: 'Inter','Noto Sans Devanagari',system-ui… (body default). Devanagari glyphs come from Noto Sans Devanagari. */
  | 'sans'
  /** --read: 'Inter',system-ui… Same Latin face as sans but NO Devanagari web font in the stack. */
  | 'read'
  /** --serif: 'Inter Tight','Inter',system-ui… (despite the name it is the display sans). */
  | 'serif'
  /** --book: 'EB Garamond',… */
  | 'book'
  /** --hand: 'Caveat',… */
  | 'hand'
  /** .hi: 'Noto Sans Devanagari','Mangal',var(--sans) — Latin letters are drawn by Noto Sans Devanagari too. */
  | 'deva';

export type FontWeight = 400 | 500 | 600 | 700 | 800 | 900;

type FaceTable = Readonly<Record<FontWeight, string>>;

const INTER: FaceTable = {
  400: 'Inter-Regular',
  500: 'Inter-Medium',
  600: 'Inter-SemiBold',
  700: 'Inter-Bold',
  800: 'Inter-Bold', // 800 is not loaded -> 700
  900: 'Inter-Bold', // 900 is not loaded -> 700
};
const INTER_TIGHT: FaceTable = {
  400: 'InterTight-Medium', // 400 is not loaded -> 500
  500: 'InterTight-Medium',
  600: 'InterTight-SemiBold',
  700: 'InterTight-Bold',
  800: 'InterTight-ExtraBold',
  900: 'InterTight-ExtraBold', // 900 is not loaded -> 800
};
const GARAMOND: FaceTable = {
  400: 'EBGaramond-Regular',
  500: 'EBGaramond-Medium',
  600: 'EBGaramond-SemiBold',
  700: 'EBGaramond-SemiBold', // 700 is not loaded -> 600
  800: 'EBGaramond-SemiBold',
  900: 'EBGaramond-SemiBold',
};
const CAVEAT: FaceTable = {
  400: 'Caveat-Medium', // 400 is not loaded -> 500
  500: 'Caveat-Medium',
  600: 'Caveat-SemiBold',
  700: 'Caveat-SemiBold', // 700 is not loaded -> 600
  800: 'Caveat-SemiBold',
  900: 'Caveat-SemiBold',
};
const DEVANAGARI: FaceTable = {
  400: 'NotoSansDevanagari-Regular',
  500: 'NotoSansDevanagari-Medium',
  600: 'NotoSansDevanagari-SemiBold',
  700: 'NotoSansDevanagari-SemiBold', // 700 is not loaded -> 600
  800: 'NotoSansDevanagari-SemiBold',
  900: 'NotoSansDevanagari-SemiBold',
};

const TABLES: Readonly<Record<FontRole, FaceTable>> = {
  sans: INTER,
  read: INTER,
  serif: INTER_TIGHT,
  book: GARAMOND,
  hand: CAVEAT,
  deva: DEVANAGARI,
};

/**
 * Italic faces that exist: Inter Italic 400 and EB Garamond Italic 400 only. Any italic text in those
 * two families uses that one face whatever the weight (the browser then synthesises bold for a wanted
 * weight >= 600: 'EB Garamond 600 italic' on Home, 'Inter 700 italic' in the note-updates sheet).
 * Italic in the other families has no face at all and was a synthesised slant in the browser
 * ('Noto Sans Devanagari 500 italic' on Hindi Home); here the upright face is returned with
 * fontStyle 'italic' so the platform slants it.
 */
export interface FontStyleResult {
  fontFamily: string;
  fontStyle?: 'italic';
  /** Set only where the browser synthesised bold on top of the italic 400 face. */
  fontWeight?: '700';
}

export function font(role: FontRole, weight: FontWeight = 400, italic = false): FontStyleResult {
  if (italic) {
    if (role === 'sans' || role === 'read') {
      return weight >= 600 ? { fontFamily: 'Inter-Italic', fontWeight: '700' } : { fontFamily: 'Inter-Italic' };
    }
    if (role === 'book') {
      return weight >= 600 ? { fontFamily: 'EBGaramond-Italic', fontWeight: '700' } : { fontFamily: 'EBGaramond-Italic' };
    }
    return { fontFamily: TABLES[role][weight], fontStyle: 'italic' };
  }
  return { fontFamily: TABLES[role][weight] };
}

/** The Noto Sans Devanagari face the browser pairs with an Inter face for Devanagari glyphs in the --sans stack. */
const DEVA_FOR_INTER: Readonly<Record<string, string>> = {
  'Inter-Regular': 'NotoSansDevanagari-Regular',
  'Inter-Italic': 'NotoSansDevanagari-Regular',
  'Inter-Medium': 'NotoSansDevanagari-Medium',
  'Inter-SemiBold': 'NotoSansDevanagari-SemiBold',
  'Inter-Bold': 'NotoSansDevanagari-SemiBold',
};

export function devanagariFaceFor(fontFamily: string | undefined): string | null {
  if (!fontFamily) return DEVA_FOR_INTER['Inter-Regular'];
  return DEVA_FOR_INTER[fontFamily] ?? null;
}

// Devanagari block, Vedic extensions, Devanagari Extended, plus the joiners the unicode-range of the
// Noto face lists (U+900-97F, U+1CD0-1CF9, U+200C-200D, U+20A8, U+20B9, U+25CC, U+A830-A839, U+A8E0-A8FF).
// The rupee sign U+20B9 is left to Inter (Inter has it and comes first in the stack).
const DEVA_RE = /[ऀ-ॿ᳐-᳹꣠-ꣿ]/;
const DEVA_RUN_RE = /([ऀ-ॿ᳐-᳹꣠-ꣿ][ऀ-ॿ᳐-᳹꣠-ꣿ‌‍]*)/;

export function hasDevanagari(s: string): boolean {
  return DEVA_RE.test(s);
}

export interface ScriptRun {
  text: string;
  devanagari: boolean;
}

/** Splits a string into runs the way per-glyph font fallback does in the --sans stack. */
export function splitScriptRuns(s: string): ScriptRun[] {
  if (!s) return [];
  const out: ScriptRun[] = [];
  for (const part of s.split(DEVA_RUN_RE)) {
    if (!part) continue;
    out.push({ text: part, devanagari: DEVA_RE.test(part) });
  }
  return out;
}

/**
 * Android only. React Native rounds a font size UP to a whole device pixel
 * (ReactAndroid TextAttributeProps: ceil(toPixelFromDIP(fontSize))), so 14.5 dp on a 2.625x screen is
 * drawn at 39 px instead of 38.06 px: text comes out up to 4 % wider than in the browser and wraps
 * differently. This returns a size that lands on the NEAREST whole device pixel instead (38 px), which
 * is the closest Android can draw. iOS draws fractional sizes exactly and gets the value unchanged.
 * React Native Android rounds lineHeight up to a whole pixel in the same way (CustomLineHeightSpan), so
 * the same snap is right for line heights.
 * <Txt> applies it to fontSize and lineHeight by itself; use it directly for TextInput.
 */
export function fontPx(size: number): number {
  if (Platform.OS !== 'android') return size;
  const pr = PixelRatio.get();
  return (Math.round(size * pr) - 0.01) / pr;
}

/** letter-spacing in em (CSS) to dp. */
export const em = (fontSize: number, v: number): number => Math.round(fontSize * v * 1000) / 1000;
