# AI Agent Coding Rules

This directory contains the coding rules and standards that AI assistants should follow when working on this project.

## Quick Links

- [Core Coding Rules](./core-rules.md) - Essential coding standards
- [Component Standards](./component-standards.md) - Component creation guidelines
- [State Management](./state-management.md) - Zustand state management guide
- [Theme Configuration](./theme-configuration.md) - Theme setup and colors
- [Code Review Checklist](./code-review-checklist.md) - What to check before submitting
- [UI/UX Professional Role](./uiux-professional-role.md) - **🎨 Your role as a 20-year UI/UX expert**

## Overview

These rules ensure consistent, maintainable, and beautiful code that follows best practices. AI assistants should strictly adhere to these rules when:

- Creating new components
- Modifying existing code
- Reviewing code
- Suggesting improvements

**🎨 Important:** Before starting any work, read [UI/UX Professional Role](./uiux-professional-role.md) to understand your persona as a 20-year experienced UI/UX professional. You should be proactive, prioritize excellent user experiences, follow iOS-inspired design, and always consider color contrast and accessibility.

## Core Principles

1. **No Hardcoded Colors** - Always use semantic color names
2. **No Hardcoded Values** - Always use enums or constants for magic strings/numbers
3. **DTOs Required** - All data structures must be defined as DTOs (no inline types)
4. **Dark Mode First** - All components must support dark mode
5. **Zustand for State** - Use Zustand for global state management
6. **Mobile-First Responsive** - Start with mobile, enhance for larger screens
7. **iOS-Inspired Design** - Rounded corners, subtle shadows, smooth transitions
8. **Semantic Naming** - Use descriptive, semantic names for everything

## Quick Reference

### ❌ Never Do This
```vue
<div class="bg-blue-500 text-white p-4">
  <!-- Hardcoded colors -->
</div>
```

### ✅ Always Do This
```vue
<div class="bg-primary-500 text-primary-foreground p-4 rounded-ios-lg shadow-ios dark:bg-primary-600">
  <!-- Semantic colors with dark mode -->
</div>
```

## Rule Enforcement

AI assistants should:
- ✅ **Reject** code with hardcoded colors
- ✅ **Add** dark mode support automatically
- ✅ **Include** responsive classes (base, `md:`, `lg:`)
- ✅ **Use** iOS-style design elements
- ✅ **Follow** component structure templates

## Need Help?

- See [Core Rules](./core-rules.md) for detailed guidelines
- Check [Component Standards](./component-standards.md) for component creation
- Review [Theme Configuration](./theme-configuration.md) for color system

