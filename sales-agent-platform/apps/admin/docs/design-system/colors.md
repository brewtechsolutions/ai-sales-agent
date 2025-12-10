# Colors

## Overview

The admin app uses a semantic color system that adapts automatically to light and dark modes. All colors are defined as CSS variables and can be customized globally.

## Color System

### Primary Brand Color

The primary color is used for main actions, links, and accents.

**Light Mode:**
- `bg-primary` - Main primary color (HSL: 221.2 83.2% 53.3%)
- `bg-primary-500` - Default primary
- `bg-primary-600` - Hover states
- `bg-primary-400` - Light variant

**Dark Mode:**
- `bg-primary` - Lighter for dark mode (HSL: 217.2 91.2% 59.8%)
- `bg-primary-600` - Darker variant for dark mode

**Usage:**
```vue
<button class="bg-primary-500 hover:bg-primary-600 text-primary-foreground">
  Primary Button
</button>
```

### Semantic Colors

#### Success
Used for positive actions, success messages, and confirmations.

- `bg-success` - Main success color
- `bg-success-light` - Light variant (for backgrounds)
- `bg-success-dark` - Dark variant
- `text-success` - Success text color

**Usage:**
```vue
<div class="bg-success-light text-success">
  Success message
</div>
```

#### Error
Used for errors, destructive actions, and warnings.

- `bg-error` - Main error color
- `bg-error-light` - Light variant (for backgrounds)
- `bg-error-dark` - Dark variant
- `text-error` - Error text color

**Usage:**
```vue
<button class="text-error hover:bg-error-light">
  Delete
</button>
```

#### Warning
Used for warnings and cautionary messages.

- `bg-warning` - Main warning color
- `bg-warning-light` - Light variant
- `bg-warning-dark` - Dark variant
- `text-warning` - Warning text color

#### Info
Used for informational messages and neutral actions.

- `bg-info` - Main info color
- `bg-info-light` - Light variant
- `bg-info-dark` - Dark variant
- `text-info` - Info text color

### Background Colors

#### Light Mode
- `bg-background` - Main background (white)
- `bg-surface` - Surface/card background (light gray)
- `bg-card` - Card background (white)

#### Dark Mode
- `bg-dark-background` - Main dark background
- `bg-dark-surface` - Dark surface
- `bg-dark-card` - Dark card background

**Usage:**
```vue
<div class="bg-card dark:bg-dark-card">
  Card content
</div>
```

### Text Colors

#### Light Mode
- `text-text-primary` - Main text color (dark gray)
- `text-text-secondary` - Secondary text (medium gray)
- `text-text-tertiary` - Tertiary text (light gray)

#### Dark Mode
- `text-dark-text-primary` - Main dark text (light)
- `text-dark-text-secondary` - Secondary dark text
- `text-dark-text-tertiary` - Tertiary dark text

**Usage:**
```vue
<h1 class="text-text-primary dark:text-dark-text-primary">
  Heading
</h1>
<p class="text-text-secondary dark:text-dark-text-secondary">
  Description
</p>
```

### Border Colors

- `border-border` - Default border (light mode)
- `border-dark-border` - Dark mode border

**Usage:**
```vue
<div class="border border-border dark:border-dark-border">
  Bordered content
</div>
```

## Color Values Reference

### Primary Scale
| Name | Light Mode | Dark Mode |
|------|------------|-----------|
| primary-50 | HSL(204, 100%, 97%) | HSL(224, 76%, 25%) |
| primary-100 | HSL(204, 96%, 94%) | HSL(222, 84%, 30%) |
| primary-200 | HSL(201, 96%, 89%) | HSL(217, 91%, 36%) |
| primary-300 | HSL(199, 95%, 80%) | HSL(213, 94%, 43%) |
| primary-400 | HSL(196, 94%, 68%) | HSL(199, 95%, 68%) |
| primary-500 | HSL(221.2, 83.2%, 53.3%) | HSL(217.2, 91.2%, 59.8%) |
| primary-600 | HSL(213, 94%, 43%) | HSL(196, 94%, 80%) |
| primary-700 | HSL(217, 91%, 36%) | HSL(201, 96%, 89%) |
| primary-800 | HSL(222, 84%, 30%) | HSL(204, 96%, 94%) |
| primary-900 | HSL(224, 76%, 25%) | HSL(204, 100%, 97%) |

### Semantic Colors
| Color | Light Mode | Dark Mode |
|-------|------------|-----------|
| success | HSL(142, 76%, 36%) | HSL(142, 76%, 50%) |
| error | HSL(0, 84.2%, 60.2%) | HSL(0, 84%, 58%) |
| warning | HSL(38, 92%, 50%) | HSL(38, 92%, 55%) |
| info | HSL(217, 91%, 60%) | HSL(217, 91%, 65%) |

## Best Practices

### ✅ Do
- Use semantic color names: `bg-primary`, `text-error`
- Always include dark mode variants: `bg-card dark:bg-dark-card`
- Use semantic colors for their intended purpose
- Test color contrast for accessibility

### ❌ Don't
- Use hardcoded colors: `bg-blue-500`, `text-gray-900`
- Forget dark mode variants
- Use colors for unintended purposes
- Ignore accessibility contrast ratios

## Customization

To customize colors, edit the CSS variables in `assets/css/main.css`:

```css
:root {
  --primary: 221.2 83.2% 53.3%; /* Change primary color */
  --success: 142 76% 36%; /* Change success color */
  /* ... */
}
```

Then update the corresponding Tailwind config if needed.

## Related Documentation

- [Design Tokens](./design-tokens.md) - All design tokens
- [Typography](./typography.md) - Text styling
- [Theme Configuration](../../tailwind.config.js) - Tailwind config

