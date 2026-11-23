// Source: PrepAssist.html L8255-L8275 (renderLearn: .l-hero, .l-resume, .lx-top), L1857-L1883 (.l-hero … .l-play CSS), L4458-L4465 (.lx-ess), L3999-L4000 (.mu-h)
// Source: PrepAssist.html L10644-L10651 (planthemes: .l-hero background and ::after sheen)
// Values: reference/android/tab-learn/dom.json (computed).
//   .l-hero    padding calc(var(--sat)+14) 20 54, margin 0 -20, radius 0 0 28 28, radial(90% 80% at 100% 0%, #4FB0EC, transparent 60%) + linear(160deg, #1B8AD3, #1470B0 60%, #0F5A92)
//   .l-ill     absolute right -8 top calc(var(--sat)+6), 170 x 102, opacity .14
//   .l-eb      Inter 700 11.5 ls 1.61 uppercase, opacity .8, inline in a 22.475 line; h1 EB Garamond 500 34/34 ls -.34, margin-top 6
//   .l-up      38 x 38 circle, rgba(255,255,255,.16), border 1 rgba(255,255,255,.3), upload 18 #fff
//   .l-search  margin-top 18, 46 high, radius 14, #fff, padding 0 14, gap 10, shadow 0 10 20 -14 rgba(0,30,70,.6); search 18 #1B8AD3;
//              span 14.5/21.025 #7A8494; kbd monospace 11.5 #9AA3AF on #F7F9FC, border 1 #E1E8F0, radius 6, padding 2 6
//   .l-stats   margin-top 16, three equal columns; div padding 0 4, + div border-left 1 rgba(255,255,255,.22) padding-left 14;
//              b Inter Tight 800 22/22; span 11.5/16.675 opacity .85 margin-top 3
//   .l-resume  margin-top -34, z 2, row centred gap 14, padding 14, #fff, radius 22, shadow 0 20 36 -22 rgba(15,60,110,.55)
//   .l-bk      62 x 84, radius 4 8 8 4, linear(160deg, color-mix(--c 75%, #fff), --c), shadow 0 8 14 -8 --c, padding 8 6 6 10; ::before 2 px rgba(255,255,255,.35) at left 3
//   .l-rk      Inter 700 10.5 ls .84 uppercase #1B8AD3 (inline, 22.475 line); h3 EB Garamond 500 18/21.6 margin-top 3; p 12.5/18.125 #6B7280 margin-top 2
//   .l-pr      margin-top 8, gap 8; track 5 high radius 3 #E8EEF5, fill #1B8AD3; span Inter 700 11.5/16.675
//   .l-play    44 circle #1B8AD3, shadow 0 8 16 -8 rgba(27,138,211,.8), play 16 #fff margin-left 2
//   .lx-top    margin-top 28; .mu-h h2 Inter 700 18/21.6 ls -.18, margin-bottom 12
//   .lx-ess    #fff, radius 18, ring 1 #E6EBF1, 2 x 2; cells padding 14, gap 11, inner rules 1 #EEF2F6;
//              span 38 radius 12 color-mix(--a 10%, #fff), icon 18 --a; b Inter 600 14.5/21.025 nowrap; small 12.5/18.125 #7A8494 margin-top 2
import React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import Svg, { G, Path, Rect } from 'react-native-svg';
import { act } from '../../../actions';
import { Icon } from '../../../components';
import type { IconName } from '../../../icons/iconPaths.generated';
import { COURSES, LX, NOTESYS, SUBJ } from '../../../data';
import { useAppSize } from '../../../shell/AppSize';
import { useStore } from '../../../store';
import { font, Txt, useInsets, usePlan } from '../../../theme';
import { PLAN_HERO_BG, PlanSheen } from '../home/HomeSky';
import { lxStat, mix } from './learnLogic';

const HERO_BG = 'radial-gradient(90% 80% at 100% 0%, #4FB0EC 0%, transparent 60%), linear-gradient(160deg, #1B8AD3, #1470B0 60%, #0F5A92)';

export function LearnHero(): React.JSX.Element {
  const plan = usePlan();
  const { sat } = useInsets();
  const { w } = useAppSize();
  const docs = useStore(s => s.DOCS);
  const xrDone = useStore(s => s.xr.done);
  const pyq = Object.values(xrDone).reduce((a, b) => a + b, 0);
  return (
    <View style={[styles.hero, { paddingTop: sat + 14, backgroundImage: plan === 'free' ? HERO_BG : PLAN_HERO_BG[plan] }]} testID="learn.hero">
      <Svg style={[styles.ill, { top: sat + 6 }]} width={170} height={102} viewBox="0 0 200 120">
        <G fill="none" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <Rect x={20} y={30} width={26} height={80} rx={3} />
          <Rect x={50} y={20} width={22} height={90} rx={3} />
          <Rect x={76} y={38} width={30} height={72} rx={3} />
          <Path d="M112 110l20-78 22 6-20 78z" />
          <Path d="M28 44h10M56 34h10M84 52h14M24 96h18M54 96h14M82 96h20" />
          <Path d="M0 110h200" />
        </G>
      </Svg>
      <View style={styles.top}>
        <View>
          <Txt style={styles.eb}>Your library</Txt>
          <Txt style={styles.h1}>Learn</Txt>
        </View>
        <Pressable style={styles.up} onPress={() => act('push:upload')} accessibilityLabel="Upload" testID="learn.upload">
          <Icon name="upload" size={18} color="#fff" />
        </Pressable>
      </View>
      <Pressable style={styles.search} onPress={() => act('cmdk')} testID="learn.search">
        <Icon name="search" size={18} color="#1B8AD3" />
        <Txt style={styles.searchT}>Search notes, PDFs, X-Rays…</Txt>
        <View style={styles.kbd}>
          <Txt style={styles.kbdT}>/</Txt>
        </View>
      </Pressable>
      <View style={styles.stats}>
        {(
          [
            [NOTESYS.length, 'compendiums'],
            [docs.length, 'files in cloud'],
            [pyq, 'PYQ lines found'],
          ] as const
        ).map(([b, s], i) => (
          <View key={s} style={[styles.stat, i > 0 && styles.statLine]}>
            <Txt style={styles.statB}>{b}</Txt>
            <Txt style={styles.statS}>{s}</Txt>
          </View>
        ))}
      </View>
      <PlanSheen plan={plan} width={w} />
    </View>
  );
}

export function LearnResume(): React.JSX.Element {
  const c1 = COURSES[0];
  const sj1 = SUBJ[c1.s];
  return (
    <Pressable style={styles.resume} onPress={() => act('push:lesson')} testID="learn.resume">
      <View style={[styles.bk, { backgroundImage: `linear-gradient(160deg, ${mix(sj1.hex, 0.75, '#FFFFFF')}, ${sj1.hex})`, boxShadow: `0px 8px 14px -8px ${sj1.hex}` }]}>
        <View style={styles.bkSpine} />
        <Txt style={styles.bkS}>{sj1.n}</Txt>
        <Txt style={styles.bkB}>{c1.t.split(':')[0]}</Txt>
      </View>
      <View style={styles.rc}>
        <Txt style={styles.rk}>Resume · {sj1.n}</Txt>
        <Txt style={styles.rcH3}>{c1.t}</Txt>
        <Txt style={styles.rcP}>{c1.last}</Txt>
        <View style={styles.pr}>
          <View style={styles.prTrack}>
            <View style={[styles.prFill, { width: `${c1.p}%` }]} />
          </View>
          <Txt style={styles.prT}>{c1.p}%</Txt>
        </View>
      </View>
      <View style={styles.play}>
        <Icon name="play" size={16} color="#fff" style={styles.playIc} />
      </View>
    </Pressable>
  );
}

export function LearnEssentials(): React.JSX.Element {
  const nt = useStore(s => s.NT);
  const xrDone = useStore(s => s.xr.done);
  const docs = useStore(s => s.DOCS);
  const cell = (i: number): React.JSX.Element => {
    const f = LX[i];
    return (
      <Pressable key={f.k} style={[styles.ess, i % 2 === 0 && styles.essR, i < 2 && styles.essB]} onPress={() => act(f.act)} testID={`learn.ess.${f.k}`}>
        <View style={[styles.essI, { backgroundColor: mix(f.c, 0.1, '#FFFFFF') }]}>
          <Icon name={f.ic as IconName} size={18} color={f.c} />
        </View>
        <View style={styles.essBody}>
          <Txt style={styles.essB2} numberOfLines={1}>
            {f.n}
          </Txt>
          <Txt style={styles.essS}>{lxStat(f.k, { nt, xrDone, docs })}</Txt>
        </View>
      </Pressable>
    );
  };
  return (
    <View style={styles.lxTop}>
      <Txt style={styles.muH}>Your study essentials</Txt>
      <View style={styles.essGrid}>
        <View style={styles.essRow}>
          {cell(0)}
          {cell(1)}
        </View>
        <View style={styles.essRow}>
          {cell(2)}
          {cell(3)}
        </View>
      </View>
    </View>
  );
}

const INK = '#14161C';
const styles = StyleSheet.create({
  hero: { marginHorizontal: -20, paddingHorizontal: 20, paddingBottom: 54, borderBottomLeftRadius: 28, borderBottomRightRadius: 28, overflow: 'hidden' },
  ill: { position: 'absolute', right: -8, opacity: 0.14 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  eb: { ...font('sans', 700), fontSize: 11.5, lineHeight: 22.475, letterSpacing: 1.61, textTransform: 'uppercase', color: '#fff', opacity: 0.8 },
  h1: { ...font('book', 500), fontSize: 34, lineHeight: 34, letterSpacing: -0.34, color: '#fff', marginTop: 6 },
  up: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 18,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    boxShadow: '0px 10px 20px -14px rgba(0, 30, 70, 0.6)',
  },
  searchT: { flex: 1, fontSize: 14.5, lineHeight: 21.025, color: '#7A8494' },
  kbd: { backgroundColor: '#F7F9FC', paddingVertical: 2, paddingHorizontal: 6, borderRadius: 6, borderWidth: 1, borderColor: '#E1E8F0' },
  kbdT: { fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }), fontSize: 11.5, lineHeight: 16.675, color: '#9AA3AF', textAlign: 'center' },
  stats: { flexDirection: 'row', marginTop: 16 },
  stat: { flex: 1, paddingHorizontal: 4 },
  statLine: { borderLeftWidth: 1, borderLeftColor: 'rgba(255,255,255,0.22)', paddingLeft: 14 },
  statB: { ...font('serif', 800), fontSize: 22, lineHeight: 22, color: '#fff' },
  statS: { fontSize: 11.5, lineHeight: 16.675, color: '#fff', opacity: 0.85, marginTop: 3 },
  resume: {
    zIndex: 2,
    marginTop: -34,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    backgroundColor: '#fff',
    borderRadius: 22,
    boxShadow: '0px 20px 36px -22px rgba(15, 60, 110, 0.55)',
  },
  bk: {
    width: 62,
    height: 84,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    paddingTop: 8,
    paddingRight: 6,
    paddingBottom: 6,
    paddingLeft: 10,
  },
  bkSpine: { position: 'absolute', left: 3, top: 0, bottom: 0, width: 2, backgroundColor: 'rgba(255,255,255,0.35)' },
  bkS: { ...font('sans', 800), fontSize: 7.5, lineHeight: 10.875, letterSpacing: 0.75, textTransform: 'uppercase', color: '#fff', opacity: 0.85 },
  bkB: { ...font('book', 700), fontSize: 12.5, lineHeight: 13.75, color: '#fff', marginTop: 4 },
  rc: { flex: 1, minWidth: 0 },
  rk: { ...font('sans', 700), fontSize: 10.5, lineHeight: 22.475, letterSpacing: 0.84, textTransform: 'uppercase', color: '#1B8AD3' },
  rcH3: { ...font('book', 500), fontSize: 18, lineHeight: 21.6, color: INK, marginTop: 3 },
  rcP: { fontSize: 12.5, lineHeight: 18.125, color: '#6B7280', marginTop: 2 },
  pr: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  prTrack: { flex: 1, height: 5, borderRadius: 3, backgroundColor: '#E8EEF5', overflow: 'hidden' },
  prFill: { height: 5, borderRadius: 3, backgroundColor: '#1B8AD3' },
  prT: { ...font('sans', 700), fontSize: 11.5, lineHeight: 16.675, color: '#25272D' },
  play: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1B8AD3',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 8px 16px -8px rgba(27, 138, 211, 0.8)',
  },
  playIc: { marginLeft: 2 },
  lxTop: { marginTop: 28 },
  muH: { ...font('sans', 700), fontSize: 18, lineHeight: 21.6, letterSpacing: -0.18, color: INK, marginBottom: 12 },
  essGrid: { backgroundColor: '#fff', borderRadius: 18, boxShadow: '0px 0px 0px 1px #E6EBF1', overflow: 'hidden' },
  essRow: { flexDirection: 'row' },
  ess: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 11, padding: 14 },
  essR: { borderRightWidth: 1, borderRightColor: '#EEF2F6' },
  essB: { borderBottomWidth: 1, borderBottomColor: '#EEF2F6' },
  essI: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  essBody: { flexShrink: 1, minWidth: 0 },
  essB2: { ...font('sans', 600), fontSize: 14.5, lineHeight: 21.025, color: INK },
  essS: { fontSize: 12.5, lineHeight: 18.125, color: '#7A8494', marginTop: 2 },
});
