// Source: PrepAssist.html L5102-L5102 (#toast), L108-L109 (.toast, .toast.on), L3039-L3039, L5117-L5123 (toast)
// Computed (reference/android/overlay-toast): bottom --nav-h + 76px (140px); horizontally centred;
// background --ink; white Inter 400 13.5px / 19.575px, centred; padding 11px 16px; radius 12px;
// row with gap 8px; icon 20px. Hidden: opacity 0, translateY(20px); `.on`: opacity 1, translateY(0);
// `transition: all .3s var(--ease)`. It hides 2400 ms after the last toast() call.
// Width: the HTML positions it with left:50% and no width, so the browser shrinks it to fit inside
// the half of #app to the right of that point: at most 50% of the app width (206 of 412; max-width:86%
// never applies), and exactly that when the text wraps. Then translateX(-50%) centres it.
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { TextLayoutEvent } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { Icon } from '../components/Icon';
import { useStore } from '../store';
import { durations, metrics, palettes } from '../theme/tokens';
import { Txt } from '../theme/Txt';
import { useInsets } from '../theme/useTheme';
import { useTransition } from './anim';
import { useAppSize } from './AppSize';

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: metrics.navH + 76,
    zIndex: 200,
    alignItems: 'center',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: palettes.free.ink,
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  text: {
    fontSize: 13.5,
    lineHeight: 19.575,
    color: palettes.free.paper,
    textAlign: 'center',
    flexShrink: 1,
  },
  textWrapped: { flexGrow: 1 },
});

export function Toast(): React.JSX.Element {
  const toast = useStore(s => s.toast);
  const { w } = useAppSize();
  const { sab } = useInsets();
  const p = useTransition(toast.on ? 1 : 0, durations.toast);
  const anim = useAnimatedStyle(() => ({ opacity: p.value, transform: [{ translateY: 20 * (1 - p.value) }] }));
  // shrink-to-fit: a wrapped message takes the whole available width
  const [wrapped, setWrapped] = useState(false);
  useEffect(() => setWrapped(false), [toast.n]);
  const onTextLayout = (e: TextLayoutEvent): void => {
    if (e.nativeEvent.lines.length > 1) setWrapped(true);
  };
  const maxW = Math.min(206, (w || 412) * 0.5);
  return (
    <View style={[styles.wrap, { bottom: metrics.navH + sab + 76 }]} pointerEvents="none">
      <Animated.View style={[styles.toast, { maxWidth: maxW }, anim]} testID="toast">
        {toast.icon ? <Icon name={toast.icon} color={palettes.free.paper} /> : null}
        <Txt style={[styles.text, wrapped && styles.textWrapped]} onTextLayout={onTextLayout} testID="toast.text">
          {toast.msg}
        </Txt>
      </Animated.View>
    </View>
  );
}
