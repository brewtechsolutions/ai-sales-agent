# Mobile App - React Native with Expo

This is a React Native mobile app built with Expo, featuring iOS-inspired design, dark mode, and multi-language support.

## ⚠️ Important: Development Build Required

This app uses **Expo Development Build** (not Expo Go) because it includes:
- React Native Reanimated
- New React Native Architecture
- Custom native modules
- NativeWind styling

**Expo Go will not work with this app.** You must use a development build.

## 🚀 Quick Start

### First Time Setup

1. **Install dependencies:**
   ```bash
   bun install
   ```

2. **Configure environment variables:**
   ```bash
   # Copy example env file
   cp .env.example .env
   
   # Edit .env and set EXPO_PUBLIC_API_URL:
   # - Android Emulator: http://10.0.2.2:3000
   # - iOS Simulator: http://localhost:3000
   # - Physical Device: http://YOUR_LOCAL_IP:3000
   ```

3. **Build development client locally:**
   ```bash
   # Android
   bun run android
   
   # iOS (macOS only)
   bun run ios
   ```

### Daily Development

```bash
# Start development server
bun run dev

# The development build app will automatically connect
```

## 📚 Documentation

- **[Setup Guide](./SETUP.md)** - Complete setup and troubleshooting
- **[AI Agent Rules](./docs/agent-rule/README.md)** - Coding standards
- **[Localization Guide](./docs/localization/README.md)** - i18n setup

## 🛠️ Available Scripts

- `bun run dev` - Start dev server with dev client
- `bun run android` - Build and run on Android
- `bun run ios` - Build and run on iOS
- `bun run build:android` - Build Android on EAS
- `bun run build:ios` - Build iOS on EAS
- `bun run build:all` - Build both platforms on EAS

## 📖 Learn More

- [Expo Development Builds](https://docs.expo.dev/development/introduction/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
