
import { apiService } from '@/services/api';
import { PrinterData } from '@/types/printers';
import { addActivity } from '../activityLogService';

// Poll a single printer for status updates using consolidated API
export const pollPrinter = async (printer: Pick<PrinterData, 'id' | 'name' | 'ipAddress'>): Promise<PrinterData | null> => {
  try {
    const result = await apiService.pollPrinter(printer);
    
    if (result) {
      await addActivity({
        printerId: printer.id,
        printerName: printer.name,
        timestamp: new Date().toISOString(),
        action: "SNMP Poll",
        user: "system",
        details: `Successfully updated printer data via SNMP`,
        status: "success"
      });
    }
    
    return result;
  } catch (error) {
    console.error(`Error polling printer ${printer.name}:`, error);
    
    await addActivity({
      printerId: printer.id,
      printerName: printer.name,
      timestamp: new Date().toISOString(),
      action: "SNMP Poll Failed",
      user: "system",
      details: `Failed to update printer data: ${error.message}`,
      status: "error"
    });
    
    return null;
  }
};

// Discover printers on the network using consolidated API
export const discoverPrinters = async (): Promise<{ ipAddress: string, name: string, model: string }[]> => {
  return await apiService.discoverPrinters();
};

// Poll all printers for status updates using consolidated API
export const pollAllPrinters = async (): Promise<void> => {
  return await apiService.pollAllPrinters();
};
