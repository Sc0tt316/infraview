
import React, { useState } from 'react';
import { useServers } from '@/hooks/useServers';
import { useAuth } from '@/context/AuthContext';
import { ServerData } from '@/types/servers';
import { serverService } from '@/services/server';
import ServersHeader from '@/components/servers/ServersHeader';
import ServersContent from '@/components/servers/ServersContent';
import AddServerDialog from '@/components/servers/AddServerDialog';

const Servers = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);
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
    const addedServer = await serverService.addServer(serverData);
    if (addedServer) {
      await refetchServers();
    }
  };

  const handleRemoveServer = async (serverId: string) => {
    const success = await serverService.removeServer(serverId);
    if (success) {
      await refetchServers();
    }
    console.log('Server removed:', serverId);
  };

  const handleRefreshServer = async (serverId: string) => {
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
            isAdmin={false}
            onRefresh={handleRefresh}
            onAddServer={() => {}}
          />
          {isAdmin && <AddServerDialog onAddServer={handleAddServer} />}
        </div>
      </div>

      <ServersContent
        isLoading={isLoading}
        filteredServers={filteredServers}
        searchQuery={searchQuery}
        selectedDepartment={departmentFilter}
        selectedStatus={statusFilter}
        isAdmin={isAdmin || false}
        onServerClick={handleServerClick}
        setSearchQuery={setSearchQuery}
        departmentFilter={departmentFilter}
        setDepartmentFilter={setDepartmentFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onRemoveServer={handleRemoveServer}
        onRefreshServer={handleRefreshServer}
      />
    </div>
  );
};

export default Servers;
