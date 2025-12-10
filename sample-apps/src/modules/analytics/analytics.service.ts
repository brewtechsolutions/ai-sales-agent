import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CacheService } from '../../common/cache/cache.service';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService,
  ) {}

  async getConversationAnalytics() {
    try {
      const cacheKey = 'conversation_analytics';
      
      const cached = await this.cacheService.get<any>(cacheKey);
      if (cached) {
        return cached;
      }

      const [
        totalConversations,
        activeConversations,
        completedConversations,
        averageResponseTime,
        languageDistribution,
      ] = await Promise.all([
        this.prisma.conversation.count(),
        this.prisma.conversation.count({ where: { isActive: true } }),
        this.prisma.conversation.count({ where: { conversationStage: 'NATURAL_END' } }),
        this.prisma.conversationAnalytics.aggregate({
          _avg: { avgResponseTime: true },
        }),
        this.prisma.conversation.groupBy({
          by: ['language'],
          _count: { language: true },
        }),
      ]);

      const analytics = {
        totalConversations,
        activeConversations,
        completedConversations,
        completionRate: totalConversations > 0 ? (completedConversations / totalConversations) * 100 : 0,
        averageResponseTime: averageResponseTime._avg.avgResponseTime || 0,
        languageDistribution: languageDistribution.map(lang => ({
          language: lang.language,
          count: lang._count.language,
        })),
        lastUpdated: new Date().toISOString(),
      };

      await this.cacheService.set(cacheKey, analytics, 3600);
      return analytics;
    } catch (error) {
      this.logger.error('Error getting conversation analytics:', error);
      throw new Error('Failed to get conversation analytics');
    }
  }

  async getSalesAnalytics() {
    try {
      const cacheKey = 'sales_analytics';
      
      const cached = await this.cacheService.get<any>(cacheKey);
      if (cached) {
        return cached;
      }

      const [
        totalRevenue,
        totalOrders,
        averageOrderValue,
        conversionRate,
        topProducts,
      ] = await Promise.all([
        this.prisma.payment.aggregate({
          _sum: { amount: true },
          where: { status: 'COMPLETED' },
        }),
        this.prisma.payment.count({ where: { status: 'COMPLETED' } }),
        this.prisma.payment.aggregate({
          _avg: { amount: true },
          where: { status: 'COMPLETED' },
        }),
        this.calculateConversionRate(),
        this.getTopProducts(),
      ]);

      const analytics = {
        totalRevenue: totalRevenue._sum.amount || 0,
        totalOrders,
        averageOrderValue: averageOrderValue._avg.amount || 0,
        conversionRate,
        topProducts,
        lastUpdated: new Date().toISOString(),
      };

      await this.cacheService.set(cacheKey, analytics, 3600);
      return analytics;
    } catch (error) {
      this.logger.error('Error getting sales analytics:', error);
      throw new Error('Failed to get sales analytics');
    }
  }

  private async calculateConversionRate(): Promise<number> {
    try {
      const totalConversations = await this.prisma.conversation.count();
      const completedPayments = await this.prisma.payment.count({
        where: { status: 'COMPLETED' },
      });

      return totalConversations > 0 ? (completedPayments / totalConversations) * 100 : 0;
    } catch (error) {
      this.logger.error('Error calculating conversion rate:', error);
      return 0;
    }
  }

  private async getTopProducts(): Promise<any[]> {
    try {
      const recommendations = await this.prisma.productRecommendation.groupBy({
        by: ['productId'],
        _count: { productId: true },
        orderBy: { _count: { productId: 'desc' } },
        take: 10,
      });

      return recommendations.map(rec => ({
        productId: rec.productId,
        recommendationCount: rec._count.productId,
      }));
    } catch (error) {
      this.logger.error('Error getting top products:', error);
      return [];
    }
  }
}
