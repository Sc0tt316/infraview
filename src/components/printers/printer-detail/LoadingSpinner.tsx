
import React from 'react';
import { RefreshCw } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <RefreshCw className="animate-spin h-8 w-8 text-primary/70" />
    </div>
  );
};

export default LoadingSpinner;
