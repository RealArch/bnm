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

# Navigate to the project root directory
cd $CI_WORKSPACE

# Install Node.js dependencies
npm install

# Navigate to the iOS directory
cd ios

# Install CocoaPods dependencies
pod install