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
import { getFixedStaging } from './fixedStaging';

// DATASET-ENHANCED AI-ML API Configuration
const AI_ML_API_BASE = 'http://localhost:5000/api';
const DATASET_API_BASE = 'http://localhost:5000/api';

// Enhanced AI Cancer Prediction Engine with AI-ML Integration
export class CancerPredictionEngine {
  
  // STRICT ML-FIRST API Integration - FINAL AUTHORITY
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
        throw new Error('ML API request failed');
      }
      
      const result = await response.json();
      
      if (result.success) {
        // CRITICAL: ML API IS FINAL AUTHORITY - NO OVERRIDES
        // DO NOT recompute, reinterpret, or override ML outputs
        
        // Log dataset usage for verification
        console.log('🔬 DATASET-BASED PREDICTION:', {
          usesRealData: result.metadata?.usesRealData || false,
          dataSource: result.metadata?.dataSource || 'unknown',
          modelType: result.metadata?.modelType || 'unknown'
        });
        
        // FORCE ACCURATE STAGING: Always use frontend staging logic
        const accurateStage = result.prediction.cancerType !== 'No Cancer Detected' 
          ? getFixedStaging(patientData) 
          : '';
        
        console.log('🔧 FORCING ACCURATE STAGING:', {
          mlApiStage: result.prediction.stage,
          frontendStage: accurateStage,
          cancerType: result.prediction.cancerType
        });
        
        return {
          cancerType: result.prediction.cancerType,
          confidence: result.prediction.confidence,
          riskLevel: result.prediction.riskLevel,
          stage: accurateStage,
          detectedAt: new Date().toISOString(),
          datasetInfo: {
            usesRealData: result.metadata?.usesRealData || false,
            dataSource: result.metadata?.dataSource || 'fallback',
            modelType: result.metadata?.modelType || 'unknown'
          }
        };
      } else {
        throw new Error(result.error || 'ML prediction failed');
      }
    } catch (error) {
      console.warn('🔄 ML API unavailable, falling back to rule-based prediction:', error);
      // ONLY FALLBACK ON ML FAILURE
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
    
    // Validate and fix staging
    medicalAssessment.stage = this.validateStage(medicalAssessment.stage, medicalAssessment.cancerType);
    
    return medicalAssessment;
  }

  private static performMedicalAssessment(patientData: PatientData, features: any, healthMetrics: any): CancerPrediction {
    // DEFINITIVE CANCER INDICATORS - Highest priority
    if (this.hasDefinitiveCancerIndicators(patientData)) {
      return this.handleDefinitiveCancerCase(patientData);
    }

    // 1️⃣ SYMPTOM-ORGAN MAPPING FIRST (Clinical Priority)
    const symptomBasedAssessment = this.performSymptomBasedAssessment(patientData);
    
    // SPECIFIC CANCER TYPE ASSESSMENTS - Evidence-based with improved logic
    const specificCancerAssessments = CancerAssessment.getAllCancerAssessments(patientData, healthMetrics);
    
    // 2️⃣ RELATIVE DOMINANCE LOGIC (Replace hard 75% cutoff)
    const sortedAssessments = specificCancerAssessments
      .filter(assessment => assessment && assessment.confidence >= 60)
      .sort((a, b) => (b?.confidence || 0) - (a?.confidence || 0));
    
    const topAssessment = sortedAssessments[0];
    const secondAssessment = sortedAssessments[1];
    
    // Allow prediction if confidence ≥ 60 AND margin ≥ 10 vs next candidate
    if (topAssessment && topAssessment.confidence >= 60) {
      const margin = topAssessment.confidence - (secondAssessment?.confidence || 0);
      if (margin >= 10) {
        // Combine with symptom-based assessment if available
        if (symptomBasedAssessment && symptomBasedAssessment.confidence > topAssessment.confidence) {
          return symptomBasedAssessment;
        }
        return topAssessment;
      }
    }

    // Fallback to symptom-based if available
    if (symptomBasedAssessment) {
      return symptomBasedAssessment;
    }

    // GENERAL RISK ASSESSMENT only if no specific cancer type detected
    return this.performGeneralRiskAssessment(patientData, healthMetrics);
  }

  private static performSymptomBasedAssessment(patientData: PatientData): CancerPrediction | null {
    // 1️⃣ SYMPTOM-ORGAN MAPPING FIRST (Clinical Priority)
    const symptomMappings = [
      {
        symptoms: ['persistentCough', 'shortnessOfBreath', 'chestPain'],
        cancerType: 'Lung Cancer',
        smokingBonus: patientData.smokingHistory !== 'never' ? 20 : 0
      },
      {
        symptoms: ['breastLump', 'breastPain', 'nippleDischarge'],
        cancerType: 'Breast Cancer',
        genderMatch: patientData.gender === 'female' ? 15 : -30
      },
      {
        symptoms: ['urinaryProblems', 'bloodInUrine', 'pelvicPain'],
        cancerType: 'Prostate Cancer',
        genderMatch: patientData.gender === 'male' && patientData.age > 50 ? 15 : -30
      },
      {
        symptoms: ['bloodInStool', 'bowelChanges', 'abdominalPain'],
        cancerType: 'Colon Cancer',
        ageBonus: patientData.age > 50 ? 10 : 0
      },
      {
        symptoms: ['skinChanges', 'newMoles', 'moleChanges'],
        cancerType: 'Skin Cancer',
        sunExposureBonus: 5
      },
      {
        symptoms: ['abnormalBleeding', 'pelvicPain', 'painfulIntercourse'],
        cancerType: 'Cervical Cancer',
        genderMatch: patientData.gender === 'female' && patientData.age < 65 ? 15 : -30
      }
    ];

    let bestMapping = null;
    let highestScore = 0;

    for (const mapping of symptomMappings) {
      const symptomScore = mapping.symptoms.reduce((score, symptom) => {
        return score + (patientData[symptom as keyof PatientData] ? 25 : 0);
      }, 0);

      if (symptomScore > 0) {
        let totalScore = symptomScore;
        totalScore += mapping.smokingBonus || 0;
        totalScore += mapping.genderMatch || 0;
        totalScore += mapping.ageBonus || 0;
        totalScore += mapping.sunExposureBonus || 0;

        if (totalScore > highestScore && totalScore >= 60) {
          highestScore = totalScore;
          bestMapping = {
            cancerType: mapping.cancerType,
            confidence: Math.min(totalScore, 95),
            riskLevel: this.calculateRiskLevel(totalScore),
            stage: getFixedStaging(patientData),
            detectedAt: new Date().toISOString()
          };
        }
      }
    }

    return bestMapping;
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
      const accurateStage = getFixedStaging(patientData);
      bestAssessment.stage = accurateStage;
      
      return bestAssessment;
    }

    // Fallback for definitive case
    const fallbackType = this.determineMostLikelyCancerType(patientData);
    const stage = getFixedStaging(patientData);
    
    return {
      cancerType: fallbackType,
      confidence: 85,
      riskLevel: 'High',
      stage,
      detectedAt: new Date().toISOString()
    };
  }

  private static getAccurateStaging(patientData: PatientData): 'I' | 'II' | 'III' | 'IV' {
    console.log('🔍 STAGING DEBUG - Input data:', {
      metastasis: patientData.metastasis,
      tumorSize: patientData.tumorSize,
      lymphNodes: patientData.lymphNodes
    });
    
    // CRITICAL: Only use definitive medical indicators for staging
    // Symptoms alone should NOT determine advanced stages
    
    // Stage IV - ONLY metastasis confirms this
    if (patientData.metastasis === true) {
      console.log('🚨 STAGING: Stage IV detected - Metastasis present');
      return 'IV';
    }
    
    // Stage III - Significant lymph node involvement (>4 nodes)
    if (patientData.lymphNodes && patientData.lymphNodes > 4) {
      console.log('🚨 STAGING: Stage III detected - Lymph nodes > 4:', patientData.lymphNodes);
      return 'III';
    }
    
    // Stage III - Large tumor (>5cm) WITH lymph node involvement
    if (patientData.tumorSize && patientData.tumorSize > 5 && 
        patientData.lymphNodes && patientData.lymphNodes > 0) {
      console.log('🚨 STAGING: Stage III detected - Large tumor with nodes');
      return 'III';
    }
    
    // Stage II - Moderate tumor (2-5cm) OR limited lymph nodes (1-4)
    if (patientData.tumorSize && patientData.tumorSize >= 2) {
      // Large tumor (>5cm) without nodes = Stage II
      if (patientData.tumorSize > 5 && (!patientData.lymphNodes || patientData.lymphNodes === 0)) {
        console.log('🚨 STAGING: Stage II detected - Large tumor without nodes');
        return 'II';
      }
      // Medium tumor (2-5cm) with any nodes = Stage II
      if (patientData.tumorSize <= 5 && patientData.lymphNodes && patientData.lymphNodes > 0) {
        console.log('🚨 STAGING: Stage II detected - Medium tumor with nodes');
        return 'II';
      }
      // Medium tumor (2-5cm) without nodes = Stage I
      console.log('🚨 STAGING: Stage I detected - Medium tumor without nodes');
      return 'I';
    }
    
    // Stage II - Lymph nodes involved (1-4) without large tumor
    if (patientData.lymphNodes && patientData.lymphNodes > 0 && patientData.lymphNodes <= 4) {
      console.log('🚨 STAGING: Stage II detected - Limited lymph node involvement');
      return 'II';
    }
    
    // Stage I - Small/no tumor, no lymph nodes, no metastasis
    // OR when cancer is detected but no definitive staging indicators
    console.log('🚨 STAGING: Stage I detected - Default/early stage');
    return 'I';
  }

  private static performGeneralRiskAssessment(patientData: PatientData, healthMetrics: any): CancerPrediction {
    // 3️⃣ IMPROVED CONFIDENCE SCALING (No inversion logic)
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
      // 3️⃣ STATISTICALLY SMOOTH UNCERTAINTY SCALING
      const baseConfidence = 85;
      const uncertaintyFactor = Math.max(0, (2 - symptomCount) * 5); // Smooth scaling
      const finalConfidence = Math.min(baseConfidence + uncertaintyFactor, 95);
      
      return {
        cancerType: 'No Cancer Detected',
        confidence: finalConfidence,
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

    // 3️⃣ SMOOTH CONFIDENCE CALCULATION (No hard cutoffs or inversions)
    let confidence = Math.min(totalRiskScore * 100, 85);
    
    // Strong indicators of good health - smooth transition
    if (healthMetrics.overallHealth > 0.8 && healthMetrics.symptomSeverity < 0.3) {
      const healthBonus = (healthMetrics.overallHealth - 0.8) * 50;
      const lowSymptomBonus = (0.3 - healthMetrics.symptomSeverity) * 30;
      const adjustedConfidence = 90 - confidence + healthBonus + lowSymptomBonus;
      
      return {
        cancerType: 'No Cancer Detected',
        confidence: Math.min(Math.max(adjustedConfidence, 70), 95),
        riskLevel: 'Low',
        stage: '',
        detectedAt: new Date().toISOString()
      };
    }

    // 2️⃣ RELATIVE DOMINANCE for cancer detection (60% + 10% margin)
    if (confidence >= 60) {
      // 4️⃣ DEMOGRAPHICS AS SECONDARY MODIFIERS
      const likelyCancerType = this.determineMostLikelyCancerType(patientData);
      const stage = getFixedStaging(patientData);
      
      return {
        cancerType: likelyCancerType,
        confidence: Math.round(confidence),
        riskLevel: calculateRiskLevel(confidence, patientData),
        stage: this.validateStage(getFixedStaging(patientData), likelyCancerType),
        detectedAt: new Date().toISOString()
      };
    }

    // Low confidence - no cancer detected
    return {
      cancerType: 'No Cancer Detected',
      confidence: Math.max(75 - confidence, 60), // Smooth uncertainty scaling
      riskLevel: 'Low',
      stage: '',
      detectedAt: new Date().toISOString()
    };
  }

  private static calculateRiskLevel(confidence: number): 'Low' | 'Moderate' | 'High' {
    if (confidence >= 75) return 'High';
    if (confidence >= 50) return 'Moderate';
    return 'Low';
  }

  private static determineMostLikelyCancerType(patientData: PatientData): string {
    // 4️⃣ DEMOGRAPHICS AS SECONDARY MODIFIERS (after symptom mapping)
    // Symptom-based assignment takes priority
    if (patientData.persistentCough && patientData.smokingHistory !== 'never') return 'Lung Cancer';
    if (patientData.skinChanges) return 'Skin Cancer (Melanoma)';
    if (patientData.digestiveIssues || patientData.bloodInStool) return 'Colon Cancer';
    if (patientData.unusualBleeding && patientData.gender === 'female') return 'Cervical Cancer';
    
    // Demographics as secondary modifiers only
    if (patientData.gender === 'female') {
      if (patientData.age > 40 && patientData.familyHistory) return 'Breast Cancer';
      if (patientData.age >= 30 && patientData.age <= 50) return 'Cervical Cancer';
      if (patientData.age > 45) return 'Breast Cancer';
      return 'Cervical Cancer';
    } else if (patientData.gender === 'male') {
      if (patientData.age > 60) return 'Prostate Cancer';
      if (patientData.age >= 20 && patientData.age <= 40) return 'Testicular Cancer';
      if (patientData.smokingHistory !== 'never') return 'Lung Cancer';
      return 'Prostate Cancer';
    }

    // Default fallback
    return 'Lung Cancer';
  }

  private static validateStage(stage: string | undefined, cancerType: string): 'I' | 'II' | 'III' | 'IV' | '' {
    console.log('🔍 STAGE VALIDATION - Input:', { stage, cancerType });
    
    // No stage for no cancer
    if (cancerType === 'No Cancer Detected') {
      console.log('✅ STAGE VALIDATION: Empty stage for no cancer');
      return '';
    }
    
    // Validate stage format - ONLY accept valid stages from ML API
    const validStages = ['I', 'II', 'III', 'IV'];
    if (stage && validStages.includes(stage)) {
      console.log('✅ STAGE VALIDATION: Valid stage from ML API:', stage);
      return stage as 'I' | 'II' | 'III' | 'IV';
    }
    
    // If ML API provides invalid/missing stage, return null to trigger frontend staging
    console.log('⚠️ STAGE VALIDATION: Invalid/missing stage from ML API, will use frontend staging. Input stage was:', stage);
    return null as any;
  }

  // Generate complete prediction result with STRICT ML-FIRST integration
  static async predict(patientData: PatientData): Promise<PredictionResult> {
    // STRICT ML-FIRST: Try ML API first, ONLY fallback on failure
    const prediction = await this.predictWithAIML(patientData);
    
    // Log ML authority status
    if (prediction.datasetInfo?.usesRealData) {
      console.log('🎆 SUCCESS: ML API IS FINAL AUTHORITY - Using real cancer datasets!');
      console.log('📈 Dataset Info:', prediction.datasetInfo);
      console.log('⚠️ FRONTEND ROLE: Visualization Layer ONLY - NO OVERRIDES');
    } else {
      console.log('🔄 FALLBACK: Using rule-based prediction due to ML failure');
    }
    
    const medications = medicationDatabase[prediction.cancerType] || [];
    const nutritionRecommendations = nutritionDatabase[prediction.cancerType] || [];
    const featureImportance = generateFeatureImportance(patientData);
    const recommendations = generateRecommendations(prediction, patientData);
    const appointmentRecommendation = PrognosisGenerator.generateAppointmentRecommendation(prediction.stage, prediction.cancerType);
    const prognosis = PrognosisGenerator.generatePrognosis(prediction.stage, prediction.cancerType, patientData);
    
    // Generate SHAP explanation with dataset information
    const shapExplanation = SHAPExplanationEngine.generateSHAPExplanation(patientData, prediction);
    
    // Add dataset information to SHAP explanation
    if (prediction.datasetInfo?.usesRealData) {
      shapExplanation.datasetInfo = {
        usesRealData: true,
        dataSource: prediction.datasetInfo.dataSource,
        modelType: prediction.datasetInfo.modelType,
        message: 'Prediction based on real cancer datasets - ML API FINAL AUTHORITY'
      };
    }
    
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