/**
 * Auth0 Composable for Nuxt
 * 
 * Provides Auth0 authentication functionality for the frontend.
 * Handles Google OAuth and Email/Password login via Auth0.
 * 
 * Environment Variables Required:
 * - AUTH0_DOMAIN: Your Auth0 domain
 * - AUTH0_CLIENT_ID: Your Auth0 application client ID
 * - AUTH0_AUDIENCE: Optional API audience
 */

import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useTrpc } from "~/composables/useTrpc";
import { useCookie } from "#app";

interface Auth0Config {
  domain: string;
  clientId: string;
  audience?: string;
  redirectUri: string;
}

/**
 * Get Auth0 configuration from runtime config
 */
function getAuth0Config(): Auth0Config | null {
  const config = useRuntimeConfig();
  
  const domain = config.public.auth0Domain;
  const clientId = config.public.auth0ClientId;
  const audience = config.public.auth0Audience;
  
  if (!domain || !clientId) {
    console.warn("Auth0 not configured. Please set AUTH0_DOMAIN and AUTH0_CLIENT_ID in .env");
    return null;
  }

  // Get current origin for redirect URI
  // Priority: 1. Explicit config, 2. Browser origin, 3. Default localhost
  const configRedirectUri = config.public.auth0RedirectUri;
  const redirectUri = configRedirectUri || (typeof window !== "undefined" 
    ? `${window.location.origin}/auth/callback`
    : "http://localhost:5173/auth/callback");

  return {
    domain,
    clientId,
    audience,
    redirectUri,
  };
}

/**
 * Auth0 Composable
 * 
 * Provides methods for:
 * - Google OAuth login
 * - Email/Password login
 * - Token management
 * - User session management
 */
export const useAuth0 = () => {
  const router = useRouter();
  const client = useTrpc();
  const config = getAuth0Config();
  const token = useCookie("token");
  const refreshTokenCookie = useCookie("refreshToken");
  const loading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Login with Google OAuth via Auth0
   */
  const loginWithGoogle = async () => {
    if (!config) {
      throw new Error("Auth0 not configured");
    }

    try {
      loading.value = true;
      error.value = null;

      // Redirect to Auth0 Google login
      const auth0Url = new URL(`https://${config.domain}/authorize`);
      auth0Url.searchParams.set("response_type", "code");
      auth0Url.searchParams.set("client_id", config.clientId);
      auth0Url.searchParams.set("redirect_uri", config.redirectUri);
      auth0Url.searchParams.set("scope", "openid profile email");
      auth0Url.searchParams.set("connection", "google-oauth2");
      if (config.audience) {
        auth0Url.searchParams.set("audience", config.audience);
      }

      // Store state for CSRF protection
      const state = crypto.randomUUID();
      sessionStorage.setItem("auth0_state", state);
      auth0Url.searchParams.set("state", state);

      // Redirect to Auth0
      window.location.href = auth0Url.toString();
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Google login failed";
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Login with Email/Password via Auth0
   */
  const loginWithEmail = async (email: string, password: string) => {
    if (!config) {
      throw new Error("Auth0 not configured");
    }

    try {
      loading.value = true;
      error.value = null;

      // Use Auth0's password grant
      const response = await fetch(`https://${config.domain}/oauth/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grant_type: "password",
          username: email,
          password: password,
          client_id: config.clientId,
          connection: "Username-Password-Authentication",
          scope: "openid profile email",
          ...(config.audience && { audience: config.audience }),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error_description || "Invalid email or password");
      }

      const authResult = await response.json();
      const { access_token } = authResult;

      if (!access_token) {
        throw new Error("No access token received from Auth0");
      }

      // Send access token to backend for verification and user sync
      // Create input object explicitly to ensure proper serialization
      const input = { accessToken: String(access_token) };
      console.log("Email login - calling backend with:", { 
        hasInput: !!input, 
        hasAccessToken: !!input.accessToken,
        inputStringified: JSON.stringify(input)
      });
      
      const backendResponse = await client.auth.googleLogin.mutate(input as { accessToken: string });
      
      if (!backendResponse || !backendResponse.token) {
        throw new Error("Backend did not return authentication tokens");
      }

      // Store tokens (single login enforcement - new login revokes old session)
      token.value = backendResponse.token;
      const refreshTokenCookieToStore = useCookie("refreshToken", {
        maxAge: 60 * 60 * 24 * 400, // 400 days
        sameSite: "lax",
        secure: true,
      });
      refreshTokenCookieToStore.value = backendResponse.refreshToken;

      return backendResponse.user;
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Login failed";
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Register with Email/Password via Auth0
   */
  const registerWithEmail = async (name: string, email: string, password: string) => {
    if (!config) {
      throw new Error("Auth0 not configured");
    }

    try {
      loading.value = true;
      error.value = null;

      // Use Auth0's signup endpoint
      const response = await fetch(`https://${config.domain}/dbconnections/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: config.clientId,
          email,
          password,
          name,
          connection: "Username-Password-Authentication",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.description || "Registration failed");
      }

      // After signup, login automatically
      return await loginWithEmail(email, password);
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Registration failed";
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Handle Auth0 callback (after OAuth redirect)
   */
  const handleCallback = async (code: string, state: string) => {
    if (!config) {
      throw new Error("Auth0 not configured");
    }

    try {
      loading.value = true;
      error.value = null;

      // Verify state (CSRF protection)
      const storedState = sessionStorage.getItem("auth0_state");
      if (state !== storedState) {
        throw new Error("Invalid state parameter");
      }
      sessionStorage.removeItem("auth0_state");

      // Exchange code for access token
      const response = await fetch(`https://${config.domain}/oauth/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grant_type: "authorization_code",
          client_id: config.clientId,
          code,
          redirect_uri: config.redirectUri,
          ...(config.audience && { audience: config.audience }),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Auth0 token exchange error:", errorData);
        throw new Error(errorData.error_description || errorData.error || "Failed to exchange code for token");
      }

      const authResult = await response.json();
      console.log("Auth0 token response received");
      
      const { access_token } = authResult;

      if (!access_token) {
        console.error("Auth0 response missing access_token:", authResult);
        throw new Error("No access token received from Auth0");
      }

      // Send access token to backend for verification and user sync
      console.log("Sending access token to backend...", { hasAccessToken: !!access_token, accessTokenLength: access_token?.length });
      
      if (!client || !client.auth || !client.auth.googleLogin) {
        throw new Error("tRPC client not properly initialized");
      }
      
      // Ensure accessToken is a string
      if (typeof access_token !== 'string' || access_token.length === 0) {
        throw new Error(`Invalid access token: expected string, got ${typeof access_token}`);
      }
      
      // Ensure input is properly formatted as an object
      const input = { accessToken: String(access_token) };
      console.log("Calling backend with input:", { 
        input, 
        hasAccessToken: !!input.accessToken,
        accessTokenType: typeof input.accessToken,
        accessTokenLength: input.accessToken.length,
        inputStringified: JSON.stringify(input)
      });
      
      // Call mutation with explicit input object
      const backendResponse = await client.auth.googleLogin.mutate(input as { accessToken: string });
      
      if (!backendResponse || !backendResponse.token) {
        throw new Error("Backend did not return authentication tokens");
      }
      
      console.log("Backend authentication successful");

      // Store tokens (single login enforcement - new login revokes old session)
      token.value = backendResponse.token;
      const refreshTokenCookieToStore = useCookie("refreshToken", {
        maxAge: 60 * 60 * 24 * 400, // 400 days
        sameSite: "lax",
        secure: true,
      });
      refreshTokenCookieToStore.value = backendResponse.refreshToken;

      return backendResponse.user;
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Callback handling failed";
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Refresh access token using refresh token
   */
  const refreshAccessToken = async () => {
    if (!refreshTokenCookie.value) {
      throw new Error("No refresh token available");
    }

    try {
      const response = await client.auth.refreshToken.mutate({
        refreshToken: refreshTokenCookie.value,
      });

      token.value = response.token;
      refreshTokenCookie.value = response.refreshToken;

      return response.token;
    } catch (e) {
      // Refresh failed - clear tokens and redirect to login
      token.value = null;
      refreshTokenCookie.value = null;
      throw e;
    }
  };

  /**
   * Check if Auth0 is configured
   */
  const isConfigured = computed(() => config !== null);

  return {
    loading,
    error,
    isConfigured,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    handleCallback,
    refreshAccessToken,
  };
};

