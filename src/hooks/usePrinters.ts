
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { PrinterData } from '@/types/printers';
import { printerService } from '@/services/printerService';

export const usePrinters = () => {
  const [printers, setPrinters] = useState<PrinterData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrinters = async () => {
    setIsLoading(true);
    try {
      const data = await printerService.getAllPrinters();
      setPrinters(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching printers:', err);
      setError('Failed to load printers');
      toast.error('Failed to load printers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrinters();
  }, []);

  return {
    printers,
    isLoading,
    error,
    refreshPrinters: fetchPrinters
  };
};
