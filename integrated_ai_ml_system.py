#!/usr/bin/env python3
"""
Integrated AI-ML Cancer Prediction System
Combines: ML Models + Expert System + Fuzzy Logic + Knowledge Graph + NLP
"""

from pathlib import Path
import json
import numpy as np
import os
import sys


# Add paths for imports
sys.path.append(str(Path(__file__).parent))
sys.path.append(str(Path(__file__).parent / "cancer-aid-navigator-ai-main" / "src" / "ml"))

try:
    from ai_expert_system import MedicalExpertSystem
    from ai_fuzzy_logic import FuzzyLogicSystem
    from ai_knowledge_graph import MedicalKnowledgeGraph
    from ai_nlp_processor import MedicalNLPProcessor
    from cancer_prediction_model import CancerPredictionModel
except ImportError as e:
    print(f"Import warning: {e}")
    print("Some AI components may not be available")

class IntegratedAIMLS:
    def __init__(self):
        print("🚀 Initializing Integrated AI-ML Cancer System...")
        
        # Initialize ML Models
        print("   🤖 Loading ML Models...")
        self.ml_model = CancerPredictionModel()
        
        # Initialize AI Systems
        try:
            print("   🧠 Loading Expert System...")
            self.expert_system = MedicalExpertSystem()
            
            print("   🔮 Loading Fuzzy Logic...")
            self.fuzzy_system = FuzzyLogicSystem()
            
            print("   🕸️ Loading Knowledge Graph...")
            self.knowledge_graph = MedicalKnowledgeGraph()
            
            print("   🔤 Loading NLP Processor...")
            self.nlp_processor = MedicalNLPProcessor()
            
            self.ai_available = True
            print("   ✅ All AI components loaded successfully!")
        except Exception as e:
            import logging
            logging.exception("   ⚠️ AI components error: ")
            print("   ⚠️ AI components not available, using ML only")
            self.ai_available = False
        
        # System weights for fusion
        self.weights = {
            'ml_ensemble': 0.35,
            'expert_system': 0.25,
            'fuzzy_logic': 0.20,
            'knowledge_graph': 0.15,
            'nlp': 0.05
        }
        
        print("✅ Integrated AI-ML System Ready!")
    
    def predict_cancer(self, patient_data, symptom_text=""):
        """Main prediction method combining all AI-ML components"""
        
        print("\n🔍 RUNNING INTEGRATED AI-ML ANALYSIS...")
        print("=" * 50)
        
        results = {}
        
        # 1. ML Ensemble Prediction (Primary)
        print("🤖 Running ML Ensemble...")
        try:
            ml_result = self.ml_model.predict(patient_data)
            results['ml_ensemble'] = ml_result
            print(f"   ✅ ML: {ml_result.get('predicted_cancer', 'Unknown')} ({ml_result.get('confidence', 0):.1f}%)")
        except Exception as e:
            import logging
            logging.exception("   ❌ ML Error: ")
            # Train models if not available
            print("   🔄 Training ML models...")
            self.ml_model.train_models()
            ml_result = self.ml_model.predict(patient_data)
            results['ml_ensemble'] = ml_result
            print(f"   ✅ ML: {ml_result.get('predicted_cancer', 'Unknown')} ({ml_result.get('confidence', 0):.1f}%)")
        
        # 2. AI System Predictions (if available)
        if self.ai_available:
            try:
                # Expert System
                print("🧠 Running Expert System...")
                expert_result = self.expert_system.get_expert_recommendation(patient_data)
                results['expert_system'] = expert_result
                print(f"   ✅ Expert: {expert_result.get('predicted_cancer', 'No risk')} ({expert_result.get('confidence', 0):.1f}%)")
            except Exception as e:
                import logging
                logging.exception("   ❌ Expert System Error: ")
                results['expert_system'] = {'confidence': 0, 'predicted_cancer': 'Error'}
            
            try:
                # Fuzzy Logic
                print("🔮 Running Fuzzy Logic...")
                fuzzy_result = self.fuzzy_system.fuzzy_diagnosis(patient_data)
                results['fuzzy_logic'] = fuzzy_result
                print(f"   ✅ Fuzzy: {fuzzy_result.get('predicted_cancer', 'Uncertain')} ({fuzzy_result.get('confidence', 0):.1f}%)")
            except Exception as e:
                import logging
                logging.exception("   ❌ Fuzzy Logic Error: ")
                results['fuzzy_logic'] = {'confidence': 0, 'predicted_cancer': 'Error'}
            
            try:
                # Knowledge Graph
                print("🕸️ Running Knowledge Graph...")
                kg_result = self.knowledge_graph.knowledge_graph_diagnosis(patient_data)
                results['knowledge_graph'] = kg_result
                print(f"   ✅ KG: {kg_result.get('predicted_cancer', 'No risk')} ({kg_result.get('confidence', 0):.1f}%)")
            except Exception as e:
                import logging
                logging.exception("   ❌ Knowledge Graph Error: ")
                results['knowledge_graph'] = {'confidence': 0, 'predicted_cancer': 'Error'}
            
            try:
                # NLP Analysis
                if symptom_text and len(symptom_text.strip()) > 10:
                    print("🔤 Running NLP Analysis...")
                    nlp_result = self.nlp_processor.analyze_symptom_description(symptom_text)
                    results['nlp'] = nlp_result
                    print(f"   ✅ NLP: {nlp_result.get('predicted_cancer', 'No analysis')} ({nlp_result.get('confidence', 0):.1f}%)")
                else:
                    results['nlp'] = {'confidence': 0, 'predicted_cancer': 'No text provided'}
            except Exception as e:
                import logging
                logging.exception("   ❌ NLP Error: ")
                results['nlp'] = {'confidence': 0, 'predicted_cancer': 'Error'}
        else:
            print("   ⚠️ AI components not available, skipping AI analysis")
        
        # 3. Fusion and Final Decision
        print("🔗 Performing AI-ML Fusion...")
        final_result = self.fuse_predictions(results)
        
        return final_result
    
    def fuse_predictions(self, results):
        """Fuse predictions from all AI-ML components"""
        
        # Collect weighted predictions
        cancer_scores = {}
        total_weight = 0
        
        for system_name, result in results.items():
            if system_name in self.weights and result.get('confidence', 0) > 0:
                predicted_cancer = result.get('predicted_cancer', 'Unknown')
                confidence = result.get('confidence', 0) / 100.0
                weight = self.weights[system_name] * confidence
                
                if predicted_cancer not in cancer_scores:
                    cancer_scores[predicted_cancer] = 0
                
                cancer_scores[predicted_cancer] += weight
                total_weight += weight
        
        # Normalize scores
        if total_weight > 0:
            for cancer in cancer_scores:
                cancer_scores[cancer] /= total_weight
        
        # Get final prediction
        if cancer_scores:
            final_cancer = max(cancer_scores.items(), key=lambda x: x[1])
            cancer_type, final_confidence = final_cancer
            
            # Generate recommendations
            recommendations = self.generate_recommendations(cancer_type, final_confidence, results)
            
            return {
                'final_prediction': cancer_type,
                'confidence': final_confidence * 100,
                'cancer_scores': cancer_scores,
                'individual_results': results,
                'recommendations': recommendations,
                'system_type': 'integrated_ai_ml',
                'components_used': len([r for r in results.values() if r.get('confidence', 0) > 0])
            }
        
        return {
            'final_prediction': 'Insufficient data',
            'confidence': 10.0,
            'system_type': 'integrated_ai_ml'
        }
    
    def generate_recommendations(self, cancer_type, confidence, results):
        """Generate medical recommendations based on prediction"""
        
        recommendations = []
        
        if confidence > 0.7:  # High confidence
            if cancer_type != 'No Cancer':
                recommendations.extend([
                    "🏥 Immediate medical consultation recommended",
                    "🔬 Comprehensive diagnostic tests needed",
                    "📋 Specialist referral advised"
                ])
            else:
                recommendations.extend([
                    "✅ Low cancer risk detected",
                    "🔄 Regular health checkups recommended",
                    "🏃‍♂️ Maintain healthy lifestyle"
                ])
        elif confidence > 0.4:  # Moderate confidence
            recommendations.extend([
                "⚠️ Moderate risk factors present",
                "👨‍⚕️ Consult healthcare provider",
                "📊 Additional screening may be needed"
            ])
        else:  # Low confidence
            recommendations.extend([
                "📋 Inconclusive results",
                "🔄 More comprehensive evaluation needed",
                "👨‍⚕️ Professional medical assessment recommended"
            ])
        
        # Add specific recommendations based on cancer type
        if cancer_type == 'Lung Cancer':
            recommendations.append("🚭 Smoking cessation strongly advised")
        elif cancer_type == 'Breast Cancer':
            recommendations.append("🔍 Mammography screening recommended")
        elif cancer_type == 'Prostate Cancer':
            recommendations.append("🔬 PSA testing and digital exam advised")
        
        return recommendations
    
    def get_system_status(self):
        """Get status of all system components"""
        
        status = {
            'ml_models': 'Available' if hasattr(self.ml_model, 'models') else 'Training needed',
            'expert_system': 'Available' if self.ai_available else 'Not available',
            'fuzzy_logic': 'Available' if self.ai_available else 'Not available',
            'knowledge_graph': 'Available' if self.ai_available else 'Not available',
            'nlp_processor': 'Available' if self.ai_available else 'Not available'
        }
        
        return status
    
    def run_demo(self):
        """Run comprehensive demo"""
        
        print("🎯 INTEGRATED AI-ML CANCER PREDICTION DEMO")
        print("=" * 60)
        
        # Test patient data
        test_patient = {
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
        
        # Test symptom description
        symptom_text = """
        I have been experiencing a persistent dry cough for about 4 months now. 
        The cough is getting worse and sometimes I cough up blood. I've lost 
        about 20 pounds without trying and feel extremely tired all the time. 
        I also have chest pain that gets worse when I take deep breaths. 
        I'm worried because I've been smoking for 45 years.
        """
        
        # Run prediction
        result = self.predict_cancer(test_patient, symptom_text)
        
        # Display results
        print("\n🎯 FINAL INTEGRATED RESULTS:")
        print("=" * 40)
        print(f"Final Prediction: {result['final_prediction']}")
        print(f"Confidence: {result['confidence']:.1f}%")
        print(f"Components Used: {result['components_used']}")
        print(f"System Type: {result['system_type']}")
        
        print(f"\n🤖 Cancer Probability Scores:")
        for cancer, score in result.get('cancer_scores', {}).items():
            print(f"   • {cancer}: {score*100:.1f}%")
        
        print(f"\n💡 Medical Recommendations:")
        for rec in result.get('recommendations', []):
            print(f"   {rec}")
        
        # System status
        print(f"\n🔧 System Status:")
        status = self.get_system_status()
        for component, state in status.items():
            print(f"   • {component}: {state}")
        
        return result

if __name__ == "__main__":
    # Initialize and run integrated system
    system = IntegratedAIMLS()
    system.run_demo()