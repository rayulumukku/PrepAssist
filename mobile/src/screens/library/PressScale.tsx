// Source: PrepAssist.html L9453-L9453 (.x4-card:active{transform:scale(.985)} with transition transform .15s)
// A pressable whose :active state is a scale, with the element's transform transition. Used by the
// library cards that have an `:active{transform:scale(…)}` rule.
import React, { useState } from 'react';
import { Pressable } from 'react-native';
import type { PressableProps, StyleProp, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { easeCss, useTransition } from '../../shell/anim';

export interface PressScaleProps extends Omit<PressableProps, 'style'> {
  scale: number;
  /** transition duration of transform, ms */
  ms: number;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export function PressScale({ scale, ms, style, children, ...rest }: PressScaleProps): React.JSX.Element {
  const [down, setDown] = useState(false);
  const v = useTransition(down ? scale : 1, ms, easeCss);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: v.value }] }));
  return (
    <Pressable {...rest} onPressIn={() => setDown(true)} onPressOut={() => setDown(false)}>
      <Animated.View style={[style, anim]}>{children}</Animated.View>
    </Pressable>
  );
}
