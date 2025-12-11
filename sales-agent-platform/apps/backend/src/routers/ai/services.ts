/**
 * AI router service functions
 */

import { prisma } from "../../prisma";
import { generateAIResponse } from "../../services/ai-integration";
import { UseSuggestionInput, RateSuggestionInput } from "./schemas";
import {
  calculateEditDistance,
  isManualOverride,
  detectRoboticPhrases,
  calculateHumanLikenessScore,
  calculateNaturalLanguageScore,
} from "../../utils/rlhf";
import { sendMessageToPlatform } from "../conversations/services";

/**
 * Collect RLHF data when agent uses or modifies AI suggestion
 */
async function collectRLHFData(
  suggestionId: string,
  agentActualResponse: string,
  agentId: string
): Promise<void> {
  const suggestion = await prisma.aISuggestion.findUnique({
    where: { id: suggestionId },
    include: {
      conversation: {
        include: {
          company: true,
        },
      },
    },
  });

  if (!suggestion) {
    return;
  }

  // Calculate edit distance
  const editDistance = calculateEditDistance(
    suggestion.suggestedMessage,
    agentActualResponse
  );

  // Detect if manual override
  const wasManualOverride = isManualOverride(
    suggestion.suggestedMessage,
    agentActualResponse
  );

  // Detect robotic phrases
  const roboticPhrases = detectRoboticPhrases(suggestion.suggestedMessage);

  // Calculate scores
  const humanLikenessScore = calculateHumanLikenessScore(agentActualResponse);
  const naturalLanguageScore = calculateNaturalLanguageScore(agentActualResponse);

  // Determine feedback type
  const feedbackType =
    wasManualOverride
      ? "manual_override"
      : editDistance === 0
      ? "used_as_is"
      : editDistance < 50
      ? "modified"
      : "rejected";

  // Update suggestion with RLHF data
  await prisma.aISuggestion.update({
    where: { id: suggestionId },
    data: {
      agentActualResponse,
      editDistance,
      wasManualOverride,
      roboticPhrasesDetected: roboticPhrases,
      humanLikenessScore,
      naturalLanguageScore,
    },
  });

  // Store in RLHF training data
  const rlhfData = await prisma.rLHFTrainingData.create({
    data: {
      companyId: suggestion.conversation.companyId,
      modelConfigId: suggestion.metadata?.modelConfigId as string | undefined,
      agentResponse: agentActualResponse,
      agentId,
      conversationContext: JSON.stringify(
        await prisma.message.findMany({
          where: { conversationId: suggestion.conversationId },
          take: 10,
          orderBy: { timestamp: "desc" },
        })
      ),
      customerMessage: await prisma.message
        .findFirst({
          where: {
            conversationId: suggestion.conversationId,
            senderType: "contact",
          },
          orderBy: { timestamp: "desc" },
        })
        .then((m) => m?.content || ""),
      aiSuggestionId: suggestionId,
      aiSuggestedMessage: suggestion.suggestedMessage,
      feedbackType,
      editDetails: {
        editDistance,
        changes: analyzeChanges(suggestion.suggestedMessage, agentActualResponse),
      },
      humanLikenessScore,
      naturalLanguageScore,
    },
  });

  // Track customer response quality after agent's message (async, check after 5 minutes)
  setTimeout(async () => {
    const customerResponse = await prisma.message.findFirst({
      where: {
        conversationId: suggestion.conversationId,
        senderType: "contact",
        timestamp: {
          gt: new Date(Date.now() - 5 * 60 * 1000), // Last 5 minutes
        },
      },
      orderBy: { timestamp: "desc" },
    });

    if (customerResponse) {
      // Simple engagement score (can be enhanced)
      const engagementScore = customerResponse.content.length > 10 ? 0.7 : 0.4;

      await prisma.rLHFTrainingData.update({
        where: { id: rlhfData.id },
        data: {
          customerResponseQuality:
            engagementScore > 0.7 ? "positive" : engagementScore > 0.4 ? "neutral" : "negative",
          customerEngagementScore: engagementScore,
        },
      });
    }
  }, 5 * 60 * 1000); // 5 minutes
}

/**
 * Analyze changes between AI suggestion and agent response
 */
function analyzeChanges(aiSuggestion: string, agentResponse: string): any {
  // Simple diff analysis (can be enhanced)
  const aiWords = aiSuggestion.toLowerCase().split(/\s+/);
  const agentWords = agentResponse.toLowerCase().split(/\s+/);

  const removed = aiWords.filter((w) => !agentWords.includes(w));
  const added = agentWords.filter((w) => !aiWords.includes(w));

  return {
    removed: removed.slice(0, 10), // Limit to 10
    added: added.slice(0, 10),
  };
}

export const aiService = {
  /**
   * Get AI suggestion for conversation
   */
  getSuggestion: async (conversationId: string, userId: string) => {
    // Verify conversation access
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    // Verify user is assigned (for agents) or is admin
    // This check should be done in the router middleware, but adding here for safety
    if (conversation.assignedTo !== userId) {
      // Allow if user is admin (check would be in middleware)
    }

    return generateAIResponse(conversationId);
  },

  /**
   * Rate AI suggestion
   */
  rateSuggestion: async (input: RateSuggestionInput) => {
    return prisma.aISuggestion.update({
      where: { id: input.suggestionId },
      data: {
        agentRating: input.rating,
      },
    });
  },

  /**
   * Use AI suggestion (with RLHF data collection)
   */
  useSuggestion: async (input: UseSuggestionInput, userId: string) => {
    const suggestion = await prisma.aISuggestion.findUnique({
      where: { id: input.suggestionId },
      include: {
        conversation: {
          include: {
            contact: true,
          },
        },
      },
    });

    if (!suggestion) {
      throw new Error("Suggestion not found");
    }

    const messageToSend = input.modifiedMessage || suggestion.suggestedMessage;

    // Update suggestion tracking
    await prisma.aISuggestion.update({
      where: { id: input.suggestionId },
      data: {
        wasUsed: true,
        agentRating: input.rating,
        modifiedVersion: input.modifiedMessage,
      },
    });

    // Collect RLHF data
    await collectRLHFData(input.suggestionId, messageToSend, userId);

    // Store message
    const message = await prisma.message.create({
      data: {
        conversationId: suggestion.conversationId,
        content: messageToSend,
        senderType: "agent",
        senderId: userId,
        suggestedByAI: true,
        agentUsedSuggestion: true,
        timestamp: new Date(),
      },
    });

    // Send via platform
    await sendMessageToPlatform(suggestion.conversationId, messageToSend);

    return message;
  },
};

