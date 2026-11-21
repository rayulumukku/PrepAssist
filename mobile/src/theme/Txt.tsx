// Source: PrepAssist.html L33-L33 (body{font-family:var(--sans);color:var(--ink);font-size:15.5px;line-height:1.45})
// Text primitive. Not a visual component of its own: a wrapper around Text that
//   1. never scales with the OS font size (allowFontScaling={false}), so layout matches the prototype;
//   2. gives top-level text the body defaults the HTML inherits everywhere: Inter 400, 15.5 px,
//      line-height 22.475 px (15.5 x 1.45), colour --ink. Nested <Txt> inherits from its parent <Txt>,
//      like an inline element;
//   3. draws Devanagari the way the --sans stack does ('Inter','Noto Sans Devanagari',…): the browser
//      takes Latin glyphs from Inter and Devanagari glyphs from Noto Sans Devanagari at the matching
//      weight. A string child set in an Inter face is split into script runs and the Devanagari runs
//      get the Noto face. Pass `systemDevanagari` for text whose CSS stack has no Noto Sans Devanagari
//      (--read, and any non-Inter family is left alone automatically): the browser fell back to a
//      system font there, and so does the device;
//   4. on Android, snaps the font size to the nearest whole device pixel (see fontPx in fonts.ts:
//      React Native would otherwise round it up, making text up to 4 % too wide), and does the same for
//      lineHeight (React Native Android rounds that up too, which adds up over many lines);
//   5. on Android, breaks lines greedily (textBreakStrategy="simple") like a browser does. Android's
//      default "highQuality" strategy balances line lengths and wraps the same text differently.
import React, { createContext, useContext } from 'react';
import { Platform, StyleSheet, Text } from 'react-native';
import type { TextProps } from 'react-native';
import { devanagariFaceFor, fontPx, hasDevanagari, splitScriptRuns } from './fonts';
import { metrics, palettes } from './tokens';

export interface TxtProps extends TextProps {
  /** The CSS font stack of this text has no Noto Sans Devanagari: do not swap faces for Devanagari runs. */
  systemDevanagari?: boolean;
}

/** fontFamily of the nearest <Txt> ancestor; null outside any <Txt>. */
const FamilyContext = createContext<string | null>(null);

const styles = StyleSheet.create({
  body: {
    fontFamily: 'Inter-Regular',
    fontSize: metrics.bodySize,
    lineHeight: metrics.bodyLine,
    color: palettes.free.ink, // --ink is the same in all three plan themes
  },
});

function withRuns(children: React.ReactNode, family: string): React.ReactNode {
  const deva = devanagariFaceFor(family);
  if (!deva) return children;
  const one = (child: React.ReactNode, key: number): React.ReactNode => {
    if (typeof child !== 'string' || !hasDevanagari(child)) return child;
    return splitScriptRuns(child).map((r, i) =>
      r.devanagari ? (
        <Text key={`${key}.${i}`} allowFontScaling={false} style={{ fontFamily: deva }}>
          {r.text}
        </Text>
      ) : (
        r.text
      ),
    );
  };
  return Array.isArray(children) ? children.map(one) : one(children, 0);
}

export function Txt({ style, children, systemDevanagari, ...rest }: TxtProps): React.JSX.Element {
  const parentFamily = useContext(FamilyContext);
  const flat = StyleSheet.flatten(style) as { fontFamily?: string; fontSize?: number; lineHeight?: number } | undefined;
  const family = flat?.fontFamily ?? parentFamily ?? 'Inter-Regular';
  const nested = parentFamily !== null;
  const size = flat?.fontSize ?? (nested ? undefined : metrics.bodySize);
  const line = flat?.lineHeight ?? (nested ? undefined : metrics.bodyLine);
  const snapped =
    Platform.OS === 'android'
      ? { ...(size !== undefined ? { fontSize: fontPx(size) } : null), ...(line !== undefined ? { lineHeight: fontPx(line) } : null) }
      : null;
  return (
    <FamilyContext.Provider value={family}>
      <Text
        allowFontScaling={false}
        textBreakStrategy="simple"
        {...rest}
        style={nested ? [style, snapped] : [styles.body, style, snapped]}>
        {systemDevanagari ? children : withRuns(children, family)}
      </Text>
    </FamilyContext.Provider>
  );
}
