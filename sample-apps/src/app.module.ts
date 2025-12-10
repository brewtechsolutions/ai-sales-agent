import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';

// Core modules
import { DatabaseModule } from './database/database.module';
import { CacheModule } from './common/cache/cache.module';
import { LoggerModule } from './common/logger/logger.module';

// Feature modules
import { AiAgentModule } from './modules/ai-agent/ai-agent.module';
import { CalendarModule } from './modules/calendar/calendar.module';
import { ProductsModule } from './modules/products/products.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { CustomersModule } from './modules/customers/customers.module';
import { ConsultationsModule } from './modules/consultations/consultations.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';

// Controllers
import { HealthController } from './health.controller';

// Configuration
import { configuration } from './config/configuration';
import { validationSchema } from './config/validation';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
      envFilePath: ['.env.local', '.env'],
    }),

    // Rate limiting
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ttl: configService.get<number>('RATE_LIMIT_TTL', 60),
        limit: configService.get<number>('RATE_LIMIT_LIMIT', 100),
      }),
      inject: [ConfigService],
    }),

    // Background jobs
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('redis.host'),
          port: configService.get<number>('redis.port'),
          password: configService.get<string>('redis.password'),
          db: configService.get<number>('redis.db'),
        },
      }),
      inject: [ConfigService],
    }),

    // Task scheduling
    ScheduleModule.forRoot(),

    // Core modules
    DatabaseModule,
    CacheModule,
    LoggerModule,

    // Feature modules
    AiAgentModule,
    CalendarModule,
    ProductsModule,
    PaymentsModule,
    CustomersModule,
    ConsultationsModule,
    AnalyticsModule,
    NotificationsModule,
    AuthModule,
    AdminModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}