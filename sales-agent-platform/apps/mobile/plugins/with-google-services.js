/**
 * Expo Config Plugin - Dynamically selects Google Services files based on EAS build profile
 * 
 * This plugin detects the build environment (dev/preview/production) and automatically
 * selects the correct Google Services configuration files.
 * 
 * Environment Detection:
 * - Development: Uses ./config/dev/ files
 * - Preview: Uses ./config/preview/ files (falls back to dev if not exists)
 * - Production: Uses ./config/production/ files (falls back to preview, then dev)
 * 
 * The environment is determined by:
 * 1. EAS_BUILD_PROFILE environment variable (set by EAS)
 * 2. EXPO_PUBLIC_ENV environment variable (for local builds)
 * 3. NODE_ENV environment variable (fallback)
 */


const fs = require('fs');
const path = require('path');

/**
 * Determines the current build environment
 */
function getBuildEnvironment() {
  // Priority 1: EAS build profile (set by EAS during cloud builds)
  if (process.env.EAS_BUILD_PROFILE) {
    return process.env.EAS_BUILD_PROFILE;
  }

  // Priority 2: Explicit environment variable (for local builds)
  if (process.env.EXPO_PUBLIC_ENV) {
    return process.env.EXPO_PUBLIC_ENV;
  }

  // Priority 3: NODE_ENV (fallback)
  if (process.env.NODE_ENV === 'production') {
    return 'production';
  }

  // Default to development
  return 'development';
}

/**
 * Finds the appropriate config file path with fallback logic
 */
function findConfigFile(configDir, fileName, environment) {
  const environments = [environment, 'preview', 'dev'];

  for (const env of environments) {
    const filePath = path.join(configDir, env, fileName);
    if (fs.existsSync(filePath)) {
      console.log(`✅ Using ${env} config: ${filePath}`);
      return filePath;
    }
  }

  // If no file found, return the requested path anyway (will show error during build)
  const defaultPath = path.join(configDir, environment, fileName);
  console.warn(`⚠️  Config file not found: ${defaultPath}`);
  return defaultPath;
}

/**
 * Main plugin function
 */
const withGoogleServices = (config) => {
  const environment = getBuildEnvironment();
  const configDir = path.resolve(__dirname, '../config');

  console.log(`🔧 Building with environment: ${environment}`);

  // iOS Google Services
  const iosGoogleServicesFile = findConfigFile(
    configDir,
    'GoogleService-Info.plist',
    environment
  );

  // Android Google Services
  const androidGoogleServicesFile = findConfigFile(
    configDir,
    'google-services.json',
    environment
  );

  // Update config paths (these will be used by @react-native-firebase/app plugin)
  if (!config.ios) {
    config.ios = {};
  }
  config.ios.googleServicesFile = iosGoogleServicesFile;

  if (!config.android) {
    config.android = {};
  }
  config.android.googleServicesFile = androidGoogleServicesFile;

  // Also update the Firebase plugin config if it exists
  const firebasePluginIndex = config.plugins?.findIndex(
    (plugin) => Array.isArray(plugin) && plugin[0] === '@react-native-firebase/app'
  );

  if (firebasePluginIndex !== undefined && firebasePluginIndex >= 0) {
    const firebasePlugin = config.plugins[firebasePluginIndex];
    if (Array.isArray(firebasePlugin) && firebasePlugin[1]) {
      if (!firebasePlugin[1].ios) {
        firebasePlugin[1].ios = {};
      }
      if (!firebasePlugin[1].android) {
        firebasePlugin[1].android = {};
      }
      firebasePlugin[1].ios.googleServicesFile = iosGoogleServicesFile;
      firebasePlugin[1].android.googleServicesFile = androidGoogleServicesFile;
    }
  }

  return config;


};

module.exports = withGoogleServices;

