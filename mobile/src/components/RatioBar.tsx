// Source: PrepAssist.html L2787-L2792 (.rb, .rb b, .rb .tr, .rb .tr i, .rb .tr::after, .rb span), L3010-L3010 (fill colour)
// A labelled progress row: label, track with a fill, value. Used in sheets (coverage, credits) and in
// practice / study views. Computed (reference/android/sheet-coverage .rb):
//   .rb     three columns (label width, flexible track, value width) with gap 12px, centred; padding 10px 0;
//           border-bottom 1px solid --rule. The column widths are set inline per use
//           (`grid-template-columns:110px 1fr 40px`; the class default is 96px 1fr 40px).
//   b       Inter 600 13.5px / 19.575px
//   .tr     6px high, radius 3px, --paper-3, overflow hidden
//   i       the fill from the left: width in %, radius 3px, colour inline per use (class default --brand)
//   ::after a 1px --brand line at 70% of the track (drawn only within the track: overflow is hidden)
//   span    Inter 600 13.5px / 19.575px, right aligned, tabular numbers
// The fill has `transition: width 1s var(--ease)`. Whether a given use animates it from 0 depends on that
// screen's render code (the inline width is in the markup from the start in SHEETS.coverage and
// SHEETS.credits, so nothing moves there); a screen that animates passes a changing `percent`.
import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { DimensionValue, StyleProp, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useTransition } from '../shell/anim';
import { font } from '../theme/fonts';
import { palettes } from '../theme/tokens';
import { Txt } from '../theme/Txt';
import { useTheme } from '../theme/useTheme';

export interface RatioBarProps {
  /** `<b>` */
  label: string;
  /** fill width, 0-100 (the inline `width:N%`) */
  percent: number;
  /** `<span>` */
  value: string;
  /** inline `background` of the fill. Default --brand. */
  color?: string;
  /** first and last column of grid-template-columns. Defaults 96 and 40 (the class rule). */
  labelWidth?: number;
  valueWidth?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const C = palettes.free;
const styles = StyleSheet.create({
  rb: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.rule },
  b: { ...font('sans', 600), fontSize: 13.5, lineHeight: 19.575 },
  tr: { flex: 1, height: 6, borderRadius: 3, backgroundColor: C.paper3, overflow: 'hidden' },
  fill: { position: 'absolute', left: 0, top: 0, bottom: 0, borderRadius: 3 },
  mark: { position: 'absolute', left: '70%', top: 0, bottom: 0, width: 1 },
  span: { ...font('sans', 600), fontSize: 13.5, lineHeight: 19.575, textAlign: 'right', fontVariant: ['tabular-nums'] },
});

export function RatioBar({ label, percent, value, color, labelWidth = 96, valueWidth = 40, style, testID }: RatioBarProps): React.JSX.Element {
  const theme = useTheme();
  const w = useTransition(percent, 1000);
  const fill = useAnimatedStyle(() => ({ width: `${w.value}%` as DimensionValue }));
  return (
    <View style={[styles.rb, style]} testID={testID}>
      <Txt style={[styles.b, { width: labelWidth }]}>{label}</Txt>
      <View style={styles.tr}>
        <Animated.View style={[styles.fill, { backgroundColor: color ?? theme.brand }, fill]} />
        <View style={[styles.mark, { backgroundColor: theme.brand }]} />
      </View>
      <Txt style={[styles.span, { width: valueWidth }]}>{value}</Txt>
    </View>
  );
}
