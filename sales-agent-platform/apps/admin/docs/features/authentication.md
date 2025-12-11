# Authentication Pages

## Overview

The authentication system provides a beautiful, iOS-inspired login and registration experience with excellent UX principles and full accessibility support.

## Pages

### Login Page (`/auth/login`)

A clean, focused login experience that prioritizes user convenience and security.

**Features:**
- ✅ Email and password authentication
- ✅ "Remember me" functionality
- ✅ Forgot password link
- ✅ Smooth animations and transitions
- ✅ Full dark mode support
- ✅ Mobile-first responsive design
- ✅ Clear error messaging
- ✅ Auto-focus on email field

**Visual Elements:**
- Brand icon with subtle background
- Large, clear typography
- Generous whitespace
- iOS-style rounded corners and shadows
- Smooth hover effects

### Register Page (`/auth/register`)

A comprehensive registration flow with real-time validation and password strength indicators.

**Features:**
- ✅ Full name, email, and password fields
- ✅ Real-time password strength indicator
- ✅ Password match confirmation
- ✅ Terms and conditions acceptance
- ✅ Enhanced password validation
- ✅ Clear visual feedback
- ✅ Full dark mode support
- ✅ Mobile-first responsive design

**Visual Elements:**
- Brand icon with subtle background
- Password strength meter (4-level visual indicator)
- Password match indicator with icons
- Clickable terms and privacy policy links
- Smooth animations and transitions

## Design Principles

### iOS-Inspired Design

Both pages follow iOS design principles:

1. **Generous Whitespace**
   - Large padding and margins
   - Breathing room between elements
   - Clear visual hierarchy

2. **Rounded Corners**
   - `rounded-ios-xl` for main card (20px)
   - `rounded-ios-lg` for buttons (16px)
   - Consistent radius throughout

3. **Subtle Shadows**
   - `shadow-ios-lg` for cards
   - `shadow-ios-xl` on hover
   - Depth without heaviness

4. **Smooth Transitions**
   - `transition-all duration-300` on interactive elements
   - Hover effects on buttons and links
   - Focus states with ring effects

5. **Clear Typography**
   - Large headings (3xl to 5xl)
   - Clear hierarchy
   - System font stack for performance

### UX Best Practices

1. **Visual Hierarchy**
   - Most important elements are largest
   - Clear call-to-action buttons
   - Secondary actions are less prominent

2. **Progressive Disclosure**
   - Password strength shown only when typing
   - Password match indicator appears when needed
   - Help text appears contextually

3. **Feedback & Validation**
   - Real-time password strength feedback
   - Clear error messages
   - Success states with toasts
   - Visual indicators for all states

4. **Accessibility**
   - Proper form labels
   - ARIA attributes
   - Keyboard navigation
   - Focus management
   - Screen reader friendly

5. **Mobile-First**
   - Touch-friendly button sizes (min 44x44px)
   - Responsive typography
   - Optimized spacing for small screens
   - Full functionality on mobile

## Component Structure

### Login Page Structure

```
┌─────────────────────────────────┐
│      Brand Icon (Lock)          │
│      Welcome back (Heading)     │
│      Sign in to continue        │
├─────────────────────────────────┤
│  ┌───────────────────────────┐ │
│  │ Email address             │ │
│  │ [Input with icon]         │ │
│  │                           │ │
│  │ Password                  │ │
│  │ [Input with icon]         │ │
│  │                           │ │
│  │ [ ] Remember me  Forgot? │ │
│  │                           │ │
│  │ [Sign in Button]          │ │
│  └───────────────────────────┘ │
│                                 │
│  ─── New to platform? ───      │
│                                 │
│  [Create an account Button]     │
└─────────────────────────────────┘
```

### Register Page Structure

```
┌─────────────────────────────────┐
│    Brand Icon (User Plus)      │
│    Create your account         │
│    Get started today            │
├─────────────────────────────────┤
│  ┌───────────────────────────┐ │
│  │ Full name                 │ │
│  │ [Input with icon]         │ │
│  │                           │ │
│  │ Email address             │ │
│  │ [Input with icon]         │ │
│  │                           │ │
│  │ Password                  │ │
│  │ [Input with icon]         │ │
│  │ [Strength Meter]          │ │
│  │                           │ │
│  │ Confirm password          │ │
│  │ [Input with icon]         │ │
│  │ [Match Indicator]        │ │
│  │                           │ │
│  │ [ ] Terms & Privacy       │ │
│  │                           │ │
│  │ [Create account Button]   │ │
│  └───────────────────────────┘ │
│                                 │
│  ─── Already have account? ─── │
│                                 │
│  [Sign in instead Button]       │
└─────────────────────────────────┘
```

## Password Strength Indicator

The register page includes a real-time password strength meter:

### Strength Levels

1. **Weak** (1 bar)
   - Less than 8 characters
   - Missing complexity requirements

2. **Fair** (2 bars)
   - 8+ characters
   - Some complexity requirements met

3. **Good** (3 bars)
   - 8+ characters
   - Most complexity requirements met

4. **Strong** (4 bars)
   - 12+ characters
   - All complexity requirements met
   - Includes special characters

### Visual Indicator

```vue
<div class="flex gap-1">
  <div class="h-1 flex-1 rounded-full bg-success"></div>
  <div class="h-1 flex-1 rounded-full bg-success"></div>
  <div class="h-1 flex-1 rounded-full bg-border"></div>
  <div class="h-1 flex-1 rounded-full bg-border"></div>
</div>
```

- Green bars indicate strength
- Gray bars indicate remaining potential
- Smooth transitions between states

## Form Validation

### Login Validation

- **Email**: Required, valid email format
- **Password**: Required, minimum 8 characters

### Register Validation

- **Name**: Required, 2-50 characters
- **Email**: Required, valid email format
- **Password**: 
  - Required
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
- **Confirm Password**: Must match password
- **Terms**: Must be accepted

## Error Handling

### User-Friendly Messages

Errors are displayed with clear, actionable messages:

**Login Errors:**
- "Invalid email or password. Please check your credentials and try again."
- "Something went wrong. Please try again in a moment."

**Register Errors:**
- "This email is already registered. Please sign in or use a different email."
- "Password requirements not met. Please check and try again."
- "Something went wrong. Please try again in a moment."

### Visual Feedback

- Toast notifications for success/error states
- Form field validation errors
- Password strength visual feedback
- Password match indicators

## Responsive Design

### Breakpoints

- **Mobile** (< 640px): 
  - Single column layout
  - Full-width buttons
  - Compact spacing
  - Smaller icons (16px)

- **Tablet** (640px - 1024px):
  - Maintained single column
  - Medium spacing
  - Medium icons (20px)

- **Desktop** (> 1024px):
  - Maximum width container
  - Generous spacing
  - Large icons (20px)
  - Enhanced hover effects

### Touch Targets

All interactive elements meet minimum touch target sizes:
- Buttons: 48px height (mobile), 56px (desktop)
- Links: Minimum 44x44px touch area
- Checkboxes: Accessible size with proper spacing

## Accessibility Features

### Keyboard Navigation

- ✅ Tab order follows visual flow
- ✅ Enter key submits forms
- ✅ Escape key closes modals (if applicable)
- ✅ Focus indicators on all interactive elements

### Screen Readers

- ✅ Proper form labels
- ✅ ARIA attributes where needed
- ✅ Error messages announced
- ✅ Password strength announced
- ✅ Button states announced

### Visual Accessibility

- ✅ WCAG AA contrast ratios
- ✅ Focus rings on all interactive elements
- ✅ Clear visual feedback
- ✅ High contrast mode support

## Color Usage

### Semantic Colors

All colors use semantic naming:

```vue
<!-- Backgrounds -->
bg-background dark:bg-dark-background
bg-card dark:bg-dark-card
bg-surface dark:bg-dark-surface

<!-- Text -->
text-text-primary dark:text-dark-text-primary
text-text-secondary dark:text-dark-text-secondary
text-text-tertiary dark:text-dark-text-secondary

<!-- Interactive -->
text-primary hover:text-primary-600
dark:text-primary-400 dark:hover:text-primary-300

<!-- Borders -->
border-border dark:border-dark-border
```

### No Hardcoded Colors

❌ **Never use:**
- `bg-blue-500`
- `text-gray-900`
- `border-gray-200`

✅ **Always use:**
- `bg-primary`
- `text-text-primary`
- `border-border`

## Animation & Transitions

### Smooth Interactions

All interactive elements have smooth transitions:

```vue
<!-- Buttons -->
transition-all duration-300

<!-- Cards -->
hover:shadow-ios-xl transition-all duration-300

<!-- Links -->
transition-colors duration-200
```

### Loading States

- Button shows loading state during submission
- Disabled state prevents double submission
- Visual feedback with opacity changes

## Usage Examples

### Basic Login Flow

```vue
<template>
  <!-- Login page automatically handles: -->
  <!-- - Form validation -->
  <!-- - Error handling -->
  <!-- - Success redirect -->
  <!-- - Loading states -->
</template>
```

### Customization

To customize the auth pages:

1. **Change Brand Icon**: Update the `UIcon` name in the brand section
2. **Modify Colors**: Update CSS variables in `assets/css/main.css`
3. **Adjust Spacing**: Modify padding/margin classes
4. **Change Validation**: Update Zod schema in script section

## Related Documentation

- [Component Standards](../agent-rule/component-standards.md) - Component structure guidelines
- [Design System](../design-system/README.md) - Design tokens and colors
- [InteractiveHoverButton](../components/interactive-hover-button.md) - Button component
- [Theme Configuration](../design-system/theme-configuration.md) - Theme setup

## Changelog

- **v2.0.0** (2024-01-XX) - Complete iOS-inspired redesign with enhanced UX
  - Added password strength indicator
  - Improved visual hierarchy
  - Enhanced accessibility
  - Better error messaging
  - Mobile-first improvements
- **v1.0.0** (2024-01-XX) - Initial implementation

## Best Practices

### ✅ Do

- Keep forms simple and focused
- Provide clear error messages
- Show password requirements upfront
- Use semantic colors
- Test on mobile devices
- Ensure keyboard navigation works
- Test with screen readers

### ❌ Don't

- Don't use hardcoded colors
- Don't skip dark mode variants
- Don't make forms too long
- Don't hide password requirements
- Don't use generic error messages
- Don't forget mobile users
- Don't skip accessibility testing

