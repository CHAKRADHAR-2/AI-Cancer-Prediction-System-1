
import pandas as pd
import numpy as np
import requests
import zipfile
import os
from typing import Dict, List, Tuple, Optional
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import classification_report, confusion_matrix
import json
import warnings
warnings.filterwarnings('ignore')

class CancerDatasetManager:
    """Manage real-world and synthetic cancer datasets"""
    
    def __init__(self, data_dir: str = "datasets"):
        self.data_dir = data_dir
        self.datasets = {}
        self.processed_datasets = {}
        self.real_world_sources = {
            'breast_cancer_wisconsin': {
                'url': 'https://archive.ics.uci.edu/ml/machine-learning-databases/breast-cancer-wisconsin/breast-cancer-wisconsin.data',
                'columns': ['id', 'clump_thickness', 'uniformity_cell_size', 'uniformity_cell_shape', 
                          'marginal_adhesion', 'single_epithelial_size', 'bare_nuclei', 'bland_chromatin',
                          'normal_nucleoli', 'mitoses', 'class'],
                'target_column': 'class',
                'cancer_type': 'Breast Cancer'
            },
            'lung_cancer': {
                'url': 'https://raw.githubusercontent.com/datasets/lung-cancer/main/lung_cancer.csv',
                'target_column': 'LUNG_CANCER',
                'cancer_type': 'Lung Cancer'
            },
            'colon_cancer': {
                'url': 'https://raw.githubusercontent.com/datasets/colon-cancer/main/colon_cancer.csv',
                'target_column': 'cancer',
                'cancer_type': 'Colon Cancer'
            }
        }
        self.ensure_data_directory()
    
    def ensure_data_directory(self):
        """Create data directory if it doesn't exist"""
        if not os.path.exists(self.data_dir):
            os.makedirs(self.data_dir)
    
    def download_real_world_datasets(self):
        """Download real-world cancer datasets from various sources"""
        print("Downloading real-world cancer datasets...")
        
        for dataset_name, config in self.real_world_sources.items():
            try:
                print(f"Downloading {dataset_name}...")
                
                # Download dataset
                response = requests.get(config['url'])
                if response.status_code == 200:
                    file_path = os.path.join(self.data_dir, f"{dataset_name}.csv")
                    
                    # Handle different file formats
                    if config['url'].endswith('.data'):
                        # Convert .data format to CSV
                        lines = response.text.strip().split('\n')
                        with open(file_path, 'w') as f:
                            if 'columns' in config:
                                f.write(','.join(config['columns']) + '\n')
                            for line in lines:
                                f.write(line.replace('\t', ',') + '\n')
                    else:
                        # Direct CSV download
                        with open(file_path, 'wb') as f:
                            f.write(response.content)
                    
                    print(f"✓ Downloaded {dataset_name} to {file_path}")
                else:
                    print(f"✗ Failed to download {dataset_name}: HTTP {response.status_code}")
                    
            except Exception as e:
                print(f"✗ Error downloading {dataset_name}: {str(e)}")
                # Create a fallback synthetic dataset for this cancer type
                self.create_fallback_dataset(dataset_name, config)
    
    def create_fallback_dataset(self, dataset_name: str, config: Dict):
        """Create fallback synthetic dataset when real data is unavailable"""
        print(f"Creating fallback synthetic dataset for {dataset_name}...")
        
        np.random.seed(42)
        n_samples = 1000
        
        if config['cancer_type'] == 'Breast Cancer':
            data = self.generate_breast_cancer_fallback(n_samples)
        elif config['cancer_type'] == 'Lung Cancer':
            data = self.generate_lung_cancer_fallback(n_samples)
        elif config['cancer_type'] == 'Colon Cancer':
            data = self.generate_colon_cancer_fallback(n_samples)
        else:
            data = self.generate_generic_cancer_fallback(n_samples)
        
        file_path = os.path.join(self.data_dir, f"{dataset_name}_fallback.csv")
        data.to_csv(file_path, index=False)
        print(f"✓ Created fallback dataset: {file_path}")
    
    def generate_breast_cancer_fallback(self, n_samples: int) -> pd.DataFrame:
        """Generate breast cancer fallback dataset"""
        data = {
            'age': np.random.normal(55, 15, n_samples).clip(25, 85),
            'tumor_size': np.random.lognormal(1, 0.5, n_samples).clip(0.5, 10),
            'lymph_nodes': np.random.poisson(2, n_samples).clip(0, 20),
            'grade': np.random.choice([1, 2, 3], n_samples, p=[0.3, 0.5, 0.2]),
            'estrogen_receptor': np.random.choice([0, 1], n_samples, p=[0.3, 0.7]),
            'progesterone_receptor': np.random.choice([0, 1], n_samples, p=[0.4, 0.6]),
            'her2_status': np.random.choice([0, 1], n_samples, p=[0.8, 0.2]),
            'family_history': np.random.choice([0, 1], n_samples, p=[0.8, 0.2]),
            'bmi': np.random.normal(26, 4, n_samples).clip(18, 40),
            'menopause_status': np.random.choice([0, 1], n_samples, p=[0.4, 0.6]),
        }
        
        # Generate target based on risk factors
        risk_score = (
            (data['age'] > 50) * 0.2 +
            (data['tumor_size'] > 2) * 0.3 +
            (data['lymph_nodes'] > 0) * 0.3 +
            (data['grade'] == 3) * 0.2 +
            data['family_history'] * 0.3
        )
        
        data['cancer'] = (risk_score + np.random.normal(0, 0.1, n_samples) > 0.5).astype(int)
        
        return pd.DataFrame(data)
    
    def generate_lung_cancer_fallback(self, n_samples: int) -> pd.DataFrame:
        """Generate lung cancer fallback dataset"""
        data = {
            'age': np.random.normal(65, 12, n_samples).clip(35, 85),
            'gender': np.random.choice([0, 1], n_samples, p=[0.6, 0.4]),  # 0=Male, 1=Female
            'smoking_years': np.random.exponential(20, n_samples).clip(0, 50),
            'packs_per_day': np.random.exponential(1.5, n_samples).clip(0, 4),
            'family_history': np.random.choice([0, 1], n_samples, p=[0.7, 0.3]),
            'occupational_exposure': np.random.choice([0, 1], n_samples, p=[0.8, 0.2]),
            'air_pollution': np.random.choice([0, 1, 2], n_samples, p=[0.4, 0.4, 0.2]),
            'chest_pain': np.random.choice([0, 1], n_samples, p=[0.6, 0.4]),
            'cough': np.random.choice([0, 1], n_samples, p=[0.4, 0.6]),
            'weight_loss': np.random.choice([0, 1], n_samples, p=[0.7, 0.3]),
            'fatigue': np.random.choice([0, 1], n_samples, p=[0.6, 0.4]),
        }
        
        # Generate target based on risk factors
        risk_score = (
            (data['age'] > 60) * 0.2 +
            (data['smoking_years'] > 10) * 0.4 +
            (data['packs_per_day'] > 1) * 0.3 +
            data['family_history'] * 0.2 +
            data['occupational_exposure'] * 0.2 +
            data['cough'] * 0.1 +
            data['weight_loss'] * 0.2
        )
        
        data['LUNG_CANCER'] = (risk_score + np.random.normal(0, 0.1, n_samples) > 0.6).astype(int)
        
        return pd.DataFrame(data)
    
    def generate_colon_cancer_fallback(self, n_samples: int) -> pd.DataFrame:
        """Generate colon cancer fallback dataset"""
        data = {
            'age': np.random.normal(62, 14, n_samples).clip(30, 85),
            'gender': np.random.choice([0, 1], n_samples, p=[0.52, 0.48]),
            'family_history': np.random.choice([0, 1], n_samples, p=[0.75, 0.25]),
            'polyps_history': np.random.choice([0, 1], n_samples, p=[0.6, 0.4]),
            'diet_score': np.random.normal(5, 2, n_samples).clip(1, 10),  # 1=poor, 10=excellent
            'fiber_intake': np.random.normal(20, 8, n_samples).clip(5, 50),
            'red_meat_consumption': np.random.normal(3, 2, n_samples).clip(0, 10),
            'alcohol_consumption': np.random.choice([0, 1, 2, 3], n_samples, p=[0.3, 0.4, 0.2, 0.1]),
            'smoking_status': np.random.choice([0, 1, 2], n_samples, p=[0.5, 0.3, 0.2]),
            'physical_activity': np.random.choice([0, 1, 2], n_samples, p=[0.4, 0.4, 0.2]),
            'abdominal_pain': np.random.choice([0, 1], n_samples, p=[0.6, 0.4]),
            'bowel_changes': np.random.choice([0, 1], n_samples, p=[0.7, 0.3]),
            'blood_in_stool': np.random.choice([0, 1], n_samples, p=[0.8, 0.2]),
        }
        
        # Generate target based on risk factors
        risk_score = (
            (data['age'] > 50) * 0.2 +
            data['family_history'] * 0.3 +
            data['polyps_history'] * 0.2 +
            (data['diet_score'] < 4) * 0.2 +
            (data['red_meat_consumption'] > 5) * 0.1 +
            (data['smoking_status'] == 2) * 0.1 +
            data['blood_in_stool'] * 0.3
        )
        
        data['cancer'] = (risk_score + np.random.normal(0, 0.1, n_samples) > 0.5).astype(int)
        
        return pd.DataFrame(data)
    
    def generate_generic_cancer_fallback(self, n_samples: int) -> pd.DataFrame:
        """Generate generic cancer fallback dataset"""
        data = {
            'age': np.random.normal(60, 15, n_samples).clip(20, 90),
            'gender': np.random.choice([0, 1], n_samples),
            'family_history': np.random.choice([0, 1], n_samples, p=[0.7, 0.3]),
            'smoking_status': np.random.choice([0, 1, 2], n_samples, p=[0.5, 0.3, 0.2]),
            'alcohol_consumption': np.random.choice([0, 1, 2, 3], n_samples, p=[0.3, 0.4, 0.2, 0.1]),
            'bmi': np.random.normal(26, 5, n_samples).clip(15, 45),
            'physical_activity': np.random.choice([0, 1, 2], n_samples, p=[0.3, 0.4, 0.3]),
            'diet_quality': np.random.normal(5, 2, n_samples).clip(1, 10),
            'stress_level': np.random.choice([0, 1, 2], n_samples, p=[0.3, 0.5, 0.2]),
            'sleep_hours': np.random.normal(7, 1.5, n_samples).clip(4, 12),
        }
        
        # Generate target
        risk_score = (
            (data['age'] > 55) * 0.2 +
            data['family_history'] * 0.3 +
            (data['smoking_status'] == 2) * 0.3 +
            (data['bmi'] > 30) * 0.1 +
            (data['physical_activity'] == 0) * 0.1
        )
        
        data['cancer'] = (risk_score + np.random.normal(0, 0.1, n_samples) > 0.4).astype(int)
        
        return pd.DataFrame(data)
    
    def load_datasets(self) -> Dict[str, pd.DataFrame]:
        """Load all available datasets"""
        print("Loading cancer datasets...")
        
        for filename in os.listdir(self.data_dir):
            if filename.endswith('.csv'):
                dataset_name = filename.replace('.csv', '')
                file_path = os.path.join(self.data_dir, filename)
                
                try:
                    df = pd.read_csv(file_path)
                    self.datasets[dataset_name] = df
                    print(f"✓ Loaded {dataset_name}: {df.shape}")
                except Exception as e:
                    print(f"✗ Error loading {dataset_name}: {str(e)}")
        
        return self.datasets
    
    def preprocess_dataset(self, dataset_name: str, target_column: str) -> Tuple[pd.DataFrame, pd.Series]:
        """Preprocess a specific dataset"""
        if dataset_name not in self.datasets:
            raise ValueError(f"Dataset {dataset_name} not found")
        
        df = self.datasets[dataset_name].copy()
        
        # Handle missing values
        df = df.replace('?', np.nan)
        df = df.dropna()
        
        # Separate features and target
        if target_column not in df.columns:
            print(f"Warning: Target column '{target_column}' not found. Using last column as target.")
            target_column = df.columns[-1]
        
        X = df.drop(columns=[target_column])
        y = df[target_column]
        
        # Handle categorical variables
        for col in X.columns:
            if X[col].dtype == 'object':
                le = LabelEncoder()
                X[col] = le.fit_transform(X[col].astype(str))
        
        # Ensure target is binary
        if y.dtype == 'object' or len(y.unique()) > 2:
            le = LabelEncoder()
            y = le.fit_transform(y)
        
        self.processed_datasets[dataset_name] = (X, y)
        
        return X, y
    
    def compare_datasets(self) -> Dict:
        """Compare synthetic vs real-world datasets"""
        comparison = {
            'dataset_stats': {},
            'feature_comparison': {},
            'distribution_analysis': {}
        }
        
        for dataset_name, df in self.datasets.items():
            comparison['dataset_stats'][dataset_name] = {
                'shape': df.shape,
                'missing_values': df.isnull().sum().sum(),
                'numeric_features': len(df.select_dtypes(include=[np.number]).columns),
                'categorical_features': len(df.select_dtypes(include=['object']).columns),
                'cancer_prevalence': None
            }
            
            # Calculate cancer prevalence if target column exists
            target_cols = ['cancer', 'LUNG_CANCER', 'class', 'target']
            for col in target_cols:
                if col in df.columns:
                    if df[col].dtype in ['int64', 'float64']:
                        prevalence = df[col].mean()
                    else:
                        # Handle categorical targets
                        cancer_values = ['M', 'malignant', '1', 'positive', 'cancer']
                        cancer_mask = df[col].astype(str).str.lower().isin(cancer_values)
                        prevalence = cancer_mask.mean()
                    
                    comparison['dataset_stats'][dataset_name]['cancer_prevalence'] = prevalence
                    break
        
        return comparison
    
    def save_comparison_report(self, comparison: Dict, filename: str = "dataset_comparison_report.json"):
        """Save dataset comparison report"""
        report_path = os.path.join(self.data_dir, filename)
        with open(report_path, 'w') as f:
            json.dump(comparison, f, indent=2, default=str)
        print(f"✓ Comparison report saved to {report_path}")
    
    def get_dataset_summary(self) -> pd.DataFrame:
        """Get summary of all loaded datasets"""
        summary_data = []
        
        for name, df in self.datasets.items():
            summary_data.append({
                'Dataset': name,
                'Samples': df.shape[0],
                'Features': df.shape[1],
                'Missing Values': df.isnull().sum().sum(),
                'Source': 'Real-world' if not name.endswith('_fallback') else 'Synthetic'
            })
        
        return pd.DataFrame(summary_data)

# Usage example and main execution
if __name__ == "__main__":
    print("Cancer Dataset Manager - Real-world Data Integration")
    print("=" * 60)
    
    # Initialize dataset manager
    manager = CancerDatasetManager()
    
    # Download real-world datasets
    manager.download_real_world_datasets()
    
    # Load all datasets
    datasets = manager.load_datasets()
    
    # Display summary
    print("\nDataset Summary:")
    print(manager.get_dataset_summary())
    
    # Compare datasets
    comparison = manager.compare_datasets()
    manager.save_comparison_report(comparison)
    
    print("\nDataset comparison completed!")
    print(f"Loaded {len(datasets)} datasets successfully")
    
    # Preprocess datasets for training
    for dataset_name in datasets.keys():
        try:
            # Determine target column
            df = datasets[dataset_name]
            target_candidates = ['cancer', 'LUNG_CANCER', 'class', 'target']
            target_col = None
            
            for col in target_candidates:
                if col in df.columns:
                    target_col = col
                    break
            
            if target_col:
                X, y = manager.preprocess_dataset(dataset_name, target_col)
                print(f"✓ Preprocessed {dataset_name}: Features {X.shape}, Target distribution: {np.bincount(y)}")
        except Exception as e:
            print(f"✗ Error preprocessing {dataset_name}: {str(e)}")
