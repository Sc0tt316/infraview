
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Power, Edit, Trash2 } from 'lucide-react';
import { usePrinterStatusUpdates } from '@/hooks/usePrinterStatusUpdates';
import { formatDistanceToNow } from 'date-fns';
import { printerService } from '@/services/printer';
import { toast } from '@/hooks/use-toast';
import { PrinterData } from '@/types/printers';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface PrinterActionsProps {
  printer: PrinterData;
  isAdmin: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const PrinterActions: React.FC<PrinterActionsProps> = ({
  printer,
  isAdmin,
  onEdit,
  onDelete
}) => {
  const [isRestarting, setIsRestarting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const {
    isPolling,
    lastUpdated,
    pollPrinterStatus
  } = usePrinterStatusUpdates(printer.id, 60000);

  const hasIpAddress = !!printer.ipAddress;

  const handleManualPoll = async () => {
    try {
      await pollPrinterStatus(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update printer status",
        variant: "destructive"
      });
    }
  };

  const handleRestart = async () => {
    setIsRestarting(true);
    try {
      await printerService.restartPrinter(printer.id);
      toast({
        title: "Printer Restarting",
        description: `${printer.name} is now restarting. This may take a moment.`
      });
      setTimeout(() => {
        setIsRestarting(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to restart printer:', error);
      toast({
        title: "Error",
        description: "Failed to restart the printer. Please try again.",
        variant: "destructive"
      });
      setIsRestarting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await printerService.deletePrinter(printer.id, printer.name);
      toast({
        title: "Printer Deleted",
        description: `${printer.name} has been deleted successfully.`
      });
      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error('Failed to delete printer:', error);
      toast({
        title: "Error",
        description: "Failed to delete the printer. Please try again.",
        variant: "destructive"
      });
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h3 className="text-lg font-medium">Printer Actions</h3>
      
      <div className="space-y-4">
        {/* SNMP Status Update */}
        <div className="space-y-2">
          <Button
            variant="default"
            size="default"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleManualPoll}
            disabled={isPolling || !hasIpAddress}
          >
            <RefreshCw className={`h-4 w-4 ${isPolling ? "animate-spin" : ""}`} />
            <span>Refresh Printer Status</span>
          </Button>
          
          {!hasIpAddress && (
            <p className="text-xs text-muted-foreground">
              No IP address configured for this printer
            </p>
          )}
          
          {lastUpdated && (
            <p className="text-xs text-muted-foreground">
              Last updated: {formatDistanceToNow(lastUpdated, { addSuffix: true })}
            </p>
          )}
        </div>
        
        {/* Restart Printer */}
        {isAdmin && hasIpAddress && (
          <Button
            variant="secondary"
            size="default"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleRestart}
            disabled={isRestarting}
          >
            <Power className={`h-4 w-4 ${isRestarting ? "animate-spin" : ""}`} />
            <span>{isRestarting ? "Restarting..." : "Restart Printer"}</span>
          </Button>
        )}

        {/* Edit Printer */}
        {isAdmin && onEdit && (
          <Button
            variant="outline"
            size="default"
            className="w-full flex items-center justify-center gap-2"
            onClick={onEdit}
          >
            <Edit className="h-4 w-4" />
            <span>Edit Printer</span>
          </Button>
        )}

        {/* Delete Printer */}
        {isAdmin && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="default"
                className="w-full flex items-center justify-center gap-2"
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
                <span>{isDeleting ? "Deleting..." : "Delete Printer"}</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Printer</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{printer.name}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
};

export default PrinterActions;
