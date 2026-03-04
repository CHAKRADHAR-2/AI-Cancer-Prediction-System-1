import { PatientData } from '@/types/healthcare';

export function getFixedStaging(patientData: PatientData): 'I' | 'II' | 'III' | 'IV' {
  console.log('🔍 FIXED STAGING - Input data:', {
    metastasis: patientData.metastasis,
    tumorSize: patientData.tumorSize,
    lymphNodes: patientData.lymphNodes
  });
  
  // Stage IV - ONLY metastasis confirms this
  if (patientData.metastasis === true) {
    console.log('🚨 FIXED STAGING: Stage IV detected - Metastasis present');
    return 'IV';
  }
  
  // Stage III - Significant lymph node involvement (>4 nodes)
  if (patientData.lymphNodes && patientData.lymphNodes > 4) {
    console.log('🚨 FIXED STAGING: Stage III detected - Lymph nodes > 4:', patientData.lymphNodes);
    return 'III';
  }
  
  // Stage III - Large tumor (>5cm) WITH lymph node involvement
  if (patientData.tumorSize && patientData.tumorSize > 5 && 
      patientData.lymphNodes && patientData.lymphNodes > 0) {
    console.log('🚨 FIXED STAGING: Stage III detected - Large tumor with nodes');
    return 'III';
  }
  
  // Stage II - Moderate tumor (2-5cm) OR limited lymph nodes (1-4)
  if (patientData.tumorSize && patientData.tumorSize >= 2) {
    // Large tumor (>5cm) without nodes = Stage II
    if (patientData.tumorSize > 5 && (!patientData.lymphNodes || patientData.lymphNodes === 0)) {
      console.log('🚨 FIXED STAGING: Stage II detected - Large tumor without nodes');
      return 'II';
    }
    // Medium tumor (2-5cm) with any nodes = Stage II
    if (patientData.tumorSize <= 5 && patientData.lymphNodes && patientData.lymphNodes > 0) {
      console.log('🚨 FIXED STAGING: Stage II detected - Medium tumor with nodes');
      return 'II';
    }
    // Medium tumor (2-5cm) without nodes = Stage I
    console.log('🚨 FIXED STAGING: Stage I detected - Medium tumor without nodes');
    return 'I';
  }
  
  // Stage II - Lymph nodes involved (1-4) without large tumor
  if (patientData.lymphNodes && patientData.lymphNodes > 0 && patientData.lymphNodes <= 4) {
    console.log('🚨 FIXED STAGING: Stage II detected - Limited lymph node involvement');
    return 'II';
  }
  
  // Stage I - Default for detected cancer without definitive staging indicators
  console.log('🚨 FIXED STAGING: Stage I detected - No definitive staging indicators');
  return 'I';
}