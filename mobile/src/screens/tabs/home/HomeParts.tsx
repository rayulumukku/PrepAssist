// Source: PrepAssist.html L6074-L6089 (renderHome: .d-now, Today .d-trio), L6097-L6106 (.d-brief, .d-reels), L6123-L6140 (progress, tools, .d-foot)
// Source: PrepAssist.html L1474-L1479 (.d-sec, .d-h, .d-link, .d-card), L1510-L1527 + L1595-L1604 (.d-brief, .d-bmast, .d-reels), L1590-L1594 (.d-hc)
// Source: PrepAssist.html L1642-L1665 (.d-now, .d-pulse, @keyframes dpu, .d-trio, .d-omr, .d-idx, .d-np), L1717-L1733 (progress), L1747-L1759 (.d-tools2)
// Private sub-components of the Home tab. Values: reference/android/tab-home/dom.json (computed).
//   .d-h        flex, space-between, baseline, margin-bottom 12; h2 Inter 700 18/21.6 ls -.18 #14161C, gap 9;
//               right span 12.5/18.125 #7A8494 sits 8.5 below the h2 top, .d-link (13.5 600 #1B8AD3) 7.5 (baseline alignment, measured)
//   .d-hc       28 x 28, radius 9; c-b #E3F1FB/#1B8AD3 c-o #FFF1DC/#D97F06 c-p #EEEBFC/#6C5DD3 c-t #E2F5F1/#0E9A8A c-g #E6F4EA/#2F8A4A; icon 15
//   .d-now      margin-top -40, z 2, #fff, radius 22, padding 18 18 16, shadow 0 22 40 -22 rgba(15,60,110,.5)
//   .d-trio     grid 1.15fr 1fr 1fr, gap 10; buttons radius 18, padding 14 12 12, min-height 150
//   .d-card     #fff, border 1 #E6EBF1, radius 18
import React, { useEffect, useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, Pattern, Rect, Path, Text as SvgText } from 'react-native-svg';
import { act } from '../../../actions';
import { Icon, PenCTA } from '../../../components';
import type { IconName } from '../../../icons/iconPaths.generated';
import { BRIEF, COVER, REELS, REVISIONS, SUBJ, TOOLS, WEEK } from '../../../data';
import { useStore } from '../../../store';
import { easeCss, useTransition } from '../../../shell/anim';
import { font, Txt } from '../../../theme';
import { dayMonShort, mix, weekTotals } from '../homeLogic';

// ---------------------------------------------------------------- animateHome (L6010-L6015)

/** True once animateHome() has run after this element was rendered (data-w / data-h applied). */
function useAnimated(): boolean {
  const n = useStore(s => s.homeAnim);
  const first = useRef(n);
  return n !== first.current;
}

const easeBar = Easing.bezier(0.3, 1, 0.4, 1);

/** `<i data-w>`: width 0 until animateHome, then `transition: width 1s ease` (.d-pr i). */
function GrowW({ pct, style }: { pct: number; style: object }): React.JSX.Element {
  const on = useAnimated();
  const v = useTransition(on ? pct : 0, 1000, easeCss);
  const anim = useAnimatedStyle(() => ({ width: `${v.value}%` }));
  return <Animated.View style={[style, anim]} />;
}

// ---------------------------------------------------------------- .d-h

const HC: Record<string, [string, string]> = {
  'c-b': ['#E3F1FB', '#1B8AD3'],
  'c-o': ['#FFF1DC', '#D97F06'],
  'c-p': ['#EEEBFC', '#6C5DD3'],
  'c-t': ['#E2F5F1', '#0E9A8A'],
  'c-g': ['#E6F4EA', '#2F8A4A'],
};

/** MEGA (L6027): the megaphone of the Announcements header, 15 x 15 in .d-hc. */
function Mega({ color }: { color: string }): React.JSX.Element {
  return (
    <Svg width={15} height={15} viewBox="0 0 16 16">
      <Path d="M2 6.5v3h2l5 3V3.5l-5 3H2z" fill={color} />
      <Path d="M11.5 5.5a3.5 3.5 0 0 1 0 5M13 4a5.6 5.6 0 0 1 0 8" fill="none" stroke={color} strokeWidth={1.3} strokeLinecap="round" />
    </Svg>
  );
}

export function DH({
  title,
  hc,
  icon,
  right,
  style,
}: {
  title: string;
  hc: keyof typeof HC;
  icon: IconName | 'mega';
  right?: React.ReactNode;
  style?: object;
}): React.JSX.Element {
  const [bg, fg] = HC[hc];
  return (
    <View style={[styles.dh, style]}>
      <View style={styles.h2}>
        <View style={[styles.hc, { backgroundColor: bg }]}>{icon === 'mega' ? <Mega color={fg} /> : <Icon name={icon} size={15} color={fg} />}</View>
        <Txt style={styles.h2T}>{title}</Txt>
      </View>
      {right}
    </View>
  );
}
export function DHSpan({ children }: { children: React.ReactNode }): React.JSX.Element {
  return <Txt style={styles.dhSpan}>{children}</Txt>;
}
export function DLink({ label, onPress, testID }: { label: string; onPress: () => void; testID: string }): React.JSX.Element {
  return (
    <Pressable onPress={onPress} style={styles.dLink} testID={testID}>
      <Txt style={styles.dLinkT}>{label}</Txt>
    </Pressable>
  );
}

// ---------------------------------------------------------------- .d-now

/** .d-pulse: 8 px dot with `animation: dpu 2s infinite` (box-shadow 0 0 0 0 rgba(245,160,31,.6) → 70 % 0 0 0 8px transparent). */
function Pulse(): React.JSX.Element {
  const p = useSharedValue(0);
  useEffect(() => {
    // timing function `ease` per keyframe segment: 0→70 % (1400 ms), 70→100 % (600 ms)
    p.value = withRepeat(withSequence(withTiming(1, { duration: 1400, easing: easeCss }), withTiming(2, { duration: 600, easing: easeCss })), -1);
  }, [p]);
  const ring = useAnimatedStyle(() => {
    const spread = p.value <= 1 ? 8 * p.value : 8 * (2 - p.value);
    const a = p.value <= 1 ? Math.max(0, 0.6 * (1 - p.value)) : 0;
    return {
      width: 8 + 2 * spread,
      height: 8 + 2 * spread,
      borderRadius: 4 + spread,
      left: -spread,
      top: -spread,
      backgroundColor: `rgba(245,160,31,${a.toFixed(3)})`,
    };
  });
  return (
    <View style={styles.pulse}>
      <Animated.View style={[styles.pulseRing, ring]} />
      <View style={styles.pulseDot} />
    </View>
  );
}

export function NowCard(): React.JSX.Element {
  return (
    <View style={styles.now}>
      <View style={styles.nk}>
        <Pulse />
        <Txt style={styles.nkT}>Now on your day · Indian Polity</Txt>
      </View>
      <Txt style={styles.nowH3}>Fundamental Rights</Txt>
      <Txt style={styles.nowP}>Lecture 4 of 6 · Right to Constitutional Remedies (Art. 32)</Txt>
      <View style={styles.pr}>
        <View style={styles.prTrack}>
          <GrowW pct={65} style={styles.prFill} />
        </View>
        <Txt style={styles.prT}>65% · 18 min left</Txt>
      </View>
      <View style={styles.pen}>
        <PenCTA label="Continue lecture" onPress={() => act('push:lesson')} testID="home.continue" />
      </View>
    </View>
  );
}

// ---------------------------------------------------------------- Today .d-trio

export function Today({ title }: { title: string }): React.JSX.Element {
  const quiz = useStore(s => s.quiz) as { sub?: Record<string, unknown> } | null;
  const revDone = useStore(s => s.revDone);
  const done = quiz && quiz.sub ? Object.keys(quiz.sub).length : 0;
  const revLeft = REVISIONS.length - revDone.size;
  // tasks L6051-L6055: d = done >= 10, !revLeft, false
  const nDone = (done >= 10 ? 1 : 0) + (!revLeft ? 1 : 0);
  return (
    <View style={styles.sec28}>
      <DH title={title} hc="c-b" icon="calendar" right={<DHSpan>{`${nDone} of 4 done · about 2 h 10 m`}</DHSpan>} />
      <View style={styles.trio}>
        <Pressable style={[styles.tb, styles.t1]} onPress={() => act('quiz')} testID="home.today.quiz">
          <View style={styles.omr}>
            {Array.from({ length: 10 }, (_, i) => (
              <View key={i} style={[styles.omrI, i < done && styles.omrF]} />
            ))}
          </View>
          <Txt style={styles.tbB}>10</Txt>
          <Txt style={styles.tbS}>Questions</Txt>
          <Txt style={styles.tbSm}>{done ? done + '/10 done' : '~12 min'}</Txt>
        </Pressable>
        <Pressable style={[styles.tb, styles.t2]} onPress={() => act('revisions')} testID="home.today.revisions">
          <View style={styles.idx}>
            <IdxCard style={styles.idx1} />
            <IdxCard style={styles.idx2} />
            <IdxCard style={styles.idx3} />
          </View>
          <Txt style={styles.tbB}>{revLeft}</Txt>
          <Txt style={styles.tbS}>Revisions</Txt>
          <Txt style={styles.tbSm}>{revLeft ? 'due today' : 'all done'}</Txt>
        </Pressable>
        <Pressable style={[styles.tb, styles.t3]} onPress={() => act('tab:current')} testID="home.today.current">
          <View style={styles.np}>
            <View style={styles.npDouble} />
            <View style={styles.npBody}>
              <View style={styles.npFirst} />
              <View style={styles.npI} />
              <View style={styles.npI} />
              <View style={styles.npI} />
            </View>
          </View>
          <Txt style={styles.tbB}>6</Txt>
          <Txt style={styles.tbS}>Stories</Txt>
          <Txt style={styles.tbSm}>current affairs</Txt>
        </Pressable>
      </View>
    </View>
  );
}

/** .d-idx i: an index card with a pink rule at 9 px (background-image linear-gradient, size 100% 1.5px, position 0 9px). */
function IdxCard({ style }: { style: object }): React.JSX.Element {
  return (
    <View style={[styles.idxI, style]}>
      <View style={styles.idxRule} />
    </View>
  );
}

// ---------------------------------------------------------------- Daily Briefing

export function Brief({ now }: { now: Date }): React.JSX.Element {
  return (
    <View style={styles.sec20}>
      <View style={[styles.card, styles.brief]}>
        <View style={styles.bmast}>
          <View>
            <Txt style={styles.bmSmall}>The PrepAssist</Txt>
            <Txt style={styles.bmB}>Daily Briefing</Txt>
            <Txt style={styles.bmSpan}>{dayMonShort(now)} · 3 stories · 22 min read</Txt>
          </View>
          <Svg width={58} height={50} viewBox="0 0 64 56">
            <Rect x={6} y={6} width={46} height={44} rx={4} fill="#fff" stroke="#E08A12" strokeWidth={2} />
            <Rect x={12} y={13} width={34} height={7} rx={1.5} fill="#F5A01F" />
            <Path d="M12 27h16M12 33h16M12 39h16M33 27h13M33 33h13M33 39h9" stroke="#E5B979" strokeWidth={2} strokeLinecap="round" />
            <Path d="M52 18h6v26a6 6 0 0 1-6 6" fill="none" stroke="#E08A12" strokeWidth={2} />
          </Svg>
        </View>
        {BRIEF.map((b, i) => (
          <Pressable key={b.id} style={[styles.bRow, i > 0 && styles.bRowLine]} onPress={() => act('article:' + b.id)} testID={`home.brief.${b.id}`}>
            <View style={styles.flex1}>
              <Txt style={styles.bRowB}>{b.title}</Txt>
              <Txt style={styles.bRowS}>
                {b.gs} · {b.topic}
              </Txt>
            </View>
            <Icon name="chev" size={16} color="#AEB7C3" />
          </Pressable>
        ))}
        <Pressable style={[styles.bRow, styles.bRowLine, styles.more]} onPress={() => act('tab:current')} testID="home.brief.more">
          <Txt style={styles.moreT}>All of today’s current affairs</Txt>
          <Icon name="arrow" size={16} color="#1B8AD3" />
        </Pressable>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------- Reels

export function Reels(): React.JSX.Element {
  const seen = useStore(s => s.reelSeen);
  const open = useStore(s => s.reel.on);
  // reelClose (L6395) refreshes the .seen classes 300 ms after closing; the list is not re-rendered while the viewer is open
  const shown = useRef(seen);
  if (!open) shown.current = seen;
  return (
    <View style={styles.sec28}>
      <DH title="Reels" hc="c-p" icon="play" right={<DHSpan>60-second concepts</DHSpan>} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.reelsScroll}
        contentContainerStyle={styles.reels}
        snapToInterval={142}
        snapToAlignment="start"
        decelerationRate="fast"
      >
        {REELS.map((r, i) => {
          const hex = SUBJ[r.s].hex;
          return (
            <Pressable
              key={r.id}
              onPress={() => act('reel:' + i)}
              accessibilityLabel={`Play reel: ${r.t}`}
              testID={`home.reel.${i}`}
              style={[
                styles.reel,
                {
                  backgroundImage: `linear-gradient(165deg, ${mix(hex, 0.78, '#FFFFFF')}, ${hex} 50%, ${mix(hex, 0.6, '#0B1530')})`,
                  boxShadow: `0px 12px 20px -14px ${hex}`,
                },
                shown.current.has(r.id) && styles.reelSeen,
              ]}
            >
              <View style={styles.rs}>
                <View style={styles.rsDot} />
                <Txt style={styles.rsT}>{SUBJ[r.s].n}</Txt>
              </View>
              <Txt style={styles.rk}>{r.k}</Txt>
              <Txt style={styles.rt}>{r.t}</Txt>
              <View style={styles.rd}>
                <Icon name="play" size={11} color="#fff" />
                <Txt style={styles.rdT}>{r.d}</Txt>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

// ---------------------------------------------------------------- Study progress

/** .d-pg i: height 0 until animateHome, then data-h % with `transition: height 1s cubic-bezier(.3,1,.4,1)`. */
function WeekBar({ pct }: { pct: number }): React.JSX.Element {
  const on = useAnimated();
  const v = useTransition(on ? pct : 0, 1000, easeBar);
  const anim = useAnimatedStyle(() => ({ height: `${v.value}%` }));
  return (
    <Animated.View style={[styles.pgI, anim]}>
      <View style={styles.pgCap} />
    </Animated.View>
  );
}

/** .d-ink .nil .d-pg: repeating-linear-gradient(135deg,#F3F6FA 0 5px,#ECF0F5 5px 10px) */
function NilStripes(): React.JSX.Element {
  return (
    <Svg style={StyleSheet.absoluteFill}>
      <Defs>
        <Pattern id="nil" patternUnits="userSpaceOnUse" width={10 * Math.SQRT2} height={10 * Math.SQRT2} patternTransform="rotate(45)">
          <Rect x={0} y={0} width={5 * Math.SQRT2} height={10 * Math.SQRT2} fill="#F3F6FA" />
          <Rect x={5 * Math.SQRT2} y={0} width={5 * Math.SQRT2} height={10 * Math.SQRT2} fill="#ECF0F5" />
        </Pattern>
      </Defs>
      <Rect x={0} y={0} width="100%" height="100%" fill="url(#nil)" />
    </Svg>
  );
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/** .d-rings .val: `animation: ringIn 1.3s cubic-bezier(.3,1,.4,1) both`, from stroke-dashoffset var(--c) to var(--o), delay i x 90 ms. */
function Ring({ r, color, v, delay }: { r: number; color: string; v: number; delay: number }): React.JSX.Element {
  const C = 2 * Math.PI * r;
  const c = Number(C.toFixed(1));
  const o = Number((C * (1 - v / 100)).toFixed(1));
  const off = useSharedValue(c);
  useEffect(() => {
    off.value = c;
    off.value = withDelay(delay, withTiming(o, { duration: 1300, easing: easeBar }));
  }, [c, o, delay, off]);
  const props = useAnimatedProps(() => ({ strokeDashoffset: off.value }));
  return (
    <AnimatedCircle
      cx={70}
      cy={70}
      r={r}
      fill="none"
      stroke={color}
      strokeWidth={6.5}
      strokeLinecap="round"
      strokeDasharray={[c, c]}
      animatedProps={props}
      transform="rotate(-90 70 70)"
    />
  );
}

export function Progress({ title }: { title: string }): React.JSX.Element {
  const { hh, mm, max } = weekTotals();
  return (
    <View style={styles.sec28}>
      <DH title={title} hc="c-g" icon="chart" right={<DLink label="Details" onPress={() => act('tab:profile')} testID="home.progress.details" />} />
      <View style={[styles.card, styles.prog]}>
        <View style={styles.wkh}>
          <View>
            <Txt style={styles.wkSmall}>This week</Txt>
            <Txt style={styles.wkB}>
              {hh}h {mm}m
            </Txt>
          </View>
          <View style={styles.wkEm}>
            <Icon name="arrow" size={11} color="#1F8A5B" style={styles.rot90} />
            <Txt style={styles.wkEmT}>1 h 10 m more than last week</Txt>
          </View>
        </View>
        <View style={styles.ink}>
          {WEEK.map((w, i) => (
            <View key={i} style={styles.inkCol}>
              <Txt style={[styles.inkD, w.today ? styles.inkDOn : null]}>{w.d}</Txt>
              <View style={[styles.pg, w.today ? styles.pgOn : null]}>
                {!w.h ? <NilStripes /> : null}
                <WeekBar pct={(w.h / max) * 100} />
                <Txt style={[styles.pgEm, !w.h && styles.pgEmNil]}>{w.h ? Math.round(w.h * 10) / 10 + 'h' : '–'}</Txt>
              </View>
            </View>
          ))}
        </View>
        <View style={styles.cov2}>
          <View accessibilityLabel="Syllabus coverage 43%">
            <Svg width={140} height={140} viewBox="0 0 140 140">
              {COVER.map((c, i) => {
                const r = 64 - i * 9;
                return (
                  <React.Fragment key={c.k}>
                    <Circle cx={70} cy={70} r={r} fill="none" stroke="#EEF2F6" strokeWidth={6.5} />
                    <Ring r={r} color={SUBJ[c.k].hex} v={c.v} delay={i * 90} />
                  </React.Fragment>
                );
              })}
              <SvgText x={70} y={74} textAnchor="middle" fill="#14161C" fontSize={22} fontFamily={font('serif', 800).fontFamily}>
                43%
              </SvgText>
            </Svg>
          </View>
          <View style={styles.flex1}>
            <Txt style={styles.legSmall}>Syllabus coverage</Txt>
            {COVER.map(c => (
              <Pressable key={c.k} style={styles.legRow} onPress={() => act('qbank:' + c.k)} testID={`home.coverage.${c.k}`}>
                <View style={[styles.legI, { backgroundColor: SUBJ[c.k].hex }]} />
                <Txt style={styles.legT}>{SUBJ[c.k].n}</Txt>
                <Txt style={styles.legB}>{c.v}%</Txt>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------- Study tools

const TG: Record<string, { bar: string; bg: string; fg: string }> = {
  learn: { bar: '#1B8AD3', bg: '#E3F1FB', fg: '#1B8AD3' },
  practice: { bar: '#E8890C', bg: '#FFF1DC', fg: '#D97F06' },
  organise: { bar: '#0E9A8A', bg: '#E2F5F1', fg: '#0E9A8A' },
};

export function Tools({ title }: { title: string }): React.JSX.Element {
  return (
    <View style={styles.sec28}>
      <DH title={title} hc="c-b" icon="sliders" right={<DLink label="All 12" onPress={() => act('allTools')} testID="home.tools.all" />} />
      <View style={styles.tools}>
        {(
          [
            ['learn', 'Learn'],
            ['practice', 'Practice'],
            ['organise', 'Organise'],
          ] as const
        ).map(([g, n], gi) => (
          <View key={g} style={[styles.tg, gi > 0 && styles.tgLine]}>
            <View style={[styles.tgl, { backgroundColor: TG[g].bar }]}>
              <Txt style={styles.tglT}>{n}</Txt>
            </View>
            <View style={styles.tgr}>
              {TOOLS.filter(x => x.g === g).map(x => (
                <Pressable key={x.id} style={styles.tool} onPress={() => act('tool:' + x.id)} testID={`home.tool.${x.id}`}>
                  {({ pressed }) => (
                    <>
                      <View style={[styles.ti, { backgroundColor: TG[g].bg }, pressed && styles.tiPressed]}>
                        <Icon name={x.ic as IconName} size={20} color={TG[g].fg} />
                        {x.ai ? (
                          <View style={styles.ai}>
                            <Txt style={styles.aiT}>AI</Txt>
                          </View>
                        ) : null}
                      </View>
                      <Txt style={styles.toolT}>{x.n}</Txt>
                    </>
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

export function Foot(): React.JSX.Element {
  return <Txt style={styles.foot}>Small steps, every day.</Txt>;
}

const INK = '#14161C';
const styles = StyleSheet.create({
  flex1: { flex: 1, minWidth: 0 },
  sec28: { marginTop: 28 },
  sec20: { marginTop: 20 },
  dh: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  h2: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  h2T: { ...font('sans', 700), fontSize: 18, lineHeight: 21.6, letterSpacing: -0.18, color: INK },
  hc: { width: 28, height: 28, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  dhSpan: { fontSize: 12.5, lineHeight: 18.125, color: '#7A8494', marginTop: 8.5 },
  dLink: { marginTop: 7.5 },
  dLinkT: { ...font('sans', 600), fontSize: 13.5, lineHeight: 19.575, color: '#1B8AD3', textAlign: 'center' },
  // .d-now
  now: {
    zIndex: 2,
    marginTop: -40,
    backgroundColor: '#fff',
    borderRadius: 22,
    paddingTop: 18,
    paddingHorizontal: 18,
    paddingBottom: 16,
    boxShadow: '0px 22px 40px -22px rgba(15, 60, 110, 0.5)',
  },
  nk: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  nkT: { ...font('sans', 700), fontSize: 11.5, lineHeight: 16.675, letterSpacing: 0.92, textTransform: 'uppercase', color: '#1B8AD3' },
  pulse: { width: 8, height: 8 },
  pulseRing: { position: 'absolute' },
  pulseDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#F5A01F' },
  nowH3: { ...font('book', 500), fontSize: 28, lineHeight: 40.6, letterSpacing: -0.28, color: INK, marginTop: 8 },
  nowP: { fontSize: 13.5, lineHeight: 19.575, color: '#5B6472', marginTop: 3 },
  pr: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 14 },
  prTrack: { flex: 1, height: 6, borderRadius: 3, backgroundColor: '#E8EEF5', overflow: 'hidden' },
  prFill: { height: 6, borderRadius: 3, backgroundColor: '#1B8AD3' },
  prT: { ...font('sans', 700), fontSize: 12.5, lineHeight: 18.125 },
  pen: { marginTop: 16, marginHorizontal: -15 },
  // Today
  trio: { flexDirection: 'row', gap: 10 },
  tb: { borderRadius: 18, paddingTop: 14, paddingHorizontal: 12, paddingBottom: 12, minHeight: 150, overflow: 'hidden', flexBasis: 0 },
  t1: { flexGrow: 1.15, backgroundColor: '#FFF4E2' },
  t2: { flexGrow: 1, backgroundColor: '#EFECFD' },
  t3: { flexGrow: 1, backgroundColor: '#E4F5F1' },
  tbB: { ...font('serif', 800), fontSize: 28, lineHeight: 28, color: INK, marginTop: 'auto' },
  tbS: { ...font('sans', 700), fontSize: 13.5, lineHeight: 19.575, color: INK, marginTop: 4 },
  tbSm: { fontSize: 11.5, lineHeight: 16.675, color: '#6B7280', marginTop: 2 },
  omr: { flexDirection: 'row', flexWrap: 'wrap', width: 80, gap: 5 },
  omrI: { width: 12, height: 12, borderRadius: 6, borderWidth: 1, borderColor: '#E7A64A' },
  omrF: { backgroundColor: INK, borderColor: INK },
  idx: { height: 40 },
  idxI: {
    position: 'absolute',
    width: 56,
    height: 34,
    borderRadius: 5,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D9D3F7',
    boxShadow: '0px 4px 8px -4px rgba(80, 60, 180, 0.3)',
  },
  idxRule: { position: 'absolute', left: 0, right: 0, top: 9, height: 1.5, backgroundColor: '#F2B8AE' },
  idx1: { left: 0, top: 6, transform: [{ rotate: '-8deg' }] },
  idx2: { left: 6, top: 3, transform: [{ rotate: '4deg' }] },
  idx3: { left: 12, top: 0 },
  np: { width: 58, borderRadius: 4, backgroundColor: '#fff', boxShadow: '0px 4px 8px -4px rgba(0, 80, 70, 0.3)', overflow: 'hidden' },
  // border-top: 3px double #14161C → two 1 px lines with a 1 px gap
  npDouble: { height: 3, borderTopWidth: 1, borderBottomWidth: 1, borderColor: INK },
  npBody: { padding: 6 },
  npFirst: { height: 4, borderRadius: 1, backgroundColor: INK },
  npI: { height: 3, borderRadius: 1, backgroundColor: '#CFE3DE', marginTop: 3 },
  // Briefing
  card: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E6EBF1', borderRadius: 18 },
  brief: { overflow: 'hidden' },
  bmast: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundImage: 'linear-gradient(135deg, #FFF6E8, #FFEFD6)',
    borderBottomWidth: 1,
    borderBottomColor: '#F6E2C2',
  },
  bmSmall: { ...font('sans', 700), fontSize: 10.5, lineHeight: 15.225, letterSpacing: 1.26, textTransform: 'uppercase', color: '#C47406', marginTop: 4 },
  bmB: { ...font('book', 600, true), fontSize: 22, lineHeight: 28.6, color: INK, marginTop: 2 },
  bmSpan: { fontSize: 11.5, lineHeight: 16.675, color: '#8A6A3A', marginTop: 2 },
  bRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, paddingHorizontal: 16 },
  bRowLine: { borderTopWidth: 1, borderTopColor: '#EEF2F6' },
  bRowB: { ...font('book', 500), fontSize: 18, lineHeight: 23.4, color: INK },
  bRowS: { fontSize: 11.5, lineHeight: 16.675, letterSpacing: 0.23, color: '#7A8494', marginTop: 4 },
  more: { justifyContent: 'space-between' },
  moreT: { ...font('sans', 600), fontSize: 13.5, lineHeight: 19.575, color: '#1B8AD3' },
  // Reels
  reelsScroll: { marginHorizontal: -20 },
  reels: { paddingHorizontal: 20, paddingBottom: 4, gap: 10 },
  reel: { width: 132, height: 176, padding: 12, borderRadius: 16 },
  reelSeen: { opacity: 0.55 },
  rs: { flexDirection: 'row', alignItems: 'center', gap: 6, opacity: 0.85 },
  rsDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#fff' },
  rsT: { ...font('sans', 600), fontSize: 10.5, lineHeight: 15.225, color: '#fff' },
  rk: { ...font('book', 400, true), fontSize: 28, lineHeight: 28, color: '#fff', marginTop: 'auto' },
  rt: { ...font('sans', 600), fontSize: 12.5, lineHeight: 16.25, color: '#fff', marginTop: 6 },
  rd: { flexDirection: 'row', alignItems: 'center', gap: 5, opacity: 0.75, marginTop: 8 },
  rdT: { fontSize: 11.5, lineHeight: 16.675, color: '#fff' },
  // Progress
  prog: { padding: 18 },
  wkh: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  wkSmall: { ...font('sans', 600), fontSize: 11.5, lineHeight: 16.675, color: '#7A8494' },
  wkB: { ...font('serif', 800), fontSize: 28, lineHeight: 40.6, letterSpacing: -0.56, color: INK, marginTop: 2 },
  wkEm: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#E6F4EA', paddingVertical: 5, paddingHorizontal: 9, borderRadius: 10 },
  wkEmT: { ...font('sans', 600), fontSize: 11.5, lineHeight: 16.675, color: '#1F8A5B' },
  rot90: { transform: [{ rotate: '-90deg' }] },
  ink: { flexDirection: 'row', gap: 6, marginTop: 16, paddingBottom: 18, borderBottomWidth: 1, borderBottomColor: '#EEF2F6' },
  inkCol: { flex: 1, alignItems: 'center', gap: 5 },
  inkD: { ...font('sans', 700), fontSize: 10.5, lineHeight: 15.225, color: '#8A93A0' },
  inkDOn: { color: '#F5A01F' },
  pg: { width: '100%', height: 70, borderRadius: 8, backgroundColor: '#F3F6FA', overflow: 'hidden', boxShadow: 'inset 0px 0px 0px 1px #E6EBF1' },
  pgOn: { boxShadow: 'inset 0px 0px 0px 2px #F5A01F' },
  pgI: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundImage: 'linear-gradient(180deg, #5BB1EA, #1470B0)',
  },
  pgCap: { position: 'absolute', left: 0, right: 0, top: -3, height: 6, borderRadius: 999, backgroundColor: '#7CC4F0' },
  pgEm: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 5,
    textAlign: 'center',
    ...font('sans', 700),
    fontSize: 10.5,
    lineHeight: 15.225,
    color: '#fff',
    textShadowColor: 'rgba(0,40,80,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  pgEmNil: { color: '#AEB7C3', textShadowColor: 'transparent', textShadowRadius: 0 },
  cov2: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingTop: 18 },
  legSmall: { ...font('sans', 600), fontSize: 11.5, lineHeight: 16.675, color: '#7A8494', marginBottom: 4 },
  legRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 5 },
  legI: { width: 8, height: 8, borderRadius: 4 },
  legT: { fontSize: 13.5, lineHeight: 19.575, color: '#25272D' },
  legB: { ...font('sans', 700), fontSize: 12.5, lineHeight: 18.125, color: '#25272D', marginLeft: 'auto' },
  // Tools
  tools: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E6EBF1', borderRadius: 18, overflow: 'hidden' },
  tg: { flexDirection: 'row', alignItems: 'stretch' },
  tgLine: { borderTopWidth: 1, borderTopColor: '#EEF2F6' },
  tgl: { width: 26, alignItems: 'center', justifyContent: 'center' },
  // writing-mode:vertical-rl + rotate(180deg): reads bottom to top
  tglT: {
    width: 120,
    textAlign: 'center',
    transform: [{ rotate: '-90deg' }],
    ...font('sans', 800),
    fontSize: 9.5,
    lineHeight: 13.775,
    letterSpacing: 1.52,
    textTransform: 'uppercase',
    color: '#fff',
  },
  tgr: { flex: 1, flexDirection: 'row', paddingTop: 14, paddingHorizontal: 4, paddingBottom: 12 },
  tool: { flex: 1, alignItems: 'center', gap: 7, paddingHorizontal: 2 },
  ti: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  tiPressed: { transform: [{ scale: 0.92 }] },
  ai: {
    position: 'absolute',
    top: -5,
    right: -8,
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fff',
    backgroundImage: 'linear-gradient(135deg, #6C5DD3, #1B8AD3)',
  },
  aiT: { ...font('sans', 800), fontSize: 8, lineHeight: 9.6, letterSpacing: 0.32, color: '#fff', textAlign: 'center' },
  toolT: { fontSize: 10.5, lineHeight: 12.6, color: '#25272D', textAlign: 'center' },
  foot: { ...font('book', 400, true), fontSize: 15.5, lineHeight: 22.475, color: '#9AA3AF', textAlign: 'center', marginTop: 30 },
});
