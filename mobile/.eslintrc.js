// Project rules. The restricted imports enforce the plan's two rules:
// nothing in the UI may come from outside the PrepAssist.html design.
const BANNED_PACKAGES = [
  { name: 'react-native-webview', message: 'No WebView: every screen is native.' },
  { name: 'react-native-paper', message: 'No UI kits: port the HTML element instead.' },
  { name: 'native-base', message: 'No UI kits: port the HTML element instead.' },
  { name: 'react-native-elements', message: 'No UI kits: port the HTML element instead.' },
  { name: '@gorhom/bottom-sheet', message: 'Use the Sheet ported from .sheet (no drag to dismiss).' },
  {
    name: 'react-native',
    importNames: [
      'Alert',
      'ActivityIndicator',
      'RefreshControl',
      'Button',
      'Switch',
      'Modal',
      'TouchableNativeFeedback',
      'ToastAndroid',
      'ActionSheetIOS',
      'Vibration',
    ],
    message: 'Platform default UI is not in the design. Port the HTML element instead.',
  },
];

module.exports = {
  root: true,
  extends: '@react-native',
  ignorePatterns: ['node_modules/', 'android/', 'ios/', 'coverage/', '*.generated.ts'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        paths: BANNED_PACKAGES,
        patterns: [
          { group: ['expo', 'expo-*', '@expo/*'], message: 'No Expo: plain React Native only.' },
          { group: ['@rneui/*'], message: 'No UI kits: port the HTML element instead.' },
        ],
      },
    ],
  },
};
