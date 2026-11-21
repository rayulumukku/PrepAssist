// Third-party React Native libraries ship untranspiled ES modules, so they must go through Babel too.
const esModules = [
  '(jest-)?react-native',
  '@react-native(-community)?',
  'react-native-[a-z-]+',
  '@react-navigation',
  '@shopify/react-native-skia',
  'zustand',
].join('|');

module.exports = {
  preset: '@react-native/jest-preset',
  // Reanimated 4.8 ships this resolver for Jest: it loads the JS (non-native) variant of the files that
  // would otherwise call into the missing native module when `react-native-reanimated` is imported
  // (without it: "[Reanimated] `setCSSEventHandler` is not available in JSReanimated").
  resolver: require.resolve('react-native-reanimated/jest/resolver'),
  transformIgnorePatterns: [`node_modules/(?!(${esModules})/)`],
  setupFiles: [
    require.resolve('@react-native/jest-preset/jest/setup.js'),
    './node_modules/react-native-gesture-handler/jestSetup.js',
    './node_modules/@shopify/react-native-skia/jestSetup.js',
    './jest.setup.js',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
  modulePathIgnorePatterns: ['<rootDir>/android/', '<rootDir>/ios/'],
};
