
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { PrinterData } from '@/types/printers';
import PrinterFilters from './PrinterFilters';
import EnhancedPrinterCard from './EnhancedPrinterCard';
import EmptyPrinterState from './EmptyPrinterState';

interface PrintersContentProps {
  isLoading: boolean;
  filteredPrinters: PrinterData[];
  departmentFilter: string;
  setDepartmentFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  isAdmin: boolean;
  onAddPrinter: () => void;
  onPrinterClick: (printer: PrinterData) => void;
  onEditPrinter: (printer: PrinterData) => void;
  onDeletePrinter: (printer: PrinterData) => void;
}

const PrintersContent: React.FC<PrintersContentProps> = ({
  isLoading,
  filteredPrinters,
  departmentFilter,
  setDepartmentFilter,
  statusFilter,
  setStatusFilter,
  searchQuery,
  setSearchQuery,
  isAdmin,
  onAddPrinter,
  onPrinterClick,
  onEditPrinter,
  onDeletePrinter
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading printers...</p>
        </div>
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

      {filteredPrinters.length === 0 ? (
        <EmptyPrinterState 
          isAdmin={isAdmin}
          onAddPrinter={onAddPrinter}
          hasNoResults={searchQuery.length > 0 || departmentFilter !== 'all' || statusFilter !== 'all'}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPrinters.map((printer) => (
            <EnhancedPrinterCard
              key={printer.id}
              printer={printer}
              onOpenDetails={() => onPrinterClick(printer)}
              onOpenEdit={() => onEditPrinter(printer)}
              onOpenDelete={() => onDeletePrinter(printer)}
              isAdmin={isAdmin}
              showOwnDeleteDialog={false}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PrintersContent;
