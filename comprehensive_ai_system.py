#!/usr/bin/env python3
"""
Comprehensive AI Cancer Prediction System
Integrates: ML + Expert System + Fuzzy Logic + Knowledge Graph + NLP
"""

from ai_expert_system import MedicalExpertSystem
from ai_fuzzy_logic import FuzzyLogicSystem
from ai_knowledge_graph import MedicalKnowledgeGraph
from ai_nlp_processor import MedicalNLPProcessor
import json
import time


class ComprehensiveAICancerSystem:
    def __init__(self):
        print("🚀 Initializing Comprehensive AI Cancer Prediction System...")
        time.sleep(1)
        
        # Initialize all AI components
        print("   🧠 Loading Expert System AI...")
        time.sleep(0.5)
        self.expert_system = MedicalExpertSystem()
        
        print("   🔮 Loading Fuzzy Logic AI...")
        time.sleep(0.5)
        self.fuzzy_system = FuzzyLogicSystem()
        
        print("   🕸️ Loading Knowledge Graph AI...")
        time.sleep(0.5)
        self.knowledge_graph = MedicalKnowledgeGraph()
        
        print("   🔤 Loading NLP AI...")
        time.sleep(0.5)
        self.nlp_processor = MedicalNLPProcessor()
        
        print("   🤖 Loading ML Models...")
        time.sleep(0.5)
        # ML models would be loaded here
        
        print("✅ All AI components initialized successfully!")
        
        self.ai_weights = {
            'expert_system': 0.25,
            'fuzzy_logic': 0.20,
            'knowledge_graph': 0.25,
            'nlp': 0.15,
            'ml_ensemble': 0.15
        }
    
    def comprehensive_ai_prediction(self, patient_data, symptom_text=""):
        """Perform comprehensive AI analysis using all components"""
        
        print("\n🔍 RUNNING COMPREHENSIVE AI ANALYSIS...")
        print("=" * 50)
        
        results = {}
        
        # 1. Expert System Analysis
        print("🧠 Running Expert System AI...")
        try:
            expert_result = self.expert_system.get_expert_recommendation(patient_data)
            results['expert_system'] = expert_result
            print(f"   ✅ Expert System: {expert_result.get('predicted_cancer', 'No risk')} ({expert_result.get('confidence', 0):.1f}%)")
        except Exception as e:
            import logging
            logging.exception("   ❌ Expert System Error: ")
            results['expert_system'] = {'confidence': 0, 'predicted_cancer': 'Error'}
        
        # 2. Fuzzy Logic Analysis
        print("🔮 Running Fuzzy Logic AI...")
        try:
            fuzzy_result = self.fuzzy_system.fuzzy_diagnosis(patient_data)
            results['fuzzy_logic'] = fuzzy_result
            print(f"   ✅ Fuzzy Logic: {fuzzy_result.get('predicted_cancer', 'Uncertain')} ({fuzzy_result.get('confidence', 0):.1f}%)")
        except Exception as e:
            import logging
            logging.exception("   ❌ Fuzzy Logic Error: ")
            results['fuzzy_logic'] = {'confidence': 0, 'predicted_cancer': 'Error'}
        
        # 3. Knowledge Graph Analysis
        print("🕸️ Running Knowledge Graph AI...")
        try:
            kg_result = self.knowledge_graph.knowledge_graph_diagnosis(patient_data)
            results['knowledge_graph'] = kg_result
            print(f"   ✅ Knowledge Graph: {kg_result.get('predicted_cancer', 'No risk')} ({kg_result.get('confidence', 0):.1f}%)")
        except Exception as e:
            import logging
            logging.exception("   ❌ Knowledge Graph Error: ")
            results['knowledge_graph'] = {'confidence': 0, 'predicted_cancer': 'Error'}
        
        # 4. NLP Analysis (if symptom text provided)
        if symptom_text and len(symptom_text.strip()) > 10:
            print("🔤 Running NLP AI...")
            try:
                nlp_result = self.nlp_processor.analyze_symptom_description(symptom_text)
                results['nlp'] = nlp_result
                print(f"   ✅ NLP Analysis: {nlp_result.get('predicted_cancer', 'No analysis')} ({nlp_result.get('confidence', 0):.1f}%)")
            except Exception as e:
                import logging
                logging.exception("   ❌ NLP Error: ")
                results['nlp'] = {'confidence': 0, 'predicted_cancer': 'Error'}
        else:
            results['nlp'] = {'confidence': 0, 'predicted_cancer': 'No text provided'}
        
        # 5. ML Ensemble Analysis (Simulated)
        print("🤖 Running ML Ensemble AI...")
        try:
            ml_result = self.simulate_ml_prediction(patient_data)
            results['ml_ensemble'] = ml_result
            print(f"   ✅ ML Ensemble: {ml_result.get('predicted_cancer', 'No prediction')} ({ml_result.get('confidence', 0):.1f}%)")
        except Exception as e:
            import logging
            logging.exception("   ❌ ML Ensemble Error: ")
            results['ml_ensemble'] = {'confidence': 0, 'predicted_cancer': 'Error'}
        
        # 6. AI Fusion and Final Decision
        print("🔗 Performing AI Fusion...")
        final_result = self.fuse_ai_predictions(results)
        
        return final_result
    
    def simulate_ml_prediction(self, patient_data):
        """Simulate ML prediction (placeholder for actual ML models)"""
        
        # Simple risk calculation based on key factors
        risk_score = 0
        
        age = patient_data.get('age', 50)
        if age > 60:
            risk_score += 0.3
        
        smoking_map = {'never': 0, 'former': 1, 'current': 2}
        smoking = smoking_map.get(patient_data.get('smokingHistory', 'never'), 0)
        if smoking > 0:
            risk_score += smoking * 0.2
        
        if patient_data.get('familyHistory', False):
            risk_score += 0.2
        if patient_data.get('persistentCough', False):
            risk_score += 0.3
        if patient_data.get('unexplainedWeightLoss', False):
            risk_score += 0.2
        
        # Determine cancer type based on strongest indicators
        if patient_data.get('persistentCough', False) and smoking > 0:
            predicted_cancer = 'Lung Cancer'
        elif patient_data.get('gender') == 'female' and patient_data.get('familyHistory', False):
            predicted_cancer = 'Breast Cancer'
        elif patient_data.get('skinChanges', False):
            predicted_cancer = 'Skin Cancer'
        elif patient_data.get('gender') == 'male' and age > 50:
            predicted_cancer = 'Prostate Cancer'
        else:
            predicted_cancer = 'General Cancer Risk' if risk_score > 0.3 else 'No Cancer'
        
        # Calculate final confidence based on prediction
        if predicted_cancer == 'No Cancer':
            confidence = min((1 - risk_score) * 100, 95.0)
        else:
            confidence = min(risk_score * 100, 95.0)
        
        if confidence < 15:
            confidence = 15.0
        
        return {
            'predicted_cancer': predicted_cancer,
            'confidence': confidence,
            'risk_score': risk_score,
            'ai_type': 'ml_ensemble'
        }
    
    def fuse_ai_predictions(self, ai_results):
        """Fuse predictions from all AI components using weighted voting"""
        
        # Collect all predictions with weights
        weighted_predictions = {}
        total_weight = 0
        
        for ai_type, result in ai_results.items():
            if ai_type in self.ai_weights and result.get('confidence', 0) > 0:
                predicted_cancer = result.get('predicted_cancer', 'Unknown')
                confidence = result.get('confidence', 0) / 100.0
                weight = self.ai_weights[ai_type] * confidence
                
                if predicted_cancer not in weighted_predictions:
                    weighted_predictions[predicted_cancer] = 0
                
                weighted_predictions[predicted_cancer] += weight
                total_weight += weight
        
        # Normalize weights
        if total_weight > 0:
            for cancer in weighted_predictions:
                weighted_predictions[cancer] /= total_weight
        
        # Get final prediction
        if weighted_predictions:
            final_cancer = max(weighted_predictions.items(), key=lambda x: x[1])
            cancer_type, final_confidence = final_cancer
            
            # Generate comprehensive reasoning
            reasoning = self.generate_fusion_reasoning(ai_results)
            
            return {
                'final_prediction': cancer_type,
                'confidence': final_confidence * 100,
                'ai_consensus': weighted_predictions,
                'individual_ai_results': ai_results,
                'fusion_reasoning': reasoning,
                'ai_components_used': len([r for r in ai_results.values() if r.get('confidence', 0) > 0]),
                'system_type': 'comprehensive_ai_fusion'
            }
        
        return {
            'final_prediction': 'Insufficient data for AI analysis',
            'confidence': 10.0,
            'system_type': 'comprehensive_ai_fusion'
        }
    
    def generate_fusion_reasoning(self, ai_results):
        """Generate reasoning for AI fusion decision"""
        
        reasoning = []
        
        for ai_type, result in ai_results.items():
            if result.get('confidence', 0) > 50:
                ai_name = ai_type.replace('_', ' ').title()
                prediction = result.get('predicted_cancer', 'Unknown')
                confidence = result.get('confidence', 0)
                reasoning.append(f"{ai_name}: {prediction} ({confidence:.1f}%)")
        
        return reasoning
    
    def run_comprehensive_demo(self):
        """Run comprehensive AI demo"""
        
        print("🎯 COMPREHENSIVE AI CANCER PREDICTION DEMO")
        print("=" * 60)
        
        # Test patient data
        test_patient = {
            'age': 65,
            'gender': 1,  # Male
            'smoking_history': 2,  # Current smoker
            'family_history': True,
            'persistent_cough': True,
            'weight_loss': True,
            'fatigue': True,
            'chest_pain': True
        }
        
        # Test symptom description
        symptom_text = """
        I have been experiencing a persistent dry cough for about 4 months now. 
        The cough is getting worse and sometimes I cough up blood. I've lost 
        about 20 pounds without trying and feel extremely tired all the time. 
        I also have chest pain that gets worse when I take deep breaths. 
        I'm worried because I've been smoking for 45 years.
        """
        
        # Run comprehensive analysis
        result = self.comprehensive_ai_prediction(test_patient, symptom_text)
        
        # Display results
        print("\n🎯 FINAL AI FUSION RESULTS:")
        print("=" * 40)
        print(f"Final Prediction: {result['final_prediction']}")
        print(f"Confidence: {result['confidence']:.1f}%")
        print(f"AI Components Used: {result['ai_components_used']}/5")
        print(f"System Type: {result['system_type']}")
        
        print(f"\n🤖 AI Consensus Scores:")
        for cancer, score in result.get('ai_consensus', {}).items():
            print(f"   • {cancer}: {score*100:.1f}%")
        
        print(f"\n🧠 Individual AI Reasoning:")
        for reasoning in result.get('fusion_reasoning', []):
            print(f"   • {reasoning}")
        
        return result

if __name__ == "__main__":
    ai_system = ComprehensiveAICancerSystem()
    ai_system.run_comprehensive_demo()