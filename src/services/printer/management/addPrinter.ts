
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { PrinterFormData } from '@/types/printers';
import { addActivity } from '../activityLogService';

export const addPrinter = async (printerData: PrinterFormData): Promise<string | null> => {
  try {
    console.log('Adding printer:', printerData);
    
    const printerToAdd = {
      name: printerData.name,
      model: printerData.model,
      location: printerData.location,
      department: printerData.department || null,
      ip_address: printerData.ipAddress || null,
      serial_number: printerData.serialNumber || null,
      status: 'offline',
      ink_level: 100,
      paper_level: 100,
      job_count: 0,
      last_active: new Date().toISOString(),
      added_date: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('printers')
      .insert(printerToAdd)
      .select('*')
      .single();

    if (error) {
      console.error('Error adding printer:', error);
      throw error;
    }

    console.log('Printer added successfully:', data);

    // Log the activity
    await addActivity({
      printerId: data.id,
      printerName: data.name,
      action: 'Printer Added',
      timestamp: new Date().toISOString(),
      details: `New printer "${data.name}" (${data.model}) was added to ${data.location}`,
      status: 'success'
    });

    toast({
      title: "Printer Added",
      description: `${data.name} has been successfully added.`
    });

    return data.id;
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
