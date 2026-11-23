// Source: PrepAssist.html L4941 (.pl-bg, i.g1, i.g2), L1122 (#s-auth.up .pl-bg{display:none})
// The backdrop of the sign-in stage. Computed (reference/android/stage-auth-signin):
//   .pl-bg  absolute, inset 0, radial-gradient(120% 60% at 50% -10%, #DCEBF8 0%, #EEF4FB 45%, #F7F9FC 100%)
//   i.g1    240 x 240 circle at left -80 top 120, #1B8AD3, opacity .18, filter blur(70px)
//   i.g2    200 x 200 circle at right -60 bottom 120, #F5A01F, opacity .12, filter blur(80px)
// The blurred circles are drawn with Skia on both platforms (React Native's `filter: blur()` is Android
// only). CSS blur(Npx) is a Gaussian of standard deviation N; Skia's Blur takes the same sigma.
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Blur, Canvas, Circle, Group } from '@shopify/react-native-skia';

const styles = StyleSheet.create({
  bg: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
    pointerEvents: 'none',
    backgroundImage: 'radial-gradient(120% 60% at 50% -10%, #DCEBF8 0%, #EEF4FB 45%, #F7F9FC 100%)',
  },
  canvas: StyleSheet.absoluteFill,
});

export function AuthBg(): React.JSX.Element {
  const [size, setSize] = useState({ w: 0, h: 0 });
  return (
    <View
      style={styles.bg}
      onLayout={e => setSize({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}>
      {size.w > 0 ? (
        <Canvas style={styles.canvas}>
          <Group opacity={0.18}>
            <Circle cx={-80 + 120} cy={120 + 120} r={120} color="#1B8AD3">
              <Blur blur={70} />
            </Circle>
          </Group>
          <Group opacity={0.12}>
            <Circle cx={size.w + 60 - 100} cy={size.h - 120 - 100} r={100} color="#F5A01F">
              <Blur blur={80} />
            </Circle>
          </Group>
        </Canvas>
      ) : null}
    </View>
  );
}
