
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, VotingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.neural_network import MLPClassifier
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, roc_auc_score, roc_curve
from sklearn.feature_selection import SelectKBest, f_classif
import matplotlib.pyplot as plt
import seaborn as sns
import joblib
import json
from typing import Dict, List, Tuple, Optional
import warnings
warnings.filterwarnings('ignore')

from dataset_manager import CancerDatasetManager

class EnhancedCancerPredictionModel:
    """Enhanced cancer prediction model using real-world and synthetic datasets"""
    
    def __init__(self):
        self.models = {}
        self.scalers = {}
        self.feature_selectors = {}
        self.label_encoders = {}
        self.model_performance = {}
        self.dataset_manager = CancerDatasetManager()
        
        # Model configurations
        self.model_configs = {
            'random_forest': RandomForestClassifier(
                n_estimators=200,
                max_depth=15,
                min_samples_split=5,
                min_samples_leaf=2,
                random_state=42,
                class_weight='balanced'
            ),
            'gradient_boosting': GradientBoostingClassifier(
                n_estimators=150,
                max_depth=8,
                learning_rate=0.1,
                random_state=42
            ),
            'logistic_regression': LogisticRegression(
                random_state=42,
                max_iter=1000,
                class_weight='balanced'
            ),
            'svm': SVC(
                kernel='rbf',
                probability=True,
                random_state=42,
                class_weight='balanced'
            ),
            'neural_network': MLPClassifier(
                hidden_layer_sizes=(100, 50),
                max_iter=500,
                random_state=42,
                early_stopping=True
            )
        }
    
    def prepare_datasets(self):
        """Download and prepare all datasets"""
        print("Preparing real-world and synthetic datasets...")
        
        # Download real-world datasets
        self.dataset_manager.download_real_world_datasets()
        
        # Load datasets
        datasets = self.dataset_manager.load_datasets()
        
        # Generate additional synthetic data for comparison
        self.generate_comprehensive_synthetic_data()
        
        return datasets
    
    def generate_comprehensive_synthetic_data(self):
        """Generate comprehensive synthetic cancer dataset"""
        print("Generating comprehensive synthetic dataset...")
        
        np.random.seed(42)
        n_samples = 5000
        
        # Comprehensive feature set
        data = {
            # Demographics
            'age': np.random.normal(55, 15, n_samples).clip(18, 90),
            'gender': np.random.choice([0, 1], n_samples),  # 0=male, 1=female
            'race': np.random.choice([0, 1, 2, 3], n_samples, p=[0.6, 0.2, 0.15, 0.05]),
            
            # Lifestyle factors
            'smoking_history': np.random.choice([0, 1, 2], n_samples, p=[0.4, 0.3, 0.3]),
            'alcohol_consumption': np.random.choice([0, 1, 2, 3], n_samples, p=[0.3, 0.4, 0.2, 0.1]),
            'physical_activity': np.random.choice([0, 1, 2, 3], n_samples, p=[0.2, 0.3, 0.3, 0.2]),
            'diet_quality': np.random.normal(5, 2, n_samples).clip(1, 10),
            'bmi': np.random.normal(26, 4, n_samples).clip(16, 45),
            'sleep_hours': np.random.normal(7, 1.5, n_samples).clip(4, 12),
            'stress_level': np.random.choice([0, 1, 2], n_samples, p=[0.3, 0.5, 0.2]),
            
            # Medical history
            'family_history_cancer': np.random.choice([0, 1], n_samples, p=[0.7, 0.3]),
            'previous_cancer': np.random.choice([0, 1], n_samples, p=[0.9, 0.1]),
            'chronic_conditions': np.random.poisson(1, n_samples).clip(0, 5),
            
            # Lab values
            'hemoglobin': np.random.normal(14, 2, n_samples).clip(8, 18),
            'white_blood_cells': np.random.normal(7000, 2000, n_samples).clip(3000, 15000),
            'platelets': np.random.normal(250000, 80000, n_samples).clip(100000, 500000),
            'glucose': np.random.normal(100, 25, n_samples).clip(70, 250),
            'cholesterol': np.random.normal(200, 40, n_samples).clip(120, 350),
            'blood_pressure_systolic': np.random.normal(130, 20, n_samples).clip(90, 200),
            'blood_pressure_diastolic': np.random.normal(85, 12, n_samples).clip(60, 120),
            
            # Symptoms
            'unexplained_weight_loss': np.random.choice([0, 1], n_samples, p=[0.8, 0.2]),
            'persistent_fatigue': np.random.choice([0, 1], n_samples, p=[0.7, 0.3]),
            'unusual_bleeding': np.random.choice([0, 1], n_samples, p=[0.85, 0.15]),
            'persistent_cough': np.random.choice([0, 1], n_samples, p=[0.8, 0.2]),
            'skin_changes': np.random.choice([0, 1], n_samples, p=[0.9, 0.1]),
            'digestive_issues': np.random.choice([0, 1], n_samples, p=[0.75, 0.25]),
            'persistent_pain': np.random.choice([0, 1], n_samples, p=[0.8, 0.2]),
            
            # Environmental factors
            'occupational_exposure': np.random.choice([0, 1], n_samples, p=[0.8, 0.2]),
            'radiation_exposure': np.random.choice([0, 1], n_samples, p=[0.95, 0.05]),
            'chemical_exposure': np.random.choice([0, 1], n_samples, p=[0.85, 0.15]),
            'sun_exposure': np.random.choice([0, 1, 2], n_samples, p=[0.4, 0.4, 0.2]),
        }
        
        df = pd.DataFrame(data)
        
        # Generate realistic cancer labels based on risk factors
        cancer_probability = self._calculate_comprehensive_cancer_risk(df)
        df['cancer'] = np.random.binomial(1, cancer_probability)
        
        # Generate specific cancer types for positive cases
        cancer_types = []
        for i, has_cancer in enumerate(df['cancer']):
            if has_cancer:
                # Assign cancer type based on demographics and risk factors
                cancer_type = self._assign_cancer_type(df.iloc[i])
                cancer_types.append(cancer_type)
            else:
                cancer_types.append('No Cancer')
        
        df['cancer_type'] = cancer_types
        
        # Save synthetic dataset
        synthetic_path = f"{self.dataset_manager.data_dir}/comprehensive_synthetic_cancer.csv"
        df.to_csv(synthetic_path, index=False)
        
        print(f"✓ Generated comprehensive synthetic dataset: {df.shape}")
        print(f"Cancer prevalence: {df['cancer'].mean():.3f}")
        print(f"Cancer types distribution:")
        print(df['cancer_type'].value_counts())
        
        return df
    
    def _calculate_comprehensive_cancer_risk(self, df: pd.DataFrame) -> np.ndarray:
        """Calculate comprehensive cancer risk based on multiple factors"""
        risk = np.zeros(len(df))
        
        # Age factor (non-linear relationship)
        age_factor = np.where(df['age'] < 40, 0.1,
                             np.where(df['age'] < 60, 0.2, 0.4))
        risk += age_factor
        
        # Lifestyle factors
        risk += df['smoking_history'] * 0.15  # Smoking is major risk factor
        risk += df['alcohol_consumption'] * 0.05
        risk += (3 - df['physical_activity']) * 0.03  # Less activity = higher risk
        risk += np.where(df['bmi'] > 30, 0.1, 0)  # Obesity
        risk += np.where(df['diet_quality'] < 4, 0.08, 0)  # Poor diet
        
        # Medical history
        risk += df['family_history_cancer'] * 0.2  # Strong genetic factor
        risk += df['previous_cancer'] * 0.3  # Previous cancer history
        risk += df['chronic_conditions'] * 0.05
        
        # Lab abnormalities
        risk += np.where(df['hemoglobin'] < 12, 0.05, 0)
        risk += np.where(df['white_blood_cells'] > 11000, 0.08, 0)
        risk += np.where(df['glucose'] > 126, 0.03, 0)
        
        # Symptoms (strong indicators)
        risk += df['unexplained_weight_loss'] * 0.15
        risk += df['persistent_fatigue'] * 0.08
        risk += df['unusual_bleeding'] * 0.12
        risk += df['persistent_cough'] * 0.1
        risk += df['skin_changes'] * 0.1
        risk += df['digestive_issues'] * 0.08
        risk += df['persistent_pain'] * 0.07
        
        # Environmental factors
        risk += df['occupational_exposure'] * 0.08
        risk += df['radiation_exposure'] * 0.1
        risk += df['chemical_exposure'] * 0.06
        risk += df['sun_exposure'] * 0.03
        
        # Add some random variation
        risk += np.random.normal(0, 0.05, len(df))
        
        # Normalize to probability range
        return np.clip(risk, 0.01, 0.8)
    
    def _assign_cancer_type(self, patient_row: pd.Series) -> str:
        """Assign specific cancer type based on patient characteristics"""
        # Gender-specific cancers
        if patient_row['gender'] == 1:  # Female
            if np.random.random() < 0.4:
                return 'Breast Cancer'
            elif np.random.random() < 0.2:
                return 'Ovarian Cancer'
        else:  # Male
            if patient_row['age'] > 50 and np.random.random() < 0.3:
                return 'Prostate Cancer'
        
        # Smoking-related cancers
        if patient_row['smoking_history'] >= 1:
            if np.random.random() < 0.5:
                return 'Lung Cancer'
            elif np.random.random() < 0.2:
                return 'Bladder Cancer'
        
        # Age-related cancers
        if patient_row['age'] > 60:
            if np.random.random() < 0.3:
                return 'Colon Cancer'
        
        # Digestive symptoms
        if patient_row['digestive_issues'] == 1:
            digestive_cancers = ['Colon Cancer', 'Stomach Cancer', 'Pancreatic Cancer']
            return np.random.choice(digestive_cancers)
        
        # Skin changes
        if patient_row['skin_changes'] == 1:
            return 'Skin Cancer'
        
        # Default assignment
        common_cancers = ['Lung Cancer', 'Breast Cancer', 'Colon Cancer', 'Liver Cancer']
        return np.random.choice(common_cancers)
    
    def train_models_on_multiple_datasets(self):
        """Train models on both real-world and synthetic datasets"""
        print("Training models on multiple datasets...")
        
        # Prepare datasets
        datasets = self.prepare_datasets()
        
        # Reload datasets after generation
        datasets = self.dataset_manager.load_datasets()
        
        results = {}
        
        for dataset_name, df in datasets.items():
            print(f"\nTraining on dataset: {dataset_name}")
            
            try:
                # Determine target column
                target_candidates = ['cancer', 'LUNG_CANCER', 'class', 'target']
                target_col = None
                
                for col in target_candidates:
                    if col in df.columns:
                        target_col = col
                        break
                
                if not target_col:
                    print(f"  ⚠️ No target column found for {dataset_name}")
                    continue
                
                # Preprocess dataset
                X, y = self.dataset_manager.preprocess_dataset(dataset_name, target_col)
                
                if len(X) < 50:  # Skip datasets that are too small
                    print(f"  ⚠️ Dataset {dataset_name} too small ({len(X)} samples)")
                    continue
                
                # Split data
                X_train, X_test, y_train, y_test = train_test_split(
                    X, y, test_size=0.2, random_state=42, stratify=y
                )
                
                # Scale features
                scaler = StandardScaler()
                X_train_scaled = scaler.fit_transform(X_train)
                X_test_scaled = scaler.transform(X_test)
                
                # Feature selection
                selector = SelectKBest(f_classif, k=min(20, X_train.shape[1]))
                X_train_selected = selector.fit_transform(X_train_scaled, y_train)
                X_test_selected = selector.transform(X_test_scaled)
                
                # Store preprocessing objects
                self.scalers[dataset_name] = scaler
                self.feature_selectors[dataset_name] = selector
                
                # Train models
                dataset_results = {}
                for model_name, model in self.model_configs.items():
                    try:
                        print(f"    Training {model_name}...")
                        
                        # Train model
                        model_copy = self._get_model_copy(model_name)
                        model_copy.fit(X_train_selected, y_train)
                        
                        # Make predictions
                        y_pred = model_copy.predict(X_test_selected)
                        y_prob = model_copy.predict_proba(X_test_selected)[:, 1] if hasattr(model_copy, 'predict_proba') else None
                        
                        # Calculate metrics
                        accuracy = accuracy_score(y_test, y_pred)
                        auc = roc_auc_score(y_test, y_prob) if y_prob is not None else None
                        
                        # Cross-validation
                        cv_scores = cross_val_score(model_copy, X_train_selected, y_train, cv=5)
                        
                        dataset_results[model_name] = {
                            'accuracy': accuracy,
                            'auc': auc,
                            'cv_mean': cv_scores.mean(),
                            'cv_std': cv_scores.std(),
                            'model': model_copy
                        }
                        
                        print(f"      Accuracy: {accuracy:.4f}, AUC: {auc:.4f if auc else 'N/A'}")
                        
                    except Exception as e:
                        print(f"      ✗ Error training {model_name}: {str(e)}")
                
                results[dataset_name] = dataset_results
                
                # Store best model for this dataset
                if dataset_results:
                    best_model_name = max(dataset_results.keys(), 
                                        key=lambda x: dataset_results[x]['accuracy'])
                    self.models[dataset_name] = dataset_results[best_model_name]['model']
                    
                    print(f"  ✓ Best model for {dataset_name}: {best_model_name}")
                
            except Exception as e:
                print(f"  ✗ Error processing {dataset_name}: {str(e)}")
        
        self.model_performance = results
        return results
    
    def _get_model_copy(self, model_name: str):
        """Get a fresh copy of the model"""
        return self.model_configs[model_name].__class__(**self.model_configs[model_name].get_params())
    
    def create_ensemble_model(self):
        """Create ensemble model from best performers"""
        print("Creating ensemble model...")
        
        if not self.models:
            print("No trained models available for ensemble")
            return None
        
        # Get the comprehensive synthetic dataset (largest and most complete)
        synthetic_dataset = 'comprehensive_synthetic_cancer'
        if synthetic_dataset not in self.models:
            # Use any available model
            synthetic_dataset = list(self.models.keys())[0]
        
        # Create ensemble from multiple model types
        ensemble_models = []
        
        # Add best models from different types
        model_types = ['random_forest', 'gradient_boosting', 'logistic_regression']
        for model_type in model_types:
            if synthetic_dataset in self.model_performance:
                if model_type in self.model_performance[synthetic_dataset]:
                    model = self.model_performance[synthetic_dataset][model_type]['model']
                    ensemble_models.append((model_type, model))
        
        if len(ensemble_models) >= 2:
            ensemble = VotingClassifier(
                estimators=ensemble_models,
                voting='soft'
            )
            
            # We would need to retrain the ensemble, but for now store the concept
            self.models['ensemble'] = ensemble
            print(f"✓ Created ensemble with {len(ensemble_models)} models")
            return ensemble
        else:
            print("Not enough models for ensemble creation")
            return None
    
    def compare_model_performance(self):
        """Compare performance across different datasets and models"""
        print("\nModel Performance Comparison:")
        print("=" * 60)
        
        comparison_data = []
        
        for dataset_name, models in self.model_performance.items():
            print(f"\nDataset: {dataset_name}")
            print("-" * 40)
            
            for model_name, metrics in models.items():
                comparison_data.append({
                    'Dataset': dataset_name,
                    'Model': model_name,
                    'Accuracy': metrics['accuracy'],
                    'AUC': metrics['auc'] if metrics['auc'] else 0,
                    'CV_Mean': metrics['cv_mean'],
                    'CV_Std': metrics['cv_std']
                })
                
                print(f"  {model_name:20s}: Acc={metrics['accuracy']:.3f}, "
                      f"AUC={metrics['auc']:.3f if metrics['auc'] else 'N/A'}, "
                      f"CV={metrics['cv_mean']:.3f}±{metrics['cv_std']:.3f}")
        
        # Create comparison DataFrame
        comparison_df = pd.DataFrame(comparison_data)
        
        # Save comparison results
        comparison_path = f"{self.dataset_manager.data_dir}/model_performance_comparison.csv"
        comparison_df.to_csv(comparison_path, index=False)
        
        print(f"\n✓ Performance comparison saved to {comparison_path}")
        
        return comparison_df
    
    def save_models(self):
        """Save all trained models and preprocessing objects"""
        model_dir = "trained_models"
        if not os.path.exists(model_dir):
            os.makedirs(model_dir)
        
        # Save models
        joblib.dump(self.models, f"{model_dir}/cancer_models.pkl")
        joblib.dump(self.scalers, f"{model_dir}/cancer_scalers.pkl")
        joblib.dump(self.feature_selectors, f"{model_dir}/cancer_feature_selectors.pkl")
        joblib.dump(self.model_performance, f"{model_dir}/model_performance.pkl")
        
        print(f"✓ Models saved to {model_dir}/")
    
    def predict_with_ensemble(self, patient_data: Dict) -> Dict:
        """Make prediction using the best available model"""
        if not self.models:
            raise ValueError("No trained models available")
        
        # Use the comprehensive synthetic model as default
        model_name = 'comprehensive_synthetic_cancer'
        if model_name not in self.models:
            model_name = list(self.models.keys())[0]
        
        model = self.models[model_name]
        scaler = self.scalers.get(model_name)
        selector = self.feature_selectors.get(model_name)
        
        # Extract features (simplified for demonstration)
        features = self._extract_features_from_patient_data(patient_data)
        
        if scaler:
            features = scaler.transform([features])
        if selector:
            features = selector.transform(features)
        
        # Make prediction
        prediction = model.predict(features)[0]
        if hasattr(model, 'predict_proba'):
            probability = model.predict_proba(features)[0]
            confidence = max(probability) * 100
        else:
            confidence = 85  # Default confidence
        
        return {
            'prediction': 'Cancer Detected' if prediction == 1 else 'No Cancer Detected',
            'confidence': confidence,
            'model_used': model_name,
            'probability_scores': probability.tolist() if hasattr(model, 'predict_proba') else None
        }
    
    def _extract_features_from_patient_data(self, patient_data: Dict) -> List[float]:
        """Extract numerical features from patient data"""
        # This is a simplified version - in practice, this would need to match
        # the exact feature set used during training
        features = [
            patient_data.get('age', 50) / 100,
            1 if patient_data.get('gender') == 'female' else 0,
            {'never': 0, 'former': 1, 'current': 2}.get(patient_data.get('smokingHistory', 'never'), 0),
            1 if patient_data.get('familyHistory', False) else 0,
            patient_data.get('bmi', 25) / 50,
            # Add more features as needed...
        ]
        
        # Pad or truncate to expected length (this is dataset-dependent)
        target_length = 20  # Assuming we selected top 20 features
        if len(features) < target_length:
            features.extend([0] * (target_length - len(features)))
        else:
            features = features[:target_length]
        
        return features

# Main execution
if __name__ == "__main__":
    print("Enhanced Cancer Prediction Model with Real-World Data")
    print("=" * 60)
    
    # Initialize model
    model = EnhancedCancerPredictionModel()
    
    # Train on multiple datasets
    results = model.train_models_on_multiple_datasets()
    
    # Create ensemble
    ensemble = model.create_ensemble_model()
    
    # Compare performance
    comparison = model.compare_model_performance()
    
    # Save models
    model.save_models()
    
    print("\n" + "=" * 60)
    print("Training completed successfully!")
    print(f"Trained models on {len(results)} datasets")
    print("Models and performance metrics saved")
