// Source: PrepAssist.html L7828-L7828 (VIEWS.pqb)
// Source: PrepAssist.html L8069-L8092 (pqbHTML)
// Source: PrepAssist.html L8094-L8094 (pqRedraw)
// Source: PrepAssist.html L4370-L4410 (.pq-*), L3221 (.ar-ib), L4115 (.hi), L9366-L9393 (ds overrides)
// Focus view: the whole page. Computed (reference/android view-pqb, -correct, -q2, -wrong, -hindi):
//   .pq-top    row gap 10, padding (--sat + 8) 14 8, #fff; .ar-ib 38 round rgba(255,255,255,.92) with
//              0 0 0 1px rgba(20,30,50,.08), 0 6px 14px -8px rgba(20,30,50,.35); .pq-tt b Inter 700 15.5px /
//              22.475px, small inline 11.5px #7A8494 (line box 22.475)
//   .pq-bar    row gap 10, padding 4 14 10, #fff, border-bottom #EEF2F6; .pq-lang 3 padding radius 10 #EEF1F6,
//              buttons 28 high padding 0 10 radius 8 Inter 700 12.5px #5B6472 (.on #fff #6C5DD3 shadow
//              0 1px 4px rgba(20,30,50,.15)); .pq-prog 5 high #EEF2F7, fill gradient #6C5DD3 -> #1B8AD3;
//              .pq-reset Inter 700 12.5px #C0392B, refresh 14
//   .pq-scroll absolute from --sat + 112, padding 16 20 110, #F5F7FA
//   .pq-card   padding 16, radius 18, #fff, 0 0 0 1px #E6EBF1 ... (see the styles below)
//   .pq-nav    absolute bottom, row space-between gap 10, padding 12 14 (12 + --sab), rgba(255,255,255,.96) +
//              blur(12px), border-top #EEF2F6
// pqRedraw() rebuilds the page (p.el.innerHTML), so the page is keyed on S.pqRender.
import React, { useEffect, useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import type { ScrollViewInstance } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { act } from '../../actions';
import { onPqExplanation } from '../../actions/practice';
import { Backdrop, Icon } from '../../components';
import { PQB } from '../../data';
import type { ViewDef } from '../../navigation/routes';
import { useStore } from '../../store';
import type { PqbState } from '../../store/slices/practice';
import { EASE, font, Txt, useInsets } from '../../theme';
import { enIN, pqbOptClass, pqbProgress, pqbQuestion, pqbSubtitle } from './logic/pqb';

const easeVar = Easing.bezier(EASE[0], EASE[1], EASE[2], EASE[3]);
const L = 'ABCD';
const INK = '#14161C';

const s = StyleSheet.create({
  page: { flex: 1 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingBottom: 8, backgroundColor: '#FFFFFF' },
  ib: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    boxShadow: '0px 0px 0px 1px rgba(20, 30, 50, 0.08), 0px 6px 14px -8px rgba(20, 30, 50, 0.35)',
  },
  tt: { flex: 1, minWidth: 0 },
  ttB: { ...font('sans', 700), fontSize: 15.5, lineHeight: 22.475 },
  ttS: { fontSize: 11.5, lineHeight: 22.475, color: '#7A8494' },
  bar: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: 4, paddingHorizontal: 14, paddingBottom: 10, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#EEF2F6' },
  lang: { flexDirection: 'row', padding: 3, borderRadius: 10, backgroundColor: '#EEF1F6' },
  langB: { height: 28, paddingHorizontal: 10, borderRadius: 8, justifyContent: 'center' },
  langOn: { backgroundColor: '#FFFFFF', boxShadow: '0px 1px 4px 0px rgba(20, 30, 50, 0.15)' },
  langT: { ...font('sans', 700), fontSize: 12.5, lineHeight: 18.125, color: '#5B6472', textAlign: 'center' },
  prog: { flex: 1, height: 5, borderRadius: 5, backgroundColor: '#EEF2F7', overflow: 'hidden' },
  progI: { height: '100%', maxWidth: '100%', borderRadius: 5, backgroundImage: 'linear-gradient(90deg, #6C5DD3, #1B8AD3)' },
  reset: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  resetT: { ...font('sans', 700), fontSize: 12.5, lineHeight: 18.125, color: '#C0392B' },
  scroll: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#F5F7FA' },
  scrollC: { paddingTop: 16, paddingHorizontal: 20, paddingBottom: 110 },
  card: { padding: 16, borderRadius: 18, backgroundColor: '#FFFFFF', boxShadow: '0px 0px 0px 1px #E6EBF1' },
  meta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  metaS: { ...font('sans', 700), flexShrink: 1, fontSize: 11.5, lineHeight: 16.675, color: '#6C5DD3' },
  metaE: { ...font('sans', 800), fontSize: 10.5, lineHeight: 15.225, letterSpacing: 0.63, textTransform: 'uppercase', color: '#B86E00', backgroundColor: '#FFF3DF', paddingVertical: 3, paddingHorizontal: 8, borderRadius: 6, overflow: 'hidden' },
  h6: { ...font('sans', 800), fontSize: 10.5, lineHeight: 15.225, letterSpacing: 1.47, textTransform: 'uppercase', color: '#98A1AD' },
  soon: { alignSelf: 'flex-start', marginTop: 8, paddingVertical: 4, paddingHorizontal: 9, borderRadius: 8, backgroundColor: '#FFF3DF' },
  soonT: { fontSize: 11.5, lineHeight: 16.675, color: '#B86E00' },
  q: { ...font('sans', 500), marginTop: 6, fontSize: 18, lineHeight: 26.1, color: INK },
  qHi: { ...font('deva', 500), lineHeight: 28.8 },
  st: { marginTop: 12, paddingVertical: 12, paddingRight: 12, paddingLeft: 30, borderRadius: 14, backgroundColor: '#F7F9FB' },
  stN: { ...font('sans', 800), position: 'absolute', left: -26, width: 22, textAlign: 'right', fontSize: 14.5, lineHeight: 22.475, color: '#6C5DD3' },
  stT: { fontSize: 14.5, lineHeight: 22.475, color: '#25272D' },
  hi: { ...font('deva', 400) },
  ask: { ...font('sans', 700), marginTop: 12, fontSize: 14.5, lineHeight: 21.025, color: INK },
  opts: { gap: 8, marginTop: 12 },
  o: { flexDirection: 'row', alignItems: 'center', gap: 11, padding: 12, minHeight: 52, borderRadius: 14, backgroundColor: '#FFFFFF', boxShadow: '0px 0px 0px 1.5px #E6EBF1' },
  oL: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F1F4F8' },
  oLt: { ...font('sans', 800), fontSize: 13.5, lineHeight: 19.575, color: '#5B6472' },
  oB: { ...font('sans', 500), flex: 1, fontSize: 15.5, lineHeight: 22.475 },
  ex: { marginTop: 16 },
  v: { flexDirection: 'row', alignItems: 'center', gap: 9, paddingVertical: 11, paddingHorizontal: 12, borderRadius: 14 },
  vI: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  vT: { ...font('sans', 700), fontSize: 14.5, lineHeight: 21.025 },
  exH: { marginTop: 14 },
  e: { marginTop: 8, paddingVertical: 11, paddingHorizontal: 12, borderRadius: 13, borderLeftWidth: 3 },
  eB: { ...font('sans', 700), fontSize: 13.5, lineHeight: 22.475 },
  eP: { fontSize: 13.5, lineHeight: 20.25, color: '#3A404B', marginTop: 3 },
  exp: { fontSize: 13.5, lineHeight: 20.925, color: '#3A404B', marginTop: 6 },
  ask2: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, alignSelf: 'flex-start' },
  ask2T: { ...font('sans', 700), fontSize: 13.5, lineHeight: 19.575, color: '#6C5DD3' },
  nav: { position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingTop: 12, paddingHorizontal: 14, borderTopWidth: 1, borderTopColor: '#EEF2F6' },
  navB: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 44, paddingHorizontal: 16, borderRadius: 14, backgroundColor: '#F1F4F8' },
  navNx: { backgroundImage: 'linear-gradient(90deg, #6C5DD3, #1B8AD3)', boxShadow: '0px 12px 20px -12px rgba(108, 93, 211, 0.9)' },
  navT: { ...font('sans', 700), fontSize: 14.5, lineHeight: 21.025 },
  navS: { fontSize: 12.5, lineHeight: 22.475, color: '#7A8494' },
  navSb: { ...font('serif', 800), fontSize: 15.5, color: INK },
});

/** `.pq-ex`: `animation: tabIn .35s var(--ease)` */
function Ex({ children, onLayout }: { children: React.ReactNode; onLayout: (y: number) => void }): React.JSX.Element {
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withTiming(1, { duration: 350, easing: easeVar });
  }, [p]);
  const a = useAnimatedStyle(() => ({ opacity: p.value, transform: [{ translateY: 6 * (1 - p.value) }] }));
  return (
    <Animated.View style={[s.ex, a]} onLayout={e => onLayout(e.nativeEvent.layout.y)}>
      {children}
    </Animated.View>
  );
}

function Page({ P }: { P: PqbState }): React.JSX.Element {
  const { sat, sab } = useInsets();
  const scroll = useRef<ScrollViewInstance>(null);
  const exY = useRef(0);
  const pending = useRef(0);
  const tryScroll = (): void => {
    if (pending.current > Date.now() && exY.current > 0) scroll.current?.scrollTo({ y: exY.current, animated: true });
  };
  useEffect(
    () =>
      onPqExplanation(() => {
        pending.current = Date.now() + 600;
        tryScroll();
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- tryScroll reads refs only
    [],
  );
  const q = pqbQuestion(P, PQB);
  const H = P.lang === 'hi' && q.hi ? q.hi : null;
  const sel = P.sel[P.i];
  const ans = sel != null;
  const opts = H ? H.o : q.o;
  const st = H ? H.st : q.st;
  const exs = H ? H.exs : q.exs;
  const askT = H ? H.ask : q.ask;
  const ok = sel === q.a;
  const tone = {
    '': null,
    dim: null,
    ok: { box: { backgroundColor: '#F0F9F2', boxShadow: '0px 0px 0px 2px #2F8A4A' }, c: '#2F8A4A' },
    bad: { box: { backgroundColor: '#FDF1F1', boxShadow: '0px 0px 0px 2px #D64545' }, c: '#D64545' },
  } as const;
  return (
    <View style={s.page}>
      <View style={[s.top, { paddingTop: sat + 8 }]}>
        <Pressable style={s.ib} onPress={() => act('back')} accessibilityLabel="Back" testID="pqb.back">
          <Icon name="back" color={INK} />
        </Pressable>
        <View style={s.tt}>
          <Txt style={s.ttB}>Prelims Question Bank</Txt>
          <Txt style={s.ttS}>{pqbSubtitle(P, PQB)}</Txt>
        </View>
        <Pressable style={s.ib} onPress={() => act('pqHist')} accessibilityLabel="History" testID="pqb.hist">
          <Icon name="history" color={INK} />
        </Pressable>
      </View>
      <View style={s.bar}>
        <View style={s.lang}>
          {(
            [
              ['en', 'EN'],
              ['hi', 'हिं'],
            ] as const
          ).map(([k, l]) => (
            <Pressable key={k} style={[s.langB, P.lang === k && s.langOn]} onPress={() => act(`pqLang:${k}`)} testID={`pqb.lang.${k}`}>
              <Txt style={[s.langT, P.lang === k && { color: '#6C5DD3' }]}>{l}</Txt>
            </Pressable>
          ))}
        </View>
        <View style={s.prog}>
          <View style={[s.progI, { width: `${pqbProgress(P.i)}%` }]} />
        </View>
        <Pressable style={s.reset} onPress={() => act('pqReset')} testID="pqb.reset">
          <Icon name="refresh" size={14} color="#C0392B" />
          <Txt style={s.resetT}>Reset</Txt>
        </Pressable>
      </View>
      <ScrollView ref={scroll} style={[s.scroll, { top: sat + 112 }]} contentContainerStyle={s.scrollC} onContentSizeChange={tryScroll} showsVerticalScrollIndicator={false} testID="pqb.scroll">
        <View style={s.card}>
          <View style={s.meta}>
            <Txt style={s.metaS}>
              {q.subj} · {q.topic}
            </Txt>
            <Txt style={s.metaE}>{q.pyq}</Txt>
          </View>
          <Txt style={[s.h6, { marginTop: 12 }]}>Question {P.i + 1}</Txt>
          {P.lang === 'hi' && !q.hi ? (
            <View style={s.soon}>
              <Txt style={s.soonT}>इस प्रश्न का हिन्दी संस्करण जल्द आएगा</Txt>
            </View>
          ) : null}
          <Txt style={[s.q, H && s.qHi]}>{H ? H.q : q.q}</Txt>
          {st && st.length ? (
            <View style={s.st}>
              {st.map((x, k) => (
                <View key={k} style={k > 0 && { marginTop: 8 }}>
                  <Txt style={s.stN}>{k + 1}.</Txt>
                  <Txt style={[s.stT, H && s.hi]}>{x}</Txt>
                </View>
              ))}
            </View>
          ) : null}
          {askT ? <Txt style={[s.ask, H && s.hi]}>{askT}</Txt> : null}
          <View style={s.opts}>
            {opts.map((o, k) => {
              const c = pqbOptClass(P, q, k);
              const tn = tone[c];
              return (
                <Pressable key={k} style={[s.o, tn && tn.box, c === 'dim' && { opacity: 0.55 }]} onPress={() => act(`pqPick:${k}`)} disabled={ans} testID={`pqb.opt.${k}`}>
                  <View style={[s.oL, tn && { backgroundColor: tn.c }]}>
                    <Txt style={[s.oLt, tn && { color: '#FFFFFF' }]}>{L[k]}</Txt>
                  </View>
                  <Txt style={[s.oB, H && { ...font('deva', 500) }]}>{o}</Txt>
                  {c === 'ok' ? <Icon name="check" size={18} color="#2F8A4A" /> : c === 'bad' ? <Icon name="x" size={18} color="#D64545" /> : null}
                </Pressable>
              );
            })}
          </View>
          {ans ? (
            <Ex
              onLayout={y => {
                // the card's top in the scroll content is 16; the card has padding 16
                exY.current = 16 + y;
                tryScroll();
              }}>
              <View style={[s.v, { backgroundColor: ok ? '#E8F5EC' : '#FDECEC' }]}>
                <View style={[s.vI, { backgroundColor: ok ? '#2F8A4A' : '#D64545' }]}>
                  <Icon name={ok ? 'check' : 'x'} size={15} strokeWidth={2.6} color="#FFFFFF" />
                </View>
                <Txt style={[s.vT, { color: ok ? '#22703A' : '#A42A2A' }]}>{ok ? 'Correct — nicely done' : 'Not quite — answer ' + L[q.a]}</Txt>
              </View>
              <Txt style={[s.h6, s.exH]}>Explanation</Txt>
              {exs ? (
                exs.map((e, k) => (
                  <View key={k} style={[s.e, e[2] ? { backgroundColor: '#F3FAF5', borderLeftColor: '#2F8A4A' } : { backgroundColor: '#FDF5F5', borderLeftColor: '#D64545' }]}>
                    <Txt style={[s.eB, { color: e[2] ? '#22703A' : '#A42A2A' }, H && s.hi]}>{e[0]}</Txt>
                    <Txt style={[s.eP, H && s.hi]}>{e[1]}</Txt>
                  </View>
                ))
              ) : (
                <Txt style={s.exp}>{q.ex}</Txt>
              )}
              <Pressable style={s.ask2} onPress={() => act('mentor')}>
                <Icon name="spark" size={15} color="#6C5DD3" />
                <Txt style={s.ask2T}>Ask the Mentor why</Txt>
              </Pressable>
            </Ex>
          ) : null}
        </View>
      </ScrollView>
      <View style={[s.nav, { paddingBottom: 12 + sab }]}>
        <Backdrop px={12} tint="rgba(255, 255, 255, 0.96)" />
        <Pressable style={[s.navB, P.i === 0 && { opacity: 0.4 }]} onPress={() => act('pqNav:-1')} disabled={P.i === 0} testID="pqb.prev">
          <Icon name="back" size={17} color="#25272D" />
          <Txt style={s.navT}>Back</Txt>
        </Pressable>
        <Txt style={s.navS}>
          <Txt style={s.navSb}>{enIN(P.i + 1)}</Txt> of 8,790
        </Txt>
        <Pressable style={[s.navB, s.navNx]} onPress={() => act('pqNav:1')} testID="pqb.next">
          <Txt style={[s.navT, { color: '#FFFFFF' }]}>Next</Txt>
          <Icon name="arrow" size={17} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}

function PqbScreen(): React.JSX.Element {
  const P = useStore(st => st.pqb);
  const n = useStore(st => st.pqRender);
  return <Page key={n} P={P} />;
}

const view: ViewDef = {
  Screen: PqbScreen,
};

export default view;
