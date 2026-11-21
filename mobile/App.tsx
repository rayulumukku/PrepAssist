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
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" hidden={zeroInsets} animated={false} />
        <Shell />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});

export default App;
