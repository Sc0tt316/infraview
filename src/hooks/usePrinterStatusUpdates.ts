
import { useState, useEffect } from 'react';
import { printerService } from '@/services/printer';
import { toast } from '@/hooks/use-toast';
import { PrinterData } from '@/types/printers';
import { useQueryClient } from '@tanstack/react-query';

export const usePrinterStatusUpdates = (printerId: string, initialInterval = 30000) => {
  const [isPolling, setIsPolling] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [pollingInterval] = useState(initialInterval);
  
  const queryClient = useQueryClient();
  
  // Function to poll the printer status on demand using SNMP
  const pollPrinterStatus = async (showToast = false) => {
    if (isPolling || !printerId) return;
    
    setIsPolling(true);
    try {
      // Get the current printer data to have access to IP address and name
      const printer = await printerService.getPrinter(printerId);
      
      if (!printer) {
        throw new Error('Printer not found');
      }
      
      if (!printer.ipAddress) {
        if (showToast) {
          toast({
            title: "No IP Address",
            description: "Printer has no IP address configured for SNMP polling.",
            variant: "destructive"
          });
        }
        return;
      }
      
      // Poll the printer via SNMP
      await printerService.pollPrinter({
        id: printerId,
        name: printer.name,
        ipAddress: printer.ipAddress
      });
      
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['printer', printerId] });
      
      // Update last updated timestamp
      const now = new Date();
      setLastUpdated(now);
      
      if (showToast) {
        toast({
          title: "Printer Updated",
          description: `${printer.name} status updated successfully at ${now.toLocaleTimeString()}`
        });
      }
    } catch (error) {
      console.error('Error polling printer:', error);
      if (showToast) {
        toast({
          title: "Update Failed",
          description: error.message || "Could not update printer status.",
          variant: "destructive"
        });
      }
    } finally {
      setIsPolling(false);
    }
  };
  
  // Set up auto-polling effect (always enabled by default)
  useEffect(() => {
    if (!printerId) return;
    
    // Initial poll
    pollPrinterStatus(false);
    
    // Set up interval
    const interval = setInterval(() => {
      pollPrinterStatus(false);
    }, pollingInterval);
    
    // Clean up interval on unmount
    return () => {
      clearInterval(interval);
    };
  }, [printerId, pollingInterval]);
  
  return {
    isPolling,
    lastUpdated,
    pollPrinterStatus
  };
};
