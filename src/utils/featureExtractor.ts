
import { PatientData } from '@/types/healthcare';

// Enhanced feature extraction with medical accuracy improvements
export function extractFeatures(data: PatientData) {
  return {
    // Demographic features (normalized and medically weighted)
    age: Math.min(data.age / 90, 1), // Normalize to 0-1, cap at 90
    genderScore: data.gender === 'female' ? 0.55 : 0.45, // Slight female bias for certain cancers
    
    // Smoking (most important modifiable risk factor)
    smokingScore: data.smokingHistory === 'current' ? 0.95 : 
                 data.smokingHistory === 'former' ? 0.65 : 0.15,
    
    // Genetic factors
    familyHistoryScore: data.familyHistory ? 0.85 : 0.25,
    
    // Metabolic and physical health
    bmiScore: data.bmi > 35 ? 0.8 : 
             data.bmi > 30 ? 0.65 : 
             data.bmi > 25 ? 0.45 : 
             data.bmi < 18.5 ? 0.55 : 0.3,
    
    // Cardiovascular health indicators
    bloodPressureScore: (data.bloodPressure.systolic > 160 || data.bloodPressure.diastolic > 100) ? 0.8 :
                       (data.bloodPressure.systolic > 140 || data.bloodPressure.diastolic > 90) ? 0.6 : 0.3,
    
    // Metabolic markers
    cholesterolScore: data.cholesterol > 280 ? 0.8 : 
                     data.cholesterol > 240 ? 0.65 : 
                     data.cholesterol > 200 ? 0.45 : 0.25,
    
    glucoseScore: data.glucose > 180 ? 0.85 : 
                 data.glucose > 126 ? 0.7 : 
                 data.glucose > 100 ? 0.45 : 0.2,
    
    // Hematological markers (important cancer indicators)
    hemoglobinScore: data.hemoglobin < 8 ? 0.9 :
                    data.hemoglobin < 10 ? 0.7 :
                    data.hemoglobin < 12 ? 0.5 : 0.3,
    
    wbcScore: data.whiteBloodCells > 15000 ? 0.9 :
             data.whiteBloodCells > 11000 ? 0.7 :
             data.whiteBloodCells < 4000 ? 0.6 : 0.3,
    
    plateletScore: data.platelets > 600000 ? 0.8 :
                  data.platelets < 100000 ? 0.7 :
                  data.platelets < 150000 ? 0.5 : 0.3,
    
    // Cancer-specific indicators (highest weight)
    tumorSizeScore: data.tumorSize ? Math.min(data.tumorSize / 5, 1) : 0,
    lymphNodesScore: data.lymphNodes ? Math.min(data.lymphNodes / 10, 1) : 0,
    metastasisScore: data.metastasis ? 1.0 : 0.1,
    
    // Lifestyle factors - Fixed enum values
    alcoholScore: data.alcoholConsumption === 'heavy' ? 0.8 :
                 data.alcoholConsumption === 'moderate' ? 0.5 :
                 data.alcoholConsumption === 'occasional' ? 0.3 : 0.2,
    
    exerciseScore: data.exerciseFrequency === 'none' ? 0.8 :
                  data.exerciseFrequency === 'light' ? 0.5 :
                  data.exerciseFrequency === 'moderate' ? 0.3 : 0.2,
    
    // Symptom severity scoring
    symptomSeverityScore: calculateSymptomSeverity(data),
    
    // Environmental and occupational
    occupationalExposureScore: data.occupationalExposure ? 0.7 : 0.2,
    radiationExposureScore: data.radiationExposure ? 0.8 : 0.1,
    
    // Sleep and stress (immune system factors)
    sleepScore: data.sleepHours ? 
               (data.sleepHours < 6 || data.sleepHours > 9) ? 0.6 : 0.3 : 0.4,
    stressScore: data.stressLevel === 'high' ? 0.7 :
                data.stressLevel === 'moderate' ? 0.5 : 0.3
  };
}

// Calculate symptom severity with medical weighting
function calculateSymptomSeverity(data: PatientData): number {
  const symptoms = [
    { symptom: data.unexplainedWeightLoss, weight: 0.9 }, // Red flag symptom
    { symptom: data.persistentFatigue, weight: 0.6 },
    { symptom: data.unusualBleeding, weight: 0.8 }, // Red flag symptom
    { symptom: data.persistentCough, weight: 0.7 },
    { symptom: data.skinChanges, weight: 0.8 }, // Important for skin cancer
    { symptom: data.digestiveIssues, weight: 0.7 }
  ];
  
  let totalWeight = 0;
  let presentWeight = 0;
  
  symptoms.forEach(({ symptom, weight }) => {
    totalWeight += weight;
    if (symptom) presentWeight += weight;
  });
  
  return totalWeight > 0 ? presentWeight / totalWeight : 0;
}
