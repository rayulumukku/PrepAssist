// Source: PrepAssist.html L3367-L3367 (.ac-holo), L402-L405 (@property --hx, @keyframes holo)
// The holographic seal on the identity card: a 40 px disc, conic-gradient(from var(--hx), #FFD27A,
// #9FD0F2, #fff, #F5A01F, #8CC6EE, #FFD27A), masked by radial-gradient(circle, #000 52%, transparent
// 54%, transparent 62%, #000 64%) (size farthest-corner = 20·√2 px), opacity .85, and --hx animated
// 0 -> 360deg over 6 s linear, forever (the conic start angle turns; the disc does not move).
// CSS conic angles start at 12 o'clock; Skia's sweep starts at 3 o'clock, hence the -90°.
// Drawn with Skia: React Native's backgroundImage has no conic gradient and no mask.
import {
  Canvas,
  Circle,
  Group,
  RadialGradient,
  SweepGradient,
  vec,
} from '@shopify/react-native-skia';
import React, { useEffect } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const S = 40;
const C = vec(S / 2, S / 2);
const FAR = (S / 2) * Math.SQRT2;
const COLORS = [
  '#FFD27A',
  '#9FD0F2',
  '#FFFFFF',
  '#F5A01F',
  '#8CC6EE',
  '#FFD27A',
];
const MASK = [
  '#000000',
  '#000000',
  'rgba(0,0,0,0)',
  'rgba(0,0,0,0)',
  '#000000',
  '#000000',
];
const MASK_AT = [0, 0.52, 0.54, 0.62, 0.64, 1];

export function AcHolo({
  style,
}: {
  style?: StyleProp<ViewStyle>;
}): React.JSX.Element {
  const hx = useSharedValue(0);
  useEffect(() => {
    hx.value = withRepeat(
      withTiming(360, { duration: 6000, easing: Easing.linear }),
      -1,
      false,
    );
  }, [hx]);
  const transform = useDerivedValue(() => [
    { rotate: ((hx.value - 90) * Math.PI) / 180 },
  ]);
  return (
    <Canvas style={[{ width: S, height: S, opacity: 0.85 }, style]}>
      <Group layer>
        <Circle c={C} r={S / 2}>
          <SweepGradient
            c={C}
            colors={COLORS}
            origin={C}
            transform={transform}
          />
        </Circle>
        <Circle c={C} r={S / 2} blendMode="dstIn">
          <RadialGradient c={C} r={FAR} colors={MASK} positions={MASK_AT} />
        </Circle>
      </Group>
    </Canvas>
  );
}
