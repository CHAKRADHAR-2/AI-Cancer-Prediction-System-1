
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import joblib
import json
import warnings
warnings.filterwarnings('ignore')

class CancerPredictionModel:
    def __init__(self):
        self.models = {}
        self.scalers = {}
        self.label_encoders = {}
        self.feature_names = [
            'age', 'gender', 'smoking_history', 'family_history', 'bmi',
            'systolic_bp', 'diastolic_bp', 'cholesterol', 'glucose',
            'hemoglobin', 'wbc', 'platelets', 'alcohol_consumption',
            'exercise_frequency', 'stress_level', 'sleep_hours',
            'sun_exposure', 'weight_loss', 'fatigue', 'bleeding',
            'cough', 'skin_changes', 'digestive_issues'
        ]
        
    def create_synthetic_dataset(self, n_samples=10000):
        """Create synthetic cancer dataset for training"""
        np.random.seed(42)
        
        # Generate features
        data = {
            'age': np.random.normal(55, 15, n_samples).clip(18, 90),
            'gender': np.random.choice([0, 1], n_samples),  # 0=male, 1=female
            'smoking_history': np.random.choice([0, 1, 2], n_samples, p=[0.4, 0.3, 0.3]),  # 0=never, 1=former, 2=current
            'family_history': np.random.choice([0, 1], n_samples, p=[0.7, 0.3]),
            'bmi': np.random.normal(26, 4, n_samples).clip(16, 45),
            'systolic_bp': np.random.normal(130, 20, n_samples).clip(90, 200),
            'diastolic_bp': np.random.normal(85, 12, n_samples).clip(60, 120),
            'cholesterol': np.random.normal(200, 40, n_samples).clip(120, 350),
            'glucose': np.random.normal(100, 25, n_samples).clip(70, 250),
            'hemoglobin': np.random.normal(14, 2, n_samples).clip(8, 18),
            'wbc': np.random.normal(7000, 2000, n_samples).clip(3000, 15000),
            'platelets': np.random.normal(250000, 80000, n_samples).clip(100000, 500000),
            'alcohol_consumption': np.random.choice([0, 1, 2, 3], n_samples, p=[0.3, 0.4, 0.2, 0.1]),  # never, occasional, moderate, heavy
            'exercise_frequency': np.random.choice([0, 1, 2, 3], n_samples, p=[0.2, 0.3, 0.3, 0.2]),  # none, light, moderate, heavy
            'stress_level': np.random.choice([0, 1, 2], n_samples, p=[0.3, 0.5, 0.2]),  # low, moderate, high
            'sleep_hours': np.random.normal(7, 1.5, n_samples).clip(4, 12),
            'sun_exposure': np.random.choice([0, 1, 2], n_samples, p=[0.4, 0.4, 0.2]),  # minimal, moderate, high
            'weight_loss': np.random.choice([0, 1], n_samples, p=[0.8, 0.2]),
            'fatigue': np.random.choice([0, 1], n_samples, p=[0.7, 0.3]),
            'bleeding': np.random.choice([0, 1], n_samples, p=[0.85, 0.15]),
            'cough': np.random.choice([0, 1], n_samples, p=[0.8, 0.2]),
            'skin_changes': np.random.choice([0, 1], n_samples, p=[0.9, 0.1]),
            'digestive_issues': np.random.choice([0, 1], n_samples, p=[0.75, 0.25])
        }
        
        df = pd.DataFrame(data)
        
        # Generate cancer labels based on realistic risk factors
        cancer_prob = self._calculate_cancer_probability(df)
        cancer_types = ['No Cancer', 'Lung Cancer', 'Breast Cancer', 'Prostate Cancer', 
                       'Colon Cancer', 'Liver Cancer', 'Stomach Cancer', 'Pancreatic Cancer']
        
        # Assign cancer types based on probabilities and risk factors
        labels = []
        for i in range(n_samples):
            if cancer_prob[i] < 0.7:  # 70% chance of no cancer
                labels.append('No Cancer')
            else:
                # Weight cancer types based on demographics and risk factors
                if df.iloc[i]['smoking_history'] == 2 and df.iloc[i]['age'] > 50:
                    labels.append(np.random.choice(['Lung Cancer', 'Liver Cancer'], p=[0.7, 0.3]))
                elif df.iloc[i]['gender'] == 1 and df.iloc[i]['age'] > 40:  # Female
                    labels.append('Breast Cancer')
                elif df.iloc[i]['gender'] == 0 and df.iloc[i]['age'] > 50:  # Male
                    labels.append(np.random.choice(['Prostate Cancer', 'Colon Cancer'], p=[0.6, 0.4]))
                else:
                    labels.append(np.random.choice(cancer_types[1:], p=[0.2, 0.2, 0.15, 0.2, 0.1, 0.1, 0.05]))
        
        df['cancer_type'] = labels
        return df
    
    def _calculate_cancer_probability(self, df):
        """Calculate cancer probability based on risk factors"""
        prob = np.zeros(len(df))
        
        # Age factor
        prob += (df['age'] - 30) / 100
        
        # Smoking factor
        prob += df['smoking_history'] * 0.3
        
        # Family history
        prob += df['family_history'] * 0.2
        
        # BMI factor
        prob += np.where(df['bmi'] > 30, 0.15, 0)
        
        # Symptoms
        prob += (df['weight_loss'] + df['fatigue'] + df['bleeding'] + 
                df['cough'] + df['skin_changes'] + df['digestive_issues']) * 0.1
        
        # Lifestyle factors
        prob += df['alcohol_consumption'] * 0.05
        prob += (3 - df['exercise_frequency']) * 0.03
        prob += df['stress_level'] * 0.05
        
        return np.clip(prob, 0, 1)
    
    def train_models(self):
        """Train machine learning models for cancer prediction"""
        print("Generating synthetic dataset...")
        df = self.create_synthetic_dataset()
        
        # Prepare features and target
        X = df[self.feature_names]
        y = df['cancer_type']
        
        # Encode categorical variables
        le = LabelEncoder()
        y_encoded = le.fit_transform(y)
        self.label_encoders['cancer_type'] = le
        
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
        print("Training Random Forest model...")
        rf_model = RandomForestClassifier(
            n_estimators=200, 
            max_depth=15, 
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42,
            class_weight='balanced'
        )
        rf_model.fit(X_train_scaled, y_train)
        self.models['random_forest'] = rf_model
        
        # Train Gradient Boosting
        print("Training Gradient Boosting model...")
        gb_model = GradientBoostingClassifier(
            n_estimators=150,
            max_depth=8,
            learning_rate=0.1,
            random_state=42
        )
        gb_model.fit(X_train_scaled, y_train)
        self.models['gradient_boosting'] = gb_model
        
        # Evaluate models
        self._evaluate_models(X_test_scaled, y_test)
        
        # Save models
        self.save_models()
        
    def _evaluate_models(self, X_test, y_test):
        """Evaluate trained models"""
        for name, model in self.models.items():
            y_pred = model.predict(X_test)
            accuracy = accuracy_score(y_test, y_pred)
            print(f"\n{name.upper()} Model Accuracy: {accuracy:.4f}")
            
            # Cross-validation score
            cv_scores = cross_val_score(model, X_test, y_test, cv=5)
            print(f"Cross-validation score: {cv_scores.mean():.4f} (+/- {cv_scores.std() * 2:.4f})")
    
    def predict(self, patient_data):
        """Make prediction for a single patient"""
        if not self.models:
            self.load_models()
        
        # Convert patient data to features
        features = self._extract_features(patient_data)
        features_scaled = self.scalers['main'].transform([features])
        
        # Get predictions from both models
        rf_pred = self.models['random_forest'].predict_proba(features_scaled)[0]
        gb_pred = self.models['gradient_boosting'].predict_proba(features_scaled)[0]
        
        # Ensemble prediction (average)
        ensemble_pred = (rf_pred + gb_pred) / 2
        
        # Get class labels
        classes = self.label_encoders['cancer_type'].classes_
        
        # Create prediction result
        predictions = dict(zip(classes, ensemble_pred))
        
        # Get top prediction
        top_prediction = max(predictions, key=predictions.get)
        confidence = predictions[top_prediction] * 100
        
        return {
            'predicted_cancer': top_prediction,
            'confidence': confidence,
            'stage': self._determine_ml_stage(top_prediction, confidence),
            'all_predictions': predictions,
            'model_type': 'ensemble_ml'
        }
    
    def _extract_features(self, patient_data):
        """Extract features from patient data"""
        # Map patient data to model features
        feature_mapping = {
            'age': patient_data.get('age', 50),
            'gender': 1 if patient_data.get('gender') == 'female' else 0,
            'smoking_history': {'never': 0, 'former': 1, 'current': 2}.get(patient_data.get('smokingHistory', 'never'), 0),
            'family_history': 1 if patient_data.get('familyHistory', False) else 0,
            'bmi': patient_data.get('bmi', 25),
            'systolic_bp': patient_data.get('bloodPressure', {}).get('systolic', 120),
            'diastolic_bp': patient_data.get('bloodPressure', {}).get('diastolic', 80),
            'cholesterol': patient_data.get('cholesterol', 200),
            'glucose': patient_data.get('glucose', 100),
            'hemoglobin': patient_data.get('hemoglobin', 14),
            'wbc': patient_data.get('whiteBloodCells', 7000),
            'platelets': patient_data.get('platelets', 250000),
            'alcohol_consumption': {'never': 0, 'occasional': 1, 'moderate': 2, 'heavy': 3}.get(patient_data.get('alcoholConsumption', 'never'), 0),
            'exercise_frequency': {'none': 0, 'light': 1, 'moderate': 2, 'heavy': 3}.get(patient_data.get('exerciseFrequency', 'light'), 1),
            'stress_level': {'low': 0, 'moderate': 1, 'high': 2}.get(patient_data.get('stressLevel', 'moderate'), 1),
            'sleep_hours': patient_data.get('sleepHours', 7),
            'sun_exposure': {'minimal': 0, 'moderate': 1, 'high': 2}.get(patient_data.get('sunExposure', 'moderate'), 1),
            'weight_loss': 1 if patient_data.get('unexplainedWeightLoss', False) else 0,
            'fatigue': 1 if patient_data.get('persistentFatigue', False) else 0,
            'bleeding': 1 if patient_data.get('unusualBleeding', False) else 0,
            'cough': 1 if patient_data.get('persistentCough', False) else 0,
            'skin_changes': 1 if patient_data.get('skinChanges', False) else 0,
            'digestive_issues': 1 if patient_data.get('digestiveIssues', False) else 0
        }
        
        return [feature_mapping[feature] for feature in self.feature_names]
    
    def _determine_ml_stage(self, cancer_type: str, confidence: float) -> str:
        """ML-based stage determination"""
        if 'No Cancer' in cancer_type:
            return ''
        
        # ML model stage determination based on confidence and cancer type
        if confidence >= 90:
            return 'IV'  # Very high confidence
        elif confidence >= 75:
            return 'III' # High confidence
        elif confidence >= 60:
            return 'II'  # Moderate confidence
        else:
            return 'I'   # Lower confidence, early stage
    
    def save_models(self):
        """Save trained models and encoders"""
        joblib.dump(self.models, 'cancer_models.pkl')
        joblib.dump(self.scalers, 'cancer_scalers.pkl')
        joblib.dump(self.label_encoders, 'cancer_encoders.pkl')
        print("Models saved successfully!")
    
    def load_models(self):
        """Load saved models and encoders"""
        try:
            self.models = joblib.load('cancer_models.pkl')
            self.scalers = joblib.load('cancer_scalers.pkl')
            self.label_encoders = joblib.load('cancer_encoders.pkl')
            print("Models loaded successfully!")
        except FileNotFoundError:
            print("No saved models found. Training new models...")
            self.train_models()

# Example usage and training script
if __name__ == "__main__":
    print("Cancer Prediction ML Model Training")
    print("=" * 50)
    
    # Initialize and train model
    model = CancerPredictionModel()
    model.train_models()
    
    # Test prediction
    sample_patient = {
        'age': 65,
        'gender': 'male',
        'smokingHistory': 'current',
        'familyHistory': True,
        'bmi': 28.5,
        'bloodPressure': {'systolic': 140, 'diastolic': 90},
        'cholesterol': 220,
        'glucose': 110,
        'hemoglobin': 13.5,
        'whiteBloodCells': 8000,
        'platelets': 300000,
        'alcoholConsumption': 'moderate',
        'exerciseFrequency': 'light',
        'stressLevel': 'high',
        'sleepHours': 6,
        'sunExposure': 'moderate',
        'unexplainedWeightLoss': True,
        'persistentFatigue': True,
        'unusualBleeding': False,
        'persistentCough': True,
        'skinChanges': False,
        'digestiveIssues': False
    }
    
    print("\nTesting prediction on sample patient:")
    result = model.predict(sample_patient)
    print(f"Predicted Cancer: {result['predicted_cancer']}")
    print(f"Confidence: {result['confidence']:.2f}%")
    print(f"All predictions: {result['all_predictions']}")
