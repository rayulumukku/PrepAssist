// Source: PrepAssist.html L6058-L6072 (renderHome: section.d-sky), L6401-L6415 (skyArc), L1613-L1641 + L1735-L1746 (.d-sky CSS, HOME v8), L1457-L1464 (.d-top, .d-acts)
// Source: PrepAssist.html L10644-L10652 (planthemes: .d-sky background, ::after sheen, em colour)
// The Home sky hero: date line, search / credits / avatar buttons, greeting, streak, the day-plan arc and
// the days-to-Prelims counter. Computed values: reference/android/tab-home (t-morning), tab-home-day,
// -evening, -night, -pro, -ultimate, dom.json `section.d-sky`.
//   .d-sky   padding 0 20 58, margin 0 -20, radius 0 0 28 28, overflow hidden, colour #fff
//   .d-top   flex, space-between, centred, height 46 = padding-top calc(var(--sat)+10) + 36
//   .d-date  Inter 600 12.5/18.125, letter-spacing .25, rgba(255,255,255,.9)
//   .d-ib/.d-av 36x36 circle, .d-cr 36 high pill padding 0 12 gap 5; bg rgba(255,255,255,.18),
//            border 1 rgba(255,255,255,.3), backdrop blur(6); Inter 700 / 600 12.5
//   .d-hi    EB Garamond 500 28/30.8, ls -.28, margin-top 16, text-shadow 0 2 14 rgba(0,40,90,.18); em #FFE2A3 italic
//   .d-streak inline-flex gap 5, margin-top 8, Inter 600 12.5/18.125 rgba(255,255,255,.88); flame 13 #FFD27A
//   .d-arcw  margin-top 10, padding 10 12 2, radius 16, bg rgba(255,255,255,.12), border 1 rgba(255,255,255,.2), blur(4), z 2
//   .d-arch  Inter 700 11.5/16.675 ls .69 uppercase rgba(255,255,255,.85); b weight 900 #FFE2A3
//   svg.d-arc viewBox 0 0 350 76, width 100 % (346 x 75.125), margin-top 2; text Inter 700 10.5 #fff,
//            text.tm Inter 600 9 rgba(255,255,255,.7), g.dn text #FFE2A3; .sun sunP 3s ease-in-out infinite
//   .d-days  absolute right 20 top calc(var(--sat)+64), right aligned; b Inter Tight 800 46/46 ls -1.38;
//            span Inter 700 12.5/18.125 margin-top 2; small Inter 500 10.5/15.225 opacity .8 margin-top 1
//   .d-skyline display:none (L1746): not drawn.
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Defs, G, LinearGradient, Path, Stop, Text as SvgText } from 'react-native-svg';
import { act } from '../../../actions';
import { Backdrop, Icon } from '../../../components';
import { useAppSize } from '../../../shell/AppSize';
import { useStore } from '../../../store';
import { font, Txt, useInsets, usePlan } from '../../../theme';
import type { Plan } from '../../../theme';
import { DAYPLAN } from '../../../data';
import { ARC_LEN, dateLine, greetKey, initials, skyArc, skyPhase, tr } from '../homeLogic';
import type { SkyPhase } from '../homeLogic';

const SKY_BG: Record<SkyPhase, string> = {
  day: 'linear-gradient(180deg, #1B8AD3 0%, #3FA3E3 55%, #8FCBF2 100%)',
  morning: 'linear-gradient(180deg, #3E8FD0 0%, #7FC0EE 50%, #FFD3A1 100%)',
  evening: 'linear-gradient(180deg, #24357F 0%, #5B5FB8 45%, #F29B6B 100%)',
  night: 'linear-gradient(180deg, #0B1736 0%, #16306A 60%, #25508F 100%)',
};
/** planthemes L10644-L10647: the plan hero background replaces the sky gradient. */
export const PLAN_HERO_BG: Record<Exclude<Plan, 'free'>, string> = {
  pro:
    'radial-gradient(90% 70% at 100% 0%, rgba(244,114,182,0.5), transparent 60%), radial-gradient(70% 60% at 0% 100%, rgba(96,165,250,0.4), transparent 60%), linear-gradient(160deg, #25146B 0%, #5631D1 55%, #8B69FF 100%)',
  ultimate:
    'radial-gradient(80% 60% at 100% 0%, rgba(247,215,116,0.42), transparent 60%), radial-gradient(60% 50% at 0% 100%, rgba(201,150,30,0.28), transparent 60%), linear-gradient(160deg, #0A0907 0%, #1B150A 55%, #3D2C0E 100%)',
};

/** svg.d-arc: width 100 % of .d-arcw's content box (412 - 40 - 2 x 12 padding - 2 x 1 border = 346), height from the 350 x 76 viewBox. */
const arcSize = (appW: number): { w: number; h: number } => {
  const w = appW - 40 - 26;
  return { w, h: (w * 76) / 350 };
};

const ease = Easing.bezier(0.42, 0, 0.58, 1); // ease-in-out

/** html[data-plan] .d-sky::after (L10649-L10651): a diagonal sheen swept across the hero, plSheen 6 s / 7 s. */
export function PlanSheen({ plan, width }: { plan: Plan; width: number }): React.JSX.Element | null {
  const p = useSharedValue(0);
  const dur = plan === 'ultimate' ? 6000 : 7000;
  useEffect(() => {
    if (plan === 'free') return;
    p.value = 0;
    // @keyframes plSheen{0%{background-position:120% 0}60%,100%{background-position:-120% 0}}, ease-in-out per segment
    p.value = withRepeat(withSequence(withTiming(1, { duration: dur * 0.6, easing: ease }), withTiming(1, { duration: dur * 0.4 })), -1);
  }, [plan, dur, p]);
  // background-size 250 %: the image is 2.5 W wide; position x% puts it at (W - 2.5 W) * x
  const anim = useAnimatedStyle(() => ({ transform: [{ translateX: -1.5 * width * (1.2 - 2.4 * p.value) }] }));
  if (plan === 'free') return null;
  const tint = plan === 'ultimate' ? 'rgba(255,226,140,0.16)' : 'rgba(255,255,255,0.12)';
  return (
    <View style={styles.sheenClip} pointerEvents="none">
      <Animated.View
        style={[
          { width: width * 2.5, height: '100%', backgroundImage: `linear-gradient(105deg, transparent 35%, ${tint} 48%, transparent 60%)` },
          anim,
        ]}
      />
    </View>
  );
}

function Sun({ night, x, y, w, h }: { night: boolean; x: number; y: number; w: number; h: number }): React.JSX.Element {
  // #homeScroll .d-arc .sun{animation:sunP 3s ease-in-out infinite} @keyframes sunP{50%{opacity:.85}}
  const o = useSharedValue(1);
  useEffect(() => {
    o.value = withRepeat(withSequence(withTiming(0.85, { duration: 1500, easing: ease }), withTiming(1, { duration: 1500, easing: ease })), -1);
  }, [o]);
  const anim = useAnimatedStyle(() => ({ opacity: o.value }));
  return (
    <Animated.View style={[StyleSheet.absoluteFill, anim]} pointerEvents="none">
      <Svg width={w} height={h} viewBox="0 0 350 76" style={styles.overflow}>
        <G transform={`translate(${x} ${y})`}>
          {night ? (
            <>
              <Circle r={8} fill="#F4F1E6" />
              <Circle r={7} cx={3.5} cy={-2.5} fill="#1B2D5C" />
            </>
          ) : (
            <>
              <Circle r={15} fill="rgba(255,214,122,.25)" />
              <Circle r={7.5} fill="#FFD27A" stroke="#fff" strokeWidth={2} />
            </>
          )}
        </G>
      </Svg>
    </Animated.View>
  );
}

const ARC_LABEL = font('sans', 700).fontFamily;
const ARC_TM = font('sans', 600).fontFamily;

function DayArc({ hr, appW }: { hr: number; appW: number }): React.JSX.Element {
  const a = skyArc(hr);
  const { w, h } = arcSize(appW);
  return (
    <View style={styles.arcw}>
      <Backdrop px={4} tint="rgba(255,255,255,0.12)" />
      <View style={styles.arch}>
        <Txt style={styles.archT}>Today’s plan</Txt>
        <Txt style={[styles.archT, styles.archB]}>
          {a.nDone}/{DAYPLAN.length}
        </Txt>
      </View>
      <View style={[styles.arc, { width: w, height: h }]} accessibilityLabel={`Day plan: ${a.nDone} of ${DAYPLAN.length} done`}>
        <Svg width={w} height={h} viewBox="0 0 350 76" style={styles.overflow}>
          <Defs>
            <LinearGradient id="arcG" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor="#FFE2A3" />
              <Stop offset="1" stopColor="#F5A01F" />
            </LinearGradient>
          </Defs>
          <Path d="M14 62 Q175 -6 336 62" fill="none" stroke="rgba(255,255,255,.28)" strokeWidth={5} strokeLinecap="round" />
          {a.now > 0 ? (
            <Path
              d="M14 62 Q175 -6 336 62"
              fill="none"
              stroke="url(#arcG)"
              strokeWidth={5}
              strokeLinecap="round"
              // stroke-dasharray="${(now * 100).toFixed(1)} 200" on pathLength="100"
              strokeDasharray={[Number((a.now * 100).toFixed(1)) * (ARC_LEN / 100), 2 * ARC_LEN]}
            />
          ) : null}
          {a.points.map(p => (
            <G key={p.label}>
              <Circle cx={p.x} cy={p.y} r={5.5} fill={p.done ? '#fff' : '#1470B0'} stroke={p.done ? '#F5A01F' : 'rgba(255,255,255,.8)'} strokeWidth={2} />
              {p.done ? <Path d={`M${p.x - 2.4} ${p.y} l1.7 1.8 3.2-3.4`} fill="none" stroke="#D97F06" strokeWidth={1.5} strokeLinecap="round" /> : null}
              <SvgText x={p.x} y={p.y - 11} textAnchor="middle" fill={p.done ? '#FFE2A3' : '#fff'} fontSize={10.5} fontFamily={ARC_LABEL}>
                {p.label}
              </SvgText>
              <SvgText x={p.x} y={p.y + 17} textAnchor="middle" fill={p.done ? '#FFE2A3' : 'rgba(255,255,255,.7)'} fontSize={9} fontFamily={ARC_TM}>
                {p.time}
              </SvgText>
            </G>
          ))}
        </Svg>
        <Sun night={a.night} x={a.sun[0]} y={a.sun[1]} w={w} h={h} />
      </View>
    </View>
  );
}

function Glass({ children, style, onPress, label, testID }: { children: React.ReactNode; style: object; onPress: () => void; label: string; testID: string }): React.JSX.Element {
  return (
    <Pressable onPress={onPress} accessibilityLabel={label} testID={testID} style={[styles.glass, style]}>
      <Backdrop px={6} tint="rgba(255,255,255,0.18)" />
      {children}
    </Pressable>
  );
}

export function HomeSky({ now }: { now: Date }): React.JSX.Element {
  const lang = useStore(s => s.lang);
  const credits = useStore(s => s.me.credits);
  const user = useStore(s => s.user);
  const plan = usePlan();
  const { sat } = useInsets();
  const { w } = useAppSize();
  const h = now.getHours();
  const hr = h + now.getMinutes() / 60;
  const phase = skyPhase(hr);
  const hi = lang === 'hi';
  const bg = plan === 'free' ? SKY_BG[phase] : PLAN_HERO_BG[plan];
  return (
    <View style={[styles.sky, { backgroundImage: bg }]} testID="home.sky">
      <View style={[styles.top, { height: 46 + sat, paddingTop: sat + 10 }]}>
        <Txt style={styles.date}>{dateLine(now)}</Txt>
        <View style={styles.acts}>
          <Glass style={styles.ib} onPress={() => act('cmdk')} label="Search" testID="home.search">
            <Icon name="search" size={17} color="#fff" />
          </Glass>
          <Glass style={styles.cr} onPress={() => act('credits')} label={`AI credits: ${credits} left`} testID="home.credits">
            <Icon name="spark" size={13} color="#FFD27A" />
            <Txt style={styles.crT}>{credits}</Txt>
          </Glass>
          <Glass style={styles.ib} onPress={() => act('tab:profile')} label="Profile" testID="home.avatar">
            <Txt style={styles.avT}>{initials(user.name)}</Txt>
          </Glass>
        </View>
      </View>
      <Txt style={[styles.hiT, hi && styles.hiDeva]}>
        {tr(lang, greetKey(h))},{'\n'}
        <Txt style={[styles.em, hi && styles.emDeva, plan === 'ultimate' && styles.emGold]}>{hi ? tr(lang, 'name') : user.first}</Txt>
      </Txt>
      <View style={styles.streak}>
        <Icon name="flame" size={13} color="#FFD27A" />
        <Txt style={styles.streakT}>6-day streak · Day 239</Txt>
      </View>
      <View style={[styles.days, { top: sat + 64 }]}>
        <Txt style={styles.daysB}>126</Txt>
        <Txt style={styles.daysS}>{tr(lang, 'days')}</Txt>
        <Txt style={styles.daysSm}>UPSC CSE 2027 · 24 May</Txt>
      </View>
      <PlanSheen plan={plan} width={w} />
      <DayArc hr={hr} appW={w} />
    </View>
  );
}

const styles = StyleSheet.create({
  sky: { marginHorizontal: -20, paddingHorizontal: 20, paddingBottom: 58, borderBottomLeftRadius: 28, borderBottomRightRadius: 28, overflow: 'hidden' },
  sheenClip: { ...StyleSheet.absoluteFill, overflow: 'hidden' },
  overflow: { overflow: 'visible' },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  date: { ...font('sans', 600), fontSize: 12.5, lineHeight: 18.125, letterSpacing: 0.25, color: 'rgba(255,255,255,0.9)' },
  acts: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  glass: { height: 36, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  ib: { width: 36, borderRadius: 18 },
  cr: { flexDirection: 'row', paddingHorizontal: 12, borderRadius: 18, gap: 5 },
  crT: { ...font('sans', 600), fontSize: 12.5, lineHeight: 18.125, color: '#fff' },
  avT: { ...font('sans', 700), fontSize: 12.5, lineHeight: 18.125, color: '#fff' },
  hiT: {
    ...font('book', 500),
    fontSize: 28,
    lineHeight: 30.8,
    letterSpacing: -0.28,
    color: '#fff',
    marginTop: 16,
    textShadowColor: 'rgba(0,40,90,0.18)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 14,
  },
  // .hi (L38, L4115): 'Noto Sans Devanagari' first; line-height 1.6 (!important) is overridden by .d-hi line-height 1.1 (HOME v8 L1736)
  hiDeva: { ...font('deva', 500) },
  em: { ...font('book', 500, true), color: '#FFE2A3' },
  emDeva: { ...font('deva', 500, true) },
  emGold: { color: '#F7D774' },
  streak: { flexDirection: 'row', alignSelf: 'flex-start', alignItems: 'center', gap: 5, marginTop: 8 },
  streakT: { ...font('sans', 600), fontSize: 12.5, lineHeight: 18.125, color: 'rgba(255,255,255,0.88)' },
  days: { position: 'absolute', right: 20, alignItems: 'flex-end' },
  daysB: { ...font('serif', 800), fontSize: 46, lineHeight: 46, letterSpacing: -1.38, color: '#fff', textAlign: 'right' },
  daysS: { ...font('sans', 700), fontSize: 12.5, lineHeight: 18.125, marginTop: 2, color: '#fff', textAlign: 'right' },
  daysSm: { ...font('sans', 500), fontSize: 10.5, lineHeight: 15.225, marginTop: 1, color: '#fff', opacity: 0.8, textAlign: 'right' },
  arcw: {
    zIndex: 2,
    marginTop: 10,
    paddingTop: 10,
    paddingHorizontal: 12,
    paddingBottom: 2,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  arch: { flexDirection: 'row', justifyContent: 'space-between' },
  archT: { ...font('sans', 700), fontSize: 11.5, lineHeight: 16.675, letterSpacing: 0.69, textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)' },
  archB: { ...font('sans', 900), color: '#FFE2A3' },
  arc: { marginTop: 2 },
});
