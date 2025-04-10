
import { apiService } from '@/services/api';
import { PrinterData } from '@/types/printers';
import { initializePrinters } from '../mockDataService';
import { addLog } from '../activityLogService';

export const changeStatus = async (printerId: string, newStatus: string): Promise<void> => {
  try {
    await initializePrinters();
    
    const printers = await apiService.get<PrinterData[]>('printers') || [];
    const printerToUpdate = printers.find(printer => printer.id === printerId);
    
    if (!printerToUpdate) {
      throw new Error(`Printer with id ${printerId} not found`);
    }
    
    // Log the status change
    await addLog({
      printerId,
      timestamp: new Date().toISOString(),
      status: 'completed',
      user: 'admin',
      fileName: `Status change to ${newStatus}`,
      pages: 0,
      size: '0KB'
    });
    
    // Update the printer status
    printerToUpdate.status = newStatus;
    
    // Save the updated printers array
    await apiService.post('printers', printers);
    
  } catch (error) {
    console.error(`Error changing printer status for ${printerId}:`, error);
    throw error;
  }
};
