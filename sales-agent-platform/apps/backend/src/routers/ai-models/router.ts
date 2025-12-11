/**
 * AI Model Configuration router (Company Admin only)
 */

import { z } from "zod";
import { router } from "../../trpc/trpc";
import { companyProcedure } from "../../trpc/trpc";
import { requireCompanyAdmin } from "../../middleware/role-based-access";
import { prisma } from "../../prisma";
import {
  createModelVersionSchema,
  updateModelVersionSchema,
  testModelSchema,
  activateModelVersionSchema,
} from "./schemas";
import { aiModelService } from "./services";

const adminProcedure = companyProcedure.use(requireCompanyAdmin);

export const aiModelsRouter = router({
  /**
   * Get active AI model
   */
  getActive: adminProcedure.query(async ({ ctx }) => {
    if (!ctx.companyId) {
      throw new Error("Company ID required");
    }
    return aiModelService.getActive(ctx.companyId);
  }),

  /**
   * List all model versions
   */
  listVersions: adminProcedure.query(async ({ ctx }) => {
    if (!ctx.companyId) {
      throw new Error("Company ID required");
    }
    return aiModelService.listVersions(ctx.companyId);
  }),

  /**
   * Create new model version
   */
  createVersion: adminProcedure
    .input(createModelVersionSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.companyId || !ctx.user?.id) {
        throw new Error("Company ID and User ID required");
      }
      return aiModelService.createVersion(input, ctx.companyId, ctx.user.id);
    }),

  /**
   * Update model version
   */
  updateVersion: adminProcedure
    .input(updateModelVersionSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.companyId) {
        throw new Error("Company ID required");
      }
      return aiModelService.updateVersion(input, ctx.companyId);
    }),

  /**
   * Activate model version
   */
  activateVersion: adminProcedure
    .input(activateModelVersionSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.companyId) {
        throw new Error("Company ID required");
      }
      return aiModelService.activateVersion(input, ctx.companyId);
    }),

  /**
   * Test AI model
   */
  testModel: adminProcedure
    .input(testModelSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.companyId) {
        throw new Error("Company ID required");
      }
      return aiModelService.testModel(input, ctx.companyId);
    }),

  /**
   * Get model performance metrics
   */
  getPerformance: adminProcedure
    .input(
      z.object({
        modelVersionId: z.string().uuid().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.companyId) {
        throw new Error("Company ID required");
      }
      return aiModelService.getPerformance(input.modelVersionId, ctx.companyId);
    }),

  /**
   * List test results
   */
  listTestResults: adminProcedure
    .input(
      z.object({
        modelVersionId: z.string().uuid().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.companyId) {
        throw new Error("Company ID required");
      }
      return aiModelService.listTestResults(input.modelVersionId, ctx.companyId);
    }),

  /**
   * Delete model version
   */
  deleteVersion: adminProcedure
    .input(z.object({ versionId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.companyId) {
        throw new Error("Company ID required");
      }

      // Verify ownership and don't allow deleting active model
      const model = await prisma.aIModelConfig.findFirst({
        where: {
          id: input.versionId,
          companyId: ctx.companyId,
        },
      });

      if (!model) {
        throw new Error("Model version not found");
      }

      if (model.isActive) {
        throw new Error("Cannot delete active model. Activate another version first.");
      }

      return prisma.aIModelConfig.delete({
        where: { id: input.versionId },
      });
    }),
});

