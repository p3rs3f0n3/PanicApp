/*const { getDefaultConfig } = require('@react-native/metro-config');
const path = require('path');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.extraNodeModules = {
  ...require('node-libs-react-native'),
  crypto: require.resolve('crypto-browserify'),
  stream: require.resolve('stream-browserify'),
  assert: require.resolve('assert'),
  http: require.resolve('stream-http'),
  https: require.resolve('https-browserify'),
  os: require.resolve('os-browserify/browser'),
  url: require.resolve('url'),
  buffer: require.resolve('buffer/'),
};

module.exports = defaultConfig;
*/

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};
