
import { apiService } from './api';
import { toast } from 'sonner';
import { format, subDays, subWeeks, subMonths, subYears } from 'date-fns';
import { DateRange } from 'react-day-picker';

// Analytics Data Types
export interface AnalyticsData {
  summary: {
    totalPrinters: number;
    activePrinters: number;
    totalVolume: number;
    activeJobs: number;
    completedJobs: number;
    failedJobs: number;
  };
  departmentVolume: { department: string; volume: number }[];
  printerEfficiency: { name: string; efficiency: number }[];
  userActivity: { user: string; volume: number }[];
}

export interface PrintVolumeData {
  date: string;
  volume: number;
}

// Alert Types
export interface AlertData {
  id: string;
  title: string;
  message: string;
  type: "printer" | "user" | "system";
  priority: "high" | "medium" | "low";
  source: string;
  timestamp: string;
  entityName?: string;
  read: boolean;
}

// Activity Log Types
export interface ActivityLogData {
  id: string;
  action: string;
  description: string;
  type: "printer" | "user" | "system";
  user: string;
  timestamp: string;
  entityId?: string;
  entityName?: string;
}

// Analytics service
export const analyticsService = {
  // Get all analytics data
  getAnalyticsData: async (): Promise<AnalyticsData> => {
    try {
      const data = await apiService.get<AnalyticsData>('analytics');
      if (!data) {
        throw new Error('No analytics data found');
      }
      return data;
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast.error('Failed to fetch analytics data');
      // Return empty data to prevent UI errors
      return {
        summary: {
          totalPrinters: 0,
          activePrinters: 0,
          totalVolume: 0,
          activeJobs: 0,
          completedJobs: 0,
          failedJobs: 0
        },
        departmentVolume: [],
        printerEfficiency: [],
        userActivity: []
      };
    }
  },

  // Get print volume data by time range
  getPrintVolumeByTimeRange: async (range: 'day' | 'week' | 'month' | 'year'): Promise<PrintVolumeData[]> => {
    try {
      // Generate dates based on the selected range
      const today = new Date();
      let dates: string[] = [];

      switch (range) {
        case 'day':
          // Last 24 hours in 2-hour intervals
          for (let i = 0; i < 12; i++) {
            const date = new Date(today);
            date.setHours(today.getHours() - i * 2);
            dates.push(format(date, "h aaa"));
          }
          dates = dates.reverse();
          break;
        
        case 'week':
          // Last 7 days
          for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            dates.push(format(date, "EEE"));
          }
          break;
        
        case 'month':
          // Last 30 days in 5-day intervals
          for (let i = 0; i < 6; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - i * 5);
            dates.push(format(date, "MMM d"));
          }
          dates = dates.reverse();
          break;
        
        case 'year':
          // Last 12 months
          for (let i = 11; i >= 0; i--) {
            const date = new Date(today);
            date.setMonth(today.getMonth() - i);
            dates.push(format(date, "MMM"));
          }
          break;
      }

      // Generate random data for each date
      const data = dates.map(date => {
        return {
          date,
          volume: Math.floor(Math.random() * 1000) + 100
        };
      });

      return data;
    } catch (error) {
      console.error(`Error fetching print volume data for ${range}:`, error);
      toast.error(`Failed to fetch print volume data for ${range}`);
      return [];
    }
  },

  // Get print volume data by date range
  getPrintVolumeByDateRange: async (dateRange: DateRange): Promise<PrintVolumeData[]> => {
    try {
      if (!dateRange.from || !dateRange.to) {
        throw new Error('Invalid date range');
      }

      const from = dateRange.from;
      const to = dateRange.to;
      const diffInDays = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
      
      // Choose interval based on the date range
      const interval = diffInDays <= 7 ? 1 : 
                       diffInDays <= 31 ? 3 : 
                       diffInDays <= 90 ? 7 : 
                       diffInDays <= 365 ? 14 : 30;

      let dates: Date[] = [];
      let currentDate = new Date(from);
      
      while (currentDate <= to) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + interval);
      }
      
      // Make sure to include the end date
      if (currentDate > to && !dates.some(d => d.getTime() === to.getTime())) {
        dates.push(new Date(to));
      }
      
      // Format the dates and generate data
      const data = dates.map(date => {
        return {
          date: format(date, diffInDays <= 31 ? "MMM d" : "MMM d, yyyy"),
          volume: Math.floor(Math.random() * 1000) + 100
        };
      });

      return data;
    } catch (error) {
      console.error('Error fetching print volume data for date range:', error);
      toast.error('Failed to fetch print volume data for date range');
      return [];
    }
  },

  // Get statistics for dashboard
  getStatistics: async (): Promise<{
    totalPrinters: number;
    activePrinters: number;
    lowToner: number;
    paperJams: number;
    offlinePrinters: number;
    totalPrintVolume: number;
  }> => {
    try {
      const data = await apiService.get<AnalyticsData>('analytics');
      if (!data) {
        throw new Error('No analytics data found');
      }
      
      return {
        totalPrinters: data.summary.totalPrinters,
        activePrinters: data.summary.activePrinters,
        lowToner: Math.floor(Math.random() * 5) + 1,
        paperJams: Math.floor(Math.random() * 3),
        offlinePrinters: data.summary.totalPrinters - data.summary.activePrinters,
        totalPrintVolume: data.summary.totalVolume
      };
    } catch (error) {
      console.error('Error fetching statistics:', error);
      toast.error('Failed to fetch statistics');
      return {
        totalPrinters: 0,
        activePrinters: 0,
        lowToner: 0,
        paperJams: 0,
        offlinePrinters: 0,
        totalPrintVolume: 0
      };
    }
  },

  // Add a new alert
  addAlert: async (alert: Omit<AlertData, 'id' | 'timestamp'>): Promise<AlertData> => {
    try {
      const newAlert: AlertData = {
        ...alert,
        id: `alert_${Date.now()}`,
        timestamp: format(new Date(), "MMM d, yyyy h:mm aaa")
      };
      
      // Get existing alerts or initialize empty array
      const existingAlerts = await apiService.get<AlertData[]>('alerts') || [];
      
      // Add new alert to the beginning of the array
      const updatedAlerts = [newAlert, ...existingAlerts];
      
      // Save updated alerts
      await apiService.post('alerts', updatedAlerts);
      
      toast.success('Alert created successfully');
      return newAlert;
    } catch (error) {
      console.error('Error adding alert:', error);
      toast.error('Failed to add alert');
      throw error;
    }
  },

  // Get all alerts
  getAlerts: async (): Promise<AlertData[]> => {
    try {
      const alerts = await apiService.get<AlertData[]>('alerts');
      
      // If no alerts exist, initialize with some sample data
      if (!alerts || alerts.length === 0) {
        const sampleAlerts: AlertData[] = [
          {
            id: 'alert_1',
            title: 'Printer Offline',
            message: 'HP LaserJet Pro MFP has been offline for 30 minutes.',
            type: 'printer',
            priority: 'high',
            source: 'System Monitor',
            timestamp: format(subHours(new Date(), 1), "MMM d, yyyy h:mm aaa"),
            entityName: 'HP LaserJet Pro MFP',
            read: false
          },
          {
            id: 'alert_2',
            title: 'Low Toner',
            message: 'Canon ImageRunner is running low on black toner. Replacement needed soon.',
            type: 'printer',
            priority: 'medium',
            source: 'Printer Status Monitor',
            timestamp: format(subHours(new Date(), 3), "MMM d, yyyy h:mm aaa"),
            entityName: 'Canon ImageRunner',
            read: true
          },
          {
            id: 'alert_3',
            title: 'System Update Available',
            message: 'A new firmware update is available for Zebra ZT411. Please update to ensure optimal performance.',
            type: 'system',
            priority: 'low',
            source: 'Update Service',
            timestamp: format(subDays(new Date(), 1), "MMM d, yyyy h:mm aaa"),
            entityName: 'Zebra ZT411',
            read: false
          },
          {
            id: 'alert_4',
            title: 'User Quota Exceeded',
            message: 'User Sarah Miller has exceeded their monthly print quota by 50 pages.',
            type: 'user',
            priority: 'medium',
            source: 'Quota Management',
            timestamp: format(subDays(new Date(), 2), "MMM d, yyyy h:mm aaa"),
            entityName: 'Sarah Miller',
            read: true
          },
          {
            id: 'alert_5',
            title: 'Paper Jam',
            message: 'Brother MFC-L8900CDW has reported a paper jam in tray 2. Requires attention.',
            type: 'printer',
            priority: 'high',
            source: 'Printer Status Monitor',
            timestamp: format(subHours(new Date(), 6), "MMM d, yyyy h:mm aaa"),
            entityName: 'Brother MFC-L8900CDW',
            read: false
          }
        ];
        
        await apiService.post('alerts', sampleAlerts);
        return sampleAlerts;
      }
      
      return alerts;
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast.error('Failed to fetch alerts');
      return [];
    }
  },

  // Get activity logs
  getActivityLogs: async (): Promise<ActivityLogData[]> => {
    try {
      const logs = await apiService.get<ActivityLogData[]>('activityLogs');
      
      // If no logs exist, initialize with some sample data
      if (!logs || logs.length === 0) {
        const sampleLogs: ActivityLogData[] = [
          {
            id: 'log_1',
            action: 'Printer Added',
            description: 'New printer HP LaserJet Pro MFP has been added to the system.',
            type: 'printer',
            user: 'Alex Johnson',
            timestamp: format(subHours(new Date(), 2), "MMM d, yyyy h:mm aaa"),
            entityId: 'printer_1',
            entityName: 'HP LaserJet Pro MFP'
          },
          {
            id: 'log_2',
            action: 'User Login',
            description: 'User logged in from IP 192.168.1.105',
            type: 'user',
            user: 'Sarah Miller',
            timestamp: format(subHours(new Date(), 4), "MMM d, yyyy h:mm aaa"),
            entityId: 'user_2'
          },
          {
            id: 'log_3',
            action: 'Print Job Completed',
            description: 'Document "Q3 Financial Report.pdf" (25 pages) printed successfully.',
            type: 'printer',
            user: 'Michael Chen',
            timestamp: format(subHours(new Date(), 6), "MMM d, yyyy h:mm aaa"),
            entityId: 'printer_3',
            entityName: 'Xerox WorkCentre'
          },
          {
            id: 'log_4',
            action: 'System Update',
            description: 'System updated to version 2.4.1. Security patches applied.',
            type: 'system',
            user: 'System',
            timestamp: format(subDays(new Date(), 1), "MMM d, yyyy h:mm aaa")
          },
          {
            id: 'log_5',
            action: 'Printer Maintenance',
            description: 'Scheduled maintenance performed on Brother MFC-L8900CDW.',
            type: 'printer',
            user: 'Emily Rodriguez',
            timestamp: format(subDays(new Date(), 2), "MMM d, yyyy h:mm aaa"),
            entityId: 'printer_5',
            entityName: 'Brother MFC-L8900CDW'
          },
          {
            id: 'log_6',
            action: 'User Added',
            description: 'New user James Wilson has been added to the system.',
            type: 'user',
            user: 'Alex Johnson',
            timestamp: format(subDays(new Date(), 3), "MMM d, yyyy h:mm aaa"),
            entityId: 'user_5',
            entityName: 'James Wilson'
          },
          {
            id: 'log_7',
            action: 'Print Error',
            description: 'Print job failed due to paper jam in tray 1.',
            type: 'printer',
            user: 'Sarah Miller',
            timestamp: format(subDays(new Date(), 3), "MMM d, yyyy h:mm aaa"),
            entityId: 'printer_2',
            entityName: 'Canon ImageRunner'
          },
          {
            id: 'log_8',
            action: 'Settings Changed',
            description: 'Default print settings updated to double-sided printing.',
            type: 'system',
            user: 'Alex Johnson',
            timestamp: format(subDays(new Date(), 4), "MMM d, yyyy h:mm aaa")
          }
        ];
        
        await apiService.post('activityLogs', sampleLogs);
        return sampleLogs;
      }
      
      return logs;
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      toast.error('Failed to fetch activity logs');
      return [];
    }
  },

  // Get printer-specific activity logs
  getPrinterActivity: async (printerId: string): Promise<ActivityLogData[]> => {
    try {
      const allLogs = await analyticsService.getActivityLogs();
      return allLogs.filter(log => log.entityId === printerId && log.type === 'printer');
    } catch (error) {
      console.error(`Error fetching activity logs for printer ${printerId}:`, error);
      toast.error('Failed to fetch printer activity logs');
      return [];
    }
  }
};

// Helper function to add hours to a date
function subHours(date: Date, hours: number): Date {
  const newDate = new Date(date);
  newDate.setHours(newDate.getHours() - hours);
  return newDate;
}
