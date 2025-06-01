
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { PrinterData, SuppliesData } from '@/types/printers';

// Get a single printer by ID - no simulation
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
    
    // Parse supplies data from JSON if it exists - no default simulation data
    let supplies: SuppliesData | undefined;
    try {
      if (data.supplies && typeof data.supplies === 'string') {
        supplies = JSON.parse(data.supplies);
      } else if (data.supplies && typeof data.supplies === 'object' && !Array.isArray(data.supplies)) {
        supplies = data.supplies as unknown as SuppliesData;
      } else {
        // No supplies data available - will need real SNMP to populate
        supplies = undefined;
      }
    } catch (e) {
      console.warn('Failed to parse supplies data:', e);
      supplies = undefined;
    }
    
    // Parse stats data from JSON if it exists - no simulation
    let stats;
    try {
      if (data.stats && typeof data.stats === 'string') {
        stats = JSON.parse(data.stats);
      } else if (data.stats && typeof data.stats === 'object' && !Array.isArray(data.stats)) {
        stats = data.stats;
      } else {
        stats = undefined;
      }
    } catch (e) {
      console.warn('Failed to parse stats data:', e);
      stats = undefined;
    }
    
    // Map Supabase data to PrinterData format - use only real data
    const printer: PrinterData = {
      id: data.id,
      name: data.name,
      model: data.model,
      location: data.location,
      status: data.status as 'online' | 'offline' | 'error' | 'warning' | 'maintenance',
      subStatus: data.sub_status || undefined,
      inkLevel: data.ink_level || 0,
      paperLevel: data.paper_level || 0,
      jobCount: data.job_count,
      lastActive: data.last_active ? new Date(data.last_active).toLocaleString() : 'Never',
      ipAddress: data.ip_address,
      department: data.department,
      serialNumber: data.serial_number,
      addedDate: data.added_date,
      supplies: supplies,
      stats: stats,
    };
    
    // No auto-detection or level updates - use only real SNMP data
    return printer;
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
