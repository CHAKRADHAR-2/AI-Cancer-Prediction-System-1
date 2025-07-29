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

      console.log('Starting enhanced GPS location detection...');
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          
          console.log('Enhanced GPS coordinates detected:', { 
            latitude, 
            longitude, 
            accuracy: `${accuracy}m` 
          });
          
          // Enhanced reverse geocoding with multiple fallbacks
          const locationInfo = await this.reverseGeocode(latitude, longitude);
          
          console.log('Enhanced location determined:', locationInfo);
          
          // Validate the location result
          if (!locationInfo.city || !locationInfo.state) {
            console.warn('Incomplete location info, using coordinate-based fallback');
            const fallbackLocation = this.coordinateBasedFallback(latitude, longitude);
            locationInfo.city = fallbackLocation.city;
            locationInfo.state = fallbackLocation.state;
          }
          
          const finalLocation = {
            latitude,
            longitude,
            city: locationInfo.city,
            state: locationInfo.state
          };
          
          console.log('Final enhanced location result:', finalLocation);
          resolve(finalLocation);
        },
        (error) => {
          console.error('Enhanced geolocation error:', error);
          let errorMessage = 'Location access denied';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied. Please allow location access and try again.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable. Please check your GPS settings.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out. Please try again.';
              break;
          }
          
          reject(new Error(errorMessage));
        },
        { 
          enableHighAccuracy: true, 
          timeout: 30000, // Increased timeout for better accuracy
          maximumAge: 300000 // 5 minutes cache
        }
      );
    });
  }

  // Enhanced reverse geocoding with comprehensive city/village database
  static async reverseGeocode(latitude: number, longitude: number): Promise<{ city?: string; state?: string }> {
    console.log('Enhanced reverse geocoding coordinates:', { latitude, longitude });
    
    try {
      // Try external geocoding API first for highest accuracy
      const externalResult = await this.tryExternalGeocoding(latitude, longitude);
      if (externalResult.city && externalResult.state) {
        console.log('External geocoding successful:', externalResult);
        return externalResult;
      }
    } catch (error) {
      console.log('External geocoding failed, using enhanced local database');
    }
    
    // Enhanced local reverse geocoding with comprehensive database
    const locationResult = this.enhancedLocalReverseGeocode(latitude, longitude);
    console.log('Enhanced local geocoding result:', locationResult);
    return locationResult;
  }

  // Try external geocoding services for maximum accuracy
  private static async tryExternalGeocoding(latitude: number, longitude: number): Promise<{ city?: string; state?: string }> {
    // Use OpenStreetMap Nominatim API (free and reliable)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'CancerAidNavigator/1.0'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Geocoding API failed');
    }
    
    const data = await response.json();
    console.log('External geocoding response:', data);
    
    if (data && data.address) {
      const address = data.address;
      
      // Extract city/village with priority order
      const city = address.city || 
                  address.town || 
                  address.village || 
                  address.hamlet || 
                  address.suburb || 
                  address.neighbourhood || 
                  address.county || 
                  address.district;
      
      // Extract state
      const state = address.state || address.region;
      
      if (city && state) {
        return {
          city: this.cleanLocationName(city),
          state: this.mapToIndianState(state)
        };
      }
    }
    
    throw new Error('No valid address found');
  }

  // Enhanced local reverse geocoding with comprehensive city database
  private static enhancedLocalReverseGeocode(latitude: number, longitude: number): { city?: string; state?: string } {
    // Comprehensive state boundaries with precise coordinates
    const stateBoundaries = [
      { 
        name: 'Tamil Nadu', 
        bounds: { north: 13.6, south: 8.05, east: 80.35, west: 76.15 },
        priority: 1
      },
      { 
        name: 'Andhra Pradesh', 
        bounds: { north: 19.9, south: 12.61, east: 84.8, west: 76.8 },
        priority: 1
      },
      { 
        name: 'Telangana', 
        bounds: { north: 19.9, south: 15.8, east: 81.8, west: 77.2 },
        priority: 1
      },
      { 
        name: 'Karnataka', 
        bounds: { north: 18.4, south: 11.5, east: 78.6, west: 74.0 },
        priority: 1
      },
      { 
        name: 'Kerala', 
        bounds: { north: 12.8, south: 8.2, east: 77.4, west: 74.9 },
        priority: 1
      },
      { 
        name: 'Maharashtra', 
        bounds: { north: 22.0, south: 15.6, east: 80.9, west: 72.6 },
        priority: 1
      },
      { 
        name: 'Gujarat', 
        bounds: { north: 24.7, south: 20.1, east: 74.5, west: 68.2 },
        priority: 1
      },
      { 
        name: 'Rajasthan', 
        bounds: { north: 30.2, south: 23.0, east: 78.3, west: 69.5 },
        priority: 1
      },
      { 
        name: 'Delhi', 
        bounds: { north: 28.9, south: 28.4, east: 77.3, west: 76.8 },
        priority: 1
      },
      { 
        name: 'Haryana', 
        bounds: { north: 30.9, south: 27.4, east: 77.6, west: 74.5 },
        priority: 1
      },
      { 
        name: 'Punjab', 
        bounds: { north: 32.5, south: 29.5, east: 76.5, west: 73.9 },
        priority: 1
      },
      { 
        name: 'Uttar Pradesh', 
        bounds: { north: 30.4, south: 23.9, east: 84.6, west: 77.1 },
        priority: 1
      },
      { 
        name: 'Bihar', 
        bounds: { north: 27.5, south: 24.3, east: 88.1, west: 83.3 },
        priority: 1
      },
      { 
        name: 'West Bengal', 
        bounds: { north: 27.2, south: 21.5, east: 89.9, west: 85.8 },
        priority: 1
      },
      { 
        name: 'Odisha', 
        bounds: { north: 22.6, south: 17.8, east: 87.5, west: 81.4 },
        priority: 1
      },
      { 
        name: 'Madhya Pradesh', 
        bounds: { north: 26.9, south: 21.1, east: 82.8, west: 74.0 },
        priority: 1
      },
      { 
        name: 'Chhattisgarh', 
        bounds: { north: 24.1, south: 17.8, east: 84.4, west: 80.2 },
        priority: 1
      },
      { 
        name: 'Jharkhand', 
        bounds: { north: 25.3, south: 21.9, east: 87.9, west: 83.3 },
        priority: 1
      },
      { 
        name: 'Assam', 
        bounds: { north: 28.2, south: 24.1, east: 96.0, west: 89.7 },
        priority: 1
      }
    ];

    // Find matching state
    for (const state of stateBoundaries) {
      const { bounds } = state;
      if (latitude >= bounds.south && latitude <= bounds.north && 
          longitude >= bounds.west && longitude <= bounds.east) {
        
        console.log(`Location detected in state: ${state.name}`);
        
        // Get comprehensive city database for the state
        const nearestCity = this.findNearestCityInState(latitude, longitude, state.name);
        
        return {
          state: state.name,
          city: nearestCity
        };
      }
    }
    
    // Fallback to coordinate-based detection
    return this.coordinateBasedFallback(latitude, longitude);
  }

  // Find nearest city using comprehensive database
  private static findNearestCityInState(latitude: number, longitude: number, stateName: string): string {
    // Comprehensive city database with villages and towns
    const comprehensiveCities: Record<string, Array<{name: string, lat: number, lng: number, type: 'city' | 'town' | 'village'}>> = {
      'Tamil Nadu': [
        { name: 'Chennai', lat: 13.0827, lng: 80.2707, type: 'city' },
        { name: 'Coimbatore', lat: 11.0168, lng: 76.9558, type: 'city' },
        { name: 'Madurai', lat: 9.9252, lng: 78.1198, type: 'city' },
        { name: 'Salem', lat: 11.6643, lng: 78.1460, type: 'city' },
        { name: 'Tiruchirappalli', lat: 10.7905, lng: 78.7047, type: 'city' },
        { name: 'Tirunelveli', lat: 8.7139, lng: 77.7567, type: 'city' },
        { name: 'Vellore', lat: 12.9165, lng: 79.1325, type: 'city' },
        { name: 'Thanjavur', lat: 10.7870, lng: 79.1378, type: 'city' },
        { name: 'Erode', lat: 11.3410, lng: 77.7172, type: 'city' },
        { name: 'Tiruppur', lat: 11.1085, lng: 77.3411, type: 'city' },
        { name: 'Dindigul', lat: 10.3673, lng: 77.9803, type: 'town' },
        { name: 'Cuddalore', lat: 11.7449, lng: 79.7689, type: 'town' },
        { name: 'Kanchipuram', lat: 12.8185, lng: 79.7006, type: 'town' },
        { name: 'Karur', lat: 10.9601, lng: 78.0766, type: 'town' },
        { name: 'Ramanathapuram', lat: 9.3763, lng: 78.8308, type: 'town' },
        { name: 'Sivakasi', lat: 9.4559, lng: 77.7881, type: 'town' },
        { name: 'Kumbakonam', lat: 10.9601, lng: 79.3788, type: 'town' },
        { name: 'Pollachi', lat: 10.6581, lng: 77.0084, type: 'town' }
      ],
      'Karnataka': [
        { name: 'Bangalore', lat: 12.9716, lng: 77.5946, type: 'city' },
        { name: 'Mysore', lat: 12.2958, lng: 76.6394, type: 'city' },
        { name: 'Hubli', lat: 15.3647, lng: 75.1240, type: 'city' },
        { name: 'Mangalore', lat: 12.9141, lng: 74.8560, type: 'city' },
        { name: 'Belgaum', lat: 15.8497, lng: 74.4977, type: 'city' },
        { name: 'Gulbarga', lat: 17.3297, lng: 76.8343, type: 'city' },
        { name: 'Davangere', lat: 14.4644, lng: 75.9217, type: 'city' },
        { name: 'Bellary', lat: 15.1394, lng: 76.9214, type: 'city' },
        { name: 'Bijapur', lat: 16.8302, lng: 75.7100, type: 'city' },
        { name: 'Shimoga', lat: 13.9299, lng: 75.5681, type: 'city' },
        { name: 'Tumkur', lat: 13.3379, lng: 77.1022, type: 'town' },
        { name: 'Raichur', lat: 16.2120, lng: 77.3439, type: 'town' },
        { name: 'Hassan', lat: 13.0072, lng: 76.0962, type: 'town' },
        { name: 'Mandya', lat: 12.5214, lng: 76.8958, type: 'town' }
      ],
      'Andhra Pradesh': [
        { name: 'Visakhapatnam', lat: 17.6868, lng: 83.2185, type: 'city' },
        { name: 'Vijayawada', lat: 16.5062, lng: 80.6480, type: 'city' },
        { name: 'Guntur', lat: 16.3067, lng: 80.4365, type: 'city' },
        { name: 'Nellore', lat: 14.4426, lng: 79.9865, type: 'city' },
        { name: 'Kurnool', lat: 15.8281, lng: 78.0373, type: 'city' },
        { name: 'Rajahmundry', lat: 17.0005, lng: 81.8040, type: 'city' },
        { name: 'Tirupati', lat: 13.6288, lng: 79.4192, type: 'city' },
        { name: 'Kakinada', lat: 16.9891, lng: 82.2475, type: 'city' },
        { name: 'Anantapur', lat: 14.6819, lng: 77.6006, type: 'city' },
        { name: 'Chittoor', lat: 13.2172, lng: 79.1003, type: 'town' },
        { name: 'Eluru', lat: 16.7107, lng: 81.0953, type: 'town' },
        { name: 'Ongole', lat: 15.5057, lng: 80.0499, type: 'town' },
        { name: 'Machilipatnam', lat: 16.1875, lng: 81.1389, type: 'town' }
      ],
      'Telangana': [
        { name: 'Hyderabad', lat: 17.3850, lng: 78.4867, type: 'city' },
        { name: 'Warangal', lat: 17.9689, lng: 79.5941, type: 'city' },
        { name: 'Nizamabad', lat: 18.6725, lng: 78.0941, type: 'city' },
        { name: 'Karimnagar', lat: 18.4386, lng: 79.1288, type: 'city' },
        { name: 'Khammam', lat: 17.2473, lng: 80.1514, type: 'city' },
        { name: 'Mahbubnagar', lat: 16.7393, lng: 77.9974, type: 'town' },
        { name: 'Nalgonda', lat: 17.0542, lng: 79.2674, type: 'town' },
        { name: 'Adilabad', lat: 19.6718, lng: 78.5311, type: 'town' },
        { name: 'Medak', lat: 18.0488, lng: 78.2751, type: 'town' }
      ],
      'Maharashtra': [
        { name: 'Mumbai', lat: 19.0760, lng: 72.8777, type: 'city' },
        { name: 'Pune', lat: 18.5204, lng: 73.8567, type: 'city' },
        { name: 'Nagpur', lat: 21.1458, lng: 79.0882, type: 'city' },
        { name: 'Nashik', lat: 19.9975, lng: 73.7898, type: 'city' },
        { name: 'Aurangabad', lat: 19.8762, lng: 75.3433, type: 'city' },
        { name: 'Solapur', lat: 17.6599, lng: 75.9064, type: 'city' },
        { name: 'Amravati', lat: 20.9374, lng: 77.7796, type: 'city' },
        { name: 'Kolhapur', lat: 16.7050, lng: 74.2433, type: 'city' },
        { name: 'Sangli', lat: 16.8524, lng: 74.5815, type: 'town' },
        { name: 'Akola', lat: 20.7002, lng: 77.0082, type: 'town' }
      ],
      'Delhi': [
        { name: 'New Delhi', lat: 28.6139, lng: 77.2090, type: 'city' },
        { name: 'Delhi', lat: 28.7041, lng: 77.1025, type: 'city' }
      ]
    };
    
    const cities = comprehensiveCities[stateName] || [];
    if (cities.length === 0) {
      return stateName; // Return state name if no cities found
    }
    
    let nearestCity = cities[0].name;
    let minDistance = Infinity;
    
    // Find the nearest city/town/village
    for (const location of cities) {
      const distance = this.calculateDistance(latitude, longitude, location.lat, location.lng);
      if (distance < minDistance) {
        minDistance = distance;
        nearestCity = location.name;
      }
    }
    
    console.log(`Nearest location found: ${nearestCity} (${minDistance.toFixed(2)}km away)`);
    return nearestCity;
  }

  // Clean and standardize location names
  private static cleanLocationName(name: string): string {
    return name.replace(/\s+(District|Taluk|Block|Mandal)$/i, '').trim();
  }

  // Map external state names to standard Indian state names
  private static mapToIndianState(stateName: string): string {
    const stateMapping: Record<string, string> = {
      'Tamil Nadu': 'Tamil Nadu',
      'Karnataka': 'Karnataka',
      'Andhra Pradesh': 'Andhra Pradesh',
      'Telangana': 'Telangana',
      'Kerala': 'Kerala',
      'Maharashtra': 'Maharashtra',
      'Gujarat': 'Gujarat',
      'Rajasthan': 'Rajasthan',
      'Delhi': 'Delhi',
      'National Capital Territory of Delhi': 'Delhi',
      'Haryana': 'Haryana',
      'Punjab': 'Punjab',
      'Uttar Pradesh': 'Uttar Pradesh',
      'Bihar': 'Bihar',
      'West Bengal': 'West Bengal',
      'Odisha': 'Odisha',
      'Madhya Pradesh': 'Madhya Pradesh',
      'Chhattisgarh': 'Chhattisgarh',
      'Jharkhand': 'Jharkhand',
      'Assam': 'Assam'
    };
    
    return stateMapping[stateName] || stateName;
  }

  // Coordinate-based fallback for major metropolitan areas
  private static coordinateBasedFallback(latitude: number, longitude: number): { city?: string; state?: string } {
    // Precise coordinate ranges for major cities
    const cityRanges = [
      { name: 'Chennai', state: 'Tamil Nadu', latRange: [12.8, 13.3], lngRange: [80.0, 80.4] },
      { name: 'Bangalore', state: 'Karnataka', latRange: [12.8, 13.1], lngRange: [77.4, 77.8] },
      { name: 'Hyderabad', state: 'Telangana', latRange: [17.2, 17.6], lngRange: [78.2, 78.7] },
      { name: 'Mumbai', state: 'Maharashtra', latRange: [18.9, 19.3], lngRange: [72.7, 73.0] },
      { name: 'Delhi', state: 'Delhi', latRange: [28.4, 28.9], lngRange: [76.8, 77.5] },
      { name: 'Pune', state: 'Maharashtra', latRange: [18.4, 18.7], lngRange: [73.7, 74.0] },
      { name: 'Kolkata', state: 'West Bengal', latRange: [22.4, 22.7], lngRange: [88.2, 88.5] },
      { name: 'Ahmedabad', state: 'Gujarat', latRange: [22.9, 23.2], lngRange: [72.4, 72.7] },
      { name: 'Jaipur', state: 'Rajasthan', latRange: [26.8, 27.0], lngRange: [75.6, 75.9] },
      { name: 'Lucknow', state: 'Uttar Pradesh', latRange: [26.7, 26.9], lngRange: [80.8, 81.1] }
    ];
    
    for (const cityRange of cityRanges) {
      if (latitude >= cityRange.latRange[0] && latitude <= cityRange.latRange[1] &&
          longitude >= cityRange.lngRange[0] && longitude <= cityRange.lngRange[1]) {
        console.log(`Coordinate-based detection: ${cityRange.name}, ${cityRange.state}`);
        return { city: cityRange.name, state: cityRange.state };
      }
    }
    
    // Final fallback
    console.log('Using final fallback location: Delhi');
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
