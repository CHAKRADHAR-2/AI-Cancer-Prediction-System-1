import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2, Database } from 'lucide-react';

interface AIMLStatusProps {
  className?: string;
}

export function AIMLStatus({ className }: AIMLStatusProps) {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [usesDatasets, setUsesDatasets] = useState<boolean>(false);

  const checkAIMLStatus = async (): Promise<void> => {
    try {
      const response = await fetch('http://localhost:5000/api/health', {
        method: 'GET'
      });
      
      if (response.ok) {
        const result = await response.json();
        setStatus(result.status === 'healthy' ? 'connected' : 'disconnected');
        setUsesDatasets(result.uses_real_datasets || false);
      } else {
        setStatus('disconnected');
        setUsesDatasets(false);
      }
    } catch (error) {
      setStatus('disconnected');
      setUsesDatasets(false);
    }
    setLastCheck(new Date());
  };

  useEffect(() => {
    checkAIMLStatus();
    
    const interval = setInterval(checkAIMLStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusConfig = () => {
    switch (status) {
      case 'checking':
        return {
          icon: <Loader2 className="h-3 w-3 animate-spin" />,
          text: 'Checking AI-ML System...',
          variant: 'secondary' as const
        };
      case 'connected':
        return {
          icon: usesDatasets ? <Database className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />,
          text: usesDatasets ? 'Dataset-Enhanced AI Online' : 'AI-ML System Online',
          variant: 'default' as const
        };
      case 'disconnected':
        return {
          icon: <XCircle className="h-3 w-3" />,
          text: 'AI-ML System Offline',
          variant: 'destructive' as const
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Badge variant={config.variant} className="flex items-center space-x-1">
        {config.icon}
        <span className="text-xs">{config.text}</span>
      </Badge>
      {usesDatasets && status === 'connected' && (
        <Badge variant="outline" className="text-xs">
          📊 Real Datasets
        </Badge>
      )}
    </div>
  );
}