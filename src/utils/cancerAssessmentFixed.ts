import { PatientData, CancerPrediction } from '@/types/healthcare';
import { getFixedStaging } from './fixedStaging';

export class CancerAssessment {
  static assessBreastCancer(patientData: PatientData, healthMetrics: any): CancerPrediction | null {
    let riskScore = 0;
    
    if (patientData.gender === 'female') {
      riskScore += 20;
      if (patientData.age > 50) riskScore += 25;
      else if (patientData.age > 40) riskScore += 15;
      else if (patientData.age > 30) riskScore += 5;
    } else {
      if (patientData.age > 60) riskScore += 10;
      else return null;
    }
    
    if (patientData.familyHistory) riskScore += 30;
    if (patientData.tumorSize && patientData.tumorSize > 0) riskScore += 40;
    if (patientData.lymphNodes && patientData.lymphNodes > 0) riskScore += 35;
    if (patientData.metastasis) riskScore += 50;
    if (patientData.unusualBleeding) riskScore += 15;
    if (patientData.unexplainedWeightLoss) riskScore += 12;
    if (patientData.persistentFatigue) riskScore += 8;
    if (patientData.hemoglobin < 11) riskScore += 10;
    if (patientData.whiteBloodCells > 11000) riskScore += 8;
    if (patientData.alcoholConsumption === 'heavy') riskScore += 8;
    if (patientData.exerciseFrequency === 'none') riskScore += 5;
    if (patientData.bmi > 30) riskScore += 6;
    
    if (riskScore >= 60) {
      const stage = getFixedStaging(patientData);
      return {
        cancerType: 'Breast Cancer',
        confidence: Math.min(riskScore + 10, 95),
        riskLevel: stage === 'I' ? 'Medium' : 'High',
        stage,
        detectedAt: new Date().toISOString()
      };
    }
    
    return null;
  }

  static assessLungCancer(patientData: PatientData, healthMetrics: any): CancerPrediction | null {
    let riskScore = 0;
    
    if (patientData.smokingHistory === 'current') riskScore += 50;
    else if (patientData.smokingHistory === 'former') riskScore += 25;
    else riskScore += 5;
    
    if (patientData.age > 65) riskScore += 20;
    else if (patientData.age > 55) riskScore += 15;
    else if (patientData.age > 45) riskScore += 8;
    
    if (patientData.tumorSize && patientData.tumorSize > 0) riskScore += 35;
    if (patientData.lymphNodes && patientData.lymphNodes > 0) riskScore += 30;
    if (patientData.metastasis) riskScore += 45;
    if (patientData.persistentCough) riskScore += 25;
    if (patientData.unexplainedWeightLoss) riskScore += 15;
    if (patientData.persistentFatigue) riskScore += 10;
    if (patientData.familyHistory) riskScore += 12;
    if (patientData.occupationalExposure) riskScore += 10;
    if (patientData.radiationExposure) riskScore += 8;
    
    if (riskScore >= 65) {
      const stage = getFixedStaging(patientData);
      return {
        cancerType: 'Lung Cancer',
        confidence: Math.min(riskScore + 5, 95),
        riskLevel: stage === 'I' ? 'Medium' : 'High',
        stage,
        detectedAt: new Date().toISOString()
      };
    }
    
    return null;
  }

  static assessProstateCancer(patientData: PatientData, healthMetrics: any): CancerPrediction | null {
    if (patientData.gender !== 'male') return null;
    
    let riskScore = 0;
    
    if (patientData.age > 70) riskScore += 35;
    else if (patientData.age > 60) riskScore += 25;
    else if (patientData.age > 50) riskScore += 15;
    else if (patientData.age < 40) return null;
    
    if (patientData.tumorSize && patientData.tumorSize > 0) riskScore += 40;
    if (patientData.lymphNodes && patientData.lymphNodes > 0) riskScore += 35;
    if (patientData.metastasis) riskScore += 45;
    if (patientData.familyHistory) riskScore += 20;
    if (patientData.unexplainedWeightLoss) riskScore += 12;
    if (patientData.persistentFatigue) riskScore += 8;
    if (patientData.unusualBleeding) riskScore += 10;
    if (patientData.hemoglobin < 12) riskScore += 8;
    
    if (riskScore >= 60) {
      const stage = getFixedStaging(patientData);
      return {
        cancerType: 'Prostate Cancer',
        confidence: Math.min(riskScore + 15, 95),
        riskLevel: stage === 'I' ? 'Medium' : 'High',
        stage,
        detectedAt: new Date().toISOString()
      };
    }
    
    return null;
  }

  static assessColonCancer(patientData: PatientData, healthMetrics: any): CancerPrediction | null {
    let riskScore = 0;
    
    if (patientData.digestiveIssues) riskScore += 30;
    if (patientData.unusualBleeding) riskScore += 25;
    
    if (patientData.age > 60) riskScore += 20;
    else if (patientData.age > 50) riskScore += 15;
    else if (patientData.age > 40) riskScore += 8;
    
    if (patientData.tumorSize && patientData.tumorSize > 0) riskScore += 35;
    if (patientData.lymphNodes && patientData.lymphNodes > 0) riskScore += 30;
    if (patientData.metastasis) riskScore += 40;
    if (patientData.familyHistory) riskScore += 18;
    if (patientData.unexplainedWeightLoss) riskScore += 12;
    if (patientData.persistentFatigue) riskScore += 8;
    if (patientData.bmi > 30) riskScore += 8;
    if (patientData.alcoholConsumption === 'heavy') riskScore += 8;
    if (patientData.exerciseFrequency === 'none') riskScore += 5;
    if (patientData.hemoglobin < 11) riskScore += 12;
    
    if (riskScore >= 65) {
      const stage = getFixedStaging(patientData);
      return {
        cancerType: 'Colon Cancer',
        confidence: Math.min(riskScore + 8, 95),
        riskLevel: stage === 'I' ? 'Medium' : 'High',
        stage,
        detectedAt: new Date().toISOString()
      };
    }
    
    return null;
  }

  static assessSkinCancer(patientData: PatientData, healthMetrics: any): CancerPrediction | null {
    let riskScore = 0;
    
    if (patientData.skinChanges) {
      riskScore += 40;
    } else {
      return null;
    }
    
    if (patientData.tumorSize && patientData.tumorSize > 0) riskScore += 30;
    if (patientData.lymphNodes && patientData.lymphNodes > 0) riskScore += 25;
    if (patientData.metastasis) riskScore += 35;
    
    if (patientData.age > 60) riskScore += 15;
    else if (patientData.age > 40) riskScore += 10;
    
    if (patientData.familyHistory) riskScore += 12;
    if (patientData.sunExposure === 'high') riskScore += 15;
    if (patientData.unexplainedWeightLoss) riskScore += 8;
    
    if (riskScore >= 60) {
      const stage = getFixedStaging(patientData);
      return {
        cancerType: 'Skin Cancer (Melanoma)',
        confidence: Math.min(riskScore + 12, 95),
        riskLevel: stage === 'I' ? 'Medium' : 'High',
        stage,
        detectedAt: new Date().toISOString()
      };
    }
    
    return null;
  }

  static assessCervicalCancer(patientData: PatientData, healthMetrics: any): CancerPrediction | null {
    if (patientData.gender !== 'female') return null;
    
    let riskScore = 0;
    
    if (patientData.age >= 30 && patientData.age <= 50) riskScore += 15;
    else if (patientData.age > 50 && patientData.age <= 65) riskScore += 10;
    else if (patientData.age < 25) return null;
    
    if (patientData.tumorSize && patientData.tumorSize > 0) riskScore += 35;
    if (patientData.lymphNodes && patientData.lymphNodes > 0) riskScore += 30;
    if (patientData.metastasis) riskScore += 40;
    if (patientData.unusualBleeding) riskScore += 25;
    if (patientData.unexplainedWeightLoss) riskScore += 10;
    if (patientData.persistentFatigue) riskScore += 8;
    if (patientData.familyHistory) riskScore += 12;
    
    if (riskScore >= 60) {
      const stage = getFixedStaging(patientData);
      return {
        cancerType: 'Cervical Cancer',
        confidence: Math.min(riskScore + 10, 95),
        riskLevel: stage === 'I' ? 'Medium' : 'High',
        stage,
        detectedAt: new Date().toISOString()
      };
    }
    
    return null;
  }

  static assessOvarianCancer(patientData: PatientData, healthMetrics: any): CancerPrediction | null {
    if (patientData.gender !== 'female') return null;
    
    let riskScore = 0;
    
    if (patientData.age > 55) riskScore += 20;
    else if (patientData.age > 45) riskScore += 12;
    else if (patientData.age > 35) riskScore += 8;
    
    if (patientData.tumorSize && patientData.tumorSize > 0) riskScore += 35;
    if (patientData.lymphNodes && patientData.lymphNodes > 0) riskScore += 30;
    if (patientData.metastasis) riskScore += 40;
    if (patientData.familyHistory) riskScore += 25;
    if (patientData.digestiveIssues) riskScore += 15;
    if (patientData.unexplainedWeightLoss) riskScore += 12;
    if (patientData.persistentFatigue) riskScore += 10;
    
    if (riskScore >= 65) {
      const stage = getFixedStaging(patientData);
      return {
        cancerType: 'Ovarian Cancer',
        confidence: Math.min(riskScore + 8, 95),
        riskLevel: stage === 'I' ? 'Medium' : 'High',
        stage,
        detectedAt: new Date().toISOString()
      };
    }
    
    return null;
  }

  static assessTesticularCancer(patientData: PatientData, healthMetrics: any): CancerPrediction | null {
    if (patientData.gender !== 'male') return null;
    
    let riskScore = 0;
    
    if (patientData.age >= 20 && patientData.age <= 35) riskScore += 20;
    else if (patientData.age <= 45) riskScore += 10;
    else if (patientData.age > 50) return null;
    
    if (patientData.tumorSize && patientData.tumorSize > 0) riskScore += 40;
    if (patientData.lymphNodes && patientData.lymphNodes > 0) riskScore += 35;
    if (patientData.metastasis) riskScore += 45;
    if (patientData.unexplainedWeightLoss) riskScore += 15;
    if (patientData.persistentFatigue) riskScore += 10;
    if (patientData.familyHistory) riskScore += 15;
    
    if (riskScore >= 65) {
      const stage = getFixedStaging(patientData);
      return {
        cancerType: 'Testicular Cancer',
        confidence: Math.min(riskScore + 12, 95),
        riskLevel: stage === 'I' ? 'Medium' : 'High',
        stage,
        detectedAt: new Date().toISOString()
      };
    }
    
    return null;
  }

  static assessLiverCancer(patientData: PatientData, healthMetrics: any): CancerPrediction | null {
    let riskScore = 0;
    
    if (patientData.age > 60) riskScore += 15;
    else if (patientData.age > 50) riskScore += 10;
    
    if (patientData.tumorSize && patientData.tumorSize > 0) riskScore += 35;
    if (patientData.lymphNodes && patientData.lymphNodes > 0) riskScore += 30;
    if (patientData.metastasis) riskScore += 40;
    if (patientData.alcoholConsumption === 'heavy') riskScore += 20;
    if (patientData.bmi > 30) riskScore += 12;
    if (patientData.digestiveIssues) riskScore += 15;
    if (patientData.unexplainedWeightLoss) riskScore += 15;
    if (patientData.persistentFatigue) riskScore += 10;
    if (patientData.glucose > 126) riskScore += 8;
    if (patientData.familyHistory) riskScore += 10;
    
    if (riskScore >= 65) {
      const stage = getFixedStaging(patientData);
      return {
        cancerType: 'Liver Cancer',
        confidence: Math.min(riskScore + 5, 95),
        riskLevel: stage === 'I' ? 'Medium' : 'High',
        stage,
        detectedAt: new Date().toISOString()
      };
    }
    
    return null;
  }

  static assessPancreaticCancer(patientData: PatientData, healthMetrics: any): CancerPrediction | null {
    let riskScore = 0;
    
    if (patientData.age > 65) riskScore += 20;
    else if (patientData.age > 55) riskScore += 15;
    else if (patientData.age > 45) riskScore += 8;
    
    if (patientData.tumorSize && patientData.tumorSize > 0) riskScore += 40;
    if (patientData.lymphNodes && patientData.lymphNodes > 0) riskScore += 35;
    if (patientData.metastasis) riskScore += 45;
    if (patientData.unexplainedWeightLoss) riskScore += 20;
    if (patientData.digestiveIssues) riskScore += 18;
    if (patientData.persistentFatigue) riskScore += 12;
    
    if (patientData.smokingHistory === 'current') riskScore += 15;
    else if (patientData.smokingHistory === 'former') riskScore += 8;
    
    if (patientData.glucose > 126) riskScore += 12;
    if (patientData.familyHistory) riskScore += 15;
    
    if (riskScore >= 70) {
      const stage = getFixedStaging(patientData);
      return {
        cancerType: 'Pancreatic Cancer',
        confidence: Math.min(riskScore + 5, 95),
        riskLevel: 'High',
        stage,
        detectedAt: new Date().toISOString()
      };
    }
    
    return null;
  }

  static getAllCancerAssessments(patientData: PatientData, healthMetrics: any): (CancerPrediction | null)[] {
    return [
      this.assessBreastCancer(patientData, healthMetrics),
      this.assessLungCancer(patientData, healthMetrics),
      this.assessProstateCancer(patientData, healthMetrics),
      this.assessColonCancer(patientData, healthMetrics),
      this.assessSkinCancer(patientData, healthMetrics),
      this.assessCervicalCancer(patientData, healthMetrics),
      this.assessOvarianCancer(patientData, healthMetrics),
      this.assessTesticularCancer(patientData, healthMetrics),
      this.assessLiverCancer(patientData, healthMetrics),
      this.assessPancreaticCancer(patientData, healthMetrics)
    ].filter(assessment => assessment !== null);
  }
}