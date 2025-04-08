
import React from 'react';
import { Button } from "@/components/ui/button";
import { Printer, Plus, RefreshCw } from 'lucide-react';

interface EmptyPrinterStateProps {
  onAddPrinter: () => void;
  isAdmin?: boolean;
}

const EmptyPrinterState: React.FC<EmptyPrinterStateProps> = ({ onAddPrinter, isAdmin = false }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 border rounded-lg bg-muted/10">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-6">
        <Printer className="h-10 w-10 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No printers found</h3>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        {isAdmin 
          ? "Your printer management system doesn't have any printers added yet. Add your first printer to start managing your fleet."
          : "No printers match your search criteria or no printers have been added to the system yet."}
      </p>
      {isAdmin ? (
        <Button onClick={onAddPrinter}>
          <Plus className="mr-2 h-4 w-4" />
          Add Your First Printer
        </Button>
      ) : (
        <Button variant="outline" onClick={() => window.location.reload()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      )}
    </div>
  );
};

export default EmptyPrinterState;
