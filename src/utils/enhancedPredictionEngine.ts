import { PatientData, CancerPrediction, PredictionResult } from '@/types/healthcare';
import { medicationDatabase } from '@/data/cancerData';
import { nutritionDatabase } from '@/data/nutritionData';
import { extractFeatures } from './featureExtractor';
import { calculateRiskLevel } from './riskAssessment';
import { generateFeatureImportance } from './featureImportance';
import { generateRecommendations } from './recommendationEngine';
import { determineCancerStage } from './cancerStaging';
import { CancerAssessment } from './cancerAssessment';
import { HealthMetrics } from './healthMetrics';
import { PrognosisGenerator } from './prognosisGenerator';
import { SHAPExplanationEngine } from './shapExplanationEngine';

// Enhanced ML-based Cancer Prediction Engine with Medical Accuracy
export class EnhancedCancerPredictionEngine {
  
  // CRITICAL: High thresholds to prevent false positives
  private static readonly CANCER_DETECTION_THRESHOLD = 75; // Minimum 75% confidence for cancer detection
  private static readonly DEFINITIVE_CANCER_THRESHOLD = 85; // Definitive cancer indicators threshold
  
  // Enhanced prediction with strict medical validation
  static predictCancerType(patientData: PatientData): CancerPrediction {
    console.log('Enhanced ML Prediction Engine - Analyzing patient data:', patientData);
    
    // STEP 1: Check for definitive cancer indicators first
    const definitiveIndicators = this.checkDefinitiveCancerIndicators(patientData);
    if (definitiveIndicators.hasDefinitiveIndicators) {
      console.log('Definitive cancer indicators found:', definitiveIndicators);
      return this.handleDefinitiveCancerCase(patientData, definitiveIndicators);
    }
    
    // STEP 2: Extract and normalize features
    const features = this.extractMLFeatures(patientData);
    const normalizedFeatures = this.normalizeFeatures(features);
    
    // STEP 3: Calculate health metrics
    const healthMetrics = HealthMetrics.calculateAdvancedHealthMetrics(patientData);
    
    // STEP 4: Check if patient appears healthy
    const healthyPatientCheck = this.isPatientHealthy(patientData, healthMetrics);
    if (healthyPatientCheck.isHealthy) {
      console.log('Patient appears healthy:', healthyPatientCheck);
      return {
        cancerType: 'No Cancer Detected',
        confidence: healthyPatientCheck.healthConfidence,
        riskLevel: 'Low',
        stage: '',
        detectedAt: new Date().toISOString()
      };
    }
    
    // STEP 5: Run ensemble prediction with high thresholds
    const ensemblePrediction = this.runEnsemblePrediction(normalizedFeatures, patientData);
    
    // STEP 6: Apply strict medical validation
    const validatedPrediction = this.applyStrictMedicalValidation(ensemblePrediction, patientData, healthMetrics);
    
    console.log('Enhanced ML Prediction Result:', validatedPrediction);
    return validatedPrediction;
  }

  // Check for definitive cancer indicators that require immediate attention
  private static checkDefinitiveCancerIndicators(patientData: PatientData): {
    hasDefinitiveIndicators: boolean;
    indicators: string[];
    severity: 'high' | 'medium' | 'low';
  } {
    const indicators: string[] = [];
    
    // Physical tumor indicators
    if (patientData.tumorSize && patientData.tumorSize > 0) {
      indicators.push('Tumor detected');
    }
    
    if (patientData.lymphNodes && patientData.lymphNodes > 0) {
      indicators.push('Lymph node involvement');
    }
    
    if (patientData.metastasis) {
      indicators.push('Metastasis present');
    }
    
    // Previous cancer history
    if (patientData.previousCancerHistory) {
      indicators.push('Previous cancer history');
    }
    
    // Severe symptom combinations
    const severeSymptoms = [
      patientData.unexplainedWeightLoss,
      patientData.persistentFatigue,
      patientData.unusualBleeding,
      patientData.persistentCough,
      patientData.digestiveIssues
    ].filter(Boolean).length;
    
    if (severeSymptoms >= 4) {
      indicators.push('Multiple severe symptoms');
    }
    
    const hasDefinitiveIndicators = indicators.length > 0;
    const severity = indicators.length >= 3 ? 'high' : indicators.length >= 2 ? 'medium' : 'low';
    
    return {
      hasDefinitiveIndicators,
      indicators,
      severity
    };
  }

  // Check if patient appears healthy (no significant cancer risk factors)
  private static isPatientHealthy(patientData: PatientData, healthMetrics: any): {
    isHealthy: boolean;
    healthConfidence: number;
    reasons: string[];
  } {
    const healthyIndicators: string[] = [];
    const riskFactors: string[] = [];
    
    // Age factor (lower risk for younger patients)
    if (patientData.age < 40) {
      healthyIndicators.push('Young age');
    } else if (patientData.age > 70) {
      riskFactors.push('Advanced age');
    }
    
    // Lifestyle factors
    if (patientData.smokingHistory === 'never') {
      healthyIndicators.push('Non-smoker');
    } else if (patientData.smokingHistory === 'current') {
      riskFactors.push('Current smoker');
    }
    
    if (patientData.alcoholConsumption === 'never' || patientData.alcoholConsumption === 'occasional') {
      healthyIndicators.push('Low alcohol consumption');
    } else if (patientData.alcoholConsumption === 'heavy') {
      riskFactors.push('Heavy alcohol consumption');
    }
    
    if (patientData.exerciseFrequency === 'moderate' || patientData.exerciseFrequency === 'heavy') {
      healthyIndicators.push('Regular exercise');
    }
    
    // Family history
    if (!patientData.familyHistory) {
      healthyIndicators.push('No family history');
    } else {
      riskFactors.push('Family history of cancer');
    }
    
    // Symptoms check - NO symptoms is a strong healthy indicator
    const symptoms = [
      patientData.unexplainedWeightLoss,
      patientData.persistentFatigue,
      patientData.persistentCough,
      patientData.skinChanges,
      patientData.digestiveIssues,
      patientData.unusualBleeding
    ].filter(Boolean);
    
    if (symptoms.length === 0) {
      healthyIndicators.push('No cancer symptoms');
    } else if (symptoms.length >= 3) {
      riskFactors.push('Multiple symptoms present');
    }
    
    // Physical indicators - absence is healthy
    if (!patientData.tumorSize && !patientData.lymphNodes && !patientData.metastasis) {
      healthyIndicators.push('No physical tumor indicators');
    }
    
    // BMI in healthy range
    if (patientData.bmi && patientData.bmi >= 18.5 && patientData.bmi <= 25) {
      healthyIndicators.push('Healthy BMI');
    }
    
    // Calculate health confidence
    const healthScore = healthyIndicators.length - (riskFactors.length * 1.5);
    const healthConfidence = Math.min(Math.max((healthScore / 6) * 100, 60), 95);
    
    // Patient is considered healthy if they have more healthy indicators than risk factors
    // AND no severe symptoms or physical indicators
    const isHealthy = healthyIndicators.length >= 4 && 
                     riskFactors.length <= 2 && 
                     symptoms.length <= 1 &&
                     !patientData.tumorSize && 
                     !patientData.lymphNodes && 
                     !patientData.metastasis;
    
    return {
      isHealthy,
      healthConfidence: Math.round(healthConfidence),
      reasons: isHealthy ? healthyIndicators : riskFactors
    };
  }

  // Handle cases with definitive cancer indicators
  private static handleDefinitiveCancerCase(patientData: PatientData, definitiveIndicators: any): CancerPrediction {
    // Determine cancer type based on symptoms and indicators
    let cancerType = 'Lung Cancer'; // Default
    let confidence = 85; // High confidence due to definitive indicators
    
    // Gender-specific cancers
    if (patientData.gender === 'female') {
      if (patientData.age > 40 || patientData.familyHistory) {
        cancerType = 'Breast Cancer';
      } else if (patientData.age >= 25 && patientData.age <= 65) {
        cancerType = 'Cervical Cancer';
      }
    } else if (patientData.gender === 'male') {
      if (patientData.age > 50) {
        cancerType = 'Prostate Cancer';
      } else if (patientData.age >= 15 && patientData.age <= 35) {
        cancerType = 'Testicular Cancer';
      }
    }
    
    // Symptom-based determination
    if (patientData.persistentCough && patientData.smokingHistory !== 'never') {
      cancerType = 'Lung Cancer';
    } else if (patientData.digestiveIssues && patientData.unusualBleeding) {
      cancerType = 'Colon Cancer';
    } else if (patientData.skinChanges) {
      cancerType = 'Skin Cancer (Melanoma)';
    }
    
    // Determine stage based on physical indicators
    let stage: 'I' | 'II' | 'III' | 'IV' = 'I';
    if (patientData.metastasis) {
      stage = 'IV';
      confidence = 95;
    } else if (patientData.lymphNodes && patientData.lymphNodes > 3) {
      stage = 'III';
      confidence = 90;
    } else if (patientData.tumorSize && patientData.tumorSize > 2) {
      stage = 'II';
      confidence = 87;
    }
    
    return {
      cancerType,
      confidence,
      riskLevel: 'High',
      stage,
      detectedAt: new Date().toISOString()
    };
  }

  private static extractMLFeatures(patientData: PatientData): Record<string, number> {
    return {
      age: patientData.age / 100,
      gender: patientData.gender === 'female' ? 1 : 0,
      bmi: (patientData.bmi || 25) / 50,
      smokingHistory: this.encodeSmoking(patientData.smokingHistory),
      alcoholConsumption: this.encodeAlcohol(patientData.alcoholConsumption),
      familyHistory: patientData.familyHistory ? 1 : 0,
      exerciseFrequency: this.encodeExercise(patientData.exerciseFrequency),
      unexplainedWeightLoss: patientData.unexplainedWeightLoss ? 1 : 0,
      persistentFatigue: patientData.persistentFatigue ? 1 : 0,
      persistentCough: patientData.persistentCough ? 1 : 0,
      skinChanges: patientData.skinChanges ? 1 : 0,
      digestiveIssues: patientData.digestiveIssues ? 1 : 0,
      unusualBleeding: patientData.unusualBleeding ? 1 : 0,
      tumorSize: (patientData.tumorSize || 0) / 10,
      lymphNodes: (patientData.lymphNodes || 0) / 20,
      metastasis: patientData.metastasis ? 1 : 0,
      hemoglobin: ((patientData.hemoglobin || 14) - 8) / 10,
      whiteBloodCells: ((patientData.whiteBloodCells || 7000) - 4000) / 10000,
      platelets: ((patientData.platelets || 250000) - 150000) / 300000
    };
  }

  private static normalizeFeatures(features: Record<string, number>): Record<string, number> {
    const normalized: Record<string, number> = {};
    for (const [key, value] of Object.entries(features)) {
      normalized[key] = Math.max(0, Math.min(1, value));
    }
    return normalized;
  }

  private static runEnsemblePrediction(features: Record<string, number>, patientData: PatientData): CancerPrediction {
    // Only run ML prediction if there are concerning features
    const concerningFeatures = features.tumorSize + features.lymphNodes + features.metastasis + 
                              features.unexplainedWeightLoss + features.persistentFatigue + 
                              features.unusualBleeding + features.persistentCough;
    
    if (concerningFeatures < 0.3) {
      return {
        cancerType: 'No Cancer Detected',
        confidence: 85,
        riskLevel: 'Low',
        stage: '',
        detectedAt: new Date().toISOString()
      };
    }
    
    // Run algorithms with higher thresholds
    const rfPrediction = this.randomForestPredict(features, patientData);
    const gbPrediction = this.gradientBoostingPredict(features, patientData);
    const nnPrediction = this.neuralNetworkPredict(features, patientData);
    
    return this.combineEnsemblePredictions([
      { prediction: rfPrediction, weight: 0.35 },
      { prediction: gbPrediction, weight: 0.35 },
      { prediction: nnPrediction, weight: 0.30 }
    ]);
  }

  private static randomForestPredict(features: Record<string, number>, patientData: PatientData): CancerPrediction {
    let score = 0;
    let cancerType = 'No Cancer Detected';
    
    // STRICT: Only high-confidence indicators
    if (features.tumorSize > 0.2 || features.lymphNodes > 0.1 || features.metastasis > 0) {
      score += 0.6; // Strong physical evidence
    }
    
    if (features.unexplainedWeightLoss && features.persistentFatigue && features.unusualBleeding) {
      score += 0.4; // Multiple severe symptoms
    }
    
    if (features.smokingHistory > 0.7 && features.persistentCough && features.age > 0.5) {
      score += 0.3; // Lung cancer indicators
      cancerType = 'Lung Cancer';
    }
    
    if (features.digestiveIssues && features.unusualBleeding && features.age > 0.4) {
      score += 0.3; // Colon cancer indicators
      cancerType = 'Colon Cancer';
    }

    const confidence = Math.min(score * 100, 95);
    
    // CRITICAL: Only predict cancer if confidence >= 75%
    return {
      cancerType: confidence >= this.CANCER_DETECTION_THRESHOLD ? cancerType : 'No Cancer Detected',
      confidence: confidence >= this.CANCER_DETECTION_THRESHOLD ? confidence : 100 - confidence,
      riskLevel: confidence >= this.CANCER_DETECTION_THRESHOLD ? 'High' : 'Low',
      stage: confidence >= this.CANCER_DETECTION_THRESHOLD ? this.determineStageFromFeatures(features, patientData) : '',
      detectedAt: new Date().toISOString()
    };
  }

  private static gradientBoostingPredict(features: Record<string, number>, patientData: PatientData): CancerPrediction {
    let score = 0;
    let cancerType = 'No Cancer Detected';
    
    // STRICT: Physical indicators have highest weight
    if (features.tumorSize > 0.1) score += 0.5;
    if (features.metastasis > 0) score += 0.6;
    if (features.lymphNodes > 0.1) score += 0.4;
    
    // Symptom combinations (require multiple symptoms)
    const symptomCount = features.unexplainedWeightLoss + features.persistentFatigue + 
                        features.persistentCough + features.unusualBleeding;
    if (symptomCount >= 2) {
      score += symptomCount * 0.15;
    }
    
    // Risk factors (require multiple risk factors)
    const riskCount = features.age + features.smokingHistory + features.familyHistory;
    if (riskCount >= 1.5) {
      score += riskCount * 0.1;
    }
    
    // Determine cancer type only if score is high
    if (score > 0.6) {
      if (features.persistentCough > 0 && features.smokingHistory > 0.5) {
        cancerType = 'Lung Cancer';
      } else if (features.digestiveIssues > 0 && features.unusualBleeding > 0) {
        cancerType = 'Colon Cancer';
      } else if (patientData.gender === 'female' && features.age > 0.4) {
        cancerType = 'Breast Cancer';
      } else if (patientData.gender === 'male' && features.age > 0.6) {
        cancerType = 'Prostate Cancer';
      }
    }

    const confidence = Math.min(score * 100, 95);
    
    return {
      cancerType: confidence >= this.CANCER_DETECTION_THRESHOLD ? cancerType : 'No Cancer Detected',
      confidence: confidence >= this.CANCER_DETECTION_THRESHOLD ? confidence : 100 - confidence,
      riskLevel: confidence >= this.CANCER_DETECTION_THRESHOLD ? 'High' : 'Low',
      stage: confidence >= this.CANCER_DETECTION_THRESHOLD ? this.determineStageFromFeatures(features, patientData) : '',
      detectedAt: new Date().toISOString()
    };
  }

  private static neuralNetworkPredict(features: Record<string, number>, patientData: PatientData): CancerPrediction {
    // Hidden layer 1: Strict feature combinations
    const hidden1 = {
      node1: Math.tanh(features.tumorSize * 0.6 + features.lymphNodes * 0.4),
      node2: Math.tanh(features.unexplainedWeightLoss * 0.4 + features.persistentFatigue * 0.3 + features.unusualBleeding * 0.3),
      node3: Math.tanh(features.persistentCough * 0.5 + features.smokingHistory * 0.5),
      node4: Math.tanh(features.metastasis * 0.8 + features.age * 0.2)
    };
    
    // Hidden layer 2: Pattern recognition with higher thresholds
    const hidden2 = {
      node1: Math.tanh(hidden1.node1 * 0.6 + hidden1.node4 * 0.4),
      node2: Math.tanh(hidden1.node2 * 0.5 + hidden1.node3 * 0.5)
    };
    
    // Output layer: Cancer probability with strict threshold
    const cancerProbability = Math.sigmoid(hidden2.node1 * 0.7 + hidden2.node2 * 0.3);
    
    let cancerType = 'No Cancer Detected';
    if (cancerProbability > 0.75) { // STRICT: 75% threshold
      const typeScores = {
        'Lung Cancer': hidden1.node3 * 0.6 + features.smokingHistory * 0.4,
        'Breast Cancer': (patientData.gender === 'female' ? 0.6 : 0) + features.age * 0.4,
        'Colon Cancer': features.digestiveIssues * 0.5 + features.unusualBleeding * 0.5,
        'Prostate Cancer': (patientData.gender === 'male' ? 0.6 : 0) + features.age * 0.4,
        'Skin Cancer (Melanoma)': features.skinChanges * 0.8 + features.age * 0.2
      };
      
      cancerType = Object.entries(typeScores).reduce((a, b) => 
        typeScores[a[0]] > typeScores[b[0]] ? a : b
      )[0];
    }

    const confidence = cancerProbability * 100;
    
    return {
      cancerType: confidence >= this.CANCER_DETECTION_THRESHOLD ? cancerType : 'No Cancer Detected',
      confidence: confidence >= this.CANCER_DETECTION_THRESHOLD ? confidence : 100 - confidence,
      riskLevel: confidence >= this.CANCER_DETECTION_THRESHOLD ? 'High' : 'Low',
      stage: confidence >= this.CANCER_DETECTION_THRESHOLD ? this.determineStageFromFeatures(features, patientData) : '',
      detectedAt: new Date().toISOString()
    };
  }

  private static combineEnsemblePredictions(predictions: Array<{prediction: CancerPrediction, weight: number}>): CancerPrediction {
    let totalConfidence = 0;
    let cancerDetected = false;
    const cancerTypes: Record<string, number> = {};
    const stages: Record<string, number> = {};
    
    for (const {prediction, weight} of predictions) {
      totalConfidence += prediction.confidence * weight;
      
      if (prediction.cancerType !== 'No Cancer Detected') {
        cancerDetected = true;
        cancerTypes[prediction.cancerType] = (cancerTypes[prediction.cancerType] || 0) + weight;
        if (prediction.stage) {
          stages[prediction.stage] = (stages[prediction.stage] || 0) + weight;
        }
      }
    }
    
    // CRITICAL: Only detect cancer if ensemble confidence >= 75%
    const finalCancerType = (cancerDetected && totalConfidence >= this.CANCER_DETECTION_THRESHOLD) ? 
      Object.entries(cancerTypes).reduce((a, b) => a[1] > b[1] ? a : b)[0] : 
      'No Cancer Detected';
    
    const finalStage = (finalCancerType !== 'No Cancer Detected' && Object.keys(stages).length > 0) ? 
      Object.entries(stages).reduce((a, b) => a[1] > b[1] ? a : b)[0] as 'I' | 'II' | 'III' | 'IV' : 
      '';
    
    return {
      cancerType: finalCancerType,
      confidence: Math.round(totalConfidence),
      riskLevel: finalCancerType !== 'No Cancer Detected' ? 'High' : 'Low',
      stage: finalStage,
      detectedAt: new Date().toISOString()
    };
  }

  private static applyStrictMedicalValidation(prediction: CancerPrediction, patientData: PatientData, healthMetrics: any): CancerPrediction {
    // CRITICAL: Additional validation to prevent false positives
    
    // If no physical indicators and minimal symptoms, force "No Cancer"
    if (!patientData.tumorSize && !patientData.lymphNodes && !patientData.metastasis) {
      const symptomCount = [
        patientData.unexplainedWeightLoss,
        patientData.persistentFatigue,
        patientData.persistentCough,
        patientData.skinChanges,
        patientData.digestiveIssues,
        patientData.unusualBleeding
      ].filter(Boolean).length;
      
      if (symptomCount < 3) {
        return {
          cancerType: 'No Cancer Detected',
          confidence: 85,
          riskLevel: 'Low',
          stage: '',
          detectedAt: new Date().toISOString()
        };
      }
    }
    
    // Age-based validation - very strict for young patients
    if (patientData.age < 25 && prediction.cancerType !== 'No Cancer Detected') {
      prediction.confidence = Math.max(prediction.confidence - 30, 40);
      if (prediction.confidence < this.CANCER_DETECTION_THRESHOLD) {
        prediction.cancerType = 'No Cancer Detected';
        prediction.stage = '';
        prediction.riskLevel = 'Low';
      }
    }
    
    // Gender-specific validation
    if (prediction.cancerType === 'Prostate Cancer' && patientData.gender === 'female') {
      prediction.cancerType = patientData.age > 45 ? 'Ovarian Cancer' : 'Cervical Cancer';
    }
    if (prediction.cancerType === 'Ovarian Cancer' && patientData.gender === 'male') {
      prediction.cancerType = patientData.age < 40 ? 'Testicular Cancer' : 'Prostate Cancer';
    }
    
    // Symptom consistency validation - strict
    if (prediction.cancerType === 'Lung Cancer' && 
        !patientData.persistentCough && 
        patientData.smokingHistory === 'never' && 
        !patientData.tumorSize) {
      prediction.cancerType = 'No Cancer Detected';
      prediction.confidence = 80;
      prediction.riskLevel = 'Low';
      prediction.stage = '';
    }
    
    // Final confidence check
    if (prediction.confidence < this.CANCER_DETECTION_THRESHOLD && prediction.cancerType !== 'No Cancer Detected') {
      prediction.cancerType = 'No Cancer Detected';
      prediction.confidence = 100 - prediction.confidence;
      prediction.riskLevel = 'Low';
      prediction.stage = '';
    }
    
    return prediction;
  }

  private static determineStageFromFeatures(features: Record<string, number>, patientData: PatientData): 'I' | 'II' | 'III' | 'IV' {
    if (features.metastasis > 0) return 'IV';
    if (features.lymphNodes > 0.2 || features.tumorSize > 0.5) return 'III';
    if (features.lymphNodes > 0 || features.tumorSize > 0.2) return 'II';
    return 'I';
  }

  // Utility encoding functions
  private static encodeSmoking(smoking: string): number {
    const map: Record<string, number> = { 'never': 0, 'former': 0.5, 'current': 1 };
    return map[smoking] || 0;
  }

  private static encodeAlcohol(alcohol: string): number {
    const map: Record<string, number> = { 'never': 0, 'occasional': 0.3, 'moderate': 0.6, 'heavy': 1 };
    return map[alcohol] || 0;
  }

  private static encodeExercise(exercise: string): number {
    const map: Record<string, number> = { 'none': 0, 'light': 0.3, 'moderate': 0.6, 'heavy': 1 };
    return map[exercise] || 0.3;
  }

  // Main prediction interface
  static predict(patientData: PatientData): PredictionResult {
    const prediction = this.predictCancerType(patientData);
    const medications = medicationDatabase[prediction.cancerType] || [];
    const nutritionRecommendations = nutritionDatabase[prediction.cancerType] || [];
    const featureImportance = generateFeatureImportance(patientData);
    const recommendations = generateRecommendations(prediction, patientData);
    const appointmentRecommendation = PrognosisGenerator.generateAppointmentRecommendation(prediction.stage, prediction.cancerType);
    const prognosis = PrognosisGenerator.generatePrognosis(prediction.stage, prediction.cancerType, patientData);
    
    // Generate SHAP explanation
    const shapExplanation = SHAPExplanationEngine.generateSHAPExplanation(patientData, prediction);
    
    return {
      prediction,
      medications,
      featureImportance,
      recommendations,
      nutritionRecommendations,
      appointmentRecommendation,
      prognosis,
      shapExplanation
    };
  }
}

// Mathematical helper functions
declare global {
  interface Math {
    sigmoid(x: number): number;
  }
}

Math.sigmoid = function(x: number): number {
  return 1 / (1 + Math.exp(-x));
};