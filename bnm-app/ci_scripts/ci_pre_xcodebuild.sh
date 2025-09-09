#!/bin/sh

# ci_pre_xcodebuild.sh
# Script executed before Xcode build in Xcode Cloud

set -e

echo "🚀 Starting CI Pre-build Script for Capacitor App"

# Install Node.js dependencies
echo "📦 Installing npm dependencies..."
cd "$CI_WORKSPACE/bnm-app"
npm ci

# Install Ionic CLI globally
echo "⚡ Installing Ionic CLI..."
npm install -g @ionic/cli

# Build the web app
echo "🏗️ Building Ionic web app..."
ionic build --prod

# Sync Capacitor
echo "🔄 Syncing Capacitor..."
npx cap sync ios

# Install CocoaPods dependencies
echo "🍫 Installing CocoaPods dependencies..."
cd ios/App
pod install

echo "✅ CI Pre-build Script completed successfully"
