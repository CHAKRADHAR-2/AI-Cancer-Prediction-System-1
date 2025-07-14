import { PatientData, CancerPrediction } from '@/types/healthcare';

export class CancerAssessment {
  static assessBreastCancer(patientData: PatientData, healthMetrics: any): CancerPrediction | null {
    // Only assess for females primarily, but males can get breast cancer too
    let riskScore = 0;
    
    // Gender factor (females have much higher risk)
    if (patientData.gender === 'female') {
      riskScore += 20; // Base score for being female
      
      // Age-specific risk for women
      if (patientData.age > 50) riskScore += 25;
      else if (patientData.age > 40) riskScore += 15;
      else if (patientData.age > 30) riskScore += 5;
    } else {
      // Males can get breast cancer but it's rare
      if (patientData.age > 60) riskScore += 10;
      else return null; // Very unlikely in younger males
    }
    
    // Strong genetic component for breast cancer
    if (patientData.familyHistory) riskScore += 30;
    
    // Definitive indicators
    if (patientData.tumorSize && patientData.tumorSize > 0) riskScore += 40;
    if (patientData.lymphNodes && patientData.lymphNodes > 0) riskScore += 35;
    if (patientData.metastasis) riskScore += 50;
    
    // Symptoms specific to breast cancer
    if (patientData.unusualBleeding) riskScore += 15;
    if (patientData.unexplainedWeightLoss) riskScore += 12;
    if (patientData.persistentFatigue) riskScore += 8;
    
    // Laboratory abnormalities
    if (patientData.hemoglobin < 11) riskScore += 10;
    if (patientData.whiteBloodCells > 11000) riskScore += 8;
    
    // Lifestyle factors
    if (patientData.alcoholConsumption === 'heavy') riskScore += 8;
    if (patientData.exerciseFrequency === 'none') riskScore += 5;
    if (patientData.bmi > 30) riskScore += 6;
    
    if (riskScore >= 60) {
      const stage = this.getAccurateStaging(patientData);
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
    
    // Primary risk factor - smoking
    if (patientData.smokingHistory === 'current') riskScore += 50;
    else if (patientData.smokingHistory === 'former') riskScore += 25;
    else riskScore += 5; // Small baseline for non-smokers
    
    // Age factor
    if (patientData.age > 65) riskScore += 20;
    else if (patientData.age > 55) riskScore += 15;
    else if (patientData.age > 45) riskScore += 8;
    
    // Definitive indicators
    if (patientData.tumorSize && patientData.tumorSize > 0) riskScore += 35;
    if (patientData.lymphNodes && patientData.lymphNodes > 0) riskScore += 30;
    if (patientData.metastasis) riskScore += 45;
    
    // Lung-specific symptoms
    if (patientData.persistentCough) riskScore += 25;
    if (patientData.unexplainedWeightLoss) riskScore += 15;
    if (patientData.persistentFatigue) riskScore += 10;
    
    // Family history
    if (patientData.familyHistory) riskScore += 12;
    
    // Environmental factors
    if (patientData.occupationalExposure) riskScore += 10;
    if (patientData.radiationExposure) riskScore += 8;
    
    if (riskScore >= 65) {
      const stage = this.getAccurateStaging(patientData);
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
    
    // Age is crucial for prostate cancer
    if (patientData.age > 70) riskScore += 35;
    else if (patientData.age > 60) riskScore += 25;
    else if (patientData.age > 50) riskScore += 15;
    else if (patientData.age < 40) return null; // Very rare under 40
    
    // Definitive indicators
    if (patientData.tumorSize && patientData.tumorSize > 0) riskScore += 40;
    if (patientData.lymphNodes && patientData.lymphNodes > 0) riskScore += 35;
    if (patientData.metastasis) riskScore += 45;
    
    // Family history is important
    if (patientData.familyHistory) riskScore += 20;
    
    // Symptoms
    if (patientData.unexplainedWeightLoss) riskScore += 12;
    if (patientData.persistentFatigue) riskScore += 8;
    if (patientData.unusualBleeding) riskScore += 10; // Could indicate advanced disease
    
    // Laboratory values
    if (patientData.hemoglobin < 12) riskScore += 8;
    
    if (riskScore >= 60) {
      const stage = this.getAccurateStaging(patientData);
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
    
    // Key symptoms for colon cancer
    if (patientData.digestiveIssues) riskScore += 30;
    if (patientData.unusualBleeding) riskScore += 25; // Rectal bleeding is major sign
    
    // Age factor
    if (patientData.age > 60) riskScore += 20;
    else if (patientData.age > 50) riskScore += 15;
    else if (patientData.age > 40) riskScore += 8;
    
    // Definitive indicators
    if (patientData.tumorSize && patientData.tumorSize > 0) riskScore += 35;
    if (patientData.lymphNodes && patientData.lymphNodes > 0) riskScore += 30;
    if (patientData.metastasis) riskScore += 40;
    
    // Family history
    if (patientData.familyHistory) riskScore += 18;
    
    // Other symptoms
    if (patientData.unexplainedWeightLoss) riskScore += 12;
    if (patientData.persistentFatigue) riskScore += 8;
    
    // Lifestyle factors
    if (patientData.bmi > 30) riskScore += 8;
    if (patientData.alcoholConsumption === 'heavy') riskScore += 8;
    if (patientData.exerciseFrequency === 'none') riskScore += 5;
    
    // Laboratory values
    if (patientData.hemoglobin < 11) riskScore += 12; // Anemia from bleeding
    
    if (riskScore >= 65) {
      const stage = this.getAccurateStaging(patientData);
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
    
    // Primary symptom - skin changes are essential
    if (patientData.skinChanges) {
      riskScore += 40;
    } else {
      return null; // Skin changes are primary indicator for skin cancer
    }
    
    // Definitive indicators
    if (patientData.tumorSize && patientData.tumorSize > 0) riskScore += 30;
    if (patientData.lymphNodes && patientData.lymphNodes > 0) riskScore += 25;
    if (patientData.metastasis) riskScore += 35;
    
    // Age factor
    if (patientData.age > 60) riskScore += 15;
    else if (patientData.age > 40) riskScore += 10;
    
    // Family history
    if (patientData.familyHistory) riskScore += 12;
    
    // Sun exposure (if available)
    if (patientData.sunExposure === 'high') riskScore += 15;
    
    // Other symptoms
    if (patientData.unexplainedWeightLoss) riskScore += 8;
    
    if (riskScore >= 60) {
      const stage = this.getAccurateStaging(patientData);
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
    
    // Age factor (peak incidence 35-44)
    if (patientData.age >= 30 && patientData.age <= 50) riskScore += 15;
    else if (patientData.age > 50 && patientData.age <= 65) riskScore += 10;
    else if (patientData.age < 25) return null; // Very rare under 25
    
    // Definitive indicators
    if (patientData.tumorSize && patientData.tumorSize > 0) riskScore += 35;
    if (patientData.lymphNodes && patientData.lymphNodes > 0) riskScore += 30;
    if (patientData.metastasis) riskScore += 40;
    
    // Symptoms
    if (patientData.unusualBleeding) riskScore += 25; // Key symptom
    if (patientData.unexplainedWeightLoss) riskScore += 10;
    if (patientData.persistentFatigue) riskScore += 8;
    
    // Risk factors
    if (patientData.familyHistory) riskScore += 12;
    
    if (riskScore >= 60) {
      const stage = this.getAccurateStaging(patientData);
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
    
    // Age factor (more common after menopause)
    if (patientData.age > 55) riskScore += 20;
    else if (patientData.age > 45) riskScore += 12;
    else if (patientData.age > 35) riskScore += 8;
    
    // Definitive indicators
    if (patientData.tumorSize && patientData.tumorSize > 0) riskScore += 35;
    if (patientData.lymphNodes && patientData.lymphNodes > 0) riskScore += 30;
    if (patientData.metastasis) riskScore += 40;
    
    // Strong genetic component
    if (patientData.familyHistory) riskScore += 25;
    
    // Symptoms (often vague)
    if (patientData.digestiveIssues) riskScore += 15;
    if (patientData.unexplainedWeightLoss) riskScore += 12;
    if (patientData.persistentFatigue) riskScore += 10;
    
    if (riskScore >= 65) {
      const stage = this.getAccurateStaging(patientData);
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
    
    // Age factor (peak incidence 20-35)
    if (patientData.age >= 20 && patientData.age <= 35) riskScore += 20;
    else if (patientData.age <= 45) riskScore += 10;
    else if (patientData.age > 50) return null; // Much less common after 50
    
    // Definitive indicators
    if (patientData.tumorSize && patientData.tumorSize > 0) riskScore += 40;
    if (patientData.lymphNodes && patientData.lymphNodes > 0) riskScore += 35;
    if (patientData.metastasis) riskScore += 45;
    
    // Symptoms
    if (patientData.unexplainedWeightLoss) riskScore += 15;
    if (patientData.persistentFatigue) riskScore += 10;
    
    // Family history
    if (patientData.familyHistory) riskScore += 15;
    
    if (riskScore >= 65) {
      const stage = this.getAccurateStaging(patientData);
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
    
    // Age factor
    if (patientData.age > 60) riskScore += 15;
    else if (patientData.age > 50) riskScore += 10;
    
    // Definitive indicators
    if (patientData.tumorSize && patientData.tumorSize > 0) riskScore += 35;
    if (patientData.lymphNodes && patientData.lymphNodes > 0) riskScore += 30;
    if (patientData.metastasis) riskScore += 40;
    
    // Risk factors
    if (patientData.alcoholConsumption === 'heavy') riskScore += 20;
    if (patientData.bmi > 30) riskScore += 12;
    
    // Symptoms
    if (patientData.digestiveIssues) riskScore += 15;
    if (patientData.unexplainedWeightLoss) riskScore += 15;
    if (patientData.persistentFatigue) riskScore += 10;
    
    // Laboratory values
    if (patientData.glucose > 126) riskScore += 8; // Diabetes connection
    
    // Family history
    if (patientData.familyHistory) riskScore += 10;
    
    if (riskScore >= 65) {
      const stage = this.getAccurateStaging(patientData);
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
    
    // Age factor
    if (patientData.age > 65) riskScore += 20;
    else if (patientData.age > 55) riskScore += 15;
    else if (patientData.age > 45) riskScore += 8;
    
    // Definitive indicators
    if (patientData.tumorSize && patientData.tumorSize > 0) riskScore += 40;
    if (patientData.lymphNodes && patientData.lymphNodes > 0) riskScore += 35;
    if (patientData.metastasis) riskScore += 45;
    
    // Major symptoms
    if (patientData.unexplainedWeightLoss) riskScore += 20; // Very common in pancreatic cancer
    if (patientData.digestiveIssues) riskScore += 18;
    if (patientData.persistentFatigue) riskScore += 12;
    
    // Risk factors
    if (patientData.smokingHistory === 'current') riskScore += 15;
    else if (patientData.smokingHistory === 'former') riskScore += 8;
    
    if (patientData.glucose > 126) riskScore += 12; // New-onset diabetes
    if (patientData.familyHistory) riskScore += 15;
    
    if (riskScore >= 70) {
      const stage = this.getAccurateStaging(patientData);
      return {
        cancerType: 'Pancreatic Cancer',
        confidence: Math.min(riskScore + 5, 95),
        riskLevel: 'High', // Pancreatic cancer is always high risk
        stage,
        detectedAt: new Date().toISOString()
      };
    }
    
    return null;
  }

  private static getAccurateStaging(patientData: PatientData): 'I' | 'II' | 'III' | 'IV' {
    // Stage IV - Metastasis present
    if (patientData.metastasis) {
      return 'IV';
    }
    
    // Stage III - Significant lymph node involvement or large tumor with nodes
    if (patientData.lymphNodes && patientData.lymphNodes > 4) {
      return 'III';
    }
    
    if (patientData.tumorSize && patientData.tumorSize > 5 && 
        patientData.lymphNodes && patientData.lymphNodes > 0) {
      return 'III';
    }
    
    // Stage II - Moderate tumor size or limited lymph node involvement
    if (patientData.tumorSize && patientData.tumorSize > 2) {
      if (patientData.lymphNodes && patientData.lymphNodes > 0) {
        return patientData.tumorSize > 5 ? 'III' : 'II';
      }
      return 'II';
    }
    
    if (patientData.lymphNodes && patientData.lymphNodes > 0 && patientData.lymphNodes <= 3) {
      return 'II';
    }
    
    // Multiple red flag symptoms might indicate higher stage
    const symptomCount = [
      patientData.unexplainedWeightLoss,
      patientData.persistentFatigue,
      patientData.unusualBleeding,
      patientData.persistentCough,
      patientData.skinChanges,
      patientData.digestiveIssues
    ].filter(Boolean).length;
    
    if (symptomCount >= 4) {
      return 'II';
    }
    
    // Stage I - Early stage, small tumor, no spread
    return 'I';
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
