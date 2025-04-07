
import { PrinterData, PrinterLog, PrinterActivity } from '@/types/printers';
import * as printerManagement from './management';
import { 
  getPrinterLogs, 
  addLog, 
  getPrinterActivity, 
  addActivity,
  getAllLogs,
  getAllActivities
} from './activityLogService';

// Export types
export type { 
  PrinterData, 
  PrinterLog, 
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
  getAllActivities
};
