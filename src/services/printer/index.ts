
import { PrinterData, PrintLog, PrinterActivity } from '@/types/printers';
import * as printerManagement from './management';
import { 
  getPrinterLogs, 
  addLog, 
  getPrinterActivity, 
  addActivity,
  getAllLogs,
  getAllActivities
} from './activityLogService';
import { snmpService } from './snmpService';

// Export types
export type { 
  PrinterData, 
  PrintLog, 
  PrinterActivity,
};

// Export the printer service with all functions
export const printerService = {
  // Printer management
  ...printerManagement,
  
  // Logs and activity
  getPrinterLogs,
  addLog,
  getPrinterActivity,
  addActivity,
  getAllLogs,
  getAllActivities,
  
  // SNMP operations
  pollPrinter: printerManagement.pollPrinter,
  pollAllPrinters: printerManagement.pollAllPrinters,
  discoverPrinters: printerManagement.discoverPrinters
};
