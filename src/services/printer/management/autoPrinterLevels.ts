
import { PrinterData } from '@/types/printers';

// Auto-detection of printer ink and paper levels
export const detectPrinterLevels = async (printerId: string): Promise<{ inkLevel: number, paperLevel: number }> => {
  try {
    // In a real application, this would connect to printer APIs or services
    // For demo purposes, we're simulating level detection with semi-random values
    
    // Generate a value between 5-95% that changes gradually over time
    // This creates a more realistic simulation of depleting supplies
    const now = new Date();
    const dayFactor = now.getDate() + now.getHours() / 24;
    
    // Generate a unique but consistent base value for each printer
    const printerFactor = parseInt(printerId.replace(/\D/g, '')) % 100;
    
    // Calculate levels with some variation
    const baseInkLevel = (printerFactor + dayFactor) % 100;
    const basePaperLevel = (printerFactor + dayFactor + 30) % 100;
    
    // Apply some smoothing and constraints
    const inkLevel = Math.max(5, Math.min(95, Math.round(baseInkLevel)));
    const paperLevel = Math.max(5, Math.min(95, Math.round(basePaperLevel)));
    
    return { inkLevel, paperLevel };
  } catch (error) {
    console.error("Error detecting printer levels:", error);
    return { inkLevel: 50, paperLevel: 50 }; // Fallback values
  }
};

// Update printer levels automatically
export const updatePrinterLevels = async (printer: PrinterData): Promise<Partial<PrinterData>> => {
  const levels = await detectPrinterLevels(printer.id);
  
  return {
    ...printer,
    inkLevel: levels.inkLevel,
    paperLevel: levels.paperLevel
  };
};
