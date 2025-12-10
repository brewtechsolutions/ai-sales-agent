import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  const appEnv = process.env.APP_ENV || 'dev';
  const configPath = appEnv === 'production' ? './config/production' : './config/dev';

  return {
    ...config,
    name: config.name || 'mobile',
    slug: config.slug || 'mobile',
    ios: {
      ...config.ios,
      googleServicesFile: `${configPath}/GoogleService-Info.plist`,
    },
    android: {
      ...config.android,
      googleServicesFile: `${configPath}/google-services.json`,
    },
    plugins: [
      ...(config.plugins || []).map(plugin => {
        if (Array.isArray(plugin) && plugin[0] === '@react-native-firebase/app') {
          return [
            '@react-native-firebase/app',
            {
              ios: {
                googleServicesFile: `${configPath}/GoogleService-Info.plist`,
              },
              android: {
                googleServicesFile: `${configPath}/google-services.json`,
              },
            },
          ];
        }
        return plugin;
      }),
    ],
  };
};
