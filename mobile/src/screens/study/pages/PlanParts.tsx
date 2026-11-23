// Source: PrepAssist.html L6641 (.rb rows of VIEWS.plan), L2787-L2792 (.rb), L2218-L2219 (.spin, @keyframes sp), L2731-L2733 (.why), L2964-L2970 (.plan-ph, .pp), L7051-L7059 (planResult)
// Private pieces of the plan page (study area, pages group).
//   PlanRb   `.rb` whose <b> holds a coloured label AND a block <small> (the shared RatioBar takes a plain string
//            label and has no label colour, so this row is ported here). Computed (reference/android/view-plan):
//            row, centred, gap 12, padding 10 0, border-bottom --rule; b 96 wide Inter 600 13.5px / 19.575px in the
//            subject colour, small block Inter 400 11.5px / 16.675px --muted; .tr 6px radius 3 --paper-3 with the
//            fill (radius 3, subject colour) and the 1px --brand mark at 70%; span 40 wide, 600 13.5px, right, tabular
//   Spin     `.spin` 18 x 18 round, 2px rgba(255,255,255,.35) with a #fff top, rotating 360deg in .8s linear, forever
//   Why      `.why` margin 24px 0, padding 18, radius 12, --brand-tint; h6 Inter 700 10.5px / 15.225px ls 1.68px
//            uppercase --brand-deep, margin-bottom 8; p 14.5px / 22.475px --ink-2
//   PlanPhases `.plan-ph` padding-left 26, margin-top 10 (collapses into .why's 24); ::before 1px --rule-2 at left 8,
//            top 6, bottom 6. `.pp` padding-bottom 22, animation tabIn .5s var(--ease) backwards, delay i*150ms;
//            ::before 11 x 11 dot in --c at left -23 / top 4 with a 4px #fff ring (box-shadow 0 0 0 4px);
//            .k Inter 700 10.5px, ls 1.47px, uppercase, --c, inline in the .pp's 22.475px line;
//            h4 Inter Tight 700 20px / 29px ls -0.5px, margin-top 3; p 13.5px / 19.575px --ink-2, margin-top 4;
//            .bars row, gap 3, margin-top 10, 5px high: round(days/3) bars, flex 1, radius 2, --c, opacity .85
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withTiming } from 'react-native-reanimated';
import { INLINE_planResult_L7052 } from '../../../data';
import { easeVar } from '../../../shell/anim';
import { cssColor, font, palettes, Txt, useTheme } from '../../../theme';

const C = palettes.free;

const styles = StyleSheet.create({
  rb: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.rule },
  label: { width: 96 },
  b: { ...font('sans', 600), fontSize: 13.5, lineHeight: 19.575 },
  small: { ...font('sans', 400), fontSize: 11.5, lineHeight: 16.675, color: C.muted },
  tr: { flex: 1, height: 6, borderRadius: 3, backgroundColor: C.paper3, overflow: 'hidden' },
  fill: { position: 'absolute', left: 0, top: 0, bottom: 0, borderRadius: 3 },
  mark: { position: 'absolute', left: '70%', top: 0, bottom: 0, width: 1 },
  span: { width: 40, ...font('sans', 600), fontSize: 13.5, lineHeight: 19.575, textAlign: 'right', fontVariant: ['tabular-nums'] },
  spin: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: 'rgba(255,255,255,0.35)', borderTopColor: '#FFFFFF' },
  why: { marginVertical: 24, padding: 18, borderRadius: 12 },
  h6: { ...font('sans', 700), fontSize: 10.5, lineHeight: 15.225, letterSpacing: 1.68, textTransform: 'uppercase', marginBottom: 8 },
  whyP: { fontSize: 14.5, lineHeight: 22.475, color: C.ink2 },
  ph: { paddingLeft: 26 },
  phLine: { position: 'absolute', left: 8, top: 6, bottom: 6, width: 1, backgroundColor: C.rule2 },
  pp: { paddingBottom: 22 },
  dot: { position: 'absolute', left: -27, top: 0, width: 19, height: 19, borderRadius: 9.5, borderWidth: 4, borderColor: '#FFFFFF' },
  kLine: { lineHeight: 22.475 },
  k: { ...font('sans', 700), fontSize: 10.5, letterSpacing: 1.47, textTransform: 'uppercase' },
  h4: { ...font('serif', 700), fontSize: 20, lineHeight: 29, letterSpacing: -0.5, marginTop: 3 },
  ppP: { fontSize: 13.5, lineHeight: 19.575, color: C.ink2, marginTop: 4 },
  bars: { flexDirection: 'row', gap: 3, marginTop: 10, height: 5 },
  bar: { flex: 1, borderRadius: 2, opacity: 0.85 },
});

export function PlanRb({ label, sub, percent, color }: { label: string; sub: string; percent: number; color: string }): React.JSX.Element {
  const t = useTheme();
  return (
    <View style={styles.rb}>
      <View style={styles.label}>
        <Txt style={[styles.b, { color }]}>{label}</Txt>
        <Txt style={styles.small}>{sub}</Txt>
      </View>
      <View style={styles.tr}>
        <View style={[styles.fill, { width: `${percent}%`, backgroundColor: color }]} />
        <View style={[styles.mark, { backgroundColor: t.brand }]} />
      </View>
      <Txt style={styles.span}>{`${percent}%`}</Txt>
    </View>
  );
}

/** `<span class="spin"></span>` */
export function Spin(): React.JSX.Element {
  const r = useSharedValue(0);
  useEffect(() => {
    r.value = withRepeat(withTiming(360, { duration: 800, easing: Easing.linear }), -1, false);
  }, [r]);
  const a = useAnimatedStyle(() => ({ transform: [{ rotate: `${r.value}deg` }] }));
  return <Animated.View style={[styles.spin, a]} />;
}

/** One `.pp`: tabIn .5s var(--ease) backwards, delayed i*150ms. */
function Phase({ i, c, k, h, p, days }: { i: number; c: string; k: string; h: string; p: string; days: number }): React.JSX.Element {
  const v = useSharedValue(0);
  useEffect(() => {
    v.value = withDelay(i * 150, withTiming(1, { duration: 500, easing: easeVar }));
  }, [i, v]);
  const a = useAnimatedStyle(() => ({ opacity: v.value, transform: [{ translateY: 6 * (1 - v.value) }] }));
  return (
    <Animated.View style={[styles.pp, a]}>
      <View style={[styles.dot, { backgroundColor: c }]} />
      <Txt style={styles.kLine}>
        <Txt style={[styles.k, { color: c }]}>{k}</Txt>
      </Txt>
      <Txt style={styles.h4}>{h}</Txt>
      <Txt style={styles.ppP}>{p}</Txt>
      <View style={styles.bars}>
        {Array.from({ length: Math.round(days / 3) }, (_, n) => (
          <View key={n} style={[styles.bar, { backgroundColor: c }]} />
        ))}
      </View>
    </Animated.View>
  );
}

/** planResult() minus its two buttons (the screen draws those). */
export function PlanResult(): React.JSX.Element {
  const t = useTheme();
  return (
    <>
      <View style={[styles.why, { backgroundColor: t.brandTint }]}>
        <Txt style={[styles.h6, { color: t.brandDeep }]}>Your plan is ready</Txt>
        <Txt style={styles.whyP}>Based on 6 h/day, 43% coverage and 71% accuracy. You’ll touch every GS topic at least three times before Prelims.</Txt>
      </View>
      <View style={styles.ph}>
        <View style={styles.phLine} />
        {INLINE_planResult_L7052.map((ph, i) => (
          <Phase key={i} i={i} c={cssColor(ph[0], t)} k={ph[1]} h={ph[2]} p={ph[3]} days={ph[4]} />
        ))}
      </View>
    </>
  );
}
