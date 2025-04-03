
import { apiService } from '../api';
import { toast } from '@/hooks/use-toast';
import { PrinterData } from '@/types/printers';
import { initializePrinters } from './mockDataService';
import { addActivity, addLog } from './activityLogService';

// Get all printers
export const getAllPrinters = async (): Promise<PrinterData[]> => {
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
};

// Get printer by ID
export const getPrinterById = async (id: string): Promise<PrinterData | null> => {
  try {
    const printers = await getAllPrinters();
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
};

// Add new printer
export const addPrinter = async (printerData: Omit<PrinterData, 'id' | 'jobCount' | 'lastActive'>): Promise<PrinterData> => {
  try {
    const printers = await getAllPrinters();
    
    const newPrinter: PrinterData = {
      ...printerData,
      id: `p${Date.now()}`,
      jobCount: 0,
      lastActive: "Just added"
    };
    
    const updatedPrinters = [...printers, newPrinter];
    await apiService.post('printers', updatedPrinters);
    
    // Add activity record
    await addActivity({
      printerId: newPrinter.id,
      timestamp: new Date().toISOString(),
      action: "Printer added",
      user: "admin",
      details: `Added printer ${newPrinter.name} (${newPrinter.model})`
    });
    
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
};

// Update printer
export const updatePrinter = async (id: string, updateData: Partial<PrinterData>): Promise<PrinterData | null> => {
  try {
    const printers = await getAllPrinters();
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
    await addActivity({
      printerId: id,
      timestamp: new Date().toISOString(),
      action: "Printer updated",
      user: "admin",
      details: `Updated printer ${updatedPrinter.name}`
    });
    
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
};

// Delete printer
export const deletePrinter = async (id: string): Promise<boolean> => {
  try {
    const printers = await getAllPrinters();
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
    await addActivity({
      printerId: id,
      timestamp: new Date().toISOString(),
      action: "Printer deleted",
      user: "admin",
      details: `Deleted printer ${printerName}`
    });
    
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
};

// Change printer status
export const changeStatus = async (id: string, status: PrinterData['status']): Promise<PrinterData | null> => {
  const result = await updatePrinter(id, { status });
  
  if (result) {
    // Add log record
    await addLog({
      printerId: id,
      timestamp: new Date().toISOString(),
      message: `Status changed to ${status}`,
      type: status === 'error' ? 'error' : 'info',
      user: 'admin'
    });
  }
  
  return result;
};

// Restart printer
export const restartPrinter = async (id: string): Promise<boolean> => {
  try {
    // In a real application, this would communicate with the printer
    // For demo purposes, we'll just update the status and return success
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing
    
    // Add log record
    await addLog({
      printerId: id,
      timestamp: new Date().toISOString(),
      message: "Printer restarted",
      type: "info",
      user: "admin"
    });
    
    // Add activity record
    await addActivity({
      printerId: id,
      timestamp: new Date().toISOString(),
      action: "Printer restarted",
      user: "admin"
    });
    
    return true;
  } catch (error) {
    console.error(`Error restarting printer ${id}:`, error);
    throw error;
  }
};
