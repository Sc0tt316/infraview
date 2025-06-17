
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AlertData } from '@/types/analytics';
import { alertMonitoringService } from '../printer/alertMonitoringService';

// Alerts service
export const alertService = {
  getAlerts: async (options: { limit?: number, status?: 'all' | 'active' | 'resolved', level?: 'all' | 'critical' | 'warning' | 'info', sortBy?: string, sortOrder?: 'asc' | 'desc' } = {}): Promise<AlertData[]> => {
    try {
      const { limit = 100, status = 'all', level = 'all', sortBy = 'timestamp', sortOrder = 'desc' } = options;
      
      let query = supabase
        .from('alerts')
        .select(`
          *,
          printers (
            name,
            location,
            model
          )
        `);
      
      // Apply status filter
      if (status === 'active') {
        query = query.eq('is_resolved', false);
      } else if (status === 'resolved') {
        query = query.eq('is_resolved', true);
      }
      
      // Apply level filter
      if (level !== 'all') {
        query = query.eq('severity', level);
      }
      
      // Apply sorting
      if (sortBy === 'timestamp') {
        query = query.order('created_at', { ascending: sortOrder === 'asc' });
      } else {
        query = query.order(sortBy, { ascending: sortOrder === 'asc' });
      }
      
      // Apply limit
      query = query.limit(limit);
      
      const { data: alerts, error } = await query;
      
      if (error) {
        throw error;
      }
      
      // Transform to AlertData format
      return (alerts || []).map(alert => ({
        id: alert.id,
        timestamp: alert.created_at,
        level: alert.severity as 'critical' | 'warning' | 'info',
        title: alert.title,
        status: alert.is_resolved ? 'resolved' : 'active',
        description: alert.description,
        message: alert.description,
        entityId: alert.printer_id,
        entityType: 'printer',
        entityName: alert.printers?.name || 'Unknown Printer',
        resolved: alert.is_resolved,
        timeAgo: '', // Will be calculated on frontend
        printer: alert.printer_id ? {
          id: alert.printer_id,
          name: alert.printers?.name || 'Unknown Printer'
        } : undefined,
        user: undefined
      }));
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast.error("Failed to fetch alerts. Please try again.");
      return [];
    }
  },
  
  resolveAlert: async (alertId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('alerts')
        .update({
          is_resolved: true,
          resolved_at: new Date().toISOString()
        })
        .eq('id', alertId);
      
      if (error) {
        throw error;
      }
      
      toast.success("Alert resolved successfully");
      return true;
    } catch (error) {
      console.error('Error resolving alert:', error);
      toast.error("Failed to resolve alert. Please try again.");
      return false;
    }
  },

  // Check all printers for alerts and create them
  monitorPrinters: alertMonitoringService.checkPrintersForAlerts
};
