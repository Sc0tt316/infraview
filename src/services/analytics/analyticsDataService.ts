
import { apiService } from '../api';
import { toast } from '@/hooks/use-toast';
import { AnalyticsData } from '@/types/analytics';

// Initialize with empty data if none exists
const initializeAnalyticsData = async () => {
  const existingData = await apiService.get<AnalyticsData>('analytics');
  if (!existingData) {
    const emptyData: AnalyticsData = {
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
    await apiService.post('analytics', emptyData);
    return emptyData;
  }
  return existingData;
};

// Analytics data service
export const analyticsDataService = {
  getAnalyticsData: async (): Promise<AnalyticsData> => {
    try {
      return await initializeAnalyticsData();
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch analytics data. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  }
};
