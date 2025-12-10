# Core Coding Rules - Mobile App

## 🎯 Core Responsibilities

### 1. **Code Review Mode** (Always Active)
When reviewing or creating React Native code, you MUST:
1. ✅ Acknowledge what the code is trying to do
2. 🔍 Scan for violations of the rules below
3. 💡 Suggest improvements with clear examples
4. ⚠️ Call out critical issues (hardcoded colors, missing i18n, accessibility issues)

### 2. **Proactive Theme Setup**
When starting ANY new component:
- First check: "Do you have a theme configuration with semantic colors?"
- If no, immediately provide the complete starter template
- If yes, reference it and enforce its usage

### 3. **Localization First**
When adding any user-facing text:
- **NEVER** hardcode strings: `"Welcome"` ❌
- **ALWAYS** use i18n: `t('welcome')` ✅
- Check if translation key exists, create if needed

### 4. **Teaching Moments**
When correcting mistakes, briefly explain the principle:
- "We use semantic names like `bg-primary` instead of hardcoded colors because..."
- "All user-facing text must use i18n for localization support..."
- "React Native components need platform-specific handling..."

---

## 📋 Mandatory Rules Enforcement

### CRITICAL RULE #1: No Hardcoded Colors
**You must REJECT any code with hardcoded colors like `'#000000'`, `'#FFFFFF'`, etc.**

**Your Response:**
```
⚠️ **Stop! Hardcoded colors detected:**

I see you're using `color: '#000000'`. This needs to use semantic colors from your theme.

**Quick fix:**
- `color: '#000000'` → `className="text-text-primary"`
- `backgroundColor: '#FFFFFF'` → `className="bg-card dark:bg-dark-card"`

**Don't have a theme config yet?** Let me set one up for you!
```

### CRITICAL RULE #2: Localization Required
**You must REJECT any hardcoded user-facing strings.**

**Your Response:**
```
⚠️ **Stop! Hardcoded text detected:**

I see you're using `"Welcome"` directly. This needs to use i18n for localization.

**Quick fix:**
- `"Welcome"` → `t('welcome')`
- Add translation keys to `locales/en.json` and `locales/zh.json`

**Example:**
// locales/en.json
{ "welcome": "Welcome" }

// locales/zh.json
{ "welcome": "欢迎" }
```

### CRITICAL RULE #3: Dark Mode Support
If you see ANY component without dark mode support, immediately add it:
- Use `className` with `dark:` variants: `className="bg-card dark:bg-dark-card"`
- Or use theme colors that adapt automatically

### CRITICAL RULE #4: Platform-Specific Handling
React Native components must handle iOS and Android differences:
- Use `Platform.OS === 'ios'` for platform checks
- Use `Platform.select()` for platform-specific styles
- Handle safe areas with `SafeAreaView` or `useSafeAreaInsets()`

### CRITICAL RULE #5: TypeScript Types
All props, state, and functions must have TypeScript types:
- Define interfaces for all props
- Use proper types for state
- Type all function parameters and return values

### CRITICAL RULE #6: Zustand for State Management
**You must use Zustand for global state management.**

**Your Response:**
```
⚠️ **State Management Rule:**

For global state, use Zustand stores instead of React Context or prop drilling.

**Quick fix:**
- Create a store in `stores/useStoreName.ts`
- Use `useStore` hook in components
- Select only needed state to prevent re-renders

**Example:**
// stores/useAuthStore.ts
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: (user) => set({ user }),
}));

// In component
const user = useAuthStore((state) => state.user);
```

### CRITICAL RULE #7: No Hardcoded Values - Use Enums or Constants
**You must REJECT any code with hardcoded magic strings, numbers, or values.**

**Your Response:**
```
⚠️ **Stop! Hardcoded values detected:**

I see you're using hardcoded values like `"active"`, `"pending"`, `500`, `"admin"`. These need to be defined as enums or constants.

**Quick fix:**
- Create enums for string literals: `enum UserStatus { ACTIVE = "active", PENDING = "pending" }`
- Create constants for magic numbers: `const MAX_RETRIES = 3`
- Create constants for repeated strings: `const USER_ROLES = { ADMIN: "admin", USER: "user" } as const`

**Example:**
// ❌ Wrong
if (status === "active") { ... }
if (role === "admin") { ... }
if (retries > 5) { ... }

// ✅ Correct
// constants/user.ts
export enum UserStatus {
  ACTIVE = "active",
  PENDING = "pending",
  INACTIVE = "inactive",
}

export const USER_ROLES = {
  ADMIN: "admin",
  USER: "user",
  MODERATOR: "moderator",
} as const;

export const MAX_RETRIES = 5;

// Usage
if (status === UserStatus.ACTIVE) { ... }
if (role === USER_ROLES.ADMIN) { ... }
if (retries > MAX_RETRIES) { ... }
```

### CRITICAL RULE #8: Must Define DTOs - No Inline Types
**You must REJECT any code with inline object types or lazy type definitions.**

**Your Response:**
```
⚠️ **Stop! Inline types detected:**

I see you're using inline types like `{ x: string, y: number }` or `body: { name: string, age: number }`. These need to be defined as proper DTOs/schemas.

**Quick fix:**
- Define TypeScript interfaces/types for all data structures
- For API requests/responses, use Zod schemas: `z.object({ name: z.string(), age: z.number() })`
- Export types from schemas: `export type CreateUserDto = z.infer<typeof createUserSchema>`
- Use the DTO types in functions and components

**Example:**
// ❌ Wrong
function createUser(body: { name: string; email: string; age: number }) { ... }
const data: { x: string; y: number } = { x: "test", y: 123 };
const response: { success: boolean; data: any } = await api.post(...);

// ✅ Correct
// types/user.ts
export interface CreateUserDto {
  name: string;
  email: string;
  age: number;
}

export interface UserResponse {
  success: boolean;
  data: User;
}

// Or with Zod (for API validation)
// schemas/user.ts
import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  age: z.number().int().positive(),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;

// Usage
function createUser(body: CreateUserDto) { ... }
const data: CreateUserDto = { name: "test", email: "test@example.com", age: 25 };
const response: UserResponse = await api.post<CreateUserDto, UserResponse>(...);
```

---

## 🛠️ Code Generation Standards

### When Creating Components:

**1. Start with the theme and i18n check:**
```
Before we build this component, let's make sure:
1. Your theme is configured with semantic colors
2. i18n is set up for localization
3. Translation keys are available

If not, I'll set these up first.
```

**2. Use this exact component structure:**
```tsx
import React from 'react';
import { View, Text } from 'react-native';
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
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

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

**3. Always include:**
- TypeScript interface for props
- i18n hook: `const { t } = useTranslation()`
- Dark mode support
- Zustand stores for global state (if needed)
- Platform-specific handling if needed

---

## 🚨 Common Mistake Patterns to Auto-Detect

### Pattern 1: Hardcoded Colors
**Detect:** `color: '#000000'`, `backgroundColor: '#FFFFFF'`, etc.
**Action:** Immediately flag and provide correction

### Pattern 2: Hardcoded Text
**Detect:** String literals in JSX: `<Text>Welcome</Text>`
**Action:** Replace with i18n: `<Text>{t('welcome')}</Text>`

### Pattern 3: No Dark Mode
**Detect:** Components without dark mode variants
**Action:** Add dark mode classes automatically

### Pattern 4: Missing TypeScript Types
**Detect:** Props without interfaces, `any` types
**Action:** Add proper TypeScript types

### Pattern 5: Platform-Specific Issues
**Detect:** Code that doesn't handle iOS/Android differences
**Action:** Add platform checks and handling

### Pattern 6: Missing Safe Areas
**Detect:** Components that don't respect safe areas
**Action:** Add SafeAreaView or useSafeAreaInsets()

### Pattern 7: Wrong State Management
**Detect:** Using Context API or prop drilling for global state
**Action:** Use Zustand store instead

### Pattern 8: Hardcoded Values
**Detect:** Magic strings (`"active"`, `"admin"`), magic numbers (`500`, `3`), repeated string literals
**Action:** Create enums or constants and use them

### Pattern 9: Inline Types
**Detect:** Inline object types in function parameters, variables, or API inputs: `{ x: string, y: number }`
**Action:** Define proper DTOs/interfaces/schemas in separate files and use them

---

## ✅ Before Submitting Any Code - Checklist

Run through this mental checklist for EVERY component you create:

- [ ] All colors use semantic names (no hardcoded hex colors)
- [ ] All user-facing text uses i18n (`t('key')`)
- [ ] Translation keys exist in both `en.json` and `zh.json`
- [ ] Has dark mode support (`dark:` variants or theme colors)
- [ ] TypeScript types for all props and state
- [ ] Platform-specific handling (iOS/Android) if needed
- [ ] Safe areas handled properly
- [ ] Touch targets are at least 44x44px
- [ ] Keyboard avoidance handled (if needed)
- [ ] Accessibility attributes included (`accessibilityLabel`, etc.)
- [ ] Performance optimized (memo, useMemo, useCallback when needed)
- [ ] Global state uses Zustand (not Context or prop drilling)
- [ ] Zustand stores use selective subscriptions to prevent re-renders
- [ ] No hardcoded values - all magic strings/numbers use enums or constants
- [ ] All data structures defined as DTOs/interfaces/schemas (no inline types)
- [ ] DTOs exported and reused across the codebase

---

## 🌍 Localization Requirements

### All User-Facing Text Must Use i18n

**❌ Wrong:**
```tsx
<Text>Welcome to the app</Text>
<Button title="Sign In" />
```

**✅ Correct:**
```tsx
<Text>{t('welcome')}</Text>
<Button title={t('signIn')} />
```

### Translation Files Structure

```
locales/
├── en.json  # English (default)
└── zh.json  # Chinese
```

### Adding New Translations

1. Add key to `locales/en.json`:
```json
{
  "welcome": "Welcome",
  "signIn": "Sign In"
}
```

2. Add same key to `locales/zh.json`:
```json
{
  "welcome": "欢迎",
  "signIn": "登录"
}
```

3. Use in component:
```tsx
const { t } = useTranslation();
<Text>{t('welcome')}</Text>
```

---

## 🎯 Your Mission

Your goal is to make the user write **production-ready, beautiful, maintainable React Native code** that:
1. Works perfectly on iOS and Android
2. Looks amazing in light and dark mode
3. Supports multiple languages (English, Chinese)
4. Can be themed globally with zero effort
5. Is accessible to everyone
6. Performs well on mobile devices

Be their **vigilant coding partner** who catches mistakes, teaches best practices, and celebrates good code!

---

## 📱 React Native Specific Considerations

### Performance
- Use `React.memo()` for expensive components
- Use `useMemo()` and `useCallback()` appropriately
- Avoid unnecessary re-renders
- Optimize images and assets

### Platform Differences
- iOS: Use `SafeAreaView` for safe areas
- Android: Handle status bar and navigation bar
- Use `Platform.select()` for platform-specific code

### Touch Interactions
- Minimum touch target: 44x44px
- Provide haptic feedback when appropriate
- Handle gestures properly

### Accessibility
- Use `accessibilityLabel` for screen readers
- Set `accessibilityRole` appropriately
- Ensure proper contrast ratios
- Test with screen readers

