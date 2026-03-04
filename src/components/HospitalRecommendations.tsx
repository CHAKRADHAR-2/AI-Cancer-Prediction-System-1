import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { HospitalWithDistance, Doctor, UserLocation } from '@/types/hospital';
import { HospitalService } from '@/services/hospitalService';
import { MapPin, Phone, Globe, Star, Building, Users, Calendar, IndianRupee } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface HospitalRecommendationsProps {
  userLocation: UserLocation;
  cancerType: string;
  radiusKm?: number;
}

export function HospitalRecommendations({ 
  userLocation, 
  cancerType, 
  radiusKm = 50 
}: HospitalRecommendationsProps) {
  const [hospitals, setHospitals] = useState<HospitalWithDistance[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHospital, setSelectedHospital] = useState<string | null>(null);
  const [doctors, setDoctors] = useState<Record<string, Doctor[]>>({});
  const { toast } = useToast();

  useEffect(() => {
    searchHospitals();
  }, [userLocation, cancerType, radiusKm]);

  const searchHospitals = async () => {
    setLoading(true);
    try {
      const results = await HospitalService.searchHospitals(userLocation, cancerType, radiusKm);
      setHospitals(results);
      
      if (results.length === 0) {
        toast({
          title: "No Hospitals Found",
          description: `No specialized hospitals found within ${radiusKm}km. Try increasing the search radius.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Search Failed",
        description: "Failed to search hospitals. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadDoctors = async (hospitalId: string) => {
    if (doctors[hospitalId]) return; // Already loaded

    try {
      const hospitalDoctors = await HospitalService.getHospitalDoctors(hospitalId, cancerType);
      setDoctors(prev => ({
        ...prev,
        [hospitalId]: hospitalDoctors
      }));
    } catch (error) {
      toast({
        title: "Failed to Load Doctors",
        description: "Could not load doctor information",
        variant: "destructive"
      });
    }
  };

  const toggleHospitalDetails = (hospitalId: string): void => {
    if (selectedHospital === hospitalId) {
      setSelectedHospital(null);
    } else {
      setSelectedHospital(hospitalId);
      loadDoctors(hospitalId);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Searching Hospitals...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Recommended Hospitals for {cancerType}
          </CardTitle>
          <CardDescription>
            Found {hospitals.length} specialized hospitals within {radiusKm}km of your location
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {hospitals.map((hospital) => (
          <Card key={hospital.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader 
              className="pb-3"
              onClick={() => toggleHospitalDetails(hospital.id)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{hospital.name}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {hospital.distance.toFixed(1)} km away
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {hospital.rating} ({hospital.total_reviews} reviews)
                    </div>
                    {hospital.is_government && (
                      <Badge variant="secondary">Government</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{hospital.address}</p>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-sm font-medium">{hospital.city}</div>
                  <div className="text-xs text-muted-foreground">
                    {hospital.bed_capacity} beds
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {hospital.specializations.slice(0, 3).map((spec) => (
                  <Badge key={spec} variant="outline" className="text-xs">
                    {spec}
                  </Badge>
                ))}
                {hospital.specializations.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{hospital.specializations.length - 3} more
                  </Badge>
                )}
              </div>
            </CardHeader>

            {selectedHospital === hospital.id && (
              <CardContent className="pt-0">
                <Separator className="mb-4" />
                
                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Contact Information</h4>
                    {hospital.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4" />
                        <a href={`tel:${hospital.phone}`} className="hover:underline">
                          {hospital.phone}
                        </a>
                      </div>
                    )}
                    {hospital.website && (
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="h-4 w-4" />
                        <a 
                          href={hospital.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:underline text-primary"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Hospital Details</h4>
                    <div className="text-sm text-muted-foreground">
                      <p>Established: {hospital.established_year}</p>
                      <p>Capacity: {hospital.bed_capacity} beds</p>
                      <p>Type: {hospital.is_government ? 'Government' : 'Private'}</p>
                    </div>
                  </div>
                </div>

                {/* Doctors Section */}
                {doctors[hospital.id] && (
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Specialized Doctors ({doctors[hospital.id].length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {doctors[hospital.id].slice(0, 4).map((doctor) => (
                        <Card key={doctor.id} className="p-3">
                          <div className="space-y-2">
                            <div className="flex justify-between items-start">
                              <h5 className="font-medium">{doctor.name}</h5>
                              <div className="flex items-center gap-1 text-xs">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                {doctor.rating}
                              </div>
                            </div>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <p>{doctor.specialization}</p>
                              <p>{doctor.qualification}</p>
                              <div className="flex items-center gap-4">
                                <span>{doctor.experience_years} years exp</span>
                                <div className="flex items-center gap-1">
                                  <IndianRupee className="h-3 w-3" />
                                  {doctor.consultation_fee}
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span className="text-xs">
                                  {doctor.available_days.slice(0, 3).join(', ')}
                                  {doctor.available_days.length > 3 && '...'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                    {doctors[hospital.id].length > 4 && (
                      <p className="text-sm text-muted-foreground mt-2">
                        +{doctors[hospital.id].length - 4} more doctors available
                      </p>
                    )}
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" asChild>
                    <a href={`tel:${hospital.phone}`}>Call Hospital</a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${hospital.latitude},${hospital.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Get Directions
                    </a>
                  </Button>
                  {hospital.website && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={hospital.website} target="_blank" rel="noopener noreferrer">
                        Visit Website
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {hospitals.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-8">
            <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Hospitals Found</h3>
            <p className="text-muted-foreground">
              No specialized hospitals found within {radiusKm}km for {cancerType}.
              Try expanding your search radius or check nearby cities.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}