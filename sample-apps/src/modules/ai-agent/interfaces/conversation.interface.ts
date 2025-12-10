export enum Language {
  EN = 'EN',
  MS = 'MS',
  ZH = 'ZH',
}

export enum ConversationStage {
  INTRODUCTION = 'INTRODUCTION',
  DISCOVERY = 'DISCOVERY',
  STORY_SHARING = 'STORY_SHARING',
  NEEDS_UNDERSTANDING = 'NEEDS_UNDERSTANDING',
  SOLUTION_RECOMMENDATION = 'SOLUTION_RECOMMENDATION',
  CONCERN_ADDRESSING = 'CONCERN_ADDRESSING',
  FRIENDLY_CLOSE = 'FRIENDLY_CLOSE',
  NATURAL_END = 'NATURAL_END',
}

export interface ConversationContext {
  customerId?: string;
  sessionId: string;
  language: Language;
  detectedLanguagePreference: Language;
  currentIntent: string;
  conversationStage: ConversationStage;
  conversationHistory: Message[];
  customerProfile?: CustomerProfile;
  timezone: string;
  culturalContext: MalaysianCulturalContext;
  salesPersona: SalesPersonaConfig;
  lastActivityAt: Date;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface CustomerProfile {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  preferredLanguage: Language;
  timezone: string;
  culturalContext?: MalaysianCulturalContext;
  preferences?: Record<string, any>;
  purchaseHistory?: any[];
  consultationHistory?: any[];
}

export interface SalesPersonaConfig {
  salespersonName: string;
  companyName: string;
  businessDescription: string;
  companyValues: string;
  productCategory: string;
  currentPromotionDetails?: string;
  targetDemographic?: string;
  priceRange?: string;
}

export interface MalaysianCulturalContext {
  currentFestivalSeason?: string;
  weatherContext?: string;
  regionalPreferences?: string;
  paymentMethodPreferences?: string[];
  deliveryLocationContext?: string;
  businessHours?: {
    start: string;
    end: string;
    timezone: string;
  };
  localHolidays?: string[];
  culturalNotes?: string[];
}

export interface ChatMessageDto {
  sessionId: string;
  customerId?: string;
  message: string;
  platform?: string;
  language?: Language;
  metadata?: Record<string, any>;
}

export interface AIResponse {
  message: string;
  language: Language;
  conversationStage: ConversationStage;
  intent?: string;
  confidence: number;
  suggestions?: string[];
  nextActions?: string[];
  metadata?: Record<string, any>;
}

export interface LanguageDetectionResult {
  language: Language;
  confidence: number;
  detectedText: string;
}

export interface CulturalResponse {
  greeting: string;
  closing: string;
  politenessLevel: 'formal' | 'casual' | 'friendly';
  culturalReferences: string[];
  localContext: string[];
}
