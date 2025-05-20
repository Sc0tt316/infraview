// Export all analytics services from a central file
import { analyticsDataService } from './analyticsDataService';
import { activityLogService } from './activityLogService';
import { alertService } from './alertService';
import { printVolumeService } from './printVolumeService';
import { ActivityLogData, AlertData, AnalyticsData, PrintVolumeData } from '@/types/analytics';
import { supabase } from '@/integrations/supabase/client';

// Combine all services into a single analyticsService object
export const analyticsService = {
  /**
   * Get analytics data
   */
  getAnalyticsData: async (): Promise<AnalyticsData> => {
    try {
      // Get printer data from Supabase
      const { data: printers, error: printersError } = await supabase
        .from('printers')
        .select('*');
      
      if (printersError) throw printersError;
      
      // Get user data from Supabase
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('*');
      
      if (usersError) throw usersError;
      
      // Calculate department volumes
      const departmentVolumes = printers.reduce((acc: any, printer: any) => {
        if (printer.department) {
          // Add the printer's volume to the department's total
          const existingDept = acc.find((d: any) => d.department === printer.department);
          if (existingDept) {
            existingDept.volume += printer.job_count || 0;
          } else {
            acc.push({
              department: printer.department,
              volume: printer.job_count || 0
            });
          }
        }
        return acc;
      }, []);
      
      // Calculate printer statuses
      const printerStatus = printers.reduce((acc: any, printer: any) => {
        const status = printer.status || 'offline';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {
        online: 0,
        offline: 0,
        error: 0,
        warning: 0,
        maintenance: 0
      });
      
      // Get total print volume
      const totalVolume = printers.reduce((sum: number, printer: any) => {
        return sum + (printer.job_count || 0);
      }, 0);
      
      // Get active printers count
      const activePrinters = printers.filter((p: any) => p.status === 'online').length;
      
      // Get print jobs count
      const { data: printLogs, error: printLogsError } = await supabase
        .from('printer_logs')
        .select('*');
      
      if (printLogsError) throw printLogsError;
      
      const activeJobs = printLogs.filter((log: any) => log.status === 'pending').length;
      const completedJobs = printLogs.filter((log: any) => log.status === 'completed').length;
      const failedJobs = printLogs.filter((log: any) => log.status === 'failed').length;
      
      return {
        summary: {
          totalPrinters: printers.length,
          activePrinters,
          totalVolume,
          activeJobs,
          completedJobs,
          failedJobs,
          totalUsers: users.length,
          departmentVolume: departmentVolumes
        },
        printerStatus,
        departmentVolume: departmentVolumes
      };
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      // Return empty data structure if there's an error
      return {
        summary: {
          totalPrinters: 0,
          activePrinters: 0,
          totalVolume: 0,
          activeJobs: 0,
          completedJobs: 0,
          failedJobs: 0,
          totalUsers: 0,
          departmentVolume: []
        },
        printerStatus: {
          online: 0,
          offline: 0,
          error: 0,
          warning: 0,
          maintenance: 0
        },
        departmentVolume: []
      };
    }
  },

  /**
   * Get print volume data by date range
   */
  getPrintVolumeByDateRange: async ({ from, to }: { from: Date, to: Date }): Promise<PrintVolumeData[]> => {
    try {
      // Format dates for PostgreSQL query
      const fromDate = from.toISOString();
      const toDate = to.toISOString();
      
      // Query printer logs between the specified dates
      const { data: logs, error } = await supabase
        .from('printer_logs')
        .select('timestamp, pages')
        .gte('timestamp', fromDate)
        .lte('timestamp', toDate);
      
      if (error) throw error;
      
      // Group logs by date and sum pages
      const volumeByDate = logs.reduce((acc: any, log: any) => {
        const date = new Date(log.timestamp).toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = 0;
        }
        acc[date] += log.pages || 0;
        return acc;
      }, {});
      
      // Convert to array format expected by the chart
      return Object.keys(volumeByDate).map(date => ({
        date,
        volume: volumeByDate[date]
      })).sort((a, b) => a.date.localeCompare(b.date));
    } catch (error) {
      console.error("Error fetching print volume by date range:", error);
      return [];
    }
  },

  /**
   * Get print volume data by time range
   */
  getPrintVolumeByTimeRange: async (timeRange: 'day' | 'week' | 'month' | 'year' | 'custom'): Promise<PrintVolumeData[]> => {
    try {
      const now = new Date();
      let fromDate;
      
      // Calculate the fromDate based on timeRange
      switch (timeRange) {
        case 'day':
          fromDate = new Date(now);
          fromDate.setDate(now.getDate() - 1);
          break;
        case 'week':
          fromDate = new Date(now);
          fromDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          fromDate = new Date(now);
          fromDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          fromDate = new Date(now);
          fromDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          fromDate = new Date(now);
          fromDate.setMonth(now.getMonth() - 1); // Default to month
      }
      
      return await analyticsService.getPrintVolumeByDateRange({
        from: fromDate,
        to: now
      });
    } catch (error) {
      console.error("Error fetching print volume by time range:", error);
      return [];
    }
  },

  /**
   * Get activity logs
   */
  getActivityLogs: async (options?: { limit?: number; sortBy?: string; sortOrder?: 'asc' | 'desc' }): Promise<ActivityLogData[]> => {
    try {
      const { limit = 100, sortBy = 'timestamp', sortOrder = 'desc' } = options || {};
      
      let query = supabase
        .from('printer_activities')
        .select('*')
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .limit(limit);
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return data.map((log: any) => ({
        id: log.id,
        timestamp: log.timestamp,
        entityId: log.printer_id,
        entityType: 'printer',
        type: log.status === 'error' ? 'error' : 'success',
        message: log.details || log.action,
        user: log.user_id || 'System',
        action: log.action
      }));
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      return [];
    }
  },

  /**
   * Get alerts
   */
  getAlerts: async (options?: { 
    limit?: number; 
    status?: 'all' | 'active' | 'resolved'; 
    level?: 'all' | 'critical' | 'warning' | 'info'; 
    sortBy?: string; 
    sortOrder?: 'asc' | 'desc' 
  }): Promise<AlertData[]> => {
    try {
      const { 
        limit = 50, 
        status = 'all', 
        level = 'all', 
        sortBy = 'created_at', 
        sortOrder = 'desc' 
      } = options || {};
      
      let query = supabase
        .from('alerts')
        .select('*, printers(name, location)')
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .limit(limit);
      
      if (status !== 'all') {
        query = query.eq('is_resolved', status === 'resolved');
      }
      
      if (level !== 'all') {
        query = query.eq('severity', level);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return data.map((alert: any) => ({
        id: alert.id,
        timestamp: alert.created_at,
        title: alert.title,
        level: alert.severity,
        status: alert.is_resolved ? 'resolved' : 'active',
        message: alert.description,
        entityId: alert.printer_id,
        entityType: 'printer',
        entityName: alert.printers?.name,
        isResolved: alert.is_resolved,
        severity: alert.severity,
        printer: alert.printer_id ? {
          id: alert.printer_id,
          name: alert.printers?.name || 'Unknown Printer',
          location: alert.printers?.location
        } : undefined
      }));
    } catch (error) {
      console.error("Error fetching alerts:", error);
      return [];
    }
  },

  /**
   * Resolve an alert
   */
  resolveAlert: async (alertId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('alerts')
        .update({ 
          is_resolved: true,
          resolved_at: new Date().toISOString(),
          resolved_by: 'current_user' // Ideally, this would be the actual user ID
        })
        .eq('id', alertId);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error("Error resolving alert:", error);
      return false;
    }
  }
};
