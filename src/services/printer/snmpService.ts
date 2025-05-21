
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { PrinterData } from '@/types/printers';

// SNMP printer monitoring service
export const snmpService = {
  // Function to poll a printer via SNMP and update its data
  pollPrinter: async (printer: Pick<PrinterData, 'id' | 'name' | 'ipAddress'>): Promise<PrinterData | null> => {
    try {
      if (!printer.ipAddress) {
        toast({
          title: "Error",
          description: "Printer IP address is missing. Cannot poll printer.",
          variant: "destructive"
        });
        return null;
      }
      
      // Call the SNMP edge function
      const { data, error } = await supabase.functions.invoke('printer-monitor', {
        body: {
          ipAddress: printer.ipAddress,
          printerId: printer.id,
          printerName: printer.name
        }
      });
      
      if (error) {
        throw error;
      }
      
      // Automatically trigger a refetch of printer data to reflect the changes
      return data.data;
    } catch (error) {
      console.error(`Error polling printer ${printer.name}:`, error);
      toast({
        title: "Error",
        description: `Failed to connect to printer ${printer.name}. Please check if it's online.`,
        variant: "destructive"
      });
      return null;
    }
  },
  
  // Function to auto-discover printers on the network (this would be a real implementation in production)
  discoverPrinters: async (): Promise<{ ipAddress: string, name: string, model: string }[]> => {
    try {
      // In a real implementation, this would scan the network for printers
      
      const { data, error } = await supabase.functions.invoke('printer-monitor', {
        body: {
          action: 'discover'
        }
      });
      
      if (error) {
        throw error;
      }
      
      return data.printers || [];
    } catch (error) {
      console.error('Error discovering printers:', error);
      toast({
        title: "Error",
        description: "Failed to discover printers on the network.",
        variant: "destructive"
      });
      return [];
    }
  },
  
  // Function to poll all printers in the system
  pollAllPrinters: async (): Promise<void> => {
    try {
      // Get all printers from the database
      const { data: printers, error } = await supabase
        .from('printers')
        .select('id, name, ip_address')
        .not('ip_address', 'is', null);
      
      if (error) {
        throw error;
      }
      
      // Filter out printers without IP addresses
      const printersWithIp = printers.filter(p => p.ip_address);
      
      if (printersWithIp.length === 0) {
        console.log('No printers with IP addresses to poll');
        return;
      }
      
      // Update the status text
      toast({
        title: "Updating printers",
        description: `Polling ${printersWithIp.length} printers for status updates...`
      });
      
      // Poll each printer in sequence
      const results = [];
      for (const printer of printersWithIp) {
        const result = await snmpService.pollPrinter({
          id: printer.id,
          name: printer.name,
          ipAddress: printer.ip_address
        });
        
        if (result) results.push(result);
      }
      
      toast({
        title: "Update Complete",
        description: `Successfully updated ${results.length} of ${printersWithIp.length} printers.`
      });
    } catch (error) {
      console.error('Error polling all printers:', error);
      toast({
        title: "Error",
        description: "Failed to update all printers. Please try again.",
        variant: "destructive"
      });
    }
  }
};
