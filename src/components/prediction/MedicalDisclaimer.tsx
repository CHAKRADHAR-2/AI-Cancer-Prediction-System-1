
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export function MedicalDisclaimer() {
  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="font-medium">
        <strong>Medical Disclaimer:</strong> This is a simulated AI system for educational purposes only. 
        These predictions and recommendations are not actual medical advice. Always consult with qualified 
        healthcare professionals for real medical decisions and treatment planning.
      </AlertDescription>
    </Alert>
  );
}
