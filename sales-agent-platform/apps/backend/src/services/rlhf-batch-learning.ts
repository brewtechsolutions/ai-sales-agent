/**
 * RLHF Batch Learning Service
 * Weekly batch process to learn from human agent feedback
 */

import { prisma } from "../prisma";
import { DEFAULT_AI_CONFIG } from "../constants/ai";

/**
 * Run RLHF training batch for a company
 */
export async function runRLHFTrainingBatch(companyId: string): Promise<void> {
  const aiModel = await prisma.aIModelConfig.findFirst({
    where: {
      companyId,
      isActive: true,
      rlhfEnabled: true,
    },
  });

  if (!aiModel) {
    console.log(`No active RLHF-enabled model found for company ${companyId}`);
    return;
  }

  // Get all RLHF training data from past week (not yet used)
  const trainingData = await prisma.rLHFTrainingData.findMany({
    where: {
      companyId,
      modelConfigId: aiModel.id,
      usedInTraining: false,
      createdAt: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // last 7 days
      },
    },
    include: {
      agent: true,
    },
    orderBy: {
      customerEngagementScore: "desc", // prioritize successful responses
    },
  });

  if (trainingData.length === 0) {
    console.log(`No new RLHF training data for company ${companyId}`);
    return;
  }

  console.log(`Processing ${trainingData.length} RLHF training samples for company ${companyId}`);

  // Analyze patterns
  const humanPatterns = analyzeHumanResponsePatterns(trainingData);
  const rejectedPatterns = analyzeRejectedPatterns(trainingData);
  const topAgentPatterns = await extractTopAgentPatterns(trainingData, companyId);

  // Update system prompt with RLHF learnings
  const updatedSystemPrompt = updateSystemPromptWithRLHF(
    aiModel.systemPrompt || "",
    humanPatterns,
    rejectedPatterns,
    topAgentPatterns
  );

  // Calculate metrics
  const metrics = {
    humanLikenessScore: calculateAverageHumanLikeness(trainingData),
    naturalLanguageScore: calculateAverageNaturalLanguage(trainingData),
    styleConsistency: calculateStyleConsistency(trainingData),
    lastRLHFTraining: new Date(),
    trainingDataCount: trainingData.length,
  };

  // Update model config
  await prisma.aIModelConfig.update({
    where: { id: aiModel.id },
    data: {
      systemPrompt: updatedSystemPrompt,
      rlhfMetrics: metrics,
    },
  });

  // Mark training data as used
  const batchId = `batch-${Date.now()}`;
  await prisma.rLHFTrainingData.updateMany({
    where: {
      id: { in: trainingData.map((t) => t.id) },
    },
    data: {
      usedInTraining: true,
      trainingBatchId: batchId,
    },
  });

  console.log(`RLHF training batch completed for company ${companyId}`);
}

/**
 * Analyze human response patterns
 */
function analyzeHumanResponsePatterns(trainingData: any[]): any {
  // Get responses that agents used with minimal edits (high human-likeness)
  const preferredResponses = trainingData.filter(
    (t) =>
      t.feedbackType === "used_as_is" ||
      (t.feedbackType === "modified" && (t.editDetails?.editDistance || 0) < 20)
  );

  // Extract common phrases
  const commonPhrases = extractCommonPhrases(preferredResponses);
  const sentenceStructure = analyzeSentenceStructure(preferredResponses);
  const tonePatterns = analyzeTonePatterns(preferredResponses);
  const lengthPatterns = analyzeLengthPatterns(preferredResponses);
  const punctuationPatterns = analyzePunctuationPatterns(preferredResponses);

  return {
    commonPhrases,
    sentenceStructure,
    tonePatterns,
    lengthPatterns,
    punctuationPatterns,
  };
}

/**
 * Analyze rejected patterns
 */
function analyzeRejectedPatterns(trainingData: any[]): any {
  const rejected = trainingData.filter(
    (t) => t.feedbackType === "rejected" || t.feedbackType === "manual_override"
  );

  // Find common phrases in rejected AI suggestions
  const rejectedPhrases = extractCommonPhrases(
    rejected.map((t) => ({ agentResponse: t.aiSuggestedMessage }))
  );

  // Find robotic phrases that agents consistently remove
  const roboticPhrases = rejected
    .flatMap((t) => t.roboticPhrasesDetected || [])
    .reduce((acc: Record<string, number>, phrase: string) => {
      acc[phrase] = (acc[phrase] || 0) + 1;
      return acc;
    }, {});

  return {
    rejectedPhrases,
    roboticPhrases,
  };
}

/**
 * Extract patterns from top-performing agents
 */
async function extractTopAgentPatterns(trainingData: any[], companyId: string): Promise<any> {
  // Get top agents by conversion rate
  const agents = await prisma.user.findMany({
    where: {
      companyId,
      role: "company_user",
    },
    include: {
      assignedConversations: {
        where: {
          isSuccess: true,
        },
      },
    },
  });

  const topAgentIds = agents
    .map((a) => ({
      id: a.id,
      conversionRate: a.assignedConversations.length / (a.assignedConversations.length + 10), // simplified
    }))
    .sort((a, b) => b.conversionRate - a.conversionRate)
    .slice(0, 5)
    .map((a) => a.id);

  // Get their response patterns
  const topAgentResponses = trainingData.filter((t) => topAgentIds.includes(t.agentId));

  return {
    preferredPhrases: extractCommonPhrases(topAgentResponses),
    responseStyle: analyzeResponseStyle(topAgentResponses),
  };
}

/**
 * Update system prompt with RLHF learnings
 */
function updateSystemPromptWithRLHF(
  currentPrompt: string,
  humanPatterns: any,
  rejectedPatterns: any,
  topAgentPatterns: any
): string {
  // Remove old RLHF section if exists
  let updatedPrompt = currentPrompt.replace(
    /CRITICAL: Respond naturally like a HUMAN.*?(?=\n\n|\n[A-Z]|$)/s,
    ""
  );

  // Add new RLHF instructions based on learnings
  const rlhfSection = `
CRITICAL: Respond naturally like a HUMAN sales agent, NOT like an AI or robot.

LEARNED FROM HUMAN AGENTS - USE THESE PATTERNS:
${topAgentPatterns.preferredPhrases.slice(0, 10).map((p: string) => `- "${p}"`).join("\n")}

AVOID THESE ROBOTIC PHRASES (agents consistently reject them):
${Object.keys(rejectedPatterns.roboticPhrases).slice(0, 10).map((p: string) => `- "${p}"`).join("\n")}

NATURAL RESPONSE STYLE:
- Use casual, conversational language like: ${humanPatterns.commonPhrases.slice(0, 5).join(", ")}
- Match sentence structure: ${humanPatterns.sentenceStructure}
- Keep responses concise (${humanPatterns.lengthPatterns.avgLength} words average)
- Use natural punctuation: ${humanPatterns.punctuationPatterns}

REMEMBER: Sound like a real person having a conversation, not a chatbot.
`;

  return updatedPrompt + "\n\n" + rlhfSection;
}

// Helper functions
function extractCommonPhrases(responses: any[]): string[] {
  // Simple phrase extraction (can be enhanced with NLP)
  const phrases: Record<string, number> = {};

  responses.forEach((r) => {
    const text = (r.agentResponse || "").toLowerCase();
    const words = text.split(/\s+/);

    // Extract 2-3 word phrases
    for (let i = 0; i < words.length - 1; i++) {
      const phrase = `${words[i]} ${words[i + 1]}`;
      phrases[phrase] = (phrases[phrase] || 0) + 1;
    }
  });

  return Object.entries(phrases)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([phrase]) => phrase);
}

function analyzeSentenceStructure(responses: any[]): string {
  // Simplified analysis
  return "Short, direct sentences with natural flow";
}

function analyzeTonePatterns(responses: any[]): string {
  // Simplified analysis
  return "Friendly and conversational";
}

function analyzeLengthPatterns(responses: any[]): any {
  const lengths = responses.map((r) => {
    const text = r.agentResponse || "";
    return text.split(/\s+/).length;
  });

  return {
    avgLength: Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length) || 20,
    minLength: Math.min(...lengths) || 5,
    maxLength: Math.max(...lengths) || 50,
  };
}

function analyzePunctuationPatterns(responses: any[]): string {
  // Simplified analysis
  return "Natural use of periods, exclamation marks, and question marks";
}

function analyzeResponseStyle(responses: any[]): string {
  // Simplified analysis
  return "Direct and helpful";
}

function calculateAverageHumanLikeness(trainingData: any[]): number {
  const scores = trainingData
    .map((t) => t.humanLikenessScore)
    .filter((s): s is number => s !== null && s !== undefined);

  if (scores.length === 0) return 0.5;

  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

function calculateAverageNaturalLanguage(trainingData: any[]): number {
  const scores = trainingData
    .map((t) => t.naturalLanguageScore)
    .filter((s): s is number => s !== null && s !== undefined);

  if (scores.length === 0) return 0.5;

  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

function calculateStyleConsistency(trainingData: any[]): number {
  // Simplified calculation
  return 0.8;
}

/**
 * Run RLHF batch learning for all companies (scheduled job)
 */
export async function runRLHFTrainingForAllCompanies(): Promise<void> {
  const companies = await prisma.company.findMany({
    where: {
      status: "active",
    },
    select: {
      id: true,
    },
  });

  console.log(`Running RLHF training for ${companies.length} companies`);

  for (const company of companies) {
    try {
      await runRLHFTrainingBatch(company.id);
    } catch (error) {
      console.error(`Error running RLHF training for company ${company.id}:`, error);
    }
  }

  console.log("RLHF training batch completed for all companies");
}

