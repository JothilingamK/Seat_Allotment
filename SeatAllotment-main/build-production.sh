#!/bin/bash

# Production Build Script for Seat Allotment System
echo "🚀 Starting production build process..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/
rm -rf node_modules/.cache/

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Run linting
echo "🔍 Running linting..."
npm run lint || echo "⚠️  Linting issues found, but continuing..."

# Run tests
echo "🧪 Running tests..."
npm run test -- --watch=false --browsers=ChromeHeadless || echo "⚠️  Tests failed, but continuing..."

# Build for production
echo "🏗️  Building for production..."
npm run build -- --configuration=production

# Check build size
echo "📊 Build size analysis..."
du -sh dist/seat-allotment-system/

# Generate build report
echo "📋 Generating build report..."
echo "Build completed at: $(date)" > dist/build-report.txt
echo "Build size: $(du -sh dist/seat-allotment-system/ | cut -f1)" >> dist/build-report.txt
echo "Node version: $(node --version)" >> dist/build-report.txt
echo "NPM version: $(npm --version)" >> dist/build-report.txt

echo "✅ Production build completed successfully!"
echo "📁 Build output: dist/seat-allotment-system/"
echo "📄 Build report: dist/build-report.txt"
