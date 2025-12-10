# Configuration Files

This directory contains environment-specific configuration files for Firebase/Google Services.

## Directory Structure

```
config/
├── dev/              # Development environment
│   ├── google-services.json
│   └── GoogleService-Info.plist
├── preview/          # Preview/Staging environment (optional)
│   ├── google-services.json
│   └── GoogleService-Info.plist
└── production/       # Production environment
    ├── google-services.json
    └── GoogleService-Info.plist
```

## Environment Detection

The app automatically detects the build environment using the following priority:

1. **`EAS_BUILD_PROFILE`** - Set automatically by EAS during cloud builds
2. **`EXPO_PUBLIC_ENV`** - Can be set manually for local builds
3. **`NODE_ENV`** - Falls back to `production` if set, otherwise `development`

## How It Works

The `with-google-services.js` config plugin automatically selects the correct configuration files based on the build environment:

- **Development builds**: Uses `./config/dev/` files
- **Preview builds**: Uses `./config/preview/` files (falls back to `dev/` if not found)
- **Production builds**: Uses `./config/production/` files (falls back to `preview/`, then `dev/`)

## Setup Instructions

### 1. Development Environment (Already Set Up)

The `dev/` folder already contains your development configuration files.

### 2. Preview/Staging Environment (Optional)

If you want a separate staging environment:

```bash
# Create preview directory
mkdir -p config/preview

# Copy your staging Firebase config files
# - config/preview/google-services.json (Android)
# - config/preview/GoogleService-Info.plist (iOS)
```

### 3. Production Environment

**Important**: You need to add your production Firebase config files:

```bash
# Create production directory
mkdir -p config/production

# Add your production Firebase config files:
# - config/production/google-services.json (Android)
# - config/production/GoogleService-Info.plist (iOS)
```

You can download these files from:
- [Firebase Console](https://console.firebase.google.com/)
- Select your project → Project Settings → Your apps

## Building for Different Environments

### Development Build (Local)
```bash
# Uses config/dev/ automatically
bun run android
bun run ios
```

### Development Build (EAS)
```bash
# Uses config/dev/ automatically
bun run build:android
bun run build:ios
```

### Preview/Staging Build (EAS)
```bash
# Uses config/preview/ (or config/dev/ if preview doesn't exist)
bun run build:android:preview
bun run build:ios:preview
```

### Production Build (EAS)
```bash
# Uses config/production/ (with fallback chain)
bun run build:android:production
bun run build:ios:production
```

## Local Development with Different Environment

If you want to test a different environment locally:

```bash
# Test with preview config
EXPO_PUBLIC_ENV=preview bun run android

# Test with production config
EXPO_PUBLIC_ENV=production bun run android
```

## Security Notes

⚠️ **Important**: These config files may contain sensitive information. Make sure:

- ✅ Production config files are **NOT** committed to git (add to `.gitignore`)
- ✅ Only development config files should be in version control (if safe)
- ✅ Use EAS Secrets for sensitive production values when possible

## Troubleshooting

### "Config file not found" Warning

If you see a warning about missing config files:
1. Check that the directory exists (e.g., `config/production/`)
2. Verify file names are correct:
   - Android: `google-services.json` (lowercase, with hyphen)
   - iOS: `GoogleService-Info.plist` (exact case)

### Wrong Environment Detected

If the wrong config is being used:
1. Check `EAS_BUILD_PROFILE` environment variable
2. Verify your `eas.json` build profiles are correct
3. For local builds, set `EXPO_PUBLIC_ENV` explicitly

### Plugin Not Running

If the plugin isn't working:
1. Make sure `./plugins/with-google-services.js` is in your `app.json` plugins array
2. Run `expo prebuild --clean` to regenerate native files
3. Check the build logs for plugin execution messages

## Related Documentation

- [EAS Build Profiles](../docs/eas-build-profiles.md) (if exists)
- [Firebase Setup Guide](../docs/firebase-setup.md) (if exists)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)

