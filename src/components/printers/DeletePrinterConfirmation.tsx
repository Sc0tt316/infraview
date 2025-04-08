
import React from 'react';
import { DialogFooter, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PrinterData } from '@/services/printerService';
import { AlertCircle, Printer } from 'lucide-react';

interface DeletePrinterConfirmationProps {
  printer: PrinterData | null;
  onDelete: () => void;
  onCancel: () => void;
}

const DeletePrinterConfirmation: React.FC<DeletePrinterConfirmationProps> = ({
  printer,
  onDelete,
  onCancel
}) => {
  if (!printer) return null;
  
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle className="text-destructive flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Delete Printer
        </DialogTitle>
        <DialogDescription>
          This action cannot be undone. The printer will be permanently removed from your system.
        </DialogDescription>
      </DialogHeader>
      <div className="py-4 border-y my-4">
        <p className="font-medium mb-2">Are you sure you want to delete:</p>
        <div className="flex items-center gap-3 p-3 bg-muted rounded-md">
          <Printer className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-semibold">{printer.name}</p>
            <p className="text-sm text-muted-foreground">{printer.model} • {printer.location}</p>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button variant="destructive" onClick={onDelete}>Delete Printer</Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default DeletePrinterConfirmation;
