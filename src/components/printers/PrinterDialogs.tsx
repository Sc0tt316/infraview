
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import AddPrinterFormContainer from './AddPrinterFormContainer';
import PrinterDetailModal from './PrinterDetailModal';
import { PrinterData } from '@/types/printers';

interface PrinterDialogsProps {
  showAddPrinter: boolean;
  setShowAddPrinter: (show: boolean) => void;
  printerToEdit: PrinterData | null;
  setPrinterToEdit: (printer: PrinterData | null) => void;
  printerToDelete: PrinterData | null;
  setPrinterToDelete: (printer: PrinterData | null) => void;
  selectedPrinterId: string | null;
  setSelectedPrinterId: (id: string | null) => void;
  isAdmin: boolean;
  onConfirmDelete: () => void;
  onPrinterEditSuccess: () => void;
  onPrinterAddSuccess: () => void;
}

const PrinterDialogs: React.FC<PrinterDialogsProps> = ({
  showAddPrinter,
  setShowAddPrinter,
  printerToEdit,
  setPrinterToEdit,
  printerToDelete,
  setPrinterToDelete,
  selectedPrinterId,
  setSelectedPrinterId,
  isAdmin,
  onConfirmDelete,
  onPrinterEditSuccess,
  onPrinterAddSuccess
}) => {
  return (
    <>
      {/* Add Printer Dialog */}
      <Dialog open={showAddPrinter} onOpenChange={setShowAddPrinter}>
        <DialogContent className="sm:max-w-[600px]">
          {showAddPrinter && (
            <AddPrinterFormContainer 
              onCancel={() => setShowAddPrinter(false)} 
              onSuccess={onPrinterAddSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Edit Printer Dialog */}
      <Dialog open={!!printerToEdit} onOpenChange={(open) => !open && setPrinterToEdit(null)}>
        <DialogContent className="sm:max-w-[600px]">
          {printerToEdit && (
            <AddPrinterFormContainer 
              onCancel={() => setPrinterToEdit(null)} 
              existingPrinter={printerToEdit}
              onSuccess={onPrinterEditSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Printer Dialog */}
      <Dialog open={!!printerToDelete} onOpenChange={(open) => !open && setPrinterToDelete(null)}>
        <DialogContent className="sm:max-w-[400px]">
          {printerToDelete && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Delete Printer</h2>
              <p>
                Are you sure you want to delete "{printerToDelete.name}"? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setPrinterToDelete(null)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={onConfirmDelete}>
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Printer Detail Modal */}
      {selectedPrinterId && (
        <PrinterDetailModal
          printerId={selectedPrinterId}
          onClose={() => setSelectedPrinterId(null)}
          isAdmin={isAdmin}
        />
      )}
    </>
  );
};

export default PrinterDialogs;
