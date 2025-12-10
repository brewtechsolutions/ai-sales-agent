import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CalendarService } from './calendar.service';
import { CalendarController } from './calendar.controller';
import { GoogleCalendarService } from './google-calendar.service';
import { CacheModule } from '../../common/cache/cache.module';
import { LoggerModule } from '../../common/logger/logger.module';

@Module({
  imports: [
    ConfigModule,
    CacheModule,
    LoggerModule,
  ],
  controllers: [CalendarController],
  providers: [
    CalendarService,
    GoogleCalendarService,
  ],
  exports: [
    CalendarService,
    GoogleCalendarService,
  ],
})
export class CalendarModule {}
