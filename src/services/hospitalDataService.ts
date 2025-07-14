
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
    const hospitalsByState: Record<string, HospitalData[]> = {
      'Andhra Pradesh': [
        {
          id: 'ap_1',
          name: 'Basavatarakam Indo American Cancer Hospital',
          address: 'Road No 10, Banjara Hills, Hyderabad',
          city: 'Hyderabad',
          state: 'Andhra Pradesh',
          pincode: '500034',
          latitude: 17.4126,
          longitude: 78.4482,
          phone: '+91-40-23542000',
          email: 'info@biach.org',
          website: 'https://www.biach.org',
          specializations: ['Medical Oncology', 'Surgical Oncology', 'Radiation Oncology', cancerType],
          rating: 4.7,
          total_reviews: 1234,
          is_government: false,
          bed_capacity: 200,
          established_year: 1985
        },
        {
          id: 'ap_2',
          name: 'Nizam Institute of Medical Sciences',
          address: 'Punjagutta, Hyderabad',
          city: 'Hyderabad',
          state: 'Andhra Pradesh',
          pincode: '500082',
          latitude: 17.4239,
          longitude: 78.4738,
          phone: '+91-40-23489000',
          email: 'info@nims.edu.in',
          website: 'https://www.nims.edu.in',
          specializations: ['Oncology', 'Cancer Surgery', cancerType],
          rating: 4.5,
          total_reviews: 892,
          is_government: true,
          bed_capacity: 750,
          established_year: 1989
        }
      ],
      'Telangana': [
        {
          id: 'ts_1',
          name: 'American Oncology Institute',
          address: 'Hyderabad',
          city: 'Hyderabad',
          state: 'Telangana',
          pincode: '500034',
          latitude: 17.4239,
          longitude: 78.4738,
          phone: '+91-40-40206969',
          website: 'https://www.americanoncology.com',
          specializations: ['Medical Oncology', 'Surgical Oncology', cancerType],
          rating: 4.6,
          total_reviews: 567,
          is_government: false,
          bed_capacity: 180,
          established_year: 2009
        }
      ],
      'Karnataka': [
        {
          id: 'ka_1',
          name: 'Kidwai Memorial Institute of Oncology',
          address: 'Dr M H Marigowda Road, Bangalore',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560029',
          latitude: 12.9352,
          longitude: 77.6245,
          phone: '+91-80-26560721',
          email: 'kidwai@kmc.gov.in',
          website: 'https://kidwai.kar.nic.in',
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
          address: 'No 8, P Kalinga Rao Road, Sampangi Ram Nagar',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560027',
          latitude: 12.9716,
          longitude: 77.5946,
          phone: '+91-80-40206969',
          website: 'https://www.hcgoncology.com',
          specializations: ['Breast Cancer', 'Lung Cancer', cancerType],
          rating: 4.5,
          total_reviews: 678,
          is_government: false,
          bed_capacity: 200,
          established_year: 2008
        }
      ],
      'Tamil Nadu': [
        {
          id: 'tn_1',
          name: 'Cancer Institute (WIA)',
          address: 'Adyar, Chennai',
          city: 'Chennai',
          state: 'Tamil Nadu',
          pincode: '600020',
          latitude: 13.0067,
          longitude: 80.2206,
          phone: '+91-44-24910721',
          email: 'info@cancerinstitutewia.org',
          website: 'https://www.cancerinstitutewia.org',
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
          address: 'Greams Lane, Off Greams Road, Chennai',
          city: 'Chennai',
          state: 'Tamil Nadu',
          pincode: '600006',
          latitude: 13.0674,
          longitude: 80.2431,
          phone: '+91-44-28296000',
          website: 'https://www.apollocancer.com',
          specializations: ['Medical Oncology', 'Radiation Oncology', cancerType],
          rating: 4.6,
          total_reviews: 834,
          is_government: false,
          bed_capacity: 300,
          established_year: 1995
        }
      ],
      'Kerala': [
        {
          id: 'kl_1',
          name: 'Regional Cancer Centre',
          address: 'Medical College Campus, Thiruvananthapuram',
          city: 'Thiruvananthapuram',
          state: 'Kerala',
          pincode: '695011',
          latitude: 8.5241,
          longitude: 76.9366,
          phone: '+91-471-2442541',
          website: 'https://www.rcc.gov.in',
          specializations: ['Cancer Treatment', 'Palliative Care', cancerType],
          rating: 4.4,
          total_reviews: 567,
          is_government: true,
          bed_capacity: 300,
          established_year: 1982
        }
      ],
      'Maharashtra': [
        {
          id: 'mh_1',
          name: 'Tata Memorial Hospital',
          address: 'Dr Ernest Borges Marg, Parel',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400012',
          latitude: 19.0176,
          longitude: 72.8562,
          phone: '+91-22-24177000',
          email: 'info@tmc.gov.in',
          website: 'https://tmc.gov.in',
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
          address: 'Borivali East, Mumbai',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400066',
          latitude: 19.2307,
          longitude: 72.8567,
          phone: '+91-22-66473000',
          email: 'info@hcgoncology.com',
          website: 'https://www.hcgoncology.com',
          specializations: ['Breast Cancer', 'Lung Cancer', cancerType],
          rating: 4.6,
          total_reviews: 756,
          is_government: false,
          bed_capacity: 150,
          established_year: 2009
        }
      ],
      'Gujarat': [
        {
          id: 'gj_1',
          name: 'Gujarat Cancer & Research Institute',
          address: 'Civil Hospital Campus, Asarwa, Ahmedabad',
          city: 'Ahmedabad',
          state: 'Gujarat',
          pincode: '380016',
          latitude: 23.0395,
          longitude: 72.5610,
          phone: '+91-79-22682201',
          website: 'https://www.gcriindia.org',
          specializations: ['Cancer Research', 'Medical Oncology', cancerType],
          rating: 4.5,
          total_reviews: 543,
          is_government: true,
          bed_capacity: 400,
          established_year: 1960
        }
      ],
      'Rajasthan': [
        {
          id: 'rj_1',
          name: 'Bhagwan Mahaveer Cancer Hospital',
          address: 'JLN Marg, Jaipur',
          city: 'Jaipur',
          state: 'Rajasthan',
          pincode: '302017',
          latitude: 26.9124,
          longitude: 75.7873,
          phone: '+91-141-2560994',
          website: 'https://www.bmchrc.org',
          specializations: ['Cancer Treatment', 'Radiation Therapy', cancerType],
          rating: 4.3,
          total_reviews: 432,
          is_government: false,
          bed_capacity: 300,
          established_year: 1989
        }
      ],
      'West Bengal': [
        {
          id: 'wb_1',
          name: 'Chittaranjan National Cancer Institute',
          address: '37, S P Mukherjee Road, Kolkata',
          city: 'Kolkata',
          state: 'West Bengal',
          pincode: '700026',
          latitude: 22.5726,
          longitude: 88.3639,
          phone: '+91-33-24475101',
          website: 'https://www.cnci.org.in',
          specializations: ['Cancer Research', 'Oncology', cancerType],
          rating: 4.4,
          total_reviews: 678,
          is_government: true,
          bed_capacity: 500,
          established_year: 1958
        }
      ],
      'Delhi': [
        {
          id: 'dl_1',
          name: 'All India Institute of Medical Sciences (AIIMS)',
          address: 'Ansari Nagar, New Delhi',
          city: 'Delhi',
          state: 'Delhi',
          pincode: '110029',
          latitude: 28.5672,
          longitude: 77.2100,
          phone: '+91-11-26588500',
          email: 'aiims.delhi@gmail.com',
          website: 'https://www.aiims.edu',
          specializations: ['Oncology', 'Cancer Surgery', 'Radiation Therapy', cancerType],
          rating: 4.8,
          total_reviews: 2847,
          is_government: true,
          bed_capacity: 2478,
          established_year: 1956
        },
        {
          id: 'dl_2',
          name: 'Rajiv Gandhi Cancer Institute',
          address: 'Sector 5, Rohini, New Delhi',
          city: 'Delhi',
          state: 'Delhi',
          pincode: '110085',
          latitude: 28.7041,
          longitude: 77.1025,
          phone: '+91-11-47022222',
          website: 'https://www.rgcirc.org',
          specializations: ['Medical Oncology', 'Surgical Oncology', cancerType],
          rating: 4.6,
          total_reviews: 1234,
          is_government: false,
          bed_capacity: 400,
          established_year: 1996
        }
      ]
    };

    // Return hospitals for the specified state, or empty array if state not found
    return hospitalsByState[state] || [];
  }
}
