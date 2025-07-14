import { CancerPrediction, PatientData } from '@/types/healthcare';

// Generate health recommendations
export function generateRecommendations(prediction: CancerPrediction, patientData: PatientData): string[] {
  const recommendations: string[] = [];
  
  // General recommendations
  recommendations.push('Consult with an oncologist for comprehensive evaluation');
  recommendations.push('Consider genetic counseling if family history is present');
  
  // Risk-specific recommendations
  if (prediction.riskLevel === 'High') {
    recommendations.push('Urgent medical attention required');
    recommendations.push('Consider immediate biopsy and staging tests');
  } else if (prediction.riskLevel === 'Medium') {
    recommendations.push('Schedule follow-up appointments every 3-6 months');
    recommendations.push('Consider additional screening tests');
  } else {
    recommendations.push('Continue regular health checkups');
    recommendations.push('Maintain healthy lifestyle habits');
  }
  
  // Lifestyle recommendations
  if (patientData.smokingHistory === 'current') {
    recommendations.push('Smoking cessation is strongly recommended');
  }
  
  if (patientData.bmi > 30) {
    recommendations.push('Weight management and healthy diet recommended');
  }
  
  // Cancer-specific recommendations
  switch (prediction.cancerType) {
    case 'Breast Cancer':
      recommendations.push('Consider mammography and breast MRI');
      recommendations.push('Perform regular self-examinations');
      break;
    case 'Lung Cancer':
      recommendations.push('Chest CT scan recommended');
      recommendations.push('Pulmonary function tests');
      break;
    case 'Colon Cancer':
      recommendations.push('Colonoscopy screening recommended');
      recommendations.push('Stool-based tests for early detection');
      break;
    case 'Prostate Cancer':
      recommendations.push('PSA blood test monitoring');
      recommendations.push('Digital rectal examination');
      break;
  }
  
  return recommendations;
}