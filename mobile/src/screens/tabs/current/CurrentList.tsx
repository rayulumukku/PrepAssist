// Source: PrepAssist.html L7211-L7217 (renderCurrent: .cx-fbar, .cx-active), L7220-L7241 (cxCard, cxLead), L7242-L7254 (renderCaList), L7177-L7178 (tagsHTML, srcMg), L6356 (saveBtn)
// Source: PrepAssist.html L3137-L3140 (.cx-mg), L3146-L3188 (cards, .cx-quiz, .cx-end, .cx-empty), L3672-L3684 (.cx-fbar, .cx-seg, .cx-fbtn, .cx-active), L3695-L3699 (#currentScroll .save), L9346-L9366 (ds sizes)
// Private sub-components of the Current tab. Computed: reference/android/tab-current, -gs3, -empty, -one-read.
//   .cx-fbar   sticky top 0, z 6, padding 14 20 8, margin 0 -20, linear-gradient(#F5F7FA 82%, transparent), gap 8
//   .cx-seg    flex 1, padding 4, radius 14, #E9EEF4, 4 columns; button 36 high radius 10, Inter 600 13.5 #5B6472, gap 3,
//              `transition: all .2s` (ease); .on #fff / #14161C, shadow 0 2px 8px -3px rgba(20,30,50,.25);
//              sup Inter 700 9.5/13.775 #9AA3AF translateY(-3) (.on #1B8AD3)
//   .cx-fbtn   38 x 38 radius 12 #fff ring #E1E8F0, icon 18 #3A404B; .on #14161C / #fff, dot 7 #F5A01F ring 2 #14161C at 8,8
//   .cx-active margin-top 2, gap 8, "Showing" 12.5/18.125 --muted; button 34 high (ds chip) radius 999 padding 0 8 0 10 gap 5,
//              Inter 600 12.5 var(--g) on color-mix(var(--g) 12%, #fff); close 12, stroke 2.2
//   .cx-lead / .cx-card #fff radius 18, shadow 0 0 0 1px #E6EBF1, 0 16px 28px -24px rgba(20,50,90,.5), overflow hidden,
//              `animation: tabIn .4s var(--ease) backwards`, :active scale(.99) (.2s); .read: ring only, title #4A505B
//   .cx-card   padding 16 18 14; ::before left 0 top 18 bottom 18, 3 wide, radius 0 3 3 0, var(--sc)
//   .cx-la     150 high, art (articleArt big, xMidYMid slice), ::after linear-gradient(transparent 55%, rgba(0,0,0,.18))
//   .cx-lk     absolute 12,12, 26 high, padding 0 10, radius 13, rgba(20,22,28,.78) + blur(6), Inter 800 10.5 ls .84 uppercase #FFD27A, bolt 13
//   .save      34 circle; in .cx-la absolute right 12 top 12 rgba(255,255,255,.95) shadow 0 4px 10px -4px rgba(20,30,50,.35);
//              in .cx-ch #F5F7FA ring #E6EBF1, margin -2 -4 0 0; .on #EAF4FC ring #CFE5F7 (in .cx-la the white stays), icon brand filled;
//              bookmark 17 stroke 1.7 #3A404B; :active scale(.85) (.2s)
//   .cx-ch     gap 10; .cx-mg 28 high min 28, padding 0 4, radius 8, var(--m), EB Garamond 700 11.5 ls .23 #fff (PIB: tricolour 3 px strip)
//              b Inter 700 12.5/18.125 #14161C; small 11.5/16.675 #7A8494 margin-top 1
//   h2 (lead)  EB Garamond 500 22/25.96 ls -.11 margin-top 12; h3 (card) EB Garamond 500 20/24.4 margin-top 11
//   .cx-ctx    margin-top 8, 13.5/20.25 #4A505B, -webkit-line-clamp 3 (the label is the first line); span 10.5/15.75 800 ls 1.47 uppercase var(--sc), margin-bottom 3
//   .cx-tags   margin-top 11, gap 5; .cx-tg 22 high padding 0 8 radius 6 #F1F5FA Inter 600 11.5 #5B6472; .gs color-mix(var(--g) 12%,#fff), var(--g), 800 uppercase ls .46
//   .cx-cf     margin-top 13, padding-top 11, border-top 1 dashed #E6EBF1; .cx-un #1B8AD3 dot 6; .cx-rd #2F8A4A check 14 stroke 2.4;
//              .cx-go Inter 700 12.5 #14161C, arrow 15 var(--sc)
//   .cx-quiz   padding 14 16, radius 18, gradients, shadow 0 16px 26px -18px #2D3A8C; .cx-qi 40 radius 12 rgba(255,255,255,.16) bolt #FFD27A;
//              b Inter 700 14.5/21.025; small 11.5/16.675 opacity .8 margin-top 2; arrow 18
//   .cx-end    column centred gap 8, padding 22 0 6, EB Garamond italic 15.5 #7A8494; span 34 circle #E6F4EA check 20 #2F8A4A
//   .cx-empty  column centred, padding 30 20, #fff radius 18 ring #E6EBF1; svg 130 x 104; b EB Garamond 500 20/29 margin-top 10;
//              p 13.5/19.575 --muted max-width 250 margin-top 6; button 38 high padding 0 16 radius 12 #14161C Inter 600 13.5 #fff margin-top 14
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Path, Rect, SvgXml } from 'react-native-svg';
import { act } from '../../../actions';
import { Backdrop, Icon } from '../../../components';
import { SRC, SUBJ } from '../../../data';
import type { ArticlesItem } from '../../../data';
import { easeCss, easeVar, useTransition } from '../../../shell/anim';
import { useStore } from '../../../store';
import { font, palettes, Txt, useTheme } from '../../../theme';
import { aTags, articleArt, fmtShort, gsColor, gsRoman, tint } from './currentLogic';

const INK = '#14161C';
const SEG: readonly (readonly [string, string])[] = [
  ['All', 'All'],
  ['The Hindu', 'Hindu'],
  ['Times of India', 'TOI'],
  ['PIB', 'PIB'],
];

/** A pressed scale with the rule's transition (`transition: transform .2s`, ease). */
function usePress(to: number): { style: object; onPressIn: () => void; onPressOut: () => void } {
  const [p, setP] = useState(false);
  const v = useTransition(p ? to : 1, 200, easeCss);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: v.value }] }));
  return { style, onPressIn: () => setP(true), onPressOut: () => setP(false) };
}

function SegBtn({ on, label, count, onPress, testID }: { on: boolean; label: string; count: number; onPress: () => void; testID: string }): React.JSX.Element {
  const v = useTransition(on ? 1 : 0, 200, easeCss);
  const box = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(v.value, [0, 1], ['rgba(255,255,255,0)', '#FFFFFF']),
    boxShadow: `0px 2px 8px -3px rgba(20, 30, 50, ${0.25 * v.value})`,
  }));
  const txt = useAnimatedStyle(() => ({ color: interpolateColor(v.value, [0, 1], ['#5B6472', INK]) }));
  const sup = useAnimatedStyle(() => ({ color: interpolateColor(v.value, [0, 1], ['#9AA3AF', '#1B8AD3']) }));
  return (
    <Pressable style={styles.segCell} onPress={onPress} accessibilityRole="tab" accessibilityState={{ selected: on }} testID={testID}>
      <Animated.View style={[styles.segBtn, box]}>
        <Animated.Text allowFontScaling={false} style={[styles.segT, txt]}>
          {label}
        </Animated.Text>
        <Animated.Text allowFontScaling={false} style={[styles.sup, sup]}>
          {count}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
}

/** .cx-fbar: source segments + the filter button */
export function FilterBar({ all }: { all: readonly ArticlesItem[] }): React.JSX.Element {
  const src = useStore(s => s.ca.src);
  const gs = useStore(s => s.ca.gs);
  const cnt = (s: string): number => all.filter(a => a.src === s).length;
  return (
    <View style={styles.fbar}>
      <View style={styles.seg} accessibilityLabel="Source" accessibilityRole="tablist">
        {SEG.map(([s, l]) => (
          <SegBtn key={s} on={src === s} label={l} count={s === 'All' ? all.length : cnt(s)} onPress={() => act('caSrc', s)} testID={`current.src.${l}`} />
        ))}
      </View>
      <Pressable style={[styles.fbtn, gs !== 'All' && styles.fbtnOn]} onPress={() => act('caFilter')} accessibilityLabel="Filter by GS paper" testID="current.filter">
        <Icon name="filter" size={18} color={gs !== 'All' ? '#fff' : '#3A404B'} />
        {gs !== 'All' ? <View style={styles.fbtnDot} /> : null}
      </Pressable>
    </View>
  );
}

/** .cx-active */
export function ActiveFilter({ gs }: { gs: string }): React.JSX.Element {
  const g = gsColor(gs);
  return (
    <View style={styles.active}>
      <Txt style={styles.activeT}>Showing</Txt>
      <Pressable style={[styles.activeBtn, { backgroundColor: tint(g, 0.12) }]} onPress={() => act('caGs', 'All')} testID="current.active">
        <Txt style={[styles.activeBtnT, { color: g }]}>GS {gsRoman(gs)}</Txt>
        <Icon name="close" size={12} strokeWidth={2.2} color={g} />
      </Pressable>
    </View>
  );
}

/** saveBtn(id) L6356 inside #currentScroll */
function Save({ id, inArt }: { id: string; inArt?: boolean }): React.JSX.Element {
  const on = useStore(s => s.saved.has(id));
  const t = useTheme();
  const press = usePress(0.85);
  return (
    <Pressable
      onPress={() => act('save', id)}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      accessibilityLabel="Save article"
      accessibilityState={{ selected: on }}
      testID={`current.save.${id}`}
      style={inArt ? styles.saveArtPos : styles.saveChPos}
    >
      <Animated.View style={[styles.save, inArt ? styles.saveArt : on ? styles.saveOn : styles.saveCh, press.style]}>
        <Icon name="bookmark" size={17} strokeWidth={1.7} color={on ? t.brand : '#3A404B'} fill={on ? t.brand : 'none'} />
      </Animated.View>
    </Pressable>
  );
}

/** srcMg(s) L7178 */
function SrcMg({ src }: { src: string }): React.JSX.Element {
  const m = SRC[src] || SRC.PIB;
  return (
    <View style={[styles.mg, { backgroundColor: m.c }]}>
      <Txt style={styles.mgT}>{m.m}</Txt>
      {m.c === '#0E7490' ? <View style={styles.tricolour} /> : null}
    </View>
  );
}

function Ch({ a, save }: { a: ArticlesItem; save: boolean }): React.JSX.Element {
  return (
    <View style={styles.ch}>
      <SrcMg src={a.src} />
      <View style={styles.flex1}>
        <Txt style={styles.chB}>{a.src}</Txt>
        <Txt style={styles.chS}>
          {a.min} min · {a.topic}
        </Txt>
      </View>
      {save ? <Save id={a.id} /> : null}
    </View>
  );
}

function Body({ a, lead, read }: { a: ArticlesItem; lead: boolean; read: boolean }): React.JSX.Element {
  const sc = SUBJ[a.s].hex;
  return (
    <>
      <Txt style={[lead ? styles.h2 : styles.h3, read && styles.readTitle]}>{a.t}</Txt>
      <View style={styles.ctx}>
        <Txt style={[styles.ctxL, { color: sc }]}>{lead ? 'Context & deep background' : 'Context'}</Txt>
        <Txt style={styles.ctxT} numberOfLines={2}>
          {a.ctx || a.dek}
        </Txt>
      </View>
      <View style={styles.tags}>
        {aTags(a).map(t =>
          /^gs\d$/.test(t) ? (
            <View key={t} style={[styles.tg, { backgroundColor: tint(gsColor(t), 0.12) }]}>
              <Txt style={[styles.tgT, styles.tgGs, { color: gsColor(t) }]}>#{t}</Txt>
            </View>
          ) : (
            <View key={t} style={styles.tg}>
              <Txt style={styles.tgT}>#{t}</Txt>
            </View>
          ),
        )}
      </View>
      <View style={styles.cf}>
        {read ? (
          <View style={styles.rd}>
            <Icon name="check" size={14} strokeWidth={2.4} color="#2F8A4A" />
            <Txt style={[styles.rdT, styles.rdOk]}>Read</Txt>
          </View>
        ) : (
          <View style={styles.rd}>
            <View style={styles.unDot} />
            <Txt style={[styles.rdT, styles.rdNew]}>New</Txt>
          </View>
        )}
        <View style={styles.go}>
          <Txt style={styles.goT}>Read story</Txt>
          <Icon name="arrow" size={15} color={sc} />
        </View>
      </View>
    </>
  );
}

/** `animation: tabIn .4s var(--ease) backwards` on every card the list renders */
function useEnter(): object {
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withTiming(1, { duration: 400, easing: easeVar });
  }, [p]);
  return useAnimatedStyle(() => ({ opacity: p.value, transform: [{ translateY: 6 * (1 - p.value) }] }));
}

/** cxLead(a) L7230-L7241 */
export function Lead({ a }: { a: ArticlesItem }): React.JSX.Element {
  const read = useStore(s => s.ca.read.has(a.id));
  const enter = useEnter();
  const press = usePress(0.99);
  return (
    <Animated.View style={enter}>
      <Pressable onPress={() => act('article', a.id)} onPressIn={press.onPressIn} onPressOut={press.onPressOut} testID={`current.article.${a.id}`}>
        <Animated.View style={[styles.card, read && styles.cardRead, press.style]}>
          <View style={styles.la}>
            <SvgXml xml={articleArt(a.art, true)} width="100%" height="100%" />
            <View style={styles.laShade} pointerEvents="none" />
            <View style={styles.lk}>
              <Backdrop px={6} tint="rgba(20,22,28,0.78)" tone="dark" />
              <Icon name="bolt" size={13} color="#FFD27A" />
              <Txt style={styles.lkT}>Lead story</Txt>
            </View>
            <Save id={a.id} inArt />
          </View>
          <View style={styles.lb}>
            <Ch a={a} save={false} />
            <Body a={a} lead read={read} />
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

/** cxCard(a) L7220-L7229 */
export function Card({ a }: { a: ArticlesItem }): React.JSX.Element {
  const read = useStore(s => s.ca.read.has(a.id));
  const enter = useEnter();
  const press = usePress(0.99);
  return (
    <Animated.View style={enter}>
      <Pressable onPress={() => act('article', a.id)} onPressIn={press.onPressIn} onPressOut={press.onPressOut} testID={`current.article.${a.id}`}>
        <Animated.View style={[styles.card, styles.cardPad, read && styles.cardRead, press.style]}>
          <View style={[styles.cardBar, { backgroundColor: SUBJ[a.s].hex }]} />
          <Ch a={a} save />
          <Body a={a} lead={false} read={read} />
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

/** .cx-quiz (renderCaList, after the second card that follows the lead) */
export function QuizCta({ n }: { n: number }): React.JSX.Element {
  return (
    <Pressable style={styles.quiz} onPress={() => act('quiz')} testID="current.quiz">
      <View style={styles.qi}>
        <Icon name="bolt" size={20} color="#FFD27A" />
      </View>
      <View style={styles.flex1}>
        <Txt style={styles.quizB}>Turn this edition into 10 MCQs</Txt>
        <Txt style={styles.quizS}>Built from {n} stories · about 8 min</Txt>
      </View>
      <Icon name="arrow" size={18} color="#fff" />
    </Pressable>
  );
}

/** .cx-end */
export function End({ sel }: { sel: Date }): React.JSX.Element {
  return (
    <View style={styles.end}>
      <View style={styles.endI}>
        <Icon name="check" size={20} color="#2F8A4A" />
      </View>
      <Txt style={styles.endT}>That’s the full {fmtShort(sel)} edition</Txt>
    </View>
  );
}

/** .cx-empty (renderCaList, no story left) */
export function Empty({ src, gs, sel }: { src: string; gs: string; sel: Date }): React.JSX.Element {
  return (
    <View style={styles.empty}>
      <Svg width={130} height={104} viewBox="0 0 120 96">
        <Rect x={22} y={14} width={64} height={72} rx={6} fill="#fff" stroke="#D6E0EB" strokeWidth={2} />
        <Path d="M32 28h44M32 36h44" stroke="#C9D6E4" strokeWidth={3} strokeLinecap="round" />
        <Path d="M32 48h20M32 55h20M32 62h20M58 48h18M58 55h18M58 62h14" stroke="#E3EAF2" strokeWidth={2.5} strokeLinecap="round" />
        <Circle cx={84} cy={64} r={15} fill="#EAF4FC" stroke="#1B8AD3" strokeWidth={3} />
        <Path d="m95 75 9 9" stroke="#1B8AD3" strokeWidth={4} strokeLinecap="round" />
      </Svg>
      <Txt style={styles.emptyB}>Nothing in this edition</Txt>
      <Txt style={styles.emptyP}>
        No {src === 'All' ? '' : src + ' '}stories match {gs === 'All' ? 'this filter' : 'GS ' + gsRoman(gs)} on {fmtShort(sel)}.
      </Txt>
      <Pressable style={styles.emptyBtn} onPress={() => act('caReset')} testID="current.reset">
        <Txt style={styles.emptyBtnT}>Show all stories</Txt>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1, minWidth: 0 },
  // .cx-fbar
  fbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: -20,
    paddingTop: 14,
    paddingHorizontal: 20,
    paddingBottom: 8,
    backgroundImage: 'linear-gradient(180deg, #F5F7FA 82%, rgba(245,247,250,0))',
    zIndex: 6,
  },
  seg: { flex: 1, flexDirection: 'row', padding: 4, borderRadius: 14, backgroundColor: '#E9EEF4' },
  segCell: { flex: 1 },
  segBtn: { height: 36, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 3 },
  segT: { ...font('sans', 600), fontSize: 13.5, lineHeight: 19.575, textAlign: 'center' },
  sup: { ...font('sans', 700), fontSize: 9.5, lineHeight: 13.775, transform: [{ translateY: -3 }] },
  fbtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#fff', boxShadow: '0px 0px 0px 1px #E1E8F0', alignItems: 'center', justifyContent: 'center' },
  fbtnOn: { backgroundColor: INK, boxShadow: 'none' },
  fbtnDot: { position: 'absolute', top: 8, right: 8, width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#F5A01F', boxShadow: '0px 0px 0px 2px #14161C' },
  active: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 },
  activeT: { fontSize: 12.5, lineHeight: 18.125, color: '#7A8494' },
  activeBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, height: 34, paddingLeft: 10, paddingRight: 8, borderRadius: 999 },
  activeBtnT: { ...font('sans', 600), fontSize: 12.5, lineHeight: 18.125 },
  // cards
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    overflow: 'hidden',
    boxShadow: '0px 0px 0px 1px #E6EBF1, 0px 16px 28px -24px rgba(20, 50, 90, 0.5)',
  },
  cardRead: { boxShadow: '0px 0px 0px 1px #E6EBF1' },
  cardPad: { paddingTop: 16, paddingHorizontal: 18, paddingBottom: 14 },
  cardBar: { position: 'absolute', left: 0, top: 18, bottom: 18, width: 3, borderTopRightRadius: 3, borderBottomRightRadius: 3 },
  la: { height: 150, overflow: 'hidden' },
  laShade: { ...StyleSheet.absoluteFill, backgroundImage: 'linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.18))' },
  lk: {
    position: 'absolute',
    left: 12,
    top: 12,
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 26,
    paddingHorizontal: 10,
    borderRadius: 13,
    overflow: 'hidden',
  },
  lkT: { ...font('sans', 800), fontSize: 10.5, lineHeight: 15.225, letterSpacing: 0.84, textTransform: 'uppercase', color: '#FFD27A' },
  lb: { paddingVertical: 16, paddingHorizontal: 18 },
  saveArtPos: { position: 'absolute', right: 12, top: 12, zIndex: 1 },
  saveChPos: { marginTop: -2, marginRight: -4 },
  save: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  saveArt: { backgroundColor: 'rgba(255,255,255,0.95)', boxShadow: '0px 4px 10px -4px rgba(20, 30, 50, 0.35)' },
  saveCh: { backgroundColor: '#F5F7FA', boxShadow: '0px 0px 0px 1px #E6EBF1' },
  saveOn: { backgroundColor: '#EAF4FC', boxShadow: '0px 0px 0px 1px #CFE5F7' },
  ch: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  mg: { minWidth: 28, height: 28, paddingHorizontal: 4, borderRadius: 8, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  mgT: { ...font('book', 700), fontSize: 11.5, lineHeight: 16.675, letterSpacing: 0.23, color: '#fff' },
  tricolour: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 3,
    backgroundImage: 'linear-gradient(90deg, #FF9933 33%, #FFFFFF 33%, #FFFFFF 66%, #138808 66%)',
  },
  chB: { ...font('sans', 700), fontSize: 12.5, lineHeight: 18.125, color: INK },
  chS: { fontSize: 11.5, lineHeight: 16.675, color: '#7A8494', marginTop: 1 },
  h2: { ...font('book', 500), fontSize: 22, lineHeight: 25.96, letterSpacing: -0.11, color: INK, marginTop: 12 },
  h3: { ...font('book', 500), fontSize: 20, lineHeight: 24.4, color: INK, marginTop: 11 },
  readTitle: { color: '#4A505B' },
  ctx: { marginTop: 8 },
  ctxL: { ...font('sans', 800), fontSize: 10.5, lineHeight: 15.75, letterSpacing: 1.47, textTransform: 'uppercase', marginBottom: 3 },
  ctxT: { fontSize: 13.5, lineHeight: 20.25, color: '#4A505B' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginTop: 11 },
  tg: { height: 22, paddingHorizontal: 8, borderRadius: 6, backgroundColor: '#F1F5FA', justifyContent: 'center' },
  tgT: { ...font('sans', 600), fontSize: 11.5, lineHeight: 16.675, color: '#5B6472' },
  tgGs: { ...font('sans', 800), textTransform: 'uppercase', letterSpacing: 0.46 },
  cf: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 13,
    paddingTop: 11,
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#E6EBF1',
  },
  rd: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rdT: { ...font('sans', 700), fontSize: 11.5, lineHeight: 16.675 },
  rdOk: { color: '#2F8A4A' },
  rdNew: { color: '#1B8AD3' },
  unDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#1B8AD3' },
  go: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  goT: { ...font('sans', 700), fontSize: 12.5, lineHeight: 18.125, color: INK },
  // quiz, end, empty
  quiz: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundImage: 'radial-gradient(90% 120% at 100% 0%, rgba(124,111,240,0.6), transparent 60%), linear-gradient(135deg, #2D3A8C, #1B6FB3)',
    boxShadow: '0px 16px 26px -18px #2D3A8C',
  },
  qi: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.16)', alignItems: 'center', justifyContent: 'center' },
  quizB: { ...font('sans', 700), fontSize: 14.5, lineHeight: 21.025, color: '#fff' },
  quizS: { fontSize: 11.5, lineHeight: 16.675, color: '#fff', opacity: 0.8, marginTop: 2 },
  end: { alignItems: 'center', gap: 8, paddingTop: 22, paddingBottom: 6 },
  endI: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#E6F4EA', alignItems: 'center', justifyContent: 'center' },
  endT: { ...font('book', 400, true), fontSize: 15.5, lineHeight: 22.475, color: '#7A8494', textAlign: 'center' },
  empty: { alignItems: 'center', paddingVertical: 30, paddingHorizontal: 20, backgroundColor: '#fff', borderRadius: 18, boxShadow: '0px 0px 0px 1px #E6EBF1' },
  emptyB: { ...font('book', 500), fontSize: 20, lineHeight: 29, color: INK, marginTop: 10, textAlign: 'center' },
  emptyP: { fontSize: 13.5, lineHeight: 19.575, color: palettes.free.muted, marginTop: 6, maxWidth: 250, textAlign: 'center' },
  emptyBtn: { marginTop: 14, height: 38, paddingHorizontal: 16, borderRadius: 12, backgroundColor: INK, justifyContent: 'center' },
  emptyBtnT: { ...font('sans', 600), fontSize: 13.5, lineHeight: 19.575, color: '#fff', textAlign: 'center' },
});
