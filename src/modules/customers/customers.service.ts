import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CacheService } from '../../common/cache/cache.service';

@Injectable()
export class CustomersService {
  private readonly logger = new Logger(CustomersService.name);

  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService,
  ) {}

  async createCustomer(customerData: {
    email?: string;
    phone?: string;
    name?: string;
    preferredLanguage?: string;
    timezone?: string;
  }) {
    try {
      const customer = await this.prisma.customer.create({
        data: {
          email: customerData.email,
          phone: customerData.phone,
          name: customerData.name,
          preferredLanguage: customerData.preferredLanguage as any || 'EN',
          timezone: customerData.timezone || 'Asia/Kuala_Lumpur',
        },
      });

      this.logger.log(`Created customer: ${customer.id}`);
      return customer;
    } catch (error) {
      this.logger.error('Error creating customer:', error);
      throw error;
    }
  }

  async getCustomer(id: string) {
    try {
      const customer = await this.prisma.customer.findUnique({
        where: { id },
        include: {
          conversations: {
            orderBy: { lastActivityAt: 'desc' },
            take: 5,
          },
          consultations: {
            orderBy: { scheduledAt: 'desc' },
            take: 5,
          },
          payments: {
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
        },
      });

      if (!customer) {
        throw new Error('Customer not found');
      }

      return customer;
    } catch (error) {
      this.logger.error('Error getting customer:', error);
      throw error;
    }
  }

  async updateCustomer(id: string, updateData: any) {
    try {
      const customer = await this.prisma.customer.update({
        where: { id },
        data: updateData,
      });

      this.logger.log(`Updated customer: ${id}`);
      return customer;
    } catch (error) {
      this.logger.error('Error updating customer:', error);
      throw error;
    }
  }

  async getCustomers(page: number = 1, limit: number = 10, search?: string) {
    try {
      const where: any = {};
      
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } },
        ];
      }

      const result = await this.prisma.paginate(
        this.prisma.customer,
        page,
        limit,
        where,
        { createdAt: 'desc' },
      );

      return result;
    } catch (error) {
      this.logger.error('Error getting customers:', error);
      throw new Error('Failed to get customers');
    }
  }
}
