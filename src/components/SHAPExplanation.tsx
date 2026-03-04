import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SHAPExplanation, FeatureContribution } from '@/types/healthcare';
import { 
  TrendingUp, 
  TrendingDown, 
  Info, 
  BarChart3, 
  Target,
  Shield,
  AlertTriangle
} from 'lucide-react';

interface SHAPExplanationProps {
  explanation: SHAPExplanation;
}

export function SHAPExplanationComponent({ explanation }: SHAPExplanationProps) {
  const renderFeatureContribution = (contribution: FeatureContribution, index: number): void => {
    const isRisk = contribution.impact === 'Increases Risk';
    const barWidth = Math.abs(contribution.contributionPct);
    
    return (
      <div key={contribution.featureKey} className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isRisk ? (
              <TrendingUp className="h-4 w-4 text-red-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-green-500" />
            )}
            <span className="font-medium text-sm">{contribution.feature}</span>
            <Badge 
              variant={contribution.magnitude === 'High' ? 'destructive' : 
                      contribution.magnitude === 'Medium' ? 'default' : 'secondary'}
              className="text-xs"
            >
              {contribution.magnitude}
            </Badge>
          </div>
          <span className="text-sm text-muted-foreground">
            {contribution.contributionPct.toFixed(1)}%
          </span>
        </div>
        
        <div className="relative">
          <Progress 
            value={barWidth} 
            className={`h-2 ${isRisk ? 'bg-red-100' : 'bg-green-100'}`}
          />
          <div 
            className={`absolute top-0 left-0 h-2 rounded-full ${
              isRisk ? 'bg-red-500' : 'bg-green-500'
            }`}
            style={{ width: `${barWidth}%` }}
          />
        </div>
        
        <div className="text-xs text-muted-foreground">
          Feature value: {(contribution.featureValue * 100).toFixed(1)}% | 
          SHAP value: {contribution.shapValue.toFixed(3)}
        </div>
      </div>
    );
  };

  const renderWaterfallChart = (): void => {
    const sortedContributions = [...explanation.featureContributions]
      .sort((a, b) => Math.abs(b.shapValue) - Math.abs(a.shapValue))
      .slice(0, 8);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Baseline</div>
            <div className="text-lg font-semibold">
              {(explanation.baselineProbability * 100).toFixed(1)}%
            </div>
          </div>
          <div className="flex-1 mx-4">
            <div className="flex items-center justify-center">
              <div className="text-2xl">→</div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Prediction</div>
            <div className="text-lg font-semibold">
              {(explanation.predictedProbability * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {sortedContributions.map((contribution, index) => (
            <div key={contribution.featureKey} className="flex items-center gap-3">
              <div className="w-32 text-sm font-medium truncate">
                {contribution.feature}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div 
                    className={`h-6 rounded ${
                      contribution.shapValue > 0 ? 'bg-red-500' : 'bg-green-500'
                    }`}
                    style={{ 
                      width: `${Math.abs(contribution.shapValue) * 200}px`,
                      minWidth: '4px'
                    }}
                  />
                  <span className="text-sm">
                    {contribution.shapValue > 0 ? '+' : ''}{contribution.shapValue.toFixed(3)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          <CardTitle>AI Explanation (SHAP Analysis)</CardTitle>
        </div>
        <CardDescription>
          Understanding how each factor contributed to the prediction using explainable AI
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Summary */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="text-sm">
            {explanation.summary}
          </AlertDescription>
        </Alert>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Target className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">
                {(explanation.predictedProbability * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Predicted Probability</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-red-600" />
              <div className="text-2xl font-bold">{explanation.topRiskFactors.length}</div>
              <div className="text-sm text-muted-foreground">Risk Factors</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Shield className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">{explanation.topProtectiveFactors.length}</div>
              <div className="text-sm text-muted-foreground">Protective Factors</div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analysis */}
        <Tabs defaultValue="contributions" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="contributions">All Contributions</TabsTrigger>
            <TabsTrigger value="risk-factors">Risk Factors</TabsTrigger>
            <TabsTrigger value="protective">Protective Factors</TabsTrigger>
          </TabsList>
          
          <TabsContent value="contributions" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-semibold">Feature Contributions (Top 10)</h4>
              {explanation.featureContributions.slice(0, 10).map((contribution, index) => 
                renderFeatureContribution(contribution, index)
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="risk-factors" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                Top Risk Factors
              </h4>
              {explanation.topRiskFactors.length > 0 ? (
                explanation.topRiskFactors.map((contribution, index) => 
                  renderFeatureContribution(contribution, index)
                )
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Shield className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <p>No significant risk factors identified</p>
                  <p className="text-sm">This is a positive indicator for your health</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="protective" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                Protective Factors
              </h4>
              {explanation.topProtectiveFactors.length > 0 ? (
                explanation.topProtectiveFactors.map((contribution, index) => 
                  renderFeatureContribution(contribution, index)
                )
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-orange-500" />
                  <p>Limited protective factors identified</p>
                  <p className="text-sm">Consider lifestyle improvements for better health</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Waterfall Chart */}
        <div className="space-y-4">
          <h4 className="font-semibold">Prediction Waterfall Chart</h4>
          <Card>
            <CardContent className="p-4">
              {renderWaterfallChart()}
            </CardContent>
          </Card>
        </div>

        {/* Technical Details */}
        <div className="text-xs text-muted-foreground space-y-1 p-4 bg-muted rounded-lg">
          <p><strong>Explanation Type:</strong> {explanation.explanationType}</p>
          <p><strong>Total Features Analyzed:</strong> {explanation.totalFeatures}</p>
          <p><strong>Baseline Probability:</strong> {(explanation.baselineProbability * 100).toFixed(1)}%</p>
          <p><strong>Note:</strong> SHAP values show how each feature pushes the prediction above or below the baseline probability.</p>
        </div>
      </CardContent>
    </Card>
  );
}