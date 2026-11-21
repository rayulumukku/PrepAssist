// Source: PrepAssist.html L2198-L2207 (.fld, .fld label, .inp, .inp input, :focus, .err, .inp .eye, .inp .pre)
// Source: PrepAssist.html L3012-L3012 (.inp input:focus, the rule in effect), L6922-L6924 (markup in SHEETS.forgot, changeEmail, account)
// A label above a plain input: `<div class="fld"><label>Label</label><div class="inp"><input></div></div>`.
// Computed (reference/android: sheet-account x5, sheet-forgot, sheet-changeEmail), 372 x 72.13:
//   .fld    margin-bottom 14
//   label   row, Inter 600 12.5px / 18.125px, --ink-2, margin-bottom 6
//   .inp    position relative, row, centred vertically
//   input   100 % x 48, padding 0 44px 0 14px, border 1px solid --rule-2, radius 10, background --sheet,
//           Inter 400 15.5px --ink, transition border .2s, box-shadow .2s (ease)
// States, from the CSS (no reference capture has a focused or .err `.inp input`):
//   :focus  border-color var(--brand), box-shadow 0 0 0 3px var(--brand-tint). L3012 is the rule in
//           effect: it has the same specificity as L2203 (border --ink, ring rgba(37,39,45,.06)) and
//           comes later, so L2203 never shows.
//   .err    border-color --bad, box-shadow 0 0 0 3px --bad-tint (L2204). While focused the :focus look
//           wins (L3012 also follows L2204). The HTML never sets .err on an `.inp input`.
// `.inp .pre` (L2206-L2207: absolute, left 14, 15.5px --muted, and padding-left 50 on the input) and
// `.inp .eye` (L2205: absolute, right 6, 38 x 38, --muted) are in the CSS but in no markup of the HTML;
// they are ported from those rules. For the eye, A.eye (L6986) swaps the input between password and
// text and writes `eyeoff` / `eye` into the element after the input, taken here to be the button
// (its aria-label "Show password" is the one the `.fl` eye buttons carry, L4954).
// Not ported: `.fld label a` (L2200, a link at the right of the label row: no markup uses it).
// The placeholder colour is not determinable: no `.inp input` has a placeholder and no ::placeholder
// rule matches, so none is set. The caret colour is the text colour, as in a browser, on Android only.
import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import type { StyleProp, TextInputProps, TextStyle, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { easeCss, useTransition } from '../shell/anim';
import { font, fontPx } from '../theme/fonts';
import { palettes } from '../theme/tokens';
import { Txt } from '../theme/Txt';
import { useTheme } from '../theme/useTheme';
import { Icon } from './Icon';

export interface FldProps extends Omit<TextInputProps, 'style' | 'value' | 'onChangeText' | 'allowFontScaling'> {
  /** Text of the <label>. */
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  /** input.err */
  error?: boolean;
  /** type="password": masks the text and adds the .eye button. */
  secureTextEntry?: boolean;
  /** Text of `.pre`, drawn inside the input at the left. */
  prefix?: string;
  /** The .fld box. */
  style?: StyleProp<ViewStyle>;
  /** The <input>. */
  inputStyle?: StyleProp<TextStyle>;
  /** Set on the input; the eye button gets `<testID>.eye`. */
  testID?: string;
}

/** border-radius of .inp input */
const RADIUS = 10;
/** spread of both rings (L2204, L3012) */
const RING = 3;
/** .inp input{transition:border .2s,box-shadow .2s} */
const INPUT_MS = 200;

const styles = StyleSheet.create({
  fld: {
    marginBottom: 14,
  },
  label: {
    ...font('sans', 600),
    fontSize: 12.5,
    lineHeight: 18.125,
    color: palettes.free.ink2,
    marginBottom: 6,
  },
  inp: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 48,
    paddingTop: 0,
    paddingRight: 44,
    paddingBottom: 0,
    paddingLeft: 14,
    borderWidth: 1,
    borderColor: palettes.free.rule2,
    borderRadius: RADIUS,
    backgroundColor: palettes.free.sheet,
    ...font('sans', 400),
    fontSize: fontPx(15.5),
    color: palettes.free.ink,
    includeFontPadding: false,
  },
  inputPre: {
    paddingLeft: 50,
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
    borderRadius: RADIUS,
    pointerEvents: 'none',
  },
  edgeBad: {
    borderColor: palettes.free.bad,
  },
  pre: {
    position: 'absolute',
    left: 14,
    pointerEvents: 'none',
  },
  preText: {
    ...font('sans', 400),
    fontSize: 15.5,
    lineHeight: 22.475,
    color: palettes.free.muted,
  },
  eye: {
    position: 'absolute',
    right: 6,
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export function Fld({
  label,
  value,
  onChangeText,
  error = false,
  secureTextEntry = false,
  prefix,
  style,
  inputStyle,
  testID,
  onFocus,
  onBlur,
  ...rest
}: FldProps): React.JSX.Element {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);
  const [shown, setShown] = useState(false);

  const showErr = error && !focused;
  const fp = useTransition(focused ? 1 : 0, INPUT_MS, easeCss);
  const ep = useTransition(showErr ? 1 : 0, INPUT_MS, easeCss);

  // box-shadow: none -> 0 0 0 3px tint. Spread and alpha both run; the input's own background is opaque,
  // so a tinted box behind it that grows by the spread is the same picture.
  const focusRing = useAnimatedStyle(() => {
    const s = RING * fp.value;
    return { top: -s, left: -s, right: -s, bottom: -s, borderRadius: RADIUS + s, opacity: fp.value };
  });
  const errRing = useAnimatedStyle(() => {
    const s = RING * ep.value;
    return { top: -s, left: -s, right: -s, bottom: -s, borderRadius: RADIUS + s, opacity: ep.value };
  });
  const focusEdge = useAnimatedStyle(() => ({ opacity: fp.value }));
  const errEdge = useAnimatedStyle(() => ({ opacity: ep.value }));

  const flatInput = StyleSheet.flatten(inputStyle) as TextStyle | undefined;

  return (
    <View style={[styles.fld, style]}>
      <Txt style={styles.label}>{label}</Txt>
      <View style={styles.inp}>
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
          onFocus={e => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={e => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={[styles.input, prefix !== undefined && styles.inputPre, inputStyle]}
          testID={testID}
        />
        <Animated.View style={[styles.edge, { borderColor: theme.brand }, focusEdge]} />
        <Animated.View style={[styles.edge, styles.edgeBad, errEdge]} />
        {prefix !== undefined ? (
          <View style={styles.pre}>
            <Txt style={styles.preText}>{prefix}</Txt>
          </View>
        ) : null}
        {secureTextEntry ? (
          <Pressable
            style={styles.eye}
            onPress={() => setShown(s => !s)}
            accessibilityRole="button"
            accessibilityLabel="Show password"
            testID={testID ? `${testID}.eye` : undefined}>
            <Icon name={shown ? 'eyeoff' : 'eye'} color={palettes.free.muted} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
