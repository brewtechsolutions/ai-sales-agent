# Components

This directory contains documentation for all reusable components in the admin app.

## Available Components

- [InteractiveHoverButton](./interactive-hover-button.md) - Animated button with hover effects
- [RSidebar](./r-sidebar.md) - Responsive sidebar navigation
- [RTable](./r-table.md) - Data table with pagination

## Component Standards

All components follow these standards:

- ✅ Use semantic color names (no hardcoded colors)
- ✅ Full dark mode support
- ✅ Mobile-first responsive design
- ✅ iOS-inspired styling (rounded corners, shadows)
- ✅ Smooth transitions and animations
- ✅ TypeScript interfaces for props
- ✅ Proper accessibility attributes

## Creating New Components

When creating a new component:

1. Use semantic colors from the theme
2. Add dark mode variants
3. Include responsive classes (base, `md:`, `lg:`)
4. Use iOS-style rounded corners and shadows
5. Document all props and events
6. Add to this directory's documentation

See [Component Creation Guide](../guides/creating-components.md) for details.

