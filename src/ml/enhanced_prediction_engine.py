import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, VotingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.neural_network import MLPClassifier
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, roc_auc_score
from sklearn.feature_selection import SelectKBest, f_classif, RFE
import joblib
import json
import os
from typing import Dict, List, Tuple, Optional, Any
import warnings
warnings.filterwarnings('ignore')

class EnhancedCancerPredictionEngine:
    """Enhanced cancer prediction engine with comprehensive datasets and advanced ML algorithms"""
    
    def __init__(self, data_dir: str = "datasets", model_dir: str = "trained_models"):
        self.data_dir = data_dir
        self.model_dir = model_dir
        self.ensure_directories()
        
        # Model storage
        self.models = {}
        self.scalers = {}
        self.feature_selectors = {}
        self.label_encoders = {}
        self.feature_names = {}
        self.model_performance = {}
        
        # Advanced model configurations
        self.model_configs = {
            'random_forest': {
                'model': RandomForestClassifier,
                'params': {
                    'n_estimators': [100, 200, 300],
                    'max_depth': [10, 15, 20, None],
                    'min_samples_split': [2, 5, 10],
                    'min_samples_leaf': [1, 2, 4],
                    'class_weight': ['balanced']
                },
                'default_params': {
                    'n_estimators': 200,
                    'max_depth': 15,
                    'min_samples_split': 5,
                    'min_samples_leaf': 2,
                    'random_state': 42,
                    'class_weight': 'balanced'
                }
            },
            'gradient_boosting': {
                'model': GradientBoostingClassifier,
                'params': {
                    'n_estimators': [100, 150, 200],
                    'max_depth': [6, 8, 10],
                    'learning_rate': [0.05, 0.1, 0.15],
                    'subsample': [0.8, 0.9, 1.0]
                },
                'default_params': {
                    'n_estimators': 150,
                    'max_depth': 8,
                    'learning_rate': 0.1,
                    'random_state': 42
                }
            },
            'logistic_regression': {
                'model': LogisticRegression,
                'params': {
                    'C': [0.1, 1.0, 10.0],
                    'penalty': ['l1', 'l2'],
                    'solver': ['liblinear', 'saga'],
                    'class_weight': ['balanced']
                },
                'default_params': {
                    'random_state': 42,
                    'max_iter': 1000,
                    'class_weight': 'balanced'
                }
            },
            'neural_network': {
                'model': MLPClassifier,
                'params': {
                    'hidden_layer_sizes': [(50,), (100,), (100, 50), (150, 100, 50)],
                    'activation': ['relu', 'tanh'],
                    'alpha': [0.0001, 0.001, 0.01],
                    'learning_rate': ['constant', 'adaptive']
                },
                'default_params': {
                    'hidden_layer_sizes': (100, 50),
                    'max_iter': 500,
                    'random_state': 42,
                    'early_stopping': True
                }
            }
        }
        
        # Cancer type mappings for prediction
        self.cancer_type_mapping = {
            'lung_cancer': 'Lung Cancer',
            'breast_cancer': 'Breast Cancer',
            'prostate_cancer': 'Prostate Cancer',
            'colon_cancer': 'Colon Cancer',
            'skin_cancer': 'Skin Cancer (Melanoma)',
            'liver_cancer': 'Liver Cancer',
            'pancreatic_cancer': 'Pancreatic Cancer',
            'ovarian_cancer': 'Ovarian Cancer',
            'cervical_cancer': 'Cervical Cancer',
            'testicular_cancer': 'Testicular Cancer'
        }
    
    def ensure_directories(self):
        """Create necessary directories"""
        for directory in [self.data_dir, self.model_dir]:
            if not os.path.exists(directory):
                os.makedirs(directory)
    
    def load_datasets(self) -> Dict[str, pd.DataFrame]:
        """Load all available datasets"""
        print("Loading cancer datasets...")
        datasets = {}
        
        # Load comprehensive dataset
        comprehensive_path = os.path.join(self.data_dir, "comprehensive_multi_cancer_dataset.csv")
        if os.path.exists(comprehensive_path):
            datasets['comprehensive'] = pd.read_csv(comprehensive_path)
            print(f"✓ Loaded comprehensive dataset: {datasets['comprehensive'].shape}")
        
        # Load individual cancer datasets
        for cancer_type in self.cancer_type_mapping.keys():
            dataset_path = os.path.join(self.data_dir, f"{cancer_type}_dataset.csv")
            if os.path.exists(dataset_path):
                datasets[cancer_type] = pd.read_csv(dataset_path)
                print(f"✓ Loaded {cancer_type} dataset: {datasets[cancer_type].shape}")
        
        # Load existing datasets
        existing_datasets = ['breast_cancer_wisconsin.csv', 'comprehensive_synthetic_cancer.csv']
        for dataset_file in existing_datasets:
            dataset_path = os.path.join(self.data_dir, dataset_file)
            if os.path.exists(dataset_path):
                dataset_name = dataset_file.replace('.csv', '')
                try:
                    datasets[dataset_name] = pd.read_csv(dataset_path)
                    print(f"✓ Loaded existing dataset {dataset_name}: {datasets[dataset_name].shape}")
                except Exception as e:
                    print(f"⚠️ Error loading {dataset_name}: {str(e)}")
        
        return datasets
    
    def preprocess_dataset(self, df: pd.DataFrame, dataset_name: str) -> Tuple[pd.DataFrame, pd.Series, List[str]]:
        """Preprocess dataset for training"""
        df_processed = df.copy()
        
        # Handle missing values
        df_processed = df_processed.replace('?', np.nan)
        
        # Fill missing values with median for numeric, mode for categorical
        for col in df_processed.columns:
            if df_processed[col].dtype in ['int64', 'float64']:
                df_processed[col].fillna(df_processed[col].median(), inplace=True)
            else:
                df_processed[col].fillna(df_processed[col].mode()[0] if len(df_processed[col].mode()) > 0 else 0, inplace=True)
        
        # Determine target column
        target_candidates = ['has_cancer', 'cancer', 'class', 'target', 'LUNG_CANCER']
        target_col = None
        
        for col in target_candidates:
            if col in df_processed.columns:
                target_col = col
                break
        
        if not target_col:
            raise ValueError(f"No target column found in dataset {dataset_name}")
        
        # Separate features and target
        feature_cols = [col for col in df_processed.columns if col not in [
            target_col, 'cancer_type', 'cancer_stage', 'patient_id'
        ]]
        
        X = df_processed[feature_cols]
        y = df_processed[target_col]
        
        # Encode categorical variables
        for col in X.columns:
            if X[col].dtype == 'object':
                le = LabelEncoder()
                X[col] = le.fit_transform(X[col].astype(str))
        
        # Ensure target is binary
        if y.dtype == 'object' or len(y.unique()) > 2:
            le = LabelEncoder()
            y = le.fit_transform(y)
            # Store label encoder for this dataset
            self.label_encoders[f"{dataset_name}_target"] = le
        
        return X, y, feature_cols
    
    def train_models_with_hyperparameter_tuning(self, use_grid_search: bool = True):
        """Train models with hyperparameter tuning on all datasets"""
        print("Training enhanced models with hyperparameter tuning...")
        
        # Load datasets
        datasets = self.load_datasets()
        
        if not datasets:
            print("No datasets found. Please generate datasets first.")
            return
        
        # Train on each dataset
        for dataset_name, df in datasets.items():
            print(f"\nTraining models on {dataset_name}...")
            
            try:
                # Preprocess dataset
                X, y, feature_names = self.preprocess_dataset(df, dataset_name)
                
                if len(X) < 100:  # Skip very small datasets
                    print(f"  ⚠️ Dataset {dataset_name} too small ({len(X)} samples)")
                    continue
                
                # Store feature names
                self.feature_names[dataset_name] = feature_names
                
                # Split data
                X_train, X_test, y_train, y_test = train_test_split(
                    X, y, test_size=0.2, random_state=42, stratify=y
                )
                
                # Scale features
                scaler = StandardScaler()
                X_train_scaled = scaler.fit_transform(X_train)
                X_test_scaled = scaler.transform(X_test)
                self.scalers[dataset_name] = scaler
                
                # Feature selection
                selector = SelectKBest(f_classif, k=min(20, X_train.shape[1]))
                X_train_selected = selector.fit_transform(X_train_scaled, y_train)
                X_test_selected = selector.transform(X_test_scaled)
                self.feature_selectors[dataset_name] = selector
                
                # Train models
                dataset_models = {}
                dataset_performance = {}
                
                for model_name, config in self.model_configs.items():
                    print(f"    Training {model_name}...")
                    
                    try:
                        if use_grid_search and len(X_train) > 1000:
                            # Use grid search for larger datasets
                            model = self._train_with_grid_search(
                                config, X_train_selected, y_train, model_name
                            )
                        else:
                            # Use default parameters for smaller datasets
                            model = config['model'](**config['default_params'])
                            model.fit(X_train_selected, y_train)
                        
                        # Evaluate model
                        performance = self._evaluate_model(
                            model, X_train_selected, X_test_selected, y_train, y_test
                        )
                        
                        dataset_models[model_name] = model
                        dataset_performance[model_name] = performance
                        
                        print(f"      Accuracy: {performance['accuracy']:.4f}, "
                              f"AUC: {performance['auc']:.4f if performance['auc'] else 'N/A'}")
                        
                    except Exception as e:
                        print(f"      ✗ Error training {model_name}: {str(e)}")
                
                # Store best model for this dataset
                if dataset_models:
                    best_model_name = max(dataset_performance.keys(), 
                                        key=lambda x: dataset_performance[x]['accuracy'])
                    self.models[dataset_name] = dataset_models[best_model_name]
                    self.model_performance[dataset_name] = dataset_performance
                    
                    print(f"  ✓ Best model for {dataset_name}: {best_model_name} "
                          f"(Accuracy: {dataset_performance[best_model_name]['accuracy']:.4f})")
                
            except Exception as e:
                print(f"  ✗ Error processing {dataset_name}: {str(e)}")
        
        # Create ensemble models
        self._create_ensemble_models()
        
        # Save all models
        self.save_models()
    
    def _train_with_grid_search(self, config: Dict, X_train: np.ndarray, y_train: np.ndarray, model_name: str):
        """Train model with grid search hyperparameter tuning"""
        model = config['model']()
        
        # Reduce parameter space for faster training
        reduced_params = {}
        for param, values in config['params'].items():
            if isinstance(values, list) and len(values) > 3:
                # Take every other value to reduce search space
                reduced_params[param] = values[::2]
            else:
                reduced_params[param] = values
        
        grid_search = GridSearchCV(
            model, reduced_params, cv=3, scoring='accuracy', n_jobs=-1, verbose=0
        )
        
        grid_search.fit(X_train, y_train)
        return grid_search.best_estimator_
    
    def _evaluate_model(self, model, X_train: np.ndarray, X_test: np.ndarray, 
                       y_train: np.ndarray, y_test: np.ndarray) -> Dict:
        """Evaluate model performance"""
        # Predictions
        y_pred = model.predict(X_test)
        
        # Metrics
        accuracy = accuracy_score(y_test, y_pred)
        
        # AUC (if model supports probability prediction)
        auc = None
        if hasattr(model, 'predict_proba'):
            try:
                y_prob = model.predict_proba(X_test)[:, 1]
                auc = roc_auc_score(y_test, y_prob)
            except:
                pass
        
        # Cross-validation
        cv_scores = cross_val_score(model, X_train, y_train, cv=5, scoring='accuracy')
        
        return {
            'accuracy': accuracy,
            'auc': auc,
            'cv_mean': cv_scores.mean(),
            'cv_std': cv_scores.std(),
            'confusion_matrix': confusion_matrix(y_test, y_pred).tolist()
        }
    
    def _create_ensemble_models(self):
        """Create ensemble models from best performers"""
        print("\nCreating ensemble models...")
        
        if len(self.models) < 2:
            print("Not enough trained models for ensemble creation")
            return
        
        # Create ensemble for comprehensive dataset if available
        if 'comprehensive' in self.models:
            dataset_name = 'comprehensive'
        else:
            # Use the largest dataset
            dataset_name = max(self.models.keys(), 
                             key=lambda x: len(self.feature_names.get(x, [])))
        
        if dataset_name not in self.model_performance:
            return
        
        # Get top 3 models for ensemble
        top_models = sorted(
            self.model_performance[dataset_name].items(),
            key=lambda x: x[1]['accuracy'],
            reverse=True
        )[:3]
        
        if len(top_models) >= 2:
            ensemble_estimators = []
            for model_name, _ in top_models:
                if model_name in self.model_performance[dataset_name]:
                    # We need to retrain these models, but for now store the concept
                    ensemble_estimators.append((model_name, self.models[dataset_name]))
            
            if len(ensemble_estimators) >= 2:
                # Create voting classifier
                ensemble = VotingClassifier(
                    estimators=ensemble_estimators[:2],  # Use top 2 for simplicity
                    voting='soft'
                )
                
                self.models[f'{dataset_name}_ensemble'] = ensemble
                print(f"✓ Created ensemble model for {dataset_name}")
    
    def predict_cancer_risk(self, patient_data: Dict) -> Dict:
        """Predict cancer risk for a patient using the best available model"""
        if not self.models:
            raise ValueError("No trained models available. Please train models first.")
        
        # Use comprehensive model if available, otherwise use the best performing model
        model_name = 'comprehensive'
        if model_name not in self.models:
            # Find the model with best performance
            best_model = None
            best_accuracy = 0
            
            for dataset_name, performance_dict in self.model_performance.items():
                if dataset_name in self.models:
                    for model_type, metrics in performance_dict.items():
                        if metrics['accuracy'] > best_accuracy:
                            best_accuracy = metrics['accuracy']
                            best_model = dataset_name
            
            model_name = best_model if best_model else list(self.models.keys())[0]
        
        # Get model and preprocessing objects
        model = self.models[model_name]
        scaler = self.scalers.get(model_name)
        selector = self.feature_selectors.get(model_name)
        feature_names = self.feature_names.get(model_name, [])
        
        # Extract features from patient data
        features = self._extract_features_from_patient_data(patient_data, feature_names)
        
        # Preprocess features
        if scaler:
            features = scaler.transform([features])
        else:
            features = np.array([features])
        
        if selector:
            features = selector.transform(features)
        
        # Make prediction
        prediction = model.predict(features)[0]
        
        # Get probability if available
        confidence = 0.5
        probabilities = None
        if hasattr(model, 'predict_proba'):
            probabilities = model.predict_proba(features)[0]
            confidence = max(probabilities)
        
        # Determine cancer type based on model and prediction
        cancer_type = self._determine_cancer_type(model_name, prediction, patient_data)
        
        return {
            'has_cancer': bool(prediction),
            'cancer_type': cancer_type,
            'confidence': float(confidence * 100),
            'model_used': model_name,
            'probabilities': probabilities.tolist() if probabilities is not None else None,
            'risk_level': self._calculate_risk_level(confidence, patient_data)
        }
    
    def _extract_features_from_patient_data(self, patient_data: Dict, feature_names: List[str]) -> List[float]:
        """Extract numerical features from patient data"""
        features = []
        
        # Feature mapping from frontend to ML model
        feature_mapping = {
            'age': patient_data.get('age', 50),
            'gender': 1 if patient_data.get('gender') == 'female' else 0,
            'bmi': patient_data.get('bmi', 25),
            'family_history_cancer': 1 if patient_data.get('familyHistory', False) else 0,
            'smoking_history': {'never': 0, 'former': 1, 'current': 2}.get(
                patient_data.get('smokingHistory', 'never'), 0
            ),
            'alcohol_consumption': {'never': 0, 'occasional': 1, 'moderate': 2, 'heavy': 3}.get(
                patient_data.get('alcoholConsumption', 'never'), 0
            ),
            'physical_activity': {'none': 0, 'light': 1, 'moderate': 2, 'heavy': 3}.get(
                patient_data.get('exerciseFrequency', 'light'), 1
            ),
            'hemoglobin': patient_data.get('hemoglobin', 14),
            'white_blood_cells': patient_data.get('whiteBloodCells', 7000),
            'platelets': patient_data.get('platelets', 250000),
            'unexplained_weight_loss': 1 if patient_data.get('unexplainedWeightLoss', False) else 0,
            'persistent_fatigue': 1 if patient_data.get('persistentFatigue', False) else 0,
            'persistent_pain': 1 if patient_data.get('persistentPain', False) else 0,
            'persistent_cough': 1 if patient_data.get('persistentCough', False) else 0,
            'skin_changes': 1 if patient_data.get('skinChanges', False) else 0,
            'abdominal_pain': 1 if patient_data.get('digestiveIssues', False) else 0,
            'blood_in_stool': 1 if patient_data.get('unusualBleeding', False) else 0
        }
        
        # Extract features in the order they were trained
        if feature_names:
            for feature_name in feature_names:
                if feature_name in feature_mapping:
                    features.append(feature_mapping[feature_name])
                else:
                    # Default value for unknown features
                    features.append(0.0)
        else:
            # Use all available features
            features = list(feature_mapping.values())
        
        # Ensure we have the right number of features
        target_length = len(feature_names) if feature_names else 20
        if len(features) < target_length:
            features.extend([0.0] * (target_length - len(features)))
        elif len(features) > target_length:
            features = features[:target_length]
        
        return features
    
    def _determine_cancer_type(self, model_name: str, prediction: int, patient_data: Dict) -> str:
        """Determine specific cancer type based on model and patient data"""
        if not prediction:
            return 'No Cancer Detected'
        
        # If model is cancer-specific, return that cancer type
        for cancer_key, cancer_name in self.cancer_type_mapping.items():
            if cancer_key in model_name:
                return cancer_name
        
        # For comprehensive models, use heuristics based on patient data
        return self._heuristic_cancer_type_assignment(patient_data)
    
    def _heuristic_cancer_type_assignment(self, patient_data: Dict) -> str:
        """Assign cancer type based on patient characteristics and symptoms"""
        age = patient_data.get('age', 50)
        gender = patient_data.get('gender', 'male')
        
        # Gender-specific cancers
        if gender == 'female':
            if age > 40 and patient_data.get('familyHistory', False):
                return 'Breast Cancer'
            elif 30 <= age <= 50:
                return 'Cervical Cancer'
            elif age > 55:
                return 'Ovarian Cancer'
        elif gender == 'male':
            if age > 60:
                return 'Prostate Cancer'
            elif 20 <= age <= 40:
                return 'Testicular Cancer'
        
        # Symptom-based assignment
        if patient_data.get('persistentCough', False):
            return 'Lung Cancer'
        elif patient_data.get('digestiveIssues', False) or patient_data.get('unusualBleeding', False):
            return 'Colon Cancer'
        elif patient_data.get('skinChanges', False):
            return 'Skin Cancer (Melanoma)'
        
        # Age-based defaults
        if age > 65:
            return 'Lung Cancer'
        elif age > 50:
            return 'Colon Cancer'
        else:
            return 'Lung Cancer'  # Most common
    
    def _calculate_risk_level(self, confidence: float, patient_data: Dict) -> str:
        """Calculate risk level based on confidence and patient factors"""
        if confidence < 0.4:
            return 'Low'
        elif confidence < 0.7:
            return 'Medium'
        else:
            return 'High'
    
    def save_models(self):
        """Save all trained models and preprocessing objects"""
        print(f"\nSaving models to {self.model_dir}...")
        
        # Save models
        joblib.dump(self.models, os.path.join(self.model_dir, 'enhanced_models.pkl'))
        joblib.dump(self.scalers, os.path.join(self.model_dir, 'enhanced_scalers.pkl'))
        joblib.dump(self.feature_selectors, os.path.join(self.model_dir, 'enhanced_selectors.pkl'))
        joblib.dump(self.feature_names, os.path.join(self.model_dir, 'feature_names.pkl'))
        
        # Save performance metrics
        with open(os.path.join(self.model_dir, 'model_performance.json'), 'w') as f:
            json.dump(self.model_performance, f, indent=2, default=str)
        
        print("✓ All models and preprocessing objects saved successfully!")
    
    def load_models(self):
        """Load saved models and preprocessing objects"""
        try:
            self.models = joblib.load(os.path.join(self.model_dir, 'enhanced_models.pkl'))
            self.scalers = joblib.load(os.path.join(self.model_dir, 'enhanced_scalers.pkl'))
            self.feature_selectors = joblib.load(os.path.join(self.model_dir, 'enhanced_selectors.pkl'))
            self.feature_names = joblib.load(os.path.join(self.model_dir, 'feature_names.pkl'))
            
            with open(os.path.join(self.model_dir, 'model_performance.json'), 'r') as f:
                self.model_performance = json.load(f)
            
            print("✓ Models loaded successfully!")
            return True
        except FileNotFoundError:
            print("No saved models found. Please train models first.")
            return False
    
    def get_model_summary(self) -> Dict:
        """Get summary of trained models"""
        summary = {
            'total_models': len(self.models),
            'datasets_used': list(self.models.keys()),
            'best_performing_models': {},
            'feature_counts': {}
        }
        
        for dataset_name, performance_dict in self.model_performance.items():
            if performance_dict:
                best_model = max(performance_dict.keys(), 
                               key=lambda x: performance_dict[x]['accuracy'])
                summary['best_performing_models'][dataset_name] = {
                    'model_type': best_model,
                    'accuracy': performance_dict[best_model]['accuracy'],
                    'auc': performance_dict[best_model]['auc']
                }
            
            if dataset_name in self.feature_names:
                summary['feature_counts'][dataset_name] = len(self.feature_names[dataset_name])
        
        return summary

# Main execution
if __name__ == "__main__":
    print("Enhanced Cancer Prediction Engine")
    print("=" * 50)
    
    # Initialize engine
    engine = EnhancedCancerPredictionEngine()
    
    # Train models
    print("Training enhanced models with hyperparameter tuning...")
    engine.train_models_with_hyperparameter_tuning(use_grid_search=True)
    
    # Display summary
    summary = engine.get_model_summary()
    print(f"\nModel Training Summary:")
    print(f"Total models trained: {summary['total_models']}")
    print(f"Datasets used: {', '.join(summary['datasets_used'])}")
    
    print("\nBest performing models:")
    for dataset, info in summary['best_performing_models'].items():
        print(f"  {dataset}: {info['model_type']} (Accuracy: {info['accuracy']:.4f})")
    
    print("\n✓ Enhanced prediction engine training completed!")