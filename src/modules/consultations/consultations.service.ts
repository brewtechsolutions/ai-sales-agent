import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CacheService } from '../../common/cache/cache.service';

@Injectable()
export class ConsultationsService {
  private readonly logger = new Logger(ConsultationsService.name);

  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService,
  ) {}

  async getConsultations(page: number = 1, limit: number = 10, status?: string) {
    try {
      const where: any = {};
      if (status) {
        where.status = status;
      }

      const result = await this.prisma.paginate(
        this.prisma.consultation,
        page,
        limit,
        where,
        { scheduledAt: 'desc' },
      );

      return result;
    } catch (error) {
      this.logger.error('Error getting consultations:', error);
      throw new Error('Failed to get consultations');
    }
  }

  async getConsultation(id: string) {
    try {
      const consultation = await this.prisma.consultation.findUnique({
        where: { id },
        include: {
          customer: true,
          product: true,
        },
      });

      if (!consultation) {
        throw new Error('Consultation not found');
      }

      return consultation;
    } catch (error) {
      this.logger.error('Error getting consultation:', error);
      throw error;
    }
  }

  async updateConsultationStatus(id: string, status: string, notes?: string) {
    try {
      const consultation = await this.prisma.consultation.update({
        where: { id },
        data: {
          status: status as any,
          notes: notes || undefined,
        },
      });

      this.logger.log(`Updated consultation status: ${id} to ${status}`);
      return consultation;
    } catch (error) {
      this.logger.error('Error updating consultation status:', error);
      throw error;
    }
  }
}
