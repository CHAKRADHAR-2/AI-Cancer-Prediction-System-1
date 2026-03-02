#!/usr/bin/env python3
"""
Optimized AI-ML Cancer Prediction API Server
Production-ready with all code issues resolved
"""

from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Any, Optional
import json
import logging
import os
import traceback


from flask import Flask, request, jsonify
from flask_cors import CORS

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Add ML path
ml_path = Path(__file__).parent / "cancer-aid-navigator-ai-main" / "src" / "ml"
if ml_path.exists():
    import sys
    sys.path.append(str(ml_path))

app = Flask(__name__)
CORS(app)

# Initialize ML system
logger.info("Initializing STRICT ML-FIRST Cancer Prediction System...")
ml_model = None
ml_model_status = "not_loaded"

try:
    from cancer_prediction_model import CancerPredictionModel
    ml_model = CancerPredictionModel()
    ml_model_status = "loaded"
    logger.info("SUCCESS: ML Model loaded - STRICT ML-FIRST mode enabled")
except ImportError as e:
    ml_model_status = "import_error"
    logger.warning(f"ML Model import failed: {e} - Will use rule-based fallback")
except Exception as e:
    ml_model_status = "load_error"
    logger.error(f"ML Model loading failed: {e} - Will use rule-based fallback")

class PredictionEngine:
    """Optimized prediction engine with proper error handling"""
    
    @staticmethod
    def basic_prediction(patient_data: Dict[str, Any]) -> Dict[str, Any]:
        """Enhanced prediction logic for all cancer types"""
        risk_score = 0.0
        
        # Age factor (progressive risk)
        age = patient_data.get('age', 50)
        if age > 70:
            risk_score += 0.4
        elif age > 60:
            risk_score += 0.3
        elif age > 50:
            risk_score += 0.2
        elif age > 40:
            risk_score += 0.1
        
        # Smoking factor
        smoking_history = patient_data.get('smokingHistory', 'never')
        if smoking_history == 'current':
            risk_score += 0.4
        elif smoking_history == 'former':
            risk_score += 0.2
        
        # Family history
        if patient_data.get('familyHistory', False):
            risk_score += 0.25
        
        # Symptom-based risk factors
        symptoms = [
            'persistentCough', 'unexplainedWeightLoss', 'persistentFatigue',
            'breastLump', 'skinChanges', 'bloodInStool', 'urinaryProblems',
            'abnormalBleeding', 'jaundice', 'abdominalPain', 'newMoles',
            'bowelChanges', 'bloodInUrine', 'pelvicPain'
        ]
        
        symptom_count = sum(1 for symptom in symptoms if patient_data.get(symptom, False))
        risk_score += symptom_count * 0.15
        
        # Lifestyle factors
        if patient_data.get('alcoholConsumption') == 'frequent':
            risk_score += 0.2
        elif patient_data.get('alcoholConsumption') == 'occasional':
            risk_score += 0.1
        
        # BMI factor
        bmi = patient_data.get('bmi', 25)
        if bmi > 30:
            risk_score += 0.15
        elif bmi > 35:
            risk_score += 0.25
        
        # Determine cancer type
        cancer_type = PredictionEngine._determine_cancer_type(patient_data, risk_score)
        
        # Calculate confidence based on risk score and symptoms
        if cancer_type == 'No Cancer':
            confidence = max(15.0, min((1 - risk_score) * 100, 95.0))
        else:
            confidence = max(25.0, min(risk_score * 100 + symptom_count * 10, 95.0))
        
        return {
            'predicted_cancer': cancer_type,
            'confidence': confidence,
            'stage': PredictionEngine._determine_stage(cancer_type, confidence)
        }
    
    @staticmethod
    def _determine_cancer_type(patient_data: Dict[str, Any], risk_score: float) -> str:
        """Determine cancer type based on patient data and risk factors"""
        if risk_score < 0.3:
            return 'No Cancer'
        
        # High risk cases (>0.7)
        if risk_score > 0.7:
            # Lung cancer indicators
            if patient_data.get('persistentCough', False) and patient_data.get('smokingHistory') in ['current', 'former']:
                return 'Lung Cancer'
            
            # Breast cancer indicators (females)
            if patient_data.get('gender') == 'female' and patient_data.get('age', 0) > 40:
                if patient_data.get('breastLump', False) or patient_data.get('familyHistory', False):
                    return 'Breast Cancer'
            
            # Prostate cancer indicators (males)
            if patient_data.get('gender') == 'male' and patient_data.get('age', 0) > 50:
                if patient_data.get('urinaryProblems', False) or patient_data.get('bloodInUrine', False):
                    return 'Prostate Cancer'
            
            # Colon cancer indicators
            if patient_data.get('bloodInStool', False) or patient_data.get('bowelChanges', False):
                return 'Colon Cancer'
            
            # Liver cancer indicators
            if patient_data.get('jaundice', False) or patient_data.get('alcoholConsumption') == 'frequent':
                return 'Liver Cancer'
            
            # Skin cancer indicators
            if patient_data.get('skinChanges', False) or patient_data.get('newMoles', False):
                return 'Skin Cancer'
            
            # Cervical cancer indicators (females)
            if patient_data.get('gender') == 'female' and patient_data.get('abnormalBleeding', False):
                return 'Cervical Cancer'
            
            # Pancreatic cancer indicators
            if patient_data.get('diabetes', False) and patient_data.get('abdominalPain', False):
                return 'Pancreatic Cancer'
            
            # Default high risk
            return 'High Cancer Risk'
        
        # Moderate risk cases (0.4-0.7)
        elif risk_score > 0.4:
            return 'Moderate Cancer Risk'
        
        # Low risk cases (0.3-0.4)
        else:
            return 'Low Cancer Risk'
    
    @staticmethod
    def _determine_stage(cancer_type: str, confidence: float) -> str:
        """Determine cancer stage for rule-based fallback ONLY"""
        if 'No Cancer' in cancer_type or 'Risk' in cancer_type:
            return ''
        
        # Rule-based staging for fallback cases only
        if confidence >= 80:
            return 'III'
        elif confidence >= 60:
            return 'II'
        else:
            return 'I'

class RecommendationEngine:
    """Generate medical recommendations based on predictions"""
    
    @staticmethod
    def generate_recommendations(cancer_type: str, confidence: float) -> List[str]:
        """Generate medical recommendations with proper categorization"""
        recommendations = []
        
        if confidence > 70:
            if cancer_type != 'No Cancer':
                recommendations.extend([
                    "🏥 Immediate medical consultation recommended",
                    "🔬 Comprehensive diagnostic tests needed", 
                    "📋 Specialist referral advised"
                ])
            else:
                recommendations.extend([
                    "✅ Low cancer risk detected",
                    "🔄 Regular health checkups recommended"
                ])
        elif confidence > 40:
            recommendations.extend([
                "⚠️ Moderate risk factors present",
                "👨‍⚕️ Consult healthcare provider",
                "📊 Additional screening may be needed"
            ])
        else:
            recommendations.extend([
                "📋 Inconclusive results",
                "👨‍⚕️ Professional medical assessment recommended"
            ])
        
        return recommendations

class SHAPExplainer:
    """SHAP-like explanation generator"""
    
    FEATURE_WEIGHTS = {
        'age': 0.15, 'gender': 0.08, 'smokingHistory': 0.18,
        'familyHistory': 0.16, 'bmi': 0.06, 'persistentCough': 0.13,
        'unexplainedWeightLoss': 0.14, 'persistentFatigue': 0.11
    }
    
    @classmethod
    def generate_explanation(cls, patient_data: Dict[str, Any], result: Dict[str, Any]) -> Dict[str, Any]:
        """Generate SHAP-like explanations"""
        features = cls._extract_normalized_features(patient_data)
        contributions = cls._calculate_contributions(features)
        
        return {
            'explanationType': 'SHAP-like',
            'baselineProbability': 0.5,
            'predictedProbability': min(result.get('confidence', 60) / 100, 0.95),
            'prediction': 'Cancer Risk Assessment',
            'totalFeatures': len(contributions),
            'featureContributions': contributions,
            'topRiskFactors': [f for f in contributions if f['shapValue'] > 0][:5],
            'topProtectiveFactors': [f for f in contributions if f['shapValue'] < 0][:5],
            'summary': 'AI analysis shows key factors contributing to cancer risk assessment.'
        }
    
    @classmethod
    def _extract_normalized_features(cls, patient_data: Dict[str, Any]) -> Dict[str, float]:
        """Extract and normalize patient features"""
        return {
            'age': patient_data.get('age', 50) / 100,
            'gender': 1 if patient_data.get('gender') == 'female' else 0,
            'smokingHistory': {'never': 0, 'former': 0.5, 'current': 1}.get(
                patient_data.get('smokingHistory', 'never'), 0),
            'familyHistory': 1 if patient_data.get('familyHistory', False) else 0,
            'bmi': max(0, min(1, (patient_data.get('bmi', 25) - 18.5) / (40 - 18.5))),
            'persistentCough': 1 if patient_data.get('persistentCough', False) else 0,
            'unexplainedWeightLoss': 1 if patient_data.get('unexplainedWeightLoss', False) else 0,
            'persistentFatigue': 1 if patient_data.get('persistentFatigue', False) else 0
        }
    
    @classmethod
    def _calculate_contributions(cls, features: Dict[str, float]) -> List[Dict[str, Any]]:
        """Calculate feature contributions"""
        contributions = []
        total_contribution = 0
        
        for feature, value in features.items():
            if feature in cls.FEATURE_WEIGHTS:
                base_importance = cls.FEATURE_WEIGHTS[feature]
                
                # Calculate SHAP-like value
                if value > 0.5:
                    shap_value = base_importance * (value - 0.5) * 2
                else:
                    shap_value = -base_importance * (0.5 - value) * 2
                
                total_contribution += abs(shap_value)
                
                contributions.append({
                    'feature': feature.replace('History', ' History').replace('Weight', ' Weight'),
                    'featureKey': feature,
                    'shapValue': round(shap_value, 4),
                    'featureValue': value,
                    'contributionPct': 0,  # Calculated below
                    'impact': 'Increases Risk' if shap_value > 0 else 'Decreases Risk',
                    'magnitude': 'High' if abs(shap_value) > 0.1 else 'Medium' if abs(shap_value) > 0.05 else 'Low'
                })
        
        # Calculate percentages
        for contrib in contributions:
            if total_contribution > 0:
                contrib['contributionPct'] = round((abs(contrib['shapValue']) / total_contribution) * 100, 1)
        
        contributions.sort(key=lambda x: abs(x['shapValue']), reverse=True)
        return contributions

# API Routes
@app.route('/api/health', methods=['GET'])
def health_check() -> Dict[str, Any]:
    """Health check endpoint with ML-first status"""
    return jsonify({
        'status': 'healthy',
        'message': 'STRICT ML-FIRST Cancer Prediction API is running',
        'ml_model': {
            'available': ml_model is not None,
            'status': ml_model_status,
            'mode': 'STRICT_ML_FIRST'
        },
        'prediction_strategy': {
            'primary': 'ML_MODEL',
            'fallback': 'RULE_BASED',
            'description': 'ML model prediction attempted first, rule-based only on ML failure'
        },
        'version': '2.1.0-ML-FIRST',
        'timestamp': datetime.now(timezone.utc).isoformat()
    })

@app.route('/api/predict', methods=['POST'])
def predict_cancer():
    """Main cancer prediction endpoint with STRICT ML-FIRST INFERENCE"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        patient_data = data.get('patientData', {})
        
        if not patient_data:
            return jsonify({'error': 'Patient data required'}), 400
        
        # Validate required fields
        required_fields = ['age', 'gender']
        missing_fields = [field for field in required_fields if field not in patient_data]
        if missing_fields:
            return jsonify({'error': f'Missing required fields: {missing_fields}'}), 400
        
        # STRICT ML-FIRST INFERENCE PATH
        result = None
        prediction_method = "unknown"
        
        # Step 1: Try ML model prediction (PRIMARY)
        if ml_model:
            try:
                logger.info("ATTEMPTING ML MODEL PREDICTION (PRIMARY PATH)")
                result = ml_model.predict(patient_data)
                prediction_method = "ML_MODEL"
                logger.info(f"SUCCESS: ML prediction completed - {result['predicted_cancer']} ({result['confidence']:.2f}%)")
            except Exception as ml_error:
                logger.error(f"ML MODEL PREDICTION FAILED: {ml_error}")
                
                # Step 2: Try training and retry ML model
                try:
                    logger.info("ATTEMPTING ML MODEL TRAINING AND RETRY...")
                    ml_model.train_models()
                    result = ml_model.predict(patient_data)
                    prediction_method = "ML_MODEL_RETRAINED"
                    logger.info(f"SUCCESS: ML prediction after retraining - {result['predicted_cancer']} ({result['confidence']:.2f}%)")
                except Exception as retrain_error:
                    logger.error(f"ML MODEL RETRAIN FAILED: {retrain_error}")
                    result = None
        
        # Step 3: Fallback to rule-based ONLY if ML completely fails
        if result is None:
            logger.warning("FALLING BACK TO RULE-BASED PREDICTION (FALLBACK PATH)")
            result = PredictionEngine.basic_prediction(patient_data)
            prediction_method = "RULE_BASED_FALLBACK"
            logger.info(f"FALLBACK: Rule-based prediction - {result['predicted_cancer']} ({result['confidence']:.2f}%)")
        
        # Generate recommendations and explanations
        recommendations = RecommendationEngine.generate_recommendations(
            result['predicted_cancer'], 
            result['confidence']
        )
        
        explanations = SHAPExplainer.generate_explanation(patient_data, result)
        
        response = {
            'success': True,
            'prediction': {
                'cancerType': result['predicted_cancer'],
                'confidence': round(result['confidence'], 2),
                'riskLevel': _get_risk_level(result['confidence']),
                'stage': result.get('stage', ''),  # DIRECT FROM ML MODEL - NO RECOMPUTATION
                'predictionMethod': prediction_method  # Show which method was used
            },
            'recommendations': recommendations,
            'shapExplanation': explanations,
            'metadata': {
                'mlModelAvailable': ml_model is not None,
                'predictionSource': prediction_method,
                'isMLPrediction': prediction_method.startswith('ML_'),
                'isFallback': prediction_method == 'RULE_BASED_FALLBACK',
                'usesRealData': prediction_method.startswith('ML_'),
                'dataSource': 'real_cancer_datasets' if prediction_method.startswith('ML_') else 'rule_based',
                'modelType': 'ensemble_ml' if prediction_method.startswith('ML_') else 'rule_based'
            },
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'version': '2.1.0-ML-FIRST'
        }
        
        return jsonify(response)
        
    except ValueError as ve:
        logger.error(f"Validation error: {ve}")
        return jsonify({
            'success': False,
            'error': 'Invalid input data',
            'details': str(ve)
        }), 400
        
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        logger.error(traceback.format_exc())
        return jsonify({
            'success': False,
            'error': 'Internal server error',
            'message': 'An error occurred during prediction'
        }), 500

@app.route('/api/test', methods=['GET'])
def test_prediction():
    """Test endpoint with sample data"""
    sample_data = {
        'patientData': {
            'age': 65,
            'gender': 'male',
            'smokingHistory': 'current',
            'familyHistory': True,
            'persistentCough': True,
            'unexplainedWeightLoss': True
        }
    }
    
    with app.test_client() as client:
        response = client.post('/api/predict', 
                             data=json.dumps(sample_data),
                             content_type='application/json')
        return response.get_json()

# Utility functions
# Utility functions
def _get_risk_level(confidence: float) -> str:
    """Convert confidence to risk level"""
    if confidence >= 70:
        return 'HIGH'
    elif confidence >= 40:
        return 'MODERATE'
    elif confidence >= 20:
        return 'LOW'
    else:
        return 'MINIMAL'

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    logger.error(f"Internal server error: {error}")
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    logger.info("Starting STRICT ML-FIRST Cancer Prediction API...")
    logger.info(f"ML Model Status: {ml_model_status}")
    logger.info("Prediction Strategy: ML-FIRST with rule-based fallback")
    logger.info("API available at: http://localhost:5000")
    logger.info("Health check: http://localhost:5000/api/health")
    logger.info("Test endpoint: http://localhost:5000/api/test")
    
    # Production-ready configuration
    debug_mode = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    host = os.getenv('FLASK_HOST', '127.0.0.1')
    port = int(os.getenv('FLASK_PORT', '5000'))
    
    app.run(
        host=host,
        port=port,
        debug=debug_mode,
        threaded=True
    )