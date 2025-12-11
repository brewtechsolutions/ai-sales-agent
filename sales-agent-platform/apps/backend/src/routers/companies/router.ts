/**
 * Companies router (Super Admin only)
 * Following rule: tRPC router with proper schemas and services
 */

import { z } from "zod";
import { router } from "../../trpc/trpc";
import { protectedProcedure } from "../../trpc/trpc";
import { requireSuperAdmin } from "../../middleware/role-based-access";
import {
  createCompanySchema,
  updateCompanySchema,
  suspendCompanySchema,
  deleteCompanySchema,
} from "./schemas";
import { companyService } from "./services";

const superAdminProcedure = protectedProcedure.use(requireSuperAdmin);

export const companiesRouter = router({
  /**
   * List all companies (super admin only)
   */
  list: superAdminProcedure.query(async () => {
    return companyService.getAll();
  }),

  /**
   * Get company by ID (super admin only)
   */
  getById: superAdminProcedure
    .input(z.object({ companyId: z.string().uuid() }))
    .query(async ({ input }) => {
      return companyService.getById(input.companyId);
    }),

  /**
   * Create new company (super admin only)
   */
  create: superAdminProcedure
    .input(createCompanySchema)
    .mutation(async ({ input }) => {
      return companyService.create(input);
    }),

  /**
   * Update company (super admin only)
   */
  update: superAdminProcedure
    .input(updateCompanySchema)
    .mutation(async ({ input }) => {
      return companyService.update(input);
    }),

  /**
   * Suspend company (super admin only)
   */
  suspend: superAdminProcedure
    .input(suspendCompanySchema)
    .mutation(async ({ input }) => {
      return companyService.suspend(input);
    }),

  /**
   * Delete company (super admin only)
   */
  delete: superAdminProcedure
    .input(deleteCompanySchema)
    .mutation(async ({ input }) => {
      return companyService.delete(input);
    }),
});

