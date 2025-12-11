/**
 * Company setup/onboarding schemas
 */

import { z } from "zod";
import { IndustryCategory, Language, CountryCode, CurrencyCode, DateFormat } from "../../constants/company";

export const completeOnboardingSchema = z.object({
  // Step 1: Basic Info & Localization
  name: z.string().min(1),
  logoUrl: z.string().url().optional(),
  country: z.nativeEnum(CountryCode),
  preferredLanguage: z.nativeEnum(Language),
  additionalLanguages: z.array(z.nativeEnum(Language)).optional(),
  currency: z.nativeEnum(CurrencyCode),
  timezone: z.string().min(1), // e.g., "Asia/Kuala_Lumpur"
  dateFormat: z.nativeEnum(DateFormat).default(DateFormat.DD_MM_YYYY),
  
  // Step 2: Industry Category
  industryCategory: z.nativeEnum(IndustryCategory),
  
  // Step 3: Business Hours (optional)
  businessHours: z.object({
    monday: z.object({ open: z.string(), close: z.string() }).optional(),
    tuesday: z.object({ open: z.string(), close: z.string() }).optional(),
    wednesday: z.object({ open: z.string(), close: z.string() }).optional(),
    thursday: z.object({ open: z.string(), close: z.string() }).optional(),
    friday: z.object({ open: z.string(), close: z.string() }).optional(),
    saturday: z.object({ open: z.string(), close: z.string() }).optional(),
    sunday: z.object({ open: z.string(), close: z.string() }).optional(),
  }).optional(),
  
  // Step 4: Brand Voice (optional, can be set later)
  brandVoice: z.string().optional(),
  responseTone: z.enum(["professional", "friendly", "casual", "formal"]).optional(),
});

export const updateLocalizationSchema = z.object({
  country: z.nativeEnum(CountryCode).optional(),
  preferredLanguage: z.nativeEnum(Language).optional(),
  additionalLanguages: z.array(z.nativeEnum(Language)).optional(),
  currency: z.nativeEnum(CurrencyCode).optional(),
  timezone: z.string().optional(),
  dateFormat: z.nativeEnum(DateFormat).optional(),
});

export const updateCategorySchema = z.object({
  industryCategory: z.nativeEnum(IndustryCategory),
});

export const updateBrandVoiceSchema = z.object({
  brandVoice: z.string().optional(),
  responseTone: z.enum(["professional", "friendly", "casual", "formal"]).optional(),
  aiTemperature: z.number().min(0).max(1).optional(),
});

export type CompleteOnboardingInput = z.infer<typeof completeOnboardingSchema>;
export type UpdateLocalizationInput = z.infer<typeof updateLocalizationSchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type UpdateBrandVoiceInput = z.infer<typeof updateBrandVoiceSchema>;

