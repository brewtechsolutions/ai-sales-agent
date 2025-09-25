import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // Application
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(3000),
  LOG_LEVEL: Joi.string().valid('error', 'warn', 'info', 'debug', 'verbose').default('info'),

  // Database
  DATABASE_URL: Joi.string().required(),

  // AI Configuration
  AI_PROVIDER: Joi.string().valid('openai', 'claude').default('openai'),
  OPENAI_API_KEY: Joi.string().when('AI_PROVIDER', {
    is: 'openai',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  CLAUDE_API_KEY: Joi.string().when('AI_PROVIDER', {
    is: 'claude',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),

  // Authentication
  ENABLE_JWT_AUTH: Joi.boolean().default(false),
  JWT_SECRET: Joi.string().when('ENABLE_JWT_AUTH', {
    is: true,
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  JWT_EXPIRY: Joi.string().default('24h'),
  REFRESH_TOKEN_EXPIRY: Joi.string().default('7d'),

  // Redis
  ENABLE_REDIS: Joi.boolean().default(false),
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_PASSWORD: Joi.string().optional(),
  REDIS_DB: Joi.number().default(0),

  // Payment Gateway (optional for testing)
  CURLEC_SECRET_KEY: Joi.string().optional(),
  CURLEC_PUBLISHABLE_KEY: Joi.string().optional(),
  CURLEC_WEBHOOK_SECRET: Joi.string().optional(),

  // Google Calendar (optional for testing)
  GOOGLE_CLIENT_ID: Joi.string().optional(),
  GOOGLE_CLIENT_SECRET: Joi.string().optional(),
  GOOGLE_REDIRECT_URI: Joi.string().uri().optional(),

  // Email (optional for testing)
  SMTP_HOST: Joi.string().optional(),
  SMTP_PORT: Joi.number().default(587),
  SMTP_USER: Joi.string().email().optional(),
  SMTP_PASS: Joi.string().optional(),

  // SMS (optional for testing)
  TWILIO_ACCOUNT_SID: Joi.string().optional(),
  TWILIO_AUTH_TOKEN: Joi.string().optional(),
  TWILIO_PHONE_NUMBER: Joi.string().optional(),

  // Rate Limiting
  RATE_LIMIT_TTL: Joi.number().default(60),
  RATE_LIMIT_LIMIT: Joi.number().default(100),

  // Security
  CORS_ORIGIN: Joi.string().default('http://localhost:3000'),
  HELMET_ENABLED: Joi.boolean().default(true),

  // Chatbot Integration
  CHATBOT_WEBHOOK_URL: Joi.string().uri().optional(),
  ENABLE_CHATBOT_MODE: Joi.boolean().default(true),
});
