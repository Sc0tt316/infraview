
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { printerService } from '@/services/printer';
import { toast } from '@/hooks/use-toast';
import { PrinterData } from '@/types/printers';

export const usePrinters = () => {
  const [printers, setPrinters] = useState<PrinterData[]>([]);
  
  // Query to get all printers
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['printers'],
    queryFn: () => printerService.getAllPrinters(),
  });

  // Set printers when data changes
  useEffect(() => {
    if (data) {
      setPrinters(data);
    }
  }, [data]);

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load printers. Please try again later."
      });
      console.error("Error fetching printers:", error);
    }
  }, [error]);

  return {
    printers: printers || [],
    isLoading,
    error,
    refetch
  };
};
