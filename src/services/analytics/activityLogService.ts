
import { apiService } from '../api';
import { toast } from '@/hooks/use-toast';
import { ActivityLogData } from '@/types/analytics';

// Initialize activity logs with empty data
const initializeActivityLogs = async () => {
  const existingData = await apiService.get<ActivityLogData[]>('activityLogs');
  if (!existingData) {
    const emptyLogs: ActivityLogData[] = [];
    await apiService.post('activityLogs', emptyLogs);
    return emptyLogs;
  }
  return existingData;
};

// Activity logs service
export const activityLogService = {
  getActivityLogs: async (options: { limit?: number, sortBy?: string, sortOrder?: 'asc' | 'desc' } = {}): Promise<ActivityLogData[]> => {
    try {
      const { limit = 100, sortBy = 'timestamp', sortOrder = 'desc' } = options;
      const logs = await initializeActivityLogs();
      
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
      toast({
        title: "Error",
        description: "Failed to fetch activity logs. Please try again.",
        variant: "destructive"
      });
      return [];
    }
  }
};
