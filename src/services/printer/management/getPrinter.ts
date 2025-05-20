
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { PrinterData } from '@/types/printers';
import { updatePrinterLevels } from './autoPrinterLevels';

// Get a single printer by ID
export const getPrinter = async (id: string): Promise<PrinterData | undefined> => {
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
      return undefined;
    }
    
    // Map Supabase data to PrinterData format
    const printer: PrinterData = {
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
    
    // Auto-detect and update ink and paper levels
    const updatedPrinter = await updatePrinterLevels(printer);
    
    return updatedPrinter as PrinterData;
  } catch (error) {
    console.error(`Error fetching printer ${id}:`, error);
    toast({
      title: "Error",
      description: "Failed to load printer details. Please try again.",
      variant: "destructive"
    });
    return undefined;
  }
};
