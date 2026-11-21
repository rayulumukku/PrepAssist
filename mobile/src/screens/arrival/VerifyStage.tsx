// Source: PrepAssist.html L5018-L5073 (#s-verify static markup)
// Source: PrepAssist.html L5616-L5627 (go)
// Source: PrepAssist.html L5972-L5978 (verified)
// Source: PrepAssist.html L5979-L5985 (resend)
// Source: PrepAssist.html L1167-L1191 (VERIFY v2: .vf2, .vf2-main, .vf-ill and its keyframes, .vf2-t, .vf2-p, .vf2-links)
// Values from reference/android stage-verify, stage-verify-resent, stage-verify-verified.
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, Ellipse, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { act } from '../../actions';
import { PenCTA } from '../../components';
import { useTransition } from '../../shell/anim';
import { useStore } from '../../store';
import { font, palettes } from '../../theme';
import { Txt } from '../../theme/Txt';
import { Ul } from './Ul';

const C = palettes.free;
/** .vf-ill{width:280px;height:auto} on a 260 x 200 viewBox */
const ILL_W = 280;
const K = ILL_W / 260;
const ILL_H = 200 * K;
const EASE_IN_OUT = Easing.bezier(0.42, 0, 0.58, 1);

function Layer({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <Svg style={StyleSheet.absoluteFill} viewBox="0 0 260 200">
      {children}
    </Svg>
  );
}

/** svg.vf-ill: drawn as stacked layers so each animated <g> can move on its own. */
function Illustration({ done, run }: { done: boolean; run: number }): React.JSX.Element {
  // .env-g{animation:hvF 5s ease-in-out infinite}  @keyframes hvF{50%{translate:0 -5px}} (user units)
  const hv = useSharedValue(0);
  // .letter-g{transform:translateY(34px);animation:letterUp 1s .3s cubic-bezier(.3,1.3,.5,1) forwards}
  const up = useSharedValue(0);
  // .spx{animation:tw2 3s ease-in-out infinite}  @keyframes tw2{50%{opacity:.35}}
  const tw = useSharedValue(1);
  useEffect(() => {
    hv.value = 0;
    hv.value = withRepeat(
      withSequence(withTiming(1, { duration: 2500, easing: EASE_IN_OUT }), withTiming(0, { duration: 2500, easing: EASE_IN_OUT })),
      -1,
    );
    up.value = 0;
    up.value = withDelay(300, withTiming(1, { duration: 1000, easing: Easing.bezier(0.3, 1.3, 0.5, 1) }));
    tw.value = 1;
    tw.value = withRepeat(
      withSequence(withTiming(0.35, { duration: 1500, easing: EASE_IN_OUT }), withTiming(1, { duration: 1500, easing: EASE_IN_OUT })),
      -1,
    );
  }, [run, hv, up, tw]);
  // .okc,.okp: opacity 0, scale(.4) about (166,74) -> .done: none; transition all .45s cubic-bezier(.3,1.6,.5,1)
  const ok = useTransition(done ? 1 : 0, 450, Easing.bezier(0.3, 1.6, 0.5, 1));

  const envStyle = useAnimatedStyle(() => ({ transform: [{ translateY: -5 * K * hv.value }] }));
  const letterStyle = useAnimatedStyle(() => ({ transform: [{ translateY: 34 * K * (1 - up.value) }] }));
  const okStyle = useAnimatedStyle(() => ({
    opacity: Math.min(1, Math.max(0, ok.value)),
    transform: [{ scale: 0.4 + 0.6 * ok.value }],
  }));
  const spxStyle = useAnimatedStyle(() => ({ opacity: tw.value }));

  return (
    <View style={styles.ill}>
      <Layer>
        <Ellipse cx={130} cy={182} rx={86} ry={8} fill="rgba(27,138,211,.12)" />
      </Layer>
      <Animated.View style={[StyleSheet.absoluteFill, envStyle]}>
        <Layer>
          <Defs>
            <LinearGradient id="envB" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#E8F3FC" />
              <Stop offset="1" stopColor="#CFE5F7" />
            </LinearGradient>
          </Defs>
          <Path d="M52 92 L130 40 L208 92 V170 H52 Z" fill="url(#envB)" />
        </Layer>
        <Animated.View style={[StyleSheet.absoluteFill, letterStyle]}>
          <Layer>
            <Rect x={74} y={54} width={112} height={96} rx={8} fill="#fff" stroke="#E3E7ED" />
            <Rect x={88} y={70} width={58} height={6} rx={3} fill="#D7DCE4" />
            <Rect x={88} y={84} width={82} height={5} rx={2.5} fill="#E6EAF0" />
            <Rect x={88} y={96} width={70} height={5} rx={2.5} fill="#E6EAF0" />
            <Rect x={88} y={112} width={48} height={14} rx={7} fill="#1B8AD3" />
          </Layer>
          <Animated.View style={[styles.okBox, okStyle]}>
            <Svg style={StyleSheet.absoluteFill} viewBox="154 62 24 24">
              <Circle cx={166} cy={74} r={12} fill="#2F9E62" />
              <Path
                d="M160.5 74 l4 4 7.5-7.5"
                fill="none"
                stroke="#fff"
                strokeWidth={2.4}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </Animated.View>
        </Animated.View>
        <Layer>
          <Defs>
            <LinearGradient id="envF" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#2398E0" />
              <Stop offset="1" stopColor="#1679BA" />
            </LinearGradient>
          </Defs>
          <Path d="M52 92 L130 140 L208 92 V170 H52 Z" fill="url(#envF)" />
          <Path d="M52 170 L118 128 M208 170 L142 128" stroke="rgba(255,255,255,.25)" strokeWidth={1.5} />
        </Layer>
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, spxStyle]}>
        <Layer>
          <G>
            <Path d="M34 60 v12 M28 66 h12" stroke="#F5A01F" strokeWidth={2.4} strokeLinecap="round" />
            <Path d="M226 48 v10 M221 53 h10" stroke="#1B8AD3" strokeWidth={2.2} strokeLinecap="round" />
            <Circle cx={222} cy={124} r={3} fill="#F5A01F" />
            <Circle cx={40} cy={132} r={2.5} fill="#9FD0F2" />
          </G>
        </Layer>
      </Animated.View>
    </View>
  );
}

function VerifyStage(): React.JSX.Element {
  const done = useStore(s => s.vfDone);
  const email = useStore(s => s.user.email);
  const resendN = useStore(s => s.resendN);
  // CSS animations restart when the stage is shown again
  const run = useStore(s => (s.stage === 'verify' ? s.stageShown : -1));

  return (
    <View style={styles.stage} testID="verify">
      <View style={styles.vf2}>
        <View style={styles.main}>
          <Illustration done={done} run={run} />
          <Txt style={styles.t}>{done ? 'Email verified' : 'Check your inbox'}</Txt>
          {done ? (
            <Txt style={styles.p}>You’re all set. Your desk is ready.</Txt>
          ) : (
            <View style={styles.pBox}>
              <Txt style={styles.p}>We’ve sent a verification link to</Txt>
              <View style={styles.pRow}>
                <Txt style={[styles.p, styles.pB]}>{email}</Txt>
                <Ul label="Change" textStyle={styles.change} style={styles.changeBox} onPress={() => act('changeEmail')} testID="verify.change" />
              </View>
            </View>
          )}
        </View>
        <View>
          <PenCTA
            label={done ? 'Opening your desk' : 'I’ve verified'}
            accessibilityLabel="I’ve verified my email"
            onPress={() => act('verified')}
            testID="verify.verified"
          />
          <View style={styles.links}>
            <Ul
              label={resendN > 0 ? `Resend in ${resendN}s` : 'Resend link'}
              textStyle={resendN > 0 ? styles.linkOff : styles.link}
              noLine={resendN > 0}
              disabled={resendN > 0}
              onPress={() => act('resend')}
              testID="verify.resend"
            />
            <Txt style={styles.dot}>·</Txt>
            <Ul label="Log out" textStyle={styles.link} onPress={() => act('logout')} testID="verify.logout" />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // #s-verify: radial-gradient(120% 60% at 50% -10%, #DCEBF8 0%, #EEF4FB 45%, #F7F9FC 100%)
  stage: {
    flex: 1,
    backgroundImage: 'radial-gradient(120% 60% at 50% -10%, #DCEBF8 0%, #EEF4FB 45%, #F7F9FC 100%)',
  },
  // .vf2: column, padding 14 22 20 (+ sat / sab)
  vf2: { flex: 1, paddingTop: 14, paddingHorizontal: 22, paddingBottom: 20 },
  // .vf2-main: margin auto 0, column, centred
  main: { marginVertical: 'auto', alignItems: 'center' },
  ill: { width: ILL_W, height: ILL_H },
  okBox: { position: 'absolute', left: 154 * K, top: 62 * K, width: 24 * K, height: 24 * K },
  // .vf2-t: Inter Tight 800 28px / 40.6px, -0.84px, #14161C, margin-top 22
  t: { ...font('serif', 800), fontSize: 28, lineHeight: 40.6, letterSpacing: -0.84, color: '#14161C', marginTop: 22, textAlign: 'center' },
  pBox: { marginTop: 8, alignItems: 'center' },
  // .vf2-p: 15.5px / 24.025px, --muted, centred
  p: { fontSize: 15.5, lineHeight: 24.025, color: C.muted, textAlign: 'center' },
  pRow: { flexDirection: 'row', alignItems: 'baseline' },
  // .vf2-p b: 600 --ink
  pB: { ...font('sans', 600), color: C.ink },
  // a.ul: 14.5px, 600, --ink-2, margin-left 4 after the space between <b> and <a> (computed gap 8.36)
  change: { ...font('sans', 600), fontSize: 14.5, lineHeight: 24.025, color: C.ink2 },
  changeBox: { marginLeft: 8.36 },
  // .vf2-links: row centred, gap 12, margin-top 18, 13.5px / 19.575px --faint
  links: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 18 },
  link: { ...font('sans', 600), fontSize: 13.5, lineHeight: 19.575, color: C.ink2 },
  // .vf2-links .ul[aria-disabled=true]{color:var(--faint);text-decoration:none}
  linkOff: { ...font('sans', 600), fontSize: 13.5, lineHeight: 19.575, color: C.faint },
  dot: { fontSize: 13.5, lineHeight: 19.575, color: C.faint },
});

export default VerifyStage;
