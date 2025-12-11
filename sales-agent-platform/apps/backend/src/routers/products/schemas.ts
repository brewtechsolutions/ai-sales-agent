/**
 * Product schemas and DTOs
 * Updated for multi-tenant architecture
 */

import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  currency: z.string().length(3).optional().default("MYR"),
  imageUrl: z.string().url().optional(),
  category: z.string().optional(),
  stockStatus: z.enum(["in_stock", "out_of_stock", "limited"]).optional(),
  sku: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  isActive: z.boolean().default(true),
});

export const updateProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  currency: z.string().length(3).optional(),
  imageUrl: z.string().url().optional(),
  category: z.string().optional(),
  stockStatus: z.enum(["in_stock", "out_of_stock", "limited"]).optional(),
  sku: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  isActive: z.boolean().optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
