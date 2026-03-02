#!/usr/bin/env python3
"""
Fresh GitHub Repository Push Script
Clears the existing repo and pushes all files freshly
"""

import os
import subprocess
import shutil
from pathlib import Path

def run_command(command, cwd=None):
    """Run a command and return the result"""
    try:
        result = subprocess.run(command, shell=True, cwd=cwd, capture_output=True, text=True)
        if result.returncode != 0:
            print(f"Error running command: {command}")
            print(f"Error: {result.stderr}")
            return False
        print(f"✅ {command}")
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    print("🚀 FRESH GITHUB REPOSITORY PUSH")
    print("=" * 50)
    
    # Current directory
    current_dir = Path(__file__).parent
    repo_url = "https://github.com/CHAKRADHAR-2/AI-Cancer-Prediction-System.git"
    
    print(f"📁 Working directory: {current_dir}")
    print(f"🔗 Repository URL: {repo_url}")
    
    # Step 1: Initialize fresh git repository
    print("\n📋 Step 1: Initializing fresh Git repository...")
    
    # Remove existing .git if present
    git_dir = current_dir / ".git"
    if git_dir.exists():
        print("🗑️ Removing existing .git directory...")
        shutil.rmtree(git_dir)
    
    # Initialize new git repo
    if not run_command("git init", cwd=current_dir):
        return False
    
    # Step 2: Add remote origin
    print("\n📋 Step 2: Adding remote origin...")
    if not run_command(f"git remote add origin {repo_url}", cwd=current_dir):
        return False
    
    # Step 3: Create .gitignore
    print("\n📋 Step 3: Creating .gitignore...")
    gitignore_content = """# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# Virtual Environment
venv/
env/
ENV/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
logs/

# Model files
*.pkl
*.joblib
*.h5
*.model

# Node modules
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs
dist/
build/
.next/
out/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Firebase
.firebase/
firebase-debug.log
.firebaserc

# Temporary files
*.tmp
*.temp
temp/
tmp/

# Cache
.cache/
.parcel-cache/

# Coverage
coverage/
*.lcov

# Dependencies
package-lock.json
yarn.lock
"""
    
    with open(current_dir / ".gitignore", "w") as f:
        f.write(gitignore_content)
    
    print("✅ .gitignore created")
    
    # Step 4: Add all files
    print("\n📋 Step 4: Adding all files...")
    if not run_command("git add .", cwd=current_dir):
        return False
    
    # Step 5: Create initial commit
    print("\n📋 Step 5: Creating initial commit...")
    commit_message = "🚀 Fresh deployment: Complete AI Cancer Prediction System with 90 algorithms"
    if not run_command(f'git commit -m "{commit_message}"', cwd=current_dir):
        return False
    
    # Step 6: Set main branch
    print("\n📋 Step 6: Setting main branch...")
    if not run_command("git branch -M main", cwd=current_dir):
        return False
    
    # Step 7: Force push to clear remote repository
    print("\n📋 Step 7: Force pushing to GitHub (this will clear the remote repo)...")
    print("⚠️  WARNING: This will completely replace the remote repository content!")
    
    confirm = input("Do you want to continue? (yes/no): ").lower().strip()
    if confirm != 'yes':
        print("❌ Operation cancelled by user")
        return False
    
    if not run_command("git push -f origin main", cwd=current_dir):
        print("❌ Push failed. You may need to authenticate with GitHub.")
        print("💡 Try running: git config --global credential.helper store")
        return False
    
    print("\n🎉 SUCCESS! Repository has been cleared and all files pushed freshly!")
    print(f"🔗 Check your repository: {repo_url}")
    
    # Step 8: Verify the push
    print("\n📋 Step 8: Verifying repository status...")
    run_command("git status", cwd=current_dir)
    run_command("git log --oneline -5", cwd=current_dir)
    
    print("\n✅ FRESH GITHUB PUSH COMPLETED SUCCESSFULLY!")
    print("📊 Your repository now contains:")
    print("   • Complete AI Cancer Prediction System")
    print("   • 90 Advanced Algorithms")
    print("   • React Frontend + Python Backend")
    print("   • Real Cancer Datasets")
    print("   • Hospital Finder System")
    print("   • Firebase Deployment Ready")
    
    return True

if __name__ == "__main__":
    main()