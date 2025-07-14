
import { PatientData } from '@/types/healthcare';

export class HealthMetrics {
  static calculateAdvancedHealthMetrics(patientData: PatientData) {
    const metrics = {
      overallHealth: 1.0,
      cancerRiskFactors: 0,
      protectiveFactors: 0,
      symptomSeverity: 0,
      geneticRisk: 0,
      environmentalRisk: 0,
      ageRisk: 0
    };

    // Age-based risk assessment (more medically accurate)
    if (patientData.age < 30) {
      metrics.ageRisk = 0.1;
      metrics.protectiveFactors += 0.3;
    } else if (patientData.age < 45) {
      metrics.ageRisk = 0.2;
      metrics.protectiveFactors += 0.1;
    } else if (patientData.age < 60) {
      metrics.ageRisk = 0.4;
    } else if (patientData.age < 75) {
      metrics.ageRisk = 0.6;
      metrics.cancerRiskFactors += 0.2;
    } else {
      metrics.ageRisk = 0.8;
      metrics.cancerRiskFactors += 0.4;
    }

    // Genetic and family history (strong medical correlation)
    if (patientData.familyHistory) {
      metrics.geneticRisk = 0.7;
      metrics.cancerRiskFactors += 0.5;
    } else {
      metrics.protectiveFactors += 0.2;
    }

    // Smoking (major cancer risk factor)
    if (patientData.smokingHistory === 'current') {
      metrics.cancerRiskFactors += 0.8;
      metrics.environmentalRisk += 0.6;
    } else if (patientData.smokingHistory === 'former') {
      metrics.cancerRiskFactors += 0.4;
      metrics.environmentalRisk += 0.3;
    } else {
      metrics.protectiveFactors += 0.3;
    }

    // Lifestyle protective factors
    if (patientData.exerciseFrequency === 'moderate' || patientData.exerciseFrequency === 'heavy') {
      metrics.protectiveFactors += 0.25;
    }
    
    if (patientData.alcoholConsumption === 'never') {
      metrics.protectiveFactors += 0.15;
    } else if (patientData.alcoholConsumption === 'heavy') {
      metrics.cancerRiskFactors += 0.3;
    }

    // BMI and metabolic health
    if (patientData.bmi >= 18.5 && patientData.bmi <= 24.9) {
      metrics.protectiveFactors += 0.2;
    } else if (patientData.bmi > 30) {
      metrics.cancerRiskFactors += 0.25;
    }

    // Laboratory values assessment
    if (patientData.hemoglobin < 10 || patientData.hemoglobin > 17) {
      metrics.cancerRiskFactors += 0.2;
    }
    
    if (patientData.whiteBloodCells > 12000 || patientData.whiteBloodCells < 4000) {
      metrics.cancerRiskFactors += 0.3;
    }
    
    if (patientData.platelets < 100000 || patientData.platelets > 500000) {
      metrics.cancerRiskFactors += 0.25;
    }

    // Symptom severity scoring
    const redFlagSymptoms = [
      patientData.unexplainedWeightLoss,
      patientData.persistentFatigue,
      patientData.unusualBleeding,
      patientData.persistentCough,
      patientData.skinChanges,
      patientData.digestiveIssues
    ];
    
    const symptomCount = redFlagSymptoms.filter(Boolean).length;
    metrics.symptomSeverity = Math.min(symptomCount * 0.2, 1.0);
    metrics.cancerRiskFactors += metrics.symptomSeverity;

    // Definitive cancer indicators
    if (patientData.tumorSize && patientData.tumorSize > 0) {
      metrics.cancerRiskFactors += 1.0; // Strong indicator
    }
    
    if (patientData.lymphNodes && patientData.lymphNodes > 0) {
      metrics.cancerRiskFactors += 0.8;
    }
    
    if (patientData.metastasis) {
      metrics.cancerRiskFactors += 1.0; // Definitive
    }
    
    if (patientData.previousCancerHistory) {
      metrics.cancerRiskFactors += 0.6;
    }

    // Calculate overall health score
    metrics.overallHealth = Math.max(0.1, 
      1.0 - metrics.cancerRiskFactors + metrics.protectiveFactors - metrics.ageRisk * 0.3
    );

    return metrics;
  }
}
