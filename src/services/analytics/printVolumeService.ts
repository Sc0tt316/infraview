
import { PrintVolumeData } from '@/types/analytics';

// Mock print volume data service
export const printVolumeService = {
  getPrintVolumeData: async (dateRange: string): Promise<PrintVolumeData[]> => {
    // Generate mock data based on the date range
    const data: PrintVolumeData[] = [];
    
    // Generate daily data for the last 30 days
    if (dateRange === 'month' || dateRange === '30d') {
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const formattedDate = date.toISOString().split('T')[0];
        
        data.push({
          date: formattedDate,
          volume: Math.floor(Math.random() * 10000) + 500
        });
      }
    }
    
    // Generate weekly data for the last 12 weeks
    else if (dateRange === 'quarter' || dateRange === '90d') {
      for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - (i * 7));
        const formattedDate = date.toISOString().split('T')[0];
        
        data.push({
          date: formattedDate,
          volume: Math.floor(Math.random() * 50000) + 5000
        });
      }
    }
    
    // Generate monthly data for the last 12 months
    else if (dateRange === 'year' || dateRange === '365d') {
      for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
        
        data.push({
          date: formattedDate,
          volume: Math.floor(Math.random() * 200000) + 20000
        });
      }
    }
    
    // Generate data for the last 7 days by default
    else {
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const formattedDate = date.toISOString().split('T')[0];
        
        data.push({
          date: formattedDate,
          volume: Math.floor(Math.random() * 5000) + 200
        });
      }
    }
    
    return data;
  }
};
