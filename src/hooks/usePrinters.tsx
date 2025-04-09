
import { useState, useEffect, useCallback } from 'react';
import { PrinterData } from '@/types/printers';
import { printerService } from '@/services/printerService';
import { toast } from 'sonner';

export const usePrinters = () => {
  const [printers, setPrinters] = useState<PrinterData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch printers on component mount
  const fetchPrinters = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedPrinters = await printerService.getAllPrinters();
      setPrinters(fetchedPrinters);
      setError(null);
    } catch (err) {
      console.error('Error fetching printers:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch printers'));
      toast.error('Failed to fetch printer data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrinters();
  }, [fetchPrinters]);

  return {
    printers,
    isLoading,
    error,
    refreshPrinters: fetchPrinters
  };
};
