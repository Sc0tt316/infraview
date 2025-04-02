
import { format, subDays } from 'date-fns';

// Types
export interface AnalyticsData {
  summary: {
    totalPrinters: number;
    activePrinters: number;
    totalVolume: number;
    activeJobs: number;
    completedJobs: number;
    failedJobs: number;
    totalUsers: number;
    lowToner?: number;
    paperJams?: number;
    offlinePrinters?: number;
    totalPrintVolume?: number;
  };
  departmentVolume: { department: string; volume: number }[];
  printerStatus: { 
    name: string;
    value: number;
    color: string;
  }[];
  printVolume: { 
    name: string;
    prints: number;
    date?: string;
    volume?: number;
  }[];
  alertHistory: { 
    id: string;
    title: string;
    description: string;
    level: 'error' | 'warning' | 'info';
    time: string;
    month?: string;
    alerts?: number;
  }[];
}

export interface PrintVolumeData {
  date: string;
  volume: number;
}

export interface ActivityLogData {
  id: string;
  type: string;
  action: string;
  user: string;
  timestamp: string;
  description: string;
  entityName?: string;
  printer?: string;
  details?: string;
}

export interface AlertData {
  id: string;
  title: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  timestamp: string;
  printer?: string;
  user?: string;
  resolved: boolean;
}

// Mock data generator
const generateRandomVolume = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Service
class AnalyticsService {
  async getAnalyticsData(): Promise<AnalyticsData> {
    // Simulate API request
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate departments data
    const departments = ['Marketing', 'HR', 'Engineering', 'Finance', 'Sales'];
    const departmentVolume = departments.map(department => ({
      department,
      volume: generateRandomVolume(500, 5000),
    }));
    
    // Generate print volume data for the last 12 months
    const printVolume = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return {
        name: format(date, 'MMM yyyy'),
        prints: generateRandomVolume(1000, 10000),
        volume: generateRandomVolume(1000, 10000),
      };
    }).reverse();
    
    // Generate alert history data
    const alertHistory = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const id = `alert-${i}-${Math.random().toString(36).substring(2, 6)}`;
      return {
        id,
        title: `System Alert ${i+1}`,
        description: `This is a system alert for ${format(date, 'MMM yyyy')}`,
        level: ['error', 'warning', 'info'][Math.floor(Math.random() * 3)] as 'error' | 'warning' | 'info',
        time: `${Math.floor(Math.random() * 24)} hours ago`,
        month: format(date, 'MMM yyyy'),
        alerts: generateRandomVolume(5, 30),
      };
    }).reverse();

    // Generate printer status data
    const printerStatus = [
      { name: 'Online', value: 42, color: '#4CAF50' },
      { name: 'Offline', value: 6, color: '#9E9E9E' },
      { name: 'Error', value: 3, color: '#F44336' }
    ];
    
    return {
      summary: {
        totalPrinters: 48,
        activePrinters: 42,
        totalVolume: 28750,
        activeJobs: 12,
        completedJobs: 156,
        failedJobs: 8,
        totalUsers: 156,
        lowToner: 3,
        paperJams: 2,
        offlinePrinters: 6,
        totalPrintVolume: 28750,
      },
      departmentVolume,
      printerStatus,
      printVolume,
      alertHistory,
    };
  }
  
  async getPrintVolumeByTimeRange(range: 'day' | 'week' | 'month' | 'year'): Promise<PrintVolumeData[]> {
    // Simulate API request
    await new Promise(resolve => setTimeout(resolve, 600));
    
    let days = 0;
    const format_pattern = 'yyyy-MM-dd';
    
    switch (range) {
      case 'day':
        days = 1;
        break;
      case 'week':
        days = 7;
        break;
      case 'month':
        days = 30;
        break;
      case 'year':
        days = 365;
        break;
    }
    
    // Generate data for the specified range
    return Array.from({ length: days }, (_, i) => {
      const date = subDays(new Date(), days - i - 1);
      return {
        date: format(date, format_pattern),
        volume: generateRandomVolume(100, 1000),
      };
    });
  }
  
  async getPrintVolumeByDateRange(dateRange: { from: Date; to: Date | undefined }): Promise<PrintVolumeData[]> {
    // Simulate API request
    await new Promise(resolve => setTimeout(resolve, 600));
    
    if (!dateRange.from || !dateRange.to) {
      return [];
    }
    
    const { from, to } = dateRange;
    const diffTime = Math.abs(to.getTime() - from.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Generate data for the date range
    return Array.from({ length: diffDays }, (_, i) => {
      const date = new Date(from);
      date.setDate(from.getDate() + i);
      return {
        date: format(date, 'yyyy-MM-dd'),
        volume: generateRandomVolume(100, 1000),
      };
    });
  }

  async getStatistics() {
    // Simulate API request
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      totalJobs: 1287,
      completedJobs: 1245,
      failedJobs: 42,
      averageJobTime: '3m 24s',
      jobsToday: 87,
      totalPrinters: 48,
      totalUsers: 156,
      topUsers: [
        { name: 'Alice Johnson', jobs: 156 },
        { name: 'Bob Smith', jobs: 128 },
        { name: 'Carol Williams', jobs: 112 },
      ],
    };
  }

  async addAlert(alert: Omit<AlertData, 'id' | 'timestamp'>): Promise<AlertData> {
    // Simulate API request
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const id = Math.random().toString(36).substring(2, 11);
    
    return {
      ...alert,
      id,
      timestamp: new Date().toISOString(),
    };
  }

  async getActivityLogs(): Promise<ActivityLogData[]> {
    // Simulate API request
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate random activity logs
    const actions = [
      'printed document',
      'logged in',
      'changed settings',
      'requested maintenance',
      'cleared paper jam',
      'replaced toner',
    ];
    
    const users = [
      'Alice Johnson', 
      'Bob Smith', 
      'Carol Williams', 
      'David Jones', 
      'Eve Brown',
    ];
    
    const printers = [
      'HP LaserJet 4200', 
      'Canon imageRUNNER', 
      'Epson WorkForce', 
      'Brother MFC-L8900CDW',
    ];

    const types = ['printer', 'user', 'system'];
    
    return Array.from({ length: 50 }, (_, i) => {
      const daysAgo = Math.floor(Math.random() * 14);
      const hoursAgo = Math.floor(Math.random() * 24);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      date.setHours(date.getHours() - hoursAgo);
      
      const action = actions[Math.floor(Math.random() * actions.length)];
      const user = users[Math.floor(Math.random() * users.length)];
      const type = types[Math.floor(Math.random() * types.length)];
      
      // Not all actions involve printers
      const hasPrinter = ['printed document', 'requested maintenance', 'cleared paper jam', 'replaced toner'].includes(action);
      const entityName = hasPrinter ? printers[Math.floor(Math.random() * printers.length)] : undefined;
      
      const details = action === 'printed document' 
          ? `Document: ${['Report', 'Invoice', 'Memo', 'Letter', 'Presentation'][Math.floor(Math.random() *
          5)]}-${Math.floor(Math.random() * 1000)}.pdf` 
          : undefined;
      
      return {
        id: `act-${i}-${Math.random().toString(36).substring(2, 6)}`,
        type,
        action,
        user,
        entityName,
        timestamp: format(date, 'yyyy-MM-dd HH:mm:ss'),
        description: `User ${user} ${action}${entityName ? ` on ${entityName}` : ''}${details ? `: ${details}` : ''}`,
        details,
      };
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async getPrinterActivity(printerId: string): Promise<ActivityLogData[]> {
    // Simulate API request
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const activities = await this.getActivityLogs();
    return activities.filter(activity => activity.entityName?.includes('HP') || activity.entityName?.includes('Canon')).slice(0, 10);
  }

  async getAlerts(): Promise<AlertData[]> {
    // Simulate API request
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const alertTitles = [
      { severity: 'critical', title: 'Printer Offline' },
      { severity: 'critical', title: 'Paper Jam' },
      { severity: 'warning', title: 'Low Toner' },
      { severity: 'warning', title: 'Low Paper' },
      { severity: 'info', title: 'Maintenance Due' },
      { severity: 'info', title: 'Firmware Update Available' },
    ];
    
    const printers = [
      'HP LaserJet 4200', 
      'Canon imageRUNNER', 
      'Epson WorkForce', 
      'Brother MFC-L8900CDW',
    ];
    
    const users = [
      'Alice Johnson', 
      'Bob Smith', 
      'Carol Williams', 
      'David Jones',
    ];
    
    return Array.from({ length: 20 }, (_, i) => {
      const daysAgo = Math.floor(Math.random() * 14);
      const hoursAgo = Math.floor(Math.random() * 24);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      date.setHours(date.getHours() - hoursAgo);
      
      const alertType = alertTitles[Math.floor(Math.random() * alertTitles.length)];
      const printer = printers[Math.floor(Math.random() * printers.length)];
      
      // Some alerts involve users, some don't
      const hasUser = Math.random() > 0.5;
      const user = hasUser ? users[Math.floor(Math.random() * users.length)] : undefined;
      
      // Generate appropriate message based on the alert type
      let message = '';
      switch (alertType.title) {
        case 'Printer Offline':
          message = `${printer} is not responding to network requests.`;
          break;
        case 'Paper Jam':
          message = `Paper jam detected in tray 2 of ${printer}.`;
          break;
        case 'Low Toner':
          message = `${printer} is running low on black toner (15% remaining).`;
          break;
        case 'Low Paper':
          message = `${printer} tray 1 is low on paper.`;
          break;
        case 'Maintenance Due':
          message = `${printer} is due for scheduled maintenance.`;
          break;
        case 'Firmware Update Available':
          message = `New firmware version 2.1.5 available for ${printer}.`;
          break;
      }
      
      return {
        id: `alert-${i}-${Math.random().toString(36).substring(2, 6)}`,
        title: alertType.title,
        message,
        severity: alertType.severity as 'critical' | 'warning' | 'info',
        timestamp: date.toISOString(),
        printer,
        user,
        resolved: Math.random() > 0.7, // 30% chance of being resolved
      };
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
}

export const analyticsService = new AnalyticsService();
