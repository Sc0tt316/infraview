
import { supabase } from '@/integrations/supabase/client';
import { AlertLevel, AlertData } from '@/types/analytics';

export interface AlertsQuery {
  limit?: number;
  status?: 'all' | 'active' | 'resolved';
  level?: AlertLevel | 'all';
  sortBy?: 'timestamp' | 'level' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export const alertService = {
  getAlerts: async (query: AlertsQuery = {}): Promise<AlertData[]> => {
    const { 
      limit = 50, 
      status = 'all', 
      level = 'all', 
      sortBy = 'timestamp', 
      sortOrder = 'desc' 
    } = query;

    let supabaseQuery = supabase
      .from('alerts')
      .select(`
        id,
        title,
        description,
        level,
        timestamp: created_at,
        resolved: is_resolved,
        resolved_at,
        printer_id,
        printers (
          id,
          name,
          location
        )
      `);

    // Apply status filter
    if (status === 'active') {
      supabaseQuery = supabaseQuery.eq('is_resolved', false);
    } else if (status === 'resolved') {
      supabaseQuery = supabaseQuery.eq('is_resolved', true);
    }

    // Apply level filter
    if (level !== 'all') {
      supabaseQuery = supabaseQuery.eq('level', level);
    }

    // Apply sorting
    supabaseQuery = supabaseQuery.order(
      sortBy === 'timestamp' ? 'created_at' : sortBy,
      { ascending: sortOrder === 'asc' }
    );

    // Apply limit
    supabaseQuery = supabaseQuery.limit(limit);

    const { data: alerts, error } = await supabaseQuery;

    if (error) {
      console.error('Error fetching alerts:', error);
      throw error;
    }

    return (alerts || []).map(alert => ({
      id: alert.id,
      title: alert.title,
      description: alert.description,
      message: alert.description,
      level: alert.level as AlertLevel,
      timestamp: alert.timestamp,
      resolved: alert.resolved,
      resolvedAt: alert.resolved_at,
      printer: alert.printers ? {
        id: alert.printers.id,
        name: alert.printers.name,
        location: alert.printers.location
      } : undefined,
      user: undefined
    }));
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
        console.error('Error resolving alert:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error resolving alert:', error);
      return false;
    }
  },

  clearResolvedAlerts: async (): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('alerts')
        .delete()
        .eq('is_resolved', true);

      if (error) {
        console.error('Error clearing resolved alerts:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error clearing resolved alerts:', error);
      return false;
    }
  }
};
