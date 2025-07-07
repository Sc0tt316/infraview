
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Settings, Trash2 } from 'lucide-react';
import { usePrinterStatusUpdates } from '@/hooks/usePrinterStatusUpdates';
import { formatDistanceToNow } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { PrinterData } from '@/types/printers';
import { useAuth } from '@/context/AuthContext';
import { hasPermission } from '@/utils/permissions';

interface PrinterActionsProps {
  printer: PrinterData;
  onEdit?: () => void;
  onDelete?: () => void;
}

const PrinterActions: React.FC<PrinterActionsProps> = ({
  printer,
  onEdit,
  onDelete
}) => {
  const { user } = useAuth();
  const canRefreshPrinters = hasPermission(user, 'refresh_printers');
  const canEditPrinters = hasPermission(user, 'edit_printers');
  const canDeletePrinters = hasPermission(user, 'delete_printers');
  
  const {
    isPolling,
    lastUpdated,
    pollPrinterStatus
  } = usePrinterStatusUpdates(printer.id, 60000);

  const hasIpAddress = !!printer.ipAddress;

  const handleManualPoll = async () => {
    if (!canRefreshPrinters) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to refresh printer status",
        variant: "destructive"
      });
      return;
    }
    
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

  return (
    <div className="space-y-4 p-4">
      <h3 className="text-lg font-medium">Quick Actions</h3>
      
      <div className="space-y-3">
        {/* SNMP Status Update */}
        <div className="space-y-2">
          <Button
            variant="default"
            size="default"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleManualPoll}
            disabled={isPolling || !hasIpAddress || !canRefreshPrinters}
          >
            <RefreshCw className={`h-4 w-4 ${isPolling ? "animate-spin" : ""}`} />
            <span>Refresh Printer Status</span>
          </Button>
          
          {!hasIpAddress && (
            <p className="text-xs text-muted-foreground">
              No IP address configured for this printer
            </p>
          )}
          
          {!canRefreshPrinters && (
            <p className="text-xs text-muted-foreground">
              Manager or admin permissions required
            </p>
          )}
          
          {lastUpdated && (
            <p className="text-xs text-muted-foreground">
              Last updated: {formatDistanceToNow(lastUpdated, { addSuffix: true })}
            </p>
          )}
        </div>

        {/* Manager/Admin Actions */}
        {(canEditPrinters || canDeletePrinters) && (
          <div className="space-y-2 pt-2 border-t">
            <h4 className="text-sm font-medium text-muted-foreground">Management Actions</h4>
            
            {onEdit && canEditPrinters && (
              <Button
                variant="outline"
                size="default"
                className="w-full flex items-center justify-center gap-2"
                onClick={onEdit}
              >
                <Settings className="h-4 w-4" />
                <span>Edit Printer</span>
              </Button>
            )}
            
            {onDelete && canDeletePrinters && (
              <Button
                variant="destructive"
                size="default"
                className="w-full flex items-center justify-center gap-2"
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete Printer</span>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PrinterActions;
