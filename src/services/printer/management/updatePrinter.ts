
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { PrinterData } from '@/types/printers';
import { addActivity } from '../activityLogService';

// Update an existing printer in the database
export const updatePrinter = async (id: string, printerData: Partial<PrinterData>): Promise<boolean> => {
  try {
    const updateData: any = {};
    
    // Map PrinterData fields to database fields
    if (printerData.name !== undefined) updateData.name = printerData.name;
    if (printerData.model !== undefined) updateData.model = printerData.model;
    if (printerData.location !== undefined) updateData.location = printerData.location;
    if (printerData.status !== undefined) updateData.status = printerData.status;
    if (printerData.inkLevel !== undefined) updateData.ink_level = printerData.inkLevel;
    if (printerData.paperLevel !== undefined) updateData.paper_level = printerData.paperLevel;
    if (printerData.ipAddress !== undefined) updateData.ip_address = printerData.ipAddress;
    if (printerData.department !== undefined) updateData.department = printerData.department;
    if (printerData.serialNumber !== undefined) updateData.serial_number = printerData.serialNumber;
    if (printerData.jobCount !== undefined) updateData.job_count = printerData.jobCount;
    
    // Always update the last_active timestamp when updating
    updateData.last_active = new Date().toISOString();

    const { error } = await supabase
      .from('printers')
      .update(updateData)
      .eq('id', id);

    if (error) {
      throw error;
    }

    // Log the activity
    await addActivity({
      printerId: id,
      printerName: printerData.name || 'Unknown',
      timestamp: new Date().toISOString(),
      action: "Printer Updated",
      user: "admin",
      details: `Printer configuration updated`,
      status: "success"
    });

    return true;
  } catch (error) {
    console.error('Error updating printer:', error);
    toast({
      title: "Error",
      description: "Failed to update printer. Please try again.",
      variant: "destructive"
    });
    return false;
  }
};
