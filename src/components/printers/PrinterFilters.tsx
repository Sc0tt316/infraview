
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';

interface PrinterFiltersProps {
  searchTerm: string;
  statusFilter: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStatusFilterChange: (status: string) => void;
}

const PrinterFilters: React.FC<PrinterFiltersProps> = ({
  searchTerm,
  statusFilter,
  onSearchChange,
  onStatusFilterChange
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search printers..."
          value={searchTerm}
          onChange={onSearchChange}
          className="pl-9 w-full"
        />
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant={statusFilter === 'all' ? 'default' : 'outline'} 
          onClick={() => onStatusFilterChange('all')}
          size="sm"
        >
          All
        </Button>
        <Button 
          variant={statusFilter === 'online' ? 'default' : 'outline'} 
          onClick={() => onStatusFilterChange('online')}
          className={statusFilter === 'online' ? 'bg-green-600 hover:bg-green-700' : ''}
          size="sm"
        >
          Online
        </Button>
        <Button 
          variant={statusFilter === 'offline' ? 'default' : 'outline'} 
          onClick={() => onStatusFilterChange('offline')}
          className={statusFilter === 'offline' ? 'bg-gray-600 hover:bg-gray-700' : ''}
          size="sm"
        >
          Offline
        </Button>
        <Button 
          variant={statusFilter === 'error' ? 'default' : 'outline'} 
          onClick={() => onStatusFilterChange('error')}
          className={statusFilter === 'error' ? 'bg-red-600 hover:bg-red-700' : ''}
          size="sm"
        >
          Error
        </Button>
      </div>
    </div>
  );
};

export default PrinterFilters;
