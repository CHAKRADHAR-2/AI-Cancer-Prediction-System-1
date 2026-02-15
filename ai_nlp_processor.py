#!/usr/bin/env python3
"""
Natural Language Processing AI - Process symptom descriptions and medical text
"""

from collections import Counter
import math
import re


class MedicalNLPProcessor:
    def __init__(self):
        self.medical_vocabulary = self.build_medical_vocabulary()
        self.symptom_patterns = self.build_symptom_patterns()
        self.severity_indicators = self.build_severity_indicators()
        self.negation_words = {'no', 'not', 'never', 'without', 'absent', 'negative', 'deny', 'denies'}
        self.temporal_indicators = {
            'chronic': 0.9, 'persistent': 0.8, 'ongoing': 0.7, 'continuous': 0.8,
            'acute': 0.6, 'sudden': 0.5, 'recent': 0.4, 'occasional': 0.3
        }
    
    def build_medical_vocabulary(self) -> dict:
        """Build comprehensive medical vocabulary with weights"""
        return {
            # Cancer-related terms
            'cancer': 1.0, 'tumor': 0.9, 'malignant': 0.95, 'carcinoma': 0.9,
            'oncology': 0.8, 'metastasis': 0.95, 'biopsy': 0.7, 'chemotherapy': 0.8,
            
            # Lung cancer terms
            'lung': 0.8, 'respiratory': 0.7, 'breathing': 0.6, 'chest': 0.6,
            'cough': 0.7, 'sputum': 0.6, 'wheezing': 0.5, 'dyspnea': 0.7,
            
            # Breast cancer terms
            'breast': 0.8, 'mammogram': 0.7, 'lump': 0.8, 'nipple': 0.6,
            'mastectomy': 0.9, 'mammography': 0.7,
            
            # General symptoms
            'pain': 0.6, 'ache': 0.5, 'fatigue': 0.6, 'tired': 0.5,
            'weight': 0.6, 'loss': 0.6, 'bleeding': 0.7, 'blood': 0.6,
            'nausea': 0.5, 'vomiting': 0.6, 'fever': 0.5, 'swelling': 0.6,
            
            # Severity terms
            'severe': 0.9, 'intense': 0.8, 'excruciating': 0.95, 'unbearable': 0.9,
            'mild': 0.3, 'slight': 0.2, 'moderate': 0.5, 'significant': 0.7,
            
            # Temporal terms
            'chronic': 0.8, 'persistent': 0.8, 'continuous': 0.7, 'constant': 0.8,
            'intermittent': 0.5, 'occasional': 0.3, 'frequent': 0.6
        }
    
    def build_symptom_patterns(self) -> dict:
        """Build regex patterns for symptom extraction"""
        return {
            'cough': [
                r'(?:persistent|chronic|dry|wet|productive)\s+cough',
                r'cough(?:ing)?\s+(?:up|blood|sputum)',
                r'(?:have|had|experiencing)\s+(?:a\s+)?cough'
            ],
            'pain': [
                r'(?:chest|abdominal|back|bone)\s+pain',
                r'pain\s+in\s+(?:chest|abdomen|back|bones)',
                r'(?:severe|sharp|dull|aching)\s+pain'
            ],
            'weight_loss': [
                r'(?:unexplained|sudden|rapid)\s+weight\s+loss',
                r'lost\s+(?:\d+\s+)?(?:pounds|kg|weight)',
                r'losing\s+weight\s+(?:rapidly|quickly|unexpectedly)'
            ],
            'fatigue': [
                r'(?:extreme|persistent|chronic)\s+(?:fatigue|tiredness)',
                r'feeling\s+(?:very\s+)?(?:tired|exhausted|weak)',
                r'(?:lack\s+of\s+energy|no\s+energy)'
            ],
            'bleeding': [
                r'(?:unusual|abnormal|excessive)\s+bleeding',
                r'bleeding\s+(?:from|in)\s+(?:\w+)',
                r'(?:blood|bleeding)\s+in\s+(?:urine|stool|sputum)'
            ],
            'skin_changes': [
                r'(?:new|changing|unusual)\s+(?:mole|spot|lesion)',
                r'skin\s+(?:changes|discoloration|growth)',
                r'(?:mole|spot)\s+(?:changing|growing|bleeding)'
            ]
        }
    
    def build_severity_indicators(self) -> dict:
        """Build severity scoring system"""
        return {
            'mild': {'score': 0.2, 'keywords': ['mild', 'slight', 'minor', 'little']},
            'moderate': {'score': 0.5, 'keywords': ['moderate', 'noticeable', 'some', 'fair']},
            'severe': {'score': 0.8, 'keywords': ['severe', 'intense', 'significant', 'major']},
            'extreme': {'score': 0.95, 'keywords': ['extreme', 'excruciating', 'unbearable', 'worst']}
        }
    
    def preprocess_text(self, text):
        """Clean and preprocess medical text"""
        if not text:
            return ""
        
        # Convert to lowercase
        text = text.lower()
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Remove punctuation except periods and commas
        text = re.sub(r'[^\w\s\.,]', '', text)
        
        return text.strip()
    
    def extract_medical_terms(self, text):
        """Extract medical terms from text with confidence scores"""
        text = self.preprocess_text(text)
        words = text.split()
        
        medical_terms = {}
        
        for word in words:
            if word in self.medical_vocabulary:
                confidence = self.medical_vocabulary[word]
                medical_terms[word] = medical_terms.get(word, 0) + confidence
        
        # Look for multi-word medical terms
        for i in range(len(words) - 1):
            bigram = f"{words[i]} {words[i+1]}"
            if bigram in self.medical_vocabulary:
                confidence = self.medical_vocabulary[bigram]
                medical_terms[bigram] = medical_terms.get(bigram, 0) + confidence
        
        return medical_terms
    
    def extract_symptoms(self, text):
        """Extract symptoms from text using pattern matching"""
        text = self.preprocess_text(text)
        extracted_symptoms = {}
        
        for symptom, patterns in self.symptom_patterns.items():
            symptom_score = 0
            matches = []
            
            for pattern in patterns:
                matches.extend(re.findall(pattern, text, re.IGNORECASE))
            
            if matches:
                # Check for negation
                negated = any(neg_word in text for neg_word in self.negation_words)
                
                if not negated:
                    symptom_score = len(matches) * 0.3
                    
                    # Check for severity indicators
                    severity_score = self.extract_severity(text, matches)
                    symptom_score += severity_score
                    
                    # Check for temporal indicators
                    temporal_score = self.extract_temporal_context(text, matches)
                    symptom_score += temporal_score
                    
                    extracted_symptoms[symptom] = {
                        'score': min(symptom_score, 1.0),
                        'matches': matches,
                        'negated': False
                    }
                else:
                    extracted_symptoms[symptom] = {
                        'score': 0.0,
                        'matches': matches,
                        'negated': True
                    }
        
        return extracted_symptoms
    
    def extract_severity(self, text, symptom_matches):
        """Extract severity indicators from text"""
        severity_score = 0.0
        
        for severity_level, info in self.severity_indicators.items():
            for keyword in info['keywords']:
                if keyword in text:
                    # Check if severity word is near symptom mentions
                    for match in symptom_matches:
                        if abs(text.find(keyword) - text.find(match)) < 50:
                            severity_score = max(severity_score, info['score'])
        
        return severity_score * 0.3  # Weight severity contribution
    
    def extract_temporal_context(self, text, symptom_matches):
        """Extract temporal context (chronic, acute, etc.)"""
        temporal_score = 0.0
        
        for temporal_word, weight in self.temporal_indicators.items():
            if temporal_word in text:
                # Check if temporal word is near symptom mentions
                for match in symptom_matches:
                    if abs(text.find(temporal_word) - text.find(match)) < 30:
                        temporal_score = max(temporal_score, weight)
        
        return temporal_score * 0.2  # Weight temporal contribution
    
    def calculate_cancer_risk_from_text(self, text):
        """Calculate cancer risk based on NLP analysis"""
        
        # Extract medical terms and symptoms
        medical_terms = self.extract_medical_terms(text)
        symptoms = self.extract_symptoms(text)
        
        # Calculate base risk from medical terms
        medical_risk = sum(medical_terms.values()) * 0.1
        
        # Calculate symptom risk
        symptom_risk = sum(symptom['score'] for symptom in symptoms.values()) * 0.3
        
        # Check for cancer-specific keywords
        cancer_keywords = ['cancer', 'tumor', 'malignant', 'oncology', 'metastasis']
        cancer_mentions = sum(1 for keyword in cancer_keywords if keyword in text.lower())
        cancer_risk = cancer_mentions * 0.4
        
        # Combine risks
        total_risk = min(medical_risk + symptom_risk + cancer_risk, 1.0)
        
        return {
            'total_risk': total_risk,
            'medical_terms_risk': medical_risk,
            'symptom_risk': symptom_risk,
            'cancer_mentions_risk': cancer_risk,
            'medical_terms': medical_terms,
            'symptoms': symptoms
        }
    
    def analyze_symptom_description(self, text):
        """Comprehensive NLP analysis of symptom description"""
        
        if not text or len(text.strip()) < 10:
            return {
                'predicted_cancer': 'No Cancer',
                'confidence': 10.0,
                'analysis': 'Insufficient text for meaningful analysis',
                'ai_type': 'nlp'
            }
        
        # Perform risk analysis
        risk_analysis = self.calculate_cancer_risk_from_text(text)
        
        # Extract key information
        medical_terms = risk_analysis['medical_terms']
        symptoms = risk_analysis['symptoms']
        total_risk = risk_analysis['total_risk']
        
        # Determine most likely cancer type based on text
        cancer_indicators = {
            'lung_cancer': ['lung', 'cough', 'chest', 'breathing', 'respiratory', 'smoke', 'smoking'],
            'breast_cancer': ['breast', 'lump', 'mammogram', 'nipple'],
            'skin_cancer': ['skin', 'mole', 'spot', 'lesion', 'melanoma', 'sun'],
            'blood_cancer': ['blood', 'bleeding', 'fatigue', 'bruising'],
            'prostate_cancer': ['prostate', 'urinary', 'pelvic']
        }
        
        cancer_scores = {}
        for cancer_type, indicators in cancer_indicators.items():
            score = 0
            for indicator in indicators:
                if indicator in text.lower():
                    score += 0.2
                if indicator in medical_terms:
                    score += medical_terms[indicator] * 0.3
            cancer_scores[cancer_type] = score
        
        # Get top prediction
        if cancer_scores and max(cancer_scores.values()) > 0.1:
            top_cancer = max(cancer_scores.items(), key=lambda x: x[1])
            predicted_cancer, cancer_score = top_cancer
            predicted_cancer = predicted_cancer.replace('_', ' ').title()
        else:
            predicted_cancer = 'No Cancer'
            cancer_score = 0.1
        
        # Generate summary
        summary = self.generate_nlp_summary(text, medical_terms, symptoms, total_risk)
        
        return {
            'predicted_cancer': predicted_cancer,
            'confidence': min(max(cancer_score * 100, 15.0), 90.0),
            'total_risk_score': total_risk,
            'medical_terms_found': list(medical_terms.keys()),
            'symptoms_detected': list(symptoms.keys()),
            'cancer_type_scores': cancer_scores,
            'analysis_summary': summary,
            'ai_type': 'nlp'
        }
    
    def generate_nlp_summary(self, text, medical_terms, symptoms, risk_score):
        """Generate human-readable summary of NLP analysis"""
        
        summary = []
        
        if medical_terms:
            summary.append(f"Detected {len(medical_terms)} medical terms")
        
        if symptoms:
            high_confidence_symptoms = [s for s, info in symptoms.items() if info['score'] > 0.5]
            if high_confidence_symptoms:
                summary.append(f"High-confidence symptoms: {', '.join(high_confidence_symptoms)}")
        
        if risk_score > 0.7:
            summary.append("Text indicates high medical concern")
        elif risk_score > 0.4:
            summary.append("Text indicates moderate medical concern")
        else:
            summary.append("Text indicates low medical concern")
        
        return '; '.join(summary) if summary else "No significant medical indicators found"

# Example usage and testing
if __name__ == "__main__":
    nlp_processor = MedicalNLPProcessor()
    
    # Test case: Patient symptom description
    test_text = """
    I have been experiencing a persistent cough for the past 3 months. 
    The cough is dry and sometimes I cough up blood. I've also noticed 
    unexplained weight loss of about 15 pounds and feel extremely tired 
    all the time. I'm a 65-year-old male and have been smoking for 40 years. 
    There's also some chest pain that gets worse when I breathe deeply.
    """
    
    print("🔤 NLP AI ANALYSIS")
    print("=" * 40)
    result = nlp_processor.analyze_symptom_description(test_text)
    print(f"Predicted Cancer: {result['predicted_cancer']}")
    print(f"Confidence: {result['confidence']:.1f}%")
    print(f"Risk Score: {result['total_risk_score']:.3f}")
    print(f"Medical Terms: {result['medical_terms_found']}")
    print(f"Symptoms: {result['symptoms_detected']}")
    print(f"Summary: {result['analysis_summary']}")
    print(f"AI Type: {result['ai_type']}")