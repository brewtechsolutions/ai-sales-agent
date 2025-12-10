# RSidebar

## Overview

A responsive sidebar navigation component with mobile support, user profile section, and logout functionality. The sidebar automatically collapses on mobile devices and can be toggled via a hamburger menu.

## Preview

The sidebar displays:
- Logo/brand name at the top
- Navigation menu items with icons
- Active route highlighting
- User profile section at the bottom
- Logout button

## Installation

This component is already included in the project. No additional installation required.

## Usage

### Basic Example

```vue
<template>
  <RSidebar 
    :is-open="isSidebarOpen" 
    @update:is-open="isSidebarOpen = $event" 
  />
</template>

<script setup lang="ts">
const isSidebarOpen = ref(false)
</script>
```

### In Layout

```vue
<template>
  <div class="min-h-screen">
    <RSidebar 
      :is-open="isSidebarOpen" 
      @update:is-open="isSidebarOpen = $event" 
    />
    
    <main class="lg:pl-64">
      <!-- Main content -->
    </main>
  </div>
</template>

<script setup lang="ts">
const isSidebarOpen = ref(false)
</script>
```

## Props/Parameters

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| isOpen | `boolean` | `false` | Yes | Controls sidebar visibility on mobile |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| update:isOpen | `boolean` | Emitted when sidebar open state changes |

## Navigation Items

The sidebar currently displays these navigation items:

- **Dashboard** (`/`) - Home icon
- **Products** (`/products`) - Shopping bag icon
- **Users** (`/users`) - Users icon

To customize navigation items, edit the `navigationItems` array in the component:

```vue
<script setup lang="ts">
const navigationItems = [
  { name: 'Dashboard', to: '/', icon: 'heroicons:home' },
  { name: 'Products', to: '/products', icon: 'heroicons:shopping-bag' },
  { name: 'Users', to: '/users', icon: 'heroicons:users' },
  // Add more items here
]
</script>
```

## Variants

### Active State
When a route is active, the navigation item displays:
- `bg-primary-100 dark:bg-primary-900/30` - Light primary background
- `text-primary-700 dark:text-primary-300` - Primary text color

### Inactive State
Inactive items use:
- `text-text-secondary dark:text-dark-text-secondary` - Secondary text
- Hover: `hover:bg-surface dark:hover:bg-dark-surface` - Surface background

## Styling

### Theme Colors Used
- `bg-card dark:bg-dark-card` - Sidebar background
- `border-border dark:border-dark-border` - Borders
- `text-text-primary dark:text-dark-text-primary` - Primary text
- `text-text-secondary dark:text-dark-text-secondary` - Secondary text
- `bg-primary-100 dark:bg-primary-900/30` - Active item background
- `text-error dark:text-error-light` - Logout button

### Customization

The sidebar width is responsive:
- Mobile: `w-48` (192px)
- Tablet/Desktop: `md:w-64` (256px)

To change the width, modify the classes in the component:

```vue
<aside class="... w-56 md:w-72 ...">
  <!-- Custom width -->
</aside>
```

### Responsive Behavior
- **Mobile (< 1024px)**: 
  - Sidebar is hidden by default (`-translate-x-full`)
  - Can be toggled via hamburger menu
  - Backdrop overlay appears when open
- **Desktop (≥ 1024px)**: 
  - Sidebar is always visible (`lg:translate-x-0`)
  - No backdrop overlay
  - Fixed position on the left

## Accessibility

- ✅ Keyboard navigation supported (navigation links)
- ✅ Screen reader friendly (semantic HTML)
- ✅ ARIA labels on interactive elements
- ✅ Focus management handled
- ✅ Color contrast meets WCAG AA standards

## User Profile Section

The sidebar includes a user profile section at the bottom that displays:
- User avatar (generated via UI Avatars API)
- User name
- Logout button

The user data comes from the `useUser()` composable.

## Examples in Production

Where this component is currently used:
- Default layout (`/layouts/default.vue`) - Main app layout

## Related Components

- [RTable](./r-table.md) - Data table component
- [InteractiveHoverButton](./interactive-hover-button.md) - Animated button

## Troubleshooting

### Sidebar not showing on mobile
**Problem**: Sidebar doesn't appear when toggled
**Solution**: Check that `isOpen` prop is properly bound and the backdrop is visible. Ensure z-index values are correct (sidebar: `z-50`, backdrop: `z-40`).

### Navigation items not highlighting
**Problem**: Active route not showing highlighted state
**Solution**: The component uses `$route.path === item.to` to detect active routes. Ensure your routes match exactly.

### User data not showing
**Problem**: User name/avatar not displaying
**Solution**: Check that `useUser()` composable is working and user data is loaded. Verify authentication state.

## Changelog

- **v1.0.0** (2024-01-01) - Initial release with responsive design and dark mode support

## Contributing

See [Contributing Guidelines](../../../README.md) for how to contribute to this component.

