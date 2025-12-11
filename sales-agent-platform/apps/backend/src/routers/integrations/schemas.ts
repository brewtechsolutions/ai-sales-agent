/**
 * Integration credentials schemas
 */

import { z } from "zod";
import { IntegrationType } from "../../constants/integration";

export const updateWhatsAppCredentialsSchema = z.object({
  apiKey: z.string().min(1),
  apiSecret: z.string().min(1),
  phoneNumberId: z.string().min(1),
});

export const updateTelegramCredentialsSchema = z.object({
  botToken: z.string().min(1),
});

export const regenerateWebhookSecretSchema = z.object({
  platform: z.nativeEnum(IntegrationType),
});

export type UpdateWhatsAppCredentialsInput = z.infer<typeof updateWhatsAppCredentialsSchema>;
export type UpdateTelegramCredentialsInput = z.infer<typeof updateTelegramCredentialsSchema>;
export type RegenerateWebhookSecretInput = z.infer<typeof regenerateWebhookSecretSchema>;

