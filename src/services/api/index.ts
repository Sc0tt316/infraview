
import { baseApiService } from './base';
import { toast } from '@/hooks/use-toast';

// Enhanced API service with notification handling and animation support
const enhancedApiService = {
  ...baseApiService,
  
  // Add refresh method that handles animations and notifications
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
      // Fetch the data
      const data = await baseApiService.get<T>(endpoint);
      
      // Show success notification if requested
      if (showNotification) {
        toast({
          title: 'Success',
          description: notificationMessage,
        });
      }
      
      // Call success callback if provided
      if (onSuccess && data) {
        onSuccess(data);
      }
      
      return data;
    } catch (error) {
      console.error(`Error refreshing data from ${endpoint}:`, error);
      
      // Show error notification
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

// Re-export the enhanced service
export const apiService = enhancedApiService;
