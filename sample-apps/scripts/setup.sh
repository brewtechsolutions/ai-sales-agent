#!/bin/bash

# AI Sales Agent Setup Script
# This script sets up the development environment

set -e

echo "🚀 Setting up AI Sales Agent..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL is not installed. Please install PostgreSQL 15+ first."
    echo "   You can use Docker: docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Copy environment file
if [ ! -f .env ]; then
    echo "📝 Creating environment file..."
    cp env.example .env
    echo "⚠️  Please edit .env file with your configuration before running the application."
fi

# Generate Prisma client
echo "🗄️  Generating Prisma client..."
npx prisma generate

# Check if database is accessible
echo "🔍 Checking database connection..."
if command -v psql &> /dev/null; then
    if psql -h localhost -U postgres -d postgres -c "SELECT 1;" &> /dev/null; then
        echo "✅ Database connection successful"
        
        # Run migrations
        echo "🔄 Running database migrations..."
        npx prisma migrate dev --name init
    else
        echo "⚠️  Database connection failed. Please ensure PostgreSQL is running and configured."
        echo "   You can start PostgreSQL with: docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15"
    fi
else
    echo "⚠️  PostgreSQL client not found. Skipping database setup."
fi

# Create logs directory
echo "📁 Creating logs directory..."
mkdir -p logs

# Set up Git hooks (if .git exists)
if [ -d .git ]; then
    echo "🔧 Setting up Git hooks..."
    # Add pre-commit hook for linting
    cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
npm run lint
npm run test
EOF
    chmod +x .git/hooks/pre-commit
fi

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your configuration"
echo "2. Start the application: npm run start:dev"
echo "3. Visit http://localhost:3000/api/docs for API documentation"
echo ""
echo "For production deployment:"
echo "1. Use Docker: docker-compose up -d"
echo "2. Configure your reverse proxy (Nginx)"
echo "3. Set up SSL certificates"
echo ""
echo "Happy coding! 🎉"
