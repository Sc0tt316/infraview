
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { PrinterData } from '@/types/printers';

// Get printer by ID
export const getPrinterById = async (id: string): Promise<PrinterData | null> => {
  try {
    const { data, error } = await supabase
      .from('printers')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }

    // Map Supabase data to PrinterData format
    return {
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
  } catch (error) {
    console.error(`Error fetching printer ${id}:`, error);
    toast({
      title: "Error",
      description: "Failed to fetch printer details. Please try again.",
      variant: "destructive"
    });
    return null;
  }
};
