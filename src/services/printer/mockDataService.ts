
import { apiService } from '../api';
import { PrinterData, PrintLog, PrinterActivity } from '@/types/printers';

// Initialize with empty data if none exists
export const initializePrinters = async (): Promise<PrinterData[]> => {
  const existingPrinters = await apiService.get<PrinterData[]>('printers');
  if (!existingPrinters) {
    const emptyPrinters: PrinterData[] = [];
    await apiService.post('printers', emptyPrinters);
    return emptyPrinters;
  }
  return existingPrinters;
};

// Initialize logs if none exist
export const initializeLogs = async (): Promise<PrintLog[]> => {
  const existingLogs = await apiService.get<PrintLog[]>('printerLogs');
  if (!existingLogs) {
    const emptyLogs: PrintLog[] = [];
    await apiService.post('printerLogs', emptyLogs);
    return emptyLogs;
  }
  return existingLogs;
};

// Initialize activity if none exists
export const initializeActivity = async (): Promise<PrinterActivity[]> => {
  const existingActivity = await apiService.get<PrinterActivity[]>('printerActivity');
  if (!existingActivity) {
    const emptyActivity: PrinterActivity[] = [];
    await apiService.post('printerActivity', emptyActivity);
    return emptyActivity;
  }
  return existingActivity;
};
