// Source: PrepAssist.html L10573-L10589 (window.ntPeek), L10223-L10254 (.lt, .lt-hero … .lt-folds CSS)
// The Notes Tracker peek inside the Learn tab (section 03). Values: reference/android/tab-learn/dom.json (computed).
//   .lt         column, gap 10
//   .lt-hero    column gap 12, padding 16 16 14, radius 22, linear(135deg, #0C4A33 0%, #13774B 55%, #1FA463 100%),
//               shadow 0 18 30 -18 rgba(12,74,51,.85); ::before rules every 22 px (1 px rgba(255,255,255,.05), from the bottom);
//               .lt-glow 170 circle at right -40 top -50, radial(circle, rgba(160,255,200,.45), transparent 65%)
//   .lt-ic      34 radius 11 rgba(255,255,255,.16), ring inset 1 rgba(255,255,255,.22), refresh 17 #fff
//   .lt-top em  Inter 800 10.5/15.225 ls 1.26 uppercase #C9F5DA; ::before 6 px dot #7CF0A8, box-shadow 0 0 0 3px rgba(124,240,168,.25), dpu 2s
//   .lt-num     gap 10, flex-end; b EB Garamond 500 48/43.2 ls -.96; span Inter 700 15/17.25 padding-bottom 3; small 500 12/13.8 rgba(255,255,255,.72) margin-top 3
//   .lt-src i   26 high, padding 0 4 0 10, pill rgba(255,255,255,.12) ring inset rgba(255,255,255,.16), Inter 600 11.5; u 18 high min 18, #fff, Inter 800 10.5 #13774B
//   .lt-cta     38 high, padding 0 16, radius 12, #fff, Inter 800 13/18.85 #0C4A33, arrow 14
//   .lt-list    #fff radius 18 ring #E8ECF2; .lt-row padding 12 12 12 14 gap 12, + border-top 1 #F0F2F6;
//               .lt-rb 38 radius 12 color-mix(--fc 12%, #fff), notes 18; small Inter 800 10/14.5 ls 1 uppercase --fc;
//               b Inter 600 14/20.3 nowrap; p Inter 600 11.5/16.675 #1F8A55 nowrap; .lt-m 32 high padding 0 12 radius 10 #ECF8F1 Inter 800 12 #13774B
//   .lt-folds   row scroller, margin 0 -20, padding 2 20 4, gap 8; buttons 112 wide padding 12 radius 16 #fff ring #E8ECF2;
//               span 32 radius 10 --fc, shadow 0 8 14 -8 --fc, learn 16 #fff; b Inter 700 13/18.85 margin-top 10 nowrap; small 11/15.95 #8A93A0 margin-top 1;
//               em absolute right 10 top 10, 20 high min 22, radius 10, #1FA463, ring 2 #fff, Inter 800 10.5 #fff;
//               .add transparent, ring inset 1.5 #D5DCE5, span #EEF1F6 plus #5B6472
import React, { useEffect, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import Svg, { Rect } from 'react-native-svg';
import { act } from '../../../actions';
import { Icon } from '../../../components';
import { OPT_C } from '../../../data';
import { easeCss } from '../../../shell/anim';
import { useStore } from '../../../store';
import { font, Txt } from '../../../theme';
import { mix, notesOf, ntPeek, upsOf } from './learnLogic';

const INK = '#14161C';

/** .lt-top em::before: 6 px dot, box-shadow 0 0 0 3px rgba(124,240,168,.25), dpu 2s (70 %: 0 0 0 8px transparent; 100 %: 0 0 0 0 transparent) */
function LiveDot(): React.JSX.Element {
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withRepeat(withSequence(withTiming(0, { duration: 0 }), withTiming(1, { duration: 1400, easing: easeCss }), withTiming(2, { duration: 600, easing: easeCss })), -1);
  }, [p]);
  const ring = useAnimatedStyle(() => {
    const spread = p.value <= 1 ? 3 + 5 * p.value : 8 * (2 - p.value);
    const a = p.value <= 1 ? 0.25 * (1 - p.value) : 0;
    return { width: 6 + 2 * spread, height: 6 + 2 * spread, borderRadius: 3 + spread, left: -spread, top: -spread, backgroundColor: `rgba(124,240,168,${a})` };
  });
  return (
    <View style={styles.dot}>
      <Animated.View style={[styles.dotRing, ring]} />
      <View style={styles.dotCore} />
    </View>
  );
}

/** .lt-hero::before: repeating-linear-gradient(0deg, transparent 0 21px, rgba(255,255,255,.05) 21px 22px), measured from the bottom edge. */
function Rules({ w, h }: { w: number; h: number }): React.JSX.Element | null {
  if (!h) return null;
  const n = Math.ceil(h / 22);
  return (
    <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
      {Array.from({ length: n }, (_, k) => (
        <Rect key={k} x={0} y={h - 22 * (k + 1)} width={w} height={1} fill="rgba(255,255,255,0.05)" />
      ))}
    </Svg>
  );
}

export function TrackerPeek(): React.JSX.Element {
  const nt = useStore(s => s.NT);
  const folders = useStore(s => s.FOLDERS);
  const optional = useStore(s => s.optional);
  const P = ntPeek(nt, folders);
  const T = P.total;
  const fl: (readonly string[])[] = [...folders, ...(optional ? [[optional, OPT_C, 'opt:' + optional]] : [])];
  const [size, setSize] = useState({ w: 0, h: 0 });
  return (
    <View style={styles.lt}>
      <Pressable
        style={styles.hero}
        onPress={() => act('push:tracker')}
        onLayout={e => setSize({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}
        testID="learn.tracker.hero"
      >
        <Rules w={size.w} h={size.h} />
        <View style={styles.glow} pointerEvents="none" />
        <View style={styles.top}>
          <View style={styles.ic}>
            <Icon name="refresh" size={17} color="#fff" />
          </View>
          <View style={styles.live}>
            <LiveDot />
            <Txt style={styles.liveT}>{T ? 'Live · auto-matched' : 'All caught up'}</Txt>
          </View>
        </View>
        <View style={styles.num}>
          <Txt style={styles.numB}>{T}</Txt>
          <View style={styles.numSpan}>
            <Txt style={styles.numT}>new update{T === 1 ? '' : 's'}</Txt>
            <Txt style={styles.numSmall}>
              for {P.withUps} of your {P.notes} notes
            </Txt>
          </View>
        </View>
        <View style={styles.src}>
          {P.sources.map(([k, v]) => (
            <View key={k} style={styles.srcI}>
              <Txt style={styles.srcT}>{k}</Txt>
              <View style={styles.srcU}>
                <Txt style={styles.srcUT}>{v}</Txt>
              </View>
            </View>
          ))}
        </View>
        <View style={styles.cta}>
          <Txt style={styles.ctaT}>Review &amp; merge</Txt>
          <Icon name="arrow" size={14} color="#0C4A33" />
        </View>
      </Pressable>
      {P.rows.length ? (
        <View style={styles.list}>
          {P.rows.map((n, i) => {
            const fc = n.folder[1];
            return (
              <Pressable key={n.id} style={[styles.row, i > 0 && styles.rowLine]} onPress={() => act('push:ntNote:' + n.id)} testID={`learn.tracker.${n.id}`}>
                <View style={[styles.rb, { backgroundColor: mix(fc, 0.12, '#FFFFFF') }]}>
                  <Icon name="notes" size={18} color={fc} />
                </View>
                <View style={styles.flex1}>
                  <Txt style={[styles.rowSmall, { color: fc }]}>{n.folder[0]}</Txt>
                  <Txt style={styles.rowB} numberOfLines={1}>
                    {n.t}
                  </Txt>
                  <Txt style={styles.rowP} numberOfLines={1}>
                    {n.line}
                  </Txt>
                </View>
                <Pressable style={styles.m} onPress={() => act('ntUps:' + n.id)} testID={`learn.tracker.${n.id}.review`}>
                  <Txt style={styles.mT}>Review</Txt>
                </Pressable>
              </Pressable>
            );
          })}
        </View>
      ) : null}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.foldsScroll} contentContainerStyle={styles.folds}>
        {fl.map(([n, c, k]) => {
          const u = upsOf(nt, k);
          const cnt = notesOf(nt, k).length;
          return (
            <Pressable key={k} style={styles.fold} onPress={() => act('push:folder:' + n)} testID={`learn.folder.${k}`}>
              <View style={[styles.foldI, { backgroundColor: c, boxShadow: `0px 8px 14px -8px ${c}` }]}>
                <Icon name="learn" size={16} color="#fff" />
              </View>
              <Txt style={styles.foldB} numberOfLines={1}>
                {n}
              </Txt>
              <Txt style={styles.foldS}>
                {cnt} note{cnt === 1 ? '' : 's'}
              </Txt>
              {u ? (
                <View style={styles.foldEm}>
                  <Txt style={styles.foldEmT}>{u}</Txt>
                </View>
              ) : null}
            </Pressable>
          );
        })}
        <Pressable style={[styles.fold, styles.add]} onPress={() => act('ntNew')} testID="learn.folder.new">
          <View style={[styles.foldI, styles.addI]}>
            <Icon name="plus" size={16} color="#5B6472" />
          </View>
          <Txt style={styles.foldB} numberOfLines={1}>
            New note
          </Txt>
          <Txt style={styles.foldS}>Type · scan · PDF</Txt>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1, minWidth: 0 },
  lt: { gap: 10 },
  hero: {
    gap: 12,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundImage: 'linear-gradient(135deg, #0C4A33 0%, #13774B 55%, #1FA463 100%)',
    boxShadow: '0px 18px 30px -18px rgba(12, 74, 51, 0.85)',
  },
  glow: { position: 'absolute', right: -40, top: -50, width: 170, height: 170, borderRadius: 85, backgroundImage: 'radial-gradient(circle, rgba(160,255,200,0.45), transparent 65%)' },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  ic: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.16)', boxShadow: 'inset 0px 0px 0px 1px rgba(255,255,255,0.22)' },
  live: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveT: { ...font('sans', 800), fontSize: 10.5, lineHeight: 15.225, letterSpacing: 1.26, textTransform: 'uppercase', color: '#C9F5DA' },
  dot: { width: 6, height: 6 },
  dotRing: { position: 'absolute' },
  dotCore: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#7CF0A8' },
  num: { flexDirection: 'row', alignItems: 'flex-end', gap: 10 },
  numB: {
    ...font('book', 500),
    fontSize: 48,
    ...Platform.select({
      ios: { lineHeight: 50, marginTop: -3, marginBottom: -3 },
      default: { lineHeight: 43.2 },
    }),
    letterSpacing: -0.96,
    color: '#fff',
  },
  numSpan: { paddingBottom: 3 },
  numT: { ...font('sans', 700), fontSize: 15, lineHeight: 17.25, color: '#fff' },
  numSmall: { ...font('sans', 500), fontSize: 12, lineHeight: 13.8, color: 'rgba(255,255,255,0.72)', marginTop: 3 },
  src: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  srcI: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 26,
    paddingLeft: 10,
    paddingRight: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.12)',
    boxShadow: 'inset 0px 0px 0px 1px rgba(255,255,255,0.16)',
  },
  srcT: { ...font('sans', 600), fontSize: 11.5, lineHeight: 16.675, color: '#fff' },
  srcU: { minWidth: 18, height: 18, paddingHorizontal: 5, borderRadius: 9, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  srcUT: { ...font('sans', 800), fontSize: 10.5, lineHeight: 15.225, color: '#13774B' },
  cta: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, height: 38, paddingHorizontal: 16, borderRadius: 12, backgroundColor: '#fff' },
  ctaT: { ...font('sans', 800), fontSize: 13, lineHeight: 18.85, color: '#0C4A33' },
  list: { backgroundColor: '#fff', borderRadius: 18, boxShadow: '0px 0px 0px 1px #E8ECF2', overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingRight: 12, paddingLeft: 14 },
  rowLine: { borderTopWidth: 1, borderTopColor: '#F0F2F6' },
  rb: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  rowSmall: { ...font('sans', 800), fontSize: 10, lineHeight: 14.5, letterSpacing: 1, textTransform: 'uppercase' },
  rowB: { ...font('sans', 600), fontSize: 14, lineHeight: 20.3, color: INK, marginTop: 1 },
  rowP: { ...font('sans', 600), fontSize: 11.5, lineHeight: 16.675, color: '#1F8A55', marginTop: 1 },
  m: { height: 32, paddingHorizontal: 12, borderRadius: 10, backgroundColor: '#ECF8F1', justifyContent: 'center' },
  mT: { ...font('sans', 800), fontSize: 12, lineHeight: 17.4, color: '#13774B', textAlign: 'center' },
  foldsScroll: { marginHorizontal: -20 },
  folds: { paddingTop: 2, paddingHorizontal: 20, paddingBottom: 4, gap: 8 },
  fold: { width: 112, alignItems: 'flex-start', padding: 12, borderRadius: 16, backgroundColor: '#fff', boxShadow: '0px 0px 0px 1px #E8ECF2' },
  foldI: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  foldB: { ...font('sans', 700), fontSize: 13, lineHeight: 18.85, color: INK, marginTop: 10, maxWidth: '100%' },
  foldS: { fontSize: 11, lineHeight: 15.95, color: '#8A93A0', marginTop: 1 },
  foldEm: {
    position: 'absolute',
    right: 10,
    top: 10,
    minWidth: 22,
    height: 20,
    paddingHorizontal: 6,
    borderRadius: 10,
    backgroundColor: '#1FA463',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 0px 0px 2px #FFFFFF',
  },
  foldEmT: { ...font('sans', 800), fontSize: 10.5, lineHeight: 15.225, color: '#fff' },
  add: { backgroundColor: 'transparent', boxShadow: 'inset 0px 0px 0px 1.5px #D5DCE5' },
  addI: { backgroundColor: '#EEF1F6' },
});
