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
