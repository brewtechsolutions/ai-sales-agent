import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AiAgentService } from './ai-agent.service';
import { OptionalAuthGuard } from '../../common/guards/optional-auth.guard';
import { ChatMessageDto } from './interfaces/conversation.interface';
import { CreateChatMessageDto, UpdateSalesPersonaDto, ConversationAnalyticsDto } from './dto/ai-agent.dto';

@ApiTags('AI Agent')
@Controller('api/ai-agent')
@UseGuards(OptionalAuthGuard)
export class AiAgentController {
  constructor(private readonly aiAgentService: AiAgentService) {}

  @Post('chat/message')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send a message to the AI agent' })
  @ApiResponse({ status: 200, description: 'AI response generated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async handleMessage(@Body() createChatMessageDto: CreateChatMessageDto) {
    const messageDto: ChatMessageDto = {
      sessionId: createChatMessageDto.sessionId,
      customerId: createChatMessageDto.customerId,
      message: createChatMessageDto.message,
      platform: createChatMessageDto.platform,
      language: createChatMessageDto.language,
      metadata: createChatMessageDto.metadata,
    };

    return await this.aiAgentService.processMessage(messageDto);
  }

  @Post('webhook/:platform')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Handle webhook from chatbot platforms' })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid webhook data' })
  async handleWebhook(
    @Param('platform') platform: string,
    @Body() webhookData: any,
  ) {
    // Process webhook data and convert to ChatMessageDto
    const messageDto = this.convertWebhookToMessageDto(platform, webhookData);
    return await this.aiAgentService.processMessage(messageDto);
  }

  @Get('conversation/:sessionId')
  @ApiOperation({ summary: 'Get conversation context' })
  @ApiResponse({ status: 200, description: 'Conversation context retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async getConversationContext(@Param('sessionId') sessionId: string) {
    return await this.aiAgentService.getConversationContext(sessionId);
  }

  @Put('conversation/:sessionId/sales-persona')
  @ApiOperation({ summary: 'Update sales persona configuration' })
  @ApiResponse({ status: 200, description: 'Sales persona updated successfully' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async updateSalesPersona(
    @Param('sessionId') sessionId: string,
    @Body() updateSalesPersonaDto: UpdateSalesPersonaDto,
  ) {
    await this.aiAgentService.updateSalesPersona(sessionId, updateSalesPersonaDto);
    return { message: 'Sales persona updated successfully' };
  }

  @Post('conversation/:sessionId/end')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'End conversation' })
  @ApiResponse({ status: 200, description: 'Conversation ended successfully' })
  async endConversation(@Param('sessionId') sessionId: string) {
    await this.aiAgentService.endConversation(sessionId);
    return { message: 'Conversation ended successfully' };
  }

  @Get('conversation/:sessionId/analytics')
  @ApiOperation({ summary: 'Get conversation analytics' })
  @ApiResponse({ status: 200, description: 'Analytics retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async getConversationAnalytics(@Param('sessionId') sessionId: string) {
    return await this.aiAgentService.getConversationAnalytics(sessionId);
  }

  @Post('products/recommendations')
  @ApiOperation({ summary: 'Generate product recommendations' })
  @ApiResponse({ status: 200, description: 'Recommendations generated successfully' })
  async generateProductRecommendations(
    @Body() body: { sessionId: string; products: any[] },
  ) {
    return await this.aiAgentService.generateProductRecommendations(
      body.sessionId,
      body.products,
    );
  }

  @Post('sentiment/analyze')
  @ApiOperation({ summary: 'Analyze message sentiment' })
  @ApiResponse({ status: 200, description: 'Sentiment analyzed successfully' })
  async analyzeSentiment(
    @Body() body: { message: string; language: string },
  ) {
    return await this.aiAgentService.analyzeSentiment(
      body.message,
      body.language as any,
    );
  }

  @Get('health')
  @ApiOperation({ summary: 'Check AI agent health' })
  @ApiResponse({ status: 200, description: 'AI agent is healthy' })
  async healthCheck() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      provider: process.env.AI_PROVIDER || 'openai',
    };
  }

  private convertWebhookToMessageDto(platform: string, webhookData: any): ChatMessageDto {
    // Convert different platform webhooks to standardized ChatMessageDto
    switch (platform.toLowerCase()) {
      case 'whatsapp':
        return {
          sessionId: webhookData.sessionId || webhookData.from,
          customerId: webhookData.customerId,
          message: webhookData.message || webhookData.text,
          platform: 'whatsapp',
          language: this.detectLanguageFromText(webhookData.message || webhookData.text),
          metadata: {
            from: webhookData.from,
            to: webhookData.to,
            messageId: webhookData.messageId,
            timestamp: webhookData.timestamp,
          },
        };

      case 'telegram':
        return {
          sessionId: webhookData.sessionId || webhookData.chat?.id?.toString(),
          customerId: webhookData.customerId,
          message: webhookData.message?.text || webhookData.text,
          platform: 'telegram',
          language: this.detectLanguageFromText(webhookData.message?.text || webhookData.text),
          metadata: {
            chatId: webhookData.chat?.id,
            userId: webhookData.from?.id,
            messageId: webhookData.message?.message_id,
            timestamp: webhookData.message?.date,
          },
        };

      case 'facebook':
        return {
          sessionId: webhookData.sessionId || webhookData.sender?.id,
          customerId: webhookData.customerId,
          message: webhookData.message?.text || webhookData.text,
          platform: 'facebook',
          language: this.detectLanguageFromText(webhookData.message?.text || webhookData.text),
          metadata: {
            senderId: webhookData.sender?.id,
            recipientId: webhookData.recipient?.id,
            messageId: webhookData.message?.mid,
            timestamp: webhookData.timestamp,
          },
        };

      default:
        return {
          sessionId: webhookData.sessionId || 'unknown',
          customerId: webhookData.customerId,
          message: webhookData.message || webhookData.text || '',
          platform: platform,
          language: this.detectLanguageFromText(webhookData.message || webhookData.text || ''),
          metadata: webhookData,
        };
    }
  }

  private detectLanguageFromText(text: string): any {
    // Simple language detection - in production, use the LanguageDetectionService
    if (!text) return 'EN';
    
    const lowerText = text.toLowerCase();
    
    // Check for Chinese characters
    if (/[\u4e00-\u9fff]/.test(text)) return 'ZH';
    
    // Check for Malay keywords
    if (/\b(saya|anda|terima kasih|selamat|bagaimana|boleh|tidak|ya)\b/.test(lowerText)) {
      return 'MS';
    }
    
    // Default to English
    return 'EN';
  }
}
