
import React, { useState } from 'react';
import { useServers } from '@/hooks/useServers';
import { useAuth } from '@/context/AuthContext';
import { ServerData } from '@/types/servers';
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
  const [localServers, setLocalServers] = useState<ServerData[]>([]);

  // Combine servers from hook with locally added servers
  const allServers = [...servers, ...localServers];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetchServers();
    setTimeout(() => setIsRefreshing(false), 1000);
  };
  
  const handleServerClick = (server: ServerData) => {
    console.log('Server clicked:', server);
    // TODO: Implement server detail modal or navigation
  };

  const handleAddServer = (serverData: ServerData) => {
    setLocalServers(prev => [...prev, serverData]);
  };

  const handleRemoveServer = (serverId: string) => {
    setLocalServers(prev => prev.filter(server => server.id !== serverId));
    console.log('Server removed:', serverId);
  };

  const handleRefreshServer = (serverId: string) => {
    console.log('Server refreshed:', serverId);
    // In a real implementation, this would refresh individual server data
  };

  // Apply filters
  const filteredServers = allServers.filter(server => {
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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Servers</h1>
          <p className="text-muted-foreground">
            Monitor and manage your server infrastructure
          </p>
        </div>
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
