# RTable

## Overview

A reusable data table component with built-in pagination, loading states, and create action support. Perfect for displaying tabular data with consistent styling and functionality.

## Preview

The table displays:
- Title header with optional "Add New" button
- Data table with customizable columns
- Pagination controls (page size selector, page navigation)
- Loading state indicator
- Responsive design

## Installation

This component is already included in the project. No additional installation required.

## Usage

### Basic Example

```vue
<template>
  <RTable
    title="Users"
    :data="users"
    :columns="columns"
    :loading="loading"
    :current-page="currentPage"
    :page-size="pageSize"
    :total-items="totalItems"
    @create="handleCreate"
    @update:current-page="handlePageChange"
    @update:page-size="handlePageSizeChange"
  />
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

const users = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const totalItems = ref(0)

const columns: TableColumn[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => row.getValue('name')
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => row.getValue('email')
  }
]

const handleCreate = () => {
  // Open create modal
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  // Fetch data for new page
}

const handlePageSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  // Fetch data with new page size
}
</script>
```

### With Create Button

```vue
<template>
  <RTable
    title="Products"
    :data="products"
    :columns="columns"
    :can-create="true"
    @create="openCreateModal"
  />
</template>

<script setup lang="ts">
const openCreateModal = () => {
  // Show create modal
}
</script>
```

### With Custom Actions Column

```vue
<script setup lang="ts">
import { h } from 'vue'
import { UButton } from '#components'

const columns: TableColumn[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => row.getValue('name')
  },
  {
    id: 'actions',
    header: () => h('div', { class: 'text-right' }, 'Actions'),
    cell: ({ row }) => {
      return h('div', { class: 'flex items-center justify-end space-x-2' }, [
        h(UButton, {
          color: 'primary',
          variant: 'ghost',
          size: 'xs',
          icon: 'i-heroicons-pencil',
          onClick: () => handleEdit(row.original)
        }),
        h(UButton, {
          color: 'error',
          variant: 'ghost',
          size: 'xs',
          icon: 'i-heroicons-trash',
          onClick: () => handleDelete(row.original)
        })
      ])
    }
  }
]
</script>
```

## Props/Parameters

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| title | `string` | - | Yes | Table title displayed in header |
| data | `T[]` | `[]` | Yes | Array of data objects to display |
| columns | `TableColumn<T>[]` | `[]` | Yes | Column definitions (from Nuxt UI) |
| canCreate | `boolean` | `false` | No | Show "Add New" button |
| loading | `boolean` | `false` | No | Show loading state |
| error | `Error \| null` | `null` | No | Error state (not currently displayed) |
| currentPage | `number` | `1` | No | Current page number |
| pageSize | `number` | `10` | No | Number of items per page |
| totalItems | `number` | `0` | No | Total number of items |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| create | - | Emitted when "Add New" button is clicked |
| update:currentPage | `number` | Emitted when page changes |
| update:pageSize | `number` | Emitted when page size changes |

## Pagination

The component includes built-in pagination with:
- Page size selector (10, 25, 50, 100 items)
- Current page indicator (e.g., "1-10 of 100")
- Previous/Next buttons
- Automatic disabled states for first/last page

### Page Size Options

Default options: `[10, 25, 50, 100]`

To customize, you would need to modify the component or pass a custom select component.

## Styling

### Theme Colors Used
- `bg-card dark:bg-dark-card` - Table background
- `border-border dark:border-dark-border` - Borders
- `text-text-primary dark:text-dark-text-primary` - Primary text
- `text-text-secondary dark:text-dark-text-secondary` - Secondary text
- `shadow-ios` - iOS-style shadow
- `rounded-ios-lg` - iOS-style rounded corners

### Customization

The table uses iOS-inspired styling:
- Rounded corners: `rounded-ios-lg` (16px)
- Shadow: `shadow-ios` (subtle shadow)
- Border: `border-border` (theme border color)

### Responsive Behavior
- **Mobile**: 
  - Pagination stacks vertically (`flex-col`)
  - Reduced padding (`p-4`)
- **Tablet/Desktop**: 
  - Pagination in row (`sm:flex-row`)
  - Increased padding (`md:p-6`)

## Accessibility

- ✅ Keyboard navigation supported (pagination buttons)
- ✅ Screen reader friendly (semantic HTML)
- ✅ ARIA labels on interactive elements
- ✅ Focus management handled
- ✅ Color contrast meets WCAG AA standards

## Examples in Production

Where this component is currently used:
- Users page (`/pages/users/index.vue`) - User management table
- Products page (`/pages/products/index.vue`) - Product management table

## Related Components

- [RSidebar](./r-sidebar.md) - Sidebar navigation
- [UTable](https://ui.nuxt.com/components/table) - Base Nuxt UI table component

## Troubleshooting

### Data not displaying
**Problem**: Table shows empty even with data
**Solution**: Check that `columns` are properly defined and match your data structure. Verify `accessorKey` matches your data keys.

### Pagination not working
**Problem**: Page changes not updating
**Solution**: Ensure you're listening to `@update:current-page` and `@update:page-size` events and updating your data accordingly.

### Loading state not showing
**Problem**: Loading indicator not visible
**Solution**: Pass `:loading="true"` prop. The loading state is handled by the underlying `UTable` component.

### Create button not showing
**Problem**: "Add New" button not visible
**Solution**: Set `:can-create="true"` prop. The button will appear in the header.

## Changelog

- **v1.0.0** (2024-01-01) - Initial release with pagination and semantic colors

## Contributing

See [Contributing Guidelines](../../../README.md) for how to contribute to this component.

