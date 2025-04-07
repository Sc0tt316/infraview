
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ActivityFiltersProps {
  searchQuery: string;
  filterType: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onSortOrderChange: (value: 'asc' | 'desc') => void;
}

const ActivityFilters: React.FC<ActivityFiltersProps> = ({
  searchQuery,
  filterType,
  sortBy,
  sortOrder,
  onSearchChange,
  onFilterChange,
  onSortChange,
  onSortOrderChange
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search logs..."
            className="pl-8 w-full sm:w-[200px] md:w-[250px]"
            value={searchQuery}
            onChange={onSearchChange}
          />
        </div>
        <Select value={filterType} onValueChange={onFilterChange}>
          <SelectTrigger className="w-full sm:w-[130px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="error">Error</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="info">Info</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="timestamp">Date & Time</SelectItem>
            <SelectItem value="entityType">Entity Type</SelectItem>
            <SelectItem value="type">Status</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortOrder} onValueChange={onSortOrderChange}>
          <SelectTrigger className="w-full sm:w-[120px]">
            <SelectValue placeholder="Order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Ascending</SelectItem>
            <SelectItem value="desc">Descending</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ActivityFilters;
