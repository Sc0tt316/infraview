
import { apiService } from '@/services/api';
import { PrinterData } from '@/types/printers';
import { initializePrinters } from '../mockDataService';
import { addActivity } from '../activityLogService';

export const restartPrinter = async (printerId: string): Promise<void> => {
  try {
    await initializePrinters();
    
    const printers = await apiService.get<PrinterData[]>('printers') || [];
    const printerToRestart = printers.find(printer => printer.id === printerId);
    
    if (!printerToRestart) {
      throw new Error(`Printer with id ${printerId} not found`);
    }
    
    // Log the activity
    await addActivity({
      printerId,
      printerName: printerToRestart.name,
      timestamp: new Date().toISOString(),
      action: "Printer Restarted",
      user: "admin"
    });
    
    // In a real app, this would actually restart the printer
    // For this simulation, we'll just return
    
  } catch (error) {
    console.error('Error restarting printer:', error);
    throw error;
  }
};
