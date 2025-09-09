# Xcode Cloud Configuration Instructions

## The Problem
Xcode Cloud cannot find the CocoaPods configuration files because it's not running the setup scripts in the correct directory or order.

## Step-by-Step Solution

### 1. Xcode Cloud Project Configuration
When setting up your workflow in App Store Connect:

- **Repository**: Your main repository (containing bnm-app folder)
- **Primary Repository Path**: `bnm-app`
- **Xcode Project**: `ios/App/App.xcworkspace` (NOT .xcodeproj)
- **Scheme**: `App`
- **Configuration**: `Release`

### 2. Environment Variables (if needed)
In Xcode Cloud workflow settings, add:
- `CI_WORKSPACE`: Should automatically point to your repo root
- `NODE_VERSION`: `18` (or your preferred version)

### 3. Critical Files to Commit
Make sure these files are committed to git:
```
bnm-app/
├── ci_scripts/
│   ├── ci_post_clone.sh          ← Executable
│   ├── ci_pre_xcodebuild.sh      ← Executable  
│   └── ci_post_xcodebuild.sh     ← Executable (for debugging)
├── ios/App/
│   ├── Podfile                   ← Must be committed
│   ├── Podfile.lock              ← Must be committed
│   ├── App.xcworkspace/          ← Must be committed
│   └── App.xcodeproj/            ← Must be committed
├── package.json                  ← Must be committed
└── package-lock.json             ← Must be committed
```

### 4. Alternative: Simplified Approach
If scripts still don't work, try building without CocoaPods by:
1. Removing CocoaPods dependencies temporarily
2. Using only Swift Package Manager
3. Or using a local build and uploading manually

### 5. Debugging Commands
Check these in your Xcode Cloud logs:
- Directory structure: `find . -name "*.xcconfig"`
- Script execution: Look for "ci_post_clone.sh" in logs
- Pod installation: Look for "pod install" output
