
import { supabase } from '@/integrations/supabase/client';
import { PrinterData } from '@/types/printers';
import { toast } from '@/hooks/use-toast';

// Real API service with SNMP operations and database integration
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const baseApiService = {
  // SNMP Operations
  async pollPrinter(printer: Pick<PrinterData, 'id' | 'name' | 'ipAddress'>): Promise<PrinterData | null> {
    try {
      if (!printer.ipAddress) {
        console.warn(`No IP address for printer ${printer.name}`);
        return null;
      }
      
      console.log(`Initiating SNMP poll for ${printer.name} (${printer.ipAddress})`);
      
      const { data, error } = await supabase.functions.invoke('printer-monitor', {
        body: {
          ipAddress: printer.ipAddress,
          printerId: printer.id,
          printerName: printer.name,
          action: 'poll'
        }
      });
      
      if (error || !data || !data.success) {
        console.error(`SNMP error for ${printer.name}:`, error || data);
        return null;
      }
      
      console.log(`SNMP poll successful for ${printer.name}`);
      return data.data;
    } catch (error) {
      console.error(`SNMP service error for ${printer.name}:`, error);
      return null;
    }
  },

  async discoverPrinters(): Promise<{ ipAddress: string, name: string, model: string }[]> {
    try {
      console.log('Starting SNMP printer discovery...');
      
      const { data, error } = await supabase.functions.invoke('printer-monitor', {
        body: { action: 'discover' }
      });
      
      if (error || !data || !data.success) {
        console.error('SNMP discovery error:', error || data);
        return [];
      }
      
      return data.printers || [];
    } catch (error) {
      console.error('Discovery service error:', error);
      return [];
    }
  },

  async pollAllPrinters(): Promise<void> {
    try {
      console.log('Starting batch SNMP printer polling...');
      
      const { data: printers, error } = await supabase
        .from('printers')
        .select('id, name, ip_address, model')
        .not('ip_address', 'is', null);
      
      if (error) {
        throw new Error(`Database query failed: ${error.message}`);
      }
      
      const printersWithIp = printers.filter(p => p.ip_address);
      
      if (printersWithIp.length === 0) {
        return;
      }
      
      const batchSize = 3;
      
      for (let i = 0; i < printersWithIp.length; i += batchSize) {
        const batch = printersWithIp.slice(i, i + batchSize);
        
        const batchPromises = batch.map(async (printer) => {
          try {
            return await this.pollPrinter({
              id: printer.id,
              name: printer.name,
              ipAddress: printer.ip_address
            });
          } catch (error) {
            console.error(`Batch error for ${printer.name}:`, error);
            return null;
          }
        });
        
        await Promise.all(batchPromises);
        
        if (i + batchSize < printersWithIp.length) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    } catch (error) {
      console.error('Batch polling error:', error);
      throw error;
    }
  },

  async testConnection(ipAddress: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('printer-monitor', {
        body: {
          ipAddress,
          action: 'poll'
        }
      });
      
      return !error && data && data.success;
    } catch (error) {
      return false;
    }
  },

  // Database operations
  async get<T>(endpoint: string): Promise<T> {
    try {
      await delay(200);
      
      // Parse endpoint to determine table and operation
      if (endpoint.includes('printers')) {
        const { data, error } = await supabase
          .from('printers')
          .select('*');
          
        if (error) throw error;
        return data as unknown as T;
      }
      
      throw new Error(`Unsupported endpoint: ${endpoint}`);
    } catch (error) {
      console.error(`Error fetching from ${endpoint}:`, error);
      throw error;
    }
  },
  
  async post<T>(endpoint: string, data: any): Promise<T> {
    try {
      await delay(200);
      
      if (endpoint.includes('printers')) {
        const { data: result, error } = await supabase
          .from('printers')
          .insert(data)
          .select()
          .single();
          
        if (error) throw error;
        return result as unknown as T;
      }
      
      throw new Error(`Unsupported endpoint: ${endpoint}`);
    } catch (error) {
      console.error(`Error posting to ${endpoint}:`, error);
      throw error;
    }
  },
  
  async put<T>(endpoint: string, data: any): Promise<T> {
    try {
      await delay(200);
      
      if (endpoint.includes('printers/')) {
        const printerId = endpoint.split('/').pop();
        const { data: result, error } = await supabase
          .from('printers')
          .update(data)
          .eq('id', printerId)
          .select()
          .single();
          
        if (error) throw error;
        return result as unknown as T;
      }
      
      throw new Error(`Unsupported endpoint: ${endpoint}`);
    } catch (error) {
      console.error(`Error updating ${endpoint}:`, error);
      throw error;
    }
  },
  
  async delete(endpoint: string): Promise<void> {
    try {
      await delay(200);
      
      if (endpoint.includes('printers/')) {
        const printerId = endpoint.split('/').pop();
        const { error } = await supabase
          .from('printers')
          .delete()
          .eq('id', printerId);
          
        if (error) throw error;
      } else {
        throw new Error(`Unsupported endpoint: ${endpoint}`);
      }
    } catch (error) {
      console.error(`Error deleting ${endpoint}:`, error);
      throw error;
    }
  }
};
