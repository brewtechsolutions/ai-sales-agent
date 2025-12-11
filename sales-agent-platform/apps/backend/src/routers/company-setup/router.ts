/**
 * Company setup/onboarding router (Company Admin only)
 */

import { z } from "zod";
import { router } from "../../trpc/trpc";
import { companyProcedure } from "../../trpc/trpc";
import { requireCompanyAdmin } from "../../middleware/role-based-access";
import {
  completeOnboardingSchema,
  updateLocalizationSchema,
  updateCategorySchema,
  updateBrandVoiceSchema,
} from "./schemas";
import { companySetupService } from "./services";

const adminProcedure = companyProcedure.use(requireCompanyAdmin);

export const companySetupRouter = router({
  /**
   * Complete onboarding wizard
   */
  completeOnboarding: adminProcedure
    .input(completeOnboardingSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.companyId) {
        throw new Error("Company ID required");
      }
      return companySetupService.completeOnboarding(input, ctx.companyId);
    }),

  /**
   * Get onboarding status
   */
  getOnboardingStatus: adminProcedure.query(async ({ ctx }) => {
    if (!ctx.companyId) {
      throw new Error("Company ID required");
    }
    return companySetupService.getOnboardingStatus(ctx.companyId);
  }),

  /**
   * Update localization settings
   */
  updateLocalization: adminProcedure
    .input(updateLocalizationSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.companyId) {
        throw new Error("Company ID required");
      }
      return companySetupService.updateLocalization(input, ctx.companyId);
    }),

  /**
   * Update industry category
   */
  updateCategory: adminProcedure
    .input(updateCategorySchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.companyId) {
        throw new Error("Company ID required");
      }
      return companySetupService.updateCategory(input, ctx.companyId);
    }),

  /**
   * Update brand voice settings
   */
  updateBrandVoice: adminProcedure
    .input(updateBrandVoiceSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.companyId) {
        throw new Error("Company ID required");
      }
      return companySetupService.updateBrandVoice(input, ctx.companyId);
    }),
});

