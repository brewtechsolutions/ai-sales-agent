import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CacheService } from '../../common/cache/cache.service';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService,
  ) {}

  async getDashboardStats() {
    try {
      const cacheKey = 'admin_dashboard_stats';
      
      const cached = await this.cacheService.get<any>(cacheKey);
      if (cached) {
        return cached;
      }

      const [
        totalCustomers,
        totalConversations,
        totalConsultations,
        totalPayments,
        totalRevenue,
        activeConversations,
      ] = await Promise.all([
        this.prisma.customer.count(),
        this.prisma.conversation.count(),
        this.prisma.consultation.count(),
        this.prisma.payment.count(),
        this.prisma.payment.aggregate({
          _sum: { amount: true },
          where: { status: 'COMPLETED' },
        }),
        this.prisma.conversation.count({ where: { isActive: true } }),
      ]);

      const stats = {
        totalCustomers,
        totalConversations,
        totalConsultations,
        totalPayments,
        totalRevenue: totalRevenue._sum.amount || 0,
        activeConversations,
        lastUpdated: new Date().toISOString(),
      };

      await this.cacheService.set(cacheKey, stats, 300); // Cache for 5 minutes
      return stats;
    } catch (error) {
      this.logger.error('Error getting dashboard stats:', error);
      throw new Error('Failed to get dashboard stats');
    }
  }

  async getSystemHealth() {
    try {
      // Check database connection
      await this.prisma.$queryRaw`SELECT 1`;
      
      // Check cache
      await this.cacheService.set('health_check', 'ok', 10);
      const cacheStatus = await this.cacheService.get('health_check');

      return {
        status: 'healthy',
        database: 'connected',
        cache: cacheStatus ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Error checking system health:', error);
      return {
        status: 'unhealthy',
        database: 'disconnected',
        cache: 'unknown',
        timestamp: new Date().toISOString(),
        error: error.message,
      };
    }
  }
}
