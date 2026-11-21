// Source: PrepAssist.html L4089-L4093 (.tq-busy, .mv-proc, .tq-bh, .tq-s), L3551 (.by-spin), L8148 (tqGo box), L8219 (mvProcess box)
// PRIVATE COPIES of the shared-in-HTML `.tq-busy` / `.mv-proc` step list and `.by-spin` spinner
// (see CONTRACT.md section 4). Computed (reference/android view-mains-evaluating, view-testquiz-building):
//   box      margin-top 16 (collapses with #mvRun's 18), padding 16, radius 18, #fff, box-shadow 0 0 0 1px #E6EBF1
//   .tq-bh   row, centred, gap 10, margin-bottom 8; b Inter 700 14.5px / 21.025px
//   .by-spin 54 x 54 circle, 4px #EAF4FC with the top border #1B8AD3, `animation: sp .8s linear infinite`
//   .tq-s    row, centred, gap 9, padding 6 0; Inter 400 13.5px / 19.575px #98A1AD; `transition: color .3s`
//            icon 16 (12 + padding 2), round, #EEF2F7, stroke transparent; .ok: text #14161C, icon #2F8A4A / #fff
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, { Easing, interpolateColor, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { Icon } from '../../../components';
import { easeCss, useTransition } from '../../../shell/anim';
import { font, Txt } from '../../../theme';

const s = StyleSheet.create({
  box: { padding: 16, borderRadius: 18, backgroundColor: '#FFFFFF', boxShadow: '0px 0px 0px 1px #E6EBF1' },
  bh: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  bhB: { ...font('sans', 700), fontSize: 14.5, lineHeight: 21.025 },
  spin: { width: 54, height: 54, borderRadius: 27, borderWidth: 4, borderColor: '#EAF4FC', borderTopColor: '#1B8AD3' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 9, paddingVertical: 6 },
  ic: { width: 16, height: 16, borderRadius: 8, padding: 2 },
  t: { fontSize: 13.5, lineHeight: 19.575 },
});

/** `.by-spin` */
export function BySpin(): React.JSX.Element {
  const r = useSharedValue(0);
  useEffect(() => {
    r.value = withRepeat(withTiming(1, { duration: 800, easing: Easing.linear }), -1, false);
  }, [r]);
  const a = useAnimatedStyle(() => ({ transform: [{ rotate: `${r.value * 360}deg` }] }));
  return <Animated.View style={[s.spin, a]} />;
}

function Step({ label, ok }: { label: string; ok: boolean }): React.JSX.Element {
  const v = useTransition(ok ? 1 : 0, 300, easeCss);
  // colour transition .3s: the #14161C text fades in over the #98A1AD one (same glyphs, so the blend is the colour mix)
  const tx = useAnimatedStyle(() => ({ opacity: v.value }));
  const bg = useAnimatedStyle(() => ({ backgroundColor: interpolateColor(v.value, [0, 1], ['#EEF2F7', '#2F8A4A']) }));
  return (
    <View style={s.row}>
      <Animated.View style={[s.ic, bg]}>
        <Animated.View style={tx}>
          <Icon name="check" size={12} color="#FFFFFF" />
        </Animated.View>
      </Animated.View>
      <View>
        <Txt style={[s.t, { color: '#98A1AD' }]}>{label}</Txt>
        <Animated.View style={[StyleSheet.absoluteFill, tx]}>
          <Txt style={[s.t, { color: '#14161C' }]}>{label}</Txt>
        </Animated.View>
      </View>
    </View>
  );
}

/** The busy box: header with spinner, then the steps; the first `done` rows have `.ok`. */
export function ProcBox({ title, steps, done, style }: { title: string; steps: string[]; done: number; style?: StyleProp<ViewStyle> }): React.JSX.Element {
  return (
    <View style={[s.box, style]}>
      <View style={s.bh}>
        <BySpin />
        <Txt style={s.bhB}>{title}</Txt>
      </View>
      {steps.map((x, k) => (
        <Step key={k} label={x} ok={k < done} />
      ))}
    </View>
  );
}
