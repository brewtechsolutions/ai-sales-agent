import { Global, Module, DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheService } from './cache.service';
import { RedisModule } from './redis.module';

@Global()
@Module({})
export class CacheModule {
  static forRoot(): DynamicModule {
    return {
      module: CacheModule,
      imports: [
        ConfigModule,
        RedisModule,
      ],
      providers: [CacheService],
      exports: [CacheService],
    };
  }
}
