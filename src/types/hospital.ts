
export interface Hospital {
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
  // Add missing properties used in HospitalFinder
  distance?: number;
  hours?: string;
  specialties?: string[]; // Alternative to specializations for compatibility
}

export interface Doctor {
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
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
  address?: string;
}

export interface HospitalWithDistance extends Hospital {
  distance: number;
  doctors?: Doctor[];
}
