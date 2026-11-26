import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Shell } from './src/shell/Shell';
import { useStore } from './src/store';

// The root: providers only. Everything visible is the shell (src/shell/Shell.tsx = #app of the HTML).
// The app draws edge to edge under the status bar (React Native 0.88 always does), as the HTML does
// with viewport-fit=cover.
function App(): React.JSX.Element {
  // Test mode only (prepassist://insets/zero): the OS status bar is hidden so a screenshot shows the
  // top rows of the app, which the reference capture has and the status bar would otherwise cover.
  const zeroInsets = useStore(s => s.insetsMode === 'zero');
  const stage = useStore(s => s.stage);
  const reelOn = useStore(s => s.reel.on);
  const magicOn = useStore(s => s.planMagic.length > 0);
  const topLiveId = useStore(s => {
    for (let i = s.layer.length - 1; i >= 0; i--) {
      if (s.layer[i].live) return s.layer[i].id;
    }
    return null;
  });
  // Dark hero bars on tabs, reel, upgrade, planMagic, and onestep overlays need light status-bar icons.
  const darkStatus =
    reelOn || magicOn || (stage === 'app' && !topLiveId) || topLiveId === 'onestep' || topLiveId === 'upgrade';
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar barStyle={darkStatus ? 'light-content' : 'dark-content'} hidden={zeroInsets} animated={false} />
        <Shell />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});

export default App;
