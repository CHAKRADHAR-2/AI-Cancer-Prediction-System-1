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
logger.info("Initializing ML Cancer Prediction System...")
ml_model = None

try:
    from cancer_prediction_model import CancerPredictionModel
    ml_model = CancerPredictionModel()
    logger.info("SUCCESS: ML Model loaded")
except ImportError as e:
    logger.warning(f"ML Model not available: {e}")
except Exception as e:
    logger.error(f"ERROR loading ML model: {e}")

class PredictionEngine:
    """Optimized prediction engine with proper error handling"""
    
    @staticmethod
    def basic_prediction(patient_data: Dict[str, Any]) -> Dict[str, Any]:
        """Basic prediction logic with improved confidence calculation"""
        risk_score = 0.0
        
        # Age factor
        age = patient_data.get('age', 50)
        if age > 60:
            risk_score += 0.3
        
        # Smoking factor
        smoking_history = patient_data.get('smokingHistory', 'never')
        if smoking_history == 'current':
            risk_score += 0.4
        elif smoking_history == 'former':
            risk_score += 0.2
        
        # Family history
        if patient_data.get('familyHistory', False):
            risk_score += 0.2
        
        # Symptoms
        if patient_data.get('persistentCough', False):
            risk_score += 0.3
        if patient_data.get('unexplainedWeightLoss', False):
            risk_score += 0.2
        
        # Determine cancer type
        cancer_type = PredictionEngine._determine_cancer_type(patient_data, risk_score)
        
        # Calculate confidence
        if cancer_type == 'No Cancer':
            confidence = min((1 - risk_score) * 100, 95.0)
        else:
            confidence = min(risk_score * 100, 95.0)
        
        confidence = max(confidence, 15.0)  # Minimum confidence
        
        return {
            'predicted_cancer': cancer_type,
            'confidence': confidence
        }
    
    @staticmethod
    def _determine_cancer_type(patient_data: Dict[str, Any], risk_score: float) -> str:
        """Determine cancer type based on patient data and risk score"""
        if risk_score > 0.7:
            if patient_data.get('persistentCough', False):
                return 'Lung Cancer'
            elif patient_data.get('gender') == 'female':
                return 'Breast Cancer'
            else:
                return 'General Cancer Risk'
        elif risk_score > 0.4:
            return 'Moderate Risk'
        else:
            return 'No Cancer'

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
    """Health check endpoint with comprehensive status"""
    return jsonify({
        'status': 'healthy',
        'message': 'Optimized ML Cancer Prediction API is running',
        'ml_model': 'available' if ml_model else 'not available',
        'version': '2.0.0',
        'timestamp': datetime.now(timezone.utc).isoformat()
    })

@app.route('/api/predict', methods=['POST'])
def predict_cancer():
    """Main cancer prediction endpoint with comprehensive error handling"""
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
        
        # Use ML model if available, otherwise basic logic
        if ml_model:
            try:
                result = ml_model.predict(patient_data)
            except Exception as ml_error:
                logger.warning(f"ML model prediction failed: {ml_error}")
                # Train model if needed
                logger.info("Attempting to train ML model...")
                ml_model.train_models()
                result = ml_model.predict(patient_data)
        else:
            result = PredictionEngine.basic_prediction(patient_data)
        
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
                'riskLevel': _get_risk_level(result['confidence'])
            },
            'recommendations': recommendations,
            'shapExplanation': explanations,
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'version': '2.0.0'
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
    logger.info("Starting Optimized ML Cancer Prediction API...")
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