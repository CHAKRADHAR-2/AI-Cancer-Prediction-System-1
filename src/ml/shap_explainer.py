#!/usr/bin/env python3
"""
SHAP Integration for Cancer Prediction Model
Provides explainable AI features using SHAP (SHapley Additive exPlanations)
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import shap
import joblib
import json
import os
from typing import Dict, List, Tuple, Optional, Any
import warnings
warnings.filterwarnings('ignore')

class SHAPExplainer:
    """SHAP-based explainable AI for cancer prediction models"""
    
    def __init__(self, model_dir: str = "trained_models", output_dir: str = "shap_explanations"):
        self.model_dir = model_dir
        self.output_dir = output_dir
        self.ensure_output_dir()
        
        # SHAP explainers for different model types
        self.explainers = {}
        self.shap_values = {}
        self.feature_names = []
        
        # Initialize matplotlib for SHAP plots
        plt.style.use('default')
        
    def ensure_output_dir(self):
        """Create output directory if it doesn't exist"""
        if not os.path.exists(self.output_dir):
            os.makedirs(self.output_dir)
    
    def initialize_explainer(self, model, X_train: pd.DataFrame, model_name: str = "default"):
        """Initialize SHAP explainer for a given model"""
        print(f"Initializing SHAP explainer for {model_name}...")
        
        self.feature_names = list(X_train.columns)
        
        try:
            # Determine the best explainer type based on model
            model_type = type(model).__name__
            
            if 'RandomForest' in model_type or 'GradientBoosting' in model_type:
                # Tree-based models - use TreeExplainer
                explainer = shap.TreeExplainer(model)
                print(f"Using TreeExplainer for {model_type}")
                
            elif 'LogisticRegression' in model_type or 'LinearRegression' in model_type:
                # Linear models - use LinearExplainer
                explainer = shap.LinearExplainer(model, X_train)
                print(f"Using LinearExplainer for {model_type}")
                
            else:
                # General models - use KernelExplainer (slower but works for any model)
                background = shap.sample(X_train, min(100, len(X_train)))
                explainer = shap.KernelExplainer(model.predict_proba, background)
                print(f"Using KernelExplainer for {model_type}")
            
            self.explainers[model_name] = explainer
            print(f"✓ SHAP explainer initialized for {model_name}")
            
        except Exception as e:
            print(f"Error initializing SHAP explainer for {model_name}: {str(e)}")
            # Fallback to KernelExplainer
            try:
                background = shap.sample(X_train, min(50, len(X_train)))
                explainer = shap.KernelExplainer(model.predict, background)
                self.explainers[model_name] = explainer
                print(f"✓ Fallback KernelExplainer initialized for {model_name}")
            except Exception as e2:
                print(f"Failed to initialize any explainer: {str(e2)}")
    
    def calculate_shap_values(self, X_test: pd.DataFrame, model_name: str = "default"):
        """Calculate SHAP values for test data"""
        if model_name not in self.explainers:
            print(f"No explainer found for {model_name}")
            return None
        
        print(f"Calculating SHAP values for {model_name}...")
        
        try:
            explainer = self.explainers[model_name]
            
            # Calculate SHAP values
            if isinstance(explainer, shap.TreeExplainer):
                shap_values = explainer.shap_values(X_test)
                # For binary classification, take the positive class
                if isinstance(shap_values, list) and len(shap_values) == 2:
                    shap_values = shap_values[1]
                    
            elif isinstance(explainer, shap.LinearExplainer):
                shap_values = explainer.shap_values(X_test)
                
            else:  # KernelExplainer
                shap_values = explainer.shap_values(X_test)
                if isinstance(shap_values, list) and len(shap_values) == 2:
                    shap_values = shap_values[1]
            
            self.shap_values[model_name] = shap_values
            print(f"✓ SHAP values calculated for {model_name}")
            
            return shap_values
            
        except Exception as e:
            print(f"Error calculating SHAP values for {model_name}: {str(e)}")
            return None
    
    def plot_summary_plot(self, X_test: pd.DataFrame, model_name: str = "default", 
                         plot_type: str = "dot", max_display: int = 20):
        """Create SHAP summary plot"""
        if model_name not in self.shap_values:
            print(f"No SHAP values found for {model_name}")
            return
        
        try:
            plt.figure(figsize=(12, 8))
            
            shap_values = self.shap_values[model_name]
            
            # Create summary plot
            shap.summary_plot(
                shap_values, 
                X_test, 
                plot_type=plot_type,
                max_display=max_display,
                show=False
            )
            
            plt.title(f'SHAP Summary Plot - {model_name}', fontsize=16, pad=20)
            plt.tight_layout()
            
            # Save plot
            filename = f"{self.output_dir}/shap_summary_{model_name.replace(' ', '_')}_{plot_type}.png"
            plt.savefig(filename, dpi=300, bbox_inches='tight')
            plt.show()
            
            print(f"SHAP summary plot saved to {filename}")
            
        except Exception as e:
            print(f"Error creating SHAP summary plot: {str(e)}")
    
    def plot_waterfall_plot(self, X_test: pd.DataFrame, model_name: str = "default", 
                           sample_idx: int = 0):
        """Create SHAP waterfall plot for a single prediction"""
        if model_name not in self.shap_values:
            print(f"No SHAP values found for {model_name}")
            return
        
        try:
            shap_values = self.shap_values[model_name]
            explainer = self.explainers[model_name]
            
            # Get expected value (baseline)
            if hasattr(explainer, 'expected_value'):
                expected_value = explainer.expected_value
                if isinstance(expected_value, np.ndarray):
                    expected_value = expected_value[1] if len(expected_value) > 1 else expected_value[0]
            else:
                expected_value = 0
            
            # Create waterfall plot
            plt.figure(figsize=(12, 8))
            
            # Create explanation object for waterfall plot
            explanation = shap.Explanation(
                values=shap_values[sample_idx],
                base_values=expected_value,
                data=X_test.iloc[sample_idx].values,
                feature_names=list(X_test.columns)
            )
            
            shap.waterfall_plot(explanation, show=False)
            
            plt.title(f'SHAP Waterfall Plot - {model_name} (Sample {sample_idx})', 
                     fontsize=16, pad=20)
            plt.tight_layout()
            
            # Save plot
            filename = f"{self.output_dir}/shap_waterfall_{model_name.replace(' ', '_')}_sample_{sample_idx}.png"
            plt.savefig(filename, dpi=300, bbox_inches='tight')
            plt.show()
            
            print(f"SHAP waterfall plot saved to {filename}")
            
        except Exception as e:
            print(f"Error creating SHAP waterfall plot: {str(e)}")
    
    def plot_force_plot(self, X_test: pd.DataFrame, model_name: str = "default", 
                       sample_idx: int = 0, matplotlib: bool = True):
        """Create SHAP force plot for a single prediction"""
        if model_name not in self.shap_values:
            print(f"No SHAP values found for {model_name}")
            return
        
        try:
            shap_values = self.shap_values[model_name]
            explainer = self.explainers[model_name]
            
            # Get expected value
            if hasattr(explainer, 'expected_value'):
                expected_value = explainer.expected_value
                if isinstance(expected_value, np.ndarray):
                    expected_value = expected_value[1] if len(expected_value) > 1 else expected_value[0]
            else:
                expected_value = 0
            
            if matplotlib:
                # Create matplotlib version
                plt.figure(figsize=(16, 4))
                
                shap.force_plot(
                    expected_value,
                    shap_values[sample_idx],
                    X_test.iloc[sample_idx],
                    matplotlib=True,
                    show=False
                )
                
                plt.title(f'SHAP Force Plot - {model_name} (Sample {sample_idx})', 
                         fontsize=16, pad=20)
                plt.tight_layout()
                
                # Save plot
                filename = f"{self.output_dir}/shap_force_{model_name.replace(' ', '_')}_sample_{sample_idx}.png"
                plt.savefig(filename, dpi=300, bbox_inches='tight')
                plt.show()
                
                print(f"SHAP force plot saved to {filename}")
            else:
                # Create interactive HTML version
                force_plot = shap.force_plot(
                    expected_value,
                    shap_values[sample_idx],
                    X_test.iloc[sample_idx]
                )
                
                # Save as HTML
                filename = f"{self.output_dir}/shap_force_{model_name.replace(' ', '_')}_sample_{sample_idx}.html"
                shap.save_html(filename, force_plot)
                print(f"Interactive SHAP force plot saved to {filename}")
                
                return force_plot
            
        except Exception as e:
            print(f"Error creating SHAP force plot: {str(e)}")
    
    def plot_dependence_plot(self, X_test: pd.DataFrame, feature_name: str, 
                           model_name: str = "default", interaction_index: str = "auto"):
        """Create SHAP dependence plot for a specific feature"""
        if model_name not in self.shap_values:
            print(f"No SHAP values found for {model_name}")
            return
        
        try:
            shap_values = self.shap_values[model_name]
            
            plt.figure(figsize=(10, 6))
            
            shap.dependence_plot(
                feature_name,
                shap_values,
                X_test,
                interaction_index=interaction_index,
                show=False
            )
            
            plt.title(f'SHAP Dependence Plot - {feature_name} ({model_name})', 
                     fontsize=16, pad=20)
            plt.tight_layout()
            
            # Save plot
            filename = f"{self.output_dir}/shap_dependence_{model_name.replace(' ', '_')}_{feature_name.replace(' ', '_')}.png"
            plt.savefig(filename, dpi=300, bbox_inches='tight')
            plt.show()
            
            print(f"SHAP dependence plot saved to {filename}")
            
        except Exception as e:
            print(f"Error creating SHAP dependence plot: {str(e)}")
    
    def get_feature_importance_ranking(self, model_name: str = "default") -> pd.DataFrame:
        """Get feature importance ranking based on SHAP values"""
        if model_name not in self.shap_values:
            print(f"No SHAP values found for {model_name}")
            return pd.DataFrame()
        
        try:
            shap_values = self.shap_values[model_name]
            
            # Calculate mean absolute SHAP values for each feature
            feature_importance = np.abs(shap_values).mean(axis=0)
            
            # Create DataFrame
            importance_df = pd.DataFrame({
                'feature': self.feature_names,
                'importance': feature_importance
            }).sort_values('importance', ascending=False)
            
            # Add percentage
            importance_df['importance_pct'] = (importance_df['importance'] / 
                                             importance_df['importance'].sum() * 100)
            
            # Save to CSV
            filename = f"{self.output_dir}/feature_importance_{model_name.replace(' ', '_')}.csv"
            importance_df.to_csv(filename, index=False)
            
            print(f"Feature importance ranking saved to {filename}")
            return importance_df
            
        except Exception as e:
            print(f"Error calculating feature importance: {str(e)}")
            return pd.DataFrame()
    
    def explain_single_prediction(self, X_sample: pd.Series, model_name: str = "default") -> Dict:
        """Explain a single prediction with SHAP values"""
        if model_name not in self.explainers:
            print(f"No explainer found for {model_name}")
            return {}
        
        try:
            explainer = self.explainers[model_name]
            
            # Reshape for single sample
            X_sample_df = X_sample.to_frame().T
            
            # Calculate SHAP values for single sample
            if isinstance(explainer, shap.TreeExplainer):
                shap_values = explainer.shap_values(X_sample_df)
                if isinstance(shap_values, list):
                    shap_values = shap_values[1]  # Positive class
            else:
                shap_values = explainer.shap_values(X_sample_df)
                if isinstance(shap_values, list):
                    shap_values = shap_values[1]
            
            # Get expected value
            expected_value = getattr(explainer, 'expected_value', 0)
            if isinstance(expected_value, np.ndarray):
                expected_value = expected_value[1] if len(expected_value) > 1 else expected_value[0]
            
            # Create explanation dictionary
            explanation = {
                'expected_value': float(expected_value),
                'prediction_value': float(expected_value + np.sum(shap_values[0])),
                'feature_contributions': {}
            }
            
            # Add feature contributions
            for i, feature in enumerate(self.feature_names):
                explanation['feature_contributions'][feature] = {
                    'shap_value': float(shap_values[0][i]),
                    'feature_value': float(X_sample.iloc[i]),
                    'contribution_pct': float(abs(shap_values[0][i]) / np.sum(np.abs(shap_values[0])) * 100)
                }
            
            # Sort by absolute contribution
            sorted_contributions = sorted(
                explanation['feature_contributions'].items(),
                key=lambda x: abs(x[1]['shap_value']),
                reverse=True
            )
            
            explanation['top_features'] = [
                {
                    'feature': feature,
                    'shap_value': contrib['shap_value'],
                    'feature_value': contrib['feature_value'],
                    'contribution_pct': contrib['contribution_pct']
                }
                for feature, contrib in sorted_contributions[:10]
            ]
            
            return explanation
            
        except Exception as e:
            print(f"Error explaining single prediction: {str(e)}")
            return {}
    
    def generate_shap_report(self, X_test: pd.DataFrame, model_name: str = "default"):
        """Generate comprehensive SHAP analysis report"""
        print(f"Generating comprehensive SHAP report for {model_name}...")
        
        try:
            # 1. Summary plot (dot plot)
            self.plot_summary_plot(X_test, model_name, plot_type="dot")
            
            # 2. Summary plot (bar plot)
            self.plot_summary_plot(X_test, model_name, plot_type="bar")
            
            # 3. Feature importance ranking
            importance_df = self.get_feature_importance_ranking(model_name)
            
            # 4. Waterfall plots for first few samples
            for i in range(min(3, len(X_test))):
                self.plot_waterfall_plot(X_test, model_name, sample_idx=i)
            
            # 5. Force plots for first few samples
            for i in range(min(3, len(X_test))):
                self.plot_force_plot(X_test, model_name, sample_idx=i)
            
            # 6. Dependence plots for top features
            if not importance_df.empty:
                top_features = importance_df.head(5)['feature'].tolist()
                for feature in top_features:
                    if feature in X_test.columns:
                        self.plot_dependence_plot(X_test, feature, model_name)
            
            # 7. Save summary statistics
            summary_stats = {
                'model_name': model_name,
                'num_samples': len(X_test),
                'num_features': len(self.feature_names),
                'top_10_features': importance_df.head(10).to_dict('records') if not importance_df.empty else [],
                'shap_values_stats': {
                    'mean_abs_shap': float(np.mean(np.abs(self.shap_values[model_name]))),
                    'std_abs_shap': float(np.std(np.abs(self.shap_values[model_name]))),
                    'max_abs_shap': float(np.max(np.abs(self.shap_values[model_name]))),
                    'min_abs_shap': float(np.min(np.abs(self.shap_values[model_name])))
                }
            }
            
            # Save summary
            summary_filename = f"{self.output_dir}/shap_summary_{model_name.replace(' ', '_')}.json"
            with open(summary_filename, 'w') as f:
                json.dump(summary_stats, f, indent=2)
            
            print(f"✓ Comprehensive SHAP report generated for {model_name}")
            print(f"✓ Summary statistics saved to {summary_filename}")
            
        except Exception as e:
            print(f"Error generating SHAP report: {str(e)}")

# Integration function for existing cancer prediction system
def integrate_shap_with_cancer_model(model_path: str, X_train: pd.DataFrame, X_test: pd.DataFrame):
    """
    Integration function to add SHAP explanations to existing cancer prediction model
    """
    print("Integrating SHAP with Cancer Prediction Model...")
    
    try:
        # Load the trained model
        model = joblib.load(model_path)
        
        # Initialize SHAP explainer
        shap_explainer = SHAPExplainer()
        shap_explainer.initialize_explainer(model, X_train, "cancer_model")
        
        # Calculate SHAP values
        shap_explainer.calculate_shap_values(X_test, "cancer_model")
        
        # Generate comprehensive report
        shap_explainer.generate_shap_report(X_test, "cancer_model")
        
        print("✓ SHAP integration completed successfully!")
        return shap_explainer
        
    except Exception as e:
        print(f"Error integrating SHAP: {str(e)}")
        return None

if __name__ == "__main__":
    print("SHAP Explainer for Cancer Prediction Model")
    print("=" * 50)
    
    # Example usage
    try:
        # This would be called from the main training script
        print("SHAP explainer module loaded successfully!")
        print("Use integrate_shap_with_cancer_model() to add explainability to your models.")
        
    except Exception as e:
        print(f"Error: {str(e)}")