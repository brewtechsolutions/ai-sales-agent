# AI Sales Agent System

A sophisticated AI-powered sales agent system built with NestJS, specifically designed for Malaysian e-commerce businesses. This system provides intelligent conversation management, cultural context awareness, and seamless integration with Malaysian payment systems.

## 🌟 Features

### Core Features
- **AI-Powered Conversations**: GPT-4/Claude integration with Malaysian cultural context
- **Trilingual Support**: English, Bahasa Malaysia, and Mandarin with automatic language detection
- **8-Stage Sales Framework**: Malaysian-optimized conversation flow
- **Smart Calendar Integration**: Google Calendar with Malaysian business hours
- **Product Recommendations**: AI-driven product suggestions with RAG implementation
- **Payment Processing**: Curlec integration for Malaysian payment methods
- **Real-time Analytics**: Comprehensive conversation and sales analytics

### Malaysian-Specific Features
- **Cultural Context**: Festival awareness, local references, and business etiquette
- **Timezone Handling**: Malaysia Standard Time (MST/GMT+8) support
- **Currency Support**: Malaysian Ringgit (MYR) with proper formatting
- **Local Payment Methods**: FPX, GrabPay, Boost, Touch 'n Go eWallet
- **Business Hours**: Malaysian working hours (9 AM - 6 PM MYT)
- **Holiday Awareness**: Major Malaysian festivals and holidays

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Redis (optional)
- Docker & Docker Compose (for containerized deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-sales-agent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start the application**
   ```bash
   # Development
   npm run start:dev

   # Production
   npm run build
   npm run start:prod
   ```

### Docker Deployment

1. **Using Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **Run database migrations**
   ```bash
   docker-compose exec app npx prisma migrate deploy
   ```

## 📚 API Documentation

Once the application is running, visit:
- **Swagger UI**: http://localhost:3000/api/docs
- **Health Check**: http://localhost:3000/api/health

## 🏗️ Architecture

### Project Structure
```
src/
├── modules/
│   ├── ai-agent/           # Core AI conversation logic
│   ├── calendar/           # Google Calendar integration
│   ├── products/           # Product management & recommendations
│   ├── payments/           # Curlec payment processing
│   ├── customers/          # Customer management
│   ├── consultations/      # Expert consultation booking
│   ├── analytics/          # Conversation & sales analytics
│   ├── notifications/      # Email/SMS notifications
│   ├── auth/               # Optional JWT authentication
│   └── admin/              # Admin dashboard
├── common/
│   ├── cache/              # Redis/Memory caching
│   ├── logger/             # Winston logging
│   ├── guards/             # Authentication guards
│   ├── filters/            # Exception handling
│   └── interceptors/       # Request/Response logging
├── config/                 # Configuration management
└── database/               # Prisma database service
```

### Technology Stack
- **Backend**: NestJS (latest)
- **Database**: PostgreSQL with Prisma ORM
- **AI/LLM**: OpenAI GPT-4 / Claude API
- **Caching**: Redis (optional, with memory fallback)
- **Queue**: Bull/BullMQ for background jobs
- **Calendar**: Google Calendar API
- **Payments**: Curlec for Malaysian market
- **Monitoring**: Winston logging
- **Documentation**: Swagger/OpenAPI 3.0

## 🔧 Configuration

### Environment Variables

#### Required
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/ai_sales_agent
OPENAI_API_KEY=your_openai_key
CURLEC_SECRET_KEY=your_curlec_secret_key
CURLEC_PUBLISHABLE_KEY=your_curlec_publishable_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

#### Optional
```bash
# Authentication (disabled by default for chatbot integration)
ENABLE_JWT_AUTH=false
JWT_SECRET=your_jwt_secret

# Redis (disabled by default, uses memory cache)
ENABLE_REDIS=false
REDIS_HOST=localhost
REDIS_PORT=6379

# AI Provider
AI_PROVIDER=openai  # or claude

# Email/SMS
SMTP_HOST=smtp.gmail.com
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
```

## 🤖 AI Agent Features

### Conversation Management
- **Dynamic Persona**: Configurable sales agent personality
- **Language Detection**: Automatic detection and mirroring of customer language
- **Cultural Context**: Malaysian festival and cultural awareness
- **8-Stage Flow**: Introduction → Discovery → Story Sharing → Needs Understanding → Solution Recommendation → Concern Addressing → Friendly Close → Natural End

### Malaysian Cultural Integration
- **Festival Awareness**: Chinese New Year, Hari Raya, Deepavali, Christmas
- **Local References**: KL traffic, Malaysian weather, local business practices
- **Payment Methods**: FPX, online banking, e-wallets
- **Business Etiquette**: Respectful, relationship-focused communication

## 📊 Analytics & Monitoring

### Conversation Analytics
- Total conversations and active sessions
- Language distribution and usage patterns
- Average response times and customer satisfaction
- Conversion rates and sales funnel analysis

### Sales Analytics
- Revenue tracking and payment analytics
- Product recommendation effectiveness
- Customer journey mapping
- Performance metrics and KPIs

## 🔒 Security & Compliance

- **Data Protection**: Malaysian PDPA compliance
- **API Security**: Rate limiting, input validation, CORS
- **Authentication**: Optional JWT with flexible configuration
- **Audit Logging**: Comprehensive operation tracking
- **Error Handling**: Graceful degradation and fallback mechanisms

## 🚀 Deployment

### Production Deployment
1. Set up PostgreSQL database
2. Configure environment variables
3. Run database migrations
4. Deploy using Docker or directly with Node.js
5. Set up reverse proxy (Nginx)
6. Configure SSL certificates
7. Set up monitoring and logging

### Scaling Considerations
- Horizontal scaling with load balancers
- Database connection pooling
- Redis clustering for high availability
- CDN for static assets
- Container orchestration (Kubernetes)

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📝 Development

### Code Quality
- TypeScript strict mode
- ESLint + Prettier
- Husky pre-commit hooks
- Comprehensive error handling

### Database Management
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Open Prisma Studio
npx prisma studio
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation at `/api/docs`
- Review the logs in the `logs/` directory

## 🔄 Updates

### Recent Updates
- Initial release with full Malaysian market optimization
- AI conversation engine with cultural context
- Payment integration with Curlec
- Calendar integration with Google Calendar
- Comprehensive analytics and monitoring

---

Built with ❤️ for Malaysian businesses by BrewTech Project
