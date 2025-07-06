
import React, { useState } from 'react';
import { useServers } from '@/hooks/useServers';
import { useAuth } from '@/context/AuthContext';
import { ServerData } from '@/types/servers';
import { serverService } from '@/services/server';
import { hasPermission } from '@/utils/permissions';
import ServersHeader from '@/components/servers/ServersHeader';
import ServersContent from '@/components/servers/ServersContent';
import AddServerDialog from '@/components/servers/AddServerDialog';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { clearAndRegenerateServerData } from '@/services/server/serverDataGenerator';

const Servers = () => {
  const { user } = useAuth();
  const canManageServers = hasPermission(user, 'manage_servers');
  const canAddServers = hasPermission(user, 'add_servers');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const { servers, isLoading, refetchServers } = useServers();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetchServers();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleServerClick = (server: ServerData) => {
    console.log('Server clicked:', server);
    // TODO: Implement server detail modal or navigation
  };

  const handleAddServer = async (serverData: ServerData) => {
    if (!canAddServers) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to add servers.",
        variant: "destructive"
      });
      return;
    }
    
    const addedServer = await serverService.addServer(serverData);
    if (addedServer) {
      await refetchServers();
    }
  };

  const handleRemoveServer = async (serverId: string) => {
    if (!hasPermission(user, 'delete_servers')) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to delete servers.",
        variant: "destructive"
      });
      return;
    }
    
    const success = await serverService.removeServer(serverId);
    if (success) {
      await refetchServers();
    }
    console.log('Server removed:', serverId);
  };

  const handleRefreshServer = async (serverId: string) => {
    if (!canManageServers) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to manage servers.",
        variant: "destructive"
      });
      return;
    }
    
    // Simulate refreshing server data with random usage values
    const updates = {
      cpuUsage: Math.floor(Math.random() * 100),
      memoryUsage: Math.floor(Math.random() * 100),
      diskUsage: Math.floor(Math.random() * 100),
      lastActive: new Date().toISOString()
    };
    
    const success = await serverService.updateServer(serverId, updates);
    if (success) {
      await refetchServers();
    }
    console.log('Server refreshed:', serverId);
  };

  const handleRegenerateData = async () => {
    if (!hasPermission(user, 'manage_servers')) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to regenerate server data.",
        variant: "destructive"
      });
      return;
    }
    
    setIsRegenerating(true);
    try {
      const success = await clearAndRegenerateServerData();
      if (success) {
        await refetchServers();
        toast({
          title: "Success",
          description: "Server data has been regenerated successfully."
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to regenerate server data.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error regenerating server data:', error);
      toast({
        title: "Error",
        description: "Failed to regenerate server data.",
        variant: "destructive"
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  // Apply filters
  const filteredServers = servers.filter(server => {
    // Department filter
    if (departmentFilter !== 'all' && server.department !== departmentFilter) {
      return false;
    }

    // Status filter
    if (statusFilter !== 'all' && server.status !== statusFilter) {
      return false;
    }

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        server.name.toLowerCase().includes(query) ||
        server.hostname.toLowerCase().includes(query) ||
        server.serverType.toLowerCase().includes(query) ||
        server.location.toLowerCase().includes(query) ||
        (server.department && server.department.toLowerCase().includes(query))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div></div>
        <div className="flex space-x-2">
          <ServersHeader
            isLoading={isLoading}
            isRefreshing={isRefreshing}
            isAdmin={canManageServers}
            onRefresh={handleRefresh}
            onAddServer={() => {}}
          />
          {canManageServers && (
            <>
              <Button 
                variant="outline" 
                onClick={handleRegenerateData}
                disabled={isRegenerating}
              >
                <RotateCcw className={`h-4 w-4 mr-2 ${isRegenerating ? 'animate-spin' : ''}`} />
                Regenerate Data
              </Button>
              <AddServerDialog onAddServer={handleAddServer} />
            </>
          )}
        </div>
      </div>

      <ServersContent
        isLoading={isLoading}
        filteredServers={filteredServers}
        searchQuery={searchQuery}
        selectedDepartment={departmentFilter}
        selectedStatus={statusFilter}
        isAdmin={canManageServers}
        onServerClick={handleServerClick}
        setSearchQuery={setSearchQuery}
        departmentFilter={departmentFilter}
        setDepartmentFilter={setDepartmentFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onRemoveServer={canManageServers ? handleRemoveServer : undefined}
        onRefreshServer={canManageServers ? handleRefreshServer : undefined}
      />
    </div>
  );
};

export default Servers;
