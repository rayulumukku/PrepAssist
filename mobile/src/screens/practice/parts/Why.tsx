// Source: PrepAssist.html L2731-L2733 (.why, .why h6, .why p), L3049 (.why background)
// PRIVATE COPY of the shared-in-HTML `.why` box (not in src/components; see CONTRACT.md section 4).
// Computed (reference/android view-quiz-results .why, view-engine .why):
//   .why     margin 24px 0 (inline margin-top overrides per use); padding 18; radius 12; --brand-tint
//   h6       Inter 700 10.5px / 15.225px, letter-spacing 1.68px, uppercase, --brand-deep, margin-bottom 8
//   p        Inter 400 14.5px / 22.475px, --ink-2
import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { font, palettes, Txt, useTheme } from '../../../theme';

const s = StyleSheet.create({
  why: { marginVertical: 24, padding: 18, borderRadius: 12 },
  h6: { ...font('sans', 700), fontSize: 10.5, lineHeight: 15.225, letterSpacing: 1.68, textTransform: 'uppercase', marginBottom: 8 },
  p: { fontSize: 14.5, lineHeight: 22.475, color: palettes.free.ink2 },
});

export function Why({ title, children, style }: { title: string; children: React.ReactNode; style?: StyleProp<ViewStyle> }): React.JSX.Element {
  const t = useTheme();
  return (
    <View style={[s.why, { backgroundColor: t.brandTint }, style]}>
      <Txt style={[s.h6, { color: t.brandDeep }]}>{title}</Txt>
      <Txt style={s.p}>{children}</Txt>
    </View>
  );
}
