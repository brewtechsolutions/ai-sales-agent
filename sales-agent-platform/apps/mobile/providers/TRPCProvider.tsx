import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import React, { useState } from "react";
import { trpcContext } from "../utils/trpc";
import superjson from "superjson";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AppRouter } from "../types/trpc";
import { router } from "expo-router";

type AppProps = {
  children?: React.ReactNode;
};

function makeQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: async (error: unknown) => {
        const err = error as { data?: { httpStatus?: number }; shape?: { code?: number }; message?: string };
        if (err?.data?.httpStatus === 401 || err?.shape?.code === -32001 || err?.message?.includes("UNAUTHORIZED")) {
          await AsyncStorage.multiRemove(["auth_token", "auth_token_expiry", "refresh_token"]);
          router.replace("/(app)/login");
        }
      },
    }),
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
        retry: (failureCount, error: unknown) => {
          const err = error as { data?: { httpStatus?: number } };
          // Don't retry on 401s
          if (err?.data?.httpStatus === 401) return false;
          return failureCount < 3;
        },
      },
    },
  });
}
let browserQueryClient: QueryClient | undefined = undefined;
function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export function TRPCProvider({ children }: AppProps) {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() => {
    // Get API URL from environment or use default
    const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? "http://10.0.2.2:3000";
    
    return createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          url: `${apiUrl}/trpc`,
          transformer: superjson,
          headers: async () => {
            const headers: Record<string, string> = {};
            try {
              let token = await AsyncStorage.getItem("auth_token");
              const expiryStr = await AsyncStorage.getItem("auth_token_expiry");
              const refreshToken = await AsyncStorage.getItem("refresh_token");

              // Check if token is expired
              if (token && expiryStr && refreshToken) {
                const expiry = parseInt(expiryStr, 10);
                if (Date.now() > expiry) {
                  console.log("Token expired, attempting refresh...");
                  try {
                    // Perform refresh via raw fetch to avoid circular dependency
                    const refreshResponse = await fetch(`${apiUrl}/trpc/auth.refreshToken`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        json: { refreshToken },
                      }),
                    });

                    if (!refreshResponse.ok) {
                      throw new Error("Refresh failed");
                    }

                    const responseData = await refreshResponse.json();
                    // Parse TRPC response (assuming superjson)
                    const newTokens = responseData.result.data.json;

                    if (newTokens && newTokens.token) {
                      console.log("Token refreshed successfully");
                      token = newTokens.token;
                      await AsyncStorage.setItem("auth_token", newTokens.token);
                      
                      // Update expiry
                      const newExpiry = Date.now() + 15 * 60 * 1000 - 30000;
                      await AsyncStorage.setItem("auth_token_expiry", newExpiry.toString());

                      if (newTokens.refreshToken) {
                        await AsyncStorage.setItem("refresh_token", newTokens.refreshToken);
                      }
                    }
                  } catch (refreshError) {
                    console.warn("Token refresh failed, logging out:", refreshError);
                    // Clear tokens to force logout
                    await AsyncStorage.multiRemove(["auth_token", "auth_token_expiry", "refresh_token"]);
                    token = null;
                  }
                }
              }

              if (token) {
                headers.Authorization = `Bearer ${token}`;
              }
            } catch (error) {
              console.warn("Failed to get auth token:", error);
            }
            return headers;
          },
        }),
      ],
    });
  });
  return (
    <QueryClientProvider client={queryClient}>
      <trpcContext.TRPCProvider
        trpcClient={trpcClient}
        queryClient={queryClient}
      >
        {children}
      </trpcContext.TRPCProvider>
    </QueryClientProvider>
  );
}
