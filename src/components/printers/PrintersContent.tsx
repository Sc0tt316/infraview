
import React from 'react';
import { PrinterData } from '@/types/printers';
import EnhancedPrinterCard from './EnhancedPrinterCard';
import EmptyPrinterState from './EmptyPrinterState';
import PrinterFilters from './PrinterFilters';

interface PrintersContentProps {
  filteredPrinters: PrinterData[];
  searchQuery: string;
  selectedDepartment: string;
  selectedStatus: string;
  isLoading: boolean;
  onPrinterSelect: (printer: PrinterData) => void;
  onEditPrinter: (printer: PrinterData) => void;
  onDeletePrinter: (printer: PrinterData) => void;
  isAdmin: boolean;
  departmentFilter: string;
  setDepartmentFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  setSearchQuery: (value: string) => void;
  onAddPrinter: () => void;
  onPrinterClick: (printer: PrinterData) => void;
}

const PrintersContent: React.FC<PrintersContentProps> = ({
  filteredPrinters,
  searchQuery,
  selectedDepartment,
  selectedStatus,
  isLoading,
  onPrinterSelect,
  onEditPrinter,
  onDeletePrinter,
  isAdmin,
  departmentFilter,
  setDepartmentFilter,
  statusFilter,
  setStatusFilter,
  setSearchQuery,
  onAddPrinter,
  onPrinterClick
}) => {
  const hasActiveFilters = searchQuery || selectedDepartment !== 'all' || selectedStatus !== 'all';
  const hasNoResults = filteredPrinters.length === 0 && hasActiveFilters;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PrinterFilters
          departmentFilter={departmentFilter}
          setDepartmentFilter={setDepartmentFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-64 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (filteredPrinters.length === 0) {
    return (
      <div className="space-y-6">
        <PrinterFilters
          departmentFilter={departmentFilter}
          setDepartmentFilter={setDepartmentFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <EmptyPrinterState 
          isAdmin={isAdmin}
          onAddPrinter={onAddPrinter}
          hasNoResults={hasNoResults}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PrinterFilters
        departmentFilter={departmentFilter}
        setDepartmentFilter={setDepartmentFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredPrinters.map((printer) => (
          <EnhancedPrinterCard
            key={printer.id}
            printer={printer}
            onViewDetails={() => onPrinterClick(printer)}
            onEdit={() => onEditPrinter(printer)}
            onDelete={() => onDeletePrinter(printer)}
            isAdmin={isAdmin}
          />
        ))}
      </div>
    </div>
  );
};

export default PrintersContent;
