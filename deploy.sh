#!/bin/bash

# Cancer Aid Navigator AI - Deployment Script
# This script automates the deployment process

echo "🚀 Starting Cancer Aid Navigator AI Deployment..."
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Run build
echo "🔨 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build completed successfully"

# Check if Firebase CLI is installed
if command -v firebase &> /dev/null; then
    echo "🔥 Firebase CLI found. Deploying to Firebase..."
    firebase deploy
    
    if [ $? -eq 0 ]; then
        echo "✅ Successfully deployed to Firebase!"
        echo "🌐 Your app is live at: https://cancer-aid-navigator-ai-2025.web.app"
    else
        echo "❌ Firebase deployment failed"
        exit 1
    fi
else
    echo "⚠️  Firebase CLI not found. Please install it with:"
    echo "   npm install -g firebase-tools"
    echo "   firebase login"
    echo "   firebase init hosting"
    echo ""
    echo "📁 Build files are ready in the 'dist' directory"
    echo "   You can manually deploy these files to any hosting provider"
fi

echo ""
echo "🎉 Deployment process completed!"
echo "=================================================="