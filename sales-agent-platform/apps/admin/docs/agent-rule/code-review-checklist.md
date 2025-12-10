# Code Review Checklist

Use this checklist when reviewing or creating code to ensure it meets all standards.

## Colors & Theming

- [ ] No hardcoded colors (`bg-blue-500`, `text-gray-900`, etc.)
- [ ] All colors use semantic names (`bg-primary`, `text-text-primary`)
- [ ] Dark mode variants included for all colors (`dark:bg-dark-card`)
- [ ] CSS variables used for theme colors
- [ ] Colors tested in both light and dark modes

## Responsive Design

- [ ] Mobile-first approach (base styles for mobile)
- [ ] Tablet breakpoints included (`md:` classes)
- [ ] Desktop breakpoints included (`lg:` classes)
- [ ] No fixed widths without responsive alternatives
- [ ] Touch-friendly sizing (min 44x44px for interactive elements)

## iOS-Inspired Design

- [ ] Rounded corners used (`rounded-ios-lg`, `rounded-ios-xl`)
- [ ] iOS-style shadows applied (`shadow-ios-lg`)
- [ ] Smooth transitions on interactive elements (`transition-all duration-300`)
- [ ] Generous whitespace and padding
- [ ] Proper spacing scale used

## Component Structure

- [ ] Follows component structure template
- [ ] TypeScript interfaces for props
- [ ] Typed emits for events
- [ ] Proper state management (ref, computed, reactive)
- [ ] Helpful comments for complex logic
- [ ] Proper file naming (PascalCase)

## Accessibility

- [ ] ARIA labels on interactive elements
- [ ] Keyboard navigation supported
- [ ] Screen reader friendly
- [ ] Color contrast meets WCAG AA standards
- [ ] Focus management handled
- [ ] Semantic HTML used

## Code Quality

- [ ] No console.log statements in production code
- [ ] Error handling implemented
- [ ] Loading states handled
- [ ] Edge cases considered (empty states, errors)
- [ ] Performance optimized (lazy loading, memoization)
- [ ] No unused imports or variables

## State Management

- [ ] Global state uses Zustand (not Vuex/Pinia)
- [ ] Zustand stores use TypeScript interfaces
- [ ] Selective subscriptions used with computed (not entire store)
- [ ] Local state uses ref/reactive (not Zustand)
- [ ] Server state uses tRPC/useAsyncData (not Zustand)
- [ ] Persistence used appropriately (auth, settings)

## TypeScript

- [ ] All props typed with interfaces
- [ ] All emits typed
- [ ] No `any` types (use `unknown` if needed)
- [ ] Type safety maintained throughout
- [ ] Proper type imports

## Styling

- [ ] Tailwind classes used (no inline styles)
- [ ] Semantic spacing scale used
- [ ] Consistent class ordering
- [ ] No conflicting styles
- [ ] Responsive classes properly ordered

## Documentation

- [ ] Component documented (if reusable)
- [ ] Props documented with types
- [ ] Usage examples provided
- [ ] Related components linked
- [ ] Changelog updated (if applicable)

## Testing

- [ ] Component works in isolation
- [ ] Responsive behavior tested
- [ ] Dark mode tested
- [ ] Accessibility tested
- [ ] Edge cases tested

## Common Issues to Check

### Hardcoded Colors
```vue
<!-- ❌ Wrong -->
<div class="bg-blue-500 text-white">

<!-- ✅ Correct -->
<div class="bg-primary-500 text-primary-foreground">
```

### Missing Dark Mode
```vue
<!-- ❌ Wrong -->
<div class="bg-white text-gray-900">

<!-- ✅ Correct -->
<div class="bg-card dark:bg-dark-card text-text-primary dark:text-dark-text-primary">
```

### Missing Responsiveness
```vue
<!-- ❌ Wrong -->
<div class="p-6 grid grid-cols-4">

<!-- ✅ Correct -->
<div class="p-4 md:p-6 lg:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
```

### Missing iOS Styling
```vue
<!-- ❌ Wrong -->
<div class="rounded-lg shadow-md">

<!-- ✅ Correct -->
<div class="rounded-ios-lg shadow-ios-lg transition-all duration-300">
```

### Missing Accessibility
```vue
<!-- ❌ Wrong -->
<button><Icon name="close" /></button>

<!-- ✅ Correct -->
<button aria-label="Close dialog"><Icon name="close" /></button>
```

## Review Process

1. **Initial Scan**
   - Check for hardcoded colors
   - Verify dark mode support
   - Check responsive classes

2. **Structure Review**
   - Component structure
   - TypeScript types
   - State management

3. **Styling Review**
   - iOS design elements
   - Semantic colors
   - Responsive design

4. **Accessibility Review**
   - ARIA attributes
   - Keyboard navigation
   - Color contrast

5. **Quality Review**
   - Error handling
   - Performance
   - Edge cases

6. **Documentation Review**
   - Component docs
   - Usage examples
   - Related links

## Automated Checks

Run these commands before submitting:

```bash
# Type checking
bun run check-types

# Linting
bun run lint

# Build check
bun run build
```

## Related Documentation

- [Core Rules](./core-rules.md) - Essential coding standards
- [Component Standards](./component-standards.md) - Component guidelines
- [State Management](./state-management.md) - Zustand guide
- [Theme Configuration](./theme-configuration.md) - Theme setup

