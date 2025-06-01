
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { PrinterData } from '@/types/printers';

// Real SNMP service with no simulation fallbacks
export const snmpService = {
  // Poll a single printer with real SNMP only
  pollPrinter: async (printer: Pick<PrinterData, 'id' | 'name' | 'ipAddress'>): Promise<PrinterData | null> => {
    try {
      if (!printer.ipAddress) {
        console.warn(`No IP address for printer ${printer.name}`);
        toast({
          title: "No IP Address",
          description: `${printer.name} has no IP address configured for SNMP polling.`,
          variant: "destructive"
        });
        return null;
      }
      
      console.log(`Initiating real SNMP poll for ${printer.name} (${printer.ipAddress})`);
      
      // Call the real SNMP printer-monitor function
      const { data, error } = await supabase.functions.invoke('printer-monitor', {
        body: {
          ipAddress: printer.ipAddress,
          printerId: printer.id,
          printerName: printer.name,
          action: 'poll'
        }
      });
      
      if (error) {
        console.error(`Real SNMP error for ${printer.name}:`, error);
        
        // Log failed attempt
        await supabase.from('printer_activities').insert({
          printer_id: printer.id,
          printer_name: printer.name,
          action: 'SNMP Poll Failed',
          details: `Real SNMP communication failed: ${error.message}`,
          status: 'error',
          timestamp: new Date().toISOString()
        });
        
        toast({
          title: "SNMP Communication Failed",
          description: `Failed to communicate with ${printer.name}. The printer may be offline or SNMP may not be configured.`,
          variant: "destructive"
        });
        
        return null;
      }
      
      if (!data || !data.success) {
        console.error(`Real SNMP failed for ${printer.name}:`, data);
        
        toast({
          title: "SNMP Error",
          description: `${printer.name}: ${data?.error || 'Unknown SNMP error'}`,
          variant: "destructive"
        });
        
        return null;
      }
      
      console.log(`Real SNMP poll successful for ${printer.name}:`, {
        method: data.method,
        status: data.data.status,
        supplies: data.data.supplies
      });
      
      return data.data;
    } catch (error) {
      console.error(`SNMP service error for ${printer.name}:`, error);
      
      // Show user-friendly error message
      toast({
        title: "Communication Error",
        description: `Failed to update ${printer.name}. Please check SNMP configuration and network connectivity.`,
        variant: "destructive"
      });
      
      return null;
    }
  },
  
  // Discover printers on the network using real SNMP only
  discoverPrinters: async (): Promise<{ ipAddress: string, name: string, model: string }[]> => {
    try {
      console.log('Starting real SNMP printer discovery...');
      
      toast({
        title: "Discovering Printers",
        description: "Scanning network for SNMP-enabled printers using real SNMP..."
      });
      
      const { data, error } = await supabase.functions.invoke('printer-monitor', {
        body: { action: 'discover' }
      });
      
      if (error) {
        console.error('Real SNMP discovery error:', error);
        toast({
          title: "Discovery Failed", 
          description: "Real SNMP discovery failed. Please check SNMP service configuration.",
          variant: "destructive"
        });
        return [];
      }
      
      if (!data || !data.success) {
        console.warn('Real SNMP discovery returned no results:', data);
        toast({
          title: "No Printers Found",
          description: data?.error || "No SNMP-enabled printers were discovered on the network using real SNMP.",
          variant: "destructive"
        });
        return [];
      }
      
      const printers = data.printers || [];
      console.log(`Real SNMP discovery completed: found ${printers.length} printers`);
      
      if (printers.length > 0) {
        toast({
          title: "Discovery Complete",
          description: `Found ${printers.length} printer${printers.length > 1 ? 's' : ''} on the network using real SNMP.`
        });
      } else {
        toast({
          title: "No Printers Found",
          description: "No SNMP-enabled printers were found. Ensure printers have SNMP enabled and are accessible.",
          variant: "destructive"
        });
      }
      
      return printers;
    } catch (error) {
      console.error('Discovery service error:', error);
      toast({
        title: "Discovery Error",
        description: "An error occurred while scanning for printers using real SNMP.",
        variant: "destructive"
      });
      return [];
    }
  },
  
  // Poll all printers with real SNMP only
  pollAllPrinters: async (): Promise<void> => {
    try {
      console.log('Starting batch real SNMP printer polling...');
      
      // Get all printers with IP addresses
      const { data: printers, error } = await supabase
        .from('printers')
        .select('id, name, ip_address, model')
        .not('ip_address', 'is', null);
      
      if (error) {
        console.error('Database error:', error);
        throw new Error(`Database query failed: ${error.message}`);
      }
      
      const printersWithIp = printers.filter(p => p.ip_address);
      
      if (printersWithIp.length === 0) {
        toast({
          title: "No Printers to Update",
          description: "No printers with IP addresses found for SNMP polling."
        });
        return;
      }
      
      console.log(`Real SNMP polling ${printersWithIp.length} printers...`);
      
      toast({
        title: "Updating Printers",
        description: `Polling ${printersWithIp.length} printers using real SNMP...`
      });
      
      // Process printers in smaller batches to avoid overwhelming the network
      const batchSize = 3; // Reduced batch size for real SNMP
      const results = [];
      const errors = [];
      
      for (let i = 0; i < printersWithIp.length; i += batchSize) {
        const batch = printersWithIp.slice(i, i + batchSize);
        
        console.log(`Processing real SNMP batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(printersWithIp.length / batchSize)}`);
        
        // Process batch in parallel
        const batchPromises = batch.map(async (printer) => {
          try {
            const result = await snmpService.pollPrinter({
              id: printer.id,
              name: printer.name,
              ipAddress: printer.ip_address
            });
            
            if (result) {
              results.push(printer.name);
              return { success: true, printer: printer.name };
            } else {
              errors.push(printer.name);
              return { success: false, printer: printer.name };
            }
          } catch (error) {
            console.error(`Real SNMP batch error for ${printer.name}:`, error);
            errors.push(printer.name);
            return { success: false, printer: printer.name };
          }
        });
        
        await Promise.all(batchPromises);
        
        // Delay between batches to prevent network congestion
        if (i + batchSize < printersWithIp.length) {
          await new Promise(resolve => setTimeout(resolve, 2000)); // Increased delay for real SNMP
        }
      }
      
      // Report results
      console.log(`Real SNMP batch polling complete: ${results.length} successful, ${errors.length} failed`);
      
      if (errors.length === 0) {
        toast({
          title: "Update Complete",
          description: `Successfully updated all ${results.length} printers using real SNMP.`
        });
      } else if (results.length === 0) {
        toast({
          title: "Update Failed",
          description: "Failed to update any printers using real SNMP. Check SNMP configuration and network connectivity.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Update Partially Complete",
          description: `Updated ${results.length} of ${printersWithIp.length} printers using real SNMP. ${errors.length} printers could not be reached.`,
          variant: "destructive"
        });
      }
      
    } catch (error) {
      console.error('Real SNMP batch polling error:', error);
      toast({
        title: "Batch Update Failed",
        description: "An error occurred while updating printers using real SNMP.",
        variant: "destructive"
      });
    }
  },
  
  // Test real SNMP connectivity to a specific IP
  testConnection: async (ipAddress: string): Promise<boolean> => {
    try {
      console.log(`Testing real SNMP connectivity to ${ipAddress}`);
      
      const { data, error } = await supabase.functions.invoke('printer-monitor', {
        body: {
          ipAddress,
          action: 'poll'
        }
      });
      
      if (error || !data || !data.success) {
        console.log(`Real SNMP connection test failed for ${ipAddress}:`, error || data);
        return false;
      }
      
      console.log(`Real SNMP connection test successful for ${ipAddress}`);
      return true;
    } catch (error) {
      console.error(`Real SNMP connection test error for ${ipAddress}:`, error);
      return false;
    }
  }
};
