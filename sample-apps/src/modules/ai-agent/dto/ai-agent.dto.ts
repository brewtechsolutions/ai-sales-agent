import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsObject, IsUUID } from 'class-validator';
import { Language } from '../interfaces/conversation.interface';

export class CreateChatMessageDto {
  @ApiProperty({ description: 'Session ID for the conversation' })
  @IsString()
  sessionId: string;

  @ApiProperty({ description: 'Customer ID (optional)' })
  @IsOptional()
  @IsUUID()
  customerId?: string;

  @ApiProperty({ description: 'Message content' })
  @IsString()
  message: string;

  @ApiProperty({ description: 'Platform (whatsapp, telegram, web, etc.)', required: false })
  @IsOptional()
  @IsString()
  platform?: string;

  @ApiProperty({ description: 'Language preference', enum: Language, required: false })
  @IsOptional()
  @IsEnum(Language)
  language?: Language;

  @ApiProperty({ description: 'Additional metadata', required: false })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class UpdateSalesPersonaDto {
  @ApiProperty({ description: 'Salesperson name', required: false })
  @IsOptional()
  @IsString()
  salespersonName?: string;

  @ApiProperty({ description: 'Company name', required: false })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiProperty({ description: 'Business description', required: false })
  @IsOptional()
  @IsString()
  businessDescription?: string;

  @ApiProperty({ description: 'Company values', required: false })
  @IsOptional()
  @IsString()
  companyValues?: string;

  @ApiProperty({ description: 'Product category', required: false })
  @IsOptional()
  @IsString()
  productCategory?: string;

  @ApiProperty({ description: 'Current promotion details', required: false })
  @IsOptional()
  @IsString()
  currentPromotionDetails?: string;

  @ApiProperty({ description: 'Target demographic', required: false })
  @IsOptional()
  @IsString()
  targetDemographic?: string;

  @ApiProperty({ description: 'Price range', required: false })
  @IsOptional()
  @IsString()
  priceRange?: string;
}

export class ConversationAnalyticsDto {
  @ApiProperty({ description: 'Total number of messages' })
  totalMessages: number;

  @ApiProperty({ description: 'Conversation duration in milliseconds' })
  conversationDuration: number;

  @ApiProperty({ description: 'Language used in conversation' })
  language: string;

  @ApiProperty({ description: 'Current conversation stage' })
  stage: string;

  @ApiProperty({ description: 'Whether conversation is active' })
  isActive: boolean;

  @ApiProperty({ description: 'Analytics data' })
  analytics: any;
}

export class ProductRecommendationRequestDto {
  @ApiProperty({ description: 'Session ID' })
  @IsString()
  sessionId: string;

  @ApiProperty({ description: 'List of products to consider' })
  @IsObject()
  products: any[];
}

export class SentimentAnalysisRequestDto {
  @ApiProperty({ description: 'Message to analyze' })
  @IsString()
  message: string;

  @ApiProperty({ description: 'Language of the message', enum: Language })
  @IsEnum(Language)
  language: Language;
}
