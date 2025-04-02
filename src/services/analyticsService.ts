import { apiService } from './api';
import { toast } from '@/hooks/use-toast';
import { printerService } from './printerService';
import { userService } from './userService';

// Define analytics types
export interface PrintVolumeData {
  name: string;
  prints: number;
}

export interface ConsumablesData {
  name: string;
  ink: number;
  paper: number;
}

export interface PrintByDepartmentData {
  name: string;
  prints: number;
}

export interface AlertHistoryItem {
  id: string;
  title: string;
  description: string;
  time: string;
  level: 'info' | 'warning' | 'error';
}

export interface AnalyticsData {
  printVolume: PrintVolumeData[];
  consumables: ConsumablesData[];
  printByDepartment: PrintByDepartmentData[];
  alertHistory: AlertHistoryItem[];
  printerStatus: { name: string; value: number; color: string }[];
}

// Initialize with mock data if none exists
const initializeAnalytics = async () => {
  const existingAnalytics = await apiService.get<AnalyticsData>('analytics');
  if (!existingAnalytics) {
    const mockAnalytics: AnalyticsData = {
      printVolume: [
        { name: "Mon", prints: 230 },
        { name: "Tue", prints: 320 },
        { name: "Wed", prints: 450 },
        { name: "Thu", prints: 380 },
        { name: "Fri", prints: 290 },
        { name: "Sat", prints: 120 },
        { name: "Sun", prints: 80 },
      ],
      consumables: [
        { name: "Jan", ink: 45, paper: 60 },
        { name: "Feb", ink: 52, paper: 48 },
        { name: "Mar", ink: 38, paper: 71 },
        { name: "Apr", ink: 62, paper: 53 },
        { name: "May", ink: 55, paper: 67 },
        { name: "Jun", ink: 78, paper: 58 },
      ],
      printByDepartment: [
        { name: "Marketing", prints: 2450 },
        { name: "Finance", prints: 1800 },
        { name: "HR", prints: 950 },
        { name: "IT", prints: 1350 },
        { name: "Sales", prints: 2100 },
        { name: "Executive", prints: 750 },
      ],
      alertHistory: [
        { 
          id: 'a1', 
          title: 'Printer Offline', 
          description: 'Executive Printer went offline and is not responding', 
          time: '20 minutes ago',
          level: 'error'
        },
        { 
          id: 'a2', 
          title: 'Low Ink Warning', 
          description: 'Marketing Printer is low on cyan ink (5% remaining)', 
          time: '1 hour ago',
          level: 'warning'
        },
        { 
          id: 'a3', 
          title: 'Paper Jam', 
          description: 'Office Printer 1 has reported a paper jam in tray 2', 
          time: '2 hours ago',
          level: 'error'
        },
        { 
          id: 'a4', 
          title: 'Maintenance Required', 
          description: 'Conference Room Printer scheduled maintenance is due', 
          time: '1 day ago',
          level: 'info'
        },
      ],
      printerStatus: [
        { name: "Online", value: 12, color: "#4ade80" },
        { name: "Offline", value: 3, color: "#94a3b8" },
        { name: "Error", value: 2, color: "#f87171" },
        { name: "Maintenance", value: 1, color: "#facc15" },
      ]
    };
    await apiService.post('analytics', mockAnalytics);
    return mockAnalytics;
  }
  return existingAnalytics;
};

// Analytics service functions
export const analyticsService = {
  // Get all analytics data
  getAnalyticsData: async (): Promise<AnalyticsData> => {
    try {
      await initializeAnalytics();
      const analytics = await apiService.get<AnalyticsData>('analytics');
      
      // Update printer status counts from actual printer data
      const printers = await printerService.getAllPrinters();
      
      const onlineCount = printers.filter(p => p.status === 'online').length;
      const offlineCount = printers.filter(p => p.status === 'offline').length;
      const errorCount = printers.filter(p => p.status === 'error').length;
      const maintenanceCount = printers.filter(p => p.status === 'maintenance').length;
      
      const updatedPrinterStatus = [
        { name: "Online", value: onlineCount, color: "#4ade80" },
        { name: "Offline", value: offlineCount, color: "#94a3b8" },
        { name: "Error", value: errorCount, color: "#f87171" },
        { name: "Maintenance", value: maintenanceCount, color: "#facc15" },
      ];
      
      return {
        ...analytics,
        printerStatus: updatedPrinterStatus
      };
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch analytics data. Please try again.",
        variant: "destructive"
      });
      return null as unknown as AnalyticsData;
    }
  },
  
  // Get print volume data for specific time range
  getPrintVolumeByTimeRange: async (range: 'day' | 'week' | 'month' | 'year'): Promise<PrintVolumeData[]> => {
    try {
      const analytics = await analyticsService.getAnalyticsData();
      
      // In a real app, we'd filter based on the range
      // For now, we'll just return the data with slightly modified values to simulate difference
      const randomFactor = Math.random() * 0.3 + 0.85; // Random between 0.85 and 1.15
      
      return analytics.printVolume.map(item => ({
        ...item,
        prints: Math.round(item.prints * randomFactor)
      }));
    } catch (error) {
      console.error(`Error fetching print volume for ${range}:`, error);
      toast({
        title: "Error",
        description: "Failed to fetch print volume data. Please try again.",
        variant: "destructive"
      });
      return [];
    }
  },
  
  // Add new alert to history
  addAlert: async (alert: Omit<AlertHistoryItem, 'id' | 'time'>): Promise<AlertHistoryItem> => {
    try {
      const analytics = await analyticsService.getAnalyticsData();
      
      const newAlert: AlertHistoryItem = {
        ...alert,
        id: `a${Date.now()}`,
        time: "Just now"
      };
      
      const updatedAlertHistory = [newAlert, ...analytics.alertHistory.slice(0, 9)]; // Keep top 10
      
      await apiService.put('analytics', {
        ...analytics,
        alertHistory: updatedAlertHistory
      });
      
      return newAlert;
    } catch (error) {
      console.error('Error adding alert:', error);
      toast({
        title: "Error",
        description: "Failed to add alert. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  },
  
  // Get total statistics
  getStatistics: async (): Promise<{
    totalPrinters: number;
    totalUsers: number;
    totalPrintJobs: number;
    totalPaperUsed: number;
  }> => {
    try {
      const [printers, users, analytics] = await Promise.all([
        printerService.getAllPrinters(),
        userService.getAllUsers(),
        analyticsService.getAnalyticsData()
      ]);
      
      const totalPrinters = printers.length;
      const totalUsers = users.length;
      const totalPrintJobs = analytics.printVolume.reduce((acc, curr) => acc + curr.prints, 0);
      const totalPaperUsed = Math.round(totalPrintJobs * 1.2); // Approximation
      
      return {
        totalPrinters,
        totalUsers,
        totalPrintJobs,
        totalPaperUsed
      };
    } catch (error) {
      console.error('Error fetching statistics:', error);
      toast({
        title: "Error",
        description: "Failed to fetch statistics. Please try again.",
        variant: "destructive"
      });
      return {
        totalPrinters: 0,
        totalUsers: 0,
        totalPrintJobs: 0,
        totalPaperUsed: 0
      };
    }
  },
  
  // Add this function to handle date range queries
  getPrintVolumeByDateRange: async (fromDate: Date, toDate: Date): Promise<PrintVolumeData[]> => {
    try {
      // Get the existing data and filter it based on the date range
      const data = await analyticsService.getPrintVolumeByTimeRange("month"); // get a larger dataset to filter from
      
      // For demo purposes we'll just return the data
      // In a real implementation, this would filter based on dates
      return data;
    } catch (error) {
      console.error('Error fetching print volume by date range:', error);
      return [];
    }
  },
  
  // Add this function to get all activity logs
  getActivityLogs: async (): Promise<ActivityLogData[]> => {
    try {
      // Combine logs from printers and system
      const printerLogs = await printerService.getAllLogs();
      const activities = await printerService.getAllActivities();
      
      // Map to consistent format
      const logs: ActivityLogData[] = [
        ...printerLogs.map(log => ({
          id: log.id,
          type: "printer",
          timestamp: log.timestamp,
          description: log.message,
          user: log.user || "System",
          action: log.type === "error" ? "Error reported" : "Log recorded",
          entityName: "Printer"
        })),
        ...activities.map(activity => ({
          id: activity.id,
          type: "user",
          timestamp: activity.timestamp,
          description: activity.details || "",
          user: activity.user || "System",
          action: activity.action,
          entityName: activity.printerId
        })),
        // Add some system logs
        {
          id: "sys1",
          type: "system",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          description: "System maintenance completed",
          user: "admin",
          action: "System update",
          entityName: "System"
        },
        {
          id: "sys2",
          type: "system",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          description: "Database backup completed",
          user: "system",
          action: "Backup",
          entityName: "Database"
        }
      ];
      
      // Sort by timestamp, newest first
      return logs.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      return [];
    }
  },
  
  // Add this function for the printer activity tab
  getPrinterActivity: async (printerId: string): Promise<any[]> => {
    try {
      const activities = await printerService.getPrinterActivity(printerId);
      return activities.map(activity => ({
        id: activity.id,
        timestamp: activity.timestamp,
        action: activity.action,
        description: activity.details || "",
        user: activity.user,
        type: activity.action.includes("error") ? "error" : "info"
      }));
    } catch (error) {
      console.error(`Error fetching activities for printer ${printerId}:`, error);
      return [];
    }
  }
};

// Add this type definition
export interface ActivityLogData {
  id: string;
  type: string;
  timestamp: string;
  description: string;
  user: string;
  action: string;
  entityName?: string;
}
