/**
 * Success Case Templates service functions
 */

import { prisma } from "../../prisma";
import {
  CreateTemplateInput,
  UpdateTemplateInput,
  EnableTemplateInput,
  SetPreferredTemplateInput,
  SetTemplatePriorityInput,
  CustomizeTemplateInput,
  TestTemplateInput,
} from "./schemas";
import { Language } from "../../constants/company";
import { detectCustomerLanguage } from "../../utils/language";

/**
 * Find matching template for customer message
 */
export async function findMatchingTemplate(
  companyId: string,
  customerMessage: string,
  customerLanguage: string,
  industryCategory?: string
) {
  // Get enabled templates for this company (ordered by priority)
  const enabledSelections = await prisma.companyTemplateSelection.findMany({
    where: {
      companyId,
      isEnabled: true,
    },
    include: {
      template: {
        where: {
          isActive: true,
          language: customerLanguage,
          OR: [
            { industryCategory: industryCategory || null },
            { industryCategory: null }, // Global templates
          ],
        },
      },
    },
    orderBy: [
      { isPreferred: "desc" }, // Preferred templates first
      { priority: "desc" }, // Then by priority
    ],
  });

  const customerMessageLower = customerMessage.toLowerCase();

  // Check each template for matches
  for (const selection of enabledSelections) {
    const template = selection.template;
    if (!template) continue;

    // Check if customer message matches template patterns
    const patterns = (template.customerMessagePatterns as string[]) || [];
    const examples = (template.customerMessageExamples as string[]) || [];

    // Check pattern matches
    const patternMatch = patterns.some((pattern) =>
      customerMessageLower.includes(pattern.toLowerCase())
    );

    // Check example matches (fuzzy matching)
    const exampleMatch = examples.some((example) => {
      const exampleLower = example.toLowerCase();
      const exampleKeywords = exampleLower.split(/\s+/);
      return exampleKeywords.some(
        (keyword) => keyword.length > 3 && customerMessageLower.includes(keyword)
      );
    });

    if (patternMatch || exampleMatch) {
      return template;
    }
  }

  return null;
}

/**
 * Personalize template response
 */
export function personalizeTemplateResponse(
  template: any,
  conversation: any,
  company: any
): string {
  let response = template.agentResponse || "";

  // Get localized version if available
  const customerLanguage = detectCustomerLanguage(conversation.messages || []);
  if (
    template.localizedVersions &&
    template.localizedVersions[customerLanguage]
  ) {
    response =
      template.localizedVersions[customerLanguage].agentResponse || response;
  }

  // Apply company customizations if any
  const companySelection = conversation.company?.templateSelections?.find(
    (s: any) => s.templateId === template.id
  );
  if (companySelection?.customModifications) {
    response = applyCustomizations(response, companySelection.customModifications);
  }

  // Personalize with customer name if available
  if (conversation.contact?.name) {
    response = response.replace(/\{customer_name\}/g, conversation.contact.name);
  }

  // Personalize with company name
  if (company?.name) {
    response = response.replace(/\{company_name\}/g, company.name);
  }

  return response;
}

/**
 * Apply company customizations to template
 */
function applyCustomizations(response: string, customizations: any): string {
  let customized = response;

  if (customizations.replacements) {
    customizations.replacements.forEach((replacement: any) => {
      customized = customized.replace(
        new RegExp(replacement.find, "gi"),
        replacement.replace
      );
    });
  }

  if (customizations.prefix) {
    customized = customizations.prefix + " " + customized;
  }

  if (customizations.suffix) {
    customized = customized + " " + customizations.suffix;
  }

  return customized;
}

export const templateService = {
  /**
   * List global templates (super admin)
   */
  listGlobal: async () => {
    return prisma.successCaseTemplate.findMany({
      where: {
        isGlobal: true,
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
        _count: {
          select: {
            companySelections: true,
          },
        },
      },
      orderBy: [
        { isRecommended: "desc" },
        { priority: "desc" },
        { createdAt: "desc" },
      ],
    });
  },

  /**
   * List company templates (company admin)
   */
  listCompany: async (companyId: string) => {
    return prisma.successCaseTemplate.findMany({
      where: {
        companyId,
        isActive: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },

  /**
   * List enabled templates for company
   */
  listEnabled: async (companyId: string) => {
    const selections = await prisma.companyTemplateSelection.findMany({
      where: {
        companyId,
        isEnabled: true,
      },
      include: {
        template: true,
      },
      orderBy: [
        { isPreferred: "desc" },
        { priority: "desc" },
      ],
    });

    return selections.map((s) => ({
      ...s.template,
      isPreferred: s.isPreferred,
      priority: s.priority,
      customModifications: s.customModifications,
      usageCount: s.usageCount,
      lastUsedAt: s.lastUsedAt,
    }));
  },

  /**
   * Create global template (super admin)
   */
  createGlobal: async (input: CreateTemplateInput, createdBy: string) => {
    return prisma.successCaseTemplate.create({
      data: {
        ...input,
        isGlobal: true,
        companyId: null,
        createdBy,
      },
    });
  },

  /**
   * Create company-specific template (company admin)
   */
  createCompany: async (
    input: CreateTemplateInput,
    companyId: string,
    createdBy: string
  ) => {
    const template = await prisma.successCaseTemplate.create({
      data: {
        ...input,
        isGlobal: false,
        companyId,
        createdBy,
      },
    });

    // Auto-enable for company
    await prisma.companyTemplateSelection.create({
      data: {
        companyId,
        templateId: template.id,
        isEnabled: true,
        isPreferred: false,
        priority: input.priority || 0,
      },
    });

    return template;
  },

  /**
   * Update template
   */
  update: async (input: UpdateTemplateInput, companyId?: string) => {
    const { id, ...data } = input;

    // Verify ownership
    const existing = await prisma.successCaseTemplate.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new Error("Template not found");
    }

    // Company templates can only be updated by same company
    if (existing.companyId && existing.companyId !== companyId) {
      throw new Error("Access denied");
    }

    return prisma.successCaseTemplate.update({
      where: { id },
      data,
    });
  },

  /**
   * Enable/disable template for company
   */
  enable: async (input: EnableTemplateInput, companyId: string) => {
    // Get or create selection
    const selection = await prisma.companyTemplateSelection.upsert({
      where: {
        companyId_templateId: {
          companyId,
          templateId: input.templateId,
        },
      },
      create: {
        companyId,
        templateId: input.templateId,
        isEnabled: input.isEnabled,
      },
      update: {
        isEnabled: input.isEnabled,
      },
    });

    return selection;
  },

  /**
   * Set template as preferred
   */
  setPreferred: async (input: SetPreferredTemplateInput, companyId: string) => {
    return prisma.companyTemplateSelection.update({
      where: {
        companyId_templateId: {
          companyId,
          templateId: input.templateId,
        },
      },
      data: {
        isPreferred: input.isPreferred,
      },
    });
  },

  /**
   * Set template priority
   */
  setPriority: async (input: SetTemplatePriorityInput, companyId: string) => {
    return prisma.companyTemplateSelection.update({
      where: {
        companyId_templateId: {
          companyId,
          templateId: input.templateId,
        },
      },
      data: {
        priority: input.priority,
      },
    });
  },

  /**
   * Customize template for company
   */
  customize: async (input: CustomizeTemplateInput, companyId: string) => {
    return prisma.companyTemplateSelection.update({
      where: {
        companyId_templateId: {
          companyId,
          templateId: input.templateId,
        },
      },
      data: {
        customModifications: input.customModifications,
      },
    });
  },

  /**
   * Test template matching
   */
  test: async (input: TestTemplateInput, companyId: string) => {
    const customerLanguage =
      input.language || detectCustomerLanguage([{ content: input.customerMessage }]);

    // Get company for industry category
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: { industryCategory: true },
    });

    if (input.templateId) {
      // Test specific template
      const template = await prisma.successCaseTemplate.findUnique({
        where: { id: input.templateId },
      });

      if (!template) {
        throw new Error("Template not found");
      }

      // Check if matches
      const patterns = (template.customerMessagePatterns as string[]) || [];
      const examples = (template.customerMessageExamples as string[]) || [];
      const customerMessageLower = input.customerMessage.toLowerCase();

      const patternMatch = patterns.some((pattern) =>
        customerMessageLower.includes(pattern.toLowerCase())
      );

      const exampleMatch = examples.some((example) => {
        const exampleLower = example.toLowerCase();
        const exampleKeywords = exampleLower.split(/\s+/);
        return exampleKeywords.some(
          (keyword) => keyword.length > 3 && customerMessageLower.includes(keyword)
        );
      });

      return {
        template,
        matches: patternMatch || exampleMatch,
        matchedPattern: patternMatch,
        matchedExample: exampleMatch,
      };
    } else {
      // Find best matching template
      const matchedTemplate = await findMatchingTemplate(
        companyId,
        input.customerMessage,
        customerLanguage,
        company?.industryCategory || undefined
      );

      return {
        template: matchedTemplate,
        matches: !!matchedTemplate,
      };
    }
  },

  /**
   * Get template usage stats
   */
  getUsageStats: async (templateId: string, companyId?: string) => {
    const where: any = { templateId };
    if (companyId) {
      where.companyId = companyId;
    }

    const selections = await prisma.companyTemplateSelection.findMany({
      where,
      include: {
        template: true,
      },
    });

    const totalUsage = selections.reduce(
      (sum, s) => sum + s.usageCount,
      0
    );

    return {
      templateId,
      totalUsage,
      enabledCompanies: selections.filter((s) => s.isEnabled).length,
      preferredCompanies: selections.filter((s) => s.isPreferred).length,
      selections,
    };
  },
};

