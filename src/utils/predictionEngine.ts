
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

// AI-ML API Configuration
const AI_ML_API_BASE = 'http://localhost:5000/api';

// Enhanced AI Cancer Prediction Engine with AI-ML Integration
export class CancerPredictionEngine {
  
  // NEW: AI-ML API Integration
  static async predictWithAIML(patientData: PatientData): Promise<CancerPrediction> {
    try {
      const response = await fetch(`${AI_ML_API_BASE}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ patientData })
      });
      
      if (!response.ok) {
        throw new Error('AI-ML API request failed');
      }
      
      const result = await response.json();
      
      if (result.success) {
        // Convert AI-ML response to CancerPrediction format
        const stage = this.determineMedicalStage(patientData, result.prediction.cancerType);
        
        return {
          cancerType: result.prediction.cancerType,
          confidence: result.prediction.confidence,
          riskLevel: result.prediction.riskLevel,
          stage: result.prediction.cancerType === 'No Cancer' ? '' : stage,
          detectedAt: new Date().toISOString()
        };
      } else {
        throw new Error(result.error || 'AI-ML prediction failed');
      }
    } catch (error) {
      console.warn('AI-ML API unavailable, falling back to local prediction:', error);
      // Fallback to existing prediction logic
      return this.predictCancerType(patientData);
    }
  }
  
  // Advanced ML-based prediction with medical accuracy improvements
  static predictCancerType(patientData: PatientData): CancerPrediction {
    const features = extractFeatures(patientData);
    
    // Calculate comprehensive health assessment
    const healthMetrics = HealthMetrics.calculateAdvancedHealthMetrics(patientData);
    console.log('Advanced health metrics:', healthMetrics);
    
    // Apply improved medical logic with better cancer type detection
    const medicalAssessment = this.performMedicalAssessment(patientData, features, healthMetrics);
    
    // CRITICAL: Ensure medical consistency - no cancer should have empty stage
    if (medicalAssessment.cancerType !== 'No Cancer Detected' && !medicalAssessment.stage) {
      medicalAssessment.stage = this.determineMedicalStage(patientData, medicalAssessment.cancerType);
    }
    
    // If cancer detected, ensure stage is not empty
    if (medicalAssessment.cancerType !== 'No Cancer Detected' && medicalAssessment.stage === '') {
      medicalAssessment.stage = 'I'; // Default to earliest stage if detection logic suggests cancer
    }
    
    return medicalAssessment;
  }

  private static performMedicalAssessment(patientData: PatientData, features: any, healthMetrics: any): CancerPrediction {
    // DEFINITIVE CANCER INDICATORS - Highest priority
    if (this.hasDefinitiveCancerIndicators(patientData)) {
      return this.handleDefinitiveCancerCase(patientData);
    }

    // SPECIFIC CANCER TYPE ASSESSMENTS - Evidence-based with improved logic
    const specificCancerAssessments = CancerAssessment.getAllCancerAssessments(patientData, healthMetrics);
    
    // Find the highest scoring cancer type
    const highestScoringCancer = specificCancerAssessments.reduce((highest, current) => 
      (current && current.confidence > (highest?.confidence || 0)) ? current : highest
    , null);

    // STRICT: Require 75% confidence for cancer detection
    if (highestScoringCancer && highestScoringCancer.confidence >= 75) {
      return highestScoringCancer;
    }

    // GENERAL RISK ASSESSMENT only if no specific cancer type detected
    return this.performGeneralRiskAssessment(patientData, healthMetrics);
  }

  private static hasDefinitiveCancerIndicators(patientData: PatientData): boolean {
    return !!(
      (patientData.tumorSize && patientData.tumorSize > 0) ||
      (patientData.lymphNodes && patientData.lymphNodes > 0) ||
      patientData.metastasis ||
      patientData.previousCancerHistory
    );
  }

  private static handleDefinitiveCancerCase(patientData: PatientData): CancerPrediction {
    // When there are definitive indicators, determine the most likely cancer type
    const assessments = CancerAssessment.getAllCancerAssessments(patientData, HealthMetrics.calculateAdvancedHealthMetrics(patientData));
    
    // Find the highest scoring assessment
    const bestAssessment = assessments.reduce((highest, current) => 
      (current && current.confidence > (highest?.confidence || 0)) ? current : highest
    , null);

    if (bestAssessment) {
      // Boost confidence due to definitive indicators
      bestAssessment.confidence = Math.min(bestAssessment.confidence + 15, 95);
      bestAssessment.riskLevel = 'High';
      
      // Ensure accurate staging with definitive indicators
      const accurateStage = this.getAccurateStaging(patientData);
      bestAssessment.stage = accurateStage;
      
      return bestAssessment;
    }

    // Fallback for definitive case
    const fallbackType = this.determineMostLikelyCancerType(patientData);
    const stage = this.getAccurateStaging(patientData);
    
    return {
      cancerType: fallbackType,
      confidence: 85,
      riskLevel: 'High',
      stage,
      detectedAt: new Date().toISOString()
    };
  }

  private static getAccurateStaging(patientData: PatientData): 'I' | 'II' | 'III' | 'IV' {
    // More accurate staging based on medical indicators
    
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

  private static performGeneralRiskAssessment(patientData: PatientData, healthMetrics: any): CancerPrediction {
    // STRICT: Check if patient appears healthy first
    const symptomCount = [
      patientData.unexplainedWeightLoss,
      patientData.persistentFatigue,
      patientData.unusualBleeding,
      patientData.persistentCough,
      patientData.skinChanges,
      patientData.digestiveIssues
    ].filter(Boolean).length;
    
    // If no physical indicators and minimal symptoms, patient is likely healthy
    if (!patientData.tumorSize && !patientData.lymphNodes && !patientData.metastasis && symptomCount < 2) {
      return {
        cancerType: 'No Cancer Detected',
        confidence: 85,
        riskLevel: 'Low',
        stage: '',
        detectedAt: new Date().toISOString()
      };
    }

    const totalRiskScore = (
      healthMetrics.cancerRiskFactors * 40 +
      healthMetrics.symptomSeverity * 30 +
      healthMetrics.ageRisk * 20 +
      healthMetrics.geneticRisk * 30 +
      healthMetrics.environmentalRisk * 20
    );

    // Calculate confidence based on risk factors
    let confidence = Math.min(totalRiskScore * 100, 85);
    
    // Strong indicators of good health
    if (healthMetrics.overallHealth > 0.8 && healthMetrics.symptomSeverity < 0.3) {
      return {
        cancerType: 'No Cancer Detected',
        confidence: Math.min(95 - confidence, 90),
        riskLevel: 'Low',
        stage: '',
        detectedAt: new Date().toISOString()
      };
    }

    // STRICT: Require high confidence (75%+) for cancer detection
    if (confidence < 75) {
      return {
        cancerType: 'No Cancer Detected',
        confidence: Math.min(90 - confidence, 85),
        riskLevel: 'Low',
        stage: '',
        detectedAt: new Date().toISOString()
      };
    }

    // Only assign cancer type if confidence is very high
    const likelyCancerType = this.determineMostLikelyCancerType(patientData);
    const stage = this.getAccurateStaging(patientData);
    
    return {
      cancerType: likelyCancerType,
      confidence: Math.round(confidence),
      riskLevel: calculateRiskLevel(confidence, patientData),
      stage,
      detectedAt: new Date().toISOString()
    };
  }

  private static determineMostLikelyCancerType(patientData: PatientData): string {
    // Age and gender-based likelihood with improved logic
    if (patientData.gender === 'female') {
      if (patientData.age > 40 && patientData.familyHistory) return 'Breast Cancer';
      if (patientData.age >= 30 && patientData.age <= 50) return 'Cervical Cancer';
      if (patientData.digestiveIssues) return 'Colon Cancer';
      if (patientData.age > 45) return 'Breast Cancer';
      return 'Cervical Cancer';
    } else if (patientData.gender === 'male') {
      if (patientData.age > 60) return 'Prostate Cancer';
      if (patientData.age >= 20 && patientData.age <= 40) return 'Testicular Cancer';
      if (patientData.smokingHistory !== 'never') return 'Lung Cancer';
      if (patientData.digestiveIssues) return 'Colon Cancer';
      return 'Prostate Cancer';
    }

    // Symptom-based assignment
    if (patientData.persistentCough) return 'Lung Cancer';
    if (patientData.digestiveIssues) return 'Colon Cancer';
    if (patientData.skinChanges) return 'Skin Cancer (Melanoma)';
    
    // Default to most common
    return 'Lung Cancer';
  }

  private static determineMedicalStage(patientData: PatientData, cancerType: string): 'I' | 'II' | 'III' | 'IV' {
    // Use existing staging logic but ensure it's never empty for detected cancer
    const stage = determineCancerStage(patientData);
    return stage || 'I'; // Default to Stage I if determineCancerStage returns empty
  }

  // Generate complete prediction result with AI-ML integration
  static async predict(patientData: PatientData): Promise<PredictionResult> {
    // Try AI-ML prediction first, fallback to local if unavailable
    const prediction = await this.predictWithAIML(patientData);
    
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
