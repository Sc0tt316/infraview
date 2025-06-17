
import React from 'react';
import { PrinterData } from '@/types/printers';
import EnhancedPrinterCard from './EnhancedPrinterCard';
import EmptyPrinterState from './EmptyPrinterState';

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
  isAdmin
}) => {
  const hasActiveFilters = searchQuery || selectedDepartment !== 'all' || selectedStatus !== 'all';
  const hasNoResults = filteredPrinters.length === 0 && hasActiveFilters;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="h-64 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (filteredPrinters.length === 0) {
    return (
      <EmptyPrinterState 
        isAdmin={isAdmin}
        onAddPrinter={() => {}}
        hasNoResults={hasNoResults}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredPrinters.map((printer) => (
        <EnhancedPrinterCard
          key={printer.id}
          printer={printer}
          onViewDetails={() => onPrinterSelect(printer)}
          onEdit={() => onEditPrinter(printer)}
          onDelete={() => onDeletePrinter(printer)}
          isAdmin={isAdmin}
        />
      ))}
    </div>
  );
};

export default PrintersContent;
