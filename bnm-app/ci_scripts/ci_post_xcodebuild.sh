#!/bin/sh

# ci_post_xcodebuild.sh - For debugging what happened
set -e

echo "🔍 POST-BUILD DIAGNOSTIC SCRIPT"
echo "================================"

echo "📍 Current directory: $(pwd)"
echo "📂 Directory contents:"
ls -la

if [ -d "bnm-app" ]; then
    cd bnm-app
    echo "📂 Entered bnm-app directory"
elif [ -f "package.json" ]; then
    echo "📂 Already in bnm-app directory"
fi

echo "📍 Now in: $(pwd)"

if [ -d "ios/App/Pods" ]; then
    echo "✅ Pods directory exists"
    echo "📋 Pods contents:"
    ls -la ios/App/Pods/
    
    if [ -d "ios/App/Pods/Target Support Files" ]; then
        echo "✅ Target Support Files exists"
        ls -la "ios/App/Pods/Target Support Files/"
        
        if [ -d "ios/App/Pods/Target Support Files/Pods-App" ]; then
            echo "✅ Pods-App directory exists"
            ls -la "ios/App/Pods/Target Support Files/Pods-App/"
        else
            echo "❌ Pods-App directory missing"
        fi
    else
        echo "❌ Target Support Files missing"
    fi
else
    echo "❌ Pods directory does not exist"
fi

# Check if npm and build happened
if [ -d "www" ]; then
    echo "✅ www directory exists (build successful)"
else
    echo "❌ www directory missing (build failed)"
fi

echo "🔍 Diagnostic complete"
