
import { apiService } from '../../api';
import { toast } from '@/hooks/use-toast';
import { PrinterData } from '@/types/printers';
import { getAllPrinters } from './getAllPrinters';
import { addActivity } from '../activityLogService';

// Add new printer
export const addPrinter = async (printerData: Omit<PrinterData, 'id' | 'jobCount' | 'lastActive'>): Promise<PrinterData> => {
  try {
    const printers = await getAllPrinters();
    
    const newPrinter: PrinterData = {
      ...printerData,
      id: `p${Date.now()}`,
      jobCount: 0,
      lastActive: "Just added"
    };
    
    const updatedPrinters = [...printers, newPrinter];
    await apiService.post('printers', updatedPrinters);
    
    // Add activity record
    await addActivity({
      printerId: newPrinter.id,
      timestamp: new Date().toISOString(),
      action: "Printer added",
      user: "admin",
      details: `Added printer ${newPrinter.name} (${newPrinter.model})`
    });
    
    toast({
      title: "Success",
      description: `Printer "${newPrinter.name}" has been added.`,
    });
    
    return newPrinter;
  } catch (error) {
    console.error('Error adding printer:', error);
    toast({
      title: "Error",
      description: "Failed to add printer. Please try again.",
      variant: "destructive"
    });
    throw error;
  }
};
