
import React from 'react';
import { PredictionResult } from '@/types/healthcare';
import { AppointmentScheduler } from '@/components/AppointmentScheduler';
import { PrognosisSummary } from '@/components/PrognosisSummary';
import { MoodHeader } from '@/components/prediction/MoodHeader';
import { PredictionCard } from '@/components/prediction/PredictionCard';
import { NoCancerMessage } from '@/components/prediction/NoCancerMessage';
import { FeatureImportance } from '@/components/prediction/FeatureImportance';
import { MedicationRecommendations } from '@/components/prediction/MedicationRecommendations';
import { NutritionRecommendations } from '@/components/prediction/NutritionRecommendations';
import { HealthRecommendations } from '@/components/prediction/HealthRecommendations';
import { FollowUpRecommendation } from '@/components/prediction/FollowUpRecommendation';
import { MedicalDisclaimer } from '@/components/prediction/MedicalDisclaimer';
import { SHAPExplanationComponent } from '@/components/SHAPExplanation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

interface PredictionResultsProps {
  result: PredictionResult;
}

export function PredictionResults({ result }: PredictionResultsProps) {
  const { prediction, medications, featureImportance, recommendations, nutritionRecommendations, appointmentRecommendation, prognosis } = result;

  // CRITICAL FIX: Check if cancer was detected - stage must NOT be empty AND cancer type must NOT be "No Cancer Detected"
  const cancerDetected = prediction.stage !== '' && prediction.cancerType !== 'No Cancer Detected';

  // Get mood-based animations and styling
  const getMoodStyling = () => {
    if (!cancerDetected) {
      return {
        containerClass: "animate-pulse bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50",
      };
    }
    
    const stage = prediction.stage;
    if (stage === 'I') {
      return {
        containerClass: "bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50",
      };
    } else if (stage === 'II') {
      return {
        containerClass: "bg-gradient-to-br from-orange-50 via-red-50 to-pink-50",
      };
    } else {
      return {
        containerClass: "bg-gradient-to-br from-red-50 via-pink-50 to-rose-50",
      };
    }
  };

  const moodStyling = getMoodStyling();

  return (
    <div className={`w-full max-w-6xl space-y-6 p-4 rounded-3xl transition-all duration-1000 ${moodStyling.containerClass}`}>
      {/* Mood-based header */}
      <MoodHeader cancerDetected={cancerDetected} stage={prediction.stage} />

      {/* Main Prediction */}
      <PredictionCard prediction={prediction} cancerDetected={cancerDetected} />

      {/* Prognosis Summary - Only show if cancer detected */}
      {cancerDetected && (
        <PrognosisSummary 
          prognosis={prognosis}
          cancerStage={prediction.stage as 'I' | 'II' | 'III' | 'IV'}
          cancerType={prediction.cancerType}
        />
      )}

      {/* No Cancer Detected Message with Happy Animation */}
      {!cancerDetected && <NoCancerMessage />}

      {/* Detailed Analysis Tabs */}
      <Tabs defaultValue="analysis" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="explanation">AI Explanation</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="analysis" className="space-y-6">
          {/* Feature Importance (SHAP-like) */}
          <FeatureImportance featureImportance={featureImportance} />
          
          {/* Medication Recommendations - Only show if cancer detected and medications available */}
          {cancerDetected && medications.length > 0 && (
            <MedicationRecommendations 
              medications={medications}
              cancerType={prediction.cancerType}
              stage={prediction.stage}
            />
          )}
        </TabsContent>
        
        <TabsContent value="explanation">
          {result.shapExplanation ? (
            <SHAPExplanationComponent explanation={result.shapExplanation} />
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">AI Explanation Available</h3>
                <p className="text-muted-foreground">
                  SHAP-based explanation shows how each factor contributed to the prediction.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="recommendations" className="space-y-6">
          {/* Nutrition Recommendations */}
          {nutritionRecommendations.length > 0 && (
            <NutritionRecommendations 
              nutritionRecommendations={nutritionRecommendations}
              cancerDetected={cancerDetected}
              cancerType={prediction.cancerType}
            />
          )}

          {/* Health Recommendations */}
          <HealthRecommendations recommendations={recommendations} />
        </TabsContent>
        
        <TabsContent value="appointments">
          {/* Appointment Scheduler - Only show if cancer detected */}
          {cancerDetected ? (
            <AppointmentScheduler 
              recommendation={appointmentRecommendation}
              cancerStage={prediction.stage as 'I' | 'II' | 'III' | 'IV'}
            />
          ) : (
            <FollowUpRecommendation />
          )}
        </TabsContent>
      </Tabs>

      {/* Important Disclaimer */}
      <MedicalDisclaimer />
    </div>
  );
}
