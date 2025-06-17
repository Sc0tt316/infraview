
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { PrinterData } from '@/types/printers';

export interface AlertCondition {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  checkCondition: (printer: PrinterData) => boolean;
}

// Define alert conditions
const alertConditions: AlertCondition[] = [
  {
    id: 'ink_critical',
    title: 'Critical Ink Level',
    description: 'Ink level is critically low (below 5%)',
    severity: 'critical',
    checkCondition: (printer) => printer.inkLevel < 5
  },
  {
    id: 'ink_low',
    title: 'Low Ink Level',
    description: 'Ink level is low (below 15%)',
    severity: 'medium',
    checkCondition: (printer) => printer.inkLevel >= 5 && printer.inkLevel < 15
  },
  {
    id: 'paper_empty',
    title: 'Paper Empty',
    description: 'Paper tray is empty',
    severity: 'critical',
    checkCondition: (printer) => printer.paperLevel === 0
  },
  {
    id: 'paper_low',
    title: 'Low Paper Level',
    description: 'Paper level is low (below 15%)',
    severity: 'medium',
    checkCondition: (printer) => printer.paperLevel > 0 && printer.paperLevel < 15
  },
  {
    id: 'printer_offline',
    title: 'Printer Offline',
    description: 'Printer is not responding',
    severity: 'high',
    checkCondition: (printer) => printer.status === 'offline'
  },
  {
    id: 'printer_error',
    title: 'Printer Error',
    description: 'Printer is reporting an error status',
    severity: 'critical',
    checkCondition: (printer) => printer.status === 'error'
  },
  {
    id: 'supplies_critical',
    title: 'Critical Supply Level',
    description: 'One or more supplies are critically low',
    severity: 'critical',
    checkCondition: (printer) => {
      if (!printer.supplies) return false;
      return Object.values(printer.supplies).some(level => typeof level === 'number' && level < 5);
    }
  }
];

export const alertMonitoringService = {
  // Check all printers for alert conditions
  checkPrintersForAlerts: async (printers: PrinterData[]): Promise<void> => {
    for (const printer of printers) {
      await alertMonitoringService.checkPrinterAlerts(printer);
    }
  },

  // Check a single printer for alert conditions
  checkPrinterAlerts: async (printer: PrinterData): Promise<void> => {
    for (const condition of alertConditions) {
      if (condition.checkCondition(printer)) {
        await alertMonitoringService.createAlert(printer, condition);
      } else {
        // If condition is no longer met, resolve any existing alerts
        await alertMonitoringService.resolveAlert(printer.id, condition.id);
      }
    }
  },

  // Create an alert if it doesn't already exist
  createAlert: async (printer: PrinterData, condition: AlertCondition): Promise<void> => {
    try {
      // Check if alert already exists for this printer and condition
      const { data: existingAlert } = await supabase
        .from('alerts')
        .select('id')
        .eq('printer_id', printer.id)
        .eq('title', condition.title)
        .eq('is_resolved', false)
        .single();

      if (existingAlert) {
        return; // Alert already exists
      }

      // Create new alert
      const { error } = await supabase
        .from('alerts')
        .insert({
          printer_id: printer.id,
          title: condition.title,
          description: `${condition.description} for printer "${printer.name}" at ${printer.location}`,
          severity: condition.severity,
          is_resolved: false
        });

      if (error) {
        throw error;
      }

      // Show toast notification for critical alerts
      if (condition.severity === 'critical') {
        toast({
          title: condition.title,
          description: `${printer.name}: ${condition.description}`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error creating alert:', error);
    }
  },

  // Resolve an alert
  resolveAlert: async (printerId: string, conditionId: string): Promise<void> => {
    try {
      const condition = alertConditions.find(c => c.id === conditionId);
      if (!condition) return;

      const { error } = await supabase
        .from('alerts')
        .update({
          is_resolved: true,
          resolved_at: new Date().toISOString()
        })
        .eq('printer_id', printerId)
        .eq('title', condition.title)
        .eq('is_resolved', false);

      if (error && error.code !== 'PGRST116') { // Ignore "no rows updated" error
        throw error;
      }
    } catch (error) {
      console.error('Error resolving alert:', error);
    }
  },

  // Get all active alerts
  getActiveAlerts: async (): Promise<any[]> => {
    try {
      const { data: alerts, error } = await supabase
        .from('alerts')
        .select(`
          *,
          printers (
            name,
            location
          )
        `)
        .eq('is_resolved', false)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return alerts || [];
    } catch (error) {
      console.error('Error fetching active alerts:', error);
      return [];
    }
  }
};
