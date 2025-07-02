
import React from 'react';
import { RefreshCw, Server } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ServersHeaderProps {
  isLoading: boolean;
  isRefreshing: boolean;
  isAdmin: boolean;
  onRefresh: () => void;
  onAddServer: () => void;
}

const ServersHeader: React.FC<ServersHeaderProps> = ({
  isLoading,
  isRefreshing,
  isAdmin,
  onRefresh,
  onAddServer
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-3">
        <Server className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Servers</h1>
          <p className="text-muted-foreground">Monitor and manage your server infrastructure</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onRefresh} 
          disabled={isLoading || isRefreshing}
          title="Refresh server status"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
        </Button>
        
        {isAdmin && (
          <Button onClick={onAddServer}>
            Add Server
          </Button>
        )}
      </div>
    </div>
  );
};

export default ServersHeader;
