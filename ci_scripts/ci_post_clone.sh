#!/bin/sh
# Install Homebrew (needed for Node.js and CocoaPods)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Add Homebrew to PATH
(echo; echo 'eval "$(/opt/homebrew/bin/brew shellenv)"') >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"

# Install Node.js
brew install node 

# Install CocoaPods
brew install cocoapods

# Navigate to the correct project directory (bnm/bnm-app)
cd $CI_WORKSPACE/bnm-app

# Install Node.js dependencies
npm install

# Run Capacitor sync to ensure iOS dependencies are updated
npx cap sync ios

# Navigate to the iOS directory
cd ios/App

# Install CocoaPods dependencies
pod install