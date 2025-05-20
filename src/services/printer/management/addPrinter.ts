
import { supabase } from '@/integrations/supabase/client';
import { PrinterData } from '@/types/printers';
import { addActivity } from '../activityLogService';

export const addPrinter = async (data: Omit<PrinterData, "id" | "jobCount" | "lastActive">): Promise<PrinterData> => {
  try {
    // Prepare data for Supabase (convert from camelCase to snake_case)
    const printerData = {
      name: data.name,
      model: data.model,
      location: data.location,
      status: data.status,
      ink_level: data.inkLevel,
      paper_level: data.paperLevel,
      ip_address: data.ipAddress,
      department: data.department,
      serial_number: data.serialNumber,
      job_count: 0
    };
    
    const { data: insertedPrinter, error } = await supabase
      .from('printers')
      .insert(printerData)
      .select('*')
      .single();
    
    if (error) {
      throw error;
    }
    
    // Convert to our PrinterData format
    const newPrinter: PrinterData = {
      id: insertedPrinter.id,
      name: insertedPrinter.name,
      model: insertedPrinter.model,
      location: insertedPrinter.location,
      status: insertedPrinter.status as 'online' | 'offline' | 'error' | 'warning' | 'maintenance',
      inkLevel: insertedPrinter.ink_level,
      paperLevel: insertedPrinter.paper_level,
      jobCount: insertedPrinter.job_count || 0,
      lastActive: insertedPrinter.last_active ? new Date(insertedPrinter.last_active).toLocaleString() : 'Never',
      ipAddress: insertedPrinter.ip_address,
      department: insertedPrinter.department,
      serialNumber: insertedPrinter.serial_number,
      addedDate: insertedPrinter.added_date,
    };
    
    // Log the activity
    await addActivity({
      printerId: newPrinter.id,
      printerName: newPrinter.name,
      timestamp: new Date().toISOString(),
      action: "Printer Added",
      user: "admin",
      details: `Added new printer: ${newPrinter.name} - ${newPrinter.model}`
    });
    
    return newPrinter;
  } catch (error) {
    console.error('Error adding printer:', error);
    throw error;
  }
};
