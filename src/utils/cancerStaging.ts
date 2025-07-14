
import { PatientData } from '@/types/healthcare';

export function determineCancerStage(patientData: PatientData): 'I' | 'II' | 'III' | 'IV' {
  const { tumorSize, lymphNodes, metastasis } = patientData;
  
  // If metastasis is present, it's always Stage IV
  if (metastasis) {
    return 'IV';
  }
  
  // If lymph nodes are significantly affected (>4), likely Stage III
  if (lymphNodes && lymphNodes > 4) {
    return 'III';
  }
  
  // If tumor is large (>5cm) or moderate lymph node involvement, Stage II-III
  if (tumorSize && tumorSize > 5) {
    return lymphNodes && lymphNodes > 0 ? 'III' : 'II';
  }
  
  // If tumor is moderate (2-5cm), Stage I-II
  if (tumorSize && tumorSize > 2) {
    return lymphNodes && lymphNodes > 2 ? 'II' : 'I';
  }
  
  // Small tumor (<2cm) with minimal lymph node involvement
  if (lymphNodes && lymphNodes > 0) {
    return 'II';
  }
  
  // Default to Stage I for early/small tumors
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
      return 'Stage information not available';
  }
}
