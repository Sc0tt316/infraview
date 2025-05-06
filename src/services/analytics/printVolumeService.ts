
import { apiService } from '../api';
import { toast } from 'sonner';
import { PrintVolumeData } from '@/types/analytics';
import { format, subDays, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval } from 'date-fns';

// Generate realistic looking print volume data
const generatePrintVolumeData = (days: number): PrintVolumeData[] => {
  const data: PrintVolumeData[] = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = subDays(now, i);
    const dayOfWeek = date.getDay();
    
    // Lower volume on weekends
    const baseVolume = dayOfWeek === 0 || dayOfWeek === 6 ? 
      Math.floor(Math.random() * 200) + 50 :  // Weekend (50-250)
      Math.floor(Math.random() * 800) + 300;  // Weekday (300-1100)
    
    data.push({
      date: format(date, 'yyyy-MM-dd'),
      volume: baseVolume
    });
  }
  return data;
};

export const printVolumeService = {
  getPrintVolumeData: async (options?: { timeRange?: string; from?: Date; to?: Date }): Promise<PrintVolumeData[]> => {
    try {
      // Check if we already have data
      let volumeData = await apiService.get<PrintVolumeData[]>('print-volume');
      
      if (!volumeData || volumeData.length === 0) {
        // Generate 60 days of data for initial setup
        volumeData = generatePrintVolumeData(60);
        await apiService.post('print-volume', volumeData);
      }
      
      // Handle filtering by time range or dates
      if (options) {
        const { timeRange, from, to } = options;
        
        if (from && to) {
          // Filter by date range
          return volumeData.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate >= from && itemDate <= to;
          });
        }
        
        if (timeRange) {
          const now = new Date();
          const days = timeRange === 'day' ? 1 : 
                      timeRange === 'week' ? 7 : 
                      timeRange === 'month' ? 30 : 365;
          
          return volumeData.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate >= subDays(now, days);
          });
        }
      }
      
      return volumeData;
    } catch (error) {
      console.error('Error fetching print volume data:', error);
      toast.error("Failed to fetch print volume data. Please try again.");
      throw error;
    }
  },
  
  // Update the implementation to handle 'custom' case
  getPrintVolumeByDateRange: async ({ from, to }: { from: Date; to: Date }): Promise<PrintVolumeData[]> => {
    return printVolumeService.getPrintVolumeData({ from, to });
  },
  
  getPrintVolumeByTimeRange: async (timeRange: 'day' | 'week' | 'month' | 'year' | 'custom'): Promise<PrintVolumeData[]> => {
    // For 'custom' timeRange, return all data and let the caller filter it
    if (timeRange === 'custom') {
      return printVolumeService.getPrintVolumeData();
    }
    
    return printVolumeService.getPrintVolumeData({ timeRange });
  }
};
