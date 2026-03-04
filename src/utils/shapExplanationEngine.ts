import { PatientData, CancerPrediction } from '@/types/healthcare';

// SHAP-like explanation interface
export interface SHAPExplanation {
  explanationType: 'SHAP-like' | 'Feature Importance';
  baselineProbability: number;
  predictedProbability: number;
  prediction: string;
  totalFeatures: number;
  featureContributions: FeatureContribution[];
  topRiskFactors: FeatureContribution[];
  topProtectiveFactors: FeatureContribution[];
  summary: string;
}

export interface FeatureContribution {
  feature: string;
  featureKey: string;
  shapValue: number;
  featureValue: number;
  contributionPct: number;
  impact: 'Increases Risk' | 'Decreases Risk';
  magnitude: 'High' | 'Medium' | 'Low';
}

export class SHAPExplanationEngine {
  
  // Feature importance weights (simulating SHAP values)
  private static readonly FEATURE_WEIGHTS = {
    age: 0.15,
    gender: 0.08,
    bmi: 0.06,
    smokingHistory: 0.18,
    alcoholConsumption: 0.09,
    familyHistory: 0.16,
    exerciseFrequency: 0.07,
    unexplainedWeightLoss: 0.14,
    persistentFatigue: 0.11,
    persistentCough: 0.13,
    skinChanges: 0.10,
    digestiveIssues: 0.12,
    unusualBleeding: 0.15,
    tumorSize: 0.25,
    lymphNodes: 0.22,
    metastasis: 0.30,
    hemoglobin: 0.08,
    whiteBloodCells: 0.06,
    platelets: 0.05
  };

  // Human-readable feature names
  private static readonly FEATURE_NAME_MAPPING = {
    age: 'Age',
    gender: 'Gender',
    bmi: 'Body Mass Index',
    smokingHistory: 'Smoking History',
    alcoholConsumption: 'Alcohol Consumption',
    familyHistory: 'Family History of Cancer',
    exerciseFrequency: 'Exercise Frequency',
    unexplainedWeightLoss: 'Unexplained Weight Loss',
    persistentFatigue: 'Persistent Fatigue',
    persistentCough: 'Persistent Cough',
    skinChanges: 'Skin Changes',
    digestiveIssues: 'Digestive Issues',
    unusualBleeding: 'Unusual Bleeding',
    tumorSize: 'Tumor Size',
    lymphNodes: 'Lymph Node Involvement',
    metastasis: 'Metastasis',
    hemoglobin: 'Hemoglobin Level',
    whiteBloodCells: 'White Blood Cell Count',
    platelets: 'Platelet Count'
  };

  static generateSHAPExplanation(patientData: PatientData, prediction: CancerPrediction): SHAPExplanation {
    console.log('Generating SHAP-like explanation for prediction:', prediction);
    
    // Extract and normalize features
    const features = this.extractFeaturesForSHAP(patientData);
    
    // Calculate SHAP-like values
    const shapValues = this.calculateSHAPLikeValues(features, prediction);
    
    // Create feature contributions
    const featureContributions = this.createFeatureContributions(features, shapValues);
    
    // Sort by absolute contribution
    featureContributions.sort((a, b) => Math.abs(b.shapValue) - Math.abs(a.shapValue));
    
    // Get top risk and protective factors
    const topRiskFactors = featureContributions.filter(f => f.shapValue > 0).slice(0, 5);
    const topProtectiveFactors = featureContributions.filter(f => f.shapValue < 0).slice(0, 5);
    
    // Generate summary
    const summary = this.generateExplanationSummary(featureContributions, prediction);
    
    const explanation: SHAPExplanation = {
      explanationType: 'SHAP-like',
      baselineProbability: 0.5, // 50% baseline
      predictedProbability: prediction.confidence / 100,
      prediction: prediction.cancerType,
      totalFeatures: featureContributions.length,
      featureContributions,
      topRiskFactors,
      topProtectiveFactors,
      summary
    };
    
    console.log('SHAP-like explanation generated:', explanation);
    return explanation;
  }

  private static extractFeaturesForSHAP(patientData: PatientData): Record<string, number> {
    return {
      age: patientData.age / 100, // Normalize to 0-1
      gender: patientData.gender === 'female' ? 1 : 0,
      bmi: Math.max(0, Math.min(1, ((patientData.bmi || 25) - 18.5) / (40 - 18.5))),
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
      tumorSize: Math.max(0, Math.min(1, (patientData.tumorSize || 0) / 10)),
      lymphNodes: Math.max(0, Math.min(1, (patientData.lymphNodes || 0) / 20)),
      metastasis: patientData.metastasis ? 1 : 0,
      hemoglobin: Math.max(0, Math.min(1, ((patientData.hemoglobin || 14) - 8) / 10)),
      whiteBloodCells: Math.max(0, Math.min(1, ((patientData.whiteBloodCells || 7000) - 4000) / 10000)),
      platelets: Math.max(0, Math.min(1, ((patientData.platelets || 250000) - 150000) / 300000))
    };
  }

  private static calculateSHAPLikeValues(features: Record<string, number>, prediction: CancerPrediction): Record<string, number> {
    const shapValues: Record<string, number> = {};
    
    // Calculate SHAP-like values based on feature importance and values
    for (const [feature, value] of Object.entries(features)) {
      const baseImportance = this.FEATURE_WEIGHTS[feature as keyof typeof this.FEATURE_WEIGHTS] || 0.05;
      
      // Calculate contribution based on deviation from neutral (0.5)
      let shapValue: number;
      
      if (value > 0.5) {
        // High feature value - contributes to cancer risk
        shapValue = baseImportance * (value - 0.5) * 2;
      } else {
        // Low feature value - protective effect
        shapValue = -baseImportance * (0.5 - value) * 2;
      }
      
      // Adjust based on prediction confidence
      const confidenceMultiplier = prediction.confidence / 100;
      shapValue *= confidenceMultiplier;
      
      // Special handling for definitive indicators
      if ((feature === 'tumorSize' || feature === 'lymphNodes' || feature === 'metastasis') && value > 0) {
        shapValue *= 2; // Double the impact for physical indicators
      }
      
      shapValues[feature] = shapValue;
    }
    
    return shapValues;
  }

  private static createFeatureContributions(features: Record<string, number>, shapValues: Record<string, number>): FeatureContribution[] {
    const contributions: FeatureContribution[] = [];
    
    // Calculate total absolute contribution for percentage calculation
    const totalContribution = Object.values(shapValues).reduce((sum, val) => sum + Math.abs(val), 0);
    
    for (const [featureKey, shapValue] of Object.entries(shapValues)) {
      const contributionPct = totalContribution > 0 ? (Math.abs(shapValue) / totalContribution * 100) : 0;
      
      contributions.push({
        feature: this.FEATURE_NAME_MAPPING[featureKey as keyof typeof this.FEATURE_NAME_MAPPING] || featureKey,
        featureKey,
        shapValue,
        featureValue: features[featureKey],
        contributionPct,
        impact: shapValue > 0 ? 'Increases Risk' : 'Decreases Risk',
        magnitude: contributionPct > 15 ? 'High' : contributionPct > 5 ? 'Medium' : 'Low'
      });
    }
    
    return contributions;
  }

  private static generateExplanationSummary(contributions: FeatureContribution[], prediction: CancerPrediction): string {
    const cancerDetected = prediction.cancerType !== 'No Cancer Detected';
    const confidence = prediction.confidence;
    
    // Get top contributing factors
    const topPositive = contributions.filter(c => c.shapValue > 0).slice(0, 3);
    const topNegative = contributions.filter(c => c.shapValue < 0).slice(0, 3);
    
    let summary: string;
    
    if (cancerDetected) {
      summary = `The AI model predicts ${prediction.cancerType} with ${confidence}% confidence. `;
      
      if (topPositive.length > 0) {
        const riskFactors = topPositive.map(f => f.feature).join(', ');
        summary += `Key risk factors contributing to this prediction: ${riskFactors}. `;
      }
      
      if (topNegative.length > 0) {
        const protectiveFactors = topNegative.slice(0, 2).map(f => f.feature).join(', ');
        summary += `Protective factors identified: ${protectiveFactors}. `;
      }
      
      summary += `Stage ${prediction.stage} indicates ${this.getStageDescription(prediction.stage)}.`;
    } else {
      summary = `The AI model indicates no cancer detected with ${confidence}% confidence. `;
      
      if (topNegative.length > 0) {
        const protectiveFactors = topNegative.slice(0, 2).map(f => f.feature).join(', ');
        summary += `Key protective factors: ${protectiveFactors}. `;
      }
      
      summary += 'Continue regular health screenings and maintain healthy lifestyle choices.';
    }
    
    return summary;
  }

  private static getStageDescription(stage: string): string {
    const stageDescriptions = {
      'I': 'early-stage cancer with good treatment prospects',
      'II': 'locally advanced cancer requiring comprehensive treatment',
      'III': 'regionally advanced cancer with lymph node involvement',
      'IV': 'advanced cancer with distant spread requiring specialized care'
    };
    
    return stageDescriptions[stage as keyof typeof stageDescriptions] || 'cancer requiring medical evaluation';
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

  // Get feature importance data formatted for charts
  static getFeatureImportanceChartData(explanation: SHAPExplanation): Array<{
    feature: string;
    importance: number;
    impact: string;
    value: number;
    contributionPct: number;
  }> {
    return explanation.featureContributions.slice(0, 10).map(contrib => ({
      feature: contrib.feature,
      importance: Math.abs(contrib.shapValue) * 100,
      impact: contrib.impact,
      value: contrib.featureValue,
      contributionPct: contrib.contributionPct
    }));
  }
}