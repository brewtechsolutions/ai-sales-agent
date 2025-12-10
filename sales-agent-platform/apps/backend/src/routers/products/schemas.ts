import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  price: z.number().positive(),
  stock: z.number().int().min(0),
  image: z.string().optional(),
  userId: z.string(),
});

export const updateProductSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  stock: z.number().int().min(0).optional(),
  image: z.string().optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
