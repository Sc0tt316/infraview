
import { useState, useEffect } from 'react';
import { printerService } from '@/services/printer';
import { toast } from '@/hooks/use-toast';
import { PrinterData } from '@/types/printers';

export const usePrinterStatusUpdates = (printerId: string, initialInterval = 60000) => {
  const [isPolling, setIsPolling] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [pollingInterval, setPollingInterval] = useState(initialInterval);
  const [autoPolling, setAutoPolling] = useState(false);
  
  // Function to poll the printer status on demand
  const pollPrinterStatus = async (showToast = true) => {
    if (isPolling || !printerId) return;
    
    setIsPolling(true);
    try {
      // Get the current printer data to have access to IP address and name
      const printer = await printerService.getPrinter(printerId);
      
      if (!printer) {
        throw new Error('Printer not found');
      }
      
      if (!printer.ipAddress) {
        throw new Error('Printer has no IP address configured');
      }
      
      // Poll the printer
      await printerService.pollPrinter({
        id: printerId,
        name: printer.name,
        ipAddress: printer.ipAddress
      });
      
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
  
  // Toggle auto-polling
  const toggleAutoPolling = () => {
    setAutoPolling(prev => !prev);
  };
  
  // Change polling interval
  const changePollingInterval = (newInterval: number) => {
    setPollingInterval(newInterval);
  };
  
  // Set up auto-polling effect
  useEffect(() => {
    if (!autoPolling || !printerId) return;
    
    // Initial poll
    pollPrinterStatus(false);
    
    // Set up interval
    const interval = setInterval(() => {
      pollPrinterStatus(false);
    }, pollingInterval);
    
    // Clean up interval on unmount or when autoPolling is disabled
    return () => {
      clearInterval(interval);
    };
  }, [autoPolling, printerId, pollingInterval]);
  
  return {
    isPolling,
    lastUpdated,
    pollPrinterStatus,
    autoPolling,
    toggleAutoPolling,
    pollingInterval,
    changePollingInterval
  };
};
