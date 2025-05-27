
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EnhancedPrinterCard from './EnhancedPrinterCard';
import PrinterFilters from './PrinterFilters';
import EmptyPrinterState from './EmptyPrinterState';
import { PrinterData } from '@/types/printers';

interface PrintersContentProps {
  isLoading: boolean;
  filteredPrinters: PrinterData[];
  departmentFilter: string;
  setDepartmentFilter: (dept: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
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
      <div className="flex justify-center py-8">
        <RefreshCw className="h-8 w-8 animate-spin text-primary/70" />
      </div>
    );
  }

  return (
    <>
      {/* Filters */}
      <Card className="border border-border">
        <CardHeader className="pb-3">
          <CardTitle>All Printers</CardTitle>
        </CardHeader>
        <CardContent>
          <PrinterFilters
            departmentFilter={departmentFilter}
            setDepartmentFilter={setDepartmentFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </CardContent>
      </Card>

      {filteredPrinters.length === 0 ? (
        <EmptyPrinterState 
          onAddPrinter={onAddPrinter}
          isAdmin={isAdmin}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrinters.map((printer) => (
            <EnhancedPrinterCard
              key={printer.id}
              printer={printer}
              onOpenDetails={(id) => onPrinterClick(printer)}
              onOpenEdit={() => onEditPrinter(printer)}
              onOpenDelete={() => onDeletePrinter(printer)}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default PrintersContent;
