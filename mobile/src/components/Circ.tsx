// Source: PrepAssist.html L2417-L2418 (.circ)
// The 38 px round outline button (sheet close button and others).
// Computed (reference/android/sheet-language): 38 x 38, border 1px solid rgb(215,220,228) = --rule-2,
// border-radius 50%, content centred, transparent background. The :hover background is not ported
// (no hover on touch).
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import type { IconName } from '../icons/iconPaths.generated';
import { palettes } from '../theme/tokens';
import { Icon } from './Icon';

export interface CircProps {
  /** The icon inside (ic('close') in sheetFrame). */
  icon: IconName;
  onPress?: () => void;
  /** aria-label of the button. */
  label: string;
  /** currentColor of the icon. Default --ink. */
  color?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const styles = StyleSheet.create({
  circ: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: palettes.free.rule2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export function Circ({ icon, onPress, label, color, style, testID }: CircProps): React.JSX.Element {
  return (
    <Pressable
      style={[styles.circ, style]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      testID={testID}>
      <Icon name={icon} color={color} />
    </Pressable>
  );
}
