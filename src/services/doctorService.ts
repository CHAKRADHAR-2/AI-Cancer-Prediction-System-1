
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
        { name: 'Dr. Sunita Reddy', specialization: 'Medical Oncology' }
      ],
      'Breast Cancer': [
        { name: 'Dr. Meera Patel', specialization: 'Breast Oncology' },
        { name: 'Dr. Kavita Singh', specialization: 'Surgical Oncology' },
        { name: 'Dr. Deepak Jain', specialization: 'Medical Oncology' },
        { name: 'Dr. Ravi Malhotra', specialization: 'Radiation Oncology' }
      ],
      'Prostate Cancer': [
        { name: 'Dr. Suresh Rao', specialization: 'Urologic Oncology' },
        { name: 'Dr. Vikram Mehta', specialization: 'Radiation Oncology' },
        { name: 'Dr. Anita Kapoor', specialization: 'Medical Oncology' },
        { name: 'Dr. Shalini Agarwal', specialization: 'Surgical Oncology' }
      ],
      'Colon Cancer': [
        { name: 'Dr. Amit Bansal', specialization: 'Colorectal Surgery' },
        { name: 'Dr. Neeta Sharma', specialization: 'Gastrointestinal Oncology' },
        { name: 'Dr. Rohit Verma', specialization: 'Medical Oncology' },
        { name: 'Dr. Pooja Khanna', specialization: 'Radiation Oncology' }
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
    console.log(`Getting doctors for hospital ${hospitalId} and cancer type ${cancerType}`);
    
    // Extract state and hospital info from hospitalId
    const statePrefix = hospitalId.split('_')[0];
    const hospitalNumber = hospitalId.split('_')[1];
    
    // Map state codes to full state names
    const stateMapping = {
      'dl': 'Delhi',
      'mh': 'Maharashtra', 
      'ka': 'Karnataka',
      'tn': 'Tamil Nadu',
      'ap': 'Andhra Pradesh'
    };
    
    const stateName = stateMapping[statePrefix as keyof typeof stateMapping] || 'Delhi';
    
    // Get cancer-specific doctors for the state
    const statePool = this.doctorPools[stateName as keyof typeof this.doctorPools];
    const cancerDoctors = statePool?.[cancerType as keyof typeof statePool] || statePool?.['Lung Cancer'] || this.doctorPools['Delhi']['Lung Cancer'];
    
    // Generate unique doctors for each hospital by combining name with hospital suffix
    const mockDoctors = cancerDoctors.map((doctorTemplate, index) => {
      const doctorId = `${hospitalId}_doc_${index + 1}`;
      const uniqueName = `${doctorTemplate.name}`;
      
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
      
      return {
        id: doctorId,
        name: uniqueName,
        specialization: doctorTemplate.specialization,
        qualification: getQualification(doctorTemplate.specialization),
        experience_years: 8 + (index * 3) + Math.floor(Math.random() * 10),
        hospital_id: hospitalId,
        consultation_fee: 1000 + (index * 300) + Math.floor(Math.random() * 500),
        available_days: this.getRandomAvailableDays(),
        rating: 4.2 + (Math.random() * 0.6),
        total_reviews: 150 + Math.floor(Math.random() * 400),
        phone: this.generatePhoneNumber(),
        email: this.generateEmail(uniqueName)
      };
    });

    return mockDoctors;
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
