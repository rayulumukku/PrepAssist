// Source: PrepAssist.html L417-L424 (.fl, .fl input, .fl span, :focus, .err, .fl .eye)
// Source: PrepAssist.html L4953-L4962 (auth markup), L7392-L7393 (account markup), L6986-L6986 (A.eye)
// Source: PrepAssist.html L993-L996 (#s-auth .letter .fl …), L1148-L1161 (#s-auth .letter .fl.fl-ph), L3380-L3381 (.ac-sec .fl)
// The floating-label input: `<label class="fl"><input placeholder=" "><span>Label</span></label>`.
//
// Computed, the same in both areas (reference/android: stage-auth-signin, -password-shown,
// -empty-error, stage-auth-signup, -password-typed, -empty-error, -mismatch; view-account-edit):
//   input  100 % x 54, padding 20px 46px 6px 16px, border 1px solid #E3E7ED (the CSS says 1.5px; the
//          computed width is 1px on both viewports), background #fff, Inter 400 15.5px
//   span   absolute, left 17; resting (empty and not focused) top 18, Inter 400 15.5px / 22.475px, #8A909B;
//          floated (focused, or not empty) top 8, Inter 600 11.5px / 16.675px, letter-spacing 0.46px;
//          focused -> the focus colour, otherwise #8A909B; transition all .18s var(--ease)
//   input  transition border .2s, box-shadow .2s (ease)
//   .eye   absolute, right 8 top 9, 38 x 38, centred `eye` icon 20 px in --muted
//
// What differs between the two areas, and the prop that carries it. The defaults are the plain `.fl`
// rules (L417-L424), which is what account renders except for its radius; arrival passes the rest:
//                         account (.ac-sec .fl)             arrival (#s-auth .letter .fl)
//   margin                10px 0 0                          0 0 10px (sign in), 0 0 12px (sign up)   -> style
//   border-radius         12px (L3381)                      14px (L418)                             -> radius
//   text colour           rgb(37,39,45) --ink               rgb(42,39,34) (inherited from the stage) -> inputStyle
//   padding-top           20px                              20px (sign in), 18px (sign up)          -> inputStyle
//   focus border + label  var(--brand)                      #1B8AD3 (L994, L996)                    -> focusColor
//   focus ring            0 0 0 4px var(--brand-tint)       0 0 0 3px var(--brand-tint)             -> focusRingWidth
//   .err                  L423: border --bad and ring       ring 0 0 0 4px --bad-tint only; the     -> errorBorder={false}
//                         0 0 0 4px --bad-tint, also        border keeps #E3E7ED (L993 outranks        focusOverError
//                         while focused (L423 follows       L423) and :focus replaces the ring
//                         L420). Never set by the HTML      and border (L994)
//                         outside arrival: from the CSS.
//   +91 prefix            not used                          `.fl.fl-ph`                              -> prefix
//
// `prefix` is ported as the HTML renders it, which is the arrival version (stage-auth-signup #upPhone):
// <b> absolute, left 17, full height, centred, Inter 600 15.5px --ink-2, padding-right 10, border-right
// 1px #E3E7ED; input padding 0 46px 0 62px; the <span> is display:none (L1159), so no floating label;
// the placeholder shows instead, in #B8BEC8 (L1151). Its paddings win over `inputStyle` (L1160 is
// !important). The plain `.fl.fl-ph` rules (L425-L427) never produce a rendered state and are not ported.
//
// The eye button, as rendered (stage-auth-signin-password-shown, stage-auth-signin-empty-error):
// A.eye flips the input between password and text and then writes the icon into
// `input.nextElementSibling`, which is the label <span>, not the button. So after the first tap the
// label text is replaced by a 20 px `eyeoff` icon (`eye` after the second tap) in the label's colour
// and position, the button keeps its `eye` icon and its aria-label "Show password". Ported like that.
//
// Not ported: `.sheet2 .fl` (L699-L712, no element matches). The caret colour is the text colour, as
// in a browser, on Android only (`cursorColor`); iOS keeps its system tint.
import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import type { StyleProp, TextInputProps, TextStyle, ViewStyle } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle } from 'react-native-reanimated';
import { easeCss, useTransition } from '../shell/anim';
import { font, fontPx } from '../theme/fonts';
import { palettes } from '../theme/tokens';
import { Txt } from '../theme/Txt';
import { useTheme } from '../theme/useTheme';
import { Icon } from './Icon';

export interface FieldProps
  extends Omit<TextInputProps, 'style' | 'value' | 'onChangeText' | 'allowFontScaling' | 'placeholderTextColor'> {
  /** Text of the <span>. With `prefix` the <span> is display:none: pass the input's aria-label ("Phone number"). */
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  /** input.err */
  error?: boolean;
  /** type="password": masks the text and adds the .eye button. */
  secureTextEntry?: boolean;
  /** `.fl.fl-ph`: the text of <b> ("+91"). Pass `placeholder` with it. */
  prefix?: string;
  /** border-radius of the input. Default 14 (L418, arrival); account: 12 (.ac-sec .fl input). */
  radius?: number;
  /** Border and label colour while focused. Default --brand of the plan theme; arrival: '#1B8AD3'. */
  focusColor?: string;
  /** Spread of the focus ring. Default 4; arrival: 3. */
  focusRingWidth?: number;
  /** Whether .err also colours the border --bad. Default true (L423); arrival: false. */
  errorBorder?: boolean;
  /** Whether :focus replaces the .err look. Default false (L423 follows L420); arrival: true (L994). */
  focusOverError?: boolean;
  /** The .fl box: margins from the owning screen. */
  style?: StyleProp<ViewStyle>;
  /** The <input>: colour, padding-top. */
  inputStyle?: StyleProp<TextStyle>;
  /** Set on the input; the eye button gets `<testID>.eye`. */
  testID?: string;
}

/** .fl span colour (L419, L422, L995) */
const LABEL = '#8A909B';
const BORDER = '#E3E7ED';
/** #s-auth .letter .fl.fl-ph input::placeholder (L1151) */
const PLACEHOLDER = '#B8BEC8';
/** .fl input.err ring spread (L423) */
const ERR_RING = 4;
/** .fl span{transition:all .18s var(--ease)} */
const LABEL_MS = 180;
/** .fl input{transition:border .2s,box-shadow .2s} */
const INPUT_MS = 200;

const REST_SIZE = fontPx(15.5);
const FLOAT_SIZE = fontPx(11.5);
const REST_LINE = 22.475;
const FLOAT_LINE = 16.675;
const REST_TOP = 18;
const FLOAT_TOP = 8;
/** letter-spacing .04em of 11.5px */
const FLOAT_SPACING = 0.46;
// font-weight animates 400 -> 600; the browser draws each step with the nearest loaded face
// (CSS font matching: 400 < w <= 500 -> 500, above -> 600).
const FACE_400 = font('sans', 400).fontFamily;
const FACE_500 = font('sans', 500).fontFamily;
const FACE_600 = font('sans', 600).fontFamily;

const AnimatedTxt = Animated.createAnimatedComponent(Txt);

const styles = StyleSheet.create({
  fl: {
    position: 'relative',
  },
  input: {
    width: '100%',
    height: 54,
    paddingTop: 20,
    paddingRight: 46,
    paddingBottom: 6,
    paddingLeft: 16,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#fff',
    ...font('sans', 400),
    fontSize: REST_SIZE,
    color: palettes.free.ink,
    includeFontPadding: false,
  },
  inputPh: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 62,
  },
  ring: {
    position: 'absolute',
    pointerEvents: 'none',
  },
  ringBad: {
    backgroundColor: palettes.free.badTint,
  },
  edge: {
    ...StyleSheet.absoluteFill,
    borderWidth: 1,
    pointerEvents: 'none',
  },
  edgeBad: {
    borderColor: palettes.free.bad,
  },
  label: {
    position: 'absolute',
    left: 17,
    pointerEvents: 'none',
  },
  labelIcon: {
    position: 'absolute',
    left: 17,
    width: 20,
    height: 20,
    pointerEvents: 'none',
  },
  fill: StyleSheet.absoluteFill,
  pre: {
    position: 'absolute',
    left: 17,
    top: 0,
    bottom: 0,
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
    borderRightWidth: 1,
    borderRightColor: BORDER,
    pointerEvents: 'none',
  },
  preText: {
    ...font('sans', 600),
    fontSize: 15.5,
    lineHeight: 22.475,
    color: palettes.free.ink2,
  },
  eye: {
    position: 'absolute',
    right: 8,
    top: 9,
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export function Field({
  label,
  value,
  onChangeText,
  error = false,
  secureTextEntry = false,
  prefix,
  radius = 14,
  focusColor,
  focusRingWidth = 4,
  errorBorder = true,
  focusOverError = false,
  style,
  inputStyle,
  testID,
  onFocus,
  onBlur,
  ...rest
}: FieldProps): React.JSX.Element {
  const theme = useTheme();
  const focusC = focusColor ?? theme.brand;
  const [focused, setFocused] = useState(false);
  // The DOM state A.eye keeps: input.type, and what it wrote into the label <span>.
  const [shown, setShown] = useState(false);
  const [labelIcon, setLabelIcon] = useState<'eye' | 'eyeoff' | null>(null);

  const hasPrefix = prefix !== undefined;
  const showErr = error && !(focusOverError && focused);
  const showFocus = focused && !showErr;
  // input:focus + span, input:not(:placeholder-shown) + span
  const floated = focused || value.length > 0;

  const fp = useTransition(showFocus ? 1 : 0, INPUT_MS, easeCss);
  const ep = useTransition(showErr ? 1 : 0, INPUT_MS, easeCss);
  const up = useTransition(floated ? 1 : 0, LABEL_MS);
  const hot = useTransition(focused ? 1 : 0, LABEL_MS);

  // box-shadow: none -> 0 0 0 Npx tint. Spread and alpha both run; the input's own background is opaque,
  // so a tinted box behind it that grows by the spread is the same picture.
  const focusRing = useAnimatedStyle(() => {
    const s = focusRingWidth * fp.value;
    return { top: -s, left: -s, right: -s, bottom: -s, borderRadius: radius + s, opacity: fp.value };
  });
  const errRing = useAnimatedStyle(() => {
    const s = ERR_RING * ep.value;
    return { top: -s, left: -s, right: -s, bottom: -s, borderRadius: radius + s, opacity: ep.value };
  });
  const focusEdge = useAnimatedStyle(() => ({ opacity: fp.value }));
  const errEdge = useAnimatedStyle(() => ({ opacity: ep.value }));

  const labelMove = useAnimatedStyle(() => ({ top: REST_TOP + (FLOAT_TOP - REST_TOP) * up.value }));
  const labelText = useAnimatedStyle(() => ({
    fontSize: REST_SIZE + (FLOAT_SIZE - REST_SIZE) * up.value,
    lineHeight: REST_LINE + (FLOAT_LINE - REST_LINE) * up.value,
    letterSpacing: FLOAT_SPACING * up.value,
    fontFamily: up.value <= 0 ? FACE_400 : up.value <= 0.5 ? FACE_500 : FACE_600,
    color: interpolateColor(hot.value, [0, 1], [LABEL, focusC], 'RGB', { gamma: 1 }),
  }));
  const hotOpacity = useAnimatedStyle(() => ({ opacity: hot.value }));

  const flatInput = StyleSheet.flatten(inputStyle) as TextStyle | undefined;
  const radiusStyle = { borderRadius: radius };

  return (
    <View style={[styles.fl, style]}>
      <Animated.View style={[styles.ring, { backgroundColor: theme.brandTint }, focusRing]} />
      <Animated.View style={[styles.ring, styles.ringBad, errRing]} />
      <TextInput
        underlineColorAndroid="transparent"
        cursorColor={flatInput?.color ?? palettes.free.ink}
        accessibilityLabel={label}
        {...rest}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry && !shown}
        allowFontScaling={false}
        placeholderTextColor={PLACEHOLDER}
        onFocus={e => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={e => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={[styles.input, radiusStyle, inputStyle, hasPrefix && styles.inputPh]}
        testID={testID}
      />
      <Animated.View style={[styles.edge, radiusStyle, { borderColor: focusC }, focusEdge]} />
      {errorBorder ? <Animated.View style={[styles.edge, styles.edgeBad, radiusStyle, errEdge]} /> : null}
      {hasPrefix ? (
        <View style={styles.pre}>
          <Txt style={styles.preText}>{prefix}</Txt>
        </View>
      ) : labelIcon ? (
        <Animated.View style={[styles.labelIcon, labelMove]}>
          <Icon name={labelIcon} color={LABEL} />
          <Animated.View style={[styles.fill, hotOpacity]}>
            <Icon name={labelIcon} color={focusC} />
          </Animated.View>
        </Animated.View>
      ) : (
        <Animated.View style={[styles.label, labelMove]}>
          <AnimatedTxt style={labelText}>{label}</AnimatedTxt>
        </Animated.View>
      )}
      {secureTextEntry ? (
        <Pressable
          style={styles.eye}
          onPress={() => {
            const show = !shown;
            setShown(show);
            setLabelIcon(show ? 'eyeoff' : 'eye');
          }}
          accessibilityRole="button"
          accessibilityLabel="Show password"
          testID={testID ? `${testID}.eye` : undefined}>
          <Icon name="eye" color={palettes.free.muted} />
        </Pressable>
      ) : null}
    </View>
  );
}
