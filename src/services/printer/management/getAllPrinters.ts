
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { PrinterData } from '@/types/printers';

// Get all printers
export const getAllPrinters = async (): Promise<PrinterData[]> => {
  try {
    const { data, error } = await supabase
      .from('printers')
      .select('*');

    if (error) {
      throw error;
    }

    // Map Supabase data to PrinterData format
    return data.map(printer => ({
      id: printer.id,
      name: printer.name,
      model: printer.model,
      location: printer.location,
      status: printer.status as 'online' | 'offline' | 'error' | 'warning' | 'maintenance',
      inkLevel: printer.ink_level,
      paperLevel: printer.paper_level,
      jobCount: printer.job_count,
      lastActive: printer.last_active ? new Date(printer.last_active).toLocaleString() : 'Never',
      ipAddress: printer.ip_address,
      department: printer.department,
      serialNumber: printer.serial_number,
      addedDate: printer.added_date,
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
