import { z } from "zod";

// ============================================
// Auth0 Authentication Schemas
// ============================================

// Email/Password Registration
export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export type RegisterInput = z.infer<typeof registerSchema>;

// Email/Password Login
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Google OAuth Login (via Auth0)
export const googleLoginSchema = z.object({
  accessToken: z.string(), // Auth0 access token from Google OAuth
});

export type GoogleLoginInput = z.infer<typeof googleLoginSchema>;

// Setup password for Google user
export const setupPasswordSchema = z.object({
  password: z.string().min(8),
});

export type SetupPasswordInput = z.infer<typeof setupPasswordSchema>;

// Link accounts (for duplicate email scenarios)
export const linkAccountSchema = z.object({
  primaryAuth0Id: z.string(), // The Auth0 ID to keep
  secondaryAuth0Id: z.string(), // The Auth0 ID to link
});

export type LinkAccountInput = z.infer<typeof linkAccountSchema>;

// Select portal/role
export const selectPortalSchema = z.object({
  role: z.enum(["super_admin", "company_admin", "company_user"]),
});

export type SelectPortalInput = z.infer<typeof selectPortalSchema>;

// Refresh Token
export const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});

export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;

// ============================================
// Legacy Firebase Schemas (for migration period)
// ============================================

export const phoneLoginSchema = z.object({
  idToken: z.string(),
  name: z.string().optional(),
});

export type PhoneLoginInput = z.infer<typeof phoneLoginSchema>;

export const firebaseLoginSchema = z.object({
  idToken: z.string(),
});

export const firebaseRegisterSchema = z.object({
  idToken: z.string(),
  name: z.string().min(2),
});

export type FirebaseLoginInput = z.infer<typeof firebaseLoginSchema>;
export type FirebaseRegisterInput = z.infer<typeof firebaseRegisterSchema>;
