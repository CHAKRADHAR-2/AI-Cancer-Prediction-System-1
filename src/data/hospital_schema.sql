-- Create hospitals table
CREATE TABLE IF NOT EXISTS hospitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  pincode VARCHAR(10) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  website VARCHAR(255),
  specializations TEXT[] NOT NULL,
  rating DECIMAL(3, 2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  is_government BOOLEAN DEFAULT false,
  bed_capacity INTEGER,
  established_year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  specialization VARCHAR(255) NOT NULL,
  qualification TEXT NOT NULL,
  experience_years INTEGER NOT NULL,
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  consultation_fee INTEGER DEFAULT 0,
  available_days TEXT[] DEFAULT ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  rating DECIMAL(3, 2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_hospitals_location ON hospitals USING GIST (
  point(longitude, latitude)
);
CREATE INDEX IF NOT EXISTS idx_hospitals_specializations ON hospitals USING GIN (specializations);
CREATE INDEX IF NOT EXISTS idx_hospitals_city ON hospitals (city);
CREATE INDEX IF NOT EXISTS idx_doctors_hospital_id ON doctors (hospital_id);
CREATE INDEX IF NOT EXISTS idx_doctors_specialization ON doctors (specialization);

-- Insert sample hospital data for major Indian cities
INSERT INTO hospitals (name, address, city, state, pincode, latitude, longitude, phone, email, website, specializations, rating, total_reviews, is_government, bed_capacity, established_year) VALUES
-- Mumbai Hospitals
('Tata Memorial Hospital', 'Dr Ernest Borges Marg, Parel, Mumbai', 'Mumbai', 'Maharashtra', '400012', 19.0083, 72.8453, '+91-22-2417-7000', 'info@tmc.gov.in', 'https://tmc.gov.in', ARRAY['Oncology', 'Cancer Surgery', 'Radiation Oncology', 'Medical Oncology'], 4.8, 2500, true, 629, 1941),
('Kokilaben Dhirubhai Ambani Hospital', '4 Bundles, Rao Saheb, Achutrao Patwardhan Marg, Mumbai', 'Mumbai', 'Maharashtra', '400053', 19.1326, 72.8263, '+91-22-4269-6969', 'info@kokilabenhospital.com', 'https://kokilabenhospital.com', ARRAY['Oncology', 'Robotic Surgery', 'Radiation Oncology'], 4.6, 1800, false, 750, 2009),
('Lilavati Hospital', 'A-791, Bandra Reclamation, Bandra West, Mumbai', 'Mumbai', 'Maharashtra', '400050', 19.0596, 72.8295, '+91-22-2675-1000', 'info@lilavatihospital.com', 'https://lilavatihospital.com', ARRAY['Oncology', 'General Surgery', 'Medical Oncology'], 4.5, 1500, false, 323, 1978),

-- Delhi Hospitals  
('All India Institute of Medical Sciences (AIIMS)', 'Ansari Nagar, New Delhi', 'New Delhi', 'Delhi', '110029', 28.5672, 77.2100, '+91-11-2658-8500', 'info@aiims.edu', 'https://aiims.edu', ARRAY['Oncology', 'Surgical Oncology', 'Radiation Oncology', 'Medical Oncology'], 4.9, 5000, true, 2478, 1956),
('Max Super Speciality Hospital', '1-2, Press Enclave Road, Saket, New Delhi', 'New Delhi', 'Delhi', '110017', 28.5245, 77.2066, '+91-11-2651-5050', 'info@maxhealthcare.com', 'https://maxhealthcare.in', ARRAY['Oncology', 'Robotic Surgery', 'Cancer Care'], 4.7, 2200, false, 500, 2006),
('Apollo Hospital', 'Mathura Road, Sarita Vihar, New Delhi', 'New Delhi', 'Delhi', '110076', 28.5355, 77.2910, '+91-11-2692-5858', 'info@apollohospitals.com', 'https://apollohospitals.com', ARRAY['Oncology', 'Transplant', 'Cancer Surgery'], 4.6, 1900, false, 710, 1996),

-- Bangalore Hospitals
('Kidwai Memorial Institute of Oncology', 'Dr M H Marigowda Rd, Bangalore', 'Bangalore', 'Karnataka', '560029', 12.9386, 77.5797, '+91-80-2659-7000', 'info@kidwai.kar.nic.in', 'https://kidwai.kar.nic.in', ARRAY['Oncology', 'Radiation Oncology', 'Surgical Oncology'], 4.7, 2000, true, 631, 1973),
('Fortis Hospital', '14, Cunningham Road, Bangalore', 'Bangalore', 'Karnataka', '560052', 12.9719, 77.5937, '+91-80-6621-4444', 'info@fortishealthcare.com', 'https://fortishealthcare.com', ARRAY['Oncology', 'Robotic Surgery', 'Medical Oncology'], 4.5, 1600, false, 400, 2006),
('Narayana Health City', '258/A, Bommasandra Industrial Area, Bangalore', 'Bangalore', 'Karnataka', '560099', 12.8058, 77.6562, '+91-80-7122-2200', 'info@narayanahealth.org', 'https://narayanahealth.org', ARRAY['Oncology', 'Cardiac Surgery', 'Cancer Care'], 4.6, 1800, false, 1400, 2000),

-- Chennai Hospitals
('Cancer Institute (WIA)', '38, Sardar Patel Road, Adyar, Chennai', 'Chennai', 'Tamil Nadu', '600020', 13.0067, 80.2206, '+91-44-2449-1414', 'info@cancerinstitutewia.org', 'https://cancerinstitutewia.org', ARRAY['Oncology', 'Radiation Oncology', 'Medical Oncology'], 4.8, 2800, false, 350, 1954),
('Apollo Cancer Centre', '320, Anna Salai, Teynampet, Chennai', 'Chennai', 'Tamil Nadu', '600035', 13.0389, 80.2619, '+91-44-2829-0200', 'info@apollocancer.com', 'https://apollocancer.com', ARRAY['Oncology', 'Proton Therapy', 'Robotic Surgery'], 4.7, 2100, false, 500, 2003),

-- Hyderabad Hospitals
('Basavatarakam Indo American Cancer Hospital', 'Road No. 10, Banjara Hills, Hyderabad', 'Hyderabad', 'Telangana', '500034', 17.4126, 78.4531, '+91-40-2354-7777', 'info@bicah.com', 'https://bicah.com', ARRAY['Oncology', 'Radiation Oncology', 'Surgical Oncology'], 4.6, 1700, false, 200, 1997),
('Continental Hospitals', 'IT & Financial Dist, Nanakramguda, Hyderabad', 'Hyderabad', 'Telangana', '500019', 17.4239, 78.3428, '+91-40-6700-0000', 'info@continentalhospitals.com', 'https://continentalhospitals.com', ARRAY['Oncology', 'Transplant', 'Robotic Surgery'], 4.5, 1400, false, 750, 2013),

-- Kolkata Hospitals
('Chittaranjan National Cancer Institute', '37, S P Mukherjee Road, Kolkata', 'Kolkata', 'West Bengal', '700026', 22.5726, 88.3639, '+91-33-2476-4444', 'info@cnci.org.in', 'https://cnci.org.in', ARRAY['Oncology', 'Radiation Oncology', 'Medical Oncology'], 4.7, 2200, true, 518, 1950),
('Tata Medical Center', '14 MAR (E-W), New Town, Rajarhat, Kolkata', 'Kolkata', 'West Bengal', '700156', 22.5726, 88.4798, '+91-33-6605-0000', 'info@tmckolkata.com', 'https://tmckolkata.com', ARRAY['Oncology', 'Bone Marrow Transplant', 'Radiation Oncology'], 4.8, 1900, false, 460, 2011),

-- Pune Hospitals
('Ruby Hall Clinic', '40, Sassoon Road, Pune', 'Pune', 'Maharashtra', '411001', 18.5314, 73.8446, '+91-20-6645-8888', 'info@rubyhall.com', 'https://rubyhall.com', ARRAY['Oncology', 'Cancer Surgery', 'Medical Oncology'], 4.4, 1300, false, 750, 1959),
('Deenanath Mangeshkar Hospital', 'Erandwane, Pune', 'Pune', 'Maharashtra', '411004', 18.5089, 73.8278, '+91-20-2611-6001', 'info@dmhospital.org', 'https://dmhospital.org', ARRAY['Oncology', 'Radiation Oncology', 'Surgical Oncology'], 4.5, 1100, false, 525, 1998);

-- Insert sample doctors data
INSERT INTO doctors (name, specialization, qualification, experience_years, hospital_id, consultation_fee, available_days, rating, total_reviews) VALUES
-- Tata Memorial Hospital doctors
((SELECT name FROM hospitals WHERE name = 'Tata Memorial Hospital' LIMIT 1), 'Medical Oncology', 'MD, DM (Medical Oncology)', 15, (SELECT id FROM hospitals WHERE name = 'Tata Memorial Hospital' LIMIT 1), 1500, ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], 4.8, 500),
((SELECT name FROM hospitals WHERE name = 'Tata Memorial Hospital' LIMIT 1), 'Surgical Oncology', 'MS, MCh (Surgical Oncology)', 12, (SELECT id FROM hospitals WHERE name = 'Tata Memorial Hospital' LIMIT 1), 2000, ARRAY['Monday', 'Wednesday', 'Friday'], 4.7, 350),
((SELECT name FROM hospitals WHERE name = 'Tata Memorial Hospital' LIMIT 1), 'Radiation Oncology', 'MD (Radiation Oncology)', 10, (SELECT id FROM hospitals WHERE name = 'Tata Memorial Hospital' LIMIT 1), 1800, ARRAY['Tuesday', 'Thursday', 'Saturday'], 4.6, 280);

-- Add doctors for other hospitals with similar pattern...