
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { PrinterData } from '@/types/printers';

// Enhanced SNMP printer monitoring service with better error handling and response processing
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
      
      // Call the SNMP edge function with improved error handling
      const { data, error } = await supabase.functions.invoke('printer-monitor', {
        body: {
          ipAddress: printer.ipAddress,
          printerId: printer.id,
          printerName: printer.name,
          action: 'poll'
        }
      });
      
      if (error) {
        console.error('SNMP function error:', error);
        throw new Error(`SNMP function error: ${error.message}`);
      }
      
      if (!data || !data.data) {
        throw new Error('Invalid response from SNMP function');
      }
      
      console.log("SNMP response:", data);
      
      // Return the data received from the edge function
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
  
  // Function to auto-discover printers on the network with improved error handling
  discoverPrinters: async (): Promise<{ ipAddress: string, name: string, model: string }[]> => {
    try {
      console.log('Starting printer discovery...');
      
      // Call the SNMP edge function with discover action
      const { data, error } = await supabase.functions.invoke('printer-monitor', {
        body: {
          action: 'discover'
        }
      });
      
      if (error) {
        console.error('SNMP discovery error:', error);
        throw new Error(`SNMP discovery error: ${error.message}`);
      }
      
      if (!data || !data.printers) {
        console.warn('No printers discovered or invalid response format');
        return [];
      }
      
      console.log(`Discovered ${data.printers.length} printers:`, data.printers);
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
  
  // Function to poll all printers in the system with improved filtering and error handling
  pollAllPrinters: async (): Promise<void> => {
    try {
      console.log('Starting to poll all printers...');
      
      // Get all printers from the database that have IP addresses
      const { data: printers, error } = await supabase
        .from('printers')
        .select('id, name, ip_address')
        .not('ip_address', 'is', null);
      
      if (error) {
        console.error('Database query error:', error);
        throw new Error(`Database query error: ${error.message}`);
      }
      
      // Filter out printers without IP addresses (though we already filtered above)
      const printersWithIp = printers.filter(p => p.ip_address);
      
      if (printersWithIp.length === 0) {
        console.log('No printers with IP addresses to poll');
        toast({
          title: "Information",
          description: "No printers with IP addresses found to update."
        });
        return;
      }
      
      // Update the status text
      toast({
        title: "Updating printers",
        description: `Polling ${printersWithIp.length} printers for status updates...`
      });
      
      console.log(`Polling ${printersWithIp.length} printers...`);
      
      // Poll each printer in sequence with better error handling
      const results = [];
      const errors = [];
      
      for (const printer of printersWithIp) {
        try {
          console.log(`Polling printer: ${printer.name} (${printer.ip_address})`);
          const result = await snmpService.pollPrinter({
            id: printer.id,
            name: printer.name,
            ipAddress: printer.ip_address
          });
          
          if (result) {
            results.push(result);
            console.log(`Successfully polled printer: ${printer.name}`);
          } else {
            errors.push(printer.name);
            console.error(`Failed to poll printer: ${printer.name}`);
          }
        } catch (error) {
          errors.push(printer.name);
          console.error(`Error polling printer ${printer.name}:`, error);
        }
      }
      
      // Show appropriate toast based on results
      if (errors.length === 0) {
        toast({
          title: "Update Complete",
          description: `Successfully updated all ${results.length} printers.`
        });
      } else if (results.length === 0) {
        toast({
          title: "Update Failed",
          description: "Failed to update any printers. Please check their connections.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Update Partially Complete",
          description: `Updated ${results.length} of ${printersWithIp.length} printers. Some printers could not be reached.`,
          variant: "destructive" // Changed from "warning" to "destructive"
        });
      }
    } catch (error) {
      console.error('Error polling all printers:', error);
      toast({
        title: "Error",
        description: "Failed to update printers. Please try again.",
        variant: "destructive"
      });
    }
  }
};
