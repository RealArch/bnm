#!/bin/sh
set -e # Exit on any error

echo "🚀 Starting ci_post_clone.sh for BNM App"
echo "========================================"
echo "🔍 CI_WORKSPACE: ${CI_WORKSPACE}"
echo "🔍 PWD: $(pwd)"
echo "🔍 Available directories:"
ls -la

# Navigate to the correct directory - CI_WORKSPACE points to repository root
echo "📂 Navigating to bnm-app directory..."
cd "${CI_WORKSPACE}/bnm-app" || {
    echo "❌ Failed to navigate to ${CI_WORKSPACE}/bnm-app"
    echo "🔍 Searching for bnm-app directory..."
    find "${CI_WORKSPACE}" -name "bnm-app" -type d || echo "bnm-app directory not found"
    echo "🔍 Looking for package.json files..."
    find "${CI_WORKSPACE}" -name "package.json" -type f || echo "No package.json found"
    exit 1
}

echo "📍 Current directory: $(pwd)"
echo "📋 Directory contents:"
ls -la

# Install Homebrew
echo "Installing Homebrew..."
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Add Homebrew to PATH
echo "Setting up Homebrew PATH..."
(echo; echo 'eval "$(/opt/homebrew/bin/brew shellenv)"') >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"

# Verify Homebrew installation
brew --version

# Install Node.js
echo "Installing Node.js..."
brew install node
node --version
npm --version

# Install CocoaPods
echo "Installing CocoaPods..."
brew install cocoapods
pod --version

# Navigate to the project directory
echo "📂 Navigating to project directory..."
echo "Current directory: $(pwd)"

# We should already be in bnm-app from the checks above
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found in current directory"
    ls -la
    exit 1
fi

# Verify current directory
pwd

# Install Node.js dependencies
echo "Running npm install..."
npm install

# Sync Capacitor iOS dependencies
echo "Running npx cap sync ios..."
npx cap sync ios

# Navigate to the iOS App directory
echo "Navigating to ios/App..."
cd ios/App || { echo "Failed to navigate to ios/App"; exit 1; }

# Verify Podfile exists
if [ -f "Podfile" ]; then
  echo "Podfile found"
else
  echo "Podfile not found!"
  exit 1
fi

# Install CocoaPods dependencies
echo "Running pod install..."
pod install

# Verify xcconfig file exists
if [ -f "Pods/Target Support Files/Pods-App/Pods-App.release.xcconfig" ]; then
  echo "Pods-App.release.xcconfig found"
else
  echo "Pods-App.release.xcconfig not found!"
  exit 1
fi

echo "ci_post_clone.sh completed successfully"