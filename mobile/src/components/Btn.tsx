// Source: PrepAssist.html L82-L91 (.btn, .btn:active, .btn-brand, .btn-ink, .btn-line, .btn-ghost, .btn-sm, .btn-wide), L9338-L9339 (ds-handoff radius and small size)
// The standard button. Computed (reference/android: view-engine #engGo, view-lesson .btn-line.btn-sm,
// view-quiz-results .btn-ghost, sheet-forgot .btn-brand):
//   .btn        row, centred, gap 8px; height 46px; padding 0 20px; radius 14px; Inter 600 15.5px / 22.475px
//   .btn-brand  background --brand, text #fff          .btn-ink  the same (L86: background var(--brand))
//   .btn-line   1px solid --rule-2 on --sheet, text --ink
//   .btn-ghost  no background, text --ink-2
//   .btn-sm     height 36px; padding 0 14px; radius 12px; 13.5px / 19.575px
//   .btn-wide   width 100%
//   :active     transform scale(.98), `transition: transform .15s` (ease)
// An icon in the HTML is `ic('name')` before the label: 20px, stroke = the text colour.
// Not part of the shared class (apply through `style`): `.qz-foot .btn[disabled]{opacity:.35}` (L2672).
// The :hover backgrounds (L85, L87) have no touch equivalent.
import React, { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import type { IconName } from '../icons/iconPaths.generated';
import { easeCss, useTransition } from '../shell/anim';
import { font } from '../theme/fonts';
import { palettes } from '../theme/tokens';
import { Txt } from '../theme/Txt';
import { useTheme } from '../theme/useTheme';
import { Icon } from './Icon';

export interface BtnProps {
  /** .btn-brand | .btn-ink | .btn-line | .btn-ghost */
  variant: 'brand' | 'ink' | 'line' | 'ghost';
  /** .btn-sm */
  small?: boolean;
  /** .btn-wide */
  wide?: boolean;
  /** The label text. */
  label?: string;
  /** ic('name') before the label. */
  icon?: IconName;
  /** Anything else inside the button (a spinner, an icon after the label). Drawn after the label. */
  children?: React.ReactNode;
  onPress?: () => void;
  /** <button disabled>: no press. The HTML has no generic disabled look for .btn. */
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 46,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignSelf: 'flex-start',
  },
  sm: { height: 36, paddingHorizontal: 14, borderRadius: 12 },
  wide: { alignSelf: 'stretch' },
  line: { borderWidth: 1, borderColor: palettes.free.rule2, backgroundColor: palettes.free.sheet },
  text: { ...font('sans', 600), fontSize: 15.5, lineHeight: 22.475, textAlign: 'center' },
  textSm: { fontSize: 13.5, lineHeight: 19.575 },
});

export function Btn({ variant, small, wide, label, icon, children, onPress, disabled, style, textStyle, testID }: BtnProps): React.JSX.Element {
  const theme = useTheme();
  const [down, setDown] = useState(false);
  const scale = useTransition(down ? 0.98 : 1, 150, easeCss);
  const pressed = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const filled = variant === 'brand' || variant === 'ink';
  const color = filled ? '#FFFFFF' : variant === 'ghost' ? theme.ink2 : theme.ink;
  return (
    <Animated.View style={[wide ? styles.wide : null, pressed]}>
      <Pressable
        style={[styles.btn, small && styles.sm, wide && styles.wide, filled && { backgroundColor: theme.brand }, variant === 'line' && styles.line, style]}
        onPress={onPress}
        onPressIn={() => setDown(true)}
        onPressOut={() => setDown(false)}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{ disabled: !!disabled }}
        testID={testID}>
        {icon ? <Icon name={icon} color={color} /> : null}
        {label !== undefined ? <Txt style={[styles.text, small && styles.textSm, { color }, textStyle]}>{label}</Txt> : null}
        {children}
      </Pressable>
    </Animated.View>
  );
}
