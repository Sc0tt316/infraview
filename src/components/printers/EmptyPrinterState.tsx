
import React from 'react';
import { Button } from "@/components/ui/button";
import { Printer, PlusCircle } from 'lucide-react';

interface EmptyPrinterStateProps {
  onAddPrinter: () => void;
}

const EmptyPrinterState: React.FC<EmptyPrinterStateProps> = ({ onAddPrinter }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 border rounded-lg bg-muted/20">
      <div className="bg-primary/10 p-4 rounded-full mb-4">
        <Printer className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-lg font-medium mb-2">No printers found</h3>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        You haven't added any printers yet. Get started by adding your first printer.
      </p>
      <Button onClick={onAddPrinter}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Your First Printer
      </Button>
    </div>
  );
};

export default EmptyPrinterState;
