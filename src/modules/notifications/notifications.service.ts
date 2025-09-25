import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { EmailService } from './email.service';
import { SmsService } from './sms.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private smsService: SmsService,
  ) {}

  async sendNotification(
    customerId: string,
    type: 'EMAIL' | 'SMS' | 'PUSH' | 'WHATSAPP',
    title: string,
    content: string,
    metadata?: any,
  ) {
    try {
      // Create notification record
      const notification = await this.prisma.notification.create({
        data: {
          customerId,
          type: type as any,
          title,
          content,
          metadata: metadata || {},
        },
      });

      // Send notification based on type
      switch (type) {
        case 'EMAIL':
          await this.emailService.sendEmail(customerId, title, content);
          break;
        case 'SMS':
          await this.smsService.sendSms(customerId, content);
          break;
        default:
          this.logger.warn(`Unsupported notification type: ${type}`);
      }

      // Update notification status
      await this.prisma.notification.update({
        where: { id: notification.id },
        data: {
          isSent: true,
          sentAt: new Date(),
        },
      });

      this.logger.log(`Sent ${type} notification: ${notification.id}`);
      return notification;
    } catch (error) {
      this.logger.error('Error sending notification:', error);
      throw error;
    }
  }

  async getNotifications(customerId: string, page: number = 1, limit: number = 10) {
    try {
      const result = await this.prisma.paginate(
        this.prisma.notification,
        page,
        limit,
        { customerId },
        { createdAt: 'desc' },
      );

      return result;
    } catch (error) {
      this.logger.error('Error getting notifications:', error);
      throw new Error('Failed to get notifications');
    }
  }
}
