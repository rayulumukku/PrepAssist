// Source: PrepAssist.html L6512-L6513 (VIEWS.lesson .video: svg.bg, .play, .tc, .bar), L2952-L2957 (.video, svg.bg, .play, .bar, .tc)
// The lecture player of the lesson view. Computed (reference/android/view-lesson):
//   .video  372 x 209.25 (16:9), margin 0 20px, radius 12, overflow hidden, background #25272D
//   svg.bg  fills the box, viewBox 0 0 320 180, xMidYMid slice, font-family 'Inter Tight' (markup in html.txt)
//   .play   46 x 46 round, --brand, at right 16 / bottom 24 (the final rules move it to the corner), ic('play') #fff
//   .tc     right 14, bottom 22, Inter 11.5px / 16.675px, #fff, opacity .8, tabular numbers
//   .bar    left 14, right 14, bottom 12, 3px, rgba(255,255,255,.2), radius 2, opacity .85; i 65% #fff radius 2
// SVG text faces: 'Inter Tight' 700 -> InterTight-Bold, weight 400 (not loaded) -> InterTight-Medium.
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { G, Rect, Text as SvgText } from 'react-native-svg';
import { act } from '../../../actions';
import { Icon } from '../../../components';
import { font, Txt, useTheme } from '../../../theme';

const BOLD = font('serif', 700).fontFamily;
const REG = font('serif', 400).fontFamily;

const styles = StyleSheet.create({
  video: { marginHorizontal: 20, aspectRatio: 16 / 9, borderRadius: 12, overflow: 'hidden', backgroundColor: '#25272D' },
  play: { position: 'absolute', right: 16, bottom: 24, width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  tc: { position: 'absolute', right: 14, bottom: 22, opacity: 0.8, color: '#FFFFFF', fontSize: 11.5, lineHeight: 16.675, fontVariant: ['tabular-nums'] },
  bar: { position: 'absolute', left: 14, right: 14, bottom: 12, height: 3, borderRadius: 2, opacity: 0.85, backgroundColor: 'rgba(255,255,255,0.2)' },
  barI: { width: '65%', height: '100%', borderRadius: 2, backgroundColor: '#FFFFFF' },
});

export function LessonVideo(): React.JSX.Element {
  const t = useTheme();
  return (
    <View style={styles.video}>
      <Svg style={StyleSheet.absoluteFill} viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice">
        <Rect width="320" height="180" fill="#1E2026" />
        <Rect x="18" y="16" width="284" height="148" rx="6" fill="#FFFFFF" />
        <Rect x="18" y="16" width="6" height="148" fill="#1667B0" />
        <SvgText x="40" y="44" fontSize="9" fontFamily={BOLD} fill="#1667B0" letterSpacing="1.5">
          LECTURE 4 · FUNDAMENTAL RIGHTS
        </SvgText>
        <SvgText x="40" y="68" fontSize="17" fontFamily={BOLD} fill="#25272D">
          Article 32 — Right to
        </SvgText>
        <SvgText x="40" y="88" fontSize="17" fontFamily={BOLD} fill="#25272D">
          Constitutional Remedies
        </SvgText>
        <G fontSize="9.5" fill="#4A4E57">
          <SvgText x="40" y="112" fontFamily={REG}>
            • Five writs: HC · M · P · C · QW
          </SvgText>
          <SvgText x="40" y="127" fontFamily={REG}>
            • Art. 226 (High Courts) is wider
          </SvgText>
          <SvgText x="40" y="142" fontFamily={REG}>
            • Suspension under Art. 359
          </SvgText>
        </G>
        <Rect x="212" y="104" width="74" height="44" rx="4" fill="#E8F3FC" />
        <SvgText x="249" y="122" textAnchor="middle" fontSize="8" fontFamily={BOLD} fill="#0F5E99">
          PYQ
        </SvgText>
        <SvgText x="249" y="137" textAnchor="middle" fontSize="12" fontFamily={BOLD} fill="#0F5E99">
          2019 · 2023
        </SvgText>
      </Svg>
      <Pressable
        style={[styles.play, { backgroundColor: t.brand }]}
        onPress={() => act('toast:Playing lecture — 18 min left')}
        accessibilityRole="button"
        testID="lesson.play">
        <Icon name="play" color="#FFFFFF" />
      </Pressable>
      <Txt style={styles.tc}>31:42 / 49:10</Txt>
      <View style={styles.bar}>
        <View style={styles.barI} />
      </View>
    </View>
  );
}
