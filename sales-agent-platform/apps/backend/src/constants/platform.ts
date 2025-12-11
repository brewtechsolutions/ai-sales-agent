/**
 * Platform-related constants
 */

export enum Platform {
  WHATSAPP = "whatsapp",
  TELEGRAM = "telegram",
}

export const WEBHOOK_PATHS = {
  WHATSAPP: "/webhook/:companyId/whatsapp",
  TELEGRAM: "/webhook/:companyId/telegram",
} as const;

