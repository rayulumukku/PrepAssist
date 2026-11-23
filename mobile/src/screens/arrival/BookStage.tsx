// Source: PrepAssist.html L4757-L4864 (#s-book static markup)
// Source: PrepAssist.html L5783-L5794 (runBook)
// Source: PrepAssist.html L5737-L5746 (buildBook)
// Source: PrepAssist.html L5635-L5672 (makeLeaf3)
// Source: PrepAssist.html L5747-L5754 (setCtl)
// Source: PrepAssist.html L5806-L5819 (openBook)
// Source: PrepAssist.html L5820-L5831 (turnPage)
// Source: PrepAssist.html L5833-L5840 (bookExit)
// Source: PrepAssist.html L5871-L5893 (startDust, stopDust)
// Source: PrepAssist.html L111-L265 (.bk-stage, .scene, .b3, .cvr2, .bd, .thick, .pgx)
// Source: PrepAssist.html L3703-L3880 (.bfp, .bf-sheet, .bt-card, .bx-wrap, .bx-strip, .bf-cloud)
import React, { useEffect, useRef } from 'react';
import {
  Dimensions,
  PanResponder,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, {
  Circle,
  G,
  Path,
  Rect,
} from 'react-native-svg';
import { act } from '../../actions';
import { Icon, Logo } from '../../components';
import { useStore } from '../../store';
import { font } from '../../theme';
import { Txt } from '../../theme/Txt';
import { useInsets } from '../../theme/useTheme';
import { bookNext, bookPrev, openBook } from './flow';

const { width: SCREEN_W } = Dimensions.get('window');
const BOOK_W = Math.min(340, SCREEN_W - 36);
const BOOK_H = Math.min(500, Math.round(BOOK_W * 1.48));

// Ambient dust particles (PrepAssist.html L5876)
const DUST_PARTICLES = Array.from({ length: 32 }, (_, i) => ({
  id: i,
  x: Math.round(((i * 73 + 17) % 100)),
  y: Math.round(((i * 47 + 29) % 100)),
  size: (i % 5 === 0) ? 3.5 : (i % 2 === 0) ? 2.2 : 1.5,
  opacity: 0.25 + (i % 6) * 0.1,
  duration: 4000 + (i % 8) * 800,
  delay: (i % 10) * 300,
}));

function DustField(): React.JSX.Element {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        {DUST_PARTICLES.map(p => (
          <Circle
            key={p.id}
            cx={`${p.x}%`}
            cy={`${p.y}%`}
            r={p.size}
            fill="#FFF4DC"
            opacity={p.opacity}
          />
        ))}
      </Svg>
    </View>
  );
}

// ---------------------------------------------------------------- Page 1: Notes
function Page1Notes(): React.JSX.Element {
  return (
    <View style={styles.pageInner}>
      {/* Running header / watermark */}
      <View style={styles.ppRh}>
        <View style={styles.wmWrap}>
          <Logo size={14} />
          <Txt style={styles.wmText}>PrepAssist</Txt>
        </View>
        <Txt style={styles.rhCat}>GS-II · POLITY</Txt>
      </View>

      <Txt style={styles.tbH}>Notes</Txt>
      <Txt style={styles.tb}>
        Verified faculty compendiums —{' '}
        <Txt style={styles.tbMark}>every subject on one crisp page</Txt>, exam traps flagged.
      </Txt>

      {/* Faculty compendium sheet */}
      <View style={styles.bfSheet}>
        {/* Silver paper clip */}
        <View style={styles.clipx} />

        <View style={styles.bsBand}>
          <View style={styles.bsBandLogo}>
            <Logo size={12} />
          </View>
          <Txt style={styles.bsBandTitle}>Faculty compendium</Txt>
          <Txt style={styles.bsBandVerified}>verified ✓</Txt>
        </View>

        <Txt style={styles.bsK}>Polity &amp; Governance</Txt>
        <Txt style={styles.bsT}>Fundamental Rights</Txt>

        <View style={styles.bsGl}>
          <View style={styles.bsGlRow}>
            <View style={styles.bsGlNum}><Txt style={styles.bsGlNumTxt}>1</Txt></View>
            <Txt style={styles.bsGlTxt}>Part III · Articles 12–35</Txt>
          </View>
          <View style={styles.bsGlRow}>
            <View style={styles.bsGlNum}><Txt style={styles.bsGlNumTxt}>2</Txt></View>
            <Txt style={styles.bsGlTxt}>Six categories of rights</Txt>
          </View>
          <View style={styles.bsGlRow}>
            <View style={styles.bsGlNum}><Txt style={styles.bsGlNumTxt}>3</Txt></View>
            <Txt style={styles.bsGlTxt}>Art. 32 — “heart and soul”</Txt>
          </View>
        </View>

        <View style={styles.bsTrap}>
          <View style={styles.bsTrapBadge}><Txt style={styles.bsTrapBadgeTxt}>!</Txt></View>
          <Txt style={styles.bsTrapTxt}>
            Exam trap — Art. 226 is <Txt style={styles.bold}>wider</Txt> than Art. 32
          </Txt>
        </View>
      </View>

      {/* Red handwritten verified tag */}
      <View style={styles.hwVerified}>
        <Txt style={styles.hwVerifiedTxt}>verified ✓</Txt>
      </View>

      {/* Page bottom label */}
      <View style={styles.ppLab}>
        <Txt style={styles.ppLabNum}>01</Txt>
        <Txt style={styles.ppLabTitle}>Notes</Txt>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------- Page 2: Notes Tracker
function Page2Tracker(): React.JSX.Element {
  return (
    <View style={styles.pageInner}>
      <View style={styles.ppRh}>
        <View style={styles.wmWrap}>
          <Logo size={14} />
          <Txt style={styles.wmText}>PrepAssist</Txt>
        </View>
        <Txt style={styles.rhCat}>TRACKER · GS-II</Txt>
      </View>

      <Txt style={styles.tbH}>Notes Tracker</Txt>
      <Txt style={styles.tb}>
        Your notes, one folder per subject —{' '}
        <Txt style={styles.tbMark}>always up to date</Txt>.
      </Txt>

      <View style={styles.btWrap}>
        {/* Source tags */}
        <View style={styles.btSrcs}>
          <View style={[styles.btSrc, { transform: [{ rotate: '-3deg' }] }]}>
            <View style={[styles.btSrcBadge, { backgroundColor: '#C0392B' }]}>
              <Txt style={styles.btSrcBadgeTxt}>PDF</Txt>
            </View>
            <Txt style={styles.btSrcTxt}>Your PDF</Txt>
          </View>
          <View style={styles.btSrc}>
            <View style={[styles.btSrcBadge, { backgroundColor: '#14304F' }]}>
              <Txt style={styles.btSrcBadgeTxt}>TH</Txt>
            </View>
            <Txt style={styles.btSrcTxt}>The Hindu</Txt>
          </View>
          <View style={[styles.btSrc, { transform: [{ rotate: '3deg' }] }]}>
            <View style={[styles.btSrcBadge, { backgroundColor: '#2F7A4F' }]}>
              <Txt style={styles.btSrcBadgeTxt}>PIB</Txt>
            </View>
            <Txt style={styles.btSrcTxt}>Release</Txt>
          </View>
        </View>

        {/* Arrow connector */}
        <View style={styles.btArrowRow}>
          <Svg width={200} height={20} viewBox="0 0 200 20">
            <Path
              d="M30 2 C 50 14, 80 18, 100 18 S 150 14, 170 2"
              fill="none"
              stroke="#2F7A4F"
              strokeWidth={1.5}
              strokeDasharray="3,3"
            />
          </Svg>
        </View>

        {/* Central folder card */}
        <View style={styles.btCard}>
          {/* Side tabs */}
          <View style={styles.btTabs}>
            <View style={[styles.btTab, styles.btTabOn]}>
              <Txt style={styles.btTabOnTxt}>Polity</Txt>
            </View>
            <View style={styles.btTab}>
              <Txt style={styles.btTabTxt}>Hist.</Txt>
            </View>
            <View style={styles.btTab}>
              <Txt style={styles.btTabTxt}>Econ.</Txt>
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
            <View style={styles.btNewRow}>
              <View style={styles.btNewBadge}>
                <Txt style={styles.btNewBadgeTxt}>new</Txt>
              </View>
              <Txt style={styles.btNewTxt}>
                IYC 2025 — “Cooperatives Build a Better World”
              </Txt>
            </View>
          </View>
        </View>

        <View style={styles.hwMerged}>
          <Txt style={styles.hwMergedTxt}>merged in ✓</Txt>
        </View>
      </View>

      <View style={styles.ppLab}>
        <Txt style={styles.ppLabNum}>02</Txt>
        <Txt style={styles.ppLabTitle}>Notes Tracker</Txt>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------- Page 3: X-Ray Reading
function Page3XRay(): React.JSX.Element {
  return (
    <View style={styles.pageInner}>
      <View style={styles.ppRh}>
        <View style={styles.wmWrap}>
          <Logo size={14} />
          <Txt style={styles.wmText}>PrepAssist</Txt>
        </View>
        <Txt style={styles.rhCat}>X-RAY VISION</Txt>
      </View>

      <Txt style={styles.tbH}>X-Ray Reading</Txt>
      <Txt style={styles.tb}>
        Hold any page to the light —{' '}
        <Txt style={styles.tbMark}>see exactly what UPSC has asked</Txt>.
      </Txt>

      <View style={styles.bxWrap}>
        <Txt style={styles.bxTx}>
          Rights mean little without a way to enforce them. Hence,{' '}
          <Txt style={styles.bq}>Article 32 confers the right to remedies</Txt> — which Dr
          Ambedkar called{' '}
          <Txt style={styles.bq}>the heart and soul of the Constitution</Txt>. It is a{' '}
          <Txt style={styles.bq}>basic feature</Txt> no amendment can remove, and lets the Court
          issue <Txt style={styles.bk2}>writs like habeas corpus and mandamus</Txt>.
        </Txt>

        {/* Margin badges */}
        <View style={[styles.bxY, styles.bxY1]}>
          <Txt style={styles.bxYTxt}>PYQ ’19</Txt>
        </View>
        <View style={[styles.bxY, styles.bxY2]}>
          <Txt style={styles.bxYTxt}>PYQ ’23</Txt>
        </View>
        <View style={[styles.bxY, styles.bxY3]}>
          <Txt style={styles.bxYTxt}>PYQ ’21</Txt>
        </View>

        {/* X-Ray circular scanning lens ring */}
        <View style={styles.bxRing} pointerEvents="none">
          <View style={styles.bxGlint} />
        </View>
      </View>

      {/* Film negative result strip */}
      <View style={styles.bxStrip}>
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
      </View>

      <View style={styles.ppLab}>
        <Txt style={styles.ppLabNum}>03</Txt>
        <Txt style={styles.ppLabTitle}>X-Ray Reading</Txt>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------- Page 4: Cloud Upload
function Page4Cloud(): React.JSX.Element {
  return (
    <View style={styles.pageInner}>
      <View style={styles.ppRh}>
        <View style={styles.wmWrap}>
          <Logo size={14} />
          <Txt style={styles.wmText}>PrepAssist</Txt>
        </View>
        <Txt style={styles.rhCat}>CLOUD LIBRARY</Txt>
      </View>

      <Txt style={styles.tbH}>Cloud Upload</Txt>
      <Txt style={styles.tb}>
        Upload once —{' '}
        <Txt style={styles.tbMark}>read, search and X-Ray it anywhere</Txt>.
      </Txt>

      {/* Cloud graphic */}
      <View style={styles.bfCloudBox}>
        <Svg width={200} height={70} viewBox="0 0 300 150" fill="none">
          <Path
            d="M96 118H74a32 32 0 0 1-3-63.8A46 46 0 0 1 160 40a38 38 0 0 1 40 34 24 24 0 0 1 4 44h-24"
            stroke="#1D3B8A"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M140 132V78M122 96l18-18 18 18"
            stroke="#1D3B8A"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </View>

      {/* File badges row */}
      <View style={styles.bfFiles}>
        <View style={[styles.bfFileBadge, { transform: [{ rotate: '-4deg' }] }]}>
          <View style={[styles.bfFileType, { backgroundColor: '#E5484D' }]}>
            <Txt style={styles.bfFileTypeTxt}>PDF</Txt>
          </View>
          <Txt style={styles.bfFileName}>Laxmikanth</Txt>
        </View>
        <View style={styles.bfFileBadge}>
          <View style={[styles.bfFileType, { backgroundColor: '#0E9A8A' }]}>
            <Txt style={styles.bfFileTypeTxt}>JPG</Txt>
          </View>
          <Txt style={styles.bfFileName}>Answer scan</Txt>
        </View>
        <View style={[styles.bfFileBadge, { transform: [{ rotate: '4deg' }] }]}>
          <View style={[styles.bfFileType, { backgroundColor: '#1B6FB3' }]}>
            <Txt style={styles.bfFileTypeTxt}>DOC</Txt>
          </View>
          <Txt style={styles.bfFileName}>Notes</Txt>
        </View>
      </View>

      {/* Upload progress card */}
      <View style={styles.bfUp}>
        <View style={styles.buT}>
          <Txt style={styles.buTHead} numberOfLines={1}>
            Economic Survey 2025-26.pdf
          </Txt>
          <Txt style={styles.buTHw}>indexed for AI ✓</Txt>
        </View>
        <View style={styles.buB}>
          <View style={styles.buBFill} />
        </View>
        <View style={styles.buS}>
          <Txt style={styles.buSTxt}>web · app · anywhere</Txt>
          <Txt style={styles.buSTxt}>27 MB of 512 MB</Txt>
        </View>
      </View>

      <View style={styles.ppLab}>
        <Txt style={styles.ppLabNum}>04</Txt>
        <Txt style={styles.ppLabTitle}>Cloud Upload</Txt>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------- Front Cover (Step 0)
function FrontCover(): React.JSX.Element {
  return (
    <View style={styles.coverWrap}>
      {/* Gold embossed header */}
      <View style={styles.cTop}>
        <View style={styles.cLogoWrap}>
          <Logo size={14} />
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
        <Txt style={styles.cSvcBullet}>·</Txt>
        <Txt style={styles.cSvcTxt}>IPS</Txt>
        <Txt style={styles.cSvcBullet}>·</Txt>
        <Txt style={styles.cSvcTxt}>IFS</Txt>
        <Txt style={styles.cSvcBullet}>·</Txt>
        <Txt style={styles.cSvcTxt}>IRS</Txt>
      </View>

      <View style={styles.cPub}>
        <Txt style={styles.cPubBrand}>PrepAssist</Txt>
        <Txt style={styles.cPubSub}>COMPLETE GUIDE</Txt>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------- Main BookStage Screen
function BookStage(): React.JSX.Element {
  const insets = useInsets();
  const bkStep = useStore(s => s.bkStep);
  const sfxOn = useStore(s => s.SFX.on);
  const isClosed = bkStep === 0;

  // Ambient animations
  const beamAnim = useSharedValue(0);
  const dappleAnim = useSharedValue(0);
  const autoProgress = useSharedValue(0);

  useEffect(() => {
    beamAnim.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 5500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 5500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    dappleAnim.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 7500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 7500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [beamAnim, dappleAnim]);

  // Auto-advance bar animation: restarts when bkStep changes (and bkStep >= 1 and < 4)
  useEffect(() => {
    if (bkStep >= 1 && bkStep < 4) {
      autoProgress.value = 0;
      autoProgress.value = withTiming(1, { duration: 3500, easing: Easing.linear });
    } else {
      autoProgress.value = 0;
    }
  }, [bkStep, autoProgress]);

  // Auto open after 1400ms if still closed (HTML L5793)
  useEffect(() => {
    if (isClosed) {
      const t = setTimeout(() => {
        openBook();
      }, 1400);
      return () => clearTimeout(t);
    }
  }, [isClosed]);

  // Gesture responder for swiping pages
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (_, gesture) => {
        if (Math.abs(gesture.dx) > 40) {
          if (gesture.dx < 0) {
            bookNext();
          } else {
            bookPrev();
          }
        }
      },
    })
  ).current;

  // Animated styles
  const beamStyle = useAnimatedStyle(() => ({
    opacity: 0.5 + 0.3 * beamAnim.value,
    transform: [{ translateX: -15 + 30 * beamAnim.value }],
  }));

  const dappleStyle = useAnimatedStyle(() => ({
    opacity: 0.18 + 0.08 * dappleAnim.value,
    transform: [{ translateY: -5 + 10 * dappleAnim.value }],
  }));

  const autobarStyle = useAnimatedStyle(() => ({
    width: `${Math.round(autoProgress.value * 100)}%`,
  }));

  return (
    <View style={styles.root}>
      {/* 1. Warm Desk Background */}
      <View style={styles.deskBg}>
        <View style={styles.deskVignette} />
      </View>

      {/* 2. Sunbeam Lighting */}
      <Animated.View style={[styles.beam, beamStyle]} pointerEvents="none">
        <Svg width="140%" height="140%" viewBox="0 0 400 600" style={StyleSheet.absoluteFill}>
          <G transform="rotate(-26 200 300)">
            <Rect x="-50" y="50" width="500" height="120" fill="rgba(255, 235, 195, 0.45)" />
            <Rect x="-50" y="240" width="500" height="80" fill="rgba(255, 240, 215, 0.28)" />
          </G>
        </Svg>
      </Animated.View>

      {/* 3. Dappled Shadows */}
      <Animated.View style={[styles.dapple, dappleStyle]} pointerEvents="none">
        <Svg width="100%" height="100%">
          <Circle cx="20%" cy="20%" r="55" fill="#3A2A12" opacity={0.14} />
          <Circle cx="80%" cy="30%" r="70" fill="#3A2A12" opacity={0.12} />
          <Circle cx="35%" cy="75%" r="60" fill="#3A2A12" opacity={0.15} />
          <Circle cx="75%" cy="85%" r="50" fill="#3A2A12" opacity={0.12} />
        </Svg>
      </Animated.View>

      {/* 4. Dust Motes */}
      <DustField />

      {/* 5. Top Controls (Sound & Skip) */}
      <View style={[styles.topBar, { top: Math.max(14, insets.sat) }]}>
        <Pressable
          style={styles.sndBtn}
          onPress={() => act('sound')}
          accessibilityLabel="Toggle sound"
          testID="book.sound"
        >
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4Z" fill="#3A3428" />
            <Path
              d="M15.5 9a4.5 4.5 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11"
              stroke="#3A3428"
              strokeWidth={1.8}
              strokeLinecap="round"
              opacity={sfxOn ? 1 : 0.2}
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
      </View>

      {/* 6. The 3D Book Container */}
      <View style={styles.bookArea}>
        {/* Drop shadow under the book */}
        <View style={styles.dshadow} />

        {/* Outer leather binding boards */}
        <View style={styles.bdBoard}>
          {/* Pages edge block thickness */}
          <View style={styles.thickEdges}>
            <View style={styles.edgeLine} />
            <View style={styles.edgeLine} />
            <View style={styles.edgeLine} />
          </View>

          {/* Spine ribbon bookmark (visible when book is open) */}
          {!isClosed && (
            <View style={styles.ribbonWrap} pointerEvents="none">
              <View style={styles.ribbon} />
              <View style={styles.ribbonTip} />
            </View>
          )}

          {/* Book Content: Closed Cover vs Opened Pages */}
          {isClosed ? (
            <Pressable
              style={styles.bookPressable}
              onPress={openBook}
              testID="book.cover"
            >
              <FrontCover />
            </Pressable>
          ) : (
            <View
              style={styles.bookPressable}
              {...panResponder.panHandlers}
            >
              <Pressable
                style={styles.pageSurface}
                onPress={bookNext}
                testID="book.page"
              >
                {bkStep === 1 && <Page1Notes />}
                {bkStep === 2 && <Page2Tracker />}
                {bkStep === 3 && <Page3XRay />}
                {bkStep >= 4 && <Page4Cloud />}
              </Pressable>
            </View>
          )}
        </View>

        {/* Closed prompt hint */}
        {isClosed && (
          <Pressable
            style={styles.openHintPill}
            onPress={openBook}
            testID="book.openHint"
          >
            <Txt style={styles.openHintTxt}>Tap the book to open · स्पर्श करें</Txt>
          </Pressable>
        )}
      </View>

      {/* 7. Bottom Navigation Controls (When Open) */}
      {!isClosed && (
        <View style={[styles.ctlArea, { bottom: Math.max(20, insets.sab + 12) }]}>
          {/* Auto-advance timer bar */}
          {bkStep < 4 && (
            <View style={styles.autobarWrap}>
              <Animated.View style={[styles.autobarFill, autobarStyle]} />
            </View>
          )}

          <View style={styles.ctlRow}>
            {/* Left/Mid controls */}
            <View style={styles.ctlMid}>
              {/* Progress dots */}
              <View style={styles.ctlDots}>
                {[1, 2, 3, 4].map(s => (
                  <View
                    key={s}
                    style={[styles.dot, bkStep === s && styles.dotOn]}
                  />
                ))}
              </View>

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
            </View>

            {/* Next / Start preparing button */}
            <Pressable
              style={styles.nextBtn}
              onPress={bkStep >= 4 ? () => act('bookExit') : bookNext}
              testID="book.next"
            >
              <Txt style={styles.nextBtnTxt}>
                {bkStep >= 4 ? 'Start preparing' : 'Next'}
              </Txt>
              <Icon name="arrow" size={16} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

export default BookStage;

// ---------------------------------------------------------------- Styles
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#EBDDC6',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deskBg: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#E6DCB8',
  },
  deskVignette: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(60, 40, 20, 0.18)',
  },
  beam: {
    position: 'absolute',
    top: -50,
    left: -60,
    right: -60,
    bottom: -50,
  },
  dapple: {
    position: 'absolute',
    inset: 0,
  },
  topBar: {
    position: 'absolute',
    right: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    zIndex: 40,
  },
  sndBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  skipBtn: {
    height: 32,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  skipTxt: {
    ...font('sans', 600),
    fontSize: 13,
    color: '#3A3428',
  },

  // ---------------- Book Container
  bookArea: {
    width: BOOK_W,
    height: BOOK_H,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dshadow: {
    position: 'absolute',
    width: BOOK_W + 28,
    height: BOOK_H + 20,
    borderRadius: 16,
    backgroundColor: 'rgba(30, 26, 20, 0.35)',
    transform: [{ translateY: 10 }],
  },
  bdBoard: {
    width: BOOK_W,
    height: BOOK_H,
    borderRadius: 8,
    backgroundColor: '#14243D',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  thickEdges: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    top: 0,
    width: 6,
    backgroundColor: '#F3EFE6',
    borderLeftWidth: 1,
    borderLeftColor: '#DCD5C6',
    zIndex: 10,
  },
  edgeLine: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#DCD5C6',
  },
  ribbonWrap: {
    position: 'absolute',
    left: 12,
    top: -2,
    zIndex: 25,
    alignItems: 'center',
  },
  ribbon: {
    width: 10,
    height: BOOK_H + 16,
    backgroundColor: '#E8890C',
  },
  ribbonTip: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#E8890C',
  },
  bookPressable: {
    flex: 1,
  },
  pageSurface: {
    flex: 1,
    backgroundColor: '#FCFBF7',
    padding: 22,
    paddingRight: 26,
  },
  pageInner: {
    flex: 1,
  },

  // ---------------- Page furniture
  ppRh: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#D8D1C2',
    paddingBottom: 6,
  },
  wmWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  wmText: {
    ...font('sans', 700),
    fontSize: 12,
    color: '#14161C',
  },
  rhCat: {
    ...font('sans', 600),
    fontSize: 9.5,
    letterSpacing: 1.2,
    color: '#8A8270',
  },
  tbH: {
    ...font('book', 600),
    fontSize: 22,
    color: '#14161C',
    marginTop: 14,
  },
  tb: {
    ...font('book', 400),
    fontSize: 13.5,
    lineHeight: 18,
    color: '#3A352C',
    marginTop: 6,
  },
  tbMark: {
    ...font('book', 600),
    backgroundColor: 'rgba(255, 200, 60, 0.45)',
    color: '#14161C',
  },
  ppLab: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 4,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#1F2128',
    paddingTop: 6,
  },
  ppLabNum: {
    ...font('book', 600),
    fontSize: 28,
    color: '#152843',
    lineHeight: 28,
  },
  ppLabTitle: {
    ...font('sans', 700),
    fontSize: 14,
    color: '#14161C',
  },

  // ---------------- Page 1 Details
  bfSheet: {
    marginTop: 14,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6EBF1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
    paddingBottom: 10,
    transform: [{ rotate: '-1.5deg' }],
  },
  clipx: {
    position: 'absolute',
    right: 20,
    top: -8,
    width: 12,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#8A92A0',
    borderBottomColor: 'transparent',
    zIndex: 10,
  },
  bsBand: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
    paddingHorizontal: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    backgroundColor: '#1667B0',
    gap: 6,
  },
  bsBandLogo: {
    width: 16,
    height: 16,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bsBandTitle: {
    ...font('sans', 700),
    fontSize: 10,
    color: '#FFFFFF',
  },
  bsBandVerified: {
    ...font('sans', 600),
    fontSize: 9,
    color: 'rgba(255,255,255,0.75)',
    marginLeft: 'auto',
  },
  bsK: {
    ...font('sans', 700),
    fontSize: 8.5,
    letterSpacing: 1,
    color: '#1667B0',
    marginTop: 8,
    marginHorizontal: 12,
    textTransform: 'uppercase',
  },
  bsT: {
    ...font('book', 600),
    fontSize: 16,
    color: '#14161C',
    marginHorizontal: 12,
    marginTop: 2,
  },
  bsGl: {
    marginHorizontal: 12,
    marginTop: 6,
  },
  bsGlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 3,
    borderTopWidth: 0.5,
    borderTopColor: '#E6E0D4',
  },
  bsGlNum: {
    width: 15,
    height: 15,
    borderRadius: 4,
    backgroundColor: '#1667B0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bsGlNumTxt: {
    ...font('sans', 800),
    fontSize: 8.5,
    color: '#FFFFFF',
  },
  bsGlTxt: {
    ...font('book', 400),
    fontSize: 11.5,
    color: '#3A352C',
  },
  bsTrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginHorizontal: 10,
    marginTop: 6,
    padding: 6,
    borderRadius: 5,
    backgroundColor: '#FFF4DE',
  },
  bsTrapBadge: {
    width: 14,
    height: 14,
    borderRadius: 4,
    backgroundColor: '#F5A01F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bsTrapBadgeTxt: {
    ...font('sans', 900),
    fontSize: 9,
    color: '#FFFFFF',
  },
  bsTrapTxt: {
    ...font('sans', 500),
    fontSize: 10,
    color: '#6B4A14',
    flex: 1,
  },
  bold: {
    ...font('sans', 800),
  },
  hwVerified: {
    alignSelf: 'flex-end',
    marginTop: 8,
    transform: [{ rotate: '-6deg' }],
  },
  hwVerifiedTxt: {
    ...font('hand', 600),
    fontSize: 19,
    color: '#C0392B',
  },

  // ---------------- Page 2 Details
  btWrap: {
    marginTop: 10,
  },
  btSrcs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  btSrc: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 5,
    backgroundColor: '#FFFDF8',
    borderWidth: 1,
    borderColor: '#D9CFBB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  btSrcBadge: {
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 3,
  },
  btSrcBadgeTxt: {
    ...font('sans', 800),
    fontSize: 7.5,
    color: '#FFFFFF',
  },
  btSrcTxt: {
    ...font('sans', 600),
    fontSize: 9.5,
    color: '#4A4234',
  },
  btArrowRow: {
    alignItems: 'center',
    marginVertical: 2,
  },
  btCard: {
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6EBF1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  btTabs: {
    position: 'absolute',
    right: -18,
    top: 8,
    gap: 3,
  },
  btTab: {
    paddingHorizontal: 4,
    paddingVertical: 3,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    backgroundColor: '#F5F2EA',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderColor: '#D9CFBB',
  },
  btTabOn: {
    backgroundColor: '#6C5DD3',
    borderColor: '#6C5DD3',
  },
  btTabTxt: {
    ...font('sans', 700),
    fontSize: 7,
    color: '#7A7262',
  },
  btTabOnTxt: {
    ...font('sans', 700),
    fontSize: 7,
    color: '#FFFFFF',
  },
  btBand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 28,
    paddingHorizontal: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    backgroundColor: '#6C5DD3',
  },
  btBandTitle: {
    ...font('sans', 800),
    fontSize: 10,
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  btBandSub: {
    ...font('sans', 500),
    fontSize: 9,
    color: 'rgba(255,255,255,0.7)',
  },
  btBandNew: {
    marginLeft: 'auto',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
    backgroundColor: '#7CF0A8',
  },
  btBandNewTxt: {
    ...font('sans', 800),
    fontSize: 8.5,
    color: '#0C4A33',
  },
  btIn: {
    padding: 10,
  },
  btInHead: {
    ...font('book', 600),
    fontSize: 17,
    color: '#1E1A14',
  },
  btInLine: {
    ...font('sans', 500),
    fontSize: 9.5,
    color: '#5C5444',
    marginTop: 3,
  },
  btNewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 6,
    padding: 5,
    borderRadius: 4,
    backgroundColor: 'rgba(47, 165, 98, 0.1)',
    borderLeftWidth: 2,
    borderLeftColor: '#2FA562',
  },
  btNewBadge: {
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    backgroundColor: '#2FA562',
  },
  btNewBadgeTxt: {
    ...font('sans', 800),
    fontSize: 7.5,
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  btNewTxt: {
    ...font('sans', 600),
    fontSize: 9.5,
    color: '#1F4D32',
    flex: 1,
  },
  hwMerged: {
    alignSelf: 'flex-start',
    marginTop: 4,
    transform: [{ rotate: '-4deg' }],
  },
  hwMergedTxt: {
    ...font('hand', 600),
    fontSize: 19,
    color: '#2F7A4F',
  },

  // ---------------- Page 3 Details
  bxWrap: {
    position: 'relative',
    marginTop: 12,
  },
  bxTx: {
    ...font('book', 400),
    fontSize: 13,
    lineHeight: 20,
    color: '#3A352C',
    paddingRight: 48,
  },
  bq: {
    ...font('book', 600),
    backgroundColor: 'rgba(27, 138, 211, 0.18)',
    color: '#152843',
  },
  bk2: {
    ...font('book', 600),
    color: '#1D3B8A',
  },
  bxY: {
    position: 'absolute',
    right: 0,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#1B8AD3',
  },
  bxY1: {
    top: 6,
  },
  bxY2: {
    top: 48,
    backgroundColor: '#14304F',
  },
  bxY3: {
    top: 92,
  },
  bxYTxt: {
    ...font('sans', 800),
    fontSize: 8.5,
    color: '#FFFFFF',
  },
  bxRing: {
    position: 'absolute',
    left: '25%',
    top: 10,
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#1D3B8A',
    shadowColor: '#1B8AD3',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  bxGlint: {
    position: 'absolute',
    left: 8,
    top: 6,
    width: 14,
    height: 6,
    borderRadius: 3,
    borderTopWidth: 2,
    borderTopColor: 'rgba(255,255,255,0.8)',
  },
  bxStrip: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 14,
    padding: 6,
    borderRadius: 5,
    backgroundColor: '#0F1A2B',
  },
  bsFr: {
    flex: 1,
    padding: 4,
    borderRadius: 3,
    backgroundColor: '#16416F',
    alignItems: 'center',
  },
  bsFrYear: {
    ...font('book', 600),
    fontSize: 13,
    color: '#7FE0FF',
  },
  bsFrSub: {
    ...font('sans', 600),
    fontSize: 7,
    color: 'rgba(200, 225, 250, 0.8)',
    marginTop: 2,
    textAlign: 'center',
  },
  bsFrLit: {
    backgroundColor: '#FFD27A',
  },
  bsFrLitNum: {
    ...font('book', 700),
    fontSize: 13,
    color: '#14304F',
  },
  bsFrLitSub: {
    ...font('sans', 700),
    fontSize: 7,
    color: '#5B3B00',
    marginTop: 2,
  },

  // ---------------- Page 4 Details
  bfCloudBox: {
    alignItems: 'center',
    marginTop: 6,
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
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6EBF1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bfFileType: {
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 3,
  },
  bfFileTypeTxt: {
    ...font('sans', 800),
    fontSize: 7,
    color: '#FFFFFF',
  },
  bfFileName: {
    ...font('sans', 600),
    fontSize: 8.5,
    color: '#2A2722',
  },
  bfUp: {
    marginTop: 14,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#F0C77A',
  },
  buT: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buTHead: {
    ...font('sans', 700),
    fontSize: 10.5,
    color: '#2A2722',
    flex: 1,
    marginRight: 6,
  },
  buTHw: {
    ...font('sans', 600),
    fontSize: 9.5,
    color: '#2F7A4F',
  },
  buB: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F4EBDC',
    marginTop: 6,
    overflow: 'hidden',
  },
  buBFill: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F5A01F',
    borderRadius: 3,
  },
  buS: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  buSTxt: {
    ...font('sans', 500),
    fontSize: 8.5,
    color: '#8A8270',
  },

  // ---------------- Front Cover (Step 0)
  coverWrap: {
    flex: 1,
    backgroundColor: '#152843',
    padding: 24,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(245, 181, 68, 0.35)',
  },
  cTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cLogoWrap: {
    width: 20,
    height: 20,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cTopTxt: {
    ...font('sans', 700),
    fontSize: 10,
    letterSpacing: 2,
    color: '#F5B544',
  },
  cUpsc: {
    ...font('serif', 800),
    fontSize: 64,
    color: '#FFFFFF',
    lineHeight: 64,
    marginTop: 20,
  },
  cYear: {
    ...font('book', 500),
    fontSize: 44,
    color: '#F5B544',
    lineHeight: 44,
  },
  cBand: {
    backgroundColor: '#F5A01F',
    marginHorizontal: -24,
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  cBandTxt: {
    ...font('sans', 800),
    fontSize: 11,
    letterSpacing: 1.5,
    color: '#14161C',
    textAlign: 'center',
  },
  cSvc: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  cSvcTxt: {
    ...font('sans', 700),
    fontSize: 12.5,
    letterSpacing: 1,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  cSvcBullet: {
    color: '#F5A01F',
    fontSize: 14,
  },
  cPub: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    paddingTop: 12,
  },
  cPubBrand: {
    ...font('sans', 700),
    fontSize: 13,
    color: '#FFFFFF',
  },
  cPubSub: {
    ...font('sans', 600),
    fontSize: 9,
    letterSpacing: 1.2,
    color: '#F5B544',
  },

  // ---------------- Tap Hint Pill
  openHintPill: {
    position: 'absolute',
    bottom: -32,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(17, 18, 20, 0.85)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  openHintTxt: {
    ...font('sans', 600),
    fontSize: 12,
    color: '#FFFFFF',
  },

  // ---------------- Bottom Controls Bar
  ctlArea: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 35,
  },
  autobarWrap: {
    height: 2,
    backgroundColor: 'rgba(40, 32, 20, 0.1)',
    borderRadius: 1,
    marginBottom: 10,
    overflow: 'hidden',
  },
  autobarFill: {
    height: '100%',
    backgroundColor: '#111214',
    borderRadius: 1,
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
    borderRadius: 3.5,
    backgroundColor: 'rgba(40, 32, 20, 0.25)',
  },
  dotOn: {
    width: 22,
    backgroundColor: '#111214',
  },
  skLink: {
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  skLinkTxt: {
    ...font('sans', 600),
    fontSize: 13,
    color: '#8A8270',
  },
  rpLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  rpLinkTxt: {
    ...font('sans', 600),
    fontSize: 13,
    color: '#8A8270',
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 44,
    paddingHorizontal: 18,
    borderRadius: 13,
    backgroundColor: '#111214',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  nextBtnTxt: {
    ...font('sans', 600),
    fontSize: 14.5,
    color: '#FFFFFF',
  },
});
