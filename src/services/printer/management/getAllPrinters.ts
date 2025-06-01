
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { PrinterData } from '@/types/printers';

// Get all printers - no simulation data
export const getAllPrinters = async (): Promise<PrinterData[]> => {
  try {
    const { data, error } = await supabase
      .from('printers')
      .select('*');

    if (error) {
      throw error;
    }

    // Map Supabase data to PrinterData format - use only real data from database
    return data.map(printer => ({
      id: printer.id,
      name: printer.name,
      model: printer.model,
      location: printer.location,
      status: printer.status as 'online' | 'offline' | 'error' | 'warning' | 'maintenance',
      subStatus: printer.sub_status || undefined,
      inkLevel: printer.ink_level || 0,
      paperLevel: printer.paper_level || 0,
      jobCount: printer.job_count,
      lastActive: printer.last_active ? new Date(printer.last_active).toLocaleString() : 'Never',
      ipAddress: printer.ip_address,
      department: printer.department,
      serialNumber: printer.serial_number,
      addedDate: printer.added_date,
      // Use real supplies data from database or empty object
      supplies: printer.supplies ? (typeof printer.supplies === 'string' ? JSON.parse(printer.supplies) : printer.supplies) : {},
      // Use real stats data from database
      stats: printer.stats ? (typeof printer.stats === 'string' ? JSON.parse(printer.stats) : printer.stats) : undefined
    }));
  } catch (error) {
    console.error('Error fetching printers:', error);
    toast({
      title: "Error",
      description: "Failed to fetch printers. Please try again.",
      variant: "destructive"
    });
    return [];
  }
};
