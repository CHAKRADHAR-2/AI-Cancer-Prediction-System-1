
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building, MapPin } from 'lucide-react';
import { LocationInput } from '@/components/LocationInput';
import { HospitalRecommendations } from '@/components/HospitalRecommendations';
import { UserLocation } from '@/types/hospital';

interface HospitalFinderProps {
  onBack?: () => void;
  initialCancerType?: string;
}

export function HospitalFinder({ onBack, initialCancerType }: HospitalFinderProps) {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const handleLocationSet = (location: UserLocation): void => {
    console.log('Location set in HospitalFinder:', location);
    setUserLocation(location);
  };

  const handleNewSearch = (): void => {
    setUserLocation(null);
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
      {onBack && (
        <Button 
          onClick={onBack}
          variant="outline"
          className="mb-4 border-2 border-blue-500 text-blue-600 hover:bg-blue-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Results
        </Button>
      )}
      
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent mb-4">
          Find Specialized Cancer Treatment Centers
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Locate the best hospitals and medical facilities with specialized cancer care in your area
        </p>
      </div>

      {!userLocation ? (
        <div className="max-w-2xl mx-auto">
          <LocationInput 
            onLocationSet={handleLocationSet}
            isLoading={isLoadingLocation}
          />
          
          {/* Information Card */}
          <Card className="mt-6 backdrop-blur-sm bg-white/80 border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-blue-700">
                <Building className="h-5 w-5" />
                Why Set Your Location?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-800">Find Nearby Specialists</h4>
                  <p className="text-sm text-gray-600">
                    Get personalized recommendations for cancer treatment centers within your area
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Building className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-800">Treatment Availability</h4>
                  <p className="text-sm text-gray-600">
                    Find hospitals with specialized departments for your specific cancer type
                  </p>
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700">
                  <strong>Privacy Note:</strong> Your location is only used to find nearby hospitals and is not stored or shared.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Location Display & New Search Button */}
          <Card className="backdrop-blur-sm bg-white/80 border-2 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-gray-800">
                    Search Location: {userLocation.city}, {userLocation.state}
                  </span>
                </div>
                <Button 
                  onClick={handleNewSearch}
                  variant="outline"
                  size="sm"
                  className="border-blue-500 text-blue-600 hover:bg-blue-50"
                >
                  Change Location
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Hospital Recommendations */}
          <HospitalRecommendations 
            userLocation={userLocation}
            cancerType={initialCancerType || 'Oncology'}
            radiusKm={100}
          />
        </div>
      )}
    </div>
  );
}
