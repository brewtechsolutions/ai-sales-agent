# InteractiveHoverButton

## Overview

An animated button component with smooth hover effects. The button features a sliding text animation and icon reveal on hover, creating an engaging user experience.

## Preview

The button displays text that slides out and reveals an icon when hovered, with smooth transitions and iOS-inspired styling.

## Installation

This component is already included in the project. No additional installation required.

## Usage

### Basic Example

```vue
<template>
  <InteractiveHoverButton
    text="Click me"
    @click="handleClick"
  />
</template>

<script setup lang="ts">
const handleClick = () => {
  console.log('Button clicked!')
}
</script>
```

### With Loading State

```vue
<template>
  <InteractiveHoverButton
    text="Submit"
    :loading="isSubmitting"
    class="w-full"
    @click="handleSubmit"
  >
    {{ isSubmitting ? 'Submitting...' : 'Submit' }}
  </InteractiveHoverButton>
</template>

<script setup lang="ts">
const isSubmitting = ref(false)

const handleSubmit = async () => {
  isSubmitting.value = true
  // ... submit logic
  isSubmitting.value = false
}
</script>
```

### With Custom Styling

```vue
<template>
  <InteractiveHoverButton
    text="Custom Button"
    class="bg-primary-600 hover:bg-primary-700 text-white"
    @click="handleClick"
  />
</template>
```

## Props/Parameters

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| text | `string` | `"Button"` | No | The text to display on the button |
| class | `string` | `undefined` | No | Additional CSS classes to apply |

## Variants

The component uses semantic colors from the theme. The button automatically adapts to:
- Light mode: Uses `bg-background` and `text-primary-foreground`
- Dark mode: Automatically switches via CSS variables

## Styling

### Theme Colors Used
- `bg-background` - Button background (adapts to theme)
- `bg-primary` - Primary accent dot
- `text-primary-foreground` - Text color on hover
- `border` - Button border

### Customization

The component uses the `cn()` utility for class merging, allowing you to pass custom classes:

```vue
<InteractiveHoverButton
  text="Custom"
  class="w-full max-w-xs mx-auto"
/>
```

### Responsive Behavior
- Mobile: Full width recommended with `w-full`
- Tablet: Can use `w-auto` or specific widths
- Desktop: Works with any width setting

## Accessibility

- ✅ Keyboard navigation supported (native button element)
- ✅ Screen reader friendly (button text is accessible)
- ✅ Focus management handled
- ✅ Color contrast meets WCAG AA standards (uses theme colors)

## Animation Details

The button features two animations:

1. **Text Slide Out**: On hover, the original text slides to the right and fades out
2. **Icon Reveal**: A new text with arrow icon slides in from the right

Both animations use `transition-all duration-300` for smooth 300ms transitions.

## Examples in Production

Where this component is currently used:
- Login page (`/pages/auth/login.vue`) - Sign in button
- Register page (`/pages/auth/register.vue`) - Create account button

## Related Components

- [UButton](https://ui.nuxt.com/components/button) - Standard Nuxt UI button (used for other actions)

## Troubleshooting

### Button not animating
**Problem**: Hover effects not working
**Solution**: Ensure you're using a device/browser that supports hover (desktop). On mobile, the button still works but hover effects won't trigger.

### Text not visible
**Problem**: Text color matches background
**Solution**: The component uses theme colors. Check your theme configuration in `tailwind.config.js` and `assets/css/main.css`.

### Custom classes not applying
**Problem**: Custom classes being overridden
**Solution**: The component uses `cn()` utility which merges classes. Check class specificity and ensure your classes are passed correctly.

## Changelog

- **v1.0.0** (2024-01-01) - Initial release with hover animations and semantic colors

## Contributing

See [Contributing Guidelines](../../../README.md) for how to contribute to this component.

