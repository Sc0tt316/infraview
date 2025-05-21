
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';

interface PrinterFiltersProps {
  searchTerm?: string;
  statusFilter?: string;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStatusFilterChange?: (status: string) => void;
  // Add the new props from Printers.tsx
  departmentFilter?: string;
  setDepartmentFilter?: React.Dispatch<React.SetStateAction<string>>;
  searchQuery?: string;
  setSearchQuery?: React.Dispatch<React.SetStateAction<string>>;
  setStatusFilter?: React.Dispatch<React.SetStateAction<string>>;
}

const PrinterFilters: React.FC<PrinterFiltersProps> = ({
  searchTerm,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
  // Add new props
  departmentFilter = 'all',
  setDepartmentFilter,
  searchQuery = '',
  setSearchQuery,
  setStatusFilter
}) => {
  // Handle either the old or new props pattern
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (setSearchQuery) {
      setSearchQuery(e.target.value);
    } else if (onSearchChange) {
      onSearchChange(e);
    }
  };

  const handleStatusFilterChange = (status: string) => {
    if (setStatusFilter) {
      setStatusFilter(status);
    } else if (onStatusFilterChange) {
      onStatusFilterChange(status);
    }
  };

  const currentSearchValue = searchQuery !== undefined ? searchQuery : searchTerm;
  const currentStatusFilter = statusFilter || 'all';

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search printers..."
          value={currentSearchValue}
          onChange={handleSearchChange}
          className="pl-9 w-full"
        />
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant={currentStatusFilter === 'all' ? 'default' : 'outline'} 
          onClick={() => handleStatusFilterChange('all')}
          size="sm"
        >
          All
        </Button>
        <Button 
          variant={currentStatusFilter === 'online' ? 'default' : 'outline'} 
          onClick={() => handleStatusFilterChange('online')}
          className={currentStatusFilter === 'online' ? 'bg-green-600 hover:bg-green-700' : ''}
          size="sm"
        >
          Online
        </Button>
        <Button 
          variant={currentStatusFilter === 'offline' ? 'default' : 'outline'} 
          onClick={() => handleStatusFilterChange('offline')}
          className={currentStatusFilter === 'offline' ? 'bg-gray-600 hover:bg-gray-700' : ''}
          size="sm"
        >
          Offline
        </Button>
        <Button 
          variant={currentStatusFilter === 'error' ? 'default' : 'outline'} 
          onClick={() => handleStatusFilterChange('error')}
          className={currentStatusFilter === 'error' ? 'bg-red-600 hover:bg-red-700' : ''}
          size="sm"
        >
          Error
        </Button>
      </div>
    </div>
  );
};

export default PrinterFilters;
