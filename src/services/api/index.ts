
import { baseApiService } from './base';
import { toast } from '@/hooks/use-toast';

// Enhanced API service with SNMP operations and database integration
const enhancedApiService = {
  ...baseApiService,
  
  // Add refresh method that handles notifications
  refreshData: async <T>(
    endpoint: string, 
    options: { 
      showNotification?: boolean, 
      notificationMessage?: string,
      onSuccess?: (data: T) => void
    } = {}
  ): Promise<T> => {
    const {
      showNotification = true,
      notificationMessage = 'Data refreshed successfully',
      onSuccess
    } = options;
    
    try {
      const data = await baseApiService.get<T>(endpoint);
      
      if (showNotification) {
        toast({
          title: 'Success',
          description: notificationMessage,
        });
      }
      
      if (onSuccess && data) {
        onSuccess(data);
      }
      
      return data;
    } catch (error) {
      console.error(`Error refreshing data from ${endpoint}:`, error);
      
      if (showNotification) {
        toast({
          variant: 'destructive',
          title: 'Refresh Failed',
          description: 'Could not refresh data. Please try again.',
        });
      }
      
      throw error;
    }
  }
};

export const apiService = enhancedApiService;
