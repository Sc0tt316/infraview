
import { apiService } from '../../api';
import { toast } from '@/hooks/use-toast';
import { PrinterData } from '@/types/printers';
import { initializePrinters } from '../mockDataService';

// Get all printers
export const getAllPrinters = async (): Promise<PrinterData[]> => {
  try {
    await initializePrinters();
    const printers = await apiService.get<PrinterData[]>('printers');
    return printers || [];
  } catch (error) {
    console.error('Error fetching printers:', error);
    toast({
      title: "Error",
      description: "Failed to fetch printers. Please try again.",
      variant: "destructive"
    });
    return [];
  }
};
