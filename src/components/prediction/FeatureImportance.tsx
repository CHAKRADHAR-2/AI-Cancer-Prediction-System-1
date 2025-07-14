
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PredictionResult } from '@/types/healthcare';

interface FeatureImportanceProps {
  featureImportance: PredictionResult['featureImportance'];
}

export function FeatureImportance({ featureImportance }: FeatureImportanceProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Importance Analysis</CardTitle>
        <CardDescription>
          SHAP-like analysis showing which factors contributed most to the prediction
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {featureImportance.slice(0, 8).map((feature, index) => (
            <div key={feature.feature} className="flex items-center space-x-4">
              <div className="w-32 text-sm font-medium">{feature.feature}</div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <Progress 
                    value={feature.importance} 
                    className="flex-1"
                  />
                  <span className="text-sm w-12">{feature.importance.toFixed(1)}%</span>
                  <Badge 
                    variant={feature.impact === 'positive' ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {feature.impact === 'positive' ? '+' : '-'}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
