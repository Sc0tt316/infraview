
import React from 'react';
import { PrinterData } from '@/types/printers';
import PrinterCard from '@/components/printers/PrinterCard';
import EmptyPrinterState from '@/components/printers/EmptyPrinterState';
import { RefreshCw } from 'lucide-react';

interface PrintersContentProps {
  filteredPrinters: PrinterData[];
  isLoading: boolean;
  isGridView: boolean;
  onEdit: (printerId: string) => void;
  onDelete: (printerId: string) => void;
  onAdd: () => void;
}

const PrintersContent: React.FC<PrintersContentProps> = ({
  filteredPrinters,
  isLoading,
  isGridView,
  onEdit,
  onDelete,
  onAdd
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-primary/70" />
      </div>
    );
  }

  if (filteredPrinters.length === 0) {
    return <EmptyPrinterState onAddPrinter={onAdd} />;
  }

  return (
    <div className={isGridView ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
      {filteredPrinters.map(printer => (
        <PrinterCard
          key={printer.id}
          printer={printer}
          isGridView={isGridView}
          onOpenEdit={() => onEdit(printer.id)}
          onOpenDelete={() => onDelete(printer.id)}
          onOpenDetails={() => {}}
          onRestart={() => {}}
          isAdmin={true}
        />
      ))}
    </div>
  );
};

export default PrintersContent;
