
import React, { useState } from 'react';
import { useServers } from '@/hooks/useServers';
import { useAuth } from '@/context/AuthContext';
import { ServerData } from '@/types/servers';
import { serverService } from '@/services/server';
import { hasPermission } from '@/utils/permissions';
import ServersHeader from '@/components/servers/ServersHeader';
import ServersContent from '@/components/servers/ServersContent';
import AddServerDialog from '@/components/servers/AddServerDialog';
import EditServerDialog from '@/components/servers/EditServerDialog';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Servers = () => {
  const { user } = useAuth();
  const canManageServers = hasPermission(user, 'manage_servers');
  const canAddServers = hasPermission(user, 'add_servers');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [serverToDelete, setServerToDelete] = useState<string | null>(null);
  const [serverToEdit, setServerToEdit] = useState<ServerData | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
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
      setShowAddDialog(false);
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
    
    setServerToDelete(serverId);
  };

  const confirmDeleteServer = async () => {
    if (!serverToDelete) return;
    
    const success = await serverService.removeServer(serverToDelete);
    if (success) {
      await refetchServers();
      toast({
        title: "Success",
        description: "Server has been deleted successfully."
      });
    }
    setServerToDelete(null);
  };

  const handleEditServer = (server: ServerData) => {
    if (!canManageServers) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to edit servers.",
        variant: "destructive"
      });
      return;
    }
    
    setServerToEdit(server);
  };

  const handleUpdateServer = async (serverData: ServerData) => {
    if (!serverToEdit) return;
    
    const success = await serverService.updateServer(serverToEdit.id, serverData);
    if (success) {
      await refetchServers();
      toast({
        title: "Success",
        description: "Server has been updated successfully."
      });
    }
    setServerToEdit(null);
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
        isAdmin={canManageServers}
        onRefresh={handleRefresh}
        onAddServer={() => setShowAddDialog(true)}
      />

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
        onEditServer={canManageServers ? handleEditServer : undefined}
        onRefreshServer={canManageServers ? handleRefreshServer : undefined}
      />

      {/* Add Server Dialog */}
      {showAddDialog && (
        <AddServerDialog 
          onAddServer={handleAddServer} 
          onClose={() => setShowAddDialog(false)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!serverToDelete} onOpenChange={() => setServerToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Server</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this server? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteServer} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Server Dialog */}
      {serverToEdit && (
        <EditServerDialog
          server={serverToEdit}
          onUpdateServer={handleUpdateServer}
          onClose={() => setServerToEdit(null)}
        />
      )}
    </div>
  );
};

export default Servers;
