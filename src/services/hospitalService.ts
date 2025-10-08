import { HospitalDataService, HospitalData } from './hospitalDataService';
import { LocationService, LocationCoordinates } from './locationService';
import { DoctorService, DoctorInfo } from './doctorService';

export class HospitalService {
  static async geocodeCity(city: string, state: string): Promise<LocationCoordinates> {
    return LocationService.geocodeCity(city, state);
  }

  static async getCurrentLocation(): Promise<LocationCoordinates> {
    return LocationService.getCurrentLocation();  
  }

  static async searchHospitals(location: any, cancerType: string, radiusKm: number = 50): Promise<any[]> {
    console.log('Searching cancer hospitals for location:', location);
    console.log('User state:', location.state);
    console.log('Cancer type:', cancerType);
    
    let allHospitals: any[] = [];
    
    // Step 1: Get hospitals from user's state
    let stateHospitals = HospitalDataService.getHospitalsByState(location.state, cancerType);
    console.log(`Found ${stateHospitals.length} cancer hospitals in user's state: ${location.state}`);
    
    if (stateHospitals.length > 0) {
      allHospitals.push(...stateHospitals);
    }
    
    // Step 2: Search nearby states for more options
    const nearbyStatesMap: Record<string, string[]> = {
      'Andhra Pradesh': ['Telangana', 'Karnataka', 'Tamil Nadu', 'Odisha', 'Chhattisgarh'],
      'Telangana': ['Andhra Pradesh', 'Karnataka', 'Maharashtra', 'Odisha', 'Chhattisgarh'],
      'Karnataka': ['Andhra Pradesh', 'Telangana', 'Tamil Nadu', 'Kerala', 'Maharashtra', 'Goa'],
      'Tamil Nadu': ['Karnataka', 'Andhra Pradesh', 'Kerala', 'Puducherry'],
      'Kerala': ['Tamil Nadu', 'Karnataka'],
      'Maharashtra': ['Karnataka', 'Gujarat', 'Madhya Pradesh', 'Telangana', 'Goa'],
      'Gujarat': ['Maharashtra', 'Rajasthan', 'Madhya Pradesh'],
      'Rajasthan': ['Gujarat', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh', 'Punjab'],
      'Delhi': ['Haryana', 'Uttar Pradesh', 'Punjab', 'Rajasthan'],
      'Haryana': ['Delhi', 'Punjab', 'Rajasthan', 'Uttar Pradesh', 'Himachal Pradesh'],
      'Punjab': ['Haryana', 'Delhi', 'Himachal Pradesh', 'Rajasthan'],
      'Uttar Pradesh': ['Delhi', 'Haryana', 'Madhya Pradesh', 'Bihar', 'Rajasthan'],
      'Bihar': ['Uttar Pradesh', 'Jharkhand', 'West Bengal'],
      'West Bengal': ['Bihar', 'Jharkhand', 'Odisha', 'Assam'],
      'Odisha': ['West Bengal', 'Andhra Pradesh', 'Chhattisgarh', 'Jharkhand'],
      'Assam': ['West Bengal', 'Meghalaya', 'Nagaland', 'Arunachal Pradesh'],
      'Madhya Pradesh': ['Maharashtra', 'Gujarat', 'Rajasthan', 'Uttar Pradesh', 'Chhattisgarh'],
      'Chhattisgarh': ['Madhya Pradesh', 'Odisha', 'Andhra Pradesh', 'Telangana'],
      'Jharkhand': ['Bihar', 'West Bengal', 'Odisha', 'Chhattisgarh'],
      'Goa': ['Maharashtra', 'Karnataka'],
      'Himachal Pradesh': ['Punjab', 'Haryana', 'Uttarakhand'],
      'Uttarakhand': ['Uttar Pradesh', 'Delhi', 'Himachal Pradesh'],
      'Jammu and Kashmir': ['Punjab', 'Himachal Pradesh'],
      'Manipur': ['Assam', 'Nagaland', 'Mizoram'],
      'Meghalaya': ['Assam', 'West Bengal'],
      'Mizoram': ['Assam', 'Manipur', 'Tripura'],
      'Nagaland': ['Assam', 'Manipur', 'Arunachal Pradesh'],
      'Sikkim': ['West Bengal', 'Assam'],
      'Tripura': ['Assam', 'West Bengal', 'Mizoram'],
      'Arunachal Pradesh': ['Assam', 'Nagaland']
    };
    
    const nearbyStates = nearbyStatesMap[location.state] || [];
    console.log(`Checking nearby states: ${nearbyStates.join(', ')}`);
    
    // Get hospitals from nearby states (limit to first 2-3 nearby states)
    const nearbyStatesToCheck = nearbyStates.slice(0, 3);
    for (const nearbyState of nearbyStatesToCheck) {
      const nearbyHospitals = HospitalDataService.getHospitalsByState(nearbyState, cancerType);
      if (nearbyHospitals.length > 0) {
        console.log(`Found ${nearbyHospitals.length} cancer hospitals in nearby state: ${nearbyState}`);
        allHospitals.push(...nearbyHospitals);
      }
    }
    
    // Step 3: If still limited results, include major cancer centers from across India
    if (allHospitals.length < 10) {
      console.log('Adding major cancer centers from across India');
      const majorCancerCenterStates = ['Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'West Bengal', 'Gujarat'];
      
      for (const majorState of majorCancerCenterStates) {
        if (majorState !== location.state && !nearbyStatesToCheck.includes(majorState)) {
          const majorHospitals = HospitalDataService.getHospitalsByState(majorState, cancerType);
          if (majorHospitals.length > 0) {
            console.log(`Including ${Math.min(majorHospitals.length, 2)} hospitals from major cancer center: ${majorState}`);
            // Add top 2 hospitals from each major state
            allHospitals.push(...majorHospitals.slice(0, 2));
          }
        }
      }
    }
    
    // Remove duplicates based on hospital ID
    const uniqueHospitals = allHospitals.filter((hospital, index, arr) => 
      arr.findIndex(h => h.id === hospital.id) === index
    );
    
    console.log(`Total unique cancer hospitals found: ${uniqueHospitals.length}`);
    
    // Calculate distances and sort by proximity
    const hospitalsWithDistance = uniqueHospitals.map(hospital => {
      const userLat = Number(location.latitude) || 0;
      const userLon = Number(location.longitude) || 0;
      const hospitalLat = Number(hospital.latitude) || 0;
      const hospitalLon = Number(hospital.longitude) || 0;
      
      const distance = LocationService.calculateDistance(
        userLat, 
        userLon,
        hospitalLat,
        hospitalLon
      );
      
      return {
        ...hospital,
        distance: distance,
        website: hospital.website && !hospital.website.startsWith('http') 
          ? `https://${hospital.website}` 
          : hospital.website,
      };
    });

    // Prioritize hospitals in the same state, then by distance
    const sameStateHospitals = hospitalsWithDistance.filter(h => h.state === location.state);
    const otherStateHospitals = hospitalsWithDistance.filter(h => h.state !== location.state)
      .sort((a, b) => a.distance - b.distance);
    
    // Sort same-state hospitals by distance
    sameStateHospitals.sort((a, b) => a.distance - b.distance);
    
    // Combine results: same state first, then others by distance
    const finalResults = [...sameStateHospitals, ...otherStateHospitals].slice(0, 20); // Increased to 20 for better coverage
    
    console.log(`Returning ${finalResults.length} cancer hospitals`);
    console.log(`Same state: ${sameStateHospitals.length}, Other states: ${Math.min(otherStateHospitals.length, 20 - sameStateHospitals.length)}`);
    
    // Log the states represented in results
    const statesInResults = [...new Set(finalResults.map(h => h.state))];
    console.log(`States represented: ${statesInResults.join(', ')}`);
    
    return finalResults;
  }

  static async getHospitalDoctors(hospitalId: string, cancerType: string): Promise<DoctorInfo[]> {
    return DoctorService.getHospitalDoctors(hospitalId, cancerType);
  }
}
