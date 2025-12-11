/**
 * Company schemas and DTOs
 * Following rule: Must define DTOs - no inline types
 */

import { z } from "zod";
import { CompanyStatus, IndustryCategory, Language } from "../../constants/company";
import { slugify } from "../../utils/strings";

export const createCompanySchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(), // Auto-generate if not provided
  logoUrl: z.string().url().optional(),
  industryCategory: z.nativeEnum(IndustryCategory).optional(),
  country: z.string().optional(),
  preferredLanguage: z.nativeEnum(Language).optional(),
  additionalLanguages: z.array(z.nativeEnum(Language)).optional(),
  currency: z.string().length(3).optional(),
  timezone: z.string().optional(),
  dateFormat: z.string().optional(),
  subscriptionPlan: z.string().optional(),
  status: z.nativeEnum(CompanyStatus).default(CompanyStatus.TRIAL),
});

export const updateCompanySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).optional(),
  logoUrl: z.string().url().optional(),
  industryCategory: z.nativeEnum(IndustryCategory).optional(),
  country: z.string().optional(),
  preferredLanguage: z.nativeEnum(Language).optional(),
  additionalLanguages: z.array(z.nativeEnum(Language)).optional(),
  currency: z.string().length(3).optional(),
  timezone: z.string().optional(),
  dateFormat: z.string().optional(),
  subscriptionPlan: z.string().optional(),
  status: z.nativeEnum(CompanyStatus).optional(),
  settings: z.record(z.any()).optional(),
});

export const suspendCompanySchema = z.object({
  companyId: z.string().uuid(),
  reason: z.string().optional(),
});

export const deleteCompanySchema = z.object({
  companyId: z.string().uuid(),
});

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;
export type SuspendCompanyInput = z.infer<typeof suspendCompanySchema>;
export type DeleteCompanyInput = z.infer<typeof deleteCompanySchema>;

