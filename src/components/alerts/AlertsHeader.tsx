
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AlertsHeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
}

const AlertsHeader: React.FC<AlertsHeaderProps> = ({ onRefresh, isLoading }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">Alerts</h1>
        <p className="text-muted-foreground mt-1">
          View and manage system alerts
        </p>
      </div>
      <Button 
        variant="outline" 
        size="icon"
        onClick={onRefresh}
        disabled={isLoading}
      >
        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
      </Button>
    </div>
  );
};

export default AlertsHeader;
