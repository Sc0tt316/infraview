
import { toast } from '@/hooks/use-toast';
import { PrinterData } from '@/types/printers';
import { getAllPrinters } from './getAllPrinters';

// Get printer by ID
export const getPrinterById = async (id: string): Promise<PrinterData | null> => {
  try {
    const printers = await getAllPrinters();
    return printers.find(printer => printer.id === id) || null;
  } catch (error) {
    console.error(`Error fetching printer ${id}:`, error);
    toast({
      title: "Error",
      description: "Failed to fetch printer details. Please try again.",
      variant: "destructive"
    });
    return null;
  }
};
