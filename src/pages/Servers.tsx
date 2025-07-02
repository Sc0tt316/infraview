
import React, { useState } from 'react';
import { useServers } from '@/hooks/useServers';
import { useAuth } from '@/context/AuthContext';
import { ServerData } from '@/types/servers';
import ServersHeader from '@/components/servers/ServersHeader';
import ServersContent from '@/components/servers/ServersContent';

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

  const handleAddServer = () => {
    console.log('Add server clicked');
    // TODO: Implement add server functionality
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
      <ServersHeader
        isLoading={isLoading}
        isRefreshing={isRefreshing}
        isAdmin={isAdmin || false}
        onRefresh={handleRefresh}
        onAddServer={handleAddServer}
      />

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
      />
    </div>
  );
};

export default Servers;
