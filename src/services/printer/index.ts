
import { PrinterData, PrinterLog, PrinterActivity } from '@/types/printers';
import { 
  getAllPrinters, 
  getPrinterById, 
  addPrinter, 
  updatePrinter, 
  deletePrinter,
  changeStatus,
  restartPrinter
} from './printerManagementService';
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
  // Re-export other types from printers.ts
};

// Export the printer service with all functions
export const printerService = {
  // Printer management
  getAllPrinters,
  getPrinterById,
  addPrinter,
  updatePrinter,
  deletePrinter,
  changeStatus,
  restartPrinter,
  
  // Logs and activity
  getPrinterLogs,
  addLog,
  getPrinterActivity,
  addActivity,
  getAllLogs,
  getAllActivities
};
