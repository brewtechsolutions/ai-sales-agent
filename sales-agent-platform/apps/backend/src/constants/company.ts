/**
 * Company-related constants and enums
 */

export enum CompanyStatus {
  ACTIVE = "active",
  SUSPENDED = "suspended",
  TRIAL = "trial",
}

export enum IndustryCategory {
  E_COMMERCE = "E-commerce",
  REAL_ESTATE = "Real Estate",
  EDUCATION = "Education/Courses",
  HEALTHCARE = "Healthcare",
  PROFESSIONAL_SERVICES = "Professional Services",
  RESTAURANT = "Restaurant/Food & Beverage",
  FITNESS = "Fitness/Wellness",
  FINANCIAL_SERVICES = "Financial Services",
  TRAVEL = "Travel/Tourism",
  SAAS = "SaaS/Technology",
  CUSTOM = "Custom",
}

export enum Language {
  ENGLISH = "en",
  BAHASA_MALAYSIA = "bm",
  MANDARIN = "zh",
  TAMIL = "ta",
}

export const SUPPORTED_LANGUAGES = [
  Language.ENGLISH,
  Language.BAHASA_MALAYSIA,
  Language.MANDARIN,
  Language.TAMIL,
] as const;

export enum AssignmentStrategy {
  ROUND_ROBIN = "round_robin",
  MANUAL = "manual",
  WORKLOAD = "workload",
}

/**
 * Country codes (ISO 3166-1 alpha-2 or common names)
 * Focused on Southeast Asia region
 */
export enum CountryCode {
  MALAYSIA = "MY",
  SINGAPORE = "SG",
  INDONESIA = "ID",
  THAILAND = "TH",
  PHILIPPINES = "PH",
  VIETNAM = "VN",
  BRUNEI = "BN",
  CAMBODIA = "KH",
  MYANMAR = "MM",
  LAOS = "LA",
}

/**
 * Currency codes (ISO 4217)
 * Common currencies in Southeast Asia
 */
export enum CurrencyCode {
  MYR = "MYR", // Malaysian Ringgit
  SGD = "SGD", // Singapore Dollar
  IDR = "IDR", // Indonesian Rupiah
  THB = "THB", // Thai Baht
  PHP = "PHP", // Philippine Peso
  VND = "VND", // Vietnamese Dong
  BND = "BND", // Brunei Dollar
  USD = "USD", // US Dollar
  EUR = "EUR", // Euro
}

/**
 * Date format options
 */
export enum DateFormat {
  DD_MM_YYYY = "DD/MM/YYYY",
  MM_DD_YYYY = "MM/DD/YYYY",
  YYYY_MM_DD = "YYYY-MM-DD",
  DD_MMM_YYYY = "DD MMM YYYY",
  MMM_DD_YYYY = "MMM DD, YYYY",
}

