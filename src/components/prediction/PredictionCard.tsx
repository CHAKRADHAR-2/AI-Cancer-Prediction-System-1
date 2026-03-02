
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PredictionResult } from '@/types/healthcare';
import { AlertTriangle, CheckCircle, Info, TrendingUp } from 'lucide-react';
import { getStageDescription } from '@/utils/cancerStaging';

interface PredictionCardProps {
  prediction: PredictionResult['prediction'];
  cancerDetected: boolean;
}

export function PredictionCard({ prediction, cancerDetected }: PredictionCardProps) {
  const getRiskColor = (riskLevel: string): void => {
    switch (riskLevel) {
      case 'High': return 'destructive';
      case 'Medium': return 'default';
      case 'Low': return 'secondary';
      default: return 'default';
    }
  };

  const getRiskIcon = (riskLevel: string): void => {
    switch (riskLevel) {
      case 'High': return <AlertTriangle className="h-4 w-4" />;
      case 'Medium': return <Info className="h-4 w-4" />;
      case 'Low': return <CheckCircle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  return (
    <Card className={`backdrop-blur-sm bg-white/70 border-2 ${!cancerDetected ? 'border-green-200 shadow-green-100' : 'border-gray-200'} shadow-xl`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Cancer Prediction Results
        </CardTitle>
        <CardDescription>
          AI-powered cancer type prediction {cancerDetected ? 'with staging analysis' : ''} based on patient health data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`grid grid-cols-1 ${cancerDetected ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-4`}>
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Predicted Cancer Type</h3>
            <p className={`text-2xl font-bold ${!cancerDetected ? 'text-green-600 animate-pulse' : 'text-primary'}`}>
              {prediction.cancerType}
            </p>
          </div>
          
          {/* Only show staging section if cancer is detected */}
          {cancerDetected && (
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Cancer Stage</h3>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-orange-600">
                  Stage {prediction.stage || 'I'}
                </p>
                <p className="text-sm text-muted-foreground">{getStageDescription(prediction.stage || 'I')}</p>
              </div>
            </div>
          )}
          
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Confidence Level</h3>
            <div className="space-y-2">
              <p className="text-2xl font-bold">{prediction.confidence}%</p>
              <Progress value={prediction.confidence} className="w-full" />
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Risk Level</h3>
            <Badge variant={getRiskColor(prediction.riskLevel)} className="text-lg px-3 py-1">
              {getRiskIcon(prediction.riskLevel)}
              {prediction.riskLevel}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
