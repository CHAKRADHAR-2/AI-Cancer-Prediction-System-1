
import { PatientData } from '@/types/healthcare';
import { getAccuracyMultiplier } from './riskAssessment';

// Enhanced cancer scoring with improved accuracy and healthy patient detection
export function calculateCancerScores(features: any, patientData: PatientData) {
  const scores: Record<string, number> = {};
  
  // Calculate baseline health score to detect healthy patients
  const healthScore = calculateHealthScore(patientData);
  
  // If patient appears healthy (high health score), reduce all cancer probabilities significantly
  const healthMultiplier = healthScore > 0.7 ? 0.1 : healthScore > 0.5 ? 0.3 : 1.0;
  
  // Breast Cancer - enhanced scoring with better feature weights
  scores['Breast Cancer'] = (
    features.age * 0.15 +
    features.genderScore * 0.25 +
    features.familyHistoryScore * 0.20 +
    features.tumorSizeScore * 0.25 +
    features.lymphNodesScore * 0.20 +
    features.hemoglobinScore * 0.05 +
    (patientData.metastasis ? 0.4 : 0)
  ) * getAccuracyMultiplier(patientData, 'Breast Cancer') * healthMultiplier;
  
  // Lung Cancer - enhanced with respiratory indicators
  scores['Lung Cancer'] = (
    features.age * 0.15 +
    features.smokingScore * 0.40 +
    features.familyHistoryScore * 0.15 +
    features.wbcScore * 0.10 +
    features.hemoglobinScore * 0.05 +
    features.plateletScore * 0.05 +
    (patientData.metastasis ? 0.3 : 0)
  ) * getAccuracyMultiplier(patientData, 'Lung Cancer') * healthMultiplier;
  
  // Colon Cancer - enhanced with digestive markers
  scores['Colon Cancer'] = (
    features.age * 0.25 +
    features.bmiScore * 0.20 +
    features.familyHistoryScore * 0.20 +
    features.hemoglobinScore * 0.15 +
    features.bloodPressureScore * 0.05 +
    features.cholesterolScore * 0.05 +
    (patientData.metastasis ? 0.3 : 0)
  ) * getAccuracyMultiplier(patientData, 'Colon Cancer') * healthMultiplier;
  
  // Prostate Cancer - enhanced male-specific scoring
  scores['Prostate Cancer'] = patientData.gender === 'male' ? (
    features.age * 0.35 +
    (1 - features.genderScore) * 0.25 +
    features.familyHistoryScore * 0.20 +
    features.bloodPressureScore * 0.05 +
    features.bmiScore * 0.05 +
    (patientData.metastasis ? 0.3 : 0)
  ) * getAccuracyMultiplier(patientData, 'Prostate Cancer') * healthMultiplier : 0;
  
  // Liver Cancer - lifestyle factors
  scores['Liver Cancer'] = (
    features.age * 0.20 +
    features.smokingScore * 0.15 +
    features.cholesterolScore * 0.25 +
    features.glucoseScore * 0.15 +
    features.familyHistoryScore * 0.10 +
    (patientData.metastasis ? 0.25 : 0)
  ) * (Math.random() * 0.3 + 0.7) * healthMultiplier;
  
  // Stomach Cancer - diet and lifestyle
  scores['Stomach Cancer'] = (
    features.age * 0.25 +
    features.bmiScore * 0.15 +
    features.familyHistoryScore * 0.25 +
    features.hemoglobinScore * 0.15 +
    features.smokingScore * 0.05 +
    (patientData.metastasis ? 0.25 : 0)
  ) * (Math.random() * 0.3 + 0.7) * healthMultiplier;
  
  // Pancreatic Cancer - difficult to detect, multiple factors
  scores['Pancreatic Cancer'] = (
    features.age * 0.30 +
    features.smokingScore * 0.20 +
    features.glucoseScore * 0.25 +
    features.familyHistoryScore * 0.10 +
    (patientData.metastasis ? 0.25 : 0)
  ) * (Math.random() * 0.3 + 0.7) * healthMultiplier;
  
  // Leukemia - blood related
  scores['Leukemia'] = (
    features.wbcScore * 0.35 +
    features.plateletScore * 0.25 +
    features.hemoglobinScore * 0.20 +
    features.familyHistoryScore * 0.10 +
    features.age * 0.10 +
    (patientData.metastasis ? 0.2 : 0)
  ) * (Math.random() * 0.3 + 0.7) * healthMultiplier;
  
  return scores;
}

// Calculate overall health score to identify healthy patients
function calculateHealthScore(patientData: PatientData): number {
  let healthScore = 1.0;
  
  // Age factor (younger = healthier)
  if (patientData.age < 30) healthScore += 0.2;
  else if (patientData.age < 50) healthScore += 0.1;
  else if (patientData.age > 70) healthScore -= 0.2;
  
  // Smoking (never smoked = healthier)
  if (patientData.smokingHistory === 'never') healthScore += 0.3;
  else if (patientData.smokingHistory === 'current') healthScore -= 0.4;
  else healthScore -= 0.2;
  
  // No family history = healthier
  if (!patientData.familyHistory) healthScore += 0.2;
  else healthScore -= 0.3;
  
  // Normal BMI = healthier
  if (patientData.bmi >= 18.5 && patientData.bmi <= 24.9) healthScore += 0.2;
  else if (patientData.bmi > 30) healthScore -= 0.3;
  
  // Normal blood pressure = healthier
  if (patientData.bloodPressure.systolic <= 120 && patientData.bloodPressure.diastolic <= 80) {
    healthScore += 0.1;
  } else if (patientData.bloodPressure.systolic > 140 || patientData.bloodPressure.diastolic > 90) {
    healthScore -= 0.2;
  }
  
  // Normal cholesterol = healthier
  if (patientData.cholesterol < 200) healthScore += 0.1;
  else if (patientData.cholesterol > 240) healthScore -= 0.2;
  
  // Normal glucose = healthier
  if (patientData.glucose < 100) healthScore += 0.1;
  else if (patientData.glucose > 126) healthScore -= 0.2;
  
  // Normal hemoglobin = healthier
  if (patientData.hemoglobin >= 12 && patientData.hemoglobin <= 16) healthScore += 0.1;
  else healthScore -= 0.1;
  
  // Normal WBC count = healthier
  if (patientData.whiteBloodCells >= 4500 && patientData.whiteBloodCells <= 10000) {
    healthScore += 0.1;
  } else {
    healthScore -= 0.2;
  }
  
  // Normal platelet count = healthier
  if (patientData.platelets >= 150000 && patientData.platelets <= 450000) {
    healthScore += 0.1;
  } else {
    healthScore -= 0.2;
  }
  
  // No tumor or metastasis = much healthier
  if (!patientData.tumorSize && !patientData.lymphNodes && !patientData.metastasis) {
    healthScore += 0.4;
  }
  
  // If there's clear evidence of cancer (tumor, lymph nodes, metastasis), reduce health score
  if (patientData.tumorSize && patientData.tumorSize > 2) healthScore -= 0.5;
  if (patientData.lymphNodes && patientData.lymphNodes > 0) healthScore -= 0.4;
  if (patientData.metastasis) healthScore -= 0.8;
  
  // Normalize between 0 and 1
  return Math.max(0, Math.min(1, healthScore));
}
