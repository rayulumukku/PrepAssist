// Source: PrepAssist.html L9981-L9991 (x4Sheet)
// Source: PrepAssist.html L9964-L9980 (x4TabBody), L9998-L10004 (x4OpenSheet)
// Source: PrepAssist.html L9529-L9574 (.x4s …, .x4c …, .x4m-…), L9630-L9650 (sheet v4), L9679-L9700 (colour follows the active tab), L4386-L4397 + L9388-L9390 (.pq-o, .pq-v)
// The insight sheet builds its own head (sh-grab + .x4s-h). Its colours follow the tab colour --tc
// through color-mix(), computed here with mix(). The whole-sheet background (#sheet:has(.x4s),
// L9682) is the absolutely positioned first child.
// Computed (reference/android/sheet-xray-insight-tab1 … tab5, -mcq-correct):
//   .x4s-h      padding 0 12 8 20, space-between, 44 high; .x4s-k 10.5px 800 ls 1.47 uppercase, i 8x8 #FFE27A + 3px #FFF6D6 ring
//   .x4s-ib     36 circle, icon 18, colour mix(tc 70%, #14161C)
//   .x4s-q      EB Garamond 15 / 23.25 #1E222A, border-left 3px #F2C230, padding 2 0 2 14, margin 0 20, max-height 94, scrolls
//   .x4s-tabs   margin-top 14, padding 0 16 12, gap 4, scrolls sideways; button 32 high, padding 0 13, pill
//   .x4s-body   margin 0 10, radius 22 22 0 0, white, padding 20 18 22, scrolls; .x4c animates in (x4In .3s var(--ease))
//   .x4s-f      margin 0 10, padding 10 16 12, border-top 1px #EEF1F5, gap 8; .nv 44 high radius 14, 13.5px 700
import React, { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { act } from '../../actions';
import { Icon, SheetGrab } from '../../components';
import { NCOL, RIC, TABS } from '../../data';
import type { XscItem } from '../../data';
import type { IconName } from '../../icons/iconPaths.generated';
import type { SheetProps } from '../../navigation/routes';
import { alpha, mix } from '../../screens/library/mix';
import { insText, scanBy } from '../../screens/library/xray/x4';
import { useStore } from '../../store';
import type { X4State } from '../../store/slices/library';
import { EASE, font, Txt } from '../../theme';

const L = 'ABCD';
const easeVar = Easing.bezier(EASE[0], EASE[1], EASE[2], EASE[3]);

/** .x4c{animation:x4In .3s var(--ease)} @keyframes x4In{from{opacity:0;transform:translateX(var(--dx,14px))}} */
function X4In({ dx, children }: { dx: number; children: React.ReactNode }): React.JSX.Element {
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withTiming(1, { duration: 300, easing: easeVar });
  }, [p]);
  const anim = useAnimatedStyle(() => ({ opacity: p.value, transform: [{ translateX: (1 - p.value) * dx }] }));
  return <Animated.View style={anim}>{children}</Animated.View>;
}

function TabBody({ sc, i, t, x4, tc }: { sc: XscItem; i: number; t: number; x4: X4State; tc: string }): React.JSX.Element {
  const I = sc.ins[i];
  if (t === 0) {
    return (
      <View>
        <Txt style={s.lead}>{I.ctx}</Txt>
        <Txt style={[s.h6, { color: tc }]}>Key takeaways</Txt>
        <View>
          {I.pts.map((p, k) => (
            <View key={k} style={[s.pt, k > 0 && { borderTopWidth: 1, borderTopColor: mix(tc, 10, '#EEF2F6') }]}>
              <View style={[s.ptN, { backgroundColor: tc }]}>
                <Txt style={s.ptNTx}>{k + 1}</Txt>
              </View>
              <Txt style={s.ptTx}>{p}</Txt>
            </View>
          ))}
        </View>
      </View>
    );
  }
  if (t === 1) {
    return (
      <View>
        <View style={s.links}>
          {I.links.map((l, k) => (
            <View key={k} style={[s.link, { backgroundColor: mix(tc, 10, '#FFFFFF') }]}>
              <Icon name="link" size={13} color={mix(tc, 85, '#000000')} />
              <Txt style={[s.linkTx, { color: mix(tc, 85, '#000000') }]}>{l}</Txt>
            </View>
          ))}
        </View>
        <Txt style={s.lead}>{I.st}</Txt>
        <View style={[s.tip, { borderTopColor: mix(tc, 12, '#EEF2F6') }]}>
          <Icon name="pen" size={17} color="#E8890C" />
          <Txt style={s.tipTx}>Quote one of these links in your Mains answer to show static–current integration.</Txt>
        </View>
      </View>
    );
  }
  if (t === 2) {
    const m = I.mcq;
    const v = x4.mcq[sc.id + ':' + i];
    const done = v !== undefined;
    return (
      <View>
        <Txt style={s.q}>{m.q}</Txt>
        {m.st.length ? (
          <>
            <View style={s.st}>
              {m.st.map((x, k) => (
                <View key={k} style={[s.stLi, k > 0 && s.stLiN]}>
                  <Txt style={s.stMark}>{`${k + 1}.`}</Txt>
                  <Txt style={s.stTx}>{x}</Txt>
                </View>
              ))}
            </View>
            <Txt style={s.ask}>Select the correct answer using the code given below:</Txt>
          </>
        ) : null}
        <View style={s.opts}>
          {m.o.map((o, k) => {
            const c = done ? (k === m.a ? 'ok' : k === v ? 'bad' : 'dim') : '';
            return (
              <Pressable
                key={k}
                style={[s.o, c === 'ok' && s.oOk, c === 'bad' && s.oBad, c === 'dim' && s.oDim]}
                disabled={done}
                onPress={() => act('x4Mcq', String(k))}
                testID={`xrayInsight.opt.${k}`}>
                <View style={[s.oL, c === 'ok' && s.oLOk, c === 'bad' && s.oLBad]}>
                  <Txt style={[s.oLTx, (c === 'ok' || c === 'bad') && s.oLTxOn]}>{L[k]}</Txt>
                </View>
                <Txt style={s.oB}>{o}</Txt>
                {c === 'ok' ? <Icon name="check" size={18} color="#2F8A4A" /> : c === 'bad' ? <Icon name="x" size={18} color="#D64545" /> : null}
              </Pressable>
            );
          })}
        </View>
        {done ? (
          <>
            <View style={[s.v, v === 'r' ? s.vRev : v === m.a ? s.vOk : s.vBad]}>
              <View style={[s.vI, { backgroundColor: v === 'r' ? '#1B8AD3' : v === m.a ? '#2F8A4A' : '#D64545' }]}>
                <Icon name={v === 'r' ? 'eye' : v === m.a ? 'check' : 'x'} size={15} strokeWidth={2.6} color="#FFFFFF" />
              </View>
              <Txt style={[s.vTx, { color: v === 'r' ? '#0F5E99' : v === m.a ? '#22703A' : '#A42A2A' }]}>
                {v === 'r' ? 'Correct answer: (' + L[m.a] + ')' : v === m.a ? 'Correct — well done' : 'Not quite · correct answer (' + L[m.a] + ')'}
              </Txt>
            </View>
            <View style={s.ex}>
              <Txt style={s.exSmall}>Explanation</Txt>
              <Txt style={s.exTx}>{m.ex}</Txt>
            </View>
            <View style={s.acts}>
              <Pressable style={s.act} onPress={() => act('x4McqReset')} testID="xrayInsight.retry">
                <Icon name="refresh" size={15} color="#14161C" />
                <Txt style={s.actTx}>Try again</Txt>
              </Pressable>
              <Pressable style={s.act} onPress={() => act('x4Tab', '3')} testID="xrayInsight.toNews">
                <Txt style={s.actTx}>Current affairs</Txt>
                <Icon name="arrow" size={15} color="#14161C" />
              </Pressable>
            </View>
          </>
        ) : (
          <Pressable style={s.rev} onPress={() => act('x4Mcq', 'r')} testID="xrayInsight.reveal">
            <Icon name="eye" size={15} color="#5B6472" />
            <Txt style={s.revTx}>Reveal answer & explanation</Txt>
          </Pressable>
        )}
      </View>
    );
  }
  if (t === 3) {
    return (
      <View style={s.news}>
        <View style={s.newsLine} />
        {I.ca.map(([d, src, x], k) => {
          const nc = NCOL[src];
          return (
            <View key={k} style={s.nLi}>
              <View style={[s.nDot, { boxShadow: `inset 0px 0px 0px 3px ${nc}` }]} />
              <View style={s.nM}>
                <Txt style={s.nSmall}>{d}</Txt>
                <View style={[s.nEm, { backgroundColor: mix(nc, 12, '#FFFFFF') }]}>
                  <Txt style={[s.nEmTx, { color: nc }]}>{src}</Txt>
                </View>
              </View>
              <Txt style={s.nP}>{x}</Txt>
            </View>
          );
        })}
      </View>
    );
  }
  return (
    <View style={s.refs}>
      {I.refs.map(([ty, x, m], k) => (
        <View key={k} style={s.ref}>
          <View style={s.refI}>
            <Icon name={((RIC as unknown as Record<string, IconName>)[ty] || 'doc') as IconName} size={17} color="#2F8A4A" />
          </View>
          <View style={s.refD}>
            <Txt style={s.refB}>{x}</Txt>
            <Txt style={s.refSmall}>{m}</Txt>
          </View>
          <View style={s.refEm}>
            <Txt style={s.refEmTx}>{ty}</Txt>
          </View>
        </View>
      ))}
    </View>
  );
}

function XrayInsightSheet(_: SheetProps): React.JSX.Element {
  const x4 = useStore(st => st.x4);
  const list = useStore(st => st.XSC);
  const sc = scanBy(x4.scan, list);
  const i = x4.cur;
  const t = x4.tab;
  const n = sc.ins.length;
  const tc = TABS[t][4];
  const mk = x4.mcq[sc.id + ':' + i] !== undefined;
  const bg = `linear-gradient(180deg, ${mix(tc, 22, '#FFFFFF')} 0px, ${mix(tc, 9, '#FFFFFF')} 210px, #F7F8FA 300px)`;
  return (
    <View style={s.root}>
      <View style={[StyleSheet.absoluteFill, { backgroundImage: bg }]} />
      <SheetGrab color={mix(tc, 35, '#FFFFFF')} />
      <View style={s.x4s}>
        <View style={s.h}>
          <View style={s.k}>
            <View style={s.kI} />
            <Txt style={[s.kTx, { color: mix(tc, 80, '#000000') }]}>{`Key insight ${i + 1}`}</Txt>
            <Txt style={[s.kTx, s.kEm, { color: mix(tc, 45, '#6B7380') }]}>{`of ${n}`}</Txt>
          </View>
          <View style={s.ha}>
            {(
              [
                ['x4Save', 'bookmark', 'Save to notes'],
                ['x4Ask', 'spark', 'Ask the mentor'],
                ['closeSheet', 'close', 'Close'],
              ] as const
            ).map(([a, ic, label]) => (
              <Pressable key={a} style={s.ib} onPress={() => act(a)} accessibilityLabel={label} testID={`xrayInsight.${a}`}>
                <Icon name={ic} size={18} color={mix(tc, 70, '#14161C')} />
              </Pressable>
            ))}
          </View>
        </View>
        <ScrollView style={s.q4} contentContainerStyle={s.q4c} showsVerticalScrollIndicator={false}>
          <Txt style={s.q4Tx}>{`“${insText(sc, i)}”`}</Txt>
        </ScrollView>
        <ScrollView horizontal style={s.tabs} contentContainerStyle={s.tabsC} showsHorizontalScrollIndicator={false}>
          {TABS.map((T, k) => {
            const on = k === t;
            return (
              <Pressable
                key={k}
                style={[
                  s.tab,
                  on
                    ? { backgroundColor: tc, boxShadow: `0px 8px 16px -10px ${tc}` }
                    : { backgroundColor: 'rgba(255, 255, 255, 0.75)', boxShadow: `inset 0px 0px 0px 1px ${mix(tc, 18, '#E6EBF1')}` },
                ]}
                onPress={() => act('x4Tab', String(k))}
                accessibilityRole="tab"
                testID={`xrayInsight.tab.${k}`}>
                <Txt style={[s.tabTx, { color: on ? '#FFFFFF' : mix(tc, 35, '#4A515C') }]}>{k === 1 ? 'Static' : T[1]}</Txt>
                {k === 2 && mk ? <View style={s.tabDot} /> : null}
              </Pressable>
            );
          })}
        </ScrollView>
        <ScrollView
          key={`${sc.id}:${i}:${t}`}
          style={[s.body, { boxShadow: `0px -1px 0px 0px ${mix(tc, 14, '#E8ECF2')}, 0px -12px 24px -20px ${alpha(tc, 0.6)}` }]}
          contentContainerStyle={s.bodyC}
          showsVerticalScrollIndicator={false}
          testID="xrayInsight.body">
          <X4In dx={x4.dx ?? 14}>
            <TabBody sc={sc} i={i} t={t} x4={x4} tc={tc} />
          </X4In>
        </ScrollView>
        <View style={s.f}>
          <Pressable style={[s.nv, { backgroundColor: mix(tc, 8, '#F1F4F8') }, i === 0 && s.nvOff]} disabled={i === 0} onPress={() => act('x4Step', '-1')} testID="xrayInsight.prev">
            <Icon name="chevl" size={16} color="#14161C" />
            <Txt style={s.nvTx}>Previous</Txt>
          </Pressable>
          <Pressable
            style={[s.nv, { backgroundColor: tc, boxShadow: `0px 10px 18px -12px ${tc}` }, i === n - 1 && s.nvOff]}
            disabled={i === n - 1}
            onPress={() => act('x4Step', '1')}
            testID="xrayInsight.next">
            <Txt style={[s.nvTx, s.nvTxNx]}>Next</Txt>
            <Icon name="chev" size={16} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  x4s: { flex: 1 },
  h: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, height: 44, paddingRight: 12, paddingBottom: 8, paddingLeft: 20 },
  k: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  kI: { width: 8, height: 8, borderRadius: 2, backgroundColor: '#FFE27A', boxShadow: '0px 0px 0px 3px #FFF6D6' },
  kTx: { ...font('sans', 800), fontSize: 10.5, lineHeight: 15.225, letterSpacing: 1.47, textTransform: 'uppercase' },
  kEm: { ...font('sans', 600), letterSpacing: 0.21, textTransform: 'none' },
  ha: { flexDirection: 'row', gap: 2 },
  ib: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  q4: { flexGrow: 0, flexShrink: 0, maxHeight: 94, marginHorizontal: 20, borderLeftWidth: 3, borderLeftColor: '#F2C230' },
  q4c: { paddingTop: 2, paddingBottom: 2, paddingLeft: 14 },
  q4Tx: { ...font('book', 400), fontSize: 15, lineHeight: 23.25, color: '#1E222A' },
  tabs: { flexGrow: 0, flexShrink: 0, marginTop: 14 },
  tabsC: { gap: 4, paddingHorizontal: 16, paddingBottom: 12 },
  tab: { flexDirection: 'row', alignItems: 'center', gap: 4, height: 32, paddingHorizontal: 13, borderRadius: 999 },
  tabTx: { ...font('sans', 600), fontSize: 12.5, lineHeight: 18.125, textAlign: 'center' },
  tabDot: { width: 6, height: 6, borderRadius: 3, marginLeft: 5, backgroundColor: '#2F8A4A' },
  body: { flex: 1, marginHorizontal: 10, borderTopLeftRadius: 22, borderTopRightRadius: 22, backgroundColor: '#FFFFFF' },
  bodyC: { paddingTop: 20, paddingHorizontal: 18, paddingBottom: 22 },
  f: { flexDirection: 'row', gap: 8, marginHorizontal: 10, paddingTop: 10, paddingHorizontal: 16, paddingBottom: 12, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#EEF1F5' },
  nv: { flex: 1, height: 44, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  nvOff: { opacity: 0.35 },
  nvTx: { ...font('sans', 700), fontSize: 13.5, lineHeight: 19.575, color: '#14161C', textAlign: 'center' },
  nvTxNx: { color: '#FFFFFF' },

  // tab 0
  lead: { fontSize: 15, lineHeight: 24.75 },
  h6: { ...font('sans', 800), fontSize: 10.5, lineHeight: 15.225, letterSpacing: 1.47, textTransform: 'uppercase', marginTop: 20, marginBottom: 6 },
  pt: { paddingTop: 9, paddingBottom: 9, paddingLeft: 28 },
  ptN: { position: 'absolute', left: 0, top: 10, width: 18, height: 18, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  ptNTx: { ...font('sans', 800), fontSize: 10.5, lineHeight: 12.71, color: '#FFFFFF' },
  ptTx: { fontSize: 14, lineHeight: 21 },
  // tab 1
  links: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  link: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 28, paddingHorizontal: 11, borderRadius: 999 },
  linkTx: { ...font('sans', 700), fontSize: 11.5, lineHeight: 16.675 },
  tip: { flexDirection: 'row', gap: 10, marginTop: 14, paddingTop: 12, borderTopWidth: 1 },
  tipTx: { flex: 1, fontSize: 12.5, lineHeight: 18.75, color: '#6B5A3A' },
  // tab 2
  q: { ...font('sans', 600), fontSize: 16, lineHeight: 23.2, color: '#14161C' },
  st: { marginTop: 10, paddingTop: 12, paddingRight: 12, paddingBottom: 12, paddingLeft: 30, borderRadius: 14, backgroundColor: '#F7F9FB' },
  stLi: {},
  stLiN: { marginTop: 8 },
  stMark: { position: 'absolute', right: '100%', marginRight: 4, top: 0, ...font('sans', 800), fontSize: 14.5, lineHeight: 22.475, color: '#6C5DD3' },
  stTx: { fontSize: 14.5, lineHeight: 22.475 },
  ask: { ...font('sans', 700), fontSize: 14, lineHeight: 20.3, color: '#14161C', marginTop: 10 },
  opts: { gap: 8, marginTop: 12 },
  o: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    minHeight: 52,
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 0px 0px 1.5px #E6EBF1',
  },
  oOk: { backgroundColor: '#F0F9F2', boxShadow: '0px 0px 0px 2px #2F8A4A' },
  oBad: { backgroundColor: '#FDF1F1', boxShadow: '0px 0px 0px 2px #D64545' },
  oDim: { opacity: 0.55 },
  oL: { width: 30, height: 30, borderRadius: 15, flexShrink: 0, backgroundColor: '#F1F4F8', alignItems: 'center', justifyContent: 'center' },
  oLOk: { backgroundColor: '#2F8A4A' },
  oLBad: { backgroundColor: '#D64545' },
  oLTx: { ...font('sans', 800), fontSize: 13.5, lineHeight: 19.575, color: '#5B6472' },
  oLTxOn: { color: '#FFFFFF' },
  oB: { ...font('sans', 500), flex: 1, fontSize: 15.5, lineHeight: 22.475 },
  v: { flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 14, paddingVertical: 11, paddingHorizontal: 12, borderRadius: 14 },
  vOk: { backgroundColor: '#E8F5EC' },
  vBad: { backgroundColor: '#FDECEC' },
  vRev: { backgroundColor: '#EAF4FC' },
  vI: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  vTx: { ...font('sans', 700), flexShrink: 1, fontSize: 14.5, lineHeight: 21.025 },
  ex: { marginTop: 10, paddingVertical: 13, paddingHorizontal: 14, borderRadius: 14, backgroundColor: '#F6F8FB' },
  exSmall: { ...font('sans', 800), fontSize: 10.5, lineHeight: 16.8, letterSpacing: 1.47, textTransform: 'uppercase', color: '#8A93A0', marginBottom: 4 },
  exTx: { fontSize: 14, lineHeight: 22.4, color: '#3A404B' },
  acts: { flexDirection: 'row', gap: 8, marginTop: 12 },
  act: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, height: 42, borderRadius: 13, backgroundColor: '#F1F4F8' },
  actTx: { ...font('sans', 700), fontSize: 13, lineHeight: 18.85, color: '#14161C', textAlign: 'center' },
  rev: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 42,
    marginTop: 12,
    borderRadius: 13,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#C9D4E2',
  },
  revTx: { ...font('sans', 700), fontSize: 13, lineHeight: 18.85, color: '#5B6472', textAlign: 'center' },
  // tab 3
  news: { paddingLeft: 22 },
  newsLine: { position: 'absolute', left: 6, top: 8, bottom: 8, width: 2, borderRadius: 1, backgroundColor: '#E6EBF1' },
  nLi: { paddingBottom: 16 },
  nDot: { position: 'absolute', left: -21, top: 6, width: 12, height: 12, borderRadius: 6, backgroundColor: '#FFFFFF' },
  nM: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  nSmall: { ...font('sans', 700), fontSize: 11.5, lineHeight: 16.675, color: '#8A93A0' },
  nEm: { paddingVertical: 2, paddingHorizontal: 7, borderRadius: 6 },
  nEmTx: { ...font('sans', 800), fontSize: 10.5, lineHeight: 15.225 },
  nP: { marginTop: 5, fontSize: 14, lineHeight: 21 },
  // tab 4
  refs: { gap: 8 },
  ref: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 14, backgroundColor: '#F6F8FB' },
  refI: { width: 36, height: 36, borderRadius: 11, flexShrink: 0, backgroundColor: '#EAF7EE', alignItems: 'center', justifyContent: 'center' },
  refD: { flex: 1, minWidth: 0 },
  refB: { ...font('sans', 600), fontSize: 13.5, lineHeight: 18.225, color: '#14161C' },
  refSmall: { fontSize: 11.5, lineHeight: 16.675, color: '#8A93A0', marginTop: 2 },
  refEm: { flexShrink: 0, paddingVertical: 3, paddingHorizontal: 7, borderRadius: 6, backgroundColor: '#F1F4F8' },
  refEmTx: { ...font('sans', 800), fontSize: 10, lineHeight: 14.5, letterSpacing: 0.6, textTransform: 'uppercase', color: '#5B6472' },
});

export default XrayInsightSheet;
