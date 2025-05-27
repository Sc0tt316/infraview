
import React from 'react';
import { Button } from '@/components/ui/button';
import { Network, RefreshCw, Power } from 'lucide-react';
import { usePrinterStatusUpdates } from '@/hooks/usePrinterStatusUpdates';
import { formatDistanceToNow } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { printerService } from '@/services/printer';
import { toast } from '@/hooks/use-toast';

interface PrinterActionsProps {
  printerId: string;
  hasIpAddress: boolean;
  isAdmin: boolean;
  onRestartClick?: () => void;
  isRestarting?: boolean;
}

const PrinterActions: React.FC<PrinterActionsProps> = ({
  printerId,
  hasIpAddress,
  isAdmin,
  onRestartClick,
  isRestarting = false
}) => {
  const {
    isPolling,
    lastUpdated,
    pollPrinterStatus
  } = usePrinterStatusUpdates(printerId, 60000); // 1 minute default interval

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

  const handleRestart = () => {
    if (onRestartClick) {
      onRestartClick();
    } else {
      // Default restart behavior if no custom handler provided
      printerService.restartPrinter(printerId);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-muted/40 rounded-lg">
      <h3 className="text-sm font-medium">Printer Actions</h3>
      
      <div className="space-y-4">
        {/* SNMP Status Update */}
        <div>
          <Button
            variant="default"
            size="sm"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleManualPoll}
            disabled={isPolling || !hasIpAddress}
          >
            <RefreshCw className={`h-4 w-4 ${isPolling ? "animate-spin" : ""}`} />
            <span>Refresh Printer Status</span>
          </Button>
          
          {!hasIpAddress && (
            <p className="text-xs text-muted-foreground mt-1">
              No IP address configured for this printer
            </p>
          )}
          
          {lastUpdated && (
            <p className="text-xs text-muted-foreground mt-1">
              Last updated: {formatDistanceToNow(lastUpdated, { addSuffix: true })}
            </p>
          )}
          
          {hasIpAddress && (
            <p className="text-xs text-muted-foreground mt-1">
              Auto-refresh enabled (every minute)
            </p>
          )}
        </div>
        
        <Separator />
        
        {/* Restart Printer */}
        {isAdmin && (
          <Button
            variant="secondary"
            size="sm"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleRestart}
            disabled={isRestarting}
          >
            <Power className={`h-4 w-4 ${isRestarting ? "animate-spin" : ""}`} />
            <span>{isRestarting ? "Restarting..." : "Restart Printer"}</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default PrinterActions;
