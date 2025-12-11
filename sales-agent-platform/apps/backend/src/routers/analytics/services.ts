/**
 * Analytics service functions
 */

import { prisma } from "../../prisma";
import {
  GetOverviewInput,
  GetAgentPerformanceInput,
  GetProductPerformanceInput,
  GetRevenueInput,
  GetLeadDistributionInput,
} from "./schemas";
import { BehaviorScoreColor } from "../../constants/conversation";

export const analyticsService = {
  /**
   * Get company overview metrics
   */
  getOverview: async (input: GetOverviewInput, companyId: string) => {
    const where: any = { companyId };

    if (input.startDate || input.endDate) {
      where.createdAt = {};
      if (input.startDate) where.createdAt.gte = input.startDate;
      if (input.endDate) where.createdAt.lte = input.endDate;
    }

    const [
      totalLeads,
      totalConversations,
      activeConversations,
      completedConversations,
      totalRevenue,
      totalAgents,
      avgResponseTime,
    ] = await Promise.all([
      prisma.contact.count({ where: { companyId } }),
      prisma.conversation.count({ where }),
      prisma.conversation.count({
        where: {
          ...where,
          status: { in: ["new", "in_progress", "waiting"] },
        },
      }),
      prisma.conversation.count({
        where: {
          ...where,
          isSuccess: true,
        },
      }),
      prisma.conversation.aggregate({
        where: {
          ...where,
          isSuccess: true,
        },
        _sum: {
          saleAmount: true,
        },
      }),
      prisma.user.count({
        where: {
          companyId,
          role: { in: ["company_admin", "company_user"] },
          status: "active",
        },
      }),
      // Calculate average response time (simplified)
      prisma.message
        .findMany({
          where: {
            conversation: { companyId },
            senderType: "agent",
          },
          take: 100,
          orderBy: { timestamp: "desc" },
        })
        .then((messages) => {
          // Simplified calculation
          return messages.length > 0 ? 5 : 0; // minutes
        }),
    ]);

    const conversionRate =
      totalConversations > 0
        ? (completedConversations / totalConversations) * 100
        : 0;

    return {
      totalLeads,
      totalConversations,
      activeConversations,
      completedConversations,
      conversionRate: Math.round(conversionRate * 100) / 100,
      totalRevenue: totalRevenue._sum.saleAmount || 0,
      totalAgents,
      avgResponseTime,
    };
  },

  /**
   * Get agent performance metrics
   */
  getAgentPerformance: async (input: GetAgentPerformanceInput, companyId: string) => {
    const where: any = { companyId };

    if (input.userId) {
      where.assignedTo = input.userId;
    }

    if (input.startDate || input.endDate) {
      where.createdAt = {};
      if (input.startDate) where.createdAt.gte = input.startDate;
      if (input.endDate) where.createdAt.lte = input.endDate;
    }

    const agents = await prisma.user.findMany({
      where: {
        companyId,
        role: "company_user",
        status: "active",
      },
    });

    const performance = await Promise.all(
      agents.map(async (agent) => {
        const agentWhere = {
          ...where,
          assignedTo: agent.id,
        };

        const [
          totalConversations,
          completedConversations,
          totalRevenue,
          avgRating,
        ] = await Promise.all([
          prisma.conversation.count({ where: agentWhere }),
          prisma.conversation.count({
            where: {
              ...agentWhere,
              isSuccess: true,
            },
          }),
          prisma.conversation.aggregate({
            where: {
              ...agentWhere,
              isSuccess: true,
            },
            _sum: {
              saleAmount: true,
            },
          }),
          prisma.conversation.aggregate({
            where: agentWhere,
            _avg: {
              aiEffectivenessRating: true,
            },
          }),
        ]);

        const conversionRate =
          totalConversations > 0
            ? (completedConversations / totalConversations) * 100
            : 0;

        return {
          agentId: agent.id,
          agentName: agent.name,
          agentEmail: agent.email,
          totalConversations,
          completedConversations,
          conversionRate: Math.round(conversionRate * 100) / 100,
          totalRevenue: totalRevenue._sum.saleAmount || 0,
          avgRating: avgRating._avg.aiEffectivenessRating || 0,
        };
      })
    );

    // Filter by userId if provided
    if (input.userId) {
      return performance.filter((p) => p.agentId === input.userId);
    }

    return performance;
  },

  /**
   * Get product performance metrics
   */
  getProductPerformance: async (input: GetProductPerformanceInput, companyId: string) => {
    const conversations = await prisma.conversation.findMany({
      where: {
        companyId,
        isSuccess: true,
        productsSold: { not: null },
      },
      select: {
        productsSold: true,
        saleAmount: true,
        completedAt: true,
      },
    });

    // Aggregate product sales
    const productStats: Record<
      string,
      {
        productId: string;
        name: string;
        quantity: number;
        revenue: number;
        timesSold: number;
      }
    > = {};

    conversations.forEach((conv) => {
      if (!conv.productsSold || !Array.isArray(conv.productsSold)) return;

      conv.productsSold.forEach((item: any) => {
        const productId = item.productId;
        if (!productStats[productId]) {
          productStats[productId] = {
            productId,
            name: item.name || productId,
            quantity: 0,
            revenue: 0,
            timesSold: 0,
          };
        }

        productStats[productId].quantity += item.quantity || 1;
        productStats[productId].revenue += item.price * (item.quantity || 1);
        productStats[productId].timesSold += 1;
      });
    });

    // Get product names
    const productIds = Object.keys(productStats);
    if (productIds.length > 0) {
      const products = await prisma.product.findMany({
        where: {
          id: { in: productIds },
          companyId,
        },
        select: {
          id: true,
          name: true,
        },
      });

      products.forEach((product) => {
        if (productStats[product.id]) {
          productStats[product.id].name = product.name;
        }
      });
    }

    const stats = Object.values(productStats);

    // Filter by productId if provided
    if (input.productId) {
      return stats.filter((s) => s.productId === input.productId);
    }

    // Sort by revenue descending
    return stats.sort((a, b) => b.revenue - a.revenue);
  },

  /**
   * Get revenue metrics
   */
  getRevenue: async (input: GetRevenueInput, companyId: string) => {
    const where: any = {
      companyId,
      isSuccess: true,
      saleAmount: { not: null },
    };

    if (input.startDate || input.endDate) {
      where.completedAt = {};
      if (input.startDate) where.completedAt.gte = input.startDate;
      if (input.endDate) where.completedAt.lte = input.endDate;
    }

    const conversations = await prisma.conversation.findMany({
      where,
      select: {
        saleAmount: true,
        completedAt: true,
      },
      orderBy: {
        completedAt: "asc",
      },
    });

    // Group by period
    const grouped: Record<string, number> = {};

    conversations.forEach((conv) => {
      if (!conv.completedAt || !conv.saleAmount) return;

      const date = new Date(conv.completedAt);
      let key: string;

      if (input.groupBy === "day") {
        key = date.toISOString().split("T")[0];
      } else if (input.groupBy === "week") {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split("T")[0];
      } else {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      }

      grouped[key] = (grouped[key] || 0) + Number(conv.saleAmount);
    });

    return {
      data: Object.entries(grouped).map(([period, revenue]) => ({
        period,
        revenue,
      })),
      total: conversations.reduce(
        (sum, conv) => sum + Number(conv.saleAmount || 0),
        0
      ),
    };
  },

  /**
   * Get lead distribution (green/yellow/red)
   */
  getLeadDistribution: async (input: GetLeadDistributionInput, companyId: string) => {
    const where: any = { companyId };

    if (input.startDate || input.endDate) {
      where.lastInteraction = {};
      if (input.startDate) where.lastInteraction.gte = input.startDate;
      if (input.endDate) where.lastInteraction.lte = input.endDate;
    }

    const [green, yellow, red] = await Promise.all([
      prisma.contact.count({
        where: {
          ...where,
          scoreColor: BehaviorScoreColor.GREEN,
        },
      }),
      prisma.contact.count({
        where: {
          ...where,
          scoreColor: BehaviorScoreColor.YELLOW,
        },
      }),
      prisma.contact.count({
        where: {
          ...where,
          scoreColor: BehaviorScoreColor.RED,
        },
      }),
    ]);

    const total = green + yellow + red;

    return {
      green: {
        count: green,
        percentage: total > 0 ? Math.round((green / total) * 100) : 0,
      },
      yellow: {
        count: yellow,
        percentage: total > 0 ? Math.round((yellow / total) * 100) : 0,
      },
      red: {
        count: red,
        percentage: total > 0 ? Math.round((red / total) * 100) : 0,
      },
      total,
    };
  },
};

