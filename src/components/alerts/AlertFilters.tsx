
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertFilter, AlertSeverity } from '@/types/alerts';

interface AlertFiltersProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  statusFilter: AlertFilter;
  onStatusFilterChange: (status: AlertFilter) => void;
  severityFilter: AlertSeverity | 'all';
  onSeverityFilterChange: (severity: AlertSeverity | 'all') => void;
  relatedToFilter: 'all' | 'user' | 'printer';
  onRelatedToFilterChange: (relatedTo: 'all' | 'user' | 'printer') => void;
}

const AlertFilters: React.FC<AlertFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  severityFilter,
  onSeverityFilterChange,
  relatedToFilter,
  onRelatedToFilterChange
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search alerts..."
          className="pl-8"
          value={searchTerm}
          onChange={onSearchChange}
        />
      </div>
      
      <div>
        <Label htmlFor="statusFilter" className="sr-only">Filter by Status</Label>
        <Select
          value={statusFilter}
          onValueChange={(value: AlertFilter) => onStatusFilterChange(value)}
        >
          <SelectTrigger id="statusFilter" className="w-full">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="severityFilter" className="sr-only">Filter by Severity</Label>
        <Select
          value={severityFilter}
          onValueChange={(value: AlertSeverity | 'all') => onSeverityFilterChange(value)}
        >
          <SelectTrigger id="severityFilter" className="w-full">
            <SelectValue placeholder="Filter by Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="relatedToFilter" className="sr-only">Filter by Related To</Label>
        <Select
          value={relatedToFilter}
          onValueChange={(value: 'all' | 'user' | 'printer') => onRelatedToFilterChange(value)}
        >
          <SelectTrigger id="relatedToFilter" className="w-full">
            <SelectValue placeholder="Filter by Related To" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="printer">Printer Related</SelectItem>
            <SelectItem value="user">User Related</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default AlertFilters;
