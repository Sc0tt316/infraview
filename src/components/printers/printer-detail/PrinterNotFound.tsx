
import React from 'react';
import { AlertTriangle } from 'lucide-react';

const PrinterNotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
      <h3 className="text-lg font-medium">Printer Not Found</h3>
      <p className="text-muted-foreground mt-1">
        The requested printer information could not be found.
      </p>
    </div>
  );
};

export default PrinterNotFound;
