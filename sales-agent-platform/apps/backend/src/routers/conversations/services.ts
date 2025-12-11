/**
 * Conversation service functions
 */

import { prisma } from "../../prisma";
import {
  AssignConversationInput,
  ReassignConversationInput,
  ListConversationsInput,
  MarkCompleteInput,
  SendMessageInput,
  AddNoteInput,
} from "./schemas";
import { ConversationStatus } from "../../constants/conversation";
import { USER_ROLES } from "../../constants/user";
import { decryptCredential } from "../../utils/encryption";
import { Platform } from "../../constants/platform";

/**
 * Send message via WhatsApp using company credentials
 */
async function sendWhatsAppMessage(
  companyId: string,
  to: string,
  message: string
): Promise<void> {
  const integration = await prisma.companyIntegration.findUnique({
    where: { companyId },
  });

  if (!integration?.onsendApiKeyEncrypted || !integration.onsendApiSecretEncrypted) {
    throw new Error("WhatsApp integration not configured");
  }

  const apiKey = decryptCredential(integration.onsendApiKeyEncrypted);
  const apiSecret = decryptCredential(integration.onsendApiSecretEncrypted);
  const phoneNumberId = integration.onsendPhoneNumberId;

  const response = await fetch("https://api.onsend.com/v1/messages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "X-API-Secret": apiSecret,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phone_number_id: phoneNumberId,
      to,
      message,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    await prisma.companyIntegration.update({
      where: { companyId },
      data: {
        onsendConnectionStatus: "error",
        onsendLastError: error,
      },
    });
    throw new Error(`Failed to send WhatsApp message: ${error}`);
  }

  // Update connection status on success
  await prisma.companyIntegration.update({
    where: { companyId },
    data: {
      onsendConnectionStatus: "connected",
      onsendLastConnectedAt: new Date(),
      onsendLastError: null,
    },
  });
}

/**
 * Send message via Telegram using company credentials
 */
async function sendTelegramMessage(
  companyId: string,
  chatId: string,
  message: string
): Promise<void> {
  const integration = await prisma.companyIntegration.findUnique({
    where: { companyId },
  });

  if (!integration?.telegramBotTokenEncrypted) {
    throw new Error("Telegram integration not configured");
  }

  const botToken = decryptCredential(integration.telegramBotTokenEncrypted);

  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    await prisma.companyIntegration.update({
      where: { companyId },
      data: {
        telegramConnectionStatus: "error",
        telegramLastError: error,
      },
    });
    throw new Error(`Failed to send Telegram message: ${error}`);
  }

  // Update connection status on success
  await prisma.companyIntegration.update({
    where: { companyId },
    data: {
      telegramConnectionStatus: "connected",
      telegramLastConnectedAt: new Date(),
      telegramLastError: null,
    },
  });
}

/**
 * Send message to platform (determines platform from contact)
 */
export async function sendMessageToPlatform(
  conversationId: string,
  message: string
): Promise<void> {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      contact: true,
      company: true,
    },
  });

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  const { contact, company } = conversation;

  if (contact.platform === Platform.WHATSAPP) {
    await sendWhatsAppMessage(company.id, contact.phone || "", message);
  } else if (contact.platform === Platform.TELEGRAM) {
    await sendTelegramMessage(company.id, contact.platformId || "", message);
  } else {
    throw new Error(`Unsupported platform: ${contact.platform}`);
  }
}

export const conversationService = {
  /**
   * List conversations (filtered by role)
   */
  list: async (input: ListConversationsInput, userId: string, userRole: string, companyId: string) => {
    const where: any = {
      companyId,
    };

    // Company users can only see assigned conversations
    if (userRole === USER_ROLES.COMPANY_USER) {
      where.assignedTo = userId;
    }

    // Admins can filter by assignedTo
    if (input.assignedTo) {
      where.assignedTo = input.assignedTo;
    }

    // Filter by status
    if (input.status) {
      where.status = input.status;
    }

    const [conversations, total] = await Promise.all([
      prisma.conversation.findMany({
        where,
        include: {
          contact: true,
          assignedToUser: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          messages: {
            take: 1,
            orderBy: { timestamp: "desc" },
          },
        },
        orderBy: { updatedAt: "desc" },
        take: input.limit,
        skip: input.offset,
      }),
      prisma.conversation.count({ where }),
    ]);

    return {
      conversations,
      total,
      limit: input.limit,
      offset: input.offset,
    };
  },

  /**
   * Get conversation by ID (with access control)
   */
  getById: async (conversationId: string, userId: string, userRole: string, companyId: string) => {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        contact: true,
        assignedToUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        messages: {
          orderBy: { timestamp: "asc" },
        },
        assignments: {
          include: {
            fromUser: {
              select: { id: true, name: true },
            },
            toUser: {
              select: { id: true, name: true },
            },
            assignedByUser: {
              select: { id: true, name: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!conversation || conversation.companyId !== companyId) {
      throw new Error("Conversation not found");
    }

    // Company users can only access assigned conversations
    if (userRole === USER_ROLES.COMPANY_USER && conversation.assignedTo !== userId) {
      throw new Error("Access denied");
    }

    return conversation;
  },

  /**
   * Assign conversation to user (admin only)
   */
  assign: async (input: AssignConversationInput, assignedBy: string, companyId: string) => {
    // Verify conversation belongs to company
    const conversation = await prisma.conversation.findUnique({
      where: { id: input.conversationId },
    });

    if (!conversation || conversation.companyId !== companyId) {
      throw new Error("Conversation not found");
    }

    // Update conversation
    const updated = await prisma.conversation.update({
      where: { id: input.conversationId },
      data: {
        assignedTo: input.userId,
        assignedBy,
        status: ConversationStatus.IN_PROGRESS,
      },
    });

    // Log assignment
    await prisma.conversationAssignment.create({
      data: {
        conversationId: input.conversationId,
        fromUserId: conversation.assignedTo,
        toUserId: input.userId,
        assignedBy,
        reason: input.reason,
      },
    });

    // TODO: Send notification to assigned agent

    return updated;
  },

  /**
   * Reassign conversation (admin only)
   */
  reassign: async (input: ReassignConversationInput, assignedBy: string, companyId: string) => {
    const conversation = await prisma.conversation.findUnique({
      where: { id: input.conversationId },
    });

    if (!conversation || conversation.companyId !== companyId) {
      throw new Error("Conversation not found");
    }

    const updated = await prisma.conversation.update({
      where: { id: input.conversationId },
      data: {
        assignedTo: input.newUserId,
        assignedBy,
      },
    });

    // Log assignment
    await prisma.conversationAssignment.create({
      data: {
        conversationId: input.conversationId,
        fromUserId: conversation.assignedTo,
        toUserId: input.newUserId,
        assignedBy,
        reason: input.reason,
      },
    });

    // TODO: Send notification to new agent

    return updated;
  },

  /**
   * List unassigned conversations (admin only)
   */
  listUnassigned: async (companyId: string) => {
    return prisma.conversation.findMany({
      where: {
        companyId,
        assignedTo: null,
        status: ConversationStatus.NEW,
      },
      include: {
        contact: true,
        messages: {
          take: 1,
          orderBy: { timestamp: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  /**
   * Send message (agent or admin)
   */
  sendMessage: async (input: SendMessageInput, userId: string, userRole: string, companyId: string) => {
    const conversation = await prisma.conversation.findUnique({
      where: { id: input.conversationId },
      include: {
        contact: true,
      },
    });

    if (!conversation || conversation.companyId !== companyId) {
      throw new Error("Conversation not found");
    }

    // Verify access
    if (userRole === USER_ROLES.COMPANY_USER && conversation.assignedTo !== userId) {
      throw new Error("Access denied");
    }

    // Store message
    const message = await prisma.message.create({
      data: {
        conversationId: input.conversationId,
        content: input.message,
        senderType: "agent",
        senderId: userId,
        suggestedByAI: false,
        agentUsedSuggestion: false,
        timestamp: new Date(),
      },
    });

    // Send via platform
    await sendMessageToPlatform(input.conversationId, input.message);

    // TODO: Collect RLHF data if wasAISuggestionAvailable is true

    return message;
  },

  /**
   * Mark conversation as completed/lost (agent only)
   */
  markComplete: async (input: MarkCompleteInput, userId: string, companyId: string) => {
    const conversation = await prisma.conversation.findUnique({
      where: { id: input.conversationId },
    });

    if (!conversation || conversation.companyId !== companyId) {
      throw new Error("Conversation not found");
    }

    if (conversation.assignedTo !== userId) {
      throw new Error("Access denied");
    }

    const isSuccess = input.status === "completed" && (input.saleAmount || 0) > 0;

    const updated = await prisma.conversation.update({
      where: { id: input.conversationId },
      data: {
        status: input.status === "completed" ? ConversationStatus.COMPLETED : ConversationStatus.LOST,
        saleAmount: input.saleAmount,
        productsSold: input.productsSold,
        isSuccess,
        completedAt: new Date(),
        notes: input.notes,
      },
    });

    // TODO: Trigger learning from successful conversation if isSuccess

    return updated;
  },

  /**
   * Add internal note (agent or admin)
   */
  addNote: async (input: AddNoteInput, userId: string, userRole: string, companyId: string) => {
    const conversation = await prisma.conversation.findUnique({
      where: { id: input.conversationId },
    });

    if (!conversation || conversation.companyId !== companyId) {
      throw new Error("Conversation not found");
    }

    // Verify access
    if (userRole === USER_ROLES.COMPANY_USER && conversation.assignedTo !== userId) {
      throw new Error("Access denied");
    }

    // Update notes
    const existingNotes = conversation.notes || "";
    const newNote = `[${new Date().toISOString()}] ${input.note}\n\n${existingNotes}`;

    return prisma.conversation.update({
      where: { id: input.conversationId },
      data: {
        notes: newNote,
      },
    });
  },
};

