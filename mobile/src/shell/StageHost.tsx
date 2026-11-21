// Source: PrepAssist.html L73-L75 (.stage, .stage.on, @keyframes stageIn), L5616-L5627 (go), L5076-L5091 (#s-app)
// The five stages. Each is `position:absolute;inset:0;display:none;overflow:hidden`; the active one
// gets `.on` (display:block; animation: stageIn .5s var(--ease), opacity 0 -> 1). A stage stays in
// the tree once it has been shown, hidden, as in the HTML (where all five are always in the DOM).
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { STAGE_SCREENS } from '../navigation/registry';
import { STAGES } from '../navigation/routes';
import type { Stage } from '../navigation/routes';
import { useStore } from '../store';
import { durations, palettes } from '../theme/tokens';
import { easeVar } from './anim';
import { NavBar } from './NavBar';
import { TabHost } from './TabHost';

const styles = StyleSheet.create({
  stage: { ...StyleSheet.absoluteFill, overflow: 'hidden' },
  off: { display: 'none' },
  // #s-app{background:var(--paper)} (L2252)
  app: { backgroundColor: palettes.free.paper },
});

function StageView({ name }: { name: Stage }): React.JSX.Element {
  const on = useStore(s => s.stage === name);
  const shown = useStore(s => s.stageShown);
  const opacity = useSharedValue(0);
  // stageIn restarts whenever the stage gets `.on` again
  useEffect(() => {
    if (!on) return;
    opacity.value = 0;
    opacity.value = withTiming(1, { duration: durations.stageIn, easing: easeVar });
    // `shown` changes on every go() that switches stage
  }, [on, shown, opacity]);
  const anim = useAnimatedStyle(() => ({ opacity: opacity.value }));
  if (name === 'app') {
    return (
      <Animated.View style={[styles.stage, styles.app, !on && styles.off, anim]} testID="stage.app">
        <TabHost />
        <NavBar />
      </Animated.View>
    );
  }
  const Screen = STAGE_SCREENS[name];
  return (
    <Animated.View style={[styles.stage, !on && styles.off, anim]} testID={`stage.${name}`}>
      <Screen />
    </Animated.View>
  );
}

export function StageHost(): React.JSX.Element {
  const seen = useStore(s => s.stagesSeen);
  return (
    <>
      {STAGES.map(name => (seen[name] ? <StageView key={name} name={name} /> : null))}
    </>
  );
}
