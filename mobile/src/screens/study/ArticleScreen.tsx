// Source: PrepAssist.html L7470-L7470 (VIEWS.article)
// Source: PrepAssist.html L7281-L7310 (articleHTML)
// Source: PrepAssist.html L7311-L7319 (articleMount)
// Source: PrepAssist.html L3219-L3263 (.ar-* reader), L3167-L3168 (.cx-tg), L3225 (.ar-src .cx-mg), L9344-L9345 (.ar-ib size), L9372 (.ar-body/.ar-hero side padding)
// The immersive article reader (focus view: the whole page). Computed (reference/android/view-article-lead, view-article):
//   .ar-top    absolute, height 56, padding 8 14 10 (+ --sat), row centred gap 8. After 160 px of scroll it
//              turns .solid: rgba(255,255,255,.94) + blur 12 + 0 1px 0 #EEF2F6, `transition: background .3s, box-shadow .3s`
//   .ar-ib     38 circle, rgba(255,255,255,.92), 0 0 0 1px rgba(20,30,50,.08) + 0 6px 14px -8px rgba(20,30,50,.35), #14161C;
//              .save.on #1B8AD3 with the icon filled
//   .ar-src    flex 1, centred, gap 8, Inter 700 13.5/19.575 #14161C; monogram 24 high, radius 7, 10.5px
//   .ar-prog   2.5 px at the bottom of the bar; the bar width follows the scroll (gradient #1B8AD3 -> #F5A01F)
//   .ar-scroll the page scroller, padding-bottom 110
//   .ar-hero   padding 64 20 20 (+ --sat); background linear-gradient(180deg, mix(--sc 10%, #fff), #fff)
//   .ar-body   padding 6 20 20; p Inter(read) 16.5/28.38 #2E333C mb 16; .s2 17.5/30.1; .s3 19.5/33.15
//   .ar-dock   absolute, left/right 14, bottom --sab + 12, 4 columns, padding 6, radius 20, rgba(20,22,28,.92) + blur 12
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { SvgXml } from 'react-native-svg';
import { act } from '../../actions';
import { Backdrop, Icon } from '../../components';
import { ARTICLES, GSC, SUBJ } from '../../data';
import type { ArticlesItem } from '../../data';
import { parseD, today } from '../../env/clock';
import type { IconName } from '../../icons/iconPaths.generated';
import type { ViewDef, ViewProps } from '../../navigation/routes';
import { easeCss, useTransition } from '../../shell/anim';
import { getS, setS, useStore } from '../../store';
import { em, font, Txt, useInsets } from '../../theme';
import { articleArt } from './article/articleArt';
import { DropCapP } from './article/DropCapP';
import { aTags, caPool, fmtLong } from './common/current';
import { SrcMg } from './common/SrcMg';

/** color-mix(in srgb, <hex> p%, #fff) */
function mixWhite(hex: string, p: number): string {
  const ch = (k: number): number => Math.round(parseInt(hex.slice(1 + k * 2, 3 + k * 2), 16) * p + 255 * (1 - p));
  return `rgb(${ch(0)}, ${ch(1)}, ${ch(2)})`;
}

const BODY: Record<number, { fontSize: number; lineHeight: number }> = {
  1: { fontSize: 16.5, lineHeight: 28.38 },
  2: { fontSize: 17.5, lineHeight: 30.1 },
  3: { fontSize: 19.5, lineHeight: 33.15 },
};

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#FFFFFF' },
  top: { position: 'absolute', left: 0, right: 0, top: 0, zIndex: 8, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingBottom: 10 },
  solid: { ...StyleSheet.absoluteFill, boxShadow: '0px 1px 0px 0px #EEF2F6' },
  ib: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    boxShadow: '0px 0px 0px 1px rgba(20,30,50,0.08), 0px 6px 14px -8px rgba(20,30,50,0.35)',
    flexShrink: 0,
  },
  aa: { ...font('book', 600), fontSize: 16.5, lineHeight: 23.925, color: '#14161C' },
  src: { flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  srcT: { ...font('sans', 700), fontSize: 13.5, lineHeight: 19.575, color: '#14161C' },
  mg: { minWidth: 24, height: 24, borderRadius: 7 },
  mgT: { fontSize: 10.5, lineHeight: 15.225, letterSpacing: em(10.5, 0.02) },
  prog: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 2.5 },
  progI: { height: 2.5, borderTopRightRadius: 2, borderBottomRightRadius: 2, backgroundImage: 'linear-gradient(90deg, #1B8AD3, #F5A01F)' },
  scrollC: { paddingBottom: 110 },
  hero: { paddingHorizontal: 20, paddingBottom: 20 },
  art: { height: 150, borderRadius: 18, overflow: 'hidden', marginBottom: 18, boxShadow: '0px 14px 24px -18px rgba(20,50,90,0.5)' },
  dateLine: { lineHeight: 22.475 },
  date: { ...font('sans', 700), fontSize: 11.5, letterSpacing: em(11.5, 0.08), textTransform: 'uppercase' },
  h1: { ...font('book', 500), fontSize: 28, lineHeight: 32.2, letterSpacing: -0.28, color: '#14161C', marginTop: 8 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginTop: 11 },
  tg: { height: 22, paddingHorizontal: 8, borderRadius: 6, backgroundColor: '#F1F5FA', flexDirection: 'row', alignItems: 'center' },
  tgT: { ...font('sans', 600), fontSize: 11.5, lineHeight: 16.675, color: '#5B6472' },
  tgGsT: { ...font('sans', 800), textTransform: 'uppercase', letterSpacing: em(11.5, 0.04) },
  meta: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 6, columnGap: 16, marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#EEF2F6' },
  metaS: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaT: { fontSize: 12.5, lineHeight: 18.125, color: '#7A8494' },
  body: { paddingTop: 6, paddingHorizontal: 20, paddingBottom: 20 },
  k: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8, marginBottom: 12 },
  kI: { width: 26, height: 26, borderRadius: 8, backgroundColor: '#14304F', alignItems: 'center', justifyContent: 'center' },
  kT: { ...font('sans', 800), fontSize: 11.5, lineHeight: 16.675, letterSpacing: em(11.5, 0.14), textTransform: 'uppercase', color: '#14161C' },
  p: { ...font('read', 400), color: '#2E333C' },
  pGap: { marginBottom: 16 },
  why: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 22,
    padding: 16,
    borderRadius: 16,
    backgroundImage: 'linear-gradient(135deg, #EAF4FC, #F6FAFE)',
    boxShadow: 'inset 0px 0px 0px 1px #D6E8F7',
  },
  wi: { width: 36, height: 36, borderRadius: 11, backgroundColor: '#1B8AD3', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  whyB: { flex: 1 },
  h6: { ...font('sans', 800), fontSize: 10.5, lineHeight: 15.225, letterSpacing: em(10.5, 0.14), textTransform: 'uppercase', color: '#1B6FB3' },
  whyP: { ...font('read', 400), fontSize: 14.5, lineHeight: 22.475, color: '#3A404B', marginTop: 4 },
  arH: { color: '#14161C', marginTop: 22, marginBottom: 10 },
  pts: { gap: 8 },
  li: { paddingTop: 12, paddingRight: 14, paddingBottom: 12, paddingLeft: 48, borderRadius: 14, backgroundColor: '#FFFFFF', boxShadow: '0px 0px 0px 1px #E6EBF1' },
  liT: { fontSize: 14.5, lineHeight: 21.75, color: '#2E333C' },
  liN: { position: 'absolute', left: 14, top: 12, ...font('serif', 800), fontSize: 15.5, lineHeight: 23.25, color: '#F5A01F' },
  mq: { marginTop: 22, padding: 16, borderRadius: 16, backgroundColor: '#FFF8EC', boxShadow: 'inset 0px 0px 0px 1px #F6E2C2' },
  mqH: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  mqHT: { color: '#C47406' },
  mqP: { ...font('book', 400, true), fontSize: 18, lineHeight: 26.1, color: '#3A352C', marginTop: 8, marginBottom: 12 },
  mqB: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 7, height: 38, paddingHorizontal: 14, borderRadius: 11, backgroundColor: '#14161C' },
  mqBT: { ...font('sans', 600), fontSize: 13.5, lineHeight: 19.575, color: '#FFFFFF' },
  next: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 22, padding: 16, borderRadius: 16, backgroundColor: '#14304F' },
  nextD: { flex: 1, minWidth: 0 },
  nextS: { ...font('sans', 700), fontSize: 10.5, lineHeight: 15.225, letterSpacing: em(10.5, 0.1), textTransform: 'uppercase', color: '#FFD08A' },
  nextB: { ...font('book', 500), fontSize: 18, lineHeight: 22.5, color: '#FFFFFF', marginTop: 4 },
  nextI: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.14)', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  dock: { position: 'absolute', left: 14, right: 14, zIndex: 8, flexDirection: 'row', padding: 6, borderRadius: 20, boxShadow: '0px 18px 30px -16px rgba(0,0,0,0.6)' },
  dockBg: { ...StyleSheet.absoluteFill, borderRadius: 20, overflow: 'hidden' },
  dockB: { flex: 1, alignItems: 'center', gap: 3, paddingVertical: 7, borderRadius: 14 },
  dockB0: { backgroundColor: 'rgba(27,138,211,0.9)' },
  dockT: { ...font('sans', 600), fontSize: 10.5, lineHeight: 15.225 },
});

function Ib({ label, onPress, children, testID }: { label: string; onPress: () => void; children: React.ReactNode; testID: string }): React.JSX.Element {
  return (
    <Pressable style={s.ib} onPress={onPress} accessibilityLabel={label} testID={testID}>
      {children}
    </Pressable>
  );
}

function Reader({ id }: { id: string }): React.JSX.Element {
  const { sat, sab } = useInsets();
  const a = ARTICLES.find(x => x.id === id) as ArticlesItem;
  const caDate = useStore(st => st.ca.date);
  const saved = useStore(st => st.saved.has(id));
  const arSize = useStore(st => st.arSize);
  const [y, setY] = useState(0);
  const [prog, setProg] = useState(0);
  const list = caPool(caDate);
  const idx = list.findIndex(x => x.id === id);
  const nx = idx >= 0 ? list[(idx + 1) % list.length] : list[0];
  const dt = idx >= 0 ? parseD(caDate) : today();
  const sc = SUBJ[a.s].hex;
  const solid = useTransition(y > 160 ? 1 : 0, 300, easeCss);
  const solidSt = useAnimatedStyle(() => ({ opacity: solid.value }));
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>): void => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const p = contentSize.height - layoutMeasurement.height;
    setProg(p > 0 ? Math.min(100, (contentOffset.y / p) * 100) : 0);
    setY(contentOffset.y);
  };
  const bodyP = [s.p, BODY[arSize] ?? BODY[1]];
  const dock: [IconName, string, string][] = [
    ['spark', 'Ask', 'mentor'],
    ['notes', 'To notes', `toast:Added to Notes › ${a.topic}`],
    ['layers', 'Flashcards', 'toast:5 flashcards made from this story'],
    ['check', 'Done', 'toast:Marked as read'],
  ];
  return (
    <View style={s.page}>
      <ScrollView style={StyleSheet.absoluteFill} contentContainerStyle={s.scrollC} onScroll={onScroll} scrollEventThrottle={16} showsVerticalScrollIndicator={false} testID="article.scroll">
        <View style={[s.hero, { paddingTop: sat + 64, backgroundImage: `linear-gradient(180deg, ${mixWhite(sc, 0.1)}, #FFFFFF)` }]}>
          <View style={s.art}>
            <SvgXml xml={articleArt(a.art, true)} width="100%" height="100%" />
          </View>
          <Txt style={s.dateLine}>
            <Txt style={[s.date, { color: sc }]}>{fmtLong(dt)}</Txt>
          </Txt>
          <Txt style={s.h1}>{a.t}</Txt>
          <View style={s.tags}>
            {aTags(a).map(t => {
              const gs = /^gs\d$/.test(t) ? (GSC as unknown as Record<string, string>)[t] : null;
              return (
                <View key={t} style={[s.tg, gs ? { backgroundColor: mixWhite(gs, 0.12) } : null]}>
                  <Txt style={[s.tgT, gs ? [s.tgGsT, { color: gs }] : null]}>{`#${t}`}</Txt>
                </View>
              );
            })}
          </View>
          <View style={s.meta}>
            <View style={s.metaS}>
              <Icon name="clock" size={14} color="#7A8494" />
              <Txt style={s.metaT}>{`${a.min} min read`}</Txt>
            </View>
            <View style={s.metaS}>
              <Icon name="target" size={14} color="#7A8494" />
              <Txt style={s.metaT}>{`${a.gs} · ${a.topic}`}</Txt>
            </View>
          </View>
        </View>
        <View style={s.body}>
          <View style={s.k}>
            <View style={s.kI}>
              <Icon name="doc" size={14} color="#FFD27A" />
            </View>
            <Txt style={s.kT}>{'Context & Deep Background'}</Txt>
          </View>
          {a.body.map((p, k) => (
            <View key={k} style={k < a.body.length - 1 ? s.pGap : null}>
              {k === 0 ? <DropCapP text={p} style={{ ...s.p, ...(BODY[arSize] ?? BODY[1]) }} /> : <Txt style={bodyP} systemDevanagari>{p}</Txt>}
            </View>
          ))}
          <View style={s.why}>
            <View style={s.wi}>
              <Icon name="target" color="#FFFFFF" />
            </View>
            <View style={s.whyB}>
              <Txt style={s.h6}>Why it matters for UPSC</Txt>
              <Txt style={s.whyP} systemDevanagari>
                {a.why}
              </Txt>
            </View>
          </View>
          <Txt style={[s.h6, s.arH]}>Prelims pointers</Txt>
          <View style={s.pts}>
            {a.pts.map((p, k) => (
              <View key={k} style={s.li}>
                <Txt style={s.liN}>{String(k + 1).padStart(2, '0')}</Txt>
                <Txt style={s.liT}>{p}</Txt>
              </View>
            ))}
          </View>
          <View style={s.mq}>
            <View style={s.mqH}>
              <Icon name="pen" size={14} color="#C47406" />
              <Txt style={[s.h6, s.mqHT]}>Mains angle</Txt>
            </View>
            <Txt style={s.mqP}>{a.mq}</Txt>
            <Pressable style={s.mqB} onPress={() => act('push:mains')} testID="article.mains">
              <Txt style={s.mqBT}>{'Write it & get it evaluated'}</Txt>
              <Icon name="arrow" size={15} color="#FFFFFF" />
            </Pressable>
          </View>
          {nx && nx.id !== id ? (
            <Pressable style={s.next} onPress={() => act('arNext', nx.id)} testID="article.next">
              <View style={s.nextD}>
                <Txt style={s.nextS}>{`Up next · ${nx.src}`}</Txt>
                <Txt style={s.nextB}>{nx.t}</Txt>
              </View>
              <View style={s.nextI}>
                <Icon name="arrow" color="#FFFFFF" />
              </View>
            </Pressable>
          ) : null}
        </View>
      </ScrollView>
      <View style={[s.top, { paddingTop: sat + 8 }]}>
        <Animated.View style={[s.solid, solidSt]} pointerEvents="none">
          <Backdrop px={12} tint="rgba(255,255,255,0.94)" />
        </Animated.View>
        <Ib label="Back" onPress={() => act('back')} testID="article.back">
          <Icon name="back" color="#14161C" />
        </Ib>
        <View style={s.src}>
          <SrcMg src={a.src} style={s.mg} textStyle={s.mgT} />
          <Txt style={s.srcT} numberOfLines={1}>
            {a.src}
          </Txt>
        </View>
        <Ib label="Text size" onPress={() => act('arSize')} testID="article.size">
          <Txt style={s.aa}>Aa</Txt>
        </Ib>
        <Ib label="Save" onPress={() => act('save', id)} testID="article.save">
          <Icon name="bookmark" color={saved ? '#1B8AD3' : '#14161C'} fill={saved ? '#1B8AD3' : 'none'} />
        </Ib>
        <View style={s.prog} pointerEvents="none">
          <View style={[s.progI, { width: `${prog}%` }]} />
        </View>
      </View>
      <View style={[s.dock, { bottom: sab + 12 }]}>
        <View style={s.dockBg} pointerEvents="none">
          <Backdrop px={12} tint="rgba(20,22,28,0.92)" tone="dark" />
        </View>
        {dock.map(([ic, label, verb], k) => {
          const color = k === 0 ? '#FFFFFF' : 'rgba(255,255,255,0.88)';
          return (
            <Pressable key={label} style={[s.dockB, k === 0 ? s.dockB0 : null]} onPress={() => act(verb)} testID={`article.dock${k}`}>
              <Icon name={ic} size={18} color={color} />
              <Txt style={[s.dockT, { color }]}>{label}</Txt>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

/** articleMount (L7311-L7319): marks the story read. The Current tab re-renders from S.ca by itself. */
function useMarkRead(id: string): void {
  const done = useRef<string | null>(null);
  useEffect(() => {
    if (done.current === id) return;
    done.current = id;
    const ca = getS().ca;
    setS({ ca: { ...ca, read: new Set([...(ca.read as Set<string>), id]) as Set<never> } });
  }, [id]);
}

function ArticleScreen({ arg }: ViewProps): React.JSX.Element | null {
  const id = arg ?? '';
  useMarkRead(id);
  if (!ARTICLES.some(x => x.id === id)) return null;
  // A.arNext replaces the page's markup (p.el.innerHTML = articleHTML(id)): a new reader, scrolled to the top.
  return <Reader key={id} id={id} />;
}

const view: ViewDef = {
  Screen: ArticleScreen,
};

export default view;
