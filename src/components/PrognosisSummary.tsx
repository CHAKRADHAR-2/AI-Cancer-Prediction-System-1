
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PrognosisInfo } from '@/types/healthcare';
import { TrendingUp, AlertTriangle, Heart, Shield, Activity, Clock } from 'lucide-react';

interface PrognosisSummaryProps {
  prognosis: PrognosisInfo;
  cancerStage: 'I' | 'II' | 'III' | 'IV';
  cancerType: string;
}

export function PrognosisSummary({ prognosis, cancerStage, cancerType }: PrognosisSummaryProps) {
  const getOutlookColor = (outlook: string) => {
    switch (outlook) {
      case 'Excellent': return 'text-green-600 bg-green-50 border-green-200';
      case 'Good': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Fair': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Poor': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getOutlookIcon = (outlook: string) => {
    switch (outlook) {
      case 'Excellent': return <Shield className="h-5 w-5 text-green-600" />;
      case 'Good': return <TrendingUp className="h-5 w-5 text-blue-600" />;
      case 'Fair': return <Activity className="h-5 w-5 text-orange-600" />;
      case 'Poor': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default: return <Heart className="h-5 w-5 text-gray-600" />;
    }
  };

  const getSurvivalRatePercentage = (survivalRate: string): number => {
    const match = survivalRate.match(/(\d+)/);
    return match ? parseInt(match[1]) : 50;
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Main Prognosis Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Prognosis & Health Outlook
          </CardTitle>
          <CardDescription>
            Comprehensive prognosis for {cancerType} - Stage {cancerStage}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Outlook Summary */}
          <div className={`border rounded-lg p-4 ${getOutlookColor(prognosis.outlook)}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {getOutlookIcon(prognosis.outlook)}
                <h3 className="text-lg font-semibold">Overall Outlook: {prognosis.outlook}</h3>
              </div>
              <Badge variant={prognosis.isInDanger ? 'destructive' : 'secondary'}>
                {prognosis.isInDanger ? 'High Priority' : 'Manageable'}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium mb-2">Survival Rate</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">{prognosis.survivalRate}</span>
                    <span className="text-sm">{prognosis.timeframe}</span>
                  </div>
                  <Progress 
                    value={getSurvivalRatePercentage(prognosis.survivalRate)} 
                    className="h-3"
                  />
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Treatment Timeline</p>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{prognosis.timeframe}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Assessment */}
          {prognosis.isInDanger && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="font-medium">
                <strong>Immediate Medical Attention Required:</strong> Based on the current stage and condition, 
                this case requires urgent medical intervention. Please consult with an oncologist immediately 
                and follow the recommended treatment plan strictly.
              </AlertDescription>
            </Alert>
          )}

          {/* Remedies and Action Plan */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Recommended Action Plan
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prognosis.remedies.map((remedy, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-sm flex-1">{remedy}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stage-Specific Information */}
      <Card>
        <CardHeader>
          <CardTitle>Stage {cancerStage} Information</CardTitle>
          <CardDescription>
            Understanding your cancer stage and what it means for treatment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cancerStage === 'I' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2">Stage I (Early Stage)</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Cancer is small and localized to the organ where it started</li>
                  <li>• High chance of successful treatment and cure</li>
                  <li>• Treatment may involve surgery, with possible adjuvant therapy</li>
                  <li>• Regular monitoring to prevent recurrence</li>
                </ul>
              </div>
            )}

            {cancerStage === 'II' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">Stage II (Locally Advanced)</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Cancer has grown larger and may have spread to nearby tissues</li>
                  <li>• Good prognosis with comprehensive treatment</li>
                  <li>• May require combination therapy (surgery, chemotherapy, radiation)</li>
                  <li>• Close monitoring and follow-up essential</li>
                </ul>
              </div>
            )}

            {cancerStage === 'III' && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-medium text-orange-800 mb-2">Stage III (Regional Spread)</h4>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• Cancer has spread to several lymph nodes or nearby structures</li>
                  <li>• Requires aggressive, multi-modal treatment</li>
                  <li>• Treatment plan may include surgery, chemotherapy, and radiation</li>
                  <li>• Regular monitoring and supportive care important</li>
                </ul>
              </div>
            )}

            {cancerStage === 'IV' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-800 mb-2">Stage IV (Advanced/Metastatic)</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Cancer has spread to distant parts of the body</li>
                  <li>• Focus on quality of life and symptom management</li>
                  <li>• May include palliative treatments and pain management</li>
                  <li>• Support services and counseling available</li>
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Support and Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Support & Resources</CardTitle>
          <CardDescription>
            Additional support services and resources available to you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium">Medical Support</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Oncology team coordination</li>
                <li>• Palliative care services</li>
                <li>• Pain management specialists</li>
                <li>• Nutritionist consultation</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Emotional Support</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Cancer support groups</li>
                <li>• Counselling services</li>
                <li>• Family support programs</li>
                <li>• Spiritual care services</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Disclaimer */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> This prognosis is based on statistical data and general medical knowledge. 
          Individual outcomes can vary significantly. Always consult with your healthcare team for personalized 
          medical advice and treatment planning. This information is for educational purposes only.
        </AlertDescription>
      </Alert>
    </div>
  );
}
