/**
 * Telegram webhook handler
 * Uses company's own bot token for receiving messages
 */

import { Request, Response } from "express";
import { prisma } from "../prisma";
import { decryptCredential } from "../utils/encryption";
import crypto from "crypto";
import { ConversationStatus, BehaviorScoreColor } from "../constants/conversation";
import { calculateBehaviorScore, getScoreColor } from "../utils/behavior-scoring";
import { Platform } from "../constants/platform";

/**
 * Verify webhook signature using company's webhook secret
 */
function verifyWebhookSignature(
  body: string,
  signature: string | undefined,
  secret: string
): boolean {
  if (!signature) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

/**
 * Determine conversation assignment based on company settings
 */
async function determineAssignment(
  companyId: string
): Promise<string | null> {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: {
      companySettings: true,
    },
  });

  if (!company?.companySettings?.autoAssignEnabled) {
    return null; // Manual assignment
  }

  const strategy = company.companySettings.assignmentStrategy;

  if (strategy === "round_robin") {
    // Find agent with least assigned conversations
    const agents = await prisma.user.findMany({
      where: {
        companyId,
        role: "company_user",
        status: "active",
      },
    });

    if (agents.length === 0) {
      return null;
    }

    // Get workload for each agent
    const workloads = await Promise.all(
      agents.map(async (agent) => {
        const count = await prisma.conversation.count({
          where: {
            assignedTo: agent.id,
            status: {
              in: [ConversationStatus.IN_PROGRESS, ConversationStatus.WAITING],
            },
          },
        });
        return { userId: agent.id, count };
      })
    );

    workloads.sort((a, b) => a.count - b.count);
    return workloads[0]?.userId || null;
  }

  // Manual assignment
  return null;
}

/**
 * Handle incoming Telegram message
 */
export async function handleTelegramWebhook(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { companyId } = req.params;
    const rawBody = JSON.stringify(req.body);

    // Get company and integration credentials
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        integrations: true,
      },
    });

    if (!company) {
      res.status(404).json({ error: "Company not found" });
      return;
    }

    if (!company.integrations) {
      res.status(400).json({ error: "Telegram integration not configured" });
      return;
    }

    // Verify webhook signature
    const webhookSecret = company.integrations.telegramWebhookSecret;
    if (webhookSecret) {
      const signature = req.headers["x-telegram-bot-api-secret-token"] as string | undefined;
      if (!verifyWebhookSignature(rawBody, signature, webhookSecret)) {
        res.status(401).json({ error: "Invalid signature" });
        return;
      }
    }

    // Parse Telegram webhook payload
    const update = req.body;
    const message = update.message;

    if (!message) {
      res.status(200).json({ ok: true }); // Not a message update
      return;
    }

    const chatId = message.chat.id.toString();
    const from = message.from;
    const text = message.text || "";
    const timestamp = message.date ? new Date(message.date * 1000) : new Date();

    if (!text) {
      res.status(200).json({ ok: true }); // No text content
      return;
    }

    // Find or create contact
    let contact = await prisma.contact.findFirst({
      where: {
        companyId,
        platformId: chatId,
        platform: Platform.TELEGRAM,
      },
    });

    if (!contact) {
      contact = await prisma.contact.create({
        data: {
          companyId,
          name: from?.first_name || from?.username || chatId,
          phone: from?.username || chatId,
          email: from?.username ? `${from.username}@telegram` : undefined,
          platform: Platform.TELEGRAM,
          platformId: chatId,
          behaviorScore: 50,
          scoreColor: BehaviorScoreColor.YELLOW,
        },
      });
    }

    // Find or create conversation
    let conversation = await prisma.conversation.findFirst({
      where: {
        contactId: contact.id,
        status: {
          in: [
            ConversationStatus.NEW,
            ConversationStatus.IN_PROGRESS,
            ConversationStatus.WAITING,
          ],
        },
      },
    });

    if (!conversation) {
      // Check assignment rules
      const assignTo = await determineAssignment(companyId);

      conversation = await prisma.conversation.create({
        data: {
          companyId,
          contactId: contact.id,
          assignedTo: assignTo,
          assignedBy: assignTo ? undefined : null,
          status: assignTo
            ? ConversationStatus.IN_PROGRESS
            : ConversationStatus.NEW,
        },
      });

      // Log assignment if auto-assigned
      if (assignTo) {
        await prisma.conversationAssignment.create({
          data: {
            conversationId: conversation.id,
            toUserId: assignTo,
            assignedBy: assignTo,
            reason: "Auto-assigned via round-robin",
          },
        });
      }
    }

    // Store message
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        content: text,
        senderType: "contact",
        timestamp,
      },
    });

    // Update contact stats
    await prisma.contact.update({
      where: { id: contact.id },
      data: {
        lastInteraction: new Date(),
        totalMessages: { increment: 1 },
      },
    });

    // Update behavior score (every 3 messages)
    if (contact.totalMessages % 3 === 0) {
      const recentMessages = await prisma.message.findMany({
        where: { conversationId: conversation.id },
        take: 10,
        orderBy: { timestamp: "desc" },
      });

      const score = calculateBehaviorScore(contact, recentMessages);
      const color = getScoreColor(score);

      await prisma.contact.update({
        where: { id: contact.id },
        data: {
          behaviorScore: score,
          scoreColor: color,
        },
      });

      // Notify if became hot lead
      if (color === BehaviorScoreColor.GREEN && contact.scoreColor !== BehaviorScoreColor.GREEN) {
        // TODO: Send notification to assigned agent and admins
      }
    }

    // TODO: Trigger AI response if no agent assigned or auto-response enabled

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Telegram webhook error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

