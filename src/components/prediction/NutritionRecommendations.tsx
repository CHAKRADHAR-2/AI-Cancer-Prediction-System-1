
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NutritionRecommendation } from '@/types/healthcare';
import { Apple, AlertTriangle, CheckCircle } from 'lucide-react';

interface NutritionRecommendationsProps {
  nutritionRecommendations: NutritionRecommendation[];
  cancerDetected: boolean;
  cancerType: string;
}

export function NutritionRecommendations({ nutritionRecommendations, cancerDetected, cancerType }: NutritionRecommendationsProps) {
  if (nutritionRecommendations.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Apple className="h-5 w-5" />
          Nutrition & Diet Recommendations
        </CardTitle>
        <CardDescription>
          Personalized dietary guidance for {cancerDetected ? `${cancerType} management` : 'cancer prevention'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {nutritionRecommendations.map((nutrition, index) => (
            <Card key={index} className="border-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  {nutrition.category.includes('Avoid') || nutrition.category.includes('Limit') ? 
                    <AlertTriangle className="h-4 w-4 text-destructive" /> : 
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  }
                  {nutrition.category}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium mb-2">Recommended Foods:</p>
                  <div className="flex flex-wrap gap-1">
                    {nutrition.foods.map((food, i) => (
                      <Badge 
                        key={i} 
                        variant={nutrition.category.includes('Avoid') || nutrition.category.includes('Limit') ? 'destructive' : 'secondary'} 
                        className="text-xs"
                      >
                        {food}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">Benefits:</p>
                  <p className="text-sm text-muted-foreground">{nutrition.benefits}</p>
                </div>
                {nutrition.avoidFoods && nutrition.avoidFoods.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-destructive">Foods to Avoid:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {nutrition.avoidFoods.map((food, i) => (
                        <Badge key={i} variant="destructive" className="text-xs">
                          {food}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
