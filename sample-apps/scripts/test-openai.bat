@echo off
REM Test script for OpenAI API integration
REM This script tests the AI agent with just OpenAI API key

echo 🧪 Testing AI Sales Agent with OpenAI API...

REM Check if .env file exists
if not exist .env (
    echo 📝 Creating .env file from minimal template...
    copy env.minimal .env
    echo ⚠️  Please edit .env file and add your OpenAI API key
    echo    Replace 'your_openai_api_key_here' with your actual API key
    pause
    exit /b 1
)

REM Check if OpenAI API key is set
findstr /C:"your_openai_api_key_here" .env >nul
if %errorlevel% equ 0 (
    echo ❌ Please set your OpenAI API key in .env file
    echo    Replace 'your_openai_api_key_here' with your actual API key
    pause
    exit /b 1
)

echo ✅ OpenAI API key found in .env file

REM Install dependencies if needed
if not exist node_modules (
    echo 📦 Installing dependencies...
    npm install
)

REM Generate Prisma client
echo 🗄️  Generating Prisma client...
npx prisma generate

REM Start the application
echo 🚀 Starting AI Sales Agent...
echo.
echo The application will start on http://localhost:3000
echo API Documentation: http://localhost:3000/api/docs
echo.
echo Test the AI agent by sending a POST request to:
echo POST http://localhost:3000/api/ai-agent/chat/message
echo.
echo Example request body:
echo {
echo   "sessionId": "test-session-123",
echo   "message": "Hello, I'm looking for a product",
echo   "language": "EN"
echo }
echo.
echo Press Ctrl+C to stop the application
echo.

npm run start:dev
