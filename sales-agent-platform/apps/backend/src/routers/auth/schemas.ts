import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export const googleLoginSchema = z.object({
  idToken: z.string(),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});

export type GoogleLoginInput = z.infer<typeof googleLoginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;

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
