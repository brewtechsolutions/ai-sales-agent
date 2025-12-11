/**
 * AI-related constants and enums
 */

export enum ResponseStyle {
  FORMAL = "formal",
  CASUAL = "casual",
  FRIENDLY = "friendly",
  PROFESSIONAL = "professional",
}

export enum RLHFStyleMatching {
  TOP_AGENT = "top_agent",
  COMPANY_AVERAGE = "company_average",
  CUSTOM = "custom",
}

export const ROBOTIC_PHRASES = [
  "I understand",
  "Let me help you",
  "I'd be happy to",
  "Is there anything else I can help you with?",
  "Thank you for contacting us",
  "How may I assist you",
  "I hope this helps",
  "Please let me know if you have any questions",
] as const;

export const DEFAULT_AI_CONFIG = {
  TEMPERATURE: 0.7,
  MAX_TOKENS: 1000,
  SUCCESS_PATTERNS_WEIGHT: 0.3,
  PRODUCT_CATALOG_WEIGHT: 0.2,
  FAQ_WEIGHT: 0.2,
  TRAINING_MATERIALS_WEIGHT: 0.3,
  RLHF_HUMAN_LIKENESS_TARGET: 0.85,
  RLHF_LEARNING_RATE: 0.1,
} as const;

