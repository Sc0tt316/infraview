
import { supabase } from '@/integrations/supabase/client';
import { PrinterData } from '@/types/printers';
import { addActivity } from '../activityLogService';

export const updatePrinter = async (
  printerId: string, 
  data: Partial<PrinterData>
): Promise<PrinterData> => {
  try {
    // Convert PrinterData to database format
    const printerData: Record<string, any> = {};
    
    if (data.name !== undefined) printerData.name = data.name;
    if (data.model !== undefined) printerData.model = data.model;
    if (data.location !== undefined) printerData.location = data.location;
    if (data.status !== undefined) printerData.status = data.status;
    if (data.inkLevel !== undefined) printerData.ink_level = data.inkLevel;
    if (data.paperLevel !== undefined) printerData.paper_level = data.paperLevel;
    if (data.ipAddress !== undefined) printerData.ip_address = data.ipAddress;
    if (data.department !== undefined) printerData.department = data.department;
    if (data.serialNumber !== undefined) printerData.serial_number = data.serialNumber;
    
    const { data: updatedPrinter, error } = await supabase
      .from('printers')
      .update(printerData)
      .eq('id', printerId)
      .select('*')
      .single();
    
    if (error) {
      throw error;
    }
    
    // Convert to our PrinterData format
    const result: PrinterData = {
      id: updatedPrinter.id,
      name: updatedPrinter.name,
      model: updatedPrinter.model,
      location: updatedPrinter.location,
      status: updatedPrinter.status as 'online' | 'offline' | 'error' | 'warning' | 'maintenance',
      inkLevel: updatedPrinter.ink_level,
      paperLevel: updatedPrinter.paper_level,
      jobCount: updatedPrinter.job_count || 0,
      lastActive: updatedPrinter.last_active ? new Date(updatedPrinter.last_active).toLocaleString() : 'Never',
      ipAddress: updatedPrinter.ip_address,
      department: updatedPrinter.department,
      serialNumber: updatedPrinter.serial_number,
      addedDate: updatedPrinter.added_date,
    };
    
    // Log the activity
    await addActivity({
      printerId,
      printerName: result.name,
      timestamp: new Date().toISOString(),
      action: "Printer Updated",
      user: "admin",
      details: `Updated printer properties: ${Object.keys(data).join(', ')}`
    });
    
    return result;
  } catch (error) {
    console.error('Error updating printer:', error);
    throw error;
  }
};
