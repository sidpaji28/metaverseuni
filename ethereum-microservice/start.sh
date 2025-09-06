#!/bin/bash

# Ethereum Microservice Startup Script
echo "🚀 Starting Ethereum Microservice for Metaverse University..."

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

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "⚙️  Creating .env file from template..."
    cp env.example .env
    echo "✅ .env file created. Please update with your configuration."
fi

# Start the microservice
echo "🎯 Starting Ethereum Microservice on port 3001..."
echo "📊 Health check: http://localhost:3001/health"
echo "🔗 API Base URL: http://localhost:3001/api"
echo "🎓 Metaverse University Ethereum Integration Ready!"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm start
