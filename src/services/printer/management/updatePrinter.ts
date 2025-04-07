
import { apiService } from '../../api';
import { toast } from '@/hooks/use-toast';
import { PrinterData } from '@/types/printers';
import { getAllPrinters } from './getAllPrinters';
import { addActivity } from '../activityLogService';

// Update printer
export const updatePrinter = async (id: string, updateData: Partial<PrinterData>): Promise<PrinterData | null> => {
  try {
    const printers = await getAllPrinters();
    const printerIndex = printers.findIndex(printer => printer.id === id);
    
    if (printerIndex === -1) {
      toast({
        title: "Error",
        description: "Printer not found.",
        variant: "destructive"
      });
      return null;
    }
    
    const updatedPrinter = {
      ...printers[printerIndex],
      ...updateData,
      lastActive: "Just updated"
    };
    
    printers[printerIndex] = updatedPrinter;
    await apiService.post('printers', printers);
    
    // Add activity record
    await addActivity({
      printerId: id,
      timestamp: new Date().toISOString(),
      action: "Printer updated",
      user: "admin",
      details: `Updated printer ${updatedPrinter.name}`
    });
    
    toast({
      title: "Success",
      description: `Printer "${updatedPrinter.name}" has been updated.`,
    });
    
    return updatedPrinter;
  } catch (error) {
    console.error(`Error updating printer ${id}:`, error);
    toast({
      title: "Error",
      description: "Failed to update printer. Please try again.",
      variant: "destructive"
    });
    return null;
  }
};
