import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { EmailService } from './email.service';
import { SmsService } from './sms.service';
import { CacheModule } from '../../common/cache/cache.module';
import { LoggerModule } from '../../common/logger/logger.module';

@Module({
  imports: [
    ConfigModule,
    CacheModule,
    LoggerModule,
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    EmailService,
    SmsService,
  ],
  exports: [
    NotificationsService,
    EmailService,
    SmsService,
  ],
})
export class NotificationsModule {}
