
export interface PatientData {
  age: number;
  gender: 'male' | 'female';
  smokingHistory: 'never' | 'former' | 'current';
  familyHistory: boolean;
  bmi: number;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  cholesterol: number;
  glucose: number;
  hemoglobin: number;
  whiteBloodCells: number;
  platelets: number;
  tumorSize?: number;
  lymphNodes?: number;
  metastasis?: boolean;
  previousCancerHistory?: boolean;
  
  // Additional cancer-specific fields
  alcoholConsumption?: 'never' | 'occasional' | 'moderate' | 'heavy';
  exerciseFrequency?: 'none' | 'light' | 'moderate' | 'heavy';
  dietType?: 'vegetarian' | 'non-vegetarian' | 'vegan' | 'mixed';
  stressLevel?: 'low' | 'moderate' | 'high';
  sleepHours?: number;
  sunExposure?: 'minimal' | 'moderate' | 'high';
  occupationalExposure?: string;
  environmentalFactors?: string;
  reproductiveHistory?: string;
  hormonalFactors?: string;
  immuneSystemStatus?: 'normal' | 'compromised' | 'enhanced';
  inflammatoryConditions?: string;
  geneticMutations?: string;
  
  // Symptoms
  unexplainedWeightLoss?: boolean;
  persistentFatigue?: boolean;
  unusualBleeding?: boolean;
  persistentCough?: boolean;
  skinChanges?: boolean;
  digestiveIssues?: boolean;
  
  // Medical history
  chronicConditions?: string;
  currentMedications?: string;
  symptoms?: string;
  previousSurgeries?: string;
  occupationalHazards?: string;
  
  // Cancer-specific
  radiationExposure?: boolean;
  chemotherapyHistory?: boolean;
}

export interface CancerPrediction {
  cancerType: string;
  confidence: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  stage: 'I' | 'II' | 'III' | 'IV' | ''; // Allow empty string for no cancer detected
  detectedAt: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  sideEffects: string[];
  category: string;
}

export interface FeatureImportance {
  feature: string;
  importance: number;
  impact: 'positive' | 'negative';
}

export interface NutritionRecommendation {
  category: string;
  foods: string[];
  benefits: string;
  avoidFoods?: string[];
}

export interface AppointmentRecommendation {
  frequency: string;
  nextVisit: string;
  visitType: string;
  urgency: 'Low' | 'Medium' | 'High';
}

export interface PrognosisInfo {
  outlook: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  survivalRate: string;
  isInDanger: boolean;
  remedies: string[];
  timeframe: string;
}

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

export interface PredictionResult {
  prediction: CancerPrediction;
  medications: Medication[];
  featureImportance: FeatureImportance[];
  recommendations: string[];
  nutritionRecommendations: NutritionRecommendation[];
  appointmentRecommendation: AppointmentRecommendation;
  prognosis: PrognosisInfo;
  shapExplanation?: SHAPExplanation;
}
