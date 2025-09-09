#!/bin/sh
set -e # Exit on any error

echo "Starting ci_post_clone.sh"

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
echo "Navigating to $CI_WORKSPACE/bnm-app"
cd $CI_WORKSPACE/bnm-app || { echo "Failed to navigate to $CI_WORKSPACE/bnm-app"; exit 1; }

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