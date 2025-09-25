import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConsultationsService } from './consultations.service';
import { ConsultationsController } from './consultations.controller';
import { CacheModule } from '../../common/cache/cache.module';
import { LoggerModule } from '../../common/logger/logger.module';

@Module({
  imports: [
    ConfigModule,
    CacheModule,
    LoggerModule,
  ],
  controllers: [ConsultationsController],
  providers: [ConsultationsService],
  exports: [ConsultationsService],
})
export class ConsultationsModule {}
