import { Platform } from 'react-native';
import { PatientData, PredictionResult } from '../types/healthcare';

const LOCAL_API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || LOCAL_API_URL;

export const predictCancerRisk = async (patientData: PatientData): Promise<PredictionResult> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/predict`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ patientData }),
        });
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data = await response.json();
        if (data.success) return data;
        throw new Error(data.error || 'Prediction failed');
    } catch (error) {
        console.warn('API unavailable, using local fallback prediction');
        return generateFallbackPrediction(patientData);
    }
};

// Local fallback engine mirroring web app's rule-based logic
function generateFallbackPrediction(data: PatientData): PredictionResult {
    const symptomCount = [
        data.unexplainedWeightLoss, data.persistentFatigue, data.unusualBleeding,
        data.persistentCough, data.skinChanges, data.digestiveIssues,
    ].filter(Boolean).length;

    const hasDefinitive = !!(data.tumorSize && data.tumorSize > 0) || !!(data.lymphNodes && data.lymphNodes > 0) || data.metastasis || data.previousCancerHistory;

    let cancerType = 'No Cancer Detected';
    let confidence = 90;
    let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
    let stage: '' | 'I' | 'II' | 'III' | 'IV' = '';

    if (hasDefinitive || symptomCount >= 3) {
        // Determine cancer type based on web app logic
        if (data.persistentCough && data.smokingHistory !== 'never') cancerType = 'Lung Cancer';
        else if (data.skinChanges) cancerType = 'Skin Cancer (Melanoma)';
        else if (data.digestiveIssues) cancerType = 'Colon Cancer';
        else if (data.unusualBleeding && data.gender === 'female') cancerType = 'Cervical Cancer';
        else if (data.gender === 'female') cancerType = data.age > 45 ? 'Breast Cancer' : 'Cervical Cancer';
        else if (data.gender === 'male') cancerType = data.age > 60 ? 'Prostate Cancer' : 'Lung Cancer';
        else cancerType = 'Lung Cancer';

        confidence = Math.min(60 + symptomCount * 8 + (hasDefinitive ? 15 : 0), 95);
        riskLevel = confidence >= 75 ? 'High' : 'Medium';

        // Staging logic from web app
        if (data.metastasis) stage = 'IV';
        else if (data.lymphNodes && data.lymphNodes > 4) stage = 'III';
        else if (data.tumorSize && data.tumorSize > 5 && data.lymphNodes && data.lymphNodes > 0) stage = 'III';
        else if (data.tumorSize && data.tumorSize >= 2) stage = 'II';
        else if (data.lymphNodes && data.lymphNodes > 0) stage = 'II';
        else stage = 'I';
    }

    const cancerDetected = cancerType !== 'No Cancer Detected';

    return {
        prediction: {
            cancerType,
            confidence,
            riskLevel,
            stage,
            detectedAt: new Date().toISOString(),
        },
        medications: cancerDetected ? [
            { name: 'Cisplatin', dosage: '75mg/m²', frequency: 'Every 3 weeks', duration: '4-6 cycles', sideEffects: ['Nausea', 'Kidney damage'], category: 'Chemotherapy' },
            { name: 'Paclitaxel', dosage: '175mg/m²', frequency: 'Every 3 weeks', duration: '4-6 cycles', sideEffects: ['Hair loss', 'Nerve damage'], category: 'Chemotherapy' },
        ] : [],
        featureImportance: [
            { feature: 'Age', importance: data.age > 55 ? 0.85 : 0.4, impact: data.age > 55 ? 'negative' : 'positive' },
            { feature: 'Smoking History', importance: data.smokingHistory !== 'never' ? 0.9 : 0.1, impact: data.smokingHistory !== 'never' ? 'negative' : 'positive' },
            { feature: 'Family History', importance: data.familyHistory ? 0.75 : 0.15, impact: data.familyHistory ? 'negative' : 'positive' },
            { feature: 'BMI', importance: (data.bmi > 30 || data.bmi < 18.5) ? 0.65 : 0.2, impact: (data.bmi > 30 || data.bmi < 18.5) ? 'negative' : 'positive' },
            { feature: 'Blood Pressure', importance: data.bloodPressure.systolic > 140 ? 0.5 : 0.15, impact: data.bloodPressure.systolic > 140 ? 'negative' : 'positive' },
        ],
        recommendations: cancerDetected
            ? ['Consult an oncologist immediately', 'Get a comprehensive biopsy', 'Schedule imaging tests (CT/MRI)', 'Begin treatment planning', 'Seek emotional support services']
            : ['Maintain regular health check-ups', 'Continue healthy lifestyle', 'Schedule annual cancer screenings', 'Stay physically active', 'Eat a balanced, nutritious diet'],
        nutritionRecommendations: [
            { category: 'Anti-inflammatory Foods', foods: ['Berries', 'Leafy greens', 'Turmeric', 'Fatty fish'], benefits: 'Reduces inflammation and supports immune function' },
            { category: 'Antioxidant-Rich Foods', foods: ['Tomatoes', 'Broccoli', 'Green tea', 'Dark chocolate'], benefits: 'Protects cells from oxidative damage' },
            { category: 'Immune-Boosting Foods', foods: ['Citrus fruits', 'Garlic', 'Ginger', 'Yogurt'], benefits: 'Strengthens immune system response' },
        ],
        prognosis: cancerDetected
            ? { outlook: stage === 'I' ? 'Good' : stage === 'II' ? 'Fair' : 'Poor', survivalRate: stage === 'I' ? '85-95%' : stage === 'II' ? '60-80%' : stage === 'III' ? '30-50%' : '10-20%', isInDanger: stage === 'III' || stage === 'IV', remedies: ['Surgery', 'Chemotherapy', 'Radiation therapy', 'Immunotherapy'], timeframe: '5-year survival' }
            : { outlook: 'Excellent', survivalRate: '99%+', isInDanger: false, remedies: ['Regular screening', 'Healthy lifestyle maintenance'], timeframe: 'Ongoing' },
    };
}

export const checkApiHealth = async (): Promise<boolean> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/health`);
        if (!response.ok) return false;
        const data = await response.json();
        return data.status === 'ok';
    } catch { return false; }
};
