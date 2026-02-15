#!/usr/bin/env python3
"""
Medical Expert System AI - Rule-based reasoning for cancer diagnosis
"""

class MedicalExpertSystem:
    def __init__(self):
        self.knowledge_base = {
            'lung_cancer': {
                'rules': [
                    {'condition': 'smoking_history', 'operator': '>=', 'value': 1, 'weight': 0.4},
                    {'condition': 'age', 'operator': '>', 'value': 60, 'weight': 0.3},
                    {'condition': 'persistent_cough', 'operator': '==', 'value': True, 'weight': 0.3},
                    {'condition': 'weight_loss', 'operator': '==', 'value': True, 'weight': 0.2},
                    {'condition': 'chest_pain', 'operator': '==', 'value': True, 'weight': 0.25}
                ],
                'threshold': 0.5
            },
            'breast_cancer': {
                'rules': [
                    {'condition': 'gender', 'operator': '==', 'value': 0, 'weight': 0.5},  # Female
                    {'condition': 'family_history', 'operator': '==', 'value': True, 'weight': 0.4},
                    {'condition': 'age', 'operator': '>', 'value': 40, 'weight': 0.2},
                    {'condition': 'breast_lump', 'operator': '==', 'value': True, 'weight': 0.4}
                ],
                'threshold': 0.7
            },
            'prostate_cancer': {
                'rules': [
                    {'condition': 'gender', 'operator': '==', 'value': 1, 'weight': 1.0},  # Male
                    {'condition': 'age', 'operator': '>', 'value': 50, 'weight': 0.4},
                    {'condition': 'family_history', 'operator': '==', 'value': True, 'weight': 0.3},
                    {'condition': 'urinary_problems', 'operator': '==', 'value': True, 'weight': 0.3}
                ],
                'threshold': 0.8
            },
            'skin_cancer': {
                'rules': [
                    {'condition': 'sun_exposure', 'operator': '==', 'value': 'high', 'weight': 0.4},
                    {'condition': 'skin_changes', 'operator': '==', 'value': True, 'weight': 0.5},
                    {'condition': 'mole_changes', 'operator': '==', 'value': True, 'weight': 0.4},
                    {'condition': 'fair_skin', 'operator': '==', 'value': True, 'weight': 0.2}
                ],
                'threshold': 0.6
            },
            'blood_cancer': {
                'rules': [
                    {'condition': 'wbc_count', 'operator': '>', 'value': 15000, 'weight': 0.4},
                    {'condition': 'platelet_count', 'operator': '<', 'value': 150000, 'weight': 0.3},
                    {'condition': 'unusual_bleeding', 'operator': '==', 'value': True, 'weight': 0.3},
                    {'condition': 'persistent_fatigue', 'operator': '==', 'value': True, 'weight': 0.2},
                    {'condition': 'frequent_infections', 'operator': '==', 'value': True, 'weight': 0.2}
                ],
                'threshold': 0.5
            }
        }
    
    def evaluate_rules(self, patient_data, cancer_type):
        """Evaluate expert system rules for a specific cancer type"""
        
        if cancer_type not in self.knowledge_base:
            return 0.0
        
        rules = self.knowledge_base[cancer_type]['rules']
        total_score = 0.0
        applicable_weight = 0.0
        
        for rule in rules:
            condition = rule['condition']
            operator = rule['operator']
            value = rule['value']
            weight = rule['weight']
            
            if condition in patient_data:
                patient_value = patient_data[condition]
                
                # Apply rule logic
                rule_satisfied = False
                if operator == '==':
                    rule_satisfied = patient_value == value
                elif operator == '>':
                    rule_satisfied = patient_value > value
                elif operator == '<':
                    rule_satisfied = patient_value < value
                elif operator == '>=':
                    rule_satisfied = patient_value >= value
                elif operator == '<=':
                    rule_satisfied = patient_value <= value
                
                applicable_weight += weight
                if rule_satisfied:
                    total_score += weight
        
        # Calculate confidence score
        if applicable_weight > 0:
            confidence = total_score / applicable_weight
        else:
            confidence = 0.0
        
        return confidence
    
    def diagnose(self, patient_data):
        """Expert system diagnosis using rule-based reasoning"""
        
        diagnoses = {}
        
        for cancer_type in self.knowledge_base.keys():
            confidence = self.evaluate_rules(patient_data, cancer_type)
            threshold = self.knowledge_base[cancer_type]['threshold']
            
            if confidence >= threshold:
                diagnoses[cancer_type] = {
                    'confidence': confidence,
                    'recommendation': 'HIGH_RISK',
                    'reasoning': self.get_reasoning(patient_data, cancer_type)
                }
            elif confidence >= threshold * 0.7:
                diagnoses[cancer_type] = {
                    'confidence': confidence,
                    'recommendation': 'MODERATE_RISK',
                    'reasoning': self.get_reasoning(patient_data, cancer_type)
                }
        
        return diagnoses
    
    def get_reasoning(self, patient_data, cancer_type):
        """Generate human-readable reasoning for diagnosis"""
        
        rules = self.knowledge_base[cancer_type]['rules']
        satisfied_rules = []
        
        for rule in rules:
            condition = rule['condition']
            operator = rule['operator']
            value = rule['value']
            
            if condition in patient_data:
                patient_value = patient_data[condition]
                
                # Check if rule is satisfied
                rule_satisfied = False
                if operator == '==' and patient_value == value:
                    rule_satisfied = True
                elif operator == '>' and patient_value > value:
                    rule_satisfied = True
                elif operator == '<' and patient_value < value:
                    rule_satisfied = True
                elif operator == '>=' and patient_value >= value:
                    rule_satisfied = True
                elif operator == '<=' and patient_value <= value:
                    rule_satisfied = True
                
                if rule_satisfied:
                    satisfied_rules.append(f"{condition} {operator} {value}")
        
        return satisfied_rules
    
    def add_rule(self, cancer_type, condition, operator, value, weight):
        """Add new rule to knowledge base"""
        
        if cancer_type not in self.knowledge_base:
            self.knowledge_base[cancer_type] = {'rules': [], 'threshold': 0.6}
        
        new_rule = {
            'condition': condition,
            'operator': operator,
            'value': value,
            'weight': weight
        }
        
        self.knowledge_base[cancer_type]['rules'].append(new_rule)
    
    def get_expert_recommendation(self, patient_data):
        """Get comprehensive expert system recommendation"""
        
        # Convert patient data to expected format
        converted_data = self._convert_patient_data(patient_data)
        diagnoses = self.diagnose(converted_data)
        
        if not diagnoses:
            return {
                'predicted_cancer': 'No Cancer',
                'confidence': 15.0,
                'reasoning': 'No significant risk factors detected by expert system',
                'ai_type': 'expert_system'
            }
        
        # Get highest confidence diagnosis
        top_diagnosis = max(diagnoses.items(), key=lambda x: x[1]['confidence'])
        cancer_type, diagnosis_info = top_diagnosis
        
        # Convert cancer type to readable format
        cancer_name = cancer_type.replace('_', ' ').title()
        
        return {
            'predicted_cancer': cancer_name,
            'confidence': diagnosis_info['confidence'] * 100,
            'reasoning': diagnosis_info['reasoning'],
            'all_diagnoses': diagnoses,
            'ai_type': 'expert_system'
        }
    
    def _convert_patient_data(self, patient_data):
        """Convert frontend patient data to expert system format"""
        converted = {}
        
        # Basic demographics
        converted['age'] = patient_data.get('age', 50)
        converted['gender'] = 0 if patient_data.get('gender') == 'female' else 1
        
        # Risk factors
        smoking_map = {'never': 0, 'former': 1, 'current': 2}
        converted['smoking_history'] = smoking_map.get(patient_data.get('smokingHistory', 'never'), 0)
        converted['family_history'] = patient_data.get('familyHistory', False)
        
        # Symptoms
        converted['persistent_cough'] = patient_data.get('persistentCough', False)
        converted['weight_loss'] = patient_data.get('unexplainedWeightLoss', False)
        converted['chest_pain'] = patient_data.get('chestPain', False)
        converted['unusual_bleeding'] = patient_data.get('unusualBleeding', False)
        converted['skin_changes'] = patient_data.get('skinChanges', False)
        converted['persistent_fatigue'] = patient_data.get('persistentFatigue', False)
        
        # Lab values
        converted['wbc_count'] = patient_data.get('whiteBloodCells', 7000)
        converted['platelet_count'] = patient_data.get('platelets', 250000)
        
        # Additional mappings
        converted['breast_lump'] = patient_data.get('breastLump', False)
        converted['urinary_problems'] = patient_data.get('urinaryProblems', False)
        converted['mole_changes'] = patient_data.get('moleChanges', False)
        converted['fair_skin'] = patient_data.get('fairSkin', False)
        converted['frequent_infections'] = patient_data.get('frequentInfections', False)
        
        # Sun exposure
        sun_map = {'minimal': 'low', 'moderate': 'moderate', 'high': 'high'}
        converted['sun_exposure'] = sun_map.get(patient_data.get('sunExposure', 'moderate'), 'moderate')
        
        return converted

# Example usage and testing
if __name__ == "__main__":
    expert_system = MedicalExpertSystem()
    
    # Test case 1: High-risk lung cancer patient
    test_patient_1 = {
        'smoking_history': 2,  # Current smoker
        'age': 65,
        'persistent_cough': True,
        'weight_loss': True,
        'chest_pain': False,
        'gender': 1  # Male
    }
    
    print("🧠 EXPERT SYSTEM AI DIAGNOSIS")
    print("=" * 40)
    result = expert_system.get_expert_recommendation(test_patient_1)
    print(f"Diagnosis: {result['predicted_cancer']}")
    print(f"Confidence: {result['confidence']:.1f}%")
    print(f"Recommendation: {result['recommendation']}")
    print(f"Reasoning: {result['reasoning']}")
    print(f"AI Type: {result['ai_type']}")