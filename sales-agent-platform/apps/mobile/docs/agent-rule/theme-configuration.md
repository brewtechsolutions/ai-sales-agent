# Theme Configuration - Mobile App

## Overview

The mobile app uses NativeWind (Tailwind CSS for React Native) with a semantic color system that adapts automatically to light and dark modes.

## Tailwind Configuration

The theme is configured in `tailwind.config.js`:

```javascript
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // 🎨 Primary brand color
        primary: {
          DEFAULT: '#0ea5e9', // Sky blue
          50: '#f0f9ff',
          100: '#e0f2fe',
          // ... full scale
        },
        
        // ✅ Semantic colors
        success: {
          DEFAULT: '#10b981',
          light: '#d1fae5',
          dark: '#065f46',
        },
        error: {
          DEFAULT: '#ef4444',
          light: '#fee2e2',
          dark: '#991b1b',
        },
        warning: {
          DEFAULT: '#f59e0b',
          light: '#fef3c7',
          dark: '#92400e',
        },
        info: {
          DEFAULT: '#3b82f6',
          light: '#dbeafe',
          dark: '#1e40af',
        },
        
        // 🌅 Light mode colors
        background: '#ffffff',
        surface: '#f9fafb',
        card: '#ffffff',
        'text-primary': '#111827',
        'text-secondary': '#6b7280',
        'text-tertiary': '#9ca3af',
        border: '#e5e7eb',
        
        // 🌙 Dark mode colors
        'dark-background': '#0f172a',
        'dark-surface': '#1e293b',
        'dark-card': '#334155',
        'dark-text-primary': '#f1f5f9',
        'dark-text-secondary': '#cbd5e1',
        'dark-border': '#334155',
      },
      
      // iOS-style border radius
      borderRadius: {
        'ios': '12px',
        'ios-lg': '16px',
        'ios-xl': '20px',
      },
    },
  },
  plugins: [],
};
```

## Color Usage

### Primary Colors
```tsx
// Main primary
<View className="bg-primary text-primary-foreground">
  Primary
</View>

// Primary scale
<View className="bg-primary-500">Default</View>
<View className="bg-primary-600">Hover</View>
<View className="bg-primary-400">Light</View>
```

### Semantic Colors
```tsx
// Success
<View className="bg-success">
  <Text className="text-white">Success</Text>
</View>

// Error
<Text className="text-error">Error message</Text>

// Warning
<View className="bg-warning-light">
  <Text className="text-warning-dark">Warning</Text>
</View>

// Info
<View className="bg-info">
  <Text className="text-white">Info</Text>
</View>
```

### Background Colors
```tsx
// Light mode
<View className="bg-background">Main background</View>
<View className="bg-surface">Surface</View>
<View className="bg-card">Card</View>

// Dark mode (automatic with dark: prefix)
<View className="bg-background dark:bg-dark-background">Adaptive</View>
<View className="bg-card dark:bg-dark-card">Adaptive card</View>
```

### Text Colors
```tsx
// Light mode
<Text className="text-text-primary">Primary text</Text>
<Text className="text-text-secondary">Secondary text</Text>

// Dark mode (automatic)
<Text className="text-text-primary dark:text-dark-text-primary">
  Adaptive text
</Text>
```

### Border Colors
```tsx
<View className="border border-border dark:border-dark-border">
  Bordered content
</View>
```

## iOS Design Elements

### Border Radius
```tsx
<View className="rounded-ios">12px radius</View>
<View className="rounded-ios-lg">16px radius</View>
<View className="rounded-ios-xl">20px radius</View>
```

### Shadows
```tsx
<View className="shadow-ios">Subtle shadow</View>
<View className="shadow-ios-lg">Medium shadow</View>
<View className="shadow-ios-xl">Large shadow</View>
```

## React Native Elements Theme

The app also uses React Native Elements theme in `providers/ThemeProvider.tsx`:

```tsx
const lightTheme = {
  colors: {
    primary: '#000000',
    secondary: '#666666',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: '#000000',
    error: '#FF0000',
  },
};

const darkTheme = {
  colors: {
    primary: '#FFFFFF',
    secondary: '#CCCCCC',
    background: '#000000',
    surface: '#1A1A1A',
    text: '#FFFFFF',
    error: '#FF0000',
  },
};
```

## Using Theme in Components

### With NativeWind (Recommended)

```tsx
import { View, Text } from 'react-native';

export const Component = () => {
  return (
    <View className="bg-card dark:bg-dark-card p-4 rounded-ios-lg">
      <Text className="text-text-primary dark:text-dark-text-primary">
        Content
      </Text>
    </View>
  );
};
```

### With React Native Elements

```tsx
import { useTheme } from '@rneui/themed';

export const Component = () => {
  const { theme } = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.text }}>
        Content
      </Text>
    </View>
  );
};
```

### With useColorScheme Hook

```tsx
import { useColorScheme } from '@/hooks/useColorScheme';

export const Component = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return (
    <View className={isDark ? 'bg-dark-card' : 'bg-card'}>
      <Text className={isDark ? 'text-dark-text-primary' : 'text-text-primary'}>
        Content
      </Text>
    </View>
  );
};
```

## Customization

### Changing Primary Color

1. **Update Tailwind config** in `tailwind.config.js`:
```javascript
colors: {
  primary: {
    DEFAULT: '#your-color', // Change primary color
    // ... update scale
  },
}
```

2. **Update RNE theme** in `providers/ThemeProvider.tsx`:
```tsx
const lightTheme = {
  colors: {
    primary: '#your-color',
    // ...
  },
};
```

3. **Test** in both light and dark modes

### Adding New Colors

1. **Add to Tailwind config**:
```javascript
colors: {
  'new-color': '#color-value',
}
```

2. **Use in components**:
```tsx
<View className="bg-new-color">Content</View>
```

## Best Practices

### ✅ Do
- Use semantic color names
- Always include dark mode variants
- Use NativeWind classes when possible
- Test in both light and dark modes
- Use theme colors from RNE when using RNE components

### ❌ Don't
- Use hardcoded colors (`'#000000'`, `'#FFFFFF'`)
- Forget dark mode variants
- Mix semantic and hardcoded colors
- Use colors for unintended purposes
- Ignore platform-specific color differences

## Platform Considerations

### iOS
- Supports dark mode natively
- Use system colors when appropriate
- Respect safe areas

### Android
- Supports dark mode natively
- Handle status bar colors
- Respect navigation bar

## Related Documentation

- [Core Rules](./core-rules.md) - Coding standards
- [Component Standards](./component-standards.md) - Component guidelines
- [Localization Guide](./localization.md) - i18n setup

