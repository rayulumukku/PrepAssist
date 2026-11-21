// Source: PrepAssist.html L10020-L10020 (VIEWS.xrayhome)
// Source: PrepAssist.html L9863-L9890 (x4Home)
// Source: PrepAssist.html L9401-L9472 (.x4-hero … .x4-empty), L4091-L4093 (.tq-s), L3998-L4000 + L9292-L9300 (.mu-h), L4059-L4064 + L9350 (.ch2)
// Computed (reference/android/view-xrayhome, -environment, -processing, -after-upload):
//   .me-page.tlp  padding 4 20 40
//   .x4-hero      margin 2 0 12, padding 14 16 12, radius 20; radial(80% 70% at 100% 0%, --sc 70%, transparent 62%) over
//                 linear(155deg, #0A1630, #122A4E 58%, #183C6B); ::after 1px rgba(255,255,255,.035) line every 24px from the bottom
//   .x4-hc        row wrap, space-between, centred, gap 10: h1 (order -1) EB Garamond 500 19 / 20.9, em #FFE27A italic;
//                 badge 20 high, padding 0 8, pill, rgba(255,255,255,.12) + 1px rgba(255,255,255,.2), 9px 800 ls 1.26 uppercase
//   .x4-stats     margin-top 10, gap 6; div padding 6 9, radius 10, baseline row gap 5; b Inter Tight 800 15/15; span 10.5 / 15.225 72% white
//   .x4-subs      chips 34 high, padding 0 14, gap 8, row margin 0 -20 14 / padding 0 20 2; .on = subject colour; em 20 high count
//   .x4-drop      padding 12, radius 18, white, ring 1px #E6EBF1; .x4-dz dashed 1px mix(--sc 35%, #DCE4ED) on mix(--sc 5%, #fff)
//   .x4-proc      padding 16, radius 18; page 44x56 with a scanning band; % Inter Tight 800 18 --sc; bar 6 high; .tq-s rows
//   .mu-h.mu-h2   margin 28 0 12; h2 Inter 700 18 / 21.6 ls -0.18 #14161C; span 12.5 #7A8494
//   .x4-card      padding 12 14 12 12, radius 18, gap 13, ring 1px #E6EBF1; :active scale(.985) over .15s
import React, { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { act } from '../../actions';
import { Icon } from '../../components';
import type { IconName } from '../../icons/iconPaths.generated';
import { X4SUB } from '../../data';
import type { ViewDef } from '../../navigation/routes';
import { easeVar, useTransition } from '../../shell/anim';
import { useStore } from '../../store';
import { font, Txt } from '../../theme';
import { mix } from './mix';
import { PressScale } from './PressScale';
import { seenN, subC, subN } from './xray/x4';

/** .x4-badge i: animation dpu 2s infinite (ease): 70% { 0 0 0 8px transparent } 100% { 0 0 0 0 transparent } from 0 0 0 3px rgba(63,208,138,.25) */
function BadgeDot(): React.JSX.Element {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withRepeat(withSequence(withTiming(0.7, { duration: 1400, easing: Easing.ease }), withTiming(1, { duration: 600, easing: Easing.ease })), -1);
  }, [t]);
  const ring = useAnimatedStyle(() => {
    const p = t.value;
    const spread = p <= 0.7 ? 3 + (5 * p) / 0.7 : 8 - (8 * (p - 0.7)) / 0.3;
    const a = p <= 0.7 ? 0.25 * (1 - p / 0.7) : 0;
    return { width: 6 + 2 * spread, height: 6 + 2 * spread, borderRadius: 3 + spread, left: -spread, top: -spread, backgroundColor: `rgba(63, 208, 138, ${a})` };
  });
  return (
    <View style={s.badgeI}>
      <Animated.View style={[s.badgeRing, ring]} />
      <View style={s.badgeDot} />
    </View>
  );
}

/** .x4p-pg::after: animation x4Scan 1.4s ease-in-out infinite alternate (translateY 0 -> 44px) */
function ScanBand({ c }: { c: string }): React.JSX.Element {
  const y = useSharedValue(0);
  useEffect(() => {
    y.value = withRepeat(withTiming(44, { duration: 1400, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, [y]);
  const anim = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  return <Animated.View style={[s.band, { backgroundImage: `linear-gradient(180deg, transparent, ${mix(c, 70, 'transparent')})` }, anim]} />;
}

/** .x4-proc .tq-s.run svg.ic: border 2px #DCE4EE, top --sc, animation sp .8s linear infinite */
function Spin({ c }: { c: string }): React.JSX.Element {
  const r = useSharedValue(0);
  useEffect(() => {
    r.value = withRepeat(withTiming(360, { duration: 800, easing: Easing.linear }), -1);
  }, [r]);
  const anim = useAnimatedStyle(() => ({ transform: [{ rotate: `${r.value}deg` }] }));
  return <Animated.View style={[s.spin, { borderTopColor: c }, anim]} />;
}

function ProcBar({ pc, c }: { pc: number; c: string }): React.JSX.Element {
  // .x4p-bar i{transition:width .5s var(--ease)}
  const w = useTransition(pc, 500, easeVar);
  const anim = useAnimatedStyle(() => ({ width: `${w.value}%` }));
  return (
    <View style={s.bar}>
      <Animated.View style={[s.barI, { backgroundColor: c }, anim]} />
    </View>
  );
}

function XrayhomeScreen(): React.JSX.Element {
  const k = useStore(st => st.x4.sub);
  const B = useStore(st => st.x4.busy);
  const seen = useStore(st => st.x4.seen);
  const XSC = useStore(st => st.XSC);
  const c = subC(k);
  const list = XSC.filter(x => x.s === k);
  const ins = list.reduce((a, x) => a + x.ins.length, 0);
  const trm = list.reduce((a, x) => a + Object.keys(x.terms).length, 0);
  const steps = ['Uploading your ' + (B && B.kind === 'pdf' ? 'PDF' : 'page'), 'Reading the text', 'Spotting key insights', 'Linking statutory terms', 'Writing mentor notes'];

  return (
    <View style={s.page}>
      <View style={s.hero}>
        <View style={[StyleSheet.absoluteFill, s.heroGlow, { backgroundImage: `radial-gradient(80% 70% at 100% 0%, ${mix(c, 70, 'transparent')}, transparent 62%)` }]} />
        <View style={s.heroLines} pointerEvents="none" />
        <View style={s.hc}>
          <Txt style={s.h1}>
            {'Read like the '}
            <Txt style={s.h1Em}>examiner</Txt>
          </Txt>
          <View style={s.badge}>
            <BadgeDot />
            <Txt style={s.badgeTx}>Smart X-Ray Matrix</Txt>
          </View>
        </View>
        <View style={s.stats}>
          <View style={s.stat}>
            <Txt style={s.statB}>{list.length}</Txt>
            <View style={s.statS}>
              <Txt style={s.statTx}>{`${subN(k)} scans`}</Txt>
            </View>
          </View>
          <View style={s.stat}>
            <Txt style={s.statB}>{ins}</Txt>
            <View style={s.statS}>
              <View style={[s.statI, { backgroundColor: '#FFE27A' }]} />
              <Txt style={s.statTx}>key insights</Txt>
            </View>
          </View>
          <View style={s.stat}>
            <Txt style={s.statB}>{trm}</Txt>
            <View style={s.statS}>
              <View style={[s.statI, { backgroundColor: '#8FE0F7' }]} />
              <Txt style={s.statTx}>terms</Txt>
            </View>
          </View>
        </View>
      </View>

      <ScrollView horizontal style={s.subs} contentContainerStyle={s.subsC} showsHorizontalScrollIndicator={false}>
        {X4SUB.map(([sk, n]) => {
          const on = sk === k;
          return (
            <Pressable
              key={sk}
              style={[s.sub, on ? { backgroundColor: subC(sk), boxShadow: 'none' } : null]}
              onPress={() => act('x4Sub', sk)}
              accessibilityRole="tab"
              testID={`xrayhome.sub.${sk}`}>
              <Txt style={[s.subTx, on && s.subTxOn]}>{n}</Txt>
              <View style={[s.subEm, on && s.subEmOn]}>
                <Txt style={[s.subEmTx, on && s.subEmTxOn]}>{XSC.filter(x => x.s === sk).length}</Txt>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      {B ? (
        <View style={s.proc} testID="xrayhome.proc">
          <View style={s.ph}>
            <View style={s.pg}>
              {[0, 1, 2, 3, 4, 5].map(i => (
                <View key={i} style={s.pgI} />
              ))}
              <ScanBand c={c} />
            </View>
            <View style={s.phD}>
              <Txt style={s.phB}>{`X-raying your ${B.kind === 'pdf' ? 'PDF' : 'page'}…`}</Txt>
              <Txt style={s.phSmall}>About 10 seconds · stay on this screen</Txt>
            </View>
            <Txt style={[s.pc, { color: c }]}>{`${B.pc}%`}</Txt>
          </View>
          <ProcBar pc={B.pc} c={c} />
          {steps.map((st, i) => {
            const ok = i < B.done;
            const run = i === B.run;
            return (
              <View key={i} style={s.tq}>
                {run ? (
                  <Spin c={c} />
                ) : (
                  <View style={[s.tqI, ok && s.tqIOk]}>
                    <Icon name="check" size={12} color={ok ? '#FFFFFF' : 'transparent'} />
                  </View>
                )}
                <Txt style={[s.tqTx, (ok || run) && s.tqTxOn]}>{st}</Txt>
              </View>
            );
          })}
        </View>
      ) : (
        <View style={s.drop}>
          <View style={[s.dz, { borderColor: mix(c, 35, '#DCE4ED'), backgroundColor: mix(c, 5, '#FFFFFF') }]}>
            <View style={[s.dzi, { backgroundColor: c, boxShadow: `0px 10px 18px -10px ${c}` }]}>
              <Icon name="upload" size={22} color="#FFFFFF" />
            </View>
            <View style={s.dzD}>
              <Txt style={s.dzB}>X-Ray a new page</Txt>
              <Txt style={s.dzSmall}>Newspaper, textbook or coaching notes — one page or a multi-page PDF.</Txt>
            </View>
          </View>
          <View style={s.src}>
            {(
              [
                ['cam', 'camera', 'Camera'],
                ['img', 'image', 'Gallery'],
                ['pdf', 'file', 'PDF'],
              ] as [string, IconName, string][]
            ).map(([kind, ic, label], i) => (
              <Pressable key={kind} style={[s.srcB, i === 0 && { backgroundColor: c, boxShadow: 'none' }]} onPress={() => act('x4Up', kind)} testID={`xrayhome.up.${kind}`}>
                <Icon name={ic} size={20} color={i === 0 ? '#FFFFFF' : c} />
                <Txt style={[s.srcTx, i === 0 && s.srcTxOn]}>{label}</Txt>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      <View style={s.muH}>
        <Txt style={s.muH2}>{`Past ${subN(k)} scans`}</Txt>
        <Txt style={s.muSpan}>{list.length ? 'Newest first' : ''}</Txt>
      </View>
      {list.length ? (
        <View style={s.list}>
          {list.map(x => {
            const n = x.ins.length;
            const sn = seenN(x, seen);
            return (
              <PressScale key={x.id} scale={0.985} ms={150} style={s.card} onPress={() => act('push:xray:' + x.id)} testID={`xrayhome.card.${x.id}`}>
                <View style={s.th}>
                  <View style={[s.thBar, { backgroundColor: c }]} />
                  <View style={s.thI} />
                  <View style={[s.thI, s.thY]} />
                  <View style={s.thI} />
                  <View style={[s.thI, s.thC]} />
                  <View style={s.thI} />
                  <View style={[s.thI, s.thY]} />
                  <View style={s.thI} />
                </View>
                <View style={s.cb}>
                  <View style={s.cbSmall}>
                    <Txt style={s.cbSmallTx}>{`${x.d} · ${x.src.split(' · ')[0]}`}</Txt>
                    <View style={[s.cbEm, x.isNew && { backgroundColor: c }]}>
                      <Txt style={[s.cbEmTx, x.isNew && s.cbEmTxN]}>{x.isNew ? 'New' : 'Ready'}</Txt>
                    </View>
                  </View>
                  <Txt style={s.cbB} numberOfLines={2}>
                    {x.t}
                  </Txt>
                  <View style={s.ct}>
                    <View style={[s.ctS, s.ctY]}>
                      <View style={[s.ctI, { backgroundColor: '#8A6400' }]} />
                      <Txt style={[s.ctTx, { color: '#8A6400' }]}>{`${n} insight${n > 1 ? 's' : ''}`}</Txt>
                    </View>
                    <View style={[s.ctS, s.ctC]}>
                      <View style={[s.ctI, { backgroundColor: '#0B7FA6' }]} />
                      <Txt style={[s.ctTx, { color: '#0B7FA6' }]}>{`${Object.keys(x.terms).length} terms`}</Txt>
                    </View>
                  </View>
                  <View style={s.pr}>
                    <View style={s.prBar}>
                      <View style={[s.prI, { width: `${(sn / n) * 100}%` }]} />
                    </View>
                    <Txt style={s.prSmall}>{sn ? `${sn} of ${n} explored` : 'Not started'}</Txt>
                  </View>
                </View>
                <Icon name="chev" size={16} color="#AEB7C3" />
              </PressScale>
            );
          })}
        </View>
      ) : (
        <View style={s.empty}>
          <Txt style={s.emptyB}>{`No ${subN(k)} scans yet`}</Txt>
          <Txt style={s.emptyP}>Scan your first page above — it takes about 10 seconds.</Txt>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  page: { paddingTop: 4, paddingHorizontal: 20, paddingBottom: 40 },
  hero: {
    marginTop: 2,
    marginBottom: 12,
    paddingTop: 14,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundImage: 'linear-gradient(155deg, #0A1630, #122A4E 58%, #183C6B)',
  },
  heroGlow: {},
  heroLines: {
    ...StyleSheet.absoluteFill,
    backgroundImage: 'linear-gradient(0deg, transparent 23px, rgba(255, 255, 255, 0.035) 23px)',
    backgroundSize: '100% 24px',
    backgroundRepeat: 'repeat',
    backgroundPosition: 'left bottom',
  },
  hc: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  h1: { ...font('book', 500), fontSize: 19, lineHeight: 20.9, color: '#FFFFFF' },
  h1Em: { ...font('book', 400, true), color: '#FFE27A' },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 20,
    paddingHorizontal: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  badgeI: { width: 6, height: 6 },
  badgeRing: { position: 'absolute' },
  badgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#3FD08A' },
  badgeTx: { ...font('sans', 800), fontSize: 9, lineHeight: 13.05, letterSpacing: 1.26, textTransform: 'uppercase', color: '#FFFFFF' },
  stats: { flexDirection: 'row', gap: 6, marginTop: 10 },
  stat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 5,
    paddingVertical: 6,
    paddingHorizontal: 9,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.09)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
  },
  statB: { ...font('serif', 800), fontSize: 15, lineHeight: 15, color: '#FFFFFF' },
  statS: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  statI: { width: 8, height: 8, borderRadius: 2 },
  statTx: { fontSize: 10.5, lineHeight: 15.225, color: 'rgba(255, 255, 255, 0.72)' },

  subs: { marginHorizontal: -20, marginBottom: 14, flexGrow: 0 },
  subsC: { gap: 8, paddingHorizontal: 20, paddingBottom: 2 },
  sub: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    height: 34,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 0px 0px 1px #E1E8F0',
  },
  subTx: { ...font('sans', 600), fontSize: 12.5, lineHeight: 18.125, color: '#3A404B' },
  subTxOn: { color: '#FFFFFF' },
  subEm: { minWidth: 20, height: 20, paddingHorizontal: 6, borderRadius: 10, backgroundColor: '#F1F4F8', alignItems: 'center', justifyContent: 'center' },
  subEmOn: { backgroundColor: 'rgba(255, 255, 255, 0.22)' },
  subEmTx: { ...font('sans', 800), fontSize: 11, lineHeight: 15.95, color: '#7A8494', textAlign: 'center' },
  subEmTxOn: { color: '#FFFFFF' },

  drop: { padding: 12, borderRadius: 18, backgroundColor: '#FFFFFF', boxShadow: '0px 0px 0px 1px #E6EBF1' },
  dz: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, borderRadius: 14, borderWidth: 1, borderStyle: 'dashed' },
  dzi: { width: 46, height: 46, borderRadius: 14, flexShrink: 0, alignItems: 'center', justifyContent: 'center' },
  dzD: { flex: 1 },
  dzB: { ...font('sans', 700), fontSize: 15, lineHeight: 21.75, color: '#14161C' },
  dzSmall: { fontSize: 12, lineHeight: 16.8, color: '#7A8494', marginTop: 3 },
  src: { flexDirection: 'row', gap: 8, marginTop: 10 },
  srcB: {
    flex: 1,
    alignItems: 'center',
    gap: 5,
    paddingTop: 11,
    paddingHorizontal: 4,
    paddingBottom: 10,
    borderRadius: 14,
    backgroundColor: '#F6F8FB',
    boxShadow: 'inset 0px 0px 0px 1px #E6EBF1',
  },
  srcTx: { ...font('sans', 700), fontSize: 12.5, lineHeight: 18.125, textAlign: 'center' },
  srcTxOn: { color: '#FFFFFF' },

  proc: { padding: 16, borderRadius: 18, backgroundColor: '#FFFFFF', boxShadow: '0px 0px 0px 1px #E6EBF1' },
  ph: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  pg: { width: 44, height: 56, flexShrink: 0, borderRadius: 6, backgroundColor: '#FFFEFA', boxShadow: '0px 0px 0px 1px #E6E1D6', overflow: 'hidden', paddingVertical: 8, paddingHorizontal: 6 },
  pgI: { height: 3, marginTop: 4, borderRadius: 2, backgroundColor: '#E5E2DA' },
  band: { position: 'absolute', left: 0, right: 0, top: 0, height: 14 },
  phD: { flex: 1 },
  phB: { ...font('sans', 700), fontSize: 15, lineHeight: 21.75, color: '#14161C' },
  // small is inline: its line box is 17.4 (the div is 44.22 = 21.75 + 22.475)
  phSmall: { fontSize: 12, lineHeight: 22.475, color: '#7A8494' },
  pc: { ...font('serif', 800), fontSize: 18, lineHeight: 26.1 },
  bar: { height: 6, borderRadius: 6, backgroundColor: '#EEF2F7', marginTop: 14, marginBottom: 6, overflow: 'hidden' },
  barI: { height: 6, borderRadius: 6 },
  tq: { flexDirection: 'row', alignItems: 'center', gap: 9, paddingVertical: 6 },
  tqI: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#EEF2F7', alignItems: 'center', justifyContent: 'center' },
  tqIOk: { backgroundColor: '#2F8A4A' },
  spin: { width: 16, height: 16, borderRadius: 8, borderWidth: 2, borderColor: '#DCE4EE' },
  tqTx: { fontSize: 13.5, lineHeight: 19.575, color: '#98A1AD' },
  tqTxOn: { color: '#14161C' },

  muH: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 10, marginTop: 28, marginBottom: 12 },
  muH2: { ...font('sans', 700), fontSize: 18, lineHeight: 21.6, letterSpacing: -0.18, color: '#14161C' },
  muSpan: { fontSize: 12.5, lineHeight: 18.125, color: '#7A8494' },
  list: { gap: 10 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    paddingTop: 12,
    paddingRight: 14,
    paddingBottom: 12,
    paddingLeft: 12,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 0px 0px 1px #E6EBF1',
  },
  th: {
    width: 52,
    height: 66,
    flexShrink: 0,
    paddingTop: 9,
    paddingHorizontal: 7,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 9,
    borderBottomRightRadius: 9,
    borderBottomLeftRadius: 5,
    backgroundColor: '#FFFEFA',
    boxShadow: '0px 0px 0px 1px #ECE7DC, 0px 8px 14px -10px rgba(40, 30, 15, 0.5)',
  },
  thBar: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, borderTopLeftRadius: 5, borderBottomLeftRadius: 5 },
  thI: { height: 3.5, marginTop: 5, borderRadius: 2, backgroundColor: '#E5E2DA' },
  thY: { height: 5, backgroundColor: '#FFE27A' },
  thC: { width: '45%', backgroundColor: '#8FE0F7' },
  cb: { flex: 1 },
  cbSmall: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cbSmallTx: { fontSize: 11.5, lineHeight: 16.675, color: '#8A93A0' },
  cbEm: { paddingVertical: 2, paddingHorizontal: 6, borderRadius: 5, backgroundColor: '#E8F5EC' },
  cbEmTx: { ...font('sans', 800), fontSize: 9.5, lineHeight: 13.775, letterSpacing: 0.76, color: '#2F8A4A' },
  cbEmTxN: { color: '#FFFFFF' },
  cbB: { ...font('book', 500), fontSize: 17, lineHeight: 20.74, color: '#14161C', marginTop: 3 },
  ct: { flexDirection: 'row', gap: 6, marginTop: 8 },
  ctS: { flexDirection: 'row', alignItems: 'center', gap: 5, height: 22, paddingHorizontal: 8, borderRadius: 7 },
  ctY: { backgroundColor: '#FFF6D6' },
  ctC: { backgroundColor: '#E2F5FB' },
  ctI: { width: 7, height: 7, borderRadius: 2 },
  ctTx: { ...font('sans', 700), fontSize: 11, lineHeight: 15.95 },
  pr: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  prBar: { flex: 1, height: 4, borderRadius: 4, backgroundColor: '#EEF2F7', overflow: 'hidden' },
  prI: { height: 4, borderRadius: 4, backgroundColor: '#2F8A4A' },
  prSmall: { fontSize: 11, lineHeight: 15.95, color: '#8A93A0' },
  empty: { alignItems: 'center', paddingVertical: 24, paddingHorizontal: 20, borderRadius: 18, backgroundColor: '#FFFFFF', boxShadow: '0px 0px 0px 1px #E6EBF1' },
  emptyB: { ...font('book', 500), fontSize: 19, lineHeight: 27.55, color: '#14161C', marginTop: 8, textAlign: 'center' },
  emptyP: { fontSize: 13, lineHeight: 18.85, color: '#7A8494', marginTop: 4, textAlign: 'center' },
});

const view: ViewDef = {
  useTitle: () => 'X-Ray Reading',
  Screen: XrayhomeScreen,
};

export default view;
