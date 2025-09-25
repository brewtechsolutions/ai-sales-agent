#!/bin/bash

# Test script for OpenAI API integration
# This script tests the AI agent with just OpenAI API key

echo "🧪 Testing AI Sales Agent with OpenAI API..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from minimal template..."
    cp env.minimal .env
    echo "⚠️  Please edit .env file and add your OpenAI API key"
    echo "   Replace 'your_openai_api_key_here' with your actual API key"
    exit 1
fi

# Check if OpenAI API key is set
if grep -q "your_openai_api_key_here" .env; then
    echo "❌ Please set your OpenAI API key in .env file"
    echo "   Replace 'your_openai_api_key_here' with your actual API key"
    exit 1
fi

echo "✅ OpenAI API key found in .env file"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Generate Prisma client
echo "🗄️  Generating Prisma client..."
npx prisma generate

# Start the application
echo "🚀 Starting AI Sales Agent..."
echo ""
echo "The application will start on http://localhost:3000"
echo "API Documentation: http://localhost:3000/api/docs"
echo ""
echo "Test the AI agent by sending a POST request to:"
echo "POST http://localhost:3000/api/ai-agent/chat/message"
echo ""
echo "Example request body:"
echo "{"
echo "  \"sessionId\": \"test-session-123\","
echo "  \"message\": \"Hello, I'm looking for a product\","
echo "  \"language\": \"EN\""
echo "}"
echo ""
echo "Press Ctrl+C to stop the application"
echo ""

npm run start:dev
