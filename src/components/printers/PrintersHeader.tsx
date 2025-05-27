
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PrintersHeaderProps {
  isLoading: boolean;
  isRefreshing: boolean;
  isAdmin: boolean;
  onRefresh: () => void;
  onAddPrinter: () => void;
}

const PrintersHeader: React.FC<PrintersHeaderProps> = ({
  isLoading,
  isRefreshing,
  isAdmin,
  onRefresh,
  onAddPrinter
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-xl font-semibold">Printers</h1>
        <p className="text-muted-foreground">View and manage your organization's printers</p>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onRefresh} 
          disabled={isLoading || isRefreshing}
          title="Update all printers via SNMP"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
        </Button>
        
        {isAdmin && (
          <Button onClick={onAddPrinter}>
            Add Printer
          </Button>
        )}
      </div>
    </div>
  );
};

export default PrintersHeader;
