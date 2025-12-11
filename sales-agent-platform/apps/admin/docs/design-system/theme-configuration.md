# Theme Configuration

This document explains how the theme is configured for Tailwind CSS v4 in the Nuxt admin app.

## Overview

The admin app uses **Tailwind CSS v4** with a hybrid configuration approach that combines:
- CSS-first configuration via `@theme` directive
- JavaScript configuration for dynamic theme values
- CSS variables for runtime theming (light/dark mode)

## Architecture

### File Structure

```
apps/admin/
├── assets/css/main.css          # CSS variables + @theme directive
├── tailwind.config.js           # Theme mapping + plugins
└── nuxt.config.ts               # Vite plugin configuration
```

### Configuration Flow

1. **CSS Variables** (`main.css` → `@layer base`)
   - Define color values as HSL CSS variables
   - Separate values for `:root` (light mode) and `.dark` (dark mode)
   - Enables runtime theme switching

2. **Theme Mapping** (`tailwind.config.js` → `theme.extend`)
   - Maps CSS variables to Tailwind utilities
   - Example: `hsl(var(--primary))` → `bg-primary` utility
   - Provides type-safe class names

3. **Static Tokens** (`main.css` → `@theme`)
   - Defines static design tokens (shadows, fonts, border radius)
   - Uses Tailwind v4's CSS-first approach
   - No runtime changes needed

4. **Vite Plugin** (`nuxt.config.ts`)
   - Uses `@tailwindcss/vite` for Tailwind v4 integration
   - Automatically processes CSS and config

## Files Explained

### `assets/css/main.css`

This file contains three main sections:

#### 1. Imports
```css
@import "@nuxt/ui";
@import "tailwindcss";
```

#### 2. CSS Variables (`@layer base`)
```css
@layer base {
  :root {
    /* Light mode colors */
    --primary: 221.2 83.2% 53.3%;
    --background: 0 0% 100%;
    /* ... */
  }

  .dark {
    /* Dark mode colors */
    --primary: 217.2 91.2% 59.8%;
    --background: 222.2 84% 4.9%;
    /* ... */
  }
}
```

**Why CSS Variables?**
- Enable runtime theme switching
- Support light/dark mode without rebuild
- Can be modified via JavaScript for dynamic themes

#### 3. Static Tokens (`@theme`)
```css
@theme {
  --radius-ios: 12px;
  --shadow-ios-lg: 0 4px 16px rgba(0, 0, 0, 0.12);
  --font-sans: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif;
}
```

**Why @theme?**
- Tailwind v4's CSS-first approach
- Static values don't need runtime changes
- Better performance and maintainability

### `tailwind.config.js`

This file maps CSS variables to Tailwind utilities:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: "hsl(var(--primary))",
        50: "hsl(var(--primary-50))",
        // ...
      }
    }
  }
}
```

**Why Keep This?**
- Maps dynamic CSS variables to utilities
- Enables class names like `bg-primary`, `text-success`
- Required for plugins that need JS configuration

### `nuxt.config.ts`

```typescript
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  css: ["~/assets/css/main.css"],
});
```

**Key Points:**
- Uses `@tailwindcss/vite` plugin (Tailwind v4)
- No need for `@nuxtjs/tailwindcss` module
- CSS file is imported globally

## Color System

### Primary Colors

The primary brand color is **Sky Blue** with a full scale:

```css
--primary-50: 204 100% 97%;   /* Lightest */
--primary-500: 221.2 83.2% 53.3%; /* Default */
--primary-900: 224 76% 25%;    /* Darkest */
```

**Usage:**
```vue
<div class="bg-primary-500 text-primary-foreground">
  Primary Button
</div>
```

### Semantic Colors

Semantic colors provide meaning:

- **Success**: `bg-success`, `text-success`
- **Error**: `bg-error`, `text-error`
- **Warning**: `bg-warning`, `text-warning`
- **Info**: `bg-info`, `text-info`

Each has `-light` and `-dark` variants:
```vue
<div class="bg-success-light text-success-dark">
  Success message
</div>
```

### Text Colors

```vue
<p class="text-text-primary">Primary text</p>
<p class="text-text-secondary">Secondary text</p>
<p class="text-text-tertiary">Tertiary text</p>
```

## Dark Mode

Dark mode is handled via CSS variables and the `.dark` class:

```vue
<template>
  <div class="bg-background dark:bg-dark-background">
    Content adapts to theme
  </div>
</template>
```

**How it works:**
1. CSS variables change when `.dark` class is added to `<html>` or parent
2. Tailwind utilities automatically use the new values
3. No JavaScript needed for color switching

## Customization

### Changing Brand Colors

1. **Update CSS Variables** in `main.css`:
```css
:root {
  --primary: 221.2 83.2% 53.3%; /* Change HSL values */
}
```

2. **Update Dark Mode** (if needed):
```css
.dark {
  --primary: 217.2 91.2% 59.8%;
}
```

3. **All components update automatically!** ✨

### Adding New Colors

1. **Add CSS Variable**:
```css
:root {
  --brand-accent: 280 80% 60%;
}
```

2. **Map to Tailwind** in `tailwind.config.js`:
```javascript
colors: {
  'brand-accent': "hsl(var(--brand-accent))",
}
```

3. **Use in Components**:
```vue
<div class="bg-brand-accent">New color!</div>
```

## iOS-Style Design Tokens

### Border Radius

```vue
<div class="rounded-ios">12px</div>
<div class="rounded-ios-lg">16px</div>
<div class="rounded-ios-xl">20px</div>
```

### Shadows

```vue
<div class="shadow-ios">Subtle shadow</div>
<div class="shadow-ios-lg">Medium shadow</div>
<div class="shadow-ios-xl">Large shadow</div>
```

### Fonts

System fonts are automatically applied via `font-sans`:
```vue
<p class="font-sans">Uses system font stack</p>
```

## Troubleshooting

### Colors Not Updating

**Problem**: Changes to CSS variables don't reflect in components

**Solution**: 
- Ensure CSS variables are in `@layer base`
- Check that `tailwind.config.js` maps the variable correctly
- Restart dev server after config changes

### Dark Mode Not Working

**Problem**: Dark mode classes don't apply

**Solution**:
- Verify `.dark` class is on `<html>` or parent element
- Check that dark mode CSS variables are defined
- Ensure `darkMode: "selector"` in `tailwind.config.js`

### @theme Directive Warning

**Problem**: Linter shows "Unknown at rule @theme"

**Solution**: 
- This is expected - `@theme` is a Tailwind v4 feature
- CSS linters may not recognize it yet
- The warning can be safely ignored

## Best Practices

1. ✅ **Always use semantic color names** (`bg-primary`, not `bg-blue-500`)
2. ✅ **Define colors in CSS variables** for runtime theming
3. ✅ **Use @theme for static tokens** (shadows, fonts, etc.)
4. ✅ **Map variables in config** for type-safe utilities
5. ✅ **Test both light and dark modes** during development

## Related Documentation

- [Colors](./colors.md) - Detailed color palette
- [Design Tokens](./design-tokens.md) - All design tokens
- [Component Standards](../agent-rule/component-standards.md) - Component styling rules

## Package Dependencies

### Required Packages

- `tailwindcss@^4.1.3` - Tailwind CSS v4 core
- `@tailwindcss/vite@^4.1.3` - Vite plugin for Tailwind v4
- `tailwindcss-animate@^1.0.7` - Animation utilities plugin
- `@inspira-ui/plugins@^0.0.1` - Custom UI plugin

### Optional Packages

- `@nuxtjs/tailwindcss@^6.11.3` - **May not be needed**
  - Currently in `devDependencies` but not used in `nuxt.config.ts`
  - We're using `@tailwindcss/vite` directly instead
  - **Note**: `@nuxt/ui` might require it as a peer dependency
  - **Action**: Test removing it if you want, but keep it if `@nuxt/ui` breaks

### Not Needed for Tailwind v4

- `autoprefixer` - Handled automatically by Tailwind v4
- `postcss` - Handled automatically by Vite

## Changelog

- **v4.0.0** (2024-01-XX) - Migrated to Tailwind CSS v4 with hybrid configuration
- **v3.0.0** (2024-01-XX) - Initial theme setup with Tailwind CSS v3

