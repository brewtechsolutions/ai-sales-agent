import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { 
  AIResponse, 
  ConversationContext, 
  Language, 
  ConversationStage 
} from '../interfaces/conversation.interface';

@Injectable()
export class OpenAIService {
  private readonly logger = new Logger(OpenAIService.name);
  private readonly openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('ai.openai.apiKey'),
    });
  }

  /**
   * Generate AI response for conversation
   */
  async generateResponse(
    context: ConversationContext,
    userMessage: string,
  ): Promise<AIResponse> {
    try {
      const systemPrompt = this.buildSystemPrompt(context);
      const messages = this.buildMessages(context, userMessage, systemPrompt);

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages,
        temperature: 0.7,
        max_tokens: 500,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response generated from OpenAI');
      }

      return this.parseAIResponse(response, context);
    } catch (error) {
      this.logger.error('OpenAI API error:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  /**
   * Generate product recommendations
   */
  async generateProductRecommendations(
    context: ConversationContext,
    products: any[],
  ): Promise<string[]> {
    try {
      const prompt = this.buildProductRecommendationPrompt(context, products);
      
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
        max_tokens: 300,
      });

      const response = completion.choices[0]?.message?.content;
      return this.parseProductRecommendations(response);
    } catch (error) {
      this.logger.error('OpenAI product recommendation error:', error);
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
      const prompt = this.buildSentimentAnalysisPrompt(message, language);
      
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 200,
      });

      const response = completion.choices[0]?.message?.content;
      return this.parseSentimentResponse(response);
    } catch (error) {
      this.logger.error('OpenAI sentiment analysis error:', error);
      return {
        sentiment: 'neutral',
        confidence: 0.5,
        emotions: [],
      };
    }
  }

  private buildSystemPrompt(context: ConversationContext): string {
    const { salesPersona, culturalContext, language } = context;
    
    const languageInstructions = this.getLanguageInstructions(language);
    const culturalInstructions = this.getCulturalInstructions(culturalContext);
    
    return `You are ${salesPersona.salespersonName}, a professional sales agent for ${salesPersona.companyName}.

COMPANY CONTEXT:
- Business: ${salesPersona.businessDescription}
- Values: ${salesPersona.companyValues}
- Product Category: ${salesPersona.productCategory}
- Target Demographic: ${salesPersona.targetDemographic || 'General Malaysian customers'}
- Price Range: ${salesPersona.priceRange || 'Competitive pricing'}

${salesPersona.currentPromotionDetails ? `CURRENT PROMOTION: ${salesPersona.currentPromotionDetails}` : ''}

CULTURAL CONTEXT (Malaysian Market):
${culturalInstructions}

LANGUAGE REQUIREMENTS:
${languageInstructions}

CONVERSATION STAGE: ${context.conversationStage}
Current Intent: ${context.currentIntent || 'General inquiry'}

SALES APPROACH (8-Stage Malaysian Sales Framework):
1. INTRODUCTION: Warm, respectful greeting with cultural awareness
2. DISCOVERY: Gentle, friend-to-friend inquiry about needs
3. STORY_SHARING: Build rapport with relevant local context
4. NEEDS_UNDERSTANDING: Deep listening with cultural sensitivity
5. SOLUTION_RECOMMENDATION: Helpful advice, not aggressive sales pitch
6. CONCERN_ADDRESSING: Address concerns with Malaysian logic + empathy
7. FRIENDLY_CLOSE: Personal, exclusive offers
8. NATURAL_END: Relationship building for future

RESPONSE GUIDELINES:
- Be conversational and natural, like chatting with a friend
- Use appropriate Malaysian business etiquette
- Mirror the customer's language choice immediately
- Keep responses concise (2-3 sentences max)
- Focus on helping, not selling
- Show genuine interest in customer needs
- Use local references when appropriate
- Be respectful of cultural differences

Current time: ${new Date().toLocaleString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' })}`;
  }

  private buildMessages(
    context: ConversationContext,
    userMessage: string,
    systemPrompt: string,
  ): OpenAI.Chat.Completions.ChatCompletionMessageParam[] {
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
    ];

    // Add conversation history (last 10 messages)
    const recentHistory = context.conversationHistory.slice(-10);
    for (const message of recentHistory) {
      messages.push({
        role: message.role as 'user' | 'assistant' | 'system',
        content: message.content,
      });
    }

    // Add current user message
    messages.push({
      role: 'user',
      content: userMessage,
    });

    return messages;
  }

  private getLanguageInstructions(language: Language): string {
    const instructions = {
      [Language.EN]: 'Respond in English. Use clear, professional but friendly language suitable for Malaysian customers.',
      [Language.MS]: 'Respond in Bahasa Malaysia. Use polite, respectful language with appropriate Malaysian business terms.',
      [Language.ZH]: 'Respond in Mandarin Chinese. Use formal but warm language suitable for Malaysian Chinese customers.',
    };
    
    return instructions[language];
  }

  private getCulturalInstructions(culturalContext: any): string {
    let instructions = '- Understand Malaysian multicultural business practices\n';
    instructions += '- Respect different cultural backgrounds and preferences\n';
    instructions += '- Use appropriate greetings and courtesy terms\n';
    
    if (culturalContext.currentFestivalSeason) {
      instructions += `- Current festival season: ${culturalContext.currentFestivalSeason}\n`;
    }
    
    if (culturalContext.weatherContext) {
      instructions += `- Weather context: ${culturalContext.weatherContext}\n`;
    }
    
    if (culturalContext.paymentMethodPreferences) {
      instructions += `- Preferred payment methods: ${culturalContext.paymentMethodPreferences.join(', ')}\n`;
    }
    
    return instructions;
  }

  private buildProductRecommendationPrompt(context: ConversationContext, products: any[]): string {
    return `Based on the conversation context and available products, recommend the most suitable products for this Malaysian customer.

Customer Context:
- Language: ${context.language}
- Conversation Stage: ${context.conversationStage}
- Current Intent: ${context.currentIntent}
- Cultural Context: ${JSON.stringify(context.culturalContext)}

Available Products:
${products.map(p => `- ${p.name}: ${p.description} (${p.price} ${p.currency})`).join('\n')}

Provide 3-5 product recommendations with brief explanations in ${context.language} language.`;
  }

  private buildSentimentAnalysisPrompt(message: string, language: Language): string {
    const languageName = {
      [Language.EN]: 'English',
      [Language.MS]: 'Bahasa Malaysia',
      [Language.ZH]: 'Mandarin Chinese',
    }[language];

    return `Analyze the sentiment of this ${languageName} message from a Malaysian customer:

"${message}"

Provide:
1. Sentiment: positive, neutral, or negative
2. Confidence level (0-1)
3. Key emotions detected

Respond in JSON format.`;
  }

  private parseAIResponse(response: string, context: ConversationContext): AIResponse {
    // Extract conversation stage and intent from response
    const stage = this.extractConversationStage(response, context.conversationStage);
    const intent = this.extractIntent(response);
    const confidence = this.calculateConfidence(response);
    
    return {
      message: response.trim(),
      language: context.language,
      conversationStage: stage,
      intent,
      confidence,
      suggestions: this.extractSuggestions(response),
      nextActions: this.extractNextActions(response),
      metadata: {
        provider: 'openai',
        model: 'gpt-4',
        timestamp: new Date().toISOString(),
      },
    };
  }

  private parseProductRecommendations(response: string): string[] {
    // Simple parsing - in production, use more sophisticated parsing
    const lines = response.split('\n').filter(line => line.trim());
    return lines.slice(0, 5); // Return up to 5 recommendations
  }

  private parseSentimentResponse(response: string): {
    sentiment: 'positive' | 'neutral' | 'negative';
    confidence: number;
    emotions: string[];
  } {
    try {
      const parsed = JSON.parse(response);
      return {
        sentiment: parsed.sentiment || 'neutral',
        confidence: parsed.confidence || 0.5,
        emotions: parsed.emotions || [],
      };
    } catch {
      return {
        sentiment: 'neutral',
        confidence: 0.5,
        emotions: [],
      };
    }
  }

  private extractConversationStage(response: string, currentStage: ConversationStage): ConversationStage {
    // Simple stage detection based on response content
    const lowerResponse = response.toLowerCase();
    
    if (lowerResponse.includes('hello') || lowerResponse.includes('hi') || lowerResponse.includes('selamat')) {
      return ConversationStage.INTRODUCTION;
    } else if (lowerResponse.includes('tell me') || lowerResponse.includes('ceritakan') || lowerResponse.includes('告诉我')) {
      return ConversationStage.DISCOVERY;
    } else if (lowerResponse.includes('recommend') || lowerResponse.includes('cadangkan') || lowerResponse.includes('推荐')) {
      return ConversationStage.SOLUTION_RECOMMENDATION;
    } else if (lowerResponse.includes('concern') || lowerResponse.includes('kebimbangan') || lowerResponse.includes('担心')) {
      return ConversationStage.CONCERN_ADDRESSING;
    } else if (lowerResponse.includes('purchase') || lowerResponse.includes('beli') || lowerResponse.includes('购买')) {
      return ConversationStage.FRIENDLY_CLOSE;
    }
    
    return currentStage;
  }

  private extractIntent(response: string): string | undefined {
    const lowerResponse = response.toLowerCase();
    
    if (lowerResponse.includes('product') || lowerResponse.includes('produk') || lowerResponse.includes('产品')) {
      return 'product_inquiry';
    } else if (lowerResponse.includes('price') || lowerResponse.includes('harga') || lowerResponse.includes('价格')) {
      return 'pricing_inquiry';
    } else if (lowerResponse.includes('consultation') || lowerResponse.includes('perundingan') || lowerResponse.includes('咨询')) {
      return 'consultation_booking';
    } else if (lowerResponse.includes('order') || lowerResponse.includes('pesanan') || lowerResponse.includes('订单')) {
      return 'purchase_intent';
    }
    
    return undefined;
  }

  private calculateConfidence(response: string): number {
    // Simple confidence calculation based on response length and structure
    const length = response.length;
    const hasQuestion = response.includes('?');
    const hasGreeting = /hello|hi|selamat|你好/.test(response.toLowerCase());
    
    let confidence = 0.7; // Base confidence
    
    if (length > 50 && length < 200) confidence += 0.1;
    if (hasQuestion) confidence += 0.1;
    if (hasGreeting) confidence += 0.1;
    
    return Math.min(confidence, 1.0);
  }

  private extractSuggestions(response: string): string[] {
    // Extract suggestions from response (simple implementation)
    const suggestions: string[] = [];
    const lines = response.split('\n');
    
    for (const line of lines) {
      if (line.includes('•') || line.includes('-') || line.includes('*')) {
        suggestions.push(line.replace(/[•\-*]\s*/, '').trim());
      }
    }
    
    return suggestions.slice(0, 3); // Return up to 3 suggestions
  }

  private extractNextActions(response: string): string[] {
    // Extract suggested next actions
    const actions: string[] = [];
    const lowerResponse = response.toLowerCase();
    
    if (lowerResponse.includes('call') || lowerResponse.includes('contact')) {
      actions.push('schedule_call');
    }
    if (lowerResponse.includes('visit') || lowerResponse.includes('meet')) {
      actions.push('schedule_meeting');
    }
    if (lowerResponse.includes('email') || lowerResponse.includes('send')) {
      actions.push('send_email');
    }
    if (lowerResponse.includes('consultation') || lowerResponse.includes('expert')) {
      actions.push('book_consultation');
    }
    
    return actions;
  }
}
