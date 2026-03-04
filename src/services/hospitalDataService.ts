import { comprehensiveCancerHospitals, getCancerHospitalsByState, getAllCancerHospitals, searchCancerHospitals, CancerHospitalData } from '../data/comprehensiveCancerHospitals';

export interface HospitalData {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  phone: string;
  email?: string;
  website?: string;
  specializations: string[];
  rating: number;
  total_reviews: number;
  is_government: boolean;
  bed_capacity: number;
  established_year: number;
}

export class HospitalDataService {
  static getHospitalsByState(state: string, cancerType: string): HospitalData[] {
    // First try to get hospitals from comprehensive cancer database
    const cancerHospitals = getCancerHospitalsByState(state);
    
    if (cancerHospitals.length > 0) {
      // Filter by cancer type if specified and not generic
      if (cancerType && cancerType !== 'Oncology' && cancerType !== 'General') {
        const filtered = cancerHospitals.filter(hospital => 
          hospital.specializations.some(spec => 
            spec.toLowerCase().includes(cancerType.toLowerCase()) ||
            spec.toLowerCase().includes('oncology') ||
            spec.toLowerCase().includes('cancer')
          )
        );
        if (filtered.length > 0) {
          return filtered;
        }
      }
      return cancerHospitals;
    }
    
    // Fallback to original data if no cancer hospitals found
    const hospitalsByState: Record<string, HospitalData[]> = {
      'Andhra Pradesh': [
        {
          id: 'ap_1',
          name: 'King George Hospital',
          address: 'Maharanipeta, Visakhapatnam, Andhra Pradesh',
          city: 'Visakhapatnam',
          state: 'Andhra Pradesh',
          pincode: '530002',
          latitude: 17.7231,
          longitude: 83.3012,
          phone: '+91-891-2565555',
          email: 'info@kgh.gov.in',
          website: 'https://www.aphealth.gov.in/',
          specializations: ['Medical Oncology', 'Surgical Oncology', 'Radiation Oncology', cancerType],
          rating: 4.3,
          total_reviews: 892,
          is_government: true,
          bed_capacity: 750,
          established_year: 1845
        },
        {
          id: 'ap_2',
          name: 'Government General Hospital Vijayawada',
          address: 'Benz Circle, Vijayawada, Andhra Pradesh',
          city: 'Vijayawada',
          state: 'Andhra Pradesh',
          pincode: '520010',
          latitude: 16.5062,
          longitude: 80.6480,
          phone: '+91-866-2578900',
          email: 'info@gghvjw.gov.in',
          website: 'https://www.aphealth.gov.in/',
          specializations: ['Oncology', 'Cancer Surgery', 'Radiation Therapy', cancerType],
          rating: 4.1,
          total_reviews: 654,
          is_government: true,
          bed_capacity: 600,
          established_year: 1925
        }
      ],
      'Telangana': [
        {
          id: 'ts_1',
          name: 'Basavatarakam Indo American Cancer Hospital',
          address: 'Road No 10, Banjara Hills, Hyderabad, Telangana',
          city: 'Hyderabad',
          state: 'Telangana',
          pincode: '500034',
          latitude: 17.4126,
          longitude: 78.4482,
          phone: '+91-40-23542000',
          email: 'info@biach.org',
          website: 'https://www.biach.org/',
          specializations: ['Medical Oncology', 'Surgical Oncology', 'Radiation Oncology', cancerType],
          rating: 4.7,
          total_reviews: 1234,
          is_government: false,
          bed_capacity: 200,
          established_year: 1985
        },
        {
          id: 'ts_2',
          name: 'Nizam Institute of Medical Sciences (NIMS)',
          address: 'Punjagutta, Hyderabad, Telangana',
          city: 'Hyderabad',
          state: 'Telangana',
          pincode: '500082',
          latitude: 17.4239,
          longitude: 78.4738,
          phone: '+91-40-23489000',
          email: 'info@nims.edu.in',
          website: 'https://www.nims.edu.in/',
          specializations: ['Oncology', 'Cancer Surgery', 'Radiation Therapy', cancerType],
          rating: 4.5,
          total_reviews: 892,
          is_government: true,
          bed_capacity: 750,
          established_year: 1989
        }
      ],
      'Karnataka': [
        {
          id: 'ka_1',
          name: 'Kidwai Memorial Institute of Oncology',
          address: 'Dr M H Marigowda Road, Jayanagar 4th Block, Bangalore, Karnataka',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560029',
          latitude: 12.9352,
          longitude: 77.6245,
          phone: '+91-80-26560721',
          email: 'kidwai@kmc.gov.in',
          website: 'https://kidwai.kar.nic.in/',
          specializations: ['Pediatric Oncology', 'Blood Cancer', 'Bone Cancer', cancerType],
          rating: 4.6,
          total_reviews: 987,
          is_government: true,
          bed_capacity: 650,
          established_year: 1973
        },
        {
          id: 'ka_2',
          name: 'HCG Cancer Centre Bangalore',
          address: 'No 8, P Kalinga Rao Road, Sampangi Ram Nagar, Bangalore, Karnataka',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560027',
          latitude: 12.9716,
          longitude: 77.5946,
          phone: '+91-80-40206969',
          website: 'https://www.hcgoncology.com/',
          specializations: ['Breast Cancer', 'Lung Cancer', 'Medical Oncology', cancerType],
          rating: 4.5,
          total_reviews: 678,
          is_government: false,
          bed_capacity: 200,
          established_year: 2008
        },
        {
          id: 'ka_3',
          name: 'Manipal Hospital Bangalore',
          address: '98, Rustum Bagh, Airport Road, Bangalore, Karnataka',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560017',
          latitude: 12.9698,
          longitude: 77.6469,
          phone: '+91-80-25023200',
          email: 'info@manipalhospitals.com',
          website: 'https://www.manipalhospitals.com/',
          specializations: ['Medical Oncology', 'Surgical Oncology', 'Radiation Oncology', cancerType],
          rating: 4.4,
          total_reviews: 1156,
          is_government: false,
          bed_capacity: 650,
          established_year: 1991
        }
      ],
      'Tamil Nadu': [
        {
          id: 'tn_1',
          name: 'Cancer Institute (WIA)',
          address: '38, Sardar Patel Road, Adyar, Chennai, Tamil Nadu',
          city: 'Chennai',
          state: 'Tamil Nadu',
          pincode: '600020',
          latitude: 13.0067,
          longitude: 80.2206,
          phone: '+91-44-24910721',
          email: 'info@cancerinstitutewia.org',
          website: 'https://www.cancerinstitutewia.org/',
          specializations: ['Breast Cancer', 'Cervical Cancer', 'Head and Neck Cancer', cancerType],
          rating: 4.7,
          total_reviews: 1456,
          is_government: false,
          bed_capacity: 543,
          established_year: 1954
        },
        {
          id: 'tn_2',
          name: 'Apollo Cancer Centre',
          address: '21, Greams Lane, Off Greams Road, Chennai, Tamil Nadu',
          city: 'Chennai',
          state: 'Tamil Nadu',
          pincode: '600006',
          latitude: 13.0674,
          longitude: 80.2431,
          phone: '+91-44-28296000',
          website: 'https://www.apollohospitals.com/cancer-care/',
          specializations: ['Medical Oncology', 'Radiation Oncology', 'Surgical Oncology', cancerType],
          rating: 4.6,
          total_reviews: 834,
          is_government: false,
          bed_capacity: 300,
          established_year: 1995
        },
        {
          id: 'tn_3',
          name: 'Government General Hospital Chennai',
          address: 'Park Town, Chennai, Tamil Nadu',
          city: 'Chennai',
          state: 'Tamil Nadu',
          pincode: '600003',
          latitude: 13.0878,
          longitude: 80.2785,
          phone: '+91-44-25305000',
          email: 'info@gghosp.gov.tn',
          website: 'https://www.tnhealth.org/',
          specializations: ['General Oncology', 'Cancer Surgery', 'Radiation Therapy', cancerType],
          rating: 4.2,
          total_reviews: 1023,
          is_government: true,
          bed_capacity: 1200,
          established_year: 1664
        }
      ],
      'Kerala': [
        {
          id: 'kl_1',
          name: 'Regional Cancer Centre (RCC)',
          address: 'Medical College Campus, Thiruvananthapuram, Kerala',
          city: 'Thiruvananthapuram',
          state: 'Kerala',
          pincode: '695011',
          latitude: 8.5241,
          longitude: 76.9366,
          phone: '+91-471-2442541',
          website: 'https://rcc.gov.in/',
          specializations: ['Cancer Treatment', 'Palliative Care', 'Radiation Oncology', cancerType],
          rating: 4.4,
          total_reviews: 567,
          is_government: true,
          bed_capacity: 300,
          established_year: 1982
        },
        {
          id: 'kl_2',
          name: 'Malabar Cancer Centre',
          address: 'Moozhikkara, Thalassery, Kannur, Kerala',
          city: 'Kannur',
          state: 'Kerala',
          pincode: '670103',
          latitude: 11.7401,
          longitude: 75.4867,
          phone: '+91-490-2344334',
          email: 'info@malabarcancercentre.com',
          website: 'https://www.malabarcancercentre.com/',
          specializations: ['Medical Oncology', 'Surgical Oncology', 'Radiation Oncology', cancerType],
          rating: 4.2,
          total_reviews: 456,
          is_government: false,
          bed_capacity: 200,
          established_year: 1999
        }
      ],
      'Maharashtra': [
        {
          id: 'mh_1',
          name: 'Tata Memorial Hospital',
          address: 'Dr Ernest Borges Marg, Parel, Mumbai, Maharashtra',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400012',
          latitude: 19.0176,
          longitude: 72.8562,
          phone: '+91-22-24177000',
          email: 'info@tmc.gov.in',
          website: 'https://tmc.gov.in/',
          specializations: ['Medical Oncology', 'Surgical Oncology', 'Radiation Oncology', cancerType],
          rating: 4.9,
          total_reviews: 1923,
          is_government: true,
          bed_capacity: 629,
          established_year: 1941
        },
        {
          id: 'mh_2',
          name: 'HCG Cancer Centre Mumbai',
          address: 'Kalyan Shil Road, Borivali East, Mumbai, Maharashtra',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400066',
          latitude: 19.2307,
          longitude: 72.8567,
          phone: '+91-22-66473000',
          email: 'info@hcgoncology.com',
          website: 'https://www.hcgoncology.com/',
          specializations: ['Breast Cancer', 'Lung Cancer', 'Medical Oncology', cancerType],
          rating: 4.6,
          total_reviews: 756,
          is_government: false,
          bed_capacity: 150,
          established_year: 2009
        },
        {
          id: 'mh_3',
          name: 'Ruby Hall Clinic',
          address: '40, Sassoon Road, Pune, Maharashtra',
          city: 'Pune',
          state: 'Maharashtra',
          pincode: '411001',
          latitude: 18.5204,
          longitude: 73.8567,
          phone: '+91-20-26122100',
          email: 'info@rubyhall.com',
          website: 'https://www.rubyhall.com/',
          specializations: ['Medical Oncology', 'Surgical Oncology', 'Radiation Oncology', cancerType],
          rating: 4.4,
          total_reviews: 987,
          is_government: false,
          bed_capacity: 750,
          established_year: 1959
        }
      ],
      'Gujarat': [
        {
          id: 'gj_1',
          name: 'Gujarat Cancer & Research Institute',
          address: 'Civil Hospital Campus, Asarwa, Ahmedabad, Gujarat',
          city: 'Ahmedabad',
          state: 'Gujarat',
          pincode: '380016',
          latitude: 23.0395,
          longitude: 72.5610,
          phone: '+91-79-22682201',
          website: 'https://gcri.gujarat.gov.in/',
          specializations: ['Cancer Research', 'Medical Oncology', 'Radiation Oncology', cancerType],
          rating: 4.5,
          total_reviews: 543,
          is_government: true,
          bed_capacity: 400,
          established_year: 1960
        },
        {
          id: 'gj_2',
          name: 'Sterling Hospital Ahmedabad',
          address: 'Behind Drive-in Cinema, Mithakhali, Ahmedabad, Gujarat',
          city: 'Ahmedabad',
          state: 'Gujarat',
          pincode: '380009',
          latitude: 23.0225,
          longitude: 72.5714,
          phone: '+91-79-66446644',
          email: 'info@sterlinghospitals.com',
          website: 'https://www.sterlinghospitals.com/',
          specializations: ['Medical Oncology', 'Surgical Oncology', 'Radiation Oncology', cancerType],
          rating: 4.3,
          total_reviews: 789,
          is_government: false,
          bed_capacity: 350,
          established_year: 1998
        }
      ],
      'Rajasthan': [
        {
          id: 'rj_1',
          name: 'Bhagwan Mahaveer Cancer Hospital & Research Centre',
          address: 'JLN Marg, Jhalana Gram, Malviya Nagar, Jaipur, Rajasthan',
          city: 'Jaipur',
          state: 'Rajasthan',
          pincode: '302017',
          latitude: 26.9124,
          longitude: 75.7873,
          phone: '+91-141-2560994',
          website: 'https://www.bmchrc.org/',
          specializations: ['Cancer Treatment', 'Radiation Therapy', 'Medical Oncology', cancerType],
          rating: 4.3,
          total_reviews: 432,
          is_government: false,
          bed_capacity: 300,
          established_year: 1989
        },
        {
          id: 'rj_2',
          name: 'SMS Medical College & Hospital',
          address: 'JLN Marg, Jaipur, Rajasthan',
          city: 'Jaipur',
          state: 'Rajasthan',
          pincode: '302004',
          latitude: 26.9196,
          longitude: 75.8265,
          phone: '+91-141-2518121',
          email: 'info@smsmedicalcollege.com',
          website: 'https://www.smsmedicalcollege.com/',
          specializations: ['General Oncology', 'Cancer Surgery', 'Radiation Therapy', cancerType],
          rating: 4.1,
          total_reviews: 876,
          is_government: true,
          bed_capacity: 2000,
          established_year: 1947
        }
      ],
      'West Bengal': [
        {
          id: 'wb_1',
          name: 'Chittaranjan National Cancer Institute',
          address: '37, S P Mukherjee Road, Kolkata, West Bengal',
          city: 'Kolkata',
          state: 'West Bengal',
          pincode: '700026',
          latitude: 22.5726,
          longitude: 88.3639,
          phone: '+91-33-24475101',
          website: 'https://cnci.org.in/',
          specializations: ['Cancer Research', 'Oncology', 'Radiation Therapy', cancerType],
          rating: 4.4,
          total_reviews: 678,
          is_government: true,
          bed_capacity: 500,
          established_year: 1958
        },
        {
          id: 'wb_2',
          name: 'Tata Medical Center',
          address: '14 MAR (EW), New Town, Rajarhat, Kolkata, West Bengal',
          city: 'Kolkata',
          state: 'West Bengal',
          pincode: '700156',
          latitude: 22.5957,
          longitude: 88.4797,
          phone: '+91-33-66057000',
          email: 'info@tmckolkata.com',
          website: 'https://www.tmckolkata.com/',
          specializations: ['Medical Oncology', 'Surgical Oncology', 'Radiation Oncology', cancerType],
          rating: 4.6,
          total_reviews: 1234,
          is_government: false,
          bed_capacity: 460,
          established_year: 2011
        }
      ],
      'Delhi': [
        {
          id: 'dl_1',
          name: 'All India Institute of Medical Sciences (AIIMS)',
          address: 'Ansari Nagar, New Delhi, Delhi',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110029',
          latitude: 28.5672,
          longitude: 77.2100,
          phone: '+91-11-26588500',
          email: 'aiims.delhi@gmail.com',
          website: 'https://www.aiims.edu/',
          specializations: ['Oncology', 'Cancer Surgery', 'Radiation Therapy', cancerType],
          rating: 4.8,
          total_reviews: 2847,
          is_government: true,
          bed_capacity: 2478,
          established_year: 1956
        },
        {
          id: 'dl_2',
          name: 'Rajiv Gandhi Cancer Institute & Research Centre',
          address: 'Sector 5, Rohini, New Delhi, Delhi',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110085',
          latitude: 28.7041,
          longitude: 77.1025,
          phone: '+91-11-47022222',
          website: 'https://www.rgcirc.org/',
          specializations: ['Medical Oncology', 'Surgical Oncology', 'Radiation Oncology', cancerType],
          rating: 4.6,
          total_reviews: 1234,
          is_government: false,
          bed_capacity: 400,
          established_year: 1996
        },
        {
          id: 'dl_3',
          name: 'Max Super Speciality Hospital Saket',
          address: '1, 2, Press Enclave Road, Saket, New Delhi, Delhi',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110017',
          latitude: 28.5245,
          longitude: 77.2066,
          phone: '+91-11-26515050',
          email: 'info@maxhealthcare.com',
          website: 'https://www.maxhealthcare.in/',
          specializations: ['Medical Oncology', 'Surgical Oncology', 'Radiation Oncology', cancerType],
          rating: 4.5,
          total_reviews: 1567,
          is_government: false,
          bed_capacity: 500,
          established_year: 2006
        }
      ]
    };

    // Return hospitals for the specified state, or empty array if state not found
    const fallbackHospitals = hospitalsByState[state] || [];
    
    // If we have fallback hospitals, ensure they include cancer specializations
    return fallbackHospitals.map(hospital => ({
      ...hospital,
      specializations: [...hospital.specializations, cancerType].filter((spec, index, arr) => 
        arr.indexOf(spec) === index
      )
    }));
  }
  
  // New method to get all cancer hospitals
  static getAllCancerHospitals(): HospitalData[] {
    return getAllCancerHospitals();
  }
  
  // New method to search cancer hospitals
  static searchCancerHospitals(query: string): HospitalData[] {
    return searchCancerHospitals(query);
  }
  
  // New method to get hospitals by multiple states (for nearby state search)
  static getHospitalsByMultipleStates(states: string[], cancerType: string): HospitalData[] {
    const allHospitals: HospitalData[] = [];
    
    for (const state of states) {
      const stateHospitals = this.getHospitalsByState(state, cancerType);
      allHospitals.push(...stateHospitals);
    }
    
    // Remove duplicates based on hospital ID
    const uniqueHospitals = allHospitals.filter((hospital, index, arr) => 
      arr.findIndex(h => h.id === hospital.id) === index
    );
    
    return uniqueHospitals;
  }
}
