/**
 * AI Model Configuration service functions
 */

import { prisma } from "../../prisma";
import {
  CreateModelVersionInput,
  UpdateModelVersionInput,
  TestModelInput,
  ActivateModelVersionInput,
} from "./schemas";
import { DEFAULT_AI_CONFIG } from "../../constants/ai";

/**
 * Increment version number
 */
function incrementVersion(currentVersion: string): string {
  const match = currentVersion.match(/^v(\d+)\.(\d+)$/);
  if (!match) {
    return "v1.0";
  }

  const major = parseInt(match[1], 10);
  const minor = parseInt(match[2], 10);

  if (minor < 9) {
    return `v${major}.${minor + 1}`;
  } else {
    return `v${major + 1}.0`;
  }
}

export const aiModelService = {
  /**
   * Get active AI model for company
   */
  getActive: async (companyId: string) => {
    return prisma.aIModelConfig.findFirst({
      where: {
        companyId,
        isActive: true,
      },
      include: {
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  },

  /**
   * List all model versions for company
   */
  listVersions: async (companyId: string) => {
    return prisma.aIModelConfig.findMany({
      where: { companyId },
      include: {
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            tests: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  /**
   * Create new model version
   */
  createVersion: async (input: CreateModelVersionInput, companyId: string, createdBy: string) => {
    // Deactivate current active model
    await prisma.aIModelConfig.updateMany({
      where: {
        companyId,
        isActive: true,
      },
      data: { isActive: false },
    });

    // Get next version number
    const existingVersions = await prisma.aIModelConfig.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
      take: 1,
    });

    const nextVersion = existingVersions.length > 0
      ? incrementVersion(existingVersions[0].version)
      : "v1.0";

    // Create new model version
    const newModel = await prisma.aIModelConfig.create({
      data: {
        companyId,
        version: nextVersion,
        isActive: true,
        systemPrompt: input.systemPrompt,
        responseStyle: input.responseStyle,
        temperature: input.temperature,
        maxTokens: input.maxTokens,
        languageConfig: input.languageConfig,
        successPatternsWeight: input.trainingWeights?.successPatterns || DEFAULT_AI_CONFIG.SUCCESS_PATTERNS_WEIGHT,
        productCatalogWeight: input.trainingWeights?.productCatalog || DEFAULT_AI_CONFIG.PRODUCT_CATALOG_WEIGHT,
        faqWeight: input.trainingWeights?.faq || DEFAULT_AI_CONFIG.FAQ_WEIGHT,
        trainingMaterialsWeight: input.trainingWeights?.trainingMaterials || DEFAULT_AI_CONFIG.TRAINING_MATERIALS_WEIGHT,
        rlhfEnabled: input.rlhfConfig?.enabled ?? true,
        rlhfHumanLikenessTarget: input.rlhfConfig?.humanLikenessTarget || DEFAULT_AI_CONFIG.RLHF_HUMAN_LIKENESS_TARGET,
        rlhfLearningRate: input.rlhfConfig?.learningRate || DEFAULT_AI_CONFIG.RLHF_LEARNING_RATE,
        rlhfStyleMatching: input.rlhfConfig?.styleMatching || "top_agent",
        rlhfRoboticPhraseDetection: input.rlhfConfig?.roboticPhraseDetection ?? true,
        rlhfNaturalFlowEnabled: input.rlhfConfig?.naturalFlowEnabled ?? true,
        createdBy,
        deployedAt: new Date(),
        notes: input.notes,
      },
    });

    return newModel;
  },

  /**
   * Update model version
   */
  updateVersion: async (input: UpdateModelVersionInput, companyId: string) => {
    const { versionId, ...data } = input;

    // Verify ownership
    const existing = await prisma.aIModelConfig.findUnique({
      where: { id: versionId },
    });

    if (!existing || existing.companyId !== companyId) {
      throw new Error("Model version not found or access denied");
    }

    // Don't allow updating active model directly (must create new version)
    if (existing.isActive) {
      throw new Error("Cannot update active model. Create a new version instead.");
    }

    return prisma.aIModelConfig.update({
      where: { id: versionId },
      data: {
        systemPrompt: data.systemPrompt,
        responseStyle: data.responseStyle,
        temperature: data.temperature,
        maxTokens: data.maxTokens,
        languageConfig: data.languageConfig,
        successPatternsWeight: data.trainingWeights?.successPatterns,
        productCatalogWeight: data.trainingWeights?.productCatalog,
        faqWeight: data.trainingWeights?.faq,
        trainingMaterialsWeight: data.trainingWeights?.trainingMaterials,
        rlhfEnabled: data.rlhfConfig?.enabled,
        rlhfHumanLikenessTarget: data.rlhfConfig?.humanLikenessTarget,
        rlhfLearningRate: data.rlhfConfig?.learningRate,
        rlhfStyleMatching: data.rlhfConfig?.styleMatching,
        rlhfRoboticPhraseDetection: data.rlhfConfig?.roboticPhraseDetection,
        rlhfNaturalFlowEnabled: data.rlhfConfig?.naturalFlowEnabled,
        notes: data.notes,
      },
    });
  },

  /**
   * Activate model version
   */
  activateVersion: async (input: ActivateModelVersionInput, companyId: string) => {
    // Verify ownership
    const model = await prisma.aIModelConfig.findFirst({
      where: {
        id: input.versionId,
        companyId,
      },
    });

    if (!model) {
      throw new Error("Model version not found");
    }

    // Deactivate current active
    await prisma.aIModelConfig.updateMany({
      where: {
        companyId,
        isActive: true,
      },
      data: { isActive: false },
    });

    // Activate new version
    const activated = await prisma.aIModelConfig.update({
      where: { id: input.versionId },
      data: {
        isActive: true,
        deployedAt: new Date(),
      },
    });

    return activated;
  },

  /**
   * Test AI model with scenario
   */
  testModel: async (input: TestModelInput, companyId: string) => {
    const modelConfig = await prisma.aIModelConfig.findFirst({
      where: {
        id: input.modelVersionId,
        companyId,
      },
    });

    if (!modelConfig) {
      throw new Error("Model version not found");
    }

    // TODO: Call AI integration service to generate response
    // For now, return mock response
    const startTime = Date.now();
    
    // Simulate AI response generation
    const response = `Test response for: "${input.customerMessage}"`;
    const responseTime = Date.now() - startTime;

    // Store test result
    const testResult = await prisma.aIModelTest.create({
      data: {
        companyId,
        modelConfigId: input.modelVersionId,
        testName: `Test ${new Date().toISOString()}`,
        scenarioDescription: input.expectedBehavior || "",
        customerMessage: input.customerMessage,
        actualResponse: response,
        testResult: "passed", // Would be determined by analysis
        testMetrics: {
          responseTime,
          relevanceScore: 0.85,
          languageMatch: input.language || "en",
          culturalAppropriateness: 0.9,
          toneMatch: 0.8,
        },
      },
    });

    return testResult;
  },

  /**
   * Get model performance metrics
   */
  getPerformance: async (modelVersionId: string | undefined, companyId: string) => {
    const where: any = { companyId };
    if (modelVersionId) {
      where.modelConfigId = modelVersionId;
    }

    // Get all suggestions for this model (last 30 days)
    const suggestions = await prisma.aISuggestion.findMany({
      where: {
        conversation: {
          companyId,
        },
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
        ...(modelVersionId && {
          metadata: {
            path: ["model_config_id"],
            equals: modelVersionId,
          },
        }),
      },
      include: {
        conversation: true,
      },
    });

    const totalSuggestions = suggestions.length;
    const usedSuggestions = suggestions.filter((s) => s.wasUsed).length;
    const usageRate = totalSuggestions > 0 ? (usedSuggestions / totalSuggestions) * 100 : 0;

    const ratedSuggestions = suggestions.filter((s) => s.agentRating !== null);
    const avgRating =
      ratedSuggestions.length > 0
        ? ratedSuggestions.reduce((sum, s) => sum + (s.agentRating || 0), 0) /
          ratedSuggestions.length
        : 0;

    // Update model performance metrics if specific version
    if (modelVersionId) {
      await prisma.aIModelConfig.update({
        where: { id: modelVersionId },
        data: {
          performanceMetrics: {
            usageRate,
            avgRating,
            totalSuggestions,
            usedSuggestions,
            ratedSuggestions: ratedSuggestions.length,
            lastUpdated: new Date(),
          },
        },
      });
    }

    return {
      usageRate,
      avgRating,
      totalSuggestions,
      usedSuggestions,
      ratedSuggestions: ratedSuggestions.length,
    };
  },

  /**
   * List test results
   */
  listTestResults: async (modelVersionId: string | undefined, companyId: string) => {
    const where: any = { companyId };
    if (modelVersionId) {
      where.modelConfigId = modelVersionId;
    }

    return prisma.aIModelTest.findMany({
      where,
      include: {
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },
};

