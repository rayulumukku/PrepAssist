// Source: PrepAssist.html L6591-L6636 (the `.pg-hero` / `.sec` blocks of VIEWS.engine, tests, history, pastevals, qbank)
// PRIVATE COPY of the shared-in-HTML `.pg-hero` and `.sec` (see CONTRACT.md section 4).
// Computed (reference/android view-engine, view-tests, view-history, view-pastevals, view-qbank):
//   .pg-hero   padding 8 20 18
//     h1       EB Garamond 500 28px / 30.8px, letter-spacing -0.28px, #14161C
//     p        Inter 400 13.5px / 20.25px #7A8494, margin-top 8
//   .sec       padding 0 20
import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { font, Txt } from '../../../theme';

const s = StyleSheet.create({
  hero: { paddingTop: 8, paddingHorizontal: 20, paddingBottom: 18 },
  h1: { ...font('book', 500), fontSize: 28, lineHeight: 30.8, letterSpacing: -0.28, color: '#14161C' },
  p: { fontSize: 13.5, lineHeight: 20.25, color: '#7A8494', marginTop: 8 },
  sec: { paddingHorizontal: 20 },
});

export function PgHero({ title, sub, before, h1Style }: { title: React.ReactNode; sub: string; before?: React.ReactNode; h1Style?: StyleProp<TextStyle> }): React.JSX.Element {
  return (
    <View style={s.hero}>
      {before}
      <Txt style={[s.h1, h1Style]}>{title}</Txt>
      <Txt style={s.p}>{sub}</Txt>
    </View>
  );
}

export function Sec({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }): React.JSX.Element {
  return <View style={[s.sec, style]}>{children}</View>;
}
