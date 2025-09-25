import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { WinstonLogger } from 'nest-winston';

@Injectable()
export class LoggerService extends WinstonLogger implements NestLoggerService {
  // Custom logging methods for business context
  logConversation(conversationId: string, message: string, metadata?: any) {
    this.log(message, {
      context: 'Conversation',
      conversationId,
      ...metadata,
    });
  }

  logPayment(paymentId: string, message: string, metadata?: any) {
    this.log(message, {
      context: 'Payment',
      paymentId,
      ...metadata,
    });
  }

  logAI(provider: string, message: string, metadata?: any) {
    this.log(message, {
      context: 'AI',
      provider,
      ...metadata,
    });
  }

  logCalendar(calendarId: string, message: string, metadata?: any) {
    this.log(message, {
      context: 'Calendar',
      calendarId,
      ...metadata,
    });
  }

  logAnalytics(event: string, message: string, metadata?: any) {
    this.log(message, {
      context: 'Analytics',
      event,
      ...metadata,
    });
  }

  logSecurity(event: string, message: string, metadata?: any) {
    this.warn(message, {
      context: 'Security',
      event,
      ...metadata,
    });
  }

  logPerformance(operation: string, duration: number, metadata?: any) {
    this.log(`Performance: ${operation} took ${duration}ms`, {
      context: 'Performance',
      operation,
      duration,
      ...metadata,
    });
  }

  logError(error: Error, context?: string, metadata?: any) {
    this.error(error.message, {
      context: context || 'Error',
      stack: error.stack,
      ...metadata,
    });
  }
}
