// Source: PrepAssist.html L8210 (#mmBusy markup in A.mmGo), L4333-L4336 (.mm-busy, @keyframes mmp), L9313 (radius)
// PRIVATE (study area). Computed (reference/android/view-mindmaps-generating .mm-busy):
//   box     column, centred; margin-top 16; padding 18; radius 18; #fff; box-shadow 0 0 0 1px #E6EBF1
//   svg     140 wide, viewBox 0 0 120 70 (81.66 high); six dots r 5 #0A97B8, centre rect #14304F
//   circle  animation mmp 1s ease-in-out infinite alternate, delay k * .15s, fill-mode none:
//           opacity .2 -> 1, scale .6 -> 1.1 about the dot's own centre (transform-box fill-box) = r 3 -> 5.5.
//           During its delay a dot shows its un-animated look (opacity 1, r 5), as in the browser.
//   b       Inter 700 14.5px / 21.025px, margin-top 8;  small 12.5px / 18.125px #7A8494
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedProps, useSharedValue, withDelay, withRepeat, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Rect } from 'react-native-svg';
import { font, Txt } from '../../../theme';
import { mmBusyDot } from './mapsLogic';

const ACircle = Animated.createAnimatedComponent(Circle);
const easeInOut = Easing.bezier(0.42, 0, 0.58, 1);

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    marginTop: 16,
    padding: 18,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 0px 0px 1px #E6EBF1',
  },
  b: { ...font('sans', 700), fontSize: 14.5, lineHeight: 21.025, marginTop: 8, textAlign: 'center' },
  small: { fontSize: 12.5, lineHeight: 18.125, color: '#7A8494', textAlign: 'center' },
});

function Dot({ k }: { k: number }): React.JSX.Element {
  const { x, y } = mmBusyDot(k);
  const started = useSharedValue(0);
  const p = useSharedValue(0);
  useEffect(() => {
    started.value = withDelay(k * 150, withTiming(1, { duration: 0 }));
    p.value = withDelay(k * 150, withRepeat(withTiming(1, { duration: 1000, easing: easeInOut }), -1, true));
  }, [k, p, started]);
  const props = useAnimatedProps(() =>
    started.value < 1 ? { r: 5, opacity: 1 } : { r: 5 * (0.6 + 0.5 * p.value), opacity: 0.2 + 0.8 * p.value },
  );
  return <ACircle cx={x} cy={y} fill="#0A97B8" animatedProps={props} />;
}

export function MmBusy({ topic }: { topic: string }): React.JSX.Element {
  return (
    <View style={styles.box} testID="mindmaps.busy">
      <Svg width={140} height={(140 * 70) / 120} viewBox="0 0 120 70">
        {[0, 1, 2, 3, 4, 5].map(k => (
          <Dot key={k} k={k} />
        ))}
        <Rect x={44} y={28} width={32} height={14} rx={5} fill="#14304F" />
      </Svg>
      <Txt style={styles.b}>{`Mapping “${topic}”…`}</Txt>
      <Txt style={styles.small}>Finding branches, links and PYQ angles</Txt>
    </View>
  );
}
