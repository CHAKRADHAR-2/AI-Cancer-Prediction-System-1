
export interface DoctorInfo {
  id: string;
  name: string;
  specialization: string;
  qualification: string;
  experience_years: number;
  hospital_id: string;
  consultation_fee: number;
  available_days: string[];
  rating: number;
  total_reviews: number;
  phone?: string;
  email?: string;
}

export class DoctorService {
  
  // Different doctor pools for each cancer type and region
  private static doctorPools = {
    'Delhi': {
      'Lung Cancer': [
        { name: 'Dr. Rajesh Kumar Sharma', specialization: 'Pulmonary Oncology' },
        { name: 'Dr. Priya Gupta', specialization: 'Thoracic Surgery' },
        { name: 'Dr. Anil Kumar Singh', specialization: 'Radiation Oncology' },
        { name: 'Dr. Sunita Reddy', specialization: 'Medical Oncology' },
        { name: 'Dr. Manoj Agarwal', specialization: 'Pulmonary Medicine' },
        { name: 'Dr. Kavya Sharma', specialization: 'Thoracic Oncology' },
        { name: 'Dr. Sanjay Verma', specialization: 'Interventional Pulmonology' },
        { name: 'Dr. Neha Kapoor', specialization: 'Chest Medicine' }
      ],
      'Breast Cancer': [
        { name: 'Dr. Meera Patel', specialization: 'Breast Oncology' },
        { name: 'Dr. Kavita Singh', specialization: 'Surgical Oncology' },
        { name: 'Dr. Deepak Jain', specialization: 'Medical Oncology' },
        { name: 'Dr. Ravi Malhotra', specialization: 'Radiation Oncology' },
        { name: 'Dr. Anjali Mehta', specialization: 'Breast Surgery' },
        { name: 'Dr. Rohit Khanna', specialization: 'Oncoplastic Surgery' },
        { name: 'Dr. Sushma Rao', specialization: 'Gynecologic Oncology' },
        { name: 'Dr. Vikash Kumar', specialization: 'Reconstructive Surgery' }
      ],
      'Prostate Cancer': [
        { name: 'Dr. Suresh Rao', specialization: 'Urologic Oncology' },
        { name: 'Dr. Vikram Mehta', specialization: 'Radiation Oncology' },
        { name: 'Dr. Anita Kapoor', specialization: 'Medical Oncology' },
        { name: 'Dr. Shalini Agarwal', specialization: 'Surgical Oncology' },
        { name: 'Dr. Rajesh Bansal', specialization: 'Robotic Surgery' },
        { name: 'Dr. Pooja Jain', specialization: 'Uro-Oncology' },
        { name: 'Dr. Amit Sharma', specialization: 'Minimally Invasive Surgery' },
        { name: 'Dr. Priya Nair', specialization: 'Andrology' }
      ],
      'Colon Cancer': [
        { name: 'Dr. Amit Bansal', specialization: 'Colorectal Surgery' },
        { name: 'Dr. Neeta Sharma', specialization: 'Gastrointestinal Oncology' },
        { name: 'Dr. Rohit Verma', specialization: 'Medical Oncology' },
        { name: 'Dr. Pooja Khanna', specialization: 'Radiation Oncology' },
        { name: 'Dr. Manish Gupta', specialization: 'GI Surgery' },
        { name: 'Dr. Sneha Reddy', specialization: 'Hepato-Pancreato-Biliary Surgery' },
        { name: 'Dr. Kiran Singh', specialization: 'Laparoscopic Surgery' },
        { name: 'Dr. Arjun Patel', specialization: 'Gastroenterology' }
      ]
    },
    'Maharashtra': {
      'Lung Cancer': [
        { name: 'Dr. Sachin Patil', specialization: 'Pulmonary Oncology' },
        { name: 'Dr. Vaishali Joshi', specialization: 'Thoracic Surgery' },
        { name: 'Dr. Manoj Deshmukh', specialization: 'Radiation Oncology' },
        { name: 'Dr. Sneha Kulkarni', specialization: 'Medical Oncology' }
      ],
      'Breast Cancer': [
        { name: 'Dr. Ashwini Bhave', specialization: 'Breast Oncology' },
        { name: 'Dr. Rahul Deshpande', specialization: 'Surgical Oncology' },
        { name: 'Dr. Priya Marathe', specialization: 'Medical Oncology' },
        { name: 'Dr. Sunil Gaikwad', specialization: 'Radiation Oncology' }
      ],
      'Prostate Cancer': [
        { name: 'Dr. Nitin Kshirsagar', specialization: 'Urologic Oncology' },
        { name: 'Dr. Madhuri Pawar', specialization: 'Radiation Oncology' },
        { name: 'Dr. Arun Phalgune', specialization: 'Medical Oncology' },
        { name: 'Dr. Manisha Kelkar', specialization: 'Surgical Oncology' }
      ],
      'Colon Cancer': [
        { name: 'Dr. Vivek Saoji', specialization: 'Colorectal Surgery' },
        { name: 'Dr. Sushma Tayade', specialization: 'Gastrointestinal Oncology' },
        { name: 'Dr. Ravi Kannan', specialization: 'Medical Oncology' },
        { name: 'Dr. Pallavi Jadhav', specialization: 'Radiation Oncology' }
      ]
    },
    'Karnataka': {
      'Lung Cancer': [
        { name: 'Dr. Venkatesh Murthy', specialization: 'Pulmonary Oncology' },
        { name: 'Dr. Lakshmi Narayan', specialization: 'Thoracic Surgery' },
        { name: 'Dr. Suresh Babu', specialization: 'Radiation Oncology' },
        { name: 'Dr. Malathi Rao', specialization: 'Medical Oncology' }
      ],
      'Breast Cancer': [
        { name: 'Dr. Bharati Hegde', specialization: 'Breast Oncology' },
        { name: 'Dr. Ramesh Kumar', specialization: 'Surgical Oncology' },
        { name: 'Dr. Shanti Devi', specialization: 'Medical Oncology' },
        { name: 'Dr. Prakash Shetty', specialization: 'Radiation Oncology' }
      ],
      'Prostate Cancer': [
        { name: 'Dr. Girish Kamath', specialization: 'Urologic Oncology' },
        { name: 'Dr. Suma Iyengar', specialization: 'Radiation Oncology' },
        { name: 'Dr. Mohan Keshav', specialization: 'Medical Oncology' },
        { name: 'Dr. Yamuna Bhat', specialization: 'Surgical Oncology' }
      ],
      'Colon Cancer': [
        { name: 'Dr. Nagesh Simha', specialization: 'Colorectal Surgery' },
        { name: 'Dr. Vasanti Kulkarni', specialization: 'Gastrointestinal Oncology' },
        { name: 'Dr. Shankar Rao', specialization: 'Medical Oncology' },
        { name: 'Dr. Padma Shenoy', specialization: 'Radiation Oncology' }
      ]
    },
    'Tamil Nadu': {
      'Lung Cancer': [
        { name: 'Dr. Murugan Subramanian', specialization: 'Pulmonary Oncology' },
        { name: 'Dr. Meenakshi Sundaram', specialization: 'Thoracic Surgery' },
        { name: 'Dr. Ravi Chandran', specialization: 'Radiation Oncology' },
        { name: 'Dr. Kamala Devi', specialization: 'Medical Oncology' }
      ],
      'Breast Cancer': [
        { name: 'Dr. Jayalakshmi Raman', specialization: 'Breast Oncology' },
        { name: 'Dr. Suresh Pillai', specialization: 'Surgical Oncology' },
        { name: 'Dr. Radha Krishnan', specialization: 'Medical Oncology' },
        { name: 'Dr. Balamurugan Iyer', specialization: 'Radiation Oncology' }
      ],
      'Prostate Cancer': [
        { name: 'Dr. Arjun Venkatesh', specialization: 'Urologic Oncology' },
        { name: 'Dr. Lalitha Balaji', specialization: 'Radiation Oncology' },
        { name: 'Dr. Srinivasan Nair', specialization: 'Medical Oncology' },
        { name: 'Dr. Pavithra Menon', specialization: 'Surgical Oncology' }
      ],
      'Colon Cancer': [
        { name: 'Dr. Ganesan Rajesh', specialization: 'Colorectal Surgery' },
        { name: 'Dr. Malini Krishnamurthy', specialization: 'Gastrointestinal Oncology' },
        { name: 'Dr. Venkatram Reddy', specialization: 'Medical Oncology' },
        { name: 'Dr. Saroja Devi', specialization: 'Radiation Oncology' }
      ]
    },
    'Andhra Pradesh': {
      'Lung Cancer': [
        { name: 'Dr. Ramesh Babu Goud', specialization: 'Pulmonary Oncology' },
        { name: 'Dr. Lakshmi Devi', specialization: 'Thoracic Surgery' },
        { name: 'Dr. Prasad Rao', specialization: 'Radiation Oncology' },
        { name: 'Dr. Sujatha Reddy', specialization: 'Medical Oncology' }
      ],
      'Breast Cancer': [
        { name: 'Dr. Padmaja Rani', specialization: 'Breast Oncology' },
        { name: 'Dr. Krishna Murthy', specialization: 'Surgical Oncology' },
        { name: 'Dr. Vasantha Kumari', specialization: 'Medical Oncology' },
        { name: 'Dr. Nagaraju Yadav', specialization: 'Radiation Oncology' }
      ],
      'Prostate Cancer': [
        { name: 'Dr. Venkateswara Rao', specialization: 'Urologic Oncology' },
        { name: 'Dr. Manjula Devi', specialization: 'Radiation Oncology' },
        { name: 'Dr. Srinivas Goud', specialization: 'Medical Oncology' },
        { name: 'Dr. Sharada Rani', specialization: 'Surgical Oncology' }
      ],
      'Colon Cancer': [
        { name: 'Dr. Rajendra Prasad', specialization: 'Colorectal Surgery' },
        { name: 'Dr. Pushpa Latha', specialization: 'Gastrointestinal Oncology' },
        { name: 'Dr. Harisha Kumar', specialization: 'Medical Oncology' },
        { name: 'Dr. Prameela Rani', specialization: 'Radiation Oncology' }
      ]
    }
  };

  static async getHospitalDoctors(hospitalId: string, cancerType: string): Promise<DoctorInfo[]> {
    try {
      console.log(`Getting unique doctors for hospital ${hospitalId} and cancer type ${cancerType}`);
      
      // Validate inputs
      if (!hospitalId || !cancerType) {
        console.error('Invalid hospitalId or cancerType provided');
        return this.getFallbackDoctors(hospitalId || 'dl_1', cancerType || 'Lung Cancer');
      }
      
      // Extract state and hospital info from hospitalId
      const hospitalParts = hospitalId.split('_');
      const statePrefix = hospitalParts[0] || 'dl';
      const hospitalNumber = parseInt(hospitalParts[1]) || 1;
      
      // Map state codes to full state names
      const stateMapping = {
        'dl': 'Delhi',
        'mh': 'Maharashtra', 
        'ka': 'Karnataka',
        'tn': 'Tamil Nadu',
        'ap': 'Andhra Pradesh',
        'ts': 'Telangana',
        'kl': 'Kerala',
        'gj': 'Gujarat',
        'rj': 'Rajasthan',
        'wb': 'West Bengal'
      };
      
      const stateName = stateMapping[statePrefix as keyof typeof stateMapping] || 'Delhi';
      console.log(`Mapped state: ${stateName} for prefix: ${statePrefix}`);
      
      // Get cancer-specific doctors for the state
      const statePool = this.doctorPools[stateName as keyof typeof this.doctorPools];
      if (!statePool) {
        console.warn(`No doctor pool found for state: ${stateName}, using Delhi as fallback`);
        return this.getFallbackDoctors(hospitalId, cancerType);
      }
      
      // Try to get cancer-specific doctors, with fallbacks
      let cancerDoctors = statePool[cancerType as keyof typeof statePool];
      
      if (!cancerDoctors) {
        // Try partial cancer type matching
        const cancerTypeKey = Object.keys(statePool).find(key => 
          key.toLowerCase().includes(cancerType.toLowerCase().split(' ')[0])
        );
        
        if (cancerTypeKey) {
          cancerDoctors = statePool[cancerTypeKey as keyof typeof statePool];
          console.log(`Using partial match: ${cancerTypeKey} for ${cancerType}`);
        } else {
          // Fallback to Lung Cancer doctors
          cancerDoctors = statePool['Lung Cancer'] || this.doctorPools['Delhi']['Lung Cancer'];
          console.log(`Using fallback doctors for ${cancerType}`);
        }
      }
      
      if (!cancerDoctors || cancerDoctors.length === 0) {
        console.error(`No doctors found for ${cancerType} in ${stateName}`);
        return this.getFallbackDoctors(hospitalId, cancerType);
      }
      
      // Create unique doctor variations for each hospital
      const hospitalSeed = this.generateHospitalSeed(hospitalId);
      const uniqueDoctors = this.generateUniqueDoctorsForHospital(cancerDoctors, hospitalId, hospitalSeed, cancerType);
      
      console.log(`Successfully generated ${uniqueDoctors.length} doctors for ${hospitalId}`);
      return uniqueDoctors;
      
    } catch (error) {
      console.error('Error in getHospitalDoctors:', error);
      return this.getFallbackDoctors(hospitalId || 'dl_1', cancerType || 'Lung Cancer');
    }
  }

  // Fallback method to ensure doctors are always returned
  private static getFallbackDoctors(hospitalId: string, cancerType: string): DoctorInfo[] {
    console.log(`Generating fallback doctors for ${hospitalId}`);
    
    const fallbackDoctors = [
      {
        id: `${hospitalId}_doc_1`,
        name: 'Dr. Rajesh Kumar',
        specialization: 'Medical Oncology',
        qualification: 'MD Medicine, DM Medical Oncology',
        experience_years: 15,
        hospital_id: hospitalId,
        consultation_fee: 1500,
        available_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        rating: 4.5,
        total_reviews: 200,
        phone: '+91-9876543210',
        email: 'dr.rajesh@hospital.com'
      },
      {
        id: `${hospitalId}_doc_2`,
        name: 'Dr. Priya Sharma',
        specialization: 'Surgical Oncology',
        qualification: 'MS Surgery, MCh Surgical Oncology',
        experience_years: 12,
        hospital_id: hospitalId,
        consultation_fee: 1800,
        available_days: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
        rating: 4.6,
        total_reviews: 150,
        phone: '+91-9876543211',
        email: 'dr.priya@hospital.com'
      },
      {
        id: `${hospitalId}_doc_3`,
        name: 'Dr. Amit Singh',
        specialization: 'Radiation Oncology',
        qualification: 'MD Radiotherapy, DNB Radiation Oncology',
        experience_years: 10,
        hospital_id: hospitalId,
        consultation_fee: 1200,
        available_days: ['Tuesday', 'Thursday', 'Friday', 'Saturday'],
        rating: 4.4,
        total_reviews: 180,
        phone: '+91-9876543212',
        email: 'dr.amit@hospital.com'
      }
    ];
    
    return fallbackDoctors;
  }

  // Generate unique seed for each hospital to ensure different doctors
  private static generateHospitalSeed(hospitalId: string): number {
    let seed = 0;
    for (let i = 0; i < hospitalId.length; i++) {
      seed += hospitalId.charCodeAt(i) * (i + 1);
    }
    return seed;
  }

  // Generate unique doctors for each hospital
  private static generateUniqueDoctorsForHospital(
    doctorTemplates: any[], 
    hospitalId: string, 
    seed: number, 
    cancerType: string
  ): DoctorInfo[] {
    try {
      if (!doctorTemplates || doctorTemplates.length === 0) {
        console.warn('No doctor templates provided, using fallback');
        return this.getFallbackDoctors(hospitalId, cancerType);
      }
      
      const hospitalNumber = parseInt(hospitalId.split('_')[1]) || 1;
      
      // Create variations of doctor names based on hospital
      const nameVariations = {
        1: { prefix: '', suffix: '' },
        2: { prefix: '', suffix: ' (Senior Consultant)' },
        3: { prefix: 'Prof. ', suffix: '' },
        4: { prefix: '', suffix: ' (Head of Department)' },
        5: { prefix: 'Dr. ', suffix: ' (Consultant)' }
      };
      
      const variation = nameVariations[hospitalNumber as keyof typeof nameVariations] || nameVariations[1];
      
      // Generate different doctor names for each hospital
      const uniqueDoctorNames = this.generateUniqueNamesForHospital(doctorTemplates, hospitalId, seed);
      
      if (!uniqueDoctorNames || uniqueDoctorNames.length === 0) {
        console.warn('No unique doctor names generated, using fallback');
        return this.getFallbackDoctors(hospitalId, cancerType);
      }
      
      return uniqueDoctorNames.map((doctorData, index) => {
        const doctorId = `${hospitalId}_doc_${index + 1}`;
        
        // Generate different qualifications based on specialization
        const getQualification = (specialization: string) => {
          const qualifications = {
            'Pulmonary Oncology': 'MD Medicine, DM Pulmonary Medicine, Fellowship Thoracic Oncology',
            'Thoracic Surgery': 'MS Surgery, MCh Thoracic Surgery, FACS',
            'Breast Oncology': 'MS Surgery, MCh Surgical Oncology, Fellowship Breast Cancer',
            'Urologic Oncology': 'MS Urology, MCh Urologic Oncology, FRCS',
            'Colorectal Surgery': 'MS Surgery, MCh GI Surgery, Fellowship Colorectal Surgery',
            'Gastrointestinal Oncology': 'MD Medicine, DM Medical Oncology, Fellowship GI Oncology',
            'Medical Oncology': 'MD Medicine, DM Medical Oncology, ESMO Certified',
            'Surgical Oncology': 'MS Surgery, MCh Surgical Oncology, FACS',
            'Radiation Oncology': 'MD Radiotherapy, DNB Radiation Oncology, FRCR'
          };
          return qualifications[specialization] || 'MD, DM Oncology';
        };
        
        // Use seeded random for consistent but unique values per hospital
        const seededRandom = this.seededRandom(seed + index);
        
        // Ensure doctor data is valid
        const doctorName = doctorData?.name || `Dr. Doctor ${index + 1}`;
        const specialization = doctorData?.specialization || 'Medical Oncology';
        
        return {
          id: doctorId,
          name: `${variation.prefix}${doctorName}${variation.suffix}`.replace('Dr. Dr. ', 'Dr. '),
          specialization: specialization,
          qualification: getQualification(specialization),
          experience_years: Math.max(5, 8 + (index * 2) + Math.floor(seededRandom * 12)),
          hospital_id: hospitalId,
          consultation_fee: Math.max(800, 1000 + (hospitalNumber * 200) + (index * 300) + Math.floor(seededRandom * 500)),
          available_days: this.getSeededAvailableDays(seed + index),
          rating: Math.max(3.5, Math.min(5.0, 4.1 + (seededRandom * 0.7))),
          total_reviews: Math.max(50, 100 + Math.floor(seededRandom * 500)),
          phone: this.generateSeededPhoneNumber(seed + index),
          email: this.generateEmail(doctorName)
        };
      });
      
    } catch (error) {
      console.error('Error in generateUniqueDoctorsForHospital:', error);
      return this.getFallbackDoctors(hospitalId, cancerType);
    }
  }

  // Generate unique doctor names for each hospital
  private static generateUniqueNamesForHospital(templates: any[], hospitalId: string, seed: number): any[] {
    try {
      if (!templates || templates.length === 0) {
        console.warn('No templates provided for generateUniqueNamesForHospital');
        return [
          { name: 'Dr. Rajesh Kumar', specialization: 'Medical Oncology' },
          { name: 'Dr. Priya Sharma', specialization: 'Surgical Oncology' },
          { name: 'Dr. Amit Singh', specialization: 'Radiation Oncology' }
        ];
      }
      
      const hospitalNumber = parseInt(hospitalId.split('_')[1]) || 1;
      const statePrefix = hospitalId.split('_')[0];
      
      // Additional name pools for variety based on cancer type
      const additionalNames: Record<string, any[]> = {
        'Lung Cancer': [
          { name: 'Dr. Arjun Malhotra', specialization: 'Pulmonary Oncology' },
          { name: 'Dr. Kavya Nair', specialization: 'Thoracic Surgery' },
          { name: 'Dr. Rohit Agarwal', specialization: 'Radiation Oncology' },
          { name: 'Dr. Sneha Joshi', specialization: 'Medical Oncology' },
          { name: 'Dr. Vikash Kumar', specialization: 'Pulmonary Medicine' },
          { name: 'Dr. Ritu Sharma', specialization: 'Chest Medicine' },
          { name: 'Dr. Naveen Gupta', specialization: 'Interventional Oncology' }
        ],
        'Breast Cancer': [
          { name: 'Dr. Ananya Sharma', specialization: 'Breast Oncology' },
          { name: 'Dr. Kiran Reddy', specialization: 'Surgical Oncology' },
          { name: 'Dr. Manish Gupta', specialization: 'Medical Oncology' },
          { name: 'Dr. Priyanka Singh', specialization: 'Radiation Oncology' },
          { name: 'Dr. Rajesh Khanna', specialization: 'Breast Surgery' },
          { name: 'Dr. Swati Verma', specialization: 'Oncoplastic Surgery' },
          { name: 'Dr. Nitin Jain', specialization: 'Reconstructive Surgery' }
        ],
        'Prostate Cancer': [
          { name: 'Dr. Deepak Verma', specialization: 'Urologic Oncology' },
          { name: 'Dr. Shalini Rao', specialization: 'Radiation Oncology' },
          { name: 'Dr. Amit Patel', specialization: 'Medical Oncology' },
          { name: 'Dr. Neha Kapoor', specialization: 'Surgical Oncology' },
          { name: 'Dr. Suresh Iyer', specialization: 'Urology' },
          { name: 'Dr. Rakesh Mehta', specialization: 'Robotic Surgery' },
          { name: 'Dr. Shilpa Agarwal', specialization: 'Uro-Oncology' }
        ],
        'Colon Cancer': [
          { name: 'Dr. Ravi Bansal', specialization: 'Colorectal Surgery' },
          { name: 'Dr. Meera Jain', specialization: 'Gastrointestinal Oncology' },
          { name: 'Dr. Sanjay Mehta', specialization: 'Medical Oncology' },
          { name: 'Dr. Pooja Agarwal', specialization: 'Radiation Oncology' },
          { name: 'Dr. Vinod Kumar', specialization: 'GI Surgery' },
          { name: 'Dr. Nisha Patel', specialization: 'Hepato-Biliary Surgery' },
          { name: 'Dr. Ashok Singh', specialization: 'Laparoscopic Surgery' }
        ]
      };
      
      // Get cancer-specific additional pool with fallback
      const cancerTypeKey = 'Lung Cancer'; // Default fallback
      const additionalPool = additionalNames[cancerTypeKey] || additionalNames['Lung Cancer'];
      
      // Combine original templates with additional names
      const allNames = [...templates];
      
      // Select different doctors based on hospital number
      const startIndex = (hospitalNumber - 1) * 2;
      const selectedDoctors = [];
      
      // Get 3-4 doctors per hospital with unique selection
      const numDoctors = Math.min(4, Math.max(3, 3 + (hospitalNumber % 2))); // 3-4 doctors per hospital
      
      for (let i = 0; i < numDoctors; i++) {
        const templateIndex = (startIndex + i + hospitalNumber * 2) % allNames.length;
        const additionalIndex = (startIndex + i + hospitalNumber * 3) % additionalPool.length;
        
        if (i < Math.ceil(numDoctors / 2) && allNames.length > 0) {
          // Use original template doctors (avoid duplicates)
          const doctor = allNames[templateIndex];
          if (doctor && !selectedDoctors.some(d => d.name === doctor.name)) {
            selectedDoctors.push({
              name: doctor.name || `Dr. Doctor ${i + 1}`,
              specialization: doctor.specialization || 'Medical Oncology'
            });
          }
        } else if (additionalPool.length > 0) {
          // Use additional doctors for variety (avoid duplicates)
          const doctor = additionalPool[additionalIndex];
          if (doctor && !selectedDoctors.some(d => d.name === doctor.name)) {
            selectedDoctors.push({
              name: doctor.name || `Dr. Doctor ${i + 1}`,
              specialization: doctor.specialization || 'Medical Oncology'
            });
          }
        }
      }
      
      // Ensure we have at least 3 doctors
      while (selectedDoctors.length < 3) {
        const fallbackNames = ['Dr. Rajesh Kumar', 'Dr. Priya Sharma', 'Dr. Amit Singh', 'Dr. Sneha Patel', 'Dr. Vikash Gupta'];
        const fallbackSpecs = ['Medical Oncology', 'Surgical Oncology', 'Radiation Oncology'];
        
        selectedDoctors.push({
          name: fallbackNames[selectedDoctors.length % fallbackNames.length],
          specialization: fallbackSpecs[selectedDoctors.length % fallbackSpecs.length]
        });
      }
      
      return selectedDoctors;
      
    } catch (error) {
      console.error('Error in generateUniqueNamesForHospital:', error);
      return [
        { name: 'Dr. Rajesh Kumar', specialization: 'Medical Oncology' },
        { name: 'Dr. Priya Sharma', specialization: 'Surgical Oncology' },
        { name: 'Dr. Amit Singh', specialization: 'Radiation Oncology' }
      ];
    }
  }

  // Seeded random number generator for consistent results
  private static seededRandom(seed: number): number {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  // Generate seeded available days
  private static getSeededAvailableDays(seed: number): string[] {
    try {
      const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const seededRandom = this.seededRandom(seed);
      const numDays = Math.max(3, Math.min(6, 4 + Math.floor(seededRandom * 3))); // 4-6 days
      
      // Use seeded selection
      const selectedDays = [];
      for (let i = 0; i < numDays && selectedDays.length < numDays; i++) {
        const dayIndex = Math.floor(this.seededRandom(seed + i + 100) * allDays.length);
        const selectedDay = allDays[dayIndex];
        if (selectedDay && !selectedDays.includes(selectedDay)) {
          selectedDays.push(selectedDay);
        }
      }
      
      // Ensure we have at least 3 days
      if (selectedDays.length < 3) {
        const defaultDays = ['Monday', 'Wednesday', 'Friday'];
        return defaultDays;
      }
      
      return selectedDays.sort((a, b) => {
        const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        return dayOrder.indexOf(a) - dayOrder.indexOf(b);
      });
    } catch (error) {
      console.error('Error generating seeded available days:', error);
      return ['Monday', 'Wednesday', 'Friday'];
    }
  }

  // Generate seeded phone number
  private static generateSeededPhoneNumber(seed: number): string {
    try {
      const codes = ['98', '99', '97', '96', '95', '94', '93', '92', '91', '90'];
      const codeIndex = Math.floor(this.seededRandom(seed) * codes.length);
      const code = codes[codeIndex] || '98';
      const number = Math.floor(this.seededRandom(seed + 1) * 90000000) + 10000000;
      return `+91-${code}${number}`;
    } catch (error) {
      console.error('Error generating seeded phone number:', error);
      return '+91-9876543210';
    }
  }

  private static getRandomAvailableDays(): string[] {
    const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const numDays = 4 + Math.floor(Math.random() * 3); // 4-6 days
    const shuffled = allDays.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numDays).sort((a, b) => {
      const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      return dayOrder.indexOf(a) - dayOrder.indexOf(b);
    });
  }

  private static generatePhoneNumber(): string {
    const codes = ['98', '99', '97', '96', '95', '94', '93', '92', '91', '90'];
    const code = codes[Math.floor(Math.random() * codes.length)];
    const number = Math.floor(Math.random() * 90000000) + 10000000;
    return `+91-${code}${number}`;
  }

  private static generateEmail(name: string): string {
    const cleanName = name.toLowerCase()
      .replace(/dr\.\s*/g, '')
      .replace(/\s+/g, '.')
      .replace(/[^a-z.]/g, '');
    const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return `${cleanName}@${domain}`;
  }
}
