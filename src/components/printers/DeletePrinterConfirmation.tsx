
import React from 'react';
import { Button } from "@/components/ui/button";
import { AlertCircle } from 'lucide-react';
import { PrinterData } from '@/types/printers';

interface DeletePrinterConfirmationProps {
  printer: PrinterData | null;
  loading?: boolean;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

const DeletePrinterConfirmation: React.FC<DeletePrinterConfirmationProps> = ({
  printer,
  loading = false,
  onConfirm,
  onCancel
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start gap-2">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <h4 className="font-medium text-lg">Delete Printer</h4>
        </div>
        <p className="text-muted-foreground">
          Are you sure you want to delete this printer? This action cannot be undone.
        </p>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={onConfirm} disabled={loading}>
          {loading ? 'Deleting...' : 'Delete Printer'}
        </Button>
      </div>
    </div>
  );
};

export default DeletePrinterConfirmation;
