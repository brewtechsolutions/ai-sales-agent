import { createTRPCClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import type { AppRouter } from "../../backend/src/routers";
import { useCookie } from "#app";

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
          return headers;
        },
      }),
    ],
  });

  return client;
};
