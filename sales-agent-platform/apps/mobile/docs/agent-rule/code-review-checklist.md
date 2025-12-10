# Code Review Checklist - Mobile App

Use this checklist when reviewing or creating React Native code to ensure it meets all standards.

## Colors & Theming

- [ ] No hardcoded colors (`'#000000'`, `'#FFFFFF'`, etc.)
- [ ] All colors use semantic names (`bg-primary`, `text-text-primary`)
- [ ] Dark mode variants included for all colors (`dark:bg-dark-card`)
- [ ] NativeWind classes used when possible
- [ ] Colors tested in both light and dark modes

## Localization (i18n)

- [ ] No hardcoded user-facing strings
- [ ] All text uses i18n (`t('key')`)
- [ ] Translation keys exist in both `en.json` and `zh.json`
- [ ] Keys are descriptive and organized
- [ ] Interpolation used for dynamic content when needed

## Responsive Design

- [ ] Safe areas handled properly (`SafeAreaView` or `useSafeAreaInsets()`)
- [ ] Platform-specific handling for iOS/Android
- [ ] Touch targets are at least 44x44px
- [ ] Keyboard avoidance handled (if needed)
- [ ] Works in both portrait and landscape (if required)

## Component Structure

- [ ] TypeScript interfaces for all props
- [ ] Typed emits/events for callbacks
- [ ] Proper state management (useState, useMemo, useCallback)
- [ ] React.memo used for expensive components
- [ ] Helpful comments for complex logic
- [ ] Proper file naming (PascalCase)

## Accessibility

- [ ] `accessibilityLabel` on interactive elements
- [ ] `accessibilityRole` set appropriately
- [ ] Keyboard navigation supported
- [ ] Screen reader friendly
- [ ] Color contrast meets WCAG AA standards
- [ ] Focus management handled

## Code Quality

- [ ] No console.log statements in production code
- [ ] Error handling implemented
- [ ] Loading states handled
- [ ] Edge cases considered (empty states, errors)
- [ ] Performance optimized (memo, useMemo, useCallback)
- [ ] No unused imports or variables

## State Management

- [ ] Global state uses Zustand (not Context API)
- [ ] Zustand stores use TypeScript interfaces
- [ ] Selective subscriptions used (not entire store)
- [ ] Local state uses useState (not Zustand)
- [ ] Server state uses React Query (not Zustand)
- [ ] Persistence used appropriately (auth, settings)

## TypeScript

- [ ] All props typed with interfaces
- [ ] All state typed
- [ ] No `any` types (use `unknown` if needed)
- [ ] Type safety maintained throughout
- [ ] Proper type imports

## Styling

- [ ] NativeWind classes used (no inline styles when possible)
- [ ] Semantic spacing scale used
- [ ] Consistent class ordering
- [ ] iOS-style design elements (rounded corners, shadows)
- [ ] Platform-specific styles handled correctly

## Performance

- [ ] React.memo used for expensive components
- [ ] useMemo for expensive computations
- [ ] useCallback for stable function references
- [ ] Images optimized
- [ ] No unnecessary re-renders

## Platform-Specific

- [ ] iOS/Android differences handled
- [ ] Platform.select() used for platform-specific code
- [ ] Safe areas respected
- [ ] Status bar handled (Android)
- [ ] Navigation bar handled (Android)

## Common Issues to Check

### Hardcoded Colors
```tsx
// ❌ Wrong
<View style={{ backgroundColor: '#000000' }}>
<Text style={{ color: '#FFFFFF' }}>

// ✅ Correct
<View className="bg-card dark:bg-dark-card">
<Text className="text-text-primary dark:text-dark-text-primary">
```

### Hardcoded Text
```tsx
// ❌ Wrong
<Text>Welcome</Text>
<Button title="Sign In" />

// ✅ Correct
<Text>{t('welcome')}</Text>
<Button title={t('signIn')} />
```

### Missing Dark Mode
```tsx
// ❌ Wrong
<View className="bg-white">
<Text className="text-black">

// ✅ Correct
<View className="bg-card dark:bg-dark-card">
<Text className="text-text-primary dark:text-dark-text-primary">
```

### Missing TypeScript Types
```tsx
// ❌ Wrong
const Component = ({ title, onPress }) => {

// ✅ Correct
interface ComponentProps {
  title: string;
  onPress: () => void;
}
const Component: React.FC<ComponentProps> = ({ title, onPress }) => {
```

### Missing Safe Areas
```tsx
// ❌ Wrong
<View className="flex-1">

// ✅ Correct
<SafeAreaView className="flex-1">
```

### Missing Accessibility
```tsx
// ❌ Wrong
<TouchableOpacity onPress={handlePress}>
  <Text>Button</Text>
</TouchableOpacity>

// ✅ Correct
<TouchableOpacity
  onPress={handlePress}
  accessibilityLabel={t('buttonLabel')}
  accessibilityRole="button"
>
  <Text>{t('buttonText')}</Text>
</TouchableOpacity>
```

## Review Process

1. **Initial Scan**
   - Check for hardcoded colors
   - Verify i18n usage
   - Check dark mode support

2. **Structure Review**
   - Component structure
   - TypeScript types
   - State management

3. **Localization Review**
   - All text uses i18n
   - Translation keys exist
   - Both languages have translations

4. **Styling Review**
   - iOS design elements
   - Semantic colors
   - Dark mode support

5. **Accessibility Review**
   - ARIA attributes
   - Keyboard navigation
   - Color contrast

6. **Performance Review**
   - Memoization
   - Optimizations
   - Re-render prevention

7. **Platform Review**
   - iOS/Android handling
   - Safe areas
   - Platform-specific code

## Automated Checks

Run these commands before submitting:

```bash
# Type checking
bun run check-types  # If available

# Linting
bun run lint

# Tests
bun run test
```

## Related Documentation

- [Core Rules](./core-rules.md) - Essential coding standards
- [Component Standards](./component-standards.md) - Component guidelines
- [State Management](./state-management.md) - Zustand guide
- [Localization Guide](./localization.md) - i18n setup
- [Theme Configuration](./theme-configuration.md) - Theme setup

