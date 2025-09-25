# 🚀 Quick Start Guide - OpenAI API Testing

This guide will help you get the AI Sales Agent running with just your OpenAI API key for testing.

## Prerequisites

- Node.js 18+ installed
- OpenAI API key
- PostgreSQL database (or use Docker)

## Step 1: Setup Environment

1. **Copy the minimal environment file:**
   ```bash
   copy env.minimal .env
   ```

2. **Edit the .env file and add your OpenAI API key:**
   ```
   OPENAI_API_KEY=sk-your-actual-openai-api-key-here
   ```

3. **Set up your database URL:**
   ```
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ai_sales_agent
   ```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Setup Database

**Option A: Using Docker (Recommended)**
```bash
# Start PostgreSQL with Docker
docker run --name postgres-test -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15

# Run database migrations
npx prisma migrate dev --name init
```

**Option B: Local PostgreSQL**
```bash
# Create database
createdb ai_sales_agent

# Run migrations
npx prisma migrate dev --name init
```

## Step 4: Start the Application

**Windows:**
```bash
scripts\test-openai.bat
```

**Linux/Mac:**
```bash
chmod +x scripts/test-openai.sh
./scripts/test-openai.sh
```

**Manual start:**
```bash
npm run start:dev
```

## Step 5: Test the AI Agent

The application will start on `http://localhost:3000`

### Test with API Documentation
Visit: `http://localhost:3000/api/docs`

### Test with curl
```bash
curl -X POST http://localhost:3000/api/ai-agent/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test-session-123",
    "message": "Hello, I am looking for a product",
    "language": "EN"
  }'
```

### Test with the provided test client
```bash
node test-client.js
```

## Expected Response

You should get a response like:
```json
{
  "message": "Hello! How can I help you today? I'd be happy to assist you in finding the right product for your needs. Could you tell me a bit more about what you're looking for?",
  "language": "EN",
  "conversationStage": "INTRODUCTION",
  "intent": "product_inquiry",
  "confidence": 0.9,
  "suggestions": ["Tell me about your needs", "What are you looking for?"],
  "nextActions": ["schedule_call"],
  "metadata": {
    "provider": "openai",
    "model": "gpt-4",
    "timestamp": "2024-01-01T12:00:00.000Z"
  }
}
```

## Test Different Languages

### English
```json
{
  "sessionId": "test-1",
  "message": "Hello, I need help choosing a product",
  "language": "EN"
}
```

### Bahasa Malaysia
```json
{
  "sessionId": "test-2", 
  "message": "Selamat pagi, saya perlukan bantuan memilih produk",
  "language": "MS"
}
```

### Mandarin
```json
{
  "sessionId": "test-3",
  "message": "你好，我需要帮助选择产品",
  "language": "ZH"
}
```

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Make sure PostgreSQL is running
   - Check your DATABASE_URL in .env
   - Run `npx prisma migrate dev` to create tables

2. **OpenAI API Error**
   - Verify your API key is correct
   - Check if you have sufficient credits
   - Ensure the API key has access to GPT-4

3. **Port Already in Use**
   - Change PORT in .env file
   - Or kill the process using port 3000

### Health Check

Visit `http://localhost:3000/api/health` to check if all services are running properly.

## Next Steps

Once you've confirmed the basic AI agent is working:

1. **Add more features**: Configure payment processing, calendar integration, etc.
2. **Customize the sales persona**: Update the AI agent's personality and company context
3. **Add products**: Use the products API to add your actual products
4. **Set up monitoring**: Configure logging and analytics

## API Endpoints Available

- `POST /api/ai-agent/chat/message` - Send messages to AI agent
- `GET /api/ai-agent/health` - Check AI agent health
- `GET /api/health` - Overall system health
- `GET /api/docs` - API documentation

## Support

If you encounter any issues:
1. Check the logs in the `logs/` directory
2. Verify your .env configuration
3. Ensure all dependencies are installed
4. Check the API documentation at `/api/docs`

Happy testing! 🎉
