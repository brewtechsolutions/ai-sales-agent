#!/bin/bash

# AI Sales Agent Production Deployment Script
# This script deploys the application to production

set -e

echo "🚀 Deploying AI Sales Agent to production..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are available"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please create it from env.example"
    exit 1
fi

# Build and start services
echo "🔨 Building and starting services..."
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check if services are running
echo "🔍 Checking service health..."

# Check database
if docker-compose exec -T postgres pg_isready -U postgres; then
    echo "✅ Database is ready"
else
    echo "❌ Database is not ready"
    exit 1
fi

# Check Redis (if enabled)
if docker-compose exec -T redis redis-cli ping | grep -q PONG; then
    echo "✅ Redis is ready"
else
    echo "⚠️  Redis is not ready (this is optional)"
fi

# Check application
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ Application is ready"
else
    echo "❌ Application is not ready"
    exit 1
fi

# Run database migrations
echo "🔄 Running database migrations..."
docker-compose exec app npx prisma migrate deploy

# Create admin user (optional)
echo "👤 Creating admin user..."
read -p "Do you want to create an admin user? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Enter admin email: " admin_email
    read -p "Enter admin password: " -s admin_password
    echo
    read -p "Enter admin name: " admin_name
    
    docker-compose exec app node -e "
    const { PrismaClient } = require('@prisma/client');
    const bcrypt = require('bcrypt');
    
    async function createAdmin() {
      const prisma = new PrismaClient();
      const hashedPassword = await bcrypt.hash('$admin_password', 10);
      
      try {
        await prisma.adminUser.create({
          data: {
            email: '$admin_email',
            password: hashedPassword,
            name: '$admin_name',
            role: 'admin'
          }
        });
        console.log('Admin user created successfully');
      } catch (error) {
        console.error('Error creating admin user:', error.message);
      } finally {
        await prisma.\$disconnect();
      }
    }
    
    createAdmin();
    "
fi

echo "✅ Deployment complete!"
echo ""
echo "Application is running at:"
echo "- API: http://localhost:3000"
echo "- Documentation: http://localhost:3000/api/docs"
echo "- Health Check: http://localhost:3000/api/health"
echo ""
echo "To view logs:"
echo "- Application: docker-compose logs -f app"
echo "- Database: docker-compose logs -f postgres"
echo "- Redis: docker-compose logs -f redis"
echo ""
echo "To stop the application:"
echo "docker-compose down"
echo ""
echo "Happy selling! 🎉"
