// Source: PrepAssist.html L7849-L7862 (VIEWS.answerbank, the final definition)
// Source: PrepAssist.html L4105-L4129 (.ab-*), L3672-L3677, L4065 (.cx-fbar, .cx-seg), L9312-L9342 (ds overrides)
// Computed (reference/android view-answerbank, -gs2, -hindi, -row-open):
//   .cx-fbar.ab  row, border-bottom 1px rgba(184,110,0,.15); the .cx-seg is at most 220 wide (parts/Seg)
//   .ch2         paper filter (parts/Ch2)
//   .ab-card     margin-top 12, padding 16, radius 18, #fff, 0 0 0 1px #E6EBF1, overflow hidden;
//                ::before 3 px bar of --qc at left, top/bottom 16, radius 0 3 3 0
//   .ab-top      row, space-between; .ab-id ui-monospace 700 10.5px / 15.225px, letter-spacing .63px, #8A93A0
//                on #F3F5F8, padding 3 7, radius 6; .ab-mk Inter 700 11.5px / 16.675px --qc
//   .ab-topic    row gap 7, margin-top 10, padding 8 10, radius 14, mix(--qc 8%, #fff); Inter 600 11.5px /
//                15.525px mix(--qc 80%, #000); target icon 14, margin-top 1
//   .ab-q        margin-top 12; EB Garamond 400 18px / 24.84px #14161C (Hindi: Noto Sans Devanagari 400
//                16.5px / 26.4px); "Q." Inter Tight 800 15.5px --qc, margin-right 6
//   .ab-soon     inline-block, margin-top 8, padding 4 9, radius 8, #FFF3DF, 11.5px / 16.675px #B86E00
//   .ab-acts     row gap 8, margin-top 14; buttons flex 1, height 36, radius 12, row gap 6, Inter 700 13px /
//                18.85px; .ab-rev #F1F4F8 / #14161C (chevd 15 turns 180deg in .25s when open); .ab-ev #14161C / #fff
//   .ab-model    margin-top 14, padding-top 4, tabIn .35s; .ab-html 13.5px / 20.925px #3A404B; .ab-fw rows;
//                .ab-mf row space-between, margin-top 8, padding 10 12, radius 14, #F7F9FB
import React, { useEffect } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { act } from '../../actions';
import { Icon, RichText } from '../../components';
import { AB_META, ANSWERBANK, MODEL } from '../../data';
import type { AnswerbankItem } from '../../data';
import type { ViewDef } from '../../navigation/routes';
import { easeCss, useTransition } from '../../shell/anim';
import { useStore } from '../../store';
import { EASE, font, Txt } from '../../theme';
import { Ch2 } from './parts/Ch2';
import { Seg } from './parts/Seg';
import { mix, TlHero } from './parts/TlHero';

const easeVar = Easing.bezier(EASE[0], EASE[1], EASE[2], EASE[3]);

const s = StyleSheet.create({
  page: { paddingTop: 4, paddingHorizontal: 20, paddingBottom: 40 },
  fbar: { flexDirection: 'row', alignItems: 'center', gap: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(184, 110, 0, 0.15)' },
  seg: { flex: 1, maxWidth: 220 },
  card: { marginTop: 12, padding: 16, borderRadius: 18, backgroundColor: '#FFFFFF', boxShadow: '0px 0px 0px 1px #E6EBF1', overflow: 'hidden' },
  bar: { position: 'absolute', left: 0, top: 16, bottom: 16, width: 3, borderTopRightRadius: 3, borderBottomRightRadius: 3 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  id: {
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
    fontWeight: '700',
    fontSize: 10.5,
    lineHeight: 15.225,
    letterSpacing: 0.63,
    color: '#8A93A0',
    backgroundColor: '#F3F5F8',
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 6,
    overflow: 'hidden',
  },
  mk: { ...font('sans', 700), fontSize: 11.5, lineHeight: 16.675 },
  topic: { flexDirection: 'row', alignItems: 'flex-start', gap: 7, marginTop: 10, paddingVertical: 8, paddingHorizontal: 10, borderRadius: 14 },
  topicT: { ...font('sans', 600), flex: 1, fontSize: 11.5, lineHeight: 15.525 },
  q: { ...font('book', 400), marginTop: 12, fontSize: 18, lineHeight: 24.84, color: '#14161C' },
  qHi: { ...font('deva', 400), fontSize: 16.5, lineHeight: 26.4 },
  qQ: { ...font('serif', 800), fontSize: 15.5 },
  soon: { alignSelf: 'flex-start', marginTop: 8, paddingVertical: 4, paddingHorizontal: 9, borderRadius: 8, backgroundColor: '#FFF3DF' },
  soonT: { fontSize: 11.5, lineHeight: 16.675, color: '#B86E00' },
  acts: { flexDirection: 'row', gap: 8, marginTop: 14 },
  actB: { flex: 1, height: 36, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  actT: { ...font('sans', 700), fontSize: 13, lineHeight: 18.85 },
  model: { marginTop: 14, paddingTop: 4 },
  fw: { flexDirection: 'row', gap: 10, paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#F1F4F8' },
  fwN: { width: 26, height: 26, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  fwNt: { ...font('serif', 800), fontSize: 12.5, lineHeight: 18.125, color: '#FFFFFF' },
  fwB: { ...font('sans', 700), fontSize: 13.5, lineHeight: 19.575 },
  fwP: { fontSize: 13.5, lineHeight: 20.925, color: '#3A404B', marginTop: 3 },
  mf: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 14, backgroundColor: '#F7F9FB' },
  mfL: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  mfLt: { fontSize: 11.5, lineHeight: 16.675, color: '#7A8494' },
  mfB: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  mfBt: { ...font('sans', 700), fontSize: 12.5, lineHeight: 18.125, color: '#1B8AD3' },
});

const html = {
  base: { fontSize: 13.5, lineHeight: 20.925, color: '#3A404B' },
  b: { ...font('sans', 700) },
  i: { ...font('sans', 400, true) },
};

/** `.ab-model`: `animation: tabIn .35s var(--ease)` */
function AbModel({ q, qc }: { q: AnswerbankItem; qc: string }): React.JSX.Element {
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withTiming(1, { duration: 350, easing: easeVar });
  }, [p]);
  const a = useAnimatedStyle(() => ({ opacity: p.value, transform: [{ translateY: 6 * (1 - p.value) }] }));
  return (
    <Animated.View style={[s.model, a]}>
      {q.fw ? (
        q.fw.map((f, i) => (
          <View key={i} style={s.fw}>
            <View style={[s.fwN, { backgroundColor: qc }]}>
              <Txt style={s.fwNt}>{i + 1}</Txt>
            </View>
            <View style={{ flex: 1 }}>
              <Txt style={s.fwB}>{f[0]}</Txt>
              <Txt style={s.fwP}>{f[1]}</Txt>
            </View>
          </View>
        ))
      ) : (
        <RichText html={MODEL} styles={html} />
      )}
      <View style={s.mf}>
        <View style={s.mfL}>
          <Icon name="spark" size={14} color="#7A8494" />
          <Txt style={s.mfLt}>Framework by PrepAssist faculty</Txt>
        </View>
        <Pressable style={s.mfB} onPress={() => act('toast:Saved to your notes')}>
          <Icon name="bookmark" size={14} color="#1B8AD3" />
          <Txt style={s.mfBt}>Save</Txt>
        </Pressable>
      </View>
    </Animated.View>
  );
}

function Chev({ open }: { open: boolean }): React.JSX.Element {
  const r = useTransition(open ? 1 : 0, 250, easeCss);
  const a = useAnimatedStyle(() => ({ transform: [{ rotate: `${r.value * 180}deg` }] }));
  return (
    <Animated.View style={a}>
      <Icon name="chevd" size={15} color="#14161C" />
    </Animated.View>
  );
}

function Card({ q, hi, open }: { q: AnswerbankItem; hi: boolean; open: boolean }): React.JSX.Element {
  const M = AB_META[q.id] || { topic: q.p, c: '#1B8AD3' };
  const qc = M.c;
  const isHi = hi && !!q.hi;
  return (
    <View style={s.card}>
      <View style={[s.bar, { backgroundColor: qc }]} />
      <View style={s.top}>
        <Txt style={s.id}>ID · {q.code}</Txt>
        <Txt style={[s.mk, { color: qc }]}>
          {q.p} · {q.m} marks · {q.w} words
        </Txt>
      </View>
      <View style={[s.topic, { backgroundColor: mix(qc, 0.08, '#FFFFFF') }]}>
        <Icon name="target" size={14} color={mix(qc, 0.8, '#000000')} style={{ marginTop: 1 }} />
        <Txt style={[s.topicT, { color: mix(qc, 0.8, '#000000') }]}>{M.topic}</Txt>
      </View>
      <Txt style={[s.q, isHi && s.qHi]}>
        <Txt style={[s.qQ, { color: qc }]}>
          Q<Txt style={{ letterSpacing: 6 }}>.</Txt>
        </Txt>
        {isHi ? q.hi : q.t}
      </Txt>
      {hi && !q.hi ? (
        <View style={s.soon}>
          <Txt style={s.soonT}>हिन्दी संस्करण जल्द आ रहा है</Txt>
        </View>
      ) : null}
      <View style={s.acts}>
        <Pressable style={[s.actB, { backgroundColor: '#F1F4F8' }]} onPress={() => act(`abOpen:${q.id}`)} testID={`answerbank.open.${q.id}`}>
          <Txt style={[s.actT, { color: '#14161C' }]}>{open ? 'Hide answer' : 'Model answer'}</Txt>
          <Chev open={open} />
        </Pressable>
        <Pressable style={[s.actB, { backgroundColor: '#14161C' }]} onPress={() => act(`mainsWith:${q.id}`)} testID={`answerbank.eval.${q.id}`}>
          <Txt style={[s.actT, { color: '#FFFFFF' }]}>Evaluate my answer</Txt>
          <Icon name="arrow" size={15} color="#FFFFFF" />
        </Pressable>
      </View>
      {open ? <AbModel q={q} qc={qc} /> : null}
    </View>
  );
}

function AnswerbankScreen(): React.JSX.Element {
  const B = useStore(st => st.ab);
  const list = ANSWERBANK.filter(q => B.p === 'All' || q.p === B.p);
  return (
    <View style={s.page}>
      <TlHero
        id="answerbank"
        title={['Model answers, ', 'decoded']}
        sub="Study examiner-ready frameworks, then write your own and get it evaluated."
        stats={[
          [String(ANSWERBANK.length), 'questions'],
          ['GS I–IV', 'papers'],
          ['EN · हिं', 'languages'],
        ]}
      />
      <View style={s.fbar}>
        <Seg
          kind="cx"
          style={s.seg}
          items={[
            { label: 'English', act: 'abLang:en', on: B.lang === 'en' },
            { label: 'हिन्दी', act: 'abLang:hi', on: B.lang === 'hi' },
          ]}
        />
      </View>
      <Ch2 items={['All', 'GS I', 'GS II', 'GS III', 'GS IV'].map(p => ({ label: p === 'All' ? 'All papers' : p, act: `abP:${p}`, on: B.p === p }))} />
      {list.map(q => (
        <Card key={q.id} q={q} hi={B.lang === 'hi'} open={!!B.open[q.id]} />
      ))}
    </View>
  );
}

const view: ViewDef = {
  useTitle: () => 'Mains Answer Bank',
  Screen: AnswerbankScreen,
};

export default view;
