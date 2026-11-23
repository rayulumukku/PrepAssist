// Source: PrepAssist.html L6289-L6297 (renderPractice: section.p-hero), L2013-L2028 (PRACTICE v2: .p-hero, .p-ill, .p-eb, .p-seg, .p-kpi)
// Source: PrepAssist.html L2600-L2602 (.mains: border-top 3px var(--accent), ::before ruled lines, children relative)
// Source: PrepAssist.html L10644-L10650 (planthemes: .p-hero.pre background and ::after sheen)
// Computed: reference/android/tab-practice, tab-practice-mains, -pro, -ultimate `section.p-hero`.
//   .p-hero     padding calc(var(--sat)+14) 20 58, margin 0 -20, radius 0 0 28 28, overflow hidden, colour #fff
//               .pre radial(90% 80% at 100% 0%, #7C6FF0, transparent 55%) + linear(160deg, #3B2F8F, #2D4FB8 55%, #1B8AD3)
//               .mains radial(... #FFC36B ...) + linear(160deg, #B4520A, #E8890C 55%, #F5A01F); border-top 3 #F5A01F
//               and the generic .mains::before: 1 px rgba(245,160,31,.1) line every 32 px
//   .p-ill      absolute right -6 top calc(var(--sat)+4), 150 x 112.5, opacity .16
//   .p-eb       Inter 700 11.5 ls 1.38 uppercase opacity .85, inline (line box 22.475); h1 EB Garamond 500 34/34 margin-top 6
//   .p-seg      margin-top 18, padding 4, radius 14, rgba(255,255,255,.16), border 1 rgba(255,255,255,.22); buttons 38 high
//               Inter 700 14.5/21.025, .on #14161C else rgba(255,255,255,.85); i: white 181 x 38, radius 10,
//               shadow 0 6 12 -6 rgba(0,0,0,.35), translateX(100%) under .mains. renderPractice rebuilds the pane on
//               pxGo, so the indicator is a new element each time: it never animates.
//   .p-kpi      grid 1fr 1fr 1.1fr, margin-top 18; b Inter Tight 800 22/22 (small 13.5 opacity .8); span 11.5/16.675
//               opacity .85 margin-top 4; columns 2-3 border-left 1 rgba(255,255,255,.22) padding-left 14; .sp svg 100% x 30
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, G, Path, Pattern, Polyline, Rect } from 'react-native-svg';
import { act } from '../../../actions';
import { useAppSize } from '../../../shell/AppSize';
import { font, Txt, useInsets, usePlan } from '../../../theme';
import { PLAN_HERO_BG, PlanSheen } from '../home/HomeSky';

const PRE_BG = 'radial-gradient(90% 80% at 100% 0%, #7C6FF0 0%, transparent 55%), linear-gradient(160deg, #3B2F8F, #2D4FB8 55%, #1B8AD3)';
const MAINS_BG = 'radial-gradient(90% 80% at 100% 0%, #FFC36B 0%, transparent 55%), linear-gradient(160deg, #B4520A, #E8890C 55%, #F5A01F)';

const HIST = [58, 62, 60, 67, 71, 74];
const PTS = HIST.map((v, i) => `${i * 22 + 4},${46 - (v - 50) * 1.5}`).join(' ');
const FILLED = [1, 6, 8, 15, 18];

function Ill({ mains }: { mains: boolean }): React.JSX.Element {
  return (
    <Svg width={150} height={112.5} viewBox="0 0 160 120">
      {mains ? (
        <G fill="none" stroke="#fff" strokeWidth={1.5} strokeLinecap="round">
          <Rect x={30} y={10} width={96} height={110} rx={6} />
          <Path d="M42 34c10-3 20 3 30 0s20-3 30 0 12 2 14 1M42 50c10-3 20 3 30 0s20-3 30 0M42 66c10-3 20 3 30 0s20-3 30 0 12 2 14 1M42 82c10-3 20 3 30 0" />
          <Path d="M128 18l-30 64-6 14 12-10 30-64z" />
        </G>
      ) : (
        <G fill="none" stroke="#fff" strokeWidth={1.5}>
          {Array.from({ length: 20 }, (_, i) => (
            <Circle key={i} cx={30 + (i % 4) * 26} cy={18 + Math.floor(i / 4) * 22} r={8} fill={FILLED.includes(i) ? '#fff' : 'none'} />
          ))}
        </G>
      )}
    </Svg>
  );
}

/** .mains::before: repeating-linear-gradient(180deg, transparent 0 31px, rgba(245,160,31,.10) 31px 32px) */
function MainsRules(): React.JSX.Element {
  return (
    <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
      <Defs>
        <Pattern id="pxRules" patternUnits="userSpaceOnUse" width={8} height={32}>
          <Rect x={0} y={31} width={8} height={1} fill="rgba(245,160,31,0.1)" />
        </Pattern>
      </Defs>
      <Rect x={0} y={0} width="100%" height="100%" fill="url(#pxRules)" />
    </Svg>
  );
}

function Kpi({ b, small, span, first }: { b: string; small?: string; span: string; first?: boolean }): React.JSX.Element {
  return (
    <View style={[styles.kpiCol, !first && styles.kpiNext]}>
      <Txt style={styles.kpiB}>
        {b}
        {small ? <Txt style={styles.kpiSmall}>{small}</Txt> : null}
      </Txt>
      <Txt style={styles.kpiSpan}>{span}</Txt>
    </View>
  );
}

export function PracticeHero({ mains }: { mains: boolean }): React.JSX.Element {
  const plan = usePlan();
  const { sat } = useInsets();
  const { w } = useAppSize();
  const bg = mains ? MAINS_BG : plan === 'free' ? PRE_BG : PLAN_HERO_BG[plan];
  const segW = (w - 40 - 2 - 8) / 2;
  return (
    <View style={[styles.hero, { backgroundImage: bg, paddingTop: sat + 14 }, mains && styles.mains]} testID="practice.hero">
      {mains ? <MainsRules /> : null}
      <View style={[styles.ill, { top: sat + 4 }]} pointerEvents="none">
        <Ill mains={mains} />
      </View>
      <View>
        <Txt style={styles.eb}>{mains ? 'Descriptive · GS I–IV & Essay' : 'Objective · GS Paper I & CSAT'}</Txt>
        <Txt style={styles.h1}>Practice</Txt>
      </View>
      <View style={styles.seg} accessibilityRole="tablist">
        <View style={[styles.segI, { width: segW, transform: [{ translateX: mains ? segW : 0 }] }]} />
        <Pressable style={styles.segB} onPress={() => act('pxGo:pre')} accessibilityRole="tab" testID="practice.seg.pre">
          <Txt style={[styles.segT, !mains && styles.segTOn]}>Prelims</Txt>
        </Pressable>
        <Pressable style={styles.segB} onPress={() => act('pxGo:mains')} accessibilityRole="tab" testID="practice.seg.mains">
          <Txt style={[styles.segT, mains && styles.segTOn]}>Mains</Txt>
        </Pressable>
      </View>
      {mains ? (
        <View style={styles.kpi}>
          <Kpi first b="9.1" small="/15" span="avg. score" />
          <Kpi b="14" span="answers evaluated" />
          <Kpi b="+1.4" span="vs September" />
        </View>
      ) : (
        <View style={styles.kpi}>
          <Kpi first b="71" small="%" span="accuracy · 30 days" />
          <Kpi b="1,240" span="questions solved" />
          <View style={[styles.kpiCol, styles.kpiNext, styles.kpiSp]}>
            <Svg width="100%" height={30} viewBox="0 0 120 50">
              <Polyline points={PTS} fill="none" stroke="#FFD27A" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
              <Circle cx={5 * 22 + 4} cy={46 - 24 * 1.5} r={3.5} fill="#FFD27A" />
            </Svg>
            <Txt style={styles.kpiSpan}>last 6 tests</Txt>
          </View>
        </View>
      )}
      {mains ? null : <PlanSheen plan={plan} width={w} />}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { marginHorizontal: -20, paddingHorizontal: 20, paddingBottom: 58, borderBottomLeftRadius: 28, borderBottomRightRadius: 28, overflow: 'hidden' },
  mains: { borderTopWidth: 3, borderTopColor: '#F5A01F' },
  ill: { position: 'absolute', right: -6, opacity: 0.16 },
  eb: { ...font('sans', 700), fontSize: 11.5, lineHeight: 22.475, letterSpacing: 1.38, textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)' },
  h1: { ...font('book', 500), fontSize: 34, lineHeight: 34, color: '#fff', marginTop: 6 },
  seg: {
    flexDirection: 'row',
    marginTop: 18,
    padding: 4,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  segI: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    left: 4,
    borderRadius: 10,
    backgroundColor: '#fff',
    boxShadow: '0px 6px 12px -6px rgba(0, 0, 0, 0.35)',
  },
  segB: { flex: 1, height: 38, alignItems: 'center', justifyContent: 'center' },
  segT: { ...font('sans', 700), fontSize: 14.5, lineHeight: 21.025, color: 'rgba(255,255,255,0.85)', textAlign: 'center' },
  segTOn: { color: '#14161C' },
  kpi: { flexDirection: 'row', marginTop: 18 },
  kpiCol: { flexGrow: 1, flexBasis: 0 },
  kpiNext: { borderLeftWidth: 1, borderLeftColor: 'rgba(255,255,255,0.22)', paddingLeft: 14 },
  kpiSp: { flexGrow: 1.1 },
  kpiB: { ...font('serif', 800), fontSize: 22, lineHeight: 22, color: '#fff' },
  kpiSmall: { fontSize: 13.5, color: 'rgba(255,255,255,0.8)' },
  kpiSpan: { fontSize: 11.5, lineHeight: 16.675, color: 'rgba(255,255,255,0.85)', marginTop: 4 },
});
