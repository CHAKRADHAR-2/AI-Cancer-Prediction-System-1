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
    console.log('Searching hospitals for location:', location);
    console.log('User state:', location.state);
    
    // Prioritize user's actual state first
    let stateHospitals = HospitalDataService.getHospitalsByState(location.state, cancerType);
    console.log(`Found ${stateHospitals.length} hospitals in user's state: ${location.state}`);
    
    // If no hospitals found in user's state, search nearby states
    if (stateHospitals.length === 0) {
      console.log(`No hospitals found in ${location.state}, searching nearby states`);
      
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
        'Jharkhand': ['Bihar', 'West Bengal', 'Odisha', 'Chhattisgarh']
      };
      
      const nearbyStates = nearbyStatesMap[location.state] || [];
      console.log(`Checking nearby states: ${nearbyStates.join(', ')}`);
      
      for (const nearbyState of nearbyStates) {
        const nearbyHospitals = HospitalDataService.getHospitalsByState(nearbyState, cancerType);
        if (nearbyHospitals.length > 0) {
          console.log(`Found ${nearbyHospitals.length} hospitals in nearby state: ${nearbyState}`);
          stateHospitals = [...stateHospitals, ...nearbyHospitals];
          break; // Stop after finding hospitals in the first nearby state
        }
      }
      
      // If still no hospitals found, include major medical centers
      if (stateHospitals.length === 0) {
        console.log('No hospitals found in nearby states, including major medical centers');
        const majorMedicalStates = ['Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu'];
        
        for (const majorState of majorMedicalStates) {
          if (majorState !== location.state && !nearbyStates.includes(majorState)) {
            const majorHospitals = HospitalDataService.getHospitalsByState(majorState, cancerType);
            if (majorHospitals.length > 0) {
              console.log(`Including ${majorHospitals.length} hospitals from major medical center: ${majorState}`);
              stateHospitals = [...stateHospitals, ...majorHospitals.slice(0, 3)]; // Limit to 3 hospitals per major state
            }
          }
        }
      }
    }
    
    // Calculate distances and sort by proximity
    const hospitalsWithDistance = stateHospitals.map(hospital => {
      const distance = LocationService.calculateDistance(
        location.latitude, 
        location.longitude,
        hospital.latitude,
        hospital.longitude
      );
      
      return {
        ...hospital,
        distance: distance,
        // Ensure website URLs are properly formatted
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
    
    const finalResults = [...sameStateHospitals, ...otherStateHospitals].slice(0, 15);
    
    console.log(`Returning ${finalResults.length} hospitals`);
    console.log(`Same state: ${sameStateHospitals.length}, Other states: ${Math.min(otherStateHospitals.length, 15 - sameStateHospitals.length)}`);
    
    return finalResults;
  }

  static async getHospitalDoctors(hospitalId: string, cancerType: string): Promise<DoctorInfo[]> {
    return DoctorService.getHospitalDoctors(hospitalId, cancerType);
  }
}
