// Source: PrepAssist.html L2916-L2919 (.tog, .tog::after, .tog.on), L3590 (.tog.on{background:#1B8AD3!important})
// Private copy of the shared `.tog` switch (not ported by the foundation; CONTRACT.md section 4).
//   .tog        44 x 26, radius 13, var(--rule-2); .on #1B8AD3; transition background .25s (ease)
//   ::after     20 x 20 at 3,3, white, radius 10, shadow 0 1px 3px rgba(0,0,0,.2);
//               .on translateX(18px), transition transform .25s var(--ease)
// Not React Native's Switch: the HTML draws its own control.
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { easeCss, easeVar, useTransition } from '../../shell/anim';
import { palettes } from '../../theme';

export interface TogProps {
  on: boolean;
  onPress: () => void;
  label?: string;
  testID?: string;
}

export function Tog({
  on,
  onPress,
  label,
  testID,
}: TogProps): React.JSX.Element {
  const bg = useTransition(on ? 1 : 0, 250, easeCss);
  const kn = useTransition(on ? 1 : 0, 250, easeVar);
  const track = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      bg.value,
      [0, 1],
      [palettes.free.rule2, '#1B8AD3'],
    ),
  }));
  const knob = useAnimatedStyle(() => ({
    transform: [{ translateX: 18 * kn.value }],
  }));
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="switch"
      accessibilityState={{ checked: on }}
      accessibilityLabel={label}
      testID={testID}
    >
      <Animated.View style={[s.tog, track]}>
        <Animated.View style={[s.knob, knob]} />
      </Animated.View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  tog: { width: 44, height: 26, borderRadius: 13 },
  knob: {
    position: 'absolute',
    left: 3,
    top: 3,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.2)',
  },
});
