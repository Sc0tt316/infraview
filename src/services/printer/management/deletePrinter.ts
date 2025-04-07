
import { apiService } from '../../api';
import { toast } from '@/hooks/use-toast';
import { getAllPrinters } from './getAllPrinters';
import { addActivity } from '../activityLogService';

// Delete printer
export const deletePrinter = async (id: string): Promise<boolean> => {
  try {
    const printers = await getAllPrinters();
    const printerIndex = printers.findIndex(printer => printer.id === id);
    
    if (printerIndex === -1) {
      toast({
        title: "Error",
        description: "Printer not found.",
        variant: "destructive"
      });
      return false;
    }
    
    const printerName = printers[printerIndex].name;
    const updatedPrinters = printers.filter(printer => printer.id !== id);
    await apiService.post('printers', updatedPrinters);
    
    // Add activity record for the deletion
    await addActivity({
      printerId: id,
      timestamp: new Date().toISOString(),
      action: "Printer deleted",
      user: "admin",
      details: `Deleted printer ${printerName}`
    });
    
    toast({
      title: "Success",
      description: `Printer "${printerName}" has been deleted.`,
    });
    
    return true;
  } catch (error) {
    console.error(`Error deleting printer ${id}:`, error);
    toast({
      title: "Error",
      description: "Failed to delete printer. Please try again.",
      variant: "destructive"
    });
    return false;
  }
};
