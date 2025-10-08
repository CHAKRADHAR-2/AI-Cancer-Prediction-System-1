import { HospitalService } from '../services/hospitalService';
import { HospitalDataService } from '../services/hospitalDataService';

// Test function to verify hospital search functionality
export async function testHospitalSearch() {
  console.log('🏥 Testing Cancer Hospital Search Functionality...\n');

  // Test locations across different states
  const testLocations = [
    { city: 'Chennai', state: 'Tamil Nadu', latitude: 13.0827, longitude: 80.2707 },
    { city: 'Bangalore', state: 'Karnataka', latitude: 12.9716, longitude: 77.5946 },
    { city: 'Mumbai', state: 'Maharashtra', latitude: 19.0760, longitude: 72.8777 },
    { city: 'Delhi', state: 'Delhi', latitude: 28.6139, longitude: 77.2090 },
    { city: 'Hyderabad', state: 'Telangana', latitude: 17.3850, longitude: 78.4867 },
    { city: 'Kolkata', state: 'West Bengal', latitude: 22.5726, longitude: 88.3639 },
    { city: 'Ahmedabad', state: 'Gujarat', latitude: 23.0225, longitude: 72.5714 },
    { city: 'Jaipur', state: 'Rajasthan', latitude: 26.9124, longitude: 75.7873 },
    { city: 'Lucknow', state: 'Uttar Pradesh', latitude: 26.8467, longitude: 80.9462 },
    { city: 'Patna', state: 'Bihar', latitude: 25.5941, longitude: 85.1376 },
    { city: 'Bhubaneswar', state: 'Odisha', latitude: 20.2961, longitude: 85.8245 },
    { city: 'Guwahati', state: 'Assam', latitude: 26.1445, longitude: 91.7362 },
    { city: 'Thiruvananthapuram', state: 'Kerala', latitude: 8.5241, longitude: 76.9366 },
    { city: 'Chandigarh', state: 'Punjab', latitude: 30.7333, longitude: 76.7794 },
    { city: 'Bhopal', state: 'Madhya Pradesh', latitude: 23.2599, longitude: 77.4126 }
  ];

  const cancerTypes = ['Medical Oncology', 'Breast Cancer', 'Lung Cancer', 'Blood Cancer', 'Oncology'];

  let totalHospitalsFound = 0;
  let locationsWithHospitals = 0;

  for (const location of testLocations) {
    console.log(`\n📍 Testing location: ${location.city}, ${location.state}`);
    
    try {
      // Test with different cancer types
      for (const cancerType of cancerTypes) {
        const hospitals = await HospitalService.searchHospitals(location, cancerType, 100);
        
        if (hospitals.length > 0) {
          console.log(`  ✅ Found ${hospitals.length} hospitals for ${cancerType}`);
          totalHospitalsFound += hospitals.length;
          
          // Show top 3 hospitals
          const top3 = hospitals.slice(0, 3);
          top3.forEach((hospital, index) => {
            console.log(`    ${index + 1}. ${hospital.name} (${hospital.city}, ${hospital.state}) - ${hospital.distance?.toFixed(1)}km`);
          });
          
          if (cancerType === 'Medical Oncology') {
            locationsWithHospitals++;
          }
          break; // Found hospitals, no need to test other cancer types for this location
        }
      }
      
      // If no hospitals found with any cancer type, report it
      let foundAny = false;
      for (const cancerType of cancerTypes) {
        const hospitals = await HospitalService.searchHospitals(location, cancerType, 100);
        if (hospitals.length > 0) {
          foundAny = true;
          break;
        }
      }
      
      if (!foundAny) {
        console.log(`  ❌ No cancer hospitals found for ${location.city}, ${location.state}`);
      }
      
    } catch (error) {
      console.error(`  ❌ Error searching hospitals for ${location.city}:`, error);
    }
  }

  // Test comprehensive database
  console.log('\n\n🔍 Testing Comprehensive Cancer Hospital Database...');
  const allCancerHospitals = HospitalDataService.getAllCancerHospitals();
  console.log(`📊 Total cancer hospitals in database: ${allCancerHospitals.length}`);

  // Count hospitals by state
  const hospitalsByState: Record<string, number> = {};
  allCancerHospitals.forEach(hospital => {
    hospitalsByState[hospital.state] = (hospitalsByState[hospital.state] || 0) + 1;
  });

  console.log('\n📈 Hospitals by State:');
  Object.entries(hospitalsByState)
    .sort(([,a], [,b]) => b - a)
    .forEach(([state, count]) => {
      console.log(`  ${state}: ${count} hospitals`);
    });

  // Test search functionality
  console.log('\n\n🔎 Testing Search Functionality...');
  const searchQueries = ['cancer', 'oncology', 'tata', 'aiims', 'apollo'];
  
  for (const query of searchQueries) {
    const results = HospitalDataService.searchCancerHospitals(query);
    console.log(`  "${query}": ${results.length} results`);
  }

  // Summary
  console.log('\n\n📋 Test Summary:');
  console.log(`✅ Total locations tested: ${testLocations.length}`);
  console.log(`✅ Locations with hospitals found: ${locationsWithHospitals}`);
  console.log(`✅ Total hospital results: ${totalHospitalsFound}`);
  console.log(`✅ Coverage: ${((locationsWithHospitals / testLocations.length) * 100).toFixed(1)}%`);
  console.log(`✅ Total hospitals in database: ${allCancerHospitals.length}`);
  console.log(`✅ States covered: ${Object.keys(hospitalsByState).length}`);

  if (locationsWithHospitals === testLocations.length) {
    console.log('\n🎉 SUCCESS: All test locations have cancer hospitals available!');
  } else {
    console.log(`\n⚠️  WARNING: ${testLocations.length - locationsWithHospitals} locations need more hospital coverage.`);
  }

  return {
    totalLocations: testLocations.length,
    locationsWithHospitals,
    totalHospitals: allCancerHospitals.length,
    statesCovered: Object.keys(hospitalsByState).length,
    coverage: (locationsWithHospitals / testLocations.length) * 100
  };
}

// Function to run the test (can be called from browser console)
export function runHospitalTest() {
  testHospitalSearch().then(results => {
    console.log('\n🏁 Test completed successfully!', results);
  }).catch(error => {
    console.error('❌ Test failed:', error);
  });
}