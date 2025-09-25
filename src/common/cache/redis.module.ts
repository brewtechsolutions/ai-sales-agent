import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

@Module({})
export class RedisModule {
  static forRootAsync(): DynamicModule {
    return {
      module: RedisModule,
      imports: [ConfigModule],
      providers: [
        {
          provide: 'REDIS_CLIENT',
          useFactory: async (configService: ConfigService): Promise<RedisClientType | null> => {
            const isRedisEnabled = configService.get<boolean>('redis.enabled', false);
            
            if (!isRedisEnabled) {
              return null;
            }

            const client = createClient({
              socket: {
                host: configService.get<string>('redis.host'),
                port: configService.get<number>('redis.port'),
              },
              password: configService.get<string>('redis.password'),
              database: configService.get<number>('redis.db'),
            });

            client.on('error', (err) => {
              console.error('Redis Client Error:', err);
            });

            client.on('connect', () => {
              console.log('✅ Redis connected successfully');
            });

            await client.connect();
            return client;
          },
          inject: [ConfigService],
        },
      ],
      exports: ['REDIS_CLIENT'],
    };
  }
}
