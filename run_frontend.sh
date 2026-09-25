#!/bin/bash

# MediVault Frontend Startup Script
echo "🎨 Starting MediVault Frontend Server"
echo "====================================="

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "❌ Dependencies not installed. Please run setup first:"
    echo "   cd .. && ./run_local.sh setup"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
fi

# Start the development server
echo "🚀 Starting Vite development server on http://localhost:3000"
echo "🔄 Hot reload enabled for development"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
