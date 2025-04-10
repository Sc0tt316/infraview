
import { apiService } from '@/services/api';
import { PrinterData } from '@/types/printers';
import { initializePrinters } from '../mockDataService';
import { addActivity } from '../activityLogService';

export const updatePrinter = async (
  printerId: string, 
  data: Partial<PrinterData>
): Promise<PrinterData> => {
  try {
    await initializePrinters();
    
    const printers = await apiService.get<PrinterData[]>('printers') || [];
    const printerIndex = printers.findIndex(printer => printer.id === printerId);
    
    if (printerIndex === -1) {
      throw new Error(`Printer with id ${printerId} not found`);
    }
    
    const printerToUpdate = printers[printerIndex];
    const updatedPrinter = {
      ...printerToUpdate,
      ...data
    };
    
    printers[printerIndex] = updatedPrinter;
    await apiService.post('printers', printers);
    
    // Log the activity
    await addActivity({
      printerId,
      printerName: updatedPrinter.name,
      timestamp: new Date().toISOString(),
      action: "Printer Updated",
      user: "admin",
      details: `Updated printer properties: ${Object.keys(data).join(', ')}`
    });
    
    return updatedPrinter;
  } catch (error) {
    console.error('Error updating printer:', error);
    throw error;
  }
};
