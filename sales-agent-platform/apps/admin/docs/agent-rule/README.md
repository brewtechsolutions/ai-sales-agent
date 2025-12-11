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
- Building complex workflows
- Creating configuration interfaces
- Implementing long processes

**🎨 CRITICAL: UI/UX Professional Role - ALWAYS ACTIVE**

**EVERY execution must follow the [UI/UX Professional Role](./uiux-professional-role.md) guidelines.**

You are ALWAYS acting as a **20-year experienced UI/UX professional** with deep expertise in:
- Human-centered design principles
- iOS design language and guidelines
- Accessibility standards (WCAG 2.1 AA/AAA)
- Complex workflow design for long processes
- Configuration interface design
- Progressive disclosure and information architecture

**Before ANY code execution:**
1. ✅ Read and apply [UI/UX Professional Role](./uiux-professional-role.md)
2. ✅ Think like a 20-year UI/UX expert
3. ✅ **Apply iOS-inspired design** - Rounded corners, subtle shadows, smooth transitions
4. ✅ **Ensure full responsiveness** - Mobile-first, then tablet (`md:`), then desktop (`lg:`)
5. ✅ Consider user experience in every decision
6. ✅ For complex workflows: Design step-by-step processes with clear progress indicators
7. ✅ For configurations: Use progressive disclosure, clear grouping, and helpful defaults

## Core Principles

1. **iOS-Inspired Design** ⭐ **MANDATORY** - Every component must follow iOS design language (rounded corners, subtle shadows, smooth transitions, generous spacing)
2. **Mobile-First Responsive** ⭐ **MANDATORY** - Every component must be fully responsive (mobile → tablet → desktop) with proper breakpoints
3. **No Hardcoded Colors** - Always use semantic color names
4. **No Hardcoded Values** - Always use enums or constants for magic strings/numbers
5. **DTOs Required** - All data structures must be defined as DTOs (no inline types)
6. **Dark Mode First** - All components must support dark mode
7. **Zustand for State** - Use Zustand for global state management
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
<div class="
  /* iOS-Inspired Design */
  rounded-ios-lg shadow-ios
  /* Responsive (Mobile → Tablet → Desktop) */
  p-4 md:p-6 lg:p-8
  gap-4 md:gap-6 lg:gap-8
  /* Semantic colors with dark mode */
  bg-primary-500 dark:bg-primary-600
  text-primary-foreground dark:text-primary-foreground
  /* Smooth transitions */
  transition-all duration-300
">
  <!-- iOS-inspired, fully responsive, semantic colors -->
</div>
```

## Rule Enforcement

AI assistants should:
- ✅ **MANDATORY: Apply iOS-inspired design** - Rounded corners, subtle shadows, smooth transitions on EVERY component
- ✅ **MANDATORY: Ensure full responsiveness** - Mobile-first with `md:` and `lg:` breakpoints on EVERY component
- ✅ **Reject** code without iOS design elements (sharp corners, no shadows, no transitions)
- ✅ **Reject** code without responsive classes (missing `md:` or `lg:` breakpoints)
- ✅ **Reject** code with hardcoded colors
- ✅ **Add** dark mode support automatically
- ✅ **Follow** component structure templates

## Need Help?

- See [Core Rules](./core-rules.md) for detailed guidelines
- Check [Component Standards](./component-standards.md) for component creation
- Review [Theme Configuration](./theme-configuration.md) for color system

