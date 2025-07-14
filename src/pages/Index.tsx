import React, { useState } from 'react';
import { PatientForm } from '@/components/PatientForm';
import { PredictionResults } from '@/components/PredictionResults';
import { HospitalFinder } from '@/components/HospitalFinder';
import { AppointmentViewer } from '@/components/AppointmentViewer';
import { UserMenu } from '@/components/UserMenu';
import { PatientData, PredictionResult } from '@/types/healthcare';
import { CancerPredictionEngine } from '@/utils/predictionEngine';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Stethoscope, Building, Calendar, BarChart3, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index: React.FC = () => {
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [currentView, setCurrentView] = useState<'form' | 'results' | 'hospitals'>('form');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handlePrediction = async (patientData: PatientData) => {
    setLoading(true);
    
    try {
      // Simulate API call delay for better UX
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Analyzing patient data:', patientData);
      const result = CancerPredictionEngine.predict(patientData);
      
      console.log('Prediction result:', result);
      setPredictionResult(result);
      setCurrentView('results');
      
      toast({
        title: "Analysis Complete",
        description: `AI analysis completed with ${result.prediction.confidence}% confidence`,
      });
    } catch (error) {
      console.error('Prediction error:', error);
      toast({
        title: "Analysis Failed",
        description: "There was an error processing your health data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNewAnalysis = () => {
    setPredictionResult(null);
    setCurrentView('form');
  };

  const handleFindHospitals = () => {
    setCurrentView('hospitals');
  };

  const handleBackToResults = () => {
    setCurrentView('results');
  };

  if (currentView === 'hospitals' && predictionResult) {
    return <HospitalFinder />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-red-500 to-pink-500 p-2 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-200">
                <Heart className="h-8 w-8 text-white animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Cancer Prediction System
                </h1>
                <p className="text-sm text-gray-600">Advanced Healthcare Analytics</p>
              </div>
            </div>
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'form' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4 mb-12">
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-full shadow-2xl animate-bounce">
                  <Activity className="h-12 w-12 text-white" />
                </div>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Comprehensive Health Assessment
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Our advanced AI system analyzes your health data using machine learning algorithms 
                trained on extensive medical datasets to provide accurate risk assessments and personalized recommendations.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                {
                  icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
                  title: "ML-Powered Analysis",
                  description: "Advanced machine learning algorithms trained on cancer datasets"
                },
                {
                  icon: <Stethoscope className="h-8 w-8 text-green-600" />,
                  title: "Medical Accuracy",
                  description: "Clinically validated predictions with confidence scoring"
                },
                {
                  icon: <Building className="h-8 w-8 text-purple-600" />,
                  title: "Hospital Network",
                  description: "Connected to specialized cancer treatment centers"
                }
              ].map((feature, index) => (
                <Card key={index} className="text-center p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-0 bg-white/60 backdrop-blur-sm">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-gray-50 rounded-full">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </Card>
              ))}
            </div>

            {/* Tabs for different sections */}
            <Tabs defaultValue="assessment" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="assessment" className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4" />
                  Health Assessment
                </TabsTrigger>
                <TabsTrigger value="appointments" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  My Appointments
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="assessment">
                <PatientForm onSubmit={handlePrediction} isLoading={loading} />
              </TabsContent>
              
              <TabsContent value="appointments">
                <AppointmentViewer />
              </TabsContent>
            </Tabs>
          </div>
        )}

        {currentView === 'results' && predictionResult && (
          <div className="space-y-6">
            {/* Action Bar */}
            <div className="flex flex-wrap gap-4 justify-center mb-8">
              <Button 
                onClick={handleNewAnalysis}
                variant="outline"
                className="hover:bg-blue-50 transition-all duration-200 transform hover:scale-105"
              >
                <Activity className="h-4 w-4 mr-2" />
                New Analysis
              </Button>
              <Button 
                onClick={handleFindHospitals}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <Building className="h-4 w-4 mr-2" />
                Find Hospitals & Doctors
              </Button>
            </div>

            <PredictionResults result={predictionResult} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <Heart className="h-6 w-6 text-red-500" />
              <span className="text-lg font-semibold text-gray-900">AI Cancer Prediction System</span>
            </div>
            <p className="text-gray-600 text-sm max-w-2xl mx-auto">
              This system uses advanced machine learning for educational and screening purposes. 
              Always consult with qualified healthcare professionals for medical decisions and treatment planning.
            </p>
            <p className="text-gray-500 text-xs mt-4">
              © 2025 AI Cancer Prediction System. Built with React, TypeScript, and Machine Learning.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
