// Source: PrepAssist.html L750-L750 (.ul: underline, text-decoration-color rgba(37,39,45,.35), text-underline-offset 4px, thickness 1px)
// Source: PrepAssist.html L1120-L1120 (#s-auth.up .up-alt a), L5011 (.soc u: the same underline in the computed styles)
// A text link whose underline sits `offset` px under the alphabetic baseline, in its own colour.
// React Native has neither text-underline-offset nor (on Android) text-decoration-color, so the line
// is drawn as a 1 px box under the text, at the position Chromium puts it: baseline + offset.
// Baseline of an Inter line box: half-leading + ascent, Inter ascent .96875 em, descent .2421875 em.
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Txt } from '../../theme/Txt';

const ASC = 0.96875;
const DESC = 0.2421875;

export interface UlProps {
  label: string;
  /** What comes before the underlined run inside the same link (.soc: the brand mark, gap 6). */
  before?: React.ReactNode;
  /** Font, size, line height, colour of the text. fontSize and lineHeight are required. */
  textStyle: TextStyle & { fontSize: number; lineHeight: number };
  /** text-decoration-color */
  lineColor?: string;
  /** text-underline-offset */
  offset?: number;
  /** text-decoration-thickness */
  thickness?: number;
  /** text-decoration: none (.vf2-links .ul[aria-disabled=true]) */
  noLine?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityRole?: 'link' | 'button';
  testID?: string;
}

/** Where the underline's top edge sits inside a line box of `lineHeight` for an Inter run of `fontSize`. */
export function underlineTop(fontSize: number, lineHeight: number, offset: number): number {
  const half = (lineHeight - (ASC + DESC) * fontSize) / 2;
  return half + ASC * fontSize + offset;
}

const styles = StyleSheet.create({
  line: { position: 'absolute', left: 0, right: 0 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});

export function Ul({
  label,
  before,
  textStyle,
  lineColor = 'rgba(37, 39, 45, 0.35)',
  offset = 4,
  thickness = 1,
  noLine,
  onPress,
  disabled,
  style,
  accessibilityRole = 'link',
  testID,
}: UlProps): React.JSX.Element {
  const top = underlineTop(textStyle.fontSize, textStyle.lineHeight, offset);
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[before ? styles.row : null, style]}
      accessibilityRole={accessibilityRole}
      testID={testID}>
      {before}
      <View>
        <Txt style={textStyle}>{label}</Txt>
        {noLine ? null : <View style={[styles.line, { top, height: thickness, backgroundColor: lineColor }]} />}
      </View>
    </Pressable>
  );
}
