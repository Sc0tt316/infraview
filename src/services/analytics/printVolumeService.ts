
import { apiService } from '../api';
import { toast } from 'sonner';
import { PrintVolumeData } from '@/types/analytics';

// Initialize print volume data
const initializePrintVolumeData = async () => {
  const existingData = await apiService.get<Record<string, PrintVolumeData[]>>('printVolume');
  if (!existingData) {
    const today = new Date();
    
    const dailyData: PrintVolumeData[] = Array.from({ length: 24 }, (_, i) => {
      const hour = String(i).padStart(2, '0');
      return {
        date: `${hour}:00`,
        count: Math.floor(Math.random() * 50) + 10,
        volume: Math.floor(Math.random() * 500) + 100
      };
    });
    
    const weeklyData: PrintVolumeData[] = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(today.getDate() - (6 - i));
      return {
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        count: Math.floor(Math.random() * 200) + 50,
        volume: Math.floor(Math.random() * 2000) + 500
      };
    });
    
    const monthlyData: PrintVolumeData[] = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(today.getDate() - (29 - i));
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count: Math.floor(Math.random() * 150) + 30,
        volume: Math.floor(Math.random() * 1500) + 300
      };
    });
    
    const yearlyData: PrintVolumeData[] = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(i);
      return {
        date: date.toLocaleDateString('en-US', { month: 'short' }),
        count: Math.floor(Math.random() * 3000) + 1000,
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

// Print volume service
export const printVolumeService = {
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
  
  getPrintVolumeByDateRange: async ({ from, to }: { from: Date; to: Date }): Promise<PrintVolumeData[]> => {
    try {
      const daysDiff = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
      const customData: PrintVolumeData[] = [];
      
      for (let i = 0; i <= daysDiff; i++) {
        const date = new Date(from);
        date.setDate(from.getDate() + i);
        
        customData.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          count: Math.floor(Math.random() * 150) + 30,
          volume: Math.floor(Math.random() * 1500) + 300
        });
      }
      
      return customData;
    } catch (error) {
      console.error('Error generating custom date range data:', error);
      toast.error("Failed to generate custom date range data.");
      return [];
    }
  }
};
