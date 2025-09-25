export const configuration = () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'info',

  // Database
  database: {
    url: process.env.DATABASE_URL,
  },

  // AI Configuration
  ai: {
    provider: process.env.AI_PROVIDER || 'openai',
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
    },
    claude: {
      apiKey: process.env.CLAUDE_API_KEY,
    },
  },

  // Authentication
  auth: {
    enableJwt: process.env.ENABLE_JWT_AUTH === 'true',
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiry: process.env.JWT_EXPIRY || '24h',
    refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY || '7d',
  },

  // Redis
  redis: {
    enabled: process.env.ENABLE_REDIS === 'true',
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB, 10) || 0,
  },

  // Payment Gateway
  payment: {
    curlec: {
      secretKey: process.env.CURLEC_SECRET_KEY,
      publishableKey: process.env.CURLEC_PUBLISHABLE_KEY,
      webhookSecret: process.env.CURLEC_WEBHOOK_SECRET,
    },
  },

  // Google Calendar
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
  },

  // Email
  email: {
    smtp: {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10) || 587,
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  },

  // SMS
  sms: {
    twilio: {
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
      phoneNumber: process.env.TWILIO_PHONE_NUMBER,
    },
  },

  // Rate Limiting
  rateLimit: {
    ttl: parseInt(process.env.RATE_LIMIT_TTL, 10) || 60,
    limit: parseInt(process.env.RATE_LIMIT_LIMIT, 10) || 100,
  },

  // Security
  security: {
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    helmetEnabled: process.env.HELMET_ENABLED !== 'false',
  },

  // Chatbot Integration
  chatbot: {
    webhookUrl: process.env.CHATBOT_WEBHOOK_URL,
    enableChatbotMode: process.env.ENABLE_CHATBOT_MODE === 'true',
  },
});
