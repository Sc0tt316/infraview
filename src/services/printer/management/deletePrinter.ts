
import { apiService } from '@/services/api';
import { PrinterData } from '@/types/printers';
import { initializePrinters } from '../mockDataService';
import { addActivity } from '../activityLogService';

export const deletePrinter = async (printerId: string): Promise<void> => {
  try {
    await initializePrinters();
    
    const printers = await apiService.get<PrinterData[]>('printers') || [];
    const printerToDelete = printers.find(printer => printer.id === printerId);
    
    if (!printerToDelete) {
      throw new Error(`Printer with id ${printerId} not found`);
    }
    
    const updatedPrinters = printers.filter(printer => printer.id !== printerId);
    await apiService.post('printers', updatedPrinters);
    
    // Log the activity
    await addActivity({
      printerId,
      printerName: printerToDelete.name,
      timestamp: new Date().toISOString(),
      action: "Printer Deleted",
      user: "admin",
      details: `Deleted printer: ${printerToDelete.name} - ${printerToDelete.model}`
    });
    
  } catch (error) {
    console.error('Error deleting printer:', error);
    throw error;
  }
};
