
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { PrinterData } from '@/types/printers';
import { addActivity } from '../activityLogService';

interface PrinterFormData {
  name: string;
  model: string;
  location: string;
  department?: string;
  ipAddress?: string;
  serialNumber?: string;
}

// Helper function to generate realistic starting values for new printers
const generateRealisticPrinterValues = () => {
  return {
    status: 'offline', // New printers start offline until connected
    ink_level: 0, // Start with empty ink
    paper_level: 0, // Start with no paper
    job_count: 0, // No jobs processed yet
    supplies: {
      black: 0,
      cyan: 0,
      magenta: 0,
      yellow: 0,
      waste: 0
    },
    stats: {
      dailyPrints: 0,
      weeklyPrints: 0,
      monthlyPrints: 0,
      totalPrints: 0,
      totalPages: 0,
      monthlyPages: 0,
      jams: 0
    }
  };
};

export const addPrinter = async (printerData: PrinterFormData): Promise<string | null> => {
  try {
    console.log('Adding printer:', printerData);
    
    const realisticValues = generateRealisticPrinterValues();
    
    const printerToAdd = {
      name: printerData.name,
      model: printerData.model,
      location: printerData.location,
      department: printerData.department || null,
      ip_address: printerData.ipAddress || null,
      serial_number: printerData.serialNumber || null,
      status: realisticValues.status,
      ink_level: realisticValues.ink_level,
      paper_level: realisticValues.paper_level,
      job_count: realisticValues.job_count,
      last_active: new Date().toISOString(),
      added_date: new Date().toISOString(),
      supplies: realisticValues.supplies,
      stats: realisticValues.stats
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
      details: `New printer "${data.name}" (${data.model}) was added to ${data.location} with initial empty values`,
      status: 'success'
    });

    toast({
      title: "Printer Added",
      description: `${data.name} has been successfully added with initial empty values.`
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
