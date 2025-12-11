/**
 * Learning from Successful Conversations Service
 * Analyzes successful sales conversations and extracts patterns
 */

import { prisma } from "../prisma";
import { calculateEffectivenessScore } from "../utils/rlhf";

/**
 * Learn from a successful conversation
 */
export async function learnFromSuccessfulConversation(conversationId: string): Promise<void> {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      messages: {
        orderBy: { timestamp: "asc" },
      },
      contact: true,
      company: true,
    },
  });

  if (!conversation || !conversation.isSuccess) {
    return;
  }

  // Analyze conversation with Claude (or use pattern extraction)
  const pattern = await analyzeConversationPattern(conversation);

  // Calculate effectiveness score
  const effectivenessScore = calculateEffectivenessScore(conversation);

  // Store pattern
  await prisma.successfulPattern.create({
    data: {
      companyId: conversation.companyId,
      conversationId: conversation.id,
      category: pattern.patternType,
      patternSummary: pattern.summary,
      keyMessages: pattern.keyMessages,
      outcomeData: {
        saleAmount: conversation.saleAmount,
        productsSold: conversation.productsSold,
        timeToClose: pattern.timeToClose,
        objectionHandling: pattern.objectionHandling,
        closingTechnique: pattern.closingTechnique,
      },
      effectivenessScore,
      usedForTraining: true,
    },
  });

  // Update company knowledge base
  await prisma.aIKnowledgeBase.upsert({
    where: {
      companyId_topic: {
        companyId: conversation.companyId,
        topic: pattern.patternType,
      },
    },
    update: {
      content: `${pattern.summary}\n\nKey approach: ${pattern.closingTechnique}`,
      lastUpdated: new Date(),
      relevanceScore: effectivenessScore,
    },
    create: {
      companyId: conversation.companyId,
      topic: pattern.patternType,
      content: pattern.summary,
      source: "successful_conversation",
      relevanceScore: effectivenessScore,
    },
  });
}

/**
 * Analyze conversation pattern (simplified - can be enhanced with Claude API)
 */
async function analyzeConversationPattern(conversation: any): Promise<any> {
  const messages = conversation.messages || [];
  const customerMessages = messages.filter((m: any) => m.senderType === "contact");
  const agentMessages = messages.filter((m: any) => m.senderType === "agent");

  // Calculate time to close
  const timeToClose = messages.length > 0
    ? (new Date(messages[messages.length - 1].timestamp).getTime() -
        new Date(messages[0].timestamp).getTime()) /
      60000 // minutes
    : 0;

  // Extract key messages (simplified)
  const keyMessages = agentMessages
    .slice(0, 5)
    .map((m: any) => m.content)
    .filter(Boolean);

  // Detect pattern type (simplified)
  const allText = messages.map((m: any) => m.content).join(" ").toLowerCase();
  let patternType = "general";

  if (allText.includes("price") || allText.includes("discount")) {
    patternType = "price_negotiation";
  } else if (allText.includes("urgent") || allText.includes("asap")) {
    patternType = "urgency_creation";
  } else if (allText.includes("trust") || allText.includes("guarantee")) {
    patternType = "trust_building";
  }

  // Detect objection handling
  const objections = ["expensive", "think", "maybe", "later", "not sure"];
  const objectionHandling = objections.some((obj) => allText.includes(obj))
    ? "Objections were addressed with value proposition"
    : "No major objections encountered";

  // Detect closing technique
  const closingPhrases = ["order", "buy", "purchase", "payment", "checkout"];
  const closingTechnique = closingPhrases.some((phrase) => allText.includes(phrase))
    ? "Direct closing with payment link"
    : "Soft closing with follow-up";

  return {
    summary: `Successful ${patternType} pattern: ${agentMessages.length} agent messages, ${customerMessages.length} customer messages, closed in ${Math.round(timeToClose)} minutes`,
    keyMessages,
    patternType,
    timeToClose: Math.round(timeToClose),
    objectionHandling,
    closingTechnique,
  };
}

/**
 * Batch learn from all successful conversations (weekly job)
 */
export async function learnFromAllSuccessfulConversations(companyId?: string): Promise<void> {
  const where: any = {
    isSuccess: true,
    completedAt: {
      gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // last 7 days
    },
  };

  if (companyId) {
    where.companyId = companyId;
  }

  const successfulConversations = await prisma.conversation.findMany({
    where,
    include: {
      messages: true,
    },
  });

  console.log(`Learning from ${successfulConversations.length} successful conversations`);

  for (const conversation of successfulConversations) {
    try {
      // Check if pattern already extracted
      const existing = await prisma.successfulPattern.findFirst({
        where: {
          conversationId: conversation.id,
        },
      });

      if (!existing) {
        await learnFromSuccessfulConversation(conversation.id);
      }
    } catch (error) {
      console.error(`Error learning from conversation ${conversation.id}:`, error);
    }
  }

  console.log("Learning from successful conversations completed");
}

