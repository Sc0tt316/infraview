
import React from 'react';
import { RefreshCw } from 'lucide-react';

interface LoadingSpinnerProps {
  message: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <RefreshCw className="h-8 w-8 animate-spin text-primary/70 mb-4" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
