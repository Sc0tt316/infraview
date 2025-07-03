
import React from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ServersHeaderProps {
  onAddServer: () => void;
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
        <h1 className="text-3xl font-bold tracking-tight">Servers</h1>
        <p className="text-muted-foreground">
          Monitor and manage your server infrastructure
        </p>
      </div>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading || isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        {isAdmin && (
          <Button onClick={onAddServer}>
            <Plus className="h-4 w-4 mr-2" />
            Add Server
          </Button>
        )}
      </div>
    </div>
  );
};

export default ServersHeader;
