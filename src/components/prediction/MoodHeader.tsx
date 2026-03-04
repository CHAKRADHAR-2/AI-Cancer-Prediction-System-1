
import React from 'react';
import { Sparkles, Zap, Info, Frown } from 'lucide-react';

interface MoodHeaderProps {
  cancerDetected: boolean;
  stage: string;
}

export function MoodHeader({ cancerDetected, stage }: MoodHeaderProps) {
  const getMoodStyling = (): void => {
    if (!cancerDetected) {
      return {
        celebrationIcon: <Sparkles className="h-12 w-12 text-green-500 animate-bounce" />,
        celebrationText: "🎉 Excellent Health Status! 🎉",
      };
    }
    
    if (stage === 'I') {
      return {
        celebrationIcon: <Zap className="h-8 w-8 text-yellow-500" />,
        celebrationText: "Early Detection - Good Prognosis",
      };
    } else if (stage === 'II') {
      return {
        celebrationIcon: <Info className="h-8 w-8 text-orange-500" />,
        celebrationText: "Treatment Required - Stay Strong",
      };
    } else {
      return {
        celebrationIcon: <Frown className="h-8 w-8 text-red-500" />,
        celebrationText: "Comprehensive Care Needed",
      };
    }
  };

  const moodStyling = getMoodStyling();

  return (
    <div className="text-center py-6">
      <div className="flex justify-center mb-4">
        {moodStyling.celebrationIcon}
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        {moodStyling.celebrationText}
      </h2>
      {!cancerDetected && (
        <div className="text-6xl animate-bounce">
          😊🌟✨
        </div>
      )}
    </div>
  );
}
