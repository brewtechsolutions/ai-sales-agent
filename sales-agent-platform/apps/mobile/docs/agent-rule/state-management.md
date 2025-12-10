# State Management with Zustand

## Overview

The mobile app uses **Zustand** for global state management. Zustand is a lightweight, performant state management library that's perfect for React Native.

## Why Zustand?

- ✅ **Lightweight** - Small bundle size
- ✅ **Simple API** - Easy to learn and use
- ✅ **TypeScript Support** - Full type safety
- ✅ **No Boilerplate** - Less code than Redux
- ✅ **Performance** - Only re-renders when needed
- ✅ **React Native Compatible** - Works great with RN

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

### Basic Store Template

```tsx
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

## Usage in Components

### Basic Usage

```tsx
import { useStore } from '@/stores/useStore';

export const Counter = () => {
  const { count, increment, decrement } = useStore();

  return (
    <View>
      <Text>{count}</Text>
      <Button title="+" onPress={increment} />
      <Button title="-" onPress={decrement} />
    </View>
  );
};
```

### Selective Subscriptions

Only subscribe to specific state to avoid unnecessary re-renders:

```tsx
// ✅ Good - Only re-renders when count changes
const count = useStore((state) => state.count);
const increment = useStore((state) => state.increment);

// ❌ Bad - Re-renders on any state change
const { count, increment } = useStore();
```

### Multiple Selectors

```tsx
// Select multiple values
const { count, isLoading } = useStore((state) => ({
  count: state.count,
  isLoading: state.isLoading,
}));
```

## Store Examples

### Authentication Store

```tsx
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

### Product Store

```tsx
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

## Best Practices

### ✅ Do

1. **Use TypeScript interfaces** for store state:
```tsx
interface StoreState {
  // State and actions
}
```

2. **Select only what you need** to prevent unnecessary re-renders:
```tsx
const count = useStore((state) => state.count);
```

3. **Use persist middleware** for data that should survive app restarts:
```tsx
persist(
  (set) => ({ ... }),
  { name: 'store-name', storage: createJSONStorage(() => AsyncStorage) }
)
```

4. **Keep stores focused** - One store per domain:
```tsx
useAuthStore.ts    // Authentication
useUserStore.ts    // User data
useProductStore.ts // Products
```

5. **Use actions for mutations** - Don't mutate state directly:
```tsx
// ✅ Good
increment: () => set((state) => ({ count: state.count + 1 }))

// ❌ Bad
increment: () => { count++ } // Direct mutation
```

### ❌ Don't

1. **Don't subscribe to entire store** if you only need one value:
```tsx
// ❌ Bad
const { count } = useStore();

// ✅ Good
const count = useStore((state) => state.count);
```

2. **Don't create too many stores** - Group related state:
```tsx
// ❌ Bad - Too granular
useCountStore.ts
useLoadingStore.ts
useErrorStore.ts

// ✅ Good - Grouped
useAppStore.ts // Contains count, loading, error
```

3. **Don't mutate state directly**:
```tsx
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
```tsx
// ❌ Bad - Storing computed value
const totalPrice = useStore((state) => state.totalPrice);

// ✅ Good - Compute in component
const products = useStore((state) => state.products);
const totalPrice = useMemo(() => 
  products.reduce((sum, p) => sum + p.price, 0),
  [products]
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
- ❌ API response cache (use React Query instead)
- ❌ Large datasets

### Persistence Example

```tsx
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Store definition
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
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

```tsx
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

```tsx
export const LoginScreen = () => {
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  
  const handleLogin = async () => {
    await login(email, password);
  };
  
  return (
    <View>
      {error && <Text>{error}</Text>}
      <Button
        title="Login"
        onPress={handleLogin}
        loading={isLoading}
      />
    </View>
  );
};
```

## Testing

### Mock Store for Tests

```tsx
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

### Combining with React Query

```tsx
// Use Zustand for UI state
const selectedProduct = useProductStore((state) => state.selectedProduct);

// Use React Query for server state
const { data: products } = useQuery(trpc.product.getAll.queryOptions());
```

### Resetting Store

```tsx
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

## Related Documentation

- [Core Rules](./core-rules.md) - Essential coding standards
- [Component Standards](./component-standards.md) - Component guidelines
- [Zustand Documentation](https://docs.pmnd.rs/zustand) - Official docs

