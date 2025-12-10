# Design System

This directory contains documentation for the design system, including colors, typography, spacing, and design tokens.

## Overview

The admin app uses a semantic color system with full dark mode support and iOS-inspired design principles.

## Quick Links

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

The theme is configured in:
- `tailwind.config.js` - Tailwind theme extension
- `assets/css/main.css` - CSS variables for colors

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

