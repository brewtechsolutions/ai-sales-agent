/**
 * Integration service functions
 */

import { prisma } from "../../prisma";
import {
  UpdateWhatsAppCredentialsInput,
  UpdateTelegramCredentialsInput,
  RegenerateWebhookSecretInput,
} from "./schemas";
import {
  encryptCredential,
  decryptCredential,
  generateWebhookSecret,
} from "../../utils/encryption";
import { ConnectionStatus, IntegrationType, CredentialAction } from "../../constants/integration";
import { maskString } from "../../utils/strings";

/**
 * Test OnSend/WhatsApp connection
 */
async function testWhatsAppConnection(
  apiKey: string,
  apiSecret: string
): Promise<{ connected: boolean; error?: string }> {
  try {
    // Test API call to OnSend
    const response = await fetch("https://api.onsend.com/v1/account/status", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "X-API-Secret": apiSecret,
      },
    });

    return {
      connected: response.ok,
      error: response.ok ? undefined : await response.text(),
    };
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Test Telegram bot connection
 */
async function testTelegramConnection(
  botToken: string
): Promise<{ connected: boolean; botInfo?: any; error?: string }> {
  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
    const data = await response.json();

    return {
      connected: data.ok === true,
      botInfo: data.result,
      error: data.ok ? undefined : JSON.stringify(data),
    };
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export const integrationService = {
  /**
   * Get integration credentials (masked)
   */
  get: async (companyId: string) => {
    const integration = await prisma.companyIntegration.findUnique({
      where: { companyId },
    });

    if (!integration) {
      return null;
    }

    // Return masked credentials
    return {
      ...integration,
      onsendApiKeyEncrypted: integration.onsendApiKeyEncrypted
        ? maskString(integration.onsendApiKeyEncrypted)
        : null,
      onsendApiSecretEncrypted: integration.onsendApiSecretEncrypted
        ? maskString(integration.onsendApiSecretEncrypted)
        : null,
      telegramBotTokenEncrypted: integration.telegramBotTokenEncrypted
        ? maskString(integration.telegramBotTokenEncrypted)
        : null,
    };
  },

  /**
   * Update WhatsApp/OnSend credentials
   */
  updateWhatsApp: async (
    companyId: string,
    userId: string,
    input: UpdateWhatsAppCredentialsInput
  ) => {
    // Encrypt credentials
    const encryptedApiKey = encryptCredential(input.apiKey);
    const encryptedApiSecret = encryptCredential(input.apiSecret);

    // Generate webhook secret if not exists
    const existing = await prisma.companyIntegration.findUnique({
      where: { companyId },
    });

    const webhookSecret = existing?.onsendWebhookSecret || generateWebhookSecret();

    // Generate webhook URL
    const baseUrl = process.env.BASE_URL || "https://yourplatform.com";
    const webhookUrl = `${baseUrl}/webhook/${companyId}/whatsapp`;

    // Test connection
    const testResult = await testWhatsAppConnection(input.apiKey, input.apiSecret);

    // Create or update integration
    const integration = await prisma.companyIntegration.upsert({
      where: { companyId },
      create: {
        companyId,
        onsendApiKeyEncrypted: encryptedApiKey,
        onsendApiSecretEncrypted: encryptedApiSecret,
        onsendPhoneNumberId: input.phoneNumberId,
        onsendWebhookSecret: webhookSecret,
        onsendConnectionStatus: testResult.connected
          ? ConnectionStatus.CONNECTED
          : ConnectionStatus.ERROR,
        onsendLastConnectedAt: testResult.connected ? new Date() : null,
        onsendLastError: testResult.error || null,
        whatsappWebhookUrl: webhookUrl,
        createdBy: userId,
        updatedBy: userId,
      },
      update: {
        onsendApiKeyEncrypted: encryptedApiKey,
        onsendApiSecretEncrypted: encryptedApiSecret,
        onsendPhoneNumberId: input.phoneNumberId,
        onsendWebhookSecret: webhookSecret,
        onsendConnectionStatus: testResult.connected
          ? ConnectionStatus.CONNECTED
          : ConnectionStatus.ERROR,
        onsendLastConnectedAt: testResult.connected ? new Date() : null,
        onsendLastError: testResult.error || null,
        whatsappWebhookUrl: webhookUrl,
        updatedBy: userId,
      },
    });

    // Log credential change
    await prisma.integrationCredentialLog.create({
      data: {
        companyId,
        integrationType: IntegrationType.WHATSAPP,
        action: existing ? CredentialAction.UPDATED : CredentialAction.ADDED,
        changedBy: userId,
      },
    });

    return {
      ...integration,
      onsendApiKeyEncrypted: maskString(encryptedApiKey),
      onsendApiSecretEncrypted: maskString(encryptedApiSecret),
      connectionTest: testResult,
    };
  },

  /**
   * Update Telegram credentials
   */
  updateTelegram: async (
    companyId: string,
    userId: string,
    input: UpdateTelegramCredentialsInput
  ) => {
    // Encrypt bot token
    const encryptedToken = encryptCredential(input.botToken);

    // Generate webhook secret if not exists
    const existing = await prisma.companyIntegration.findUnique({
      where: { companyId },
    });

    const webhookSecret = existing?.telegramWebhookSecret || generateWebhookSecret();

    // Generate webhook URL
    const baseUrl = process.env.BASE_URL || "https://yourplatform.com";
    const webhookUrl = `${baseUrl}/webhook/${companyId}/telegram`;

    // Test connection
    const testResult = await testTelegramConnection(input.botToken);

    // Create or update integration
    const integration = await prisma.companyIntegration.upsert({
      where: { companyId },
      create: {
        companyId,
        telegramBotTokenEncrypted: encryptedToken,
        telegramWebhookSecret: webhookSecret,
        telegramConnectionStatus: testResult.connected
          ? ConnectionStatus.CONNECTED
          : ConnectionStatus.ERROR,
        telegramLastConnectedAt: testResult.connected ? new Date() : null,
        telegramLastError: testResult.error || null,
        telegramBotUsername: testResult.botInfo?.username || null,
        telegramWebhookUrl: webhookUrl,
        createdBy: userId,
        updatedBy: userId,
      },
      update: {
        telegramBotTokenEncrypted: encryptedToken,
        telegramWebhookSecret: webhookSecret,
        telegramConnectionStatus: testResult.connected
          ? ConnectionStatus.CONNECTED
          : ConnectionStatus.ERROR,
        telegramLastConnectedAt: testResult.connected ? new Date() : null,
        telegramLastError: testResult.error || null,
        telegramBotUsername: testResult.botInfo?.username || null,
        telegramWebhookUrl: webhookUrl,
        updatedBy: userId,
      },
    });

    // Log credential change
    await prisma.integrationCredentialLog.create({
      data: {
        companyId,
        integrationType: IntegrationType.TELEGRAM,
        action: existing ? CredentialAction.UPDATED : CredentialAction.ADDED,
        changedBy: userId,
      },
    });

    return {
      ...integration,
      telegramBotTokenEncrypted: maskString(encryptedToken),
      connectionTest: testResult,
    };
  },

  /**
   * Test WhatsApp connection
   */
  testWhatsApp: async (companyId: string) => {
    const integration = await prisma.companyIntegration.findUnique({
      where: { companyId },
    });

    if (!integration?.onsendApiKeyEncrypted || !integration.onsendApiSecretEncrypted) {
      throw new Error("WhatsApp credentials not configured");
    }

    const apiKey = decryptCredential(integration.onsendApiKeyEncrypted);
    const apiSecret = decryptCredential(integration.onsendApiSecretEncrypted);

    const testResult = await testWhatsAppConnection(apiKey, apiSecret);

    // Update connection status
    await prisma.companyIntegration.update({
      where: { companyId },
      data: {
        onsendConnectionStatus: testResult.connected
          ? ConnectionStatus.CONNECTED
          : ConnectionStatus.ERROR,
        onsendLastConnectedAt: testResult.connected ? new Date() : null,
        onsendLastError: testResult.error || null,
      },
    });

    return testResult;
  },

  /**
   * Test Telegram connection
   */
  testTelegram: async (companyId: string) => {
    const integration = await prisma.companyIntegration.findUnique({
      where: { companyId },
    });

    if (!integration?.telegramBotTokenEncrypted) {
      throw new Error("Telegram credentials not configured");
    }

    const botToken = decryptCredential(integration.telegramBotTokenEncrypted);
    const testResult = await testTelegramConnection(botToken);

    // Update connection status
    await prisma.companyIntegration.update({
      where: { companyId },
      data: {
        telegramConnectionStatus: testResult.connected
          ? ConnectionStatus.CONNECTED
          : ConnectionStatus.ERROR,
        telegramLastConnectedAt: testResult.connected ? new Date() : null,
        telegramLastError: testResult.error || null,
        telegramBotUsername: testResult.botInfo?.username || null,
      },
    });

    return testResult;
  },

  /**
   * Get webhook URLs
   */
  getWebhookUrls: async (companyId: string) => {
    const integration = await prisma.companyIntegration.findUnique({
      where: { companyId },
      select: {
        whatsappWebhookUrl: true,
        telegramWebhookUrl: true,
        onsendWebhookSecret: true,
        telegramWebhookSecret: true,
      },
    });

    if (!integration) {
      return {
        whatsapp: null,
        telegram: null,
      };
    }

    return {
      whatsapp: {
        url: integration.whatsappWebhookUrl,
        secret: integration.onsendWebhookSecret,
      },
      telegram: {
        url: integration.telegramWebhookUrl,
        secret: integration.telegramWebhookSecret,
      },
    };
  },

  /**
   * Regenerate webhook secret
   */
  regenerateWebhookSecret: async (
    companyId: string,
    userId: string,
    input: RegenerateWebhookSecretInput
  ) => {
    const newSecret = generateWebhookSecret();

    const updateData: any = {};
    if (input.platform === IntegrationType.WHATSAPP) {
      updateData.onsendWebhookSecret = newSecret;
    } else {
      updateData.telegramWebhookSecret = newSecret;
    }

    const integration = await prisma.companyIntegration.update({
      where: { companyId },
      data: {
        ...updateData,
        updatedBy: userId,
      },
    });

    // Log credential change
    await prisma.integrationCredentialLog.create({
      data: {
        companyId,
        integrationType: input.platform,
        action: CredentialAction.REVOKED, // Regenerating is like revoking old secret
        changedBy: userId,
        metadata: {
          action: "regenerate_webhook_secret",
        },
      },
    });

    return {
      secret: newSecret,
      platform: input.platform,
    };
  },

  /**
   * Get connection status
   */
  getConnectionStatus: async (companyId: string) => {
    const integration = await prisma.companyIntegration.findUnique({
      where: { companyId },
      select: {
        onsendConnectionStatus: true,
        onsendLastConnectedAt: true,
        onsendLastError: true,
        telegramConnectionStatus: true,
        telegramLastConnectedAt: true,
        telegramLastError: true,
      },
    });

    if (!integration) {
      return {
        whatsapp: {
          status: ConnectionStatus.DISCONNECTED,
          lastConnectedAt: null,
          lastError: null,
        },
        telegram: {
          status: ConnectionStatus.DISCONNECTED,
          lastConnectedAt: null,
          lastError: null,
        },
      };
    }

    return {
      whatsapp: {
        status: integration.onsendConnectionStatus || ConnectionStatus.DISCONNECTED,
        lastConnectedAt: integration.onsendLastConnectedAt,
        lastError: integration.onsendLastError,
      },
      telegram: {
        status: integration.telegramConnectionStatus || ConnectionStatus.DISCONNECTED,
        lastConnectedAt: integration.telegramLastConnectedAt,
        lastError: integration.telegramLastError,
      },
    };
  },

  /**
   * Get audit log
   */
  getAuditLog: async (companyId: string, limit: number = 50) => {
    return prisma.integrationCredentialLog.findMany({
      where: { companyId },
      include: {
        changedByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });
  },
};

