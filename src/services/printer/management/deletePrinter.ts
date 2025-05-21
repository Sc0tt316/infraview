
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { addActivity } from '../activityLogService';

export const deletePrinter = async (printerId: string): Promise<boolean> => {
  try {
    // First get the printer info to log it before deletion
    const { data: printerToDelete, error: fetchError } = await supabase
      .from('printers')
      .select('*')
      .eq('id', printerId)
      .single();
    
    if (fetchError) {
      console.error('Error fetching printer for deletion:', fetchError);
      throw fetchError;
    }
    
    if (!printerToDelete) {
      throw new Error(`Printer with id ${printerId} not found`);
    }
    
    // Delete related printer activities
    const { error: activitiesError } = await supabase
      .from('printer_activities')
      .delete()
      .eq('printer_id', printerId);
    
    if (activitiesError) {
      console.error('Error deleting printer activities:', activitiesError);
      // Don't throw here, continue with deletion attempt
    }
    
    // Delete related printer logs
    const { error: logsError } = await supabase
      .from('printer_logs')
      .delete()
      .eq('printer_id', printerId);
      
    if (logsError) {
      console.error('Error deleting printer logs:', logsError);
      // Don't throw here, continue with deletion attempt
    }
    
    // Now delete the printer
    const { error: deleteError } = await supabase
      .from('printers')
      .delete()
      .eq('id', printerId);
    
    if (deleteError) {
      console.error('Error deleting printer:', deleteError);
      throw deleteError;
    }
    
    // Log the activity (to a general activity log, not printer-specific)
    await addActivity({
      printerId: "system", // Use system ID since the printer is now deleted
      printerName: printerToDelete.name,
      timestamp: new Date().toISOString(),
      action: "Printer Deleted",
      user: "admin",
      details: `Deleted printer: ${printerToDelete.name} - ${printerToDelete.model}`
    }).catch(err => console.error('Failed to log printer deletion:', err));
    
    toast({
      title: "Printer Deleted",
      description: `${printerToDelete.name} has been successfully deleted.`
    });
    
    return true;
    
  } catch (error) {
    console.error('Error deleting printer:', error);
    toast({
      title: "Deletion Failed",
      description: `Failed to delete printer: ${error.message || "Unknown error"}`,
      variant: "destructive"
    });
    return false;
  }
};
