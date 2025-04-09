
import React from 'react';
import { Check, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AlertsHeaderProps {
  onRefresh: () => void;
  onResolveAll: () => void;
  onClearResolved: () => void;
  isLoading: boolean;
}

const AlertsHeader: React.FC<AlertsHeaderProps> = ({ 
  onRefresh, 
  onResolveAll, 
  onClearResolved, 
  isLoading 
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">Alerts</h1>
        <p className="text-muted-foreground mt-1">
          View and manage system alerts
        </p>
      </div>
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onResolveAll}
          disabled={isLoading}
        >
          <Check className="h-4 w-4 mr-1" />
          Resolve All
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onClearResolved}
          disabled={isLoading}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Clear Resolved
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
    </div>
  );
};

export default AlertsHeader;
