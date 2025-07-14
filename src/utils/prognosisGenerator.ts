
import { PatientData, PrognosisInfo, AppointmentRecommendation } from '@/types/healthcare';

export class PrognosisGenerator {
  static generatePrognosis(stage: 'I' | 'II' | 'III' | 'IV' | '', cancerType: string, patientData: PatientData): PrognosisInfo {
    const prognosisData: Record<string, Record<string, PrognosisInfo>> = {
      'No Cancer Detected': {
        '': { // Empty stage key for no cancer
          outlook: 'Excellent',
          survivalRate: '100% (No cancer detected)',
          isInDanger: false,
          remedies: [
            'Maintain healthy lifestyle',
            'Regular exercise (150 min/week)',
            'Balanced diet rich in fruits and vegetables',
            'Avoid smoking and excessive alcohol',
            'Regular health screenings'
          ],
          timeframe: 'Long-term prevention focus'
        }
      },
      'Lung Cancer': {
        'I': {
          outlook: 'Good',
          survivalRate: '68% 5-year survival rate',
          isInDanger: true,
          remedies: [
            'Immediate smoking cessation',
            'Surgery (lobectomy or wedge resection)',
            'Chemotherapy if recommended',
            'Radiation therapy',
            'Regular oncology follow-ups'
          ],
          timeframe: '5-year treatment and monitoring period'
        },
        'II': {
          outlook: 'Fair',
          survivalRate: '36% 5-year survival rate',
          isInDanger: true,
          remedies: [
            'Aggressive treatment protocol',
            'Combination chemotherapy',
            'Radiation therapy',
            'Immunotherapy options',
            'Clinical trial participation'
          ],
          timeframe: 'Intensive 2-year treatment period'
        }
      },
      'Breast Cancer': {
        'I': {
          outlook: 'Excellent',
          survivalRate: '99% 5-year survival rate',
          isInDanger: false,
          remedies: [
            'Lumpectomy or mastectomy',
            'Hormone therapy if hormone-positive',
            'Radiation therapy',
            'Regular mammograms',
            'Healthy lifestyle maintenance'
          ],
          timeframe: '5-10 year monitoring period'
        },
        'II': {
          outlook: 'Good',
          survivalRate: '85% 5-year survival rate',
          isInDanger: true,
          remedies: [
            'Surgery plus chemotherapy',
            'Targeted therapy',
            'Hormone therapy',
            'Radiation therapy',
            'Regular monitoring'
          ],
          timeframe: '2-5 year intensive treatment'
        }
      },
      'Colon Cancer': {
        'I': {
          outlook: 'Excellent',
          survivalRate: '92% 5-year survival rate',
          isInDanger: false,
          remedies: [
            'Surgical resection',
            'Post-surgery monitoring',
            'Dietary modifications',
            'Regular colonoscopies',
            'Healthy lifestyle'
          ],
          timeframe: '5-year monitoring period'
        },
        'II': {
          outlook: 'Good',
          survivalRate: '72% 5-year survival rate',
          isInDanger: true,
          remedies: [
            'Surgery plus chemotherapy',
            'Adjuvant therapy',
            'Nutritional support',
            'Regular CEA monitoring',
            'Lifestyle modifications'
          ],
          timeframe: '2-5 year treatment period'
        }
      },
      'Prostate Cancer': {
        'I': {
          outlook: 'Excellent',
          survivalRate: '99% 5-year survival rate',
          isInDanger: false,
          remedies: [
            'Active surveillance or surgery',
            'Radiation therapy options',
            'Hormone therapy if needed',
            'Regular PSA monitoring',
            'Healthy diet and exercise'
          ],
          timeframe: '10+ year monitoring'
        },
        'II': {
          outlook: 'Good',
          survivalRate: '99% 5-year survival rate',
          isInDanger: false,
          remedies: [
            'Prostatectomy or radiation',
            'Hormone therapy',
            'Regular PSA tests',
            'Lifestyle modifications',
            'Regular follow-ups'
          ],
          timeframe: '5-10 year monitoring'
        }
      }
    };

    const defaultPrognosis: PrognosisInfo = {
      outlook: 'Fair',
      survivalRate: 'Varies by individual case',
      isInDanger: true,
      remedies: [
        'Consult with oncology specialist',
        'Follow recommended treatment plan',
        'Maintain positive outlook',
        'Seek support from family and friends',
        'Consider second opinion'
      ],
      timeframe: 'Ongoing medical care required'
    };

    // Handle empty stage for no cancer detected
    if (cancerType === 'No Cancer Detected') {
      return prognosisData[cancerType][''] || defaultPrognosis;
    }

    return prognosisData[cancerType]?.[stage] || defaultPrognosis;
  }

  static generateAppointmentRecommendation(stage: 'I' | 'II' | 'III' | 'IV' | '', cancerType: string): AppointmentRecommendation {
    const recommendations: Record<string, AppointmentRecommendation> = {
      'No Cancer Detected': {
        frequency: 'Annual screening recommended',
        nextVisit: '12 months',
        visitType: 'Routine checkup',
        urgency: 'Low'
      },
      'Lung Cancer': {
        frequency: stage === 'I' ? 'Every 3 months' : 'Every 2 months',
        nextVisit: stage === 'I' ? '3 months' : '2 months',  
        visitType: 'Oncology consultation',
        urgency: stage === 'I' ? 'Medium' : 'High'
      },
      'Breast Cancer': {
        frequency: stage === 'I' ? 'Every 3 months' : 'Every 2 months',
        nextVisit: stage === 'I' ? '3 months' : '2 months',
        visitType: 'Oncology consultation',
        urgency: stage === 'I' ? 'Medium' : 'High'
      },
      'Colon Cancer': {
        frequency: stage === 'I' ? 'Every 4 months' : 'Every 2 months',
        nextVisit: stage === 'I' ? '4 months' : '2 months',
        visitType: 'Gastroenterology consultation',
        urgency: stage === 'I' ? 'Medium' : 'High'
      },
      'Prostate Cancer': {
        frequency: stage === 'I' ? 'Every 4 months' : 'Every 3 months',
        nextVisit: stage === 'I' ? '4 months' : '3 months',
        visitType: 'Urology consultation',
        urgency: stage === 'I' ? 'Medium' : 'High'
      }
    };

    return recommendations[cancerType] || recommendations['No Cancer Detected'];
  }
}
