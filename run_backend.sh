#!/bin/bash

# MediVault Backend Startup Script
echo "🏥 Starting MediVault Backend Server"
echo "===================================="

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "❌ Virtual environment not found. Please run setup first:"
    echo "   cd .. && ./run_local.sh setup"
    exit 1
fi

# Activate virtual environment
echo "🔄 Activating virtual environment..."
source venv/bin/activate

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please update the .env file with your configuration"
fi

# Check if database exists
if [ ! -f "medivault.db" ]; then
    echo "🗄️  Database not found. Creating database..."
    python manage.py create_db
    python manage.py seed_data
fi

# Create uploads directory if it doesn't exist
if [ ! -d "uploads" ]; then
    echo "📁 Creating uploads directory..."
    mkdir -p uploads
fi

# Start the Flask server
echo "🚀 Starting Flask server on http://localhost:5000"
echo "📋 API Documentation available at http://localhost:5000/api"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python app.py
