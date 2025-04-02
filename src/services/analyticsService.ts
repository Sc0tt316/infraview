import { apiService } from './api';
import { toast } from 'sonner';

export interface AnalyticsData {
  summary: {
    totalPrinters: number;
    activePrinters: number;
    totalVolume: number;
    activeJobs: number;
    completedJobs: number;
    failedJobs: number;
    totalUsers: number;
  };
  departmentVolume: {
    department: string;
    volume: number;
  }[];
}

export interface PrintVolumeData {
  date: string;
  volume: number;
}

export interface ActivityLogData {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  eventType: string;
  type: string; // 'info', 'warning', 'error', 'success'
  entityType: string;
  entityId: string;
  entityName: string;
  description: string;
}

export interface AlertData {
  id: string;
  timestamp: string;
  level: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  entityId: string;
  entityType: string;
  entityName: string;
  resolved: boolean;
  timeAgo: string;
}

// Initialize with mock data if none exists
const initializeAnalyticsData = async () => {
  const existingData = await apiService.get<AnalyticsData>('analytics');
  if (!existingData) {
    const mockData: AnalyticsData = {
      summary: {
        totalPrinters: 34,
        activePrinters: 29,
        totalVolume: 237854,
        activeJobs: 7,
        completedJobs: 2347,
        failedJobs: 23,
        totalUsers: 132
      },
      departmentVolume: [
        { department: "Marketing", volume: 34582 },
        { department: "Finance", volume: 27843 },
        { department: "HR", volume: 14950 },
        { department: "IT", volume: 42801 },
        { department: "Operations", volume: 38762 },
        { department: "Sales", volume: 31250 },
        { department: "Legal", volume: 19837 },
        { department: "Executive", volume: 8950 }
      ]
    };
    await apiService.post('analytics', mockData);
    return mockData;
  }
  return existingData;
};

// Initialize print volume data
const initializePrintVolumeData = async () => {
  const existingData = await apiService.get<Record<string, PrintVolumeData[]>>('printVolume');
  if (!existingData) {
    // Generate mock data for different time ranges
    const today = new Date();
    
    // Daily data (24 hour intervals)
    const dailyData: PrintVolumeData[] = Array.from({ length: 24 }, (_, i) => {
      const hour = String(i).padStart(2, '0');
      return {
        date: `${hour}:00`,
        volume: Math.floor(Math.random() * 500) + 100
      };
    });
    
    // Weekly data (last 7 days)
    const weeklyData: PrintVolumeData[] = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(today.getDate() - (6 - i));
      return {
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        volume: Math.floor(Math.random() * 2000) + 500
      };
    });
    
    // Monthly data (last 30 days)
    const monthlyData: PrintVolumeData[] = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(today.getDate() - (29 - i));
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        volume: Math.floor(Math.random() * 1500) + 300
      };
    });
    
    // Yearly data (12 months)
    const yearlyData: PrintVolumeData[] = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(i);
      return {
        date: date.toLocaleDateString('en-US', { month: 'short' }),
        volume: Math.floor(Math.random() * 30000) + 10000
      };
    });
    
    const mockData = {
      day: dailyData,
      week: weeklyData,
      month: monthlyData,
      year: yearlyData
    };
    
    await apiService.post('printVolume', mockData);
    return mockData;
  }
  return existingData;
};

// Initialize activity logs
const initializeActivityLogs = async () => {
  const existingData = await apiService.get<ActivityLogData[]>('activityLogs');
  if (!existingData) {
    const eventTypes = ['login', 'print', 'settings_change', 'printer_added', 'printer_removed', 'printer_status', 'user_added', 'user_removed'];
    const entityTypes = ['user', 'printer', 'system', 'document'];
    const users = [
      { id: 'u1', name: 'Alex Johnson' },
      { id: 'u2', name: 'Sarah Miller' },
      { id: 'u3', name: 'Michael Chen' },
      { id: 'u4', name: 'Emily Rodriguez' },
      { id: 'u5', name: 'James Wilson' }
    ];
    const typeToDescriptionMap: Record<string, string[]> = {
      'login': ['Logged in to the system', 'Successfully authenticated', 'New session started'],
      'print': ['Printed document', 'Completed print job', 'Sent document to printer'],
      'settings_change': ['Updated printer settings', 'Modified system configuration', 'Changed user preferences'],
      'printer_added': ['Added new printer to the system', 'Configured new printer device', 'Installed printer driver'],
      'printer_removed': ['Removed printer from system', 'Uninstalled printer', 'Deleted printer configuration'],
      'printer_status': ['Printer status changed', 'Printer went offline', 'Printer error reported', 'Printer maintenance required'],
      'user_added': ['Added new user account', 'Created user profile', 'Set up new user access'],
      'user_removed': ['Removed user account', 'Deleted user profile', 'Disabled user access']
    };
    
    const mockData: ActivityLogData[] = Array.from({ length: 50 }, (_, i) => {
      const today = new Date();
      const randomDaysAgo = Math.floor(Math.random() * 30);
      const randomHours = Math.floor(Math.random() * 24);
      const randomMinutes = Math.floor(Math.random() * 60);
      today.setDate(today.getDate() - randomDaysAgo);
      today.setHours(today.getHours() - randomHours);
      today.setMinutes(today.getMinutes() - randomMinutes);
      
      const user = users[Math.floor(Math.random() * users.length)];
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const entityType = entityTypes[Math.floor(Math.random() * entityTypes.length)];
      
      let entityName = '';
      if (entityType === 'printer') {
        const printerNames = ['HP LaserJet 4100', 'Xerox WorkCentre', 'Epson EcoTank', 'Brother MFC-L8900CDW', 'Canon PIXMA Pro'];
        entityName = printerNames[Math.floor(Math.random() * printerNames.length)];
      } else if (entityType === 'document') {
        const docNames = ['Quarterly Report.pdf', 'Meeting Minutes.docx', 'Invoice-123.pdf', 'Project Proposal.pptx', 'Budget 2023.xlsx'];
        entityName = docNames[Math.floor(Math.random() * docNames.length)];
      } else if (entityType === 'user') {
        entityName = users[Math.floor(Math.random() * users.length)].name;
      } else {
        entityName = 'System Configuration';
      }
      
      const possibleDescriptions = typeToDescriptionMap[eventType] || ['Action performed'];
      const description = possibleDescriptions[Math.floor(Math.random() * possibleDescriptions.length)];
      
      let type = 'info';
      if (eventType.includes('error') || eventType === 'printer_removed' || eventType === 'user_removed') {
        type = Math.random() > 0.7 ? 'error' : 'warning';
      } else if (eventType === 'login' || eventType === 'print') {
        type = 'success';
      }
      
      return {
        id: `act-${i + 1}`,
        timestamp: today.toISOString(),
        userId: user.id,
        userName: user.name,
        eventType,
        type,
        entityType,
        entityId: `ent-${Math.floor(Math.random() * 1000) + 1}`,
        entityName,
        description
      };
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    await apiService.post('activityLogs', mockData);
    return mockData;
  }
  return existingData;
};

const initializeAlerts = async () => {
  const existingData = await apiService.get<AlertData[]>('alerts');
  if (!existingData) {
    const alertTitles = {
      critical: [
        'Printer Offline',
        'Paper Jam',
        'Low Toner',
        'Hardware Failure',
        'Connection Lost'
      ],
      warning: [
        'Low Paper',
        'Toner Low (20%)',
        'Maintenance Required',
        'Print Queue Full',
        'Calibration Needed'
      ],
      info: [
        'Print Job Completed',
        'Firmware Update Available',
        'New Printer Detected',
        'Print Statistics Updated',
        'User Access Updated'
      ]
    };
    
    const alertDescriptions = {
      critical: [
        'The printer is not responding to connection attempts.',
        'Paper jam detected in tray 2. User intervention required.',
        'Black toner cartridge critically low (<5%). Replace immediately.',
        'Printer hardware error code #E543. Service required.',
        'Network connection to printer lost. Check network configuration.'
      ],
      warning: [
        'Paper level low in main tray. Please refill soon.',
        'Cyan toner level at 20%. Consider replacing soon.',
        'Printer maintenance recommended after 10,000 pages printed.',
        'Print queue has reached 80% capacity. Consider clearing old jobs.',
        'Color calibration needed for optimal print quality.'
      ],
      info: [
        'Large print job successfully completed (123 pages).',
        'New firmware version 4.2.1 is available for this printer.',
        'New printer has been automatically detected on the network.',
        'Monthly print statistics have been updated and are available.',
        'User permissions for printer access have been updated.'
      ]
    };
    
    const printerNames = [
      'HP LaserJet Pro M404n',
      'Xerox WorkCentre 6515',
      'Brother MFC-L8900CDW',
      'Canon PIXMA TR8520',
      'Epson WorkForce Pro WF-4740',
      'Kyocera ECOSYS P5026cdw',
      'Lexmark CX517de'
    ];
    
    const mockData: AlertData[] = [];
    
    // Generate 10 random alerts of each type
    Object.keys(alertTitles).forEach((level, levelIndex) => {
      const typedLevel = level as keyof typeof alertTitles;
      const titles = alertTitles[typedLevel];
      const descriptions = alertDescriptions[typedLevel];
      
      for (let i = 0; i < 10; i++) {
        const today = new Date();
        // Distribute alerts over the last 7 days, with critical ones being more recent
        const daysAgo = Math.floor(Math.random() * (7 - levelIndex * 2));
        const hoursAgo = Math.floor(Math.random() * 24);
        const minutesAgo = Math.floor(Math.random() * 60);
        
        today.setDate(today.getDate() - daysAgo);
        today.setHours(today.getHours() - hoursAgo);
        today.setMinutes(today.getMinutes() - minutesAgo);
        
        const titleIndex = Math.floor(Math.random() * titles.length);
        const printerIndex = Math.floor(Math.random() * printerNames.length);
        
        // For info alerts, 70% are resolved
        const resolved = typedLevel === 'info' ? Math.random() > 0.3 : 
                        typedLevel === 'warning' ? Math.random() > 0.7 : 
                        Math.random() > 0.9; // Critical alerts rarely resolved
        
        mockData.push({
          id: `alert-${mockData.length + 1}`,
          timestamp: today.toISOString(),
          level: typedLevel,
          title: titles[titleIndex],
          description: descriptions[titleIndex],
          entityId: `printer-${printerIndex + 1}`,
          entityType: 'printer',
          entityName: printerNames[printerIndex],
          resolved,
          timeAgo: getTimeAgo(today)
        });
      }
    });
    
    // Sort by timestamp (newest first)
    mockData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    await apiService.post('alerts', mockData);
    return mockData;
  }
  return existingData;
};

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
}

// Analytics service functions
export const analyticsService = {
  // Get all analytics data
  getAnalyticsData: async (): Promise<AnalyticsData> => {
    try {
      return await initializeAnalyticsData();
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast.error("Failed to fetch analytics data. Please try again.");
      throw error;
    }
  },
  
  // Get print volume data by time range
  getPrintVolumeByTimeRange: async (timeRange: 'day' | 'week' | 'month' | 'year'): Promise<PrintVolumeData[]> => {
    try {
      const volumeData = await initializePrintVolumeData();
      return volumeData[timeRange] || [];
    } catch (error) {
      console.error('Error fetching print volume data:', error);
      toast.error("Failed to fetch print volume data. Please try again.");
      return [];
    }
  },
  
  // Get print volume data by custom date range
  getPrintVolumeByDateRange: async ({ from, to }: { from: Date; to: Date }): Promise<PrintVolumeData[]> => {
    try {
      // For demo purposes, generate custom range data
      const daysDiff = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
      const customData: PrintVolumeData[] = [];
      
      for (let i = 0; i <= daysDiff; i++) {
        const date = new Date(from);
        date.setDate(from.getDate() + i);
        
        customData.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          volume: Math.floor(Math.random() * 1500) + 300
        });
      }
      
      return customData;
    } catch (error) {
      console.error('Error generating custom date range data:', error);
      toast.error("Failed to generate custom date range data.");
      return [];
    }
  },
  
  // Get activity logs
  getActivityLogs: async (options: { limit?: number, sortBy?: string, sortOrder?: 'asc' | 'desc' } = {}): Promise<ActivityLogData[]> => {
    try {
      const { limit = 100, sortBy = 'timestamp', sortOrder = 'desc' } = options;
      const logs = await initializeActivityLogs();
      
      // Sort logs
      let sortedLogs = [...logs];
      if (sortBy === 'timestamp') {
        sortedLogs.sort((a, b) => {
          const comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
          return sortOrder === 'desc' ? -comparison : comparison;
        });
      } else if (sortBy in logs[0]) {
        sortedLogs.sort((a, b) => {
          // @ts-ignore
          const comparison = a[sortBy] > b[sortBy] ? 1 : -1;
          return sortOrder === 'desc' ? -comparison : comparison;
        });
      }
      
      return sortedLogs.slice(0, limit);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      toast.error("Failed to fetch activity logs. Please try again.");
      return [];
    }
  },
  
  // Get alerts
  getAlerts: async (options: { limit?: number, status?: 'all' | 'active' | 'resolved', level?: 'all' | 'critical' | 'warning' | 'info', sortBy?: string, sortOrder?: 'asc' | 'desc' } = {}): Promise<AlertData[]> => {
    try {
      const { limit = 100, status = 'all', level = 'all', sortBy = 'timestamp', sortOrder = 'desc' } = options;
      const alerts = await initializeAlerts();
      
      // Map resolved property to status for compatibility
      const mappedAlerts: AlertData[] = alerts.map(alert => ({
        ...alert,
        status: alert.resolved ? 'resolved' : 'active'
      }));
      
      // Filter alerts
      let filteredAlerts = [...mappedAlerts];
      
      if (status !== 'all') {
        filteredAlerts = filteredAlerts.filter(alert => alert.status === status);
      }
      
      if (level !== 'all') {
        filteredAlerts = filteredAlerts.filter(alert => alert.level === level);
      }
      
      // Sort alerts
      if (sortBy === 'timestamp') {
        filteredAlerts.sort((a, b) => {
          const comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
          return sortOrder === 'desc' ? -comparison : comparison;
        });
      } else if (sortBy === 'level') {
        // Custom level sorting: critical > warning > info
        const levelValues = { critical: 3, warning: 2, info: 1 };
        filteredAlerts.sort((a, b) => {
          // @ts-ignore
          const comparison = levelValues[a.level] - levelValues[b.level];
          return sortOrder === 'desc' ? -comparison : comparison;
        });
      } else if (sortBy in alerts[0]) {
        filteredAlerts.sort((a, b) => {
          // @ts-ignore
          const comparison = a[sortBy] > b[sortBy] ? 1 : -1;
          return sortOrder === 'desc' ? -comparison : comparison;
        });
      }
      
      return filteredAlerts.slice(0, limit);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast.error("Failed to fetch alerts. Please try again.");
      return [];
    }
  },
  
  // Resolve alert
  resolveAlert: async (alertId: string): Promise<boolean> => {
    try {
      const allAlerts = await initializeAlerts();
      const alertIndex = allAlerts.findIndex(alert => alert.id === alertId);
      
      if (alertIndex === -1) {
        toast.error("Alert not found");
        return false;
      }
      
      // Update the alert status
      allAlerts[alertIndex].resolved = true;
      
      // Save the updated alerts
      await apiService.post('alerts', allAlerts);
      
      toast.success("Alert resolved successfully");
      return true;
    } catch (error) {
      console.error('Error resolving alert:', error);
      toast.error("Failed to resolve alert. Please try again.");
      return false;
    }
  }
};
