
import React from 'react';
import { ServerData } from '@/types/servers';
import { ServerCard } from '@/components/ui/server-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface ServersContentProps {
  isLoading: boolean;
  filteredServers: ServerData[];
  searchQuery: string;
  selectedDepartment: string;
  selectedStatus: string;
  isAdmin: boolean;
  onServerClick: (server: ServerData) => void;
  setSearchQuery: (query: string) => void;
  departmentFilter: string;
  setDepartmentFilter: (department: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}

const ServersContent: React.FC<ServersContentProps> = ({
  isLoading,
  filteredServers,
  searchQuery,
  selectedDepartment,
  selectedStatus,
  isAdmin,
  onServerClick,
  setSearchQuery,
  departmentFilter,
  setDepartmentFilter,
  statusFilter,
  setStatusFilter
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search servers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="IT">IT</SelectItem>
            <SelectItem value="Development">Development</SelectItem>
            <SelectItem value="Operations">Operations</SelectItem>
            <SelectItem value="Security">Security</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="error">Error</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Server Grid */}
      {filteredServers.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground">No servers found matching your criteria</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServers.map((server) => (
            <ServerCard
              key={server.id}
              server={server}
              onOpenDetails={() => onServerClick(server)}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ServersContent;
