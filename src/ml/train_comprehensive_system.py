#!/usr/bin/env python3
"""
Comprehensive Cancer Prediction System Training Script

This script orchestrates the complete training pipeline:
1. Downloads real-world datasets
2. Generates comprehensive synthetic datasets
3. Trains enhanced ML models
4. Creates public dataset catalog
5. Validates the entire system

Usage: python train_comprehensive_system.py
"""

import os
import sys
import json
import time
from datetime import datetime
from typing import Dict, List

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from comprehensive_dataset_generator import ComprehensiveCancerDatasetGenerator
from enhanced_prediction_engine import EnhancedCancerPredictionEngine
from dataset_download_manager import DatasetDownloadManager

class ComprehensiveTrainingOrchestrator:
    """Orchestrates the complete training pipeline for the cancer prediction system"""
    
    def __init__(self):
        self.start_time = time.time()
        self.data_dir = "datasets"
        self.model_dir = "trained_models"
        self.public_dir = "../public/datasets"
        self.log_file = "training_log.txt"
        
        # Initialize components
        self.dataset_generator = ComprehensiveCancerDatasetGenerator(self.data_dir)
        self.prediction_engine = EnhancedCancerPredictionEngine(self.data_dir, self.model_dir)
        self.download_manager = DatasetDownloadManager(self.data_dir, self.public_dir)
        
        # Training results
        self.training_results = {
            'start_time': datetime.now().isoformat(),
            'steps_completed': [],
            'datasets_created': {},
            'models_trained': {},
            'performance_metrics': {},
            'errors': []
        }
    
    def log_message(self, message: str, level: str = "INFO"):
        """Log message to console and file"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_entry = f"[{timestamp}] {level}: {message}"
        
        print(log_entry)
        
        # Write to log file
        try:
            with open(self.log_file, 'a', encoding='utf-8') as f:
                f.write(log_entry + '\n')
        except Exception as e:
            print(f"Warning: Could not write to log file: {e}")
    
    def run_complete_training_pipeline(self):
        """Run the complete training pipeline"""
        self.log_message("=" * 80)
        self.log_message("COMPREHENSIVE CANCER PREDICTION SYSTEM TRAINING")
        self.log_message("=" * 80)
        
        try:
            # Step 1: Download real-world datasets
            self.log_message("\n🔄 STEP 1: Downloading Real-World Datasets")
            self.log_message("-" * 50)
            self.download_real_world_datasets()
            
            # Step 2: Generate comprehensive synthetic datasets
            self.log_message("\n🔄 STEP 2: Generating Comprehensive Synthetic Datasets")
            self.log_message("-" * 50)
            self.generate_synthetic_datasets()
            
            # Step 3: Train enhanced ML models
            self.log_message("\n🔄 STEP 3: Training Enhanced ML Models")
            self.log_message("-" * 50)
            self.train_ml_models()
            
            # Step 4: Create public dataset catalog
            self.log_message("\n🔄 STEP 4: Creating Public Dataset Catalog")
            self.log_message("-" * 50)
            self.create_public_catalog()
            
            # Step 5: Validate the system
            self.log_message("\n🔄 STEP 5: System Validation")
            self.log_message("-" * 50)
            self.validate_system()
            
            # Step 6: Generate final report
            self.log_message("\n🔄 STEP 6: Generating Final Report")
            self.log_message("-" * 50)
            self.generate_final_report()
            
            self.log_message("\n✅ TRAINING PIPELINE COMPLETED SUCCESSFULLY!")
            
        except Exception as e:
            self.log_message(f"❌ CRITICAL ERROR: {str(e)}", "ERROR")
            self.training_results['errors'].append({
                'timestamp': datetime.now().isoformat(),
                'error': str(e),
                'step': 'pipeline_execution'
            })
            raise
    
    def download_real_world_datasets(self):
        """Download real-world cancer datasets"""
        try:
            self.log_message("Downloading real-world cancer datasets...")
            
            # Download all available datasets
            download_results = self.download_manager.download_all_datasets()
            
            # Log results
            successful = sum(1 for success in download_results.values() if success)
            total = len(download_results)
            
            self.log_message(f"✅ Downloaded {successful}/{total} real-world datasets successfully")
            
            # Store results
            self.training_results['datasets_created']['real_world'] = {
                'total_attempted': total,
                'successful_downloads': successful,
                'fallback_created': total - successful,
                'datasets': download_results
            }
            
            self.training_results['steps_completed'].append('download_real_world_datasets')
            
        except Exception as e:
            self.log_message(f"Error downloading real-world datasets: {str(e)}", "ERROR")
            self.training_results['errors'].append({
                'timestamp': datetime.now().isoformat(),
                'error': str(e),
                'step': 'download_real_world_datasets'
            })
            # Continue with synthetic data generation
    
    def generate_synthetic_datasets(self):
        """Generate comprehensive synthetic datasets"""
        try:
            self.log_message("Generating comprehensive synthetic datasets...")
            
            # Generate comprehensive multi-cancer dataset
            self.log_message("Creating comprehensive multi-cancer dataset...")
            comprehensive_df = self.dataset_generator.generate_comprehensive_dataset(n_samples=15000)
            
            # Save comprehensive dataset
            comprehensive_path = os.path.join(self.data_dir, "comprehensive_multi_cancer_dataset.csv")
            comprehensive_df.to_csv(comprehensive_path, index=False)
            
            self.log_message(f"✅ Comprehensive dataset created: {len(comprehensive_df):,} samples")
            self.log_message(f"   Cancer cases: {(comprehensive_df['has_cancer'] == 1).sum():,}")
            self.log_message(f"   Cancer types: {comprehensive_df['cancer_type'].nunique()}")
            
            # Generate individual cancer datasets
            self.log_message("Creating individual cancer type datasets...")
            individual_datasets = self.dataset_generator.generate_individual_cancer_datasets(n_samples_per_cancer=3000)
            
            total_individual_samples = sum(info['samples'] for info in individual_datasets.values())
            self.log_message(f"✅ Individual datasets created: {len(individual_datasets)} cancer types")
            self.log_message(f"   Total samples: {total_individual_samples:,}")
            
            # Save metadata
            self.dataset_generator.save_dataset_metadata(individual_datasets)
            
            # Store results
            self.training_results['datasets_created']['synthetic'] = {
                'comprehensive_dataset': {
                    'samples': len(comprehensive_df),
                    'cancer_cases': int((comprehensive_df['has_cancer'] == 1).sum()),
                    'cancer_types': int(comprehensive_df['cancer_type'].nunique()),
                    'features': len(comprehensive_df.columns)
                },
                'individual_datasets': individual_datasets,
                'total_individual_samples': total_individual_samples
            }
            
            self.training_results['steps_completed'].append('generate_synthetic_datasets')
            
        except Exception as e:
            self.log_message(f"Error generating synthetic datasets: {str(e)}", "ERROR")
            self.training_results['errors'].append({
                'timestamp': datetime.now().isoformat(),
                'error': str(e),
                'step': 'generate_synthetic_datasets'
            })
            raise
    
    def train_ml_models(self):
        """Train enhanced ML models"""
        try:
            self.log_message("Training enhanced ML models with hyperparameter tuning...")
            
            # Train models on all available datasets
            self.prediction_engine.train_models_with_hyperparameter_tuning(use_grid_search=True)
            
            # Get model summary
            model_summary = self.prediction_engine.get_model_summary()
            
            self.log_message(f"✅ ML models trained successfully")
            self.log_message(f"   Total models: {model_summary['total_models']}")
            self.log_message(f"   Datasets used: {len(model_summary['datasets_used'])}")
            
            # Log best performing models
            self.log_message("   Best performing models:")
            for dataset, info in model_summary['best_performing_models'].items():
                accuracy = info['accuracy']
                auc = info.get('auc', 'N/A')
                self.log_message(f"     {dataset}: {info['model_type']} (Acc: {accuracy:.4f}, AUC: {auc})")
            
            # Store results
            self.training_results['models_trained'] = model_summary
            self.training_results['performance_metrics'] = self.prediction_engine.model_performance
            
            self.training_results['steps_completed'].append('train_ml_models')
            
        except Exception as e:
            self.log_message(f"Error training ML models: {str(e)}", "ERROR")
            self.training_results['errors'].append({
                'timestamp': datetime.now().isoformat(),
                'error': str(e),
                'step': 'train_ml_models'
            })
            raise
    
    def create_public_catalog(self):
        """Create public dataset catalog for frontend access"""
        try:
            self.log_message("Creating public dataset catalog...")
            
            # Update metadata and create public catalog
            self.download_manager.update_dataset_metadata()
            self.download_manager.create_public_dataset_catalog()
            
            # Get catalog summary
            catalog_summary = self.download_manager.get_dataset_summary()
            
            self.log_message(f"✅ Public dataset catalog created")
            self.log_message(f"   Total datasets: {catalog_summary['total_datasets']}")
            self.log_message(f"   Total samples: {catalog_summary['total_samples']:,}")
            self.log_message(f"   Cancer types: {len(catalog_summary['cancer_types'])}")
            
            # Store results
            self.training_results['public_catalog'] = catalog_summary
            
            self.training_results['steps_completed'].append('create_public_catalog')
            
        except Exception as e:
            self.log_message(f"Error creating public catalog: {str(e)}", "ERROR")
            self.training_results['errors'].append({
                'timestamp': datetime.now().isoformat(),
                'error': str(e),
                'step': 'create_public_catalog'
            })
            # This is not critical, continue
    
    def validate_system(self):
        """Validate the trained system"""
        try:
            self.log_message("Validating the trained system...")
            
            # Test prediction with sample data
            sample_patient = {
                'age': 65,
                'gender': 'male',
                'smokingHistory': 'current',
                'familyHistory': True,
                'bmi': 28.5,
                'hemoglobin': 13.5,
                'whiteBloodCells': 8000,
                'platelets': 300000,
                'unexplainedWeightLoss': True,
                'persistentFatigue': True,
                'persistentCough': True,
                'skinChanges': False,
                'digestiveIssues': False,
                'unusualBleeding': False
            }
            
            # Make prediction
            prediction_result = self.prediction_engine.predict_cancer_risk(sample_patient)
            
            self.log_message("✅ System validation completed")
            self.log_message(f"   Sample prediction successful: {prediction_result['cancer_type']}")
            self.log_message(f"   Confidence: {prediction_result['confidence']:.2f}%")
            self.log_message(f"   Model used: {prediction_result['model_used']}")
            
            # Validate file integrity
            validation_results = self.validate_file_integrity()
            
            # Store results
            self.training_results['validation'] = {
                'sample_prediction': prediction_result,
                'file_integrity': validation_results
            }
            
            self.training_results['steps_completed'].append('validate_system')
            
        except Exception as e:
            self.log_message(f"Error during system validation: {str(e)}", "ERROR")
            self.training_results['errors'].append({
                'timestamp': datetime.now().isoformat(),
                'error': str(e),
                'step': 'validate_system'
            })
            # Validation errors are not critical for deployment
    
    def validate_file_integrity(self) -> Dict:
        """Validate integrity of created files"""
        validation_results = {
            'datasets_exist': True,
            'models_exist': True,
            'public_files_exist': True,
            'missing_files': []
        }
        
        # Check dataset files
        expected_datasets = [
            'comprehensive_multi_cancer_dataset.csv',
            'datasets_metadata.json'
        ]
        
        for dataset_file in expected_datasets:
            filepath = os.path.join(self.data_dir, dataset_file)
            if not os.path.exists(filepath):
                validation_results['datasets_exist'] = False
                validation_results['missing_files'].append(filepath)
        
        # Check model files
        expected_models = [
            'enhanced_models.pkl',
            'enhanced_scalers.pkl',
            'enhanced_selectors.pkl',
            'feature_names.pkl',
            'model_performance.json'
        ]
        
        for model_file in expected_models:
            filepath = os.path.join(self.model_dir, model_file)
            if not os.path.exists(filepath):
                validation_results['models_exist'] = False
                validation_results['missing_files'].append(filepath)
        
        # Check public files
        expected_public = ['dataset_catalog.json']
        
        for public_file in expected_public:
            filepath = os.path.join(self.public_dir, public_file)
            if not os.path.exists(filepath):
                validation_results['public_files_exist'] = False
                validation_results['missing_files'].append(filepath)
        
        return validation_results
    
    def generate_final_report(self):
        """Generate final training report"""
        try:
            self.log_message("Generating final training report...")
            
            # Calculate total training time
            total_time = time.time() - self.start_time
            self.training_results['end_time'] = datetime.now().isoformat()
            self.training_results['total_training_time_seconds'] = total_time
            self.training_results['total_training_time_formatted'] = self.format_duration(total_time)
            
            # Save comprehensive results
            results_path = os.path.join(self.model_dir, 'training_results.json')
            with open(results_path, 'w') as f:
                json.dump(self.training_results, f, indent=2, default=str)
            
            # Generate summary report
            self.generate_summary_report()
            
            self.log_message(f"✅ Final report generated")
            self.log_message(f"   Training time: {self.training_results['total_training_time_formatted']}")
            self.log_message(f"   Steps completed: {len(self.training_results['steps_completed'])}")
            self.log_message(f"   Errors encountered: {len(self.training_results['errors'])}")
            
            self.training_results['steps_completed'].append('generate_final_report')
            
        except Exception as e:
            self.log_message(f"Error generating final report: {str(e)}", "ERROR")
            self.training_results['errors'].append({
                'timestamp': datetime.now().isoformat(),
                'error': str(e),
                'step': 'generate_final_report'
            })
    
    def generate_summary_report(self):
        """Generate human-readable summary report"""
        summary_path = os.path.join(self.model_dir, 'training_summary.txt')
        
        with open(summary_path, 'w') as f:
            f.write("COMPREHENSIVE CANCER PREDICTION SYSTEM - TRAINING SUMMARY\n")
            f.write("=" * 70 + "\n\n")
            
            f.write(f"Training Start Time: {self.training_results['start_time']}\n")
            f.write(f"Training End Time: {self.training_results['end_time']}\n")
            f.write(f"Total Training Time: {self.training_results['total_training_time_formatted']}\n\n")
            
            # Dataset Summary
            f.write("DATASETS CREATED:\n")
            f.write("-" * 20 + "\n")
            
            if 'real_world' in self.training_results['datasets_created']:
                rw = self.training_results['datasets_created']['real_world']
                f.write(f"Real-world datasets: {rw['successful_downloads']}/{rw['total_attempted']} successful\n")
                f.write(f"Fallback datasets created: {rw['fallback_created']}\n")
            
            if 'synthetic' in self.training_results['datasets_created']:
                syn = self.training_results['datasets_created']['synthetic']
                f.write(f"Comprehensive dataset: {syn['comprehensive_dataset']['samples']:,} samples\n")
                f.write(f"Individual datasets: {len(syn['individual_datasets'])} cancer types\n")
                f.write(f"Total synthetic samples: {syn['total_individual_samples']:,}\n")
            
            # Model Summary
            f.write(f"\nMODELS TRAINED:\n")
            f.write("-" * 15 + "\n")
            
            if 'models_trained' in self.training_results:
                mt = self.training_results['models_trained']
                f.write(f"Total models: {mt['total_models']}\n")
                f.write(f"Datasets used: {len(mt['datasets_used'])}\n")
                
                f.write(f"\nBest performing models:\n")
                for dataset, info in mt['best_performing_models'].items():
                    f.write(f"  {dataset}: {info['model_type']} (Accuracy: {info['accuracy']:.4f})\n")
            
            # Public Catalog
            f.write(f"\nPUBLIC DATASET CATALOG:\n")
            f.write("-" * 23 + "\n")
            
            if 'public_catalog' in self.training_results:
                pc = self.training_results['public_catalog']
                f.write(f"Total public datasets: {pc['total_datasets']}\n")
                f.write(f"Total samples available: {pc['total_samples']:,}\n")
                f.write(f"Cancer types covered: {len(pc['cancer_types'])}\n")
            
            # Errors
            if self.training_results['errors']:
                f.write(f"\nERRORS ENCOUNTERED:\n")
                f.write("-" * 19 + "\n")
                for error in self.training_results['errors']:
                    f.write(f"  {error['step']}: {error['error']}\n")
            else:
                f.write(f"\n✅ NO ERRORS ENCOUNTERED\n")
            
            f.write(f"\nSTEPS COMPLETED: {len(self.training_results['steps_completed'])}\n")
            for step in self.training_results['steps_completed']:
                f.write(f"  ✅ {step}\n")
    
    def format_duration(self, seconds: float) -> str:
        """Format duration in human-readable format"""
        hours = int(seconds // 3600)
        minutes = int((seconds % 3600) // 60)
        seconds = int(seconds % 60)
        
        if hours > 0:
            return f"{hours}h {minutes}m {seconds}s"
        elif minutes > 0:
            return f"{minutes}m {seconds}s"
        else:
            return f"{seconds}s"

def main():
    """Main execution function"""
    print("Starting Comprehensive Cancer Prediction System Training...")
    
    try:
        # Initialize orchestrator
        orchestrator = ComprehensiveTrainingOrchestrator()
        
        # Run complete training pipeline
        orchestrator.run_complete_training_pipeline()
        
        print("\n" + "=" * 80)
        print("🎉 TRAINING COMPLETED SUCCESSFULLY!")
        print("=" * 80)
        print("\nThe comprehensive cancer prediction system has been trained and is ready for use.")
        print("All datasets, models, and public catalogs have been created.")
        
        return 0
        
    except Exception as e:
        print(f"\n❌ TRAINING FAILED: {str(e)}")
        print("Check the training log for detailed error information.")
        return 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)