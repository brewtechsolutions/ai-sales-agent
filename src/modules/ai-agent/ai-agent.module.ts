import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiAgentService } from './ai-agent.service';
import { AiAgentController } from './ai-agent.controller';
import { ConversationService } from './conversation.service';
import { CulturalContextService } from './cultural-context.service';
import { LanguageDetectionService } from './language-detection.service';
import { OpenAIService } from './providers/openai.service';
import { ClaudeService } from './providers/claude.service';
import { CacheModule } from '../../common/cache/cache.module';
import { LoggerModule } from '../../common/logger/logger.module';

@Module({
  imports: [
    ConfigModule,
    CacheModule,
    LoggerModule,
  ],
  controllers: [AiAgentController],
  providers: [
    AiAgentService,
    ConversationService,
    CulturalContextService,
    LanguageDetectionService,
    OpenAIService,
    ClaudeService,
  ],
  exports: [
    AiAgentService,
    ConversationService,
    CulturalContextService,
    LanguageDetectionService,
  ],
})
export class AiAgentModule {}
