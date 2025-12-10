# State Management with Zustand

## Overview

The admin app uses **Zustand** for global state management. Zustand works great with Vue 3 and Nuxt, providing a lightweight, performant state management solution.

## Why Zustand?

- ✅ **Lightweight** - Small bundle size
- ✅ **Simple API** - Easy to learn and use
- ✅ **TypeScript Support** - Full type safety
- ✅ **No Boilerplate** - Less code than Pinia/Vuex
- ✅ **Performance** - Only re-renders when needed
- ✅ **Vue Compatible** - Works great with Vue 3 Composition API

## Installation

Zustand should already be installed. If not:

```bash
bun add zustand
```

## Store Structure

### Store Location

Create stores in `stores/` directory:

```
stores/
├── useAuthStore.ts      # Authentication state
├── useUserStore.ts      # User data
├── useProductStore.ts   # Product data
└── useAppStore.ts       # App-wide state
```

### Basic Store Template (Vue/Nuxt)

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface StoreState {
  // State
  count: number;
  isLoading: boolean;
  
  // Actions
  increment: () => void;
  decrement: () => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      // Initial state
      count: 0,
      isLoading: false,
      
      // Actions
      increment: () => set((state) => ({ count: state.count + 1 })),
      decrement: () => set((state) => ({ count: state.count - 1 })),
      setLoading: (loading) => set({ isLoading: loading }),
      reset: () => set({ count: 0, isLoading: false }),
    }),
    {
      name: 'store-storage', // Storage key
      storage: createJSONStorage(() => localStorage), // Browser storage
    }
  )
);
```

## Usage in Vue Components

### Basic Usage

```vue
<template>
  <div>
    <p>{{ count }}</p>
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
  </div>
</template>

<script setup lang="ts">
import { useStore } from '@/stores/useStore';

// ✅ Good - Select only what you need
const count = useStore((state) => state.count);
const increment = useStore((state) => state.increment);
const decrement = useStore((state) => state.decrement);
</script>
```

### With Reactive State

```vue
<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '@/stores/useStore';

// Select store state
const store = useStore();

// Create reactive computed properties
const count = computed(() => store((state) => state.count));
const isLoading = computed(() => store((state) => state.isLoading));

// Or use store directly
const increment = () => useStore.getState().increment();
</script>
```

### Multiple Selectors

```vue
<script setup lang="ts">
import { useStore } from '@/stores/useStore';

// Select multiple values
const { count, isLoading } = useStore((state) => ({
  count: state.count,
  isLoading: state.isLoading,
}));
</script>
```

## Store Examples

### Authentication Store

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  
  // Actions
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      
      // Actions
      login: (user, token) => set({
        user,
        token,
        isAuthenticated: true,
      }),
      
      logout: () => set({
        user: null,
        token: null,
        isAuthenticated: false,
      }),
      
      updateUser: (userData) => set((state) => ({
        user: state.user ? { ...state.user, ...userData } : null,
      })),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

### Product Store

```typescript
import { create } from 'zustand';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  selectProduct: (product: Product | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  // Initial state
  products: [],
  selectedProduct: null,
  isLoading: false,
  error: null,
  
  // Actions
  setProducts: (products) => set({ products }),
  
  addProduct: (product) => set((state) => ({
    products: [...state.products, product],
  })),
  
  updateProduct: (id, productData) => set((state) => ({
    products: state.products.map((p) =>
      p.id === id ? { ...p, ...productData } : p
    ),
  })),
  
  deleteProduct: (id) => set((state) => ({
    products: state.products.filter((p) => p.id !== id),
  })),
  
  selectProduct: (product) => set({ selectedProduct: product }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
}));
```

## Usage in Composables

### Creating a Composable Wrapper

```typescript
// composables/useAuthStore.ts
import { useAuthStore as useZustandAuthStore } from '@/stores/useAuthStore';
import { computed } from 'vue';

export const useAuthStore = () => {
  const store = useZustandAuthStore;
  
  return {
    // Reactive state
    user: computed(() => store((state) => state.user)),
    isAuthenticated: computed(() => store((state) => state.isAuthenticated)),
    
    // Actions
    login: (user: User, token: string) => store.getState().login(user, token),
    logout: () => store.getState().logout(),
    updateUser: (user: Partial<User>) => store.getState().updateUser(user),
  };
};
```

### Using in Components

```vue
<script setup lang="ts">
import { useAuthStore } from '@/composables/useAuthStore';

const { user, isAuthenticated, login, logout } = useAuthStore();
</script>
```

## Best Practices

### ✅ Do

1. **Use TypeScript interfaces** for store state:
```typescript
interface StoreState {
  // State and actions
}
```

2. **Select only what you need** to prevent unnecessary re-renders:
```typescript
const count = useStore((state) => state.count);
```

3. **Use persist middleware** for data that should survive page refreshes:
```typescript
persist(
  (set) => ({ ... }),
  { name: 'store-name', storage: createJSONStorage(() => localStorage) }
)
```

4. **Keep stores focused** - One store per domain:
```typescript
useAuthStore.ts    // Authentication
useUserStore.ts    // User data
useProductStore.ts // Products
```

5. **Use actions for mutations** - Don't mutate state directly:
```typescript
// ✅ Good
increment: () => set((state) => ({ count: state.count + 1 }))

// ❌ Bad
increment: () => { count++ } // Direct mutation
```

6. **Create composable wrappers** for Vue reactivity:
```typescript
// composables/useStore.ts
export const useStore = () => {
  const store = useZustandStore;
  return {
    value: computed(() => store((state) => state.value)),
    action: () => store.getState().action(),
  };
};
```

### ❌ Don't

1. **Don't subscribe to entire store** if you only need one value:
```typescript
// ❌ Bad
const store = useStore();

// ✅ Good
const count = useStore((state) => state.count);
```

2. **Don't create too many stores** - Group related state:
```typescript
// ❌ Bad - Too granular
useCountStore.ts
useLoadingStore.ts
useErrorStore.ts

// ✅ Good - Grouped
useAppStore.ts // Contains count, loading, error
```

3. **Don't mutate state directly**:
```typescript
// ❌ Bad
const update = () => {
  useStore.getState().count++; // Direct mutation
}

// ✅ Good
const update = () => {
  useStore.getState().increment(); // Use action
}
```

4. **Don't store derived state** - Compute it in components:
```typescript
// ❌ Bad - Storing computed value
const totalPrice = useStore((state) => state.totalPrice);

// ✅ Good - Compute in component
const products = useStore((state) => state.products);
const totalPrice = computed(() => 
  products.value.reduce((sum, p) => sum + p.price, 0)
);
```

## Persistence

### When to Use Persistence

Use `persist` middleware for:
- ✅ User authentication state
- ✅ User preferences
- ✅ Shopping cart
- ✅ App settings

Don't persist:
- ❌ Temporary UI state
- ❌ API response cache (use tRPC/React Query instead)
- ❌ Large datasets

### Persistence Example

```typescript
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Store definition
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      // Optional: Only persist specific fields
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);
```

## Async Actions

### With Async/Await

```typescript
interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  
  login: (email: string, password: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.login(email, password);
      set({
        user: response.user,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error.message,
      });
    }
  },
}));
```

### Usage in Component

```vue
<template>
  <div>
    <div v-if="error">{{ error }}</div>
    <button @click="handleLogin" :disabled="isLoading">
      {{ isLoading ? 'Logging in...' : 'Login' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore';
import { computed } from 'vue';

const store = useAuthStore;
const isLoading = computed(() => store((state) => state.isLoading));
const error = computed(() => store((state) => state.error));

const handleLogin = async () => {
  await store.getState().login(email.value, password.value);
};
</script>
```

## Combining with Nuxt Composables

### With useAsyncData

```vue
<script setup lang="ts">
import { useProductStore } from '@/stores/useProductStore';

const store = useProductStore;

// Fetch and store
const { data } = await useAsyncData('products', async () => {
  const products = await $fetch('/api/products');
  store.getState().setProducts(products);
  return products;
});

// Use from store
const products = computed(() => store((state) => state.products));
</script>
```

## Testing

### Mock Store for Tests

```typescript
import { useAuthStore } from '@/stores/useAuthStore';

// In test
beforeEach(() => {
  useAuthStore.setState({
    user: null,
    token: null,
    isAuthenticated: false,
  });
});
```

## Common Patterns

### Resetting Store

```typescript
interface StoreState {
  // ... state
  reset: () => void;
}

export const useStore = create<StoreState>((set) => ({
  // ... state
  reset: () => set({
    // Reset to initial state
    count: 0,
    isLoading: false,
  }),
}));
```

### Combining with tRPC

```typescript
// Use Zustand for UI state
const selectedProduct = useProductStore((state) => state.selectedProduct);

// Use tRPC for server state
const { data: products } = await useTrpc().product.getAll.query();
```

## Vue/Nuxt Specific Considerations

### Reactivity

Zustand stores are not reactive by default in Vue. Use computed properties:

```vue
<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '@/stores/useStore';

const store = useStore;
const count = computed(() => store((state) => state.count));
</script>
```

### SSR (Server-Side Rendering)

For Nuxt SSR, be careful with persistence:

```typescript
// Only use localStorage on client
import { createJSONStorage } from 'zustand/middleware';

const storage = typeof window !== 'undefined' 
  ? createJSONStorage(() => localStorage)
  : undefined;

export const useStore = create<StoreState>()(
  persist(
    (set) => ({ ... }),
    storage ? { name: 'store', storage } : undefined
  )
);
```

## Related Documentation

- [Core Rules](./core-rules.md) - Essential coding standards
- [Component Standards](./component-standards.md) - Component guidelines
- [Zustand Documentation](https://docs.pmnd.rs/zustand) - Official docs

