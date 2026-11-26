// Source: PrepAssist.html L8542-L8542 (VIEWS.onestep)
// Source: PrepAssist.html L8555-L8679 (stepHTML)
// Source: PrepAssist.html L8514-L8541 (stPlay)
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, G, LinearGradient, Path, RadialGradient, Rect, Stop } from 'react-native-svg';
import { act } from '../../actions';
import { Icon } from '../../components';
import type { ViewDef } from '../../navigation/routes';
import { getS } from '../../store';
import { font, Txt, useInsets } from '../../theme';
import { stPlay, stStop } from './stepSound';

function OnestepScreen(): React.JSX.Element {
  const { sat, sab } = useInsets();
  const isZero = getS().insetsMode === 'zero';
  const [sndOn, setSndOn] = useState(true);
  const [phase, setPhase] = useState(() => (isZero ? 4 : 0));

  useEffect(() => {
    if (isZero) return;
    stPlay();
    const t1 = setTimeout(() => setPhase(1), 1500);
    const t2 = setTimeout(() => setPhase(2), 3500);
    const t3 = setTimeout(() => setPhase(3), 6500);
    const t4 = setTimeout(() => setPhase(4), 9000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      stStop();
    };
  }, [isZero]);

  const toggleSound = (): void => {
    if (sndOn) {
      stStop();
      setSndOn(false);
    } else {
      stPlay();
      setSndOn(true);
    }
  };

  return (
    <View style={s.wrap} testID="view.onestep">
      <Pressable style={[s.closeBtn, { top: Math.max(48, sat) }]} onPress={() => act('back')} testID="onestep.close">
        <Icon name="close" size={16} color="#E2C48C" />
      </Pressable>

      <Pressable style={[s.sndBtn, { top: Math.max(48, sat) }]} onPress={toggleSound} testID="onestep.sound">
        <Icon name={sndOn ? 'volume' : 'x'} size={16} color="#E2C48C" />
      </Pressable>

      {/* Top watermark */}
      <View style={[s.mark, { top: Math.max(54, sat + 6) }]}>
        <View style={s.markDot} />
        <Txt style={s.markTxt}>PrepAssist · CSE 2027</Txt>
      </View>

      <View style={s.canvas}>
        <Svg width="100%" height="100%" viewBox="0 0 360 560" preserveAspectRatio="xMidYMax slice">
          <Defs>
            <LinearGradient id="s4Sky" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#0E0A22" />
              <Stop offset="0.3" stopColor="#231A45" />
              <Stop offset="0.52" stopColor="#46325F" />
              <Stop offset="0.7" stopColor="#7E5670" />
              <Stop offset="0.85" stopColor="#C49482" />
              <Stop offset="1" stopColor="#E9CFB4" />
            </LinearGradient>
            <RadialGradient id="s4Halo" cx="180" cy="215" r="210" gradientUnits="userSpaceOnUse">
              <Stop offset="0" stopColor="#FFF8E8" />
              <Stop offset="0.18" stopColor="#FFE3B4" stopOpacity="0.9" />
              <Stop offset="0.45" stopColor="#FFB3A2" stopOpacity="0.35" />
              <Stop offset="1" stopColor="#FF9FB0" stopOpacity="0" />
            </RadialGradient>
            <LinearGradient id="s4Shaft" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor="#A994D4" />
              <Stop offset="0.3" stopColor="#F4EEFF" />
              <Stop offset="0.48" stopColor="#FFFFFF" />
              <Stop offset="0.75" stopColor="#D9CBF0" />
              <Stop offset="1" stopColor="#9A84C6" />
            </LinearGradient>
          </Defs>

          <Rect x="0" y="0" width="360" height="560" fill="url(#s4Sky)" />
          <Circle cx="180" cy="215" r="210" fill="url(#s4Halo)" />

          {/* Dome & Hall */}
          <Path d="M120 180 Q180 120 240 180 Z" fill="#D3C3EE" opacity="0.6" />
          <Rect x="100" y="180" width="160" height="20" fill="#E4D7F7" />

          {/* Columns */}
          {Array.from({ length: 8 }, (_, i) => {
            const x = 110 + i * 20;
            return <Rect key={i} x={x} y="200" width="10" height="80" fill="url(#s4Shaft)" />;
          })}

          {/* Steps */}
          {Array.from({ length: 6 }, (_, i) => {
            const y = 280 + i * 15;
            const hw = 90 + i * 12;
            return (
              <G key={i}>
                <Rect x={180 - hw} y={y} width={hw * 2} height="14" fill="#EDE3FB" />
                <Rect x={180 - hw} y={y} width={hw * 2} height="2" fill="#FFFFFF" opacity="0.85" />
              </G>
            );
          })}

          {/* Aspirant silhouette walking */}
          <G transform="translate(180 340)">
            <Circle cx="0" cy="-35" r="6" fill="#2B2158" />
            <Rect x="-5" y="-28" width="10" height="20" rx="3" fill="#2B2158" />
            <Path d="M-4 -8 L-7 12 M4 -8 L7 12" stroke="#2B2158" strokeWidth="3" strokeLinecap="round" />
          </G>
        </Svg>
      </View>

      {phase < 4 ? (
        <View style={s.copyOverlay}>
          {phase < 2 && (
            <Txt style={s.copyLine}>
              Every year, <Txt style={s.copyEm}>lakhs</Txt> dream of it.
            </Txt>
          )}
          {phase >= 2 && (
            <Txt style={s.copyLine}>
              It takes <Txt style={s.copyEm}>one step</Txt> to stand apart.
            </Txt>
          )}
        </View>
      ) : (
        <View style={[s.endCard, { paddingBottom: Math.max(40, sab + 12) }]}>
          <View style={s.rule} />
          <Txt style={s.eb}>Day 239 · 126 days to Prelims</Txt>
          <Txt style={s.title}>
            You took it.{'\n'}
            <Txt style={s.titleEm}>Take one more today.</Txt>
          </Txt>
          <Txt style={s.subText}>
            The nation needs its next officer — one lecture, one PYQ, one answer at a time.
          </Txt>
          <Pressable style={s.ctaBtn} onPress={() => act('stepGo')} testID="onestep.go">
            <Txt style={s.ctaBtnTx}>TAKE TODAY’S STEP</Txt>
            <Icon name="arrow" size={15} color="#1A1230" />
          </Pressable>
          <Pressable style={s.replayBtn} onPress={() => act('stepReplay')} testID="onestep.replay">
            <Icon name="refresh" size={14} color="rgba(214,182,122,0.85)" />
            <Txt style={s.replayBtnTx}>WATCH AGAIN</Txt>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { ...StyleSheet.absoluteFill, backgroundColor: '#0E0A22' },
  closeBtn: {
    position: 'absolute',
    top: 48,
    left: 20,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(214,182,122,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sndBtn: {
    position: 'absolute',
    top: 48,
    right: 20,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(214,182,122,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mark: {
    position: 'absolute',
    top: 54,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    zIndex: 4,
  },
  markDot: { width: 4.5, height: 4.5, borderRadius: 2.25, backgroundColor: '#D6B67A' },
  markTxt: { ...font('sans', 600), fontSize: 10.5, letterSpacing: 2, color: 'rgba(214,182,122,0.75)', textTransform: 'uppercase' },
  canvas: { ...StyleSheet.absoluteFill },
  copyOverlay: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 90,
    alignItems: 'center',
  },
  copyLine: {
    ...font('book', 400),
    fontSize: 24,
    lineHeight: 30,
    color: '#F6ECDD',
    textAlign: 'center',
  },
  copyEm: {
    color: '#E2C48C',
    fontStyle: 'italic',
  },
  endCard: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 32,
    paddingBottom: 40,
    paddingTop: 80,
    alignItems: 'center',
    backgroundColor: 'rgba(14,10,34,0.92)',
  },
  rule: { width: 44, height: 1, backgroundColor: '#D6B67A', marginBottom: 14, opacity: 0.8 },
  eb: { ...font('sans', 600), fontSize: 9.5, letterSpacing: 3, color: '#D6B67A', textTransform: 'uppercase' },
  title: { ...font('book', 400), fontSize: 30, lineHeight: 34, color: '#F6ECDD', textAlign: 'center', marginTop: 10 },
  titleEm: { color: '#E2C48C', fontStyle: 'italic' },
  subText: { ...font('sans', 400), fontSize: 13, lineHeight: 18, color: 'rgba(246,236,221,0.62)', textAlign: 'center', maxWidth: 280, marginTop: 8 },
  ctaBtn: {
    marginTop: 22,
    width: '100%',
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E9D3A2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#D6B67A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 6,
  },
  ctaBtnTx: { ...font('sans', 700), fontSize: 13, letterSpacing: 1.5, color: '#1A1230' },
  replayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  replayBtnTx: { ...font('sans', 600), fontSize: 11.5, letterSpacing: 1.5, color: 'rgba(214,182,122,0.85)' },
});

const view: ViewDef = {
  Screen: OnestepScreen,
};

export default view;
