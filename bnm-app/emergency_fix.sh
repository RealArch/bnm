#!/bin/sh

# EMERGENCY FIX: This script tries to bypass the CI scripts entirely
# and fix the CocoaPods issue directly

set -e

echo "🚨 EMERGENCY COCOAPODS FIX"
echo "=========================="

# We're likely in: /Volumes/workspace/repository/
# And we need to get to: /Volumes/workspace/repository/bnm-app/

if [ -d "bnm-app" ]; then
    cd bnm-app
elif [ -f "bnm-app/package.json" ]; then
    cd bnm-app
else
    echo "❌ Cannot locate bnm-app directory"
    pwd
    ls -la
    exit 1
fi

echo "📍 Located bnm-app at: $(pwd)"

# Install Node dependencies quickly
npm install --production --no-audit

# Build the web part
npm run build

# Go to iOS and fix CocoaPods
cd ios/App

# Force clean install of pods
rm -rf Pods/
rm -rf Podfile.lock

# Reinstall
pod install

# Verify
if [ -f "Pods/Target Support Files/Pods-App/Pods-App.release.xcconfig" ]; then
    echo "✅ CocoaPods fixed!"
else
    echo "❌ Still broken"
    exit 1
fi
