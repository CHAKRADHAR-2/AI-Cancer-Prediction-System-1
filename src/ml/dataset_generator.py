
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

class CancerDatasetGenerator:
    """Generate realistic cancer datasets for different cancer types"""
    
    def __init__(self):
        self.cancer_types = [
            'Lung Cancer', 'Breast Cancer', 'Prostate Cancer', 'Colon Cancer',
            'Liver Cancer', 'Stomach Cancer', 'Pancreatic Cancer', 'Leukemia'
        ]
    
    def generate_lung_cancer_dataset(self, n_samples=2000):
        """Generate lung cancer specific dataset"""
        np.random.seed(42)
        
        data = {
            'patient_id': range(1, n_samples + 1),
            'age': np.random.normal(65, 12, n_samples).clip(35, 85),
            'gender': np.random.choice(['Male', 'Female'], n_samples, p=[0.6, 0.4]),
            'smoking_years': np.random.exponential(20, n_samples).clip(0, 50),
            'packs_per_day': np.random.exponential(1.5, n_samples).clip(0, 4),
            'quit_years_ago': np.random.exponential(5, n_samples).clip(0, 30),
            'family_history': np.random.choice([0, 1], n_samples, p=[0.7, 0.3]),
            'occupational_exposure': np.random.choice([0, 1], n_samples, p=[0.8, 0.2]),
            'air_pollution_exposure': np.random.choice(['Low', 'Medium', 'High'], n_samples, p=[0.4, 0.4, 0.2]),
            'chest_pain': np.random.choice([0, 1], n_samples, p=[0.6, 0.4]),
            'persistent_cough': np.random.choice([0, 1], n_samples, p=[0.4, 0.6]),
            'shortness_of_breath': np.random.choice([0, 1], n_samples, p=[0.5, 0.5]),
            'coughing_blood': np.random.choice([0, 1], n_samples, p=[0.8, 0.2]),
            'weight_loss': np.random.choice([0, 1], n_samples, p=[0.6, 0.4]),
            'fatigue': np.random.choice([0, 1], n_samples, p=[0.5, 0.5]),
            'tumor_size_cm': np.random.lognormal(1, 0.5, n_samples).clip(0.5, 10),
            'lymph_nodes_affected': np.random.poisson(2, n_samples).clip(0, 15),
            'metastasis': np.random.choice([0, 1], n_samples, p=[0.7, 0.3]),
            'stage': np.random.choice(['I', 'II', 'III', 'IV'], n_samples, p=[0.2, 0.3, 0.3, 0.2]),
            'survival_months': np.random.exponential(24, n_samples).clip(1, 120)
        }
        
        return pd.DataFrame(data)
    
    def generate_breast_cancer_dataset(self, n_samples=2000):
        """Generate breast cancer specific dataset"""
        np.random.seed(43)
        
        data = {
            'patient_id': range(1, n_samples + 1),
            'age': np.random.normal(55, 15, n_samples).clip(25, 85),
            'gender': np.random.choice(['Female', 'Male'], n_samples, p=[0.99, 0.01]),
            'family_history_breast': np.random.choice([0, 1], n_samples, p=[0.8, 0.2]),
            'family_history_ovarian': np.random.choice([0, 1], n_samples, p=[0.95, 0.05]),
            'brca1_mutation': np.random.choice([0, 1], n_samples, p=[0.98, 0.02]),
            'brca2_mutation': np.random.choice([0, 1], n_samples, p=[0.98, 0.02]),
            'age_first_pregnancy': np.random.normal(25, 5, n_samples).clip(15, 45),
            'number_pregnancies': np.random.poisson(2, n_samples).clip(0, 8),
            'breastfeeding_months': np.random.exponential(6, n_samples).clip(0, 36),
            'hormone_replacement_therapy': np.random.choice([0, 1], n_samples, p=[0.7, 0.3]),
            'oral_contraceptives_years': np.random.exponential(5, n_samples).clip(0, 20),
            'alcohol_consumption': np.random.choice(['None', 'Light', 'Moderate', 'Heavy'], n_samples, p=[0.3, 0.4, 0.2, 0.1]),
            'breast_lump': np.random.choice([0, 1], n_samples, p=[0.3, 0.7]),
            'breast_pain': np.random.choice([0, 1], n_samples, p=[0.6, 0.4]),
            'nipple_discharge': np.random.choice([0, 1], n_samples, p=[0.8, 0.2]),
            'skin_changes': np.random.choice([0, 1], n_samples, p=[0.7, 0.3]),
            'tumor_size_cm': np.random.lognormal(0.8, 0.4, n_samples).clip(0.1, 8),
            'lymph_nodes_positive': np.random.poisson(1.5, n_samples).clip(0, 20),
            'estrogen_receptor': np.random.choice([0, 1], n_samples, p=[0.3, 0.7]),
            'progesterone_receptor': np.random.choice([0, 1], n_samples, p=[0.4, 0.6]),
            'her2_status': np.random.choice([0, 1], n_samples, p=[0.8, 0.2]),
            'stage': np.random.choice(['I', 'II', 'III', 'IV'], n_samples, p=[0.3, 0.4, 0.2, 0.1]),
            'survival_months': np.random.exponential(60, n_samples).clip(3, 180)
        }
        
        return pd.DataFrame(data)
    
    def generate_prostate_cancer_dataset(self, n_samples=2000):
        """Generate prostate cancer specific dataset"""
        np.random.seed(44)
        
        data = {
            'patient_id': range(1, n_samples + 1),
            'age': np.random.normal(68, 10, n_samples).clip(45, 90),
            'race': np.random.choice(['White', 'Black', 'Hispanic', 'Asian'], n_samples, p=[0.6, 0.25, 0.1, 0.05]),
            'family_history': np.random.choice([0, 1], n_samples, p=[0.8, 0.2]),
            'psa_level': np.random.lognormal(1.5, 0.8, n_samples).clip(0.1, 50),
            'digital_rectal_exam': np.random.choice(['Normal', 'Abnormal'], n_samples, p=[0.6, 0.4]),
            'prostate_volume': np.random.normal(40, 15, n_samples).clip(15, 100),
            'difficulty_urinating': np.random.choice([0, 1], n_samples, p=[0.4, 0.6]),
            'frequent_urination': np.random.choice([0, 1], n_samples, p=[0.3, 0.7]),
            'blood_in_urine': np.random.choice([0, 1], n_samples, p=[0.8, 0.2]),
            'erectile_dysfunction': np.random.choice([0, 1], n_samples, p=[0.5, 0.5]),
            'bone_pain': np.random.choice([0, 1], n_samples, p=[0.8, 0.2]),
            'gleason_score': np.random.choice([6, 7, 8, 9, 10], n_samples, p=[0.3, 0.4, 0.2, 0.08, 0.02]),
            'tumor_stage': np.random.choice(['T1', 'T2', 'T3', 'T4'], n_samples, p=[0.4, 0.35, 0.2, 0.05]),
            'lymph_nodes_involved': np.random.choice([0, 1], n_samples, p=[0.8, 0.2]),
            'metastasis': np.random.choice([0, 1], n_samples, p=[0.85, 0.15]),
            'survival_months': np.random.exponential(48, n_samples).clip(6, 150)
        }
        
        return pd.DataFrame(data)
    
    def generate_colon_cancer_dataset(self, n_samples=2000):
        """Generate colon cancer specific dataset"""
        np.random.seed(45)
        
        data = {
            'patient_id': range(1, n_samples + 1),
            'age': np.random.normal(62, 14, n_samples).clip(30, 85),
            'gender': np.random.choice(['Male', 'Female'], n_samples, p=[0.52, 0.48]),
            'family_history_colorectal': np.random.choice([0, 1], n_samples, p=[0.75, 0.25]),
            'inflammatory_bowel_disease': np.random.choice([0, 1], n_samples, p=[0.9, 0.1]),
            'polyps_history': np.random.choice([0, 1], n_samples, p=[0.6, 0.4]),
            'diet_red_meat': np.random.choice(['Low', 'Moderate', 'High'], n_samples, p=[0.3, 0.5, 0.2]),
            'fiber_intake': np.random.choice(['Low', 'Moderate', 'High'], n_samples, p=[0.4, 0.4, 0.2]),
            'smoking_status': np.random.choice(['Never', 'Former', 'Current'], n_samples, p=[0.5, 0.3, 0.2]),
            'alcohol_consumption': np.random.choice(['None', 'Light', 'Moderate', 'Heavy'], n_samples, p=[0.3, 0.4, 0.2, 0.1]),
            'physical_activity': np.random.choice(['Low', 'Moderate', 'High'], n_samples, p=[0.4, 0.4, 0.2]),
            'abdominal_pain': np.random.choice([0, 1], n_samples, p=[0.4, 0.6]),
            'change_bowel_habits': np.random.choice([0, 1], n_samples, p=[0.3, 0.7]),
            'blood_in_stool': np.random.choice([0, 1], n_samples, p=[0.5, 0.5]),
            'weight_loss': np.random.choice([0, 1], n_samples, p=[0.6, 0.4]),
            'fatigue': np.random.choice([0, 1], n_samples, p=[0.5, 0.5]),
            'cea_level': np.random.lognormal(1.2, 0.6, n_samples).clip(0.5, 100),
            'tumor_location': np.random.choice(['Right', 'Left', 'Rectum'], n_samples, p=[0.35, 0.35, 0.3]),
            'tumor_size_cm': np.random.lognormal(1.1, 0.4, n_samples).clip(0.5, 12),
            'lymph_nodes_positive': np.random.poisson(2, n_samples).clip(0, 20),
            'stage': np.random.choice(['I', 'II', 'III', 'IV'], n_samples, p=[0.25, 0.35, 0.25, 0.15]),
            'survival_months': np.random.exponential(36, n_samples).clip(3, 120)
        }
        
        return pd.DataFrame(data)
    
    def save_all_datasets(self):
        """Generate and save all cancer datasets"""
        datasets = {
            'lung_cancer': self.generate_lung_cancer_dataset(),
            'breast_cancer': self.generate_breast_cancer_dataset(),
            'prostate_cancer': self.generate_prostate_cancer_dataset(),
            'colon_cancer': self.generate_colon_cancer_dataset()
        }
        
        for name, dataset in datasets.items():
            filename = f'{name}_dataset.csv'
            dataset.to_csv(filename, index=False)
            print(f"Saved {filename} with {len(dataset)} samples")
        
        return datasets

# Generate datasets
if __name__ == "__main__":
    generator = CancerDatasetGenerator()
    datasets = generator.save_all_datasets()
    
    # Display summary statistics
    for name, df in datasets.items():
        print(f"\n{name.upper()} Dataset Summary:")
        print(f"Shape: {df.shape}")
        print(f"Columns: {list(df.columns)}")
        print(f"Age range: {df['age'].min():.1f} - {df['age'].max():.1f}")
