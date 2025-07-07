
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ServersHeaderProps {
  onAddServer?: () => void;
  onRefresh: () => void;
  isLoading?: boolean;
  isRefreshing?: boolean;
  isAdmin?: boolean;
}

const ServersHeader: React.FC<ServersHeaderProps> = ({
  onAddServer,
  onRefresh,
  isLoading = false,
  isRefreshing = false,
  isAdmin = false
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        
        
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" onClick={onRefresh} disabled={isLoading || isRefreshing}>
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
        {isAdmin && onAddServer && (
          <Button onClick={onAddServer}>
            Add Server
          </Button>
        )}
      </div>
    </div>
  );
};

export default ServersHeader;
