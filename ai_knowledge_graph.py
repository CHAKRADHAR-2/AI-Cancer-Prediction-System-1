#!/usr/bin/env python3
"""
Medical Knowledge Graph AI - Represents medical concepts and their relationships
"""

class MedicalKnowledgeGraph:
    def __init__(self):
        self.nodes = {}
        self.relationships = []
        self.build_medical_ontology()
    
    def add_node(self, node_id, node_type, properties):
        """Add a node to the knowledge graph"""
        self.nodes[node_id] = {
            'type': node_type,
            'properties': properties
        }
    
    def add_relationship(self, from_node, to_node, relationship_type, weight=1.0):
        """Add a relationship between two nodes"""
        self.relationships.append({
            'from': from_node,
            'to': to_node,
            'type': relationship_type,
            'weight': weight
        })
    
    def build_medical_ontology(self):
        """Build comprehensive medical knowledge graph"""
        
        # Cancer Types
        self.add_node('lung_cancer', 'cancer', {
            'name': 'Lung Cancer',
            'mortality_rate': 0.85,
            'common_age': '60-80',
            'gender_bias': 'male_higher'
        })
        
        self.add_node('breast_cancer', 'cancer', {
            'name': 'Breast Cancer',
            'mortality_rate': 0.22,
            'common_age': '40-70',
            'gender_bias': 'female_primary'
        })
        
        self.add_node('prostate_cancer', 'cancer', {
            'name': 'Prostate Cancer',
            'mortality_rate': 0.19,
            'common_age': '65-85',
            'gender_bias': 'male_only'
        })
        
        self.add_node('skin_cancer', 'cancer', {
            'name': 'Skin Cancer',
            'mortality_rate': 0.15,
            'common_age': '40-80',
            'gender_bias': 'equal'
        })
        
        self.add_node('blood_cancer', 'cancer', {
            'name': 'Blood Cancer',
            'mortality_rate': 0.65,
            'common_age': '20-70',
            'gender_bias': 'male_slight'
        })
        
        # Risk Factors
        self.add_node('smoking', 'risk_factor', {
            'name': 'Smoking',
            'severity': 'high',
            'modifiable': True
        })
        
        self.add_node('age', 'risk_factor', {
            'name': 'Advanced Age',
            'severity': 'high',
            'modifiable': False
        })
        
        self.add_node('family_history', 'risk_factor', {
            'name': 'Family History',
            'severity': 'moderate',
            'modifiable': False
        })
        
        self.add_node('sun_exposure', 'risk_factor', {
            'name': 'Sun Exposure',
            'severity': 'moderate',
            'modifiable': True
        })
        
        self.add_node('alcohol', 'risk_factor', {
            'name': 'Alcohol Consumption',
            'severity': 'moderate',
            'modifiable': True
        })
        
        # Symptoms
        self.add_node('persistent_cough', 'symptom', {
            'name': 'Persistent Cough',
            'urgency': 'high',
            'specificity': 'moderate'
        })
        
        self.add_node('weight_loss', 'symptom', {
            'name': 'Unexplained Weight Loss',
            'urgency': 'high',
            'specificity': 'low'
        })
        
        self.add_node('fatigue', 'symptom', {
            'name': 'Persistent Fatigue',
            'urgency': 'moderate',
            'specificity': 'low'
        })
        
        self.add_node('unusual_bleeding', 'symptom', {
            'name': 'Unusual Bleeding',
            'urgency': 'high',
            'specificity': 'moderate'
        })
        
        self.add_node('skin_changes', 'symptom', {
            'name': 'Skin Changes',
            'urgency': 'moderate',
            'specificity': 'high'
        })
        
        # Body Systems
        self.add_node('respiratory_system', 'body_system', {
            'name': 'Respiratory System',
            'organs': ['lungs', 'bronchi', 'trachea']
        })
        
        self.add_node('reproductive_system', 'body_system', {
            'name': 'Reproductive System',
            'organs': ['breast', 'prostate', 'ovaries']
        })
        
        # Build Relationships
        self.build_relationships()
    
    def build_relationships(self):
        """Define relationships between medical concepts"""
        
        # Cancer-Risk Factor Relationships
        self.add_relationship('smoking', 'lung_cancer', 'INCREASES_RISK', 0.9)
        self.add_relationship('smoking', 'blood_cancer', 'INCREASES_RISK', 0.3)
        self.add_relationship('age', 'lung_cancer', 'INCREASES_RISK', 0.8)
        self.add_relationship('age', 'breast_cancer', 'INCREASES_RISK', 0.7)
        self.add_relationship('age', 'prostate_cancer', 'INCREASES_RISK', 0.9)
        self.add_relationship('family_history', 'breast_cancer', 'INCREASES_RISK', 0.8)
        self.add_relationship('family_history', 'prostate_cancer', 'INCREASES_RISK', 0.6)
        self.add_relationship('sun_exposure', 'skin_cancer', 'INCREASES_RISK', 0.9)
        self.add_relationship('alcohol', 'liver_cancer', 'INCREASES_RISK', 0.7)
        
        # Cancer-Symptom Relationships
        self.add_relationship('lung_cancer', 'persistent_cough', 'CAUSES', 0.8)
        self.add_relationship('lung_cancer', 'weight_loss', 'CAUSES', 0.6)
        self.add_relationship('breast_cancer', 'breast_lump', 'CAUSES', 0.9)
        self.add_relationship('skin_cancer', 'skin_changes', 'CAUSES', 0.9)
        self.add_relationship('blood_cancer', 'unusual_bleeding', 'CAUSES', 0.7)
        self.add_relationship('blood_cancer', 'fatigue', 'CAUSES', 0.8)
        
        # System-Cancer Relationships
        self.add_relationship('respiratory_system', 'lung_cancer', 'AFFECTED_BY', 1.0)
        self.add_relationship('reproductive_system', 'breast_cancer', 'AFFECTED_BY', 1.0)
        self.add_relationship('reproductive_system', 'prostate_cancer', 'AFFECTED_BY', 1.0)
        
        # Symptom-System Relationships
        self.add_relationship('persistent_cough', 'respiratory_system', 'INDICATES_PROBLEM', 0.8)
        self.add_relationship('unusual_bleeding', 'reproductive_system', 'INDICATES_PROBLEM', 0.6)
    
    def find_related_nodes(self, node_id, relationship_type=None, max_depth=2):
        """Find nodes related to a given node"""
        
        related_nodes = []
        visited = set()
        queue = [(node_id, 0)]
        
        while queue:
            current_node, depth = queue.pop(0)
            
            if current_node in visited or depth > max_depth:
                continue
            
            visited.add(current_node)
            
            # Find direct relationships
            for rel in self.relationships:
                if rel['from'] == current_node:
                    if relationship_type is None or rel['type'] == relationship_type:
                        related_nodes.append({
                            'node': rel['to'],
                            'relationship': rel['type'],
                            'weight': rel['weight'],
                            'depth': depth + 1
                        })
                        
                        if depth + 1 <= max_depth:
                            queue.append((rel['to'], depth + 1))
                
                elif rel['to'] == current_node:
                    if relationship_type is None or rel['type'] == relationship_type:
                        related_nodes.append({
                            'node': rel['from'],
                            'relationship': rel['type'],
                            'weight': rel['weight'],
                            'depth': depth + 1
                        })
                        
                        if depth + 1 <= max_depth:
                            queue.append((rel['from'], depth + 1))
        
        return related_nodes
    
    def calculate_cancer_probability(self, patient_data):
        """Calculate cancer probability using knowledge graph reasoning"""
        
        cancer_scores = {}
        
        # Initialize cancer scores
        for node_id, node in self.nodes.items():
            if node['type'] == 'cancer':
                cancer_scores[node_id] = 0.0
        
        # Analyze risk factors
        risk_factors = {
            'smoking_history': 'smoking',
            'family_history': 'family_history',
            'sun_exposure': 'sun_exposure',
            'alcohol_consumption': 'alcohol'
        }
        
        for patient_factor, graph_factor in risk_factors.items():
            if patient_data.get(patient_factor, 0) > 0:
                # Find cancers related to this risk factor
                related_cancers = self.find_related_nodes(graph_factor, 'INCREASES_RISK', 1)
                
                for relation in related_cancers:
                    cancer_node = relation['node']
                    weight = relation['weight']
                    
                    if cancer_node in cancer_scores:
                        # Weight by patient factor intensity
                        factor_intensity = patient_data[patient_factor]
                        if isinstance(factor_intensity, bool):
                            factor_intensity = 1.0 if factor_intensity else 0.0
                        elif isinstance(factor_intensity, str):
                            factor_intensity = 0.5  # Default for string values
                        
                        cancer_scores[cancer_node] += weight * factor_intensity * 0.3
        
        # Analyze symptoms
        symptoms = {
            'persistent_cough': 'persistent_cough',
            'weight_loss': 'weight_loss',
            'fatigue': 'fatigue',
            'unusual_bleeding': 'unusual_bleeding',
            'skin_changes': 'skin_changes'
        }
        
        for patient_symptom, graph_symptom in symptoms.items():
            if patient_data.get(patient_symptom, False):
                # Find cancers that cause this symptom
                for rel in self.relationships:
                    if rel['to'] == graph_symptom and rel['type'] == 'CAUSES':
                        cancer_node = rel['from']
                        weight = rel['weight']
                        
                        if cancer_node in cancer_scores:
                            cancer_scores[cancer_node] += weight * 0.4
        
        # Age factor
        if 'age' in patient_data:
            age = patient_data['age']
            age_factor = min(age / 80.0, 1.0)  # Normalize age
            
            for cancer in cancer_scores:
                cancer_scores[cancer] += age_factor * 0.2
        
        # Gender-specific adjustments
        if 'gender' in patient_data:
            gender = patient_data['gender']
            
            if gender == 0:  # Female
                cancer_scores['breast_cancer'] = cancer_scores.get('breast_cancer', 0) + 0.1
                cancer_scores['prostate_cancer'] = 0  # Remove prostate for females
            elif gender == 1:  # Male
                cancer_scores['prostate_cancer'] = cancer_scores.get('prostate_cancer', 0) + 0.1
        
        return cancer_scores
    
    def knowledge_graph_diagnosis(self, patient_data):
        """Perform diagnosis using knowledge graph reasoning"""
        
        # Convert patient data to expected format
        converted_data = self._convert_patient_data(patient_data)
        cancer_scores = self.calculate_cancer_probability(converted_data)
        
        if not cancer_scores or max(cancer_scores.values()) == 0:
            return {
                'predicted_cancer': 'No Cancer',
                'confidence': 20.0,
                'reasoning': 'Knowledge graph found no strong cancer indicators',
                'ai_type': 'knowledge_graph'
            }
        
        # Get top cancer prediction
        top_cancer = max(cancer_scores.items(), key=lambda x: x[1])
        cancer_type, score = top_cancer
        
        # Get cancer information
        cancer_info = self.nodes.get(cancer_type, {})
        cancer_name = cancer_info.get('properties', {}).get('name', cancer_type.replace('_', ' ').title())
        
        # Generate reasoning
        reasoning = self.generate_reasoning(converted_data, cancer_type)
        
        return {
            'predicted_cancer': cancer_name,
            'confidence': min(score * 100, 95.0),
            'cancer_scores': cancer_scores,
            'reasoning': reasoning,
            'cancer_info': cancer_info,
            'ai_type': 'knowledge_graph'
        }
    
    def _convert_patient_data(self, patient_data):
        """Convert frontend patient data to knowledge graph format"""
        converted = {}
        
        # Basic demographics
        converted['age'] = patient_data.get('age', 50)
        converted['gender'] = 0 if patient_data.get('gender') == 'female' else 1
        
        # Risk factors
        smoking_map = {'never': 0, 'former': 1, 'current': 2}
        converted['smoking_history'] = smoking_map.get(patient_data.get('smokingHistory', 'never'), 0)
        converted['family_history'] = patient_data.get('familyHistory', False)
        
        # Sun exposure
        sun_map = {'minimal': 0, 'moderate': 1, 'high': 2}
        converted['sun_exposure'] = sun_map.get(patient_data.get('sunExposure', 'moderate'), 1)
        
        # Alcohol consumption
        alcohol_map = {'never': 0, 'occasional': 1, 'moderate': 2, 'heavy': 3}
        converted['alcohol_consumption'] = alcohol_map.get(patient_data.get('alcoholConsumption', 'never'), 0)
        
        # Symptoms
        converted['persistent_cough'] = patient_data.get('persistentCough', False)
        converted['weight_loss'] = patient_data.get('unexplainedWeightLoss', False)
        converted['fatigue'] = patient_data.get('persistentFatigue', False)
        converted['unusual_bleeding'] = patient_data.get('unusualBleeding', False)
        converted['skin_changes'] = patient_data.get('skinChanges', False)
        
        return converted
    
    def generate_reasoning(self, patient_data, predicted_cancer):
        """Generate human-readable reasoning for the prediction"""
        
        reasoning = []
        
        # Check risk factors
        if patient_data.get('smoking_history', 0) > 0 and predicted_cancer == 'lung_cancer':
            reasoning.append("Smoking history strongly associated with lung cancer")
        
        if patient_data.get('family_history', False) and predicted_cancer in ['breast_cancer', 'prostate_cancer']:
            reasoning.append("Family history increases genetic predisposition")
        
        if patient_data.get('age', 0) > 60:
            reasoning.append("Advanced age is a significant risk factor")
        
        # Check symptoms
        if patient_data.get('persistent_cough', False) and predicted_cancer == 'lung_cancer':
            reasoning.append("Persistent cough is a key lung cancer symptom")
        
        if patient_data.get('skin_changes', False) and predicted_cancer == 'skin_cancer':
            reasoning.append("Skin changes are primary indicators of skin cancer")
        
        if not reasoning:
            reasoning.append("Knowledge graph analysis based on medical relationships")
        
        return reasoning

# Example usage and testing
if __name__ == "__main__":
    kg = MedicalKnowledgeGraph()
    
    # Test case: Patient with lung cancer indicators
    test_patient = {
        'age': 65,
        'gender': 1,  # Male
        'smoking_history': 2,  # Current smoker
        'persistent_cough': True,
        'weight_loss': True,
        'family_history': False
    }
    
    print("🕸️ KNOWLEDGE GRAPH AI DIAGNOSIS")
    print("=" * 40)
    result = kg.knowledge_graph_diagnosis(test_patient)
    print(f"Diagnosis: {result['predicted_cancer']}")
    print(f"Confidence: {result['confidence']:.1f}%")
    print(f"Reasoning: {result['reasoning']}")
    print(f"AI Type: {result['ai_type']}")
    
    # Show related concepts
    print(f"\nRelated medical concepts:")
    related = kg.find_related_nodes('lung_cancer', max_depth=1)
    for rel in related[:5]:
        node_name = kg.nodes.get(rel['node'], {}).get('properties', {}).get('name', rel['node'])
        print(f"  • {node_name} ({rel['relationship']}, weight: {rel['weight']})")