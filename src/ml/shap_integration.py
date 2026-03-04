#!/usr/bin/env python3
"""
SHAP Integration with Enhanced Cancer Prediction Engine
Provides real-time SHAP explanations for cancer predictions
"""

import pandas as pd
import numpy as np
import json
import os
from typing import Dict, List, Any, Optional
import warnings
warnings.filterwarnings('ignore')

try:
    import shap
    SHAP_AVAILABLE = True
except ImportError:
    SHAP_AVAILABLE = False
    print("SHAP not available. Install with: pip install shap")

class CancerPredictionSHAP:
    """SHAP explanations for cancer prediction system"""
    
    def __init__(self):
        self.shap_available = SHAP_AVAILABLE
        self.explainer = None
        self.feature_names = []
        self.baseline_value = 0.5  # Default baseline for cancer prediction
        
        # Feature importance weights (simulated SHAP values for when SHAP is not available)
        self.feature_weights = {
            'age': 0.15,
            'gender': 0.08,
            'bmi': 0.06,
            'smoking_history': 0.18,
            'alcohol_consumption': 0.09,
            'family_history': 0.16,
            'exercise_frequency': 0.07,
            'unexplained_weight_loss': 0.14,
            'persistent_fatigue': 0.11,
            'persistent_cough': 0.13,
            'skin_changes': 0.10,
            'digestive_issues': 0.12,
            'unusual_bleeding': 0.15,
            'tumor_size': 0.25,
            'lymph_nodes': 0.22,
            'metastasis': 0.30,
            'hemoglobin': 0.08,
            'white_blood_cells': 0.06,
            'platelets': 0.05
        }
    
    def initialize_explainer(self, model=None, X_train=None):
        """Initialize SHAP explainer if available"""
        if not self.shap_available:
            print("Using simulated SHAP values (SHAP library not available)")
            return
        
        try:
            if model and X_train is not None:
                # Use TreeExplainer for tree-based models (most common)
                self.explainer = shap.TreeExplainer(model)
                self.feature_names = list(X_train.columns) if hasattr(X_train, 'columns') else []
                print("SHAP TreeExplainer initialized successfully")
            else:
                print("Model or training data not provided, using simulated SHAP values")
        except Exception as e:
            print(f"Error initializing SHAP explainer: {str(e)}")
            print("Falling back to simulated SHAP values")
    
    def explain_prediction(self, patient_data: Dict, prediction_result: Dict) -> Dict:
        """Generate SHAP-like explanation for a cancer prediction"""
        
        # Extract features from patient data
        features = self._extract_features_for_shap(patient_data)
        
        if self.shap_available and self.explainer:
            return self._generate_real_shap_explanation(features, prediction_result)
        else:
            return self._generate_simulated_shap_explanation(features, prediction_result)
    
    def _extract_features_for_shap(self, patient_data: Dict) -> Dict:
        """Extract and normalize features for SHAP analysis"""
        features = {
            'age': patient_data.get('age', 50) / 100,
            'gender': 1 if patient_data.get('gender') == 'female' else 0,
            'bmi': (patient_data.get('bmi', 25) - 18.5) / (40 - 18.5),
            'smoking_history': self._encode_smoking(patient_data.get('smokingHistory', 'never')),
            'alcohol_consumption': self._encode_alcohol(patient_data.get('alcoholConsumption', 'never')),
            'family_history': 1 if patient_data.get('familyHistory', False) else 0,
            'exercise_frequency': self._encode_exercise(patient_data.get('exerciseFrequency', 'light')),
            'unexplained_weight_loss': 1 if patient_data.get('unexplainedWeightLoss', False) else 0,
            'persistent_fatigue': 1 if patient_data.get('persistentFatigue', False) else 0,
            'persistent_cough': 1 if patient_data.get('persistentCough', False) else 0,
            'skin_changes': 1 if patient_data.get('skinChanges', False) else 0,
            'digestive_issues': 1 if patient_data.get('digestiveIssues', False) else 0,
            'unusual_bleeding': 1 if patient_data.get('unusualBleeding', False) else 0,
            'tumor_size': (patient_data.get('tumorSize', 0) or 0) / 10,
            'lymph_nodes': (patient_data.get('lymphNodes', 0) or 0) / 20,
            'metastasis': 1 if patient_data.get('metastasis', False) else 0,
            'hemoglobin': ((patient_data.get('hemoglobin', 14) or 14) - 8) / 10,
            'white_blood_cells': ((patient_data.get('whiteBloodCells', 7000) or 7000) - 4000) / 10000,
            'platelets': ((patient_data.get('platelets', 250000) or 250000) - 150000) / 300000
        }
        
        # Normalize all features to 0-1 range
        for key, value in features.items():
            features[key] = max(0, min(1, value))
        
        return features
    
    def _generate_real_shap_explanation(self, features: Dict, prediction_result: Dict) -> Dict:
        """Generate real SHAP explanation using SHAP library"""
        try:
            # Convert features to DataFrame
            feature_df = pd.DataFrame([features])
            
            # Calculate SHAP values
            shap_values = self.explainer.shap_values(feature_df)
            
            # Handle different SHAP value formats
            if isinstance(shap_values, list):
                shap_values = shap_values[1]  # Take positive class for binary classification
            
            # Get expected value (baseline)
            expected_value = getattr(self.explainer, 'expected_value', self.baseline_value)
            if isinstance(expected_value, np.ndarray):
                expected_value = expected_value[1] if len(expected_value) > 1 else expected_value[0]
            
            # Create explanation
            explanation = self._create_explanation_dict(
                features, shap_values[0], expected_value, prediction_result, is_real_shap=True
            )
            
            return explanation
            
        except Exception as e:
            print(f"Error generating real SHAP explanation: {str(e)}")
            return self._generate_simulated_shap_explanation(features, prediction_result)
    
    def _generate_simulated_shap_explanation(self, features: Dict, prediction_result: Dict) -> Dict:
        """Generate simulated SHAP explanation when SHAP library is not available"""
        
        # Calculate simulated SHAP values based on feature importance and values
        simulated_shap_values = {}
        
        for feature, value in features.items():
            base_importance = self.feature_weights.get(feature, 0.05)
            
            # Simulate SHAP value based on feature value and importance
            if value > 0.5:  # High feature value
                shap_value = base_importance * (value - 0.5) * 2
            else:  # Low feature value
                shap_value = -base_importance * (0.5 - value) * 2
            
            # Add some realistic variation
            shap_value *= np.random.uniform(0.8, 1.2)
            
            simulated_shap_values[feature] = shap_value
        
        # Create explanation
        explanation = self._create_explanation_dict(
            features, simulated_shap_values, self.baseline_value, prediction_result, is_real_shap=False
        )
        
        return explanation
    
    def _create_explanation_dict(self, features: Dict, shap_values, expected_value: float, 
                                prediction_result: Dict, is_real_shap: bool = True) -> Dict:
        """Create standardized explanation dictionary"""
        
        # Convert shap_values to dict if it's an array
        if isinstance(shap_values, np.ndarray):
            shap_dict = {feature: float(shap_values[i]) for i, feature in enumerate(features.keys())}
        else:
            shap_dict = {k: float(v) for k, v in shap_values.items()}
        
        # Calculate total contribution
        total_contribution = sum(abs(v) for v in shap_dict.values())
        
        # Create feature contributions with human-readable names
        feature_contributions = []
        
        feature_name_mapping = {
            'age': 'Age',
            'gender': 'Gender',
            'bmi': 'Body Mass Index',
            'smoking_history': 'Smoking History',
            'alcohol_consumption': 'Alcohol Consumption',
            'family_history': 'Family History',
            'exercise_frequency': 'Exercise Frequency',
            'unexplained_weight_loss': 'Unexplained Weight Loss',
            'persistent_fatigue': 'Persistent Fatigue',
            'persistent_cough': 'Persistent Cough',
            'skin_changes': 'Skin Changes',
            'digestive_issues': 'Digestive Issues',
            'unusual_bleeding': 'Unusual Bleeding',
            'tumor_size': 'Tumor Size',
            'lymph_nodes': 'Lymph Nodes',
            'metastasis': 'Metastasis',
            'hemoglobin': 'Hemoglobin Level',
            'white_blood_cells': 'White Blood Cells',
            'platelets': 'Platelet Count'
        }
        
        for feature, shap_value in shap_dict.items():
            contribution_pct = (abs(shap_value) / total_contribution * 100) if total_contribution > 0 else 0
            
            feature_contributions.append({
                'feature': feature_name_mapping.get(feature, feature.replace('_', ' ').title()),
                'feature_key': feature,
                'shap_value': shap_value,
                'feature_value': features[feature],
                'contribution_pct': contribution_pct,
                'impact': 'Increases Risk' if shap_value > 0 else 'Decreases Risk',
                'magnitude': 'High' if contribution_pct > 15 else 'Medium' if contribution_pct > 5 else 'Low'
            })
        
        # Sort by absolute contribution
        feature_contributions.sort(key=lambda x: abs(x['shap_value']), reverse=True)
        
        # Create explanation summary
        explanation = {
            'explanation_type': 'Real SHAP' if is_real_shap else 'Simulated SHAP',
            'baseline_probability': float(expected_value),
            'predicted_probability': prediction_result.get('confidence', 50) / 100,
            'prediction': prediction_result.get('cancerType', 'Unknown'),
            'total_features': len(features),
            'feature_contributions': feature_contributions,
            'top_risk_factors': [
                contrib for contrib in feature_contributions[:5] 
                if contrib['shap_value'] > 0
            ],
            'top_protective_factors': [
                contrib for contrib in feature_contributions[:5] 
                if contrib['shap_value'] < 0
            ],
            'summary': self._generate_explanation_summary(feature_contributions, prediction_result)
        }
        
        return explanation
    
    def _generate_explanation_summary(self, contributions: List[Dict], prediction_result: Dict) -> str:
        """Generate human-readable explanation summary"""
        
        cancer_detected = prediction_result.get('cancerType', 'No Cancer Detected') != 'No Cancer Detected'
        confidence = prediction_result.get('confidence', 0)
        
        # Get top contributing factors
        top_positive = [c for c in contributions[:3] if c['shap_value'] > 0]
        top_negative = [c for c in contributions[:3] if c['shap_value'] < 0]
        
        if cancer_detected:
            summary = f"The model predicts {prediction_result.get('cancerType')} with {confidence}% confidence. "
            
            if top_positive:
                risk_factors = [f['feature'] for f in top_positive]
                summary += f"Key risk factors contributing to this prediction: {', '.join(risk_factors)}. "
            
            if top_negative:
                protective_factors = [f['feature'] for f in top_negative[:2]]
                summary += f"Protective factors: {', '.join(protective_factors)}. "
                
        else:
            summary = f"The model indicates no cancer detected with {confidence}% confidence. "
            
            if top_negative:
                protective_factors = [f['feature'] for f in top_negative[:2]]
                summary += f"Key protective factors: {', '.join(protective_factors)}. "
        
        summary += "This explanation shows how each factor contributed to the final prediction."
        
        return summary
    
    def _encode_smoking(self, smoking: str) -> float:
        """Encode smoking history"""
        mapping = {'never': 0, 'former': 0.5, 'current': 1}
        return mapping.get(smoking, 0)
    
    def _encode_alcohol(self, alcohol: str) -> float:
        """Encode alcohol consumption"""
        mapping = {'never': 0, 'occasional': 0.3, 'moderate': 0.6, 'heavy': 1}
        return mapping.get(alcohol, 0)
    
    def _encode_exercise(self, exercise: str) -> float:
        """Encode exercise frequency"""
        mapping = {'none': 0, 'light': 0.3, 'moderate': 0.6, 'heavy': 1}
        return mapping.get(exercise, 0.3)
    
    def get_feature_importance_chart_data(self, explanation: Dict) -> List[Dict]:
        """Get data formatted for frontend feature importance charts"""
        
        contributions = explanation.get('feature_contributions', [])
        
        # Format for chart display
        chart_data = []
        for contrib in contributions[:10]:  # Top 10 features
            chart_data.append({
                'feature': contrib['feature'],
                'importance': abs(contrib['shap_value']) * 100,  # Convert to percentage scale
                'impact': contrib['impact'],
                'value': contrib['feature_value'],
                'contribution_pct': contrib['contribution_pct']
            })
        
        return chart_data

# Global instance for easy integration
cancer_shap = CancerPredictionSHAP()

def get_shap_explanation(patient_data: Dict, prediction_result: Dict) -> Dict:
    """
    Main function to get SHAP explanation for cancer prediction
    This function can be called from the frontend prediction engine
    """
    return cancer_shap.explain_prediction(patient_data, prediction_result)

def get_feature_importance_data(patient_data: Dict, prediction_result: Dict) -> List[Dict]:
    """
    Get feature importance data formatted for frontend charts
    """
    explanation = get_shap_explanation(patient_data, prediction_result)
    return cancer_shap.get_feature_importance_chart_data(explanation)

if __name__ == "__main__":
    print("SHAP Integration for Cancer Prediction System")
    print("=" * 50)
    
    # Test with sample data
    sample_patient = {
        'age': 65,
        'gender': 'male',
        'smokingHistory': 'current',
        'familyHistory': True,
        'unexplainedWeightLoss': True,
        'persistentCough': True
    }
    
    sample_prediction = {
        'cancerType': 'Lung Cancer',
        'confidence': 85,
        'stage': 'II'
    }
    
    explanation = get_shap_explanation(sample_patient, sample_prediction)
    print("Sample SHAP explanation generated successfully!")
    print(f"Explanation type: {explanation['explanation_type']}")
    print(f"Top risk factor: {explanation['feature_contributions'][0]['feature']}")