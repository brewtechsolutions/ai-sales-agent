#!/bin/bash

# Complete setup script with database seeding
# This script sets up everything including sample data

echo "🚀 Setting up AI Sales Agent with sample data..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Copy environment file
if [ ! -f .env ]; then
    echo "📝 Creating environment file..."
    cp env.minimal .env
    echo "⚠️  Please edit .env file and add your OpenAI API key"
    echo "   Replace 'your_openai_api_key_here' with your actual API key"
    echo ""
    echo "Press Enter after you've updated the .env file..."
    read
fi

# Check if OpenAI API key is set
if grep -q "your_openai_api_key_here" .env; then
    echo "❌ Please set your OpenAI API key in .env file"
    echo "   Replace 'your_openai_api_key_here' with your actual API key"
    exit 1
fi

echo "✅ OpenAI API key found in .env file"

# Generate Prisma client
echo "🗄️  Generating Prisma client..."
npx prisma generate

# Check if PostgreSQL is running
echo "🔍 Checking PostgreSQL connection..."
if ! psql -h localhost -U postgres -d postgres -c "SELECT 1;" &> /dev/null; then
    echo "⚠️  PostgreSQL not accessible. Starting with Docker..."
    echo ""
    echo "Starting PostgreSQL with Docker..."
    docker run --name postgres-ai-sales -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15
    echo ""
    echo "Waiting for PostgreSQL to start..."
    sleep 10
fi

# Run database migrations
echo "🔄 Running database migrations..."
npx prisma migrate dev --name init

# Seed the database
echo "🌱 Seeding database with sample data..."
npm run seed

# Create logs directory
echo "📁 Creating logs directory..."
mkdir -p logs

echo ""
echo "✅ Setup complete with sample data!"
echo ""
echo "📊 Sample data created:"
echo "- 1 Admin user (admin@aisalesagent.com / admin123)"
echo "- 3 Sample customers (English, Malay, Chinese)"
echo "- 5 Sample products"
echo "- 2 Sales personas"
echo "- 2 Sample conversations"
echo "- 2 Sample consultations"
echo "- 2 Sample payments"
echo "- Product recommendations"
echo "- Analytics data"
echo ""
echo "🧪 Test sessions available:"
echo "- demo-session-1 (English customer)"
echo "- demo-session-2 (Malay customer)"
echo ""
echo "🚀 Starting the application..."
echo ""
echo "The application will start on http://localhost:3000"
echo "API Documentation: http://localhost:3000/api/docs"
echo ""
echo "Test the AI agent with:"
echo "POST http://localhost:3000/api/ai-agent/chat/message"
echo ""
echo "Example request:"
echo "{"
echo "  \"sessionId\": \"demo-session-1\","
echo "  \"message\": \"Hello, I need help with my business\","
echo "  \"language\": \"EN\""
echo "}"
echo ""
echo "Press Ctrl+C to stop the application"
echo ""

npm run start:dev
