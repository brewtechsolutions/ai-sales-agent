/**
 * User service functions
 * Updated for multi-tenant architecture
 */

import { prisma } from "../../prisma";
import { CreateUserInput, UpdateUserInput } from "./schemas";
import { hash } from "argon2";

export const userService = {
  /**
   * Create user (Company Admin only - creates agents)
   */
  create: async (input: CreateUserInput, companyId: string) => {
    // Hash password
    const passwordHash = await hash(input.password);

    return prisma.user.create({
      data: {
        ...input,
        passwordHash,
        companyId,
      },
    });
  },

  /**
   * Get all users (filtered by company)
   */
  getAll: async (companyId: string) => {
    return prisma.user.findMany({
      where: {
        companyId,
      },
      include: {
        _count: {
          select: {
            assignedConversations: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  /**
   * Get user by ID (with company verification)
   */
  getById: async (id: string, companyId: string) => {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            assignedConversations: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Super admin can access any user
    // Company users can only access users from their company
    if (user.companyId !== companyId) {
      throw new Error("Access denied");
    }

    return user;
  },

  /**
   * Update user (with company verification)
   */
  update: async (input: UpdateUserInput, companyId: string) => {
    const { id, ...data } = input;

    // Verify ownership
    const existing = await prisma.user.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new Error("User not found");
    }

    // Super admin can update any user
    // Company users can only update users from their company
    if (existing.companyId !== companyId) {
      throw new Error("Access denied");
    }

    return prisma.user.update({
      where: { id },
      data,
    });
  },

  /**
   * Delete user (with company verification)
   */
  delete: async (id: string, companyId: string) => {
    // Verify ownership
    const existing = await prisma.user.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new Error("User not found");
    }

    if (existing.companyId !== companyId) {
      throw new Error("Access denied");
    }

    // Don't allow deleting yourself
    // This check should be done in router

    return prisma.user.delete({
      where: { id },
    });
  },

  /**
   * Get user performance (for analytics)
   */
  getPerformance: async (userId: string, companyId: string) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.companyId !== companyId) {
      throw new Error("User not found");
    }

    const [totalConversations, completedConversations, totalRevenue] =
      await Promise.all([
        prisma.conversation.count({
          where: {
            assignedTo: userId,
            companyId,
          },
        }),
        prisma.conversation.count({
          where: {
            assignedTo: userId,
            companyId,
            isSuccess: true,
          },
        }),
        prisma.conversation.aggregate({
          where: {
            assignedTo: userId,
            companyId,
            isSuccess: true,
          },
          _sum: {
            saleAmount: true,
          },
        }),
      ]);

    const conversionRate =
      totalConversations > 0
        ? (completedConversations / totalConversations) * 100
        : 0;

    return {
      userId,
      totalConversations,
      completedConversations,
      conversionRate,
      totalRevenue: totalRevenue._sum.saleAmount || 0,
    };
  },
};
