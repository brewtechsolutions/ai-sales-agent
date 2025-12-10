import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  password: z.string().min(8),
});

export const updateUserSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  email: z.string().email().optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
