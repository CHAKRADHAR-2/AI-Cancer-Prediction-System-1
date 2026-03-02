#!/usr/bin/env python3
"""
Firebase Deployment Script for AI Cancer Prediction System
Deploys the React frontend to Firebase Hosting
"""

import subprocess
import os
import json
from pathlib import Path

def run_command(command, description, cwd=None):
    """Run a command and handle errors"""
    print(f"Running: {description}")
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True, cwd=cwd)
        if result.returncode == 0:
            print(f"✅ {description} - Success")
            if result.stdout.strip():
                print(f"   Output: {result.stdout.strip()}")
            return True
        else:
            print(f"❌ {description} - Failed")
            print(f"   Error: {result.stderr.strip()}")
            return False
    except Exception as e:
        print(f"❌ {description} - Exception: {e}")
        return False

def check_firebase_cli():
    """Check if Firebase CLI is installed"""
    result = subprocess.run("firebase --version", shell=True, capture_output=True, text=True)
    if result.returncode == 0:
        print(f"✅ Firebase CLI installed: {result.stdout.strip()}")
        return True
    else:
        print("❌ Firebase CLI not installed")
        print("📦 Installing Firebase CLI...")
        return run_command("npm install -g firebase-tools", "Installing Firebase CLI")

def deploy_to_firebase():
    """Deploy the application to Firebase"""
    
    print("🚀 DEPLOYING AI CANCER PREDICTION SYSTEM TO FIREBASE")
    print("=" * 60)
    
    # Step 1: Check Firebase CLI
    if not check_firebase_cli():
        print("❌ Cannot proceed without Firebase CLI")
        return False
    
    # Step 2: Navigate to frontend directory
    frontend_dir = Path("cancer-aid-navigator-ai-main")
    if not frontend_dir.exists():
        print("❌ Frontend directory not found!")
        return False
    
    print(f"📁 Working in directory: {frontend_dir}")
    
    # Step 3: Install dependencies
    print("\n📦 Installing frontend dependencies...")
    if not run_command("npm install", "Installing dependencies", cwd=frontend_dir):
        return False
    
    # Step 4: Build the application
    print("\n🔨 Building React application...")
    if not run_command("npm run build", "Building application", cwd=frontend_dir):
        return False
    
    # Step 5: Check if firebase.json exists
    firebase_config = frontend_dir / "firebase.json"
    if not firebase_config.exists():
        print("⚠️ firebase.json not found, creating default configuration...")
        
        config = {
            "hosting": {
                "public": "dist",
                "ignore": [
                    "firebase.json",
                    "**/.*",
                    "**/node_modules/**"
                ],
                "rewrites": [
                    {
                        "source": "**",
                        "destination": "/index.html"
                    }
                ]
            }
        }
        
        with open(firebase_config, 'w') as f:
            json.dump(config, f, indent=2)
        print("✅ Created firebase.json configuration")
    
    # Step 6: Login to Firebase (if needed)
    print("\n🔐 Checking Firebase authentication...")
    result = subprocess.run("firebase projects:list", shell=True, capture_output=True, text=True, cwd=frontend_dir)
    if result.returncode != 0:
        print("🔑 Please login to Firebase...")
        if not run_command("firebase login", "Firebase login", cwd=frontend_dir):
            print("❌ Firebase login failed")
            return False
    
    # Step 7: Initialize Firebase (if needed)
    if not (frontend_dir / ".firebaserc").exists():
        print("\n🔧 Initializing Firebase project...")
        print("📝 Please follow the prompts to select/create your Firebase project")
        if not run_command("firebase init hosting", "Initialize Firebase hosting", cwd=frontend_dir):
            return False
    
    # Step 8: Deploy to Firebase
    print("\n🚀 Deploying to Firebase Hosting...")
    if not run_command("firebase deploy", "Deploying to Firebase", cwd=frontend_dir):
        return False
    
    print("\n🎉 DEPLOYMENT SUCCESSFUL!")
    print("✅ Your AI Cancer Prediction System is now live on Firebase!")
    
    # Step 9: Get hosting URL
    result = subprocess.run("firebase hosting:sites:list", shell=True, capture_output=True, text=True, cwd=frontend_dir)
    if result.returncode == 0:
        print(f"🌐 Check your Firebase console for the live URL")
    
    return True

def create_deployment_guide():
    """Create deployment guide"""
    
    guide_content = """# Firebase Deployment Guide

## Prerequisites
1. Node.js installed
2. Firebase CLI installed (`npm install -g firebase-tools`)
3. Firebase account

## Deployment Steps

### 1. Install Firebase CLI
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase
```bash
firebase login
```

### 3. Navigate to frontend directory
```bash
cd cancer-aid-navigator-ai-main
```

### 4. Install dependencies
```bash
npm install
```

### 5. Build the application
```bash
npm run build
```

### 6. Initialize Firebase (first time only)
```bash
firebase init hosting
```
- Select existing project or create new one
- Set public directory to `dist`
- Configure as single-page app: Yes
- Set up automatic builds: No

### 7. Deploy to Firebase
```bash
firebase deploy
```

## Manual Deployment Commands
```bash
# Quick deployment
cd cancer-aid-navigator-ai-main
npm run build
firebase deploy

# Deploy with custom message
firebase deploy -m "Updated AI Cancer Prediction System"
```

## Firebase Configuration
The `firebase.json` file should contain:
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

## Troubleshooting
- Ensure you're in the correct directory (`cancer-aid-navigator-ai-main`)
- Check that `dist` folder exists after build
- Verify Firebase project is selected: `firebase use --add`
- Check Firebase console for deployment status
"""
    
    with open("FIREBASE_DEPLOYMENT_GUIDE.md", 'w') as f:
        f.write(guide_content)
    print("✅ Created FIREBASE_DEPLOYMENT_GUIDE.md")

if __name__ == "__main__":
    create_deployment_guide()
    
    print("🔥 Firebase Deployment Options:")
    print("1. Run automated deployment: python deploy_to_firebase.py")
    print("2. Follow manual steps in FIREBASE_DEPLOYMENT_GUIDE.md")
    print("3. Quick deploy: cd cancer-aid-navigator-ai-main && npm run build && firebase deploy")
    
    choice = input("\nRun automated deployment now? (y/n): ").lower()
    if choice == 'y':
        if deploy_to_firebase():
            print("\n🎊 Your AI Cancer Prediction System is live on Firebase!")
        else:
            print("\n❌ Deployment failed. Check the errors above.")
    else:
        print("\n📚 Follow the manual steps in FIREBASE_DEPLOYMENT_GUIDE.md")