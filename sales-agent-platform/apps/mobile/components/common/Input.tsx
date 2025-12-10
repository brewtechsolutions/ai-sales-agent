import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  errorMessage?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'number-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: string;
  icon?: string;
  style?: any;
}

export const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  errorMessage,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoComplete,
  icon,
  style,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const colors = {
    background: isDark ? '#1e293b' : '#ffffff',
    backgroundFocused: isDark ? '#334155' : '#f9fafb',
    border: isDark ? '#334155' : '#e5e7eb',
    borderFocused: isDark ? '#38bdf8' : '#0ea5e9',
    text: isDark ? '#f1f5f9' : '#111827',
    label: isDark ? '#cbd5e1' : '#6b7280',
    placeholder: isDark ? '#94a3b8' : '#9ca3af',
    error: '#ef4444',
    icon: isDark ? '#cbd5e1' : '#6b7280',
  };

  const inputStyles = StyleSheet.create({
    container: {
      marginBottom: 20,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.label,
      marginBottom: 8,
      paddingHorizontal: 4,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      borderWidth: 1.5,
      borderColor: isFocused ? colors.borderFocused : colors.border,
      borderRadius: 16, // rounded-ios-lg
      paddingHorizontal: 16,
      paddingVertical: 16,
      minHeight: 56, // 44px minimum + padding
      shadowColor: isFocused ? (isDark ? '#38bdf8' : '#0ea5e9') : '#000',
      shadowOffset: { width: 0, height: isFocused ? 4 : 2 },
      shadowOpacity: isFocused ? 0.1 : 0.05,
      shadowRadius: isFocused ? 8 : 4,
      elevation: isFocused ? 4 : 2,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
      padding: 0,
      margin: 0,
    },
    iconContainer: {
      marginRight: 12,
    },
    passwordToggle: {
      padding: 4,
      marginLeft: 8,
    },
    errorContainer: {
      marginTop: 6,
      paddingHorizontal: 4,
    },
    errorText: {
      fontSize: 13,
      color: colors.error,
    },
  });

  return (
    <View style={[inputStyles.container, style]}>
      {label && <Text style={inputStyles.label}>{label}</Text>}
      <View
        style={[
          inputStyles.inputContainer,
          isFocused && {
            backgroundColor: colors.backgroundFocused,
          },
        ]}
      >
        {icon && (
          <View style={inputStyles.iconContainer}>
            <MaterialIcons name={icon as any} size={22} color={colors.icon} />
          </View>
        )}
        <TextInput
          style={inputStyles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete as any}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          accessibilityLabel={label}
          accessibilityHint={placeholder}
        />
        {secureTextEntry && (
          <TouchableOpacity
            style={inputStyles.passwordToggle}
            onPress={() => setShowPassword(!showPassword)}
            accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
            accessibilityRole="button"
          >
            <MaterialIcons
              name={showPassword ? 'visibility-off' : 'visibility'}
              size={22}
              color={colors.icon}
            />
          </TouchableOpacity>
        )}
      </View>
      {errorMessage && (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          style={inputStyles.errorContainer}
        >
          <Text style={inputStyles.errorText}>{errorMessage}</Text>
        </Animated.View>
      )}
    </View>
  );
};
