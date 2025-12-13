/**
 * Auth Token Refresh Plugin
 * 
 * Automatically refreshes access token when it expires.
 * Implements single login enforcement by using refresh tokens.
 */

export default defineNuxtPlugin(() => {
  const token = useCookie("token");
  const refreshTokenCookie = useCookie("refreshToken");
  const { refreshAccessToken } = useAuth0();
  const client = useTrpc();

  // Function to refresh token
  async function attemptRefresh() {
    if (!refreshTokenCookie.value) {
      return false;
    }

    try {
      const response = await client.auth.refreshToken.mutate({
        refreshToken: refreshTokenCookie.value,
      });

      token.value = response.token;
      refreshTokenCookie.value = response.refreshToken;
      return true;
    } catch (error) {
      // Refresh failed - clear tokens
      token.value = null;
      refreshTokenCookie.value = null;
      return false;
    }
  }

  // Intercept tRPC calls to handle token expiration
  if (import.meta.client) {
    // This will be handled by the tRPC client error handling
    // We'll add a global error handler in useTrpc instead
  }

  return {
    provide: {
      refreshToken: attemptRefresh,
    },
  };
});

