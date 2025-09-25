import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConversationService } from './conversation.service';
import { CulturalContextService } from './cultural-context.service';
import { LanguageDetectionService } from './language-detection.service';
import { OpenAIService } from './providers/openai.service';
import { ClaudeService } from './providers/claude.service';
import { 
  AIResponse, 
  ChatMessageDto, 
  ConversationContext,
  Language,
  ConversationStage 
} from './interfaces/conversation.interface';

@Injectable()
export class AiAgentService {
  private readonly logger = new Logger(AiAgentService.name);
  private readonly aiProvider: string;

  constructor(
    private configService: ConfigService,
    private conversationService: ConversationService,
    private culturalContextService: CulturalContextService,
    private languageDetectionService: LanguageDetectionService,
    private openaiService: OpenAIService,
    private claudeService: ClaudeService,
  ) {
    this.aiProvider = this.configService.get<string>('ai.provider', 'openai');
  }

  /**
   * Process incoming chat message and generate AI response
   */
  async processMessage(messageDto: ChatMessageDto): Promise<AIResponse> {
    try {
      this.logger.log(`Processing message for session: ${messageDto.sessionId}`);

      // Process the chat message and get conversation context
      const context = await this.conversationService.processChatMessage(messageDto);

      // Generate AI response
      const aiResponse = await this.generateAIResponse(context, messageDto.message);

      // Add AI response to conversation
      await this.conversationService.addMessage(
        messageDto.sessionId,
        'assistant',
        aiResponse.message,
        {
          provider: this.aiProvider,
          confidence: aiResponse.confidence,
          intent: aiResponse.intent,
          stage: aiResponse.conversationStage,
          suggestions: aiResponse.suggestions,
          nextActions: aiResponse.nextActions,
        },
      );

      // Update conversation context with AI response
      context.conversationHistory.push({
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: aiResponse.message,
        timestamp: new Date(),
        metadata: {
          provider: this.aiProvider,
          confidence: aiResponse.confidence,
          intent: aiResponse.intent,
          stage: aiResponse.conversationStage,
        },
      });

      context.language = aiResponse.language;
      context.conversationStage = aiResponse.conversationStage;
      context.currentIntent = aiResponse.intent || context.currentIntent;
      context.lastActivityAt = new Date();

      await this.conversationService.updateConversationContext(context);

      // Log conversation analytics
      this.logConversationAnalytics(context, aiResponse);

      return aiResponse;
    } catch (error) {
      this.logger.error('Error processing message:', error);
      throw error;
    }
  }

  /**
   * Generate AI response based on conversation context
   */
  async generateAIResponse(
    context: ConversationContext,
    userMessage: string,
  ): Promise<AIResponse> {
    try {
      let aiResponse: AIResponse;

      // Choose AI provider
      if (this.aiProvider === 'claude') {
        aiResponse = await this.claudeService.generateResponse(context, userMessage);
      } else {
        aiResponse = await this.openaiService.generateResponse(context, userMessage);
      }

      // Enhance response with cultural context
      aiResponse = await this.enhanceResponseWithCulturalContext(aiResponse, context);

      // Validate and improve response
      aiResponse = this.validateAndImproveResponse(aiResponse, context);

      return aiResponse;
    } catch (error) {
      this.logger.error('Error generating AI response:', error);
      
      // Fallback response
      return this.generateFallbackResponse(context, userMessage);
    }
  }

  /**
   * Generate product recommendations
   */
  async generateProductRecommendations(
    sessionId: string,
    products: any[],
  ): Promise<string[]> {
    try {
      const context = await this.conversationService.getConversationContext(sessionId);
      if (!context) {
        return [];
      }

      let recommendations: string[];

      if (this.aiProvider === 'claude') {
        recommendations = await this.claudeService.generateProductRecommendations(context, products);
      } else {
        recommendations = await this.openaiService.generateProductRecommendations(context, products);
      }

      return recommendations;
    } catch (error) {
      this.logger.error('Error generating product recommendations:', error);
      return [];
    }
  }

  /**
   * Analyze customer sentiment
   */
  async analyzeSentiment(message: string, language: Language): Promise<{
    sentiment: 'positive' | 'neutral' | 'negative';
    confidence: number;
    emotions: string[];
  }> {
    try {
      if (this.aiProvider === 'claude') {
        return await this.claudeService.analyzeSentiment(message, language);
      } else {
        return await this.openaiService.analyzeSentiment(message, language);
      }
    } catch (error) {
      this.logger.error('Error analyzing sentiment:', error);
      return {
        sentiment: 'neutral',
        confidence: 0.5,
        emotions: [],
      };
    }
  }

  /**
   * Update sales persona configuration
   */
  async updateSalesPersona(sessionId: string, salesPersona: any): Promise<void> {
    try {
      await this.conversationService.updateSalesPersona(sessionId, salesPersona);
      this.logger.log(`Updated sales persona for session: ${sessionId}`);
    } catch (error) {
      this.logger.error('Error updating sales persona:', error);
      throw error;
    }
  }

  /**
   * Get conversation context
   */
  async getConversationContext(sessionId: string): Promise<ConversationContext | null> {
    return await this.conversationService.getConversationContext(sessionId);
  }

  /**
   * End conversation
   */
  async endConversation(sessionId: string): Promise<void> {
    try {
      await this.conversationService.endConversation(sessionId);
      this.logger.log(`Ended conversation: ${sessionId}`);
    } catch (error) {
      this.logger.error('Error ending conversation:', error);
      throw error;
    }
  }

  /**
   * Get conversation analytics
   */
  async getConversationAnalytics(sessionId: string): Promise<any> {
    return await this.conversationService.getConversationAnalytics(sessionId);
  }

  private async enhanceResponseWithCulturalContext(
    response: AIResponse,
    context: ConversationContext,
  ): Promise<AIResponse> {
    try {
      // Add cultural greetings/closings if appropriate
      const culturalResponse = this.culturalContextService.generateCulturalResponse(
        response.language,
        response.conversationStage,
        context.culturalContext,
      );

      // Enhance message with cultural context
      let enhancedMessage = response.message;

      // Add time-based greeting if it's an introduction
      if (response.conversationStage === ConversationStage.INTRODUCTION) {
        const greeting = this.culturalContextService.getTimeBasedGreeting(response.language);
        if (!enhancedMessage.toLowerCase().includes(greeting.toLowerCase().split('!')[0])) {
          enhancedMessage = `${greeting} ${enhancedMessage}`;
        }
      }

      // Add cultural references if appropriate
      if (context.culturalContext.currentFestivalSeason) {
        const festivalReference = this.getFestivalReference(
          response.language,
          context.culturalContext.currentFestivalSeason,
        );
        if (festivalReference && !enhancedMessage.includes(festivalReference)) {
          enhancedMessage = `${enhancedMessage} ${festivalReference}`;
        }
      }

      return {
        ...response,
        message: enhancedMessage,
      };
    } catch (error) {
      this.logger.error('Error enhancing response with cultural context:', error);
      return response;
    }
  }

  private validateAndImproveResponse(
    response: AIResponse,
    context: ConversationContext,
  ): AIResponse {
    // Ensure response is in the correct language
    if (response.language !== context.language) {
      response.language = context.language;
    }

    // Ensure response is not too long (keep it conversational)
    if (response.message.length > 500) {
      response.message = response.message.substring(0, 500) + '...';
    }

    // Ensure response is not empty
    if (!response.message.trim()) {
      response.message = this.getDefaultResponse(context.language);
    }

    // Add suggestions if none provided
    if (!response.suggestions || response.suggestions.length === 0) {
      response.suggestions = this.getDefaultSuggestions(context.language, response.conversationStage);
    }

    return response;
  }

  private generateFallbackResponse(context: ConversationContext, userMessage: string): AIResponse {
    const fallbackMessages = {
      [Language.EN]: "I apologize, but I'm having trouble processing your request right now. Could you please try again?",
      [Language.MS]: "Maaf, saya menghadapi masalah untuk memproses permintaan anda sekarang. Boleh cuba lagi?",
      [Language.ZH]: "抱歉，我现在无法处理您的请求。请再试一次好吗？",
    };

    return {
      message: fallbackMessages[context.language],
      language: context.language,
      conversationStage: context.conversationStage,
      confidence: 0.3,
      suggestions: this.getDefaultSuggestions(context.language, context.conversationStage),
      nextActions: ['retry_message'],
      metadata: {
        provider: 'fallback',
        error: 'AI service unavailable',
        timestamp: new Date().toISOString(),
      },
    };
  }

  private getDefaultResponse(language: Language): string {
    const responses = {
      [Language.EN]: "How can I help you today?",
      [Language.MS]: "Bagaimana saya boleh membantu anda hari ini?",
      [Language.ZH]: "今天我可以如何帮助您？",
    };
    return responses[language];
  }

  private getDefaultSuggestions(language: Language, stage: ConversationStage): string[] {
    const suggestions = {
      [Language.EN]: {
        [ConversationStage.INTRODUCTION]: ["Tell me about your needs", "What are you looking for?"],
        [ConversationStage.DISCOVERY]: ["Tell me more", "What else should I know?"],
        [ConversationStage.SOLUTION_RECOMMENDATION]: ["See products", "Book consultation"],
        [ConversationStage.FRIENDLY_CLOSE]: ["Make purchase", "Schedule call"],
      },
      [Language.MS]: {
        [ConversationStage.INTRODUCTION]: ["Ceritakan keperluan anda", "Apa yang anda cari?"],
        [ConversationStage.DISCOVERY]: ["Ceritakan lebih lanjut", "Apa lagi yang perlu saya tahu?"],
        [ConversationStage.SOLUTION_RECOMMENDATION]: ["Lihat produk", "Tempah perundingan"],
        [ConversationStage.FRIENDLY_CLOSE]: ["Buat pembelian", "Jadualkan panggilan"],
      },
      [Language.ZH]: {
        [ConversationStage.INTRODUCTION]: ["告诉我您的需求", "您在寻找什么？"],
        [ConversationStage.DISCOVERY]: ["告诉我更多", "还有什么我需要知道的？"],
        [ConversationStage.SOLUTION_RECOMMENDATION]: ["查看产品", "预约咨询"],
        [ConversationStage.FRIENDLY_CLOSE]: ["购买", "安排通话"],
      },
    };

    return suggestions[language]?.[stage] || suggestions[Language.EN][ConversationStage.INTRODUCTION];
  }

  private getFestivalReference(language: Language, festival: string): string | null {
    const references = {
      [Language.EN]: {
        'Chinese New Year': 'Happy Chinese New Year!',
        'Hari Raya Puasa': 'Selamat Hari Raya!',
        'Deepavali': 'Happy Deepavali!',
        'Christmas': 'Merry Christmas!',
      },
      [Language.MS]: {
        'Chinese New Year': 'Gong Xi Fa Cai!',
        'Hari Raya Puasa': 'Selamat Hari Raya!',
        'Deepavali': 'Selamat Deepavali!',
        'Christmas': 'Selamat Hari Krismas!',
      },
      [Language.ZH]: {
        'Chinese New Year': '新年快乐！',
        'Hari Raya Puasa': '开斋节快乐！',
        'Deepavali': '屠妖节快乐！',
        'Christmas': '圣诞节快乐！',
      },
    };

    return references[language]?.[festival] || null;
  }

  private logConversationAnalytics(context: ConversationContext, response: AIResponse): void {
    this.logger.log(`Conversation Analytics - Session: ${context.sessionId}`, {
      sessionId: context.sessionId,
      language: response.language,
      stage: response.conversationStage,
      intent: response.intent,
      confidence: response.confidence,
      messageLength: response.message.length,
      hasSuggestions: response.suggestions?.length > 0,
      hasNextActions: response.nextActions?.length > 0,
      provider: this.aiProvider,
    });
  }
}
