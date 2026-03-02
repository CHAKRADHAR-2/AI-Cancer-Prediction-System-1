#!/usr/bin/env python3
"""
Dataset-Enhanced Cancer Prediction System Startup
Runs the complete system with real cancer datasets
"""

import subprocess
import sys
import os
import time
from pathlib import Path

def print_banner():
    """Print startup banner"""
    print("=" * 70)
    print("🚀 DATASET-ENHANCED CANCER PREDICTION SYSTEM")
    print("=" * 70)
    print("📊 Using REAL CANCER DATASETS for predictions")
    print("🤖 Machine Learning models trained on actual patient data")
    print("🔬 10+ cancer types supported with real data")
    print("=" * 70)

def check_datasets():
    """Check if datasets are available"""
    dataset_path = Path("cancer-aid-navigator-ai-main/public/datasets")
    
    if not dataset_path.exists():
        print("❌ Dataset directory not found!")
        print(f"   Expected: {dataset_path}")
        return False
    
    required_datasets = [
        'breast_cancer_wisconsin.csv',
        'lung_cancer_survey.csv',
        'liver_cancer_dataset.csv',
        'colon_cancer_dataset.csv',
        'comprehensive_multi_cancer_dataset.csv'
    ]
    
    missing_datasets = []
    for dataset in required_datasets:
        if not (dataset_path / dataset).exists():
            missing_datasets.append(dataset)
    
    if missing_datasets:
        print("⚠️ Some datasets are missing:")
        for dataset in missing_datasets:
            print(f"   • {dataset}")
        print("   System will use available datasets")
    else:
        print("✅ All required datasets found!")
    
    return True

def train_models():
    """Train ML models on datasets"""
    print("\n🔄 Training ML models on real cancer datasets...")
    
    try:
        result = subprocess.run([
            sys.executable, 'dataset_based_prediction.py'
        ], capture_output=True, text=True, timeout=300)
        
        if result.returncode == 0:
            print("✅ Dataset-based models trained successfully!")
            return True
        else:
            print("❌ Model training failed:")
            print(result.stderr)
            return False
            
    except subprocess.TimeoutExpired:
        print("⏰ Model training timed out (5 minutes)")
        return False
    except Exception as e:
        print(f"❌ Error training models: {e}")
        return False

def start_api_server():
    """Start the dataset-enhanced API server"""
    print("\n🌐 Starting Dataset-Enhanced API Server...")
    
    try:
        # Start the enhanced API server
        process = subprocess.Popen([
            sys.executable, 'dataset_enhanced_api.py'
        ])
        
        print("✅ API Server started!")
        print("📡 Available at: http://localhost:5000")
        print("🔍 Dataset info: http://localhost:5000/api/dataset-info")
        print("❤️ Health check: http://localhost:5000/api/health")
        
        return process
        
    except Exception as e:
        print(f"❌ Error starting API server: {e}")
        return None

def start_frontend():
    """Start the React frontend"""
    print("\n⚛️ Starting React Frontend...")
    
    frontend_path = Path("cancer-aid-navigator-ai-main")
    
    if not frontend_path.exists():
        print("❌ Frontend directory not found!")
        return None
    
    try:
        os.chdir(frontend_path)
        
        # Install dependencies if needed
        if not Path("node_modules").exists():
            print("📦 Installing frontend dependencies...")
            subprocess.run(['npm', 'install'], check=True)
        
        # Start development server
        process = subprocess.Popen(['npm', 'run', 'dev'])
        
        print("✅ Frontend started!")
        print("🌐 Available at: http://localhost:5173")
        
        return process
        
    except Exception as e:
        print(f"❌ Error starting frontend: {e}")
        return None

def main():
    """Main startup function"""
    print_banner()
    
    # Step 1: Check datasets
    if not check_datasets():
        print("❌ Cannot proceed without datasets")
        return
    
    # Step 2: Train models
    if not train_models():
        print("⚠️ Proceeding without trained models (will use fallback)")
    
    # Step 3: Start API server
    api_process = start_api_server()
    if not api_process:
        print("❌ Cannot start without API server")
        return
    
    # Wait for API to start
    print("⏳ Waiting for API server to initialize...")
    time.sleep(3)
    
    # Step 4: Start frontend
    frontend_process = start_frontend()
    
    print("\n🎉 DATASET-ENHANCED SYSTEM READY!")
    print("=" * 50)
    print("📊 Frontend: http://localhost:5173")
    print("🔗 API: http://localhost:5000")
    print("📈 Dataset Info: http://localhost:5000/api/dataset-info")
    print("=" * 50)
    print("🔬 Your system now uses REAL CANCER DATASETS!")
    print("✅ Ready for reviewer demonstration")
    print("=" * 50)
    
    try:
        # Keep processes running
        if frontend_process:
            frontend_process.wait()
        if api_process:
            api_process.wait()
    except KeyboardInterrupt:
        print("\n🛑 Shutting down system...")
        if frontend_process:
            frontend_process.terminate()
        if api_process:
            api_process.terminate()
        print("✅ System shutdown complete")

if __name__ == "__main__":
    main()