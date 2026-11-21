// Source: PrepAssist.html L10021-L10021 (VIEWS.xray)
// Source: PrepAssist.html L9909-L9933 (x4Reader), L9897-L9908 (x4Dock, x4Sum), L9934-L9955 (x4Mount, x4SyncReader), L9956-L9961 (x4ScrollTo)
// Source: PrepAssist.html L9477-L9528 (.x4-top … .x4-dock), L9651-L9674 (reader v4 overrides), L9701-L9718 (dock v4)
// Focus view: this Screen is the whole page (no .ph header, no scroll wrapper).
//
// OWNER DECISION (IMPLEMENTATION_PLAN.md "Owner decisions", 2026-11-21): the reader SCROLLS. In the
// prototype `.page > .x4-scroll{position:absolute;inset:0;padding:…}` (L9483, L9665, L9718) no longer
// matches, so the scroller grows to its content and ~780 px of the article are clipped. Here the
// scroller fills the page and scrolls; nothing else changes: its content starts at y 0 with no
// padding, exactly as the reference lays it out (the sticky lens bar sits under the header), and ends
// with the summary card (reference/android/view-xray: scroll content 1696.91 px).
//
// Computed (reference/android/view-xray):
//   .x4-top    absolute, 56 high (+ --sat), padding 8 14 10, gap 10, rgba(244,241,234,.92) + blur 14, z 8;
//              .solid (scrollTop > 8): box-shadow 0 1px 0 #E6E0D4, transition .3s ease
//   .ar-ib     38 circle, rgba(255,255,255,.92), shadow 0 0 0 1px rgba(20,30,50,.08), 0 6px 14px -8px rgba(20,30,50,.35)
//   .x4-tt     small 10px 800 / 14.5 ls 1.4 uppercase --sc · b 13.5px 600 / 19.575 nowrap ellipsis, margin-top 1
//   .ar-aa     EB Garamond 600 16.5px / 23.925 #14161C
//   .x4-prog   2.5 high at the bottom of the header, rgba(0,0,0,.05); i = --sc, radius 0 2 2 0, width = scroll %
//   .x4-lens   sticky, padding 6 16 10, gap 6, linear-gradient(#F4F1EA 78%, transparent), z 5
//   .x4-art    margin 14 16 0, padding 24 22 26, radius 20, white, shadow 0 0 0 1px #EEE9DF, 0 18px 30px -26px rgba(40,30,15,.45)
//   .x4-sum    margin 16 16 0, padding 14 16, radius 18, #14304F, gap 14
//   .x4-dock   pill centred at bottom 16 (+ --sab), padding 4, gap 2, rgba(255,255,255,.94) + blur 16
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import type { LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent, ScrollViewInstance } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { act } from '../../actions';
import { Backdrop, Icon } from '../../components';
import type { ViewDef, ViewProps } from '../../navigation/routes';
import { easeCss, useTransition } from '../../shell/anim';
import { getS, useStore } from '../../store';
import { font, useInsets, Txt } from '../../theme';
import { registerReader } from './xray/readerBridge';
import { setX4 } from './xray/x4Actions';
import { initials, ringDash, scanBy, subC, subN, sumInfo } from './xray/x4';
import { XrayPara } from './xray/XrayPara';

const PAPER = '#F4F1EA';

/** VIEWS.xray(id) (L10021): what the reader shows for this push. */
function resolve(arg: string | undefined): { scan: string; cur: number } {
  const x = getS().x4;
  if (arg && getS().XSC.some(s => s.id === arg)) return { scan: arg, cur: x.scan !== arg ? 0 : x.cur };
  return { scan: x.scan, cur: x.cur };
}

function DockDot({ state }: { state: 'c' | 's' | '' }): React.JSX.Element {
  // .x4d-d i: transition all .3s (ease)
  const w = useTransition(state === 'c' ? 16 : 6, 300, easeCss);
  const c = useTransition(state === 'c' ? 2 : state === 's' ? 1 : 0, 300, easeCss);
  const anim = useAnimatedStyle(() => ({
    width: w.value,
    backgroundColor: interpolateColor(c.value, [0, 1, 2], ['#E4DECF', '#9ED3AE', '#E0A800']),
  }));
  return <Animated.View style={[styles.dot, anim]} />;
}

function XrayScreen({ arg }: ViewProps): React.JSX.Element {
  const { sat, sab } = useInsets();
  const init = useMemo(() => resolve(arg), []); // eslint-disable-line react-hooks/exhaustive-deps
  // VIEWS.xray runs once, when the page is pushed
  useLayoutEffect(() => {
    setX4({ scan: init.scan, cur: init.cur, tab: 0 });
  }, [init]);

  const x4 = useStore(s => s.x4);
  const list = useStore(s => s.XSC);
  const sc = scanBy(x4.scan === init.scan ? x4.scan : init.scan, list);
  const cur = x4.scan === init.scan ? x4.cur : init.cur;
  const c = subC(sc.s);
  const nT = Object.keys(sc.terms).length;
  const n = sc.ins.length;
  const sum = sumInfo(sc, x4.seen);

  // ---- scroll: progress bar, .solid header, scroll spy (x4Mount L9934-L9948) ----
  const scrollRef = useRef<ScrollViewInstance>(null);
  const [prog, setProg] = useState(0);
  const [solid, setSolid] = useState(false);
  const geo = useRef({ art: 0, tx: 0, paras: {} as Record<number, number>, lines: {} as Record<number, Record<number, number>>, viewH: 0, contentH: 0, y: 0 });
  const raf = useRef(0);

  const insightTops = useCallback((): Record<number, number> => {
    const g = geo.current;
    const out: Record<number, number> = {};
    for (const [p, tops] of Object.entries(g.lines)) {
      const py = g.paras[Number(p)];
      if (py === undefined) continue;
      for (const [i, y] of Object.entries(tops)) out[Number(i)] = g.art + g.tx + py + y;
    }
    return out;
  }, []);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>): void => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const g = geo.current;
    g.y = contentOffset.y;
    const p = contentSize.height - layoutMeasurement.height;
    setProg(p > 0 ? Math.min(100, (contentOffset.y / p) * 100) : 0);
    setSolid(contentOffset.y > 8);
    if (raf.current || getS().x4.lock) return;
    raf.current = requestAnimationFrame(() => {
      raf.current = 0;
      const mid = g.y + layoutMeasurement.height * 0.42;
      let best = getS().x4.cur;
      let bd = 1e9;
      for (const [i, top] of Object.entries(insightTops())) {
        const d = Math.abs(top - mid);
        if (d < bd) {
          bd = d;
          best = Number(i);
        }
      }
      if (best !== getS().x4.cur) setX4({ cur: best });
    });
  };

  // ---- x4ScrollTo / pulse, reached by the handlers through readerBridge ----
  useEffect(() => {
    registerReader({
      scrollToInsight: i => {
        const top = insightTops()[i];
        if (top === undefined) return;
        scrollRef.current?.scrollTo({ y: Math.max(0, top - 150), animated: true });
      },
      // `.x4-i.pulse` (x4Pulse 1.3s, a box-shadow on an inline element) has no equivalent on a text span
      pulse: () => {},
    });
    return () => registerReader(null);
  }, [insightTops]);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const solidV = useTransition(solid ? 1 : 0, 300, easeCss);
  const solidStyle = useAnimatedStyle(() => ({ opacity: solidV.value }));

  const hdrH = 56 + sat;

  return (
    <View style={styles.x4r} testID="xray">
      <ScrollView
        ref={scrollRef}
        style={StyleSheet.absoluteFill}
        stickyHeaderIndices={[0]}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        onLayout={e => (geo.current.viewH = e.nativeEvent.layout.height)}
        testID="xray.scroll">
        {/* .x4-lens (sticky: the ScrollView wraps sticky children, so the bar sits in a plain wrapper) */}
        <View>
        <View style={styles.lens}>
          {(
            [
              ['all', 'All', null],
              ['ins', 'Insights', n],
              ['term', 'Terms', nT],
            ] as const
          ).map(([k, label, count]) => {
            const on = x4.lens === k;
            return (
              <Pressable key={k} style={[styles.lensB, on && styles.lensBOn]} onPress={() => act('x4Lens', k)} accessibilityRole="tab" testID={`xray.lens.${k}`}>
                <View style={[styles.lensI, k === 'all' ? styles.lensIa : k === 'ins' ? styles.lensIy : styles.lensIc]} />
                <Txt style={[styles.lensTx, on && styles.lensTxOn]}>{label}</Txt>
                {count !== null ? <Txt style={[styles.lensEm, on && styles.lensEmOn]}>{count}</Txt> : null}
              </Pressable>
            );
          })}
        </View>
        </View>

        {/* article.x4-art */}
        <View style={styles.art} onLayout={(e: LayoutChangeEvent) => (geo.current.art = e.nativeEvent.layout.y)}>
          <View style={styles.ebLine}>
            <View style={styles.eb}>
              <View style={[styles.ebI, { backgroundColor: c }]} />
              <Txt style={[styles.ebTx, { color: c }]}>{`${subN(sc.s)} · ${sc.src}`}</Txt>
            </View>
          </View>
          <Txt style={styles.h1}>{sc.t}</Txt>
          <View style={styles.meta}>
            <View style={styles.metaS}>
              <Icon name="calendar" size={14} color="#8A8270" />
              <Txt style={styles.metaTx}>{`Scanned ${sc.d}`}</Txt>
            </View>
            <View style={styles.metaS}>
              <Icon name="clock" size={14} color="#8A8270" />
              <Txt style={styles.metaTx}>{`${sc.min} min read`}</Txt>
            </View>
          </View>
          {x4.coach ? (
            <View style={styles.coach}>
              <Icon name="spark" size={15} color="#C99B1A" />
              <Txt style={styles.coachTx}>
                {'Tap a '}
                <Txt style={styles.coachMark}>{' yellow line '}</Txt>
                {' for its 5-part UPSC breakdown, or a '}
                <Txt style={styles.coachU}>{'blue term'}</Txt>
                {' for its meaning.'}
              </Txt>
              <Pressable style={styles.coachX} onPress={() => act('x4Coach')} accessibilityLabel="Dismiss" testID="xray.coach.close">
                <Icon name="close" size={14} color="#A39C8C" />
              </Pressable>
            </View>
          ) : null}
          <View onLayout={(e: LayoutChangeEvent) => (geo.current.tx = e.nativeEvent.layout.y)}>
            {sc.paras.map((p, k) => (
              <View key={k} onLayout={(e: LayoutChangeEvent) => (geo.current.paras[k] = e.nativeEvent.layout.y)}>
                <XrayPara
                  para={p}
                  scanId={sc.id}
                  seen={x4.seen}
                  cur={cur}
                  lens={x4.lens}
                  fs={x4.fs}
                  onInsightLines={tops => (geo.current.lines[k] = tops)}
                />
              </View>
            ))}
          </View>
          {sc.by ? (
            <View style={styles.by}>
              <View style={styles.byAv}>
                <Txt style={styles.byAvTx}>{initials(sc.by[0])}</Txt>
              </View>
              <View style={styles.byD}>
                <Txt style={styles.byB}>{sc.by[0]}</Txt>
                <Txt style={styles.bySmall}>{sc.by[1]}</Txt>
              </View>
            </View>
          ) : null}
        </View>

        {/* section.x4-sum */}
        <View style={styles.sum}>
          {/* `.x4-sum div{flex:1}` also matches .x4-ring, and `.x4-sum div b{display:block}` beats the ring's grid centring (L9518-L9520) */}
          <View style={styles.ring}>
            <Svg width={52} height={52} viewBox="0 0 52 52">
              <Circle cx={26} cy={26} r={21} fill="none" stroke="rgba(255,255,255,.15)" strokeWidth={5} />
              <Circle cx={26} cy={26} r={21} fill="none" stroke="#FFE27A" strokeWidth={5} strokeLinecap="round" strokeDasharray={ringDash(sum.s / sum.n)} transform="rotate(-90 26 26)" />
            </Svg>
            <Txt style={styles.ringB}>{`${sum.s}/${sum.n}`}</Txt>
          </View>
          <View style={styles.sumD}>
            <Txt style={styles.sumB}>{sum.title}</Txt>
            <Txt style={styles.sumSmall}>{sum.sub}</Txt>
          </View>
          <Pressable style={styles.sumBtn} onPress={() => act(sum.act)} testID="xray.sum.go">
            <Txt style={styles.sumBtnTx}>{sum.btn}</Txt>
          </Pressable>
        </View>
      </ScrollView>

      {/* header.x4-top */}
      <View style={[styles.top, { height: hdrH, paddingTop: sat + 8 }]}>
        <Backdrop px={14} tint="rgba(244, 241, 234, 0.92)" />
        <Animated.View style={[styles.solid, solidStyle]} pointerEvents="none" />
        <Pressable style={styles.ib} onPress={() => act('back')} accessibilityLabel="Back" testID="xray.back">
          <Icon name="back" color="#14161C" />
        </Pressable>
        <View style={styles.tt}>
          <Txt style={[styles.ttSmall, { color: c }]}>{`${subN(sc.s)} X-Ray`}</Txt>
          <Txt style={styles.ttB} numberOfLines={1}>
            {sc.t}
          </Txt>
        </View>
        <Pressable style={styles.ib} onPress={() => act('x4Aa')} accessibilityLabel="Text size" testID="xray.aa">
          <Txt style={styles.aa}>Aa</Txt>
        </Pressable>
        <View style={styles.prog}>
          <View style={[styles.progI, { width: `${prog}%`, backgroundColor: c }]} />
        </View>
      </View>

      {/* nav.x4-dock */}
      <View style={[styles.dockWrap, { bottom: sab + 16 }]} pointerEvents="box-none">
        <View style={styles.dock} testID="xray.dock">
          <Backdrop px={16} tint="rgba(255, 255, 255, 0.94)" />
          <Pressable style={[styles.dockB, cur === 0 && styles.dockOff]} disabled={cur === 0} onPress={() => act('x4Nav', '-1')} accessibilityLabel="Previous insight" testID="xray.dock.prev">
            <Icon name="chevl" size={18} color="#5B6472" />
          </Pressable>
          <Pressable style={styles.mid} onPress={() => act('x4Open')} accessibilityLabel={`Open insight ${cur + 1} of ${n}`} testID="xray.dock.open">
            <View style={styles.dl}>
              <Txt style={styles.dlTx}>{'Insight '}</Txt>
              <Txt style={styles.dlB}>{cur + 1}</Txt>
              <Txt style={styles.dlTx}>{`/${n}`}</Txt>
            </View>
            <View style={styles.dd}>
              {sc.ins.map((_, i) => (
                <DockDot key={i} state={i === cur ? 'c' : x4.seen[sc.id + ':' + i] ? 's' : ''} />
              ))}
            </View>
            <View style={styles.dO}>
              <Icon name="spark" size={18} color="#3D2E00" />
            </View>
          </Pressable>
          <Pressable style={[styles.dockB, cur === n - 1 && styles.dockOff]} disabled={cur === n - 1} onPress={() => act('x4Nav', '1')} accessibilityLabel="Next insight" testID="xray.dock.next">
            <Icon name="chev" size={18} color="#5B6472" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  x4r: { flex: 1, backgroundColor: PAPER },
  top: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingBottom: 10,
  },
  solid: { position: 'absolute', left: 0, right: 0, bottom: -1, height: 1, backgroundColor: '#E6E0D4' },
  ib: {
    width: 38,
    height: 38,
    borderRadius: 19,
    flexShrink: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    boxShadow: '0px 0px 0px 1px rgba(20, 30, 50, 0.08), 0px 6px 14px -8px rgba(20, 30, 50, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tt: { flex: 1, minWidth: 0, alignItems: 'center' },
  ttSmall: { ...font('sans', 800), fontSize: 10, lineHeight: 14.5, letterSpacing: 1.4, textTransform: 'uppercase', textAlign: 'center' },
  ttB: { ...font('sans', 600), fontSize: 13.5, lineHeight: 19.575, marginTop: 1, textAlign: 'center', alignSelf: 'stretch' },
  aa: { ...font('book', 600), fontSize: 16.5, lineHeight: 23.925, color: '#14161C', width: 38, textAlign: 'center' },
  prog: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 2.5, backgroundColor: 'rgba(0, 0, 0, 0.05)' },
  progI: { height: 2.5, borderTopRightRadius: 2, borderBottomRightRadius: 2 },

  lens: {
    zIndex: 5,
    flexDirection: 'row',
    gap: 6,
    paddingTop: 6,
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundImage: 'linear-gradient(rgb(244, 241, 234) 78%, rgba(244, 241, 234, 0))',
  },
  lensB: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 0px 0px 1px #E6E0D4',
  },
  lensBOn: { backgroundColor: '#14161C', boxShadow: 'none' },
  lensI: { width: 13, height: 9, borderRadius: 2 },
  lensIa: { backgroundImage: 'linear-gradient(90deg, #FFE27A 50%, #8FE0F7 50%)' },
  lensIy: { backgroundColor: '#FFE27A' },
  lensIc: { backgroundColor: '#E2F5FB', boxShadow: 'inset 0px -2px 0px 0px #0B7FA6' },
  lensTx: { ...font('sans', 600), fontSize: 12.5, lineHeight: 18.125, color: '#3A404B' },
  lensTxOn: { color: '#FFFFFF' },
  lensEm: { ...font('sans', 800), fontSize: 11, lineHeight: 15.95, color: '#A39C8C' },
  lensEmOn: { color: 'rgba(255, 255, 255, 0.55)' },

  art: {
    marginTop: 14,
    marginHorizontal: 16,
    paddingTop: 24,
    paddingHorizontal: 22,
    paddingBottom: 26,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 0px 0px 1px #EEE9DF, 0px 18px 30px -26px rgba(40, 30, 15, 0.45)',
  },
  // span.x4-eb is inline-flex in a 22.475 px line box; it sits 5.39 px below the line top
  ebLine: { height: 22.475, paddingTop: 5.39, flexDirection: 'row' },
  eb: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  ebI: { width: 6, height: 6, borderRadius: 3 },
  ebTx: { ...font('sans', 800), fontSize: 10.5, lineHeight: 15.225, letterSpacing: 1.26, textTransform: 'uppercase' },
  h1: { ...font('book', 500), fontSize: 25, lineHeight: 28.75, letterSpacing: -0.125, color: '#14161C', marginTop: 10 },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    rowGap: 6,
    columnGap: 12,
    marginTop: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0ECE3',
  },
  metaS: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaTx: { fontSize: 12, lineHeight: 17.4, color: '#8A8270' },
  coach: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
    paddingTop: 9,
    paddingRight: 34,
    paddingBottom: 9,
    paddingLeft: 10,
    borderRadius: 12,
    backgroundColor: '#FAF7F0',
  },
  coachTx: { flex: 1, fontSize: 12, lineHeight: 17.4, color: '#5B513A' },
  coachMark: { backgroundColor: '#FFE27A' },
  coachU: {
    ...font('sans', 700),
    color: '#0B7FA6',
    backgroundColor: '#E2F5FB',
    textDecorationLine: 'underline',
    textDecorationStyle: 'dotted',
    textDecorationColor: '#0B7FA6',
  },
  coachX: { position: 'absolute', right: 8, top: '50%', marginTop: -12, width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  by: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 22, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F0ECE3' },
  byAv: { width: 38, height: 38, borderRadius: 19, flexShrink: 0, backgroundColor: '#F1ECE1', alignItems: 'center', justifyContent: 'center' },
  byAvTx: { ...font('sans', 700), fontSize: 13, lineHeight: 15.73, color: '#6B6150' },
  byD: { flex: 1 },
  byB: { ...font('sans', 700), fontSize: 14, lineHeight: 20.3, color: '#14161C' },
  bySmall: { fontSize: 12, lineHeight: 17.4, color: '#8A8270', marginTop: 1 },

  sum: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 16,
    marginHorizontal: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: '#14304F',
  },
  ring: { flex: 1, height: 52 },
  ringB: { position: 'absolute', left: 0, top: 0, right: 0, ...font('serif', 800), fontSize: 14.5, lineHeight: 21.025, color: '#FFFFFF' },
  sumD: { flex: 1 },
  sumB: { ...font('sans', 700), fontSize: 14.5, lineHeight: 21.025, color: '#FFFFFF' },
  sumSmall: { fontSize: 12, lineHeight: 17.4, color: 'rgba(255, 255, 255, 0.7)', marginTop: 2 },
  sumBtn: { height: 36, paddingHorizontal: 13, borderRadius: 12, backgroundColor: '#FFE27A', flexShrink: 0, justifyContent: 'center' },
  sumBtnTx: { ...font('sans', 800), fontSize: 12.5, lineHeight: 18.125, color: '#14161C', textAlign: 'center' },

  dockWrap: { position: 'absolute', left: 0, right: 0, zIndex: 8, alignItems: 'center' },
  dock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    padding: 4,
    borderRadius: 999,
    overflow: 'hidden',
    boxShadow: '0px 0px 0px 1px rgba(40, 30, 15, 0.08), 0px 12px 28px -14px rgba(40, 30, 15, 0.45)',
  },
  dockB: { width: 38, height: 38, borderRadius: 19, flexShrink: 0, alignItems: 'center', justifyContent: 'center' },
  dockOff: { opacity: 0.3 },
  mid: { flexDirection: 'row', alignItems: 'center', gap: 10, height: 38, paddingLeft: 14, paddingRight: 4, borderRadius: 999 },
  dl: { flexDirection: 'row', alignItems: 'baseline' },
  dlTx: { ...font('sans', 500), fontSize: 13, lineHeight: 18.85, color: '#8A8270' },
  dlB: { ...font('sans', 800), fontSize: 13, lineHeight: 18.85, color: '#14161C', marginLeft: 3, marginRight: 1 },
  dd: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
  dot: { height: 6, borderRadius: 3 },
  dO: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#FFE27A', alignItems: 'center', justifyContent: 'center' },
});

const view: ViewDef = {
  Screen: XrayScreen,
};

export default view;
