# Component Standards

## Component Structure Template

Every component should follow this structure:

```vue
<template>
  <div class="
    // Base (mobile-first)
    flex flex-col gap-4 p-4
    // Tablet
    md:flex-row md:gap-6 md:p-6
    // Desktop  
    lg:gap-8 lg:p-8
    // Colors with dark mode
    bg-card dark:bg-dark-card
    text-text-primary dark:text-dark-text-primary
    // iOS styling
    rounded-ios-lg shadow-ios-lg
    border border-border dark:border-dark-border
    // Interactions
    hover:shadow-ios-xl transition-all duration-300
  ">
    <!-- Component content -->
  </div>
</template>

<script setup lang="ts">
// 1. Imports
import { ref, computed } from 'vue'

// 2. Props interface
interface Props {
  // Define props with types
}

// 3. Props definition
const props = withDefaults(defineProps<Props>(), {
  // Default values
})

// 4. Emits
const emit = defineEmits<{
  (e: 'eventName', value: Type): void
}>()

// 5. State
const state = ref()

// 6. Computed
const computedValue = computed(() => {
  // Computation
})

// 7. Methods
const handleAction = () => {
  // Logic
}

// 8. Lifecycle hooks
onMounted(() => {
  // Setup
})
</script>
```

## Required Elements

### 1. Semantic Colors
Always use semantic color names:

```vue
<!-- ✅ Correct -->
<div class="bg-primary-500 text-primary-foreground">
<div class="bg-success text-white">
<div class="bg-error-light text-error">

<!-- ❌ Wrong -->
<div class="bg-blue-500 text-white">
<div class="bg-green-500 text-white">
<div class="bg-red-100 text-red-600">
```

### 2. Dark Mode Support
Every color class needs a dark mode variant:

```vue
<!-- ✅ Correct -->
<div class="bg-card dark:bg-dark-card text-text-primary dark:text-dark-text-primary">

<!-- ❌ Wrong -->
<div class="bg-white text-gray-900">
```

### 3. Responsive Design
Always include responsive classes:

```vue
<!-- ✅ Correct -->
<div class="p-4 md:p-6 lg:p-8">
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">

<!-- ❌ Wrong -->
<div class="p-6">
<div class="grid grid-cols-4">
```

### 4. iOS-Inspired Styling
Use iOS design elements:

```vue
<!-- ✅ Correct -->
<div class="rounded-ios-lg shadow-ios-lg transition-all duration-300">

<!-- ❌ Wrong -->
<div class="rounded-lg shadow-md">
```

### 5. Accessibility
Include accessibility attributes:

```vue
<!-- ✅ Correct -->
<button 
  class="..."
  aria-label="Close dialog"
  aria-expanded="true"
>
  <Icon name="close" />
</button>

<!-- ❌ Wrong -->
<button class="...">
  <Icon name="close" />
</button>
```

## Component Naming

### File Names
- Use **PascalCase**: `UserProfile.vue` ✅
- NOT kebab-case: `user-profile.vue` ❌

### Component Names
- Match file name: `UserProfile.vue` → `<UserProfile />`
- Use descriptive names: `UserProfileCard` ✅ NOT `Card` ❌

## Props Definition

Always use TypeScript interfaces:

```vue
<script setup lang="ts">
interface Props {
  title: string
  description?: string
  count: number
  items: string[]
  onAction?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  description: '',
  onAction: undefined
})
</script>
```

## Event Emitting

Use typed emits:

```vue
<script setup lang="ts">
const emit = defineEmits<{
  (e: 'update', value: string): void
  (e: 'delete', id: string): void
  (e: 'close'): void
}>()

const handleUpdate = () => {
  emit('update', 'new value')
}
</script>
```

## State Management

### Local State - Use Vue 3 Composition API

```vue
<script setup lang="ts">
// ✅ Use ref for primitives
const count = ref(0)

// ✅ Use ref for objects
const user = ref({ name: '', email: '' })

// ✅ Use computed for derived state
const fullName = computed(() => `${user.value.name} ${user.value.email}`)

// ✅ Use reactive for complex objects (rarely needed)
const state = reactive({ ... })
</script>
```

### Global State - Use Zustand

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'

// ✅ Good - Select only what you need with computed for reactivity
const store = useAuthStore
const user = computed(() => store((state) => state.user))
const isAuthenticated = computed(() => store((state) => state.isAuthenticated))
const login = () => store.getState().login(email.value, password.value)

// ✅ Good - Multiple selective values
const { user, isLoading } = computed(() => {
  const state = store.getState()
  return {
    user: state.user,
    isLoading: state.isLoading,
  }
})

// ❌ Bad - Subscribes to entire store (not reactive in Vue)
const { user, login } = useAuthStore
</script>
```

### When to Use What

- **ref/reactive** - Local component state (form inputs, UI toggles)
- **Zustand** - Global app state (auth, user data, app settings)
- **tRPC/useAsyncData** - Server state (API data, caching)
- **computed** - Derived state and reactivity wrapper for Zustand

## Styling Guidelines

### Use Tailwind Classes
```vue
<!-- ✅ Correct -->
<div class="flex items-center gap-4 p-6 bg-card rounded-ios-lg">

<!-- ❌ Wrong -->
<div style="display: flex; align-items: center; padding: 1.5rem;">
```

### Use Semantic Spacing
```vue
<!-- ✅ Correct -->
<div class="p-4 md:p-6 lg:p-8"> <!-- Responsive padding -->
<div class="gap-2 md:gap-4"> <!-- Responsive gap -->

<!-- ❌ Wrong -->
<div class="p-6"> <!-- Fixed padding -->
```

### Use Theme Colors
```vue
<!-- ✅ Correct -->
<div class="bg-primary-500 hover:bg-primary-600">
<div class="text-error hover:text-error-dark">

<!-- ❌ Wrong -->
<div class="bg-blue-500 hover:bg-blue-600">
<div class="text-red-600 hover:text-red-700">
```

## Component Examples

### Button Component
```vue
<template>
  <button
    :class="cn(
      'px-4 py-2 rounded-ios-lg shadow-ios transition-all duration-300',
      'bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700',
      'text-primary-foreground',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      props.class
    )"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot>{{ text }}</slot>
  </button>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  text?: string
  disabled?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  text: 'Button',
  disabled: false
})

const emit = defineEmits<{
  (e: 'click'): void
}>()

const handleClick = () => {
  if (!props.disabled) {
    emit('click')
  }
}
</script>
```

### Card Component
```vue
<template>
  <div
    :class="cn(
      'bg-card dark:bg-dark-card',
      'rounded-ios-lg shadow-ios-lg',
      'border border-border dark:border-dark-border',
      'p-4 md:p-6 lg:p-8',
      'transition-all duration-300',
      'hover:shadow-ios-xl',
      props.class
    )"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  class?: string
}

const props = defineProps<Props>()
</script>
```

## Best Practices

1. **Keep components small and focused** - One responsibility per component
2. **Use composition** - Break complex components into smaller ones
3. **Document props** - Add JSDoc comments for complex props
4. **Test edge cases** - Handle empty states, loading states, errors
5. **Optimize performance** - Use `v-memo`, `v-once` when appropriate
6. **Accessibility first** - Always include ARIA attributes
7. **Type safety** - Use TypeScript for all props and emits

## Related Documentation

- [Core Rules](./core-rules.md) - Essential coding standards
- [State Management](./state-management.md) - Zustand guide
- [Theme Configuration](./theme-configuration.md) - Color system
- [Code Review Checklist](./code-review-checklist.md) - Review guidelines

