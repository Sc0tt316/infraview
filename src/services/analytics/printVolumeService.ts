
import { apiService } from '../api';
import { toast } from '@/hooks/use-toast';
import { PrintVolumeData } from '@/types/analytics';
import { format, subDays } from 'date-fns';

export const printVolumeService = {
  getPrintVolumeData: async (options?: { timeRange?: string; from?: Date; to?: Date }): Promise<PrintVolumeData[]> => {
    try {
      // Check if we already have data
      let volumeData = await apiService.get<PrintVolumeData[]>('print-volume');
      
      if (!volumeData || volumeData.length === 0) {
        // Initialize with empty data
        volumeData = [];
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
      toast({
        title: "Error",
        description: "Failed to fetch print volume data. Please try again.",
        variant: "destructive"
      });
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
