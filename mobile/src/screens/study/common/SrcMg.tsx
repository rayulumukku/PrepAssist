// Source: PrepAssist.html L7178 (srcMg), L3137 (.cx-mg), L3140 (.cx-mg[style*="0E7490"]::after, the PIB tricolour)
// Private copy (study area) of the Current tab's source monogram `.cx-mg`. Context rules change its
// size (`.ar-src .cx-mg` L3225, `.sv-src .cx-mg`): pass them through `style` / `textStyle`.
// Computed base (reference/android/tab-current .cx-mg): grid, centred; min-width 28, height 28, padding 0 4,
// radius 8, background var(--m), EB Garamond 700 11.5px, letter-spacing .02em, #fff, overflow hidden.
import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { SRC } from '../../../data';
import { em, font, Txt } from '../../../theme';

export interface SrcMgProps {
  /** SRC key (srcMg(s)); unknown keys fall back to PIB like the HTML. */
  src?: string;
  /** Explicit `--m` colour (the saved-link monogram uses `--m:#475467`). */
  color?: string;
  /** Content instead of the SRC monogram text (the saved-link monogram holds ic('link')). */
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const styles = StyleSheet.create({
  mg: {
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 28,
    height: 28,
    paddingHorizontal: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  t: { ...font('book', 700), color: '#FFFFFF', fontSize: 11.5, lineHeight: 16.675, letterSpacing: em(11.5, 0.02) },
  tri: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 3,
    backgroundImage: 'linear-gradient(90deg, #FF9933 33%, #FFFFFF 33%, #FFFFFF 66%, #138808 66%)',
  },
});

export function SrcMg({ src, color, children, style, textStyle }: SrcMgProps): React.JSX.Element {
  const v = (src !== undefined && SRC[src]) || SRC.PIB;
  const m = color ?? v.c;
  return (
    <View style={[styles.mg, { backgroundColor: m }, style]}>
      {children ?? <Txt style={[styles.t, textStyle]}>{v.m}</Txt>}
      {m.toUpperCase() === '#0E7490' ? <View style={styles.tri} /> : null}
    </View>
  );
}
