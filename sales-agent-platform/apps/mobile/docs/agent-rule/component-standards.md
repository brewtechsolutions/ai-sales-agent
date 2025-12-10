# Component Standards - React Native

## Component Structure Template

Every React Native component should follow this structure:

```tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from '@/hooks/useColorScheme';

interface ComponentProps {
  // Define props with types
  title?: string;
  onPress?: () => void;
}

export const Component: React.FC<ComponentProps> = ({
  title,
  onPress,
}) => {
  // 1. Hooks
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // 2. State
  const [state, setState] = React.useState();

  // 3. Computed values
  const computedValue = React.useMemo(() => {
    // Computation
  }, [dependencies]);

  // 4. Handlers
  const handlePress = React.useCallback(() => {
    // Logic
    onPress?.();
  }, [onPress]);

  // 5. Render
  return (
    <View className="
      bg-card dark:bg-dark-card
      p-4 rounded-ios-lg
      shadow-ios
    ">
      <Text className="text-text-primary dark:text-dark-text-primary">
        {title || t('defaultTitle')}
      </Text>
    </View>
  );
};
```

## Required Elements

### 1. TypeScript Interface
Always define props with TypeScript:

```tsx
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ ... }) => {
  // ...
};
```

### 2. Localization (i18n)
All user-facing text must use i18n:

```tsx
// ✅ Correct
const { t } = useTranslation();
<Text>{t('welcome')}</Text>

// ❌ Wrong
<Text>Welcome</Text>
```

### 3. Semantic Colors
Always use semantic color names:

```tsx
// ✅ Correct
<View className="bg-primary-500 text-primary-foreground">
<View className="bg-card dark:bg-dark-card">

// ❌ Wrong
<View style={{ backgroundColor: '#000000' }}>
<View style={{ backgroundColor: '#FFFFFF' }}>
```

### 4. Dark Mode Support
Every color needs dark mode variant:

```tsx
// ✅ Correct
<Text className="text-text-primary dark:text-dark-text-primary">
<View className="bg-card dark:bg-dark-card">

// ❌ Wrong
<Text style={{ color: '#000000' }}>
<View style={{ backgroundColor: '#FFFFFF' }}>
```

### 5. Platform-Specific Handling
Handle iOS/Android differences:

```tsx
import { Platform } from 'react-native';

// ✅ Correct
const padding = Platform.select({
  ios: 16,
  android: 12,
});

<View style={{ padding }} />

// Or with Platform.OS
{Platform.OS === 'ios' && <IOSComponent />}
```

### 6. Safe Areas
Respect safe areas:

```tsx
import { SafeAreaView } from 'react-native-safe-area-context';

// ✅ Correct
<SafeAreaView className="flex-1 bg-background">
  <View>Content</View>
</SafeAreaView>
```

### 7. Accessibility
Include accessibility attributes:

```tsx
// ✅ Correct
<TouchableOpacity
  accessibilityLabel={t('buttonLabel')}
  accessibilityRole="button"
  accessibilityHint={t('buttonHint')}
>
  <Text>{t('buttonText')}</Text>
</TouchableOpacity>
```

## Component Naming

### File Names
- Use **PascalCase**: `UserProfile.tsx` ✅
- NOT kebab-case: `user-profile.tsx` ❌

### Component Names
- Match file name: `UserProfile.tsx` → `export const UserProfile`
- Use descriptive names: `UserProfileCard` ✅ NOT `Card` ❌

## Styling Guidelines

### Use NativeWind (Tailwind for RN)

```tsx
// ✅ Correct - Use className
<View className="flex-1 bg-card p-4 rounded-ios-lg">
  <Text className="text-text-primary text-lg font-semibold">
    {t('title')}
  </Text>
</View>

// ❌ Wrong - Avoid inline styles when possible
<View style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 16 }}>
  <Text style={{ color: '#000000', fontSize: 18 }}>
    Title
  </Text>
</View>
```

### When to Use StyleSheet

Use `StyleSheet.create()` for:
- Complex calculations
- Platform-specific styles
- Performance-critical styles
- Styles that need to be reused

```tsx
const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: { paddingTop: 20 },
      android: { paddingTop: 10 },
    }),
  },
});
```

## State Management

### Local State - Use React Hooks

```tsx
// ✅ Use useState for local component state
const [count, setCount] = React.useState(0);

// ✅ Use useMemo for expensive computations
const expensiveValue = React.useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// ✅ Use useCallback for stable function references
const handlePress = React.useCallback(() => {
  onPress?.();
}, [onPress]);
```

### Global State - Use Zustand

```tsx
import { useAuthStore } from '@/stores/useAuthStore';

// ✅ Good - Select only what you need
const user = useAuthStore((state) => state.user);
const login = useAuthStore((state) => state.login);

// ✅ Good - Multiple selective values
const { user, isLoading } = useAuthStore((state) => ({
  user: state.user,
  isLoading: state.isLoading,
}));

// ❌ Bad - Subscribes to entire store
const { user, login, isLoading, error } = useAuthStore();
```

### When to Use What

- **useState** - Local component state (form inputs, UI toggles)
- **Zustand** - Global app state (auth, user data, app settings)
- **React Query** - Server state (API data, caching)
- **useMemo/useCallback** - Performance optimization

### Use React.memo for Performance

```tsx
export const ExpensiveComponent = React.memo<ComponentProps>(({ ... }) => {
  // Component code
});
```

## Event Handlers

### Typed Handlers

```tsx
interface ButtonProps {
  onPress: () => void;
  onLongPress?: () => void;
}

const handlePress = React.useCallback(() => {
  onPress();
}, [onPress]);
```

### With Parameters

```tsx
interface ListItemProps {
  onItemPress: (id: string) => void;
}

const handlePress = React.useCallback(() => {
  onItemPress(item.id);
}, [item.id, onItemPress]);
```

## Component Examples

### Button Component

```tsx
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';

interface ButtonProps {
  title?: string;
  titleKey?: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  titleKey,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
}) => {
  const { t } = useTranslation();
  const displayTitle = title || (titleKey ? t(titleKey) : t('button'));

  return (
    <TouchableOpacity
      className={`
        px-6 py-3 rounded-ios-lg
        ${variant === 'primary' ? 'bg-primary-500' : ''}
        ${variant === 'secondary' ? 'bg-secondary' : ''}
        ${variant === 'outline' ? 'border border-primary-500' : ''}
        ${disabled || loading ? 'opacity-50' : ''}
      `}
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityLabel={displayTitle}
      accessibilityRole="button"
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className={`
          text-center font-semibold
          ${variant === 'outline' ? 'text-primary-500' : 'text-white'}
        `}>
          {displayTitle}
        </Text>
      )}
    </TouchableOpacity>
  );
};
```

### Card Component

```tsx
import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

interface CardProps {
  title?: string;
  titleKey?: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  title,
  titleKey,
  children,
}) => {
  const { t } = useTranslation();
  const displayTitle = title || (titleKey ? t(titleKey) : undefined);

  return (
    <View className="
      bg-card dark:bg-dark-card
      rounded-ios-lg shadow-ios-lg
      p-4 mb-4
    ">
      {displayTitle && (
        <Text className="
          text-text-primary dark:text-dark-text-primary
          text-lg font-semibold mb-2
        ">
          {displayTitle}
        </Text>
      )}
      {children}
    </View>
  );
};
```

## Best Practices

1. **Keep components small and focused** - One responsibility per component
2. **Use composition** - Break complex components into smaller ones
3. **Memoize expensive operations** - Use `useMemo` and `useCallback`
4. **Handle loading and error states** - Always show appropriate states
5. **Test on both platforms** - iOS and Android can behave differently
6. **Accessibility first** - Always include accessibility attributes
7. **Type safety** - Use TypeScript for all props and state
8. **Localization** - All user-facing text must use i18n

## Performance Tips

1. **Use React.memo** for components that re-render frequently
2. **Use useMemo** for expensive computations
3. **Use useCallback** for stable function references
4. **Optimize images** - Use appropriate formats and sizes
5. **Lazy load** - Use `React.lazy` for code splitting when possible
6. **Avoid inline functions** in render - Use useCallback

## Related Documentation

- [Core Rules](./core-rules.md) - Essential coding standards
- [Localization Guide](./localization.md) - i18n setup
- [Theme Configuration](./theme-configuration.md) - Color system

