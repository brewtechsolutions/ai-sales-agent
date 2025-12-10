# Development Build Setup

This app uses **Expo Development Build** instead of Expo Go for better compatibility and performance.

## Why Development Build?

- ✅ **Full Native Module Support** - Works with all native modules (reanimated, gesture-handler, etc.)
- ✅ **New Architecture Support** - Supports React Native's new architecture
- ✅ **Better Performance** - Faster than Expo Go
- ✅ **Custom Native Code** - Can add custom native code if needed
- ✅ **No Limitations** - No restrictions from Expo Go

## Prerequisites

1. **Install EAS CLI globally:**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo:**
   ```bash
   eas login
   ```

3. **Configure EAS (first time only):**
   ```bash
   cd apps/mobile
   eas build:configure
   ```

## Quick Start

### Option 1: Local Development Build (Recommended for Daily Use)

**Build and run locally on your machine:**

#### Android:
```bash
# Build and install on connected device/emulator
bun run android

# Or manually:
npx expo run:android
```

#### iOS (macOS only):
```bash
# Build and install on simulator/device
bun run ios

# Or manually:
npx expo run:ios
```

**Then start the dev server:**
```bash
bun run dev
# or
bun run start
```

### Option 2: EAS Cloud Build (For Team Sharing)

**Build on EAS servers:**

#### Android:
```bash
bun run build:android
# or
eas build --profile development --platform android
```

#### iOS:
```bash
bun run build:ios
# or
eas build --profile development --platform ios
```

#### Both:
```bash
bun run build:all
# or
eas build --profile development --platform all
```

**After build completes:**
1. Download the build from EAS dashboard or scan QR code
2. Install on your device
3. Start dev server: `bun run dev`
4. Connect to the dev server

## Development Workflow

### Daily Development:

1. **Start the dev server:**
   ```bash
   bun run dev
   ```

2. **Open the development build app** on your device/simulator

3. **The app will automatically connect** to the dev server

4. **Make changes** - Hot reload works just like Expo Go!

### When You Add New Native Dependencies:

If you add a package that requires native code:

1. **Rebuild the development build:**
   ```bash
   # Android
   bun run android
   
   # iOS
   bun run ios
   ```

2. **Or rebuild on EAS:**
   ```bash
   bun run build:android  # or build:ios
   ```

## Troubleshooting

### App won't connect to dev server:

1. **Check network:** Make sure device and computer are on same network
2. **Check firewall:** Allow Expo/Metro bundler through firewall
3. **Try tunnel mode:**
   ```bash
   bun run dev --tunnel
   ```

### Build fails:

1. **Clear cache:**
   ```bash
   npx expo start -c
   ```

2. **Clean build:**
   ```bash
   # Android
   cd android && ./gradlew clean && cd ..
   
   # iOS
   cd ios && pod install && cd ..
   ```

### Metro bundler issues:

```bash
# Reset Metro cache
npx expo start -c

# Clear watchman
watchman watch-del-all
```

## Differences from Expo Go

| Feature | Expo Go | Development Build |
|---------|---------|-------------------|
| Native modules | Limited | Full support |
| New Architecture | ❌ | ✅ |
| Custom native code | ❌ | ✅ |
| Performance | Slower | Faster |
| Build required | No | Yes (once) |
| Hot reload | ✅ | ✅ |
| Fast refresh | ✅ | ✅ |

## Scripts Reference

- `bun run dev` - Start dev server with dev client
- `bun run android` - Build and run on Android
- `bun run ios` - Build and run on iOS
- `bun run build:android` - Build Android on EAS
- `bun run build:ios` - Build iOS on EAS
- `bun run build:all` - Build both platforms on EAS

## Need Help?

- [Expo Development Builds Docs](https://docs.expo.dev/development/introduction/)
- [EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [Troubleshooting Guide](https://docs.expo.dev/development/troubleshooting/)

