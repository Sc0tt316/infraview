
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { addActivity } from '../activityLogService';

// Function to delete a printer from the database
export const deletePrinter = async (printerId: string, printerName: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('printers')
      .delete()
      .eq('id', printerId);
    
    if (error) {
      throw error;
    }
    
    // Log the activity
    await addActivity({
      printerId,
      printerName,
      action: 'Printer Deleted',
      timestamp: new Date().toISOString(),
      details: `Printer "${printerName}" was deleted from the system`,
      status: 'info'
    });

    // Show success notification
    toast({
      title: 'Printer Deleted',
      description: `${printerName} has been successfully removed.`
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting printer:', error);
    
    // Show error notification
    toast({
      title: 'Error',
      description: 'Failed to delete printer. Please try again.',
      variant: 'destructive'
    });
    
    return false;
  }
};
