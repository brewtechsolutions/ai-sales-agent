import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { TRPCProvider } from "@/providers/TRPCProvider";
import { KeyboardAvoidingView, Platform } from "react-native";
import { ToastProvider } from "../providers/ToastProvider";
import { I18nextProvider } from "react-i18next";
import i18n from "@/utils/i18n";
import { initGoogleSignIn } from "../components/auth/googleSignIn";

// Import global CSS for NativeWind
import "../global.css";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    initGoogleSignIn();
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <TRPCProvider>
          <ToastProvider>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              style={{ flex: 1 }}
            >
              <StatusBar style="dark" />
              <Slot />
            </KeyboardAvoidingView>
          </ToastProvider>
        </TRPCProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
}
