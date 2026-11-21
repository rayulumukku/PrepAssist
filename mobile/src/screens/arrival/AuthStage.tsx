// Source: PrepAssist.html L4940-L5015 (#s-auth static markup)
// Source: PrepAssist.html L5919-L5927 (authTab)
// Source: PrepAssist.html L5955-L5968 (submitAuth)
// Source: PrepAssist.html L5931-L5938 (startCountdown)
// Source: PrepAssist.html L5949-L5954 (pwStrength)
// Source: PrepAssist.html L880-L1210 (the AUTH v4…v18 rules; ported from the computed result)
// The sign-in / create-account stage ("the pledge"). Two layouts on one stage, switched by
// #s-auth.up (S.authMode). Values from reference/android stage-auth-signin and stage-auth-signup.
//
// Not rendered, as in the HTML:
//   #pwS (password strength): `#s-auth #pwS{display:none!important}` (L1146). pwStrength() only writes
//     into the hidden meter, so it is not ported.
//   startCountdown / passTilt: their elements (#cdD…, #passStage) are not in the final markup.
//   `.alt2 > span` ("or continue with") is display:none (L1166).
import React, { useEffect, useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import type { TextInputInstance } from 'react-native';
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
import Svg, { Path } from 'react-native-svg';
import { act } from '../../actions';
import { Field, Logo, PenCTA, Icon } from '../../components';
import { easeVar } from '../../shell/anim';
import { getS, setS, useStore } from '../../store';
import type { AuthFieldId } from '../../store/slices/arrival';
import { font, palettes } from '../../theme';
import { Txt } from '../../theme/Txt';
import { AuthBg } from './AuthBg';
import { Ul } from './Ul';

const C = palettes.free;
/** #s-auth .letter colour (inputs inherit it) */
const LETTER_INK = 'rgb(42, 39, 34)';
const H_INK = '#14161C';
const GOLD = '#B86E00';
const LABEL_GREY = '#8A909B';

const AnimatedPath = Animated.createAnimatedComponent(Path);

// ---------------------------------------------------------------- animations

/** @keyframes penW2 (L1031): .9s ease-in-out, restarted by submitAuth's .signing. */
const EASE_IN_OUT = Easing.bezier(0.42, 0, 0.58, 1);
function usePenWiggle(n: number) {
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const r = useSharedValue(0);
  useEffect(() => {
    if (!n) return;
    const seg = (v: number) => withTiming(v, { duration: 225, easing: EASE_IN_OUT });
    x.value = 0;
    y.value = 0;
    r.value = 0;
    x.value = withSequence(seg(-4), seg(6), seg(-2), seg(0));
    y.value = withSequence(seg(-3), seg(1), seg(-2), seg(0));
    r.value = withSequence(seg(-1.5), seg(0.8), seg(-1), seg(0));
  }, [n, x, y, r]);
  return useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { translateY: y.value }, { rotate: `${r.value}deg` }],
  }));
}

/** #s-auth .au-form.on{animation:formIn .45s var(--ease)} (L439-L440): from opacity 0, translateY 8px. */
function FormIn({ children, style }: { children: React.ReactNode; style?: object }): React.JSX.Element {
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withTiming(1, { duration: 450, easing: easeVar });
  }, [p]);
  const a = useAnimatedStyle(() => ({ opacity: p.value, transform: [{ translateY: 8 * (1 - p.value) }] }));
  return <Animated.View style={[style, a]}>{children}</Animated.View>;
}

/** .pl-days i{animation:live 1.6s infinite} (L661, L975): ring 0 -> 7px at 70 %, alpha .6 -> 0, `ease` per segment. */
const EASE = Easing.bezier(0.25, 0.1, 0.25, 1);
function LiveDot(): React.JSX.Element {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withRepeat(
      withSequence(withTiming(1, { duration: 1120, easing: EASE }), withTiming(2, { duration: 480, easing: EASE })),
      -1,
    );
  }, [t]);
  const ring = useAnimatedStyle(() => {
    const k = t.value <= 1 ? t.value : 0;
    const s = t.value <= 1 ? 7 * k : 0;
    return {
      top: -s,
      left: -s,
      right: -s,
      bottom: -s,
      borderRadius: 3 + s,
      backgroundColor: `rgba(245, 160, 31, ${t.value <= 1 ? 0.6 * (1 - k) : 0})`,
    };
  });
  return (
    <View style={styles.dot}>
      <Animated.View style={[styles.dotRing, ring]} />
      <View style={styles.dotCore} />
    </View>
  );
}

/** .und path: stroke-dasharray 1 (pathLength 1), dashoffset 1 -> 0, `sign .9s .6s cubic-bezier(.5,.1,.3,1) forwards` (L1039). */
const UND_LEN = 195.123; // length of the path in its viewBox units
function SignedUnderline(): React.JSX.Element {
  const off = useSharedValue(UND_LEN);
  useEffect(() => {
    off.value = withDelay(600, withTiming(0, { duration: 900, easing: Easing.bezier(0.5, 0.1, 0.3, 1) }));
  }, [off]);
  const props = useAnimatedProps(() => ({ strokeDashoffset: off.value }));
  return (
    <Svg style={styles.undSvg} viewBox="0 0 200 14" preserveAspectRatio="none">
      <AnimatedPath
        d="M3 9 C 40 3, 90 3, 130 7 S 185 11, 197 5"
        fill="none"
        stroke="#F5A01F"
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray={[UND_LEN, UND_LEN]}
        animatedProps={props}
      />
    </Svg>
  );
}

// ---------------------------------------------------------------- pieces

function GoogleMark(): React.JSX.Element {
  return (
    <Svg width={16} height={16} viewBox="0 0 48 48">
      <Path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <Path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <Path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <Path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </Svg>
  );
}

function AppleMark(): React.JSX.Element {
  return (
    <Svg width={15} height={15} viewBox="0 0 24 24" fill="#111">
      <Path d="M16.4 12.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.6 1.3-.1 1.8-.8 3.3-.8 1.6 0 2 .8 3.4.8 1.4 0 2.3-1.3 3.1-2.5 1-1.4 1.4-2.8 1.4-2.9-.1 0-2.7-1-2.7-4.1zM13.9 5c.7-.9 1.2-2 1.1-3.2-1 0-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.1 1.1.1 2.3-.6 3-1.5z" />
    </Svg>
  );
}

/** .pl-foot (L5010-L5013) */
function Foot({ up }: { up: boolean }): React.JSX.Element {
  return (
    <View style={up ? styles.footUp : styles.foot}>
      <View style={[styles.alt2, up && styles.alt2Up]}>
        <Ul
          onPress={() => act('social:Google')}
          before={<GoogleMark />}
          label="Google"
          textStyle={styles.socU}
          testID="auth.social.google"
        />
        <Ul
          onPress={() => act('social:Apple')}
          before={<AppleMark />}
          label="Apple"
          textStyle={styles.socU}
          testID="auth.social.apple"
        />
      </View>
      <Txt style={[styles.fine, up && styles.fineUp]}>
        By continuing you agree to PrepAssist’s{' '}
        <Txt style={styles.fineA} onPress={() => act('push:legal:terms')}>
          Terms
        </Txt>{' '}
        &amp;{' '}
        <Txt style={styles.fineA} onPress={() => act('push:legal:privacy')}>
          Privacy Policy
        </Txt>
        .
      </Txt>
    </View>
  );
}

/** One `.fl` of the letter (#s-auth .letter .fl, L993-L996; Field header). */
function AuthField({
  id,
  label,
  secure,
  up,
  prefix,
  placeholder,
  inputRef,
  keyboardType,
}: {
  id: AuthFieldId;
  label: string;
  secure?: boolean;
  up: boolean;
  prefix?: string;
  placeholder?: string;
  inputRef?: React.Ref<TextInputInstance>;
  keyboardType?: 'email-address' | 'phone-pad';
}): React.JSX.Element {
  const value = useStore(s => s.authF[id]);
  const err = useStore(s => s.authErr.includes(id));
  return (
    <Field
      // Field spreads its other props onto the TextInput; in React 19 `ref` is such a prop.
      {...(inputRef ? ({ ref: inputRef } as object) : null)}
      label={label}
      value={value}
      onChangeText={v => setS(s => ({ authF: { ...s.authF, [id]: v } }))}
      error={err}
      secureTextEntry={secure}
      prefix={prefix}
      placeholder={placeholder}
      keyboardType={keyboardType}
      autoCapitalize={keyboardType === 'email-address' || secure ? 'none' : undefined}
      radius={14}
      focusColor="#1B8AD3"
      focusRingWidth={3}
      errorBorder={false}
      focusOverError
      style={up ? styles.flUp : styles.flIn}
      inputStyle={up ? styles.inputUp : styles.inputIn}
      testID={`auth.${id}`}
    />
  );
}

// ---------------------------------------------------------------- stage

function AuthStage(): React.JSX.Element {
  const mode = useStore(s => s.authMode);
  const up = mode === 'up';
  // a stage that becomes display:block again restarts its CSS animations (formIn, the underline)
  const shown = useStore(s => (s.stage === 'auth' ? s.stageShown : -1));
  const formIn = useStore(s => s.authFormIn);
  const signing = useStore(s => s.authSigning);
  const focusN = useStore(s => s.authFocus);
  const nameRef = useRef<TextInputInstance>(null);
  const wiggle = usePenWiggle(signing);

  // authTab('up'): setTimeout(() => $('#upName').focus({ preventScroll: true }), 400)
  useEffect(() => {
    if (focusN && getS().authMode === 'up') nameRef.current?.focus();
  }, [focusN]);

  const inBody = (
    <View style={styles.wrap}>
      <View style={styles.halo} />
      <View style={styles.top}>
        <View style={styles.logo}>
          <Logo size={44} />
        </View>
        <View style={styles.name}>
          <Txt style={styles.nameT}>PrepAssist</Txt>
          <Txt style={styles.nameS}>Civil Services · 2027</Txt>
        </View>
      </View>
      <View style={styles.h1}>
        <Txt style={styles.h1T}>Every officer</Txt>
        <View style={styles.h1Row}>
          <Txt style={styles.h1T}>once </Txt>
          <View style={styles.und}>
            <Txt style={[styles.h1T, styles.h1Em]}>signed in.</Txt>
            <SignedUnderline key={shown} />
          </View>
        </View>
      </View>
      <View style={styles.days}>
        <LiveDot />
        <Txt style={styles.daysT}>Your preparation, one desk</Txt>
      </View>
      <View style={styles.letter}>
        <Txt style={styles.ltK}>Aspirant’s register · CSE 2027</Txt>
        <Txt style={[styles.ltT, styles.ltTIn]}>Welcome back</Txt>
        <View style={styles.seg}>
          <View style={styles.segPill} />
          <Pressable onPress={() => act('authTab:in')} style={styles.segB} testID="auth.tab.in">
            <Txt style={[styles.segT, styles.segOn]}>Sign in</Txt>
          </Pressable>
          <Pressable onPress={() => act('authTab:up')} style={styles.segB} testID="auth.tab.up">
            <Txt style={styles.segT}>Create account</Txt>
          </Pressable>
        </View>
        <FormIn key={`${shown}.${formIn}`} style={styles.formIn}>
          <AuthField id="inEmail" label="Email" up={false} keyboardType="email-address" />
          <AuthField id="inPw" label="Password" secure up={false} />
          <View style={styles.flRow}>
            <Ul label="Forgot password?" textStyle={styles.fg} onPress={() => act('forgot')} testID="auth.forgot" />
          </View>
        </FormIn>
      </View>
      <Animated.View style={[styles.penRow, wiggle]}>
        <PenCTA label="Sign in" onPress={() => act('signin')} testID="auth.signin" />
      </Animated.View>
      <Foot up={false} />
    </View>
  );

  const upBody = (
    <ScrollView
      style={styles.fill}
      contentContainerStyle={styles.wrapUp}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">
      <View style={styles.letterUp}>
        <View style={styles.upBar}>
          <Pressable onPress={() => act('authTab:in')} style={styles.upBack} accessibilityLabel="Back to sign in" testID="auth.back">
            <Icon name="back" color={C.ink} />
          </Pressable>
          <View style={styles.upHero}>
            <View style={styles.upLogo}>
              <Logo size={36} />
            </View>
            <Txt style={styles.upB}>PrepAssist</Txt>
            <Txt style={styles.upSmall}>Civil Services · 2027</Txt>
          </View>
        </View>
        <Txt style={[styles.ltK, styles.ltKUp]}>Aspirant’s register · CSE 2027</Txt>
        <Txt style={[styles.ltT, styles.ltTUp]}>Create your account</Txt>
        <FormIn key={`${shown}.${formIn}`} style={styles.formUp}>
          <AuthField id="upName" label="Full name" up inputRef={nameRef} />
          <AuthField id="upPhone" label="Phone number" prefix="+91" placeholder="Phone number" up keyboardType="phone-pad" />
          <AuthField id="upEmail" label="Email" up keyboardType="email-address" />
          <AuthField id="upPw" label="Password" secure up />
          <AuthField id="upPw2" label="Confirm password" secure up />
          <View style={styles.upAlt}>
            <Txt style={styles.upAltT}>Already registered? </Txt>
            <Ul label="Sign in" textStyle={styles.upAltA} onPress={() => act('authTab:in')} testID="auth.upAlt" />
          </View>
          <Animated.View style={[styles.btnUp, wiggle]}>
            <PenCTA label="Create account" onPress={() => act('signup')} testID="auth.signup" />
          </Animated.View>
        </FormIn>
      </View>
      <Foot up />
    </ScrollView>
  );

  return (
    <View style={[styles.stage, up && styles.stageUp]} testID="auth">
      {up ? null : <AuthBg />}
      {up ? upBody : inBody}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  // #s-auth background (computed rgb(244,247,251)); #s-auth.up{background:#fff!important} (L1121)
  stage: { flex: 1, backgroundColor: '#F4F7FB', overflow: 'hidden' },
  stageUp: { backgroundColor: '#fff' },
  // .pl-wrap: column, padding 10 22 12 (sat / sab added by the CSS: zero in the reference)
  wrap: { flex: 1, paddingTop: 10, paddingHorizontal: 22, paddingBottom: 12 },
  // #s-auth.up .pl-wrap: padding 4 22 0, overflow-y auto
  wrapUp: { flexGrow: 1, paddingTop: 4, paddingHorizontal: 22 },
  // .pl-halo{height:0;flex:none;margin-top:auto}
  halo: { height: 0, flexShrink: 0, marginTop: 'auto' },
  // .pl-top: column, centred, gap 12
  top: { alignItems: 'center', gap: 12 },
  // .pl-logo: 72, radius 22, white, three shadows
  logo: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow:
      '0px 0px 0px 8px rgba(255, 255, 255, 0.55), 0px 0px 0px 9px rgba(27, 138, 211, 0.1), 0px 18px 36px -14px rgba(27, 138, 211, 0.55)',
  },
  name: { alignItems: 'center' },
  // .pl-name: Inter Tight 800 22px / 22px, -0.66px
  nameT: { ...font('serif', 800), fontSize: 22, lineHeight: 22, letterSpacing: -0.66, color: C.ink, textAlign: 'center' },
  // .pl-name small: block, margin-top 6, Inter 600 10.5px / 10.5px, 3.15px, uppercase, #B86E00
  nameS: {
    ...font('sans', 600),
    fontSize: 10.5,
    lineHeight: 10.5,
    letterSpacing: 3.15,
    textTransform: 'uppercase',
    color: GOLD,
    marginTop: 6,
    textAlign: 'center',
  },
  // h1.pl-h: margin 22 0 4, EB Garamond 500 34px / 36.72px, -0.34px, #14161C, centred
  h1: { marginTop: 22, marginBottom: 4, alignItems: 'center' },
  h1Row: { flexDirection: 'row' },
  h1T: { ...font('book', 500), fontSize: 34, lineHeight: 36.72, letterSpacing: -0.34, color: H_INK, textAlign: 'center' },
  // em.und: italic, --brand (#1B8AD3)
  h1Em: { ...font('book', 500, true), color: '#1B8AD3' },
  und: { position: 'relative' },
  // .und svg: absolute, left 0 right 0, bottom -6px, height 12px
  undSvg: { position: 'absolute', left: 0, right: 0, bottom: -6, height: 12 },
  // .pl-days: margin 12 0 auto, row centred, gap 8, Inter 700 12.5px / 18.125px, 2.5px, uppercase, #8A909B
  days: { marginTop: 12, marginBottom: 'auto', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  daysT: {
    ...font('sans', 700),
    fontSize: 12.5,
    lineHeight: 18.125,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    color: LABEL_GREY,
  },
  dot: { width: 6, height: 6 },
  dotCore: { ...StyleSheet.absoluteFill, borderRadius: 3, backgroundColor: '#F5A01F' },
  dotRing: { position: 'absolute' },
  // .letter: margin-top 26, white, radius 20, padding 20 18 18, two shadows, colour rgb(42,39,34)
  letter: {
    flexShrink: 0,
    marginTop: 26,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 18,
    paddingBottom: 18,
    boxShadow: '0px 0px 0px 1px rgba(20, 30, 50, 0.06), 0px 24px 48px -24px rgba(20, 40, 80, 0.28)',
  },
  // #s-auth.up .letter: flex 1 0 auto, no box, padding 6 0 0
  letterUp: { flexGrow: 1, flexShrink: 0, paddingTop: 6 },
  // .lt-k: Inter 700 9.5px / 13.775px, 2.09px, uppercase, #8A909B, padding-right 60, margin-bottom 4
  ltK: {
    ...font('sans', 700),
    fontSize: 9.5,
    lineHeight: 13.775,
    letterSpacing: 2.09,
    textTransform: 'uppercase',
    color: LABEL_GREY,
    paddingRight: 60,
    marginBottom: 4,
  },
  // #s-auth.up .lt-k: margin 12 0 6, text-align left
  ltKUp: { marginTop: 12, marginBottom: 6, textAlign: 'left' },
  // .lt-t: Inter Tight 800 28px / 40.6px, -0.84px, #14161C
  ltT: { ...font('serif', 800), fontSize: 28, lineHeight: 40.6, letterSpacing: -0.84, color: H_INK },
  ltTIn: { marginTop: 2 },
  ltTUp: { marginTop: 4 },
  // .seg.seg3: grid 2 x 162, padding 4, radius 14, #F1F3F7, margin 14 0
  seg: { flexDirection: 'row', padding: 4, borderRadius: 14, backgroundColor: '#F1F3F7', marginVertical: 14 },
  // .seg-pill: absolute, top/left/bottom 4, width 50 % - 4, radius 10, white, shadow
  segPill: {
    position: 'absolute',
    top: 4,
    left: 4,
    bottom: 4,
    width: '50%',
    marginRight: 4,
    borderRadius: 10,
    backgroundColor: '#fff',
    boxShadow: '0px 2px 8px -2px rgba(20, 30, 50, 0.18)',
  },
  segB: { flex: 1, height: 40, alignItems: 'center', justifyContent: 'center' },
  // .seg button: Inter 600 14.5px / 21.025px, --muted; .on --ink
  segT: { ...font('sans', 600), fontSize: 14.5, lineHeight: 21.025, color: C.muted, textAlign: 'center' },
  segOn: { color: C.ink },
  formIn: { flexShrink: 0 },
  // #s-auth.up #fUp: flex 1 0 auto, padding-top 10
  formUp: { flexGrow: 1, flexShrink: 0, paddingTop: 10 },
  // #s-auth .letter .fl{margin-bottom:10px}; #s-auth.up .letter .fl{margin-bottom:12px}
  flIn: { marginBottom: 10 },
  flUp: { marginBottom: 12 },
  // input: colour of .letter; padding-top 20 (sign in) / 18 (sign up), height 54
  inputIn: { color: LETTER_INK, paddingTop: 20 },
  inputUp: { color: LETTER_INK, paddingTop: 18 },
  // .fl-row: flex-end, margin-bottom 4
  flRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 4 },
  // a.ul.fg: Inter 600 12.5px / 18.125px, --ink-2
  fg: { ...font('sans', 600), fontSize: 12.5, lineHeight: 18.125, color: C.ink2 },
  // .pen-row{margin-top:18px}
  penRow: { marginTop: 18 },
  // .pl-foot: padding-top 12, centred, --muted
  foot: { paddingTop: 12 },
  // #s-auth.up .pl-foot: padding 16 0 18
  footUp: { paddingTop: 16, paddingBottom: 18 },
  // .alt2: row centred, gap 14 (18 in .up)
  alt2: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 14 },
  alt2Up: { gap: 18 },
  // .soc u: Inter 600 13.5px / 19.575px, --ink
  socU: { ...font('sans', 600), fontSize: 13.5, lineHeight: 19.575, color: C.ink },
  // .au-fine: margin-top 8 (14 and opacity .8 in .up), Inter 400 10.5px / 15.75px, centred, --muted
  fine: { marginTop: 8, fontSize: 10.5, lineHeight: 15.75, color: C.muted, textAlign: 'center' },
  fineUp: { marginTop: 14, opacity: 0.8 },
  fineA: { color: C.ink2, textDecorationLine: 'underline' },
  // .up-bar: row centred, align flex-start, padding 6 0 14
  upBar: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', paddingTop: 6, paddingBottom: 14 },
  // .up-back: absolute left 0 top 6, 38 x 38, radius 12, 1px #E3E7ED
  upBack: {
    position: 'absolute',
    left: 0,
    top: 6,
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E3E7ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  upHero: { alignItems: 'center' },
  // .up-logo: 60, radius 19, white, shadows
  upLogo: {
    width: 60,
    height: 60,
    borderRadius: 19,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 0px 0px 6px #F1F6FC, 0px 14px 28px -12px rgba(27, 138, 211, 0.55)',
  },
  // .up-hero b: Inter Tight 800 20px / 29px, -0.6px, margin-top 12
  upB: { ...font('serif', 800), fontSize: 20, lineHeight: 29, letterSpacing: -0.6, marginTop: 12, color: LETTER_INK, textAlign: 'center' },
  // .up-hero small: Inter 700 9.5px / 13.775px, 2.66px, uppercase, #B86E00, margin-top 3
  upSmall: {
    ...font('sans', 700),
    fontSize: 9.5,
    lineHeight: 13.775,
    letterSpacing: 2.66,
    textTransform: 'uppercase',
    color: GOLD,
    marginTop: 3,
    textAlign: 'center',
  },
  // .up-alt: margin 6 0 22, centred, 12.5px / 18.125px --muted; a: 600 --ink-2, underline offset 4
  upAlt: { flexDirection: 'row', justifyContent: 'center', marginTop: 6, marginBottom: 22 },
  upAltT: { fontSize: 12.5, lineHeight: 18.125, color: C.muted },
  upAltA: { ...font('sans', 600), fontSize: 12.5, lineHeight: 18.125, color: C.ink2 },
  // #s-auth.up #btnUp{margin-top:auto}
  btnUp: { marginTop: 'auto' },
});

export default AuthStage;
