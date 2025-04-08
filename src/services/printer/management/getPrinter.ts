
import { apiService } from '../../api';
import { toast } from '@/hooks/use-toast';
import { PrinterData } from '@/types/printers';
import { getAllPrinters } from './getAllPrinters';
import { updatePrinterLevels } from './autoPrinterLevels';

// Get a single printer by ID
export const getPrinter = async (id: string): Promise<PrinterData | undefined> => {
  try {
    const printers = await getAllPrinters();
    let printer = printers.find(p => p.id === id);
    
    if (!printer) {
      return undefined;
    }
    
    // Auto-detect and update ink and paper levels
    printer = await updatePrinterLevels(printer);
    
    return printer;
  } catch (error) {
    console.error(`Error fetching printer ${id}:`, error);
    toast({
      title: "Error",
      description: "Failed to load printer details. Please try again.",
      variant: "destructive"
    });
    return undefined;
  }
};
