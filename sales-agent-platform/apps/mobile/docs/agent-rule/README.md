# AI Agent Coding Rules - Mobile App

This directory contains the coding rules and standards that AI assistants should follow when working on the mobile (React Native) app.

## Quick Links

- [Core Coding Rules](./core-rules.md) - Essential coding standards
- [Component Standards](./component-standards.md) - React Native component guidelines
- [State Management](./state-management.md) - Zustand state management guide
- [Localization Guide](./localization.md) - i18n setup and usage
- [Theme Configuration](./theme-configuration.md) - Theme setup and colors
- [Code Review Checklist](./code-review-checklist.md) - What to check before submitting
- [UI/UX Professional Role](./uiux-professional-role.md) - **🎨 Your role as a 20-year UI/UX expert**

## Overview

These rules ensure consistent, maintainable, and beautiful React Native code that follows best practices. AI assistants should strictly adhere to these rules when:

- Creating new components
- Modifying existing code
- Adding new features
- Implementing localization
- Reviewing code

**🎨 Important:** Before starting any work, read [UI/UX Professional Role](./uiux-professional-role.md) to understand your persona as a 20-year experienced UI/UX professional. You should be proactive, prioritize excellent user experiences, follow iOS-inspired design, and always consider color contrast and accessibility.

## Core Principles

1. **No Hardcoded Colors** - Always use semantic color names from theme
2. **No Hardcoded Values** - Always use enums or constants for magic strings/numbers
3. **DTOs Required** - All data structures must be defined as DTOs/interfaces (no inline types)
4. **Dark Mode First** - All components must support dark mode
5. **Localization Required** - All user-facing text must use i18n
6. **Zustand for State** - Use Zustand for global state management
7. **iOS/Android Parity** - Ensure consistent experience across platforms
8. **Semantic Naming** - Use descriptive, semantic names for everything
9. **TypeScript First** - Full type safety for all code

## Quick Reference

### ❌ Never Do This
```tsx
<Text style={{ color: '#000000' }}>Hello</Text>
<Text>Welcome</Text> {/* Hardcoded text */}
```

### ✅ Always Do This
```tsx
<Text className="text-text-primary dark:text-dark-text-primary">
  {t('welcome')}
</Text>
```

## Rule Enforcement

AI assistants should:
- ✅ **Reject** code with hardcoded colors or text
- ✅ **Add** dark mode support automatically
- ✅ **Use** i18n for all user-facing strings
- ✅ **Include** TypeScript types for all props
- ✅ **Follow** React Native component structure templates

## Mobile-Specific Considerations

- **Platform Differences**: Handle iOS vs Android differences
- **Performance**: Optimize for mobile performance
- **Touch Targets**: Minimum 44x44px for interactive elements
- **Safe Areas**: Use SafeAreaView for proper spacing
- **Keyboard**: Handle keyboard avoidance properly

## Need Help?

- See [Core Rules](./core-rules.md) for detailed guidelines
- Check [Component Standards](./component-standards.md) for component creation
- Review [Localization Guide](./localization.md) for i18n setup
- See [Theme Configuration](./theme-configuration.md) for color system

