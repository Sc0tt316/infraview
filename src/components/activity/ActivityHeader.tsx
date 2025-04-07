
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActivityHeaderProps {
  onRefresh: () => void;
}

const ActivityHeader: React.FC<ActivityHeaderProps> = ({ onRefresh }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">Activity Log</h1>
        <p className="text-muted-foreground">View recent printer system activities</p>
      </div>
      <Button variant="outline" size="icon" onClick={onRefresh}>
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ActivityHeader;
