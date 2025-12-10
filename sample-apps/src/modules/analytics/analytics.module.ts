import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { CacheModule } from '../../common/cache/cache.module';
import { LoggerModule } from '../../common/logger/logger.module';

@Module({
  imports: [
    ConfigModule,
    CacheModule,
    LoggerModule,
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
