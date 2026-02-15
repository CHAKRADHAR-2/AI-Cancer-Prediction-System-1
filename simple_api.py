#!/usr/bin/env python3
"""
Simple API Server for ML Cancer Prediction
Works with the integrated ML system
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from pathlib import Path
import json
import sys
import traceback


# Add ML path
ml_path = Path(__file__).parent / "cancer-aid-navigator-ai-main" / "src" / "ml"
sys.path.append(str(ml_path))

app = Flask(__name__)
CORS(app)

# Initialize ML system
print("Initializing ML Cancer Prediction System...")
try:
    from cancer_prediction_model import CancerPredictionModel
    ml_model = CancerPredictionModel()
    print("SUCCESS: ML Model loaded")
except Exception as e:
    import logging
    logging.exception("ERROR: ")
    ml_model = None

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'ML Cancer Prediction API is running',
        'ml_model': 'available' if ml_model else 'not available'
    })

@app.route('/api/predict', methods=['POST'])
def predict_cancer():
    """Cancer prediction endpoint"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        patient_data = data.get('patientData', {})
        
        if not patient_data:
            return jsonify({'error': 'Patient data required'}), 400
        
        # Use ML model if available, otherwise basic logic
        if ml_model:
            try:
                result = ml_model.predict(patient_data)
            except:
                # Train model if needed
                print("Training ML model...")
                ml_model.train_models()
                result = ml_model.predict(patient_data)
        else:
            # Basic prediction logic
            result = basic_prediction(patient_data)
        
        # Generate recommendations
        recommendations = generate_recommendations(
            result['predicted_cancer'], 
            result['confidence']
        )
        
        # Generate SHAP-like explanations
        explanations = generate_shap_explanations(patient_data, result)
        
        response = {
            'success': True,
            'prediction': {
                'cancerType': result['predicted_cancer'],
                'confidence': round(result['confidence'], 2),
                'riskLevel': get_risk_level(result['confidence'])
            },
            'recommendations': recommendations,
            'shapExplanation': explanations,
            'timestamp': get_timestamp()
        }
        
        return jsonify(response)
        
    except Exception as e:
        import logging
        logging.exception("Prediction error: ")
        print(traceback.format_exc())
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def basic_prediction(patient_data):
    """Basic prediction if ML model not available"""
    risk_score = 0
    
    age = patient_data.get('age', 50)
    if age > 60: risk_score += 0.3
    
    if patient_data.get('smokingHistory') == 'current':
        risk_score += 0.4
    
    if patient_data.get('familyHistory', False):
        risk_score += 0.2
    
    if patient_data.get('persistentCough', False):
        risk_score += 0.3
    
    if patient_data.get('unexplainedWeightLoss', False):
        risk_score += 0.2
    
    # Determine cancer type
    if risk_score > 0.7:
        if patient_data.get('persistentCough', False):
            cancer_type = 'Lung Cancer'
        elif patient_data.get('gender') == 'female':
            cancer_type = 'Breast Cancer'
        else:
            cancer_type = 'General Cancer Risk'
    elif risk_score > 0.4:
        cancer_type = 'Moderate Risk'
    else:
        cancer_type = 'No Cancer'
    
    confidence = min(risk_score * 100, 95.0)
    
    return {
        'predicted_cancer': cancer_type,
        'confidence': confidence
    }

def generate_recommendations(cancer_type, confidence):
    """Generate medical recommendations"""
    recommendations = []
    
    if confidence > 70:
        if cancer_type != 'No Cancer':
            recommendations.extend([
                "Immediate medical consultation recommended",
                "Comprehensive diagnostic tests needed",
                "Specialist referral advised"
            ])
        else:
            recommendations.extend([
                "Low cancer risk detected",
                "Regular health checkups recommended"
            ])
    elif confidence > 40:
        recommendations.extend([
            "Moderate risk factors present",
            "Consult healthcare provider",
            "Additional screening may be needed"
        ])
    else:
        recommendations.extend([
            "Inconclusive results",
            "Professional medical assessment recommended"
        ])
    
    return recommendations

def get_risk_level(confidence):
    """Convert confidence to risk level"""
    if confidence >= 70:
        return 'HIGH'
    elif confidence >= 40:
        return 'MODERATE'
    elif confidence >= 20:
        return 'LOW'
    else:
        return 'MINIMAL'

def generate_shap_explanations(patient_data, result):
    """Generate SHAP-like explanations for the prediction"""
    
    # Feature importance weights (simulating SHAP values)
    feature_weights = {
        'age': 0.15, 'gender': 0.08, 'smokingHistory': 0.18,
        'familyHistory': 0.16, 'bmi': 0.06, 'persistentCough': 0.13,
        'unexplainedWeightLoss': 0.14, 'persistentFatigue': 0.11
    }
    
    # Extract and normalize features
    features = _extract_normalized_features(patient_data)
    
    # Calculate SHAP-like values
    feature_contributions = _calculate_feature_contributions(features, feature_weights)
    
    # Get top factors
    top_risk_factors = [f for f in feature_contributions if f['shapValue'] > 0][:5]
    top_protective_factors = [f for f in feature_contributions if f['shapValue'] < 0][:5]
    
    return {
        'explanationType': 'SHAP-like',
        'baselineProbability': 0.5,
        'predictedProbability': min(result.get('confidence', 60) / 100, 0.95),
        'prediction': 'Cancer Risk Assessment',
        'totalFeatures': len(feature_contributions),
        'featureContributions': feature_contributions,
        'topRiskFactors': top_risk_factors,
        'topProtectiveFactors': top_protective_factors,
        'summary': 'AI analysis shows the key factors contributing to your cancer risk assessment.'
    }

def _extract_normalized_features(patient_data) -> dict:
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

def _calculate_feature_contributions(features, feature_weights):
    """Calculate SHAP-like feature contributions"""
    feature_contributions = []
    total_contribution = 0
    
    for feature, value in features.items():
        if feature in feature_weights:
            base_importance = feature_weights[feature]
            
            # Calculate contribution based on deviation from neutral (0.5)
            if value > 0.5:
                shap_value = base_importance * (value - 0.5) * 2
            else:
                shap_value = -base_importance * (0.5 - value) * 2
            
            total_contribution += abs(shap_value)
            
            feature_contributions.append({
                'feature': feature.replace('History', ' History').replace('Weight', ' Weight'),
                'featureKey': feature,
                'shapValue': round(shap_value, 4),
                'featureValue': value,
                'contributionPct': 0,  # Will be calculated below
                'impact': 'Increases Risk' if shap_value > 0 else 'Decreases Risk',
                'magnitude': 'High' if abs(shap_value) > 0.1 else 'Medium' if abs(shap_value) > 0.05 else 'Low'
            })
    
    # Calculate contribution percentages
    for contrib in feature_contributions:
        if total_contribution > 0:
            contrib['contributionPct'] = round((abs(contrib['shapValue']) / total_contribution) * 100, 1)
    
    # Sort by absolute contribution
    feature_contributions.sort(key=lambda x: abs(x['shapValue']), reverse=True)
    
    return feature_contributions

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
    
    # Call predict endpoint internally
    with app.test_client() as client:
        response = client.post('/api/predict', 
                             data=json.dumps(sample_data),
                             content_type='application/json')
        return response.get_json()

def get_timestamp():
    """Get current timestamp with timezone awareness"""
    from datetime import datetime, timezone
    return datetime.now(timezone.utc).isoformat()

if __name__ == '__main__':
    print("Starting ML Cancer Prediction API...")
    print("API available at: http://localhost:5000")
    print("Health check: http://localhost:5000/api/health")
    print("Test endpoint: http://localhost:5000/api/test")
    
    import os
    debug_mode = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    host = os.getenv('FLASK_HOST', '127.0.0.1')
    
    app.run(
        host=host,
        port=5000,
        debug=debug_mode
    )t('/api/predict', 
                             data=json.dumps(sample_data),
                             content_type='application/json')
        return response.get_json()

def get_timestamp():
    """Get current timestamp"""
    from datetime import datetime
    return datetime.now().isoformat()

if __name__ == '__main__':
    print("Starting ML Cancer Prediction API...")
    print("API available at: http://localhost:5000")
    print("Health check: http://localhost:5000/api/health")
    print("Test endpoint: http://localhost:5000/api/test")
    
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True
    )t('/api/predict', 
                             data=json.dumps(sample_data),
                             content_type='application/json')
        return response.get_json()

def get_timestamp():
    """Get current timestamp"""
    from datetime import datetime
    return datetime.now().isoformat()

if __name__ == '__main__':
    print("Starting ML Cancer Prediction API...")
    print("API available at: http://localhost:5000")
    print("Health check: http://localhost:5000/api/health")
    print("Test endpoint: http://localhost:5000/api/test")
    
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True
    )/api/predict', 
                             data=json.dumps(sample_data),
                             content_type='application/json')
        return response.get_json()

if __name__ == '__main__':
    print("Starting ML Cancer Prediction API...")
    print("API available at: http://localhost:5000")
    print("Health check: http://localhost:5000/api/health")
    print("Test endpoint: http://localhost:5000/api/test")
    
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True
    )