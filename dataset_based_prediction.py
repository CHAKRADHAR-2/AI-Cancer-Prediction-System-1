#!/usr/bin/env python3
"""
Dataset-Based Cancer Prediction System
Uses actual CSV datasets for training and prediction
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os
from pathlib import Path

class DatasetBasedPredictor:
    def __init__(self):
        self.models = {}
        self.scalers = {}
        self.encoders = {}
        self.dataset_path = Path("cancer-aid-navigator-ai-main/public/datasets")
        
    def load_datasets(self):
        """Load all available cancer datasets"""
        datasets = {}
        
        # Load each dataset
        dataset_files = {
            'breast_cancer': 'breast_cancer_wisconsin.csv',
            'cervical_cancer': 'cervical_cancer_risk.csv', 
            'colon_cancer': 'colon_cancer_dataset.csv',
            'liver_cancer': 'liver_cancer_dataset.csv',
            'lung_cancer': 'lung_cancer_survey.csv',
            'ovarian_cancer': 'ovarian_cancer_dataset.csv',
            'pancreatic_cancer': 'pancreatic_cancer_dataset.csv',
            'prostate_cancer': 'prostate_cancer_dataset.csv',
            'skin_cancer': 'skin_cancer_mnist.csv',
            'comprehensive': 'comprehensive_multi_cancer_dataset.csv'
        }
        
        for cancer_type, filename in dataset_files.items():
            file_path = self.dataset_path / filename
            if file_path.exists():
                try:
                    df = pd.read_csv(file_path)
                    datasets[cancer_type] = df
                    print(f"✅ Loaded {cancer_type}: {len(df)} samples")
                except Exception as e:
                    print(f"❌ Error loading {cancer_type}: {e}")
        
        return datasets
    
    def preprocess_datasets(self, datasets):
        """Preprocess and combine datasets for training"""
        combined_data = []
        
        for cancer_type, df in datasets.items():
            # Add cancer type label
            df_copy = df.copy()
            df_copy['cancer_type'] = cancer_type
            
            # Standardize column names
            df_copy.columns = df_copy.columns.str.lower().str.replace(' ', '_')
            
            # Select common features across datasets
            common_features = self.extract_common_features(df_copy)
            combined_data.append(common_features)
        
        # Combine all datasets
        final_dataset = pd.concat(combined_data, ignore_index=True)
        return final_dataset
    
    def extract_common_features(self, df):
        """Extract common features from dataset"""
        feature_mapping = {
            'age': ['age', 'Age', 'patient_age', 'years'],
            'gender': ['gender', 'Gender', 'sex', 'Sex'],
            'smoking': ['smoking', 'Smoking', 'smoke', 'tobacco'],
            'family_history': ['family_history', 'family', 'hereditary'],
            'bmi': ['bmi', 'BMI', 'body_mass_index', 'weight_index'],
            'symptoms': ['symptoms', 'symptom', 'pain', 'bleeding', 'fatigue']
        }
        
        extracted_features = {}
        
        # Extract available features
        for feature, possible_cols in feature_mapping.items():
            for col in df.columns:
                if any(pc.lower() in col.lower() for pc in possible_cols):
                    extracted_features[feature] = df[col]
                    break
        
        # Add cancer type
        if 'cancer_type' in df.columns:
            extracted_features['cancer_type'] = df['cancer_type']
        
        return pd.DataFrame(extracted_features)
    
    def train_models(self):
        """Train ML models using actual datasets"""
        print("🚀 TRAINING DATASET-BASED CANCER PREDICTION MODELS")
        print("=" * 60)
        
        # Load datasets
        print("📊 Loading cancer datasets...")
        datasets = self.load_datasets()
        
        if not datasets:
            print("❌ No datasets found! Please ensure datasets are in the correct path.")
            return False
        
        # Preprocess datasets
        print("\n🔄 Preprocessing datasets...")
        combined_df = self.preprocess_datasets(datasets)
        print(f"✅ Combined dataset: {len(combined_df)} samples")
        
        # Prepare features and target
        feature_cols = [col for col in combined_df.columns if col != 'cancer_type']
        X = combined_df[feature_cols]
        y = combined_df['cancer_type']
        
        # Handle missing values
        X = X.fillna(X.median())
        
        # Encode categorical variables
        le = LabelEncoder()
        y_encoded = le.fit_transform(y)
        self.encoders['cancer_type'] = le
        
        # Encode categorical features in X
        for col in X.columns:
            if X[col].dtype == 'object':
                le_feature = LabelEncoder()
                X[col] = le_feature.fit_transform(X[col].astype(str))
                self.encoders[col] = le_feature
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
        )
        
        # Scale features
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)
        self.scalers['main'] = scaler
        
        # Train Random Forest
        print("\n🌳 Training Random Forest model...")
        rf_model = RandomForestClassifier(
            n_estimators=200,
            max_depth=15,
            random_state=42,
            class_weight='balanced'
        )
        rf_model.fit(X_train_scaled, y_train)
        self.models['random_forest'] = rf_model
        
        # Train Gradient Boosting
        print("🚀 Training Gradient Boosting model...")
        gb_model = GradientBoostingClassifier(
            n_estimators=150,
            max_depth=8,
            learning_rate=0.1,
            random_state=42
        )
        gb_model.fit(X_train_scaled, y_train)
        self.models['gradient_boosting'] = gb_model
        
        # Evaluate models
        print("\n📊 EVALUATING MODELS:")
        print("-" * 40)
        
        for name, model in self.models.items():
            y_pred = model.predict(X_test_scaled)
            accuracy = accuracy_score(y_test, y_pred)
            print(f"{name.upper()}: {accuracy:.3f} accuracy")
        
        # Save models
        self.save_models()
        
        print("\n🎉 DATASET-BASED TRAINING COMPLETED!")
        print("✅ Models trained on real cancer datasets")
        return True
    
    def predict(self, patient_data):
        """Make prediction using dataset-trained models"""
        if not self.models:
            self.load_models()
        
        # Extract features from patient data
        features = self.extract_patient_features(patient_data)
        
        # Scale features
        features_scaled = self.scalers['main'].transform([features])
        
        # Get predictions from both models
        rf_pred = self.models['random_forest'].predict_proba(features_scaled)[0]
        gb_pred = self.models['gradient_boosting'].predict_proba(features_scaled)[0]
        
        # Ensemble prediction
        ensemble_pred = (rf_pred + gb_pred) / 2
        
        # Get class labels
        classes = self.encoders['cancer_type'].classes_
        predictions = dict(zip(classes, ensemble_pred))
        
        # Get top prediction
        top_prediction = max(predictions, key=predictions.get)
        confidence = predictions[top_prediction] * 100
        
        return {
            'predicted_cancer': top_prediction,
            'confidence': confidence,
            'all_predictions': predictions,
            'model_type': 'dataset_trained',
            'data_source': 'real_cancer_datasets'
        }
    
    def extract_patient_features(self, patient_data):
        """Extract features from patient data for prediction"""
        # Map patient data to model features
        features = [
            patient_data.get('age', 50),
            1 if patient_data.get('gender') == 'female' else 0,
            {'never': 0, 'former': 1, 'current': 2}.get(patient_data.get('smokingHistory', 'never'), 0),
            1 if patient_data.get('familyHistory', False) else 0,
            patient_data.get('bmi', 25),
            1 if any([
                patient_data.get('unexplainedWeightLoss', False),
                patient_data.get('persistentFatigue', False),
                patient_data.get('persistentCough', False),
                patient_data.get('skinChanges', False)
            ]) else 0
        ]
        
        return features
    
    def save_models(self):
        """Save trained models"""
        joblib.dump(self.models, 'dataset_trained_models.pkl')
        joblib.dump(self.scalers, 'dataset_scalers.pkl')
        joblib.dump(self.encoders, 'dataset_encoders.pkl')
        print("💾 Dataset-trained models saved!")
    
    def load_models(self):
        """Load saved models"""
        try:
            self.models = joblib.load('dataset_trained_models.pkl')
            self.scalers = joblib.load('dataset_scalers.pkl')
            self.encoders = joblib.load('dataset_encoders.pkl')
            print("✅ Dataset-trained models loaded!")
        except FileNotFoundError:
            print("❌ No saved models found. Training new models...")
            self.train_models()

if __name__ == "__main__":
    # Initialize and train dataset-based predictor
    predictor = DatasetBasedPredictor()
    predictor.train_models()
    
    # Test prediction
    sample_patient = {
        'age': 65,
        'gender': 'male',
        'smokingHistory': 'current',
        'familyHistory': True,
        'bmi': 28.5,
        'unexplainedWeightLoss': True,
        'persistentFatigue': True,
        'persistentCough': True
    }
    
    print("\n🧪 TESTING DATASET-BASED PREDICTION:")
    result = predictor.predict(sample_patient)
    print(f"Predicted Cancer: {result['predicted_cancer']}")
    print(f"Confidence: {result['confidence']:.2f}%")
    print(f"Data Source: {result['data_source']}")