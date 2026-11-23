// Source: PrepAssist.html L7196-L7210 (renderCurrent: section.cx-hero), L3100-L3130 (.cx-hero … .cx-readbar), L10779-L10790 (<style id="cxcompact">)
// Source: PrepAssist.html L10644-L10651 (planthemes: .cx-hero background and ::after sheen)
// The Current hero ("The Daily Edition"). Computed: reference/android/tab-current, -past-edition, -pro, -ultimate.
//   .cx-hero   padding calc(var(--sat)+10) 20 16, margin 0 -20, radius 0 0 28 28, #fff; ::after (free) vertical
//              hairlines repeating-linear-gradient(90deg, transparent 0 63px, rgba(255,255,255,.035) 63px 64px)
//   .cx-press  absolute right -26 top calc(var(--sat)+2), 130 x 91, opacity .1
//   .cx-eb     Inter 700 10.5 ls 1.68 uppercase #FFD08A (inline: its line box is the div's 22.475)
//   h1         EB Garamond 500 28/28 ls -.28, margin-top 4
//   .cx-cal    40 high, padding 0 10, radius 12, rgba(255,255,255,.12) + blur(8), border 1 rgba(255,255,255,.22), gap 9;
//              icon 18 #FFD27A; span 12.5/18.125 600 opacity .92 baseline gap 5; b Inter Tight 800 17/24.65
//   .cx-date   margin-top 6, Inter 12/17.4 rgba(255,255,255,.78), gap 7; .cx-live 7 px #FF6B6B, dpu 1.8s infinite
//   .cx-sum    margin-top 12, padding 10 12, radius 14, rgba(255,255,255,.08), border 1 rgba(255,255,255,.14), grid auto auto 1fr gap 14
//   .cx-st b   Inter Tight 800 19/19; span 10.5/15.225 opacity .75 margin-top 3
//   .cx-bar    7 high, gap 3, radius 4; .cx-leg margin-top 7, gap 4 10, Inter 600 10.5 rgba(255,255,255,.82), dot 6 + margin-right 4
//   .cx-readbar margin-top 10, gap 10, Inter 600 11.5 rgba(255,255,255,.7); track 3 high rgba(255,255,255,.18); fill #FFD27A (width .6s var(--ease))
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import Svg, { G, Path, Rect } from 'react-native-svg';
import { act } from '../../../actions';
import { Backdrop, Icon } from '../../../components';
import { MONS } from '../../../data';
import type { ArticlesItem } from '../../../data';
import { useAppSize } from '../../../shell/AppSize';
import { easeCss, easeVar, useTransition } from '../../../shell/anim';
import { font, Txt, useInsets, usePlan } from '../../../theme';
import { PLAN_HERO_BG, PlanSheen } from '../home/HomeSky';
import { dayOfYear, fmtLong, gsColor, gsCounts, GS_KEYS, gsRoman } from './currentLogic';

const FREE_BG =
  'radial-gradient(90% 70% at 100% 0%, rgba(79,176,236,0.55) 0%, transparent 60%), radial-gradient(60% 50% at 0% 100%, rgba(245,160,31,0.18), transparent 70%), linear-gradient(165deg, #0E2340 0%, #14304F 50%, #1B4C7C 100%)';

/** .cx-live: `dpu 1.8s infinite` from box-shadow 0 0 0 0 rgba(255,107,107,.6) to 0 0 0 8px transparent at 70 %. */
function Live(): React.JSX.Element {
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withRepeat(withSequence(withTiming(1, { duration: 1260, easing: easeCss }), withTiming(2, { duration: 540, easing: easeCss })), -1);
  }, [p]);
  const ring = useAnimatedStyle(() => {
    const spread = p.value <= 1 ? 8 * p.value : 8 * (2 - p.value);
    const a = p.value <= 1 ? 0.6 * (1 - p.value) : 0;
    return { width: 7 + 2 * spread, height: 7 + 2 * spread, borderRadius: 3.5 + spread, left: -spread, top: -spread, backgroundColor: `rgba(255,107,107,${a})` };
  });
  return (
    <View style={styles.live}>
      <Animated.View style={[styles.liveRing, ring]} />
      <View style={styles.liveDot} />
    </View>
  );
}

/** .cx-hero::after (free plan): 1 px hairline every 64 px */
function Hairlines({ width }: { width: number }): React.JSX.Element {
  const n = Math.floor(width / 64);
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {Array.from({ length: n }, (_, i) => (
        <View key={i} style={[styles.hair, { left: 63 + i * 64 }]} />
      ))}
    </View>
  );
}

export function CurrentHero({ sel, isToday, list, readN }: { sel: Date; isToday: boolean; list: readonly ArticlesItem[]; readN: number }): React.JSX.Element {
  const plan = usePlan();
  const { sat } = useInsets();
  const { w } = useAppSize();
  const mins = list.reduce((x, a) => x + a.min, 0);
  const gc = gsCounts(list);
  const pct = list.length ? (readN / list.length) * 100 : 0;
  const rv = useTransition(pct, 600, easeVar);
  const fill = useAnimatedStyle(() => ({ width: `${rv.value}%` }));
  return (
    <View style={[styles.hero, { paddingTop: sat + 10, backgroundImage: plan === 'free' ? FREE_BG : PLAN_HERO_BG[plan] }]} testID="current.hero">
      {plan === 'free' ? <Hairlines width={w} /> : <PlanSheen plan={plan} width={w} />}
      <View style={[styles.press, { top: sat + 2 }]} pointerEvents="none">
        <Svg width={130} height={91} viewBox="0 0 200 140">
          <G fill="none" stroke="#fff" strokeWidth={1.3} strokeLinecap="round">
            <Rect x={40} y={18} width={120} height={104} rx={4} />
            <Path d="M52 34h96M52 44h96" strokeWidth={3} />
            <Path d="M52 60h44M52 68h44M52 76h44M52 84h44M52 92h30M104 60h44M104 68h44M104 76h44M104 84h44M104 92h36M52 106h96" />
          </G>
        </Svg>
      </View>
      <View style={styles.top}>
        <View>
          <Txt style={styles.eb}>The Daily Edition · No. {dayOfYear(sel)}</Txt>
          <Txt style={styles.h1}>Current</Txt>
        </View>
        <Pressable style={styles.cal} onPress={() => act('caCal')} accessibilityLabel="Pick an edition date" testID="current.cal">
          <Backdrop px={8} tint="rgba(255,255,255,0.12)" />
          <Icon name="calendar" size={18} color="#FFD27A" />
          <View style={styles.calSpan}>
            <Txt style={styles.calB}>{sel.getDate()}</Txt>
            <Txt style={styles.calT}>
              {MONS[sel.getMonth()]} {sel.getFullYear()}
            </Txt>
          </View>
        </Pressable>
      </View>
      <View style={styles.date}>
        {isToday ? <Live /> : null}
        <Txt style={styles.dateT}>
          {isToday ? 'Today’s paper' : 'Archive edition'} · {fmtLong(sel)}
        </Txt>
      </View>
      <View style={styles.sum}>
        <View>
          <Txt style={styles.stB}>{list.length}</Txt>
          <Txt style={styles.stS}>stories</Txt>
        </View>
        <View>
          <Txt style={styles.stB}>{mins}</Txt>
          <Txt style={styles.stS}>min read</Txt>
        </View>
        <View style={styles.gsb}>
          <View style={styles.bar}>
            {GS_KEYS.filter(g => gc[g]).map(g => (
              <View key={g} style={[styles.barI, { flex: gc[g], backgroundColor: gsColor(g) }]} />
            ))}
          </View>
          <View style={styles.leg}>
            {GS_KEYS.filter(g => gc[g]).map(g => (
              <View key={g} style={styles.legI}>
                <View style={[styles.legDot, { backgroundColor: gsColor(g) }]} />
                <Txt style={styles.legT}>
                  GS {gsRoman(g)} · {gc[g]}
                </Txt>
              </View>
            ))}
          </View>
        </View>
      </View>
      <View style={styles.readbar}>
        <Txt style={styles.readT}>
          {readN} of {list.length} read
        </Txt>
        <View style={styles.readTrack}>
          <Animated.View style={[styles.readFill, fill]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { marginHorizontal: -20, paddingHorizontal: 20, paddingBottom: 16, borderBottomLeftRadius: 28, borderBottomRightRadius: 28, overflow: 'hidden' },
  hair: { position: 'absolute', top: 0, bottom: 0, width: 1, backgroundColor: 'rgba(255,255,255,0.035)' },
  press: { position: 'absolute', right: -26, opacity: 0.1 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  eb: { ...font('sans', 700), fontSize: 10.5, lineHeight: 22.475, letterSpacing: 1.68, textTransform: 'uppercase', color: '#FFD08A' },
  h1: { ...font('book', 500), fontSize: 28, lineHeight: 28, letterSpacing: -0.28, color: '#fff', marginTop: 4 },
  cal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    overflow: 'hidden',
  },
  calSpan: { flexDirection: 'row', alignItems: 'baseline', gap: 5, opacity: 0.92 },
  calB: { ...font('serif', 800), fontSize: 17, lineHeight: 24.65, color: '#fff' },
  calT: { ...font('sans', 600), fontSize: 12.5, lineHeight: 18.125, color: '#fff' },
  date: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 6 },
  dateT: { fontSize: 12, lineHeight: 17.4, color: 'rgba(255,255,255,0.78)' },
  live: { width: 7, height: 7 },
  liveRing: { position: 'absolute' },
  liveDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#FF6B6B' },
  sum: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  stB: { ...font('serif', 800), fontSize: 19, lineHeight: 19, color: '#fff' },
  stS: { fontSize: 10.5, lineHeight: 15.225, opacity: 0.75, marginTop: 3, color: '#fff' },
  gsb: { flex: 1, minWidth: 0 },
  bar: { flexDirection: 'row', gap: 3, height: 7, borderRadius: 4, overflow: 'hidden' },
  barI: { borderRadius: 2 },
  leg: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 4, columnGap: 10, marginTop: 7 },
  legI: { flexDirection: 'row', alignItems: 'center' },
  legDot: { width: 6, height: 6, borderRadius: 3, marginRight: 4 },
  legT: { ...font('sans', 600), fontSize: 10.5, lineHeight: 15.225, color: 'rgba(255,255,255,0.82)' },
  readbar: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 },
  readT: { ...font('sans', 600), fontSize: 11.5, lineHeight: 16.675, color: 'rgba(255,255,255,0.7)' },
  readTrack: { flex: 1, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.18)', overflow: 'hidden' },
  readFill: { height: 3, borderRadius: 2, backgroundColor: '#FFD27A' },
});
