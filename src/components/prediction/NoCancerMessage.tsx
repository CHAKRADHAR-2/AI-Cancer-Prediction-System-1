
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';

export function NoCancerMessage() {
  return (
    <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-green-100 animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-600">
          <CheckCircle className="h-5 w-5 animate-pulse" />
          🎉 Fantastic News - No Cancer Detected! 🎉
        </CardTitle>
        <CardDescription>
          Based on the comprehensive AI analysis, no cancer indicators were found in your health data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription>
              <strong>🌟 Excellent Health Results:</strong> The AI analysis indicates a very low probability of cancer. 
              Your health profile shows positive indicators. Continue maintaining your healthy lifestyle and regular check-ups! 
              <span className="text-2xl ml-2">😊✨</span>
            </AlertDescription>
          </Alert>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-green-700">🍃 Preventive Measures</h4>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• 🏃‍♀️ Maintain regular exercise routine</li>
                <li>• 🥗 Follow a balanced, nutritious diet</li>
                <li>• 🚭 Avoid smoking and limit alcohol</li>
                <li>• 😴 Get adequate sleep (7-9 hours)</li>
                <li>• 🧘‍♀️ Manage stress effectively</li>
              </ul>
            </div>
            <div className="bg-white/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-green-700">📅 Regular Screenings</h4>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• 🩺 Annual health check-ups</li>
                <li>• 🔍 Age-appropriate cancer screenings</li>
                <li>• 👀 Monitor any new symptoms</li>
                <li>• 👨‍👩‍👧‍👦 Family history awareness</li>
              </ul>
            </div>
          </div>
          <div className="text-center py-4">
            <div className="text-4xl animate-bounce">
              🎊 💪 🌈 🎉 ⭐
            </div>
            <p className="text-green-600 font-semibold mt-2">Keep up the great work on your health journey!</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
