/**
 * Integration credentials router (Company Admin only)
 */

import { z } from "zod";
import { router } from "../../trpc/trpc";
import { companyProcedure } from "../../trpc/trpc";
import { requireCompanyAdmin } from "../../middleware/role-based-access";
import {
  updateWhatsAppCredentialsSchema,
  updateTelegramCredentialsSchema,
  regenerateWebhookSecretSchema,
} from "./schemas";
import { integrationService } from "./services";
import { IntegrationType } from "../../constants/integration";

const adminProcedure = companyProcedure.use(requireCompanyAdmin);

export const integrationsRouter = router({
  /**
   * Get current integration credentials (masked)
   */
  get: adminProcedure.query(async ({ ctx }) => {
    if (!ctx.companyId) {
      throw new Error("Company ID required");
    }
    return integrationService.get(ctx.companyId);
  }),

  /**
   * Update WhatsApp/OnSend credentials
   */
  updateWhatsApp: adminProcedure
    .input(updateWhatsAppCredentialsSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.companyId || !ctx.user?.id) {
        throw new Error("Company ID and User ID required");
      }
      return integrationService.updateWhatsApp(ctx.companyId, ctx.user.id, input);
    }),

  /**
   * Update Telegram bot credentials
   */
  updateTelegram: adminProcedure
    .input(updateTelegramCredentialsSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.companyId || !ctx.user?.id) {
        throw new Error("Company ID and User ID required");
      }
      return integrationService.updateTelegram(ctx.companyId, ctx.user.id, input);
    }),

  /**
   * Test WhatsApp connection
   */
  testWhatsApp: adminProcedure.mutation(async ({ ctx }) => {
    if (!ctx.companyId) {
      throw new Error("Company ID required");
    }
    return integrationService.testWhatsApp(ctx.companyId);
  }),

  /**
   * Test Telegram connection
   */
  testTelegram: adminProcedure.mutation(async ({ ctx }) => {
    if (!ctx.companyId) {
      throw new Error("Company ID required");
    }
    return integrationService.testTelegram(ctx.companyId);
  }),

  /**
   * Get webhook URLs
   */
  getWebhookUrls: adminProcedure.query(async ({ ctx }) => {
    if (!ctx.companyId) {
      throw new Error("Company ID required");
    }
    return integrationService.getWebhookUrls(ctx.companyId);
  }),

  /**
   * Regenerate webhook secret
   */
  regenerateWebhookSecret: adminProcedure
    .input(regenerateWebhookSecretSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.companyId || !ctx.user?.id) {
        throw new Error("Company ID and User ID required");
      }
      return integrationService.regenerateWebhookSecret(ctx.companyId, ctx.user.id, input);
    }),

  /**
   * Get connection status
   */
  getConnectionStatus: adminProcedure.query(async ({ ctx }) => {
    if (!ctx.companyId) {
      throw new Error("Company ID required");
    }
    return integrationService.getConnectionStatus(ctx.companyId);
  }),

  /**
   * Get credential audit log
   */
  getAuditLog: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.companyId) {
        throw new Error("Company ID required");
      }
      return integrationService.getAuditLog(ctx.companyId, input.limit);
    }),
});

