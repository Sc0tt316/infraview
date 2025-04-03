
import React from 'react';
import { Button } from "@/components/ui/button";
import { Search, Plus } from 'lucide-react';

interface EmptyPrinterStateProps {
  onAddPrinter: () => void;
}

const EmptyPrinterState: React.FC<EmptyPrinterStateProps> = ({ onAddPrinter }) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <Search className="h-10 w-10 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium">No printers found</h3>
      <p className="text-muted-foreground mt-1 max-w-md">
        We couldn't find any printers matching your search criteria. Try adjusting your filters or add a new printer.
      </p>
      <Button className="mt-4" onClick={onAddPrinter}>
        <Plus className="w-4 h-4 mr-2" />
        Add Printer
      </Button>
    </div>
  );
};

export default EmptyPrinterState;
