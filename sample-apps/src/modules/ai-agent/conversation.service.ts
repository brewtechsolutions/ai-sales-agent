import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CacheService } from '../../common/cache/cache.service';
import { CulturalContextService } from './cultural-context.service';
import { LanguageDetectionService } from './language-detection.service';
import { 
  ConversationContext, 
  Message, 
  Language, 
  ConversationStage,
  ChatMessageDto,
  CustomerProfile 
} from './interfaces/conversation.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ConversationService {
  private readonly logger = new Logger(ConversationService.name);
  private readonly SESSION_TTL = 30 * 60; // 30 minutes in seconds

  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService,
    private culturalContextService: CulturalContextService,
    private languageDetectionService: LanguageDetectionService,
  ) {}

  /**
   * Get or create conversation context
   */
  async getConversationContext(sessionId: string): Promise<ConversationContext | null> {
    try {
      // Try to get from cache first
      const cached = await this.cacheService.get<ConversationContext>(`conversation:${sessionId}`);
      if (cached) {
        return cached;
      }

      // Get from database
      const conversation = await this.prisma.conversation.findUnique({
        where: { sessionId },
        include: {
          customer: true,
          messages: {
            orderBy: { timestamp: 'asc' },
          },
        },
      });

      if (!conversation) {
        return null;
      }

      const context = this.buildConversationContext(conversation);
      
      // Cache the context
      await this.cacheService.set(`conversation:${sessionId}`, context, this.SESSION_TTL);
      
      return context;
    } catch (error) {
      this.logger.error('Error getting conversation context:', error);
      return null;
    }
  }

  /**
   * Create new conversation context
   */
  async createConversationContext(
    sessionId: string,
    customerId?: string,
    language: Language = Language.EN,
  ): Promise<ConversationContext> {
    try {
      const culturalContext = this.culturalContextService.getCurrentCulturalContext();
      
      // Default sales persona configuration
      const defaultSalesPersona = {
        salespersonName: 'Sarah',
        companyName: 'Your Business',
        businessDescription: 'Professional services for Malaysian customers',
        companyValues: 'Quality, Trust, Customer Satisfaction',
        productCategory: 'General Services',
        targetDemographic: 'Malaysian customers',
        priceRange: 'Competitive pricing',
      };

      const context: ConversationContext = {
        customerId,
        sessionId,
        language,
        detectedLanguagePreference: language,
        currentIntent: 'general_inquiry',
        conversationStage: ConversationStage.INTRODUCTION,
        conversationHistory: [],
        customerProfile: customerId ? await this.getCustomerProfile(customerId) : undefined,
        timezone: 'Asia/Kuala_Lumpur',
        culturalContext,
        salesPersona: defaultSalesPersona,
        lastActivityAt: new Date(),
      };

      // Save to database
      await this.prisma.conversation.create({
        data: {
          sessionId,
          customerId,
          language,
          detectedLanguage: language,
          currentIntent: context.currentIntent,
          conversationStage: context.conversationStage,
          culturalContext: context.culturalContext as any,
          salesPersonaConfig: context.salesPersona as any,
          isActive: true,
        },
      });

      // Cache the context
      await this.cacheService.set(`conversation:${sessionId}`, context, this.SESSION_TTL);

      this.logger.log(`Created new conversation context for session: ${sessionId}`);
      return context;
    } catch (error) {
      this.logger.error('Error creating conversation context:', error);
      throw error;
    }
  }

  /**
   * Update conversation context
   */
  async updateConversationContext(context: ConversationContext): Promise<void> {
    try {
      // Update database
      await this.prisma.conversation.update({
        where: { sessionId: context.sessionId },
        data: {
          language: context.language,
          detectedLanguage: context.detectedLanguagePreference,
          currentIntent: context.currentIntent,
          conversationStage: context.conversationStage,
          culturalContext: context.culturalContext as any,
          salesPersonaConfig: context.salesPersona as any,
          lastActivityAt: context.lastActivityAt,
        },
      });

      // Update cache
      await this.cacheService.set(`conversation:${context.sessionId}`, context, this.SESSION_TTL);

      this.logger.debug(`Updated conversation context for session: ${context.sessionId}`);
    } catch (error) {
      this.logger.error('Error updating conversation context:', error);
      throw error;
    }
  }

  /**
   * Add message to conversation
   */
  async addMessage(
    sessionId: string,
    role: 'user' | 'assistant' | 'system',
    content: string,
    metadata?: Record<string, any>,
  ): Promise<Message> {
    try {
      const message = await this.prisma.message.create({
        data: {
          conversationId: sessionId, // Using sessionId as conversationId for simplicity
          role,
          content,
          metadata: metadata as any,
        },
      });

      // Update conversation history in cache
      const context = await this.getConversationContext(sessionId);
      if (context) {
        const newMessage: Message = {
          id: message.id,
          role: message.role as 'user' | 'assistant' | 'system',
          content: message.content,
          timestamp: message.timestamp,
          metadata: message.metadata as Record<string, any>,
        };

        context.conversationHistory.push(newMessage);
        context.lastActivityAt = new Date();
        
        await this.updateConversationContext(context);
      }

      this.logger.debug(`Added ${role} message to conversation: ${sessionId}`);
      return {
        id: message.id,
        role: message.role as 'user' | 'assistant' | 'system',
        content: message.content,
        timestamp: message.timestamp,
        metadata: message.metadata as Record<string, any>,
      };
    } catch (error) {
      this.logger.error('Error adding message to conversation:', error);
      throw error;
    }
  }

  /**
   * Process incoming chat message
   */
  async processChatMessage(messageDto: ChatMessageDto): Promise<ConversationContext> {
    try {
      let context = await this.getConversationContext(messageDto.sessionId);
      
      if (!context) {
        // Create new conversation
        context = await this.createConversationContext(
          messageDto.sessionId,
          messageDto.customerId,
          messageDto.language || Language.EN,
        );
      }

      // Detect language if not provided
      if (!messageDto.language) {
        const detection = this.languageDetectionService.detectLanguage(messageDto.message);
        context.detectedLanguagePreference = detection.language;
        
        // Mirror customer's language choice immediately
        if (this.languageDetectionService.shouldMirrorLanguage(messageDto.message, context.language)) {
          context.language = detection.language;
        }
      }

      // Add user message
      await this.addMessage(
        messageDto.sessionId,
        'user',
        messageDto.message,
        {
          platform: messageDto.platform,
          language: messageDto.language,
          ...messageDto.metadata,
        },
      );

      // Update context with new message
      context.conversationHistory.push({
        id: uuidv4(),
        role: 'user',
        content: messageDto.message,
        timestamp: new Date(),
        metadata: {
          platform: messageDto.platform,
          language: messageDto.language,
          ...messageDto.metadata,
        },
      });

      context.lastActivityAt = new Date();
      await this.updateConversationContext(context);

      return context;
    } catch (error) {
      this.logger.error('Error processing chat message:', error);
      throw error;
    }
  }

  /**
   * Get customer profile
   */
  async getCustomerProfile(customerId: string): Promise<CustomerProfile | undefined> {
    try {
      const customer = await this.prisma.customer.findUnique({
        where: { id: customerId },
      });

      if (!customer) {
        return undefined;
      }

      return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        preferredLanguage: customer.preferredLanguage as Language,
        timezone: customer.timezone,
        culturalContext: customer.culturalContext as any,
        preferences: {},
        purchaseHistory: [],
        consultationHistory: [],
      };
    } catch (error) {
      this.logger.error('Error getting customer profile:', error);
      return undefined;
    }
  }

  /**
   * Update sales persona configuration
   */
  async updateSalesPersona(sessionId: string, salesPersona: any): Promise<void> {
    try {
      const context = await this.getConversationContext(sessionId);
      if (context) {
        context.salesPersona = { ...context.salesPersona, ...salesPersona };
        await this.updateConversationContext(context);
      }
    } catch (error) {
      this.logger.error('Error updating sales persona:', error);
      throw error;
    }
  }

  /**
   * End conversation
   */
  async endConversation(sessionId: string): Promise<void> {
    try {
      // Update database
      await this.prisma.conversation.update({
        where: { sessionId },
        data: {
          isActive: false,
          conversationStage: ConversationStage.NATURAL_END,
        },
      });

      // Remove from cache
      await this.cacheService.del(`conversation:${sessionId}`);

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
    try {
      const conversation = await this.prisma.conversation.findUnique({
        where: { sessionId },
        include: {
          messages: true,
          analytics: true,
        },
      });

      if (!conversation) {
        return null;
      }

      return {
        totalMessages: conversation.messages.length,
        conversationDuration: this.calculateConversationDuration(conversation.messages),
        language: conversation.language,
        stage: conversation.conversationStage,
        isActive: conversation.isActive,
        analytics: conversation.analytics,
      };
    } catch (error) {
      this.logger.error('Error getting conversation analytics:', error);
      return null;
    }
  }

  private buildConversationContext(conversation: any): ConversationContext {
    return {
      customerId: conversation.customerId,
      sessionId: conversation.sessionId,
      language: conversation.language as Language,
      detectedLanguagePreference: conversation.detectedLanguage as Language,
      currentIntent: conversation.currentIntent,
      conversationStage: conversation.conversationStage as ConversationStage,
      conversationHistory: conversation.messages.map((msg: any) => ({
        id: msg.id,
        role: msg.role as 'user' | 'assistant' | 'system',
        content: msg.content,
        timestamp: msg.timestamp,
        metadata: msg.metadata as Record<string, any>,
      })),
      customerProfile: conversation.customer ? {
        id: conversation.customer.id,
        name: conversation.customer.name,
        email: conversation.customer.email,
        phone: conversation.customer.phone,
        preferredLanguage: conversation.customer.preferredLanguage as Language,
        timezone: conversation.customer.timezone,
        culturalContext: conversation.customer.culturalContext as any,
        preferences: {},
        purchaseHistory: [],
        consultationHistory: [],
      } : undefined,
      timezone: 'Asia/Kuala_Lumpur',
      culturalContext: conversation.culturalContext as any,
      salesPersona: conversation.salesPersonaConfig as any,
      lastActivityAt: conversation.lastActivityAt,
    };
  }

  private calculateConversationDuration(messages: any[]): number {
    if (messages.length < 2) return 0;
    
    const firstMessage = messages[0];
    const lastMessage = messages[messages.length - 1];
    
    return new Date(lastMessage.timestamp).getTime() - new Date(firstMessage.timestamp).getTime();
  }
}
