#!/bin/bash

# AI Sales Agent Lint Script
# This script runs linting and formatting checks

set -e

echo "🔍 Running AI Sales Agent linting..."

# Run ESLint
echo "🔍 Running ESLint..."
npm run lint

# Run Prettier check
echo "🎨 Checking code formatting with Prettier..."
npx prettier --check "src/**/*.ts" "test/**/*.ts"

echo "✅ Linting completed successfully!"
echo ""
echo "All code follows the project's style guidelines"
