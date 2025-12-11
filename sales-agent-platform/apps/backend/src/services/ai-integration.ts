/**
 * AI Integration Service
 * Handles template priority system and Claude API integration
 */

import { prisma } from "../prisma";
import { findMatchingTemplate, personalizeTemplateResponse } from "../routers/templates/services";
import { detectCustomerLanguage } from "../utils/language";
import { IndustryCategory } from "../constants/company";
import { DEFAULT_AI_CONFIG } from "../constants/ai";

/**
 * Build system prompt with RLHF emphasis
 */
function buildSystemPromptWithRLHF(aiModel: any, company: any): string {
  let basePrompt =
    aiModel.systemPrompt ||
    `You are a sales assistant for ${company.name} in the ${company.industryCategory || "general"} industry.`;

  // Add RLHF instructions if enabled
  if (aiModel.rlhfEnabled) {
    const rlhfInstructions = `
CRITICAL: Respond naturally like a HUMAN sales agent, NOT like an AI or robot.

AVOID AI-typical phrases:
- "I understand" → Use "Got it", "Sure", "No problem"
- "Let me help you" → Just help directly, don't announce it
- "I'd be happy to" → Use "Sure!", "Absolutely", "Of course"
- "Is there anything else I can help you with?" → Use "Anything else?" or "Need anything else?"
- Overly formal or robotic language

PREFER natural human responses:
- Use casual, conversational language
- Match the customer's tone (formal if they're formal, casual if they're casual)
- Be concise and direct
- Use natural contractions ("I'm", "you're", "that's")
- Sound like a real person, not a chatbot

LEARN FROM HUMAN AGENTS:
- Study how real sales agents in this company communicate
- Match their natural conversation style and pacing
- Use phrases and patterns that agents actually use
- Avoid patterns that agents consistently reject or heavily modify
`;
    basePrompt = `${basePrompt}\n\n${rlhfInstructions}`;
  }

  return basePrompt;
}

/**
 * Build localized prompt with company context
 */
function buildLocalizedPrompt(
  context: any,
  company: any,
  aiModel: any,
  customerLanguage: string
): string {
  // Build language-specific instructions
  let languageInstructions = `Respond in ${company.preferredLanguage || "en"}`;
  if (customerLanguage && customerLanguage !== company.preferredLanguage) {
    languageInstructions += `, but the customer is using ${customerLanguage}, so adapt accordingly.`;
  }

  // Add cultural context for Malaysia
  let culturalContext = "";
  if (company.country === "Malaysia") {
    culturalContext = `
CULTURAL CONTEXT (Malaysia):
- Use appropriate greetings: "Selamat pagi" (morning), "Terima kasih" (thank you)
- Be respectful and polite (important in Malaysian culture)
- Understand local business hours (9am-6pm typically)
- Currency: ${company.currency || "MYR"} (Ringgit)
- Common phrases: "Boleh" (can), "Tak apa" (no problem), "Betul" (correct)
- Be aware of multi-ethnic context (Malay, Chinese, Indian, etc.)
- Avoid sensitive topics (religion, politics)
`;
  }

  // Get RLHF-learned patterns if enabled
  let rlhfPatterns = "";
  if (aiModel.rlhfEnabled) {
    // TODO: Get RLHF patterns from training data
    // const humanAgentPatterns = await getRLHFHumanPatterns(company.id, aiModel.id);
  }

  return `
${languageInstructions}

${culturalContext}

COMPANY: ${company.name}
INDUSTRY: ${company.industryCategory || "general"}
BRAND VOICE: ${company.settings?.brandVoice || "professional"}
RESPONSE STYLE: ${aiModel.responseStyle || "friendly"}

${rlhfPatterns}

AVAILABLE PRODUCTS:
${context.products
  .map(
    (p: any) =>
      `- ${p.name}: ${p.description || ""} (${company.currency || "MYR"} ${p.price})`
  )
  .join("\n")}

TRAINING MATERIALS:
${context.training.slice(0, 5).map((t: any) => t.content).join("\n\n")}

SUCCESSFUL PATTERNS (learn from these):
${context.successfulPatterns.map((p: any) => p.patternSummary).join("\n\n")}

CONVERSATION HISTORY:
${context.conversationHistory
  .map(
    (m: any) =>
      `${m.senderType === "contact" ? "Customer" : "Agent"}: ${m.content}`
  )
  .join("\n")}

CUSTOMER BEHAVIOR SCORE: ${context.behaviorScore}/100

Generate a helpful, NATURAL HUMAN-LIKE response that:
1. Addresses the customer's last message directly
2. Uses appropriate language and cultural context
3. Suggests relevant products if appropriate
4. Uses the brand voice and response style specified
5. Applies successful patterns learned from past conversations
6. Moves the conversation toward a sale if customer seems ready (green score)
7. **Sounds like a real human sales agent, NOT like an AI chatbot**
8. **Avoids robotic phrases and overly formal language**
9. **Matches the natural conversation style of human agents in this company**

Response:`;
}

/**
 * Get category-specific prompt
 */
function getCategoryPrompt(category: string | null, country: string | null): string {
  const categoryPrompts: Record<string, Record<string, string>> = {
    "E-commerce": {
      default: `Focus on product benefits, create urgency with limited stock or discounts.
Common objections: Price, shipping time, return policy.
Closing: "Shall I send you the payment link?"`,
      malaysia: `Focus on product benefits, create urgency with limited stock or discounts.
Common objections: Price, shipping time, return policy.
Closing: "Boleh saya hantar link pembayaran?" (Can I send you the payment link?)
Use local payment methods: FPX, GrabPay, Touch 'n Go, etc.
Shipping: Mention Pos Laju, J&T, Shopee Express for local delivery.`,
    },
    "Real Estate": {
      default: `Emphasize location, ROI, and viewing opportunities.
Common objections: Price, location, timing.
Closing: "Would you like to schedule a viewing?"`,
      malaysia: `Emphasize location, ROI, and viewing opportunities.
Common objections: Price, location, timing.
Closing: "Boleh kita buat appointment untuk tengok property?" (Can we schedule a viewing?)
Mention: Near LRT/MRT, good schools, shopping malls (important in Malaysia).
Understand: Freehold vs Leasehold, Bumi lot considerations.`,
    },
  };

  if (!category) {
    return "";
  }

  const prompts = categoryPrompts[category];
  if (!prompts) {
    return "";
  }

  return prompts[country?.toLowerCase() || "default"] || prompts.default || "";
}

/**
 * Generate AI response with template priority system
 */
export async function generateAIResponse(conversationId: string): Promise<{
  suggestionId: string;
  message: string;
  source: "template" | "ai_model";
}> {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      contact: true,
      messages: {
        take: 10,
        orderBy: { timestamp: "desc" },
      },
      company: {
        include: {
          companySettings: true,
          products: {
            where: { isActive: true },
            take: 50,
          },
          trainingMaterials: {
            where: { status: "processed" },
            take: 10,
          },
        },
      },
    },
  });

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  const { company, contact, messages } = conversation;

  // STEP 1: CHECK SUCCESS CASE TEMPLATES FIRST (AI Priority System)
  const lastCustomerMessage = messages
    .filter((m) => m.senderType === "contact")
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];

  if (lastCustomerMessage) {
    const customerLanguage = detectCustomerLanguage(messages);
    const matchedTemplate = await findMatchingTemplate(
      company.id,
      lastCustomerMessage.content,
      customerLanguage,
      company.industryCategory || undefined
    );

    if (matchedTemplate) {
      // Use template response (with personalization)
      const templateResponse = personalizeTemplateResponse(
        matchedTemplate,
        conversation,
        company
      );

      // Track template usage
      await prisma.companyTemplateSelection.updateMany({
        where: {
          companyId: company.id,
          templateId: matchedTemplate.id,
        },
        data: {
          usageCount: { increment: 1 },
          lastUsedAt: new Date(),
        },
      });

      await prisma.successCaseTemplate.update({
        where: { id: matchedTemplate.id },
        data: { usageCount: { increment: 1 } },
      });

      // Store AI suggestion with template reference
      const suggestion = await prisma.aISuggestion.create({
        data: {
          conversationId,
          suggestedMessage: templateResponse,
          wasUsed: false,
          metadata: {
            source: "success_case_template",
            templateId: matchedTemplate.id,
            templateName: matchedTemplate.name,
          },
        },
      });

      return {
        suggestionId: suggestion.id,
        message: templateResponse,
        source: "template",
      };
    }
  }

  // STEP 2: NO TEMPLATE MATCH - FALL BACK TO TRAINED AI MODEL
  const aiModel = await prisma.aIModelConfig.findFirst({
    where: {
      companyId: company.id,
      isActive: true,
    },
  });

  if (!aiModel) {
    throw new Error("No active AI model found for company");
  }

  // Build comprehensive context
  const categoryPrompt = getCategoryPrompt(company.industryCategory, company.country);

  // Weight training data according to model config
  const productsContext = company.products
    .slice(0, Math.floor(50 * Number(aiModel.productCatalogWeight)))
    .map(
      (p) =>
        `- ${p.name}: ${p.description || ""} (${company.currency || "MYR"} ${p.price})`
    )
    .join("\n");

  const trainingContext = company.trainingMaterials
    .slice(0, Math.floor(10 * Number(aiModel.trainingMaterialsWeight)))
    .map((t) => t.content)
    .join("\n\n");

  const faqs = await prisma.fAQ.findMany({
    where: { companyId: company.id },
    take: Math.floor(20 * Number(aiModel.faqWeight)),
    orderBy: { usageCount: "desc" },
  });

  const faqContext = faqs.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n");

  const conversationHistory = messages
    .reverse()
    .map(
      (m) =>
        `${m.senderType === "contact" ? "Customer" : "Agent"}: ${m.content}`
    )
    .join("\n");

  // Get successful patterns (weighted by model config)
  const successPatterns = await prisma.successfulPattern.findMany({
    where: { companyId: company.id },
    take: Math.floor(10 * Number(aiModel.successPatternsWeight)),
    orderBy: { effectivenessScore: "desc" },
  });

  const patternsContext = successPatterns
    .map((p) => p.patternSummary || "")
    .join("\n\n");

  // Detect customer language
  const customerLanguage = detectCustomerLanguage(messages);

  // Build context object
  const context = {
    products: company.products,
    training: company.trainingMaterials,
    successfulPatterns: successPatterns,
    conversationHistory: messages.map((m) => ({
      senderType: m.senderType,
      content: m.content,
    })),
    behaviorScore: contact.behaviorScore,
  };

  // Build localized prompt
  const localizedPrompt = buildLocalizedPrompt(
    {
      products: company.products,
      training: company.trainingMaterials,
      successfulPatterns: successPatterns,
      conversationHistory: messages.map((m) => ({
        senderType: m.senderType,
        content: m.content,
      })),
      behaviorScore: contact.behaviorScore,
    },
    company,
    aiModel,
    customerLanguage
  );

  // Call Claude API
  const claudeApiKey = process.env.CLAUDE_API_KEY;
  if (!claudeApiKey) {
    throw new Error("CLAUDE_API_KEY not configured");
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": claudeApiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: aiModel.maxTokens,
      temperature: Number(aiModel.temperature),
      messages: [
        {
          role: "system",
          content: buildSystemPromptWithRLHF(aiModel, company),
        },
        {
          role: "user",
          content: localizedPrompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Claude API error: ${error}`);
  }

  const data = await response.json();
  const aiMessage = data.content[0].text;

  // Store AI suggestion with model version tracking
  const suggestion = await prisma.aISuggestion.create({
    data: {
      conversationId,
      suggestedMessage: aiMessage,
      wasUsed: false,
      metadata: {
        modelVersion: aiModel.version,
        modelConfigId: aiModel.id,
      },
    },
  });

  return {
    suggestionId: suggestion.id,
    message: aiMessage,
    source: "ai_model",
  };
}

