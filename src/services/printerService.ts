import { apiService } from './api';
import { toast } from '@/hooks/use-toast';

// Define printer types
export interface PrinterData {
  id: string;
  name: string;
  model: string;
  location: string;
  status: "online" | "offline" | "error" | "maintenance" | "warning";
  inkLevel: number;
  paperLevel: number;
  jobCount: number;
  lastActive: string;
  ipAddress?: string;
  department?: string;
  serialNumber?: string;
  addedDate?: string;
  supplies?: {
    black: number;
    cyan?: number;
    magenta?: number;
    yellow?: number;
    waste?: number;
  };
  stats?: {
    totalPages: number;
    monthlyPages: number;
    jams: number;
  };
  printLogs?: PrintLog[];
  activity?: ActivityItem[];
}

// Define print log type
export interface PrintLog {
  id?: string;
  fileName: string;
  user: string;
  timestamp: string;
  status: "completed" | "failed";
  pages: number;
  size: string;
}

// Define activity item type
export interface ActivityItem {
  id?: string;
  timestamp: string;
  type: "error" | "warning" | "info" | "success";
  message: string;
}

// Define log types 
export interface PrinterLog {
  id: string;
  printerId: string;
  timestamp: string;
  message: string;
  type: "info" | "warning" | "error";
  user?: string;
}

// Define activity types
export interface PrinterActivity {
  id: string;
  printerId: string;
  timestamp: string;
  action: string;
  user?: string;
  details?: string;
}

// Initialize with mock data if none exists
const initializePrinters = async () => {
  const existingPrinters = await apiService.get<PrinterData[]>('printers');
  if (!existingPrinters) {
    const mockPrinters: PrinterData[] = [
      {
        id: "p1",
        name: "Office Printer 1",
        model: "HP LaserJet Pro",
        location: "First Floor",
        status: "online",
        inkLevel: 75,
        paperLevel: 30,
        jobCount: 145,
        lastActive: "2 minutes ago",
        ipAddress: "192.168.1.101",
        department: "Administration"
      },
      {
        id: "p2",
        name: "Executive Printer",
        model: "Canon PIXMA",
        location: "Executive Suite",
        status: "offline",
        inkLevel: 20,
        paperLevel: 60,
        jobCount: 89,
        lastActive: "2 days ago",
        ipAddress: "192.168.1.102",
        department: "Executive"
      },
      {
        id: "p3",
        name: "Marketing Printer",
        model: "Epson WorkForce Pro",
        location: "Marketing Department",
        status: "error",
        inkLevel: 5,
        paperLevel: 75,
        jobCount: 254,
        lastActive: "5 minutes ago",
        ipAddress: "192.168.1.103",
        department: "Marketing"
      },
      {
        id: "p4",
        name: "Conference Room Printer",
        model: "Brother MFC",
        location: "Main Conference Room",
        status: "maintenance",
        inkLevel: 50,
        paperLevel: 100,
        jobCount: 67,
        lastActive: "1 hour ago",
        ipAddress: "192.168.1.104",
        department: "Facilities"
      },
      {
        id: "p5",
        name: "Accounting Printer",
        model: "Xerox VersaLink",
        location: "Accounting Department",
        status: "online",
        inkLevel: 90,
        paperLevel: 85,
        jobCount: 321,
        lastActive: "15 minutes ago",
        ipAddress: "192.168.1.105",
        department: "Accounting"
      },
    ];
    await apiService.post('printers', mockPrinters);
    return mockPrinters;
  }
  return existingPrinters;
};

// Initialize logs if none exist
const initializeLogs = async () => {
  const existingLogs = await apiService.get<PrinterLog[]>('printerLogs');
  if (!existingLogs) {
    const mockLogs: PrinterLog[] = [
      {
        id: "l1",
        printerId: "p1",
        timestamp: "2023-06-01T10:30:00",
        message: "Print job completed successfully",
        type: "info",
        user: "john.doe"
      },
      {
        id: "l2",
        printerId: "p1",
        timestamp: "2023-06-01T11:45:00",
        message: "Low ink warning",
        type: "warning"
      },
      {
        id: "l3",
        printerId: "p2",
        timestamp: "2023-06-02T09:15:00",
        message: "Paper jam detected",
        type: "error"
      },
      {
        id: "l4",
        printerId: "p3",
        timestamp: "2023-06-02T14:20:00",
        message: "Printer went offline unexpectedly",
        type: "error"
      },
      {
        id: "l5",
        printerId: "p4",
        timestamp: "2023-06-03T10:00:00",
        message: "Maintenance completed",
        type: "info",
        user: "tech.support"
      }
    ];
    await apiService.post('printerLogs', mockLogs);
    return mockLogs;
  }
  return existingLogs;
};

// Initialize activity if none exists
const initializeActivity = async () => {
  const existingActivity = await apiService.get<PrinterActivity[]>('printerActivity');
  if (!existingActivity) {
    const mockActivity: PrinterActivity[] = [
      {
        id: "a1",
        printerId: "p1",
        timestamp: "2023-06-01T10:00:00",
        action: "Print job",
        user: "john.doe",
        details: "Invoice-123.pdf, 5 pages, color"
      },
      {
        id: "a2",
        printerId: "p2",
        timestamp: "2023-06-01T11:30:00",
        action: "Configuration change",
        user: "admin",
        details: "Changed default paper size to A4"
      },
      {
        id: "a3",
        printerId: "p3",
        timestamp: "2023-06-02T09:00:00",
        action: "Print job",
        user: "jane.smith",
        details: "Report-Q2.pdf, 12 pages, black & white"
      },
      {
        id: "a4",
        printerId: "p4",
        timestamp: "2023-06-02T14:00:00",
        action: "Status change",
        user: "admin",
        details: "Changed status to maintenance"
      },
      {
        id: "a5",
        printerId: "p5",
        timestamp: "2023-06-03T09:45:00",
        action: "Print job",
        user: "bob.johnson",
        details: "Presentation.pdf, 24 pages, color"
      }
    ];
    await apiService.post('printerActivity', mockActivity);
    return mockActivity;
  }
  return existingActivity;
};

// Printer service functions
export const printerService = {
  // Get all printers
  getAllPrinters: async (): Promise<PrinterData[]> => {
    try {
      await initializePrinters();
      const printers = await apiService.get<PrinterData[]>('printers');
      return printers || [];
    } catch (error) {
      console.error('Error fetching printers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch printers. Please try again.",
        variant: "destructive"
      });
      return [];
    }
  },
  
  // Get printer by ID
  getPrinterById: async (id: string): Promise<PrinterData | null> => {
    try {
      const printers = await printerService.getAllPrinters();
      return printers.find(printer => printer.id === id) || null;
    } catch (error) {
      console.error(`Error fetching printer ${id}:`, error);
      toast({
        title: "Error",
        description: "Failed to fetch printer details. Please try again.",
        variant: "destructive"
      });
      return null;
    }
  },
  
  // Add new printer
  addPrinter: async (printerData: Omit<PrinterData, 'id' | 'jobCount' | 'lastActive'>): Promise<PrinterData> => {
    try {
      const printers = await printerService.getAllPrinters();
      
      const newPrinter: PrinterData = {
        ...printerData,
        id: `p${Date.now()}`,
        jobCount: 0,
        lastActive: "Just added"
      };
      
      const updatedPrinters = [...printers, newPrinter];
      await apiService.post('printers', updatedPrinters);
      
      // Add activity record
      const activity: Omit<PrinterActivity, 'id'> = {
        printerId: newPrinter.id,
        timestamp: new Date().toISOString(),
        action: "Printer added",
        user: "admin",
        details: `Added printer ${newPrinter.name} (${newPrinter.model})`
      };
      printerService.addActivity(activity);
      
      toast({
        title: "Success",
        description: `Printer "${newPrinter.name}" has been added.`,
      });
      
      return newPrinter;
    } catch (error) {
      console.error('Error adding printer:', error);
      toast({
        title: "Error",
        description: "Failed to add printer. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  },
  
  // Update printer
  updatePrinter: async (id: string, updateData: Partial<PrinterData>): Promise<PrinterData | null> => {
    try {
      const printers = await printerService.getAllPrinters();
      const printerIndex = printers.findIndex(printer => printer.id === id);
      
      if (printerIndex === -1) {
        toast({
          title: "Error",
          description: "Printer not found.",
          variant: "destructive"
        });
        return null;
      }
      
      const updatedPrinter = {
        ...printers[printerIndex],
        ...updateData,
        lastActive: "Just updated"
      };
      
      printers[printerIndex] = updatedPrinter;
      await apiService.post('printers', printers);
      
      // Add activity record
      const activity: Omit<PrinterActivity, 'id'> = {
        printerId: id,
        timestamp: new Date().toISOString(),
        action: "Printer updated",
        user: "admin",
        details: `Updated printer ${updatedPrinter.name}`
      };
      printerService.addActivity(activity);
      
      toast({
        title: "Success",
        description: `Printer "${updatedPrinter.name}" has been updated.`,
      });
      
      return updatedPrinter;
    } catch (error) {
      console.error(`Error updating printer ${id}:`, error);
      toast({
        title: "Error",
        description: "Failed to update printer. Please try again.",
        variant: "destructive"
      });
      return null;
    }
  },
  
  // Delete printer
  deletePrinter: async (id: string): Promise<boolean> => {
    try {
      const printers = await printerService.getAllPrinters();
      const printerIndex = printers.findIndex(printer => printer.id === id);
      
      if (printerIndex === -1) {
        toast({
          title: "Error",
          description: "Printer not found.",
          variant: "destructive"
        });
        return false;
      }
      
      const printerName = printers[printerIndex].name;
      const updatedPrinters = printers.filter(printer => printer.id !== id);
      await apiService.post('printers', updatedPrinters);
      
      // Add activity record for the deletion
      const activity: Omit<PrinterActivity, 'id'> = {
        printerId: id,
        timestamp: new Date().toISOString(),
        action: "Printer deleted",
        user: "admin",
        details: `Deleted printer ${printerName}`
      };
      printerService.addActivity(activity);
      
      toast({
        title: "Success",
        description: `Printer "${printerName}" has been deleted.`,
      });
      
      return true;
    } catch (error) {
      console.error(`Error deleting printer ${id}:`, error);
      toast({
        title: "Error",
        description: "Failed to delete printer. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  },
  
  // Change printer status
  changeStatus: async (id: string, status: PrinterData['status']): Promise<PrinterData | null> => {
    const result = await printerService.updatePrinter(id, { status });
    
    if (result) {
      // Add log record
      const log: Omit<PrinterLog, 'id'> = {
        printerId: id,
        timestamp: new Date().toISOString(),
        message: `Status changed to ${status}`,
        type: status === 'error' ? 'error' : 'info',
        user: 'admin'
      };
      printerService.addLog(log);
    }
    
    return result;
  },
  
  // Get printer logs
  getPrinterLogs: async (printerId: string): Promise<PrinterLog[]> => {
    try {
      await initializeLogs();
      const logs = await apiService.get<PrinterLog[]>('printerLogs');
      return logs?.filter(log => log.printerId === printerId) || [];
    } catch (error) {
      console.error(`Error fetching logs for printer ${printerId}:`, error);
      toast({
        title: "Error",
        description: "Failed to fetch printer logs. Please try again.",
        variant: "destructive"
      });
      return [];
    }
  },
  
  // Add a new log
  addLog: async (logData: Omit<PrinterLog, 'id'>): Promise<PrinterLog> => {
    try {
      await initializeLogs();
      const logs = await apiService.get<PrinterLog[]>('printerLogs') || [];
      
      const newLog: PrinterLog = {
        ...logData,
        id: `l${Date.now()}`
      };
      
      const updatedLogs = [...logs, newLog];
      await apiService.post('printerLogs', updatedLogs);
      
      return newLog;
    } catch (error) {
      console.error('Error adding log:', error);
      return {
        id: `l${Date.now()}`,
        ...logData
      };
    }
  },
  
  // Get printer activity
  getPrinterActivity: async (printerId: string): Promise<PrinterActivity[]> => {
    try {
      await initializeActivity();
      const activities = await apiService.get<PrinterActivity[]>('printerActivity');
      return activities?.filter(activity => activity.printerId === printerId) || [];
    } catch (error) {
      console.error(`Error fetching activity for printer ${printerId}:`, error);
      toast({
        title: "Error",
        description: "Failed to fetch printer activity. Please try again.",
        variant: "destructive"
      });
      return [];
    }
  },
  
  // Add a new activity
  addActivity: async (activityData: Omit<PrinterActivity, 'id'>): Promise<PrinterActivity> => {
    try {
      await initializeActivity();
      const activities = await apiService.get<PrinterActivity[]>('printerActivity') || [];
      
      const newActivity: PrinterActivity = {
        ...activityData,
        id: `a${Date.now()}`
      };
      
      const updatedActivities = [...activities, newActivity];
      await apiService.post('printerActivity', updatedActivities);
      
      return newActivity;
    } catch (error) {
      console.error('Error adding activity:', error);
      return {
        id: `a${Date.now()}`,
        ...activityData
      };
    }
  },
  
  // Get all logs (for activity page)
  getAllLogs: async (): Promise<PrinterLog[]> => {
    try {
      await initializeLogs();
      const logs = await apiService.get<PrinterLog[]>('printerLogs');
      return logs || [];
    } catch (error) {
      console.error('Error fetching all logs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch logs. Please try again.",
        variant: "destructive"
      });
      return [];
    }
  },
  
  // Get all activities (for activity page)
  getAllActivities: async (): Promise<PrinterActivity[]> => {
    try {
      await initializeActivity();
      const activities = await apiService.get<PrinterActivity[]>('printerActivity');
      return activities || [];
    } catch (error) {
      console.error('Error fetching all activities:', error);
      toast({
        title: "Error",
        description: "Failed to fetch activities. Please try again.",
        variant: "destructive"
      });
      return [];
    }
  },
  
  // Restart printer
  restartPrinter: async (id: string): Promise<boolean> => {
    try {
      // In a real application, this would communicate with the printer
      // For demo purposes, we'll just update the status and return success
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing
      
      // Add log record
      const log: Omit<PrinterLog, 'id'> = {
        printerId: id,
        timestamp: new Date().toISOString(),
        message: "Printer restarted",
        type: "info",
        user: "admin"
      };
      await printerService.addLog(log);
      
      // Add activity record
      const activity: Omit<PrinterActivity, 'id'> = {
        printerId: id,
        timestamp: new Date().toISOString(),
        action: "Printer restarted",
        user: "admin"
      };
      await printerService.addActivity(activity);
      
      return true;
    } catch (error) {
      console.error(`Error restarting printer ${id}:`, error);
      throw error;
    }
  }
};
