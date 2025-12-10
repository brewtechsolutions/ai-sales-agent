@echo off
REM Complete setup script with database seeding
REM This script sets up everything including sample data

echo 🚀 Setting up AI Sales Agent with sample data...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Copy environment file
if not exist .env (
    echo 📝 Creating environment file...
    copy env.minimal .env
    echo ⚠️  Please edit .env file and add your OpenAI API key
    echo    Replace 'your_openai_api_key_here' with your actual API key
    echo.
    echo Press any key after you've updated the .env file...
    pause
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

REM Generate Prisma client
echo 🗄️  Generating Prisma client...
npx prisma generate

REM Check if PostgreSQL is running
echo 🔍 Checking PostgreSQL connection...
psql -h localhost -U postgres -d postgres -c "SELECT 1;" >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  PostgreSQL not accessible. Starting with Docker...
    echo.
    echo Starting PostgreSQL with Docker...
    docker run --name postgres-ai-sales -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15
    echo.
    echo Waiting for PostgreSQL to start...
    timeout /t 10 /nobreak >nul
)

REM Run database migrations
echo 🔄 Running database migrations...
npx prisma migrate dev --name init

REM Seed the database
echo 🌱 Seeding database with sample data...
npm run seed

REM Create logs directory
echo 📁 Creating logs directory...
if not exist logs mkdir logs

echo.
echo ✅ Setup complete with sample data!
echo.
echo 📊 Sample data created:
echo - 1 Admin user (admin@aisalesagent.com / admin123)
echo - 3 Sample customers (English, Malay, Chinese)
echo - 5 Sample products
echo - 2 Sales personas
echo - 2 Sample conversations
echo - 2 Sample consultations
echo - 2 Sample payments
echo - Product recommendations
echo - Analytics data
echo.
echo 🧪 Test sessions available:
echo - demo-session-1 (English customer)
echo - demo-session-2 (Malay customer)
echo.
echo 🚀 Starting the application...
echo.
echo The application will start on http://localhost:3000
echo API Documentation: http://localhost:3000/api/docs
echo.
echo Test the AI agent with:
echo POST http://localhost:3000/api/ai-agent/chat/message
echo.
echo Example request:
echo {
echo   "sessionId": "demo-session-1",
echo   "message": "Hello, I need help with my business",
echo   "language": "EN"
echo }
echo.
echo Press Ctrl+C to stop the application
echo.

npm run start:dev
