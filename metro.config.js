const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configure resolver for Supabase compatibility
config.resolver = {
  ...config.resolver,
  sourceExts: [...(config.resolver?.sourceExts || []), 'cjs', 'mjs'],
  extraNodeModules: {
    ...(config.resolver?.extraNodeModules || {}),
    // Polyfill for Node.js modules used by Supabase
    stream: require.resolve('readable-stream'),
    crypto: require.resolve('react-native-quick-crypto'),
    buffer: require.resolve('@craftzdog/react-native-buffer'),
  },
};

// Add transformer to handle CommonJS modules better
config.transformer = {
  ...config.transformer,
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
};

module.exports = config;

