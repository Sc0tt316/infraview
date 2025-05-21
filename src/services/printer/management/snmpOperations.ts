
import { snmpService } from '../snmpService';
import { PrinterData } from '@/types/printers';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { addActivity } from '../activityLogService';

// Poll a single printer for status updates
export const pollPrinter = async (printer: Pick<PrinterData, 'id' | 'name' | 'ipAddress'>): Promise<PrinterData | null> => {
  try {
    const result = await snmpService.pollPrinter(printer);
    
    if (result) {
      // Log the activity
      await addActivity({
        printerId: printer.id,
        printerName: printer.name,
        timestamp: new Date().toISOString(),
        action: "SNMP Poll",
        user: "system",
        details: `Automatically updated printer data via SNMP`,
        status: "success"
      });
    }
    
    return result;
  } catch (error) {
    console.error(`Error polling printer ${printer.name}:`, error);
    
    // Log the error activity
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

// Discover printers on the network
export const discoverPrinters = async (): Promise<{ ipAddress: string, name: string, model: string }[]> => {
  return await snmpService.discoverPrinters();
};

// Poll all printers for status updates
export const pollAllPrinters = async (): Promise<void> => {
  return await snmpService.pollAllPrinters();
};
