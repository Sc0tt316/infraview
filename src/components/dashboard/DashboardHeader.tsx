
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface DashboardHeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onRefresh, isLoading }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your printing system
        </p>
      </div>
      
      <Button
        variant="outline"
        size="icon"
        onClick={onRefresh}
        disabled={isLoading}
      >
        <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
      </Button>
    </div>
  );
};

export default DashboardHeader;
