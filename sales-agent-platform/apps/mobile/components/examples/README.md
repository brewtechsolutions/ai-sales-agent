# tRPC Usage Examples

This directory contains example components demonstrating how to use tRPC from the mobile app to communicate with the backend.

## Overview

The mobile app uses tRPC for type-safe API communication with the backend. All tRPC calls go through the `TRPCProvider` which is set up in the app root.

## Setup

The tRPC client is already configured in `providers/TRPCProvider.tsx`. It:
- Automatically includes authentication tokens from AsyncStorage
- Handles request batching
- Uses superjson for serialization
- Has a 10-second timeout for requests

## Basic Usage Patterns

### 1. Query (GET) - Fetching Data

```tsx
import { useTRPC } from "../../utils/trpc";
import { useQuery } from "@tanstack/react-query";

function MyComponent() {
  const trpc = useTRPC();

  // Fetch data with query
  const { data, isLoading, error } = useQuery(
    trpc.product.getAll.queryOptions({
      page: 1,
      pageSize: 10,
    })
  );

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View>
      {data?.items.map((item) => (
        <Text key={item.id}>{item.name}</Text>
      ))}
    </View>
  );
}
```

### 2. Mutation (POST/PUT/DELETE) - Modifying Data

```tsx
import { useTRPC } from "../../utils/trpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function CreateProductForm() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createMutation = useMutation(
    trpc.product.create.mutationOptions({
      onSuccess: () => {
        // Invalidate and refetch products list
        queryClient.invalidateQueries({ 
          queryKey: ["product", "getAll"] 
        });
        Alert.alert("Success", "Product created!");
      },
      onError: (error) => {
        Alert.alert("Error", error.message);
      },
    })
  );

  const handleSubmit = () => {
    createMutation.mutate({
      name: "New Product",
      price: 99.99,
      stock: 10,
      userId: "user-id",
    });
  };

  return (
    <TouchableOpacity 
      onPress={handleSubmit}
      disabled={createMutation.isPending}
    >
      <Text>
        {createMutation.isPending ? "Creating..." : "Create Product"}
      </Text>
    </TouchableOpacity>
  );
}
```

### 3. Query with Parameters

```tsx
// Single parameter (string)
const { data } = useQuery(
  trpc.product.getById.queryOptions("product-id-123")
);

// Multiple parameters (object)
const { data } = useQuery(
  trpc.product.getAll.queryOptions({
    page: 1,
    pageSize: 20,
    sortBy: "name",
    sortOrder: "asc",
  })
);
```

### 4. Mutation with Error Handling

```tsx
const deleteMutation = useMutation(
  trpc.product.delete.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ["product", "getAll"] 
      });
    },
    onError: (error) => {
      // Handle different error types
      if (error.data?.code === "UNAUTHORIZED") {
        Alert.alert("Error", "You need to log in");
      } else {
        Alert.alert("Error", error.message);
      }
    },
  })
);
```

## Available Backend Routes

### Product Routes (`trpc.product.*`)
- `getAll` - Get paginated products list
- `getById` - Get single product by ID
- `create` - Create new product
- `update` - Update existing product
- `delete` - Delete product
- `getStats` - Get product statistics

### Auth Routes (`trpc.auth.*`)
- `register` - Register new user
- `login` - Login user
- `logout` - Logout user (requires auth)
- `me` - Get current user (requires auth)
- `googleLogin` - Login with Google
- `phoneLogin` - Login with phone number
- `refreshToken` - Refresh authentication token

### User Routes (`trpc.user.*`)
- `getAll` - Get users list
- `getById` - Get user by ID
- `update` - Update user
- `delete` - Delete user

## Best Practices

### 1. Always Invalidate Queries After Mutations

```tsx
onSuccess: () => {
  queryClient.invalidateQueries({ 
    queryKey: ["product", "getAll"] 
  });
}
```

### 2. Handle Loading and Error States

```tsx
const { data, isLoading, error } = useQuery(...);

if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
```

### 3. Use TypeScript for Type Safety

The `AppRouter` type is defined in `types/trpc.ts`. This provides full type safety for all your tRPC calls.

### 4. Optimistic Updates (Advanced)

```tsx
const updateMutation = useMutation(
  trpc.product.update.mutationOptions({
    onMutate: async (newData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ 
        queryKey: ["product", "getAll"] 
      });

      // Snapshot previous value
      const previous = queryClient.getQueryData([
        "product",
        "getAll",
      ]);

      // Optimistically update
      queryClient.setQueryData(
        ["product", "getAll"],
        (old) => ({
          ...old,
          items: old.items.map((item) =>
            item.id === newData.id ? { ...item, ...newData } : item
          ),
        })
      );

      return { previous };
    },
    onError: (err, newData, context) => {
      // Rollback on error
      queryClient.setQueryData(
        ["product", "getAll"],
        context.previous
      );
    },
  })
);
```

## Example Component

See `TRPCSample.tsx` for a complete working example that demonstrates:
- Querying data (products list, stats)
- Creating data (mutation)
- Deleting data (mutation)
- Error handling
- Loading states
- Query invalidation

## Troubleshooting

### "Network request failed"
- Check that `EXPO_PUBLIC_API_URL` is set correctly
- For Android emulator, use `http://10.0.2.2:3000`
- For iOS simulator, use `http://localhost:3000`
- For physical device, use your computer's IP address

### "UNAUTHORIZED" errors
- Make sure you're logged in and the token is stored in AsyncStorage
- Check that the token is being sent in the Authorization header

### Type errors
- Make sure `types/trpc.ts` matches your backend router structure
- Regenerate types if you've updated the backend

## Related Files

- `providers/TRPCProvider.tsx` - tRPC client setup
- `utils/trpc.ts` - tRPC context and hooks
- `types/trpc.ts` - TypeScript types for AppRouter

