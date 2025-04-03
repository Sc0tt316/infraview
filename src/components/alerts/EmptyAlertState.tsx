
import React from 'react';
import { AlertCircle } from 'lucide-react';

const EmptyAlertState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
        <AlertCircle className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium">No alerts found</h3>
      <p className="text-muted-foreground mt-1 max-w-md">
        There are no alerts matching your search criteria. Try adjusting your filters.
      </p>
    </div>
  );
};

export default EmptyAlertState;
