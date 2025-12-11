/**
 * Success Case Templates schemas
 */

import { z } from "zod";
import { TemplateCategory } from "../../constants/template";
import { Language, IndustryCategory } from "../../constants/company";

export const createTemplateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.nativeEnum(TemplateCategory).optional(),
  industryCategory: z.nativeEnum(IndustryCategory).optional(),
  language: z.nativeEnum(Language).default(Language.ENGLISH),
  isGlobal: z.boolean().default(false), // Super admin creates global templates
  isRecommended: z.boolean().default(false),
  priority: z.number().int().default(0),
  customerMessagePatterns: z.array(z.string()).optional(),
  customerMessageExamples: z.array(z.string()).optional(),
  agentResponse: z.string().min(1),
  agentResponseVariations: z.array(z.string()).optional(),
  contextDescription: z.string().optional(),
  expectedOutcome: z.string().optional(),
  followUpActions: z.string().optional(),
  localizedVersions: z.record(z.any()).optional(), // {zh: {...}, bm: {...}}
});

export const updateTemplateSchema = createTemplateSchema.extend({
  id: z.string().uuid(),
  isActive: z.boolean().optional(),
});

export const enableTemplateSchema = z.object({
  templateId: z.string().uuid(),
  isEnabled: z.boolean().default(true),
});

export const setPreferredTemplateSchema = z.object({
  templateId: z.string().uuid(),
  isPreferred: z.boolean().default(true),
});

export const setTemplatePrioritySchema = z.object({
  templateId: z.string().uuid(),
  priority: z.number().int(),
});

export const customizeTemplateSchema = z.object({
  templateId: z.string().uuid(),
  customModifications: z.record(z.any()), // {replacements: [...], prefix: "...", suffix: "..."}
});

export const testTemplateSchema = z.object({
  templateId: z.string().uuid().optional(), // If not provided, will test matching
  customerMessage: z.string().min(1),
  language: z.nativeEnum(Language).optional(),
});

export type CreateTemplateInput = z.infer<typeof createTemplateSchema>;
export type UpdateTemplateInput = z.infer<typeof updateTemplateSchema>;
export type EnableTemplateInput = z.infer<typeof enableTemplateSchema>;
export type SetPreferredTemplateInput = z.infer<typeof setPreferredTemplateSchema>;
export type SetTemplatePriorityInput = z.infer<typeof setTemplatePrioritySchema>;
export type CustomizeTemplateInput = z.infer<typeof customizeTemplateSchema>;
export type TestTemplateInput = z.infer<typeof testTemplateSchema>;

