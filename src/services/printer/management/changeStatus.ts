
import { supabase } from '@/integrations/supabase/client';
import { PrinterData } from '@/types/printers';
import { addLog } from '../activityLogService';

export const changeStatus = async (printerId: string, newStatus: "warning" | "error" | "online" | "offline" | "maintenance"): Promise<void> => {
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
    
    // Update the printer status
    const { error: updateError } = await supabase
      .from('printers')
      .update({ status: newStatus })
      .eq('id', printerId);
    
    if (updateError) {
      throw updateError;
    }
    
    // Log the status change
    await addLog({
      printerId,
      timestamp: new Date().toISOString(),
      status: 'completed',
      user: 'admin',
      fileName: `Status change to ${newStatus}`,
      pages: 0,
      size: '0KB'
    });
    
  } catch (error) {
    console.error(`Error changing printer status for ${printerId}:`, error);
    throw error;
  }
};
