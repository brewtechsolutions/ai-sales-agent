import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CacheService } from '../../common/cache/cache.service';
import { CurlecService, PaymentOrder, Refund } from './curlec.service';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService,
    private curlecService: CurlecService,
  ) {}

  /**
   * Create a payment
   */
  async createPayment(
    customerId: string,
    amount: number,
    currency: string = 'MYR',
    description?: string,
    metadata?: Record<string, any>,
  ) {
    try {
      // Create payment intent with Curlec
    const paymentOrder = await this.curlecService.createPaymentOrder(
      amount,
      currency,
      customerId,
      description,
      metadata,
    );

      // Save payment to database
      const payment = await this.prisma.payment.create({
        data: {
          customerId,
          amount,
          currency,
          status: 'PENDING',
          transactionId: paymentOrder.id,
          metadata: {
            ...metadata,
            orderId: paymentOrder.id,
            receipt: paymentOrder.receipt,
          },
        },
      });

      this.logger.log(`Created payment: ${payment.id}`);
      return {
        ...payment,
        orderId: paymentOrder.id,
        receipt: paymentOrder.receipt,
      };
    } catch (error) {
      this.logger.error('Error creating payment:', error);
      throw error;
    }
  }

  /**
   * Confirm a payment
   */
  async confirmPayment(
    paymentId: string,
    paymentMethodId: string,
  ) {
    try {
      const payment = await this.prisma.payment.findUnique({
        where: { id: paymentId },
      });

      if (!payment) {
        throw new Error('Payment not found');
      }

      if (payment.status !== 'PENDING') {
        throw new Error('Payment is not in pending status');
      }

      // Verify payment with Razorpay
      const isValid = await this.curlecService.verifyPaymentSignature(
        payment.transactionId, // This should be the order ID
        paymentMethodId, // This should be the payment ID
        payment.metadata?.razorpaySignature || '', // This should come from the frontend
      );

      if (!isValid) {
        throw new Error('Invalid payment signature');
      }

      // Update payment status
      const updatedPayment = await this.prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: 'COMPLETED',
          metadata: {
            ...payment.metadata,
            verified: true,
            verifiedAt: new Date().toISOString(),
          },
        },
      });

      this.logger.log(`Confirmed payment: ${paymentId}`);
      return updatedPayment;
    } catch (error) {
      this.logger.error('Error confirming payment:', error);
      throw error;
    }
  }

  /**
   * Get payment by ID
   */
  async getPayment(paymentId: string) {
    try {
      const payment = await this.prisma.payment.findUnique({
        where: { id: paymentId },
        include: {
          customer: true,
        },
      });

      if (!payment) {
        throw new Error('Payment not found');
      }

      return payment;
    } catch (error) {
      this.logger.error('Error getting payment:', error);
      throw error;
    }
  }

  /**
   * Get customer payments
   */
  async getCustomerPayments(customerId: string, page: number = 1, limit: number = 10) {
    try {
      const result = await this.prisma.paginate(
        this.prisma.payment,
        page,
        limit,
        { customerId },
        { createdAt: 'desc' },
      );

      return result;
    } catch (error) {
      this.logger.error('Error getting customer payments:', error);
      throw new Error('Failed to get customer payments');
    }
  }

  /**
   * Create a refund
   */
  async createRefund(
    paymentId: string,
    amount?: number,
    reason?: string,
  ) {
    try {
      const payment = await this.prisma.payment.findUnique({
        where: { id: paymentId },
      });

      if (!payment) {
        throw new Error('Payment not found');
      }

      if (payment.status !== 'COMPLETED') {
        throw new Error('Payment must be completed to create refund');
      }

      // Create refund with Curlec
      const refund = await this.curlecService.createRefund(
        payment.transactionId,
        amount,
        reason,
      );

      // Update payment status
      const updatedPayment = await this.prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: 'REFUNDED',
          metadata: {
            ...payment.metadata,
            refundId: refund.id,
            refundAmount: refund.amount,
            refundReason: reason,
          },
        },
      });

      this.logger.log(`Created refund for payment: ${paymentId}`);
      return {
        payment: updatedPayment,
        refund,
      };
    } catch (error) {
      this.logger.error('Error creating refund:', error);
      throw error;
    }
  }

  /**
   * Get payment analytics
   */
  async getPaymentAnalytics() {
    try {
      const cacheKey = 'payment_analytics';
      
      // Try to get from cache first
      const cached = await this.cacheService.get<any>(cacheKey);
      if (cached) {
        return cached;
      }

      const [
        totalPayments,
        completedPayments,
        failedPayments,
        totalAmount,
        averageAmount,
        paymentMethods,
        dailyStats,
      ] = await Promise.all([
        this.prisma.payment.count(),
        this.prisma.payment.count({ where: { status: 'COMPLETED' } }),
        this.prisma.payment.count({ where: { status: 'FAILED' } }),
        this.prisma.payment.aggregate({
          _sum: { amount: true },
          where: { status: 'COMPLETED' },
        }),
        this.prisma.payment.aggregate({
          _avg: { amount: true },
          where: { status: 'COMPLETED' },
        }),
        this.prisma.payment.groupBy({
          by: ['paymentMethod'],
          _count: { paymentMethod: true },
          where: { status: 'COMPLETED' },
        }),
        this.getDailyPaymentStats(),
      ]);

      const analytics = {
        totalPayments,
        completedPayments,
        failedPayments,
        successRate: totalPayments > 0 ? (completedPayments / totalPayments) * 100 : 0,
        totalAmount: totalAmount._sum.amount || 0,
        averageAmount: averageAmount._avg.amount || 0,
        paymentMethods: paymentMethods.map(pm => ({
          method: pm.paymentMethod,
          count: pm._count.paymentMethod,
        })),
        dailyStats,
        lastUpdated: new Date().toISOString(),
      };

      // Cache for 1 hour
      await this.cacheService.set(cacheKey, analytics, 3600);

      return analytics;
    } catch (error) {
      this.logger.error('Error getting payment analytics:', error);
      throw new Error('Failed to get payment analytics');
    }
  }

  /**
   * Get available payment methods
   */
  async getAvailablePaymentMethods() {
    try {
      return await this.curlecService.getAvailablePaymentMethods();
    } catch (error) {
      this.logger.error('Error getting payment methods:', error);
      return [];
    }
  }

  /**
   * Process webhook event
   */
  async processWebhookEvent(event: any) {
    try {
      // Verify webhook signature
      const isValid = this.curlecService.verifyWebhookSignature(
        JSON.stringify(event),
        event.signature || '',
      );

      if (!isValid) {
        throw new Error('Invalid webhook signature');
      }

      // Process the event
      await this.curlecService.processWebhookEvent(event);

      this.logger.log(`Processed webhook event: ${event.type}`);
    } catch (error) {
      this.logger.error('Error processing webhook event:', error);
      throw error;
    }
  }

  private async getDailyPaymentStats(days: number = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const payments = await this.prisma.payment.findMany({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
        select: {
          amount: true,
          status: true,
          createdAt: true,
        },
      });

      // Group by date
      const dailyStats = payments.reduce((acc, payment) => {
        const date = payment.createdAt.toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = {
            date,
            totalAmount: 0,
            completedCount: 0,
            failedCount: 0,
          };
        }
        
        acc[date].totalAmount += payment.amount;
        if (payment.status === 'COMPLETED') {
          acc[date].completedCount++;
        } else if (payment.status === 'FAILED') {
          acc[date].failedCount++;
        }
        
        return acc;
      }, {} as Record<string, any>);

      return Object.values(dailyStats).sort((a: any, b: any) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    } catch (error) {
      this.logger.error('Error getting daily payment stats:', error);
      return [];
    }
  }
}
