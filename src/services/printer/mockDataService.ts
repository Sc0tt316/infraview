
import { apiService } from '../api';
import { PrinterData, PrinterLog, PrinterActivity } from '@/types/printers';

// Initialize with mock data if none exists
export const initializePrinters = async (): Promise<PrinterData[]> => {
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
export const initializeLogs = async (): Promise<PrinterLog[]> => {
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
export const initializeActivity = async (): Promise<PrinterActivity[]> => {
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
