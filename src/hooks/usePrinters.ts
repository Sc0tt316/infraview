
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { printerService } from '@/services/printer';
import { toast } from '@/hooks/use-toast';
import { PrinterData } from '@/types/printers';
import { supabase } from '@/integrations/supabase/client';

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

  // Set up a subscription to printer changes using Supabase realtime
  useEffect(() => {
    const subscription = supabase
      .channel('public:printers')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'printers' }, 
        (payload) => {
          // Refetch printers when changes occur
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [refetch]);

  // Add the refetchPrinters method that was being called in Printers.tsx
  const refetchPrinters = async () => {
    return refetch();
  };

  return {
    printers: printers || [],
    isLoading,
    error,
    refetch,
    refetchPrinters
  };
};
