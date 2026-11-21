// Source: PrepAssist.html L4872-L4924 (#inVisual: the four .vig vignettes)
// Source: PrepAssist.html L3886-L3974 (.vig > *, .f-doc … .fu-s: the final intro illustration rules)
// The four illustrations of the intro. Each `.vig` is absolute over #inVisual; the one with .on is
// opaque and its children run their transitions into place with the delays of the `.vig.on` rules.
// Values from reference/android stage-intro-1 … stage-intro-4 (computed) and the cited rules.
import React, { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import type { ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { Icon, Logo } from '../../components';
import { easeCss, easeVar } from '../../shell/anim';
import { font } from '../../theme';
import { Txt } from '../../theme/Txt';
import { useClassTransition } from './introAnim';

const EASE_IN_OUT = Easing.bezier(0.42, 0, 0.58, 1);
const INK = '#25272D';
const NAVY = '#14304F';
const GREY = '#7A8494';

interface Pose {
  tx?: number;
  ty?: number;
  rot?: number;
  scale?: number;
}

/**
 * A direct child of .vig: `transition: opacity .6s var(--ease), transform .7s var(--ease)` (L3886) from
 * the off pose to the on pose, with the `.vig.on` transition-delay going in (none going out).
 */
function Pop({
  on,
  fresh,
  off,
  onPose = {},
  delay = 0,
  dur,
  style,
  children,
  pointer,
}: {
  on: boolean;
  fresh: number;
  off: Pose;
  onPose?: Pose;
  delay?: number;
  /** transition-duration overriding both (.f-lens: 1.2s) */
  dur?: number;
  style?: ViewStyle | ViewStyle[];
  children?: React.ReactNode;
  pointer?: boolean;
}): React.JSX.Element {
  const o = useClassTransition(on ? 1 : 0, dur ?? 600, easeVar, delay, 0, fresh);
  const t = useClassTransition(on ? 1 : 0, dur ?? 700, easeVar, delay, 0, fresh);
  const a = useAnimatedStyle(() => {
    const k = t.value;
    const l = (x: number | undefined, y: number | undefined, d: number) => (x ?? d) + ((y ?? d) - (x ?? d)) * k;
    return {
      opacity: o.value,
      transform: [
        { translateX: l(off.tx, onPose.tx, 0) },
        { translateY: l(off.ty, onPose.ty, 0) },
        { rotate: `${l(off.rot, onPose.rot, 0)}deg` },
        { scale: l(off.scale, onPose.scale, 1) },
      ],
    };
  });
  return (
    <Animated.View style={[styles.abs, style, a, pointer === false && styles.noPointer]}>{children}</Animated.View>
  );
}

/** transform: scaleX(0) -> none from the left edge, `transition: transform .8s var(--ease)` (L3902). */
function Grow({ on, fresh, delay, style }: { on: boolean; fresh: number; delay: number; style: ViewStyle | ViewStyle[] }): React.JSX.Element {
  const p = useClassTransition(on ? 1 : 0, 800, easeVar, delay, 0, fresh);
  const a = useAnimatedStyle(() => ({ transform: [{ scaleX: p.value }] }));
  return <Animated.View style={[style, styles.fromLeft, a]} />;
}

// ---------------------------------------------------------------- F1 notes

const GL_W = ['88%', '74%', '82%'] as const;
const LN_W = ['94%', '86%', '90%', '60%'] as const;

function Notes({ on, fresh }: { on: boolean; fresh: number }): React.JSX.Element {
  return (
    <>
      <Pop on={on} fresh={fresh} off={{ ty: 10, rot: 7 }} onPose={{ rot: 5 }} delay={100} style={styles.docBack} />
      <Pop on={on} fresh={fresh} off={{ ty: 16, rot: 2 }} onPose={{ rot: -2 }} style={styles.doc}>
        <View style={styles.fdBand}>
          <View style={styles.fdLogo}>
            <Logo size={16} />
          </View>
          <Txt style={styles.fdB}>PrepAssist</Txt>
          <Txt style={styles.fdEm}>Faculty compendium</Txt>
        </View>
        <View style={styles.fdIn}>
          <View style={styles.fdChip}>
            <Txt style={styles.fdChipT}>Polity &amp; Governance</Txt>
          </View>
          <Txt style={styles.h4}>Fundamental Rights — One-page Synopsis</Txt>
          <View style={styles.fdGl}>
            <Txt style={styles.fdGlSmall}>At a glance</Txt>
            {GL_W.map((w, i) => (
              <View key={i} style={styles.fdGlP}>
                <View style={styles.num}>
                  <Txt style={styles.numT}>{i + 1}</Txt>
                </View>
                <View style={styles.flex}>
                  <Grow on={on} fresh={fresh} delay={600 + 200 * i} style={[styles.glBar, { width: w }]} />
                </View>
              </View>
            ))}
          </View>
          <View style={styles.fdTrap}>
            <View style={[styles.num, styles.trapI]}>
              <Txt style={styles.trapIT}>!</Txt>
            </View>
            <Grow on={on} fresh={fresh} delay={1250} style={[styles.glBar, styles.trapBar]} />
          </View>
          <View style={styles.fdLn}>
            {LN_W.map((w, i) => (
              <View key={i} style={[styles.lnBar, { width: w }]} />
            ))}
          </View>
        </View>
      </Pop>
      <Pop on={on} fresh={fresh} off={{ tx: 16, scale: 0.9 }} delay={1400} style={styles.badge}>
        <View style={styles.badgeI}>
          <Icon name="shield" size={16} color="#fff" />
        </View>
        <View>
          <Txt style={styles.badgeB}>Verified</Txt>
          <Txt style={styles.badgeS}>by faculty</Txt>
        </View>
      </Pop>
      <Pop on={on} fresh={fresh} off={{ ty: 10 }} delay={1700} style={styles.pill}>
        <Icon name="clock" size={14} color="#FFD27A" />
        <Txt style={styles.pillT}>4 min read</Txt>
      </Pop>
    </>
  );
}

// ---------------------------------------------------------------- F2 tracker

/** --fc and the color-mix() results the browser computed (L3916, L3919). */
const FOLDERS = [
  { name: 'Polity', notes: '15 notes', up: '+16 updates', fc: '#6C5DD3', tint: '#EAE8F9', ring: '#CBCCEA', tab: '#D0CBF1' },
  { name: 'History', notes: '4 notes', up: '+3 updates', fc: '#0A97B8', tint: '#DDF0F5', ring: '#B6D9E4', tab: '#B1DEE8' },
  { name: 'Economy', notes: '9 notes', up: '+9 updates', fc: '#E8890C', tint: '#FCEEDD', ring: '#E6D5BF', tab: '#F8D9B1' },
  { name: 'Geography', notes: '6 notes', up: '+5 updates', fc: '#0E9A8A', tint: '#DDF1EF', ring: '#B6D9DA', tab: '#B2DFDA' },
] as const;

const HEAT_ROWS = [
  ['Cooperatives · Polity', '4 new'],
  ['GST & fiscal federalism · Economy', '4 new'],
  ['Indian monsoon · Geography', '3 new'],
] as const;

function Tracker({ on }: { on: boolean }): React.JSX.Element {
  // .ff has no transition of its own (`.vig > *` does not reach it): it switches with the class.
  return (
    <View style={styles.fold}>
      {[FOLDERS.slice(0, 2), FOLDERS.slice(2)].map((row, ri) => (
        <View key={ri} style={styles.foldRow}>
          {row.map(f => (
            <View
              key={f.name}
              style={[
                styles.ff,
                {
                  backgroundImage: `linear-gradient(170deg, ${f.tint}, #FFFFFF 65%)`,
                  boxShadow: `0px 0px 0px 1px ${f.ring}, 0px 14px 22px -18px ${f.fc}`,
                },
                !on && styles.ffOff,
              ]}>
              <View style={[styles.ffTab, { backgroundColor: f.tab }]} />
              <View style={[styles.ffIc, { backgroundColor: f.fc }]}>
                <Icon name="learn" size={16} color="#fff" />
              </View>
              <Txt style={styles.ffB}>{f.name}</Txt>
              <View style={styles.ffLine}>
                <Txt style={styles.ffSmall}>{f.notes}</Txt>
                <View style={styles.ffu}>
                  <Txt style={styles.ffuT}>{f.up}</Txt>
                </View>
              </View>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

function Heat({ on, fresh }: { on: boolean; fresh: number }): React.JSX.Element {
  return (
    <Pop on={on} fresh={fresh} off={{ ty: 14 }} delay={550} style={styles.heat}>
      <View style={styles.fhH}>
        <View style={styles.fhB}>
          <Icon name="refresh" size={15} color="#FFB547" />
          <Txt style={styles.fhBT}>23 updates waiting</Txt>
        </View>
        <Txt style={styles.fhSmall}>Auto-matched</Txt>
      </View>
      <View style={styles.heatList}>
        {HEAT_ROWS.map(r => (
          <View key={r[0]} style={styles.heatRow}>
            <View style={styles.heatDot} />
            <Txt style={styles.heatSpan}>{r[0]}</Txt>
            <Txt style={styles.heatNew}>{r[1]}</Txt>
          </View>
        ))}
      </View>
    </Pop>
  );
}

// ---------------------------------------------------------------- F3 x-ray

/** The nine lines of .f-xr: width of the grey bar, highlight class, --d. */
const XR_LINES: readonly { w: string; k?: 'p' | 'k' | 'h'; d?: number }[] = [
  { w: '92%' },
  { w: '84%', k: 'p', d: 700 },
  { w: '70%' },
  { w: '88%', k: 'k', d: 1100 },
  { w: '80%' },
  { w: '76%', k: 'p', d: 1500 },
  { w: '64%' },
  { w: '86%', k: 'h', d: 1900 },
  { w: '58%' },
];

/** .f-xr p::after: width 0 -> calc(100% + 8px), `transition: width .7s var(--ease)`, delay var(--d) (L3939-L3943) */
function Mark({ on, fresh, kind, d }: { on: boolean; fresh: number; kind: 'p' | 'k' | 'h'; d: number }): React.JSX.Element {
  const p = useClassTransition(on ? 1 : 0, 700, easeVar, d, 0, fresh);
  const [w, setW] = React.useState(0);
  const a = useAnimatedStyle(() => ({ width: (w + 8) * p.value }));
  return (
    <View style={styles.markHost} onLayout={e => setW(e.nativeEvent.layout.width)}>
      <Animated.View style={[styles.mark, MARK[kind], a]}>
        {kind === 'h' ? null : <View style={[styles.markLine, { backgroundColor: kind === 'p' ? '#1B8AD3' : '#1667B0' }]} />}
      </Animated.View>
    </View>
  );
}

const MARK = StyleSheet.create({
  p: { backgroundColor: 'rgba(27, 138, 211, 0.22)' },
  k: { backgroundColor: 'rgba(22, 103, 176, 0.12)' },
  h: { backgroundColor: 'rgba(255, 190, 100, 0.55)' },
});

/** .fx-beam: `animation: fxb 2.4s .4s ease-in-out forwards` (L3945-L3946), only while .vig.on. */
function Beam({ on, run }: { on: boolean; run: number }): React.JSX.Element {
  const k = useSharedValue(1);
  useEffect(() => {
    if (!on) {
      k.value = 1;
      return;
    }
    // before the delay ends the element keeps its own style (opacity 0): k = -1 marks that
    k.value = -1;
    k.value = withDelay(400, withSequence(withTiming(0, { duration: 0 }), withTiming(1, { duration: 2400, easing: Easing.linear })));
  }, [on, run, k]);
  const a = useAnimatedStyle(() => {
    if (k.value < 0) return { opacity: 0, transform: [{ translateY: 0 }] };
    const t = k.value;
    // one keyframe segment for transform (0 -> 100 %), two for opacity (90 %, 100 %); ease-in-out per segment
    const bez = (x: number) => {
      // cubic-bezier(.42,0,.58,1) solved numerically
      let lo = 0;
      let hi = 1;
      for (let i = 0; i < 20; i++) {
        const m = (lo + hi) / 2;
        const xm = 3 * 0.42 * m * (1 - m) * (1 - m) + 3 * 0.58 * m * m * (1 - m) + m * m * m;
        if (xm < x) lo = m;
        else hi = m;
      }
      const s = (lo + hi) / 2;
      return 3 * s * s * (1 - s) + s * s * s;
    };
    const ty = -40 + 360 * bez(t);
    const op = t < 0.9 ? 1 : 1 - bez((t - 0.9) / 0.1);
    return { opacity: t >= 1 ? 0 : op, transform: [{ translateY: ty }] };
  });
  return <Animated.View style={[styles.beam, a]} />;
}

function Xray({ on, fresh, run }: { on: boolean; fresh: number; run: number }): React.JSX.Element {
  return (
    <>
      <Pop on={on} fresh={fresh} off={{ ty: 16 }} style={styles.xr}>
        <Txt style={styles.fxSmall}>Laxmikanth · Ch. 7 · p. 7.14</Txt>
        <Txt style={styles.fxB}>Constitutional Remedies</Txt>
        {XR_LINES.map((l, i) => (
          <View key={i} style={styles.xrP}>
            <View style={[styles.xrBar, { width: l.w as ViewStyle['width'] }]} />
            {l.k ? <Mark on={on} fresh={fresh} kind={l.k} d={l.d ?? 0} /> : null}
          </View>
        ))}
        <Beam on={on} run={run} />
      </Pop>
      <Pop on={on} fresh={fresh} off={{ tx: -40, ty: 40, rot: -10 }} delay={500} dur={1200} style={styles.lens}>
        <Svg width={76} height={76} viewBox="0 0 60 60">
          <Circle cx={24} cy={24} r={17} fill="rgba(255,255,255,.35)" stroke={NAVY} strokeWidth={5} />
          <Path d="M37 37l15 15" stroke={NAVY} strokeWidth={7} strokeLinecap="round" />
        </Svg>
      </Pop>
      <Pop on={on} fresh={fresh} off={{ scale: 0.85 }} delay={1000} style={[styles.tag, styles.t1]}>
        <Txt style={styles.tagT}>Asked in 2019</Txt>
      </Pop>
      <Pop on={on} fresh={fresh} off={{ scale: 0.85 }} delay={1600} style={[styles.tag, styles.t2]}>
        <Txt style={styles.tagT}>Asked in 2023</Txt>
      </Pop>
      <Pop on={on} fresh={fresh} off={{ ty: 12 }} delay={2100} style={styles.found}>
        <View style={styles.foundB}>
          <Txt style={styles.foundBT}>5</Txt>
        </View>
        <Txt style={styles.foundS}>{'PYQ lines\nfound'}</Txt>
      </Pop>
    </>
  );
}

// ---------------------------------------------------------------- F4 cloud

/** .vig.on .f-cloud svg path:last-child{animation:fcu 1.6s .8s ease-in-out infinite} (L3960-L3961) */
function CloudArrow({ on, run }: { on: boolean; run: number }): React.JSX.Element {
  const y = useSharedValue(0);
  useEffect(() => {
    y.value = 0;
    if (!on) return;
    y.value = withDelay(
      800,
      withRepeat(
        withSequence(withTiming(-5, { duration: 800, easing: EASE_IN_OUT }), withTiming(0, { duration: 800, easing: EASE_IN_OUT })),
        -1,
      ),
    );
  }, [on, run, y]);
  const a = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  return (
    <Animated.View style={[StyleSheet.absoluteFill, a]}>
      <Svg width={200} height={130} viewBox="0 0 200 130">
        <Path d="M100 96V62M86 75l14-14 14 14" fill="none" stroke="#fff" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </Animated.View>
  );
}

const FILES = [
  { k: 'a', label: 'Laxmikanth_Ch9.pdf', tag: 'PDF', bg: '#E5484D', off: { tx: -10, ty: 20, rot: -4 }, onPose: { rot: -4 }, delay: 400 },
  { k: 'b', label: 'Answer_scan.jpg', tag: 'JPG', bg: '#0E9A8A', off: { tx: 10, ty: 20, rot: 4 }, onPose: { rot: 4 }, delay: 600 },
  { k: 'c', label: 'Economy_notes.docx', tag: 'DOC', bg: '#1B6FB3', off: { ty: 20 }, onPose: {}, delay: 800 },
] as const;

/** .fu-b i: width 0 -> 100 %, `transition: width 1.4s 1.2s var(--ease)` (both ways) */
function UpBar({ on, fresh }: { on: boolean; fresh: number }): React.JSX.Element {
  const p = useClassTransition(on ? 1 : 0, 1400, easeVar, 1200, 1200, fresh);
  const a = useAnimatedStyle(() => ({ width: `${100 * p.value}%` }));
  return (
    <View style={styles.fuB}>
      <Animated.View style={[styles.fuBi, a]} />
    </View>
  );
}

/** .fu-t em: opacity 0 -> 1, `transition: opacity .4s 2.6s` (ease, both ways) */
function Indexed({ on, fresh }: { on: boolean; fresh: number }): React.JSX.Element {
  const p = useClassTransition(on ? 1 : 0, 400, easeCss, 2600, 2600, fresh);
  const a = useAnimatedStyle(() => ({ opacity: p.value }));
  return (
    <Animated.View style={a}>
      <Txt style={styles.fuEm} numberOfLines={1}>
        Indexed for AI
      </Txt>
    </Animated.View>
  );
}

function Cloud({ on, fresh, run }: { on: boolean; fresh: number; run: number }): React.JSX.Element {
  return (
    <>
      <Pop on={on} fresh={fresh} off={{ ty: -12, scale: 0.94 }} style={styles.cloud}>
        <View style={styles.cloudSvg}>
          <Svg width={200} height={130} viewBox="0 0 200 130">
            <Defs>
              <LinearGradient id="fcg" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor="#4FB0EC" />
                <Stop offset="1" stopColor="#1B6FB3" />
              </LinearGradient>
            </Defs>
            <Path d="M52 112h-8a30 30 0 0 1-4-59.7A42 42 0 0 1 120 38a34 34 0 0 1 36 30 22 22 0 0 1 2 44Z" fill="url(#fcg)" />
          </Svg>
          <CloudArrow on={on} run={run} />
        </View>
      </Pop>
      {FILES.map(f => (
        <Pop key={f.k} on={on} fresh={fresh} off={f.off} onPose={f.onPose} delay={f.delay} style={[styles.file, FILE_POS[f.k]]}>
          <View style={[styles.fileI, { backgroundColor: f.bg }]}>
            <Txt style={styles.fileIT}>{f.tag}</Txt>
          </View>
          <Txt style={styles.fileT}>{f.label}</Txt>
        </Pop>
      ))}
      <Pop on={on} fresh={fresh} off={{ ty: 14 }} delay={1000} style={styles.up}>
        <View style={styles.fuT}>
          <Txt style={styles.fuTB} numberOfLines={1}>
            Economic Survey 2025-26.pdf
          </Txt>
          <Indexed on={on} fresh={fresh} />
        </View>
        <UpBar on={on} fresh={fresh} />
        <View style={styles.fuS}>
          <View style={styles.fuSpan}>
            <Icon name="device" size={13} color={GREY} />
            <Txt style={styles.fuST}>Web &amp; app</Txt>
          </View>
          <Txt style={styles.fuST}>27 MB of 512 MB</Txt>
        </View>
      </Pop>
    </>
  );
}

const FILE_POS = StyleSheet.create({
  a: { left: 0, top: '46%' },
  b: { right: 0, top: '38%' },
  c: { left: '18%', top: '62%' },
});

// ---------------------------------------------------------------- .vig

/** .vig{transition:opacity .5s} (ease) */
function Vig({ on, fresh, children, testID }: { on: boolean; fresh: number; children: React.ReactNode; testID: string }): React.JSX.Element {
  const o = useClassTransition(on ? 1 : 0, 500, easeCss, 0, 0, fresh);
  const a = useAnimatedStyle(() => ({ opacity: o.value }));
  return (
    <Animated.View style={[StyleSheet.absoluteFill, a]} pointerEvents={on ? 'auto' : 'none'} testID={testID}>
      {children}
    </Animated.View>
  );
}

export function IntroVignettes({ intro, fresh, run }: { intro: number; fresh: number; run: number }): React.JSX.Element {
  return (
    <>
      <Vig on={intro === 0} fresh={fresh} testID="intro.vig0">
        <Notes on={intro === 0} fresh={fresh} />
      </Vig>
      <Vig on={intro === 1} fresh={fresh} testID="intro.vig1">
        <Pop on={intro === 1} fresh={fresh} off={{}} style={styles.foldHost}>
          <Tracker on={intro === 1} />
        </Pop>
        <Heat on={intro === 1} fresh={fresh} />
      </Vig>
      <Vig on={intro === 2} fresh={fresh} testID="intro.vig2">
        <Xray on={intro === 2} fresh={fresh} run={run} />
      </Vig>
      <Vig on={intro === 3} fresh={fresh} testID="intro.vig3">
        <Cloud on={intro === 3} fresh={fresh} run={run} />
      </Vig>
    </>
  );
}

const cardShadow = '0px 0px 0px 1px #E6EBF1, 0px 24px 40px -24px rgba(20, 48, 79, 0.55)';

const styles = StyleSheet.create({
  abs: { position: 'absolute' },
  noPointer: { pointerEvents: 'none' },
  flex: { flex: 1 },
  fromLeft: { transformOrigin: 'left' },
  // .f-doc / .f-doc.back
  doc: {
    left: '8%',
    right: '12%',
    top: 18,
    bottom: 26,
    borderRadius: 12,
    backgroundColor: '#fff',
    boxShadow: cardShadow,
    overflow: 'hidden',
  },
  docBack: { left: '14%', right: '4%', top: 6, bottom: 38, borderRadius: 12, backgroundColor: '#EAF1FB', boxShadow: '0px 0px 0px 1px #D9E4F4' },
  // .fd-band: row, gap 7, height 38, padding 0 12, gradient
  fdBand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    height: 38,
    paddingHorizontal: 12,
    backgroundImage: 'linear-gradient(90deg, #14304F, #1667B0)',
  },
  fdLogo: { width: 22, height: 22, borderRadius: 6, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  fdB: { ...font('sans', 700), fontSize: 12.5, lineHeight: 18.125, color: '#fff' },
  fdEm: { marginLeft: 'auto', fontSize: 9.5, lineHeight: 13.775, letterSpacing: 0.38, opacity: 0.7, color: '#fff' },
  fdIn: { paddingTop: 14, paddingHorizontal: 14 },
  // .fd-chip: inline-block, 9.5px 800, .06em, uppercase, #1667B0 on #EAF1FB, padding 3 8, radius 6
  fdChip: { alignSelf: 'flex-start', paddingVertical: 3, paddingHorizontal: 8, borderRadius: 6, backgroundColor: '#EAF1FB' },
  fdChipT: { ...font('sans', 800), fontSize: 9.5, lineHeight: 13.775, letterSpacing: 0.57, textTransform: 'uppercase', color: '#1667B0' },
  // .f-doc h4: EB Garamond 500 20px / 23px, #14161C, margin-top 8 (the chip's line box adds the rest)
  h4: { ...font('book', 500), fontSize: 20, lineHeight: 23, color: '#14161C', marginTop: 8 },
  fdGl: { marginTop: 12, padding: 10, borderRadius: 10, backgroundColor: '#F7F9FB' },
  fdGlSmall: { ...font('sans', 800), fontSize: 9, lineHeight: 13.05, letterSpacing: 1.26, textTransform: 'uppercase', color: '#1667B0', marginBottom: 4 },
  fdGlP: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  num: { width: 16, height: 16, borderRadius: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1667B0' },
  numT: { ...font('sans', 800), fontSize: 9, lineHeight: 13.05, color: '#fff' },
  glBar: { height: 6, borderRadius: 3, backgroundColor: '#DCE3EC' },
  fdTrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#FFF6E6',
    boxShadow: 'inset 0px 0px 0px 1px #F5DEB3',
  },
  trapI: { backgroundColor: '#F5A01F' },
  trapIT: { ...font('sans', 900), fontSize: 10.5, lineHeight: 15.225, color: '#fff' },
  trapBar: { flex: 1, backgroundColor: '#F3D9A8' },
  fdLn: { marginTop: 12 },
  lnBar: { height: 6, borderRadius: 3, backgroundColor: '#EEF2F6', marginTop: 9 },
  // .f-badge: right 0, top 44 %
  badge: {
    right: 0,
    top: '44%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 8,
    paddingRight: 12,
    paddingBottom: 8,
    paddingLeft: 8,
    borderRadius: 14,
    backgroundColor: '#fff',
    boxShadow: '0px 14px 28px -14px rgba(20, 48, 79, 0.55), 0px 0px 0px 1px #E6EBF1',
  },
  badgeI: { width: 30, height: 30, borderRadius: 9, alignItems: 'center', justifyContent: 'center', backgroundColor: '#2F8A4A' },
  badgeB: { ...font('sans', 700), fontSize: 13.5, lineHeight: 19.575, color: INK },
  // small inline in the div: its line box is the body line height
  badgeS: { fontSize: 10.5, lineHeight: 22.475, color: GREY },
  // .f-pill: left 0, bottom 6, height 32
  pill: {
    left: 0,
    bottom: 6,
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: NAVY,
  },
  pillT: { ...font('sans', 700), fontSize: 12.5, lineHeight: 18.125, color: '#fff' },
  // F2
  foldHost: { left: 0, right: 0, top: 20 },
  // .f-fold: grid 1fr 1fr, gap 12
  fold: { gap: 12 },
  foldRow: { flexDirection: 'row', gap: 12 },
  ff: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
  },
  ffOff: { opacity: 0, transform: [{ translateY: 14 }] },
  ffTab: { position: 'absolute', left: 0, top: -8, width: 50, height: 12, borderTopLeftRadius: 6, borderTopRightRadius: 8 },
  ffIc: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  ffB: { ...font('sans', 700), fontSize: 14.5, lineHeight: 21.025, color: INK, marginTop: 9 },
  ffLine: { flexDirection: 'row', alignItems: 'flex-start', height: 23.46 },
  ffSmall: { fontSize: 11.5, lineHeight: 14, color: GREY, marginTop: 5.99 },
  ffu: { marginTop: 4.99, paddingVertical: 2, paddingHorizontal: 7, borderRadius: 999, backgroundColor: '#E3F4EA' },
  ffuT: { ...font('sans', 800), fontSize: 9.5, lineHeight: 13.775, color: '#1F8A55' },
  heat: {
    left: '6%',
    right: '6%',
    bottom: 6,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: NAVY,
    boxShadow: '0px 18px 30px -18px rgba(20, 48, 79, 0.9)',
  },
  fhH: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  fhB: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  fhBT: { ...font('sans', 700), fontSize: 13.5, lineHeight: 19.575, color: '#fff' },
  fhSmall: { fontSize: 11.5, lineHeight: 16.675, color: '#fff', opacity: 0.6 },
  heatList: { gap: 6, marginTop: 8 },
  heatRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  heatDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#1FA463' },
  heatSpan: { flex: 1, ...font('sans', 600), fontSize: 12, lineHeight: 15.6, color: INK },
  heatNew: { ...font('sans', 900), fontSize: 12, lineHeight: 15.6, color: '#1F8A55' },
  // F3
  xr: {
    left: '4%',
    right: '16%',
    top: 12,
    bottom: 18,
    paddingTop: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    boxShadow: cardShadow,
    overflow: 'hidden',
  },
  fxSmall: { ...font('sans', 700), fontSize: 9.5, lineHeight: 13.775, letterSpacing: 0.76, textTransform: 'uppercase', color: '#9AA3AF' },
  fxB: { ...font('book', 500), fontSize: 18, lineHeight: 20.7, marginTop: 4, marginBottom: 8, color: INK },
  xrP: { paddingVertical: 5 },
  xrBar: { height: 7, borderRadius: 3, backgroundColor: '#E3E8EE' },
  markHost: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  mark: { position: 'absolute', left: -4, top: 1, bottom: 1, borderRadius: 3, overflow: 'hidden' },
  // box-shadow: inset 0 -2px <colour>
  markLine: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 2 },
  beam: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 40,
    backgroundImage: 'linear-gradient(180deg, rgba(0, 0, 0, 0), rgba(27, 138, 211, 0.18) 80%, rgba(27, 138, 211, 0.7))',
  },
  // .f-lens: right 2 %, top 30 %, width 76 (the inline svg's line box makes it 82.47 high)
  lens: { right: '2%', top: '30%', width: 76, height: 82.47 },
  tag: {
    right: 0,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 9,
    backgroundColor: '#1B8AD3',
    boxShadow: '0px 10px 18px -10px rgba(27, 138, 211, 0.9)',
  },
  t1: { top: '14%' },
  t2: { top: '58%', backgroundColor: NAVY },
  tagT: { ...font('sans', 700), fontSize: 11.5, lineHeight: 16.675, color: '#fff' },
  found: {
    left: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 8,
    paddingRight: 14,
    paddingBottom: 8,
    paddingLeft: 8,
    borderRadius: 16,
    backgroundColor: '#FFD27A',
    boxShadow: '0px 14px 26px -14px rgba(184, 110, 0, 0.8)',
  },
  foundB: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center', backgroundColor: NAVY },
  foundBT: { ...font('serif', 800), fontSize: 20, lineHeight: 29, color: '#FFD27A' },
  foundS: { ...font('sans', 800), fontSize: 11.5, lineHeight: 13.225, color: '#5B3B00' },
  // F4: .f-cloud left 50 %, top 6, width 200, margin-left -100
  cloud: { left: '50%', top: 6, width: 200, height: 130, marginLeft: -100 },
  // .f-cloud svg{filter:drop-shadow(0 20px 24px rgba(27,111,179,.35))}
  cloudSvg: {
    width: 200,
    height: 130,
    ...Platform.select({
      ios: { shadowColor: 'rgb(27, 111, 179)', shadowOpacity: 0.35, shadowOffset: { width: 0, height: 20 }, shadowRadius: 24 },
      default: { filter: [{ dropShadow: { offsetX: 0, offsetY: 20, standardDeviation: 24, color: 'rgba(27, 111, 179, 0.35)' } }] },
    }),
  },
  file: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 7,
    paddingRight: 11,
    paddingBottom: 7,
    paddingLeft: 7,
    borderRadius: 12,
    backgroundColor: '#fff',
    boxShadow: '0px 0px 0px 1px #E6EBF1, 0px 12px 22px -14px rgba(20, 48, 79, 0.55)',
  },
  fileI: {
    width: 28,
    height: 30,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 9,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileIT: { ...font('sans', 800), fontSize: 8.5, lineHeight: 12.325, color: '#fff' },
  fileT: { ...font('sans', 600), fontSize: 11.5, lineHeight: 16.675, color: INK },
  up: {
    left: '4%',
    right: '4%',
    bottom: 4,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: '#fff',
    boxShadow: '0px 0px 0px 1.5px #F5D59A, 0px 18px 30px -20px rgba(184, 110, 0, 0.6)',
  },
  fuT: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  fuTB: { ...font('sans', 700), fontSize: 12.5, lineHeight: 18.125, color: INK, flexShrink: 1 },
  fuEm: { ...font('sans', 800), fontSize: 10.5, lineHeight: 15.225, color: '#2F8A4A' },
  fuB: { height: 6, borderRadius: 6, backgroundColor: '#F4EBDC', marginTop: 9, overflow: 'hidden' },
  fuBi: { height: '100%', borderRadius: 6, backgroundImage: 'linear-gradient(90deg, #F5A01F, #E8890C)' },
  fuS: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  fuSpan: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  fuST: { fontSize: 11.5, lineHeight: 16.675, color: GREY },
});
