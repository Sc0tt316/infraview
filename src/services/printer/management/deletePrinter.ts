
import { supabase } from '@/integrations/supabase/client';
import { PrinterData } from '@/types/printers';
import { addActivity } from '../activityLogService';

export const deletePrinter = async (printerId: string): Promise<void> => {
  try {
    // First get the printer info to log it before deletion
    const { data: printerToDelete, error: fetchError } = await supabase
      .from('printers')
      .select('*')
      .eq('id', printerId)
      .single();
    
    if (fetchError) {
      throw fetchError;
    }
    
    if (!printerToDelete) {
      throw new Error(`Printer with id ${printerId} not found`);
    }
    
    // Delete the printer
    const { error: deleteError } = await supabase
      .from('printers')
      .delete()
      .eq('id', printerId);
    
    if (deleteError) {
      throw deleteError;
    }
    
    // Log the activity
    await addActivity({
      printerId,
      printerName: printerToDelete.name,
      timestamp: new Date().toISOString(),
      action: "Printer Deleted",
      user: "admin",
      details: `Deleted printer: ${printerToDelete.name} - ${printerToDelete.model}`
    });
    
  } catch (error) {
    console.error('Error deleting printer:', error);
    throw error;
  }
};
