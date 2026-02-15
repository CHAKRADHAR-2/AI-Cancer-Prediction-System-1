#!/usr/bin/env python3
"""
Fuzzy Logic AI System - Handle uncertainty in medical symptoms and diagnosis
"""

import math


class FuzzyLogicSystem:
    def __init__(self):
        self.fuzzy_sets = {
            'age': {
                'young': {'low': 0, 'high': 40, 'peak': 25},
                'middle': {'low': 30, 'high': 70, 'peak': 50},
                'old': {'low': 60, 'high': 100, 'peak': 75}
            },
            'risk_level': {
                'low': {'low': 0, 'high': 0.4, 'peak': 0.2},
                'moderate': {'low': 0.2, 'high': 0.8, 'peak': 0.5},
                'high': {'low': 0.6, 'high': 1.0, 'peak': 0.8}
            },
            'symptom_severity': {
                'mild': {'low': 0, 'high': 0.4, 'peak': 0.2},
                'moderate': {'low': 0.2, 'high': 0.8, 'peak': 0.5},
                'severe': {'low': 0.6, 'high': 1.0, 'peak': 0.8}
            },
            'cancer_probability': {
                'very_low': {'low': 0, 'high': 0.2, 'peak': 0.1},
                'low': {'low': 0.1, 'high': 0.4, 'peak': 0.25},
                'moderate': {'low': 0.3, 'high': 0.7, 'peak': 0.5},
                'high': {'low': 0.6, 'high': 0.9, 'peak': 0.75},
                'very_high': {'low': 0.8, 'high': 1.0, 'peak': 0.9}
            }
        }
        
        self.fuzzy_rules = [
            # Lung Cancer Rules
            {'if': [('age', 'old'), ('smoking', 'high'), ('cough', 'severe')], 
             'then': ('lung_cancer', 'very_high')},
            {'if': [('age', 'middle'), ('smoking', 'moderate'), ('cough', 'moderate')], 
             'then': ('lung_cancer', 'moderate')},
            
            # Breast Cancer Rules
            {'if': [('age', 'middle'), ('gender', 'female'), ('family_history', 'high')], 
             'then': ('breast_cancer', 'high')},
            {'if': [('age', 'old'), ('gender', 'female'), ('breast_symptoms', 'severe')], 
             'then': ('breast_cancer', 'very_high')},
            
            # General Cancer Rules
            {'if': [('age', 'old'), ('symptoms', 'severe'), ('risk_factors', 'high')], 
             'then': ('general_cancer', 'high')},
            {'if': [('age', 'young'), ('symptoms', 'mild'), ('risk_factors', 'low')], 
             'then': ('no_cancer', 'very_low')}
        ]
    
    def triangular_membership(self, x, fuzzy_set):
        """Calculate triangular membership function"""
        
        low = fuzzy_set['low']
        high = fuzzy_set['high']
        peak = fuzzy_set['peak']
        
        if x <= low or x >= high:
            return 0.0
        elif x == peak:
            return 1.0
        elif x < peak:
            return (x - low) / (peak - low)
        else:
            return (high - x) / (high - peak)
    
    def fuzzify(self, variable, value):
        """Convert crisp value to fuzzy membership degrees"""
        
        if variable not in self.fuzzy_sets:
            return {}
        
        memberships = {}
        for fuzzy_term, fuzzy_set in self.fuzzy_sets[variable].items():
            membership = self.triangular_membership(value, fuzzy_set)
            if membership > 0:
                memberships[fuzzy_term] = membership
        
        return memberships
    
    def evaluate_fuzzy_rule(self, rule, patient_fuzzy_data):
        """Evaluate a single fuzzy rule"""
        
        # Calculate antecedent (IF part) using minimum operation
        antecedent_strength = 1.0
        
        for variable, fuzzy_term in rule['if']:
            if variable in patient_fuzzy_data and fuzzy_term in patient_fuzzy_data[variable]:
                membership = patient_fuzzy_data[variable][fuzzy_term]
                antecedent_strength = min(antecedent_strength, membership)
            else:
                antecedent_strength = 0.0
                break
        
        # Apply to consequent (THEN part)
        cancer_type, probability_level = rule['then']
        
        return {
            'cancer_type': cancer_type,
            'probability_level': probability_level,
            'strength': antecedent_strength
        }
    
    def fuzzy_inference(self, patient_data):
        """Perform fuzzy inference using all rules"""
        
        # Step 1: Fuzzification
        patient_fuzzy_data = {}
        
        # Fuzzify age
        if 'age' in patient_data:
            patient_fuzzy_data['age'] = self.fuzzify('age', patient_data['age'])
        
        # Fuzzify symptoms (convert boolean to severity score)
        symptom_score = 0
        symptoms = ['persistent_cough', 'weight_loss', 'fatigue', 'unusual_bleeding', 
                   'skin_changes', 'digestive_issues']
        
        for symptom in symptoms:
            if patient_data.get(symptom, False):
                symptom_score += 1
        
        symptom_severity = symptom_score / len(symptoms)
        patient_fuzzy_data['symptoms'] = self.fuzzify('symptom_severity', symptom_severity)
        
        # Fuzzify risk factors
        risk_score = 0
        risk_factors = ['smoking_history', 'family_history', 'alcohol_consumption', 
                       'sun_exposure', 'radiation_exposure']
        
        for factor in risk_factors:
            if patient_data.get(factor, 0) > 0:
                risk_score += 1
        
        risk_level = risk_score / len(risk_factors)
        patient_fuzzy_data['risk_factors'] = self.fuzzify('risk_level', risk_level)
        
        # Add specific fuzzy variables
        if patient_data.get('smoking_history', 0) > 0:
            smoking_level = patient_data['smoking_history'] / 2.0  # Normalize to 0-1
            patient_fuzzy_data['smoking'] = self.fuzzify('risk_level', smoking_level)
        
        if patient_data.get('persistent_cough', False):
            patient_fuzzy_data['cough'] = {'severe': 0.8, 'moderate': 0.6}
        
        if patient_data.get('gender') == 0:  # Female
            patient_fuzzy_data['gender'] = {'female': 1.0}
        
        if patient_data.get('family_history', False):
            patient_fuzzy_data['family_history'] = {'high': 0.9}
        
        # Step 2: Rule Evaluation
        rule_outputs = []
        for rule in self.fuzzy_rules:
            output = self.evaluate_fuzzy_rule(rule, patient_fuzzy_data)
            if output['strength'] > 0:
                rule_outputs.append(output)
        
        # Step 3: Aggregation
        cancer_probabilities = {}
        for output in rule_outputs:
            cancer_type = output['cancer_type']
            prob_level = output['probability_level']
            strength = output['strength']
            
            if cancer_type not in cancer_probabilities:
                cancer_probabilities[cancer_type] = {}
            
            if prob_level not in cancer_probabilities[cancer_type]:
                cancer_probabilities[cancer_type][prob_level] = strength
            else:
                # Use maximum aggregation
                cancer_probabilities[cancer_type][prob_level] = max(
                    cancer_probabilities[cancer_type][prob_level], strength
                )
        
        return cancer_probabilities, patient_fuzzy_data
    
    def defuzzify(self, cancer_probabilities):
        """Convert fuzzy output to crisp values using centroid method"""
        
        results = {}
        
        for cancer_type, prob_levels in cancer_probabilities.items():
            # Calculate weighted average (centroid)
            numerator = 0
            denominator = 0
            
            for prob_level, strength in prob_levels.items():
                if prob_level in self.fuzzy_sets['cancer_probability']:
                    centroid = self.fuzzy_sets['cancer_probability'][prob_level]['peak']
                    numerator += centroid * strength
                    denominator += strength
            
            if denominator > 0:
                crisp_probability = numerator / denominator
                results[cancer_type] = {
                    'probability': crisp_probability,
                    'confidence': denominator,  # Strength of evidence
                    'fuzzy_levels': prob_levels
                }
        
        return results
    
    def fuzzy_diagnosis(self, patient_data):
        """Complete fuzzy logic diagnosis"""
        
        # Convert patient data to expected format
        converted_data = self._convert_patient_data(patient_data)
        
        # Perform fuzzy inference
        cancer_probabilities, fuzzy_data = self.fuzzy_inference(converted_data)
        
        if not cancer_probabilities:
            return {
                'predicted_cancer': 'No Cancer',
                'confidence': 15.0,
                'probability': 0.15,
                'fuzzy_reasoning': 'No fuzzy rules activated',
                'ai_type': 'fuzzy_logic'
            }
        
        # Defuzzify results
        crisp_results = self.defuzzify(cancer_probabilities)
        
        # Get highest probability cancer type
        if crisp_results:
            top_cancer = max(crisp_results.items(), key=lambda x: x[1]['probability'])
            cancer_type, result_info = top_cancer
            
            # Convert cancer type to readable format
            cancer_name = cancer_type.replace('_', ' ').title()
            
            return {
                'predicted_cancer': cancer_name,
                'confidence': result_info['confidence'] * 100,
                'probability': result_info['probability'],
                'fuzzy_levels': result_info['fuzzy_levels'],
                'all_results': crisp_results,
                'fuzzy_data': fuzzy_data,
                'ai_type': 'fuzzy_logic'
            }
        
        return {
            'predicted_cancer': 'Uncertain',
            'confidence': 50.0,
            'probability': 0.5,
            'ai_type': 'fuzzy_logic'
        }
    
    def _convert_patient_data(self, patient_data):
        """Convert frontend patient data to fuzzy system format"""
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
        converted['fatigue'] = patient_data.get('persistentFatigue', False)
        converted['unusual_bleeding'] = patient_data.get('unusualBleeding', False)
        converted['skin_changes'] = patient_data.get('skinChanges', False)
        converted['digestive_issues'] = patient_data.get('digestiveIssues', False)
        
        # Lifestyle factors
        alcohol_map = {'never': 0, 'occasional': 1, 'moderate': 2, 'heavy': 3}
        converted['alcohol_consumption'] = alcohol_map.get(patient_data.get('alcoholConsumption', 'never'), 0)
        
        sun_map = {'minimal': 0, 'moderate': 1, 'high': 2}
        converted['sun_exposure'] = sun_map.get(patient_data.get('sunExposure', 'moderate'), 1)
        
        converted['radiation_exposure'] = patient_data.get('radiationExposure', False)
        
        return converted

# Example usage and testing
if __name__ == "__main__":
    fuzzy_system = FuzzyLogicSystem()
    
    # Test case: Patient with uncertain symptoms
    test_patient = {
        'age': 58,
        'gender': 1,  # Male
        'smoking_history': 1,  # Former smoker
        'persistent_cough': True,
        'weight_loss': True,
        'fatigue': True,
        'family_history': False,
        'unusual_bleeding': False
    }
    
    print("🔮 FUZZY LOGIC AI DIAGNOSIS")
    print("=" * 40)
    result = fuzzy_system.fuzzy_diagnosis(test_patient)
    print(f"Diagnosis: {result['predicted_cancer']}")
    print(f"Confidence: {result['confidence']:.1f}%")
    print(f"Probability: {result['probability']:.3f}")
    print(f"AI Type: {result['ai_type']}")
    
    if 'fuzzy_levels' in result:
        print(f"Fuzzy Levels: {result['fuzzy_levels']}")