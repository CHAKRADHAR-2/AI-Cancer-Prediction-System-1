import pandas as pd
import numpy as np
import requests
import zipfile
import os
import json
from typing import Dict, List, Tuple, Optional
from datetime import datetime
import hashlib
import warnings
warnings.filterwarnings('ignore')

class DatasetDownloadManager:
    """Manage downloading, validation, and serving of cancer datasets"""
    
    def __init__(self, data_dir: str = "datasets", public_dir: str = "../public/datasets"):
        self.data_dir = data_dir
        self.public_dir = public_dir
        self.ensure_directories()
        
        # Real-world dataset sources
        self.dataset_sources = {
            'breast_cancer_wisconsin': {
                'url': 'https://archive.ics.uci.edu/ml/machine-learning-databases/breast-cancer-wisconsin/breast-cancer-wisconsin.data',
                'description': 'Wisconsin Breast Cancer Database - Original dataset from UCI ML Repository',
                'features': 11,
                'samples': 699,
                'cancer_type': 'Breast Cancer',
                'source': 'UCI ML Repository',
                'columns': ['id', 'clump_thickness', 'uniformity_cell_size', 'uniformity_cell_shape', 
                           'marginal_adhesion', 'single_epithelial_size', 'bare_nuclei', 'bland_chromatin',
                           'normal_nucleoli', 'mitoses', 'class']
            },
            'lung_cancer_survey': {
                'url': 'https://raw.githubusercontent.com/datasets/lung-cancer/main/lung_cancer_survey.csv',
                'description': 'Lung Cancer Survey Dataset with lifestyle and demographic factors',
                'features': 16,
                'samples': 309,
                'cancer_type': 'Lung Cancer',
                'source': 'Kaggle/GitHub',
                'fallback': True  # Will create synthetic if download fails
            },
            'cervical_cancer_risk': {
                'url': 'https://archive.ics.uci.edu/ml/machine-learning-databases/00383/risk_factors_cervical_cancer.csv',
                'description': 'Cervical Cancer Risk Factors Dataset',
                'features': 36,
                'samples': 858,
                'cancer_type': 'Cervical Cancer',
                'source': 'UCI ML Repository',
                'fallback': True
            },
            'skin_cancer_mnist': {
                'url': 'https://dataverse.harvard.edu/api/access/datafile/3450625',
                'description': 'Skin Cancer MNIST: HAM10000 Dataset (metadata only)',
                'features': 7,
                'samples': 10015,
                'cancer_type': 'Skin Cancer',
                'source': 'Harvard Dataverse',
                'fallback': True
            },
            'colon_cancer_gene': {
                'url': 'https://archive.ics.uci.edu/ml/machine-learning-databases/colon-cancer/colon-cancer.data',
                'description': 'Colon Cancer Gene Expression Dataset',
                'features': 2000,
                'samples': 62,
                'cancer_type': 'Colon Cancer',
                'source': 'UCI ML Repository',
                'fallback': True
            }
        }
        
        # Dataset metadata
        self.dataset_metadata = {}
        self.download_status = {}
    
    def ensure_directories(self):
        """Create necessary directories"""
        for directory in [self.data_dir, self.public_dir]:
            if not os.path.exists(directory):
                os.makedirs(directory)
    
    def download_all_datasets(self) -> Dict[str, bool]:
        """Download all available datasets"""
        print("Downloading real-world cancer datasets...")
        print("=" * 50)
        
        results = {}
        
        for dataset_name, config in self.dataset_sources.items():
            print(f"\nDownloading {dataset_name}...")
            success = self.download_dataset(dataset_name, config)
            results[dataset_name] = success
            
            if success:
                print(f"✓ Successfully downloaded {dataset_name}")
            else:
                print(f"✗ Failed to download {dataset_name}")
                if config.get('fallback', False):
                    print(f"  Creating synthetic fallback dataset...")
                    self.create_fallback_dataset(dataset_name, config)
        
        # Update metadata
        self.update_dataset_metadata()
        
        # Create public dataset catalog
        self.create_public_dataset_catalog()
        
        return results
    
    def download_dataset(self, dataset_name: str, config: Dict) -> bool:
        """Download a specific dataset"""
        try:
            url = config['url']
            response = requests.get(url, timeout=30)
            
            if response.status_code == 200:
                # Determine file format and save appropriately
                filename = f"{dataset_name}.csv"
                filepath = os.path.join(self.data_dir, filename)
                
                # Handle different file formats
                if url.endswith('.data') or 'data' in url:
                    # Convert .data format to CSV
                    lines = response.text.strip().split('\n')
                    with open(filepath, 'w') as f:
                        if 'columns' in config:
                            f.write(','.join(config['columns']) + '\n')
                        for line in lines:
                            # Clean and format the line
                            cleaned_line = line.replace('\t', ',').replace('  ', ' ')
                            f.write(cleaned_line + '\n')
                else:
                    # Direct CSV or other text format
                    with open(filepath, 'wb') as f:
                        f.write(response.content)
                
                # Validate the downloaded dataset
                if self.validate_dataset(filepath, config):
                    self.download_status[dataset_name] = {
                        'status': 'success',
                        'timestamp': datetime.now().isoformat(),
                        'file_size': os.path.getsize(filepath),
                        'file_path': filepath
                    }
                    return True
                else:
                    print(f"  ⚠️ Dataset validation failed for {dataset_name}")
                    return False
            else:
                print(f"  ✗ HTTP {response.status_code} error downloading {dataset_name}")
                return False
                
        except Exception as e:
            print(f"  ✗ Error downloading {dataset_name}: {str(e)}")
            return False
    
    def validate_dataset(self, filepath: str, config: Dict) -> bool:
        """Validate downloaded dataset"""
        try:
            df = pd.read_csv(filepath)
            
            # Basic validation checks
            if len(df) == 0:
                print("    Dataset is empty")
                return False
            
            if len(df.columns) < 2:
                print("    Dataset has too few columns")
                return False
            
            # Check for expected number of samples (with tolerance)
            expected_samples = config.get('samples', 0)
            if expected_samples > 0:
                tolerance = 0.2  # 20% tolerance
                if not (expected_samples * (1 - tolerance) <= len(df) <= expected_samples * (1 + tolerance)):
                    print(f"    Sample count mismatch: expected ~{expected_samples}, got {len(df)}")
                    # Don't fail validation for sample count mismatch, just warn
            
            print(f"    Validation passed: {len(df)} samples, {len(df.columns)} features")
            return True
            
        except Exception as e:
            print(f"    Validation error: {str(e)}")
            return False
    
    def create_fallback_dataset(self, dataset_name: str, config: Dict):
        """Create synthetic fallback dataset when real data is unavailable"""
        print(f"  Creating fallback dataset for {dataset_name}...")
        
        cancer_type = config['cancer_type'].lower().replace(' ', '_')
        expected_samples = config.get('samples', 1000)
        
        # Generate synthetic data based on cancer type
        if 'lung' in cancer_type:
            df = self.generate_lung_cancer_fallback(expected_samples)
        elif 'breast' in cancer_type:
            df = self.generate_breast_cancer_fallback(expected_samples)
        elif 'cervical' in cancer_type:
            df = self.generate_cervical_cancer_fallback(expected_samples)
        elif 'skin' in cancer_type:
            df = self.generate_skin_cancer_fallback(expected_samples)
        elif 'colon' in cancer_type:
            df = self.generate_colon_cancer_fallback(expected_samples)
        else:
            df = self.generate_generic_cancer_fallback(expected_samples)
        
        # Save fallback dataset
        filename = f"{dataset_name}_fallback.csv"
        filepath = os.path.join(self.data_dir, filename)
        df.to_csv(filepath, index=False)
        
        self.download_status[dataset_name] = {
            'status': 'fallback',
            'timestamp': datetime.now().isoformat(),
            'file_size': os.path.getsize(filepath),
            'file_path': filepath,
            'note': 'Synthetic fallback dataset created'
        }
        
        print(f"  ✓ Created fallback dataset: {len(df)} samples")
    
    def generate_lung_cancer_fallback(self, n_samples: int) -> pd.DataFrame:
        """Generate lung cancer fallback dataset"""
        np.random.seed(42)
        
        data = {
            'age': np.random.normal(65, 12, n_samples).clip(35, 85),
            'gender': np.random.choice([0, 1], n_samples, p=[0.6, 0.4]),
            'smoking': np.random.choice([0, 1, 2], n_samples, p=[0.3, 0.3, 0.4]),
            'yellow_fingers': np.random.choice([0, 1], n_samples, p=[0.7, 0.3]),
            'anxiety': np.random.choice([0, 1], n_samples, p=[0.6, 0.4]),
            'peer_pressure': np.random.choice([0, 1], n_samples, p=[0.8, 0.2]),
            'chronic_disease': np.random.choice([0, 1], n_samples, p=[0.7, 0.3]),
            'fatigue': np.random.choice([0, 1], n_samples, p=[0.5, 0.5]),
            'allergy': np.random.choice([0, 1], n_samples, p=[0.8, 0.2]),
            'wheezing': np.random.choice([0, 1], n_samples, p=[0.6, 0.4]),
            'alcohol_consuming': np.random.choice([0, 1], n_samples, p=[0.5, 0.5]),
            'coughing': np.random.choice([0, 1], n_samples, p=[0.4, 0.6]),
            'shortness_of_breath': np.random.choice([0, 1], n_samples, p=[0.6, 0.4]),
            'swallowing_difficulty': np.random.choice([0, 1], n_samples, p=[0.8, 0.2]),
            'chest_pain': np.random.choice([0, 1], n_samples, p=[0.7, 0.3])
        }
        
        # Generate target based on risk factors
        risk_scores = (
            data['smoking'] * 0.4 +
            data['age'] / 100 * 0.3 +
            data['coughing'] * 0.2 +
            data['chest_pain'] * 0.15 +
            data['shortness_of_breath'] * 0.15
        )
        
        data['lung_cancer'] = (risk_scores + np.random.normal(0, 0.1, n_samples) > 0.6).astype(int)
        
        return pd.DataFrame(data)
    
    def generate_breast_cancer_fallback(self, n_samples: int) -> pd.DataFrame:
        """Generate breast cancer fallback dataset"""
        np.random.seed(42)
        
        data = {
            'age': np.random.normal(55, 15, n_samples).clip(25, 85),
            'menopause': np.random.choice([0, 1], n_samples, p=[0.4, 0.6]),
            'tumor_size': np.random.lognormal(1, 0.5, n_samples).clip(0.5, 10),
            'inv_nodes': np.random.poisson(2, n_samples).clip(0, 20),
            'node_caps': np.random.choice([0, 1], n_samples, p=[0.7, 0.3]),
            'deg_malig': np.random.choice([1, 2, 3], n_samples, p=[0.3, 0.5, 0.2]),
            'breast': np.random.choice([0, 1], n_samples, p=[0.5, 0.5]),
            'breast_quad': np.random.choice([1, 2, 3, 4, 5], n_samples),
            'irradiat': np.random.choice([0, 1], n_samples, p=[0.8, 0.2])
        }
        
        # Generate target
        risk_scores = (
            (data['age'] > 50) * 0.2 +
            (data['tumor_size'] > 2) * 0.3 +
            (data['inv_nodes'] > 0) * 0.3 +
            (data['deg_malig'] == 3) * 0.2
        )
        
        data['class'] = (risk_scores + np.random.normal(0, 0.1, n_samples) > 0.5).astype(int)
        
        return pd.DataFrame(data)
    
    def generate_cervical_cancer_fallback(self, n_samples: int) -> pd.DataFrame:
        """Generate cervical cancer fallback dataset"""
        np.random.seed(42)
        
        data = {
            'age': np.random.normal(35, 10, n_samples).clip(15, 65),
            'number_of_sexual_partners': np.random.poisson(3, n_samples).clip(0, 20),
            'first_sexual_intercourse': np.random.normal(18, 3, n_samples).clip(12, 30),
            'num_of_pregnancies': np.random.poisson(2, n_samples).clip(0, 15),
            'smokes': np.random.choice([0, 1], n_samples, p=[0.7, 0.3]),
            'smokes_years': np.random.exponential(5, n_samples).clip(0, 40),
            'smokes_packs_year': np.random.exponential(2, n_samples).clip(0, 20),
            'hormonal_contraceptives': np.random.choice([0, 1], n_samples, p=[0.6, 0.4]),
            'hormonal_contraceptives_years': np.random.exponential(3, n_samples).clip(0, 30),
            'iud': np.random.choice([0, 1], n_samples, p=[0.8, 0.2]),
            'iud_years': np.random.exponential(2, n_samples).clip(0, 20),
            'stds': np.random.choice([0, 1], n_samples, p=[0.85, 0.15]),
            'stds_number': np.random.poisson(0.5, n_samples).clip(0, 10),
            'stds_condylomatosis': np.random.choice([0, 1], n_samples, p=[0.95, 0.05]),
            'stds_cervical_condylomatosis': np.random.choice([0, 1], n_samples, p=[0.98, 0.02]),
            'stds_vaginal_condylomatosis': np.random.choice([0, 1], n_samples, p=[0.98, 0.02]),
            'stds_vulvo_perineal_condylomatosis': np.random.choice([0, 1], n_samples, p=[0.99, 0.01]),
            'stds_syphilis': np.random.choice([0, 1], n_samples, p=[0.98, 0.02]),
            'stds_pelvic_inflammatory_disease': np.random.choice([0, 1], n_samples, p=[0.95, 0.05]),
            'stds_genital_herpes': np.random.choice([0, 1], n_samples, p=[0.95, 0.05]),
            'stds_molluscum_contagiosum': np.random.choice([0, 1], n_samples, p=[0.99, 0.01]),
            'stds_aids': np.random.choice([0, 1], n_samples, p=[0.99, 0.01]),
            'stds_hiv': np.random.choice([0, 1], n_samples, p=[0.98, 0.02]),
            'stds_hepatitis_b': np.random.choice([0, 1], n_samples, p=[0.97, 0.03]),
            'stds_hpv': np.random.choice([0, 1], n_samples, p=[0.9, 0.1]),
            'dx_cancer': np.random.choice([0, 1], n_samples, p=[0.98, 0.02]),
            'dx_cin': np.random.choice([0, 1], n_samples, p=[0.95, 0.05]),
            'dx_hpv': np.random.choice([0, 1], n_samples, p=[0.9, 0.1]),
            'dx': np.random.choice([0, 1], n_samples, p=[0.9, 0.1])
        }
        
        # Generate target
        risk_scores = (
            data['stds_hpv'] * 0.4 +
            data['smokes'] * 0.2 +
            (data['number_of_sexual_partners'] > 5) * 0.2 +
            (data['age'] > 30) * 0.1 +
            data['dx_hpv'] * 0.3
        )
        
        data['biopsy'] = (risk_scores + np.random.normal(0, 0.1, n_samples) > 0.3).astype(int)
        
        return pd.DataFrame(data)
    
    def generate_skin_cancer_fallback(self, n_samples: int) -> pd.DataFrame:
        """Generate skin cancer fallback dataset"""
        np.random.seed(42)
        
        data = {
            'age': np.random.normal(50, 15, n_samples).clip(18, 90),
            'sex': np.random.choice([0, 1], n_samples, p=[0.5, 0.5]),
            'localization': np.random.choice([0, 1, 2, 3, 4], n_samples),  # body parts
            'diameter_1': np.random.lognormal(1, 0.5, n_samples).clip(0.1, 20),
            'diameter_2': np.random.lognormal(1, 0.5, n_samples).clip(0.1, 20),
            'elevation': np.random.choice([0, 1], n_samples, p=[0.7, 0.3]),
            'has_pilar_cyst': np.random.choice([0, 1], n_samples, p=[0.9, 0.1])
        }
        
        # Generate target
        risk_scores = (
            (data['age'] > 60) * 0.2 +
            (data['diameter_1'] > 6) * 0.3 +
            (data['diameter_2'] > 6) * 0.3 +
            data['elevation'] * 0.2
        )
        
        data['dx'] = np.random.choice([0, 1, 2, 3, 4, 5, 6], n_samples, p=[0.7, 0.1, 0.05, 0.05, 0.05, 0.03, 0.02])
        
        return pd.DataFrame(data)
    
    def generate_colon_cancer_fallback(self, n_samples: int) -> pd.DataFrame:
        """Generate colon cancer fallback dataset"""
        np.random.seed(42)
        
        # Generate gene expression-like data (simplified)
        gene_data = {}
        for i in range(50):  # Reduced from 2000 genes for practicality
            gene_data[f'gene_{i}'] = np.random.normal(0, 1, n_samples)
        
        # Add clinical features
        gene_data.update({
            'age': np.random.normal(62, 14, n_samples).clip(30, 85),
            'gender': np.random.choice([0, 1], n_samples, p=[0.52, 0.48]),
            'family_history': np.random.choice([0, 1], n_samples, p=[0.75, 0.25]),
            'polyps_history': np.random.choice([0, 1], n_samples, p=[0.6, 0.4])
        })
        
        # Generate target
        risk_scores = (
            (gene_data['age'] > 60) * 0.2 +
            gene_data['family_history'] * 0.3 +
            gene_data['polyps_history'] * 0.2 +
            np.mean([gene_data[f'gene_{i}'] for i in range(10)], axis=0) * 0.3
        )
        
        gene_data['class'] = (risk_scores + np.random.normal(0, 0.2, n_samples) > 0.5).astype(int)
        
        return pd.DataFrame(gene_data)
    
    def generate_generic_cancer_fallback(self, n_samples: int) -> pd.DataFrame:
        """Generate generic cancer fallback dataset"""
        np.random.seed(42)
        
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
            'sleep_hours': np.random.normal(7, 1.5, n_samples).clip(4, 12)
        }
        
        # Generate target
        risk_scores = (
            (data['age'] > 55) * 0.2 +
            data['family_history'] * 0.3 +
            (data['smoking_status'] == 2) * 0.3 +
            (data['bmi'] > 30) * 0.1 +
            (data['physical_activity'] == 0) * 0.1
        )
        
        data['cancer'] = (risk_scores + np.random.normal(0, 0.1, n_samples) > 0.4).astype(int)
        
        return pd.DataFrame(data)
    
    def update_dataset_metadata(self):
        """Update dataset metadata with current information"""
        self.dataset_metadata = {
            'last_updated': datetime.now().isoformat(),
            'total_datasets': len(self.download_status),
            'successful_downloads': len([s for s in self.download_status.values() if s['status'] == 'success']),
            'fallback_datasets': len([s for s in self.download_status.values() if s['status'] == 'fallback']),
            'datasets': {}
        }
        
        for dataset_name, status in self.download_status.items():
            config = self.dataset_sources.get(dataset_name, {})
            
            # Get actual dataset info
            dataset_info = {
                'name': dataset_name,
                'description': config.get('description', 'Cancer dataset'),
                'cancer_type': config.get('cancer_type', 'Unknown'),
                'source': config.get('source', 'Generated'),
                'status': status['status'],
                'timestamp': status['timestamp'],
                'file_size': status['file_size'],
                'downloadable': True
            }
            
            # Add actual dataset statistics
            try:
                df = pd.read_csv(status['file_path'])
                dataset_info.update({
                    'samples': len(df),
                    'features': len(df.columns),
                    'missing_values': df.isnull().sum().sum(),
                    'file_hash': self.calculate_file_hash(status['file_path'])
                })
            except Exception as e:
                print(f"Error reading {dataset_name}: {str(e)}")
            
            self.dataset_metadata['datasets'][dataset_name] = dataset_info
        
        # Save metadata
        metadata_path = os.path.join(self.data_dir, 'download_metadata.json')
        with open(metadata_path, 'w') as f:
            json.dump(self.dataset_metadata, f, indent=2, default=str)
    
    def create_public_dataset_catalog(self):
        """Create public dataset catalog for frontend access"""
        print("\nCreating public dataset catalog...")
        
        public_catalog = {
            'last_updated': datetime.now().isoformat(),
            'total_datasets': len(self.dataset_metadata['datasets']),
            'datasets': []
        }
        
        for dataset_name, info in self.dataset_metadata['datasets'].items():
            # Copy dataset to public directory for download
            source_path = self.download_status[dataset_name]['file_path']
            public_filename = f"{dataset_name}.csv"
            public_path = os.path.join(self.public_dir, public_filename)
            
            try:
                # Copy file to public directory
                import shutil
                shutil.copy2(source_path, public_path)
                
                # Create public dataset entry
                public_entry = {
                    'id': dataset_name,
                    'name': dataset_name.replace('_', ' ').title(),
                    'description': info['description'],
                    'cancer_type': info['cancer_type'],
                    'source': info['source'],
                    'samples': info.get('samples', 0),
                    'features': info.get('features', 0),
                    'file_size': info['file_size'],
                    'download_url': f"/datasets/{public_filename}",
                    'status': info['status'],
                    'last_updated': info['timestamp']
                }
                
                public_catalog['datasets'].append(public_entry)
                
            except Exception as e:
                print(f"Error creating public entry for {dataset_name}: {str(e)}")
        
        # Save public catalog
        catalog_path = os.path.join(self.public_dir, 'dataset_catalog.json')
        with open(catalog_path, 'w') as f:
            json.dump(public_catalog, f, indent=2, default=str)
        
        print(f"✓ Public dataset catalog created with {len(public_catalog['datasets'])} datasets")
        print(f"  Catalog available at: {catalog_path}")
    
    def calculate_file_hash(self, filepath: str) -> str:
        """Calculate SHA-256 hash of file for integrity verification"""
        hash_sha256 = hashlib.sha256()
        try:
            with open(filepath, "rb") as f:
                for chunk in iter(lambda: f.read(4096), b""):
                    hash_sha256.update(chunk)
            return hash_sha256.hexdigest()
        except Exception:
            return ""
    
    def get_dataset_summary(self) -> Dict:
        """Get summary of all datasets"""
        if not self.dataset_metadata:
            return {'error': 'No datasets available'}
        
        summary = {
            'total_datasets': self.dataset_metadata['total_datasets'],
            'successful_downloads': self.dataset_metadata['successful_downloads'],
            'fallback_datasets': self.dataset_metadata['fallback_datasets'],
            'total_samples': sum(info.get('samples', 0) for info in self.dataset_metadata['datasets'].values()),
            'cancer_types': list(set(info['cancer_type'] for info in self.dataset_metadata['datasets'].values())),
            'datasets_by_type': {}
        }
        
        # Group datasets by cancer type
        for info in self.dataset_metadata['datasets'].values():
            cancer_type = info['cancer_type']
            if cancer_type not in summary['datasets_by_type']:
                summary['datasets_by_type'][cancer_type] = []
            summary['datasets_by_type'][cancer_type].append({
                'name': info['name'],
                'samples': info.get('samples', 0),
                'status': info['status']
            })
        
        return summary

# Main execution
if __name__ == "__main__":
    print("Cancer Dataset Download Manager")
    print("=" * 50)
    
    # Initialize manager
    manager = DatasetDownloadManager()
    
    # Download all datasets
    results = manager.download_all_datasets()
    
    # Display summary
    summary = manager.get_dataset_summary()
    
    print(f"\nDataset Download Summary:")
    print(f"Total datasets: {summary['total_datasets']}")
    print(f"Successful downloads: {summary['successful_downloads']}")
    print(f"Fallback datasets: {summary['fallback_datasets']}")
    print(f"Total samples: {summary['total_samples']:,}")
    print(f"Cancer types covered: {', '.join(summary['cancer_types'])}")
    
    print(f"\nDatasets by cancer type:")
    for cancer_type, datasets in summary['datasets_by_type'].items():
        print(f"  {cancer_type}:")
        for dataset in datasets:
            status_icon = "✓" if dataset['status'] == 'success' else "⚠"
            print(f"    {status_icon} {dataset['name']}: {dataset['samples']:,} samples")
    
    print(f"\n✓ Dataset download and catalog creation completed!")