
import { apiService } from '../api';
import { ActivityLogData } from '@/types/analytics';
import { toast } from 'sonner';

// Initialize with mock data if none exists
const initializeActivityLogs = async () => {
  const existingLogs = await apiService.get<ActivityLogData[]>('activityLogs');
  if (!existingLogs || existingLogs.length === 0) {
    const mockLogs: ActivityLogData[] = [
      {
        id: 'log1',
        timestamp: new Date().toISOString(),
        action: 'User Login',
        message: 'User logged into the system',
        entityType: 'auth',
        user: 'John Doe',
        type: 'success'
      },
      {
        id: 'log2',
        timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
        action: 'Print Job',
        message: 'Print job completed successfully',
        entityType: 'printer',
        entityId: 'PR001',
        user: 'Sarah Miller',
        type: 'success'
      },
      {
        id: 'log3',
        timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
        action: 'Configuration',
        message: 'Changed printer settings',
        entityType: 'printer',
        entityId: 'PR002',
        user: 'Mike Chen',
        type: 'info'
      },
      {
        id: 'log4',
        timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
        action: 'Print Error',
        message: 'Print job failed',
        entityType: 'printer',
        entityId: 'PR003',
        user: 'Emily Rodriguez',
        type: 'error'
      },
      {
        id: 'log5',
        timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
        action: 'User Logout',
        message: 'User logged out of the system',
        entityType: 'auth',
        user: 'John Doe',
        type: 'info'
      },
      {
        id: 'log6',
        timestamp: new Date(Date.now() - 180 * 60000).toISOString(),
        action: 'System Warning',
        message: 'Low toner detected',
        entityType: 'printer',
        entityId: 'PR001',
        type: 'warning'
      },
      {
        id: 'log7',
        timestamp: new Date(Date.now() - 240 * 60000).toISOString(),
        action: 'Print Job',
        message: 'Print job queued',
        entityType: 'printer',
        entityId: 'PR005',
        user: 'Alice Johnson',
        type: 'info'
      },
      {
        id: 'log8',
        timestamp: new Date(Date.now() - 300 * 60000).toISOString(),
        action: 'User Login',
        message: 'User logged into the system',
        entityType: 'auth',
        user: 'Bob Smith',
        type: 'success'
      },
      {
        id: 'log9',
        timestamp: new Date(Date.now() - 360 * 60000).toISOString(),
        action: 'Configuration',
        message: 'System settings updated',
        entityType: 'system',
        user: 'Admin User',
        type: 'success'
      },
      {
        id: 'log10',
        timestamp: new Date(Date.now() - 420 * 60000).toISOString(),
        action: 'Print Job',
        message: 'Large print job completed',
        entityType: 'printer',
        entityId: 'PR002',
        user: 'Charlie Wilson',
        type: 'success'
      }
    ];
    
    // Generate more logs for a fuller activity view
    for (let i = 0; i < 20; i++) {
      const randomHours = Math.floor(Math.random() * 48) + 8;
      const types = ['success', 'error', 'warning', 'info'] as const;
      const randomType = types[Math.floor(Math.random() * types.length)];
      const users = ['John Doe', 'Sarah Miller', 'Mike Chen', 'Emily Rodriguez', 'Alice Johnson', 'Bob Smith', 'Charlie Wilson', 'Admin User'];
      const randomUser = users[Math.floor(Math.random() * users.length)];
      
      mockLogs.push({
        id: `log-extra-${i}`,
        timestamp: new Date(Date.now() - randomHours * 60 * 60000).toISOString(),
        action: randomType === 'error' ? 'Error' : randomType === 'warning' ? 'Warning' : 'Activity',
        message: randomType === 'error' ? 'An error occurred' : 
                randomType === 'warning' ? 'Warning condition detected' : 
                'Regular system activity',
        entityType: 'system',
        user: randomUser,
        type: randomType
      });
    }
    
    await apiService.post('activityLogs', mockLogs);
    return mockLogs;
  }
  return existingLogs;
};

// Activity log service functions
export const activityLogService = {
  getActivityLogs: async (
    params?: { 
      limit?: number;
      sortBy?: string; 
      sortOrder?: 'asc' | 'desc';
    }
  ): Promise<ActivityLogData[]> => {
    try {
      const logs = await initializeActivityLogs();
      
      // Apply sorting
      let sortedLogs = [...logs];
      if (params?.sortBy) {
        sortedLogs.sort((a: any, b: any) => {
          // Default to timestamp sorting if field doesn't exist
          const aValue = a[params.sortBy!] || a.timestamp;
          const bValue = b[params.sortBy!] || b.timestamp;
          
          if (params.sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        });
      }
      
      // Apply limit
      if (params?.limit && params.limit > 0) {
        sortedLogs = sortedLogs.slice(0, params.limit);
      }
      
      return sortedLogs;
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      toast.error("Failed to fetch activity logs");
      return [];
    }
  }
};
