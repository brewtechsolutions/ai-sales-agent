import { ManagementClient, AuthenticationClient } from "auth0";

/**
 * Auth0 Configuration (Free Tier Compatible)
 * 
 * This module initializes Auth0 for token verification only.
 * Frontend handles all authentication (signup, login, Google OAuth).
 * Backend only verifies Auth0 access tokens.
 * 
 * Environment Variables Required:
 * - AUTH0_DOMAIN: Your Auth0 domain (e.g., your-tenant.auth0.com)
 * 
 * Optional (for Management API operations if needed):
 * - AUTH0_CLIENT_ID: Regular Web Application Client ID
 * - AUTH0_CLIENT_SECRET: Regular Web Application Client Secret
 * - AUTH0_M2M_CLIENT_ID: Machine-to-Machine Client ID (only if using Management API)
 * - AUTH0_M2M_CLIENT_SECRET: Machine-to-Machine Client Secret (only if using Management API)
 * - AUTH0_AUDIENCE: API Audience (only if using Management API)
 */

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
// Optional: M2M credentials for Management API (only needed for advanced operations)
const AUTH0_M2M_CLIENT_ID = process.env.AUTH0_M2M_CLIENT_ID;
const AUTH0_M2M_CLIENT_SECRET = process.env.AUTH0_M2M_CLIENT_SECRET;
const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE || (AUTH0_DOMAIN ? `https://${AUTH0_DOMAIN}/api/v2/` : undefined);
const AUTH0_CONNECTION_GOOGLE = process.env.AUTH0_CONNECTION_GOOGLE || "google-oauth2";
const AUTH0_CONNECTION_EMAIL = process.env.AUTH0_CONNECTION_EMAIL || "Username-Password-Authentication";

// Auth0 Management API Client (OPTIONAL - only needed for backend user creation/updates)
// For free tier, frontend handles signup/login, so this is optional
export const auth0Management = AUTH0_DOMAIN && AUTH0_M2M_CLIENT_ID && AUTH0_M2M_CLIENT_SECRET && AUTH0_AUDIENCE
  ? new ManagementClient({
      domain: AUTH0_DOMAIN,
      clientId: AUTH0_M2M_CLIENT_ID,
      clientSecret: AUTH0_M2M_CLIENT_SECRET,
      audience: AUTH0_AUDIENCE,
    })
  : null;

// Auth0 Authentication API Client (OPTIONAL - only needed for password grant)
// For free tier, frontend handles authentication, so this is optional
export const auth0Authentication = AUTH0_DOMAIN && AUTH0_CLIENT_ID
  ? new AuthenticationClient({
      domain: AUTH0_DOMAIN,
      clientId: AUTH0_CLIENT_ID,
    })
  : null;

// Connection names
export const AUTH0_CONNECTIONS = {
  GOOGLE: AUTH0_CONNECTION_GOOGLE,
  EMAIL: AUTH0_CONNECTION_EMAIL,
} as const;

/**
 * Check if Auth0 is properly configured
 * For free tier, only AUTH0_DOMAIN is required (for token verification)
 * Management API is optional (only needed for backend user operations)
 */
export const isAuth0Configured = (): boolean => {
  // Minimum requirement: AUTH0_DOMAIN for token verification
  return !!AUTH0_DOMAIN;
};

/**
 * Check if Management API is available (optional, for advanced operations)
 */
export const isManagementApiAvailable = (): boolean => {
  return !!(auth0Management && AUTH0_M2M_CLIENT_ID && AUTH0_M2M_CLIENT_SECRET);
};

/**
 * Get Auth0 user ID from token
 * Auth0 tokens contain a 'sub' claim in the format: "auth0|user_id" or "google-oauth2|user_id"
 */
export const getAuth0UserId = (sub: string): string => {
  // Extract the user ID from the sub claim
  // Format: "connection|user_id" or "auth0|user_id"
  const parts = sub.split("|");
  return parts.length > 1 ? parts[1] : sub;
};

/**
 * Get connection name from Auth0 sub claim
 */
export const getConnectionFromSub = (sub: string): string => {
  const parts = sub.split("|");
  return parts[0] || "unknown";
};

