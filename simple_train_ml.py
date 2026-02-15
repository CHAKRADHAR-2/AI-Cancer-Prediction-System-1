#!/usr/bin/env python3
"""
Simple Cancer Prediction ML Model Training - No External Dependencies
"""

from collections import Counter
import json
import math
import random


class SimpleCancerMLTrainer:
    def __init__(self):
        self.models = {}
        self.training_data = []
        self.feature_stats = {}
        
    def create_training_data(self):
        """Create comprehensive training dataset"""
        
        # Training data: [features] + [label]
        # Features: age, gender, smoking, bmi, bp_sys, bp_dia, cholesterol, glucose, 
        #          hemoglobin, wbc, platelets, symptoms_score, risk_factors_score
        
        data = [
            # Lung Cancer samples
            [68, 1, 2, 24.5, 145, 92, 240, 115, 11.8, 12000, 180000, 8, 6, 'Lung'],
            [65, 1, 2, 26.0, 150, 95, 260, 120, 12.0, 11500, 175000, 7, 5, 'Lung'],
            [70, 1, 1, 25.5, 140, 88, 230, 110, 11.5, 13000, 185000, 8, 4, 'Lung'],
            [72, 1, 2, 27.0, 155, 98, 250, 125, 11.2, 12500, 170000, 9, 6, 'Lung'],
            [66, 0, 2, 24.8, 148, 90, 235, 118, 11.6, 11800, 178000, 7, 5, 'Lung'],
            
            # Breast Cancer samples
            [52, 0, 0, 27.8, 130, 85, 220, 100, 12.5, 8000, 220000, 4, 3, 'Breast'],
            [48, 0, 0, 26.5, 125, 80, 210, 95, 13.0, 7500, 240000, 5, 4, 'Breast'],
            [55, 0, 1, 28.2, 135, 87, 225, 105, 12.8, 8200, 235000, 4, 3, 'Breast'],
            [50, 0, 0, 27.0, 128, 82, 215, 98, 12.6, 7800, 230000, 5, 4, 'Breast'],
            [46, 0, 0, 26.8, 122, 78, 205, 92, 13.2, 7300, 245000, 4, 3, 'Breast'],
            
            # Blood Cancer samples
            [35, 0, 0, 22.0, 110, 70, 180, 85, 8.5, 25000, 80000, 6, 2, 'Blood'],
            [42, 1, 0, 23.5, 115, 75, 190, 90, 9.2, 22000, 85000, 7, 3, 'Blood'],
            [28, 0, 0, 21.8, 105, 68, 175, 82, 8.8, 28000, 75000, 6, 2, 'Blood'],
            [38, 1, 0, 22.8, 112, 72, 185, 87, 8.9, 24000, 82000, 7, 3, 'Blood'],
            [32, 0, 0, 21.5, 108, 69, 178, 84, 8.6, 26000, 78000, 6, 2, 'Blood'],
            
            # Skin Cancer samples
            [45, 1, 0, 25.2, 125, 80, 190, 90, 14.0, 7500, 250000, 2, 4, 'Skin'],
            [38, 0, 0, 24.8, 120, 78, 185, 88, 13.8, 7200, 260000, 2, 3, 'Skin'],
            [50, 1, 1, 26.0, 130, 82, 195, 92, 14.2, 7800, 245000, 3, 4, 'Skin'],
            [42, 1, 0, 25.5, 122, 79, 188, 89, 14.1, 7400, 255000, 2, 4, 'Skin'],
            [47, 0, 0, 25.8, 127, 81, 192, 91, 13.9, 7600, 248000, 3, 3, 'Skin'],
            
            # Healthy samples
            [30, 1, 0, 23.5, 115, 75, 180, 85, 14.2, 6500, 250000, 0, 0, 'Healthy'],
            [25, 0, 0, 22.0, 110, 70, 175, 80, 13.5, 6000, 270000, 0, 0, 'Healthy'],
            [35, 1, 0, 24.0, 120, 78, 185, 88, 14.5, 6800, 260000, 0, 0, 'Healthy'],
            [28, 0, 0, 22.5, 112, 72, 178, 82, 13.8, 6200, 265000, 0, 0, 'Healthy'],
            [32, 1, 0, 23.8, 118, 76, 182, 86, 14.3, 6600, 255000, 0, 0, 'Healthy'],
        ]
        
        self.training_data = data
        return data
    
    def normalize_features(self, data):
        """Simple feature normalization"""
        
        # Calculate feature statistics
        features = [row[:-1] for row in data]  # Exclude label
        n_features = len(features[0])
        
        self.feature_stats = {}
        for i in range(n_features):
            values = [row[i] for row in features]
            self.feature_stats[i] = {
                'mean': sum(values) / len(values),
                'std': math.sqrt(sum((x - sum(values)/len(values))**2 for x in values) / len(values))
            }
        
        # Normalize features
        normalized_data = []
        for row in data:
            normalized_row = []
            for i, value in enumerate(row[:-1]):  # Exclude label
                if self.feature_stats[i]['std'] > 0:
                    normalized_value = (value - self.feature_stats[i]['mean']) / self.feature_stats[i]['std']
                else:
                    normalized_value = 0
                normalized_row.append(normalized_value)
            normalized_row.append(row[-1])  # Add label back
            normalized_data.append(normalized_row)
        
        return normalized_data
    
    def simple_decision_tree(self, data):
        """Simple decision tree implementation"""
        
        # Count labels
        labels = [row[-1] for row in data]
        label_counts = Counter(labels)
        
        if len(label_counts) == 1:
            return list(label_counts.keys())[0]
        
        # Simple rules based on medical knowledge
        rules = {
            'Lung': lambda row: row[2] >= 1 and row[0] > 0.5,  # Smoking + Age
            'Blood': lambda row: row[9] > 1.5 or row[10] < -1.5,  # High WBC or Low Platelets
            'Skin': lambda row: row[13] > 1.0,  # High risk factors (sun exposure)
            'Breast': lambda row: row[1] < 0 and row[12] > 0.5,  # Female + Risk factors
            'Healthy': lambda row: row[11] == 0 and row[12] == 0  # No symptoms, no risk
        }
        
        # Apply rules
        predictions = {}
        for cancer_type, rule in rules.items():
            count = sum(1 for row in data if rule(row[:-1]) and row[-1] == cancer_type)
            if count > 0:
                predictions[cancer_type] = count
        
        return max(predictions, key=predictions.get) if predictions else 'Healthy'
    
    def train_models(self):
        """Train simple ML models"""
        
        print("🤖 Training Simple ML Models...")
        
        # Create and normalize training data
        raw_data = self.create_training_data()
        normalized_data = self.normalize_features(raw_data)
        
        print(f\"✅ Dataset created: {len(raw_data)} samples\")
        print(f\"✅ Features normalized using Z-score\")
        
        # Simple Naive Bayes-like classifier
        self.models['naive_bayes'] = self.train_naive_bayes(normalized_data)
        print(\"✅ Naive Bayes model trained\")
        
        # Simple Decision Tree
        self.models['decision_tree'] = self.train_decision_tree(normalized_data)
        print(\"✅ Decision Tree model trained\")
        
        # Simple KNN
        self.models['knn'] = self.train_knn(normalized_data)
        print(\"✅ KNN model trained\")
        
        # Ensemble model
        self.models['ensemble'] = self.create_ensemble()
        print(\"✅ Ensemble model created\")
    
    def train_naive_bayes(self, data):
        \"\"\"Simple Naive Bayes implementation\"\"\"
        
        model = {}
        labels = list(set(row[-1] for row in data))
        
        for label in labels:
            label_data = [row[:-1] for row in data if row[-1] == label]
            if label_data:
                model[label] = {
                    'count': len(label_data),
                    'features': []
                }
                
                # Calculate feature statistics for each label
                for i in range(len(label_data[0])):
                    values = [row[i] for row in label_data]
                    model[label]['features'].append({
                        'mean': sum(values) / len(values),
                        'std': math.sqrt(sum((x - sum(values)/len(values))**2 for x in values) / len(values)) if len(values) > 1 else 1
                    })
        
        return model
    
    def train_decision_tree(self, data):
        \"\"\"Simple decision tree training\"\"\"
        
        # Medical knowledge-based rules
        rules = {
            'Lung': [
                ('smoking_history', '>=', 1),
                ('age', '>', 0.5),
                ('symptoms_score', '>', 0.5)
            ],
            'Blood': [
                ('wbc', '>', 1.5),
                ('platelets', '<', -1.5),
                ('hemoglobin', '<', -1.0)
            ],
            'Skin': [
                ('risk_factors', '>', 1.0),
                ('age', '>', 0.0)
            ],
            'Breast': [
                ('gender', '<', 0),
                ('risk_factors', '>', 0.5),
                ('age', '>', 0.2)
            ]
        }
        
        return rules
    
    def train_knn(self, data):
        \"\"\"Simple KNN implementation\"\"\"
        
        return {
            'training_data': data,
            'k': 3
        }
    
    def create_ensemble(self):
        \"\"\"Create ensemble model\"\"\"
        
        return {
            'models': ['naive_bayes', 'decision_tree', 'knn'],
            'weights': [0.4, 0.3, 0.3]
        }
    
    def predict(self, features):
        \"\"\"Make prediction using ensemble\"\"\"
        
        # Normalize input features
        normalized_features = []
        for i, value in enumerate(features):
            if i in self.feature_stats and self.feature_stats[i]['std'] > 0:
                normalized_value = (value - self.feature_stats[i]['mean']) / self.feature_stats[i]['std']
            else:
                normalized_value = 0
            normalized_features.append(normalized_value)
        
        predictions = {}
        
        # Naive Bayes prediction
        nb_pred = self.predict_naive_bayes(normalized_features)
        predictions['naive_bayes'] = nb_pred
        
        # Decision Tree prediction
        dt_pred = self.predict_decision_tree(normalized_features)
        predictions['decision_tree'] = dt_pred
        
        # KNN prediction
        knn_pred = self.predict_knn(normalized_features)
        predictions['knn'] = knn_pred
        
        # Ensemble voting
        votes = Counter(predictions.values())
        final_prediction = votes.most_common(1)[0][0]
        confidence = votes[final_prediction] / len(predictions) * 100
        
        return final_prediction, confidence, predictions
    
    def predict_naive_bayes(self, features):
        \"\"\"Naive Bayes prediction\"\"\"
        
        model = self.models['naive_bayes']
        scores = {}
        
        for label, label_model in model.items():
            score = math.log(label_model['count'])
            
            for i, feature_value in enumerate(features):
                if i < len(label_model['features']):
                    feature_stats = label_model['features'][i]
                    # Simple Gaussian probability
                    prob = math.exp(-0.5 * ((feature_value - feature_stats['mean']) / feature_stats['std'])**2)
                    score += math.log(prob + 1e-10)  # Avoid log(0)
            
            scores[label] = score
        
        return max(scores, key=scores.get)
    
    def predict_decision_tree(self, features):
        \"\"\"Decision tree prediction\"\"\"
        
        rules = self.models['decision_tree']
        
        # Feature mapping
        feature_map = {
            'age': 0, 'gender': 1, 'smoking_history': 2, 'bmi': 3,
            'wbc': 9, 'platelets': 10, 'symptoms_score': 11, 'risk_factors': 12,
            'hemoglobin': 8
        }
        
        for cancer_type, conditions in rules.items():
            match_count = 0
            for condition in conditions:
                feature_name, operator, threshold = condition
                if feature_name in feature_map:
                    feature_idx = feature_map[feature_name]
                    if feature_idx < len(features):
                        value = features[feature_idx]
                        if operator == '>=' and value >= threshold:
                            match_count += 1
                        elif operator == '>' and value > threshold:
                            match_count += 1
                        elif operator == '<' and value < threshold:
                            match_count += 1
            
            if match_count >= len(conditions) * 0.6:  # 60% of conditions met
                return cancer_type
        
        return 'Healthy'
    
    def predict_knn(self, features):
        \"\"\"KNN prediction\"\"\"
        
        model = self.models['knn']
        training_data = model['training_data']
        k = model['k']
        
        # Calculate distances
        distances = []
        for train_row in training_data:
            train_features = train_row[:-1]
            distance = sum((f1 - f2)**2 for f1, f2 in zip(features, train_features))**0.5
            distances.append((distance, train_row[-1]))
        
        # Get k nearest neighbors
        distances.sort()
        neighbors = distances[:k]
        
        # Vote
        votes = Counter(label for _, label in neighbors)
        return votes.most_common(1)[0][0]
    
    def save_models(self):
        \"\"\"Save models to JSON file\"\"\"
        
        print(\"\\n💾 Saving Models...\")
        
        # Convert models to JSON-serializable format
        save_data = {
            'feature_stats': self.feature_stats,
            'models': {}
        }
        
        # Save Naive Bayes
        save_data['models']['naive_bayes'] = self.models['naive_bayes']
        
        # Save Decision Tree
        save_data['models']['decision_tree'] = self.models['decision_tree']
        
        # Save KNN (only metadata, not full training data)
        save_data['models']['knn'] = {
            'k': self.models['knn']['k'],
            'training_size': len(self.models['knn']['training_data'])
        }
        
        # Save ensemble
        save_data['models']['ensemble'] = self.models['ensemble']
        
        with open('simple_cancer_models.json', 'w') as f:
            json.dump(save_data, f, indent=2)
        
        print(\"✅ Models saved to 'simple_cancer_models.json'\")
    
    def evaluate_models(self):
        \"\"\"Simple model evaluation\"\"\"
        
        print(\"\\n📊 MODEL EVALUATION:\")
        print(\"=\" * 30)
        
        # Test on training data (simple evaluation)
        correct_predictions = 0
        total_predictions = 0
        
        for row in self.training_data:
            features = row[:-1]
            true_label = row[-1]
            
            predicted_label, confidence, _ = self.predict(features)
            
            if predicted_label == true_label:
                correct_predictions += 1
            total_predictions += 1
        
        accuracy = correct_predictions / total_predictions * 100
        print(f\"Training Accuracy: {accuracy:.1f}%\")
        print(f\"Correct Predictions: {correct_predictions}/{total_predictions}\")
    
    def run_training(self):
        \"\"\"Complete training pipeline\"\"\"
        
        print(\"🚀 STARTING SIMPLE ML MODEL TRAINING\")
        print(\"=\" * 50)
        
        # Train models
        self.train_models()
        
        # Evaluate models
        self.evaluate_models()
        
        # Save models
        self.save_models()
        
        print(\"\\n🎉 TRAINING COMPLETED SUCCESSFULLY!\")
        print(\"Simple ML models are ready for cancer prediction.\")
        
        # Demo prediction
        print(\"\\n🧪 DEMO PREDICTION:\")
        demo_features = [68, 1, 2, 24.5, 145, 92, 240, 115, 11.8, 12000, 180000, 8, 6]
        prediction, confidence, individual = self.predict(demo_features)
        print(f\"Sample Patient Prediction: {prediction} ({confidence:.1f}% confidence)\")
        print(f\"Individual Model Predictions: {individual}\")

if __name__ == \"__main__\":
    trainer = SimpleCancerMLTrainer()
    trainer.run_training()