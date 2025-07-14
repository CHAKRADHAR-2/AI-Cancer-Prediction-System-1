
import { PatientData } from '@/types/healthcare';

// Enhanced accuracy multiplier based on comprehensive risk factors
export function getAccuracyMultiplier(patientData: PatientData, cancerType: string): number {
  let multiplier = 0.85; // Base accuracy
  
  // Age-based accuracy (more accurate for older patients due to more data)
  if (patientData.age > 50) multiplier += 0.08;
  if (patientData.age > 65) multiplier += 0.05;
  
  // Strong family history significantly increases accuracy
  if (patientData.familyHistory) multiplier += 0.10;
  
  // Definitive medical indicators provide highest accuracy
  if (patientData.tumorSize && patientData.tumorSize > 2) multiplier += 0.15;
  if (patientData.lymphNodes && patientData.lymphNodes > 0) multiplier += 0.12;
  if (patientData.metastasis) multiplier += 0.18;
  if (patientData.previousCancerHistory) multiplier += 0.08;
  
  // Cancer-specific accuracy improvements based on known risk factors
  switch (cancerType) {
    case 'Lung Cancer':
      if (patientData.smokingHistory === 'current') multiplier += 0.12;
      if (patientData.persistentCough) multiplier += 0.08;
      break;
      
    case 'Breast Cancer':
      if (patientData.gender === 'female' && patientData.familyHistory) multiplier += 0.10;
      if (patientData.age > 50 && patientData.gender === 'female') multiplier += 0.08;
      break;
      
    case 'Prostate Cancer':
      if (patientData.gender === 'male' && patientData.age > 60) multiplier += 0.12;
      break;
      
    case 'Colon Cancer':
      if (patientData.digestiveIssues && patientData.unusualBleeding) multiplier += 0.10;
      if (patientData.age > 50) multiplier += 0.06;
      break;
      
    case 'Skin Cancer (Melanoma)':
      if (patientData.skinChanges) multiplier += 0.15;
      break;
  }
  
  // Multiple symptoms increase accuracy
  const symptoms = [
    patientData.unexplainedWeightLoss,
    patientData.persistentFatigue,
    patientData.unusualBleeding,
    patientData.persistentCough,
    patientData.skinChanges,
    patientData.digestiveIssues
  ];
  const symptomCount = symptoms.filter(Boolean).length;
  if (symptomCount >= 3) multiplier += 0.08;
  
  // Laboratory abnormalities
  if (patientData.whiteBloodCells > 11000 || patientData.whiteBloodCells < 4000) multiplier += 0.05;
  if (patientData.hemoglobin < 10) multiplier += 0.05;
  if (patientData.platelets < 150000) multiplier += 0.04;
  
  // Cap maximum accuracy to maintain realistic bounds
  return Math.min(multiplier, 0.96);
}

// Enhanced risk level calculation with medical accuracy
export function calculateRiskLevel(confidence: number, patientData: PatientData): 'Low' | 'Medium' | 'High' {
  let riskScore = 0;
  
  // Age-based risk
  if (patientData.age > 70) riskScore += 3;
  else if (patientData.age > 60) riskScore += 2;
  else if (patientData.age > 50) riskScore += 1;
  
  // Major risk factors
  if (patientData.smokingHistory === 'current') riskScore += 3;
  else if (patientData.smokingHistory === 'former') riskScore += 2;
  
  if (patientData.familyHistory) riskScore += 2;
  if (patientData.previousCancerHistory) riskScore += 3;
  
  // Obesity and lifestyle
  if (patientData.bmi > 30) riskScore += 2;
  if (patientData.alcoholConsumption === 'heavy') riskScore += 2;
  if (patientData.exerciseFrequency === 'none') riskScore += 1;
  
  // Definitive indicators
  if (patientData.metastasis) riskScore += 5;
  if (patientData.tumorSize && patientData.tumorSize > 0) riskScore += 4;
  if (patientData.lymphNodes && patientData.lymphNodes > 0) riskScore += 3;
  
  // Multiple symptoms
  const symptoms = [
    patientData.unexplainedWeightLoss,
    patientData.persistentFatigue,
    patientData.unusualBleeding,
    patientData.persistentCough,
    patientData.skinChanges,
    patientData.digestiveIssues
  ];
  const symptomCount = symptoms.filter(Boolean).length;
  riskScore += symptomCount;
  
  // Risk level determination based on confidence and risk factors
  if (confidence > 75 || riskScore >= 8) return 'High';
  if (confidence > 50 || riskScore >= 4) return 'Medium';
  return 'Low';
}
