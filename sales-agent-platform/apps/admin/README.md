# Nuxt Admin Dashboard

A modern admin dashboard built with Nuxt 3, InspiraUI, and TailwindCSS.

## Features

- 🎨 Modern and responsive design
- 🔐 Authentication (Login/Register)
- 📊 Dashboard with analytics
- ℹ️ About Us page
- 🎯 Reusable components
- 🎨 Customizable theme
- 📱 Mobile-friendly

## Project Structure

```
admin/
├── components/         # Reusable Vue components
│   ├── ui/            # UI components (buttons, cards, etc.)
│   ├── layout/        # Layout components
│   └── features/      # Feature-specific components
├── composables/       # Vue composables
├── pages/            # Application pages
│   ├── auth/         # Authentication pages
│   ├── dashboard/    # Dashboard pages
│   └── about/        # About page
├── assets/           # Static assets
│   ├── css/          # Global styles
│   └── images/       # Images
├── public/           # Public assets
└── server/           # Server-side code
```

## Getting Started

1. Install dependencies:
```bash
npm install
# or
yarn install
# or
bun install
```

2. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
bun dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Best Practices

### Component Structure
- Use PascalCase for component names
- Keep components small and focused
- Use TypeScript for type safety
- Implement proper prop validation
- Use composition API with `<script setup>`

### Styling
- Use TailwindCSS utility classes
- Create reusable component variants
- Follow BEM naming convention for custom CSS
- Use CSS variables for theming

### State Management
- Use composables for shared state
- Implement proper error handling
- Use TypeScript interfaces for data structures

### Performance
- Implement lazy loading for routes
- Optimize images
- Use proper caching strategies
- Minimize bundle size

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

MIT

# Admin Panel UI Standards

This document outlines the UI standards and component usage guidelines for the admin panel.

## UI Libraries

### Core UI Components
- **NuxtUI**: Primary UI component library
  - Documentation: [https://ui.nuxt.com](https://ui.nuxt.com)
  - Used for: Basic components (buttons, inputs, cards, etc.)
  - Installation: Already included in the project
  - **MUST USE** for all basic UI components

### Special Effects & Animations
- **InspiraUI**: Special effects and animations
  - Documentation: [https://inspira-ui.com](https://inspira-ui.com)
  - Used for: Advanced animations, 3D effects, and interactive elements
  - Installation: Already included in the project
  - **MUST USE** for all animation and special effects

## Library Usage Guidelines

### Approved Libraries
The following libraries are approved for use in this project:

1. **Core Dependencies**
   - Nuxt 3 (Framework)
   - Vue 3 (Core)
   - TypeScript (Type Safety)
   - TailwindCSS (Styling)
   - NuxtUI (UI Components)
   - InspiraUI (Animations)

2. **State Management**
   - Pinia (State Management)
   - VueUse (Composables)

3. **Form Handling**
   - VeeValidate (Form Validation)
   - Zod (Schema Validation)

4. **API & Data Fetching**
   - tRPC (Type-safe API)
   - Axios (HTTP Client)

### Library Usage Restrictions

1. **DO NOT** introduce new UI component libraries without explicit approval
2. **DO NOT** use alternative styling solutions (e.g., SCSS, Styled Components) unless absolutely necessary
3. **DO NOT** add new animation libraries - use InspiraUI for all animations
4. **DO NOT** use alternative state management solutions (e.g., Vuex)
5. **DO NOT** use alternative form handling libraries without team discussion

### Exception Process
If you believe you need to use a library not listed above:

1. Create an issue explaining:
   - The specific problem you're trying to solve
   - Why existing libraries can't solve it
   - The proposed alternative library
   - The impact on bundle size and performance

2. Get approval from the team before implementation

### Why These Restrictions?
- Maintain consistent UI/UX across the application
- Reduce bundle size and improve performance
- Simplify maintenance and updates
- Ensure type safety and code quality
- Prevent dependency conflicts

## Component Standards

### 1. Naming Conventions
- Use PascalCase for component names
- Use kebab-case for file names

### 2. Component Structure
```vue
<template>
  <!-- Component template -->
</template>

<script setup lang="ts">
// TypeScript interfaces
// Component logic
</script>

<style scoped>
/* Component styles */
</style>
```

### 3. Props & Events
- Use TypeScript interfaces for props
- Use `defineProps` and `defineEmits` for props and events
- Document complex props with comments

### 4. Styling Guidelines
- Use Tailwind CSS for styling
- Use NuxtUI classes for basic components
- Use InspiraUI classes for special effects
- Keep styles scoped to components
- Use CSS variables for theme colors

## Component Usage Examples

### Buttons
```vue
<UButton
  color="primary"
  variant="solid"
  :loading="isLoading"
  @click="handleClick"
>
  Click me
</UButton>
```

### Inputs
```vue
<UInput
  v-model="value"
  type="text"
  placeholder="Enter text"
  :error="error"
/>
```

### Cards with InspiraUI Effects
```vue
<div class="card-3d">
  <div class="card-content">
    <!-- Card content -->
  </div>
</div>
```

### Tables
```vue
<AdminDataTable
  :data="items"
  :columns="columns"
  @create="handleCreate"
  @edit="handleEdit"
  @delete="handleDelete"
/>
```

## Animation Guidelines

### 1. Page Transitions
- Use NuxtUI's built-in transitions
- Keep transitions subtle and professional
- Maximum duration: 300ms

### 2. Interactive Elements
- Use InspiraUI for hover effects
- Implement smooth transitions
- Add subtle feedback animations

### 3. Loading States
- Use NuxtUI's loading components
- Implement skeleton loaders for data fetching
- Show progress indicators for long operations

## Best Practices

1. **Performance**
   - Lazy load components when possible
   - Optimize images and assets
   - Use proper caching strategies

2. **Accessibility**
   - Use semantic HTML
   - Include proper ARIA attributes
   - Ensure keyboard navigation
   - Maintain proper contrast ratios

3. **Responsiveness**
   - Design mobile-first
   - Use responsive breakpoints
   - Test on multiple devices

4. **Error Handling**
   - Show user-friendly error messages
   - Implement proper validation
   - Provide clear feedback

## Development Workflow

1. **Component Creation**
   - Create new components in `components/admin/`
   - Follow naming conventions
   - Add TypeScript interfaces
   - Include proper documentation

2. **Testing**
   - Write unit tests for components
   - Test responsive behavior
   - Verify accessibility
   - Check browser compatibility

3. **Documentation**
   - Document component props and events
   - Include usage examples
   - Add comments for complex logic

## Common Patterns

### Form Handling
```vue
<template>
  <UForm :state="formState" @submit="handleSubmit">
    <UFormGroup label="Name">
      <UInput v-model="formState.name" />
    </UFormGroup>
    <!-- More form fields -->
  </UForm>
</template>
```

### Modal Dialogs
```vue
<UModal v-model="isOpen">
  <template #header>
    <h3>Modal Title</h3>
  </template>
  <!-- Modal content -->
</UModal>
```

### Data Tables
```vue
<UTable
  :rows="data"
  :columns="columns"
  :loading="isLoading"
  @row-click="handleRowClick"
/>
```

## Theme Customization

### Colors
```css
:root {
  --primary-color: #4f46e5;
  --secondary-color: #10b981;
  --danger-color: #ef4444;
  /* More theme variables */
}
```

### Typography
- Use system fonts for better performance
- Maintain consistent font sizes
- Follow the type scale

## Troubleshooting

### Common Issues
1. **Component not rendering**
   - Check component registration
   - Verify prop types
   - Check for console errors

2. **Styles not applying**
   - Verify class names
   - Check for style conflicts
   - Ensure proper scoping

3. **Animations not working**
   - Check browser support
   - Verify animation classes
   - Test in different browsers

## Support

For additional support:
- Check the NuxtUI documentation
- Refer to InspiraUI examples
- Contact the development team
