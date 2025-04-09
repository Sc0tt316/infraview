
import { apiService } from '../api';
import { toast } from 'sonner';
import { AnalyticsData, DepartmentVolume } from '@/types/analytics';

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
        totalUsers: 132,
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
      },
      printerStatus: {
        online: 29,
        offline: 2,
        error: 1,
        warning: 2,
        maintenance: 0
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

// Analytics data service
export const analyticsDataService = {
  getAnalyticsData: async (): Promise<AnalyticsData> => {
    try {
      return await initializeAnalyticsData();
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast.error("Failed to fetch analytics data. Please try again.");
      throw error;
    }
  }
};
