
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

// Helper function to generate random values
const generateRandomPrinterValues = () => {
  const statuses = ['online', 'offline', 'warning', 'error', 'maintenance'];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  
  return {
    status: randomStatus,
    ink_level: Math.floor(Math.random() * 101), // 0-100
    paper_level: Math.floor(Math.random() * 101), // 0-100
    job_count: Math.floor(Math.random() * 1000), // 0-999
    supplies: {
      black: Math.floor(Math.random() * 101),
      cyan: Math.floor(Math.random() * 101),
      magenta: Math.floor(Math.random() * 101),
      yellow: Math.floor(Math.random() * 101),
      waste: Math.floor(Math.random() * 101)
    },
    stats: {
      dailyPrints: Math.floor(Math.random() * 100),
      weeklyPrints: Math.floor(Math.random() * 500),
      monthlyPrints: Math.floor(Math.random() * 2000),
      totalPrints: Math.floor(Math.random() * 10000),
      totalPages: Math.floor(Math.random() * 50000),
      monthlyPages: Math.floor(Math.random() * 10000),
      jams: Math.floor(Math.random() * 20)
    }
  };
};

export const addPrinter = async (printerData: PrinterFormData): Promise<string | null> => {
  try {
    console.log('Adding printer:', printerData);
    
    const randomValues = generateRandomPrinterValues();
    
    const printerToAdd = {
      name: printerData.name,
      model: printerData.model,
      location: printerData.location,
      department: printerData.department || null,
      ip_address: printerData.ipAddress || null,
      serial_number: printerData.serialNumber || null,
      status: randomValues.status,
      ink_level: randomValues.ink_level,
      paper_level: randomValues.paper_level,
      job_count: randomValues.job_count,
      last_active: new Date().toISOString(),
      added_date: new Date().toISOString(),
      supplies: randomValues.supplies,
      stats: randomValues.stats
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
      details: `New printer "${data.name}" (${data.model}) was added to ${data.location} with randomly generated values`,
      status: 'success'
    });

    toast({
      title: "Printer Added",
      description: `${data.name} has been successfully added with random values.`
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
