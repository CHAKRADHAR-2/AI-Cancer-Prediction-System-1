
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, roc_curve, precision_recall_curve,
    confusion_matrix, classification_report
)
from sklearn.model_selection import learning_curve, validation_curve
import joblib
import json
from typing import Dict, List, Tuple
import warnings
warnings.filterwarnings('ignore')

class ModelEvaluator:
    """Comprehensive model evaluation and comparison tools"""
    
    def __init__(self):
        self.evaluation_results = {}
        self.figures_dir = "evaluation_figures"
        self._ensure_figures_directory()
    
    def _ensure_figures_directory(self):
        """Create figures directory if it doesn't exist"""
        import os
        if not os.path.exists(self.figures_dir):
            os.makedirs(self.figures_dir)
    
    def evaluate_model_comprehensive(self, model, X_test, y_test, model_name: str) -> Dict:
        """Comprehensive evaluation of a single model"""
        print(f"Evaluating {model_name}...")
        
        # Make predictions
        y_pred = model.predict(X_test)
        y_prob = model.predict_proba(X_test)[:, 1] if hasattr(model, 'predict_proba') else None
        
        # Calculate metrics
        metrics = {
            'accuracy': accuracy_score(y_test, y_pred),
            'precision': precision_score(y_test, y_pred, average='weighted'),
            'recall': recall_score(y_test, y_pred, average='weighted'),
            'f1_score': f1_score(y_test, y_pred, average='weighted'),
            'auc': roc_auc_score(y_test, y_prob) if y_prob is not None else None,
        }
        
        # Confusion matrix
        cm = confusion_matrix(y_test, y_pred)
        
        # Classification report
        class_report = classification_report(y_test, y_pred, output_dict=True)
        
        self.evaluation_results[model_name] = {
            'metrics': metrics,
            'confusion_matrix': cm,
            'classification_report': class_report,
            'predictions': y_pred,
            'probabilities': y_prob,
            'true_labels': y_test
        }
        
        return metrics
    
    def plot_confusion_matrix(self, model_name: str, figsize: Tuple[int, int] = (8, 6)):
        """Plot confusion matrix for a model"""
        if model_name not in self.evaluation_results:
            print(f"No evaluation results found for {model_name}")
            return
        
        cm = self.evaluation_results[model_name]['confusion_matrix']
        
        plt.figure(figsize=figsize)
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
                   xticklabels=['No Cancer', 'Cancer'],
                   yticklabels=['No Cancer', 'Cancer'])
        plt.title(f'Confusion Matrix - {model_name}')
        plt.xlabel('Predicted')
        plt.ylabel('Actual')
        
        filename = f"{self.figures_dir}/confusion_matrix_{model_name.replace(' ', '_')}.png"
        plt.savefig(filename, dpi=300, bbox_inches='tight')
        plt.show()
        
        print(f"Confusion matrix saved to {filename}")
    
    def plot_roc_curves(self, model_names: List[str], figsize: Tuple[int, int] = (10, 8)):
        """Plot ROC curves for multiple models"""
        plt.figure(figsize=figsize)
        
        for model_name in model_names:
            if model_name not in self.evaluation_results:
                continue
                
            results = self.evaluation_results[model_name]
            if results['probabilities'] is None:
                continue
            
            fpr, tpr, _ = roc_curve(results['true_labels'], results['probabilities'])
            auc = results['metrics']['auc']
            
            plt.plot(fpr, tpr, label=f'{model_name} (AUC = {auc:.3f})')
        
        plt.plot([0, 1], [0, 1], 'k--', label='Random Classifier')
        plt.xlim([0.0, 1.0])
        plt.ylim([0.0, 1.05])
        plt.xlabel('False Positive Rate')
        plt.ylabel('True Positive Rate')
        plt.title('ROC Curves Comparison')
        plt.legend()
        plt.grid(True, alpha=0.3)
        
        filename = f"{self.figures_dir}/roc_curves_comparison.png"
        plt.savefig(filename, dpi=300, bbox_inches='tight')
        plt.show()
        
        print(f"ROC curves saved to {filename}")
    
    def plot_precision_recall_curves(self, model_names: List[str], figsize: Tuple[int, int] = (10, 8)):
        """Plot precision-recall curves for multiple models"""
        plt.figure(figsize=figsize)
        
        for model_name in model_names:
            if model_name not in self.evaluation_results:
                continue
                
            results = self.evaluation_results[model_name]
            if results['probabilities'] is None:
                continue
            
            precision, recall, _ = precision_recall_curve(results['true_labels'], results['probabilities'])
            
            plt.plot(recall, precision, label=f'{model_name}')
        
        plt.xlim([0.0, 1.0])
        plt.ylim([0.0, 1.05])
        plt.xlabel('Recall')
        plt.ylabel('Precision')
        plt.title('Precision-Recall Curves Comparison')
        plt.legend()
        plt.grid(True, alpha=0.3)
        
        filename = f"{self.figures_dir}/precision_recall_curves.png"
        plt.savefig(filename, dpi=300, bbox_inches='tight')
        plt.show()
        
        print(f"Precision-recall curves saved to {filename}")
    
    def create_performance_comparison_table(self, model_names: List[str]) -> pd.DataFrame:
        """Create a comprehensive performance comparison table"""
        comparison_data = []
        
        for model_name in model_names:
            if model_name not in self.evaluation_results:
                continue
            
            metrics = self.evaluation_results[model_name]['metrics']
            
            comparison_data.append({
                'Model': model_name,
                'Accuracy': f"{metrics['accuracy']:.3f}",
                'Precision': f"{metrics['precision']:.3f}",
                'Recall': f"{metrics['recall']:.3f}",
                'F1-Score': f"{metrics['f1_score']:.3f}",
                'AUC': f"{metrics['auc']:.3f}" if metrics['auc'] else 'N/A'
            })
        
        df = pd.DataFrame(comparison_data)
        
        # Save to CSV
        filename = f"{self.figures_dir}/performance_comparison.csv"
        df.to_csv(filename, index=False)
        
        print(f"Performance comparison saved to {filename}")
        return df
    
    def plot_model_comparison_radar(self, model_names: List[str], figsize: Tuple[int, int] = (12, 10)):
        """Create radar chart comparing model performance"""
        from math import pi
        
        # Prepare data
        metrics_names = ['Accuracy', 'Precision', 'Recall', 'F1-Score', 'AUC']
        
        fig, ax = plt.subplots(figsize=figsize, subplot_kw=dict(projection='polar'))
        
        angles = [n / float(len(metrics_names)) * 2 * pi for n in range(len(metrics_names))]
        angles += angles[:1]  # Complete the circle
        
        colors = plt.cm.Set3(np.linspace(0, 1, len(model_names)))
        
        for i, model_name in enumerate(model_names):
            if model_name not in self.evaluation_results:
                continue
            
            metrics = self.evaluation_results[model_name]['metrics']
            values = [
                metrics['accuracy'],
                metrics['precision'],
                metrics['recall'],
                metrics['f1_score'],
                metrics['auc'] if metrics['auc'] else 0
            ]
            values += values[:1]  # Complete the circle
            
            ax.plot(angles, values, 'o-', linewidth=2, label=model_name, color=colors[i])
            ax.fill(angles, values, alpha=0.25, color=colors[i])
        
        ax.set_xticks(angles[:-1])
        ax.set_xticklabels(metrics_names)
        ax.set_ylim(0, 1)
        ax.set_title('Model Performance Comparison - Radar Chart', size=16, y=1.1)
        ax.legend(loc='upper right', bbox_to_anchor=(1.3, 1.0))
        
        filename = f"{self.figures_dir}/model_comparison_radar.png"
        plt.savefig(filename, dpi=300, bbox_inches='tight')
        plt.show()
        
        print(f"Radar chart saved to {filename}")
    
    def analyze_prediction_distribution(self, model_names: List[str], figsize: Tuple[int, int] = (15, 10)):
        """Analyze prediction probability distributions"""
        fig, axes = plt.subplots(2, len(model_names), figsize=figsize)
        
        if len(model_names) == 1:
            axes = axes.reshape(-1, 1)
        
        for i, model_name in enumerate(model_names):
            if model_name not in self.evaluation_results:
                continue
            
            results = self.evaluation_results[model_name]
            if results['probabilities'] is None:
                continue
            
            y_true = results['true_labels']
            y_prob = results['probabilities']
            
            # Probability distribution for each class
            no_cancer_probs = y_prob[y_true == 0]
            cancer_probs = y_prob[y_true == 1]
            
            # Plot histograms
            axes[0, i].hist(no_cancer_probs, bins=30, alpha=0.7, label='No Cancer', color='blue')
            axes[0, i].hist(cancer_probs, bins=30, alpha=0.7, label='Cancer', color='red')
            axes[0, i].set_title(f'{model_name} - Probability Distribution')
            axes[0, i].set_xlabel('Predicted Probability')
            axes[0, i].set_ylabel('Frequency')
            axes[0, i].legend()
            
            # Box plot
            data_to_plot = [no_cancer_probs, cancer_probs]
            box_plot = axes[1, i].boxplot(data_to_plot, labels=['No Cancer', 'Cancer'])
            axes[1, i].set_title(f'{model_name} - Probability Box Plot')
            axes[1, i].set_ylabel('Predicted Probability')
        
        filename = f"{self.figures_dir}/prediction_distributions.png"
        plt.tight_layout()
        plt.savefig(filename, dpi=300, bbox_inches='tight')
        plt.show()
        
        print(f"Prediction distributions saved to {filename}")
    
    def generate_evaluation_report(self, model_names: List[str]) -> str:
        """Generate comprehensive evaluation report"""
        report = "CANCER PREDICTION MODEL EVALUATION REPORT\n"
        report += "=" * 50 + "\n\n"
        
        # Overall summary
        report += "EXECUTIVE SUMMARY\n"
        report += "-" * 20 + "\n"
        report += f"Evaluated {len(model_names)} models on cancer prediction task.\n\n"
        
        # Individual model performance
        report += "INDIVIDUAL MODEL PERFORMANCE\n"
        report += "-" * 30 + "\n"
        
        for model_name in model_names:
            if model_name not in self.evaluation_results:
                continue
            
            metrics = self.evaluation_results[model_name]['metrics']
            
            report += f"\n{model_name.upper()}\n"
            report += f"  Accuracy:  {metrics['accuracy']:.3f}\n"
            report += f"  Precision: {metrics['precision']:.3f}\n"
            report += f"  Recall:    {metrics['recall']:.3f}\n"
            report += f"  F1-Score:  {metrics['f1_score']:.3f}\n"
            report += f"  AUC:       {metrics['auc']:.3f if metrics['auc'] else 'N/A'}\n"
        
        # Best performing model
        best_model = max(model_names, 
                        key=lambda x: self.evaluation_results[x]['metrics']['accuracy'] 
                        if x in self.evaluation_results else 0)
        
        report += f"\nBEST PERFORMING MODEL: {best_model}\n"
        report += "-" * 25 + "\n"
        
        if best_model in self.evaluation_results:
            best_metrics = self.evaluation_results[best_model]['metrics']
            report += f"This model achieved the highest accuracy of {best_metrics['accuracy']:.3f}\n"
            report += f"with an AUC of {best_metrics['auc']:.3f if best_metrics['auc'] else 'N/A'}.\n"
        
        # Recommendations
        report += "\nRECOMMENDATIONS\n"
        report += "-" * 15 + "\n"
        report += "1. Use the best performing model for production deployment.\n"
        report += "2. Consider ensemble methods to combine multiple models.\n"
        report += "3. Collect more diverse training data to improve generalization.\n"
        report += "4. Implement continuous monitoring of model performance.\n"
        
        # Save report
        filename = f"{self.figures_dir}/evaluation_report.txt"
        with open(filename, 'w') as f:
            f.write(report)
        
        print(f"Evaluation report saved to {filename}")
        return report

# Usage example
if __name__ == "__main__":
    print("Model Evaluator - Comprehensive Performance Analysis")
    print("=" * 55)
    
    # This would typically be called after training models
    evaluator = ModelEvaluator()
    
    # Example usage (models would be loaded from saved files)
    # evaluator.evaluate_model_comprehensive(model, X_test, y_test, "Random Forest")
    # evaluator.plot_confusion_matrix("Random Forest")
    # evaluator.create_performance_comparison_table(["Random Forest", "SVM", "Neural Network"])
    
    print("Model evaluation tools initialized.")
    print("Use the evaluator methods after training your models.")
