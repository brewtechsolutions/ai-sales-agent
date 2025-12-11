/**
 * Products router (Company Admin/User)
 * Updated for multi-tenant architecture
 */

import { z } from "zod";
import { router } from "../../trpc/trpc";
import { companyProcedure } from "../../trpc/trpc";
import { requireCompanyAdmin } from "../../middleware/role-based-access";
import { productService } from "./services";
import { createProductSchema, updateProductSchema } from "./schemas";

const adminProcedure = companyProcedure.use(requireCompanyAdmin);

export const productRouter = router({
  /**
   * List products (filtered by company)
   */
  list: companyProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(100).default(10),
        sortBy: z.string().optional(),
        sortOrder: z.enum(["asc", "desc"]).optional(),
        category: z.string().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.companyId) {
        throw new Error("Company ID required");
      }
      return productService.getAll(input, ctx.companyId);
    }),

  /**
   * Get product by ID
   */
  getById: companyProcedure
    .input(z.string().uuid())
    .query(async ({ ctx, input }) => {
      if (!ctx.companyId) {
        throw new Error("Company ID required");
      }
      return productService.getById(input, ctx.companyId);
    }),

  /**
   * Create product (Admin only)
   */
  create: adminProcedure
    .input(createProductSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.companyId) {
        throw new Error("Company ID required");
      }
      return productService.create(input, ctx.companyId);
    }),

  /**
   * Update product (Admin only)
   */
  update: adminProcedure
    .input(updateProductSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.companyId) {
        throw new Error("Company ID required");
      }
      return productService.update(input, ctx.companyId);
    }),

  /**
   * Delete product (Admin only)
   */
  delete: adminProcedure
    .input(z.string().uuid())
    .mutation(async ({ ctx, input }) => {
      if (!ctx.companyId) {
        throw new Error("Company ID required");
      }
      return productService.delete(input, ctx.companyId);
    }),

  /**
   * Get product stats (Admin only)
   */
  getStats: adminProcedure.query(async ({ ctx }) => {
    if (!ctx.companyId) {
      throw new Error("Company ID required");
    }
    return productService.getStats(ctx.companyId);
  }),

  /**
   * Bulk import products (Admin only)
   */
  bulkImport: adminProcedure
    .input(
      z.object({
        products: z.array(createProductSchema),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.companyId) {
        throw new Error("Company ID required");
      }
      return productService.bulkImport(input.products, ctx.companyId);
    }),
});
