export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
}

export class LocationService {
  static async geocodeCity(city: string, state: string): Promise<LocationCoordinates> {
    const cityCoordinates: Record<string, { latitude: number; longitude: number }> = {
      'Mumbai': { latitude: 19.0760, longitude: 72.8777 },
      'Delhi': { latitude: 28.6139, longitude: 77.2090 },
      'Bangalore': { latitude: 12.9716, longitude: 77.5946 },
      'Chennai': { latitude: 13.0827, longitude: 80.2707 },
      'Kolkata': { latitude: 22.5726, longitude: 88.3639 },
      'Hyderabad': { latitude: 17.3850, longitude: 78.4867 },
      'Pune': { latitude: 18.5204, longitude: 73.8567 },
      'Ahmedabad': { latitude: 23.0225, longitude: 72.5714 },
      'Surat': { latitude: 21.1702, longitude: 72.8311 },
      'Jaipur': { latitude: 26.9124, longitude: 75.7873 },
      'Lucknow': { latitude: 26.8467, longitude: 80.9462 },
      'Kanpur': { latitude: 26.4499, longitude: 80.3319 },
      'Nagpur': { latitude: 21.1458, longitude: 79.0882 },
      'Patna': { latitude: 25.5941, longitude: 85.1376 },
      'Indore': { latitude: 22.7196, longitude: 75.8577 },
      'Thane': { latitude: 19.2183, longitude: 72.9781 },
      'Bhopal': { latitude: 23.2599, longitude: 77.4126 },
      'Visakhapatnam': { latitude: 17.6868, longitude: 83.2185 },
      'Vadodara': { latitude: 22.3072, longitude: 73.1812 },
      'Firozabad': { latitude: 27.1592, longitude: 78.3957 }
    };
    
    const exactMatch = cityCoordinates[city];
    if (exactMatch) {
      return { ...exactMatch, city, state };
    }
    
    const stateRegions: Record<string, { latRange: [number, number]; lngRange: [number, number] }> = {
      'Maharashtra': { latRange: [15.6, 22.0], lngRange: [72.6, 80.9] },
      'Karnataka': { latRange: [11.5, 18.4], lngRange: [74.0, 78.6] },
      'Tamil Nadu': { latRange: [8.1, 13.5], lngRange: [76.2, 80.3] },
      'West Bengal': { latRange: [21.5, 27.2], lngRange: [85.8, 89.9] },
      'Uttar Pradesh': { latRange: [23.9, 30.4], lngRange: [77.1, 84.6] },
      'Gujarat': { latRange: [20.1, 24.7], lngRange: [68.2, 74.5] },
      'Rajasthan': { latRange: [23.0, 30.2], lngRange: [69.5, 78.3] },
      'Haryana': { latRange: [27.4, 30.9], lngRange: [74.5, 77.6] },
      'Punjab': { latRange: [29.5, 32.5], lngRange: [73.9, 76.5] },
      'Bihar': { latRange: [24.3, 27.5], lngRange: [83.3, 88.1] },
      'Madhya Pradesh': { latRange: [21.1, 26.9], lngRange: [74.0, 82.8] },
      'Andhra Pradesh': { latRange: [12.6, 19.9], lngRange: [76.8, 84.8] },
      'Kerala': { latRange: [8.2, 12.8], lngRange: [74.9, 77.4] },
      'Telangana': { latRange: [15.8, 19.9], lngRange: [77.2, 81.8] },
      'Assam': { latRange: [24.1, 28.2], lngRange: [89.7, 96.0] },
      'Odisha': { latRange: [17.8, 22.6], lngRange: [81.4, 87.5] },
      'Jharkhand': { latRange: [21.9, 25.3], lngRange: [83.3, 87.9] },
      'Chhattisgarh': { latRange: [17.8, 24.1], lngRange: [80.2, 84.4] },
      'Himachal Pradesh': { latRange: [30.2, 33.2], lngRange: [75.5, 79.0] }
    };
    
    const region = stateRegions[state];
    if (region) {
      const latitude = region.latRange[0] + Math.random() * (region.latRange[1] - region.latRange[0]);
      const longitude = region.lngRange[0] + Math.random() * (region.lngRange[1] - region.lngRange[0]);
      return { latitude, longitude, city, state };
    }
    
    return { latitude: 20.5937, longitude: 78.9629, city, state };
  }

  static async getCurrentLocation(): Promise<LocationCoordinates> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          console.log('GPS coordinates detected:', { latitude, longitude });
          
          // Try to determine the state and city from coordinates
          const locationInfo = await this.reverseGeocode(latitude, longitude);
          
          console.log('Location determined from GPS:', locationInfo);
          
          resolve({
            latitude,
            longitude,
            city: locationInfo.city,
            state: locationInfo.state
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          reject(new Error(`Location access denied: ${error.message}`));
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 60000 }
      );
    });
  }

  // Improved reverse geocoding with more accurate boundaries and city detection
  static async reverseGeocode(latitude: number, longitude: number): Promise<{ city?: string; state?: string }> {
    console.log('Reverse geocoding coordinates:', { latitude, longitude });
    
    // More precise state boundaries with better accuracy
    const stateBoundaries = [
      // Tamil Nadu - More precise boundaries
      { 
        name: 'Tamil Nadu', 
        bounds: { north: 13.6, south: 8.05, east: 80.35, west: 76.15 },
        priority: 1
      },
      // Andhra Pradesh - Adjusted to not overlap with Tamil Nadu
      { 
        name: 'Andhra Pradesh', 
        bounds: { north: 19.9, south: 12.61, east: 84.8, west: 76.8 },
        priority: 2
      },
      { 
        name: 'Telangana', 
        bounds: { north: 19.9, south: 15.8, east: 81.8, west: 77.2 },
        priority: 2
      },
      { 
        name: 'Karnataka', 
        bounds: { north: 18.4, south: 11.5, east: 78.6, west: 74.0 },
        priority: 2
      },
      { 
        name: 'Kerala', 
        bounds: { north: 12.8, south: 8.2, east: 77.4, west: 74.9 },
        priority: 2
      },
      { 
        name: 'Maharashtra', 
        bounds: { north: 22.0, south: 15.6, east: 80.9, west: 72.6 },
        priority: 2
      },
      { 
        name: 'Gujarat', 
        bounds: { north: 24.7, south: 20.1, east: 74.5, west: 68.2 },
        priority: 2
      },
      { 
        name: 'Rajasthan', 
        bounds: { north: 30.2, south: 23.0, east: 78.3, west: 69.5 },
        priority: 2
      },
      { 
        name: 'Delhi', 
        bounds: { north: 28.9, south: 28.4, east: 77.3, west: 76.8 },
        priority: 1
      },
      { 
        name: 'Haryana', 
        bounds: { north: 30.9, south: 27.4, east: 77.6, west: 74.5 },
        priority: 2
      },
      { 
        name: 'Punjab', 
        bounds: { north: 32.5, south: 29.5, east: 76.5, west: 73.9 },
        priority: 2
      },
      { 
        name: 'Uttar Pradesh', 
        bounds: { north: 30.4, south: 23.9, east: 84.6, west: 77.1 },
        priority: 2
      },
      { 
        name: 'Bihar', 
        bounds: { north: 27.5, south: 24.3, east: 88.1, west: 83.3 },
        priority: 2
      },
      { 
        name: 'West Bengal', 
        bounds: { north: 27.2, south: 21.5, east: 89.9, west: 85.8 },
        priority: 2
      },
      { 
        name: 'Odisha', 
        bounds: { north: 22.6, south: 17.8, east: 87.5, west: 81.4 },
        priority: 2
      },
      { 
        name: 'Madhya Pradesh', 
        bounds: { north: 26.9, south: 21.1, east: 82.8, west: 74.0 },
        priority: 2
      },
      { 
        name: 'Chhattisgarh', 
        bounds: { north: 24.1, south: 17.8, east: 84.4, west: 80.2 },
        priority: 2
      },
      { 
        name: 'Jharkhand', 
        bounds: { north: 25.3, south: 21.9, east: 87.9, west: 83.3 },
        priority: 2
      },
      { 
        name: 'Assam', 
        bounds: { north: 28.2, south: 24.1, east: 96.0, west: 89.7 },
        priority: 2
      },
      { 
        name: 'Himachal Pradesh', 
        bounds: { north: 33.2, south: 30.2, east: 79.0, west: 75.5 },
        priority: 2
      },
      { 
        name: 'Uttarakhand', 
        bounds: { north: 31.4, south: 28.4, east: 81.0, west: 77.6 },
        priority: 2
      },
      { 
        name: 'Jammu and Kashmir', 
        bounds: { north: 37.1, south: 32.3, east: 80.3, west: 72.6 },
        priority: 2
      }
    ];

    // Sort by priority to check high-priority states first
    const sortedBoundaries = stateBoundaries.sort((a, b) => a.priority - b.priority);

    // Find which state the coordinates fall into
    for (const state of sortedBoundaries) {
      const { bounds } = state;
      if (latitude >= bounds.south && latitude <= bounds.north && 
          longitude >= bounds.west && longitude <= bounds.east) {
        
        console.log(`Location detected in state: ${state.name}`);
        
        // Enhanced city detection with more cities
        const majorCities: Record<string, Array<{name: string, lat: number, lng: number}>> = {
          'Tamil Nadu': [
            { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
            { name: 'Coimbatore', lat: 11.0168, lng: 76.9558 },
            { name: 'Madurai', lat: 9.9252, lng: 78.1198 },
            { name: 'Salem', lat: 11.6643, lng: 78.1460 },
            { name: 'Tiruchirappalli', lat: 10.7905, lng: 78.7047 },
            { name: 'Tirunelveli', lat: 8.7139, lng: 77.7567 },
            { name: 'Vellore', lat: 12.9165, lng: 79.1325 },
            { name: 'Thanjavur', lat: 10.7870, lng: 79.1378 }
          ],
          'Andhra Pradesh': [
            { name: 'Visakhapatnam', lat: 17.6868, lng: 83.2185 },
            { name: 'Vijayawada', lat: 16.5062, lng: 80.6480 },
            { name: 'Guntur', lat: 16.3067, lng: 80.4365 },
            { name: 'Nellore', lat: 14.4426, lng: 79.9865 },
            { name: 'Kurnool', lat: 15.8281, lng: 78.0373 },
            { name: 'Rajahmundry', lat: 17.0005, lng: 81.8040 },
            { name: 'Tirupati', lat: 13.6288, lng: 79.4192 }
          ],
          'Telangana': [
            { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
            { name: 'Warangal', lat: 17.9689, lng: 79.5941 },
            { name: 'Nizamabad', lat: 18.6725, lng: 78.0941 },
            { name: 'Karimnagar', lat: 18.4386, lng: 79.1288 }
          ],
          'Karnataka': [
            { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
            { name: 'Mysore', lat: 12.2958, lng: 76.6394 },
            { name: 'Hubli', lat: 15.3647, lng: 75.1240 },
            { name: 'Mangalore', lat: 12.9141, lng: 74.8560 },
            { name: 'Belgaum', lat: 15.8497, lng: 74.4977 }
          ],
          'Maharashtra': [
            { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
            { name: 'Pune', lat: 18.5204, lng: 73.8567 },
            { name: 'Nagpur', lat: 21.1458, lng: 79.0882 },
            { name: 'Nashik', lat: 19.9975, lng: 73.7898 },
            { name: 'Aurangabad', lat: 19.8762, lng: 75.3433 }
          ],
          'Delhi': [
            { name: 'Delhi', lat: 28.6139, lng: 77.2090 }
          ]
        };
        
        const cities = majorCities[state.name] || [];
        let nearestCity = cities.length > 0 ? cities[0].name : state.name;
        let minDistance = Infinity;
        
        // Find the nearest major city
        for (const city of cities) {
          const distance = this.calculateDistance(latitude, longitude, city.lat, city.lng);
          if (distance < minDistance) {
            minDistance = distance;
            nearestCity = city.name;
          }
        }
        
        console.log(`Nearest city determined: ${nearestCity} (distance: ${minDistance.toFixed(2)}km)`);
        
        return {
          state: state.name,
          city: nearestCity
        };
      }
    }

    console.log('Location could not be determined from coordinates, using coordinate-based fallback');
    
    // Improved coordinate-based fallback for major metropolitan areas
    if (latitude >= 12.5 && latitude <= 13.5 && longitude >= 79.8 && longitude <= 80.8) {
      console.log('Coordinates match Chennai metropolitan area');
      return { city: 'Chennai', state: 'Tamil Nadu' };
    } else if (latitude >= 17.0 && latitude <= 18.0 && longitude >= 78.0 && longitude <= 79.0) {
      console.log('Coordinates match Hyderabad metropolitan area');
      return { city: 'Hyderabad', state: 'Telangana' };
    } else if (latitude >= 12.5 && latitude <= 13.5 && longitude >= 77.0 && longitude <= 78.0) {
      console.log('Coordinates match Bangalore metropolitan area');
      return { city: 'Bangalore', state: 'Karnataka' };
    } else if (latitude >= 18.5 && latitude <= 19.5 && longitude >= 72.5 && longitude <= 73.5) {
      console.log('Coordinates match Mumbai metropolitan area');
      return { city: 'Mumbai', state: 'Maharashtra' };
    } else if (latitude >= 28.4 && latitude <= 28.9 && longitude >= 76.8 && longitude <= 77.5) {
      console.log('Coordinates match Delhi metropolitan area');
      return { city: 'Delhi', state: 'Delhi' };
    }
    
    // Final fallback
    console.log('Using final fallback location');
    return { city: 'Delhi', state: 'Delhi' };
  }

  static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // Distance in kilometers
    return d;
  }

  private static deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }
}
