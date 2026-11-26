// Source: PrepAssist.html L4757-L4864 (#s-book static markup)
// Source: PrepAssist.html L5783-L5794 (runBook)
// Source: PrepAssist.html L5737-L5746 (buildBook)
// Source: PrepAssist.html L5635-L5685 (makeLeaf3, playLeaf)
// Source: PrepAssist.html L5747-L5754 (setCtl)
// Source: PrepAssist.html L5806-L5819 (openBook)
// Source: PrepAssist.html L5820-L5840 (turnPage, bookExit)
// Source: PrepAssist.html L5871-L5893 (startDust, stopDust)
// Source: PrepAssist.html L111-L364 (.scene, .b3, .cvr2, .bk-skip, .bk-snd, .bk-ctl, .pp, .pp-lab)
// Source: PrepAssist.html L607-L627 (open book overrides: #s-book.close)
// Source: PrepAssist.html L1207-L1256 (book palette & running header .pp-rh)
// Source: PrepAssist.html L3702-L3880 (.bfp, .bf-sheet, .bt, .bt-card, .bx-wrap, .bx-film, .bx-ring, .bx-strip, .bf-cloud)
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import type { EasingFunction, EasingFunctionFactory, SharedValue } from 'react-native-reanimated';
import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';
import { act } from '../../actions';
import { Icon, Logo } from '../../components';
import { useAppSize } from '../../shell/AppSize';
import { useStore } from '../../store';
import { font } from '../../theme';
import { Txt } from '../../theme/Txt';
import { useInsets } from '../../theme/useTheme';
import { bookNext, bookPrev, openBook } from './flow';

const { width: WIN_W, height: WIN_H } = Dimensions.get('window');
const { width: SCR_W, height: SCR_H } = Dimensions.get('screen');
const SCREEN_W = WIN_W;
const SCREEN_H = WIN_H;
const FULL_W = Math.max(WIN_W, SCR_W);
const FULL_H = Math.max(WIN_H, SCR_H);
const VP_S = Math.min(SCREEN_W / 412, SCREEN_H / 915);

// Unscaled book geometry (PrepAssist.html L117, L484-L486, L5756-L5758)
const PG_W = 330;
const PG_H_CLOSED = 486;
const PG_H_OPEN = 724;
const CAM_CLOSED = { gx: 62 * VP_S, gy: 401 * VP_S, rx: 28, s: 0.802 * VP_S, h: PG_H_CLOSED };
const CAM_FINAL = { gx: 0, gy: 422 * VP_S, rx: 0, s: 1.182 * VP_S, h: PG_H_OPEN };
const XRAY_R = 58;
const CLOUD_ARC_LEN = 430;
const ARROW_STEM_LEN = 56;
const ARROW_HEAD_LEN = 54;

const EASE_OUT_VAR = Easing.bezier(0.2, 0.8, 0.2, 1);
const EASE_IO = Easing.bezier(0.45, 0.05, 0.2, 1);
const EASE_CAM = Easing.bezier(0.65, 0, 0.35, 1);
const EASE_POP = Easing.bezier(0.3, 1.5, 0.5, 1);
const EASE_SOFT = Easing.bezier(0.3, 1.3, 0.5, 1);
const EASE_XRAY = Easing.bezier(0.45, 0.05, 0.4, 1);

const APath = Animated.createAnimatedComponent(Path);

/** Shared helper for delayed one-shot CSS-style reveal transitions. */
function useReveal(
  active: boolean,
  isZero: boolean,
  delay: number,
  duration: number,
  easing: EasingFunction | EasingFunctionFactory = EASE_SOFT,
): SharedValue<number> {
  const v = useSharedValue(isZero ? 1 : 0);
  useEffect(() => {
    if (isZero) {
      v.value = 1;
      return;
    }
    if (!active) {
      v.value = 0;
      return;
    }
    v.value = 0;
    v.value = withDelay(delay, withTiming(1, { duration, easing }));
  }, [active, isZero, delay, duration, easing, v]);
  return v;
}

/** Subtle yellow highlight marker that wipes on smoothly in live mode and renders solid in zero-insets. */
function MarkSpan({
  children,
  isZero,
  delay = 300,
}: {
  children: React.ReactNode;
  isZero: boolean;
  delay?: number;
}): React.JSX.Element {
  const [lit, setLit] = useState(isZero);
  useEffect(() => {
    if (isZero) {
      setLit(true);
      return;
    }
    setLit(false);
    const t = setTimeout(() => setLit(true), delay);
    return () => clearTimeout(t);
  }, [isZero, delay]);
  return <Txt style={lit ? styles.tbMark : styles.tbMarkOff}>{children}</Txt>;
}

// ---------------------------------------------------------------- Desk Backdrop (L1208-L1209)
function DeskBg(): React.JSX.Element {
  return (
    <View style={[StyleSheet.absoluteFill, styles.deskBg]} pointerEvents="none">
      <View style={[StyleSheet.absoluteFill, styles.deskVig]} />
    </View>
  );
}

// ---------------------------------------------------------------- Floating Dust Motes (L5872-L5893)
const DUST_FAST = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  x: (i * 73 + 17) % 100,
  y: (i * 47 + 29) % 100,
  r: i % 4 === 0 ? 3.2 : 1.7,
  op: 0.35 + (i % 4) * 0.12,
}));
const DUST_SLOW = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  x: (i * 59 + 41) % 100,
  y: (i * 61 + 11) % 100,
  r: i % 5 === 0 ? 3.8 : 1.4,
  op: 0.25 + (i % 5) * 0.1,
}));

function DustField(): React.JSX.Element {
  const driftA = useSharedValue(0);
  const driftB = useSharedValue(0);

  useEffect(() => {
    driftA.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 4800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 4800, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
    driftB.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 6400, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 6400, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, [driftA, driftB]);

  const layerAStyle = useAnimatedStyle(() => ({
    opacity: 0.5 + 0.45 * Math.sin(Math.PI * driftA.value),
    transform: [
      { translateX: -6 + 14 * driftA.value },
      { translateY: 10 - 22 * driftA.value },
    ],
  }));
  const layerBStyle = useAnimatedStyle(() => ({
    opacity: 0.45 + 0.4 * Math.cos(Math.PI * driftB.value),
    transform: [
      { translateX: 8 - 12 * driftB.value },
      { translateY: 14 - 26 * driftB.value },
    ],
  }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Animated.View style={[StyleSheet.absoluteFill, layerAStyle]}>
        <Svg width="100%" height="100%">
          {DUST_FAST.map(p => (
            <Circle key={p.id} cx={`${p.x}%`} cy={`${p.y}%`} r={p.r} fill="#FFF4DC" opacity={p.op} />
          ))}
        </Svg>
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, layerBStyle]}>
        <Svg width="100%" height="100%">
          {DUST_SLOW.map(p => (
            <Circle key={p.id} cx={`${p.x}%`} cy={`${p.y}%`} r={p.r} fill="#FFEAB8" opacity={p.op} />
          ))}
        </Svg>
      </Animated.View>
    </View>
  );
}

// ---------------------------------------------------------------- Running Header & Page Label
function PageRh(): React.JSX.Element {
  return (
    <View style={styles.ppRh}>
      <View style={styles.wmWrap}>
        <Logo size={20} />
        <Txt style={styles.wmText}>PrepAssist</Txt>
      </View>
    </View>
  );
}

function PageLab({
  num,
  title,
  labStyle,
}: {
  num: string;
  title: string;
  labStyle?: object;
}): React.JSX.Element {
  return (
    <Animated.View style={[styles.ppLab, labStyle]}>
      <Txt style={styles.ppLabNum}>{num}</Txt>
      <Txt style={styles.ppLabTitle}>{title}</Txt>
    </Animated.View>
  );
}

// ---------------------------------------------------------------- Page 1: Notes
function Page1Notes({
  active = true,
  labStyle,
  pagePadTop = 44,
}: {
  active?: boolean;
  labStyle?: object;
  pagePadTop?: number;
}): React.JSX.Element {
  const insetsMode = useStore(s => s.insetsMode);
  const isZero = insetsMode === 'zero';
  // During initial book open, reveal(1) starts 700ms after openBook starts (L5813)
  const delayBase = active ? 0 : 700;

  const sheetAnim = useReveal(active, isZero, delayBase + 600, 800, EASE_SOFT);
  const verifiedAnim = useReveal(active, isZero, delayBase + 1600, 500, EASE_POP);
  const arrowAnim = useReveal(active, isZero, delayBase + 1800, 400, Easing.ease);

  const sheetStyle = useAnimatedStyle(() => {
    if (isZero) {
      return { opacity: 1, transform: [{ translateY: 0 }, { rotate: '-1.5deg' }] };
    }
    return {
      opacity: sheetAnim.value,
      transform: [
        { translateY: (1 - sheetAnim.value) * 26 },
        { rotate: `${-6 + sheetAnim.value * 4.5}deg` },
      ],
    };
  });

  const verifiedStyle = useAnimatedStyle(() => {
    if (isZero) {
      return { opacity: 1, transform: [{ scale: 1 }, { rotate: '-8deg' }] };
    }
    return {
      opacity: verifiedAnim.value,
      transform: [{ scale: 0.8 + 0.2 * verifiedAnim.value }, { rotate: '-8deg' }],
    };
  });

  const arrowStyle = useAnimatedStyle(() => {
    if (isZero) {
      return { opacity: 1, transform: [{ scale: 1 }, { scaleY: -1 }] };
    }
    return {
      opacity: arrowAnim.value,
      transform: [{ scale: 0.8 + 0.2 * arrowAnim.value }, { scaleY: -1 }],
    };
  });

  return (
    <View style={[styles.ppContainer, pagePadTop !== 44 && { paddingTop: pagePadTop }]}>
      <PageRh />

      <Txt style={styles.tbH}>Notes</Txt>
      <Txt style={styles.tb}>
        Verified faculty compendiums —{' '}
        <MarkSpan isZero={isZero} delay={delayBase + 300}>
          every subject on one crisp page
        </MarkSpan>
        , exam traps flagged.
      </Txt>

      {/* Faculty compendium sheet */}
      <Animated.View style={[styles.bfSheet, sheetStyle]}>
        <View style={styles.clipx} />

        <View style={styles.bsBand}>
          <View style={styles.bsBandLogo}>
            <Logo size={13} />
          </View>
          <Txt style={styles.bsBandTitle}>Faculty compendium</Txt>
        </View>

        <Txt style={styles.bsK}>Polity &amp; Governance</Txt>
        <Txt style={styles.bsT}>Fundamental Rights</Txt>

        <View style={styles.bsGl}>
          <View style={styles.bsGlRowFirst}>
            <View style={styles.bsGlNum}>
              <Txt style={styles.bsGlNumTxt}>1</Txt>
            </View>
            <Txt style={styles.bsGlTxt}>Part III · Articles 12–35</Txt>
          </View>
          <View style={styles.bsGlRow}>
            <View style={styles.bsGlNum}>
              <Txt style={styles.bsGlNumTxt}>2</Txt>
            </View>
            <Txt style={styles.bsGlTxt}>Six categories of rights</Txt>
          </View>
          <View style={styles.bsGlRow}>
            <View style={styles.bsGlNum}>
              <Txt style={styles.bsGlNumTxt}>3</Txt>
            </View>
            <Txt style={styles.bsGlTxt}>Art. 32 — “heart and soul”</Txt>
          </View>
        </View>

        <View style={styles.bsTrap}>
          <View style={styles.bsTrapBadge}>
            <Txt style={styles.bsTrapBadgeTxt}>!</Txt>
          </View>
          <Txt style={styles.bsTrapTxt}>
            Exam trap — Art. 226 is <Txt style={styles.boldTrap}>wider</Txt> than Art. 32
          </Txt>
        </View>
      </Animated.View>

      {/* Red pointer arrow + handwritten verified tag (HTML L3720-L3724) */}
      <Animated.View style={[styles.bfArw, arrowStyle]} pointerEvents="none">
        <Svg width={52} height={35} viewBox="0 0 60 40" fill="none">
          <Path d="M56 6C40 4 22 12 10 30" stroke="#C0392B" strokeWidth={1.8} strokeLinecap="round" />
          <Path d="M8 20l2 11 10-4" stroke="#C0392B" strokeWidth={1.8} strokeLinecap="round" />
        </Svg>
      </Animated.View>
      <Animated.View style={[styles.bfHwH1, verifiedStyle]} pointerEvents="none">
        <Txt style={styles.hwVerifiedTxt}>verified ✓</Txt>
      </Animated.View>

      <PageLab num="01" title="Notes" labStyle={labStyle} />
    </View>
  );
}

// ---------------------------------------------------------------- Page 2: Notes Tracker
function Page2Tracker({
  labStyle,
  pagePadTop = 44,
}: {
  labStyle?: object;
  pagePadTop?: number;
}): React.JSX.Element {
  const insetsMode = useStore(s => s.insetsMode);
  const isZero = insetsMode === 'zero';

  const cardAnim = useReveal(true, isZero, 400, 700, EASE_OUT_VAR);
  const src1Anim = useReveal(true, isZero, 600, 500, EASE_OUT_VAR);
  const src2Anim = useReveal(true, isZero, 750, 500, EASE_OUT_VAR);
  const src3Anim = useReveal(true, isZero, 900, 500, EASE_OUT_VAR);
  const arrowAnim = useReveal(true, isZero, 1150, 400, Easing.ease);
  const newWipeAnim = useReveal(true, isZero, 1600, 800, EASE_OUT_VAR);
  const mergedAnim = useReveal(true, isZero, 2400, 400, EASE_POP);

  const src1Style = useAnimatedStyle(() => {
    if (isZero) return { opacity: 1, transform: [{ translateY: 0 }, { rotate: '-4deg' }] };
    return {
      opacity: src1Anim.value,
      transform: [{ translateY: (1 - src1Anim.value) * -10 }, { rotate: '-4deg' }],
    };
  });
  const src2Style = useAnimatedStyle(() => {
    if (isZero) return { opacity: 1, transform: [{ translateY: 0 }] };
    return {
      opacity: src2Anim.value,
      transform: [{ translateY: (1 - src2Anim.value) * -10 }],
    };
  });
  const src3Style = useAnimatedStyle(() => {
    if (isZero) return { opacity: 1, transform: [{ translateY: 0 }, { rotate: '3deg' }] };
    return {
      opacity: src3Anim.value,
      transform: [{ translateY: (1 - src3Anim.value) * -10 }, { rotate: '3deg' }],
    };
  });
  const arrowStyle = useAnimatedStyle(() => (isZero ? { opacity: 1 } : { opacity: arrowAnim.value }));
  const cardStyle = useAnimatedStyle(() => {
    if (isZero) return { opacity: 1, transform: [{ translateY: 0 }, { rotate: '-0.8deg' }] };
    return {
      opacity: cardAnim.value,
      transform: [
        { translateY: (1 - cardAnim.value) * 18 },
        { rotate: `${1.5 - cardAnim.value * 2.3}deg` },
      ],
    };
  });
  // Clip-path left-to-right wipe approximation on pure RN
  const newWipeStyle = useAnimatedStyle(() => {
    if (isZero) return { opacity: 1, width: '100%' };
    return {
      opacity: newWipeAnim.value > 0.01 ? 1 : 0,
      width: `${Math.round(newWipeAnim.value * 100)}%`,
    };
  });
  const mergedStyle = useAnimatedStyle(() => {
    if (isZero) return { opacity: 1, transform: [{ scale: 1 }, { rotate: '-6deg' }] };
    return {
      opacity: mergedAnim.value,
      transform: [{ scale: 0.8 + 0.2 * mergedAnim.value }, { rotate: '-6deg' }],
    };
  });

  return (
    <View style={[styles.ppContainer, pagePadTop !== 44 && { paddingTop: pagePadTop }]}>
      <PageRh />

      <Txt style={styles.tbH}>Notes Tracker</Txt>
      <Txt style={styles.tbP2}>
        Your notes, one folder per subject —{' '}
        <MarkSpan isZero={isZero} delay={300}>
          always up to date
        </MarkSpan>
        .
      </Txt>

      <View style={styles.btWrap}>
        {/* Source chips */}
        <View style={styles.btSrcs}>
          <Animated.View style={[styles.btSrc, src1Style]}>
            <View style={[styles.btSrcBadge, styles.srcBgPdf]}>
              <Txt style={styles.btSrcBadgeTxt}>PDF</Txt>
            </View>
            <Txt style={styles.btSrcTxt}>Your PDF</Txt>
          </Animated.View>
          <Animated.View style={[styles.btSrc, src2Style]}>
            <View style={[styles.btSrcBadge, styles.srcBgTh]}>
              <Txt style={styles.btSrcBadgeTxt}>TH</Txt>
            </View>
            <Txt style={styles.btSrcTxt}>The Hindu</Txt>
          </Animated.View>
          <Animated.View style={[styles.btSrc, src3Style]}>
            <View style={[styles.btSrcBadge, styles.srcBgPib]}>
              <Txt style={styles.btSrcBadgeTxt}>PIB</Txt>
            </View>
            <Txt style={styles.btSrcTxt}>Release</Txt>
          </Animated.View>
        </View>

        {/* Converging dashed paths */}
        <Animated.View style={[styles.btArrowRow, arrowStyle]}>
          <Svg width={276} height={30} viewBox="0 0 300 34" fill="none">
            <Path
              d="M50 2C60 18 96 26 128 32"
              stroke="#2F7A4F"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeDasharray="3 4"
            />
            <Path
              d="M150 2V30"
              stroke="#2F7A4F"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeDasharray="3 4"
            />
            <Path
              d="M250 2C240 18 204 26 172 32"
              stroke="#2F7A4F"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeDasharray="3 4"
            />
          </Svg>
        </Animated.View>

        {/* Central folder card */}
        <Animated.View style={[styles.btCard, cardStyle]}>
          {/* Vertical right tabs (HTML L3787-L3789) */}
          <View style={styles.btTabs}>
            <View style={[styles.btTab, styles.btTabOn]}>
              <Txt style={styles.btTabOnTxt}>Polity</Txt>
            </View>
            <View style={[styles.btTab, styles.btTabHist]}>
              <Txt style={[styles.btTabTxt, styles.tabTxtHist]}>Hist.</Txt>
            </View>
            <View style={[styles.btTab, styles.btTabEcon]}>
              <Txt style={[styles.btTabTxt, styles.tabTxtEcon]}>Econ.</Txt>
            </View>
            <View style={[styles.btTab, styles.btTabGeo]}>
              <Txt style={[styles.btTabTxt, styles.tabTxtGeo]}>Geo</Txt>
            </View>
          </View>

          <View style={styles.btBand}>
            <Txt style={styles.btBandTitle}>Polity</Txt>
            <Txt style={styles.btBandSub}>15 notes</Txt>
            <View style={styles.btBandNew}>
              <Txt style={styles.btBandNewTxt}>3 new</Txt>
            </View>
          </View>

          <View style={styles.btIn}>
            <Txt style={styles.btInHead}>Cooperatives</Txt>
            <Txt style={styles.btInLine}>97th Amendment, 2011 · Part IX-B</Txt>
            <Txt style={styles.btInLine}>Art 43B (DPSP) · Entry 32, List II</Txt>
            <View style={styles.btNewClipOuter}>
              <Animated.View style={[styles.btNewClipInner, newWipeStyle]}>
                <View style={styles.btNewRow}>
                  <View style={styles.btNewBadgeFloat}>
                    <Txt style={styles.btNewBadgeTxt}>new</Txt>
                  </View>
                  <Txt style={styles.btNewTxt}>
                    {'          '}IYC 2025 — “Cooperatives Build a Better World”
                  </Txt>
                </View>
              </Animated.View>
            </View>
          </View>
        </Animated.View>

        <Animated.View style={[styles.hwMerged, mergedStyle]}>
          <Txt style={styles.hwMergedTxt}>merged in ✓</Txt>
        </Animated.View>
      </View>

      <PageLab num="02" title="Notes Tracker" labStyle={labStyle} />
    </View>
  );
}

// ---------------------------------------------------------------- Page 3: X-Ray Reading
function XRayPassage({
  film,
  bq1On,
  bq2On,
  bq3On,
  bk2On,
}: {
  film?: boolean;
  bq1On?: boolean;
  bq2On?: boolean;
  bq3On?: boolean;
  bk2On?: boolean;
}): React.JSX.Element {
  return (
    <Txt style={film ? styles.bxTxFilm : styles.bxTx}>
      Rights mean little without a way to enforce them. Hence,{' '}
      <Txt style={film ? styles.bqFilm : bq1On ? styles.bq : styles.bqOff}>
        Article 32 confers the right to remedies
      </Txt>{' '}
      — which Dr Ambedkar called{' '}
      <Txt style={film ? styles.bqFilm : bq2On ? styles.bq : styles.bqOff}>
        the heart and soul of the Constitution
      </Txt>
      . It is a{' '}
      <Txt style={film ? styles.bqFilm : bq3On ? styles.bq : styles.bqOff}>basic feature</Txt> no
      amendment can remove, and lets the Court issue{' '}
      <Txt style={film ? styles.bk2Film : bk2On ? styles.bk2 : styles.bk2Off}>
        writs like habeas corpus and mandamus
      </Txt>
      .
    </Txt>
  );
}

function getLensPose(p: number): { leftPct: number; topPct: number; opacity: number; scale: number; clipR: number } {
  'worklet';
  let leftPct = 22;
  let topPct = 6;
  let opacity = 0;
  let scale = 0.6;
  let clipR = XRAY_R;

  if (p < 0.1) {
    const k = p / 0.1;
    opacity = k;
    scale = 0.6 + 0.4 * k;
    clipR = 4 + (XRAY_R - 4) * k;
  } else if (p < 0.35) {
    const k = (p - 0.1) / 0.25;
    opacity = 1;
    scale = 1;
    leftPct = 22 + (72 - 22) * k;
    topPct = 6 + (26 - 6) * k;
  } else if (p < 0.6) {
    const k = (p - 0.35) / 0.25;
    opacity = 1;
    scale = 1;
    leftPct = 72 + (30 - 72) * k;
    topPct = 26 + (52 - 26) * k;
  } else if (p < 0.82) {
    const k = (p - 0.6) / 0.22;
    opacity = 1;
    scale = 1;
    leftPct = 30 + (70 - 30) * k;
    topPct = 52 + (82 - 52) * k;
  } else if (p < 0.92) {
    const k = (p - 0.82) / 0.1;
    opacity = 1;
    scale = 1;
    leftPct = 70 + (55 - 70) * k;
    topPct = 82 + (92 - 82) * k;
  } else {
    const k = Math.min(1, (p - 0.92) / 0.08);
    opacity = 1 - k;
    scale = 1 + 0.15 * k;
    leftPct = 55;
    topPct = 92;
  }
  return { leftPct, topPct, opacity, scale, clipR };
}

function Page3XRay({
  labStyle,
  pagePadTop = 44,
  compact = false,
}: {
  labStyle?: object;
  pagePadTop?: number;
  compact?: boolean;
}): React.JSX.Element {
  const insetsMode = useStore(s => s.insetsMode);
  const isZero = insetsMode === 'zero';
  const [boxSize, setBoxSize] = useState({ w: 276, h: 268 });
  const [lit, setLit] = useState({
    y1: isZero,
    y2: isZero,
    y3: isZero,
    strip: isZero,
  });

  const y1Anim = useReveal(true, isZero, 1300, 400, EASE_POP);
  const y2Anim = useReveal(true, isZero, 2000, 400, EASE_POP);
  const y3Anim = useReveal(true, isZero, 2600, 400, EASE_POP);
  const lensProgress = useReveal(true, isZero, 500, 3400, EASE_XRAY);
  const stripAnim = useReveal(true, isZero, 3600, 700, EASE_SOFT);

  useEffect(() => {
    if (isZero) {
      setLit({ y1: true, y2: true, y3: true, strip: true });
      return;
    }
    setLit({ y1: false, y2: false, y3: false, strip: false });
    const t1 = setTimeout(() => setLit(s => ({ ...s, y1: true })), 1300);
    const t2 = setTimeout(() => setLit(s => ({ ...s, y2: true })), 2100);
    const t3 = setTimeout(() => setLit(s => ({ ...s, y3: true })), 2800);
    const t4 = setTimeout(() => setLit(s => ({ ...s, strip: true })), 3400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [isZero]);

  const y1Style = useAnimatedStyle(() => {
    if (isZero) return { opacity: 1, transform: [{ scale: 1 }, { rotate: '-6deg' }] };
    return {
      opacity: y1Anim.value,
      transform: [{ scale: 0.6 + 0.4 * y1Anim.value }, { rotate: '-6deg' }],
    };
  });
  const y2Style = useAnimatedStyle(() => {
    if (isZero) return { opacity: 1, transform: [{ scale: 1 }, { rotate: '-6deg' }] };
    return {
      opacity: y2Anim.value,
      transform: [{ scale: 0.6 + 0.4 * y2Anim.value }, { rotate: '-6deg' }],
    };
  });
  const y3Style = useAnimatedStyle(() => {
    if (isZero) return { opacity: 1, transform: [{ scale: 1 }, { rotate: '-6deg' }] };
    return {
      opacity: y3Anim.value,
      transform: [{ scale: 0.6 + 0.4 * y3Anim.value }, { rotate: '-6deg' }],
    };
  });

  // Circular lens ring + handle (120x120)
  const lensRingStyle = useAnimatedStyle(() => {
    if (isZero || lensProgress.value <= 0 || lensProgress.value >= 1) {
      return { opacity: 0 };
    }
    const { leftPct, topPct, opacity, scale } = getLensPose(lensProgress.value);
    const cx = (leftPct / 100) * boxSize.w;
    const cy = (topPct / 100) * boxSize.h;
    return {
      left: cx - 60,
      top: cy - 60,
      opacity,
      transform: [{ scale }],
    };
  });

  // Moving circular aperture for the glowing X-Ray film overlay
  const filmMaskStyle = useAnimatedStyle(() => {
    if (isZero || lensProgress.value <= 0 || lensProgress.value >= 1) {
      return { opacity: 0, width: 0, height: 0 };
    }
    const { leftPct, topPct, opacity, clipR } = getLensPose(lensProgress.value);
    const cx = (leftPct / 100) * boxSize.w;
    const cy = (topPct / 100) * boxSize.h;
    const d = clipR * 2;
    return {
      left: cx - clipR,
      top: cy - clipR,
      width: d,
      height: d,
      borderRadius: clipR,
      opacity,
    };
  });

  // Counter-translate inner film passage so X-Ray text aligns pixel-perfect with paper beneath
  const filmInnerStyle = useAnimatedStyle(() => {
    if (isZero || lensProgress.value <= 0 || lensProgress.value >= 1) {
      return { transform: [{ translateX: 0 }, { translateY: 0 }] };
    }
    const { leftPct, topPct, clipR } = getLensPose(lensProgress.value);
    const cx = (leftPct / 100) * boxSize.w;
    const cy = (topPct / 100) * boxSize.h;
    return {
      transform: [{ translateX: -(cx - clipR) }, { translateY: -(cy - clipR) - 60 }],
    };
  });

  const stripStyle = useAnimatedStyle(() => {
    if (isZero) return { opacity: 1, transform: [{ translateY: 0 }, { rotate: '-1.5deg' }] };
    return {
      opacity: stripAnim.value,
      transform: [{ translateY: (1 - stripAnim.value) * 14 }, { rotate: '-1.5deg' }],
    };
  });

  const sprockets = useMemo(() => Array.from({ length: 22 }, (_, i) => i), []);

  return (
    <View style={[styles.ppContainer, pagePadTop !== 44 && { paddingTop: pagePadTop }]}>
      <PageRh />

      <Txt style={styles.tbH}>X-Ray Reading</Txt>
      <Txt style={styles.tb}>
        Hold any page to the light —{' '}
        <MarkSpan isZero={isZero} delay={300}>
          see exactly what UPSC has asked
        </MarkSpan>
        .
      </Txt>

      <View
        style={[styles.bxWrap, compact && styles.bxWrapCompact]}
        onLayout={e => {
          const { width, height } = e.nativeEvent.layout;
          if (width > 0 && height > 0 && (Math.abs(width - boxSize.w) > 1 || Math.abs(height - boxSize.h) > 1)) {
            setBoxSize({ w: width, h: height });
          }
        }}
      >
        <View style={styles.bxTxWrap}>
          <XRayPassage bq1On={lit.y1} bq2On={lit.y2} bq3On={lit.y3} bk2On={lit.strip} />
        </View>

        {/* Circular dark navy X-Ray film lens cutout (live mode only) */}
        {!isZero && (
          <Animated.View style={[styles.bxFilmAperture, filmMaskStyle]} pointerEvents="none">
            <Animated.View
              style={[
                styles.bxFilmLayer,
                { width: boxSize.w, height: boxSize.h + 120 },
                filmInnerStyle,
              ]}
            >
              <View style={[styles.bxTxWrap, styles.bxFilmTxOffset]}>
                <XRayPassage film />
              </View>
            </Animated.View>
          </Animated.View>
        )}

        {/* Magnifying ring frame + glint + 45deg handle */}
        {!isZero && (
          <Animated.View style={[styles.bxRing, lensRingStyle]} pointerEvents="none">
            <View style={styles.bxGlint} />
            <View style={styles.bxHandle} />
          </Animated.View>
        )}

        {/* Margin PYQ stamps */}
        <Animated.View style={[styles.bxY, styles.bxY1, y1Style]}>
          <Txt style={styles.bxYTxt}>PYQ ’19</Txt>
        </Animated.View>
        <Animated.View style={[styles.bxY, styles.bxY2, y2Style]}>
          <Txt style={styles.bxYTxt}>PYQ ’23</Txt>
        </Animated.View>
        <Animated.View style={[styles.bxY, styles.bxY3, y3Style]}>
          <Txt style={styles.bxYTxt}>PYQ ’21</Txt>
        </Animated.View>
      </View>

      {/* Film negative result strip with perforated sprocket dots */}
      <Animated.View style={[styles.bxStrip, compact && styles.bxStripCompact, stripStyle]}>
        <View style={styles.bxSprocketRowTop} pointerEvents="none">
          {sprockets.map(i => (
            <View key={i} style={styles.bxSprocketDot} />
          ))}
        </View>
        <View style={styles.bxSprocketRowBottom} pointerEvents="none">
          {sprockets.map(i => (
            <View key={i} style={styles.bxSprocketDot} />
          ))}
        </View>

        <View style={styles.bsFr}>
          <Txt style={styles.bsFrYear}>’19</Txt>
          <Txt style={styles.bsFrSub}>Prelims · Art. 32</Txt>
        </View>
        <View style={styles.bsFr}>
          <Txt style={styles.bsFrYear}>’23</Txt>
          <Txt style={styles.bsFrSub}>Mains · GS II</Txt>
        </View>
        <View style={styles.bsFr}>
          <Txt style={styles.bsFrYear}>’21</Txt>
          <Txt style={styles.bsFrSub}>Basic structure</Txt>
        </View>
        <View style={[styles.bsFr, styles.bsFrLit]}>
          <Txt style={styles.bsFrLitNum}>5</Txt>
          <Txt style={styles.bsFrLitSub}>lines lit</Txt>
        </View>
      </Animated.View>

      <PageLab num="03" title="X-Ray Reading" labStyle={labStyle} />
    </View>
  );
}

// ---------------------------------------------------------------- Page 4: Cloud Upload
function Page4Cloud({
  labStyle,
  pagePadTop = 44,
}: {
  labStyle?: object;
  pagePadTop?: number;
}): React.JSX.Element {
  const insetsMode = useStore(s => s.insetsMode);
  const isZero = insetsMode === 'zero';

  const cloudStrokeAnim = useReveal(true, isZero, 400, 1600, Easing.ease);
  const cloudDashAnim = useReveal(true, isZero, 1800, 600, Easing.ease);
  const f1Anim = useReveal(true, isZero, 1900, 700, EASE_SOFT);
  const f2Anim = useReveal(true, isZero, 2050, 700, EASE_SOFT);
  const f3Anim = useReveal(true, isZero, 2200, 700, EASE_SOFT);
  const upCardAnim = useReveal(true, isZero, 2400, 600, EASE_SOFT);
  const upBarAnim = useReveal(true, isZero, 2800, 1400, EASE_OUT_VAR);
  const indexedAnim = useReveal(true, isZero, 4100, 400, Easing.ease);

  const cloudArcProps = useAnimatedProps(() => {
    const p = isZero ? 1 : Math.min(1, cloudStrokeAnim.value / 0.72);
    return { strokeDashoffset: CLOUD_ARC_LEN * (1 - p) };
  });
  const arrowStemProps = useAnimatedProps(() => {
    const p = isZero ? 1 : Math.max(0, Math.min(1, (cloudStrokeAnim.value - 0.55) / 0.25));
    return { strokeDashoffset: ARROW_STEM_LEN * (1 - p) };
  });
  const arrowHeadProps = useAnimatedProps(() => {
    const p = isZero ? 1 : Math.max(0, Math.min(1, (cloudStrokeAnim.value - 0.78) / 0.22));
    return { strokeDashoffset: ARROW_HEAD_LEN * (1 - p) };
  });
  const cloudDashProps = useAnimatedProps(() => ({
    opacity: isZero ? 0.6 : 0.6 * cloudDashAnim.value,
  }));

  const f1Style = useAnimatedStyle(() => {
    if (isZero) return { opacity: 1, transform: [{ translateY: 0 }, { rotate: '-4deg' }] };
    return {
      opacity: f1Anim.value,
      transform: [{ translateY: (1 - f1Anim.value) * 16 }, { rotate: '-4deg' }],
    };
  });
  const f2Style = useAnimatedStyle(() => {
    if (isZero) return { opacity: 1, transform: [{ translateY: 0 }] };
    return {
      opacity: f2Anim.value,
      transform: [{ translateY: (1 - f2Anim.value) * 16 }],
    };
  });
  const f3Style = useAnimatedStyle(() => {
    if (isZero) return { opacity: 1, transform: [{ translateY: 0 }, { rotate: '4deg' }] };
    return {
      opacity: f3Anim.value,
      transform: [{ translateY: (1 - f3Anim.value) * 16 }, { rotate: '4deg' }],
    };
  });
  const upCardStyle = useAnimatedStyle(() => {
    if (isZero) return { opacity: 1, transform: [{ translateY: 0 }] };
    return {
      opacity: upCardAnim.value,
      transform: [{ translateY: (1 - upCardAnim.value) * 14 }],
    };
  });
  const upBarStyle = useAnimatedStyle(() => ({
    width: isZero ? '100%' : `${Math.round(upBarAnim.value * 100)}%`,
  }));
  const indexedStyle = useAnimatedStyle(() => (isZero ? { opacity: 1 } : { opacity: indexedAnim.value }));

  return (
    <View style={[styles.ppContainer, pagePadTop !== 44 && { paddingTop: pagePadTop }]}>
      <PageRh />

      <Txt style={styles.tbH}>Cloud Upload</Txt>
      <Txt style={styles.tb}>
        Upload once —{' '}
        <MarkSpan isZero={isZero} delay={300}>
          read, search and X-Ray it anywhere
        </MarkSpan>
        .
      </Txt>

      {/* Cloud stroke draw graphic (276 x 138 unscaled -> 326.23 x 163.12 at 1.182x) */}
      <View style={styles.bfCloudBox}>
        <Svg width={276} height={138} viewBox="0 0 300 150" fill="none">
          <APath
            d="M96 118H74a32 32 0 0 1-3-63.8A46 46 0 0 1 160 40a38 38 0 0 1 40 34 24 24 0 0 1 4 44h-24"
            stroke="#1D3B8A"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={`${CLOUD_ARC_LEN}`}
            animatedProps={cloudArcProps}
          />
          <APath
            d="M140 132V78"
            stroke="#1D3B8A"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={`${ARROW_STEM_LEN}`}
            animatedProps={arrowStemProps}
          />
          <APath
            d="M122 96l18-18 18 18"
            stroke="#1D3B8A"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={`${ARROW_HEAD_LEN}`}
            animatedProps={arrowHeadProps}
          />
          <APath
            d="M30 140c20-6 40-14 66-34"
            stroke="#1D3B8A"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="4,6"
            animatedProps={cloudDashProps}
          />
          <APath
            d="M270 140c-20-6-44-12-70-30"
            stroke="#1D3B8A"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="4,6"
            animatedProps={cloudDashProps}
          />
        </Svg>
      </View>

      {/* File badges row */}
      <View style={styles.bfFiles}>
        <Animated.View style={[styles.bfFileBadge, f1Style]}>
          <View style={[styles.bfFileType, styles.fileBgPdf]}>
            <Txt style={styles.bfFileTypeTxt}>PDF</Txt>
          </View>
          <Txt style={styles.bfFileName}>Laxmikanth</Txt>
        </Animated.View>
        <Animated.View style={[styles.bfFileBadge, f2Style]}>
          <View style={[styles.bfFileType, styles.fileBgJpg]}>
            <Txt style={styles.bfFileTypeTxt}>JPG</Txt>
          </View>
          <Txt style={styles.bfFileName}>Answer scan</Txt>
        </Animated.View>
        <Animated.View style={[styles.bfFileBadge, f3Style]}>
          <View style={[styles.bfFileType, styles.fileBgDoc]}>
            <Txt style={styles.bfFileTypeTxt}>DOC</Txt>
          </View>
          <Txt style={styles.bfFileName}>Notes</Txt>
        </Animated.View>
      </View>

      {/* Progress card */}
      <Animated.View style={[styles.bfUp, upCardStyle]}>
        <View style={styles.buT}>
          <Txt style={styles.buTHead} numberOfLines={1} ellipsizeMode="tail">
            Economic Survey 2025-26.pdf
          </Txt>
          <Animated.View style={indexedStyle}>
            <Txt style={styles.buTHw}>indexed for AI ✓</Txt>
          </Animated.View>
        </View>
        <View style={styles.buB}>
          <Animated.View style={[styles.buBFill, upBarStyle]} />
        </View>
        <View style={styles.buS}>
          <Txt style={styles.buSTxt}>web · app · anywhere</Txt>
          <Txt style={styles.buSTxt}>27 MB of 512 MB</Txt>
        </View>
      </Animated.View>

      <PageLab num="04" title="Cloud Upload" labStyle={labStyle} />
    </View>
  );
}

// ---------------------------------------------------------------- Render helper for leaf pages
function PageByStep({
  step,
  active,
  labStyle,
  pagePadTop,
  compactPage3,
}: {
  step: number;
  active: boolean;
  labStyle?: object;
  pagePadTop?: number;
  compactPage3?: boolean;
}): React.JSX.Element {
  if (step <= 1) return <Page1Notes active={active} labStyle={labStyle} pagePadTop={pagePadTop} />;
  if (step === 2) return <Page2Tracker labStyle={labStyle} pagePadTop={pagePadTop} />;
  if (step === 3) return <Page3XRay labStyle={labStyle} pagePadTop={pagePadTop} compact={compactPage3} />;
  return <Page4Cloud labStyle={labStyle} pagePadTop={pagePadTop} />;
}

// ---------------------------------------------------------------- Front Cover & Title Inside (Step 0)
function FrontCover(): React.JSX.Element {
  return (
    <View style={styles.coverWrap}>
      {/* Rich navy cover base + spine bevel + sheen (HTML L118, native Fabric gradients avoid scaled SVG clip) */}
      <View style={[StyleSheet.absoluteFill, styles.coverGradBase]} pointerEvents="none" />
      <View style={[StyleSheet.absoluteFill, styles.coverGradCrease]} pointerEvents="none" />
      <View style={[StyleSheet.absoluteFill, styles.coverGradSheen]} pointerEvents="none" />

      <View style={styles.cTop}>
        <View style={styles.cLogoWrap}>
          <Logo size={22} />
        </View>
        <Txt style={styles.cTopTxt}>CIVIL SERVICES EXAMINATION</Txt>
      </View>

      <Txt style={styles.cUpsc}>UPSC</Txt>
      <Txt style={styles.cYear}>2027</Txt>

      <View style={styles.cBand}>
        <Txt style={styles.cBandTxt}>PRELIMS · MAINS · INTERVIEW</Txt>
      </View>

      <View style={styles.cSvc}>
        <Txt style={styles.cSvcTxt}>IAS</Txt>
        <Txt style={styles.cSvcTxt}>IPS</Txt>
        <Txt style={styles.cSvcTxt}>IFS</Txt>
        <Txt style={styles.cSvcTxt}>IRS</Txt>
      </View>

      <View style={styles.cPub}>
        <Txt style={styles.cPubSub}>PREPASSIST</Txt>
        <Txt style={styles.cPubSub}>COMPLETE GUIDE</Txt>
      </View>
    </View>
  );
}

/** Inside of the front cover, revealed past -90deg during the cover swing (tpTitlePg L4855). */
function InsideTitlePage(): React.JSX.Element {
  return (
    <View style={styles.ownPage}>
      <Txt style={styles.ownK}>THIS BOOK BELONGS TO</Txt>
      <View style={styles.ownLine}>
        <Txt style={styles.ownHw}>Divya Sharma</Txt>
      </View>
      <Txt style={styles.ownK}>TARGET</Txt>
      <View style={styles.ownLine}>
        <Txt style={styles.ownHw}>IAS · CSE 2027</Txt>
      </View>
      <View style={styles.ownRow}>
        <View style={styles.ownCol}>
          <Txt style={styles.ownK}>ATTEMPT</Txt>
          <View style={styles.ownLine}>
            <Txt style={styles.ownHw}>1st</Txt>
          </View>
        </View>
        <View style={styles.ownCol}>
          <Txt style={styles.ownK}>OPTIONAL</Txt>
          <View style={styles.ownLine}>
            <Txt style={styles.ownHw}>Sociology</Txt>
          </View>
        </View>
      </View>
      <Txt style={styles.ownMotto}>“Same effort,{'\n'}bigger tomorrows.”</Txt>
    </View>
  );
}

/** Soft native blurred shadow behind closed book (replaces CSS filter: blur(28px)). */
function SoftBookShadow(): React.JSX.Element {
  return <View style={styles.dshadowWrap} pointerEvents="none" />;
}

// ---------------------------------------------------------------- Main BookStage Screen
function BookStage(): React.JSX.Element {
  const insets = useInsets();
  const appSize = useAppSize();
  const bkStep = useStore(s => s.bkStep);
  const bk = useStore(s => s.bk);
  const insetsMode = useStore(s => s.insetsMode);
  const sfxOn = useStore(s => s.SFX.on);
  const isZero = insetsMode === 'zero';
  const isClosed = bkStep === 0;

  // In live device mode open pages fill the entire edge-to-edge screen (no right/bottom gap).
  // In insets/zero test mode keep fixed 1.182 * VP_S geometry to match the Chromium reference capture.
  const fullW = appSize.w > 0 ? appSize.w : FULL_W;
  const fullH = appSize.h > 0 ? appSize.h : FULL_H;
  const liveFinalS = fullW / PG_W;
  const liveFinalH = fullH / liveFinalS;
  const liveFinal = { gx: 0, gy: fullH / 2, rx: 0, s: liveFinalS, h: liveFinalH };

  // Device status-bar clearance only when real insets are active; 44 aligns y=46.12 in zero-insets
  const ctlBottom = isZero ? 52 : Math.max(52, insets.sab + 32);
  const autoBottom = isZero ? 42 : Math.max(42, insets.sab + 22);
  const pagePadTop = isZero ? 44 : Math.round(Math.max(44, (insets.sat + 10) / liveFinalS));
  const ppLabEnd = isZero ? 124 : Math.max(108, Math.round((ctlBottom + 44 + 26) / liveFinalS));
  const compactPage3 = !isZero && liveFinalH - pagePadTop - ppLabEnd < 560;

  // Track active cover swing & page-turn leaf animation state
  const [coverVisible, setCoverVisible] = useState(isClosed);
  const [coverFlipped, setCoverFlipped] = useState(false);
  const [leafState, setLeafState] = useState<{ fromStep: number } | null>(null);
  const [leafFlipped, setLeafFlipped] = useState(false);
  const [ctlReady, setCtlReady] = useState(!isClosed);
  const [on1Active, setOn1Active] = useState(!isClosed);

  const prevStepRef = useRef(bkStep);
  const openingRef = useRef(false);
  const openTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearOpenTimers = React.useCallback(() => {
    for (const id of openTimersRef.current) clearTimeout(id);
    openTimersRef.current = [];
  }, []);

  useEffect(() => clearOpenTimers, [clearOpenTimers]);

  // Shared animation values
  const stageOpacity = useSharedValue(isZero ? 1 : 0);
  const stageExit = useSharedValue(0);
  const floatAnim = useSharedValue(0);
  const beamAnim = useSharedValue(0);
  const dappleAnim = useSharedValue(0);

  const camProgress = useSharedValue(isClosed ? 0 : 1);
  const closeStyleProgress = useSharedValue(isClosed ? 0 : 1);
  const ppLabProgress = useSharedValue(isClosed ? 0 : 1);
  const coverSwing = useSharedValue(isClosed ? 0 : 1);
  const pageTurn = useSharedValue(0);
  const ctlShow = useSharedValue(!isClosed ? 1 : 0);
  const autoProgress = useSharedValue(isZero && bkStep >= 1 && bkStep < 4 ? 1 : 0);

  // Fade in stage on mount + gentle ambient loops
  useEffect(() => {
    if (isZero) {
      stageOpacity.value = 1;
      return;
    }
    stageOpacity.value = 0;
    stageOpacity.value = withTiming(1, { duration: 500, easing: EASE_OUT_VAR });

    floatAnim.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 3500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
    beamAnim.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 5500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 5500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
    dappleAnim.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 7500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 7500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, [isZero, stageOpacity, floatAnim, beamAnim, dappleAnim]);

  // Exit fade + slight zoom out (L220: .stage.exit { opacity: 0; transform: scale(1.04) })
  useEffect(() => {
    if (isZero || !bk.exit) {
      stageExit.value = 0;
      return;
    }
    stageExit.value = withTiming(1, { duration: 520, easing: EASE_OUT_VAR });
  }, [bk.exit, isZero, stageExit]);

  // Interactive book opening (cover swings 0->1500ms, camera glides 0->2000ms, .close & on1 at 700ms)
  const triggerInteractiveOpen = React.useCallback(() => {
    if (openingRef.current || bkStep !== 0) return;
    if (isZero) {
      openBook();
      return;
    }
    openingRef.current = true;
    setCoverVisible(true);
    setCoverFlipped(false);
    setOn1Active(false);
    setCtlReady(false);

    // Mount Page 1 immediately beneath cover board (L5812)
    openBook();

    coverSwing.value = 0;
    coverSwing.value = withTiming(1, { duration: 1500, easing: EASE_IO }, finished => {
      if (finished) {
        runOnJS(setCoverVisible)(false);
      }
    });

    camProgress.value = 0;
    camProgress.value = withTiming(1, { duration: 2000, easing: EASE_CAM }, finished => {
      if (finished) {
        runOnJS(setCtlReady)(true);
      }
    });

    closeStyleProgress.value = withDelay(700, withTiming(1, { duration: 900, easing: EASE_CAM }));
    ppLabProgress.value = withDelay(700, withTiming(1, { duration: 1600, easing: EASE_CAM }));
    ctlShow.value = withDelay(2000, withTiming(1, { duration: 500, easing: EASE_OUT_VAR }));

    // Flip cover face from FrontCover to TitlePage right as EASE_IO crosses -90deg (~510ms of 1500ms)
    clearOpenTimers();
    const flipTimer = setTimeout(() => {
      if (useStore.getState().insetsMode !== 'zero' && useStore.getState().bkStep >= 1) {
        setCoverFlipped(true);
      }
    }, 510);
    const revealTimer = setTimeout(() => {
      if (useStore.getState().insetsMode !== 'zero' && useStore.getState().bkStep >= 1) {
        setOn1Active(true);
      }
    }, 700);
    openTimersRef.current = [flipTimer, revealTimer];
  }, [bkStep, isZero, coverSwing, camProgress, closeStyleProgress, ppLabProgress, ctlShow, clearOpenTimers]);

  // Synchronize transitions when store bkStep changes (deep links, replay, turnPage)
  useEffect(() => {
    const prev = prevStepRef.current;
    prevStepRef.current = bkStep;

    if (isZero) {
      clearOpenTimers();
      openingRef.current = false;
      setCoverVisible(bkStep === 0);
      setCoverFlipped(false);
      setLeafState(null);
      setOn1Active(bkStep >= 1);
      setCtlReady(bkStep >= 1);
      camProgress.value = bkStep >= 1 ? 1 : 0;
      closeStyleProgress.value = bkStep >= 1 ? 1 : 0;
      ppLabProgress.value = bkStep >= 1 ? 1 : 0;
      coverSwing.value = bkStep >= 1 ? 1 : 0;
      ctlShow.value = bkStep >= 1 ? 1 : 0;
      return;
    }

    if (bkStep === 0) {
      clearOpenTimers();
      openingRef.current = false;
      setCoverVisible(true);
      setCoverFlipped(false);
      setLeafState(null);
      setOn1Active(false);
      setCtlReady(false);
      camProgress.value = 0;
      closeStyleProgress.value = 0;
      ppLabProgress.value = 0;
      coverSwing.value = 0;
      ctlShow.value = 0;
      return;
    }

    // If switched straight to open state externally (e.g. jump or deep link), snap cam cleanly
    if (prev === 0 && !openingRef.current) {
      setCoverVisible(false);
      setOn1Active(true);
      setCtlReady(true);
      camProgress.value = 1;
      closeStyleProgress.value = 1;
      ppLabProgress.value = 1;
      ctlShow.value = 1;
      return;
    }

    // Smooth 3D leaf page-turn whenever advancing/retreating between open pages 1..4 (L5820-L5831)
    if (prev >= 1 && bkStep !== prev) {
      const forward = bkStep > prev;
      setLeafState({ fromStep: prev });
      setLeafFlipped(!forward);
      pageTurn.value = forward ? 0 : 1;
      pageTurn.value = withTiming(forward ? 1 : 0, { duration: 1100, easing: EASE_IO }, finished => {
        if (finished) {
          runOnJS(setLeafState)(null);
        }
      });
      const halfT = setTimeout(() => setLeafFlipped(forward), 375);
      return () => clearTimeout(halfT);
    }
  }, [bkStep, isZero, camProgress, closeStyleProgress, ppLabProgress, coverSwing, ctlShow, pageTurn, clearOpenTimers]);

  // Auto-open timer after 1400ms on closed book (L5793)
  useEffect(() => {
    if (isClosed && !isZero) {
      const t = setTimeout(() => {
        const st = useStore.getState();
        if (st.insetsMode === 'zero' || st.stage !== 'book' || st.bkStep !== 0) return;
        triggerInteractiveOpen();
      }, 1400);
      return () => clearTimeout(t);
    }
  }, [isClosed, isZero, triggerInteractiveOpen]);

  // Auto-advance progress bar along bottom edge (starts once cam/turn lands -> fills in 3000ms / 3500ms on p3)
  useEffect(() => {
    if (isZero) {
      autoProgress.value = bkStep >= 1 && bkStep < 4 ? 1 : 0;
      return;
    }
    if (bkStep >= 1 && bkStep < 4) {
      const startDelay = bkStep === 1 && openingRef.current ? 2000 : 1100;
      const fillDur = bkStep === 3 ? 3500 : 3000;
      autoProgress.value = 0;
      autoProgress.value = withDelay(startDelay, withTiming(1, { duration: fillDur, easing: Easing.linear }));
    } else {
      autoProgress.value = 0;
    }
  }, [bkStep, bk.auto, isZero, autoProgress]);

  // PanResponder for interactive tap / horizontal page swipe (L5842-L5869)
  const dragRef = useRef<{ moved: boolean; stepAtDown: number } | null>(null);
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 6,
      onPanResponderGrant: () => {
        const s = useStore.getState();
        dragRef.current = { moved: false, stepAtDown: s.bkStep };
      },
      onPanResponderMove: (_, g) => {
        if (Math.abs(g.dx) > 8 && dragRef.current) {
          dragRef.current.moved = true;
        }
      },
      onPanResponderRelease: (_, g) => {
        const curStep = useStore.getState().bkStep;
        if (curStep === 0) {
          triggerInteractiveOpen();
          return;
        }
        if (g.dx < -35) {
          bookNext();
        } else if (g.dx > 45 && curStep > 1) {
          bookPrev();
        } else if (!dragRef.current?.moved) {
          bookNext();
        }
      },
    }),
  ).current;

  // ---------------- Animated Styles
  const rootStageStyle = useAnimatedStyle(() => {
    if (isZero) return { opacity: 1, transform: [{ scale: 1 }] };
    return {
      opacity: stageOpacity.value * (1 - stageExit.value),
      transform: [{ scale: 1 + 0.04 * stageExit.value }],
    };
  });

  const sceneFloatStyle = useAnimatedStyle(() => {
    if (isZero || !isClosed) return { transform: [{ translateY: 0 }] };
    return {
      transform: [{ translateY: -6 * floatAnim.value }],
    };
  });

  const beamStyle = useAnimatedStyle(() => ({
    opacity: isZero ? 0.35 : 0.28 + 0.14 * beamAnim.value,
    transform: isZero
      ? [{ translateX: 0 }, { rotate: '0deg' }]
      : [{ translateX: -14 + 32 * beamAnim.value }, { rotate: `${-1 + 2.5 * beamAnim.value}deg` }],
  }));

  const dappleStyle = useAnimatedStyle(() => ({
    opacity: isZero ? 0.08 : 0.06 + 0.04 * dappleAnim.value,
    transform: isZero ? [{ translateY: 0 }] : [{ translateY: -4 + 8 * dappleAnim.value }],
  }));

  const autobarStyle = useAnimatedStyle(() => ({
    width: `${Math.round(autoProgress.value * 100)}%`,
  }));

  // Camera transform: ALWAYS outputs full explicit transform matrix so Reanimated never keeps stale rotateX/scale!
  const bookContainerStyle = useAnimatedStyle(() => {
    const p = isZero ? (isClosed ? 0 : 1) : camProgress.value;
    const target = isZero ? CAM_FINAL : liveFinal;
    const gx = interpolate(p, [0, 1], [CAM_CLOSED.gx, target.gx]);
    const gy = interpolate(p, [0, 1], [CAM_CLOSED.gy, target.gy]);
    const rx = interpolate(p, [0, 1], [CAM_CLOSED.rx, target.rx]);
    const s = interpolate(p, [0, 1], [CAM_CLOSED.s, target.s]);
    const h = interpolate(p, [0, 1], [CAM_CLOSED.h, target.h]);
    return {
      position: 'absolute',
      left: gx,
      top: gy - h / 2,
      width: PG_W,
      height: h,
      transformOrigin: '0% 50%',
      transform: [{ perspective: 1500 }, { rotateX: `${rx}deg` }, { scale: s }],
    };
  });

  // Closed desk props fade out at 700ms into open (L612)
  const deskChromeStyle = useAnimatedStyle(() => {
    if (isZero) return { opacity: isClosed ? 1 : 0 };
    return { opacity: 1 - closeStyleProgress.value };
  });

  // Top Skip & Sound buttons fade out as book opens (L350)
  const topBtnFadeStyle = useAnimatedStyle(() => {
    if (isZero) return { opacity: isClosed ? 1 : 0 };
    return { opacity: isClosed ? 1 : Math.max(0, 1 - closeStyleProgress.value * 2) };
  });

  // Page bottom label animates from bottom: 24 -> bottom: ppLabEnd (L450, L491, L620)
  const ppLabAnimStyle = useAnimatedStyle(() => {
    const p = isZero ? (isClosed ? 0 : 1) : ppLabProgress.value;
    return {
      bottom: interpolate(p, [0, 1], [24, ppLabEnd]),
    };
  });

  // Bottom ctl fades & slides up once camera finishes (L295-L296)
  const ctlAnimStyle = useAnimatedStyle(() => {
    if (isZero) {
      return {
        opacity: isClosed ? 0 : 1,
        transform: [{ translateY: isClosed ? 8 : 0 }],
      };
    }
    return {
      opacity: ctlShow.value,
      transform: [{ translateY: (1 - ctlShow.value) * 8 }],
    };
  });

  // 3D cover swing leaf (-180deg around left spine) + under-page shadow (#shR)
  const coverLeafStyle = useAnimatedStyle(() => {
    const p = isZero ? (isClosed ? 0 : 1) : coverSwing.value;
    const deg = -180 * p;
    return {
      transformOrigin: '0% 50%',
      transform: [{ perspective: 1500 }, { rotateY: `${deg}deg` }],
    };
  });

  const rightPageShadeStyle = useAnimatedStyle(() => {
    if (isZero) return { opacity: 0 };
    if (leafState) {
      return { opacity: Math.sin(Math.PI * pageTurn.value) * 0.3 };
    }
    return { opacity: 0.5 * (1 - coverSwing.value) };
  });

  // Turning page curl leaf (-180deg around left spine) + dynamic highlight/crease shadow
  const pageLeafStyle = useAnimatedStyle(() => {
    const deg = -180 * pageTurn.value;
    const slightCurl = Math.sin(Math.PI * pageTurn.value) * 3;
    return {
      transformOrigin: '0% 50%',
      transform: [
        { perspective: 1500 },
        { rotateY: `${deg}deg` },
        { skewY: `${slightCurl}deg` },
      ],
    };
  });

  const pageLeafShadowStyle = useAnimatedStyle(() => ({
    opacity: Math.sin(Math.PI * pageTurn.value) * 0.32,
  }));

  const pageLeafHighlightStyle = useAnimatedStyle(() => {
    const p = pageTurn.value;
    const band = p < 0.5 ? Math.sin((p / 0.5) * Math.PI) * 0.38 : 0;
    return { opacity: band };
  });

  const showDeskChrome = isClosed || !isZero;
  const ctlSideStyle = useMemo(
    () =>
      isZero
        ? undefined
        : {
          left: Math.round(32 * liveFinalS),
          right: Math.round(22 * liveFinalS),
        },
    [isZero, liveFinalS],
  );
  const showAutoBar = bkStep >= 1 && bkStep < 4 && (isZero || ctlReady);

  return (
    <Animated.View style={[styles.root, rootStageStyle]}>
      {/* 1. Bluish-white Radial Desk + Subtle Vignette */}
      <DeskBg />

      {/* 2. Subtle Sunbeam + Dapple + Drifting Dust Motes */}
      <Animated.View style={[styles.beam, beamStyle]} pointerEvents="none">
        <Svg width="140%" height="140%" viewBox="0 0 400 600" style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id="beamGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#FFF2D6" stopOpacity={0} />
              <Stop offset="50%" stopColor="#FFF2D6" stopOpacity={0.22} />
              <Stop offset="100%" stopColor="#FFF2D6" stopOpacity={0} />
            </LinearGradient>
          </Defs>
          <G transform="rotate(-26 200 300)">
            <Rect x={-50} y={40} width={500} height={150} fill="url(#beamGrad)" />
            <Rect x={-50} y={230} width={500} height={100} fill="url(#beamGrad)" />
          </G>
        </Svg>
      </Animated.View>

      <Animated.View style={[styles.dapple, dappleStyle]} pointerEvents="none">
        <Svg width="100%" height="100%">
          <Circle cx="20%" cy="20%" r="55" fill="#3A2A12" opacity={0.14} />
          <Circle cx="80%" cy="30%" r="70" fill="#3A2A12" opacity={0.12} />
          <Circle cx="35%" cy="75%" r="60" fill="#3A2A12" opacity={0.15} />
          <Circle cx="75%" cy="85%" r="50" fill="#3A2A12" opacity={0.12} />
        </Svg>
      </Animated.View>

      {!isZero && <DustField />}

      {/* 3. Top Controls (Sound & Skip on Closed Book, fade on open: L287-L288, L350) */}
      {(isClosed || !isZero) && (
        <Animated.View
          style={[styles.topBar, { top: insets.sat + 2 }, topBtnFadeStyle]}
          pointerEvents={isClosed ? 'auto' : 'none'}
        >
          <Pressable
            style={styles.sndBtn}
            onPress={() => act('sound')}
            accessibilityLabel="Sound on"
            testID="book.sound"
          >
            <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
              <Path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4Z" fill="#3A3428" />
              <Path
                d="M15.5 9a4.5 4.5 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11"
                stroke="#3A3428"
                strokeWidth={1.8}
                strokeLinecap="round"
                opacity={sfxOn ? 1 : 0.15}
              />
            </Svg>
          </Pressable>

          <Pressable
            style={styles.skipBtn}
            onPress={() => act('bookExit:skip')}
            accessibilityLabel="Skip intro"
            testID="book.skip"
          >
            <Txt style={styles.skipTxt}>Skip</Txt>
          </Pressable>
        </Animated.View>
      )}

      {/* 4. Floating Scene + Camera-driven 3D Book Container (.scene > #b3) */}
      <Animated.View style={[StyleSheet.absoluteFill, sceneFloatStyle]} pointerEvents="box-none">
        <Animated.View style={bookContainerStyle}>
          {/* Soft drop shadow beneath closed book (fades out on .close) */}
          {showDeskChrome && (
            <Animated.View style={[styles.dshadowPos, deskChromeStyle]} pointerEvents="none">
              <SoftBookShadow />
            </Animated.View>
          )}

          {/* Back binding board protruding behind right cover (fades on .close) */}
          {showDeskChrome && (
            <Animated.View style={[styles.bdBoardR, deskChromeStyle]} pointerEvents="none" />
          )}

          {/* Page stack thickness along right & bottom edges (closed book, fades on .close) */}
          {showDeskChrome && (
            <Animated.View style={[styles.edgeRight, deskChromeStyle]} pointerEvents="none" />
          )}
          {showDeskChrome && (
            <Animated.View style={[styles.edgeBottom, deskChromeStyle]} pointerEvents="none" />
          )}

          {/* Main page block (.pgx.r) */}
          <View
            style={[
              styles.pgxRight,
              isClosed ? styles.pgxClosedRadius : styles.pgxOpenRadius,
            ]}
            {...(!isClosed ? panResponder.panHandlers : {})}
          >
            {bkStep >= 1 && (
              <Pressable
                style={StyleSheet.absoluteFill}
                onPress={bookNext}
                testID="book.page"
              >
                <PageByStep
                  step={bkStep}
                  active={bkStep === 1 ? on1Active : true}
                  labStyle={ppLabAnimStyle}
                  pagePadTop={pagePadTop}
                  compactPage3={compactPage3}
                />
              </Pressable>
            )}

            {/* Top/bottom subtle paper vignette on open page (#pgRight.pgx.r) */}
            {bkStep >= 1 && <View style={styles.paperVShade} pointerEvents="none" />}

            {/* Spine gutter shadow on left edge of open page (L615) */}
            {bkStep >= 1 && <View style={styles.spineGutter} pointerEvents="none" />}

            {/* Right edge subtle page-curl shading (#pgx.r::after) */}
            {bkStep >= 1 && <View style={styles.rightEdgeShade} pointerEvents="none" />}

            {/* Dynamic shadow cast by turning leaf or opening cover (#shR) */}
            {!isZero && (coverVisible || leafState) && (
              <Animated.View style={[styles.rightShadeOverlay, rightPageShadeStyle]} pointerEvents="none" />
            )}
          </View>

          {/* 3D Turning Page Leaf overlay when stepping between pages 1..4 */}
          {!isZero && leafState && (
            <Animated.View style={[styles.turningLeaf, pageLeafStyle]} pointerEvents="none">
              {!leafFlipped ? (
                <View style={styles.leafFront}>
                  <PageByStep
                    step={leafState.fromStep}
                    active
                    labStyle={ppLabAnimStyle}
                    pagePadTop={pagePadTop}
                    compactPage3={compactPage3}
                  />
                  <Animated.View style={[styles.leafHighlight, pageLeafHighlightStyle]} />
                  <Animated.View style={[styles.leafShadow, pageLeafShadowStyle]} />
                </View>
              ) : (
                <View style={styles.leafBack}>
                  <View style={styles.leafBackFlip}>
                    <View style={styles.backQuoteWrap}>
                      <Txt style={styles.backQuoteTxt}>
                        {leafState.fromStep <= 1
                          ? 'Every concept clarified.'
                          : leafState.fromStep === 2
                            ? 'Same effort,\nbigger tomorrows.'
                            : 'Read less,\nremember more.'}
                      </Txt>
                    </View>
                    <Animated.View style={[styles.leafShadow, pageLeafShadowStyle]} />
                  </View>
                </View>
              )}
            </Animated.View>
          )}

          {/* 3D Front Cover Board Leaf (swings open -180deg over 1500ms) */}
          {coverVisible && (
            <Animated.View style={[styles.coverLeaf, coverLeafStyle]}>
              {!coverFlipped ? (
                <Pressable
                  style={styles.coverFaceFront}
                  onPress={triggerInteractiveOpen}
                  testID="book.cover"
                >
                  <FrontCover />
                </Pressable>
              ) : (
                <View style={styles.coverFaceBack}>
                  <View style={styles.leafBackFlip}>
                    <InsideTitlePage />
                  </View>
                </View>
              )}
            </Animated.View>
          )}
        </Animated.View>
      </Animated.View>

      {/* 5. Bottom Navigation Controls (hidden when closed via opacity 0, matches #bkCtl L295, L616) */}
      <Animated.View
        style={[styles.ctlArea, { bottom: ctlBottom }, ctlSideStyle, ctlAnimStyle]}
        pointerEvents={isClosed ? 'none' : 'auto'}
      >
        <View style={styles.ctlRow}>
          <View style={styles.ctlMid}>
            {bkStep < 4 && (
              <View style={styles.ctlDots}>
                {[1, 2, 3, 4].map(s => (
                  <View key={s} style={[styles.dot, bkStep === s && styles.dotOn]} />
                ))}
              </View>
            )}

            {bkStep < 4 ? (
              <Pressable
                onPress={() => act('bookExit:skip')}
                style={styles.skLink}
                testID="book.ctl.skip"
              >
                <Txt style={styles.skLinkTxt}>Skip</Txt>
              </Pressable>
            ) : (
              <Pressable
                onPress={() => act('bookReplay')}
                style={styles.rpLink}
                testID="book.ctl.replay"
              >
                <Icon name="refresh" size={15} color="#8A8270" />
                <Txt style={styles.rpLinkTxt}>Replay</Txt>
              </Pressable>
            )}

            {bkStep >= 1 && bkStep < 4 && (
              <Pressable
                onPress={() => act('sound')}
                style={styles.snd2Btn}
                accessibilityLabel="Toggle sound"
                testID="book.ctl.sound"
              >
                <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
                  <Path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4Z" fill="#8A8270" />
                  <Path
                    d="M15.5 9a4.5 4.5 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11"
                    stroke="#8A8270"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    opacity={sfxOn ? 1 : 0.15}
                  />
                </Svg>
              </Pressable>
            )}
          </View>

          <Pressable
            style={[styles.nextBtn, bkStep >= 4 && styles.nextBtnLast]}
            onPress={isClosed ? triggerInteractiveOpen : bkStep >= 4 ? () => act('bookExit') : bookNext}
            testID="book.next"
          >
            <Txt style={styles.nextBtnTxt}>
              {bkStep >= 4 ? 'Start preparing' : 'Next'}
            </Txt>
            <Icon name="arrow" size={18} color="#FFFFFF" />
          </Pressable>
        </View>
      </Animated.View>

      {/* 6. Auto-advance bar (bottom: 42px below ctl, L493, L617) */}
      {showAutoBar && (
        <View style={[styles.autobarWrap, { bottom: autoBottom }, ctlSideStyle]} pointerEvents="none">
          <Animated.View style={[styles.autobarFill, autobarStyle]} />
        </View>
      )}
    </Animated.View>
  );
}

export default BookStage;

// ---------------------------------------------------------------- Styles
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#EEF4FB',
    overflow: 'hidden',
  },
  deskBg: {
    backgroundImage: 'radial-gradient(120% 70% at 50% 30%, #FFFFFF 0%, #EEF4FB 45%, #DCEBF8 100%)',
  },
  deskVig: {
    backgroundImage: 'radial-gradient(120% 90% at 50% 45%, rgba(27, 70, 120, 0) 55%, rgba(27, 70, 120, 0.18) 100%)',
  },
  beam: {
    position: 'absolute',
    top: -60,
    left: -80,
    right: -80,
    bottom: -60,
  },
  dapple: {
    ...StyleSheet.absoluteFill,
  },
  topBar: {
    position: 'absolute',
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    zIndex: 40,
  },
  sndBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipBtn: {
    height: 30,
    paddingHorizontal: 12,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipTxt: {
    ...font('sans', 600),
    fontSize: 13.5,
    color: '#3A3428',
  },

  // ---------------- Closed book frame + boards + edges (#b3 children in 330x486..724 coords)
  dshadowPos: {
    position: 'absolute',
    left: -12,
    top: 10,
    right: -12,
    bottom: -10,
  },
  dshadowWrap: {
    ...StyleSheet.absoluteFill,
    borderRadius: 20,
    backgroundColor: 'rgba(20, 50, 90, 0.22)',
    boxShadow: '0px 8px 26px 10px rgba(20, 50, 90, 0.24)',
  },
  bdBoardR: {
    position: 'absolute',
    left: -3,
    top: -5,
    right: -6,
    bottom: -5,
    borderRadius: 12,
    backgroundColor: '#172B48',
    backgroundImage: 'linear-gradient(180deg, #22395C 0%, #172B48 50%, #11223A 100%)',
    overflow: 'hidden',
  },
  edgeRight: {
    position: 'absolute',
    right: -4,
    top: 2,
    bottom: 2,
    width: 4,
    backgroundColor: '#E8EDF5',
    borderRightWidth: 1,
    borderRightColor: '#D0D8E4',
  },
  edgeBottom: {
    position: 'absolute',
    left: 2,
    right: 2,
    bottom: -4,
    height: 4,
    backgroundColor: '#E8EDF5',
    borderBottomWidth: 1,
    borderBottomColor: '#D0D8E4',
  },
  pgxRight: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#FBFCFE',
    overflow: 'hidden',
  },
  pgxClosedRadius: {
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
    borderTopRightRadius: 9,
    borderBottomRightRadius: 9,
  },
  pgxOpenRadius: {
    borderRadius: 0,
  },
  paperVShade: {
    ...StyleSheet.absoluteFill,
    backgroundImage:
      'linear-gradient(180deg, rgba(27, 70, 120, 0.024) 0%, rgba(0, 0, 0, 0) 3%, rgba(0, 0, 0, 0) 97%, rgba(27, 70, 120, 0.03) 100%)',
  },
  spineGutter: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 28,
    backgroundImage: 'linear-gradient(90deg, rgba(20, 40, 70, 0.14) 0%, rgba(20, 40, 70, 0) 100%)',
  },
  rightEdgeShade: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 40,
    backgroundImage: 'linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.035) 100%)',
  },
  rightShadeOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(10, 12, 20, 0.45)',
  },

  // ---------------- 3D leaves (Cover board & Turning page)
  coverLeaf: {
    ...StyleSheet.absoluteFill,
    zIndex: 20,
  },
  coverFaceFront: {
    ...StyleSheet.absoluteFill,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    overflow: 'hidden',
  },
  coverFaceBack: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#EEF3F9',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    overflow: 'hidden',
  },
  turningLeaf: {
    ...StyleSheet.absoluteFill,
    zIndex: 18,
  },
  leafFront: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#FBFCFE',
    overflow: 'hidden',
  },
  leafBack: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#F7F9FC',
    overflow: 'hidden',
  },
  leafBackFlip: {
    ...StyleSheet.absoluteFill,
    transform: [{ scaleX: -1 }],
  },
  leafHighlight: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
  },
  leafShadow: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(10, 14, 24, 0.55)',
  },
  backQuoteWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  backQuoteTxt: {
    ...font('hand', 600),
    fontSize: 28,
    lineHeight: 34,
    color: '#B85F00',
    textAlign: 'center',
    transform: [{ rotate: '-4deg' }],
  },

  // ---------------- Inside Front Cover (Title page L4855)
  ownPage: {
    flex: 1,
    backgroundColor: '#EEF3F9',
    paddingTop: 58,
    paddingRight: 30,
    paddingBottom: 30,
    paddingLeft: 36,
  },
  ownK: {
    ...font('sans', 700),
    fontSize: 10.5,
    letterSpacing: 2.31,
    color: '#8A8270',
    marginTop: 18,
  },
  ownLine: {
    height: 36,
    borderBottomWidth: 1,
    borderBottomColor: '#CFC6B2',
    justifyContent: 'flex-end',
    paddingBottom: 2,
  },
  ownHw: {
    ...font('hand', 600),
    fontSize: 28,
    lineHeight: 28,
    color: '#1D3B8A',
  },
  ownRow: {
    flexDirection: 'row',
    gap: 20,
  },
  ownCol: {
    flex: 1,
  },
  ownMotto: {
    ...font('hand', 600),
    fontSize: 22,
    lineHeight: 26,
    color: '#B85F00',
    marginTop: 34,
    transform: [{ rotate: '-3deg' }],
  },

  // ---------------- Shared Open Page Surface (.pp in 330x724 coords, L449, L618)
  ppContainer: {
    flex: 1,
    paddingTop: 44,
    paddingRight: 22,
    paddingBottom: 0,
    paddingLeft: 32,
  },
  ppRh: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DDE4EC',
  },
  wmWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  wmText: {
    ...font('sans', 700),
    fontSize: 14.5,
    lineHeight: 21.025,
    letterSpacing: -0.145,
    color: '#14161C',
  },
  tbH: {
    ...font('book', 600),
    fontSize: 22,
    lineHeight: 25.3,
    color: '#14161C',
    marginTop: 22,
  },
  tb: {
    ...font('book', 400),
    fontSize: 14.5,
    lineHeight: 21.75,
    color: '#4A4E57',
    marginTop: 10,
    textAlign: 'justify',
  },
  tbP2: {
    ...font('book', 400),
    fontSize: 14.5,
    lineHeight: 21.75,
    color: '#4A4E57',
    marginTop: 10,
    paddingRight: 86,
    textAlign: 'justify',
  },
  tbMark: {
    ...font('book', 400),
    backgroundColor: 'rgba(255, 200, 60, 0.56)',
    color: '#4A4E57',
  },
  tbMarkOff: {
    ...font('book', 400),
    color: '#4A4E57',
  },
  ppLab: {
    position: 'absolute',
    left: 32,
    right: 22,
    bottom: 124,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#1F2128',
    paddingTop: 10,
  },
  ppLabNum: {
    ...font('book', 500),
    fontSize: 28,
    // iOS CoreText clips glyph ascenders when lineHeight < fontSize
    ...Platform.select({
      ios: { lineHeight: 30, marginTop: -5, marginBottom: -2 },
      default: { lineHeight: 22.4 },
    }),
    color: '#152843',
  },
  ppLabTitle: {
    ...font('sans', 700),
    fontSize: 15.5,
    lineHeight: 22.475,
    letterSpacing: -0.31,
    color: '#14161C',
  },

  // ---------------- Page 1: Notes (.bf-sheet, .bf-hw, .bf-arw)
  bfSheet: {
    marginTop: 18,
    marginRight: 6,
    marginLeft: 2,
    paddingBottom: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    shadowColor: '#281E0F',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 4,
    transform: [{ rotate: '-1.5deg' }],
  },
  clipx: {
    position: 'absolute',
    right: 26,
    top: -11,
    width: 13,
    height: 32,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#9AA3AE',
    borderBottomColor: 'transparent',
    zIndex: 10,
  },
  bsBand: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 32,
    paddingHorizontal: 12,
    gap: 7,
    backgroundColor: '#14304F',
    backgroundImage: 'linear-gradient(90deg, #14304F 0%, #1667B0 100%)',
    overflow: 'hidden',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  bsBandLogo: {
    width: 18,
    height: 18,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bsBandTitle: {
    ...font('sans', 700),
    fontSize: 10.5,
    lineHeight: 15.225,
    letterSpacing: 0.42,
    color: '#FFFFFF',
  },
  bsK: {
    ...font('sans', 800),
    fontSize: 9,
    lineHeight: 13.05,
    letterSpacing: 1.26,
    color: '#1667B0',
    marginTop: 12,
    marginHorizontal: 14,
    textTransform: 'uppercase',
  },
  bsT: {
    ...font('book', 600),
    fontSize: 20,
    lineHeight: 29,
    color: '#14161C',
    marginHorizontal: 14,
    marginTop: 3,
  },
  bsGl: {
    marginHorizontal: 14,
    marginTop: 8,
  },
  bsGlRowFirst: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: '#E6E0D4',
    borderStyle: 'dashed',
  },
  bsGlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: '#E6E0D4',
    borderStyle: 'dashed',
  },
  bsGlNum: {
    width: 17,
    height: 17,
    borderRadius: 5,
    backgroundColor: '#1667B0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bsGlNumTxt: {
    ...font('sans', 800),
    fontSize: 9.5,
    color: '#FFFFFF',
  },
  bsGlTxt: {
    ...font('book', 400),
    fontSize: 13.5,
    lineHeight: 19.575,
    color: '#3A352C',
  },
  bsTrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginHorizontal: 12,
    marginTop: 8,
    paddingVertical: 7,
    paddingHorizontal: 9,
    borderRadius: 7,
    backgroundColor: '#FFF4DE',
  },
  bsTrapBadge: {
    width: 16,
    height: 16,
    borderRadius: 5,
    backgroundColor: '#F5A01F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bsTrapBadgeTxt: {
    ...font('sans', 900),
    fontSize: 10.5,
    color: '#FFFFFF',
  },
  bsTrapTxt: {
    ...font('sans', 400),
    fontSize: 11.5,
    lineHeight: 16.675,
    color: '#6B4A14',
    flex: 1,
  },
  boldTrap: {
    ...font('sans', 700),
    color: '#6B4A14',
  },
  bfHwH1: {
    position: 'absolute',
    right: 24,
    bottom: 178,
    transform: [{ rotate: '-8deg' }],
  },
  bfArw: {
    position: 'absolute',
    right: 96,
    bottom: 196,
    width: 52,
    height: 35,
    transform: [{ scaleY: -1 }],
  },
  hwVerifiedTxt: {
    ...font('hand', 600),
    fontSize: 22,
    lineHeight: 31.9,
    color: '#C0392B',
  },

  // ---------------- Page 2: Notes Tracker (.bt, .bt-srcs, .bt-card, .bt-tabs)
  btWrap: {
    position: 'relative',
    marginTop: 20,
  },
  btSrcs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
    paddingHorizontal: 4,
  },
  btSrc: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 28,
    paddingLeft: 4,
    paddingRight: 8,
    borderRadius: 7,
    backgroundColor: '#FFFDF8',
    borderWidth: 1.3,
    borderColor: '#D9CFBB',
    shadowColor: '#3C280A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.14,
    shadowRadius: 5,
    elevation: 2,
  },
  btSrcBadge: {
    height: 19,
    paddingHorizontal: 4,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  srcBgPdf: { backgroundColor: '#C0392B' },
  srcBgTh: { backgroundColor: '#14304F' },
  srcBgPib: { backgroundColor: '#2F7A4F' },
  btSrcBadgeTxt: {
    ...font('sans', 800),
    fontSize: 8.5,
    lineHeight: 12.325,
    color: '#FFFFFF',
  },
  btSrcTxt: {
    ...font('sans', 700),
    fontSize: 10.5,
    lineHeight: 15.225,
    color: '#4A4234',
  },
  btArrowRow: {
    alignItems: 'center',
    marginTop: 2,
    marginBottom: -2,
    height: 30,
  },
  btCard: {
    position: 'relative',
    marginRight: 24,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    shadowColor: '#281E0F',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 4,
    transform: [{ rotate: '-0.8deg' }],
  },
  btTabs: {
    position: 'absolute',
    right: -22,
    top: 10,
    gap: 4,
  },
  btTab: {
    width: 22,
    height: 40,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.2,
    borderLeftWidth: 0,
    overflow: 'hidden',
  },
  btTabOn: {
    width: 25,
    backgroundColor: '#6C5DD3',
    borderColor: '#6C5DD3',
  },
  btTabHist: {
    backgroundColor: '#DDEFF3',
    borderColor: '#91D0DF',
  },
  btTabEcon: {
    backgroundColor: '#FCEFD7',
    borderColor: '#F5CA92',
  },
  btTabGeo: {
    backgroundColor: '#DEEFE9',
    borderColor: '#93D2CA',
  },
  tabTxtHist: { color: '#0A97B8' },
  tabTxtEcon: { color: '#E8890C' },
  tabTxtGeo: { color: '#0E9A8A' },
  btTabTxt: {
    ...font('sans', 800),
    fontSize: 7.5,
    lineHeight: 10.875,
    letterSpacing: 0.45,
    textTransform: 'uppercase',
    width: 38,
    textAlign: 'center',
    transform: [{ rotate: '90deg' }],
  },
  btTabOnTxt: {
    ...font('sans', 800),
    fontSize: 7.5,
    lineHeight: 10.875,
    letterSpacing: 0.45,
    textTransform: 'uppercase',
    color: '#FFFFFF',
    width: 38,
    textAlign: 'center',
    transform: [{ rotate: '90deg' }],
  },
  btBand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 30,
    paddingHorizontal: 12,
    backgroundColor: '#3E2F9E',
    backgroundImage: 'linear-gradient(90deg, #3E2F9E 0%, #6C5DD3 100%)',
    overflow: 'hidden',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  btBandTitle: {
    ...font('sans', 800),
    fontSize: 11,
    lineHeight: 15.95,
    letterSpacing: 0.88,
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  btBandSub: {
    ...font('sans', 400),
    fontSize: 10,
    lineHeight: 14.5,
    color: 'rgba(255,255,255,0.75)',
  },
  btBandNew: {
    marginLeft: 'auto',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: '#7CF0A8',
  },
  btBandNewTxt: {
    ...font('sans', 800),
    fontSize: 9.5,
    lineHeight: 13.775,
    color: '#0C4A33',
  },
  btIn: {
    paddingTop: 10,
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  btInHead: {
    ...font('book', 500),
    fontSize: 23,
    lineHeight: 25.3,
    color: '#1E1A14',
  },
  btInLine: {
    ...font('sans', 400),
    fontSize: 13.5,
    lineHeight: 19.575,
    color: '#4A4E57',
    marginTop: 4,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#EFE9DD',
  },
  btNewClipOuter: {
    marginTop: 4,
    overflow: 'hidden',
  },
  btNewClipInner: {
    overflow: 'hidden',
  },
  btNewRow: {
    width: 224,
    position: 'relative',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(47, 165, 98, 0.14)',
    borderLeftWidth: 3,
    borderLeftColor: '#2FA562',
  },
  btNewBadgeFloat: {
    position: 'absolute',
    left: 8,
    top: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    backgroundColor: '#2FA562',
    zIndex: 2,
  },
  btNewBadgeTxt: {
    ...font('sans', 800),
    fontSize: 8.5,
    lineHeight: 11.475,
    letterSpacing: 0.68,
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  btNewTxt: {
    ...font('sans', 600),
    fontSize: 13.5,
    lineHeight: 18.225,
    color: '#4A4E57',
  },
  hwMerged: {
    position: 'absolute',
    left: 6,
    bottom: -34,
    transform: [{ rotate: '-6deg' }],
  },
  hwMergedTxt: {
    ...font('hand', 600),
    fontSize: 23,
    lineHeight: 33.35,
    color: '#2F7A4F',
  },

  // ---------------- Page 3: X-Ray Reading (.bx-wrap, .bx-tx, .bx-film, .bx-ring, .bx-strip)
  bxWrap: {
    position: 'relative',
    marginTop: 18,
  },
  bxWrapCompact: {
    marginTop: 12,
  },
  bxTxWrap: {
    paddingVertical: 8,
    paddingLeft: 8,
    paddingRight: 58,
  },
  bxTx: {
    ...font('book', 400),
    fontSize: 16,
    lineHeight: 27.7,
    includeFontPadding: false,
    color: '#3A352C',
  },
  bxTxFilm: {
    ...font('book', 400),
    fontSize: 16,
    lineHeight: 27.7,
    includeFontPadding: false,
    color: 'rgba(170, 200, 235, 0.38)',
  },
  bq: {
    ...font('book', 400),
    backgroundColor: 'rgba(27, 138, 211, 0.2)',
    color: '#3A352C',
    textDecorationLine: 'underline',
    textDecorationColor: '#1B8AD3',
  },
  bqOff: {
    ...font('book', 400),
    color: '#3A352C',
  },
  bk2: {
    ...font('book', 400),
    color: '#3A352C',
    textDecorationLine: 'underline',
    textDecorationColor: '#1D3B8A',
  },
  bk2Off: {
    ...font('book', 400),
    color: '#3A352C',
  },
  bqFilm: {
    ...font('book', 400),
    color: '#7FE0FF',
    textShadowColor: 'rgba(95, 211, 255, 0.9)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  bk2Film: {
    ...font('book', 400),
    color: '#C9D8FF',
    textShadowColor: 'rgba(201, 216, 255, 0.7)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  bxFilmAperture: {
    position: 'absolute',
    overflow: 'hidden',
    zIndex: 4,
  },
  bxFilmLayer: {
    borderRadius: 10,
    backgroundColor: '#0A1D36',
    backgroundImage: 'radial-gradient(120% 90% at 50% 40%, #123A66 0%, #0A1D36 70%, #0A1D36 100%)',
    overflow: 'hidden',
  },
  bxFilmTxOffset: {
    paddingTop: 68,
  },
  bxRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#1D3B8A',
    shadowColor: '#1B8AD3',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 14,
    zIndex: 6,
  },
  bxGlint: {
    position: 'absolute',
    left: 18,
    top: 14,
    width: 26,
    height: 12,
    borderRadius: 13,
    borderTopWidth: 2.5,
    borderTopColor: 'rgba(255, 255, 255, 0.75)',
    transform: [{ rotate: '-30deg' }],
  },
  bxHandle: {
    position: 'absolute',
    right: -30,
    bottom: -10,
    width: 42,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1D3B8A',
    transform: [{ rotate: '45deg' }],
    transformOrigin: '0% 50%',
  },
  bxY: {
    position: 'absolute',
    right: 0,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#1B8AD3',
    shadowColor: '#1B8AD3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 2,
    transform: [{ rotate: '-6deg' }],
    zIndex: 7,
  },
  bxY1: { top: '18%' },
  bxY2: { top: '44%', backgroundColor: '#14304F' },
  bxY3: { top: '68%' },
  bxYTxt: {
    ...font('sans', 800),
    fontSize: 10.5,
    lineHeight: 15.225,
    color: '#FFFFFF',
  },
  bxStrip: {
    position: 'relative',
    flexDirection: 'row',
    gap: 4,
    marginTop: 15,
    paddingHorizontal: 8,
    paddingVertical: 11,
    borderRadius: 6,
    backgroundColor: '#0F1A2B',
    transform: [{ rotate: '-1.5deg' }],
    overflow: 'hidden',
  },
  bxStripCompact: {
    marginTop: 10,
  },
  bxSprocketRowTop: {
    position: 'absolute',
    left: 2,
    right: 2,
    top: 2.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  bxSprocketRowBottom: {
    position: 'absolute',
    left: 2,
    right: 2,
    bottom: 2.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  bxSprocketDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#F5F1E8',
  },
  bsFr: {
    flex: 1,
    paddingVertical: 7,
    paddingHorizontal: 4,
    borderRadius: 3,
    backgroundColor: '#16416F',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(127, 224, 255, 0.18)',
  },
  bsFrYear: {
    ...font('book', 700),
    fontSize: 16,
    lineHeight: 16,
    color: '#7FE0FF',
  },
  bsFrSub: {
    ...font('sans', 700),
    fontSize: 8.5,
    lineHeight: 10.2,
    color: 'rgba(200, 225, 250, 0.75)',
    marginTop: 4,
    textAlign: 'center',
  },
  bsFrLit: {
    backgroundColor: '#FFD27A',
    borderColor: '#FFD27A',
  },
  bsFrLitNum: {
    ...font('book', 700),
    fontSize: 16,
    lineHeight: 16,
    color: '#14304F',
  },
  bsFrLitSub: {
    ...font('sans', 700),
    fontSize: 8.5,
    lineHeight: 10.2,
    color: '#5B3B00',
    marginTop: 4,
    textAlign: 'center',
  },

  // ---------------- Page 4: Cloud Upload (.bf-cloud, .bf-files, .bf-up)
  bfCloudBox: {
    width: '100%',
    alignItems: 'center',
    marginTop: 18,
  },
  bfFiles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
    marginTop: 6,
  },
  bfFileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 37,
    paddingVertical: 6,
    paddingLeft: 6,
    paddingRight: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#281E0F',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 2,
  },
  bfFileType: {
    width: 22,
    height: 25,
    borderRadius: 4,
    borderTopRightRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileBgPdf: { backgroundColor: '#E5484D' },
  fileBgJpg: { backgroundColor: '#0E9A8A' },
  fileBgDoc: { backgroundColor: '#1B6FB3' },
  bfFileTypeTxt: {
    ...font('sans', 800),
    fontSize: 7.5,
    lineHeight: 10.875,
    color: '#FFFFFF',
  },
  bfFileName: {
    ...font('sans', 600),
    fontSize: 10.5,
    lineHeight: 15.225,
    color: '#2A2722',
  },
  bfUp: {
    marginTop: 20,
    paddingVertical: 11,
    paddingHorizontal: 13,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0C77A',
  },
  buT: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  buTHead: {
    ...font('sans', 700),
    fontSize: 12.5,
    lineHeight: 18.125,
    color: '#2A2722',
    flex: 1,
  },
  buTHw: {
    ...font('hand', 600),
    fontSize: 18,
    lineHeight: 26.1,
    color: '#2F7A4F',
  },
  buB: {
    height: 6,
    borderRadius: 6,
    backgroundColor: '#F4EBDC',
    marginTop: 8,
    overflow: 'hidden',
  },
  buBFill: {
    height: '100%',
    borderRadius: 6,
    backgroundColor: '#F5A01F',
    backgroundImage: 'linear-gradient(90deg, #F5A01F 0%, #E8890C 100%)',
    overflow: 'hidden',
  },
  buS: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 7,
  },
  buSTxt: {
    ...font('sans', 400),
    fontSize: 10.5,
    lineHeight: 15.225,
    color: '#8A8270',
  },

  // ---------------- Front Cover (.cvr2 in 330x486 coords, L223-L231, L472-L476, L1249-L1252)
  coverWrap: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#152843',
    paddingTop: 34,
    paddingRight: 26,
    paddingBottom: 26,
    paddingLeft: 34,
  },
  coverGradBase: {
    backgroundImage: 'linear-gradient(170deg, #1D3557 0%, #152843 55%, #0E1C31 100%)',
  },
  coverGradCrease: {
    backgroundImage:
      'linear-gradient(90deg, rgba(0, 0, 0, 0.42) 0%, rgba(0, 0, 0, 0.14) 3%, rgba(255, 255, 255, 0.09) 4.5%, rgba(0, 0, 0, 0) 7%)',
  },
  coverGradSheen: {
    backgroundImage:
      'linear-gradient(155deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0) 32%, rgba(0, 0, 0, 0) 65%, rgba(0, 0, 0, 0.22) 100%)',
  },
  cTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    opacity: 0.8,
  },
  cLogoWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 4,
  },
  cTopTxt: {
    ...font('sans', 700),
    fontSize: 11.5,
    lineHeight: 16.675,
    letterSpacing: 2.99,
    color: '#FFFFFF',
    flex: 1,
  },
  cUpsc: {
    ...font('serif', 800),
    fontSize: 80,
    lineHeight: 72,
    letterSpacing: -3.2,
    color: '#FFFFFF',
    marginTop: 52,
  },
  cYear: {
    ...font('book', 400),
    fontSize: 46,
    lineHeight: 46,
    color: '#F5B544',
    marginTop: 6,
  },
  cBand: {
    backgroundColor: '#F5A01F',
    marginTop: 26,
    marginLeft: -40,
    marginRight: -30,
    paddingVertical: 11,
    paddingLeft: 40,
    paddingRight: 30,
  },
  cBandTxt: {
    ...font('sans', 800),
    fontSize: 13.5,
    lineHeight: 19.575,
    letterSpacing: 2.16,
    color: '#14161C',
  },
  cSvc: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    marginTop: 18,
    opacity: 0.9,
  },
  cSvcTxt: {
    ...font('sans', 700),
    fontSize: 15.5,
    lineHeight: 22.475,
    letterSpacing: 2.17,
    color: '#FFFFFF',
  },
  cPub: {
    marginTop: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.25)',
    paddingTop: 16,
    opacity: 0.95,
  },
  cPubSub: {
    ...font('sans', 600),
    fontSize: 11.5,
    lineHeight: 16.675,
    letterSpacing: 1.61,
    color: '#FFFFFF',
  },

  // ---------------- Bottom Controls Bar (L295-L301, L352-L363, L616-L617)
  ctlArea: {
    position: 'absolute',
    left: 38 * VP_S,
    right: 26 * VP_S,
    zIndex: 50,
  },
  autobarWrap: {
    position: 'absolute',
    left: 38 * VP_S,
    right: 26 * VP_S,
    height: 1.5,
    backgroundColor: 'rgba(40, 32, 20, 0.06)',
    borderRadius: 1,
    overflow: 'hidden',
    zIndex: 26,
  },
  autobarFill: {
    height: '100%',
    backgroundColor: 'rgba(17, 18, 20, 0.55)',
  },
  ctlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ctlMid: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  ctlDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(40, 32, 20, 0.22)',
  },
  dotOn: {
    width: 22,
    backgroundColor: '#111214',
  },
  skLink: {
    paddingVertical: 6,
    paddingHorizontal: 2,
  },
  skLinkTxt: {
    ...font('sans', 600),
    fontSize: 13.5,
    color: '#8A8270',
  },
  snd2Btn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rpLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 6,
    paddingHorizontal: 2,
  },
  rpLinkTxt: {
    ...font('sans', 600),
    fontSize: 13.5,
    color: '#8A8270',
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 46,
    paddingHorizontal: 20,
    borderRadius: 13,
    backgroundColor: '#111214',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 4,
  },
  nextBtnLast: {
    paddingHorizontal: 22,
  },
  nextBtnTxt: {
    ...font('sans', 600),
    fontSize: 15.5,
    color: '#FFFFFF',
  },
});
