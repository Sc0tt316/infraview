
import React from 'react';
import { RefreshCw } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-12">
      <RefreshCw className="h-8 w-8 animate-spin text-primary/70" />
    </div>
  );
};

export default LoadingSpinner;
