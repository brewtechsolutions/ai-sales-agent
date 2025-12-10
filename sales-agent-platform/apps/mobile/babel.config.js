module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
        },
      ],
      [
        'module-resolver',
        {
          alias: {
            '@': './',
            '@components': './components',
            "@assets/*": "./assets",
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
