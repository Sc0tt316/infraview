
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PrinterFiltersProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  departmentFilter: string;
  onDepartmentFilterChange: (value: string) => void;
}

const PrinterFilters: React.FC<PrinterFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  departmentFilter,
  onDepartmentFilterChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search printers..."
          className="pl-8"
          value={searchTerm}
          onChange={onSearchChange}
        />
      </div>

      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger>
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="online">Online</SelectItem>
          <SelectItem value="offline">Offline</SelectItem>
          <SelectItem value="error">Error</SelectItem>
          <SelectItem value="maintenance">Maintenance</SelectItem>
          <SelectItem value="warning">Warning</SelectItem>
        </SelectContent>
      </Select>

      <Select value={departmentFilter} onValueChange={onDepartmentFilterChange}>
        <SelectTrigger>
          <SelectValue placeholder="Filter by department" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Departments</SelectItem>
          <SelectItem value="Marketing">Marketing</SelectItem>
          <SelectItem value="Sales">Sales</SelectItem>
          <SelectItem value="Engineering">Engineering</SelectItem>
          <SelectItem value="HR">Human Resources</SelectItem>
          <SelectItem value="Finance">Finance</SelectItem>
          <SelectItem value="IT">IT Department</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default PrinterFilters;
