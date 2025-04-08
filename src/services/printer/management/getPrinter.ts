
import { PrinterData } from '@/types/printers';
import { apiService } from '@/services/api';

export const getPrinter = async (id: string): Promise<PrinterData> => {
  try {
    // Try to get printer from local storage
    const allPrinters: PrinterData[] | null = await apiService.get('printers');
    
    // Find printer by id
    const printer = allPrinters?.find((p) => p.id === id);
    
    if (printer) {
      // Add default values if they don't exist
      return {
        id: printer.id,
        name: printer.name,
        model: printer.model,
        location: printer.location,
        status: printer.status,
        inkLevel: printer.inkLevel,
        paperLevel: printer.paperLevel,
        ipAddress: printer.ipAddress,
        department: printer.department,
        jobCount: printer.jobCount || 0,
        lastActive: printer.lastActive || new Date().toISOString()
      };
    }

    // If printer not found, throw error
    throw new Error(`Printer with ID ${id} not found`);
  } catch (error) {
    console.error(`Error fetching printer with ID ${id}:`, error);
    // Return default printer data (this should be handled better in a real application)
    throw error;
  }
};
