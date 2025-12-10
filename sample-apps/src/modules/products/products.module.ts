import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductRecommendationService } from './product-recommendation.service';
import { CacheModule } from '../../common/cache/cache.module';
import { LoggerModule } from '../../common/logger/logger.module';

@Module({
  imports: [
    ConfigModule,
    CacheModule,
    LoggerModule,
  ],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    ProductRecommendationService,
  ],
  exports: [
    ProductsService,
    ProductRecommendationService,
  ],
})
export class ProductsModule {}
