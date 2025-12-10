import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { CacheModule } from '../../common/cache/cache.module';
import { LoggerModule } from '../../common/logger/logger.module';

@Module({
  imports: [
    ConfigModule,
    CacheModule,
    LoggerModule,
  ],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService],
})
export class CustomersModule {}
