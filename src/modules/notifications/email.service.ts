import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransporter({
      host: this.configService.get<string>('email.smtp.host'),
      port: this.configService.get<number>('email.smtp.port'),
      secure: false,
      auth: {
        user: this.configService.get<string>('email.smtp.user'),
        pass: this.configService.get<string>('email.smtp.pass'),
      },
    });
  }

  async sendEmail(customerId: string, subject: string, content: string) {
    try {
      // Get customer email
      // This would typically fetch from database
      const customerEmail = 'customer@example.com'; // Replace with actual customer email

      await this.transporter.sendMail({
        from: this.configService.get<string>('email.smtp.user'),
        to: customerEmail,
        subject,
        html: content,
      });

      this.logger.log(`Email sent to customer ${customerId}`);
    } catch (error) {
      this.logger.error('Error sending email:', error);
      throw error;
    }
  }
}
