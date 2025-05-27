
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { PrinterData } from '@/types/printers';
import { addActivity } from '../activityLogService';

// Add a new printer to the database
export const addPrinter = async (printerData: Omit<PrinterData, 'id'>): Promise<PrinterData | null> => {
  try {
    const { data, error } = await supabase
      .from('printers')
      .insert({
        name: printerData.name,
        model: printerData.model,
        location: printerData.location,
        status: 'offline', // Always start as offline
        ink_level: 0, // Will be auto-detected
        paper_level: 0, // Will be auto-detected
        ip_address: printerData.ipAddress || null,
        department: printerData.department || null,
        serial_number: printerData.serialNumber || null,
        job_count: 0,
        last_active: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Log the activity
    await addActivity({
      printerId: data.id,
      printerName: printerData.name,
      timestamp: new Date().toISOString(),
      action: "Printer Added",
      user: "admin",
      details: `New printer "${printerData.name}" added to the system`,
      status: "success"
    });

    // Convert database format to PrinterData format
    const newPrinter: PrinterData = {
      id: data.id,
      name: data.name,
      model: data.model,
      location: data.location,
      status: data.status as 'online' | 'offline' | 'error' | 'warning' | 'maintenance',
      inkLevel: data.ink_level,
      paperLevel: data.paper_level,
      jobCount: data.job_count,
      lastActive: data.last_active ? new Date(data.last_active).toLocaleString() : 'Never',
      ipAddress: data.ip_address,
      department: data.department,
      serialNumber: data.serial_number,
      addedDate: data.added_date,
    };

    return newPrinter;
  } catch (error) {
    console.error('Error adding printer:', error);
    toast({
      title: "Error",
      description: "Failed to add printer. Please try again.",
      variant: "destructive"
    });
    return null;
  }
};
