#!/bin/sh

# ci_pre_xcodebuild.sh - CRITICAL: This runs right before Xcode build
set -e

echo "� CRITICAL: Pre-Xcode Build Script Starting"
echo "Current directory: $(pwd)"
echo "Available files:"
ls -la

# Find the correct directory
if [ -d "bnm-app" ]; then
    echo "� Entering bnm-app directory"
    cd bnm-app
elif [ -f "package.json" ]; then
    echo "📂 Already in correct directory"
else
    echo "❌ ERROR: Cannot find bnm-app or package.json"
    find . -name "package.json" -type f
    exit 1
fi

echo "📍 Working in: $(pwd)"

# Install dependencies
echo "📦 Installing npm dependencies..."
npm ci || npm install

# Build the web app
echo "🏗️ Building web application..."
npm run build

# Ensure Capacitor is synced
echo "🔄 Syncing Capacitor..."
npx cap sync ios

# Navigate to iOS directory
cd ios/App

# Install CocoaPods dependencies
echo "🍫 Installing CocoaPods..."
pod install --repo-update

# Verify the critical files exist
if [ -f "Pods/Target Support Files/Pods-App/Pods-App.release.xcconfig" ]; then
    echo "✅ SUCCESS: Pods-App.release.xcconfig found"
else
    echo "❌ ERROR: Pods-App.release.xcconfig still missing"
    echo "Contents of Pods directory:"
    find Pods -name "*.xcconfig" -type f || echo "No xcconfig files found"
    exit 1
fi

echo "✅ Pre-Xcode build script completed successfully"
