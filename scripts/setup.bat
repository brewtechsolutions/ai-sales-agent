@echo off
REM AI Sales Agent Setup Script for Windows
REM This script sets up the development environment

echo 🚀 Setting up AI Sales Agent...

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
    copy env.example .env
    echo ⚠️  Please edit .env file with your configuration before running the application.
)

REM Generate Prisma client
echo 🗄️  Generating Prisma client...
npx prisma generate

REM Create logs directory
echo 📁 Creating logs directory...
if not exist logs mkdir logs

echo ✅ Setup complete!
echo.
echo Next steps:
echo 1. Edit .env file with your configuration
echo 2. Start the application: npm run start:dev
echo 3. Visit http://localhost:3000/api/docs for API documentation
echo.
echo For production deployment:
echo 1. Use Docker: docker-compose up -d
echo 2. Configure your reverse proxy (Nginx)
echo 3. Set up SSL certificates
echo.
echo Happy coding! 🎉
pause
