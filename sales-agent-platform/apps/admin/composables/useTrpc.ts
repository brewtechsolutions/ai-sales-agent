import { createTRPCClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import type { AppRouter } from "../../backend/src/routers";
import { useCookie } from "#app";

/**
 * tRPC Composable
 * 
 * Provides a type-safe tRPC client for making API calls to the backend.
 * Automatically includes authentication token from cookies.
 * 
 * @example
 * ```vue
 * <script setup>
 * const trpc = useTrpc();
 * 
 * // Query example
 * const products = await trpc.product.getAll.query({ page: 1, pageSize: 10 });
 * 
 * // Mutation example
 * await trpc.product.create.mutate({ name: "Product", price: 100, stock: 10 });
 * </script>
 * ```
 */
export const useTrpc = () => {
  const config = useRuntimeConfig();
  const token = useCookie("token");

  const client = createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: `${config.public.apiBase}/trpc`,
        transformer: superjson,
        headers: () => {
          const headers: Record<string, string> = {};
          if (token.value) {
            headers.Authorization = `Bearer ${token.value}`;
          }
          headers["Content-Type"] = "application/json";
          return headers;
        },
      }),
    ],
  });

  return client;
};
