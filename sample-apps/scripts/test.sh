#!/bin/bash

# AI Sales Agent Test Script
# This script runs all tests for the application

set -e

echo "🧪 Running AI Sales Agent tests..."

# Check if tests should be run in watch mode
WATCH_MODE=${1:-false}

# Run unit tests
echo "🔬 Running unit tests..."
if [ "$WATCH_MODE" = "watch" ]; then
    npm run test:watch
else
    npm run test
fi

# Run e2e tests
echo "🔬 Running e2e tests..."
npm run test:e2e

# Run test coverage
echo "📊 Generating test coverage report..."
npm run test:cov

echo "✅ All tests completed successfully!"
echo ""
echo "Test coverage report generated in coverage/ directory"
echo "View the report by opening coverage/lcov-report/index.html in your browser"
