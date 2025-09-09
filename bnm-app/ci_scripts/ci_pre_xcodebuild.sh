#!/bin/sh

# ci_pre_xcodebuild.sh - CRITICAL: This runs right before Xcode build
set -e

echo "🔥 CRITICAL: Pre-Xcode Build Script Starting"
echo "============================================"
echo "🔍 CI_WORKSPACE: ${CI_WORKSPACE}"
echo "🔍 PWD: $(pwd)"

# Navigate to the correct directory
cd "${CI_WORKSPACE}/bnm-app" || {
    echo "❌ FATAL: Cannot find bnm-app directory"
    find "${CI_WORKSPACE}" -name "package.json" -type f
    exit 1
}

echo "📍 Working in: $(pwd)"

# Verify package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ FATAL: package.json not found"
    ls -la
    exit 1
fi

# Install dependencies FAST
echo "📦 Installing npm dependencies..."
npm ci --no-audit --no-fund || {
    echo "⚠️ npm ci failed, trying npm install..."
    npm install --no-audit --no-fund
}

# Build the web app
echo "🏗️ Building web application..."
npm run build || {
    echo "❌ FATAL: Web build failed"
    exit 1
}

# Navigate to iOS directory and install pods
echo "📱 Preparing iOS build..."
cd ios/App

# Critical: Install CocoaPods dependencies
echo "🍫 Installing CocoaPods dependencies..."
pod install --repo-update --verbose || {
    echo "❌ FATAL: pod install failed"
    exit 1
}

# CRITICAL VERIFICATION
if [ -f "Pods/Target Support Files/Pods-App/Pods-App.release.xcconfig" ]; then
    echo "✅ SUCCESS: Pods-App.release.xcconfig found"
    echo "✅ CocoaPods setup complete"
else
    echo "❌ FATAL: Pods-App.release.xcconfig still missing after pod install"
    echo "🔍 Pods directory contents:"
    find Pods -name "*.xcconfig" -type f 2>/dev/null || echo "No xcconfig files found"
    exit 1
fi

echo "✅ Pre-Xcode build script completed successfully"
