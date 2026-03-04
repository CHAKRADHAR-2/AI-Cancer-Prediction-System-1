
import { Medication } from '@/types/healthcare';

export const cancerTypes = [
  'Breast Cancer',
  'Lung Cancer', 
  'Colon Cancer',
  'Prostate Cancer',
  'Liver Cancer',
  'Stomach Cancer',
  'Pancreatic Cancer',
  'Leukemia',
  'Brain Cancer',
  'Kidney Cancer',
  'Bladder Cancer',
  'Ovarian Cancer',
  'Cervical Cancer',
  'Thyroid Cancer',
  'Skin Cancer (Melanoma)',
  'Lymphoma (Hodgkin)',
  'Lymphoma (Non-Hodgkin)',
  'Esophageal Cancer',
  'Oral Cancer',
  'Bone Cancer',
  'Testicular Cancer',
  'Uterine Cancer',
  'Gallbladder Cancer',
  'Multiple Myeloma',
  'Sarcoma'
];

export const medicationDatabase: Record<string, Medication[]> = {
  'Breast Cancer': [
    {
      name: 'Tamoxifen',
      dosage: '20mg',
      frequency: 'Once daily',
      duration: '5-10 years',
      sideEffects: ['Hot flashes', 'Nausea', 'Fatigue'],
      category: 'Hormone Therapy'
    },
    {
      name: 'Doxorubicin',
      dosage: '60 mg/m²',
      frequency: 'Every 3 weeks',
      duration: '4-6 cycles',
      sideEffects: ['Hair loss', 'Nausea', 'Fatigue', 'Heart problems'],
      category: 'Chemotherapy'
    },
    {
      name: 'Trastuzumab',
      dosage: '8 mg/kg loading, 6 mg/kg maintenance',
      frequency: 'Every 3 weeks',
      duration: '1 year',
      sideEffects: ['Heart problems', 'Flu-like symptoms'],
      category: 'Targeted Therapy'
    }
  ],
  'Lung Cancer': [
    {
      name: 'Carboplatin',
      dosage: 'AUC 5-6',
      frequency: 'Every 3 weeks',
      duration: '4-6 cycles',
      sideEffects: ['Nausea', 'Low blood counts', 'Fatigue'],
      category: 'Chemotherapy'
    },
    {
      name: 'Pembrolizumab',
      dosage: '200mg',
      frequency: 'Every 3 weeks',
      duration: 'Until progression',
      sideEffects: ['Fatigue', 'Skin rash', 'Diarrhea'],
      category: 'Immunotherapy'
    },
    {
      name: 'Erlotinib',
      dosage: '150mg',
      frequency: 'Once daily',
      duration: 'Until progression',
      sideEffects: ['Skin rash', 'Diarrhea', 'Fatigue'],
      category: 'Targeted Therapy'
    }
  ],
  'Colon Cancer': [
    {
      name: 'Fluorouracil (5-FU)',
      dosage: '400 mg/m² bolus, 2400 mg/m² infusion',
      frequency: 'Every 2 weeks',
      duration: '6 months',
      sideEffects: ['Diarrhea', 'Mouth sores', 'Hand-foot syndrome'],
      category: 'Chemotherapy'
    },
    {
      name: 'Bevacizumab',
      dosage: '5 mg/kg',
      frequency: 'Every 2 weeks',
      duration: '6 months',
      sideEffects: ['High blood pressure', 'Bleeding', 'Blood clots'],
      category: 'Targeted Therapy'
    },
    {
      name: 'Cetuximab',
      dosage: '400 mg/m² loading, 250 mg/m² weekly',
      frequency: 'Weekly',
      duration: 'Until progression',
      sideEffects: ['Skin rash', 'Diarrhea', 'Allergic reactions'],
      category: 'Targeted Therapy'
    }
  ],
  'Prostate Cancer': [
    {
      name: 'Leuprolide',
      dosage: '7.5mg',
      frequency: 'Monthly injection',
      duration: 'Long-term',
      sideEffects: ['Hot flashes', 'Decreased libido', 'Fatigue'],
      category: 'Hormone Therapy'
    },
    {
      name: 'Docetaxel',
      dosage: '75 mg/m²',
      frequency: 'Every 3 weeks',
      duration: '6-10 cycles',
      sideEffects: ['Hair loss', 'Nausea', 'Low blood counts'],
      category: 'Chemotherapy'
    },
    {
      name: 'Enzalutamide',
      dosage: '160mg',
      frequency: 'Once daily',
      duration: 'Until progression',
      sideEffects: ['Fatigue', 'Hot flashes', 'Diarrhea'],
      category: 'Hormone Therapy'
    }
  ],
  'Liver Cancer': [
    {
      name: 'Sorafenib',
      dosage: '400mg',
      frequency: 'Twice daily',
      duration: 'Until progression',
      sideEffects: ['Diarrhea', 'Hand-foot syndrome', 'Fatigue'],
      category: 'Targeted Therapy'
    },
    {
      name: 'Lenvatinib',
      dosage: '12mg (≥60kg) or 8mg (<60kg)',
      frequency: 'Once daily',
      duration: 'Until progression',
      sideEffects: ['High blood pressure', 'Diarrhea', 'Fatigue'],
      category: 'Targeted Therapy'
    }
  ],
  'Stomach Cancer': [
    {
      name: 'Trastuzumab',
      dosage: '8 mg/kg loading, 6 mg/kg maintenance',
      frequency: 'Every 3 weeks',
      duration: 'Until progression',
      sideEffects: ['Heart problems', 'Flu-like symptoms'],
      category: 'Targeted Therapy'
    },
    {
      name: 'Capecitabine',
      dosage: '1000 mg/m²',
      frequency: 'Twice daily for 14 days, 7 days rest',
      duration: '6-8 cycles',
      sideEffects: ['Hand-foot syndrome', 'Diarrhea', 'Nausea'],
      category: 'Chemotherapy'
    }
  ],
  'Pancreatic Cancer': [
    {
      name: 'Gemcitabine',
      dosage: '1000 mg/m²',
      frequency: 'Weekly for 3 weeks, 1 week rest',
      duration: '6 months',
      sideEffects: ['Flu-like symptoms', 'Low blood counts', 'Rash'],
      category: 'Chemotherapy'
    },
    {
      name: 'FOLFIRINOX',
      dosage: 'Combination protocol',
      frequency: 'Every 2 weeks',
      duration: '6 months',
      sideEffects: ['Nausea', 'Diarrhea', 'Neuropathy', 'Fatigue'],
      category: 'Chemotherapy'
    }
  ],
  'Leukemia': [
    {
      name: 'Imatinib',
      dosage: '400mg',
      frequency: 'Once daily',
      duration: 'Long-term',
      sideEffects: ['Nausea', 'Muscle cramps', 'Fluid retention'],
      category: 'Targeted Therapy'
    },
    {
      name: 'Rituximab',
      dosage: '375 mg/m²',
      frequency: 'Weekly for 4 weeks',
      duration: '1 cycle initially',
      sideEffects: ['Infusion reactions', 'Low blood counts', 'Infections'],
      category: 'Immunotherapy'
    },
    {
      name: 'Cytarabine',
      dosage: '100-200 mg/m²',
      frequency: 'Daily for 7 days',
      duration: 'Multiple cycles',
      sideEffects: ['Low blood counts', 'Nausea', 'Mouth sores'],
      category: 'Chemotherapy'
    }
  ],
  'Brain Cancer': [
    {
      name: 'Temozolomide',
      dosage: '75 mg/m²',
      frequency: 'Daily during radiation, then 150-200 mg/m²',
      duration: '6 cycles',
      sideEffects: ['Nausea', 'Fatigue', 'Low blood counts'],
      category: 'Chemotherapy'
    },
    {
      name: 'Bevacizumab',
      dosage: '10 mg/kg',
      frequency: 'Every 2 weeks',
      duration: 'Until progression',
      sideEffects: ['High blood pressure', 'Bleeding', 'Wound healing problems'],
      category: 'Targeted Therapy'
    }
  ],
  'Kidney Cancer': [
    {
      name: 'Sunitinib',
      dosage: '50mg',
      frequency: 'Once daily for 4 weeks, 2 weeks off',
      duration: 'Until progression',
      sideEffects: ['Fatigue', 'Diarrhea', 'Hand-foot syndrome'],
      category: 'Targeted Therapy'
    },
    {
      name: 'Nivolumab',
      dosage: '240mg',
      frequency: 'Every 2 weeks',
      duration: 'Until progression',
      sideEffects: ['Fatigue', 'Skin rash', 'Diarrhea'],
      category: 'Immunotherapy'
    }
  ],
  'Bladder Cancer': [
    {
      name: 'Cisplatin',
      dosage: '70 mg/m²',
      frequency: 'Every 3 weeks',
      duration: '4-6 cycles',
      sideEffects: ['Nausea', 'Kidney problems', 'Hearing loss'],
      category: 'Chemotherapy'
    },
    {
      name: 'Pembrolizumab',
      dosage: '200mg',
      frequency: 'Every 3 weeks',
      duration: 'Until progression',
      sideEffects: ['Fatigue', 'Skin rash', 'Diarrhea'],
      category: 'Immunotherapy'
    }
  ],
  'Ovarian Cancer': [
    {
      name: 'Carboplatin',
      dosage: 'AUC 5-6',
      frequency: 'Every 3 weeks',
      duration: '6 cycles',
      sideEffects: ['Nausea', 'Low blood counts', 'Fatigue'],
      category: 'Chemotherapy'
    },
    {
      name: 'Paclitaxel',
      dosage: '175 mg/m²',
      frequency: 'Every 3 weeks',
      duration: '6 cycles',
      sideEffects: ['Hair loss', 'Neuropathy', 'Low blood counts'],
      category: 'Chemotherapy'
    }
  ],
  'Thyroid Cancer': [
    {
      name: 'Levothyroxine',
      dosage: '1.6 mcg/kg',
      frequency: 'Once daily',
      duration: 'Lifelong',
      sideEffects: ['Heart palpitations', 'Insomnia', 'Weight loss'],
      category: 'Hormone Therapy'
    },
    {
      name: 'Sorafenib',
      dosage: '400mg',
      frequency: 'Twice daily',
      duration: 'Until progression',
      sideEffects: ['Diarrhea', 'Hand-foot syndrome', 'Fatigue'],
      category: 'Targeted Therapy'
    }
  ],
  'Skin Cancer (Melanoma)': [
    {
      name: 'Pembrolizumab',
      dosage: '200mg',
      frequency: 'Every 3 weeks',
      duration: '1 year',
      sideEffects: ['Fatigue', 'Skin rash', 'Diarrhea'],
      category: 'Immunotherapy'
    },
    {
      name: 'Dabrafenib',
      dosage: '150mg',
      frequency: 'Twice daily',
      duration: 'Until progression',
      sideEffects: ['Fever', 'Skin rash', 'Joint pain'],
      category: 'Targeted Therapy'
    }
  ],
  'Lymphoma (Hodgkin)': [
    {
      name: 'ABVD Protocol',
      dosage: 'Combination dosing',
      frequency: 'Every 2 weeks',
      duration: '6 months',
      sideEffects: ['Hair loss', 'Nausea', 'Fatigue'],
      category: 'Chemotherapy'
    },
    {
      name: 'Rituximab',
      dosage: '375 mg/m²',
      frequency: 'Weekly',
      duration: '4 weeks',
      sideEffects: ['Infusion reactions', 'Low blood counts'],
      category: 'Immunotherapy'
    }
  ]
};
