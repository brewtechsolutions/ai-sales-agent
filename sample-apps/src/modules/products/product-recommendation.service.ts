import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CacheService } from '../../common/cache/cache.service';
import { AiAgentService } from '../ai-agent/ai-agent.service';

@Injectable()
export class ProductRecommendationService {
  private readonly logger = new Logger(ProductRecommendationService.name);

  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService,
    private aiAgentService: AiAgentService,
  ) {}

  /**
   * Get product recommendations for a customer
   */
  async getRecommendations(
    customerId: string,
    limit: number = 5,
  ): Promise<any[]> {
    try {
      const cacheKey = `recommendations_${customerId}_${limit}`;
      
      // Try to get from cache first
      const cached = await this.cacheService.get<any[]>(cacheKey);
      if (cached) {
        return cached;
      }

      // Get customer's conversation history and preferences
      const customer = await this.getCustomerProfile(customerId);
      if (!customer) {
        return this.getDefaultRecommendations(limit);
      }

      // Get conversation-based recommendations
      const conversationRecommendations = await this.getConversationBasedRecommendations(
        customerId,
        limit,
      );

      // Get collaborative filtering recommendations
      const collaborativeRecommendations = await this.getCollaborativeRecommendations(
        customerId,
        limit,
      );

      // Get content-based recommendations
      const contentRecommendations = await this.getContentBasedRecommendations(
        customer,
        limit,
      );

      // Combine and rank recommendations
      const allRecommendations = [
        ...conversationRecommendations,
        ...collaborativeRecommendations,
        ...contentRecommendations,
      ];

      const rankedRecommendations = this.rankRecommendations(
        allRecommendations,
        customer,
        limit,
      );

      // Cache recommendations for 30 minutes
      await this.cacheService.set(cacheKey, rankedRecommendations, 1800);

      this.logger.debug(`Generated ${rankedRecommendations.length} recommendations for customer ${customerId}`);
      return rankedRecommendations;
    } catch (error) {
      this.logger.error('Error getting product recommendations:', error);
      return this.getDefaultRecommendations(limit);
    }
  }

  /**
   * Get AI-powered product recommendations based on conversation
   */
  async getAIRecommendations(
    sessionId: string,
    products: any[],
  ): Promise<string[]> {
    try {
      return await this.aiAgentService.generateProductRecommendations(
        sessionId,
        products,
      );
    } catch (error) {
      this.logger.error('Error getting AI recommendations:', error);
      return [];
    }
  }

  /**
   * Record product recommendation interaction
   */
  async recordRecommendationInteraction(
    conversationId: string,
    productId: string,
    interactionType: 'viewed' | 'clicked' | 'purchased',
    confidence?: number,
    reason?: string,
  ) {
    try {
      await this.prisma.productRecommendation.create({
        data: {
          conversationId,
          productId,
          confidence: confidence || 0.5,
          reason: reason || `Product ${interactionType}`,
        },
      });

      this.logger.debug(`Recorded ${interactionType} interaction for product ${productId}`);
    } catch (error) {
      this.logger.error('Error recording recommendation interaction:', error);
    }
  }

  /**
   * Get recommendation analytics
   */
  async getRecommendationAnalytics() {
    try {
      const cacheKey = 'recommendation_analytics';
      
      // Try to get from cache first
      const cached = await this.cacheService.get<any>(cacheKey);
      if (cached) {
        return cached;
      }

      const [
        totalRecommendations,
        averageConfidence,
        topProducts,
        recommendationTrends,
      ] = await Promise.all([
        this.prisma.productRecommendation.count(),
        this.prisma.productRecommendation.aggregate({
          _avg: { confidence: true },
        }),
        this.prisma.productRecommendation.groupBy({
          by: ['productId'],
          _count: { productId: true },
          orderBy: { _count: { productId: 'desc' } },
          take: 10,
        }),
        this.prisma.productRecommendation.groupBy({
          by: ['createdAt'],
          _count: { id: true },
          orderBy: { createdAt: 'desc' },
          take: 30,
        }),
      ]);

      const analytics = {
        totalRecommendations,
        averageConfidence: averageConfidence._avg.confidence || 0,
        topProducts: topProducts.map(p => ({
          productId: p.productId,
          recommendationCount: p._count.productId,
        })),
        recommendationTrends: recommendationTrends.map(t => ({
          date: t.createdAt,
          count: t._count.id,
        })),
        lastUpdated: new Date().toISOString(),
      };

      // Cache for 1 hour
      await this.cacheService.set(cacheKey, analytics, 3600);

      return analytics;
    } catch (error) {
      this.logger.error('Error getting recommendation analytics:', error);
      throw new Error('Failed to get recommendation analytics');
    }
  }

  private async getCustomerProfile(customerId: string) {
    try {
      return await this.prisma.customer.findUnique({
        where: { id: customerId },
        include: {
          conversations: {
            include: {
              messages: true,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error('Error getting customer profile:', error);
      return null;
    }
  }

  private async getConversationBasedRecommendations(
    customerId: string,
    limit: number,
  ): Promise<any[]> {
    try {
      // Get recent conversations for the customer
      const conversations = await this.prisma.conversation.findMany({
        where: { customerId },
        include: {
          messages: {
            where: { role: 'user' },
            orderBy: { timestamp: 'desc' },
            take: 10,
          },
        },
        orderBy: { lastActivityAt: 'desc' },
        take: 5,
      });

      // Extract keywords from conversation messages
      const keywords = this.extractKeywordsFromConversations(conversations);
      
      if (keywords.length === 0) {
        return [];
      }

      // Search products based on keywords
      const products = await this.prisma.product.findMany({
        where: {
          isActive: true,
          OR: keywords.map(keyword => ({
            OR: [
              { name: { contains: keyword, mode: 'insensitive' } },
              { description: { contains: keyword, mode: 'insensitive' } },
              { category: { contains: keyword, mode: 'insensitive' } },
            ],
          })),
        },
        take: limit * 2, // Get more to allow for ranking
      });

      return products.map(product => ({
        ...product,
        recommendationType: 'conversation',
        confidence: this.calculateConversationConfidence(product, keywords),
      }));
    } catch (error) {
      this.logger.error('Error getting conversation-based recommendations:', error);
      return [];
    }
  }

  private async getCollaborativeRecommendations(
    customerId: string,
    limit: number,
  ): Promise<any[]> {
    try {
      // Find customers with similar preferences
      const similarCustomers = await this.findSimilarCustomers(customerId);
      
      if (similarCustomers.length === 0) {
        return [];
      }

      // Get products liked by similar customers
      const similarCustomerIds = similarCustomers.map(c => c.id);
      
      const recommendations = await this.prisma.productRecommendation.findMany({
        where: {
          conversation: {
            customerId: { in: similarCustomerIds },
          },
          confidence: { gte: 0.7 },
        },
        include: {
          product: true,
        },
        orderBy: { confidence: 'desc' },
        take: limit * 2,
      });

      return recommendations.map(rec => ({
        ...rec.product,
        recommendationType: 'collaborative',
        confidence: rec.confidence,
      }));
    } catch (error) {
      this.logger.error('Error getting collaborative recommendations:', error);
      return [];
    }
  }

  private async getContentBasedRecommendations(
    customer: any,
    limit: number,
  ): Promise<any[]> {
    try {
      // Get customer's preferred categories and price range
      const preferences = this.analyzeCustomerPreferences(customer);
      
      const where: any = {
        isActive: true,
      };

      if (preferences.categories.length > 0) {
        where.category = { in: preferences.categories };
      }

      if (preferences.priceRange) {
        where.price = {
          gte: preferences.priceRange.min,
          lte: preferences.priceRange.max,
        };
      }

      const products = await this.prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit * 2,
      });

      return products.map(product => ({
        ...product,
        recommendationType: 'content',
        confidence: this.calculateContentConfidence(product, preferences),
      }));
    } catch (error) {
      this.logger.error('Error getting content-based recommendations:', error);
      return [];
    }
  }

  private async getDefaultRecommendations(limit: number): Promise<any[]> {
    try {
      return await this.prisma.product.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });
    } catch (error) {
      this.logger.error('Error getting default recommendations:', error);
      return [];
    }
  }

  private extractKeywordsFromConversations(conversations: any[]): string[] {
    const keywords: string[] = [];
    
    for (const conversation of conversations) {
      for (const message of conversation.messages) {
        const words = message.content.toLowerCase()
          .replace(/[^\w\s]/g, '')
          .split(/\s+/)
          .filter(word => word.length > 3);
        
        keywords.push(...words);
      }
    }

    // Count word frequency and return top keywords
    const wordCount = keywords.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(wordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
  }

  private async findSimilarCustomers(customerId: string): Promise<any[]> {
    try {
      // Simple implementation - find customers with similar conversation patterns
      const customer = await this.prisma.customer.findUnique({
        where: { id: customerId },
        include: {
          conversations: {
            include: {
              messages: true,
            },
          },
        },
      });

      if (!customer) return [];

      // Get all other customers with conversations
      const otherCustomers = await this.prisma.customer.findMany({
        where: {
          id: { not: customerId },
          conversations: { some: {} },
        },
        include: {
          conversations: {
            include: {
              messages: true,
            },
          },
        },
      });

      // Calculate similarity based on conversation topics
      const similarities = otherCustomers.map(otherCustomer => ({
        ...otherCustomer,
        similarity: this.calculateCustomerSimilarity(customer, otherCustomer),
      }));

      return similarities
        .filter(c => c.similarity > 0.3)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 5);
    } catch (error) {
      this.logger.error('Error finding similar customers:', error);
      return [];
    }
  }

  private calculateCustomerSimilarity(customer1: any, customer2: any): number {
    // Simple similarity calculation based on conversation topics
    const topics1 = this.extractTopicsFromCustomer(customer1);
    const topics2 = this.extractTopicsFromCustomer(customer2);
    
    const intersection = topics1.filter(topic => topics2.includes(topic));
    const union = [...new Set([...topics1, ...topics2])];
    
    return union.length > 0 ? intersection.length / union.length : 0;
  }

  private extractTopicsFromCustomer(customer: any): string[] {
    const topics: string[] = [];
    
    for (const conversation of customer.conversations) {
      for (const message of conversation.messages) {
        const words = message.content.toLowerCase()
          .replace(/[^\w\s]/g, '')
          .split(/\s+/)
          .filter(word => word.length > 3);
        
        topics.push(...words);
      }
    }

    return [...new Set(topics)];
  }

  private analyzeCustomerPreferences(customer: any): {
    categories: string[];
    priceRange?: { min: number; max: number };
  } {
    const categories: string[] = [];
    const prices: number[] = [];

    // Analyze from conversations and previous recommendations
    for (const conversation of customer.conversations) {
      for (const message of conversation.messages) {
        // Extract category mentions
        const categoryMatches = message.content.match(/\b(tech|fashion|food|travel|health|beauty|home|sports)\b/gi);
        if (categoryMatches) {
          categories.push(...categoryMatches.map(c => c.toLowerCase()));
        }

        // Extract price mentions
        const priceMatches = message.content.match(/\b(\d+)\b/g);
        if (priceMatches) {
          prices.push(...priceMatches.map(p => parseInt(p)));
        }
      }
    }

    return {
      categories: [...new Set(categories)],
      priceRange: prices.length > 0 ? {
        min: Math.min(...prices),
        max: Math.max(...prices),
      } : undefined,
    };
  }

  private calculateConversationConfidence(product: any, keywords: string[]): number {
    let confidence = 0.1; // Base confidence
    
    // Check keyword matches in product name and description
    const productText = `${product.name} ${product.description}`.toLowerCase();
    const matches = keywords.filter(keyword => productText.includes(keyword));
    
    confidence += matches.length * 0.1;
    
    return Math.min(confidence, 1.0);
  }

  private calculateContentConfidence(product: any, preferences: any): number {
    let confidence = 0.5; // Base confidence
    
    // Category match
    if (preferences.categories.includes(product.category.toLowerCase())) {
      confidence += 0.3;
    }
    
    // Price range match
    if (preferences.priceRange) {
      const { min, max } = preferences.priceRange;
      if (product.price >= min && product.price <= max) {
        confidence += 0.2;
      }
    }
    
    return Math.min(confidence, 1.0);
  }

  private rankRecommendations(
    recommendations: any[],
    customer: any,
    limit: number,
  ): any[] {
    // Remove duplicates based on product ID
    const uniqueRecommendations = recommendations.reduce((acc, rec) => {
      if (!acc.find(r => r.id === rec.id)) {
        acc.push(rec);
      }
      return acc;
    }, [] as any[]);

    // Sort by confidence and recommendation type priority
    const typePriority = {
      conversation: 3,
      collaborative: 2,
      content: 1,
    };

    return uniqueRecommendations
      .sort((a, b) => {
        const aScore = a.confidence * (typePriority[a.recommendationType] || 1);
        const bScore = b.confidence * (typePriority[b.recommendationType] || 1);
        return bScore - aScore;
      })
      .slice(0, limit);
  }
}
