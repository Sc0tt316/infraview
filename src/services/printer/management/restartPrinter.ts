
import { supabase } from '@/integrations/supabase/client';
import { PrinterData } from '@/types/printers';
import { addActivity } from '../activityLogService';

export const restartPrinter = async (printerId: string): Promise<void> => {
  try {
    // Get printer details first
    const { data: printer, error: fetchError } = await supabase
      .from('printers')
      .select('name')
      .eq('id', printerId)
      .single();
    
    if (fetchError) {
      throw fetchError;
    }
    
    if (!printer) {
      throw new Error(`Printer with id ${printerId} not found`);
    }
    
    // Log the activity
    await addActivity({
      printerId,
      printerName: printer.name,
      timestamp: new Date().toISOString(),
      action: "Printer Restarted",
      user: "admin"
    });
    
    // In a real app, this would actually restart the printer
    // For this simulation, we'll just return
    
  } catch (error) {
    console.error('Error restarting printer:', error);
    throw error;
  }
};
