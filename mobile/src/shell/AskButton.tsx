// Source: PrepAssist.html L5095-L5098 (#ask markup), L2263-L2270 (.ask, .mini, .lbl, .hide, #app.paged .ask), L3023-L3023 (brand colours), L10668-L10669 (planthemes), L5990-L6000 (mini rules)
// The floating Ask PrepAssist button. Computed (reference/android/overlay-ask-full, overlay-ask-mini):
//   full  163.5 x 46 at right 16px, bottom --nav-h + 14px + --sab; padding 0 16px 0 12px; gap 8px;
//         radius 999px; background --brand; box-shadow 0 12px 28px -10px rgba(27,138,211,.6);
//         Inter 600 14.5px / 21.025px white, one line; spark icon 22px
//   mini  max-width 46px, padding 0 12px, label opacity 0 (.2s)
//   hide  opacity 0, translateY(20px), no pointer events
//   paged bottom 18px + --sab
//   `transition: all .35s var(--ease)` covers max-width, padding, bottom, opacity and transform.
// The width is not set in the HTML: it is the content width capped by max-width (200 -> 46). The
// same thing is computed here from the measured label width, so the motion matches.
// pro: background linear-gradient(135deg,#5631D1,#B05BE0), shadow rgba(106,69,232,.7)
// ultimate: background linear-gradient(135deg,#1B150A,#3D2C0E), colour #F7DE8E, shadow
//           0 0 0 1px rgba(247,215,116,.45), 0 12px 28px -10px rgba(122,86,10,.8)
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { act } from '../actions';
import { font } from '../theme/fonts';
import { durations, metrics } from '../theme/tokens';
import { Txt } from '../theme/Txt';
import { useInsets, usePlan, useTheme } from '../theme/useTheme';
import { easeCss, useTransition } from './anim';
import { useChrome } from './useChrome';

const styles = StyleSheet.create({
  ask: {
    position: 'absolute',
    right: 16,
    zIndex: 70,
    height: 46,
    borderRadius: 999,
  },
  clip: {
    flex: 1,
    borderRadius: 999,
    overflow: 'hidden',
  },
  // the content keeps its natural width while the button narrows around it (white-space:nowrap; overflow:hidden)
  free: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 400,
    flexDirection: 'row',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 12,
    height: 46,
  },
  lbl: {
    ...font('sans', 600),
    fontSize: 14.5,
    lineHeight: 21.025,
  },
});

const LOOK = {
  free: null,
  pro: {
    backgroundImage: 'linear-gradient(135deg, #5631D1, #B05BE0)',
    boxShadow: '0px 12px 28px -10px rgba(106, 69, 232, 0.7)',
    color: '#FFFFFF',
  },
  ultimate: {
    backgroundImage: 'linear-gradient(135deg, #1B150A, #3D2C0E)',
    boxShadow: '0px 0px 0px 1px rgba(247, 215, 116, 0.45), 0px 12px 28px -10px rgba(122, 86, 10, 0.8)',
    color: '#F7DE8E',
  },
} as const;

export function AskButton(): React.JSX.Element {
  const theme = useTheme();
  const plan = usePlan();
  const { sab } = useInsets();
  const { paged, askHide, askMini } = useChrome();
  const labelW = useSharedValue(0);

  const maxW = useTransition(askMini ? 46 : 200, durations.ask);
  const padR = useTransition(askMini ? 12 : 16, durations.ask);
  const bottom = useTransition(paged ? 18 + sab : metrics.navH + 14 + sab, durations.ask);
  const hide = useTransition(askHide ? 1 : 0, durations.ask);
  const lbl = useTransition(askMini ? 0 : 1, durations.askLabel, easeCss);

  const box = useAnimatedStyle(() => ({
    // content width: padding-left 12 + spark 22 + gap 8 + label + padding-right
    width: Math.min(42 + labelW.value + padR.value, maxW.value),
    bottom: bottom.value,
    opacity: 1 - hide.value,
    transform: [{ translateY: 20 * hide.value }],
  }));
  const lblStyle = useAnimatedStyle(() => ({ opacity: lbl.value }));

  const look = LOOK[plan];
  const color = look ? look.color : '#FFFFFF';
  const skin = look
    ? { backgroundImage: look.backgroundImage }
    : { backgroundColor: theme.brand };
  const shadow = look ? look.boxShadow : '0px 12px 28px -10px rgba(27, 138, 211, 0.6)';

  const onLabel = (e: LayoutChangeEvent): void => {
    labelW.value = e.nativeEvent.layout.width;
  };

  return (
    <Animated.View style={[styles.ask, { boxShadow: shadow }, box]} pointerEvents={askHide ? 'none' : 'auto'}>
      <Pressable
        style={[styles.clip, skin]}
        onPress={() => act('mentor')}
        accessibilityRole="button"
        accessibilityLabel="Ask PrepAssist"
        testID="ask">
        <View style={styles.free}>
          <View style={styles.row}>
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round">
              <Path
                d="M12 3c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7Z"
                fill="#5DB4EC"
                stroke="#5DB4EC"
              />
              <Path
                d="M19 15.5c.2 1.6.9 2.3 2.5 2.5-1.6.2-2.3.9-2.5 2.5-.2-1.6-.9-2.3-2.5-2.5 1.6-.2 2.3-.9 2.5-2.5Z"
                fill="#F5A01F"
                stroke="#F5A01F"
              />
            </Svg>
            <Animated.View style={lblStyle} onLayout={onLabel}>
              <Txt style={[styles.lbl, { color }]} numberOfLines={1}>
                Ask PrepAssist
              </Txt>
            </Animated.View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}
