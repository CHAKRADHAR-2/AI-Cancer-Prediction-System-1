
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface HealthRecommendationsProps {
  recommendations: string[];
}

export function HealthRecommendations({ recommendations }: HealthRecommendationsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Recommendations</CardTitle>
        <CardDescription>
          Personalized recommendations based on the prediction and patient profile
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recommendations.map((recommendation, index) => (
            <Alert key={index}>
              <Info className="h-4 w-4" />
              <AlertDescription>{recommendation}</AlertDescription>
            </Alert>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
