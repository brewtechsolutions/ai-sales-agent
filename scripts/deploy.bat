@echo off
REM AI Sales Agent Production Deployment Script for Windows
REM This script deploys the application to production

echo 🚀 Deploying AI Sales Agent to production...

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker first.
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

echo ✅ Docker and Docker Compose are available

REM Check if .env file exists
if not exist .env (
    echo ❌ .env file not found. Please create it from env.example
    pause
    exit /b 1
)

REM Build and start services
echo 🔨 Building and starting services...
docker-compose down
docker-compose build --no-cache
docker-compose up -d

REM Wait for services to be ready
echo ⏳ Waiting for services to be ready...
timeout /t 30 /nobreak >nul

REM Check if services are running
echo 🔍 Checking service health...

REM Check application
curl -f http://localhost:3000/api/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Application is ready
) else (
    echo ❌ Application is not ready
    pause
    exit /b 1
)

REM Run database migrations
echo 🔄 Running database migrations...
docker-compose exec app npx prisma migrate deploy

echo ✅ Deployment complete!
echo.
echo Application is running at:
echo - API: http://localhost:3000
echo - Documentation: http://localhost:3000/api/docs
echo - Health Check: http://localhost:3000/api/health
echo.
echo To view logs:
echo - Application: docker-compose logs -f app
echo - Database: docker-compose logs -f postgres
echo - Redis: docker-compose logs -f redis
echo.
echo To stop the application:
echo docker-compose down
echo.
echo Happy selling! 🎉
pause
