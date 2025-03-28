
import { apiService } from './api';
import { toast } from '@/hooks/use-toast';

// Define printer types
export interface PrinterData {
  id: string;
  name: string;
  model: string;
  location: string;
  status: "online" | "offline" | "error" | "maintenance";
  inkLevel: number;
  paperLevel: number;
  jobCount: number;
  lastActive: string;
  ipAddress?: string;
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
        ipAddress: "192.168.1.101"
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
        ipAddress: "192.168.1.102"
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
        ipAddress: "192.168.1.103"
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
        ipAddress: "192.168.1.104"
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
        ipAddress: "192.168.1.105"
      },
    ];
    await apiService.post('printers', mockPrinters);
    return mockPrinters;
  }
  return existingPrinters;
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
    return printerService.updatePrinter(id, { status });
  },
};
