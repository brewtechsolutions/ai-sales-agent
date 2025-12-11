/**
 * Success Case Templates router
 * Super Admin: Global templates
 * Company Admin: Company-specific templates and template management
 */

import { z } from "zod";
import { router } from "../../trpc/trpc";
import { protectedProcedure, companyProcedure } from "../../trpc/trpc";
import { requireSuperAdmin, requireCompanyAdmin } from "../../middleware/role-based-access";
import { prisma } from "../../prisma";
import {
  createTemplateSchema,
  updateTemplateSchema,
  enableTemplateSchema,
  setPreferredTemplateSchema,
  setTemplatePrioritySchema,
  customizeTemplateSchema,
  testTemplateSchema,
} from "./schemas";
import { templateService } from "./services";

const superAdminProcedure = protectedProcedure.use(requireSuperAdmin);
const adminProcedure = companyProcedure.use(requireCompanyAdmin);

export const templatesRouter = router({
  /**
   * Super Admin: List all global templates
   */
  listGlobal: superAdminProcedure.query(async () => {
    return templateService.listGlobal();
  }),

  /**
   * Super Admin: Create global template
   */
  createGlobal: superAdminProcedure
    .input(createTemplateSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user?.id) {
        throw new Error("User ID required");
      }
      return templateService.createGlobal(input, ctx.user.id);
    }),

  /**
   * Super Admin: Update global template
   */
  updateGlobal: superAdminProcedure
    .input(updateTemplateSchema)
    .mutation(async ({ input }) => {
      return templateService.update(input);
    }),

  /**
   * Super Admin: Delete global template
   */
  deleteGlobal: superAdminProcedure
    .input(z.object({ templateId: z.string().uuid() }))
    .mutation(async ({ input }) => {
      return prisma.successCaseTemplate.delete({
        where: { id: input.templateId },
      });
    }),

  /**
   * Super Admin: Mark template as recommended
   */
  markRecommended: superAdminProcedure
    .input(z.object({ templateId: z.string().uuid(), isRecommended: z.boolean() }))
    .mutation(async ({ input }) => {
      return prisma.successCaseTemplate.update({
        where: { id: input.templateId },
        data: { isRecommended: input.isRecommended },
      });
    }),

  /**
   * Company Admin: View all global templates
   */
  listGlobalForCompany: adminProcedure.query(async () => {
    return templateService.listGlobal();
  }),

  /**
   * Company Admin: List company-specific templates
   */
  listCompany: adminProcedure.query(async ({ ctx }) => {
    if (!ctx.companyId) {
      throw new Error("Company ID required");
    }
    return templateService.listCompany(ctx.companyId);
  }),

  /**
   * Company Admin: List enabled templates
   */
  listEnabled: adminProcedure.query(async ({ ctx }) => {
    if (!ctx.companyId) {
      throw new Error("Company ID required");
    }
    return templateService.listEnabled(ctx.companyId);
  }),

  /**
   * Company Admin: Enable/disable template
   */
  enable: adminProcedure
    .input(enableTemplateSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.companyId) {
        throw new Error("Company ID required");
      }
      return templateService.enable(input, ctx.companyId);
    }),

  /**
   * Company Admin: Set template as preferred
   */
  setPreferred: adminProcedure
    .input(setPreferredTemplateSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.companyId) {
        throw new Error("Company ID required");
      }
      return templateService.setPreferred(input, ctx.companyId);
    }),

  /**
   * Company Admin: Set template priority
   */
  setPriority: adminProcedure
    .input(setTemplatePrioritySchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.companyId) {
        throw new Error("Company ID required");
      }
      return templateService.setPriority(input, ctx.companyId);
    }),

  /**
   * Company Admin: Create company-specific template
   */
  createCompany: adminProcedure
    .input(createTemplateSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.companyId || !ctx.user?.id) {
        throw new Error("Company ID and User ID required");
      }
      return templateService.createCompany(input, ctx.companyId, ctx.user.id);
    }),

  /**
   * Company Admin: Update company template
   */
  updateCompany: adminProcedure
    .input(updateTemplateSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.companyId) {
        throw new Error("Company ID required");
      }
      return templateService.update(input, ctx.companyId);
    }),

  /**
   * Company Admin: Customize global template for company
   */
  customize: adminProcedure
    .input(customizeTemplateSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.companyId) {
        throw new Error("Company ID required");
      }
      return templateService.customize(input, ctx.companyId);
    }),

  /**
   * Company Admin: Test template matching
   */
  test: adminProcedure
    .input(testTemplateSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.companyId) {
        throw new Error("Company ID required");
      }
      return templateService.test(input, ctx.companyId);
    }),

  /**
   * Company Admin: Get template usage stats
   */
  getUsageStats: adminProcedure
    .input(z.object({ templateId: z.string().uuid().optional() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.companyId) {
        throw new Error("Company ID required");
      }
      return templateService.getUsageStats(
        input.templateId || "",
        ctx.companyId
      );
    }),
});

