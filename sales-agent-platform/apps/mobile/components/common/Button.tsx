import { Button as RNEButton } from "@rneui/themed";
import { StyleProp, ViewStyle, TextStyle, StyleSheet } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  className?: string;
}

export const Button = ({
  title,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  style,
}: ButtonProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Semantic colors from theme
  const colors = {
    primary: isDark ? "#0284c7" : "#0ea5e9", // primary-600 : primary-500
    primaryForeground: "#ffffff",
    surface: isDark ? "#1e293b" : "#f9fafb",
    textPrimary: isDark ? "#f1f5f9" : "#111827",
    textSecondary: isDark ? "#cbd5e1" : "#6b7280",
    border: isDark ? "#334155" : "#e5e7eb",
  };

  const styles = StyleSheet.create({
    button: {
      borderRadius: 12, // rounded-ios
      ...(variant === "primary" && { backgroundColor: colors.primary }),
      ...(variant === "secondary" && { backgroundColor: colors.surface }),
      ...(variant === "outline" && {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: colors.border,
      }),
      ...(size === "sm" && { paddingVertical: 8, paddingHorizontal: 16 }),
      ...(size === "md" && { paddingVertical: 12, paddingHorizontal: 24 }),
      ...(size === "lg" && { paddingVertical: 16, paddingHorizontal: 32 }),
    },
    title: {
      fontWeight: "600",
      ...(variant === "outline" || variant === "secondary"
        ? { color: colors.textPrimary }
        : { color: colors.primaryForeground }),
    },
  });

  return (
    <RNEButton
      title={title}
      onPress={onPress}
      disabled={disabled}
      loading={loading}
      buttonStyle={[styles.button, style]}
      titleStyle={styles.title}
    />
  );
};
