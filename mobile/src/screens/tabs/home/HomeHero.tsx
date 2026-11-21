// Source: PrepAssist.html L6091-L6095 (renderHome: .d-annh + section#hero), L6035-L6042 (bannerHTML), L6167-L6189 (initHero, heroGo)
// Source: PrepAssist.html L2292-L2322 (.hero, .hero-track, .hero-pg, @keyframes pgfill), L3021 (.hero-pg button.on i brand), L1812-L1814, L1838-L1853 (.bn.ann2, .a2-*)
// The announcements carousel. Computed (reference/android/tab-home, tab-home-hero-1..4):
//   #hero        margin 12 -20 0; .hero-track flex, gap 12, padding 0 20, scroll-snap x mandatory
//   .bn.ann2     372 x 150 (100 % of the track's content box), padding 16 18 14, radius 18, #fff,
//                shadow 0 0 0 1px #E3E8EF, 0 12px 24px -22px rgba(20,40,70,.5)
//   .a2-k        Inter 700 10.5/15.225 ls 1.47 uppercase var(--ac); ::before 14 x 1.5 var(--ac); .live #D93A3F + 6 px dot
//   .a2-ic       32 x 32 radius 9 border 1 #E3E8EF, icon 16 var(--ac)
//   h3           EB Garamond 500 20/25.6 ls -.1, margin-top 8, max-width 92 %, 2 lines
//   .a2-foot     margin-top auto, padding-top 10, border-top 1 #EEF2F6; .a2-cta Inter 700 13.5/19.575 + arrow 14 var(--ac); .a2-no EB Garamond italic 13.5 #AEB7C3
//   .hero-pg     padding 12 20 0, gap 6; button 14 x 3 radius 2 var(--rule-2), .on 30 wide (width .35s var(--ease));
//                .on i var(--brand), pgfill 6s linear forwards (paused while .hero.paused); .count margin-left auto 11.5/16.675 muted tabular-nums
// The `.a2-k.live i` dot runs `dpu 1.6s` from no box-shadow to a transparent one: nothing visible, not drawn.
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import type { NativeScrollEvent, NativeSyntheticEvent, ScrollViewInstance } from 'react-native';
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { act } from '../../../actions';
import { Icon } from '../../../components';
import type { IconName } from '../../../icons/iconPaths.generated';
import { ANN, ANN_IC, BANNERS } from '../../../data';
import { useAppSize } from '../../../shell/AppSize';
import { easeVar, useTransition } from '../../../shell/anim';
import { getS, setS } from '../../../store';
import { font, palettes, Txt, useTheme } from '../../../theme';
import { heroCtl } from './heroCtl';

function Banner({ i, width }: { i: number; width: number }): React.JSX.Element {
  const b = BANNERS[i];
  const a = ANN[b.art] || ANN.plan;
  const live = b.art === 'live';
  const icon = ((ANN_IC as unknown as Record<string, string>)[b.art] || 'bell') as IconName;
  return (
    <Pressable
      style={[styles.bn, { width }]}
      onPress={() => act(b.act)}
      accessibilityLabel={`Announcement ${i + 1} of ${BANNERS.length}: ${b.title}`}
      testID={`home.banner.${i}`}
    >
      <View style={styles.top}>
        <View style={styles.k}>
          {live ? <View style={styles.liveDot} /> : <View style={[styles.kLine, { backgroundColor: a.c }]} />}
          <Txt style={[styles.kT, { color: live ? '#D93A3F' : a.c }]}>{a.k}</Txt>
        </View>
        <View style={styles.ic}>
          <Icon name={icon} size={16} color={a.c} />
        </View>
      </View>
      <Txt style={styles.h3} numberOfLines={2}>
        {b.title}
      </Txt>
      <View style={styles.foot}>
        <View style={styles.cta}>
          <Txt style={styles.ctaT}>{b.cta}</Txt>
          <Icon name="arrow" size={14} color={a.c} />
        </View>
        <Txt style={styles.no}>0{i + 1}</Txt>
      </View>
    </Pressable>
  );
}

/** One `.hero-pg button`: width transition and the pgfill bar of the current one. */
function Dot({ on, gen, paused, brand, i }: { on: boolean; gen: number; paused: boolean; brand: string; i: number }): React.JSX.Element {
  const w = useTransition(on ? 30 : 14, 350, easeVar);
  const fill = useSharedValue(0);
  useEffect(() => {
    // setDot restarts the animation (animation:none; reflow; animation:'')
    cancelAnimation(fill);
    fill.value = 0;
    if (on) fill.value = withTiming(1, { duration: 6000, easing: Easing.linear });
  }, [on, gen, fill]);
  const pausedAt = useRef<number | null>(null);
  useEffect(() => {
    if (!on) return;
    if (paused) {
      pausedAt.current = fill.value;
      cancelAnimation(fill);
    } else if (pausedAt.current !== null) {
      const from = pausedAt.current;
      pausedAt.current = null;
      fill.value = withTiming(1, { duration: 6000 * (1 - from), easing: Easing.linear });
    }
  }, [paused, on, fill]);
  const box = useAnimatedStyle(() => ({ width: w.value }));
  const bar = useAnimatedStyle(() => ({ width: `${fill.value * 100}%` }));
  return (
    <Pressable onPress={() => act('heroGo:' + i)} accessibilityLabel={`Show banner ${i + 1}`} testID={`home.heroDot.${i}`}>
      <Animated.View style={[styles.dot, box]}>{on ? <Animated.View style={[styles.dotFill, { backgroundColor: brand }, bar]} /> : null}</Animated.View>
    </Pressable>
  );
}

export function HomeHero(): React.JSX.Element {
  const t = useTheme();
  const { w } = useAppSize();
  const cardW = w - 40;
  const step = cardW + 12;
  const track = useRef<ScrollViewInstance>(null);
  const [dot, setDotState] = useState({ i: 0, gen: 0 });
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const pauseT = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const scrollT = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const setDot = useCallback((i: number) => {
    setS({ hero: i });
    setDotState(d => ({ i, gen: d.gen + 1 }));
  }, []);
  const go = useCallback(
    (i: number) => {
      // tr.scrollTo({ left: card.offsetLeft - 20, behavior: 'smooth' })
      track.current?.scrollTo({ x: i * step, animated: true });
      setDot(i);
    },
    [step, setDot],
  );
  const auto = useCallback(() => {
    clearInterval(timer.current);
    timer.current = setInterval(() => {
      const s = getS();
      if (s.tab === 'home' && s.stage === 'app' && !s.stack.length) go((s.hero + 1) % BANNERS.length);
    }, 6000);
  }, [go]);
  useEffect(() => {
    heroCtl.go = go;
    setDot(0);
    auto();
    return () => {
      clearInterval(timer.current);
      clearTimeout(pauseT.current);
      clearTimeout(scrollT.current);
      if (heroCtl.go === go) heroCtl.go = undefined;
    };
  }, [go, auto, setDot]);

  const pause = (): void => {
    setPaused(true);
    clearInterval(timer.current);
    clearTimeout(pauseT.current);
    pauseT.current = setTimeout(() => {
      setPaused(false);
      auto();
    }, 7000);
  };
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>): void => {
    const x = e.nativeEvent.contentOffset.x;
    clearTimeout(scrollT.current);
    scrollT.current = setTimeout(() => {
      // Math.round(tr.scrollLeft / (tr.clientWidth - 28))
      const i = Math.round(x / (w - 28));
      if (i !== getS().hero) setDot(Math.min(i, BANNERS.length - 1));
    }, 80);
  };

  return (
    <View style={styles.hero} accessibilityLabel="Announcements">
      <ScrollView
        ref={track}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.track}
        snapToInterval={step}
        snapToAlignment="start"
        decelerationRate="fast"
        onScroll={onScroll}
        scrollEventThrottle={16}
        onTouchStart={pause}
      >
        {BANNERS.map((_, i) => (
          <Banner key={i} i={i} width={cardW} />
        ))}
      </ScrollView>
      <View style={styles.pg}>
        {BANNERS.map((_, i) => (
          <Dot key={i} i={i} on={dot.i === i} gen={dot.gen} paused={paused} brand={t.brand} />
        ))}
        <Txt style={styles.count}>{`0${dot.i + 1} / 0${BANNERS.length}`}</Txt>
      </View>
    </View>
  );
}

const INK = '#14161C';
const styles = StyleSheet.create({
  hero: { marginTop: 12, marginHorizontal: -20 },
  track: { paddingHorizontal: 20, gap: 12 },
  bn: {
    height: 150,
    paddingTop: 16,
    paddingHorizontal: 18,
    paddingBottom: 14,
    borderRadius: 18,
    backgroundColor: '#fff',
    boxShadow: '0px 0px 0px 1px #E3E8EF, 0px 12px 24px -22px rgba(20, 40, 70, 0.5)',
  },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  k: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  kLine: { width: 14, height: 1.5 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#D93A3F' },
  kT: { ...font('sans', 700), fontSize: 10.5, lineHeight: 15.225, letterSpacing: 1.47, textTransform: 'uppercase' },
  ic: { width: 32, height: 32, borderRadius: 9, borderWidth: 1, borderColor: '#E3E8EF', alignItems: 'center', justifyContent: 'center' },
  h3: { ...font('book', 500), fontSize: 20, lineHeight: 25.6, letterSpacing: -0.1, color: INK, marginTop: 8, maxWidth: '92%' },
  foot: {
    marginTop: 'auto',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEF2F6',
  },
  cta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  ctaT: { ...font('sans', 700), fontSize: 13.5, lineHeight: 19.575, color: INK },
  no: { ...font('book', 400, true), fontSize: 13.5, lineHeight: 19.575, color: '#AEB7C3' },
  pg: { flexDirection: 'row', gap: 6, paddingTop: 12, paddingHorizontal: 20 },
  dot: { height: 3, borderRadius: 2, backgroundColor: palettes.free.rule2, overflow: 'hidden' },
  dotFill: { position: 'absolute', left: 0, top: 0, bottom: 0 },
  count: { marginLeft: 'auto', fontSize: 11.5, lineHeight: 16.675, color: palettes.free.muted, fontVariant: ['tabular-nums'] },
});
