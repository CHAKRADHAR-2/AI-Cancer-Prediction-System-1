#!/usr/bin/env python3
"""
Comprehensive Cancer Dataset Generator
Generates realistic synthetic cancer datasets for multiple cancer types
"""

import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta
import os
import json

class ComprehensiveCancerDatasetGenerator:
    def __init__(self, output_dir="../public/datasets"):
        self.output_dir = output_dir
        self.ensure_output_dir()
        
        # Cancer type configurations
        self.cancer_configs = {
            'breast_cancer': {
                'base_rate': 0.12,
                'age_factor': lambda age: 1.0 if age < 40 else 1.5 if age < 60 else 2.0,
                'gender_factor': lambda gender: 8.0 if gender == 'female' else 0.01,
                'risk_factors': ['family_history', 'hormonal_factors', 'age', 'alcohol']
            },
            'lung_cancer': {
                'base_rate': 0.06,
                'age_factor': lambda age: 0.5 if age < 50 else 1.5 if age < 70 else 2.5,
                'smoking_factor': lambda smoking: 1.0 if smoking == 0 else 3.0 if smoking == 1 else 15.0,
                'risk_factors': ['smoking_history', 'age', 'occupational_exposure', 'family_history']
            },
            'colon_cancer': {
                'base_rate': 0.04,
                'age_factor': lambda age: 0.3 if age < 50 else 1.0 if age < 65 else 2.0,
                'diet_factor': lambda diet: 0.8 if diet > 2 else 1.5,
                'risk_factors': ['age', 'diet_quality', 'family_history', 'inflammatory_bowel']
            },
            'prostate_cancer': {
                'base_rate': 0.11,
                'age_factor': lambda age: 0.1 if age < 50 else 1.0 if age < 65 else 3.0,
                'gender_factor': lambda gender: 1.0 if gender == 'male' else 0.0,
                'risk_factors': ['age', 'family_history', 'race', 'diet']
            },
            'skin_cancer': {
                'base_rate': 0.02,
                'age_factor': lambda age: 0.5 if age < 30 else 1.0 if age < 60 else 1.8,
                'sun_factor': lambda exposure: 1.0 if exposure < 2 else 2.5,
                'risk_factors': ['sun_exposure', 'skin_type', 'family_history', 'moles']
            }
        }
    
    def ensure_output_dir(self):
        """Create output directory if it doesn't exist"""
        if not os.path.exists(self.output_dir):
            os.makedirs(self.output_dir)
    
    def generate_patient_demographics(self, n_samples):
        """Generate basic patient demographics"""
        np.random.seed(42)  # For reproducibility
        
        demographics = {
            'patient_id': range(1, n_samples + 1),
            'age': np.random.normal(55, 15, n_samples).clip(18, 90).astype(int),
            'gender': np.random.choice(['male', 'female'], n_samples),
            'bmi': np.random.normal(26, 4, n_samples).clip(16, 45),
            'race': np.random.choice(['white', 'black', 'hispanic', 'asian', 'other'], 
                                   n_samples, p=[0.6, 0.13, 0.18, 0.06, 0.03])
        }
        
        return pd.DataFrame(demographics)
    
    def generate_lifestyle_factors(self, demographics_df):
        """Generate lifestyle and risk factors"""
        n_samples = len(demographics_df)
        
        lifestyle = {
            'smoking_history': np.random.choice([0, 1, 2], n_samples, p=[0.6, 0.25, 0.15]),  # never, former, current
            'alcohol_consumption': np.random.choice([0, 1, 2, 3], n_samples, p=[0.3, 0.4, 0.25, 0.05]),  # never, occasional, moderate, heavy
            'physical_activity': np.random.choice([0, 1, 2, 3], n_samples, p=[0.2, 0.3, 0.35, 0.15]),  # none, light, moderate, heavy
            'diet_quality': np.random.choice([1, 2, 3], n_samples, p=[0.3, 0.5, 0.2]),  # poor, average, good
            'family_history_cancer': np.random.choice([0, 1], n_samples, p=[0.75, 0.25]),
            'occupational_exposure': np.random.choice([0, 1], n_samples, p=[0.85, 0.15]),
            'sun_exposure': np.random.choice([1, 2, 3], n_samples, p=[0.4, 0.4, 0.2])  # low, moderate, high
        }
        
        return pd.DataFrame(lifestyle)
    
    def generate_biomarkers(self, demographics_df, has_cancer):
        """Generate biomarker values based on cancer status"""
        n_samples = len(demographics_df)
        
        # Base biomarker values
        biomarkers = {
            'hemoglobin': np.random.normal(14, 2, n_samples).clip(8, 18),
            'white_blood_cells': np.random.normal(7000, 2000, n_samples).clip(3000, 15000),
            'platelets': np.random.normal(250000, 75000, n_samples).clip(100000, 500000),
            'psa_level': np.random.lognormal(1, 0.5, n_samples).clip(0.5, 50),
            'ca125_level': np.random.lognormal(2.5, 0.8, n_samples).clip(5, 500),
            'cea_level': np.random.lognormal(1.2, 0.6, n_samples).clip(1, 100),
            'afp_level': np.random.lognormal(1, 0.4, n_samples).clip(1, 50),
            'ldh_level': np.random.normal(200, 50, n_samples).clip(100, 800),
            'alkaline_phosphatase': np.random.normal(100, 30, n_samples).clip(40, 300)
        }
        
        # Adjust biomarkers for cancer patients
        cancer_indices = np.where(has_cancer)[0]
        
        for idx in cancer_indices:
            # Increase tumor markers for cancer patients
            biomarkers['psa_level'][idx] *= np.random.uniform(2, 8)
            biomarkers['ca125_level'][idx] *= np.random.uniform(3, 15)
            biomarkers['cea_level'][idx] *= np.random.uniform(2, 10)
            biomarkers['afp_level'][idx] *= np.random.uniform(1.5, 6)
            biomarkers['ldh_level'][idx] *= np.random.uniform(1.2, 3)
            biomarkers['alkaline_phosphatase'][idx] *= np.random.uniform(1.5, 4)
            
            # Decrease hemoglobin for some cancer patients (anemia)
            if np.random.random() < 0.4:
                biomarkers['hemoglobin'][idx] *= np.random.uniform(0.6, 0.9)
        
        return pd.DataFrame(biomarkers)
    
    def generate_symptoms(self, demographics_df, has_cancer, cancer_types):
        """Generate symptoms based on cancer status and type"""
        n_samples = len(demographics_df)
        
        # Base symptom probabilities (low for healthy individuals)
        base_prob = 0.05
        cancer_prob = 0.7
        
        symptoms = {
            'unexplained_weight_loss': np.random.choice([0, 1], n_samples, p=[1-base_prob, base_prob]),
            'persistent_fatigue': np.random.choice([0, 1], n_samples, p=[1-base_prob, base_prob]),
            'persistent_pain': np.random.choice([0, 1], n_samples, p=[1-base_prob, base_prob]),
            'persistent_cough': np.random.choice([0, 1], n_samples, p=[1-base_prob, base_prob]),
            'skin_changes': np.random.choice([0, 1], n_samples, p=[1-base_prob, base_prob]),
            'abdominal_pain': np.random.choice([0, 1], n_samples, p=[1-base_prob, base_prob]),
            'blood_in_stool': np.random.choice([0, 1], n_samples, p=[1-base_prob, base_prob]),
            'breast_lump': np.random.choice([0, 1], n_samples, p=[1-base_prob, base_prob]),
            'difficulty_swallowing': np.random.choice([0, 1], n_samples, p=[1-base_prob, base_prob]),
            'urinary_changes': np.random.choice([0, 1], n_samples, p=[1-base_prob, base_prob])
        }
        
        # Adjust symptoms for cancer patients
        cancer_indices = np.where(has_cancer)[0]
        
        for idx in cancer_indices:
            cancer_type = cancer_types[idx]
            
            # General cancer symptoms
            if np.random.random() < cancer_prob:
                symptoms['unexplained_weight_loss'][idx] = 1
            if np.random.random() < cancer_prob:
                symptoms['persistent_fatigue'][idx] = 1
            if np.random.random() < cancer_prob:
                symptoms['persistent_pain'][idx] = 1
            
            # Cancer-specific symptoms
            if cancer_type == 'lung_cancer':
                if np.random.random() < 0.8:
                    symptoms['persistent_cough'][idx] = 1
            elif cancer_type == 'breast_cancer':
                if np.random.random() < 0.7:
                    symptoms['breast_lump'][idx] = 1
            elif cancer_type == 'colon_cancer':
                if np.random.random() < 0.8:
                    symptoms['abdominal_pain'][idx] = 1
                if np.random.random() < 0.6:
                    symptoms['blood_in_stool'][idx] = 1
            elif cancer_type == 'prostate_cancer':
                if np.random.random() < 0.7:
                    symptoms['urinary_changes'][idx] = 1
            elif cancer_type == 'skin_cancer':
                if np.random.random() < 0.9:
                    symptoms['skin_changes'][idx] = 1
        
        return pd.DataFrame(symptoms)
    
    def generate_tumor_characteristics(self, demographics_df, has_cancer):
        """Generate tumor characteristics for cancer patients"""
        n_samples = len(demographics_df)
        
        tumor_chars = {
            'tumor_size': np.zeros(n_samples),
            'lymph_nodes': np.zeros(n_samples, dtype=int),
            'metastasis': np.zeros(n_samples, dtype=int),
            'cancer_stage': ['0'] * n_samples
        }
        
        cancer_indices = np.where(has_cancer)[0]
        
        for idx in cancer_indices:
            # Tumor size (cm)
            tumor_chars['tumor_size'][idx] = np.clip(np.random.lognormal(0.5, 0.8), 0.5, 15)
            
            # Lymph nodes affected
            tumor_chars['lymph_nodes'][idx] = np.clip(np.random.poisson(1.5), 0, 20)
            
            # Metastasis (20% chance for cancer patients)
            tumor_chars['metastasis'][idx] = np.random.choice([0, 1], p=[0.8, 0.2])
            
            # Cancer staging
            if tumor_chars['metastasis'][idx]:
                tumor_chars['cancer_stage'][idx] = '4'
            elif tumor_chars['lymph_nodes'][idx] > 4 or tumor_chars['tumor_size'][idx] > 5:
                tumor_chars['cancer_stage'][idx] = '3'
            elif tumor_chars['lymph_nodes'][idx] > 0 or tumor_chars['tumor_size'][idx] > 2:
                tumor_chars['cancer_stage'][idx] = '2'
            else:
                tumor_chars['cancer_stage'][idx] = '1'
        
        return pd.DataFrame(tumor_chars)
    
    def calculate_cancer_probability(self, demographics_df, lifestyle_df, cancer_type):
        """Calculate cancer probability based on risk factors"""
        n_samples = len(demographics_df)
        probabilities = np.full(n_samples, self.cancer_configs[cancer_type]['base_rate'])
        
        config = self.cancer_configs[cancer_type]
        
        # Age factor
        age_factors = np.array([config['age_factor'](age) for age in demographics_df['age']])
        probabilities *= age_factors
        
        # Gender factor (for gender-specific cancers)
        if 'gender_factor' in config:
            gender_factors = np.array([config['gender_factor'](gender) for gender in demographics_df['gender']])
            probabilities *= gender_factors
        
        # Smoking factor (for lung cancer)
        if cancer_type == 'lung_cancer':
            smoking_factors = np.array([config['smoking_factor'](smoking) for smoking in lifestyle_df['smoking_history']])
            probabilities *= smoking_factors
        
        # Family history factor
        family_history_factor = np.where(lifestyle_df['family_history_cancer'], 2.5, 1.0)
        probabilities *= family_history_factor
        
        # Other risk factors
        if cancer_type == 'colon_cancer':
            diet_factors = np.array([config['diet_factor'](diet) for diet in lifestyle_df['diet_quality']])
            probabilities *= diet_factors
        
        if cancer_type == 'skin_cancer':
            sun_factors = np.array([config['sun_factor'](exposure) for exposure in lifestyle_df['sun_exposure']])
            probabilities *= sun_factors
        
        return probabilities.clip(0, 0.95)  # Cap at 95%
    
    def generate_comprehensive_dataset(self, n_samples=5000):
        """Generate comprehensive multi-cancer dataset"""
        print(f"Generating comprehensive dataset with {n_samples} samples...")
        
        # Generate base demographics
        demographics_df = self.generate_patient_demographics(n_samples)
        lifestyle_df = self.generate_lifestyle_factors(demographics_df)
        
        # Calculate cancer probabilities for each type
        cancer_probs = {}
        for cancer_type in self.cancer_configs.keys():
            cancer_probs[cancer_type] = self.calculate_cancer_probability(
                demographics_df, lifestyle_df, cancer_type
            )
        
        # Determine who has cancer and what type
        has_cancer = np.zeros(n_samples, dtype=bool)
        cancer_types = ['no_cancer'] * n_samples
        
        for i in range(n_samples):
            # Check each cancer type
            for cancer_type, probs in cancer_probs.items():
                if np.random.random() < probs[i]:
                    has_cancer[i] = True
                    cancer_types[i] = cancer_type
                    break  # Only one cancer type per patient
        
        # Generate dependent features
        biomarkers_df = self.generate_biomarkers(demographics_df, has_cancer)
        symptoms_df = self.generate_symptoms(demographics_df, has_cancer, cancer_types)
        tumor_df = self.generate_tumor_characteristics(demographics_df, has_cancer)
        
        # Combine all features
        comprehensive_df = pd.concat([
            demographics_df,
            lifestyle_df,
            biomarkers_df,
            symptoms_df,
            tumor_df
        ], axis=1)
        
        # Add target variables
        comprehensive_df['has_cancer'] = has_cancer.astype(int)
        comprehensive_df['cancer_type'] = cancer_types
        
        # Map cancer types to readable names
        cancer_type_mapping = {
            'breast_cancer': 'Breast Cancer',
            'lung_cancer': 'Lung Cancer',
            'colon_cancer': 'Colon Cancer',
            'prostate_cancer': 'Prostate Cancer',
            'skin_cancer': 'Skin Cancer (Melanoma)',
            'no_cancer': 'No Cancer'
        }
        
        comprehensive_df['cancer_type'] = comprehensive_df['cancer_type'].map(cancer_type_mapping)
        
        return comprehensive_df
    
    def generate_all_datasets(self):
        """Generate all cancer datasets"""
        print("Starting comprehensive cancer dataset generation...")
        
        # Generate main comprehensive dataset
        comprehensive_df = self.generate_comprehensive_dataset(5000)
        comprehensive_path = os.path.join(self.output_dir, "comprehensive_multi_cancer_dataset.csv")
        comprehensive_df.to_csv(comprehensive_path, index=False)
        print(f"Generated comprehensive dataset: {comprehensive_path}")
        
        # Generate cancer-specific datasets
        cancer_datasets = {}
        
        for cancer_type in ['Breast Cancer', 'Lung Cancer', 'Colon Cancer', 'Prostate Cancer', 'Skin Cancer (Melanoma)']:
            # Filter comprehensive dataset for specific cancer type
            cancer_specific = comprehensive_df[
                (comprehensive_df['cancer_type'] == cancer_type) | 
                (comprehensive_df['cancer_type'] == 'No Cancer')
            ].copy()
            
            # Balance the dataset (50% cancer, 50% no cancer)
            cancer_cases = cancer_specific[cancer_specific['cancer_type'] == cancer_type]
            no_cancer_cases = cancer_specific[cancer_specific['cancer_type'] == 'No Cancer'].sample(
                n=min(len(cancer_cases), 1000), random_state=42
            )
            
            balanced_df = pd.concat([cancer_cases, no_cancer_cases]).sample(frac=1, random_state=42)
            
            # Save cancer-specific dataset
            filename = cancer_type.lower().replace(' ', '_').replace('(', '').replace(')', '') + '_dataset.csv'
            filepath = os.path.join(self.output_dir, filename)
            balanced_df.to_csv(filepath, index=False)
            
            cancer_datasets[cancer_type] = {
                'filename': filename,
                'samples': len(balanced_df),
                'cancer_cases': len(cancer_cases),
                'features': len(balanced_df.columns)
            }
            
            print(f"Generated {cancer_type} dataset: {filepath}")
        
        # Generate dataset summary
        summary = {
            'generation_date': datetime.now().isoformat(),
            'total_datasets': len(cancer_datasets) + 1,
            'comprehensive_dataset': {
                'filename': 'comprehensive_multi_cancer_dataset.csv',
                'samples': len(comprehensive_df),
                'features': len(comprehensive_df.columns),
                'cancer_distribution': comprehensive_df['cancer_type'].value_counts().to_dict()
            },
            'cancer_specific_datasets': cancer_datasets
        }
        
        summary_path = os.path.join(self.output_dir, "dataset_summary.json")
        with open(summary_path, 'w') as f:
            json.dump(summary, f, indent=2)
        
        print(f"Generated dataset summary: {summary_path}")
        print(f"\nSuccessfully generated {len(cancer_datasets) + 1} cancer datasets!")
        
        return summary

if __name__ == "__main__":
    generator = ComprehensiveCancerDatasetGenerator()
    summary = generator.generate_all_datasets()
    
    print("\n" + "="*50)
    print("DATASET GENERATION SUMMARY")
    print("="*50)
    print(f"Total datasets: {summary['total_datasets']}")
    print(f"Comprehensive dataset: {summary['comprehensive_dataset']['samples']} samples")
    print("\nCancer-specific datasets:")
    for cancer_type, info in summary['cancer_specific_datasets'].items():
        print(f"  {cancer_type}: {info['samples']} samples ({info['cancer_cases']} cancer cases)")
    print("="*50)