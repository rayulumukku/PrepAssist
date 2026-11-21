// Source: PrepAssist.html L2253-L2256 (.tabp, .tabp.on, @keyframes tabIn, .tabp > .scroll), L5077-L5082 (the six panes), L6002-L6009 (setTab)
// The six tab panes: `position:absolute; inset:0 0 var(--nav-h) 0; display:none`. The active pane gets
// `.on`: display:block and `animation: tabIn .35s var(--ease)` (opacity 0 -> 1, translateY 6px -> 0).
// The animation also restarts when the app stage itself is shown again (a CSS animation starts when
// an ancestor goes from display:none to displayed). A pane stays mounted once shown, so its scroll
// position survives tab switches, as in the HTML.
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { TAB_SCREENS } from '../navigation/registry';
import { TABS } from '../navigation/routes';
import type { TabId } from '../navigation/routes';
import { useStore } from '../store';
import { durations, metrics } from '../theme/tokens';
import { easeVar } from './anim';

const styles = StyleSheet.create({
  tabp: { position: 'absolute', top: 0, left: 0, right: 0, bottom: metrics.navH },
  off: { display: 'none' },
});

function TabPane({ tab }: { tab: TabId }): React.JSX.Element {
  const on = useStore(s => s.tab === tab);
  const shown = useStore(s => s.tabShown[tab]);
  const stageShown = useStore(s => s.stageShown);
  const p = useSharedValue(0);
  useEffect(() => {
    if (!on) return;
    p.value = 0;
    p.value = withTiming(1, { duration: durations.tabIn, easing: easeVar });
  }, [on, shown, stageShown, p]);
  const anim = useAnimatedStyle(() => ({ opacity: p.value, transform: [{ translateY: 6 * (1 - p.value) }] }));
  const Screen = TAB_SCREENS[tab];
  return (
    <Animated.View style={[styles.tabp, !on && styles.off, anim]} testID={`tab.${tab}`}>
      <Screen />
    </Animated.View>
  );
}

export function TabHost(): React.JSX.Element {
  const seen = useStore(s => s.tabsSeen);
  return (
    <>
      {TABS.map(tab => (seen[tab] ? <TabPane key={tab} tab={tab} /> : null))}
    </>
  );
}
