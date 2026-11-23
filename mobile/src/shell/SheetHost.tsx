// Source: PrepAssist.html L5100-L5101 (#scrim, #sheet), L2816-L2820 (.scrim, .sheet, .sheet.on, .sheet.tall), L6909-L6915 (openSheet, closeSheet)
// The one bottom sheet and its scrim. Computed (reference/android/sheet-language, sheet-allTools):
//   .scrim  inset 0, rgba(37,39,45,.38), opacity 0 -> 1 over .3s (ease); tapping it is data-act="closeSheet"
//   .sheet  bottom-anchored, full width, max-height 88% of #app, background --paper, radius 20px 20px 0 0,
//           box-shadow 0 -20px 40px -20px rgba(0,0,0,.3), flex column;
//           translateY(105%) -> none over .42s var(--ease)
//   .tall   height 92%, max-height 92%
// Only one sheet exists: opening another replaces the content (the key changes) and re-runs the
// slide from wherever the sheet is, as the HTML does when it resets className.
// The sheet closes by scrim tap or its close button only: there is no drag, the grab handle is decorative.
import React, { useEffect, useState } from 'react';
import { Keyboard, Platform, Pressable, StyleSheet } from 'react-native';
import type { KeyboardEvent, LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { act } from '../actions';
import { SHEETS } from '../navigation/registry';
import { useStore } from '../store';
import { durations, palettes } from '../theme/tokens';
import { easeCss, useTransition } from './anim';
import { useAppSize } from './AppSize';

const styles = StyleSheet.create({
  scrim: {
    ...StyleSheet.absoluteFill,
    zIndex: 90,
    backgroundColor: 'rgba(37, 39, 45, 0.38)',
  },
  fill: { flex: 1 },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 91,
    backgroundColor: palettes.free.paper,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    boxShadow: '0px -20px 40px -20px rgba(0, 0, 0, 0.3)',
    flexDirection: 'column',
  },
  // children are clipped to the rounded top corners (a child with its own background would cover them)
  clip: {
    flexShrink: 1,
    flexGrow: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    flexDirection: 'column',
  },
});

export function Scrim(): React.JSX.Element {
  const on = useStore(s => s.sheet.on);
  const o = useTransition(on ? 1 : 0, durations.scrim, easeCss);
  const anim = useAnimatedStyle(() => ({ opacity: o.value }));
  return (
    <Animated.View style={[styles.scrim, anim]} pointerEvents={on ? 'auto' : 'none'}>
      <Pressable style={styles.fill} onPress={() => act('closeSheet')} accessibilityLabel="Close" testID="scrim" />
    </Animated.View>
  );
}

/**
 * Platform necessity, not in the HTML: on iOS the keyboard covers the bottom of the window (a
 * browser instead pans the page so the focused field stays visible), so the sheet is lifted by the
 * keyboard height while a field in it has focus. Android resizes the window itself (adjustResize).
 */
function useKeyboardLift(): number {
  const [lift, setLift] = useState(0);
  useEffect(() => {
    if (Platform.OS !== 'ios') return undefined;
    const show = Keyboard.addListener('keyboardWillShow', (e: KeyboardEvent) => setLift(e.endCoordinates.height));
    const hide = Keyboard.addListener('keyboardWillHide', () => setLift(0));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  return lift;
}

export function SheetHost(): React.JSX.Element {
  const sheet = useStore(s => s.sheet);
  const { h: appH } = useAppSize();
  const lift = useKeyboardLift();
  const h = useSharedValue(0);
  // .on: transform none; otherwise translateY(105%) of the sheet's own height
  const p = useTransition(sheet.on ? 1 : 0, durations.sheet);
  const anim = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - p.value) * 1.05 * (h.value || appH) }],
  }));
  const onLayout = (e: LayoutChangeEvent): void => {
    h.value = e.nativeEvent.layout.height;
  };
  const Content = sheet.key ? SHEETS[sheet.key] : null;
  const size = sheet.tall ? { height: appH * 0.92, maxHeight: appH * 0.92 } : { maxHeight: appH * 0.88 };
  return (
    <Animated.View
      style={[styles.sheet, { bottom: lift }, size, anim]}
      onLayout={onLayout}
      pointerEvents={sheet.on ? 'auto' : 'none'}
      accessibilityViewIsModal={sheet.on}
      testID="sheet">
      <Animated.View style={styles.clip}>{Content ? <Content key={sheet.n} arg={sheet.arg} /> : null}</Animated.View>
    </Animated.View>
  );
}
