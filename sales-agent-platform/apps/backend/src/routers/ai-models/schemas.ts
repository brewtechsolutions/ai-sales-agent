/**
 * AI Model Configuration schemas
 */

import { z } from "zod";
import { ResponseStyle, DEFAULT_AI_CONFIG } from "../../constants/ai";
import { Language } from "../../constants/company";

export const createModelVersionSchema = z.object({
  systemPrompt: z.string().min(100),
  responseStyle: z.nativeEnum(ResponseStyle),
  temperature: z.number().min(0).max(1).default(DEFAULT_AI_CONFIG.TEMPERATURE),
  maxTokens: z.number().min(100).max(4000).default(DEFAULT_AI_CONFIG.MAX_TOKENS),
  languageConfig: z.object({
    primary: z.nativeEnum(Language),
    secondary: z.array(z.nativeEnum(Language)).optional(),
    culturalContext: z.record(z.any()).optional(),
  }),
  trainingWeights: z.object({
    successPatterns: z.number().min(0).max(1).default(DEFAULT_AI_CONFIG.SUCCESS_PATTERNS_WEIGHT),
    productCatalog: z.number().min(0).max(1).default(DEFAULT_AI_CONFIG.PRODUCT_CATALOG_WEIGHT),
    faq: z.number().min(0).max(1).default(DEFAULT_AI_CONFIG.FAQ_WEIGHT),
    trainingMaterials: z.number().min(0).max(1).default(DEFAULT_AI_CONFIG.TRAINING_MATERIALS_WEIGHT),
  }).optional(),
  rlhfConfig: z.object({
    enabled: z.boolean().default(true),
    humanLikenessTarget: z.number().min(0).max(1).default(DEFAULT_AI_CONFIG.RLHF_HUMAN_LIKENESS_TARGET),
    learningRate: z.number().min(0).max(1).default(DEFAULT_AI_CONFIG.RLHF_LEARNING_RATE),
    styleMatching: z.enum(["top_agent", "company_average", "custom"]).default("top_agent"),
    roboticPhraseDetection: z.boolean().default(true),
    naturalFlowEnabled: z.boolean().default(true),
  }).optional(),
  notes: z.string().optional(),
});

export const updateModelVersionSchema = createModelVersionSchema.extend({
  versionId: z.string().uuid(),
});

export const testModelSchema = z.object({
  modelVersionId: z.string().uuid(),
  customerMessage: z.string().min(1),
  expectedBehavior: z.string().optional(),
  language: z.nativeEnum(Language).optional(),
});

export const activateModelVersionSchema = z.object({
  versionId: z.string().uuid(),
});

export type CreateModelVersionInput = z.infer<typeof createModelVersionSchema>;
export type UpdateModelVersionInput = z.infer<typeof updateModelVersionSchema>;
export type TestModelInput = z.infer<typeof testModelSchema>;
export type ActivateModelVersionInput = z.infer<typeof activateModelVersionSchema>;

