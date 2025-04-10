
import { v4 as uuidv4 } from 'uuid';
import { apiService } from '@/services/api';
import { PrinterData } from '@/types/printers';
import { initializePrinters } from '../mockDataService';
import { addActivity } from '../activityLogService';

export const addPrinter = async (data: Omit<PrinterData, "id" | "jobCount" | "lastActive">): Promise<PrinterData> => {
  try {
    await initializePrinters();
    
    const printers = await apiService.get<PrinterData[]>('printers') || [];
    
    const newPrinter: PrinterData = {
      id: uuidv4(),
      ...data,
      jobCount: 0,
      lastActive: 'Never'
    };
    
    const updatedPrinters = [...printers, newPrinter];
    await apiService.post('printers', updatedPrinters);
    
    // Log the activity
    await addActivity({
      printerId: newPrinter.id,
      printerName: newPrinter.name,
      timestamp: new Date().toISOString(),
      action: "Printer Added",
      user: "admin",
      details: `Added new printer: ${newPrinter.name} - ${newPrinter.model}`
    });
    
    return newPrinter;
  } catch (error) {
    console.error('Error adding printer:', error);
    throw error;
  }
};
