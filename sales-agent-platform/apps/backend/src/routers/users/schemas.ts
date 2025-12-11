/**
 * User schemas and DTOs
 * Updated for multi-tenant architecture
 */

import { z } from "zod";
import { UserStatus, USER_ROLES } from "../../constants/user";

export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(8),
  role: z.enum([USER_ROLES.COMPANY_ADMIN, USER_ROLES.COMPANY_USER]),
  status: z.nativeEnum(UserStatus).default(UserStatus.ACTIVE),
  avatarUrl: z.string().url().optional(),
  metadata: z.record(z.any()).optional(),
});

export const updateUserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  status: z.nativeEnum(UserStatus).optional(),
  avatarUrl: z.string().url().optional(),
  metadata: z.record(z.any()).optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
