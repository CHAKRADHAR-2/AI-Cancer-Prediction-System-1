export interface PatientData {
    age: number;
    gender: 'male' | 'female';
    smokingHistory: 'never' | 'former' | 'current';
    familyHistory: boolean;
    bmi: number;
    bloodPressure: { systolic: number; diastolic: number };
    cholesterol: number;
    glucose: number;
    hemoglobin: number;
    whiteBloodCells: number;
    platelets: number;
    tumorSize?: number;
    lymphNodes?: number;
    metastasis?: boolean;
    previousCancerHistory?: boolean;
    alcoholConsumption?: 'never' | 'occasional' | 'moderate' | 'heavy';
    exerciseFrequency?: 'none' | 'light' | 'moderate' | 'heavy';
    dietType?: 'vegetarian' | 'non-vegetarian' | 'vegan' | 'mixed';
    stressLevel?: 'low' | 'moderate' | 'high';
    sleepHours?: number;
    sunExposure?: 'minimal' | 'moderate' | 'high';
    immuneSystemStatus?: 'normal' | 'compromised' | 'enhanced';
    unexplainedWeightLoss?: boolean;
    persistentFatigue?: boolean;
    unusualBleeding?: boolean;
    persistentCough?: boolean;
    skinChanges?: boolean;
    digestiveIssues?: boolean;
    chronicConditions?: string;
    currentMedications?: string;
    symptoms?: string;
    radiationExposure?: boolean;
    chemotherapyHistory?: boolean;
}

export interface CancerPrediction {
    cancerType: string;
    confidence: number;
    riskLevel: 'Low' | 'Medium' | 'High';
    stage: 'I' | 'II' | 'III' | 'IV' | '';
    detectedAt: string;
}

export interface FeatureImportance {
    feature: string;
    importance: number;
    impact: 'positive' | 'negative';
}

export interface Medication {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    sideEffects: string[];
    category: string;
}

export interface NutritionRecommendation {
    category: string;
    foods: string[];
    benefits: string;
    avoidFoods?: string[];
}

export interface PrognosisInfo {
    outlook: 'Excellent' | 'Good' | 'Fair' | 'Poor';
    survivalRate: string;
    isInDanger: boolean;
    remedies: string[];
    timeframe: string;
}

export interface PredictionResult {
    prediction: CancerPrediction;
    medications: Medication[];
    featureImportance: FeatureImportance[];
    recommendations: string[];
    nutritionRecommendations: NutritionRecommendation[];
    prognosis: PrognosisInfo;
}
