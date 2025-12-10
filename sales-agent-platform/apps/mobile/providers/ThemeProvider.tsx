import React from "react";
import { ThemeProvider as RNEThemeProvider } from "@rneui/themed";
import { useColorScheme } from "react-native";

// Using semantic colors from tailwind config
const lightTheme = {
  colors: {
    primary: "#0ea5e9", // primary-500
    secondary: "#6b7280", // text-secondary
    background: "#ffffff", // background
    surface: "#f9fafb", // surface
    card: "#ffffff", // card
    text: "#111827", // text-primary
    error: "#ef4444", // error
    success: "#10b981", // success
    warning: "#f59e0b", // warning
    info: "#3b82f6", // info
    border: "#e5e7eb", // border
  },
};

const darkTheme = {
  colors: {
    primary: "#0ea5e9", // primary-500
    secondary: "#cbd5e1", // dark-text-secondary
    background: "#0f172a", // dark-background
    surface: "#1e293b", // dark-surface
    card: "#334155", // dark-card
    text: "#f1f5f9", // dark-text-primary
    error: "#ef4444", // error
    success: "#10b981", // success
    warning: "#f59e0b", // warning
    info: "#3b82f6", // info
    border: "#334155", // dark-border
  },
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;

  return <RNEThemeProvider theme={theme}>{children}</RNEThemeProvider>;
};
