// Source: PrepAssist.html L94-L95 (.chip, .chip.on), L9350 (ds-handoff height/radius/type), L9380-L9381 (ds-handoff colours), L2973 (.opt-row), L7035-L7036 (chipToggle, chipOne)
// The pill chip. Computed (reference/android/sheet-prefs .chip, .chip.on):
//   .chip     row, centred, gap 6px; height 34px; padding 0 13px; radius 999px; 1px solid #E1E8F0 on #fff;
//             Inter 600 12.5px / 18.125px, colour --ds-ink-2 (#3A404B); one line; `transition: all .2s`
//   .chip.on  background and border --ds-ink (#14161C), text #fff
//   .opt-row  row of chips: wraps, gap 8px, margin 10px 0 18px
// Contextual restyles that are NOT part of the shared class (pass style / onStyle / textStyle / onTextStyle):
//   #practiceScroll .p-chips .chip (L2064-L2065, L9382-L9383) · .eng-row .chip (L2586-L2587)
// The on-state of the HTML is a class on the element and nothing else: chipOne turns it on for the
// clicked chip and off for its siblings, chipToggle flips the clicked chip. ChipGroup keeps exactly
// that element-local state.
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import type { IconName } from '../icons/iconPaths.generated';
import { easeCss, useTransition } from '../shell/anim';
import { font } from '../theme/fonts';
import { palettes } from '../theme/tokens';
import { Txt } from '../theme/Txt';
import { Icon } from './Icon';

export interface ChipProps {
  label: string;
  /** class `on` */
  on?: boolean;
  /** ic('name') before the label */
  icon?: IconName;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  /** merged over `style` while on */
  onStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onTextStyle?: StyleProp<TextStyle>;
  testID?: string;
}

const C = palettes.free;
const styles = StyleSheet.create({
  wrap: { alignSelf: 'flex-start' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 34,
    paddingHorizontal: 13,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E1E8F0',
    backgroundColor: '#FFFFFF',
  },
  chipOn: { ...StyleSheet.absoluteFill, backgroundColor: C.dsInk, borderColor: C.dsInk },
  text: { ...font('sans', 600), fontSize: 12.5, lineHeight: 18.125, color: C.dsInk2 },
  textOn: { color: '#FFFFFF' },
  optRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10, marginBottom: 18 },
});

export function Chip({ label, on = false, icon, onPress, style, onStyle, textStyle, onTextStyle, testID }: ChipProps): React.JSX.Element {
  // `transition: all .2s`: the on-look fades in over the base look
  const mix = useTransition(on ? 1 : 0, 200, easeCss);
  const onLayer = useAnimatedStyle(() => ({ opacity: mix.value }));
  const flatOff = StyleSheet.flatten([styles.text, textStyle]) as TextStyle;
  const flatOn = StyleSheet.flatten([styles.text, textStyle, styles.textOn, onTextStyle]) as TextStyle;
  return (
    <Pressable
      style={styles.wrap}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: on }}
      testID={testID}>
      <View style={[styles.chip, style]}>
        {icon ? <Icon name={icon} color={flatOff.color as string} /> : null}
        <Txt style={flatOff} numberOfLines={1}>
          {label}
        </Txt>
      </View>
      <Animated.View style={[styles.chip, style, styles.chipOn, onStyle, onLayer]} pointerEvents="none">
        {icon ? <Icon name={icon} color={flatOn.color as string} /> : null}
        <Txt style={flatOn} numberOfLines={1}>
          {label}
        </Txt>
      </Animated.View>
    </Pressable>
  );
}

/** `.opt-row`: the wrapping row the chips sit in. */
export function OptRow({ children, style }: { children?: React.ReactNode; style?: StyleProp<ViewStyle> }): React.JSX.Element {
  return <View style={[styles.optRow, style]}>{children}</View>;
}

export interface ChipGroupProps {
  /** Chip labels, in order. */
  items: readonly string[];
  /** 'one' = chipOne (exactly the pressed chip is on) · 'toggle' = chipToggle (each chip flips) */
  mode: 'one' | 'toggle';
  /** Indexes that carry class `on` in the markup. */
  initial?: readonly number[];
  /** Called after the state changed, with the pressed index and the indexes now on. */
  onChange?: (index: number, on: readonly number[]) => void;
  chipStyle?: StyleProp<ViewStyle>;
  chipOnStyle?: StyleProp<ViewStyle>;
  chipTextStyle?: StyleProp<TextStyle>;
  chipOnTextStyle?: StyleProp<TextStyle>;
  /** testID prefix: `<prefix>.<index>` */
  testID?: string;
}

/** Chips whose on-state lives in the element, as with data-act="chipOne" / "chipToggle". Render it inside an OptRow or any row. */
export function ChipGroup({ items, mode, initial = [], onChange, chipStyle, chipOnStyle, chipTextStyle, chipOnTextStyle, testID }: ChipGroupProps): React.JSX.Element {
  const [on, setOn] = useState<readonly number[]>(initial);
  const press = (i: number): void => {
    const next = mode === 'one' ? [i] : on.includes(i) ? on.filter(x => x !== i) : [...on, i];
    setOn(next);
    onChange?.(i, next);
  };
  return (
    <>
      {items.map((label, i) => (
        <Chip
          key={i}
          label={label}
          on={on.includes(i)}
          onPress={() => press(i)}
          style={chipStyle}
          onStyle={chipOnStyle}
          textStyle={chipTextStyle}
          onTextStyle={chipOnTextStyle}
          testID={testID ? `${testID}.${i}` : undefined}
        />
      ))}
    </>
  );
}
