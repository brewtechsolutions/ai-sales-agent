/**
 * Company service functions
 * Following rule: Business logic in services, not in routers
 */

import { prisma } from "../../prisma";
import {
  CreateCompanyInput,
  UpdateCompanyInput,
  SuspendCompanyInput,
  DeleteCompanyInput,
} from "./schemas";
import { slugify } from "../../utils/strings";
import { generateWebhookSecret } from "../../utils/encryption";
import { CompanyStatus } from "../../constants/company";

export const companyService = {
  /**
   * Create a new company
   */
  create: async (input: CreateCompanyInput) => {
    // Auto-generate slug if not provided
    const slug = input.slug || slugify(input.name);

    // Check if slug already exists
    const existing = await prisma.company.findUnique({
      where: { slug },
    });

    if (existing) {
      throw new Error(`Company with slug "${slug}" already exists`);
    }

    // Generate webhook secret
    const webhookSecret = generateWebhookSecret();

    // Create company
    const company = await prisma.company.create({
      data: {
        name: input.name,
        slug,
        logoUrl: input.logoUrl,
        industryCategory: input.industryCategory,
        country: input.country,
        preferredLanguage: input.preferredLanguage,
        additionalLanguages: input.additionalLanguages || [],
        currency: input.currency,
        timezone: input.timezone,
        dateFormat: input.dateFormat,
        subscriptionPlan: input.subscriptionPlan,
        status: input.status,
        webhookSecret,
        settings: {},
      },
    });

    // Create default company settings
    await prisma.companySettings.create({
      data: {
        companyId: company.id,
        autoAssignEnabled: false,
        assignmentStrategy: "manual",
      },
    });

    return company;
  },

  /**
   * Get all companies (for super admin)
   */
  getAll: async () => {
    return prisma.company.findMany({
      include: {
        companySettings: true,
        _count: {
          select: {
            users: true,
            conversations: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  /**
   * Get company by ID
   */
  getById: async (id: string) => {
    return prisma.company.findUnique({
      where: { id },
      include: {
        companySettings: true,
        integrations: true,
        _count: {
          select: {
            users: true,
            conversations: true,
            products: true,
          },
        },
      },
    });
  },

  /**
   * Update company
   */
  update: async (input: UpdateCompanyInput) => {
    const { id, ...data } = input;
    return prisma.company.update({
      where: { id },
      data,
    });
  },

  /**
   * Suspend company
   */
  suspend: async (input: SuspendCompanyInput) => {
    return prisma.company.update({
      where: { id: input.companyId },
      data: {
        status: CompanyStatus.SUSPENDED,
        settings: {
          suspensionReason: input.reason,
          suspendedAt: new Date().toISOString(),
        },
      },
    });
  },

  /**
   * Delete company (cascade deletes all related data)
   */
  delete: async (input: DeleteCompanyInput) => {
    return prisma.company.delete({
      where: { id: input.companyId },
    });
  },
};

