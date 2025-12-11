/**
 * Company setup/onboarding service functions
 */

import { prisma } from "../../prisma";
import {
  CompleteOnboardingInput,
  UpdateLocalizationInput,
  UpdateCategoryInput,
  UpdateBrandVoiceInput,
} from "./schemas";
import { slugify } from "../../utils/strings";
import { DEFAULT_AI_CONFIG } from "../../constants/ai";

/**
 * Generate unique company slug
 */
async function generateUniqueSlug(name: string): Promise<string> {
  const baseSlug = slugify(name);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.company.findUnique({
      where: { slug },
    });

    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

export const companySetupService = {
  /**
   * Complete onboarding wizard
   */
  completeOnboarding: async (input: CompleteOnboardingInput, companyId: string) => {
    // Generate slug if not exists
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new Error("Company not found");
    }

    const slug = company.slug || (await generateUniqueSlug(input.name));

    // Update company with onboarding data
    const updatedCompany = await prisma.company.update({
      where: { id: companyId },
      data: {
        name: input.name,
        logoUrl: input.logoUrl,
        slug,
        country: input.country,
        preferredLanguage: input.preferredLanguage,
        additionalLanguages: input.additionalLanguages || [],
        currency: input.currency,
        timezone: input.timezone,
        dateFormat: input.dateFormat,
        industryCategory: input.industryCategory,
      },
    });

    // Create or update company settings
    await prisma.companySettings.upsert({
      where: { companyId },
      create: {
        companyId,
        brandVoice: input.brandVoice,
        responseTone: input.responseTone,
        aiTemperature: DEFAULT_AI_CONFIG.TEMPERATURE,
        autoAssignEnabled: false,
        assignmentStrategy: "manual",
        businessHours: input.businessHours || {},
      },
      update: {
        brandVoice: input.brandVoice,
        responseTone: input.responseTone,
        businessHours: input.businessHours || {},
      },
    });

    // Create default AI model config if not exists
    const existingModel = await prisma.aIModelConfig.findFirst({
      where: {
        companyId,
        isActive: true,
      },
    });

    if (!existingModel) {
      await prisma.aIModelConfig.create({
        data: {
          companyId,
          version: "v1.0",
          isActive: true,
          systemPrompt: `You are a sales assistant for ${input.name} in the ${input.industryCategory} industry. Respond naturally like a human, not like an AI.`,
          responseStyle: input.responseTone || "friendly",
          temperature: DEFAULT_AI_CONFIG.TEMPERATURE,
          maxTokens: DEFAULT_AI_CONFIG.MAX_TOKENS,
          languageConfig: {
            primary: input.preferredLanguage,
            secondary: input.additionalLanguages || [],
            culturalContext: {
              country: input.country,
              currency: input.currency,
              timezone: input.timezone,
            },
          },
          successPatternsWeight: DEFAULT_AI_CONFIG.SUCCESS_PATTERNS_WEIGHT,
          productCatalogWeight: DEFAULT_AI_CONFIG.PRODUCT_CATALOG_WEIGHT,
          faqWeight: DEFAULT_AI_CONFIG.FAQ_WEIGHT,
          trainingMaterialsWeight: DEFAULT_AI_CONFIG.TRAINING_MATERIALS_WEIGHT,
          rlhfEnabled: true,
          rlhfHumanLikenessTarget: DEFAULT_AI_CONFIG.RLHF_HUMAN_LIKENESS_TARGET,
          rlhfLearningRate: DEFAULT_AI_CONFIG.RLHF_LEARNING_RATE,
          deployedAt: new Date(),
        },
      });
    }

    return updatedCompany;
  },

  /**
   * Update localization settings
   */
  updateLocalization: async (input: UpdateLocalizationInput, companyId: string) => {
    const updateData: any = {};

    if (input.country !== undefined) updateData.country = input.country;
    if (input.preferredLanguage !== undefined) updateData.preferredLanguage = input.preferredLanguage;
    if (input.additionalLanguages !== undefined) updateData.additionalLanguages = input.additionalLanguages;
    if (input.currency !== undefined) updateData.currency = input.currency;
    if (input.timezone !== undefined) updateData.timezone = input.timezone;
    if (input.dateFormat !== undefined) updateData.dateFormat = input.dateFormat;

    return prisma.company.update({
      where: { id: companyId },
      data: updateData,
    });
  },

  /**
   * Update industry category
   */
  updateCategory: async (input: UpdateCategoryInput, companyId: string) => {
    return prisma.company.update({
      where: { id: companyId },
      data: {
        industryCategory: input.industryCategory,
      },
    });
  },

  /**
   * Update brand voice settings
   */
  updateBrandVoice: async (input: UpdateBrandVoiceInput, companyId: string) => {
    return prisma.companySettings.update({
      where: { companyId },
      data: {
        brandVoice: input.brandVoice,
        responseTone: input.responseTone,
        aiTemperature: input.aiTemperature,
      },
    });
  },

  /**
   * Get onboarding status
   */
  getOnboardingStatus: async (companyId: string) => {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        companySettings: true,
      },
    });

    if (!company) {
      throw new Error("Company not found");
    }

    const steps = {
      basicInfo: !!(company.name && company.country && company.preferredLanguage),
      category: !!company.industryCategory,
      products: false, // Check if products exist
      integrations: false, // Check if integrations configured
      aiModel: false, // Check if AI model configured
    };

    // Check products
    const productCount = await prisma.product.count({
      where: { companyId },
    });
    steps.products = productCount > 0;

    // Check integrations
    const integration = await prisma.companyIntegration.findUnique({
      where: { companyId },
    });
    steps.integrations = !!(integration?.onsendApiKeyEncrypted || integration?.telegramBotTokenEncrypted);

    // Check AI model
    const aiModel = await prisma.aIModelConfig.findFirst({
      where: {
        companyId,
        isActive: true,
      },
    });
    steps.aiModel = !!aiModel;

    const completedSteps = Object.values(steps).filter(Boolean).length;
    const totalSteps = Object.keys(steps).length;
    const progress = (completedSteps / totalSteps) * 100;

    return {
      steps,
      progress,
      completedSteps,
      totalSteps,
      isComplete: completedSteps === totalSteps,
    };
  },
};

