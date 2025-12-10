# Theme Configuration

## Overview

The theme uses a semantic color system with CSS variables and Tailwind configuration. All colors are defined semantically, allowing global theme changes with minimal effort.

## Tailwind Configuration

The theme is configured in `tailwind.config.js`:

```javascript
module.exports = {
  darkMode: "selector",
  theme: {
    extend: {
      colors: {
        // 🎨 Primary brand color
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "hsl(var(--primary-50))",
          100: "hsl(var(--primary-100))",
          // ... full scale 50-900
        },
        
        // ✅ Semantic colors
        success: {
          DEFAULT: "hsl(var(--success))",
          light: "hsl(var(--success-light))",
          dark: "hsl(var(--success-dark))",
        },
        error: {
          DEFAULT: "hsl(var(--error))",
          light: "hsl(var(--error-light))",
          dark: "hsl(var(--error-dark))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          light: "hsl(var(--warning-light))",
          dark: "hsl(var(--warning-dark))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          light: "hsl(var(--info-light))",
          dark: "hsl(var(--info-dark))",
        },
        
        // 🌅 Light mode colors
        background: "hsl(var(--background))",
        surface: "hsl(var(--surface))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "text-primary": "hsl(var(--foreground))",
        "text-secondary": "hsl(var(--muted-foreground))",
        border: "hsl(var(--border))",
        
        // 🌙 Dark mode colors
        "dark-background": "hsl(var(--dark-background))",
        "dark-surface": "hsl(var(--dark-surface))",
        "dark-card": "hsl(var(--dark-card))",
        "dark-text-primary": "hsl(var(--dark-foreground))",
        "dark-text-secondary": "hsl(var(--dark-muted-foreground))",
        "dark-border": "hsl(var(--dark-border))",
      },
      
      // iOS-style border radius
      borderRadius: {
        'ios': '12px',
        'ios-lg': '16px',
        'ios-xl': '20px',
      },
      
      // iOS-style shadows
      boxShadow: {
        'ios': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'ios-lg': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'ios-xl': '0 8px 24px rgba(0, 0, 0, 0.16)',
      },
    },
  },
}
```

## CSS Variables

Colors are defined as CSS variables in `assets/css/main.css`:

```css
:root {
  /* 🌅 Light mode - Background & Surface */
  --background: 0 0% 100%;
  --surface: 249 9% 98%;
  --foreground: 222.2 84% 4.9%;
  
  /* 🎨 Primary brand color */
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  --primary-50: 204 100% 97%;
  /* ... full scale */
  
  /* ✅ Semantic colors */
  --success: 142 76% 36%;
  --success-light: 142 76% 82%;
  --success-dark: 142 84% 20%;
  
  --error: 0 84.2% 60.2%;
  --error-light: 0 84% 89%;
  --error-dark: 0 72% 38%;
  
  /* ... more colors */
}

.dark {
  /* 🌙 Dark mode colors */
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
  /* ... dark mode variants */
}
```

## Color Usage

### Primary Colors
```vue
<!-- Main primary -->
<div class="bg-primary text-primary-foreground">Primary</div>

<!-- Primary scale -->
<div class="bg-primary-500">Default</div>
<div class="bg-primary-600">Hover</div>
<div class="bg-primary-400">Light</div>
```

### Semantic Colors
```vue
<!-- Success -->
<div class="bg-success text-white">Success</div>
<div class="bg-success-light text-success">Success background</div>

<!-- Error -->
<div class="bg-error text-white">Error</div>
<div class="text-error">Error text</div>

<!-- Warning -->
<div class="bg-warning text-white">Warning</div>

<!-- Info -->
<div class="bg-info text-white">Info</div>
```

### Background Colors
```vue
<!-- Light mode -->
<div class="bg-background">Main background</div>
<div class="bg-surface">Surface</div>
<div class="bg-card">Card</div>

<!-- Dark mode -->
<div class="bg-background dark:bg-dark-background">Adaptive</div>
<div class="bg-card dark:bg-dark-card">Adaptive card</div>
```

### Text Colors
```vue
<!-- Light mode -->
<p class="text-text-primary">Primary text</p>
<p class="text-text-secondary">Secondary text</p>

<!-- Dark mode -->
<p class="text-text-primary dark:text-dark-text-primary">Adaptive</p>
```

### Border Colors
```vue
<div class="border border-border dark:border-dark-border">
  Bordered content
</div>
```

## iOS Design Elements

### Border Radius
```vue
<div class="rounded-ios">12px radius</div>
<div class="rounded-ios-lg">16px radius</div>
<div class="rounded-ios-xl">20px radius</div>
```

### Shadows
```vue
<div class="shadow-ios">Subtle shadow</div>
<div class="shadow-ios-lg">Medium shadow</div>
<div class="shadow-ios-xl">Large shadow</div>
```

### Transitions
```vue
<div class="transition-all duration-300">Smooth transition</div>
```

## Customization

### Changing Primary Color

1. **Update CSS variables** in `assets/css/main.css`:
```css
:root {
  --primary: 221.2 83.2% 53.3%; /* Change to your brand color */
}
```

2. **Regenerate scale** (if needed) using a color scale generator

3. **Test** in both light and dark modes

### Adding New Colors

1. **Add CSS variable** in `assets/css/main.css`:
```css
:root {
  --new-color: 200 80% 50%;
}
```

2. **Add to Tailwind config** in `tailwind.config.js`:
```javascript
colors: {
  'new-color': "hsl(var(--new-color))",
}
```

3. **Use in components**:
```vue
<div class="bg-new-color">New color</div>
```

## Best Practices

### ✅ Do
- Use semantic color names
- Always include dark mode variants
- Use CSS variables for theme colors
- Test in both light and dark modes
- Document color usage

### ❌ Don't
- Use hardcoded colors (`bg-blue-500`)
- Forget dark mode variants
- Mix semantic and hardcoded colors
- Create colors without CSS variables
- Use colors for unintended purposes

## Color Reference

See [Design System - Colors](../../design-system/colors.md) for complete color reference.

## Related Documentation

- [Core Rules](./core-rules.md) - Coding standards
- [Component Standards](./component-standards.md) - Component guidelines
- [Design System - Colors](../../design-system/colors.md) - Color documentation

