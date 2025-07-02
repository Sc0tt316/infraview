
import React from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ServersHeaderProps {
  onAddServer: () => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

const ServersHeader: React.FC<ServersHeaderProps> = ({
  onAddServer,
  onRefresh,
  isLoading = false
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
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        <Button onClick={onAddServer}>
          <Plus className="h-4 w-4 mr-2" />
          Add Server
        </Button>
      </div>
    </div>
  );
};

export default ServersHeader;
