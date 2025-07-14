import { PatientData, FeatureImportance } from '@/types/healthcare';
import { extractFeatures } from './featureExtractor';

// Generate feature importance (simulating SHAP values)
export function generateFeatureImportance(patientData: PatientData): FeatureImportance[] {
  const features = extractFeatures(patientData);
  
  const importance: FeatureImportance[] = [
    { feature: 'Age', importance: features.age * 100, impact: features.age > 0.6 ? 'positive' : 'negative' },
    { feature: 'Smoking History', importance: features.smokingScore * 100, impact: features.smokingScore > 0.5 ? 'positive' : 'negative' },
    { feature: 'Family History', importance: features.familyHistoryScore * 100, impact: features.familyHistoryScore > 0.5 ? 'positive' : 'negative' },
    { feature: 'BMI', importance: features.bmiScore * 100, impact: features.bmiScore > 0.5 ? 'positive' : 'negative' },
    { feature: 'Blood Pressure', importance: features.bloodPressureScore * 100, impact: features.bloodPressureScore > 0.5 ? 'positive' : 'negative' },
    { feature: 'Cholesterol', importance: features.cholesterolScore * 100, impact: features.cholesterolScore > 0.5 ? 'positive' : 'negative' },
    { feature: 'White Blood Cells', importance: features.wbcScore * 100, impact: features.wbcScore > 0.5 ? 'positive' : 'negative' },
    { feature: 'Hemoglobin', importance: features.hemoglobinScore * 100, impact: features.hemoglobinScore > 0.5 ? 'positive' : 'negative' }
  ];
  
  if (patientData.tumorSize) {
    importance.push({ feature: 'Tumor Size', importance: features.tumorSizeScore * 100, impact: 'positive' });
  }
  
  if (patientData.lymphNodes) {
    importance.push({ feature: 'Lymph Nodes', importance: features.lymphNodesScore * 100, impact: 'positive' });
  }
  
  return importance.sort((a, b) => b.importance - a.importance);
}