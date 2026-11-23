// Source: PrepAssist.html L2218 (.spin), L797 (@keyframes sp: rotate 360deg)
// PRIVATE COPY of the shared-in-HTML `.spin`: 18 x 18 circle, 2px rgba(255,255,255,.35) with a #fff top
// border, `animation: sp .8s linear infinite`.
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

const s = StyleSheet.create({
  spin: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: 'rgba(255, 255, 255, 0.35)', borderTopColor: '#FFFFFF' },
});

export function Spin(): React.JSX.Element {
  const r = useSharedValue(0);
  useEffect(() => {
    r.value = withRepeat(withTiming(1, { duration: 800, easing: Easing.linear }), -1, false);
  }, [r]);
  const a = useAnimatedStyle(() => ({ transform: [{ rotate: `${r.value * 360}deg` }] }));
  return <Animated.View style={[s.spin, a]} />;
}
