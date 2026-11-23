// Source: PrepAssist.html L8542-L8542 (VIEWS.onestep)
// Source: PrepAssist.html L8555-L8679 (stepHTML)
// Source: PrepAssist.html L8514-L8541 (stPlay)
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, G, LinearGradient, Path, RadialGradient, Rect, Stop } from 'react-native-svg';
import { act } from '../../actions';
import { Icon } from '../../components';
import type { ViewDef } from '../../navigation/routes';
import { font, Txt } from '../../theme';
import { stPlay, stStop } from './stepSound';

function OnestepScreen(): React.JSX.Element {
  const [sndOn, setSndOn] = useState(true);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
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
  }, []);

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
      <Pressable style={s.closeBtn} onPress={() => act('back')} testID="onestep.close">
        <Icon name="close" size={18} color="#FFFFFF" />
      </Pressable>

      <Pressable style={s.sndBtn} onPress={toggleSound} testID="onestep.sound">
        <Icon name={sndOn ? 'volume' : 'x'} size={18} color="#FFFFFF" />
      </Pressable>

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

      <View style={s.textOverlay}>
        {phase < 2 ? (
          <View style={s.msgBox}>
            <Txt style={s.msgSub}>A JOURNEY OF A THOUSAND MILES</Txt>
            <Txt style={s.msgTitle}>Every morning, thousands begin.</Txt>
          </View>
        ) : phase === 2 ? (
          <View style={s.msgBox}>
            <Txt style={s.msgSub}>THE HORIZON</Txt>
            <Txt style={s.msgTitle}>A syllabus so vast, most get lost.</Txt>
          </View>
        ) : phase === 3 ? (
          <View style={s.msgBox}>
            <Txt style={s.msgSub}>YOUR PATH</Txt>
            <Txt style={s.msgTitle}>Focus on the one step in front of you.</Txt>
          </View>
        ) : (
          <View style={s.msgBox}>
            <Txt style={s.msgSub}>TODAY</Txt>
            <Txt style={s.msgTitle}>PrepAssist · One step closer today.</Txt>
            <View style={s.btnRow}>
              <Pressable style={s.goBtn} onPress={() => act('stepGo')} testID="onestep.go">
                <Txt style={s.goBtnTx}>Take today’s step</Txt>
                <Icon name="arrow" size={16} color="#FFFFFF" />
              </Pressable>
              <Pressable style={s.replayBtn} onPress={() => act('stepReplay')} testID="onestep.replay">
                <Icon name="refresh" size={18} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { ...StyleSheet.absoluteFill, backgroundColor: '#0E0A22' },
  closeBtn: { position: 'absolute', top: 48, left: 20, zIndex: 10, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  sndBtn: { position: 'absolute', top: 48, right: 20, zIndex: 10, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  canvas: { ...StyleSheet.absoluteFill },
  textOverlay: { position: 'absolute', left: 20, right: 20, bottom: 48, alignItems: 'center' },
  msgBox: { width: '100%', alignItems: 'center' },
  msgSub: { ...font('sans', 800), fontSize: 11, letterSpacing: 2, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' },
  msgTitle: { ...font('book', 500), fontSize: 26, lineHeight: 32, color: '#FFFFFF', textAlign: 'center', marginTop: 10 },
  btnRow: { flexDirection: 'row', gap: 10, marginTop: 24, width: '100%' },
  goBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 50, borderRadius: 14, backgroundColor: '#1B8AD3' },
  goBtnTx: { ...font('sans', 700), fontSize: 14.5, color: '#FFFFFF' },
  replayBtn: { width: 50, height: 50, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
});

const view: ViewDef = {
  Screen: OnestepScreen,
};

export default view;
