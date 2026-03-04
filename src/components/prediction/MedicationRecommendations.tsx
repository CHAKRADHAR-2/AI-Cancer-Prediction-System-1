
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Medication } from '@/types/healthcare';
import { Pill } from 'lucide-react';

interface MedicationRecommendationsProps {
  medications: Medication[];
  cancerType: string;
  stage: string;
}

export function MedicationRecommendations({ medications, cancerType, stage }: MedicationRecommendationsProps) {
  if (medications.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pill className="h-5 w-5" />
          Recommended Medications
        </CardTitle>
        <CardDescription>
          Evidence-based medication recommendations for {cancerType} - Stage {stage}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {medications.map((medication, index) => (
            <Card key={index} className="border-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{medication.name}</CardTitle>
                <Badge variant="outline">{medication.category}</Badge>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm font-medium">Dosage</p>
                  <p className="text-sm text-muted-foreground">{medication.dosage}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Frequency</p>
                  <p className="text-sm text-muted-foreground">{medication.frequency}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Duration</p>
                  <p className="text-sm text-muted-foreground">{medication.duration}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Common Side Effects</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {medication.sideEffects.slice(0, 3).map((effect, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {effect}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
