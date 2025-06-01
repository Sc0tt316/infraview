
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { PrinterData } from '@/types/printers';

// Enhanced SNMP service with comprehensive printer support
export const snmpService = {
  // Poll a single printer with detailed error handling and manufacturer support
  pollPrinter: async (printer: Pick<PrinterData, 'id' | 'name' | 'ipAddress'>): Promise<PrinterData | null> => {
    try {
      if (!printer.ipAddress) {
        console.warn(`No IP address for printer ${printer.name}`);
        return null;
      }
      
      console.log(`Initiating SNMP poll for ${printer.name} (${printer.ipAddress})`);
      
      // Call the enhanced printer-monitor function
      const { data, error } = await supabase.functions.invoke('printer-monitor', {
        body: {
          ipAddress: printer.ipAddress,
          printerId: printer.id,
          printerName: printer.name,
          action: 'poll'
        }
      });
      
      if (error) {
        console.error(`SNMP error for ${printer.name}:`, error);
        
        // Log failed attempt
        await supabase.from('printer_activities').insert({
          printer_id: printer.id,
          printer_name: printer.name,
          action: 'SNMP Poll Failed',
          details: `Communication failed: ${error.message}`,
          status: 'error',
          timestamp: new Date().toISOString()
        });
        
        return null;
      }
      
      if (!data || !data.success || !data.data) {
        console.error(`Invalid SNMP response for ${printer.name}:`, data);
        return null;
      }
      
      console.log(`SNMP poll successful for ${printer.name}:`, {
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
        description: `Failed to update ${printer.name}. The printer may be offline or unreachable.`,
        variant: "destructive"
      });
      
      return null;
    }
  },
  
  // Discover printers on the network using multiple protocols
  discoverPrinters: async (): Promise<{ ipAddress: string, name: string, model: string }[]> => {
    try {
      console.log('Starting comprehensive printer discovery...');
      
      toast({
        title: "Discovering Printers",
        description: "Scanning network for SNMP-enabled printers..."
      });
      
      const { data, error } = await supabase.functions.invoke('printer-monitor', {
        body: { action: 'discover' }
      });
      
      if (error) {
        console.error('Discovery error:', error);
        toast({
          title: "Discovery Failed", 
          description: "Unable to scan network for printers.",
          variant: "destructive"
        });
        return [];
      }
      
      if (!data || !data.success) {
        console.warn('Discovery returned no results');
        toast({
          title: "No Printers Found",
          description: "No SNMP-enabled printers were discovered on the network."
        });
        return [];
      }
      
      const printers = data.printers || [];
      console.log(`Discovery completed: found ${printers.length} printers`);
      
      if (printers.length > 0) {
        toast({
          title: "Discovery Complete",
          description: `Found ${printers.length} printer${printers.length > 1 ? 's' : ''} on the network.`
        });
      }
      
      return printers;
    } catch (error) {
      console.error('Discovery service error:', error);
      toast({
        title: "Discovery Error",
        description: "An error occurred while scanning for printers.",
        variant: "destructive"
      });
      return [];
    }
  },
  
  // Poll all printers with enhanced reporting and batch processing
  pollAllPrinters: async (): Promise<void> => {
    try {
      console.log('Starting batch printer polling...');
      
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
          description: "No printers with IP addresses found."
        });
        return;
      }
      
      console.log(`Polling ${printersWithIp.length} printers...`);
      
      toast({
        title: "Updating Printers",
        description: `Polling ${printersWithIp.length} printers for current status...`
      });
      
      // Process printers in smaller batches to avoid overwhelming the network
      const batchSize = 5;
      const results = [];
      const errors = [];
      
      for (let i = 0; i < printersWithIp.length; i += batchSize) {
        const batch = printersWithIp.slice(i, i + batchSize);
        
        console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(printersWithIp.length / batchSize)}`);
        
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
            console.error(`Batch error for ${printer.name}:`, error);
            errors.push(printer.name);
            return { success: false, printer: printer.name };
          }
        });
        
        await Promise.all(batchPromises);
        
        // Small delay between batches to prevent network congestion
        if (i + batchSize < printersWithIp.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      // Report results
      console.log(`Batch polling complete: ${results.length} successful, ${errors.length} failed`);
      
      if (errors.length === 0) {
        toast({
          title: "Update Complete",
          description: `Successfully updated all ${results.length} printers.`
        });
      } else if (results.length === 0) {
        toast({
          title: "Update Failed",
          description: "Failed to update any printers. Check network connectivity.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Update Partially Complete",
          description: `Updated ${results.length} of ${printersWithIp.length} printers. ${errors.length} printers could not be reached.`,
          variant: "destructive"
        });
      }
      
    } catch (error) {
      console.error('Batch polling error:', error);
      toast({
        title: "Batch Update Failed",
        description: "An error occurred while updating printers.",
        variant: "destructive"
      });
    }
  },
  
  // Test SNMP connectivity to a specific IP
  testConnection: async (ipAddress: string): Promise<boolean> => {
    try {
      console.log(`Testing SNMP connectivity to ${ipAddress}`);
      
      const { data, error } = await supabase.functions.invoke('printer-monitor', {
        body: {
          ipAddress,
          action: 'poll'
        }
      });
      
      if (error || !data || !data.success) {
        console.log(`Connection test failed for ${ipAddress}`);
        return false;
      }
      
      console.log(`Connection test successful for ${ipAddress}`);
      return true;
    } catch (error) {
      console.error(`Connection test error for ${ipAddress}:`, error);
      return false;
    }
  }
};
