# Design System

This directory contains documentation for the design system, including colors, typography, spacing, and design tokens.

## Overview

The admin app uses a semantic color system with full dark mode support and iOS-inspired design principles.

## Quick Links

- [Theme Configuration](./theme-configuration.md) - **Start here** - How Tailwind v4 is configured
- [Colors](./colors.md) - Color palette and usage
- [Typography](./typography.md) - Font styles and usage
- [Spacing](./spacing.md) - Spacing scale
- [Breakpoints](./breakpoints.md) - Responsive breakpoints
- [Design Tokens](./design-tokens.md) - All design tokens

## Design Principles

1. **Semantic Colors**: Use semantic names (e.g., `bg-primary`) instead of hardcoded colors
2. **Dark Mode First**: All components support dark mode via `dark:` variants
3. **iOS-Inspired**: Rounded corners, subtle shadows, smooth transitions
4. **Mobile-First**: Responsive design starting from mobile breakpoints
5. **Accessibility**: WCAG AA contrast ratios and keyboard navigation

## Theme Configuration

The theme uses a **hybrid approach** optimized for Tailwind CSS v4:

### Files Structure

1. **`assets/css/main.css`** - Contains:
   - CSS variables in `@layer base` for runtime theming (light/dark mode)
   - `@theme` directive for static design tokens (shadows, fonts, border radius)

2. **`tailwind.config.js`** - Contains:
   - Theme extension mapping CSS variables to Tailwind utilities
   - Plugin configuration (tailwindcss-animate, @inspira-ui/plugins)
   - Content paths for file scanning

### Why This Approach?

- **CSS Variables** (`@layer base`) enable runtime theme switching (light/dark mode)
- **Tailwind Config** maps CSS variables to utilities like `bg-primary`, `text-success`, etc.
- **@theme Directive** defines static tokens that don't need runtime changes

This hybrid approach gives us the best of both worlds:
- ✅ Runtime theming via CSS variables
- ✅ Type-safe Tailwind utilities
- ✅ Tailwind v4 compatibility

## Quick Reference

### Colors
```vue
<!-- Primary -->
<div class="bg-primary text-primary-foreground">Primary</div>

<!-- Semantic -->
<div class="bg-success text-white">Success</div>
<div class="bg-error text-white">Error</div>

<!-- Text -->
<p class="text-text-primary">Primary text</p>
<p class="text-text-secondary">Secondary text</p>
```

### Spacing
```vue
<div class="p-4 md:p-6 lg:p-8">Responsive padding</div>
```

### Border Radius
```vue
<div class="rounded-ios-lg">iOS-style rounded</div>
```

### Shadows
```vue
<div class="shadow-ios-lg">iOS-style shadow</div>
```

