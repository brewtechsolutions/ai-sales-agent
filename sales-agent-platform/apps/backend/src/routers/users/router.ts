/**
 * Users router (Company Admin only)
 * Updated for multi-tenant architecture
 */

import { z } from "zod";
import { router } from "../../trpc/trpc";
import { companyProcedure } from "../../trpc/trpc";
import { requireCompanyAdmin } from "../../middleware/role-based-access";
import { userService } from "./services";
import { createUserSchema, updateUserSchema } from "./schemas";

const adminProcedure = companyProcedure.use(requireCompanyAdmin);

export const userRouter = router({
  /**
   * List all users in company
   */
  list: adminProcedure.query(async ({ ctx }) => {
    if (!ctx.companyId) {
      throw new Error("Company ID required");
    }
    return userService.getAll(ctx.companyId);
  }),

  /**
   * Get user by ID
   */
  getById: adminProcedure
    .input(z.string().uuid())
    .query(async ({ ctx, input }) => {
      if (!ctx.companyId) {
        throw new Error("Company ID required");
      }
      return userService.getById(input, ctx.companyId);
    }),

  /**
   * Create user (agent or admin)
   */
  create: adminProcedure
    .input(createUserSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.companyId) {
        throw new Error("Company ID required");
      }
      return userService.create(input, ctx.companyId);
    }),

  /**
   * Update user
   */
  update: adminProcedure
    .input(updateUserSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.companyId) {
        throw new Error("Company ID required");
      }
      return userService.update(input, ctx.companyId);
    }),

  /**
   * Delete user
   */
  delete: adminProcedure
    .input(z.string().uuid())
    .mutation(async ({ ctx, input }) => {
      if (!ctx.companyId) {
        throw new Error("Company ID required");
      }

      // Don't allow deleting yourself
      if (input === ctx.user?.id) {
        throw new Error("Cannot delete yourself");
      }

      return userService.delete(input, ctx.companyId);
    }),

  /**
   * Get user performance metrics
   */
  getPerformance: adminProcedure
    .input(z.string().uuid())
    .query(async ({ ctx, input }) => {
      if (!ctx.companyId) {
        throw new Error("Company ID required");
      }
      return userService.getPerformance(input, ctx.companyId);
    }),
});
