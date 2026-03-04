
import { PatientData } from '@/types/healthcare';

export function determineCancerStage(patientData: PatientData): 'I' | 'II' | 'III' | 'IV' {
  const { tumorSize, lymphNodes, metastasis } = patientData;
  
  // Stage IV - ONLY metastasis confirms this
  if (metastasis === true) {
    return 'IV';
  }
  
  // Stage III - Significant lymph node involvement (>4 nodes)
  if (lymphNodes && lymphNodes > 4) {
    return 'III';
  }
  
  // Stage III - Large tumor (>5cm) WITH lymph node involvement
  if (tumorSize && tumorSize > 5 && lymphNodes && lymphNodes > 0) {
    return 'III';
  }
  
  // Stage II - Moderate tumor (2-5cm) OR limited lymph nodes (1-4)
  if (tumorSize && tumorSize >= 2) {
    // Large tumor (>5cm) without nodes = Stage II
    if (tumorSize > 5 && (!lymphNodes || lymphNodes === 0)) {
      return 'II';
    }
    // Medium tumor (2-5cm) with any nodes = Stage II
    if (tumorSize <= 5 && lymphNodes && lymphNodes > 0) {
      return 'II';
    }
    // Medium tumor (2-5cm) without nodes = Stage I
    return 'I';
  }
  
  // Stage II - Lymph nodes involved (1-4) without large tumor
  if (lymphNodes && lymphNodes > 0 && lymphNodes <= 4) {
    return 'II';
  }
  
  // Stage I - Default for detected cancer without definitive staging indicators
  return 'I';
}

export function getStageDescription(stage: 'I' | 'II' | 'III' | 'IV' | ''): string {
  switch (stage) {
    case 'I':
      return 'Early stage - Cancer is small and localized to the organ where it started';
    case 'II':
      return 'Locally advanced - Cancer has grown larger and may have spread to nearby tissues or lymph nodes';
    case 'III':
      return 'Regional spread - Cancer has spread to several lymph nodes or nearby structures';
    case 'IV':
      return 'Advanced stage - Cancer has spread to distant parts of the body (metastasis)';
    case '':
      return 'No cancer stage applicable - No cancer detected';
    default:
      return 'Stage I - Early stage cancer detected';
  }
}
