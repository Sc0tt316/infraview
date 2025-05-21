
import React from 'react';
import { Button } from '@/components/ui/button';
import { Network, RefreshCw, Power } from 'lucide-react';
import { usePrinterStatusUpdates } from '@/hooks/usePrinterStatusUpdates';
import { formatDistanceToNow } from 'date-fns';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { printerService } from '@/services/printer';

interface PrinterActionsProps {
  printerId: string;
  hasIpAddress: boolean;
  isAdmin: boolean;
  onRestartClick?: () => void;
}

const PrinterActions: React.FC<PrinterActionsProps> = ({
  printerId,
  hasIpAddress,
  isAdmin,
  onRestartClick
}) => {
  const {
    isPolling,
    lastUpdated,
    pollPrinterStatus,
    autoPolling,
    toggleAutoPolling
  } = usePrinterStatusUpdates(printerId, 60000); // 1 minute default interval

  const handleManualPoll = () => {
    pollPrinterStatus(true);
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
            variant="outline"
            size="sm"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleManualPoll}
            disabled={isPolling || !hasIpAddress}
          >
            <Network className={`h-4 w-4 ${isPolling ? "animate-pulse" : ""}`} />
            <span>Update Status via SNMP</span>
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
        </div>
        
        {/* Auto-Refresh Toggle */}
        {hasIpAddress && (
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-refresh">Auto-refresh</Label>
              <p className="text-xs text-muted-foreground">
                Automatically poll every minute
              </p>
            </div>
            <Switch
              id="auto-refresh"
              checked={autoPolling}
              onCheckedChange={toggleAutoPolling}
              disabled={!hasIpAddress}
            />
          </div>
        )}
        
        <Separator />
        
        {/* Restart Printer */}
        {isAdmin && (
          <Button
            variant="secondary"
            size="sm"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleRestart}
          >
            <Power className="h-4 w-4" />
            <span>Restart Printer</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default PrinterActions;
