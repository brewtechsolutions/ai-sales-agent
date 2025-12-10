import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { CurlecService } from './curlec.service';
import { CacheModule } from '../../common/cache/cache.module';
import { LoggerModule } from '../../common/logger/logger.module';

@Module({
  imports: [
    ConfigModule,
    CacheModule,
    LoggerModule,
  ],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    CurlecService,
  ],
  exports: [
    PaymentsService,
    CurlecService,
  ],
})
export class PaymentsModule {}
