# EAS Environment Detection & Configuration

## Overview

This document explains how the mobile app automatically detects and switches between development, preview, and production configurations when building with EAS (Expo Application Services).

## How Environment Detection Works

### Detection Priority

The system detects the build environment using this priority order:

1. **`EAS_BUILD_PROFILE`** (Highest Priority)
   - Automatically set by EAS during cloud builds
   - Values: `development`, `preview`, or `production`
   - Set in `eas.json` build profiles

2. **`EXPO_PUBLIC_ENV`** (For Local Builds)
   - Can be manually set for local testing
   - Useful for testing different environments locally
   - Example: `EXPO_PUBLIC_ENV=production bun run android`

3. **`NODE_ENV`** (Fallback)
   - Standard Node.js environment variable
   - If set to `production`, uses production config
   - Otherwise defaults to `development`

### Automatic Configuration Selection

The `with-google-services.js` config plugin automatically selects the correct Firebase/Google Services configuration files:

```
Environment → Config Directory → Fallback Chain
─────────────────────────────────────────────────
development → config/dev/       → (no fallback)
preview     → config/preview/   → config/dev/
production  → config/production/ → config/preview/ → config/dev/
```

## File Structure

```
apps/mobile/
├── eas.json                          # EAS build profiles
├── app.json                          # App configuration
├── plugins/
│   └── with-google-services.js       # Environment detection plugin
└── config/
    ├── dev/
    │   ├── google-services.json      # Android (dev)
    │   └── GoogleService-Info.plist # iOS (dev)
    ├── preview/                      # Optional
    │   ├── google-services.json
    │   └── GoogleService-Info.plist
    └── production/
        ├── google-services.json      # Android (prod)
        └── GoogleService-Info.plist # iOS (prod)
```

## EAS Build Profiles

The `eas.json` file defines three build profiles:

### Development Profile
```json
{
  "development": {
    "developmentClient": true,
    "distribution": "internal",
    "env": {
      "EAS_BUILD_PROFILE": "development"
    }
  }
}
```
- **Use case**: Local development and testing
- **Config used**: `config/dev/`
- **Build command**: `eas build --profile development`

### Preview Profile
```json
{
  "preview": {
    "distribution": "internal",
    "env": {
      "EAS_BUILD_PROFILE": "preview"
    }
  }
}
```
- **Use case**: Internal testing, QA, staging
- **Config used**: `config/preview/` (falls back to `config/dev/`)
- **Build command**: `eas build --profile preview`

### Production Profile
```json
{
  "production": {
    "distribution": "store",
    "env": {
      "EAS_BUILD_PROFILE": "production"
    }
  }
}
```
- **Use case**: App Store / Play Store releases
- **Config used**: `config/production/` (with fallback chain)
- **Build command**: `eas build --profile production`

## Usage Examples

### Building for Development (EAS)
```bash
# Uses config/dev/ automatically
eas build --profile development --platform android
# or
bun run build:android
```

### Building for Preview/Staging (EAS)
```bash
# Uses config/preview/ (or config/dev/ if preview doesn't exist)
eas build --profile preview --platform android
# or
bun run build:android:preview
```

### Building for Production (EAS)
```bash
# Uses config/production/ (with fallback chain)
eas build --profile production --platform android
# or
bun run build:android:production
```

### Local Development
```bash
# Default: uses config/dev/
bun run android
bun run ios

# Test with different environment locally
EXPO_PUBLIC_ENV=preview bun run android
EXPO_PUBLIC_ENV=production bun run android
```

## How the Plugin Works

The `with-google-services.js` plugin:

1. **Runs during `expo prebuild`** - Before native code generation
2. **Detects environment** - Using the priority system above
3. **Finds config files** - With automatic fallback logic
4. **Updates app.json** - Sets `ios.googleServicesFile` and `android.googleServicesFile`
5. **Updates Firebase plugin config** - Ensures `@react-native-firebase/app` uses correct files
6. **Applies native configs** - Uses Expo's built-in Google Services plugins

### Plugin Execution Flow

```
Build Starts
    ↓
EAS sets EAS_BUILD_PROFILE=production
    ↓
expo prebuild runs
    ↓
with-google-services.js plugin executes
    ↓
Detects environment: "production"
    ↓
Looks for: config/production/google-services.json
    ↓
If not found → tries: config/preview/google-services.json
    ↓
If not found → tries: config/dev/google-services.json
    ↓
Updates app.json and Firebase plugin config
    ↓
Native code generated with correct config
```

## Setting Up Production Config

### Step 1: Create Production Directory
```bash
mkdir -p apps/mobile/config/production
```

### Step 2: Add Production Firebase Config Files

Download from [Firebase Console](https://console.firebase.google.com/):

1. Go to your Firebase project
2. Project Settings → Your apps
3. Download:
   - **Android**: `google-services.json` → `config/production/google-services.json`
   - **iOS**: `GoogleService-Info.plist` → `config/production/GoogleService-Info.plist`

### Step 3: Verify File Names

⚠️ **Critical**: File names must be exact:
- Android: `google-services.json` (lowercase, hyphen)
- iOS: `GoogleService-Info.plist` (exact case)

### Step 4: Test Production Build
```bash
# Test locally first
EXPO_PUBLIC_ENV=production bun run android

# Then build on EAS
eas build --profile production --platform android
```

## Troubleshooting

### Issue: Wrong Config Being Used

**Symptoms**: App connects to wrong Firebase project

**Solutions**:
1. Check `EAS_BUILD_PROFILE` in build logs
2. Verify `eas.json` profile has correct `EAS_BUILD_PROFILE` env var
3. Check plugin execution logs for detected environment
4. Verify config files exist in expected directories

### Issue: "Config file not found" Warning

**Symptoms**: Build warning about missing config files

**Solutions**:
1. Create the missing directory: `mkdir -p config/production`
2. Verify file names are correct (case-sensitive!)
3. Check file paths in plugin logs
4. Ensure files are not in `.gitignore` (if needed for build)

### Issue: Plugin Not Running

**Symptoms**: Always uses dev config regardless of profile

**Solutions**:
1. Verify plugin is in `app.json` plugins array:
   ```json
   "plugins": [
     "./plugins/with-google-services.js",
     ...
   ]
   ```
2. Run `expo prebuild --clean` to regenerate
3. Check plugin is listed before `@react-native-firebase/app` plugin
4. Check build logs for plugin execution messages

### Issue: Local Build Uses Wrong Environment

**Symptoms**: Local build doesn't match expected environment

**Solutions**:
1. Set `EXPO_PUBLIC_ENV` explicitly:
   ```bash
   EXPO_PUBLIC_ENV=production bun run android
   ```
2. Check `NODE_ENV` environment variable
3. Verify local config files exist

## Best Practices

### ✅ Do

- **Separate Firebase projects** for dev/preview/production
- **Use EAS Secrets** for sensitive production values
- **Test production builds** before submitting to stores
- **Keep dev configs in git** (if safe)
- **Document config file locations** in team docs

### ❌ Don't

- **Commit production configs** to git (use EAS Secrets or secure storage)
- **Hardcode environment values** in code
- **Use production Firebase** for development
- **Skip testing** production builds locally
- **Rename config files** (must match exact names)

## Related Files

- `eas.json` - EAS build profile configuration
- `app.json` - App configuration (updated by plugin)
- `plugins/with-google-services.js` - Environment detection plugin
- `config/README.md` - Config directory documentation

## Additional Resources

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Expo Config Plugins](https://docs.expo.dev/config-plugins/introduction/)
- [Firebase Setup Guide](https://firebase.google.com/docs)
- [EAS Environment Variables](https://docs.expo.dev/build-reference/variables/)

