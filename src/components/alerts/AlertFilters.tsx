
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { AlertFilter, AlertSeverity } from '@/types/alerts';

interface AlertFiltersProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  statusFilter: AlertFilter;
  onStatusFilterChange: (status: AlertFilter) => void;
  severityFilter: AlertSeverity | 'all';
  onSeverityFilterChange: (severity: AlertSeverity | 'all') => void;
}

const AlertFilters: React.FC<AlertFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  severityFilter,
  onSeverityFilterChange
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 pb-4">
      <div className="relative flex-grow">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search alerts..."
          className="pl-8"
          value={searchTerm}
          onChange={onSearchChange}
        />
      </div>
      
      <div className="flex gap-2">
        <select
          className="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value as AlertFilter)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="resolved">Resolved</option>
        </select>
        
        <select
          className="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={severityFilter}
          onChange={(e) => onSeverityFilterChange(e.target.value as AlertSeverity | 'all')}
        >
          <option value="all">All Severity</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>
    </div>
  );
};

export default AlertFilters;
